// sw.js - Archivo del Service Worker

// FASE 1: Instalación
// Se dispara cuando el archivo se descarga por primera vez o hay cambios en él.
self.addEventListener('install', event => {
  console.log('SW: 1. Instalado correctamente.');
  // En la siguiente clase, aquí guardaremos archivos en caché.
});

// FASE 2: Activación
// Se dispara cuando el SW toma el control de la aplicación.
self.addEventListener('activate', event => {
  console.log('SW: 2. Activado y listo para controlar la app.');
  // En la siguiente clase, aquí borraremos cachés obsoletas.
});

// FASE 3: Intercepción de Peticiones (Fetch)
// Se dispara cada vez que la página HTML pide un recurso (CSS, JS, imágenes, etc.)
self.addEventListener('fetch', event => {
  console.log('SW: 3. Interceptando petición hacia ->', event.request.url);
  // Por ahora, dejamos que la petición continúe su viaje normal a internet.
});