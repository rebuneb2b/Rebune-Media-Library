/**
 * /api/media — Vercel Serverless Function
 *
 * Google Drive structure:
 *
 * rebune-media-library
 * ├── تجميلي
 * │   ├── فيديوهات
 * │   ├── تصاميم
 * │   └── 3D
 * └── منزلي
 *     ├── فيديوهات
 *     ├── تصاميم
 *     └── 3D
 *
 * Any file whose name starts with RE is accepted.
 *
 * Known product code examples:
 * RE-2211.jpg             -> RE-2211
 * RE-2211-1.jpg           -> RE-2211
 * RE-2211-video-01.mp4    -> RE-2211
 * RE-2223-4-5.jpg         -> RE-2223
 *
 * RE-1-102.jpg            -> RE-1-102
 * RE-2-182 أسود.MOV       -> RE-2-182
 * RE-10-041.jpg           -> RE-10-041
 * RE-16-004-copy.jpg      -> RE-16-004
 *
 * RE0003-BLUE.jpg         -> RE-0003
 *
 * Fallback examples:
 * RE-new-design.jpg       -> RE-new-design
 * RE_test.jpg             -> RE_test
 * RE أي اسم.jpg           -> RE أي اسم
 */

import { google } from "googleapis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FOLDER_MIME = "application/vnd.google-apps.folder";

const FIELDS =
  "nextPageToken, files(id, name, mimeType, size, modifiedTime, parents, thumbnailLink, webViewLink, webContentLink)";

const CATEGORY_MAP: Record<string, string> = {
  "تجميلي": "تجميلي",
  "تجميل": "تجميلي",
  beauty: "تجميلي",

  "منزلي": "منزلي",
  home: "منزلي",
};

const VIDEO_FOLDER_NAMES = new Set([
  "فيديوهات",
  "فيديو",
  "videos",
  "video",
]);

const DESIGN_FOLDER_NAMES = new Set([
  "تصاميم",
  "تصميم",
  "designs",
  "design",
]);

const MODEL_FOLDER_NAMES = new Set([
  "3d",
  "نماذج ثلاثية الأبعاد",
  "ثلاثي الأبعاد",
  "models",
  "model",
]);

type MediaSection = "فيديوهات" | "تصاميم" | "3D";

interface CategoryFolder {
  id: string;
  category: string;
}

interface MediaFolder {
  id: string;
  category: string;
  mediaSection: MediaSection;
}

function categoryOf(name: string): string {
  const value = name.trim();

  return (
    CATEGORY_MAP[value] ??
    CATEGORY_MAP[value.toLowerCase()] ??
    value
  );
}

function sectionOf(name: string): MediaSection | null {
  const value = name.trim();
  const lower = value.toLowerCase();

  if (
    VIDEO_FOLDER_NAMES.has(value) ||
    VIDEO_FOLDER_NAMES.has(lower)
  ) {
    return "فيديوهات";
  }

  if (
    DESIGN_FOLDER_NAMES.has(value) ||
    DESIGN_FOLDER_NAMES.has(lower)
  ) {
    return "تصاميم";
  }

  if (
    MODEL_FOLDER_NAMES.has(value) ||
    MODEL_FOLDER_NAMES.has(lower)
  ) {
    return "3D";
  }

  return null;
}

/**
 * Extract and normalize Rebune product codes.
 *
 * Rules:
 * 1. The file must start with RE.
 * 2. Known Rebune code formats are normalized.
 * 3. If the name starts with RE but doesn't match a known format,
 *    the filename without its extension is used as the product code.
 */
function extractProductCode(fileName: string): string {
  const originalName = fileName.trim();

  // Remove the final file extension only.
  const baseName = originalName.replace(/\.[^/.]+$/, "").trim();

  // Reject files that do not begin with RE.
  if (!/^RE/i.test(baseName)) {
    return "";
  }

  const name = baseName.toUpperCase();

  /*
   * Family style:
   * RE-1-102
   * RE-2-182
   * RE-10-041
   * RE-16-004
   */
  const familyMatch = name.match(
    /^RE[-_]?(\d{1,2})[-_](\d{3})(?=[^0-9]|$)/
  );

  if (familyMatch) {
    return `RE-${familyMatch[1]}-${familyMatch[2]}`;
  }

  /*
   * Standard four-digit style:
   * RE-2211
   * RE2211
   * RE-2211-1
   * RE-2223-4-5
   * RE0003
   */
  const standardMatch = name.match(
    /^RE[-_]?(\d{4})(?=[^0-9]|$)/
  );

  if (standardMatch) {
    return `RE-${standardMatch[1]}`;
  }

  /*
   * Short style:
   * RE-16
   * RE16
   */
  const shortMatch = name.match(
    /^RE[-_]?(\d{1,3})(?=[^0-9]|$)/
  );

  if (shortMatch) {
    return `RE-${shortMatch[1]}`;
  }

  /*
   * Fallback:
   * Accept any file beginning with RE.
   *
   * Examples:
   * RE-new-design.jpg -> RE-new-design
   * RE_test.png       -> RE_test
   * RE جديد.jpg       -> RE جديد
   */
  return baseName;
}

