const CACHE_NAME = 'exna-music-v1';
// Lista de arquivos estruturais que serão guardados no cache local
const ASSETS = [
  'index.html',
  'manifest.json',
  'logo-quadrada.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js'
];

// Instala o Service Worker e armazena os arquivos essenciais
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativa e limpa caches antigos se houver atualizações
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta as requisições para fazer o app funcionar offline
self.addEventListener('fetch', (e) => {
  // Ignora requisições de blobs de áudio locais (gerados dinamicamente pelo player)
  if (e.request.url.startsWith('blob:')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Retorna do cache se existir; se não, busca na rede
      return cachedResponse || fetch(e.request);
    })
  );
});
