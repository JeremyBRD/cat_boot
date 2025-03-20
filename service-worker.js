self.addEventListener("install", (event) => {
  event.waitUntil(
      caches.open("cat_boot_cache").then((cache) => {
          return cache.addAll([
              "/",
              "/index.html",
              "/styles.css",
              "/main.js",
              "/config.js",
              "/manifest.json"
          ]);
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
          return response || fetch(event.request);
      })
  );
});

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force l'update immédiate
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          return caches.delete(cache); // Supprime toutes les anciennes versions du cache
        })
      );
    })
  );
});
