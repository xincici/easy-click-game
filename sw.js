const cacheName = 'easy-click-game-1681358213687';
const cacheFileList = [
  '/index.html',
  '/favicon.ico',
  '/a2hs/fox.png',
  '/a2hs/manifest.webmanifest',
];

self.addEventListener('install', function(e) {
  console.log('[Service Worker] install');
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching files');
      return cache.addAll(cacheFileList);
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetched resource ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if(cacheName.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
