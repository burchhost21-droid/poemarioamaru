// sw.js - Service Worker para Amaru Poemarios (lectura offline)
const CACHE_NAME = 'amaru-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/portada.jpg',      // Ajustá la ruta si tu portada tiene otro nombre
  '/favicon.png'
];

// ─── INSTALACIÓN: Precacha los archivos estáticos ──────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.error('Precache error:', err);
      });
    })
  );
  self.skipWaiting(); // Activa el SW inmediatamente
});

// ─── ACTIVACIÓN: Limpia versiones antiguas de caché ────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  event.waitUntil(clients.claim()); // Toma control de todas las pestañas
});

// ─── FETCH: Estrategia Network First (Red → Caché) ─────────────────
self.addEventListener('fetch', (event) => {
  // No cachear el PDF (se genera en el servidor y no se puede usar offline realmente)
  if (event.request.url.includes('/api/descargar-pdf')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Guardamos en caché solo respuestas GET exitosas
        if (event.request.method === 'GET' && response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // Si falla la red, devuelve desde caché
  );
});