
const version = "0.6.11";
const cacheName = `airhorner-${version}`;
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `/`,
        `/fonts/glyphicons-halflings-regular.woff2`,
        `/fonts/fontawesome-webfont.woff2`,
        `/images/22.jpg`,
        `/javascripts/bootstrap.min.js`,
        `/javascripts/easing.js`,
        `/javascripts/all.js`,
        `/stylesheets/bootstrap.css`,
        `/stylesheets/font-awesome.css`,
        `/stylesheets/skdslider.css`,
        `/stylesheets/style.css`
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});
