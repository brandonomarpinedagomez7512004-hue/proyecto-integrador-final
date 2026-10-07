// sw.js - Service Worker con Cache API (App Shell + funcionamiento sin conexión)

// 1. Nombre y versión de la caché. Si cambias CSS/HTML/JS, sube la versión (v3, v4...)
const CACHE_NAME = 'devconnect-shell-v2';

// 2. Recursos estáticos del App Shell (todos permiten CORS, así que usamos addAll)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 3. Recursos externos que NO envían cabeceras CORS (addAll fallaría con ellos).
//    Se guardan aparte, en modo "no-cors" (respuesta opaca).
const EXTERNAL_NO_CORS = [
  'https://cdn.tailwindcss.com'
];

// FASE DE INSTALACIÓN: precaché del App Shell
self.addEventListener('install', event => {
  console.log('SW: Guardando recursos estáticos en la caché...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caché abierta con éxito:', CACHE_NAME);

        // Archivos propios + Font Awesome (CORS permitido)
        return cache.addAll(STATIC_ASSETS).then(() => {
          // Recursos externos sin CORS, uno por uno
          return Promise.all(
            EXTERNAL_NO_CORS.map(url =>
              fetch(url, { mode: 'no-cors' })
                .then(respuesta => cache.put(url, respuesta))
                .catch(error => console.warn('SW: No se pudo guardar', url, error.message))
            )
          );
        });
      })
      .then(() => {
        console.log('SW: Todos los archivos del App Shell fueron almacenados.');
        // Activar de inmediato la nueva versión
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('SW: Falló el almacenamiento en caché del App Shell:', err);
      })
  );
});

// FASE DE ACTIVACIÓN: borrar cachés de versiones anteriores y tomar el control
self.addEventListener('activate', event => {
  console.log('SW: Activado y listo.');

  event.waitUntil(
    caches.keys()
      .then(nombres =>
        Promise.all(
          nombres
            .filter(nombre => nombre !== CACHE_NAME)
            .map(nombre => {
              console.log('SW: Borrando caché antigua:', nombre);
              return caches.delete(nombre);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// FASE FETCH: primero la caché; si no está, red; y se guarda una copia para la próxima vez
self.addEventListener('fetch', event => {
  const peticion = event.request;

  // Solo manejamos GET y direcciones http/https
  if (peticion.method !== 'GET' || !peticion.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(peticion, { ignoreVary: true }).then(enCache => {
      if (enCache) {
        return enCache; // Respuesta inmediata desde la caché (funciona sin internet)
      }

      return fetch(peticion)
        .then(respuesta => {
          // Guardamos copia (por ejemplo, las fuentes de los iconos de Font Awesome)
          if (respuesta && (respuesta.ok || respuesta.type === 'opaque')) {
            const copia = respuesta.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(peticion, copia));
          }
          return respuesta;
        })
        .catch(() => {
          // Sin internet y sin copia: si era una página, mostramos el App Shell
          if (peticion.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});