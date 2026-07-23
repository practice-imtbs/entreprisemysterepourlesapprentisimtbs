/* Service worker — PWA légère : cache-first pour un jeu 100 % hors ligne après 1er chargement */
const VERSION = 'em-v13';
const ASSETS = [
  './',
  './index.html',
  './animateur.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/state.js',
  './js/ui.js',
  './js/validate.js',
  './js/export.js',
  './js/engine/qcm.js',
  './js/engine/vraifaux.js',
  './js/engine/ordre.js',
  './js/engine/matching.js',
  './js/engine/question.js',
  './js/engine/postit.js',
  './js/engine/dossier-feuillete.js',
  './js/engine/alerte.js',
  './js/engine/debriefing.js',
  './content/content.json',
  './assets/img/logo-imtbs.png',
  './assets/img/favicon.svg',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
