// Service Worker for ForgeFit Tracker PWA
const CACHE_NAME = 'forgefit-v1';
const RUNTIME_CACHE = 'forgefit-runtime-v1';
const ASSET_CACHE = 'forgefit-assets-v1';

// Critical assets to cache on install (app shell)
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/app.html',
  '/app.js',
  '/firebase-config.js',
  '/styles.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event: Cache critical assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching critical assets');
      return cache.addAll(CRITICAL_ASSETS).catch(err => {
        console.warn('[Service Worker] Some assets failed to cache:', err);
        // Don't fail the install if external CDNs fail
        return cache.addAll(CRITICAL_ASSETS.filter(url => !url.includes('http')));
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== ASSET_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Smart caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin Firebase requests
  if (request.method !== 'GET') {
    return;
  }

  // Firebase Realtime Database: Network-first strategy
  if (url.hostname.includes('firebase') || url.hostname.includes('firebaseio')) {
    return event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const cache = caches.open(RUNTIME_CACHE);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request).then(cached => cached || createOfflineResponse());
        })
    );
  }

  // Google Fonts & External CSS: Cache-first strategy
  if (url.hostname.includes('fonts.googleapis') || url.hostname.includes('fonts.gstatic')) {
    return event.respondWith(
      caches.match(request).then(cached => {
        return cached || fetch(request).then(response => {
          return caches.open(ASSET_CACHE).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
  }

  // CDN assets (Tailwind, Chart.js): Cache-first strategy
  if (url.hostname.includes('cdn')) {
    return event.respondWith(
      caches.match(request).then(cached => {
        return cached || fetch(request).then(response => {
          if (response.ok) {
            return caches.open(ASSET_CACHE).then(cache => {
              cache.put(request, response.clone());
              return response;
            });
          }
          return response;
        }).catch(() => caches.match(request));
      })
    );
  }

  // Local assets (CSS, JS, images): Cache-first with network fallback
  if (url.origin === self.location.origin) {
    return event.respondWith(
      caches.match(request).then(cached => {
        return cached || fetch(request).then(response => {
          // Cache successful responses
          if (response.ok && (
            request.destination === 'style' ||
            request.destination === 'script' ||
            request.destination === 'image'
          )) {
            return caches.open(ASSET_CACHE).then(cache => {
              cache.put(request, response.clone());
              return response;
            });
          }
          return response;
        }).catch(() => {
          // Return cached version or offline page
          if (request.destination === 'document') {
            return caches.match('/app.html');
          }
          return caches.match(request);
        });
      })
    );
  }

  // External images (Unsplash): Cache-first strategy
  if (request.destination === 'image') {
    return event.respondWith(
      caches.match(request).then(cached => {
        return cached || fetch(request).then(response => {
          if (response.ok) {
            return caches.open(ASSET_CACHE).then(cache => {
              cache.put(request, response.clone());
              return response;
            });
          }
          return response;
        }).catch(() => {
          // Return a placeholder or cached version
          return caches.match(request);
        });
      })
    );
  }

  // Default: Network-first
  event.respondWith(
    fetch(request)
      .then(response => response)
      .catch(() => caches.match(request))
  );
});

// Helper function for offline response
function createOfflineResponse() {
  return new Response(
    JSON.stringify({ error: 'Offline - data cannot be loaded' }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }
  );
}
