const CACHE = 'rebune-offline-v1';
const OFFLINE = '/offline.html';
const FILES = [OFFLINE, '/pwa/icon-192.png', '/pwa/icon-512.png', '/pwa/icon-maskable.png', '/pwa/apple-touch-icon.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('rebune-offline-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
 const request = event.request;
 const url = new URL(request.url);
 if (request.method !== 'GET' || url.origin !== self.location.origin) return;
 // Never cache API responses, downloads, video ranges or product models.
 if (url.pathname.startsWith('/api/') || request.headers.has('range')) return;
 if (request.mode === 'navigate') {
  event.respondWith(fetch(request).catch(() => caches.match(OFFLINE)));
 } else if (FILES.includes(url.pathname) && !url.search) {
  event.respondWith(caches.match(request).then(hit => hit || fetch(request)));
 }
});
