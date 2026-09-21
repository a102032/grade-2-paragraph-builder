/* Service worker for the Paragraph Builder lesson.
 *
 * The app has to work on classroom wifi, so everything it needs is
 * pre-cached on install and the Google font is picked up at runtime the
 * first time the page is opened online.
 */
const CACHE_NAME = 'paragraph-app-v1';
const RUNTIME_CACHE = 'paragraph-runtime-v1';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  // Page loads: try the network so a republished lesson shows up, but fall
  // straight back to the cached copy when there is no connection.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }

  // Fonts and anything else off-origin: serve the cached copy immediately and
  // refresh it in the background.
  if (new URL(request.url).origin !== self.location.origin) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(cache =>
        cache.match(request).then(hit => {
          const network = fetch(request)
            .then(response => {
              if (response && (response.ok || response.type === 'opaque')) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => hit);
          return hit || network;
        })
      )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
