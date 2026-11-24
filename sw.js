// KOLLECTIF R6-B LAB — texte sur terrain ; référence publiée A-Mono préservée.
const CACHE = 'kollectif-r6b-ui02-correctif-20261124-v2';
const OLD = 'kollectif-mono-a-20261124';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './icon-master-1024.png', './assets/kollectif-k.svg', ...["./assets/ui/point.png","./assets/ui/move.png","./assets/ui/pass.png","./assets/ui/shot.png","./assets/ui/curve-left.png","./assets/ui/curve-right.png","./assets/ui/multi.png","./assets/ui/text.png","./assets/ui/pen.png","./assets/ui/eraser.png","./assets/ui/undo.png","./assets/ui/redo.png","./assets/ui/reset.png","./assets/ui/open.png","./assets/ui/delete.png","./assets/ui/save.png","./assets/ui/import.png","./assets/ui/export.png","./assets/ui/pdf.png","./assets/ui/mp4.png"], './narrations.json'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const response = await fetch('./narrations.json', {cache:'no-store'});
    if (!response.ok) throw Error('narrations.json inaccessible');
    const manifest = await response.json();
    if (!Array.isArray(manifest.items) || manifest.items.length !== 28) throw Error('28 narrations requises');
    const cache = await caches.open(CACHE);
    const old = await caches.open(OLD);
    for (const path of CORE) {
      const resp = await fetch(path, {cache:'reload'});
      if (!resp.ok) throw Error('Fichier non accessible : '+path);
      await cache.put(path,resp);
    }
    for (const item of manifest.items) {
      const path = './'+item.file;
      const existing = await old.match(path) || await cache.match(path);
      if (existing && existing.ok) { await cache.put(path,existing); continue; }
      const resp = await fetch(path, {cache:'reload'});
      if (!resp.ok) throw Error('Audio absent : '+path);
      await cache.put(path,resp);
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {
 if(event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
 event.respondWith((async()=>{
   const cache = await caches.open(CACHE);
   return (await cache.match(event.request,{ignoreSearch:true})) || fetch(event.request);
 })());
});
