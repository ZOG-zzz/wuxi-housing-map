const C='wxmap-20261115a';
const ASSETS=['./','index.html','leaflet.js?v=20261115a','leaflet.css','data.p0?v=20261115a','data.p1?v=20261115a','data.p2?v=20261115a','data.p3?v=20261115a','data.p4?v=20261115a'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(r=>{
    if(r) return r;
    return fetch(e.request).then(res=>{
      if(res && res.status===200 && res.type==='basic'){ const cp=res.clone(); caches.open(C).then(c=>c.put(e.request,cp)); }
      return res;
    });
  }).catch(()=>caches.match('index.html')));
});
