// 马雯的工作台 · Service Worker（v8 · 离线可用 + 更新必达版）
// 目标：手机只要成功加载过一次，之后云端休眠 / 电脑关机也能离线秒开；
//       联网时后台静默更新，保证内容不断更；新版本部署后强制重新缓存，更新必达。
const CACHE = 'mw-workbench-v8557c157';

// 应用外壳：全部需要离线打开的同源资源
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css?v=cec8ff1d',
  './vendor/font-awesome/all.min.css?v=652c8cd5',
  './vendor/font-awesome/webfonts/fa-solid-900.woff2',
  './vendor/font-awesome/webfonts/fa-regular-400.woff2',
  './vendor/font-awesome/webfonts/fa-brands-400.woff2',
  './js/app.js?v=796027df',
  './js/imgstore.js?v=f4f0fbe4',
  './js/data-english-shadow.js?v=454bed78',
  './js/ai.js?v=34f8d5f5',
  './js/zimeiti.js?v=e7f9cadc',
  './js/chart.umd.min.js',
  './js/data-beauty.js?v=eccd5b94',
  './js/data-booktexts.js?v=0917817b',
  './js/data-common.js?v=706b422e',
  './js/data-country.js?v=e62b7fa8',
  './js/data-country-auto.js?v=4fb063cb',
  './js/data-country-deep.js?v=a81e30e5',
  './js/data-country-focus.js?v=068ae1b4',
  './js/data-country-track.js?v=536bb3b7',
  './js/data-country-advantage.js?v=313102ad',
  './js/news-check.js?v=1b9c39cc',
  './js/data-frontier.js?v=addf7d69',
  './js/data-gua64.js?v=24f6913a',
  './js/data-destiny.js?v=d6b1bffa',
  './js/data-tarot.js?v=ee43bfac',
  './js/destiny.js?v=d4b7d1db',
  './js/tarot.js?v=f7b259ef',
  './js/data-english.js?v=64ecb61a',
  './js/data-finance.js?v=f6c5157e',
  './js/data-finance-trend.js?v=f54803eb',
  './js/data-ledger.js?v=ee60b3bc',
  './js/data-misc.js?v=30899490',
  './js/data-news.js?v=60c8785a',
  './js/data-pet.js?v=b0e6fdef',
  './js/data-reading.js?v=26ae02b7',
  './js/data-shenlun.js?v=753d804c',
  './js/data-skill.js?v=68d158cf',
  './js/data-sport.js?v=170f8e8f',
  './js/data-tenmin.js?v=b800225e',
  './assets/icon-girl.svg',
  './assets/icon-girl-192.png',
  './assets/icon-girl-512.png',
  './assets/icon-girl-maskable-512.png',
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
  './assets/board-icons/shisanwu.svg',
  './assets/board-icons/travel.svg',
  './assets/board-icons/destiny.svg',
  './assets/board-icons/tarot.svg',
  // 旅行地图子应用（iframe，离线也要能开）
  './travel-board/index.html',
  './travel-board/css/style.css',
  './travel-board/js/app.js',
  './travel-board/js/cities.js',
  './travel-board/js/county-coords.js',
  './travel-board/js/echarts.min.js',
  './travel-board/data/china.geo.js',
  './travel-board/data/world.geo.js',
  // 十五五规划子应用（iframe，离线也要能开）
  './shisanwu/index.html'
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

  // 脚本与样式：网络优先（保证部署后第一时间拿到新代码，避免旧版 app.js 缓存导致功能失效）
  // 网络失败再回退缓存（离线可用）
  if (/\.(js|css)(\?|$)/.test(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'default')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 图片等：stale-while-revalidate（先秒开缓存，后台静默刷新缓存 → 更新必达且离线可用）
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'default')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      // 有缓存先返回（秒开），没缓存等网络
      return cached || network;
    })()
  );
});
