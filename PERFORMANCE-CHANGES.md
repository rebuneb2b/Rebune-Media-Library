# Performance improvements

This version keeps the existing Rebune Media Library design and focuses on perceived and network performance.

## Changes
- The Google `<model-viewer>` library is no longer downloaded on every page load. It loads only when a 3D/GLB/GLTF preview is opened.
- Product details and the preview modal are code-split with React.lazy so the main page ships less JavaScript initially.
- Recent Google Drive media metadata is restored from a 10-minute local cache on repeat visits, then refreshed silently from the network.
- Drive thumbnail requests were reduced from 1000px to 600px for lighter gallery cards.
- Lazy-loaded gallery/product images now use asynchronous image decoding where applicable.
- Google Font weights were reduced to the weights actually used by the interface.

## Deploy
Run the normal project install/build process so Vite regenerates `dist` from the updated source before production deployment.