function formatSize(bytes?: string | null): string {
  const b = Number(bytes ?? 0);

  if (!Number.isFinite(b) || b <= 0) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${Math.round(b / 1024)} KB`;

  if (b < 1024 ** 3) {
    return `${(b / 1024 ** 2).toFixed(1)} MB`;
  }

  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

function esc(id: string): string {
  return id
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return res.status(405).json({
      source: "error",
      error: "method_not_allowed",
    });
  }

  const email =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  const rawKey =
    process.env.GOOGLE_PRIVATE_KEY;

  // Default REBUNE Media Library root folder.
  // Can still be overridden from Vercel with GOOGLE_DRIVE_FOLDER_ID.
  const rootId =
    process.env.GOOGLE_DRIVE_FOLDER_ID ||
    "1OIcCC1Y1wc0YFrr1INESs9Dgb7Mhag_u";

  if (!email || !rawKey) {
    return res.status(500).json({
      source: "error",
      error: "missing_credentials",
    });
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: rawKey.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });

    const drive = google.drive({
      version: "v3",
      auth,
    });

    /*
     * STEP 1:
     * rebune-media-library
     * ├── تجميلي
     * └── منزلي
     */
    const categoryFolders: CategoryFolder[] = [];

    let categoryPageToken: string | undefined;

    do {
      const page: any = await drive.files.list({
        q: `'${esc(
          rootId
        )}' in parents and trashed = false and mimeType = '${FOLDER_MIME}'`,

        fields: FIELDS,
        pageSize: 1000,
        pageToken: categoryPageToken,

        supportsAllDrives: true,
        includeItemsFromAllDrives: true,

        orderBy: "name",
      });

      for (const folder of page.data.files ?? []) {
        if (!folder.id || !folder.name) continue;

        categoryFolders.push({
          id: folder.id,
          category: categoryOf(folder.name),
        });
      }

      categoryPageToken =
        page.data.nextPageToken ?? undefined;
    } while (categoryPageToken);

    /*
     * STEP 2:
     * Find media folders in parallel. The root normally has only a couple
     * of category folders, so parallel reads noticeably reduce cold starts.
     */
    const mediaFolderGroups = await Promise.all(
      categoryFolders.map(async (categoryFolder) => {
        const found: MediaFolder[] = [];
        let pageToken: string | undefined;

        do {
          const page: any = await drive.files.list({
            q: `'${esc(
              categoryFolder.id
            )}' in parents and trashed = false and mimeType = '${FOLDER_MIME}'`,
            fields: FIELDS,
            pageSize: 1000,
            pageToken,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            orderBy: "name",
          });

          for (const folder of page.data.files ?? []) {
            if (!folder.id || !folder.name) continue;
            const mediaSection = sectionOf(folder.name);
            if (!mediaSection) continue;

            found.push({
              id: folder.id,
              category: categoryFolder.category,
              mediaSection,
            });
          }

          pageToken = page.data.nextPageToken ?? undefined;
        } while (pageToken);

        return found;
      })
    );

    const mediaFolders = mediaFolderGroups.flat();

    /*
     * STEP 3:
     * Read each media folder in parallel. This turns the normal six-folder
     * Drive scan from a serial waterfall into a small parallel batch.
     */
    const fileGroups = await Promise.all(
      mediaFolders.map(async (mediaFolder) => {
        const folderFiles: Record<string, unknown>[] = [];
        let pageToken: string | undefined;

        do {
          const page: any = await drive.files.list({
            q: `'${esc(
              mediaFolder.id
            )}' in parents and trashed = false and mimeType != '${FOLDER_MIME}'`,
            fields: FIELDS,
            pageSize: 1000,
            pageToken,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            orderBy: "name",
          });

          for (const file of page.data.files ?? []) {
            if (!file.id || !file.name) continue;

            const productCode = extractProductCode(file.name);
            if (!productCode) continue;

            const extension = file.name.includes(".")
              ? (file.name.split(".").pop() ?? "").toLowerCase()
              : "";

            let fileType: "video" | "design" | "3d";

            if (mediaFolder.mediaSection === "3D") {
              if (extension !== "glb" && extension !== "gltf") continue;
              fileType = "3d";
            } else if (mediaFolder.mediaSection === "فيديوهات") {
              fileType = "video";
            } else {
              fileType = "design";
            }

            const thumbnailUrl =
              `https://drive.google.com/thumbnail?id=${file.id}&sz=w480`;
            const version = encodeURIComponent(file.modifiedTime ?? "");
            const previewUrl = `/api/file?id=${file.id}&v=${version}`;
            const downloadUrl = previewUrl;
            const modelUrl = fileType === "3d" ? previewUrl : undefined;

            folderFiles.push({
              id: file.id,
              name: file.name,
              extension,
              mimeType: file.mimeType ?? "",
              size: formatSize(file.size),
              modifiedTime: file.modifiedTime ?? "",
              productCode,
              category: mediaFolder.category || "عام",
              mediaSection: mediaFolder.mediaSection,
              fileType,
              folderName: mediaFolder.mediaSection,
              thumbnailUrl,
              previewUrl,
              downloadUrl,
              modelUrl,
            });
          }

          pageToken = page.data.nextPageToken ?? undefined;
        } while (pageToken);

        return folderFiles;
      })
    );

    const files = fileGroups.flat();

    const forceRefresh = typeof req.query.refresh === "string";
    res.setHeader(
      "Cache-Control",
      forceRefresh
        ? "no-store"
        : "public, s-maxage=600, stale-while-revalidate=3600"
    );

    return res.status(200).json({
      source: "drive",
      updatedAt: new Date().toISOString(),
      files,
    });
  } catch (err) {
    console.error("[/api/media]", err);

    return res.status(500).json({
      source: "error",
      error: "drive_fetch_failed",
    });
  }
}
