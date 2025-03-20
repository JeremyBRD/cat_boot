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
