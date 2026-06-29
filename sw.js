const CACHE_VERSION = 'mma-spirit-v4';
const CACHE_NAME = `mma-spirit-cache-${CACHE_VERSION}`;

const ASSETS = [
  '/',
  '/index.html',
  '/main.html',
  '/organizations.html',
  '/weight-classes.html',
  '/rules.html',
  '/techniques.html',
  '/rankings.html',
  '/fighters.html',
  '/404.html',
  '/css/style.css',
  '/js/main.js',
  '/js/fighters.js',
  '/data/fighters.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => (key === CACHE_NAME ? null : caches.delete(key))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(event.request);
      if (response && response.ok) cache.put(event.request, response.clone());
      return response;
    } catch {
      if (event.request.mode === 'navigate') {
        return (await cache.match('/index.html')) || Response.error();
      }
      return Response.error();
    }
  })());
});
