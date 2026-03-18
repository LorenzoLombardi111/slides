var CACHE_NAME = 'freeslides-v2';
var URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/og-image.svg',
  '/favicon.svg',
  '/vs-google-slides.html',
  '/vs-canva.html',
  '/vs-powerpoint.html',
  '/free-presentation-maker-no-signup.html',
  '/free-presentation-maker-for-students.html'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(networkResponse) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
