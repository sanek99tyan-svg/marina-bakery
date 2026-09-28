const CACHE='marina-v1';const ASSETS=['./','index.html','assets/css/style.css','assets/js/script.js','assets/img/medovik-hero.jpg','icons/icon-192.png','icons/icon-512.png','manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
