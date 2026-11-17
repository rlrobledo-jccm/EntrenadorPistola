/* Service worker: lets the app open and run without signal (galería). Bump CACHE when you change files. */
const CACHE = "tiro10m-v3";
const CORE = ["./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./favicon-32.png"];
const LIB = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
const CROSS = ["cdnjs.cloudflare.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);
    try { await c.add(new Request(LIB, { mode: "cors" })); } catch (_) { /* se guardará en la primera carga con red */ }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (!same && !CROSS.includes(url.hostname)) return;

  // Página: red primero (para recibir actualizaciones), caché si no hay señal.
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        const c = await caches.open(CACHE); c.put("./index.html", res.clone());
        return res;
      } catch (_) {
        return (await caches.match("./index.html")) || (await caches.match("./")) || Response.error();
      }
    })());
    return;
  }

  // Resto: caché primero, y se guarda lo que llegue de la red.
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === "opaque")) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
      return res;
    } catch (_) {
      return hit || Response.error();
    }
  })());
});
