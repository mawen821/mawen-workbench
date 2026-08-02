// 马雯的工作台 · Service Worker（v6 · 离线可用版）
// 目标：手机只要成功加载过一次，之后云端休眠 / 电脑关机也能离线秒开；
//       联网时后台静默更新，保证内容不断更。
const CACHE = 'mw-workbench-v6';

// 应用外壳：全部需要离线打开的同源资源
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './js/ai.js',
  './js/zimeiti.js',
  './js/chart.umd.min.js',
  './js/data-beauty.js',
  './js/data-booktexts.js',
  './js/data-common.js',
  './js/data-country.js',
  './js/data-country-auto.js',
  './js/data-country-deep.js',
  './js/data-country-track.js',
  './js/data-english.js',
  './js/data-finance.js',
  './js/data-geography.js',
  './js/data-ledger.js',
  './js/data-misc.js',
  './js/data-news.js',
  './js/data-pet.js',
  './js/data-reading.js',
  './js/data-shenlun.js',
  './js/data-skill.js',
  './js/data-sport.js',
  './js/data-tenmin.js',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png',
  './assets/board-icons/overview.svg',
  './assets/board-icons/checkin.svg',
  './assets/board-icons/ledger.svg',
  './assets/board-icons/review.svg',
  './assets/board-icons/sport.svg',
  './assets/board-icons/english.svg',
  './assets/board-icons/finance.svg',
  './assets/board-icons/news.svg',
  './assets/board-icons/book.svg',
  './assets/board-icons/zimeiti-pet.svg',
  './assets/board-icons/zimeiti-goods.svg',
  './assets/board-icons/ai.svg',
  './assets/board-icons/common.svg',
  './assets/board-icons/shenlun.svg',
  './assets/board-icons/search.svg',
  './assets/board-icons/misc.svg',
  './assets/board-icons/skill.svg',
  './assets/board-icons/tenmin.svg',
  './assets/board-icons/beauty.svg',
  './assets/board-icons/pet.svg',
  './assets/board-icons/country.svg',
  './assets/board-icons/travel.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      // 逐条缓存，单条失败不中断整体（保证多数资源可用）
      return Promise.allSettled(CORE.map((u) => cache.add(u)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 跨域资源（如有）交给浏览器默认行为
  if (url.origin !== self.location.origin) return;

  // 页面导航：网络优先，离线时回退到缓存的 index.html（保证永远打的开）
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html').then((c) => c || caches.match('./')))
    );
    return;
  }

  // 静态资源：缓存优先（离线秒开），同时后台静默更新
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'default')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
