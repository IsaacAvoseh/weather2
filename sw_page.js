const cacheName = "v1";

const cacheAssets = [
  "css/styles.css",
  "css/styles.scss",
  "css/styles.css.map",
  "app.js",
  "main.js",
  "index.html",
  "logo.png",
];

const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  "css/styles.css",
  "css/styles.scss",
  "css/styles.css.map",
  "app.js",
  "main.js",
  "index.html",
  "logo.png",
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});

// call install event
self.addEventListener("install", (e) => {
  console.log(`Service Worker: installed`);

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Service Worker: Caching Files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// call install event
self.addEventListener("activate", (e) => {
  console.log(`Service Worker: Activated`);

  // remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// call fetch event, this is where the offline func happens
self.addEventListener("fetch", (e) => {
  console.log(`Service Worker: Fetching `);

  // check if the cache storage is not empty or there is a request
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});


// service worker notification event


self.addEventListener('notificationclick', (event) => {
  let notification = event.notification;
  var action = event.action

  console.log(notification);

  if(action === 'confirm'){
    console.log('Confirm was chosen');
    notification.close();

  } else{
    console.log(action)
    notification.close();

  }
})