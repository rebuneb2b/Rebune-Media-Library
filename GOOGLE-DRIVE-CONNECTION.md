# Google Drive connection

This build is linked to the REBUNE Media Library root folder:

- Root folder ID: `1OIcCC1Y1wc0YFrr1INESs9Dgb7Mhag_u`
- Structure detected:
  - `منزلي/فيديوهات`
  - `منزلي/تصاميم`
  - `منزلي/3D`
  - `تجميلي/فيديوهات`
  - `تجميلي/تصاميم`
  - `تجميلي/3D`

The Vercel project still requires these secure environment variables:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

`GOOGLE_DRIVE_FOLDER_ID` is now optional because this build defaults to the folder above. Set it only if you want to point the site to a different Drive root later.

The Google service account must have at least Viewer access to the root folder.
