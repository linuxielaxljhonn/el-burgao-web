/**
 * sw.js — Service Worker El Burgao v3.0
 * /admin (editor de contenidos) nunca se cachea.
 */

const VERSION      = 'burgao-v3.1.0';
const CACHE_STATIC = `${VERSION}-static`;
const CACHE_PAGES  = `${VERSION}-pages`;
const CACHE_IMAGES = `${VERSION}-images`;
const CACHE_API    = `${VERSION}-api`;
const MAX_IMAGES   = 60;
const MAX_PAGES    = 30;

const PRECACHE_PAGES = ['/','/noticias/','/eventos/','/rutas/','/contacto/','/hazte-socio/','/la-asociacion/','/offline/','/404.html'];
const PRECACHE_STATIC = ['/manifest.json','/assets/icons/icon-192.png','/assets/icons/icon-512.png','/assets/img/logo/caracol-h80.png','/assets/img/logo/caracol-h160.png','/assets/img/logo/logo-completo-h200.png'];

self.addEventListener('install', e => {
  e.waitUntil(Promise.all([
    caches.open(CACHE_PAGES).then(c => c.addAll(PRECACHE_PAGES).catch(()=>{})),
    caches.open(CACHE_STATIC).then(c => c.addAll(PRECACHE_STATIC).catch(()=>{})),
  ]).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  const CURRENT = [CACHE_STATIC,CACHE_PAGES,CACHE_IMAGES,CACHE_API];
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k=>k.startsWith('burgao-')&&!CURRENT.includes(k)).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (req.method !== 'GET') return;
  if (url.pathname.startsWith('/admin')) return;
  if (url.pathname.startsWith('/api/')) return;   // acceso de socios: nunca en caché

  if (req.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/)) {
    e.respondWith(cacheFirstLimit(req, CACHE_IMAGES, MAX_IMAGES)); return;
  }
  if (url.pathname.startsWith('/_astro/') || url.pathname.match(/\.(js|css|woff2?)(\?.*)?$/)) {
    e.respondWith(cacheFirst(req, CACHE_STATIC)); return;
  }
  if (url.pathname.match(/\.json$/) && !url.pathname.includes('/admin')) {
    e.respondWith(staleWhileRevalidate(req, CACHE_API)); return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(networkFirstHTML(req)); return;
  }
});

async function cacheFirst(req, name) {
  const c = await caches.match(req);
  if (c) return c;
  try {
    const r = await fetch(req);
    if (r.ok) (await caches.open(name)).put(req, r.clone());
    return r;
  } catch { return new Response('', {status:503}); }
}

async function cacheFirstLimit(req, name, max) {
  const cache = await caches.open(name);
  const c = await cache.match(req);
  if (c) return c;
  try {
    const r = await fetch(req);
    if (r.ok) { await trimCache(cache, max-1); cache.put(req, r.clone()); }
    return r;
  } catch { return new Response('', {status:503}); }
}

async function staleWhileRevalidate(req, name) {
  const cache = await caches.open(name);
  const cached = await cache.match(req);
  const fetchP = fetch(req).then(r => { if(r.ok) cache.put(req,r.clone()); return r; }).catch(()=>null);
  return cached || await fetchP || new Response('{}', {headers:{'Content-Type':'application/json'}});
}

async function networkFirstHTML(req) {
  try {
    const r = await fetch(req);
    if (r.ok) {
      const cache = await caches.open(CACHE_PAGES);
      await trimCache(cache, MAX_PAGES-1);
      cache.put(req, r.clone());
    }
    return r;
  } catch {
    const cached = await caches.match(req) || await caches.match('/offline/');
    return cached || offlinePage();
  }
}

async function trimCache(cache, max) {
  const keys = await cache.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length-max).map(k=>cache.delete(k)));
}

function offlinePage() {
  return new Response(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sin conexión — El Burgao</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0d2a3d;color:white;text-align:center;padding:2rem}.w{max-width:400px}.e{font-size:4rem;margin-bottom:1rem;display:block}h1{font-size:1.5rem;margin-bottom:.75rem}p{opacity:.7;line-height:1.6;margin-bottom:1.5rem}button{background:#C9A96E;color:#0d2a3d;border:none;border-radius:999px;padding:.75rem 2rem;font-weight:700;cursor:pointer}</style></head><body><div class="w"><span class="e">🚐</span><h1>Sin conexión</h1><p>Recupera la conexión y todo estará aquí esperándote.</p><button onclick="location.reload()">Reintentar</button></div></body></html>`,
    { status:200, headers:{'Content-Type':'text/html;charset=utf-8'} });
}

self.addEventListener('push', e => {
  if (!e.data) return;
  let d = {title:'El Burgao',body:'',url:'/'};
  try { d = {...d,...e.data.json()}; } catch {}
  e.waitUntil(self.registration.showNotification(d.title, {
    body:d.body, icon:'/assets/icons/icon-192.png',
    badge:'/assets/icons/icon-96.png', data:{url:d.url},
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(cl => {
    const w = cl.find(c=>c.url===e.notification.data?.url);
    return w ? w.focus() : clients.openWindow(e.notification.data?.url||'/');
  }));
});
