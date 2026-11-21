// Daybook offline cache. Bump VERSION when files change.
const VERSION="daybook-v2";
const CORE=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","h/index.js","h/BinaryModule-S5UABkWQ.js","h/harper.gz.wasm"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    if(hit) return hit;
    return fetch(e.request).then(res=>{
      if(res.ok && (new URL(e.request.url).origin===location.origin || /fonts\.(googleapis|gstatic)\.com/.test(e.request.url))){ const copy=res.clone(); caches.open(VERSION).then(c=>c.put(e.request,copy)); }
      return res;
    }).catch(()=> e.request.mode==="navigate" ? caches.match("index.html") : Response.error());
  }));
});
