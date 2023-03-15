self.addEventListener('install', (e) => {
  console.log('install done');
});

self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(fetch(e.request));
});
