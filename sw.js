// Kirenga Isaac — Service Worker v2.0
const CACHE = 'ki-cache-v2';
const ASSETS = ['/', '/index.html', '/manifest.json', '/offline.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('api.github.com') || e.request.url.includes('formspree.io') || e.request.url.includes('countapi.xyz')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{}', { headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => e.request.mode === 'navigate' ? caches.match('/offline.html') : new Response('Offline', { status: 503 }));
    })
  );
});
self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : { title: 'Kirenga Isaac', body: 'New update!' };
  e.waitUntil(self.registration.showNotification(d.title, { body: d.body, icon: '/icon-192.png', vibrate: [200,100,200] }));
});
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(clients.openWindow('https://kirengaisaac.github.io')); });
