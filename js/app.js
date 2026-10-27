// app.js - Lógica del cliente de DevConnect
// Incluye: renderizado dinámico (CSR) del feed + registro del Service Worker

console.log('App Shell de DevConnect inicializado correctamente.');

// ---------------------------------------------------------------
// 1. DATOS: en una app real vendrían de una API; aquí es un arreglo local
// ---------------------------------------------------------------
const publicaciones = [
  {
    autor: 'Profesor Web',
    tiempo: 'Hace 2 minutos',
    texto: '¡Bienvenidos a nuestra red social de la clase! Pronto esta app funcionará 100% sin conexión.',
    color: 'bg-blue-400',
    likes: 12
  },
  {
    autor: 'Brandon Pineda',
    tiempo: 'Hace 15 minutos',
    texto: 'Ya tengo mi PWA con Service Worker y caché. Ahora toca la Splash Screen y el renderizado con JavaScript.',
    color: 'bg-green-500',
    likes: 8
  },
  {
    autor: 'Equipo UTM',
    tiempo: 'Hace 1 hora',
    texto: 'Recuerden entregar sus avances del integrador. El manifest.json es lo que permite instalar la app en el celular.',
    color: 'bg-purple-500',
    likes: 5
  },
  {
    autor: 'Dev Anónimo',
    tiempo: 'Hace 3 horas',
    texto: 'Tip: con la estrategia Cache First, tu app abre al instante aunque no haya internet.',
    color: 'bg-orange-500',
    likes: 21
  }
];

// ---------------------------------------------------------------
// 2. SEGURIDAD: escapa texto para que nunca se interprete como HTML
// ---------------------------------------------------------------
function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// ---------------------------------------------------------------
// 3. PLANTILLA: construye el HTML de UNA tarjeta
// ---------------------------------------------------------------
function crearTarjeta(post) {
  const inicial = escaparHTML(post.autor.charAt(0).toUpperCase());

  return `
    <article class="bg-white p-4 rounded-lg shadow mb-4">
      <div class="flex items-center mb-3">
        <div class="w-10 h-10 rounded-full ${post.color} flex items-center justify-center text-white font-bold mr-3">
          ${inicial}
        </div>
        <div>
          <h2 class="font-bold text-gray-800">${escaparHTML(post.autor)}</h2>
          <p class="text-xs text-gray-500">${escaparHTML(post.tiempo)}</p>
        </div>
      </div>
      <p class="text-gray-700">${escaparHTML(post.texto)}</p>
      <div class="mt-3 text-sm text-gray-500">
        <i class="fa-regular fa-heart"></i> ${Number(post.likes)} Me gusta
      </div>
    </article>
  `;
}

// ---------------------------------------------------------------
// 4. RENDERIZADO CSR: pinta todas las tarjetas dentro del <main id="feed">
// ---------------------------------------------------------------
function renderizarFeed(lista) {
  const feed = document.getElementById('feed');

  if (!feed) {
    console.error('No se encontró el contenedor #feed.');
    return;
  }

  if (lista.length === 0) {
    feed.innerHTML = '<p class="text-center text-gray-500 mt-8">No hay publicaciones todavía.</p>';
    return;
  }

  feed.innerHTML = lista.map(crearTarjeta).join('');
  console.log(`CSR: se renderizaron ${lista.length} tarjetas dinámicas.`);
}

// Pintamos el feed al cargar la página
renderizarFeed(publicaciones);

// ---------------------------------------------------------------
// 5. Botón de sincronizar (evento de prueba)
// ---------------------------------------------------------------
document.getElementById('btn-sync').addEventListener('click', () => {
  alert('Pronto aquí implementaremos la sincronización con Background Sync.');
});

// ---------------------------------------------------------------
// 6. Registro del Service Worker
// ---------------------------------------------------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registro => {
      console.log('¡Éxito! Service Worker registrado correctamente.', registro);
    })
    .catch(error => {
      console.warn('Error al registrar el Service Worker:', error);
    });
} else {
  console.error('Este navegador no soporta Service Workers.');
}