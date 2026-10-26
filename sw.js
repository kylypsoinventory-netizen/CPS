/* Shell lang ang kine-cache (hindi ang system mismo), para laging updated ang data mula sa Google. */
const CACHE = 'cps-shell-v4';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

/* ── Push notifications (Firebase Cloud Messaging) ── */
try {
  importScripts('firebase-config.js');
  var _c = self.FIREBASE_CONFIG;
  if (_c && _c.apiKey && String(_c.apiKey).indexOf('PASTE_') !== 0) {
    importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
                  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
    firebase.initializeApp(_c);
    firebase.messaging().onBackgroundMessage(function (payload) {
      var d = (payload && payload.data) || {};
      return self.registration.showNotification(d.title || 'Bagong mensahe', {
        body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png',
        tag: d.tag || d.room || 'cps', renotify: true, data: { room: d.room || '' }
      });
    });
  }
} catch (e) { /* walang push config: tuloy pa rin ang normal na shell */ }

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var room = (e.notification.data && e.notification.data.room) || '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if ('focus' in list[i]) { list[i].postMessage({ cps: 'openRoom', room: room }); return list[i].focus(); }
    }
    return self.clients.openWindow('./' + (room ? '?room=' + encodeURIComponent(room) : ''));
  }));
});

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;           // huwag galawin ang requests papuntang Google
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
