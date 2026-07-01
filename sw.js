const CACHE_NAME = 'rapid-spanish-v1';
const ASSETS_TO_CACHE = [
  './',
  './index-app.html',
  './index-app1.html',
  './indexapp.html',
  './style.css',
  './sentences.js',
  './defaults.json',
  './T34.js',
  './BattleOfStalingrad.js',
  './SinkingOfLucitania.js',
  './MexicoCityStreetFood.js',
  './BlackHole.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico',
  './apple-touch-icon.png'
];

// 1. Install Event: Force download files directly into local device storage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up old code when you update your app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Load from local cache first, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests (like Stripe API data submissions)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // File found locally! Loads instantly.
      }
      return fetch(event.request); // Not cached, query the live server.
    })
  );
});

