const CACHE_NAME = 'mirror_fake_cache_v1';
const urlsToCache = [
  './',
  './index.html',
  './script.js',
  './exif-stripper.js',
  './exif-js.min.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

