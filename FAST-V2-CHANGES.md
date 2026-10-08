# REBUNE Media Library - FAST v2

Performance changes in this package:

1. `/api/media` now caches normal responses at the Vercel edge for 10 minutes and serves stale data while revalidating for up to 1 hour.
2. Manual Refresh bypasses the API cache with a cache-busting query and `no-store`.
3. Google Drive media folders are scanned in parallel instead of serially, reducing cold API latency.
4. Grid rendering is progressive: only 24 products/files are rendered initially, with a "عرض المزيد" button for the next 24.
5. Google Drive thumbnail width reduced from 600px to 480px to reduce image transfer while preserving card quality.
6. Added preconnect / DNS prefetch for `drive.google.com`.
7. Existing lazy image loading, lazy PreviewModal/ProductView loading, video metadata preloading, immutable media cache, and on-demand 3D loading are preserved.

Deployment notes:
- Keep the same Vercel environment variables.
- No Google Cloud changes are required.
- Deploy this version over the current project.
