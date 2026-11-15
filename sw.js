const C='wxmap-20261115e';
const ASSETS=['./','index.html','detail.html','calc.html','manifest.json','leaflet.js?v=20261115e','leaflet.css','data.p0?v=20261115e','data.p1?v=20261115e','data.p2?v=20261115e','data.p3?v=20261115e','data.p4?v=20261115e','data.p5?v=20261115e','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const u=new URL(req.url);
  if(u.origin!==location.origin) return;
  // 导航请求忽略 query（detail.html?i=123 复用缓存页面）
  const key=req.mode==='navigate' ? (u.origin+u.pathname) : req.url;
  e.respondWith(caches.match(key).then(r=>{
    if(r) return r;
    return fetch(req).then(res=>{
      if(res && res.status===200 && res.type==='basic'){
        const cp=res.clone(); caches.open(C).then(c=>c.put(key,cp));
      }
      return res;
    });
  }).catch(()=>caches.match('index.html')));
});
