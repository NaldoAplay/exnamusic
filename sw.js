const CACHE_NAME = 'exna-music-v4.7';
const assetsToCache = [
    './',
    'index.html',
    'manifest.json',
    'icon.png',
    'jsmediatags.min.js'   // <-- ADICIONADO: biblioteca local
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});

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

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // Se tem no cache, usa o cache (offline). Se não, busca da rede.
            return cachedResponse || fetch(e.request);
        })
    );
});
