import type { MediaFile } from "../data/media";

/** Suggests a safe download filename from a media entry. */
export function fileNameFor(file: MediaFile): string {
  const ext = file.extension?.replace(/^\./, "").toLowerCase();
  if (ext && !file.fileName.toLowerCase().endsWith(`.${ext}`)) {
    return `${file.fileName}.${ext}`;
  }
  return file.fileName || `${file.productCode}.${ext || "bin"}`;
}

function withDownloadFlag(url: string): string {
  const parsed = new URL(url, window.location.origin);
  parsed.searchParams.set("download", "1");
  return parsed.origin === window.location.origin
    ? `${parsed.pathname}${parsed.search}${parsed.hash}`
    : parsed.toString();
}

function triggerDirectDownload(url: string, filename?: string): void {
  const a = document.createElement("a");
  a.href = url;
  if (filename) a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Downloads a file with the lightest path possible.
 *
 * Google Drive files proxied through /api/file are NOT converted to a Blob in
 * the browser. Instead we request ?download=1 and the server replies with
 * Content-Disposition: attachment. This is much friendlier to iPhone/Safari
 * and large videos because the browser can stream the file directly.
 */
export async function downloadFile(url: string, filename: string): Promise<"saved" | "opened"> {
  const parsed = new URL(url, window.location.origin);
  const isDriveProxy = parsed.origin === window.location.origin && parsed.pathname === "/api/file";

  if (isDriveProxy) {
    triggerDirectDownload(withDownloadFlag(url), filename);
    return "saved";
  }

  // Direct Google Drive links are allowed to handle their own download flow.
  if (/drive\.google\.com/.test(parsed.hostname)) {
    window.open(url, "_blank", "noopener");
    return "opened";
  }

  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDirectDownload(objectUrl, filename);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    return "saved";
  } catch {
    window.open(url, "_blank", "noopener");
    return "opened";
  }
}

export async function downloadMedia(file: MediaFile): Promise<"saved" | "opened"> {
  return downloadFile(file.downloadUrl, fileNameFor(file));
}

/** Sequentially downloads a batch (used by "تحميل الكل"). */
export async function downloadAll(
  files: MediaFile[],
  onProgress?: (done: number, total: number, current: MediaFile) => void,
): Promise<void> {
  for (let i = 0; i < files.length; i++) {
    onProgress?.(i, files.length, files[i]);
    await downloadMedia(files[i]);
    // small pause so mobile browsers don't swallow consecutive downloads
    await new Promise((r) => window.setTimeout(r, 900));
  }
  onProgress?.(files.length, files.length, files[files.length - 1]);
}
