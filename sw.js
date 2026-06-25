const CACHE_NAME = "zbbt-v1.1";

// 安装时预缓存核心资源
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.json",
  "./src/game.bundle.js",
  "https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch((err) => console.error("[SW install] precache failed:", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k).catch((err) => console.error("[SW activate] delete old cache", k, err))))
    )
  );
  self.clients.claim();
});

// 缓存策略：assets 走 Cache-First，其他走 Network-First
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // CDN Phaser — Cache-First
  if (url.hostname === "cdn.jsdelivr.net") {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request)).catch((err) => console.error("[SW fetch CDN]", err))
    );
    return;
  }

  // 本地静态资源 (assets/*.png, src/*.js, styles.css) — Cache-First，后台更新
  if (
    url.origin === self.location.origin &&
    (url.pathname.endsWith(".png") || url.pathname.endsWith(".js") || url.pathname.endsWith(".css"))
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetched = fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch((err) => console.error("[SW fetch] background cache update failed:", err));
          }
          return response;
        });
        return cached || fetched;
      })
    );
    return;
  }

  // HTML / 其他 — Network-First，离线时 fallback 到缓存
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
