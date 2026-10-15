/*
 * オフライン用の Service Worker。
 * アプリ本体（index.html）は「通信できれば最新、できなければ保存済み」で返す。
 * アイコンなどの静的ファイルを差し替えたときは VERSION を上げる。
 */
const VERSION = "v2";
const APP_CACHE = "hand-drip-app-" + VERSION;
const FONT_CACHE = "hand-drip-fonts";
const FONT_LIMIT = 160;

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("hand-drip-app-") && key !== APP_CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }
  event.respondWith(cacheFirst(req));
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

async function networkFirst(req) {
  const cache = await caches.open(APP_CACHE);
  try {
    const res = await withTimeout(fetch(req), 4000);
    if (res && res.ok) cache.put("./index.html", res.clone());
    return res;
  } catch (e) {
    return (await cache.match("./index.html")) || (await cache.match("./")) || Response.error();
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(APP_CACHE);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const update = fetch(req)
    .then(async (res) => {
      if (res && (res.ok || res.type === "opaque")) {
        await cache.put(req, res.clone());
        trim(cache, FONT_LIMIT);
      }
      return res;
    })
    .catch(() => null);
  return hit || (await update) || Response.error();
}

async function trim(cache, max) {
  const keys = await cache.keys();
  if (keys.length <= max) return;
  await Promise.all(keys.slice(0, keys.length - max).map((k) => cache.delete(k)));
}
