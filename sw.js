// Always serve ChessLab's newest files: ask the server first (cheap when unchanged), fall back to the saved copy offline.
// GitHub Pages tells browsers to reuse files for 10 minutes, which otherwise hides fresh updates.
const CACHE = 'chesslab-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(req, { cache: 'no-cache' }); // revalidates with the server
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    } catch {
      const hit = await caches.match(req);
      return hit || Response.error();
    }
  })());
});
