const C='echo-maze-v5',F=['./','index.html','css/style.css','js/levels.js','js/maze.js','js/audioEngine.js','js/render.js','js/main.js','manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
