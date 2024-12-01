const CACHE_NAME = "storybook-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles/styles.css",
  "/styles/storybook.css",
  "/icons/Book.svg",
  "/icons/Tick.svg",
  "/icons/Close.svg",
  "/icons/Gemini-Icon.png",
  "/icons/Retry.svg",
  "/js/app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
