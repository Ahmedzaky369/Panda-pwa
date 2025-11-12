// Service Worker for Panda Task PWA
const CACHE_NAME = 'panda-task-v1';
const STATIC_CACHE = 'panda-static-v1';

// Assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://ahmedzaky369.github.io/pt12c/assets/index-BH11ZMbH.js',
  'https://ahmedzaky369.github.io/pt12c/assets/react-vendor-DtX1tuCI.js',
  'https://ahmedzaky369.github.io/pt12c/assets/framer-motion-DaBn-BHP.js',
  'https://ahmedzaky369.github.io/pt12c/assets/lucide-C8STxHrL.js',
  'https://ahmedzaky369.github.io/pt12c/assets/index-BeSvUlRh.css'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.log('Cache failed:', err))
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== STATIC_CACHE)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.match(event.request)
          .then(cachedResponse => {
            const fetchPromise = fetch(event.request)
              .then(networkResponse => {
                if (networkResponse.ok) {
                  cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
              })
              .catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
          });
      })
      .catch(() => fetch(event.request))
  );
});