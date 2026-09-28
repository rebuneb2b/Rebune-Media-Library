# Direct video download update

- Keeps the existing Google Drive service-account connection unchanged.
- `/api/file?download=1` now responds with `Content-Disposition: attachment`.
- Google Drive videos download directly through the server stream instead of being converted to a browser Blob first.
- This is intended to make iPhone/Safari video downloads simpler and reduce memory use for large files.
- Video buttons now say **تحميل الفيديو** for clarity.
- Existing preview, Range requests, 3D, image, PDF, cache, and Drive metadata behavior remain intact.
