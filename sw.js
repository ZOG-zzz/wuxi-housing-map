const C='wxmap-20261115f';
const ASSETS=['./','index.html','detail.html','calc.html','manifest.json','leaflet.js?v=20261115f','leaflet.css','data.p0?v=20261115f','data.p1?v=20261115f','data.p2?v=20261115f','data.p3?v=20261115f','data.p4?v=20261115f','data.p5?v=20261115f','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  const u=new URL(req.url);
  if(u.origin!==location.origin) return;
  const key=req.mode==='navigate' ? (u.origin+u.pathname) : req.url;
  // 页面导航走网络优先：保证改版后刷新一次就是新版本；断网再回退缓存
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(res=>{
      if(res && res.status===200 && res.type==='basic'){
        const cp=res.clone(); caches.open(C).then(c=>c.put(key,cp));
      }
      return res;
    }).catch(()=>caches.match(key).then(r=>r||caches.match('index.html'))));
    return;
  }
  // 静态资源走缓存优先（数据分片、图标等）
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
