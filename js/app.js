/* ============================================
   马雯的工作台 - 应用主逻辑
   ============================================ */

// ===== 全局状态 =====
let currentModule = 'checkin';
let currentEngTab = 'today';
let currentWordBook = 'primary';
let currentFinancePhase = 0;
let currentShenlunTab = 'reading';
let currentFlashcardIdx = 0;
let currentPolicyCat = 'all';
let currentNewsFilter = 'all';
let currentCheckinTab = 'tasks';
let currentSportTab = 'record';
let currentSkillView = null; // 当前查看的技能id，null=按月份自动
let currentPracticeSubtab = 'phrases';
let readingTranslateMode = 'bilingual'; // bilingual | en-only | cn-only
let charts = {}; // Chart.js实例缓存
let reviewSearchKeyword = ''; // 历史复盘搜索关键词
let reviewImages = []; // 当前复盘图片（base64）
let reviewSelectedMood = '';
let reviewSelectedEmojis = [];
let reviewExpandedDays = new Set(); // 历史复盘已展开的天（默认今天展开）
let reviewDayInit = false;

// ===== 工具函数 =====
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function today() { return new Date().toISOString().split('T')[0]; }
function uid() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

function loadData(key, def) {
  try { return JSON.parse(localStorage.getItem('mw_' + key)) || def; }
  catch { return def; }
}
function saveData(key, val) {
  try { localStorage.setItem('mw_' + key, JSON.stringify(val)); }
  catch(e) { showToast('存储空间不足，请清理旧数据', 'error'); }
}

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  t.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

/* ===== 数据备份：导出/导入，保证换手机可一键转移全部手动数据 ===== */
// 主数据使用 mw_ 前缀；少数独立子应用（如旅行地图）用专属 key，也要一并备份
const EXTRA_BACKUP_KEYS = ['travelBoard.v1'];
function exportWorkbench() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && (k.indexOf('mw_') === 0 || EXTRA_BACKUP_KEYS.indexOf(k) > -1)) data[k] = localStorage.getItem(k);
  }
  const payload = {
    app: 'mawen-workbench', version: 1,
    exportedAt: new Date().toISOString(),
    count: Object.keys(data).length, data
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '马雯工作台-备份-' + today() + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  showToast('已导出 ' + payload.count + ' 项数据，请存到云盘/微信文件传输');
}

function importWorkbench(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const parsed = JSON.parse(reader.result);
      const src = parsed && parsed.data ? parsed.data : parsed;
      let n = 0;
      for (const k in src) {
        if ((k.indexOf('mw_') === 0 || EXTRA_BACKUP_KEYS.indexOf(k) > -1) && typeof src[k] === 'string') { localStorage.setItem(k, src[k]); n++; }
      }
      showToast('已导入 ' + n + ' 项数据，即将刷新…');
      setTimeout(() => location.reload(), 900);
    } catch (e) {
      showToast('备份文件无法识别', 'error');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

// ===== 学习进度追踪系统 =====
// 学习类型 → 所属模块（用于「总览」按模块统计）
const LEARN_MODULE = {
  words: 'english', grammar: 'english', speaking: 'english', reading: 'english', practice: 'english',
  finance: 'finance', flashcard: 'shenlun', policy: 'shenlun', essay: 'shenlun'
};
function getLearned(type) { return loadData('learned_' + type, []); }
function isLearned(type, id) { return getLearned(type).includes(id); }
function toggleLearned(type, id) {
  const arr = getLearned(type);
  const idx = arr.indexOf(id);
  if (idx > -1) arr.splice(idx, 1); else arr.push(id);
  saveData('learned_' + type, arr);
  const justLearned = idx === -1; // true if just marked as learned
  if (justLearned) {
    // 英语类完成自动记录，用于「学习统计」
    if (['words', 'grammar', 'speaking', 'reading', 'practice'].includes(type)) {
      recordEnglishActivity(type, 1);
    }
    // 统一活动日志，用于「总览 · 今日成长」
    const mod = LEARN_MODULE[type];
    if (mod) recordActivity(mod, type, 1);
  }
  return justLearned;
}
function getProgressHTML(type, total) {
  const learned = getLearned(type).length;
  const pct = total > 0 ? Math.round(learned / total * 100) : 0;
  return `
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" style="width:${pct}%"></div>
    </div>
    <span class="progress-text">${learned}/${total} (${pct}%)</span>
  `;
}

// ===== 英语学习活动记录（用于统计） =====
// 记录一次完成：type ∈ words/grammar/speaking/reading/practice/bedtime
function recordEnglishActivity(type, n = 1) {
  const arr = loadData('eng_activity', []);
  arr.push({ date: today(), type, n: n || 1 });
  // 仅保留最近 1500 条，避免无限增长
  if (arr.length > 1500) arr.splice(0, arr.length - 1500);
  saveData('eng_activity', arr);
}

// ===== 学习活动统一日志（用于「总览 · 今日成长」） =====
// module ∈ checkin/review/english/finance/shenlun/book；记录每次完成事件（含日期）
function recordActivity(module, type, n = 1) {
  const arr = loadData('activity', []);
  arr.push({ date: today(), module, type, n: n || 1 });
  if (arr.length > 3000) arr.splice(0, arr.length - 3000);
  saveData('activity', arr);
}
function getActivityLog() { return loadData('activity', []); }
// 今日各模块完成次数 + 最近动态
function todayActivityByModule() {
  const arr = getActivityLog().filter(a => a.date === today());
  const map = {};
  arr.forEach(a => { map[a.module] = (map[a.module] || 0) + (a.n || 1); });
  return { map, total: arr.length, items: arr.slice(-40).reverse() };
}

// ===== 今日学习时长（专注计时） =====
// 每 15 秒：若页面可见且停留在学习类板块，则累加 15 秒
const FOCUS_LEARNING_MODULES = ['checkin', 'review', 'english', 'finance', 'news', 'book', 'common', 'shenlun', 'misc'];
let focusInterval = null;
function getFocusSeconds() { return loadData('focus_' + today(), 0); }
function addFocusSeconds(n) { saveData('focus_' + today(), getFocusSeconds() + n); }
function startFocusTracking() {
  if (focusInterval) return;
  focusInterval = setInterval(() => {
    if (document.visibilityState === 'visible' && FOCUS_LEARNING_MODULES.includes(currentModule)) {
      addFocusSeconds(15);
    }
  }, 15000);
}
function formatDuration(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  if (h > 0) return `${h} 小时 ${m} 分`;
  if (m > 0) return `${m} 分 ${s} 秒`;
  return `${s} 秒`;
}

// ===== 各板块使用时间追踪（用于「总览」周/月/季图） =====
// 记录每次进入板块、停留的真实时长（仅页面可见时累计），按 日期 → 模块 → 秒
let lastModuleSwitch = Date.now();
function getUsage() { return loadData('usage', {}); }
function addUsageSeconds(mod, n) {
  if (!mod || n <= 0) return;
  const u = getUsage();
  const d = today();
  u[d] = u[d] || {};
  u[d][mod] = (u[d][mod] || 0) + n;
  saveData('usage', u);
}
// 把「上一次切换到现在」的时长计入当前模块，并重置计时起点
function flushUsage() {
  const elapsed = Math.floor((Date.now() - lastModuleSwitch) / 1000);
  if (elapsed > 0) addUsageSeconds(currentModule, elapsed);
  lastModuleSwitch = Date.now();
}
function startUsageTracking() {
  // 每 20 秒结算一次（仅可见时），长停留也能被记录，且不会出现重复计秒
  setInterval(() => { if (document.visibilityState === 'visible') flushUsage(); }, 20000);
}

// ===== 我的计划（待办 / 已完成） =====
function getPlans() { return loadData('plans', []); }
function savePlans(arr) { saveData('plans', arr); }
function addPlan() {
  const inp = $('#plan-input');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) { showToast('请输入计划内容', 'error'); return; }
  const arr = getPlans();
  arr.unshift({ id: uid(), text, done: false, createdAt: Date.now() });
  savePlans(arr);
  inp.value = '';
  refreshPlans();
  showToast('已添加计划');
}
function togglePlan(id) {
  const arr = getPlans();
  const p = arr.find(x => x.id === id);
  if (!p) return;
  p.done = !p.done;
  p.completedAt = p.done ? Date.now() : null;
  savePlans(arr);
  refreshPlans();
}
function deletePlan(id) {
  savePlans(getPlans().filter(x => x.id !== id));
  refreshPlans();
}
function refreshPlans() {
  const plans = getPlans();
  const doneCount = plans.filter(p => p.done).length;
  const todoCount = plans.length - doneCount;
  renderPlanChart(todoCount, doneCount);
  renderPlanList();
  const card = document.querySelector('.ov-stat-card[data-plan] .ov-stat-val');
  if (card) card.textContent = `${todoCount}/${plans.length}`;
}

// 通用 HTML 转义
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// 图片压缩到 maxDim 以内再转 base64（避免 localStorage 溢出）
function compressImageToDataURL(file, maxDim, cb) {
  if (!file || !file.type || file.type.indexOf('image') === -1) { cb(null); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      try { cb(canvas.toDataURL('image/jpeg', 0.8)); } catch { cb(null); }
    };
    img.onerror = () => cb(null);
    img.src = e.target.result;
  };
  reader.onerror = () => cb(null);
  reader.readAsDataURL(file);
}

// 按周期聚合：period ∈ day/week/month/year
function aggregateEnglishActivity(period) {
  const arr = loadData('eng_activity', []);
  const types = ['words', 'grammar', 'speaking', 'reading', 'practice', 'bedtime'];
  const typeLabel = { words: '单词', grammar: '语法', speaking: '口语', reading: '阅读', practice: '跟读', bedtime: '睡前' };
  const now = new Date();
  let labels = [], buckets = {};
  types.forEach(t => buckets[t] = []);

  if (period === 'day') {
    labels = ['今天'];
    const counts = {};
    types.forEach(t => counts[t] = 0);
    arr.filter(a => a.date === today()).forEach(a => { counts[a.type] = (counts[a.type] || 0) + (a.n || 1); });
    types.forEach(t => buckets[t] = [counts[t]]);
  } else if (period === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      labels.push(`${d.getMonth()+1}/${d.getDate()}`);
    }
    types.forEach(t => buckets[t] = labels.map(() => 0));
    arr.forEach(a => {
      const d = new Date(a.date + 'T00:00:00');
      const diff = Math.floor((now - d) / 86400000);
      if (diff >= 0 && diff < 7) {
        const idx = 6 - diff;
        if (idx >= 0 && idx < 7) buckets[a.type][idx] += (a.n || 1);
      }
    });
  } else if (period === 'month') {
    const y = now.getFullYear(), m = now.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    labels = Array.from({ length: days }, (_, i) => String(i + 1));
    types.forEach(t => buckets[t] = labels.map(() => 0));
    arr.forEach(a => {
      const d = new Date(a.date + 'T00:00:00');
      if (d.getFullYear() === y && d.getMonth() === m) {
        buckets[a.type][d.getDate() - 1] += (a.n || 1);
      }
    });
  } else if (period === 'year') {
    labels = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    types.forEach(t => buckets[t] = labels.map(() => 0));
    arr.forEach(a => {
      const d = new Date(a.date + 'T00:00:00');
      if (d.getFullYear() === now.getFullYear()) {
        buckets[a.type][d.getMonth()] += (a.n || 1);
      }
    });
  }
  return { labels, buckets, types, typeLabel };
}

// ===== 每日推荐内容生成 =====
function getDailyRecommend() {
  const todayStr = today();
  const cached = loadData('daily_rec', null);
  if (cached && cached.date === todayStr) return cached;

  const rec = { date: todayStr, words: [], grammarId: null, speakingIdx: null, readingIdx: null, flashcardIdx: null };

  // 5个未学单词（跨所有词书）
  const allWords = [];
  getAllBooks().forEach(b => {
    getBookWords(b.id).forEach(w => allWords.push({ ...w, _bookId: b.id }));
  });
  const unlearned = allWords.filter(w => !isWordLearned(w._bookId, w.en));
  rec.words = unlearned.sort(() => Math.random() - 0.5).slice(0, 5).map(w => ({
    en: w.en, cn: w.cn, phonetic: w.phonetic,
    bookId: w._bookId, bookName: (getBookMeta(w._bookId) || {}).name || ''
  }));

  // 1个未学语法
  const learnedG = getLearned('grammar');
  const ug = GRAMMAR_DATA.filter(g => !learnedG.includes(g.id));
  if (ug.length) rec.grammarId = ug[Math.floor(Math.random()*ug.length)].id;

  // 1个未学口语
  const learnedS = getLearned('speaking');
  const us = SPEAKING_DATA.map((s,i)=>({s,i})).filter(x => !learnedS.includes(x.i));
  if (us.length) rec.speakingIdx = us[Math.floor(Math.random()*us.length)].i;

  // 1个未学阅读
  const learnedR = getLearned('reading');
  const ur = READING_DATA.map((r,i)=>({r,i})).filter(x => !learnedR.includes(x.i));
  if (ur.length) rec.readingIdx = ur[Math.floor(Math.random()*ur.length)].i;

  // 1个申论金句闪卡
  rec.flashcardIdx = Math.floor(Math.random() * FLASHCARD_DATA.length);

  saveData('daily_rec', rec);
  return rec;
}

function checkAllDone(type, total) {
  return getLearned(type).length >= total;
}

// ===== 初始化 =====
function init() {
  updateDate();
  updateStreak();
  updateCheckinBadge();
  bindNav();
  startFocusTracking();
  startUsageTracking();
  renderModule('checkin');
  setInterval(tickUpdateBadges, 30000);
  window.addEventListener('beforeunload', flushUsage);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushUsage();
    else lastModuleSwitch = Date.now();
  });
}

function updateDate() {
  const now = new Date();
  const days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const str = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${days[now.getDay()]}`;
  $('#current-date').textContent = str;
  const mb = document.getElementById('mb-date');
  if (mb) mb.textContent = `${now.getMonth()+1}/${now.getDate()} ${days[now.getDay()]}`;
}

// ===== 移动端抽屉式侧边栏 =====
function toggleMobileSidebar() {
  const s = $('#sidebar'); if (!s) return;
  const open = s.classList.toggle('open');
  const o = $('.sidebar-overlay');
  if (o) o.classList.toggle('show', open);
}
function closeMobileSidebar() {
  const s = $('#sidebar'); if (s) s.classList.remove('open');
  const o = $('.sidebar-overlay'); if (o) o.classList.remove('show');
}

/* 连续打卡天数：同时认可"快速打卡标签"与"显式打卡按钮"两种记录 */
function computeStreak() {
  const checkins = loadData('checkins', []);
  const counts = loadData('checkinCounts', {});
  let streak = 0;
  const d = new Date();
  while (true) {
    const ds = d.toISOString().split('T')[0];
    const hasItems = checkins.some(c => c.date === ds && c.items.length > 0);
    const hasCount = (counts[ds] || 0) > 0;
    if (hasItems || hasCount) { streak++; d.setDate(d.getDate() - 1); } else break;
  }
  return streak;
}

function updateStreak() {
  const el = $('#streak-days');
  if (el) el.textContent = computeStreak();
}

/* 显式打卡：按按钮才 +1，而非进入板块即算完成 */
function getCheckinCount(ds) {
  const counts = loadData('checkinCounts', {});
  return counts[ds || today()] || 0;
}

function doCheckin() {
  const ds = today();
  const counts = loadData('checkinCounts', {});
  counts[ds] = (counts[ds] || 0) + 1;
  saveData('checkinCounts', counts);
  const s = computeStreak();
  ['#streak-days', '#ov-ci-streak', '#ci-streak'].forEach(sel => { const e = $(sel); if (e) e.textContent = s; });
  ['#ov-ci-count', '#ci-today-count'].forEach(sel => { const e = $(sel); if (e) e.textContent = counts[ds]; });
  showToast('打卡 +1，今日已打卡 ' + counts[ds] + ' 次 🎉');
}

function updateCheckinBadge() {
  const tasks = loadData('tasks', []);
  const todayTasks = tasks.filter(t => {
    if (!t.dueDate) return true;
    return t.dueDate <= today();
  });
  $('#checkin-badge').textContent = todayTasks.length;
}

// ===== 导航绑定 =====
function bindNav() {
  $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mod = btn.dataset.module;
      flushUsage();
      currentModule = mod;
      lastModuleSwitch = Date.now();
      closeMobileSidebar();
      renderModule(mod);
    });
  });
}

// ===== 各板块「更新时间 / 倒计时」徽标 =====
// type: daily / weekly(day 0=周日) / biweekly / monthly / manual
const MODULE_UPDATES = {
  news:     { type:'daily',   hour:8,  minute:0,  label:'每日 08:00 自动更新新闻',            icon:'📰' },
  english:  { type:'weekly',  day:1,  hour:7,  minute:0,  label:'每周一 07:00 更新英语内容',        icon:'🔤' },
  shenlun:  { type:'weekly',  day:3,  hour:7,  minute:0,  label:'每周三 07:00 更新申论政治',        icon:'📝' },
  finance:  { type:'weekly',  day:5,  hour:7,  minute:0,  label:'每周五 07:00 更新基金知识',        icon:'📈' },
  common:   { type:'weekly',  day:1,  hour:7,  minute:30, label:'每周一 07:30 更新常识积累',        icon:'🧠' },
  book:     { type:'manual',  label:'每 3 日自动推送精选书摘 + 经典书籍摘要（打开即触发）', icon:'📚' },
  misc:     { type:'weekly',  day:0,  hour:21, minute:0,  label:'每周日 21:00 更新杂学开眼',        icon:'✨' },
  beauty:   { type:'weekly',  day:1,  hour:8,  minute:0,  label:'每周一 08:00 更新本周穿搭配色',     icon:'🎨' },
  skill:    { type:'monthly',                  label:'每月 1 日轮换当月技能主题',           icon:'🎯' },
  tenmin:   { type:'biweekly',                 label:'每两周一换视频（周一锚点）',           icon:'⏱️' },
  checkin:  { type:'manual',                   label:'本地打卡 · 实时保存',                 icon:'✅' },
  review:   { type:'manual',                   label:'本地复盘 · 实时保存',                 icon:'📓' },
  search:   { type:'manual',                   label:'智能搜索 · 实时联网',                 icon:'🔎' },
  pet:      { type:'manual',                   label:'本地记录 · 每日养宠知识轮换',          icon:'🐾' },
  overview: { type:'manual',                   label:'总览 · 实时汇总',                     icon:'📊' },
  sport:    { type:'manual',                   label:'本地记录 · 实时保存',                 icon:'🏃' },
  ledger:   { type:'manual',                   label:'记账 · 实时记录支出收益与定投',        icon:'🧾' },
  country:  { type:'weekly', day:1, hour:9, minute:30, label:'国情与世界 · 每周一自动补充最新战略/趋势', icon:'🌏' },
  travel:   { type:'manual',  label:'旅行地图 · 本地记录实时保存',                  icon:'🧳' },
  'zimeiti-pet':  { type:'manual',  label:'宠物部 · 选题灵感/爆款二创/复盘&选题/预计完成/文案（本地记录）', icon:'🐾' },
  'zimeiti-goods':{ type:'manual',  label:'好物部 · 选题灵感/爆款二创/复盘&选题/预计完成/文案（本地记录）', icon:'🎁' },
  'ai':          { type:'manual',  label:'AI学习 · 本周更新/学习路径/AI视频/AI漫剧/原理/名词/主流软件（每周自动更新）', icon:'🤖' }
};

function nextUpdateDate(cfg) {
  const now = new Date();
  if (cfg.type === 'daily') {
    let d = new Date(now); d.setHours(cfg.hour, cfg.minute || 0, 0, 0);
    if (d <= now) d.setDate(d.getDate() + 1);
    return d;
  }
  if (cfg.type === 'weekly') {
    let d = new Date(now);
    const diff = (cfg.day - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + diff); d.setHours(cfg.hour, cfg.minute || 0, 0, 0);
    if (d <= now) d.setDate(d.getDate() + 7);
    return d;
  }
  if (cfg.type === 'biweekly') {
    const EPOCH = new Date(2026, 6, 27);
    const days = Math.floor((now - EPOCH) / 86400000);
    const round = Math.max(0, Math.floor(days / 14));
    return new Date(EPOCH.getTime() + (round + 1) * 14 * 86400000);
  }
  if (cfg.type === 'monthly') {
    let d = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    if (d <= now) d = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
    return d;
  }
  return new Date(now.getTime() + 86400000);
}

function fmtCountdown(target) {
  let ms = target - new Date();
  if (ms <= 0) return '即将更新';
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  if (d > 0) return `还有 ${d} 天 ${h} 小时`;
  if (h > 0) return `还有 ${h} 小时 ${m} 分`;
  return `还有 ${m} 分钟`;
}

function updateBadgeInner(cfg) {
  if (cfg.type === 'manual') {
    return `<span class="mod-update-ico">${cfg.icon}</span><span class="mod-update-txt">${cfg.label}</span>`;
  }
  const next = nextUpdateDate(cfg);
  return `<span class="mod-update-ico">${cfg.icon}</span><span class="mod-update-txt">${cfg.label}</span><span class="mod-update-count" data-next="${next.toISOString()}">下次更新：${fmtCountdown(next)}</span>`;
}

function injectUpdateBadge(c, key) {
  const old = c.querySelector('.mod-update-strip');
  if (old) old.remove();
  const cfg = MODULE_UPDATES[key];
  if (!cfg) return;
  const strip = document.createElement('div');
  strip.className = 'mod-update-strip';
  strip.innerHTML = updateBadgeInner(cfg);
  c.insertBefore(strip, c.firstChild);
}

function tickUpdateBadges() {
  $$('.mod-update-count').forEach(el => {
    const iso = el.dataset.next;
    if (iso) el.textContent = '下次更新：' + fmtCountdown(new Date(iso));
  });
}

// ===== 模块渲染入口 =====
function renderModule(mod) {
  // 销毁旧图表
  Object.values(charts).forEach(c => { try { c.destroy(); } catch{} });
  charts = {};
  const container = $('#main-content');
  container.innerHTML = '';
  switch(mod) {
    case 'checkin': renderCheckin(container); break;
    case 'review': renderReview(container); break;
    case 'english': renderEnglish(container); break;
    case 'finance': renderFinance(container); break;
    case 'news': renderNews(container); break;
    case 'shenlun': renderShenlun(container); break;
    case 'search': renderSearch(container); break;
    case 'book': renderBook(container); break;
    case 'common': renderCommon(container); break;
    case 'misc': renderMisc(container); break;
    case 'sport': renderSport(container); break;
    case 'skill': renderSkill(container); break;
    case 'tenmin': renderTenmin(container); break;
    case 'beauty': renderBeauty(container); break;
    case 'pet': renderPet(container); break;
    case 'ledger': renderLedger(container); break;
    case 'country': renderCountry(container); break;
    case 'travel': renderTravel(container); break;
    case 'zimeiti-pet': renderZimeiti(container, 'pet'); break;
    case 'zimeiti-goods': renderZimeiti(container, 'goods'); break;
    case 'ai': renderAi(container); break;
    case 'overview': renderOverview(container); break;
  }
  injectUpdateBadge(container, mod);
}

/* ============================================
   旅行地图 板块
   以 iframe 嵌入 travel-board（独立子应用：合规中国地图 / ECharts / 记录增删改查 / 心情 / 图片 / 回顾）
   ============================================ */
function renderTravel(c) {
  c.innerHTML = '<div class="travel-frame-wrap"><iframe src="travel-board/index.html" style="width:100%;height:100%;min-height:82vh;border:0;display:block" title="旅行地图" loading="lazy"></iframe></div>';
}

/* ============================================
   国情与世界 板块
   两部分(我国国情/世界格局) × 7 维度(资源环境/地理优势/科技/工业技术/宏观政策/未来趋势/战略布局)
   每个维度含 4-5 条深度条目；条目可展开；标记已读复用 isLearned('country', key)
   ============================================ */
let currentCountryPart = 'china';
let currentCountryDim = 'resource';
let currentCountryView = 'cards';   // cards | tracks | frameworks | study

function countryLearnKey(part, dim, entry) { return `country::${part}::${dim}::${entry}`; }

/* 合并主数据条目 + 自动补充条目（按 part/dim 过滤），进度统计统一口径 */
function countryMergedEntries(partId, dimId) {
  const dim = COUNTRY_DIMS[partId] && COUNTRY_DIMS[partId].find(d => d.id === dimId);
  if (!dim) return [];
  const base = dim.entries || [];
  const auto = (typeof COUNTRY_AUTO_ENTRIES !== 'undefined' && Array.isArray(COUNTRY_AUTO_ENTRIES))
    ? COUNTRY_AUTO_ENTRIES.filter(e => e.part === partId && e.dim === dimId) : [];
  return base.concat(auto);
}

function renderCountry(c) {
  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-globe-asia"></i> 国情与世界</h1>
          <div class="subtitle">从资源环境、地理优势、科技、工业技术，到宏观政策、未来趋势与战略布局——层层看懂我国与世界的底牌</div>
        </div>
      </div>

      <div class="country-view-tabs">
        <button class="country-view-tab ${currentCountryView==='cards'?'active':''}" onclick="switchCountryView('cards')"><i class="fas fa-th-large"></i> 卡片浏览</button>
        <button class="country-view-tab ${currentCountryView==='tracks'?'active':''}" onclick="switchCountryView('tracks')"><i class="fas fa-route"></i> 学习路径</button>
        <button class="country-view-tab ${currentCountryView==='frameworks'?'active':''}" onclick="switchCountryView('frameworks')"><i class="fas fa-brain"></i> 思维框架</button>
        <button class="country-view-tab ${currentCountryView==='study'?'active':''}" onclick="switchCountryView('study')"><i class="fas fa-pen-nib"></i> 我的研习</button>
      </div>

      ${currentCountryView==='cards' ? renderCountryCards() : ''}
      ${currentCountryView==='tracks' ? renderCountryTracks() : ''}
      ${currentCountryView==='frameworks' ? renderCountryFrameworks() : ''}
      ${currentCountryView==='study' ? renderCountryStudy() : ''}
    </div>
  `;
  if (currentCountryView==='cards') {
    // part/dim 默认展开第一条
    const first = entriesOf(currentCountryPart, currentCountryDim)[0];
    if (first) toggleCountryEntry(0, true);
  }
}

function entriesOf(part, dim) { return countryMergedEntries(part, dim); }

function renderCountryCards() {
  const part = COUNTRY_PARTS.find(p => p.id === currentCountryPart) || COUNTRY_PARTS[0];
  const dims = COUNTRY_DIMS[currentCountryPart];
  const dim = dims.find(d => d.id === currentCountryDim) || dims[0];
  const entries = countryMergedEntries(currentCountryPart, dim.id);
  const total = entries.length;
  const mastery = loadData('country_mastery', {});
  const cnt = { skim:0, understand:0, recite:0 };
  entries.forEach(e => { const lv = mastery[countryLearnKey(currentCountryPart, dim.id, e.id)]; if (lv) cnt[lv]++; });
  const learned = cnt.skim + cnt.understand + cnt.recite;

  return `
    <div class="country-part-tabs">
      ${COUNTRY_PARTS.map(p => `
        <button class="country-part-tab ${p.id === currentCountryPart ? 'active' : ''}" data-part="${p.id}" onclick="switchCountryPart('${p.id}')">
          <i class="fas ${p.icon}"></i> ${p.label}
        </button>`).join('')}
    </div>

    <p class="country-part-intro">${part.intro}</p>

    <div class="country-dim-nav">
      ${dims.map(d => `
        <button class="country-dim-chip ${d.id === currentCountryDim ? 'active' : ''}" data-dim="${d.id}" onclick="switchCountryDim('${d.id}')">
          <i class="fas ${d.icon}"></i> ${d.label}
        </button>`).join('')}
    </div>

    <div class="country-progress">
      <span class="country-progress-pill">理解度：略读 <strong>${cnt.skim}</strong> · 理解 <strong>${cnt.understand}</strong> · 精读 <strong>${cnt.recite}</strong> / ${total}</span>
      <span class="country-progress-hint"><i class="fas fa-lightbulb"></i> 点开细读，再用"我的思考 + 理解度"把它变成你自己的东西</span>
    </div>

    <div class="country-dim-intro"><i class="fas ${dim.icon}"></i> ${dim.intro}</div>

    <div class="country-entries">
      ${entries.map((e, idx) => {
        const key = countryLearnKey(currentCountryPart, dim.id, e.id);
        const lv = mastery[key] || '';
        const isL = !!lv;
        const reflect = (loadData('country_reflect', {})[key]) || '';
        return `
        <div class="country-entry ${isL ? 'learned' : ''}" id="country-entry-${idx}">
          <div class="country-entry-head" onclick="toggleCountryEntry(${idx})">
            <div class="country-entry-title">
              <span class="country-entry-badge">${idx + 1}</span>
              <div>
                <h3>${e.title}</h3>
                <p class="country-entry-summary">${e.summary}</p>
              </div>
            </div>
            <i class="fas fa-chevron-down country-entry-icon" id="country-entry-icon-${idx}"></i>
          </div>
          <div class="country-entry-body" id="country-entry-body-${idx}">
            ${e.body.map(b => `
              ${b.h ? `<h4 class="country-body-h">${b.h}</h4>` : ''}
              <p>${b.p}</p>
            `).join('')}
            ${e.points && e.points.length ? `
              <div class="country-points">
                <div class="country-points-label"><i class="fas fa-list"></i> 关键要点</div>
                <ul>${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
              </div>` : ''}
            ${e.data ? `<div class="country-data"><i class="fas fa-database"></i> <strong>数据看点：</strong>${e.data}</div>` : ''}
            ${e.source ? `<div class="country-source">📎 ${e.source}</div>` : ''}
            ${e.views ? `
              <div class="country-views">
                ${e.views.macro ? `<div class="cv cv-macro"><div class="cv-h"><i class="fas fa-globe-asia"></i> 宏观视角</div><p>${e.views.macro}</p></div>` : ''}
                ${e.views.nation ? `<div class="cv cv-nation"><div class="cv-h"><i class="fas fa-landmark"></i> 国家视角</div><p>${e.views.nation}</p></div>` : ''}
                ${e.views.people ? `<div class="cv cv-people"><div class="cv-h"><i class="fas fa-users"></i> 人民视角</div><p>${e.views.people}</p></div>` : ''}
              </div>` : ''}
            ${e.question ? `
              <div class="country-question">
                <div class="cq-h"><i class="fas fa-question-circle"></i> 延伸思考</div>
                <p>${e.question}</p>
                ${e.guide ? `<div class="cq-guide">💡 思考提示：${e.guide}</div>` : ''}
              </div>` : ''}

            <div class="country-reflect">
              <div class="cr-label"><i class="fas fa-pen-nib"></i> 我的思考（用宏观 / 国家 / 人民三视角写，越具体越记得住）</div>
              <textarea class="cr-input" placeholder="读到这条时，随手记下你的想法、联想，或想进一步查的资料…" oninput="saveCountryReflect('${key}', this.value)">${escapeHtml(reflect)}</textarea>
            </div>

            <div class="mastery-sel" data-key="${key}">
              <span class="ms-tip">理解到哪一层：</span>
              <button class="ms-btn ${lv==='skim'?'on':''}" onclick="setCountryMastery('${key}','skim',this)">略读</button>
              <button class="ms-btn ${lv==='understand'?'on':''}" onclick="setCountryMastery('${key}','understand',this)">理解</button>
              <button class="ms-btn ${lv==='recite'?'on':''}" onclick="setCountryMastery('${key}','recite',this)">精读</button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}

/* ---------- 学习路径 ---------- */
function renderCountryTracks() {
  const tracks = (typeof COUNTRY_TRACKS !== 'undefined') ? COUNTRY_TRACKS : [];
  return `
    <div class="track-intro">
      <i class="fas fa-route"></i> 别再一张张孤立地看。下面三条主线把零散卡片串成一条因果链——建议按顺序读，每站读完可点"查看原卡"补全细节。读懂一条线，胜过刷十张卡片。
    </div>
    <div class="track-list">
      ${tracks.map(t => `
        <div class="track-card" id="track-${t.id}">
          <div class="track-head">
            <div class="track-title"><i class="fas ${t.icon}"></i> ${t.title}</div>
            <span class="track-scope">${t.scope==='china'?'我国':t.scope==='world'?'世界':'通用'}</span>
          </div>
          <p class="track-desc">${t.intro}</p>
          <div class="track-stations">
            ${t.stations.map((s, i) => `
              <div class="track-station">
                <div class="ts-node">${i+1}</div>
                <div class="ts-body">
                  <div class="ts-title">${s.title}</div>
                  ${s.text.map(p=>`<p class="ts-p">${p}</p>`).join('')}
                  ${s.lens ? `<div class="ts-lens"><i class="fas fa-eye"></i> 视角提示：${s.lens}</div>` : ''}
                  ${s.ref ? `<button class="ts-link" onclick="gotoCountryEntry('${s.ref.part}','${s.ref.dim}','${s.ref.id||''}')"><i class="fas fa-external-link-alt"></i> 查看原卡</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function gotoCountryEntry(part, dim, id) {
  currentCountryView = 'cards';
  currentCountryPart = part;
  currentCountryDim = dim;
  renderCountry($('#main-content'));
  injectUpdateBadge($('#main-content'), 'country');
  if (id) {
    // 展开对应卡片
    const entries = countryMergedEntries(part, dim);
    const idx = entries.findIndex(e => e.id === id);
    if (idx >= 0) setTimeout(() => toggleCountryEntry(idx, true), 50);
  }
  $('#main-content').scrollTop = 0;
}

/* ---------- 思维框架 ---------- */
function renderCountryFrameworks() {
  const fws = (typeof COUNTRY_FRAMEWORKS !== 'undefined') ? COUNTRY_FRAMEWORKS : [];
  return `
    <div class="fw-intro">
      <i class="fas fa-brain"></i> 宏观视角不是"知道很多"，而是"有一套方法把事看清"。下面是可复用的分析透镜——遇到任何一国、一事，套进去就能拆出结构。
    </div>
    <div class="fw-grid">
      ${fws.map(f => `
        <div class="fw-card" id="fw-${f.id}">
          <div class="fw-head"><i class="fas ${f.icon}"></i> ${f.name}</div>
          <div class="fw-def"><strong>定义：</strong>${f.def}</div>
          <div class="fw-row"><span class="fw-k">怎么用</span><span class="fw-v">${f.how}</span></div>
          <div class="fw-row"><span class="fw-k">举例</span><span class="fw-v">${f.example}</span></div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- 我的研习 ---------- */
function renderCountryStudy() {
  const mastery = loadData('country_mastery', {});
  const reflect = loadData('country_reflect', {});
  // 全量条目计数
  let total = 0;
  const cnt = { skim:0, understand:0, recite:0 };
  COUNTRY_PARTS.forEach(p => COUNTRY_DIMS[p.id].forEach(d => countryMergedEntries(p.id, d.id).forEach(e => {
    total++;
    const lv = mastery[countryLearnKey(p.id, d.id, e.id)];
    if (lv) cnt[lv]++;
  })));
  const done = cnt.skim + cnt.understand + cnt.recite;
  const reflectKeys = Object.keys(reflect).filter(k => (reflect[k]||'').trim());

  return `
    <div class="study-intro">
      <i class="fas fa-pen-nib"></i> 学习不是"看过"，而是"变成自己的"。这里汇总你的阅读进度与思考笔记，帮你把读过的政策与资源布局串成自己的体系。
    </div>

    <div class="study-stats">
      <div class="ss-card"><div class="ss-val">${done}/${total}</div><div class="ss-label">已研习条目</div></div>
      <div class="ss-card ss-skim"><div class="ss-val">${cnt.skim}</div><div class="ss-label">略读</div></div>
      <div class="ss-card ss-understand"><div class="ss-val">${cnt.understand}</div><div class="ss-label">理解</div></div>
      <div class="ss-card ss-recite"><div class="ss-val">${cnt.recite}</div><div class="ss-label">精读</div></div>
      <div class="ss-card ss-reflect"><div class="ss-val">${reflectKeys.length}</div><div class="ss-label">思考笔记</div></div>
    </div>


    <div class="study-notes">
      <div class="sn-title"><i class="fas fa-bookmark"></i> 我的思考笔记（${reflectKeys.length}）</div>
      ${reflectKeys.length ? `
        <div class="sn-list">
          ${reflectKeys.map(k => {
            const info = findCountryEntryByKey(k);
            return `
            <div class="sn-item">
              <div class="sn-item-h">${info ? info.entry.title : k} ${info ? `<span class="sn-tag">${info.part==='china'?'我国':'世界'} · ${info.dim}</span>` : ''}</div>
              <div class="sn-item-t">${escapeHtml(reflect[k])}</div>
              ${info ? `<button class="sn-go" onclick="gotoCountryEntry('${info.part}','${info.dim}','${info.id}')"><i class="fas fa-external-link-alt"></i> 回到原卡</button>` : ''}
            </div>`;
          }).join('')}
        </div>
      ` : `<div class="study-empty">还没有笔记。去卡片里写下你的思考，它们会在这里汇总。</div>`}
    </div>
  `;
}

function findCountryEntryByKey(key) {
  const m = key.match(/^country::([^:]+)::([^:]+)::(.+)$/);
  if (!m) return null;
  const [, part, dim, id] = m;
  const e = countryMergedEntries(part, dim).find(x => x.id === id);
  return e ? { part, dim, id, entry: e } : null;
}

function countryReview() {
  showToast('该板块已转为持续阅读模式，无需复盘抽测');
}

function switchCountryView(v) {
  currentCountryView = v;
  renderCountry($('#main-content'));
  injectUpdateBadge($('#main-content'), 'country');
}


function saveCountryReflect(key, val) {
  const map = loadData('country_reflect', {});
  if (val && val.trim()) map[key] = val; else delete map[key];
  saveData('country_reflect', map);
}

function setCountryMastery(key, level, btn) {
  const map = loadData('country_mastery', {});
  if (map[key] === level) { delete map[key]; } else { map[key] = level; }
  saveData('country_mastery', map);
  const nowOn = !!map[key];
  if (isLearned('country', key) !== nowOn) toggleLearned('country', key);
  // 更新同组按钮高亮
  const sel = btn.closest('.mastery-sel');
  if (sel) sel.querySelectorAll('.ms-btn').forEach(b => b.classList.remove('on'));
  if (nowOn) btn.classList.add('on');
  // 更新卡片 learned 态
  const card = btn.closest('.country-entry');
  if (card) card.classList.toggle('learned', nowOn);
  // 更新进度条
  const nEl = $('#country-learned-n');
  if (nEl && currentCountryView === 'cards') {
    const mastery = loadData('country_mastery', {});
    const entries = countryMergedEntries(currentCountryPart, currentCountryDim);
    const c = { skim:0, understand:0, recite:0 };
    entries.forEach(e => { const lv = mastery[countryLearnKey(currentCountryPart, currentCountryDim, e.id)]; if (lv) c[lv]++; });
    nEl.parentElement.innerHTML = `理解度：略读 <strong>${c.skim}</strong> · 理解 <strong>${c.understand}</strong> · 精读 <strong>${c.recite}</strong> / ${entries.length}`;
  }
  showToast(nowOn ? `已标记为「${labelOfLevel(level)}」` : '已取消标记');
}

function labelOfLevel(lv) { return lv==='skim'?'略读':lv==='understand'?'理解':lv==='recite'?'精读':''; }

function switchCountryPart(id) {
  currentCountryPart = id;
  currentCountryDim = COUNTRY_DIMS[id][0].id;
  renderCountry($('#main-content'));
  injectUpdateBadge($('#main-content'), 'country');
}

function switchCountryDim(id) {
  currentCountryDim = id;
  renderCountry($('#main-content'));
  injectUpdateBadge($('#main-content'), 'country');
}

function toggleCountryEntry(idx, force) {
  const body = $('#country-entry-body-' + idx);
  const icon = $('#country-entry-icon-' + idx);
  if (!body) return;
  if (force === true) { body.classList.add('show'); if (icon) icon.classList.add('rot'); }
  else if (force === false) { body.classList.remove('show'); if (icon) icon.classList.remove('rot'); }
  else { body.classList.toggle('show'); if (icon) icon.classList.toggle('rot'); }
}

function toggleLearnCountry(key, idx, btn) {
  toggleLearned('country', key);
  const just = isLearned('country', key);
  btn.classList.toggle('learned', just);
  btn.innerHTML = `<i class="fas ${just ? 'fa-check-circle' : 'fa-circle'}"></i> ${just ? '已读' : '标记已读'}`;
  const card = $('#country-entry-' + idx);
  if (card) card.classList.toggle('learned', just);
  const nEl = $('#country-learned-n');
  if (nEl) {
    const entries = countryMergedEntries(currentCountryPart, currentCountryDim);
    nEl.textContent = entries.filter(e => isLearned('country', countryLearnKey(currentCountryPart, currentCountryDim, e.id))).length;
  }
  showToast(just ? '已标记为已读！' : '已取消标记');
}

/* ============================================
   每日打卡板块
   ============================================ */
function renderCheckin(c) {
  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-check-circle"></i> 每日打卡</h1>
          <div class="subtitle">坚持每一天，进步看得见</div>
        </div>
      </div>

      <div class="checkin-hero">
        <div class="ci-hero-info">
          <div class="ci-hero-num">今日打卡 <strong id="ci-today-count">${getCheckinCount()}</strong> 次</div>
          <div class="ci-hero-sub">连续 <strong id="ci-streak">${computeStreak()}</strong> 天 · 点右侧按钮完成一次真实打卡</div>
        </div>
        <button class="ci-hero-btn" onclick="doCheckin()"><i class="fas fa-check-circle"></i> 打卡</button>
      </div>

      <div class="checkin-tabs">
        <button class="checkin-tab active" data-tab="tasks">任务管理</button>
        <button class="checkin-tab" data-tab="quick">快速打卡</button>
        <button class="checkin-tab" data-tab="habit">习惯打卡</button>
        <button class="checkin-tab" data-tab="plan">今日计划</button>
        <button class="checkin-tab" data-tab="stats">数据统计</button>
      </div>

      <div id="checkin-content"></div>
    </div>
  `;

  $$('.checkin-tab').forEach(t => {
    t.addEventListener('click', () => {
      $$('.checkin-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      currentCheckinTab = t.dataset.tab;
      renderCheckinTab();
    });
  });
  renderCheckinTab();
}

function renderCheckinTab() {
  const c = $('#checkin-content');
  if (currentCheckinTab === 'tasks') renderTasksTab(c);
  else if (currentCheckinTab === 'quick') renderQuickTab(c);
  else if (currentCheckinTab === 'habit') renderHabitTab(c);
  else if (currentCheckinTab === 'plan') renderTodayPlanTab(c);
  else if (currentCheckinTab === 'stats') renderStatsTab(c);
}

function renderTasksTab(c) {
  const tasks = loadData('tasks', []);
  c.innerHTML = `
    <div class="task-input-bar">
      <input type="text" id="task-input" placeholder="输入新任务..." maxlength="100">
      <select id="task-priority">
        <option value="low">低优先级</option>
        <option value="medium" selected>中优先级</option>
        <option value="high">高优先级</option>
      </select>
      <input type="date" id="task-due" value="${today()}">
      <button class="btn-add" onclick="addTask()"><i class="fas fa-plus"></i> 添加任务</button>
    </div>
    <div class="task-list" id="task-list"></div>
  `;
  renderTaskList();
  // 回车添加
  $('#task-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
  });
}

function addTask() {
  const input = $('#task-input');
  const priority = $('#task-priority').value;
  const dueDate = $('#task-due').value;
  const title = input.value.trim();
  if (!title) { showToast('请输入任务内容', 'error'); return; }

  const tasks = loadData('tasks', []);
  tasks.push({
    id: uid(),
    title,
    priority,
    dueDate,
    completed: false,
    subtasks: [],
    createdAt: new Date().toISOString()
  });
  saveData('tasks', tasks);
  input.value = '';
  renderTaskList();
  updateCheckinBadge();
  showToast('任务添加成功');
}

function renderTaskList() {
  const tasks = loadData('tasks', []);
  const list = $('#task-list');
  if (!list) return;

  if (tasks.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fas fa-clipboard-list"></i><p>还没有任务，添加一个开始打卡吧！</p></div>`;
    return;
  }

  // 排序：未完成在前，按优先级和日期排序
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pOrder = { high: 0, medium: 1, low: 2 };
    if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
    return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
  });

  list.innerHTML = tasks.map(t => {
    const todayStr = today();
    let tag = '';
    if (t.dueDate && !t.completed) {
      if (t.dueDate < todayStr) tag = `<span class="tag tag-overdue">已逾期</span>`;
      else if (t.dueDate === todayStr) tag = `<span class="tag tag-today">今天到期</span>`;
      else tag = `<span class="tag tag-future">${t.dueDate}</span>`;
    }

    const subtasksHtml = t.subtasks.length > 0 ? `
      <div class="subtask-list">
        ${t.subtasks.map(s => `
          <div class="subtask-item">
            <div class="subtask-checkbox ${s.done ? 'checked' : ''}" onclick="toggleSubtask('${t.id}','${s.id}')"></div>
            <span style="${s.done ? 'text-decoration:line-through;opacity:0.5' : ''}">${s.title}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    return `
      <div class="task-item ${t.completed ? 'completed' : ''} priority-${t.priority}">
        <div class="task-checkbox ${t.completed ? 'checked' : ''}" onclick="toggleTask('${t.id}')"></div>
        <div class="task-body">
          <div class="task-title">${t.title}</div>
          <div class="task-meta">
            ${tag}
            <span><i class="fas fa-${t.priority === 'high' ? 'exclamation-circle' : t.priority === 'medium' ? 'circle' : 'minus-circle'}"></i> ${t.priority === 'high' ? '高' : t.priority === 'medium' ? '中' : '低'}优先级</span>
          </div>
          ${subtasksHtml}
        </div>
        <div class="task-actions">
          <button onclick="addSubtaskPrompt('${t.id}')" title="添加子任务"><i class="fas fa-plus"></i></button>
          <button onclick="deleteTask('${t.id}')" title="删除"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleTask(id) {
  const tasks = loadData('tasks', []);
  const t = tasks.find(x => x.id === id);
  if (t) {
    t.completed = !t.completed;
    saveData('tasks', tasks);
    renderTaskList();
    if (t.completed) {
      recordCheckin();
      recordActivity('checkin', 'task', 1);
      showToast('打卡完成，继续加油！');
    }
  }
}

function addSubtaskPrompt(taskId) {
  const title = window.prompt('输入子任务名称：');
  if (title && title.trim()) {
    const tasks = loadData('tasks', []);
    const t = tasks.find(x => x.id === taskId);
    if (t) {
      t.subtasks.push({ id: uid(), title: title.trim(), done: false });
      saveData('tasks', tasks);
      renderTaskList();
      showToast('子任务已添加');
    }
  }
}

function toggleSubtask(taskId, subId) {
  const tasks = loadData('tasks', []);
  const t = tasks.find(x => x.id === taskId);
  if (t) {
    const s = t.subtasks.find(x => x.id === subId);
    if (s) {
      s.done = !s.done;
      saveData('tasks', tasks);
      renderTaskList();
    }
  }
}

function deleteTask(id) {
  if (!confirm('确定删除这个任务吗？')) return;
  let tasks = loadData('tasks', []);
  tasks = tasks.filter(t => t.id !== id);
  saveData('tasks', tasks);
  renderTaskList();
  updateCheckinBadge();
  showToast('任务已删除');
}

// 记录今日打卡
function recordCheckin() {
  const todayStr = today();
  const checkins = loadData('checkins', []);
  let todayRecord = checkins.find(c => c.date === todayStr);
  if (!todayRecord) {
    todayRecord = { date: todayStr, items: [] };
    checkins.push(todayRecord);
  }
  // 不重复添加
  if (!todayRecord.items.includes('task_complete')) {
    todayRecord.items.push('task_complete');
    saveData('checkins', checkins);
    updateStreak();
  }
}

// 快速打卡
function renderQuickTab(c) {
  const quickTags = [
    { id: 'read', label: '读书', icon: 'fa-book-open' },
    { id: 'news', label: '看报纸/新闻', icon: 'fa-newspaper' },
    { id: 'exercise', label: '运动锻炼', icon: 'fa-dumbbell' },
    { id: 'english', label: '学英语', icon: 'fa-language' },
    { id: 'finance', label: '学金融', icon: 'fa-chart-line' },
    { id: 'meditate', label: '冥想/放松', icon: 'fa-spa' },
    { id: 'water', label: '喝水8杯', icon: 'fa-glass-water' },
    { id: 'early', label: '早起', icon: 'fa-sun' },
    { id: 'sleep', label: '早睡', icon: 'fa-moon' },
    { id: 'journal', label: '写日记', icon: 'fa-pen-fancy' },
    { id: 'cook', label: '做饭', icon: 'fa-utensils' },
    { id: 'walk', label: '散步', icon: 'fa-person-walking' },
    { id: 'music', label: '听音乐', icon: 'fa-music' },
    { id: 'learn', label: '学习新技能', icon: 'fa-graduation-cap' },
    { id: 'family', label: '陪伴家人', icon: 'fa-house-user' },
    { id: 'tidy', label: '整理房间', icon: 'fa-broom' }
  ];

  const todayStr = today();
  const checkins = loadData('checkins', []);
  let todayRecord = checkins.find(c => c.date === todayStr) || { date: todayStr, items: [] };
  const doneItems = todayRecord.items;
  const customMap = loadData('quick_custom', {});
  const quickLabel = (id) => { const t = quickTags.find(x => x.id === id); return t ? t.label : (customMap[id] || id); };
  const customKeys = Object.keys(customMap);

  c.innerHTML = `
    <div class="quick-checkin">
      <h3><i class="fas fa-bolt"></i> 今日打卡 — ${new Date().getMonth()+1}月${new Date().getDate()}日</h3>
      <p style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">点击下方标签完成打卡，每天可重复勾选，养成好习惯！</p>
      <div class="quick-tags" id="quick-tags">
        ${quickTags.map(t => `
          <div class="quick-tag ${doneItems.includes(t.id) ? 'done' : ''}" data-id="${t.id}" onclick="toggleQuickCheckin('${t.id}')">
            <i class="fas ${t.icon}"></i> ${t.label}
          </div>
        `).join('')}
      </div>
    </div>

    <div class="quick-checkin">
      <h3><i class="fas fa-pen"></i> 自定义打卡项</h3>
      <p style="color:var(--text-secondary);font-size:13px;margin-bottom:12px;">想打卡的内容这里没有？自己加一个，下次直接在下方点选。</p>
      <div class="quick-custom-add">
        <input type="text" id="custom-quick-input" placeholder="如：练琴30分钟 / 背20个单词" maxlength="20">
        <button class="btn-add" onclick="addCustomCheckin()"><i class="fas fa-plus"></i> 添加</button>
      </div>
      <div class="quick-tags" id="quick-custom-tags" style="margin-top:12px;">
        ${customKeys.length > 0 ? customKeys.map(id => `
          <div class="quick-tag quick-tag-custom ${doneItems.includes(id) ? 'done' : ''}" data-id="${id}" onclick="toggleQuickCheckin('${id}')">
            <i class="fas fa-plus"></i> ${customMap[id]}
          </div>
        `).join('') : '<span class="quick-custom-empty">还没有自定义项，先在上面添加吧～</span>'}
      </div>
    </div>

    <div class="quick-checkin">
      <h3><i class="fas fa-star"></i> 今日已打卡 (${doneItems.length})</h3>
      ${doneItems.length > 0 ? `
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${doneItems.map(id => `
            <span class="quick-tag done" style="cursor:default;">
              <i class="fas ${(quickTags.find(t=>t.id===id)||{}).icon || 'fa-check'}"></i> ${quickLabel(id)}
            </span>
          `).join('')}
        </div>
      ` : '<p style="color:var(--text-light);font-size:14px;">还没有打卡，快来开始吧！</p>'}
    </div>
  `;

  // 回车添加自定义项
  const ci = $('#custom-quick-input');
  if (ci) ci.addEventListener('keypress', e => { if (e.key === 'Enter') addCustomCheckin(); });
}

function addCustomCheckin() {
  const input = $('#custom-quick-input');
  const label = input ? input.value.trim() : '';
  if (!label) { showToast('请输入自定义打卡内容', 'error'); return; }
  const customMap = loadData('quick_custom', {});
  const id = 'c-' + uid();
  customMap[id] = label;
  saveData('quick_custom', customMap);
  // 自动勾选为今日已打卡
  const todayStr = today();
  const checkins = loadData('checkins', []);
  let todayRecord = checkins.find(c => c.date === todayStr);
  if (!todayRecord) { todayRecord = { date: todayStr, items: [] }; checkins.push(todayRecord); }
  if (!todayRecord.items.includes(id)) todayRecord.items.push(id);
  saveData('checkins', checkins);
  updateStreak();
  renderQuickTab($('#checkin-content'));
  showToast('已添加并打卡：' + label);
}

function toggleQuickCheckin(id) {
  const todayStr = today();
  const checkins = loadData('checkins', []);
  let todayRecord = checkins.find(c => c.date === todayStr);
  if (!todayRecord) {
    todayRecord = { date: todayStr, items: [] };
    checkins.push(todayRecord);
  }
  // 自定义项首次勾选时确保已存在映射
  const customMap = loadData('quick_custom', {});
  if (id.startsWith('c-') && !customMap[id]) customMap[id] = id.replace('c-', '');
  const idx = todayRecord.items.indexOf(id);
  if (idx > -1) {
    todayRecord.items.splice(idx, 1);
  } else {
    todayRecord.items.push(id);
  }
  saveData('checkins', checkins);
  updateStreak();
  if (idx === -1) recordActivity('checkin', 'quick', 1);
  renderQuickTab($('#checkin-content'));
}

// 习惯打卡（每天固定坚持的小事，统计周/月/季/年次数）
const HABIT_PRESETS = [
  { key: 'early',        label: '早起',     icon: '🌅' },
  { key: 'english',      label: '背英语',   icon: '🔤' },
  { key: 'morning_read', label: '晨读',     icon: '📖' },
  { key: 'cat',          label: '逗猫',     icon: '🐱' },
  { key: 'study',        label: '学习',     icon: '📚' },
  { key: 'water',        label: '喝水8杯',  icon: '💧' },
  { key: 'exercise',     label: '运动',     icon: '🏃' },
  { key: 'read',         label: '读书',     icon: '📕' },
  { key: 'ledger',       label: '记账',     icon: '🧾' },
  { key: 'meditate',     label: '冥想',     icon: '🧘' },
  { key: 'journal',      label: '写日记',   icon: '✍️' }
];
function getHabitDefs() { return HABIT_PRESETS.concat(loadData('habit_custom', [])); }
function getHabits() { return loadData('habits', {}); }
function toggleHabit(key) {
  const h = getHabits();
  const t = today();
  h[t] = h[t] || [];
  const idx = h[t].indexOf(key);
  if (idx > -1) h[t].splice(idx, 1); else h[t].push(key);
  saveData('habits', h);
  recordActivity('checkin', 'habit', 1);
  renderHabitTab($('#checkin-content'));
}
function addCustomHabit() {
  const inp = $('#habit-custom-input'); const label = inp ? inp.value.trim() : '';
  if (!label) { showToast('请输入习惯名称', 'error'); return; }
  const custom = loadData('habit_custom', []);
  custom.push({ key: 'h-' + uid(), label, icon: '✨' });
  saveData('habit_custom', custom);
  renderHabitTab($('#checkin-content'));
  showToast('已添加习惯：' + label);
}
function renderHabitTab(c) {
  const h = getHabits();
  const t = today();
  const done = h[t] || [];
  const now = new Date();
  const wc = {}, mc = {}, qc = {}, yc = {};
  Object.keys(h).forEach(d => {
    const dt = new Date(d);
    const diff = Math.floor((now - dt) / 86400000);
    h[d].forEach(k => {
      if (diff <= 7) wc[k] = (wc[k] || 0) + 1;
      if (diff <= 30) mc[k] = (mc[k] || 0) + 1;
      if (diff <= 90) qc[k] = (qc[k] || 0) + 1;
      if (dt.getFullYear() === now.getFullYear()) yc[k] = (yc[k] || 0) + 1;
    });
  });
  const defs = getHabitDefs();
  c.innerHTML = `
    <div class="habit-head">
      <h3><i class="fas fa-star"></i> 习惯打卡（每天固定完成）</h3>
      <p style="color:var(--text-secondary);font-size:13px;">这些是你想天天坚持的小事，点一下即记录；下方自动统计 周 / 月 / 季 / 年 各做了多少次。</p>
    </div>
    <div class="habit-grid">
      ${defs.map(hb => `
        <div class="habit-chip ${done.includes(hb.key) ? 'done' : ''}" onclick="toggleHabit('${hb.key}')">
          <span class="habit-ico">${hb.icon}</span> ${hb.label}
          <span class="habit-count">周${wc[hb.key] || 0}·月${mc[hb.key] || 0}·年${yc[hb.key] || 0}</span>
        </div>`).join('')}
    </div>
    <div class="quick-custom-add" style="margin-top:12px;">
      <input type="text" id="habit-custom-input" placeholder="自定义习惯，如：练琴30分" maxlength="20">
      <button class="btn-add" onclick="addCustomHabit()"><i class="fas fa-plus"></i> 添加</button>
    </div>
    <div class="habit-today-done">今天已完成 ${done.length}/${defs.length} 个习惯</div>`;
}
function renderTodayPlanTab(c) {
  const tasks = loadData('tasks', []);
  const t = today();
  const planTasks = tasks.filter(x => x.dueDate === t).sort((a, b) => {
    const po = { high: 0, medium: 1, low: 2 };
    return (po[a.priority] || 1) - (po[b.priority] || 1);
  });
  const important = planTasks.filter(x => x.priority === 'high');
  const normal = planTasks.filter(x => x.priority !== 'high');
  c.innerHTML = `
    <div class="plan-day-head">
      <h3><i class="fas fa-list-check"></i> 今日计划（${t}）</h3>
      <p style="color:var(--text-secondary);font-size:13px;">勾选完成；未完成的可以「延后到明天」。按轻重缓急分组，一眼看清优先级。</p>
      <div class="task-input-bar" style="flex-wrap:wrap;gap:10px;margin-top:8px;">
        <input type="text" id="plan-day-input" placeholder="添加一条今日计划" maxlength="80" style="flex:1;min-width:180px;">
        <select id="plan-day-prio">
          <option value="high">重要</option><option value="medium" selected>一般</option><option value="low">较不重要</option>
        </select>
        <button class="btn-add" onclick="addTodayPlan()"><i class="fas fa-plus"></i> 添加</button>
      </div>
    </div>
    <div class="plan-group">
      <div class="plan-group-title important"><i class="fas fa-exclamation-circle"></i> 较重要（${important.length}）</div>
      ${planGroupHtml(important)}
    </div>
    <div class="plan-group">
      <div class="plan-group-title"><i class="fas fa-circle"></i> 较不重要（${normal.length}）</div>
      ${planGroupHtml(normal)}
    </div>`;
  const inp = $('#plan-day-input');
  if (inp) inp.addEventListener('keypress', e => { if (e.key === 'Enter') addTodayPlan(); });
}
function planGroupHtml(arr) {
  if (!arr.length) return '<div class="pet-empty">这一组暂无计划</div>';
  return arr.map(t => `
    <div class="plan-day-item ${t.completed ? 'done' : ''}">
      <div class="task-checkbox ${t.completed ? 'checked' : ''}" onclick="togglePlanTaskToday('${t.id}')"></div>
      <div class="plan-day-text">${escapeHtml(t.title)}</div>
      ${t.completed ? '<span class="plan-done-tag">已完成</span>' : `<button class="plan-defer" onclick="deferTask('${t.id}')">延后到明天</button>`}
      <button class="plan-del" onclick="deleteTask('${t.id}')" title="删除"><i class="fas fa-trash"></i></button>
    </div>`).join('');
}
function addTodayPlan() {
  const inp = $('#plan-day-input'); const title = inp ? inp.value.trim() : '';
  if (!title) { showToast('请输入计划内容', 'error'); return; }
  const priority = $('#plan-day-prio').value;
  const tasks = loadData('tasks', []);
  tasks.push({ id: uid(), title, priority, dueDate: today(), completed: false, subtasks: [], createdAt: new Date().toISOString() });
  saveData('tasks', tasks);
  updateCheckinBadge();
  renderTodayPlanTab($('#checkin-content'));
  showToast('已加入今日计划');
}
function togglePlanTaskToday(id) {
  const tasks = loadData('tasks', []);
  const t = tasks.find(x => x.id === id);
  if (t) {
    t.completed = !t.completed;
    saveData('tasks', tasks);
    if (t.completed) { recordCheckin(); recordActivity('checkin', 'task', 1); }
    renderTodayPlanTab($('#checkin-content'));
  }
}
function deferTask(id) {
  const tasks = loadData('tasks', []);
  const t = tasks.find(x => x.id === id);
  if (t) {
    const d = new Date(t.dueDate || today()); d.setDate(d.getDate() + 1);
    t.dueDate = d.toISOString().split('T')[0];
    t.completed = false;
    saveData('tasks', tasks);
    showToast('已延后到 ' + t.dueDate);
    renderTodayPlanTab($('#checkin-content'));
  }
}

// 数据统计图表
function renderStatsTab(c) {
  c.innerHTML = `
    <div class="chart-grid">
      <div class="chart-card">
        <h3><i class="fas fa-calendar-week"></i> 本周打卡</h3>
        <div class="chart-container"><canvas id="chart-week"></canvas></div>
      </div>
      <div class="chart-card">
        <h3><i class="fas fa-calendar-alt"></i> 本月趋势</h3>
        <div class="chart-container"><canvas id="chart-month"></canvas></div>
      </div>
      <div class="chart-card">
        <h3><i class="fas fa-calendar-check"></i> 年度总览</h3>
        <div class="chart-container"><canvas id="chart-year"></canvas></div>
      </div>
    </div>
  `;

  setTimeout(renderCharts, 100);
}

function renderCharts() {
  const checkins = loadData('checkins', []);
  const tasks = loadData('tasks', []);

  // 周度图表 - 最近7天打卡数
  const weekLabels = [];
  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    weekLabels.push(`${d.getMonth()+1}/${d.getDate()}`);
    const record = checkins.find(c => c.date === ds);
    weekData.push(record ? record.items.length : 0);
  }

  charts.week = new Chart($('#chart-week'), {
    type: 'bar',
    data: {
      labels: weekLabels,
      datasets: [{
        label: '打卡数',
        data: weekData,
        backgroundColor: 'rgba(108,92,231,0.6)',
        borderColor: 'rgba(108,92,231,1)',
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: chartOptions('打卡项目数', '#6C5CE7')
  });

  // 月度图表 - 本月每日打卡趋势
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const monthLabels = [];
  const monthData = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const ds = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    monthLabels.push(i);
    const record = checkins.find(c => c.date === ds);
    monthData.push(record ? record.items.length : 0);
  }

  charts.month = new Chart($('#chart-month'), {
    type: 'line',
    data: {
      labels: monthLabels,
      datasets: [{
        label: '打卡数',
        data: monthData,
        borderColor: 'rgba(0,184,148,1)',
        backgroundColor: 'rgba(0,184,148,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 2
      }]
    },
    options: chartOptions('每日打卡趋势', '#00B894')
  });

  // 年度图表 - 月度任务完成数
  const yearLabels = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const yearData = new Array(12).fill(0);
  checkins.forEach(c => {
    const m = parseInt(c.date.split('-')[1]) - 1;
    yearData[m] += c.items.length;
  });

  charts.year = new Chart($('#chart-year'), {
    type: 'doughnut',
    data: {
      labels: yearLabels,
      datasets: [{
        data: yearData,
        backgroundColor: [
          '#FF6B6B','#FF8E53','#FECA57','#48DBFB','#1DD1A1','#5F27CD',
          '#6C5CE7','#A29BFE','#FD79A8','#FDCB6E','#00CEC9','#0984E3'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { font: { size: 10 }, padding: 8 } }
      }
    }
  });
}

function chartOptions(label, color) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `${label}: ${ctx.parsed.y || ctx.parsed}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { beginAtZero: true, ticks: { font: { size: 10 }, stepSize: 1 } }
    }
  };
}

/* ============================================
   每日复盘板块
   ============================================ */
function renderReview(c) {
  const moods = ['😊','😢','😡','😱','😴','🤔','😍','😰'];
  const emojis = ['✨','🔥','💪','📚','☕','🌙','⭐','🌈','💡','🎯','🏃','🎵','🌸','🍀','🦁','🦋','💧','☀️','🌧️','❤️','🎉','📝','🌱','🏆'];

  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-pen-nib"></i> 每日复盘</h1>
          <div class="subtitle">记录今天的自己，遇见更好的明天</div>
        </div>
      </div>

      <div class="review-container">
        <div class="review-card">
          <div class="review-date"><i class="fas fa-calendar-day"></i> ${new Date().toLocaleDateString('zh-CN', {year:'numeric',month:'long',day:'numeric',weekday:'long'})}</div>

          <h3 style="margin-bottom:10px;font-size:15px;">今天的心情</h3>
          <div class="mood-selector" id="mood-selector">
            ${moods.map(m => `<button class="mood-btn" data-mood="${m}">${m}</button>`).join('')}
          </div>

          <h3 style="margin-bottom:10px;font-size:15px;">添加表情符号</h3>
          <div class="emoji-picker" id="emoji-picker">
            ${emojis.map(e => `<button class="emoji-btn" data-emoji="${e}">${e}</button>`).join('')}
          </div>

          <h3 style="margin-bottom:10px;font-size:15px;">今日复盘</h3>
          <textarea class="review-textarea" id="review-text" placeholder="今天发生了什么？有什么收获和感悟？记录下属于你的一天..."></textarea>

          <div class="image-upload-area">
            <h4><i class="fas fa-images"></i> 添加图片（手机相册/截图）</h4>
            <label class="btn-upload">
              <i class="fas fa-cloud-upload-alt"></i> 选择图片
              <input type="file" accept="image/*" multiple style="display:none" id="review-img-input">
            </label>
            <div class="image-preview-grid" id="review-img-preview"></div>
          </div>

          <button class="btn-save" onclick="saveReview()">
            <i class="fas fa-save"></i> 保存今日复盘
          </button>
        </div>

        <div class="review-history" id="review-history">
          <div class="review-history-header">
            <h3 style="font-size:18px;"><i class="fas fa-history"></i> 历史复盘</h3>
            <div class="review-stats" id="review-stats"></div>
          </div>
          <div class="review-search">
            <i class="fas fa-search"></i>
            <input type="text" id="review-search-input" placeholder="搜索复盘内容关键词..." oninput="filterReviewHistory(this.value)">
          </div>
          <div id="review-history-list"></div>
        </div>
      </div>
    </div>
  `;

  // 重置状态
  reviewImages = [];
  reviewSelectedMood = '';
  reviewSelectedEmojis = [];

  // 心情选择
  $$('.mood-btn').forEach(b => {
    b.addEventListener('click', () => {
      $$('.mood-btn').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      reviewSelectedMood = b.dataset.mood;
    });
  });

  // 表情选择（多选）
  $$('.emoji-btn').forEach(b => {
    b.addEventListener('click', () => {
      b.classList.toggle('selected');
      const emoji = b.dataset.emoji;
      const idx = reviewSelectedEmojis.indexOf(emoji);
      if (idx > -1) reviewSelectedEmojis.splice(idx, 1);
      else reviewSelectedEmojis.push(emoji);
    });
  });

  // 图片上传
  $('#review-img-input').addEventListener('change', handleImageUpload);

  // 渲染历史
  renderReviewHistory();
}

function handleImageUpload(e) {
  const files = e.target.files;
  const maxImages = 6;
  if (reviewImages.length + files.length > maxImages) {
    showToast(`最多上传${maxImages}张图片`, 'error');
    return;
  }

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // 压缩图片
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 800;
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = height * maxSize / width;
            width = maxSize;
          } else {
            width = width * maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        reviewImages.push(canvas.toDataURL('image/jpeg', 0.7));
        renderReviewImages();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
}

function renderReviewImages() {
  const grid = $('#review-img-preview');
  if (!grid) return;
  grid.innerHTML = reviewImages.map((src, i) => `
    <div class="image-preview-item">
      <img src="${src}" onclick="previewImage('${src}')">
      <button class="remove-img" onclick="removeReviewImage(${i})">&times;</button>
    </div>
  `).join('');
}

function removeReviewImage(idx) {
  reviewImages.splice(idx, 1);
  renderReviewImages();
}

function previewImage(src) {
  $('#modal-image').src = src;
  $('#image-modal').classList.add('show');
}

function closeImageModal() {
  $('#image-modal').classList.remove('show');
}

function saveReview() {
  const text = $('#review-text').value.trim();
  if (!text && !reviewSelectedMood && reviewImages.length === 0) {
    showToast('请写点什么再保存吧', 'error');
    return;
  }

  const reviews = loadData('reviews', []);
  const todayStr = today();

  // 检查是否已有今天的复盘
  const existingIdx = reviews.findIndex(r => r.date === todayStr);
  const reviewData = {
    id: uid(),
    date: todayStr,
    datetime: new Date().toISOString(),
    mood: reviewSelectedMood,
    emojis: reviewSelectedEmojis,
    text,
    images: [...reviewImages]
  };
  recordActivity('review', 'entry', 1);

  if (existingIdx > -1) {
    reviews[existingIdx] = reviewData;
    showToast('今日复盘已更新');
  } else {
    reviews.unshift(reviewData);
    showToast('复盘保存成功！');
  }

  saveData('reviews', reviews);
  renderReviewHistory();
  $('#review-text').value = '';
  reviewImages = [];
  renderReviewImages();
  $$('.mood-btn').forEach(x => x.classList.remove('selected'));
  $$('.emoji-btn').forEach(x => x.classList.remove('selected'));
  reviewSelectedMood = '';
  reviewSelectedEmojis = [];
}

function renderReviewHistory() {
  const reviews = loadData('reviews', []);
  const list = $('#review-history-list');
  if (!list) return;
  const statsEl = $('#review-stats');

  // 统计：累计篇数 / 连续天数 / 本月篇数
  if (statsEl) {
    const total = reviews.length;
    const now = new Date();
    const thisMonth = reviews.filter(r => {
      const d = new Date(r.datetime || r.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
    const dateSet = new Set(reviews.map(r => r.date).filter(Boolean));
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (!dateSet.has(today())) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (dateSet.has(`${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,'0')}-${String(cursor.getDate()).padStart(2,'0')}`)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    statsEl.innerHTML = `
      <div class="stat-chip"><strong>${total}</strong> 篇累计</div>
      <div class="stat-chip"><strong>${streak}</strong> 天连续</div>
      <div class="stat-chip"><strong>${thisMonth}</strong> 篇本月</div>
    `;
  }

  // 关键词过滤
  const kw = (reviewSearchKeyword || '').trim().toLowerCase();
  const filtered = kw ? reviews.filter(r => (r.text || '').toLowerCase().includes(kw)) : reviews;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fas fa-book"></i><p>${kw ? '没有匹配的记录，换个关键词试试' : '还没有历史复盘记录，保存第一篇吧'}</p></div>`;
    return;
  }

  // 首次渲染：默认展开今天（最新一天）
  if (!reviewDayInit) {
    reviewExpandedDays = new Set();
    const latest = filtered[0] ? (filtered[0].date) : today();
    reviewExpandedDays.add(latest);
    reviewDayInit = true;
  }

  // 按「天」分组（每天一篇复盘），倒序
  const dayMap = {};
  filtered.forEach(r => {
    const key = r.date;
    if (!dayMap[key]) dayMap[key] = r;
  });
  const sortedDays = Object.keys(dayMap).sort((a, b) => b.localeCompare(a));

  let html = '';
  sortedDays.forEach(day => {
    const r = dayMap[day];
    const rid = r.id || r.datetime;
    const d = new Date(r.datetime || r.date);
    const weekNames = ['周日','周一','周二','周三','周四','周五','周六'];
    const dateStr = `${d.getMonth()+1}月${d.getDate()}日 ${weekNames[d.getDay()]}`;
    const isToday = (day === today());
    const expanded = reviewExpandedDays.has(day);
    const text = r.text || '';
    const isLong = text.length > 80;
    const previewText = isLong ? text.slice(0, 80) + '…' : text;

    html += `
      <div class="review-day-group ${expanded ? 'open' : 'closed'}">
        <div class="review-day-header" onclick="toggleReviewDay('${day}')">
          <div class="review-day-title">
            <i class="fas fa-chevron-${expanded ? 'down' : 'right'} review-day-caret"></i>
            <span>${dateStr}</span>
            ${isToday ? '<span class="review-today-badge">今天</span>' : ''}
            ${r.mood ? `<span class="review-mood">${r.mood}</span>` : ''}
          </div>
          <span class="review-day-count">${text.length}字${r.images && r.images.length ? ' · ' + r.images.length + '图' : ''}</span>
        </div>
        <div class="review-day-body" style="${expanded ? '' : 'display:none;'}">
          ${r.emojis && r.emojis.length > 0 ? `<div style="font-size:20px;margin-bottom:8px;">${r.emojis.join(' ')}</div>` : ''}
          ${text ? `<p class="review-text-content">${text}</p>` : '<p style="color:var(--text-light);font-size:13px;">（当天只记了心情/图片）</p>'}
          ${r.images && r.images.length > 0 ? `
            <div class="review-images">
              ${r.images.map(img => `<img src="${img}" onclick="previewImage('${img}')">`).join('')}
            </div>
          ` : ''}
          <div class="review-day-actions">
            <button class="review-del" onclick="deleteReview('${rid}')"><i class="fas fa-trash"></i> 删除这篇</button>
          </div>
        </div>
      </div>
    `;
  });
  list.innerHTML = html;
}

function toggleReviewDay(day) {
  if (reviewExpandedDays.has(day)) reviewExpandedDays.delete(day);
  else reviewExpandedDays.add(day);
  renderReviewHistory();
}

function filterReviewHistory(kw) {
  reviewSearchKeyword = kw;
  renderReviewHistory();
}

function toggleReviewExpand(btn) {
  const p = btn.previousElementSibling;
  if (p.classList.contains('collapsed')) {
    p.classList.remove('collapsed');
    btn.textContent = '收起';
  } else {
    p.classList.add('collapsed');
    btn.textContent = '展开全文';
  }
}

function deleteReview(id) {
  if (!confirm('确定删除这篇复盘吗？删除后无法恢复。')) return;
  let reviews = loadData('reviews', []);
  reviews = reviews.filter(r => r.id !== id && r.datetime !== id);
  saveData('reviews', reviews);
  renderReviewHistory();
  showToast('已删除该复盘');
}

/* ============================================
   英语角板块（增强版 - 含学习进度追踪+每日推荐）
   ============================================ */
function renderEnglish(c) {
  // 计算总进度
  const totalWords = getAllBooks().reduce((s, b) => s + getBookWords(b.id).length, 0);
  const learnedWords = getLearned('words').length;
  const totalGrammar = GRAMMAR_DATA.length;
  const learnedGrammar = getLearned('grammar').length;
  const totalSpeaking = SPEAKING_DATA.length;
  const learnedSpeaking = getLearned('speaking').length;
  const totalReading = READING_DATA.length;
  const learnedReading = getLearned('reading').length;
  const totalAll = totalWords + totalGrammar + totalSpeaking + totalReading;
  const learnedAll = learnedWords + learnedGrammar + learnedSpeaking + learnedReading;
  const overallPct = totalAll > 0 ? Math.round(learnedAll / totalAll * 100) : 0;

  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-language"></i> 英语角</h1>
          <div class="subtitle">从零开始，每天进步一点点</div>
        </div>
        <div class="overall-progress-badge">
          <div class="progress-ring" style="--pct:${overallPct}">
            <span>${overallPct}%</span>
          </div>
          <div class="progress-label">总学习进度</div>
        </div>
      </div>

      <div class="eng-dashboard" id="eng-dashboard">
        <div class="dashboard-title"><i class="fas fa-bullseye"></i> 今日学习目标</div>
        <div class="dashboard-grid" id="dashboard-grid"></div>
      </div>

      <div class="english-tabs">
        <button class="eng-tab active" data-tab="today"><i class="fas fa-star"></i> 今日推荐</button>
        <button class="eng-tab" data-tab="grammar"><i class="fas fa-book"></i> 语法基础</button>
        <button class="eng-tab" data-tab="words"><i class="fas fa-spell-check"></i> 每日单词</button>
        <button class="eng-tab" data-tab="speaking"><i class="fas fa-microphone"></i> 口语跟读</button>
        <button class="eng-tab" data-tab="practice"><i class="fas fa-headphones-alt"></i> 每日跟读</button>
        <button class="eng-tab" data-tab="reading"><i class="fas fa-book-reader"></i> 经典阅读</button>
        <button class="eng-tab" data-tab="bedtime"><i class="fas fa-moon"></i> 睡前跟读</button>
        <button class="eng-tab" data-tab="stats"><i class="fas fa-chart-bar"></i> 学习统计</button>
      </div>

      <div id="wordbook-bar" class="wordbook-bar"></div>
      <div id="english-content"></div>
    </div>
  `;

  // 渲染仪表盘
  renderEngDashboard();

  $$('.eng-tab').forEach(t => {
    t.addEventListener('click', () => {
      $$('.eng-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      currentEngTab = t.dataset.tab;
      renderEngTab();
    });
  });
  renderWordBookBar();
  renderEngTab();
}

function renderEngDashboard() {
  const rec = getDailyRecommend();
  const grid = $('#dashboard-grid');
  if (!grid) return;

  const cards = [
    { icon: 'fa-spell-check', label: '今日单词', value: rec.words.length, total: 5, color: '#6C5CE7', type: 'words' },
    { icon: 'fa-book', label: '语法主题', value: rec.grammarId ? 1 : 0, total: 1, color: '#00B894', type: 'grammar' },
    { icon: 'fa-microphone', label: '口语跟读', value: rec.speakingIdx !== null ? 1 : 0, total: 1, color: '#FD79A8', type: 'speaking' },
    { icon: 'fa-book-reader', label: '阅读文章', value: rec.readingIdx !== null ? 1 : 0, total: 1, color: '#FDCB6E', type: 'reading' }
  ];

  grid.innerHTML = cards.map(card => `
    <div class="dash-card" style="--card-color:${card.color}">
      <i class="fas ${card.icon}"></i>
      <div class="dash-info">
        <div class="dash-value">${card.value}/${card.total}</div>
        <div class="dash-label">${card.label}</div>
      </div>
    </div>
  `).join('');
}

function renderEngTab() {
  const c = $('#english-content');
  if (currentEngTab === 'today') renderTodayLearning(c);
  else if (currentEngTab === 'grammar') renderGrammar(c);
  else if (currentEngTab === 'words') renderWords(c);
  else if (currentEngTab === 'speaking') renderSpeaking(c);
  else if (currentEngTab === 'practice') renderPractice(c);
  else if (currentEngTab === 'reading') renderReading(c);
  else if (currentEngTab === 'bedtime') renderBedtime(c);
  else if (currentEngTab === 'stats') renderEnglishStats(c);
}

// 今日推荐学习
function renderTodayLearning(c) {
  const rec = getDailyRecommend();
  const allDone = rec.words.length === 0 && !rec.grammarId && rec.speakingIdx === null && rec.readingIdx === null;

  if (allDone) {
    c.innerHTML = `
      <div class="today-done-banner">
        <div style="font-size:48px;margin-bottom:12px;">🎉</div>
        <h2>太棒了！你已经学完了所有内容！</h2>
        <p>新内容每周自动更新，敬请期待！<br>你也可以去各分类中复习已学内容。</p>
        <button class="btn-reset-rec" onclick="resetDailyRecommend()"><i class="fas fa-redo"></i> 重新生成今日推荐</button>
      </div>
    `;
    return;
  }

  let html = `<div class="today-learning">`;

  // 今日单词
  if (rec.words.length > 0) {
    html += `
      <div class="today-section">
        <h3><i class="fas fa-spell-check" style="color:#6C5CE7"></i> 今日单词 (${rec.words.length})</h3>
        <div class="today-words">
          ${rec.words.map(w => `
            <div class="word-card ${isWordLearned(w.bookId, w.en) ? 'learned' : ''}">
              <div class="word-en">${w.en}</div>
              <div class="word-phonetic">${w.phonetic}</div>
              <div class="word-cn">${w.cn}</div>
              ${w.bookName ? `<span class="word-level-tag">${w.bookName}</span>` : ''}
              <div class="word-actions">
                <button onclick="speakWord('${w.en}')"><i class="fas fa-volume-up"></i></button>
                <button onclick="speakWord('${w.en}', 0.5)"><i class="fas fa-snowflake"></i></button>
                <button class="btn-learn ${isWordLearned(w.bookId, w.en) ? 'learned' : ''}" onclick="toggleLearnWord('${w.en}', '${w.bookId}', this)">
                  <i class="fas ${isWordLearned(w.bookId, w.en) ? 'fa-check-circle' : 'fa-circle'}"></i> ${isWordLearned(w.bookId, w.en) ? '已学' : '标记已学'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 今日语法
  if (rec.grammarId) {
    const g = GRAMMAR_DATA.find(x => x.id === rec.grammarId);
    if (g) {
      const learned = isLearned('grammar', g.id);
      html += `
        <div class="today-section">
          <h3><i class="fas fa-book" style="color:#00B894"></i> 今日语法</h3>
          <div class="grammar-card expanded" id="today-grammar">
            <div class="grammar-header" onclick="document.getElementById('today-grammar').classList.toggle('expanded')">
              <h3><span class="grammar-num">${g.id}</span><i class="fas ${g.icon}"></i> ${g.title}</h3>
              <i class="fas fa-chevron-down expand-icon"></i>
            </div>
            <div class="grammar-body">
              <div class="grammar-content">
                <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">${g.intro}</p>
                ${g.sections.map(s => `
                  <h4>${s.heading}</h4>
                  <p>${s.content}</p>
                  ${s.examples.map(ex => `<div class="grammar-example"><div class="en">${ex.en}</div><div class="cn">${ex.cn}</div></div>`).join('')}
                `).join('')}
                <div class="grammar-tip"><i class="fas fa-lightbulb"></i><div>${g.tip}</div></div>
              </div>
            </div>
          </div>
          <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnGrammar(${g.id}, this)">
            <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已学' : '标记已学'}
          </button>
        </div>
      `;
    }
  }

  // 今日口语
  if (rec.speakingIdx !== null) {
    const s = SPEAKING_DATA[rec.speakingIdx];
    if (s) {
      const learned = isLearned('speaking', rec.speakingIdx);
      html += `
        <div class="today-section">
          <h3><i class="fas fa-microphone" style="color:#FD79A8"></i> 今日口语</h3>
          <div class="speaking-card">
            <span style="font-size:12px;color:var(--text-light);background:var(--bg-input);padding:2px 10px;border-radius:10px;">${s.scene}</span>
            <div class="phrase-en">${s.en}</div>
            <div class="phrase-cn">${s.cn}</div>
            <div class="speaking-controls">
              <button class="btn-speak" onclick="speakPhrase('${s.en}', this)"><i class="fas fa-play"></i> 朗读</button>
              <div class="speed-control">
                <span>慢</span>
                <input type="range" min="0.4" max="1" step="0.1" value="0.8" onchange="this.nextElementSibling.textContent=parseFloat(this.value).toFixed(1)+'x'">
                <span class="speed-label">0.8x</span>
              </div>
              <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnSpeaking(${rec.speakingIdx}, this)">
                <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已学' : '标记已学'}
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // 今日阅读
  if (rec.readingIdx !== null) {
    const r = READING_DATA[rec.readingIdx];
    if (r) {
      const learned = isLearned('reading', rec.readingIdx);
      html += `
        <div class="today-section">
          <h3><i class="fas fa-book-reader" style="color:#FDCB6E"></i> 今日阅读</h3>
          <div class="reading-card" id="today-reading">
            <div class="reading-header" onclick="document.querySelector('#today-reading .reading-body').classList.toggle('show')">
              <h3>${r.title}</h3>
              <div class="reading-meta">${r.level} | 难度 ${r.difficulty}</div>
            </div>
            <div class="reading-body show">
              <div class="reading-content">
                ${r.paragraphs.map(p => `
                  <div class="reading-paragraph en">${p.en}
                    <button class="btn-speak" style="margin-top:6px;padding:4px 10px;font-size:12px;" onclick="speakWord('${p.en.replace(/'/g, "\\'")}')"><i class="fas fa-volume-up"></i> 朗读</button>
                  </div>
                  <div class="reading-paragraph cn">${p.cn}</div>
                `).join('')}
                <div class="reading-vocab">
                  <h4><i class="fas fa-bookmark"></i> 重点词汇</h4>
                  <ul>${r.vocabulary.map(v => `<li><strong>${v.word}</strong> — ${v.meaning}</li>`).join('')}</ul>
                </div>
              </div>
            </div>
          </div>
          <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnReading(${rec.readingIdx}, this)">
            <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已学' : '标记已学'}
          </button>
        </div>
      `;
    }
  }

  html += `</div>`;
  c.innerHTML = html;
}

function toggleLearnWord(en, bookId, btn) {
  const learned = !isWordLearned(bookId, en);
  setWordLearned(bookId, en, learned);
  const justLearned = learned;
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已学' : '标记已学'}`;
  btn.closest('.word-card')?.classList.toggle('learned', justLearned);
  renderEngDashboard();
  showToast(justLearned ? '已标记为已学！' : '已取消标记');
}

function toggleLearnGrammar(id, btn) {
  toggleLearned('grammar', id);
  const justLearned = isLearned('grammar', id);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已学' : '标记已学'}`;
  renderEngDashboard();
  showToast(justLearned ? '语法已学！' : '已取消标记');
}

function toggleLearnSpeaking(idx, btn) {
  toggleLearned('speaking', idx);
  const justLearned = isLearned('speaking', idx);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已学' : '标记已学'}`;
  renderEngDashboard();
  showToast(justLearned ? '口语已学！' : '已取消标记');
}

function toggleLearnReading(idx, btn) {
  toggleLearned('reading', idx);
  const justLearned = isLearned('reading', idx);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已学' : '标记已学'}`;
  renderEngDashboard();
  showToast(justLearned ? '阅读已学！' : '已取消标记');
}

function resetDailyRecommend() {
  saveData('daily_rec', null);
  renderTodayLearning($('#english-content'));
  renderEngDashboard();
  showToast('今日推荐已重新生成！');
}

function renderGrammar(c) {
  const learnedG = getLearned('grammar');
  c.innerHTML = `
    <div class="section-progress-bar">
      <div class="progress-info">语法学习进度</div>
      ${getProgressHTML('grammar', GRAMMAR_DATA.length)}
    </div>
    <div style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;">
      <i class="fas fa-info-circle"></i> 点击语法主题展开学习。学完后点击"标记已学"按钮
    </div>
    <div id="grammar-list">
      ${GRAMMAR_DATA.map(g => `
        <div class="grammar-card ${learnedG.includes(g.id) ? 'learned' : ''}" id="grammar-${g.id}">
          <div class="grammar-header" onclick="toggleGrammar(${g.id})">
            <h3>
              <span class="grammar-num">${g.id}</span>
              <i class="fas ${g.icon}"></i> ${g.title}
              ${learnedG.includes(g.id) ? '<i class="fas fa-check-circle" style="color:#00B894;margin-left:8px;"></i>' : ''}
            </h3>
            <i class="fas fa-chevron-down expand-icon"></i>
          </div>
          <div class="grammar-body">
            <div class="grammar-content">
              <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">${g.intro}</p>
              ${g.sections.map(s => `
                <h4>${s.heading}</h4>
                <p>${s.content}</p>
                ${s.examples.map(ex => `<div class="grammar-example"><div class="en">${ex.en}</div><div class="cn">${ex.cn}</div></div>`).join('')}
              `).join('')}
              <div class="grammar-tip"><i class="fas fa-lightbulb"></i><div>${g.tip}</div></div>
              <button class="btn-learn ${learnedG.includes(g.id) ? 'learned' : ''}" onclick="toggleLearnGrammarFromList(${g.id}, this)">
                <i class="fas ${learnedG.includes(g.id) ? 'fa-check-circle' : 'fa-circle'}"></i> ${learnedG.includes(g.id) ? '已学' : '标记已学'}
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleLearnGrammarFromList(id, btn) {
  toggleLearned('grammar', id);
  const justLearned = isLearned('grammar', id);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已学' : '标记已学'}`;
  $(`#grammar-${id}`)?.classList.toggle('learned', justLearned);
  renderEngDashboard();
  showToast(justLearned ? '语法已学！' : '已取消标记');
}

function toggleGrammar(id) {
  $(`#grammar-${id}`).classList.toggle('expanded');
}

/* ===== 词书体系辅助函数 ===== */
const WORD_BOOK_STORAGE = 'mw_word_books';
function getCustomBooks() { return loadData(WORD_BOOK_STORAGE, []); }
function saveCustomBooks(arr) { saveData(WORD_BOOK_STORAGE, arr); }
function getAllBooks() {
  const sys = (typeof WORD_BOOKS_META !== 'undefined' ? WORD_BOOKS_META : []).map(m => ({ ...m }));
  const cus = getCustomBooks().map(b => ({ ...b, builtin: false }));
  return [...sys, ...cus];
}
function getBookMeta(id) { return getAllBooks().find(b => b.id === id); }
function getBookWords(bookId) {
  if (bookId === 'daily') return (typeof DAILY_ACCUM_WORDS !== 'undefined') ? DAILY_ACCUM_WORDS : [];
  if (typeof WORDS_DATA !== 'undefined' && WORDS_DATA[bookId]) return WORDS_DATA[bookId];
  const cus = getCustomBooks().find(b => b.id === bookId);
  return cus ? cus.words : [];
}
// 已学 key 带 bookId 前缀，实现词书独立进度；同时兼容旧的纯 en key
function isWordLearned(bookId, en) {
  return isLearned('words', bookId + '::' + en) || isLearned('words', en);
}
function setWordLearned(bookId, en, learned) {
  const key = bookId + '::' + en;
  const arr = getLearned('words');
  const idx = arr.indexOf(key);
  if (learned && idx === -1) arr.push(key);
  if (!learned && idx > -1) arr.splice(idx, 1);
  saveData('learned_words', arr);
}

function renderWords(c) {
  const words = getBookWords(currentWordBook);
  const bookTotal = words.length;
  const bookLearned = words.filter(w => isWordLearned(currentWordBook, w.en)).length;
  const meta = getBookMeta(currentWordBook);
  const books = getAllBooks();

  c.innerHTML = `
    <div class="section-progress-bar">
      <div class="progress-info">单词学习进度（${meta ? meta.name : '当前词书'}）</div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${bookTotal > 0 ? Math.round(bookLearned/bookTotal*100) : 0}%"></div></div>
      <span class="progress-text">${bookLearned}/${bookTotal}</span>
    </div>
    <div style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;">
      <i class="fas fa-info-circle"></i> 学完的单词会标记为已学，切换词书可更换背诵内容；点「新建词书」可加入自己的单词书
    </div>
    <div class="word-level-selector">
      ${books.map(b => {
        const cnt = getBookWords(b.id).length;
        const del = b.builtin ? '' : `<span class="book-del" title="删除此词书" onclick="deleteWordBook('${b.id}', event)"><i class="fas fa-trash-alt"></i></span>`;
        return `<span class="level-btn-wrap">
          <button class="level-btn ${currentWordBook === b.id ? 'active' : ''}" onclick="switchWordBook('${b.id}')">${b.icon ? '<i class="fas ' + b.icon + '"></i> ' : ''}${b.name} (${cnt}词)</button>
          ${del}
        </span>`;
      }).join('')}
      <span class="level-btn-wrap">
        <button class="level-btn add-book-btn" onclick="openNewBookModal()"><i class="fas fa-plus"></i> 新建词书</button>
      </span>
    </div>
    <div class="word-grid" id="word-grid"></div>
  `;
  renderWordGrid();
}

function renderWordBookBar() {
  const bar = $('#wordbook-bar');
  if (!bar) return;
  const books = getAllBooks();
  bar.innerHTML = `
    <div class="wordbook-bar-inner">
      <span class="wordbook-bar-label"><i class="fas fa-book"></i> 单词书</span>
      <div class="wordbook-chips">
        ${books.map(b => {
          const cnt = getBookWords(b.id).length;
          const del = b.builtin ? '' : `<span class="book-del" onclick="deleteWordBook('${b.id}', event)"><i class="fas fa-trash-alt"></i></span>`;
          return `<span class="level-btn-wrap">
            <button class="level-btn ${currentWordBook === b.id ? 'active' : ''}" onclick="switchWordBook('${b.id}')">${b.icon ? '<i class="fas ' + b.icon + '"></i> ' : ''}${b.name} (${cnt})</button>
            ${del}
          </span>`;
        }).join('')}
        <span class="level-btn-wrap"><button class="level-btn add-book-btn" onclick="openNewBookModal()"><i class="fas fa-plus"></i> 新建词书</button></span>
      </div>
    </div>
  `;
}

function switchWordBook(bookId) {
  currentWordBook = bookId;
  currentEngTab = 'words';
  $$('.eng-tab').forEach(x => x.classList.toggle('active', x.dataset.tab === 'words'));
  renderWordBookBar();
  renderEngTab();
}

function renderWordGrid() {
  const words = getBookWords(currentWordBook);
  const grid = $('#word-grid');
  if (!grid) return;
  const meta = getBookMeta(currentWordBook);
  grid.innerHTML = words.map(w => {
    const learned = isWordLearned(currentWordBook, w.en);
    return `
    <div class="word-card ${learned ? 'learned' : ''}">
      ${meta && !meta.builtin ? `<span class="word-book-tag">${meta.name}</span>` : ''}
      <div class="word-en">${w.en}</div>
      <div class="word-phonetic">${w.phonetic}</div>
      <div class="word-cn">${w.cn}</div>
      <div class="word-example">${w.example}</div>
      <div class="word-actions">
        <button onclick="speakWord('${w.en}')"><i class="fas fa-volume-up"></i> 朗读</button>
        <button onclick="speakWord('${w.en}', 0.5)"><i class="fas fa-snowflake"></i> 慢速</button>
        <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnWordFromList('${w.en}', this)">
          <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已学' : '标记'}
        </button>
      </div>
    </div>
    `;
  }).join('');
}

function toggleLearnWordFromList(en, btn) {
  const learned = !isWordLearned(currentWordBook, en);
  setWordLearned(currentWordBook, en, learned);
  const justLearned = learned;
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已学' : '标记'}`;
  btn.closest('.word-card')?.classList.toggle('learned', justLearned);
  updateWordsProgress();
  renderEngDashboard();
  showToast(justLearned ? '单词已学！' : '已取消标记');
}

function updateWordsProgress() {
  const words = getBookWords(currentWordBook);
  const total = words.length;
  const learned = words.filter(w => isWordLearned(currentWordBook, w.en)).length;
  const fill = document.querySelector('.section-progress-bar .progress-bar-fill');
  const txt = document.querySelector('.section-progress-bar .progress-text');
  if (fill) fill.style.width = (total > 0 ? Math.round(learned / total * 100) : 0) + '%';
  if (txt) txt.textContent = learned + '/' + total;
}

/* ===== 新建 / 删除自定义词书 ===== */
let pendingSingleWords = [];
function openNewBookModal() {
  pendingSingleWords = [];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay newbook-overlay';
  overlay.id = 'newbook-overlay';
  overlay.innerHTML = `
    <div class="modal-content newbook-modal">
      <button class="modal-close" onclick="closeNewBookModal()"><i class="fas fa-times"></i></button>
      <h2 class="newbook-title"><i class="fas fa-plus-circle"></i> 新建单词书</h2>
      <div class="newbook-field">
        <label>词书名 *</label>
        <input type="text" id="nb-name" placeholder="如：考研核心2000词 / 我的生词本" maxlength="30">
      </div>
      <div class="newbook-field">
        <label>简介（可选）</label>
        <input type="text" id="nb-desc" placeholder="一句话说明这本词书的用途" maxlength="50">
      </div>
      <div class="nb-tabs">
        <button class="nb-tab" data-mode="bulk" onclick="switchBookInputMode('bulk')"><i class="fas fa-paste"></i> 批量粘贴</button>
        <button class="nb-tab" data-mode="single" onclick="switchBookInputMode('single')"><i class="fas fa-plus"></i> 单条添加</button>
        <button class="nb-tab active" data-mode="market" onclick="switchBookInputMode('market')"><i class="fas fa-search"></i> 词库市场</button>
      </div>
      <div class="nb-panel" id="nb-panel-bulk" style="display:none;">
        <textarea id="nb-bulk" placeholder="每行一个单词，格式：英文 音标 中文 例句&#10;例：&#10;apple /ˈæpl/ n.苹果 例句：I eat an apple.&#10;book /bʊk/ n.书"></textarea>
        <div class="nb-hint" id="nb-bulk-hint">支持一次粘贴几十上百个单词</div>
      </div>
      <div class="nb-panel" id="nb-panel-single" style="display:none;">
        <div class="nb-single-row">
          <input type="text" id="nb-en" placeholder="英文">
          <input type="text" id="nb-phonetic" placeholder="音标 /.../">
        </div>
        <div class="nb-single-row">
          <input type="text" id="nb-cn" placeholder="中文释义">
          <input type="text" id="nb-example" placeholder="例句（可选）">
        </div>
        <button class="btn-mini" onclick="addSingleWordToPending()"><i class="fas fa-plus"></i> 加入列表</button>
        <div class="nb-single-list" id="nb-single-list"></div>
      </div>
      <div class="nb-panel" id="nb-panel-market">
        <div class="nb-market-search">
          <i class="fas fa-search"></i>
          <input type="text" id="nb-market-search" placeholder="搜索词书：如 新概念 / 点餐 / 地铁 / 购物 / 生活 / 口语" oninput="filterMarketBooks(this.value)">
        </div>
        <div class="nb-market-list" id="nb-market-list"></div>
        <div class="nb-hint">点击「导入」即可把整本词书加入你的词库，无需复制粘贴</div>
      </div>
      <div class="newbook-actions" id="nb-actions">
        <button class="btn-mini" onclick="closeNewBookModal()">取消</button>
        <button class="btn-primary" onclick="saveNewBook()"><i class="fas fa-save"></i> 保存词书</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeNewBookModal(); });
  const ta = overlay.querySelector('#nb-bulk');
  if (ta) ta.addEventListener('input', nbBulkCount);
  renderMarketBooks('');
  requestAnimationFrame(() => overlay.classList.add('show'));
}

function closeNewBookModal() {
  const ov = document.getElementById('newbook-overlay');
  if (ov) ov.remove();
}

function switchBookInputMode(mode) {
  document.querySelectorAll('.nb-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
  document.getElementById('nb-panel-bulk').style.display = mode === 'bulk' ? '' : 'none';
  document.getElementById('nb-panel-single').style.display = mode === 'single' ? '' : 'none';
  document.getElementById('nb-panel-market').style.display = mode === 'market' ? '' : 'none';
  const acts = document.getElementById('nb-actions');
  if (acts) acts.style.display = mode === 'market' ? 'none' : '';
  if (mode === 'market') renderMarketBooks(document.getElementById('nb-market-search').value);
}

function parseBulkWords(text) {
  const lines = (text || '').split('\n').map(s => s.trim()).filter(Boolean);
  const out = [];
  lines.forEach(line => {
    const m = line.match(/^(\S+)\s+(\/[^\/]+\/)?\s*(.*)$/);
    if (!m) return;
    const en = m[1];
    if (!/^[a-zA-Z]/.test(en)) return;
    let phonetic = (m[2] || '').trim();
    let rest = (m[3] || '').trim();
    let cn = rest, example = '';
    const exIdx = rest.search(/例句[:：]|example[:：]|\s[|｜]\s/);
    if (exIdx > -1) {
      cn = rest.slice(0, exIdx).trim();
      example = rest.slice(exIdx).replace(/^例句[:：]|^example[:：]|^[|｜]\s*/, '').trim();
    }
    out.push({ en, phonetic, cn: cn || '—', example: example || '' });
  });
  return out;
}

function nbBulkCount() {
  const t = document.getElementById('nb-bulk');
  if (!t) return;
  const n = parseBulkWords(t.value).length;
  const hint = document.getElementById('nb-bulk-hint');
  if (hint) hint.textContent = n > 0 ? `已识别 ${n} 个单词，将一并加入词书` : '支持一次粘贴几十上百个单词';
}

function addSingleWordToPending() {
  const en = document.getElementById('nb-en').value.trim();
  const cn = document.getElementById('nb-cn').value.trim();
  const phonetic = document.getElementById('nb-phonetic').value.trim();
  const example = document.getElementById('nb-example').value.trim();
  if (!en || !cn) { showToast('英文和中文释义必填', 'error'); return; }
  pendingSingleWords.push({ en, phonetic, cn, example });
  document.getElementById('nb-en').value = '';
  document.getElementById('nb-phonetic').value = '';
  document.getElementById('nb-cn').value = '';
  document.getElementById('nb-example').value = '';
  renderPendingList();
  showToast('已加入列表（' + pendingSingleWords.length + '）');
}

function renderPendingList() {
  const el = document.getElementById('nb-single-list');
  if (!el) return;
  el.innerHTML = pendingSingleWords.map((w, i) =>
    `<div class="nb-pending-item"><span>${w.en} <em>${w.cn}</em></span><button onclick="removePendingWord(${i})"><i class="fas fa-times"></i></button></div>`
  ).join('');
}

function removePendingWord(i) {
  pendingSingleWords.splice(i, 1);
  renderPendingList();
}

function saveNewBook() {
  const name = document.getElementById('nb-name').value.trim();
  if (!name) { showToast('请填写词书名', 'error'); return; }
  const desc = document.getElementById('nb-desc').value.trim();
  const bulk = parseBulkWords(document.getElementById('nb-bulk').value);
  const words = bulk.concat(pendingSingleWords);
  if (words.length === 0) { showToast('至少要添加一个单词', 'error'); return; }
  const id = 'cus_' + Date.now();
  const books = getCustomBooks();
  books.push({ id, name, desc, icon: 'fa-book', builtin: false, words });
  saveCustomBooks(books);
  showToast('词书「' + name + '」已创建，共 ' + words.length + ' 词');
  closeNewBookModal();
  currentWordBook = id;
  renderWords($('#english-content'));
}

function deleteWordBook(id, e) {
  e.stopPropagation();
  const books = getCustomBooks();
  const b = books.find(x => x.id === id);
  if (!b) return;
  if (!confirm('确定删除词书「' + b.name + '」？单词与已学进度将一并清除。')) return;
  const arr = getLearned('words');
  const filtered = arr.filter(k => !k.startsWith(id + '::'));
  saveData('learned_words', filtered);
  saveCustomBooks(books.filter(x => x.id !== id));
  if (currentWordBook === id) currentWordBook = 'primary';
  renderWords($('#english-content'));
  showToast('已删除词书「' + b.name + '」');
}

function renderMarketBooks(q) {
  const el = document.getElementById('nb-market-list');
  if (!el || typeof IMPORT_BOOKS === 'undefined') return;
  const kw = (q || '').trim().toLowerCase();
  const list = IMPORT_BOOKS.filter(b =>
    !kw || b.name.toLowerCase().includes(kw) || (b.desc || '').toLowerCase().includes(kw) || b.id.includes(kw)
  );
  if (list.length === 0) {
    el.innerHTML = '<div class="nb-market-empty">没有匹配「' + kw + '」的词书。你可以直接告诉我词书名（如"专四""医学英语"），我帮你搜好加进来。</div>';
    return;
  }
  const imported = getCustomBooks().map(b => b.source || '');
  el.innerHTML = list.map(b => {
    const cnt = b.words.length;
    const done = imported.includes(b.id);
    return `<div class="nb-market-card">
      <div class="nb-market-card-head"><i class="fas ${b.icon || 'fa-book'}"></i> <span class="nb-market-name">${b.name}</span> <span class="nb-market-count">${cnt}词</span></div>
      <div class="nb-market-desc">${b.desc || ''}</div>
      <button class="btn-primary nb-import-btn" ${done ? 'disabled' : ''} onclick="importMarketBook('${b.id}')">${done ? '<i class="fas fa-check"></i> 已导入' : '<i class="fas fa-download"></i> 导入'}</button>
    </div>`;
  }).join('');
}
function filterMarketBooks(v) { renderMarketBooks(v); }
function importMarketBook(id) {
  if (typeof IMPORT_BOOKS === 'undefined') return;
  const src = IMPORT_BOOKS.find(b => b.id === id);
  if (!src) return;
  const books = getCustomBooks();
  if (books.some(b => b.source === id)) { showToast('该词书已导入', 'error'); return; }
  const nid = 'mkt_' + id + '_' + Date.now();
  books.push({
    id: nid, name: src.name, desc: src.desc, icon: src.icon, builtin: false, source: id,
    words: src.words.map(w => ({ en: w.en, phonetic: w.phonetic, cn: w.cn, example: w.example }))
  });
  saveCustomBooks(books);
  showToast('已导入「' + src.name + '」，共 ' + src.words.length + ' 词');
  closeNewBookModal();
  currentWordBook = nid;
  renderWords($('#english-content'));
}

function speakWord(text, rate = 0.9) {
  if (!('speechSynthesis' in window)) {
    showToast('浏览器不支持语音朗读', 'error');
    return;
  }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  u.pitch = 1;
  speechSynthesis.speak(u);
}

function renderSpeaking(c) {
  const learnedS = getLearned('speaking');
  c.innerHTML = `
    <div class="section-progress-bar">
      <div class="progress-info">口语跟读进度</div>
      ${getProgressHTML('speaking', SPEAKING_DATA.length)}
    </div>
    <div style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;">
      <i class="fas fa-info-circle"></i> 点击朗读按钮听标准发音，拖动滑块调节语速，跟读练习口语
    </div>
    <div>
      ${SPEAKING_DATA.map((s, i) => {
        const learned = learnedS.includes(i);
        return `
        <div class="speaking-card ${learned ? 'learned' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-size:12px;color:var(--text-light);background:var(--bg-input);padding:2px 10px;border-radius:10px;">${s.scene}</span>
            <span style="font-size:12px;color:var(--text-light);">#${i+1} ${learned ? '<i class="fas fa-check-circle" style="color:#00B894"></i>' : ''}</span>
          </div>
          <div class="phrase-en">${s.en}</div>
          <div class="phrase-cn">${s.cn}</div>
          <div class="speaking-controls">
            <button class="btn-speak" onclick="speakPhrase('${s.en}', this)">
              <i class="fas fa-play"></i> 朗读
            </button>
            <div class="speed-control">
              <span>慢</span>
              <input type="range" min="0.4" max="1" step="0.1" value="0.8" id="speed-${i}" onchange="changeSpeed(${i}, this.value)">
              <span class="speed-label" id="speed-label-${i}">0.8x</span>
            </div>
            <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnSpeakingFromList(${i}, this)">
              <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已学' : '标记已学'}
            </button>
          </div>
        </div>
        `;
      }).join('')}
    </div>
  `;
}

function toggleLearnSpeakingFromList(idx, btn) {
  toggleLearned('speaking', idx);
  const justLearned = isLearned('speaking', idx);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已学' : '标记已学'}`;
  btn.closest('.speaking-card')?.classList.toggle('learned', justLearned);
  renderEngDashboard();
  showToast(justLearned ? '口语已学！' : '已取消标记');
}

function speakPhrase(text, btn) {
  if (!('speechSynthesis' in window)) {
    showToast('浏览器不支持语音朗读', 'error');
    return;
  }
  speechSynthesis.cancel();
  const speedInput = btn.parentElement.querySelector('input[type="range"]');
  const rate = parseFloat(speedInput.value);
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  u.pitch = 1;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 播放中';
  u.onend = () => { btn.innerHTML = '<i class="fas fa-play"></i> 朗读'; };
  u.onerror = () => { btn.innerHTML = '<i class="fas fa-play"></i> 朗读'; };
  speechSynthesis.speak(u);
}

function changeSpeed(idx, val) {
  $(`#speed-label-${idx}`).textContent = parseFloat(val).toFixed(1) + 'x';
}

/* ============================================
   每日跟读（短语+文章）
   ============================================ */
function renderPractice(c) {
  const learnedP = getLearned('practice');
  const totalPractice = PRACTICE_DATA.phrases.length + PRACTICE_DATA.articles.length;
  const learnedCount = learnedP.length;

  c.innerHTML = `
    <div class="section-progress-bar">
      <div class="progress-info">每日跟读进度</div>
      ${getProgressHTML('practice', totalPractice)}
    </div>
    <div class="practice-subtabs">
      <button class="practice-subtab ${currentPracticeSubtab === 'phrases' ? 'active' : ''}" onclick="switchPracticeSubtab('phrases')">
        <i class="fas fa-quote-right"></i> 短语 (${PRACTICE_DATA.phrases.length})
      </button>
      <button class="practice-subtab ${currentPracticeSubtab === 'articles' ? 'active' : ''}" onclick="switchPracticeSubtab('articles')">
        <i class="fas fa-file-alt"></i> 文章 (${PRACTICE_DATA.articles.length})
      </button>
    </div>
    <div id="practice-content"></div>
  `;

  renderPracticeContent();
}

function switchPracticeSubtab(tab) {
  currentPracticeSubtab = tab;
  $$('.practice-subtab').forEach(t => t.classList.remove('active'));
  event.target.closest('.practice-subtab').classList.add('active');
  renderPracticeContent();
}

function renderPracticeContent() {
  const c = $('#practice-content');
  if (!c) return;
  const learnedP = getLearned('practice');

  if (currentPracticeSubtab === 'phrases') {
    c.innerHTML = `
      <div style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;">
        <i class="fas fa-info-circle"></i> 短句跟读，注意连读和语调。点击朗读按钮，拖动滑块调语速
      </div>
      <div class="practice-list">
        ${PRACTICE_DATA.phrases.map((p, i) => {
          const id = 'phrase-' + i;
          const learned = learnedP.includes(id);
          return `
          <div class="practice-card ${learned ? 'learned' : ''}">
            <div class="practice-tags">${p.tags.map(t => `<span class="practice-tag">${t}</span>`).join('')}</div>
            <div class="practice-en">${p.en}</div>
            <div class="practice-cn">${p.cn}</div>
            <div class="practice-tip"><i class="fas fa-lightbulb"></i> ${p.tip}</div>
            <div class="speaking-controls">
              <button class="btn-speak" onclick="speakPractice('${p.en.replace(/'/g, "\\'")}', this)">
                <i class="fas fa-play"></i> 朗读
              </button>
              <div class="speed-control">
                <span>慢</span>
                <input type="range" min="0.4" max="1" step="0.1" value="0.8" onchange="this.nextElementSibling.textContent=parseFloat(this.value).toFixed(1)+'x'">
                <span class="speed-label">0.8x</span>
              </div>
              <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnPractice('${id}', this)">
                <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已学' : '标记已学'}
              </button>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    c.innerHTML = `
      <div style="margin-bottom:16px;color:var(--text-secondary);font-size:14px;">
        <i class="fas fa-info-circle"></i> 短文跟读，注意整体节奏和语气。内容简短，适合碎片时间练习
      </div>
      <div class="practice-list">
        ${PRACTICE_DATA.articles.map((a, i) => {
          const id = 'article-' + i;
          const learned = learnedP.includes(id);
          return `
          <div class="practice-card ${learned ? 'learned' : ''}">
            <div class="practice-article-header">
              <h4>${a.title}</h4>
              <span class="practice-difficulty">${a.difficulty}</span>
            </div>
            <div class="practice-tags">${a.tags.map(t => `<span class="practice-tag">${t}</span>`).join('')}</div>
            <div class="practice-en practice-article-en">${a.en}</div>
            <div class="practice-cn practice-article-cn">${a.cn}</div>
            <div class="practice-tip"><i class="fas fa-lightbulb"></i> ${a.tip}</div>
            <div class="speaking-controls">
              <button class="btn-speak" onclick="speakPractice('${a.en.replace(/'/g, "\\'")}', this)">
                <i class="fas fa-play"></i> 朗读
              </button>
              <div class="speed-control">
                <span>慢</span>
                <input type="range" min="0.4" max="1" step="0.1" value="0.8" onchange="this.nextElementSibling.textContent=parseFloat(this.value).toFixed(1)+'x'">
                <span class="speed-label">0.8x</span>
              </div>
              <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnPractice('${id}', this)">
                <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已学' : '标记已学'}
              </button>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

function speakPractice(text, btn) {
  if (!('speechSynthesis' in window)) {
    showToast('浏览器不支持语音朗读', 'error');
    return;
  }
  speechSynthesis.cancel();
  const speedInput = btn.parentElement.querySelector('input[type="range"]');
  const rate = parseFloat(speedInput.value);
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  u.pitch = 1;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 播放中';
  u.onend = () => { btn.innerHTML = '<i class="fas fa-play"></i> 朗读'; };
  u.onerror = () => { btn.innerHTML = '<i class="fas fa-play"></i> 朗读'; };
  speechSynthesis.speak(u);
}

function toggleLearnPractice(id, btn) {
  toggleLearned('practice', id);
  const justLearned = isLearned('practice', id);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已学' : '标记已学'}`;
  btn.closest('.practice-card')?.classList.toggle('learned', justLearned);
  renderEngDashboard();
  showToast(justLearned ? '跟读已学！' : '已取消标记');
}

/* ============================================
   单词查询词典 + 阅读增强
   ============================================ */
let _wordDict = null;
function getWordDictionary() {
  if (_wordDict) return _wordDict;
  _wordDict = {};
  getAllBooks().forEach(b => {
    getBookWords(b.id).forEach(w => {
      _wordDict[w.en.toLowerCase()] = { cn: w.cn, phonetic: w.phonetic };
    });
  });
  READING_DATA.forEach(r => {
    r.vocabulary.forEach(v => {
      if (!_wordDict[v.word.toLowerCase()]) {
        _wordDict[v.word.toLowerCase()] = { cn: v.meaning, phonetic: '' };
      }
    });
  });
  PRACTICE_DATA.phrases.forEach(p => {
    p.en.toLowerCase().replace(/[^a-z\s']/g, '').split(/\s+/).forEach(w => {
      if (w.length > 2 && !_wordDict[w]) {
        // skip, too many common words
      }
    });
  });
  return _wordDict;
}

function makeWordsClickable(text) {
  const dict = getWordDictionary();
  return text.replace(/([a-zA-Z]+(?:'[a-z]+)?)/g, (match) => {
    const lower = match.toLowerCase();
    const entry = dict[lower];
    if (entry) {
      return `<span class="word-clickable" onclick="showWordTooltip(event, '${lower}')">${match}</span>`;
    }
    return `<span class="word-clickable word-no-entry" onclick="showWordTooltip(event, '${lower}')">${match}</span>`;
  });
}

function showWordTooltip(e, word) {
  const existing = document.querySelector('.word-tooltip');
  if (existing) existing.remove();

  const dict = getWordDictionary();
  const entry = dict[word];

  const tooltip = document.createElement('div');
  tooltip.className = 'word-tooltip';

  if (entry) {
    tooltip.innerHTML = `
      <div class="tooltip-word">${word}</div>
      ${entry.phonetic ? `<div class="tooltip-phonetic">${entry.phonetic}</div>` : ''}
      <div class="tooltip-meaning">${entry.cn}</div>
      <div class="tooltip-actions">
        <button class="tooltip-speak" onclick="speakWord('${word}'); event.stopPropagation();" title="朗读"><i class="fas fa-volume-up"></i> 朗读</button>
        <button class="tooltip-search" onclick="window.open('https://www.bing.com/dict/search?q=${word}', '_blank'); event.stopPropagation();" title="在线词典"><i class="fas fa-search"></i> 查词典</button>
      </div>
    `;
  } else {
    tooltip.innerHTML = `
      <div class="tooltip-word">${word}</div>
      <div class="tooltip-meaning tooltip-no-entry">词库中暂无释义，可查在线词典</div>
      <button class="tooltip-search" onclick="window.open('https://www.bing.com/dict/search?q=${word}', '_blank'); event.stopPropagation();"><i class="fas fa-search"></i> 查词典</button>
    `;
  }

  document.body.appendChild(tooltip);
  const rect = e.target.getBoundingClientRect();
  tooltip.style.left = rect.left + 'px';
  tooltip.style.top = (rect.bottom + window.scrollY + 4) + 'px';

  setTimeout(() => {
    document.addEventListener('click', closeWordTooltip, { once: true });
  }, 10);
}

function closeWordTooltip() {
  const t = document.querySelector('.word-tooltip');
  if (t) t.remove();
}

function setReadingTranslateMode(mode) {
  readingTranslateMode = mode;
  $$('.translate-btn').forEach(b => b.classList.remove('active'));
  $$('.translate-btn[data-mode="' + mode + '"]').forEach(b => b.classList.add('active'));
  $$('.reading-paragraph').forEach(p => {
    if (p.classList.contains('en')) {
      p.style.display = (mode === 'cn-only') ? 'none' : '';
    }
    if (p.classList.contains('cn')) {
      p.style.display = (mode === 'en-only') ? 'none' : '';
    }
  });
}

function renderReading(c) {
  const learnedR = getLearned('reading');
  c.innerHTML = `
    <div class="section-progress-bar">
      <div class="progress-info">阅读进度</div>
      ${getProgressHTML('reading', READING_DATA.length)}
    </div>
    <div class="reading-toolbar">
      <div class="translate-toggle">
        <span class="translate-label"><i class="fas fa-language"></i> 显示模式：</span>
        <button class="translate-btn active" data-mode="bilingual" onclick="setReadingTranslateMode('bilingual')">英汉对照</button>
        <button class="translate-btn" data-mode="en-only" onclick="setReadingTranslateMode('en-only')">仅英文</button>
        <button class="translate-btn" data-mode="cn-only" onclick="setReadingTranslateMode('cn-only')">仅中文</button>
      </div>
      <div class="reading-toolbar-actions">
        <button class="btn-mini" onclick="expandAllReading(true)"><i class="fas fa-expand-arrows-alt"></i> 展开全部</button>
        <button class="btn-mini" onclick="expandAllReading(false)"><i class="fas fa-compress-arrows-alt"></i> 收起全部</button>
      </div>
      <div class="reading-hint">
        <i class="fas fa-hand-pointer"></i> 点击英文单词可查释义（含音标与在线词典）
      </div>
    </div>
    <div>
      ${READING_DATA.map((r, i) => {
        const learned = learnedR.includes(i);
        return `
        <div class="reading-card ${learned ? 'learned' : ''}" id="reading-${i}">
          <div class="reading-header" onclick="toggleReading(${i})">
            <div>
              <h3>${r.title} ${learned ? '<i class="fas fa-check-circle" style="color:#00B894;font-size:16px;"></i>' : ''}</h3>
              <div class="reading-meta">${r.level} | 难度 ${r.difficulty}</div>
            </div>
            <i class="fas fa-chevron-down reading-expand-icon"></i>
          </div>
          <div class="reading-body">
            <div class="reading-content">
              ${r.paragraphs.map((p, j) => `
                <div class="reading-paragraph en">
                  ${makeWordsClickable(p.en)}
                  <button class="btn-speak" style="margin-top:6px;padding:4px 10px;font-size:12px;" onclick="speakWord('${p.en.replace(/'/g, "\\'")}')">
                    <i class="fas fa-volume-up"></i> 朗读
                  </button>
                </div>
                <div class="reading-paragraph cn">${p.cn}</div>
              `).join('')}
              <div class="reading-vocab">
                <h4><i class="fas fa-bookmark"></i> 重点词汇</h4>
                <ul>
                  ${r.vocabulary.map(v => `<li><strong>${v.word}</strong> — ${v.meaning}</li>`).join('')}
                </ul>
              </div>
              <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnReadingFromList(${i}, this)">
                <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已学' : '标记已学'}
              </button>
            </div>
          </div>
        </div>
        `;
      }).join('')}
    </div>
  `;
}

function toggleLearnReadingFromList(idx, btn) {
  toggleLearned('reading', idx);
  const justLearned = isLearned('reading', idx);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已学' : '标记已学'}`;
  btn.closest('.reading-card')?.classList.toggle('learned', justLearned);
  renderEngDashboard();
  showToast(justLearned ? '阅读已学！' : '已取消标记');
}

function toggleReading(idx) {
  const body = $(`#reading-${idx} .reading-body`);
  if (body) body.classList.toggle('show');
}

function expandAllReading(expand) {
  $$('.reading-body').forEach(b => b.classList.toggle('show', expand));
  showToast(expand ? '已展开全部文章' : '已收起全部文章');
}

/* ============================================
   睡前跟读（1-2分钟短内容，晨间/夜间均可）
   ============================================ */
let currentBedtimeMode = 'night'; // night | morning
function renderBedtime(c) {
  // 挑选最短的短语与最短文章，控制在 1-2 分钟内
  const phrases = [...PRACTICE_DATA.phrases].sort((a, b) => a.en.length - b.en.length);
  const articles = [...PRACTICE_DATA.articles].sort((a, b) => a.en.length - b.en.length);
  const phrase = phrases[0];
  const article = articles[0];
  const estMin = 1 + (article ? 1 : 0);

  const doneMap = loadData('eng_bedtime_done', {});
  const todayKey = today();
  const doneToday = doneMap[todayKey] || {};

  c.innerHTML = `
    <div class="bedtime-wrap">
      <div class="bedtime-head">
        <div>
          <h2><i class="fas fa-moon"></i> 睡前跟读</h2>
          <p class="subtitle">每天 1-2 分钟，读一段、念一句，轻松收尾今天</p>
        </div>
        <div class="bedtime-mode-switch">
          <button class="bm-btn ${currentBedtimeMode==='morning'?'active':''}" onclick="switchBedtimeMode('morning')"><i class="fas fa-sun"></i> 晨间</button>
          <button class="bm-btn ${currentBedtimeMode==='night'?'active':''}" onclick="switchBedtimeMode('night')"><i class="fas fa-moon"></i> 夜间</button>
        </div>
      </div>

      <div class="bedtime-timer"><i class="fas fa-stopwatch"></i> 预计耗时 ${estMin} 分钟 · 越短越容易坚持</div>

      ${phrase ? `
      <div class="bedtime-card">
        <div class="bedtime-card-tag">${currentBedtimeMode==='morning'?'☀️ 晨间唤醒':'🌙 夜间放松'} · 一句</div>
        <div class="practice-en">${phrase.en}</div>
        <div class="practice-cn">${phrase.cn}</div>
        <div class="practice-tip"><i class="fas fa-lightbulb"></i> ${phrase.tip}</div>
        <div class="speaking-controls">
          <button class="btn-speak" onclick="speakPractice('${phrase.en.replace(/'/g, "\\'")}', this)"><i class="fas fa-play"></i> 朗读</button>
          <div class="speed-control"><span>慢</span><input type="range" min="0.4" max="1" step="0.1" value="0.8" onchange="this.nextElementSibling.textContent=parseFloat(this.value).toFixed(1)+'x'"><span class="speed-label">0.8x</span></div>
          <label class="bedtime-check"><input type="checkbox" ${doneToday.phrase?'checked':''} onchange="markBedtime('phrase', this.checked)"> 已读完</label>
        </div>
      </div>` : ''}

      ${article ? `
      <div class="bedtime-card">
        <div class="bedtime-card-tag">${currentBedtimeMode==='morning'?'☀️ 晨间阅读':'🌙 夜间阅读'} · 一篇</div>
        <div class="practice-article-header"><h4>${article.title}</h4><span class="practice-difficulty">${article.difficulty}</span></div>
        <div class="practice-en practice-article-en">${article.en}</div>
        <div class="practice-cn practice-article-cn">${article.cn}</div>
        <div class="practice-tip"><i class="fas fa-lightbulb"></i> ${article.tip}</div>
        <div class="speaking-controls">
          <button class="btn-speak" onclick="speakPractice('${article.en.replace(/'/g, "\\'")}', this)"><i class="fas fa-play"></i> 朗读</button>
          <div class="speed-control"><span>慢</span><input type="range" min="0.4" max="1" step="0.1" value="0.8" onchange="this.nextElementSibling.textContent=parseFloat(this.value).toFixed(1)+'x'"><span class="speed-label">0.8x</span></div>
          <label class="bedtime-check"><input type="checkbox" ${doneToday.article?'checked':''} onchange="markBedtime('article', this.checked)"> 已读完</label>
        </div>
      </div>` : ''}

      <button class="bedtime-finish-btn ${Object.values(doneToday).every(Boolean)?'done':''}" onclick="finishBedtime()">
        <i class="fas fa-check"></i> ${Object.values(doneToday).every(Boolean) && Object.keys(doneToday).length ? '今日睡前跟读已完成 🎉' : '完成今日睡前跟读'}
      </button>
    </div>
  `;
}

function switchBedtimeMode(mode) {
  currentBedtimeMode = mode;
  renderBedtime($('#english-content'));
}

function markBedtime(part, checked) {
  const doneMap = loadData('eng_bedtime_done', {});
  const todayKey = today();
  if (!doneMap[todayKey]) doneMap[todayKey] = {};
  doneMap[todayKey][part] = checked;
  saveData('eng_bedtime_done', doneMap);
  if (checked) { recordEnglishActivity('bedtime', 1); recordActivity('english', 'bedtime', 1); }
  renderBedtime($('#english-content'));
}

function finishBedtime() {
  recordEnglishActivity('bedtime', 1);
  recordActivity('english', 'bedtime', 1);
  const doneMap = loadData('eng_bedtime_done', {});
  const todayKey = today();
  doneMap[todayKey] = { phrase: true, article: true };
  saveData('eng_bedtime_done', doneMap);
  renderBedtime($('#english-content'));
  showToast('睡前跟读完成，晚安 🌙');
}

/* ============================================
   英语学习统计（日 / 周 / 月 / 年）
   ============================================ */
let currentEngStatPeriod = 'week';
function renderEnglishStats(c) {
  const colors = {
    words: '#6C5CE7', grammar: '#00B894', speaking: '#FD79A8',
    reading: '#FDCB6E', practice: '#0984E3', bedtime: '#A29BFE'
  };
  c.innerHTML = `
    <div class="eng-stats-wrap">
      <div class="eng-stats-head">
        <h2><i class="fas fa-chart-bar"></i> 学习统计</h2>
        <div class="eng-stats-periods">
          <button class="esp-btn ${currentEngStatPeriod==='day'?'active':''}" onclick="switchEngStatPeriod('day')">今天</button>
          <button class="esp-btn ${currentEngStatPeriod==='week'?'active':''}" onclick="switchEngStatPeriod('week')">本周</button>
          <button class="esp-btn ${currentEngStatPeriod==='month'?'active':''}" onclick="switchEngStatPeriod('month')">本月</button>
          <button class="esp-btn ${currentEngStatPeriod==='year'?'active':''}" onclick="switchEngStatPeriod('year')">今年</button>
        </div>
      </div>
      <div class="eng-stats-summary" id="eng-stats-summary"></div>
      <div class="eng-stats-chart-card">
        <div class="chart-container"><canvas id="eng-stats-chart"></canvas></div>
      </div>
      <p class="eng-stats-tip">数据来自你每次「标记已学 / 完成跟读」的累积记录，自动统计。完成越多，柱子越高 💪</p>
    </div>
  `;
  renderEngStatsChart();
}

function switchEngStatPeriod(p) {
  currentEngStatPeriod = p;
  renderEnglishStats($('#english-content'));
}

function renderEngStatsChart() {
  const { labels, buckets, types, typeLabel } = aggregateEnglishActivity(currentEngStatPeriod);
  const colors = {
    words: '#6C5CE7', grammar: '#00B894', speaking: '#FD79A8',
    reading: '#FDCB6E', practice: '#0984E3', bedtime: '#A29BFE'
  };
  // 汇总卡片
  const summaryEl = $('#eng-stats-summary');
  if (summaryEl) {
    let total = 0;
    const cards = types.map(t => {
      const sum = buckets[t].reduce((a, b) => a + b, 0);
      total += sum;
      return `<div class="eng-sum-card" style="--sc:${colors[t]}">
        <span class="eng-sum-dot"></span>
        <div><div class="eng-sum-val">${sum}</div><div class="eng-sum-label">${typeLabel[t]}</div></div>
      </div>`;
    }).join('');
    summaryEl.innerHTML = `<div class="eng-sum-total">本周期共完成 <strong>${total}</strong> 项</div><div class="eng-sum-grid">${cards}</div>`;
  }
  const canvas = $('#eng-stats-chart');
  if (!canvas) return;
  charts.engStats = new Chart(canvas, {
    type: currentEngStatPeriod === 'day' ? 'bar' : 'line',
    data: {
      labels,
      datasets: types.map(t => ({
        label: typeLabel[t],
        data: buckets[t],
        borderColor: colors[t],
        backgroundColor: colors[t] + '33',
        fill: currentEngStatPeriod !== 'day',
        tension: 0.3,
        pointRadius: 2,
        borderWidth: 2
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10 } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 31 } },
        y: { beginAtZero: true, ticks: { font: { size: 10 }, stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } }
      }
    }
  });
}

/* ============================================
   金融投资板块
   ============================================ */
function renderFinance(c) {
  let totalLessons = 0, learnedLessons = 0;
  FINANCE_LESSONS.forEach(phase => {
    phase.lessons.forEach(l => {
      totalLessons++;
      if (isLearned('finance', l.id)) learnedLessons++;
    });
  });
  const finPct = totalLessons > 0 ? Math.round(learnedLessons / totalLessons * 100) : 0;
  const tipIdx = new Date().getDate() % FINANCE_DAILY_TIPS.length;
  const dailyTip = FINANCE_DAILY_TIPS[tipIdx];

  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-chart-line"></i> 基金投资</h1>
          <div class="subtitle">系统化基金知识体系 · 从基础认知到进阶投资的深度科普</div>
        </div>
        <div class="overall-progress-badge">
          <div class="progress-ring" style="--pct:${finPct}">
            <span>${finPct}%</span>
          </div>
          <div class="progress-label">已学 ${learnedLessons}/${totalLessons} 篇</div>
        </div>
      </div>

      <div class="finance-daily-tip">
        <i class="fas fa-lightbulb"></i>
        <div>
          <span class="tip-label">今日基金知识</span>
          <p>${dailyTip}</p>
        </div>
      </div>

      <div class="finance-phase-nav">
        ${FINANCE_PHASES.map((p, i) => {
          const phaseData = FINANCE_LESSONS[i];
          const phaseLearned = phaseData.lessons.filter(l => isLearned('finance', l.id)).length;
          const phaseDone = phaseLearned === phaseData.lessons.length;
          return `
            <button class="phase-card ${i === currentFinancePhase ? 'active' : ''} ${phaseDone ? 'completed' : ''}" onclick="switchFinancePhase(${i})">
              <span class="phase-icon"><i class="fas ${p.icon}"></i></span>
              <div class="phase-info">
                <span class="phase-title">${p.title}</span>
                <span class="phase-progress">${phaseLearned}/${phaseData.lessons.length} 篇</span>
              </div>
              ${phaseDone ? '<i class="fas fa-check-circle phase-done-mark"></i>' : ''}
            </button>
          `;
        }).join('')}
      </div>

      <div class="finance-weekly-panel" id="finance-weekly"></div>

      <div class="finance-hot-panel" id="finance-hot"></div>

      <div id="finance-content"></div>
    </div>
  `;
  renderFinanceLessons();
  renderFinanceWeekly();
  renderFinanceHotTracks();
}

function switchFinancePhase(phase) {
  currentFinancePhase = phase;
  $$('.phase-card').forEach((c, i) => c.classList.toggle('active', i === phase));
  renderFinanceLessons();
}

function renderFinanceLessons() {
  const phaseData = FINANCE_LESSONS[currentFinancePhase];
  const phaseInfo = FINANCE_PHASES[currentFinancePhase];
  const c = $('#finance-content');

  c.innerHTML = `
    <div class="finance-lessons-section">
      <div class="phase-header">
        <h2><i class="fas ${phaseInfo.icon}"></i> ${phaseInfo.title}</h2>
        <p class="phase-desc">${phaseInfo.desc}</p>
      </div>

      ${phaseData.lessons.map((lesson, idx) => {
        const learned = isLearned('finance', lesson.id);
        const stars = '\u2605'.repeat(lesson.difficulty) + '\u2606'.repeat(5 - lesson.difficulty);
        return `
          <div class="lesson-card ${learned ? 'learned' : ''}" id="lesson-${idx}">
            <div class="lesson-header" onclick="toggleLesson(${idx})">
              <div class="lesson-title-row">
                <span class="lesson-number">第 ${idx + 1} 篇</span>
                <h3>${lesson.title}</h3>
                <div class="lesson-meta">
                  <span class="lesson-difficulty">${stars}</span>
                  <span class="lesson-time"><i class="fas fa-clock"></i> ${lesson.time}</span>
                  ${learned ? '<span class="lesson-learned-badge"><i class="fas fa-check"></i> 已学</span>' : ''}
                </div>
              </div>
              <i class="fas fa-chevron-down lesson-expand-icon" id="lesson-icon-${idx}"></i>
            </div>
            <div class="lesson-body" id="lesson-body-${idx}">
              ${lesson.sections.map(s => `
                <div class="lesson-section lesson-section-${s.type}">
                  <div class="section-type-label">
                    ${s.type === 'concept' ? '<i class="fas fa-book"></i> 核心概念' : ''}
                    ${s.type === 'mechanism' ? '<i class="fas fa-cogs"></i> 运作机制' : ''}
                    ${s.type === 'caseStudy' ? '<i class="fas fa-search"></i> 案例分析' : ''}
                    ${s.type === 'application' ? '<i class="fas fa-tools"></i> 实战应用' : ''}
                  </div>
                  <h4>${s.title}</h4>
                  <p>${s.content}</p>
                  ${s.data ? `<div class="section-data"><i class="fas fa-database"></i> ${s.data}</div>` : ''}
                </div>
              `).join('')}

              <div class="lesson-keyterms">
                <h4><i class="fas fa-key"></i> 关键术语</h4>
                <div class="keyterms-grid">
                  ${lesson.keyTerms.map(t => `
                    <div class="keyterm-item">
                      <span class="keyterm-name">${t.term}</span>
                      <span class="keyterm-def">${t.def}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              ${lesson.connections ? `<div class="lesson-connections"><i class="fas fa-link"></i> ${lesson.connections}</div>` : ''}

              <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnFinance('${lesson.id}', ${idx}, this)">
                <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已读' : '标记已读'}
              </button>
            </div>
          </div>
        `;
      }).join('')}

      <div class="finance-phase-nav-footer">
        <p class="phase-nav-hint"><i class="fas fa-info-circle"></i> 点击上方阶段卡片切换学习内容，每日积累，循序渐进</p>
      </div>
    </div>
  `;
}

function toggleLesson(idx) {
  const body = $(`#lesson-body-${idx}`);
  const icon = $(`#lesson-icon-${idx}`);
  if (!body) return;
  body.classList.toggle('show');
  if (icon) icon.classList.toggle('fa-chevron-up');
}

function toggleLearnFinance(id, idx, btn) {
  toggleLearned('finance', id);
  const justLearned = isLearned('finance', id);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已读' : '标记已读'}`;
  const card = $(`#lesson-${idx}`);
  if (card) card.classList.toggle('learned', justLearned);
  showToast(justLearned ? '已标记为已读！' : '已取消标记');
  renderFinance($('#main-content'));
}

// 计算器已移除 — 用户不需要计算功能，专注知识科普

// ===== 每周热门基金拆解（每周一自动更新） =====
let currentFinanceWeek = 0;

function renderFinanceWeekly() {
  const c = document.getElementById('finance-weekly');
  if (!c) return;
  if (!FINANCE_WEEKLY_FUNDS || !FINANCE_WEEKLY_FUNDS.length) {
    c.innerHTML = `<div class="weekly-empty"><i class="fas fa-inbox"></i> 暂无数据，每周一自动更新 6 只热门/潜力基金拆解。</div>`;
    return;
  }
  const len = FINANCE_WEEKLY_FUNDS.length;
  const idx = Math.max(0, Math.min(len - 1, currentFinanceWeek));
  const wk = FINANCE_WEEKLY_FUNDS[len - 1 - idx];
  c.innerHTML = `
    <div class="weekly-card">
      <div class="weekly-header">
        <div class="weekly-title">
          <i class="fas fa-fire"></i>
          <div>
            <h2>每周热门基金拆解</h2>
            <span class="weekly-sub">${wk.label} · 每周一自动更新 6 只</span>
          </div>
        </div>
        <div class="weekly-switch">
          <button class="weekly-nav-btn" onclick="switchFinanceWeek(1)" ${idx === len - 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i> 更早</button>
          <span class="weekly-week-label">第 ${idx + 1}/${len} 周</span>
          <button class="weekly-nav-btn" onclick="switchFinanceWeek(-1)" ${idx === 0 ? 'disabled' : ''}>更新 <i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
      <div class="weekly-grid">
        ${wk.funds.map(f => `
          <div class="weekly-fund-card">
            <div class="weekly-fund-top">
              <span class="weekly-fund-cat">${f.category}</span>
              <span class="weekly-fund-code">${f.code}</span>
            </div>
            <h3 class="weekly-fund-name">${f.name}</h3>
            <div class="weekly-fund-row"><span class="wf-label">原理</span><p>${f.principle}</p></div>
            <div class="weekly-fund-row wf-adv"><span class="wf-label">优势</span><p>${f.advantage}</p></div>
            <div class="weekly-fund-row wf-suit"><span class="wf-label">适合</span><p>${f.suitable}</p></div>
            <div class="weekly-fund-row wf-risk"><span class="wf-label"><i class="fas fa-triangle-exclamation"></i> 风险</span><p>${f.risk}</p></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function switchFinanceWeek(dir) {
  const len = FINANCE_WEEKLY_FUNDS ? FINANCE_WEEKLY_FUNDS.length : 0;
  if (!len) return;
  currentFinanceWeek = Math.max(0, Math.min(len - 1, currentFinanceWeek + dir));
  renderFinanceWeekly();
  const c = document.getElementById('finance-weekly');
  if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 近期热点方向 =====
function renderFinanceHotTracks() {
  const c = document.getElementById('finance-hot');
  if (!c) return;
  if (!FINANCE_HOT_TRACKS || !FINANCE_HOT_TRACKS.length) {
    c.innerHTML = '';
    return;
  }
  c.innerHTML = `
    <div class="hot-panel">
      <div class="hot-header">
        <h2><i class="fas fa-bolt"></i> 近期热点方向</h2>
        <span class="hot-sub">哪个赛道热 · 为什么热 · 政策支持 · 短中期优劣</span>
      </div>
      <div class="hot-grid">
        ${FINANCE_HOT_TRACKS.map(t => `
          <div class="hot-card">
            <div class="hot-card-head">
              <span class="hot-emoji">${t.emoji}</span>
              <h3>${t.track}</h3>
            </div>
            <div class="hot-row hot-why"><span class="hot-label"><i class="fas fa-fire"></i> 为什么热</span><p>${t.whyHot}</p></div>
            <div class="hot-row hot-policy"><span class="hot-label"><i class="fas fa-landmark"></i> 政策支持</span><p>${t.policy}</p></div>
            <div class="hot-row hot-pros"><span class="hot-label"><i class="fas fa-thumbs-up"></i> 短期优点</span><p>${t.shortPros}</p></div>
            <div class="hot-row hot-cons"><span class="hot-label"><i class="fas fa-triangle-exclamation"></i> 短期缺点</span><p>${t.shortCons}</p></div>
            <div class="hot-note"><i class="fas fa-lightbulb"></i> ${t.note}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ============================================
   读书板块
   ============================================ */
let bookContainer = null;
let currentBookTab = 'featured';
let currentBookFeaturedCat = 'all';
let bookShelf = [];

function bookEsc(s) {
  return (s || '').replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
}

function renderBook(c) {
  bookContainer = c;
  const notes = loadData('mw_book_notes', []);
  c.innerHTML = `
    <div class="module-content book-module">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-book"></i> 读书</h1>
          <div class="subtitle">搜书 · 精选书摘 · 经典书单 · 读书笔记 — 每 3 日推送书摘与经典摘要</div>
        </div>
      </div>

      <div class="book-stats">
        <div class="book-stat clickable" onclick="switchBookTab('featured')" title="查看精选书摘"><span class="bs-num">${BOOK_FEATURED.length}</span><span class="bs-label">精选书摘</span></div>
        <div class="book-stat clickable" onclick="switchBookTab('featured')" title="查看已推送摘要"><span class="bs-num">${loadData('mw_book_digests', []).length}</span><span class="bs-label">已推送摘要</span></div>
        <div class="book-stat clickable" onclick="switchBookTab('classics')" title="查看经典书单"><span class="bs-num">${BOOK_SHELF_CLASSICS.length}</span><span class="bs-label">经典书单</span></div>
        <div class="book-stat clickable" onclick="switchBookTab('notes')" title="查看读书笔记"><span class="bs-num">${notes.length}</span><span class="bs-label">读书笔记</span></div>
      </div>

      <div class="book-tabs">
        <button class="book-tab ${currentBookTab === 'search' ? 'active' : ''}" onclick="switchBookTab('search')"><i class="fas fa-search"></i> 搜书</button>
        <button class="book-tab ${currentBookTab === 'featured' ? 'active' : ''}" onclick="switchBookTab('featured')"><i class="fas fa-quote-right"></i> 精选书摘</button>
        <button class="book-tab ${currentBookTab === 'classics' ? 'active' : ''}" onclick="switchBookTab('classics')"><i class="fas fa-star"></i> 经典书单</button>
        <button class="book-tab ${currentBookTab === 'notes' ? 'active' : ''}" onclick="switchBookTab('notes')"><i class="fas fa-pen-nib"></i> 读书笔记</button>
      </div>
      <div id="book-content"></div>
    </div>
  `;
  renderBookContent();
}

function switchBookTab(tab) {
  currentBookTab = tab;
  if (bookContainer) renderBook(bookContainer);
}

function renderBookContent() {
  const c = $('#book-content');
  if (currentBookTab === 'search') renderBookSearch(c);
  else if (currentBookTab === 'featured') renderBookFeatured(c);
  else if (currentBookTab === 'notes') renderBookNotes(c);
  else if (currentBookTab === 'classics') renderBookClassics(c);
  else renderBookFeatured(c);
}

// ---- 经典书单（马雯指定必读，附找书/阅读资源） ----
function renderBookClassics(c) {
  const shelf = loadData('mw_bookshelf', []);
  const inShelf = new Set(shelf.map(b => b.classicId).filter(Boolean));
  c.innerHTML = `
    <div class="classics-wrap">
      <div class="classics-head">
        <i class="fas fa-star"></i>
        <div>
          <h3>经典书单 · 马雯指定必读</h3>
          <p>每一本都是值得反复读的经典。点「找书」去豆瓣/微信读书/京东/鸠摩搜书或阅读，点「加入书架」开始你的阅读计划。</p>
        </div>
      </div>
      <div class="classics-grid">
        ${BOOK_SHELF_CLASSICS.map(b => `
          <div class="classic-card">
            <div class="classic-top">
              <span class="classic-tag">${b.tag}</span>
              ${inShelf.has(b.id) ? '<span class="classic-on-shelf"><i class="fas fa-check"></i> 已在书架</span>' : ''}
            </div>
            <div class="classic-title">${b.title}</div>
            <div class="classic-author">${b.author}</div>
            <p class="classic-blurb">${b.blurb}</p>
            <div class="classic-resources">
              ${BOOK_SEARCH_ENGINES.slice(0, 4).map(e => `
                <a class="classic-res" href="${e.url(b.title)}" target="_blank" rel="noopener" title="${e.name}">
                  <i class="fas ${e.icon}" style="color:${e.color}"></i> ${e.name}
                </a>`).join('')}
            </div>
            <button class="classic-add-btn" onclick="addClassicToShelf('${b.id}')" ${inShelf.has(b.id) ? 'disabled' : ''}>
              <i class="fas fa-plus"></i> ${inShelf.has(b.id) ? '已加入' : '加入书架'}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function addClassicToShelf(id) {
  const b = BOOK_SHELF_CLASSICS.find(x => x.id === id);
  if (!b) return;
  const shelf = loadData('mw_bookshelf', []);
  if (shelf.some(x => x.classicId === id)) { showToast('已在书架', 'error'); return; }
  shelf.unshift({ id: uid(), classicId: id, title: b.title, author: b.author, status: 'want', progress: 0, note: '' });
  saveData('mw_bookshelf', shelf);
  renderBookContent();
  showToast('已加入书架：' + b.title);
}

// ---- 大类1：搜书 ----
function renderBookSearch(c) {
  c.innerHTML = `
    <div class="book-search-wrap">
      <div class="search-bar-wrapper">
        <div class="search-bar">
          <i class="fas fa-book search-bar-icon"></i>
          <input type="text" id="book-search-input" class="search-input" placeholder="输入书名 / 作者 / 关键词，搜全网图书" onkeydown="if(event.key==='Enter') doBookSearch()">
          <button class="search-btn" onclick="doBookSearch()"><i class="fas fa-arrow-right"></i></button>
        </div>
      </div>
      <p class="book-search-hint">选择平台一键搜索，结果在新标签页打开，可在线试读 / 购买。外链若打不开，可把公版书加入书架，点「本地阅读」离线阅读：</p>
      <div class="search-engine-grid" id="book-engine-grid"></div>

      <div class="book-free-section">
        <h3><i class="fas fa-gift"></i> 免费正版阅读平台</h3>
        <div class="book-free-grid">
          ${BOOK_FREE_PLATFORMS.map(p => `<a href="${p.url}" target="_blank" rel="noopener" class="book-free-card"><i class="fas fa-external-link-alt"></i><div><span class="book-free-name">${p.name}</span><span class="book-free-desc">${p.desc}</span></div></a>`).join('')}
        </div>
        <p class="book-free-note">提示：受版权保护的新书多需购买或会员；公版书（如《红楼梦》《小王子》）可在微信读书、Project Gutenberg 等平台免费读全文。</p>
      </div>
    </div>
  `;
  renderBookEngines();
}

function renderBookEngines() {
  const q = ($('#book-search-input') ? $('#book-search-input').value.trim() : '');
  const grid = $('#book-engine-grid');
  if (!grid) return;
  grid.innerHTML = BOOK_SEARCH_ENGINES.map(e => `
    <a href="${e.url(q)}" target="_blank" rel="noopener" class="search-engine-card" style="--engine-color:${e.color}">
      <div class="search-engine-icon" style="background:${e.color}"><i class="fas ${e.icon}"></i></div>
      <div class="search-engine-info">
        <span class="search-engine-name">${e.name}</span>
        <span class="search-engine-action">${q ? '搜索「' + bookEsc(q) + '」' : '浏览首页'} <i class="fas fa-external-link-alt"></i></span>
      </div>
    </a>
  `).join('');
}

function doBookSearch() {
  const q = $('#book-search-input').value.trim();
  if (!q) { showToast('请输入书名或关键词', 'error'); return; }
  renderBookEngines();
  const first = BOOK_SEARCH_ENGINES[0];
  window.open(first.url(q), '_blank');
}

// ---- 大类2：精选书摘 ----
function renderBookFeatured(c) {
  ensureBookDigest();
  var digests = loadData('mw_book_digests', []);
  var last = loadData('mw_book_digest_last', 0);
  var lastTxt = last ? ('上次推送：' + new Date(last).toLocaleDateString('zh-CN')) : '尚未推送';
  const cats = ['all'].concat(Array.from(new Set(BOOK_FEATURED.map(f => f.category))));
  const list = currentBookFeaturedCat === 'all' ? BOOK_FEATURED : BOOK_FEATURED.filter(f => f.category === currentBookFeaturedCat);
  c.innerHTML = `
    <div class="book-featured-wrap">
      <div class="book-featured-banner">
        <i class="fas fa-sync-alt"></i>
        <span>精选书摘 + 经典书籍摘要，每 3 日自动推送一批（${lastTxt}）</span>
        <button class="bf-push-btn" onclick="ensureBookDigest(true); renderBookContent();"><i class="fas fa-plus"></i> 立即推送一批</button>
      </div>

      ${digests.length ? `
      <div class="book-digest-section">
        <h3 class="book-digest-head"><i class="fas fa-stream"></i> 已推送书摘 / 经典摘要（${digests.length}）</h3>
        <div class="book-featured-grid">
          ${digests.map(function(d){ return bookDigestCard(d); }).join('')}
        </div>
      </div>` : ''}

      <div class="book-featured-cats">
        ${cats.map(cat => `<button class="book-cat-chip ${cat === currentBookFeaturedCat ? 'active' : ''}" onclick="switchBookFeaturedCat('${cat}')">${cat === 'all' ? '全部' : cat}</button>`).join('')}
      </div>
      <div class="book-featured-grid">
        ${list.map(f => bookFeaturedCard(f)).join('')}
      </div>
    </div>
  `;
}

function bookDigestCard(d) {
  var typeMap = { summary: '书籍摘要', excerpt: '经典摘录', note: '读书笔记' };
  var dateTxt = d.pushedAt ? new Date(d.pushedAt).toLocaleDateString('zh-CN') : '';
  var long = (d.content && d.content.length > 150);
  return `
    <div class="book-featured-card type-${d.type}">
      <div class="bf-top">
        <span class="bf-type">${typeMap[d.type] || '摘要'}</span>
        <span class="bf-cat">${d.category || ''}</span>
        <span class="bf-date">${dateTxt}</span>
      </div>
      <h3 class="bf-title">${d.title}</h3>
      <p class="bf-author">${d.author || ''}</p>
      <div class="bf-content ${long ? 'collapsed' : ''}" id="bf-content-${d.id}">${(d.content||'').replace(/\n/g, '<br>')}</div>
      ${long ? `<button class="bf-expand-btn" onclick="toggleBookFeatured('${d.id}')">展开全文 <i class="fas fa-chevron-down"></i></button>` : ''}
      <div class="bf-source"><i class="fas fa-quote-left"></i> ${d.source || ''}</div>
    </div>
  `;
}

function bookFeaturedCard(f) {
  const typeMap = { excerpt: '经典摘录', note: '读书心得', chapter: '经典章节' };
  const long = f.content.length > 150;
  return `
    <div class="book-featured-card type-${f.type}">
      <div class="bf-top">
        <span class="bf-type">${typeMap[f.type]}</span>
        <span class="bf-cat">${f.category}</span>
      </div>
      <h3 class="bf-title">${f.title}</h3>
      <p class="bf-author">${f.author}</p>
      <div class="bf-content ${long ? 'collapsed' : ''}" id="bf-content-${f.id}">${f.content.replace(/\n/g, '<br>')}</div>
      ${long ? `<button class="bf-expand-btn" onclick="toggleBookFeatured('${f.id}')">展开全文 <i class="fas fa-chevron-down"></i></button>` : ''}
      <div class="bf-source"><i class="fas fa-quote-left"></i> ${f.source}</div>
    </div>
  `;
}

function switchBookFeaturedCat(cat) {
  currentBookFeaturedCat = cat;
  renderBookContent();
}

function toggleBookFeatured(id) {
  const el = document.getElementById('bf-content-' + id);
  if (!el) return;
  el.classList.toggle('collapsed');
  const btn = el.parentElement.querySelector('.bf-expand-btn');
  if (btn) btn.innerHTML = el.classList.contains('collapsed') ? '展开全文 <i class="fas fa-chevron-down"></i>' : '收起 <i class="fas fa-chevron-up"></i>';
}

// ---- 大类3：我的书架 ----
function renderBookShelf(c) {
  bookShelf = loadData('mw_bookshelf', []);
  const statusMap = { want: '想读', reading: '在读', done: '读完' };
  const groups = ['want', 'reading', 'done'];
  c.innerHTML = `
    <div class="book-shelf-wrap">
      <div class="book-shelf-form">
        <h3><i class="fas fa-plus-circle"></i> 添加一本书</h3>
        <div class="bsf-row">
          <input type="text" id="bs-title" placeholder="书名 *" class="bs-input">
          <input type="text" id="bs-author" placeholder="作者（选填）" class="bs-input">
        </div>
        <div class="bsf-row">
          <select id="bs-status" class="bs-input">
            <option value="want">想读</option>
            <option value="reading">在读</option>
            <option value="done">读完</option>
          </select>
          <input type="number" id="bs-progress" min="0" max="100" value="0" placeholder="进度%" class="bs-input">
        </div>
        <textarea id="bs-note" placeholder="读书笔记 / 一句话感悟（选填）" class="bs-textarea"></textarea>
        <button class="bs-add-btn" onclick="addBook()"><i class="fas fa-plus"></i> 加入书架</button>
      </div>

      ${bookShelf.length === 0 ? `
      <div class="bs-empty-guide">
        <i class="fas fa-book-open"></i>
        <p>书架还是空的。点上方添加你的第一本书，或去 <a class="bs-jump" onclick="switchBookTab('classics')">经典书单</a> 一键加入必读经典 👇</p>
      </div>` : ''}

      <div class="book-shelf-list">
        ${groups.map(g => `
          <div class="bs-group">
            <h4 class="bs-group-title">${statusMap[g]} <span class="bs-count">${bookShelf.filter(b => b.status === g).length}</span></h4>
            ${bookShelf.filter(b => b.status === g).length ? bookShelf.filter(b => b.status === g).map(b => `
              <div class="bs-item">
                <div class="bs-item-main">
                  <div class="bs-item-title clickable" onclick="openReader('${b.id}')" title="点开阅读">${b.title}${b.author ? `<span class="bs-item-author"> · ${b.author}</span>` : ''}</div>
                  ${b.note ? `<p class="bs-item-note">${b.note.replace(/\n/g, '<br>')}</p>` : ''}
                  <div class="bs-item-links">
                    ${b.content
                      ? `<button class="bs-read-btn primary" onclick="openReader('${b.id}')"><i class="fas fa-book"></i> 本地阅读</button>`
                      : `<a class="bs-read-btn primary" href="${bookGushiwenUrl(b.title)}" target="_blank" rel="noopener" title="去古诗文网在线读"><i class="fas fa-book-open"></i> 去古诗文网读</a>`}
                    ${b.gutenberg ? `<a class="bs-read-btn ghost" href="${b.gutenberg}" target="_blank" rel="noopener" title="Project Gutenberg 在线全文"><i class="fas fa-external-link-alt"></i> 在线全文</a>` : ''}
                    <a class="bs-read-btn ghost" href="${bookFindUrl(b.title)}" target="_blank" rel="noopener" title="搜书"><i class="fas fa-search"></i> 找书</a>
                  </div>
                </div>
                <div class="bs-item-side">
                  <input type="range" min="0" max="100" value="${b.progress || 0}" class="bs-range" oninput="this.nextElementSibling.textContent=this.value+'%'" onchange="updateBookProgress('${b.id}', this.value)">
                  <span class="bs-progress-num">${b.progress || 0}%</span>
                </div>
                <div class="bs-item-actions">
                  <select class="bs-status-select" onchange="updateBookStatus('${b.id}', this.value)">
                    ${groups.map(g2 => `<option value="${g2}" ${g2 === b.status ? 'selected' : ''}>${statusMap[g2]}</option>`).join('')}
                  </select>
                  <button class="bs-del-btn" onclick="deleteBook('${b.id}')"><i class="fas fa-trash"></i></button>
                </div>
              </div>
            `).join('') : `<p class="bs-empty">还没有${statusMap[g]}的书</p>`}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function addBook() {
  const title = $('#bs-title').value.trim();
  if (!title) { showToast('请输入书名', 'error'); return; }
  bookShelf = loadData('mw_bookshelf', []);
  bookShelf.unshift({
    id: 'bk-' + Date.now(),
    title,
    author: $('#bs-author').value.trim(),
    status: $('#bs-status').value,
    progress: parseInt($('#bs-progress').value) || 0,
    note: $('#bs-note').value.trim(),
    added: Date.now()
  });
  saveData('mw_bookshelf', bookShelf);
  showToast('已加入书架');
  renderBookContent();
}

function updateBookStatus(id, status) {
  bookShelf = loadData('mw_bookshelf', []);
  const b = bookShelf.find(x => x.id === id);
  if (b) {
    b.status = status;
    if (status === 'done') b.progress = 100;
    saveData('mw_bookshelf', bookShelf);
    renderBookContent();
  }
}

function updateBookProgress(id, val) {
  bookShelf = loadData('mw_bookshelf', []);
  const b = bookShelf.find(x => x.id === id);
  if (b) {
    b.progress = parseInt(val);
    if (b.progress >= 100) b.status = 'done';
    saveData('mw_bookshelf', bookShelf);
    renderBookContent();
  }
}

function deleteBook(id) {
  bookShelf = loadData('mw_bookshelf', []);
  bookShelf = bookShelf.filter(x => x.id !== id);
  saveData('mw_bookshelf', bookShelf);
  showToast('已删除');
  renderBookContent();
}

// ---- 预置可阅读公版书 + 阅读器 ----
function bookFindUrl(title) {
  const e = (typeof BOOK_SEARCH_ENGINES !== 'undefined' && BOOK_SEARCH_ENGINES[0]) || null;
  if (e) return e.url(title);
  return 'https://book.douban.com/subject_search?search_text=' + encodeURIComponent(title || '');
}

function bookWereadUrl(title) {
  const list = (typeof BOOK_SEARCH_ENGINES !== 'undefined') ? BOOK_SEARCH_ENGINES : [];
  const wr = list.find(e => e.id === 'weread') || list[1] || null;
  if (wr) return wr.url(title);
  return 'https://weread.qq.com/search?keyword=' + encodeURIComponent(title || '');
}

function bookGushiwenUrl(title) {
  return 'https://so.gushiwen.cn/search.aspx?value=' + encodeURIComponent(title || '');
}

function seedShelfIfNeeded() {
  if (typeof window.SEED_BOOKS === 'undefined') return;
  if (loadData('mw_bookshelf_seeded_v6', false)) return;
  let shelf = loadData('mw_bookshelf', []);
  // 清理旧版空壳种子书（无本地正文、也无在线全文链接），避免用户看到"点不开"的空书
  shelf = shelf.filter(function(b) {
    if (b.seed === true && !b.content && !b.gutenberg) return false;
    return true;
  });
  window.SEED_BOOKS.forEach(function(s) {
    if (shelf.some(function(b) { return b.seedId === s.id; })) return;
    const text = (window.BOOK_TEXTS && window.BOOK_TEXTS[s.id]) || '';
    shelf.push({
      id: 'bk-' + s.id,
      seedId: s.id,
      title: s.title,
      author: s.author,
      status: 'reading',
      progress: 0,
      note: s.blurb || '',
      content: text,
      gutenberg: s.gutenberg || '',
      lang: s.lang || 'en',
      seed: true,
      added: Date.now()
    });
  });

  saveData('mw_bookshelf', shelf);
  saveData('mw_bookshelf_seeded_v5', true);
}

// 每 3 日从 BOOK_DIGEST_POOL 轮流推送若干本「精选书摘 / 经典书籍摘要」到 localStorage
// force=true 时忽略 3 天间隔（手动「立即推送」用）
function ensureBookDigest(force) {
  if (typeof BOOK_DIGEST_POOL === 'undefined' || !BOOK_DIGEST_POOL.length) return;
  var digests = loadData('mw_book_digests', []);
  var last = loadData('mw_book_digest_last', 0);
  var idx = loadData('mw_book_digest_idx', 0);
  var now = Date.now();
  var THREE = 3 * 86400000;
  if (!force && last !== 0 && (now - last) < THREE) return; // 未到 3 天，不重复推送
  var pool = BOOK_DIGEST_POOL;
  var batch = 3;
  for (var i = 0; i < batch; i++) {
    var item = pool[idx % pool.length];
    idx++;
    digests.unshift({
      id: item.id,
      title: item.title,
      author: item.author,
      category: item.category,
      type: item.type,
      content: item.content,
      source: item.source,
      pushedAt: now
    });
  }
  if (digests.length > 30) digests = digests.slice(0, 30);
  saveData('mw_book_digests', digests);
  saveData('mw_book_digest_last', now);
  saveData('mw_book_digest_idx', idx % pool.length);
}

let readerScrollHandler = null;
function openReader(id) {
  bookShelf = loadData('mw_bookshelf', []);
  const b = bookShelf.find(function(x) { return x.id === id; });
  if (!b) return;
  const hasContent = !!(b.content && b.content.trim());
  let ov = document.getElementById('book-reader-overlay');
  if (ov) ov.remove();
  ov = document.createElement('div');
  ov.className = 'modal-overlay book-reader-overlay show';
  ov.id = 'book-reader-overlay';
  ov.setAttribute('data-id', id);
  ov.innerHTML = `
    <div class="modal-content book-reader-modal">
      <div class="br-head">
        <div class="br-title"><i class="fas fa-book-open"></i> <span id="br-name">${bookEsc(b.title)}</span>
          ${b.author ? `<span class="br-author">${bookEsc(b.author)}</span>` : ''}
          ${b.lang === 'en' ? '<span class="br-lang">EN</span>' : ''}
        </div>
        <div class="br-tools">
          <button class="br-tool" onclick="readerEditMode()"><i class="fas fa-edit"></i> 编辑正文</button>
          ${b.gutenberg ? `<a class="br-tool" href="${b.gutenberg}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> 在线全文</a>` : ''}
          <button class="br-tool close" onclick="closeReader()"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="br-progress"><div class="br-progress-fill" id="br-fill" style="width:${b.progress || 0}%"></div></div>
      <div class="br-body" id="br-body">
        ${hasContent ? '' : `<div class="br-empty">
          <i class="fas fa-book"></i>
          <p>这本书还没有本地正文。</p>
          <p style="margin:10px 0;"><a class="br-go-read" href="${bookGushiwenUrl(b.title)}" target="_blank" rel="noopener"><i class="fas fa-book-open"></i> 去古诗文网读《${bookEsc(b.title)}》</a></p>
          <p>或点右上角「编辑正文」把你的书全文粘贴进来，就能在这里离线阅读，滚动会自动记录进度。</p>
          ${b.gutenberg ? `<p>也可点「在线全文」去 Project Gutenberg 免费读完整公版原著。</p>` : ''}
        </div>`}
        <div class="br-text" id="br-text"></div>
      </div>
    </div>`;
  document.body.appendChild(ov);
  const body = document.getElementById('br-body');
  const fill = document.getElementById('br-fill');
  if (hasContent) {
    document.getElementById('br-text').textContent = b.content;
    if (b.scrollPos) body.scrollTop = b.scrollPos;
  }
  if (readerScrollHandler) body.removeEventListener('scroll', readerScrollHandler);
  readerScrollHandler = function() {
    const max = body.scrollHeight - body.clientHeight;
    const pct = max > 0 ? Math.round(body.scrollTop / max * 100) : 0;
    fill.style.width = pct + '%';
    b.scrollPos = body.scrollTop;
    b.progress = Math.max(b.progress || 0, pct);
    if (b.progress >= 95 && b.status !== 'done') b.status = 'done';
    clearTimeout(window.__brSaveT);
    window.__brSaveT = setTimeout(function() { saveData('mw_bookshelf', bookShelf); }, 400);
  };
  body.addEventListener('scroll', readerScrollHandler);
  ov.addEventListener('click', function(e) { if (e.target === ov) closeReader(); });
}

function closeReader() {
  const ov = document.getElementById('book-reader-overlay');
  if (ov) ov.remove();
}

function readerEditMode() {
  const ov = document.getElementById('book-reader-overlay');
  if (!ov) return;
  const id = ov.getAttribute('data-id');
  const b = (loadData('mw_bookshelf', [])).find(function(x) { return x.id === id; });
  if (!b) return;
  const body = document.getElementById('br-body');
  body.innerHTML = `
    <div class="br-edit">
      <p class="br-edit-hint">把这本书的全文粘贴到这里（可来自你自己的副本或公版书源）。保存后就能在上方阅读器里阅读，滚动会自动记录进度。</p>
      <textarea id="br-edit-area" class="br-edit-area" placeholder="在此粘贴书籍全文…"></textarea>
      <div class="br-edit-actions">
        <button class="br-tool" onclick="readerSaveContent()"><i class="fas fa-save"></i> 保存正文</button>
        <button class="br-tool" onclick="openReader('${id}')"><i class="fas fa-arrow-left"></i> 返回阅读</button>
      </div>
    </div>`;
  document.getElementById('br-edit-area').value = b.content || '';
}

function readerSaveContent() {
  const ov = document.getElementById('book-reader-overlay');
  if (!ov) return;
  const id = ov.getAttribute('data-id');
  const ta = document.getElementById('br-edit-area');
  if (!ta) return;
  const txt = ta.value;
  bookShelf = loadData('mw_bookshelf', []);
  const b = bookShelf.find(function(x) { return x.id === id; });
  if (b) {
    b.content = txt;
    if (!b.status || b.status === 'want') b.status = 'reading';
    saveData('mw_bookshelf', bookShelf);
  }
  openReader(id);
}

// ---- 大类4：我的读书笔记 ----
function renderBookNotes(c) {
  const notes = loadData('mw_book_notes', []);
  notes.sort((a, b) => (b.updated || 0) - (a.updated || 0));
  c.innerHTML = `
    <div class="book-notes-wrap">
      <div class="bn-form">
        <h3><i class="fas fa-pen-nib"></i> 写一条读书笔记</h3>
        <input type="text" id="bn-title" placeholder="书名 / 笔记标题（选填）" class="bn-input">
        <textarea id="bn-content" placeholder="记录你的感悟、摘抄、疑问或联想…（支持换行）" class="bn-textarea"></textarea>
        <div class="bn-tags-row">
          <input type="text" id="bn-tags" placeholder="标签（选填，逗号分隔，如：哲学,摘抄）" class="bn-input">
          <button class="bn-save" onclick="addBookNote()"><i class="fas fa-save"></i> 保存笔记</button>
        </div>
      </div>

      ${notes.length ? `
      <div class="bn-list-head">共 ${notes.length} 条笔记</div>
      <div class="bn-list">
        ${notes.map(n => `
          <div class="bn-item">
            <div class="bn-item-head">
              <span class="bn-item-title">${n.title || '（无标题）'}</span>
              <span class="bn-item-date">${formatDate(n.updated)}</span>
            </div>
            ${n.tags && n.tags.length ? `<div class="bn-item-tags">${n.tags.map(t => `<span class="bn-tag">${t}</span>`).join('')}</div>` : ''}
            <p class="bn-item-content">${n.content.replace(/\n/g, '<br>')}</p>
            <div class="bn-item-actions">
              <button onclick="deleteBookNote('${n.id}')"><i class="fas fa-trash"></i> 删除</button>
            </div>
          </div>
        `).join('')}
      </div>` : '<div class="empty-state"><i class="fas fa-pen-nib"></i><p>还没有笔记，写下第一条吧</p></div>'}
    </div>
  `;
}

function addBookNote() {
  const title = $('#bn-title').value.trim();
  const content = $('#bn-content').value.trim();
  if (!content) { showToast('请先写点内容', 'error'); return; }
  const tags = $('#bn-tags').value.split(/[,，]/).map(s => s.trim()).filter(Boolean);
  const notes = loadData('mw_book_notes', []);
  notes.push({ id: 'bn-' + uid(), title, content, tags, updated: Date.now() });
  saveData('mw_book_notes', notes);
  recordActivity('book', 'note', 1);
  showToast('笔记已保存');
  renderBookContent();
}

function deleteBookNote(id) {
  if (!confirm('确定删除这条笔记吗？')) return;
  let notes = loadData('mw_book_notes', []);
  notes = notes.filter(n => n.id !== id);
  saveData('mw_book_notes', notes);
  renderBookContent();
}

function formatDate(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* ============================================
   每日大事件板块
   ============================================ */
function renderNews(c) {
  const todayStr = today();
  const news = getNewsByDate(todayStr);
  const recentNews = getRecentNews(3);

  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-newspaper"></i> 每日大事件</h1>
          <div class="subtitle">了解世界，洞察趋势 — ${new Date().toLocaleDateString('zh-CN', {year:'numeric',month:'long',day:'numeric'})}</div>
        </div>
      </div>

      <div class="news-filters">
        ${NEWS_CATEGORIES.map(cat => `
          <button class="news-filter ${cat.id === 'all' ? 'active' : ''}" data-cat="${cat.id}" onclick="filterNews('${cat.id}')">
            <i class="fas ${cat.icon}"></i> ${cat.label}
          </button>
        `).join('')}
      </div>

      <div id="news-grid"></div>

      <div style="margin-top:32px;">
        <h3 style="font-size:18px;margin-bottom:16px;"><i class="fas fa-rss"></i> 新闻来源</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          ${NEWS_SOURCES.map(s => `
            <a href="${s.url}" target="_blank" class="news-filter" style="text-decoration:none;cursor:pointer;">
              <i class="fas fa-external-link-alt"></i> ${s.name}
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  renderNewsGrid(recentNews);
}

function filterNews(cat) {
  currentNewsFilter = cat;
  $$('.news-filter').forEach(f => f.classList.remove('active'));
  event.target.closest('.news-filter').classList.add('active');
  const recentNews = getRecentNews(3);
  renderNewsGrid(recentNews);
}

function renderNewsGrid(news) {
  const grid = $('#news-grid');
  if (!grid) return;

  let filtered = news;
  if (currentNewsFilter !== 'all') {
    filtered = news.filter(n => n.category === currentNewsFilter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <i class="fas fa-newspaper"></i>
        <p>暂无该分类的新闻</p>
      </div>
    `;
    return;
  }

  grid.className = 'news-grid';
  grid.innerHTML = filtered.map(n => {
    const cat = NEWS_CATEGORIES.find(c => c.id === n.category);
    return `
      <div class="news-card" onclick="showNewsDetail('${n.id}')">
        <div class="news-card-banner cat-${n.category}"></div>
        <div class="news-card-body">
          <span class="news-tag ${n.category}">${cat ? cat.label : ''}</span>
          <h3>${n.title}</h3>
          <p>${n.summary.substring(0, 100)}...</p>
          <div class="news-footer">
            <span class="news-time"><i class="fas fa-clock"></i> ${n.date || today()} ${n.time}</span>
            <span class="news-link">查看详情 <i class="fas fa-arrow-right"></i></span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function showNewsDetail(id) {
  const recentNews = getRecentNews(3);
  const n = recentNews.find(x => x.id === id);
  if (!n) return;
  const cat = NEWS_CATEGORIES.find(c => c.id === n.category);

  const modal = document.createElement('div');
  modal.className = 'news-detail-modal';
  modal.innerHTML = `
    <div class="news-detail-content">
      <button class="news-detail-close" onclick="this.closest('.news-detail-modal').remove()">&times;</button>
      <span class="news-tag ${n.category}">${cat ? cat.label : ''}</span>
      <h2>${n.title}</h2>
      <div class="news-detail-meta">
        <span><i class="fas fa-clock"></i> ${n.date || today()} ${n.time}</span>
        <span><i class="fas fa-newspaper"></i> ${n.source}</span>
      </div>
      ${n.detail.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      ${n.links ? `
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border-color);">
          <strong style="font-size:14px;">相关链接：</strong>
          ${n.links.map(l => `<a href="${l.url}" target="_blank" class="news-link" style="margin-right:16px;">${l.label} <i class="fas fa-external-link-alt"></i></a>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.remove();
  });
  document.body.appendChild(modal);
}

/* ============================================
   申论政治备考板块
   每日精读 + 金句闪卡 + 政策热词 + 写作微课 + 微练习
   ============================================ */
function renderShenlun(c) {
  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-feather-alt"></i> 申论政治备考</h1>
          <div class="subtitle">碎片化学习 · 每日精读（群众→专家→政府） · 金句闪卡 · 政策热词 · 优秀范文剖析 · 写作微课 · 微练习</div>
        </div>
      </div>

      <div class="shenlun-tabs">
        ${SHENLUN_TABS.map(t => `
          <button class="shenlun-tab ${t.id === currentShenlunTab ? 'active' : ''}" data-tab="${t.id}" onclick="switchShenlunTab('${t.id}')">
            <i class="fas ${t.icon}"></i> ${t.label}
          </button>
        `).join('')}
      </div>

      <div id="shenlun-content"></div>
    </div>
  `;
  renderShenlunContent();
}

/* ============================================
   常识积累板块（公务员备考 · 常识判断）
   设计：本周常识包(每周一自动换题) + 常识题库(分类/来源筛选,碎片刷题)
        + 每日一题 + 已掌握进度。题目优先取自近几年真题并标注来源。
   ============================================ */
let commonLearned = JSON.parse(localStorage.getItem('mw_common_learned') || '{}');
let commonCatFilter = 'all';
let commonSourceFilter = 'all';
let commonWeekIdx = 0; // 0 = 最新一期

function commonCat(id) { return COMMON_CATEGORIES.find(c => c.id === id) || { name: id, emoji: `📌`, color: `#888` }; }
function commonQuestionById(id) { return COMMON_QUESTIONS.find(q => q.id === id); }

function renderCommon(c) {
  const week = COMMON_WEEKLY[Math.min(commonWeekIdx, COMMON_WEEKLY.length - 1)];
  const weekQs = week.ids.map(commonQuestionById).filter(Boolean);
  const learnedInWeek = weekQs.filter(q => commonLearned[q.id]).length;
  const total = COMMON_QUESTIONS.length;
  const learnedTotal = COMMON_QUESTIONS.filter(q => commonLearned[q.id]).length;

  c.innerHTML = `
    <div class="common-header">
      <div>
        <h1><i class="fas fa-brain"></i> 常识积累</h1>
        <p class="common-sub">公务员备考 · 常识判断 · 碎片化刷题，题目优先取自近几年真题</p>
      </div>
      <div class="common-progress-pill">
        已掌握 <strong>${learnedTotal}</strong> / ${total}
      </div>
    </div>

    <div class="common-week-banner" id="common-week-banner"></div>

    <div class="common-daily" id="common-daily"></div>

    <div class="common-bank">
      <div class="common-bank-head">
        <h2><i class="fas fa-layer-group"></i> 常识题库</h2>
        <div class="common-filters" id="common-filters"></div>
      </div>
      <div class="common-grid" id="common-grid"></div>
    </div>
  `;

  renderCommonWeek(week, weekQs, learnedInWeek);
  renderCommonDaily();
  renderCommonFilters();
  renderCommonGrid();
}

function renderCommonWeek(week, weekQs, learnedInWeek) {
  const el = document.getElementById('common-week-banner');
  if (!el) return;
  const idx = COMMON_WEEKLY.indexOf(week);
  const isLatest = idx === 0;
  const pct = weekQs.length ? Math.round(learnedInWeek / weekQs.length * 100) : 0;
  el.innerHTML = `
    <div class="cw-top">
      <div class="cw-label"><i class="fas fa-calendar-week"></i> ${week.label}</div>
      <div class="cw-nav">
        <button class="cw-btn" ${idx >= COMMON_WEEKLY.length - 1 ? 'disabled' : ''} onclick="commonShiftWeek(1)"><i class="fas fa-chevron-left"></i> 更早</button>
        <button class="cw-btn" ${idx <= 0 ? 'disabled' : ''} onclick="commonShiftWeek(-1)">最新 <i class="fas fa-chevron-right"></i></button>
      </div>
    </div>
    <p class="cw-desc">本周包共 <strong>${weekQs.length}</strong> 题，来自国考 / 省考 / 联考 / 事业单位真题沉淀。${isLatest ? '每周一自动刷新新题。' : '历史归档，可回看复习。'}</p>
    <div class="cw-progress">
      <div class="cw-progress-bar" style="width:${pct}%"></div>
    </div>
    <div class="cw-progress-text">本周已掌握 ${learnedInWeek} / ${weekQs.length}</div>
    <div class="cw-cards" id="cw-cards"></div>
  `;
  const cards = document.getElementById('cw-cards');
  cards.innerHTML = weekQs.map(q => commonCardHTML(q, `cw`)).join('');
}

function commonShiftWeek(dir) {
  commonWeekIdx = Math.max(0, Math.min(COMMON_WEEKLY.length - 1, commonWeekIdx + dir));
  const week = COMMON_WEEKLY[commonWeekIdx];
  const weekQs = week.ids.map(commonQuestionById).filter(Boolean);
  const learnedInWeek = weekQs.filter(q => commonLearned[q.id]).length;
  renderCommonWeek(week, weekQs, learnedInWeek);
}

function renderCommonDaily() {
  const el = document.getElementById('common-daily');
  if (!el) return;
  const today = new Date();
  const key = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const q = COMMON_QUESTIONS[hashDate(key) % COMMON_QUESTIONS.length];
  const cat = commonCat(q.cat);
  el.innerHTML = `
    <div class="cd-tag" style="background:${cat.color}">${cat.emoji} ${cat.name} · 每日一题</div>
    <div class="cd-body">
      <div class="cd-q">${q.q}</div>
      <div class="cd-meta">来源：${q.source}（${q.year}）</div>
      <button class="cd-btn" onclick="commonReveal('cd-answer')">显示答案与解析</button>
      <div class="cd-answer" id="cd-answer" style="display:none">
        <div class="cd-correct">正确答案：${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}</div>
        <p class="cd-explain">${q.explain}</p>
      </div>
    </div>
  `;
}

function commonCardHTML(q, scope) {
  const cat = commonCat(q.cat);
  const learned = commonLearned[q.id] ? ' learned' : '';
  const opts = q.options.map((o, i) => `
    <div class="cc-opt ${i === q.answer ? 'is-correct' : ''}">
      <span class="cc-letter">${String.fromCharCode(65 + i)}</span>${o}
    </div>`).join('');
  return `
    <div class="common-card${learned}" data-id="${q.id}">
      <div class="cc-head">
        <span class="cc-cat" style="background:${cat.color}">${cat.emoji} ${cat.name}</span>
        <span class="cc-source">${q.source} · ${q.year}</span>
      </div>
      <div class="cc-q">${q.q}</div>
      <div class="cc-opts">${opts}</div>
      <div class="cc-answer" id="${scope}-ans-${q.id}" style="display:none">
        <div class="cc-correct">正确答案：${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}</div>
        <p class="cc-explain">${q.explain}</p>
      </div>
      <div class="cc-actions">
        <button class="cc-btn" onclick="commonReveal('${scope}-ans-${q.id}')">显示答案</button>
        <button class="cc-learn ${learned ? 'on' : ''}" onclick="commonToggleLearn('${q.id}')">
          <i class="fas fa-${commonLearned[q.id] ? 'check' : 'circle'}"></i> ${commonLearned[q.id] ? '已掌握' : '标记掌握'}
        </button>
      </div>
    </div>`;
}

function commonReveal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function commonToggleLearn(id) {
  if (commonLearned[id]) delete commonLearned[id];
  else commonLearned[id] = true;
  localStorage.setItem('mw_common_learned', JSON.stringify(commonLearned));
  // 轻量刷新：重渲染当前视图
  const c = document.getElementById('main-content');
  if (c) renderCommon(c);
}

function renderCommonFilters() {
  const el = document.getElementById('common-filters');
  if (!el) return;
  const sources = [...new Set(COMMON_QUESTIONS.map(q => q.source))];
  const catChips = [{ id: 'all', name: `全部分类`, emoji: `📚` }]
    .concat(COMMON_CATEGORIES.map(c => ({ id: c.id, name: c.name, emoji: c.emoji })));
  const srcChips = [{ id: 'all', name: `全部来源` }].concat(sources.map(s => ({ id: s, name: s })));
  el.innerHTML = `
    <div class="cf-row">
      ${catChips.map(c => `<button class="cf-chip ${commonCatFilter === c.id ? 'on' : ''}" onclick="commonSetCat('${c.id}')">${c.emoji || ''} ${c.name}</button>`).join('')}
    </div>
    <div class="cf-row cf-src">
      ${srcChips.map(s => `<button class="cf-chip small ${commonSourceFilter === s.id ? 'on' : ''}" onclick="commonSetSource('${s.id}')">${s.name}</button>`).join('')}
    </div>
  `;
}

function commonSetCat(id) { commonCatFilter = id; renderCommonFilters(); renderCommonGrid(); }
function commonSetSource(id) { commonSourceFilter = id; renderCommonFilters(); renderCommonGrid(); }

function renderCommonGrid() {
  const el = document.getElementById('common-grid');
  if (!el) return;
  let list = COMMON_QUESTIONS;
  if (commonCatFilter !== 'all') list = list.filter(q => q.cat === commonCatFilter);
  if (commonSourceFilter !== 'all') list = list.filter(q => q.source === commonSourceFilter);
  el.innerHTML = list.length
    ? list.map(q => commonCardHTML(q, `bk`)).join('')
    : `<p class="common-empty">该筛选下暂无题目。</p>`;
}

/* ============================================
   杂学开眼板块（有趣 + 每日深耕）
   设计：今日深耕(按日期连载系列,逐集深入) + 随便逛逛(随机卡片)
        + 今日运势签(娱乐) + 深耕专题进度 + 全部分类卡片
   ============================================ */
let currentMiscCat = 'all';
let miscLiked = JSON.parse(localStorage.getItem('mw_misc_liked') || '{}');
let miscFollow = localStorage.getItem('mw_misc_follow') || 'auto';
let miscRead = JSON.parse(localStorage.getItem('mw_misc_read') || '{}');
let miscRandomCard = null;

function renderMisc(c) {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  c.innerHTML = `
    <div class="misc-header">
      <div>
        <h1><i class="fas fa-wand-magic-sparkles"></i> 杂学开眼</h1>
        <p class="misc-sub">每天深耕一个领域 · 有趣，也更有深度</p>
      </div>
      <div class="misc-streak" id="misc-streak"></div>
    </div>

    <div class="misc-daily" id="misc-daily"></div>

    <div class="misc-actions">
      <button class="misc-btn" onclick="miscBrowse()"><i class="fas fa-dice"></i> 随便逛逛</button>
      <button class="misc-btn" onclick="miscDraw()"><i class="fas fa-compass"></i> 今日运势签</button>
      <button class="misc-btn" onclick="miscScrollSeries()"><i class="fas fa-book-open"></i> 换专题深耕</button>
    </div>

    <div class="misc-random-box" id="misc-random-box" style="display:none"></div>
    <div class="misc-fortune" id="misc-fortune" style="display:none"></div>

    <div class="misc-series-section">
      <div class="misc-section-title">📚 专题深耕 · 进度</div>
      <div class="misc-series-list" id="misc-series-list"></div>
    </div>

    <div class="misc-section-title">🗂️ 全部冷知识 · 按分类浏览</div>
    <div class="misc-filters" id="misc-filters"></div>
    <div class="misc-grid" id="misc-grid"></div>
  `;
  renderMiscHero(today);
  renderMiscSeriesList();
  renderMiscFilters();
  renderMiscGrid();
  updateMiscStreak(dateKey);
}

// 日期字符串 -> 稳定数字（同天同结果，跨天变化）
function hashDate(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function miscCat(id) { return MISC_CATEGORIES.find(x => x.id === id) || { name: ``, emoji: ``, color: `#888` }; }

// 根据日期确定「当前在深耕哪一集」（自动模式：系列首尾相接连载）
function miscActiveSeries(date) {
  const epoch = new Date(2026, 6, 27); // 2026-07-27 起算
  const dayIndex = Math.floor((date - epoch) / 86400000);
  const lengths = MISC_SERIES.map(s => s.episodes.length);
  const sum = lengths.reduce((a, b) => a + b, 0);
  let idx = ((dayIndex % sum) + sum) % sum;
  for (let i = 0; i < MISC_SERIES.length; i++) {
    if (idx < lengths[i]) return { series: MISC_SERIES[i], epIndex: idx };
    idx -= lengths[i];
  }
  return { series: MISC_SERIES[0], epIndex: 0 };
}

// 今日深耕大卡：展示当前系列的一集，含进度与「标记已读」
function renderMiscHero(date) {
  const el = document.getElementById('misc-daily');
  if (!el) return;
  let series, epIndex;
  if (miscFollow === 'auto') {
    const a = miscActiveSeries(date);
    series = a.series; epIndex = a.epIndex;
  } else {
    series = MISC_SERIES.find(s => s.id === miscFollow) || MISC_SERIES[0];
    const dayIndex = Math.floor((date - new Date(2026, 6, 27)) / 86400000);
    epIndex = ((dayIndex % series.episodes.length) + series.episodes.length) % series.episodes.length;
  }
  const ep = series.episodes[epIndex];
  const cat = miscCat(series.cat);
  const key = series.id + '-' + ep.n;
  const read = !!miscRead[key];
  const total = series.episodes.length;
  const readCount = series.episodes.filter(e => miscRead[series.id + '-' + e.n]).length;
  const pct = total ? Math.round(readCount / total * 100) : 0;
  el.style.borderColor = cat.color;
  el.innerHTML = `
    <div class="misc-daily-tag" style="background:${cat.color}">${cat.emoji} ${cat.name} · 专题深耕</div>
    <div class="misc-hero-series">📚 ${series.emoji} ${series.title}</div>
    <div class="misc-hero-epinfo">第 ${ep.n} / ${total} 集 · ${read ? '✅ 已读' : '未读'}</div>
    <div class="misc-progress"><div class="misc-progress-bar" style="width:${pct}%;background:${cat.color}"></div></div>
    <div class="misc-daily-body">
      <div class="misc-daily-emoji">${series.emoji}</div>
      <div>
        <h2 class="misc-daily-title">${ep.title}</h2>
        <p class="misc-daily-content">${ep.content}</p>
        <p class="misc-daily-trivia">${ep.trivia}</p>
      </div>
    </div>
    <button class="misc-btn small ${read ? '' : 'primary'}" onclick="miscMarkEp('${series.id}', ${ep.n})">
      ${read ? '↺ 标为未读' : '✓ 标记已读（深耕 +1）'}
    </button>
  `;
}

function miscMarkEp(seriesId, n) {
  const key = seriesId + '-' + n;
  if (miscRead[key]) delete miscRead[key]; else miscRead[key] = true;
  localStorage.setItem('mw_misc_read', JSON.stringify(miscRead));
  renderMiscHero(new Date());
  renderMiscSeriesList();
}

// 随便逛逛：随机趣味卡片面板（保留「眼前一亮」的惊喜感）
function miscBrowse() {
  const box = document.getElementById('misc-random-box');
  if (!box) return;
  if (box.style.display === 'block') { box.style.display = 'none'; return; }
  miscRandomCard = MISC_CARDS[Math.floor(Math.random() * MISC_CARDS.length)];
  box.style.display = 'block';
  renderMiscRandom();
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function renderMiscRandom() {
  const box = document.getElementById('misc-random-box');
  if (!box || !miscRandomCard) return;
  const card = miscRandomCard;
  const cat = miscCat(card.cat);
  box.innerHTML = `
    <div class="misc-random-head"><i class="fas fa-dice"></i> 随便逛逛 · 眼前一亮</div>
    <div class="misc-card" style="border-left:4px solid ${cat.color}; margin-top:10px;">
      <div class="misc-card-top"><span class="misc-card-tag" style="color:${cat.color}">${cat.emoji} ${cat.name}</span></div>
      <div class="misc-card-emoji">${card.emoji}</div>
      <h3 class="misc-card-title">${card.title}</h3>
      <p class="misc-card-content">${card.content}</p>
      <p class="misc-card-trivia">${card.trivia}</p>
    </div>
    <button class="misc-btn small" onclick="miscShuffle()"><i class="fas fa-redo"></i> 换一张</button>
  `;
}
function miscShuffle() {
  miscRandomCard = MISC_CARDS[Math.floor(Math.random() * MISC_CARDS.length)];
  renderMiscRandom();
}

// 深耕专题列表（点击即「跟随」该系列，每天深一集）
function renderMiscSeriesList() {
  const el = document.getElementById('misc-series-list');
  if (!el) return;
  el.innerHTML = MISC_SERIES.map(s => {
    const cat = miscCat(s.cat);
    const readCount = s.episodes.filter(e => miscRead[s.id + '-' + e.n]).length;
    const total = s.episodes.length;
    const pct = total ? Math.round(readCount / total * 100) : 0;
    const active = (miscFollow === s.id) ? 'active' : '';
    return `
      <div class="misc-series-item ${active}" onclick="miscFollowSeries('${s.id}')" style="border-left:4px solid ${cat.color}">
        <div class="misc-series-top">
          <span class="misc-series-name">${s.emoji} ${s.title}</span>
          <span class="misc-series-pct">${readCount}/${total}</span>
        </div>
        <div class="misc-progress"><div class="misc-progress-bar" style="width:${pct}%;background:${cat.color}"></div></div>
        <div class="misc-series-intro">${s.intro}</div>
      </div>`;
  }).join('');
}
function miscFollowSeries(id) {
  miscFollow = (miscFollow === id) ? 'auto' : id;
  localStorage.setItem('mw_misc_follow', miscFollow);
  renderMiscHero(new Date());
  renderMiscSeriesList();
}
function miscScrollSeries() {
  const el = document.querySelector('.misc-series-section');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function miscDraw() {
  const box = document.getElementById('misc-fortune');
  if (!box) return;
  const ic = MISC_ICHING[Math.floor(Math.random() * MISC_ICHING.length)];
  const ta = MISC_TAROT[Math.floor(Math.random() * MISC_TAROT.length)];
  const co = MISC_CONSTELLATIONS[Math.floor(Math.random() * MISC_CONSTELLATIONS.length)];
  const line = MISC_FORTUNE_LINES[Math.floor(Math.random() * MISC_FORTUNE_LINES.length)];
  box.style.display = 'block';
  box.innerHTML = `
    <div class="misc-fortune-title"><i class="fas fa-compass"></i> 今日三签 · 随手一抽</div>
    <div class="misc-fortune-grid">
      <div class="fortune-card iching">
        <div class="fortune-label">☯ 今日卦象</div>
        <div class="fortune-symbol">${ic.symbol}</div>
        <div class="fortune-name">${ic.name}</div>
        <div class="fortune-mean">${ic.mean}</div>
      </div>
      <div class="fortune-card tarot">
        <div class="fortune-label">🔮 今日塔罗</div>
        <div class="fortune-symbol">🃏</div>
        <div class="fortune-name">${ta.cn}</div>
        <div class="fortune-mean">${ta.mean}</div>
      </div>
      <div class="fortune-card star">
        <div class="fortune-label">✨ 今日星象</div>
        <div class="fortune-symbol">⭐</div>
        <div class="fortune-name">${co.cn}</div>
        <div class="fortune-mean">${co.trait}</div>
      </div>
    </div>
    <div class="misc-fortune-line">💡 ${line}</div>
    <button class="misc-btn small" onclick="miscDraw()"><i class="fas fa-redo"></i> 再抽一次</button>
  `;
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderMiscFilters() {
  const el = document.getElementById('misc-filters');
  if (!el) return;
  const chips = [{ id: 'all', name: `全部`, emoji: `🎲`, color: `#6c5ce7` }]
    .concat(MISC_CATEGORIES.map(c => ({ id: c.id, name: c.name, emoji: c.emoji, color: c.color })));
  el.innerHTML = chips.map(ch => `
    <button class="misc-chip ${currentMiscCat === ch.id ? 'active' : ''}" data-cat="${ch.id}"
      style="${currentMiscCat === ch.id ? `background:${ch.color};border-color:${ch.color}` : `border-color:${ch.color};color:${ch.color}`}"
      onclick="miscFilter('${ch.id}')">${ch.emoji} ${ch.name}</button>
  `).join('');
}

function miscFilter(cat) {
  currentMiscCat = cat;
  renderMiscFilters();
  renderMiscGrid();
}

function renderMiscGrid() {
  const el = document.getElementById('misc-grid');
  if (!el) return;
  const list = currentMiscCat === 'all' ? MISC_CARDS : MISC_CARDS.filter(c => c.cat === currentMiscCat);
  el.innerHTML = list.map(card => {
    const cat = miscCat(card.cat);
    const liked = miscLiked[card.id] ? 'liked' : '';
    return `
      <div class="misc-card" style="border-left:4px solid ${cat.color}">
        <div class="misc-card-top">
          <span class="misc-card-tag" style="color:${cat.color}">${cat.emoji} ${cat.name}</span>
          <button class="misc-like ${liked}" onclick="miscToggleLike('${card.id}', this)">${miscLiked[card.id] ? '❤️' : '🤍'}</button>
        </div>
        <div class="misc-card-emoji">${card.emoji}</div>
        <h3 class="misc-card-title">${card.title}</h3>
        <p class="misc-card-content">${card.content}</p>
        <p class="misc-card-trivia">${card.trivia}</p>
      </div>`;
  }).join('');
}

function miscToggleLike(id, btn) {
  if (miscLiked[id]) { delete miscLiked[id]; btn.textContent = '🤍'; btn.classList.remove('liked'); }
  else { miscLiked[id] = true; btn.textContent = '❤️'; btn.classList.add('liked'); }
  localStorage.setItem('mw_misc_liked', JSON.stringify(miscLiked));
}

function updateMiscStreak(dateKey) {
  let data = JSON.parse(localStorage.getItem('mw_misc_streak') || '{}');
  if (data.last !== dateKey) {
    // 跨天：若昨天来过则+1，否则重置为1
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yKey = `${y.getFullYear()}-${y.getMonth()+1}-${y.getDate()}`;
    data.count = (data.last === yKey) ? (data.count || 0) + 1 : 1;
    data.last = dateKey;
    localStorage.setItem('mw_misc_streak', JSON.stringify(data));
  }
  const el = document.getElementById('misc-streak');
  if (el) el.innerHTML = `<i class="fas fa-fire"></i> 已开眼 <strong>${data.count || 1}</strong> 天`;
}

function switchShenlunTab(tab) {
  currentShenlunTab = tab;
  $$('.shenlun-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  renderShenlunContent();
}

function renderShenlunContent() {
  const c = $('#shenlun-content');
  switch(currentShenlunTab) {
    case 'reading': renderShenlunReading(c); break;
    case 'flashcard': renderShenlunFlashcard(c); break;
    case 'policy': renderShenlunPolicy(c); break;
    case 'essay': renderShenlunEssay(c); break;
    case 'microlesson': renderShenlunWriting(c); break;
    case 'micropractice': renderShenlunPractice(c); break;
  }
}

// ===== 每日精读（按 群众→专家→政府 分层，由浅入深） =====
let currentReadingTier = 'all';
function renderShenlunReading(c) {
  const tierOf = (art) => art.tier || '政府';
  const filterList = currentReadingTier === 'all' ? SHENLUN_READING_DATA : SHENLUN_READING_DATA.filter(a => tierOf(a) === currentReadingTier);
  const tiersToShow = currentReadingTier === 'all' ? SHENLUN_READING_TIERS : SHENLUN_READING_TIERS.filter(t => t.id === currentReadingTier);

  c.innerHTML = `
    <div class="reading-intro">
      <i class="fas fa-info-circle"></i>
      <p>精读分层设计：从 <b>群众视角</b>（最接地气的生活故事）到 <b>专家观点</b>（理论框架）再到 <b>政府文章</b>（权威范本），由浅入深，帮你形成系统的学习观与理论。每篇附批注分析。</p>
    </div>
    <div class="reading-tier-filters">
      <button class="rt-filter ${currentReadingTier === 'all' ? 'active' : ''}" onclick="switchReadingTier('all')">全部</button>
      ${SHENLUN_READING_TIERS.map(t => `
        <button class="rt-filter" onclick="switchReadingTier('${t.id}')">
          <span class="rt-tier-name ${currentReadingTier === t.id ? 'active' : ''}">${t.label}</span>
        </button>
      `).join('')}
    </div>
    ${tiersToShow.map(tier => {
      const arts = SHENLUN_READING_DATA.filter(a => tierOf(a) === tier.id);
      if (!arts.length) return '';
      return `
        <div class="reading-tier-group">
          <div class="reading-tier-header">
            <span class="rt-badge rt-${tier.id}">${tier.label}</span>
            <span class="rt-desc">${tier.desc}</span>
          </div>
          <div class="reading-list">
            ${arts.map(art => {
              const idx = SHENLUN_READING_DATA.indexOf(art);
              return `
              <div class="reading-card" id="read-${idx}">
                <div class="reading-header" onclick="toggleShenlunReading(${idx})">
                  <div>
                    <h3>${art.title}</h3>
                    <div class="reading-meta">
                      <span><i class="fas fa-newspaper"></i> ${art.source}</span>
                      <span><i class="fas fa-calendar"></i> ${art.date}</span>
                      ${art.tags.map(t => `<span class="reading-tag">${t}</span>`).join('')}
                    </div>
                    <p class="reading-excerpt">${art.excerpt}</p>
                  </div>
                  <i class="fas fa-chevron-down reading-expand-icon" id="read-icon-${idx}"></i>
                </div>
                <div class="reading-body" id="read-body-${idx}">
                  <div class="reading-content">
                    <h4>文章正文</h4>
                    <p>${art.content}</p>
                  </div>
                  <div class="reading-annotation">
                    <h4><i class="fas fa-highlighter"></i> 批注分析</h4>
                    ${art.annotation.map(a => `
                      <div class="annotation-item annotation-${a.type}">
                        <span class="annotation-type">${a.type === 'structure' ? '结构' : a.type === 'language' ? '语言' : a.type === 'technique' ? '技巧' : '运用'}</span>
                        <p>${a.text}</p>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
    }).join('')}
  `;
}

function switchReadingTier(tier) {
  currentReadingTier = tier;
  renderShenlunContent();
}

function toggleShenlunReading(idx) {
  const body = $(`#read-body-${idx}`);
  const icon = $(`#read-icon-${idx}`);
  if (!body) return;
  body.classList.toggle('show');
  if (icon) icon.classList.toggle('fa-chevron-up');
}

// ===== 金句闪卡 =====
function renderShenlunFlashcard(c) {
  const card = FLASHCARD_DATA[currentFlashcardIdx];
  const learnedF = getLearned('flashcard');
  const isLearnedCard = learnedF.includes(card.id);
  const totalCards = FLASHCARD_DATA.length;

  c.innerHTML = `
    <div class="reading-intro">
      <i class="fas fa-info-circle"></i>
      <p>每天翻1-2张金句闪卡，正面是金句，点击翻转看来源、释义、用法和示范。利用刷手机的时间积累素材。</p>
    </div>
    <div class="flashcard-progress">
      <span>${currentFlashcardIdx + 1} / ${totalCards}</span>
      <span>已掌握 ${learnedF.length} / ${totalCards}</span>
    </div>
    <div class="flashcard-container">
      <div class="flashcard ${isLearnedCard ? 'learned' : ''}" id="flashcard" onclick="flipFlashcard()">
        <div class="flashcard-front">
          <div class="flashcard-category">${card.category}</div>
          <div class="flashcard-quote">
            <i class="fas fa-quote-left"></i>
            <p>${card.front}</p>
            <i class="fas fa-quote-right"></i>
          </div>
          <div class="flashcard-hint">点击翻转查看解析 <i class="fas fa-redo"></i></div>
        </div>
        <div class="flashcard-back">
          <div class="flashcard-back-section">
            <span class="back-label">出处</span>
            <p>${card.back.source} · ${card.back.context}</p>
          </div>
          <div class="flashcard-back-section">
            <span class="back-label">释义</span>
            <p>${card.back.meaning}</p>
          </div>
          <div class="flashcard-back-section">
            <span class="back-label">适用场景</span>
            <p>${card.back.usage}</p>
          </div>
          <div class="flashcard-back-section">
            <span class="back-label">运用示范</span>
            <p>${card.back.example}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flashcard-controls">
      <button class="flashcard-btn" onclick="prevFlashcard()" ${currentFlashcardIdx === 0 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i> 上一张
      </button>
      <button class="flashcard-btn ${isLearnedCard ? 'learned' : ''}" onclick="toggleLearnFlashcard()">
        <i class="fas ${isLearnedCard ? 'fa-check-circle' : 'fa-circle'}"></i> ${isLearnedCard ? '已掌握' : '标记已掌握'}
      </button>
      <button class="flashcard-btn" onclick="nextFlashcard()" ${currentFlashcardIdx === totalCards - 1 ? 'disabled' : ''}>
        下一张 <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  `;
}

function flipFlashcard() {
  const card = $('#flashcard');
  if (card) card.classList.toggle('flipped');
}

function nextFlashcard() {
  if (currentFlashcardIdx < FLASHCARD_DATA.length - 1) {
    currentFlashcardIdx++;
    renderShenlunFlashcard($('#shenlun-content'));
  }
}

function prevFlashcard() {
  if (currentFlashcardIdx > 0) {
    currentFlashcardIdx--;
    renderShenlunFlashcard($('#shenlun-content'));
  }
}

function toggleLearnFlashcard() {
  const card = FLASHCARD_DATA[currentFlashcardIdx];
  toggleLearned('flashcard', card.id);
  renderShenlunFlashcard($('#shenlun-content'));
  const justLearned = isLearned('flashcard', card.id);
  showToast(justLearned ? '已标记为已掌握！' : '已取消标记');
}

// ===== 政策热词 =====
function renderShenlunPolicy(c) {
  const filtered = currentPolicyCat === 'all' ? POLICY_DATA : POLICY_DATA.filter(p => p.cat === currentPolicyCat);
  const learnedP = getLearned('policy');

  c.innerHTML = `
    <div class="reading-intro">
      <i class="fas fa-info-circle"></i>
      <p>按类别速查政策热词，每个词条附定义、要点和申论运用角度。碎片时间翻一翻，遇到相关话题就能用上。</p>
    </div>
    <div class="policy-filters">
      <button class="policy-filter ${currentPolicyCat === 'all' ? 'active' : ''}" onclick="filterPolicy('all')">全部</button>
      ${POLICY_CATEGORIES.map(cat => `
        <button class="policy-filter ${currentPolicyCat === cat.id ? 'active' : ''}" onclick="filterPolicy('${cat.id}')">
          <i class="fas ${cat.icon}"></i> ${cat.label}
        </button>
      `).join('')}
    </div>
    <div class="policy-grid">
      ${filtered.map(p => {
        const learned = learnedP.includes(p.id);
        const catInfo = POLICY_CATEGORIES.find(c => c.id === p.cat);
        return `
          <div class="policy-card ${learned ? 'learned' : ''}">
            <div class="policy-card-header">
              <span class="policy-cat-badge">${catInfo ? catInfo.label : ''}</span>
              <h3>${p.term}</h3>
              <span class="policy-source">${p.source}</span>
            </div>
            <div class="policy-card-body">
              <p class="policy-def">${p.def}</p>
              <div class="policy-keypoints">
                ${p.keyPoints.map(kp => `<span class="policy-keypoint">${kp}</span>`).join('')}
              </div>
              <div class="policy-shenlun">
                <span class="policy-shenlun-label"><i class="fas fa-pen-fancy"></i> 申论运用</span>
                <p>${p.shenlunAngle}</p>
              </div>
            </div>
            <button class="btn-learn-sm ${learned ? 'learned' : ''}" onclick="toggleLearnPolicy('${p.id}', this)">
              <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已掌握' : '标记'}
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function filterPolicy(cat) {
  currentPolicyCat = cat;
  renderShenlunPolicy($('#shenlun-content'));
}

function toggleLearnPolicy(id, btn) {
  toggleLearned('policy', id);
  const justLearned = isLearned('policy', id);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已掌握' : '标记'}`;
  btn.closest('.policy-card')?.classList.toggle('learned', justLearned);
  showToast(justLearned ? '已标记为已掌握！' : '已取消标记');
}

// ===== 高分作文剖析（替代原写作微课 + 微练习）=====
function renderShenlunEssay(c) {
  const learnedE = getLearned('essay');
  c.innerHTML = `
    <div class="reading-intro">
      <i class="fas fa-info-circle"></i>
      <p>少写多读。这里汇集专家、高分优秀作文与政府已公布文章，逐句剖析为什么写得好，帮你建立申论语感与系统学习观。点开一篇：先看「为什么高分」，再读「句子拆解」，最后通读原文。</p>
    </div>
    <div class="essay-list">
      ${ESSAY_ANALYSIS_DATA.map((e, idx) => {
        const learned = learnedE.includes(e.id);
        return `
          <div class="essay-card ${learned ? 'learned' : ''}" id="essay-${idx}">
            <div class="essay-header" onclick="toggleEssay(${idx})">
              <div class="essay-title-row">
                <span class="essay-source"><i class="fas fa-bookmark"></i> ${e.source}</span>
                <span class="essay-level">${e.level}</span>
                <span class="essay-cat">${e.category}</span>
                ${learned ? '<span class="lesson-learned-badge"><i class="fas fa-check"></i> 已读</span>' : ''}
              </div>
              <h3>${e.title}</h3>
              <i class="fas fa-chevron-down essay-expand-icon" id="essay-icon-${idx}"></i>
            </div>
            <div class="essay-body" id="essay-body-${idx}">
              <div class="essay-why">
                <span class="essay-section-label"><i class="fas fa-star"></i> 为什么高分</span>
                <p>${e.whyHigh}</p>
              </div>
              <div class="essay-sentences">
                <span class="essay-section-label"><i class="fas fa-cut"></i> 句子拆解</span>
                ${e.sentences.map(s => `
                  <div class="essay-sentence">
                    <div class="es-quote">“${s.quote}”</div>
                    <div class="es-analysis"><i class="fas fa-angle-right"></i> ${s.analysis}</div>
                  </div>
                `).join('')}
              </div>
              <div class="essay-full">
                <span class="essay-section-label"><i class="fas fa-file-alt"></i> 原文通读</span>
                <div class="essay-full-text">${e.fullText.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>
              </div>
              <div class="essay-tags">
                ${e.tags.map(t => `<span class="essay-tag">#${t}</span>`).join('')}
              </div>
              <button class="btn-learn ${learned ? 'learned' : ''}" onclick="toggleLearnEssay('${e.id}', this)">
                <i class="fas ${learned ? 'fa-check-circle' : 'fa-circle'}"></i> ${learned ? '已读' : '标记已读'}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function toggleEssay(idx) {
  const body = $(`#essay-body-${idx}`);
  const icon = $(`#essay-icon-${idx}`);
  if (!body) return;
  body.classList.toggle('show');
  if (icon) icon.classList.toggle('fa-chevron-up');
}

function toggleLearnEssay(id, btn) {
  toggleLearned('essay', id);
  const justLearned = isLearned('essay', id);
  btn.classList.toggle('learned', justLearned);
  btn.innerHTML = `<i class="fas ${justLearned ? 'fa-check-circle' : 'fa-circle'}"></i> ${justLearned ? '已读' : '标记已读'}`;
  btn.closest('.essay-card')?.classList.toggle('learned', justLearned);
  showToast(justLearned ? '已标记为已读！' : '已取消标记');
}

// ===== 结构化写作微课（从"学习技能"移入，更贴合申论） =====
function renderShenlunWriting(c) {
  const learnedW = getLearned('writing');
  const total = SHENLUN_WRITING_DATA.reduce((s, m) => s + m.lessons.length, 0);
  const learnedCount = SHENLUN_WRITING_DATA.reduce((s, m) => s + m.lessons.filter(l => learnedW.includes(l.id)).length, 0);
  const pct = total ? Math.round(learnedCount / total * 100) : 0;
  c.innerHTML = `
    <div class="reading-intro">
      <i class="fas fa-info-circle"></i>
      <p>申论写作不是"文采比赛"，而是"把道理讲清楚"的能力。这里用结构化方法拆解一篇好文章的底层逻辑，每课附动手练。碎片时间学一点、写一篇。</p>
    </div>
    <div class="skill-map-title" style="margin:14px 0 6px"><i class="fas fa-tasks"></i> 写作微课进度 ${learnedCount} / ${total}</div>
    <div class="section-progress-bar" style="margin-bottom:14px">
      <div class="progress-info">结构化写作学习进度</div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
      <span class="progress-text">${pct}%</span>
    </div>
    <div class="writing-curriculum">
      ${SHENLUN_WRITING_DATA.map((m, mi) => `
        <div class="skill-module">
          <div class="skill-module-head">第${mi + 1}模块 · ${m.title}</div>
          <div class="skill-lessons">
            ${m.lessons.map(l => {
              const done = learnedW.includes(l.id);
              return `
              <div class="skill-lesson ${done ? 'done' : ''}" id="wlesson-${l.id}">
                <label class="skill-lesson-check">
                  <input type="checkbox" ${done ? 'checked' : ''} onchange="toggleLearnWriting('${l.id}', this)">
                  <span class="skill-lesson-title">${l.title}</span>
                </label>
                <div class="skill-lesson-detail">
                  <ul>${l.points.map(p => `<li>${p}</li>`).join('')}</ul>
                  <div class="skill-lesson-action"><i class="fas fa-hands-helping"></i> 动手做：${l.action}</div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleLearnWriting(id, el) {
  toggleLearned('writing', id);
  const just = isLearned('writing', id);
  const row = el.closest('.skill-lesson');
  if (row) row.classList.toggle('done', just);
  const learnedW = getLearned('writing');
  const total = SHENLUN_WRITING_DATA.reduce((s, m) => s + m.lessons.length, 0);
  const learnedCount = SHENLUN_WRITING_DATA.reduce((s, m) => s + m.lessons.filter(l => learnedW.includes(l.id)).length, 0);
  const pct = total ? Math.round(learnedCount / total * 100) : 0;
  const fill = document.querySelector('#shenlun-content .progress-bar-fill');
  if (fill) fill.style.width = pct + '%';
  const txt = document.querySelector('#shenlun-content .section-progress-bar .progress-text');
  if (txt) txt.textContent = pct + '%';
  const cnt = document.querySelector('#shenlun-content .skill-map-title');
  if (cnt) cnt.innerHTML = `<i class="fas fa-tasks"></i> 写作微课进度 ${learnedCount} / ${total}`;
  showToast(just ? '已学完一课 ✅' : '已取消标记');
}

// ===== 微练习（不动笔永远学不会写） =====
function renderShenlunPractice(c) {
  const learnedP = getLearned('writepractice');
  c.innerHTML = `
    <div class="reading-intro">
      <i class="fas fa-info-circle"></i>
      <p>不动笔永远学不会写。下面是一组微练习，每次只写一小段（100-200字）。写完点"看参考"，对照自己的差距。</p>
    </div>
    <div class="practice-list">
      ${SHENLUN_WRITING_PRACTICE.map((p, i) => {
        const done = learnedP.includes(p.id);
        return `
        <div class="practice-card ${done ? 'learned' : ''}" id="wpractice-${p.id}">
          <div class="practice-head" onclick="togglePracticeAns('${p.id}')">
            <span class="practice-no">练习${i + 1}</span>
            <span class="practice-q">${p.q}</span>
            <i class="fas fa-chevron-down practice-icon" id="wp-icon-${p.id}"></i>
          </div>
          <div class="practice-body" id="wp-body-${p.id}" style="display:none">
            <div class="practice-prompt"><i class="fas fa-lightbulb"></i> 提示：${p.hint}</div>
            <div class="practice-answer"><b>参考思路：</b>${p.answer}</div>
            <button class="btn-learn ${done ? 'learned' : ''}" onclick="toggleLearnPractice('${p.id}', this)">
              <i class="fas ${done ? 'fa-check-circle' : 'fa-circle'}"></i> ${done ? '已完成' : '标记完成'}
            </button>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}

function togglePracticeAns(id) {
  const body = document.getElementById('wp-body-' + id);
  const icon = document.getElementById('wp-icon-' + id);
  if (!body) return;
  body.style.display = body.style.display === 'none' ? 'block' : 'none';
  if (icon) icon.classList.toggle('fa-chevron-up');
}

function toggleLearnPractice(id, btn) {
  toggleLearned('writepractice', id);
  const just = isLearned('writepractice', id);
  btn.classList.toggle('learned', just);
  btn.innerHTML = `<i class="fas ${just ? 'fa-check-circle' : 'fa-circle'}"></i> ${just ? '已完成' : '标记完成'}`;
  btn.closest('.practice-card')?.classList.toggle('learned', just);
  showToast(just ? '练习已完成 🎉' : '已取消标记');
}

/* ============================================
   智能搜索板块
   ============================================ */
const SEARCH_ENGINES = [
  { id: 'baidu', name: '百度', icon: 'fa-search', color: '#2932E1', url: q => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}` },
  { id: 'bing', name: 'Bing', icon: 'fa-globe', color: '#008373', url: q => `https://www.bing.com/search?q=${encodeURIComponent(q)}` },
  { id: 'zhihu', name: '知乎', icon: 'fa-comment-dots', color: '#0066FF', url: q => `https://www.zhihu.com/search?q=${encodeURIComponent(q)}&type=content` },
  { id: 'metaso', name: '秘塔AI搜索', icon: 'fa-robot', color: '#6C5CE7', url: q => `https://metaso.cn/?q=${encodeURIComponent(q)}` },
  { id: 'kimi', name: 'Kimi AI', icon: 'fa-brain', color: '#E84393', url: q => `https://kimi.moonshot.cn/search?q=${encodeURIComponent(q)}` },
  { id: 'perplexity', name: 'Perplexity', icon: 'fa-lightbulb', color: '#20808D', url: q => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}` },
  { id: 'wiki', name: '维基百科', icon: 'fa-book-open', color: '#36C', url: q => `https://zh.wikipedia.org/wiki/${encodeURIComponent(q)}` },
  { id: 'google', name: 'Google', icon: 'fa-google', color: '#4285F4', url: q => `https://www.google.com/search?q=${encodeURIComponent(q)}` }
];

const SEARCH_CATEGORIES = [
  { id: 'study', label: '学习提问', icon: 'fa-graduation-cap', placeholder: '例：什么是定投微笑曲线？', engines: ['baidu','zhihu','metaso','wiki'] },
  { id: 'news', label: '时事热点', icon: 'fa-newspaper', placeholder: '例：今日A股行情分析', engines: ['baidu','bing','metaso','kimi'] },
  { id: 'finance', label: '金融知识', icon: 'fa-chart-line', placeholder: '例：PE估值分位数怎么看？', engines: ['baidu','zhihu','metaso','perplexity'] },
  { id: 'english', label: '英语翻译', icon: 'fa-language', placeholder: '例：how to invest in index funds', engines: ['baidu','google','bing','kimi'] },
  { id: 'shenlun', label: '申论素材', icon: 'fa-feather-alt', placeholder: '例：新质生产力申论怎么写', engines: ['baidu','zhihu','metaso','kimi'] },
  { id: 'life', label: '生活百科', icon: 'fa-leaf', placeholder: '例：怎样挑选适合自己的基金', engines: ['baidu','bing','zhihu','kimi'] }
];

let currentSearchCat = 'study';
let searchHistory = [];

function renderSearch(c) {
  searchHistory = loadData('search_history', []);
  c.innerHTML = `
    <div class="module-content search-module">
      <div class="search-hero">
        <div class="search-hero-icon"><i class="fas fa-search"></i></div>
        <h1>智能搜索</h1>
        <p class="search-hero-desc">输入你的问题，一键搜索多个平台，快速获取答案</p>
      </div>

      <div class="search-categories">
        ${SEARCH_CATEGORIES.map(cat => `
          <button class="search-cat-btn ${cat.id === currentSearchCat ? 'active' : ''}" data-cat="${cat.id}" onclick="switchSearchCat('${cat.id}')">
            <i class="fas ${cat.icon}"></i>
            <span>${cat.label}</span>
          </button>
        `).join('')}
      </div>

      <div class="search-bar-wrapper">
        <div class="search-bar">
          <i class="fas fa-search search-bar-icon"></i>
          <input type="text" id="search-input" class="search-input" placeholder="${SEARCH_CATEGORIES.find(c => c.id === currentSearchCat).placeholder}" onkeydown="if(event.key==='Enter') doSearch()">
          <button class="search-btn" onclick="doSearch()">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div id="search-results" class="search-results"></div>

      ${searchHistory.length > 0 ? `
        <div class="search-history-section">
          <div class="search-history-header">
            <h3><i class="fas fa-history"></i> 搜索记录</h3>
            <button class="search-clear-btn" onclick="clearSearchHistory()">清空</button>
          </div>
          <div class="search-history-list">
            ${searchHistory.slice(-12).reverse().map((h, i) => `
              <button class="search-history-item" onclick="quickSearch('${h.query.replace(/'/g, "\\'")}')">
                <i class="fas fa-clock-rotate-left"></i>
                <span>${h.query}</span>
                <span class="search-history-cat">${SEARCH_CATEGORIES.find(c => c.id === h.cat)?.label || ''}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="search-tips-section">
        <h3><i class="fas fa-lightbulb"></i> 搜索小贴士</h3>
        <div class="search-tips-grid">
          <div class="search-tip-card">
            <i class="fas fa-bolt"></i>
            <p>输入问题后按回车，即可同时在多个平台搜索</p>
          </div>
          <div class="search-tip-card">
            <i class="fas fa-layer-group"></i>
            <p>切换上方分类，搜索结果会自动匹配最适合的平台</p>
          </div>
          <div class="search-tip-card">
            <i class="fas fa-robot"></i>
            <p>推荐使用「秘塔AI」「Kimi」获取AI生成的智能回答</p>
          </div>
        </div>
      </div>
    </div>
  `;
  $('#search-input').focus();
}

function switchSearchCat(catId) {
  currentSearchCat = catId;
  $$('.search-cat-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.cat === catId));
  const cat = SEARCH_CATEGORIES.find(c => c.id === catId);
  const input = $('#search-input');
  if (input) {
    input.placeholder = cat.placeholder;
    input.focus();
  }
}

function doSearch() {
  const query = $('#search-input').value.trim();
  if (!query) { showToast('请输入搜索内容', 'error'); return; }

  const cat = SEARCH_CATEGORIES.find(c => c.id === currentSearchCat);
  const engines = SEARCH_ENGINES.filter(e => cat.engines.includes(e.id));

  // 保存搜索历史
  searchHistory = loadData('search_history', []);
  searchHistory.push({ query, cat: currentSearchCat, time: Date.now() });
  if (searchHistory.length > 50) searchHistory = searchHistory.slice(-50);
  saveData('search_history', searchHistory);

  // 显示搜索结果
  const resultArea = $('#search-results');
  resultArea.innerHTML = `
    <div class="search-results-panel">
      <div class="search-results-query">
        <i class="fas fa-quote-left"></i>
        <span>${query}</span>
      </div>
      <div class="search-results-engines">
        <p class="search-results-hint">点击下方平台，在新标签页中查看搜索结果：</p>
        <div class="search-engine-grid">
          ${engines.map(e => `
            <a href="${e.url(query)}" target="_blank" rel="noopener" class="search-engine-card" style="--engine-color:${e.color}">
              <div class="search-engine-icon" style="background:${e.color}">
                <i class="fas ${e.icon}"></i>
              </div>
              <div class="search-engine-info">
                <span class="search-engine-name">${e.name}</span>
                <span class="search-engine-action">点击搜索 <i class="fas fa-external-link-alt"></i></span>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
      <div class="search-results-also">
        <span>其他平台：</span>
        ${SEARCH_ENGINES.filter(e => !cat.engines.includes(e.id)).map(e => `
          <a href="${e.url(query)}" target="_blank" rel="noopener" class="search-engine-mini" style="color:${e.color}">
            <i class="fas ${e.icon}"></i> ${e.name}
          </a>
        `).join('')}
      </div>
    </div>
  `;

  // 自动在第一个平台打开
  if (engines.length > 0) {
    window.open(engines[0].url(query), '_blank');
  }

  // 刷新历史记录区域
  setTimeout(() => {
    const histSection = $('.search-history-section');
    if (histSection) {
      renderSearch($('#main-content'));
      $('#search-input').value = query;
    }
  }, 100);
}

function quickSearch(query) {
  const input = $('#search-input');
  if (input) {
    input.value = query;
    doSearch();
  }
}

function clearSearchHistory() {
  saveData('search_history', []);
  searchHistory = [];
  renderSearch($('#main-content'));
  showToast('搜索记录已清空');
}

// ===== 总览 · 今日成长 =====
const MODULE_META = {
  checkin: { name: '每日打卡', icon: 'fa-check-circle', color: '#4caf50' },
  review:   { name: '每日复盘', icon: 'fa-pen-nib', color: '#9c27b0' },
  english:  { name: '英语角', icon: 'fa-language', color: '#2196f3' },
  finance:  { name: '基金投资', icon: 'fa-chart-line', color: '#ff9800' },
  news:     { name: '每日大事件', icon: 'fa-newspaper', color: '#607d8b' },
  book:     { name: '读书', icon: 'fa-book', color: '#795548' },
  common:   { name: '常识积累', icon: 'fa-brain', color: '#00bcd4' },
  shenlun:  { name: '申论政治', icon: 'fa-feather-alt', color: '#e91e63' },
  misc:     { name: '杂学开眼', icon: 'fa-wand-magic-sparkles', color: '#3f51b5' },
  sport:    { name: '运动', icon: 'fa-running', color: '#FF6B6B' },
  pet:      { name: '宠物', icon: 'fa-paw', color: '#E17055' },
  skill:    { name: '学习技能', icon: 'fa-graduation-cap', color: '#6C5CE7' },
  tenmin:   { name: '每天的10分钟', icon: 'fa-stopwatch', color: '#00CEC9' },
  beauty:   { name: '美妆穿搭', icon: 'fa-palette', color: '#FD79A8' },
  search:   { name: '智能搜索', icon: 'fa-search', color: '#636E72' },
  overview: { name: '总览', icon: 'fa-tachometer-alt', color: '#0984E3' },
  country:  { name: '国情与世界', icon: 'fa-globe', color: '#16a085' }
};

// ===== 跨设备数据同步（导出/导入备份文件） =====
function exportData() {
  try {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf('mw_') === 0) data[k] = localStorage.getItem(k);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '马雯工作台数据备份_' + today() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('已导出 ' + Object.keys(data).length + ' 项数据，可发到手机后导入');
  } catch (e) { showToast('导出失败：' + e.message); }
}
function importData() { const f = document.getElementById('data-import-file'); if (f) f.click(); }
function doImportData(input) {
  const file = input.files && input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      let n = 0;
      for (const k in data) { if (k.indexOf('mw_') === 0) { localStorage.setItem(k, data[k]); n++; } }
      showToast('已导入 ' + n + ' 项数据，即将刷新');
      setTimeout(() => location.reload(), 900);
    } catch (e) { showToast('导入失败：文件格式错误'); }
  };
  reader.readAsText(file);
}

let currentOvPeriod = 'week';
function renderOverview(c) {
  const act = todayActivityByModule();
  const focus = getFocusSeconds();
  const plans = getPlans();
  const doneCount = plans.filter(p => p.done).length;
  const todoCount = plans.length - doneCount;
  const streak = computeStreak();
  const usage = getUsage();
  const todayUsage = usage[today()] || {};
  const todayTotal = Object.keys(todayUsage).reduce((s, k) => s + todayUsage[k], 0);
  const studyDays = Object.keys(usage).length;

  const usageModKeys = Object.keys(MODULE_META);
  const todayUsageData = usageModKeys.map(m => Math.round((todayUsage[m] || 0) / 60));

  const modRows = usageModKeys.map(m => {
    const sec = todayUsage[m] || 0;
    const cnt = act.map[m] || 0;
    const meta = MODULE_META[m];
    const on = sec > 0 || cnt > 0;
    return `
      <div class="ov-mod-row ${on ? 'active' : ''}">
        <span class="ov-mod-icon" style="background:${meta.color}22;color:${meta.color}"><i class="fas ${meta.icon}"></i></span>
        <span class="ov-mod-name">${meta.name}</span>
        <span class="ov-mod-count">${sec > 0 ? formatDuration(sec) : (cnt ? cnt + ' 次' : '—')}</span>
      </div>`;
  }).join('');

  const feed = act.items.length
    ? act.items.map(a => {
        const meta = MODULE_META[a.module] || { name: a.module, icon: 'fa-circle' };
        return `<div class="ov-feed-item"><i class="fas ${meta.icon}"></i><span>${meta.name}</span> · ${escapeHtml(a.type)} ×${a.n}</div>`;
      }).join('')
    : '<div class="ov-empty">今天还没有学习记录，去任意板块打卡吧～</div>';

  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-tachometer-alt"></i> 总览 · 今日成长</h1>
          <div class="subtitle">${today()} · 看得见的每一点进步</div>
        </div>
      </div>

      <div class="ov-stats">
        <div class="ov-stat-card">
          <div class="ov-stat-icon" style="background:#2196f322;color:#2196f3"><i class="fas fa-clock"></i></div>
          <div class="ov-stat-val">${formatDuration(todayTotal)}</div>
          <div class="ov-stat-label">今日工作台用时</div>
        </div>
        <div class="ov-stat-card">
          <div class="ov-stat-icon" style="background:#4caf5022;color:#4caf50"><i class="fas fa-check-double"></i></div>
          <div class="ov-stat-val">${act.total}</div>
          <div class="ov-stat-label">今日完成事项</div>
        </div>
        <div class="ov-stat-card">
          <div class="ov-stat-icon" style="background:#ff980022;color:#ff9800"><i class="fas fa-fire"></i></div>
          <div class="ov-stat-val">${streak}</div>
          <div class="ov-stat-label">连续打卡(天)</div>
        </div>
        <div class="ov-stat-card">
          <div class="ov-stat-icon" style="background:#9c27b022;color:#9c27b0"><i class="fas fa-calendar-check"></i></div>
          <div class="ov-stat-val">${studyDays}</div>
          <div class="ov-stat-label">累计使用天数</div>
        </div>
      </div>

      <div class="ov-checkin-bar">
        <div class="ov-ci-left">
          <i class="fas fa-check-circle"></i>
          <div>
            <div class="ov-ci-title">每日打卡</div>
            <div class="ov-ci-sub">今日 <strong id="ov-ci-count">${getCheckinCount()}</strong> 次 · 连续 <strong id="ov-ci-streak">${streak}</strong> 天</div>
          </div>
        </div>
        <button class="ov-ci-btn" onclick="doCheckin()"><i class="fas fa-check"></i> 打卡</button>
      </div>

      <div class="data-backup-bar">
        <div class="db-info">
          <i class="fas fa-cloud-download-alt"></i>
          <div>
            <div class="db-title">跨设备数据同步</div>
            <div class="db-sub">手机与电脑数据各自独立。点「导出备份」保存全部记录，发到小米12X 后在手机端「导入备份」即可同步打卡 / 记账 / 学习习惯（需手动同步一次）。</div>
          </div>
        </div>
        <div class="db-btns">
          <button class="db-btn" onclick="exportData()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;margin-right:4px"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14v-4h-3l4-5 4 5h-3v4h-2z" fill="#8A6CB0"/></svg> 导出备份</button>
          <button class="db-btn db-btn-2" onclick="importData()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;margin-right:4px"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="#C99BB5"/><circle cx="16" cy="5" r="2" fill="#FFD966"/></svg> 导入备份</button>
        </div>
        <input type="file" id="data-import-file" accept="application/json,.json" style="display:none" onchange="doImportData(this)">
      </div>

      <div class="ov-grid">
        <div class="ov-panel">
          <h3 class="ov-panel-title"><i class="fas fa-layer-group"></i> 今日各板块停留时长</h3>
          <div class="chart-container" style="height:260px"><canvas id="ov-today-usage"></canvas></div>
        </div>
        <div class="ov-panel">
          <h3 class="ov-panel-title"><i class="fas fa-stream"></i> 今日动态</h3>
          <div class="ov-feed">${feed}</div>
        </div>
      </div>

      <div class="ov-panel">
        <div class="ov-panel-head-row">
          <h3 class="ov-panel-title" style="margin:0"><i class="fas fa-chart-area"></i> 周期总览 · 各板块使用时间</h3>
          <div class="ov-period-toggle">
            <button class="ov-period-btn ${currentOvPeriod==='week'?'on':''}" onclick="ovSetPeriod('week')">周</button>
            <button class="ov-period-btn ${currentOvPeriod==='month'?'on':''}" onclick="ovSetPeriod('month')">月</button>
            <button class="ov-period-btn ${currentOvPeriod==='quarter'?'on':''}" onclick="ovSetPeriod('quarter')">季</button>
          </div>
        </div>
        <div class="chart-container" style="height:300px"><canvas id="ov-period-usage"></canvas></div>
        <div id="ov-period-learn" class="ov-learn-list"></div>
      </div>

      <div class="ov-panel ov-plan-panel">
        <h3 class="ov-panel-title"><i class="fas fa-list-check"></i> 我的计划</h3>
        <p class="ov-plan-tip">写下今天 / 这段时间想完成的事，完成后勾选。右侧圆环一目了然看到「待办 vs 已办」。</p>
        <div class="plan-input-bar">
          <input type="text" id="plan-input" placeholder="添加一个待办 / 计划…" maxlength="120" onkeydown="if(event.key==='Enter')addPlan()">
          <button class="btn-add" onclick="addPlan()"><i class="fas fa-plus"></i> 添加</button>
        </div>
        <div class="ov-plan-body">
          <div class="plan-chart-wrap"><canvas id="plan-chart"></canvas></div>
          <div class="plan-list" id="plan-list"></div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    renderOverviewTodayUsage(usageModKeys, todayUsageData);
    renderOverviewPeriod(currentOvPeriod);
    renderPlanChart(todoCount, doneCount);
    renderPlanList();
  }, 60);
}

function ovSetPeriod(p) { currentOvPeriod = p; renderOverview($('#main-content')); }

// 周期分桶：周(近7天) / 月(本月) / 季(本季度3个月)
function ovPeriodBuckets(period) {
  const now = new Date();
  const buckets = [];
  if (period === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      buckets.push({ label: `${d.getMonth()+1}/${d.getDate()}`, dates: [d.toISOString().split('T')[0]] });
    }
  } else if (period === 'month') {
    const y = now.getFullYear(), m = now.getMonth();
    const dim = new Date(y, m + 1, 0).getDate();
    for (let i = 1; i <= dim; i++) buckets.push({ label: String(i), dates: [`${y}-${String(m+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`] });
  } else {
    const q = Math.floor(now.getMonth() / 3), startM = q * 3;
    for (let mi = startM; mi < startM + 3; mi++) {
      const y = now.getFullYear(), dim = new Date(y, mi + 1, 0).getDate(), dates = [];
      for (let i = 1; i <= dim; i++) dates.push(`${y}-${String(mi+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`);
      buckets.push({ label: `${mi+1}月`, dates });
    }
  }
  return buckets;
}

function renderOverviewTodayUsage(keys, data) {
  const ctx = $('#ov-today-usage'); if (!ctx) return;
  if (charts.ovToday) { try { charts.ovToday.destroy(); } catch {} }
  charts.ovToday = new Chart(ctx, {
    type: 'bar',
    data: { labels: keys.map(k => MODULE_META[k].name), datasets: [{ label: '分钟', data, backgroundColor: keys.map(k => MODULE_META[k].color + 'cc'), borderRadius: 6 }] },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.parsed.x} 分钟` } } },
      scales: { x: { beginAtZero: true, title: { display: true, text: '分钟' } }, y: { grid: { display: false }, ticks: { font: { size: 11 } } } }
    }
  });
}

function renderOverviewPeriod(period) {
  const ctx = $('#ov-period-usage'); if (!ctx) return;
  if (charts.ovPeriod) { try { charts.ovPeriod.destroy(); } catch {} }
  const usage = getUsage();
  const buckets = ovPeriodBuckets(period);
  const keys = Object.keys(MODULE_META).filter(k => buckets.some(b => b.dates.some(d => usage[d] && usage[d][k])));
  const datasets = keys.map(k => ({
    label: MODULE_META[k].name,
    data: buckets.map(b => Math.round(b.dates.reduce((s, d) => s + ((usage[d] && usage[d][k]) || 0), 0) / 60)),
    backgroundColor: MODULE_META[k].color + 'cc', borderColor: MODULE_META[k].color, borderWidth: 1, stack: 'usage'
  }));
  charts.ovPeriod = new Chart(ctx, {
    type: 'bar',
    data: { labels: buckets.map(b => b.label), datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } },
        tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y} 分钟` } } },
      scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, title: { display: true, text: '分钟' } } }
    }
  });
  // 学习概览：周期内各模块完成事项
  const rangeDates = new Set(buckets.flatMap(b => b.dates));
  const acts = getActivityLog().filter(a => rangeDates.has(a.date));
  const byMod = {};
  acts.forEach(a => { byMod[a.module] = byMod[a.module] || {}; byMod[a.module][a.type] = (byMod[a.module][a.type] || 0) + (a.n || 1); });
  const box = $('#ov-period-learn');
  if (!box) return;
  const pName = { week: '本周', month: '本月', quarter: '本季' }[period];
  if (acts.length === 0) {
    box.innerHTML = `<div class="ov-learn-title">${pName}学习概览</div><div class="ov-empty">这一周期还没有学习完成记录</div>`;
    return;
  }
  const rows = Object.keys(byMod).map(m => {
    const meta = MODULE_META[m] || { name: m, color: '#999', icon: 'fa-circle' };
    const detail = Object.keys(byMod[m]).map(t => `${escapeHtml(t)} ×${byMod[m][t]}`).join('，');
    return `<div class="ov-learn-row"><span class="ov-learn-mod" style="color:${meta.color}"><i class="fas ${meta.icon}"></i> ${meta.name}</span><span class="ov-learn-detail">${detail}</span></div>`;
  }).join('');
  box.innerHTML = `<div class="ov-learn-title">${pName}学习了这些（共 ${acts.length} 项）</div>${rows}`;
}

function renderPlanChart(todo, done) {
  const ctx = $('#plan-chart');
  if (!ctx) return;
  if (charts.plan) { try { charts.plan.destroy(); } catch {} }
  charts.plan = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['待办', '已完成'],
      datasets: [{
        data: [todo, done],
        backgroundColor: ['#ff9800', '#4caf50'],
        borderWidth: 2, borderColor: '#fff'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 13 }, padding: 14 } },
        tooltip: { callbacks: { label: (c) => `${c.label}：${c.parsed} 项` } }
      }
    }
  });
}

function renderPlanList() {
  const box = $('#plan-list');
  if (!box) return;
  const plans = getPlans();
  if (!plans.length) { box.innerHTML = '<div class="ov-empty">还没有计划，先添加一个吧～</div>'; return; }
  box.innerHTML = plans.map(p => `
    <div class="plan-item ${p.done ? 'done' : ''}">
      <label class="plan-check">
        <input type="checkbox" ${p.done ? 'checked' : ''} onchange="togglePlan('${p.id}')">
        <span class="plan-text">${escapeHtml(p.text)}</span>
      </label>
      <button class="plan-del" onclick="deletePlan('${p.id}')" title="删除"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

/* ============================================
   运动板块
   ============================================ */
function renderSport(c) {
  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-running"></i> 运动</h1>
          <div class="subtitle">记录每一次汗水，看见坚持的力量</div>
        </div>
        <button class="btn-mini" onclick="openSportProfile()"><i class="fas fa-weight-scale"></i> 我的体重</button>
      </div>
      <div class="checkin-tabs">
        <button class="checkin-tab ${currentSportTab==='record'?'active':''}" data-tab="record">运动记录</button>
        <button class="checkin-tab ${currentSportTab==='stats'?'active':''}" data-tab="stats">数据统计</button>
      </div>
      <div id="sport-content"></div>
      <button class="sport-fab" onclick="sportQuickAdd()" title="记一笔运动"><i class="fas fa-plus"></i></button>
    </div>
  `;
  $$('.checkin-tab').forEach(t => {
    t.addEventListener('click', () => {
      $$('.checkin-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      currentSportTab = t.dataset.tab;
      renderSportTab();
    });
  });
  renderSportTab();
}

function sportQuickAdd() {
  if (currentSportTab !== 'record') { currentSportTab = 'record'; renderSport(); }
  setTimeout(() => {
    const el = $('#sp-duration');
    if (el) { el.focus(); el.scrollIntoView({ block: 'center' }); const bar = el.closest('.task-input-bar'); if (bar) { bar.classList.add('flash'); setTimeout(() => bar.classList.remove('flash'), 1200); } }
  }, 60);
}

function renderSportTab() {
  const c = $('#sport-content');
  if (!c) return;
  if (currentSportTab === 'record') renderSportRecord(c);
  else renderSportStats(c);
}

let sportTimerId = null;
let sportTimerStartMs = 0;
let sportTimerElapsedMs = 0;
function sportTimerStart() {
  sportTimerStartMs = Date.now();
  sportTimerElapsedMs = 0;
  if (sportTimerId) clearInterval(sportTimerId);
  sportTimerId = setInterval(() => { sportTimerElapsedMs = Date.now() - sportTimerStartMs; updateSportTimerLabel(); }, 1000);
  updateSportTimerLabel();
  const btn = $('#sp-timer-start'); if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 计时中…'; }
  const stop = $('#sp-timer-stop'); if (stop) stop.disabled = false;
}
function updateSportTimerLabel() {
  const el = $('#sp-timer-label'); if (el) el.textContent = formatDuration(sportTimerElapsedMs / 1000);
}
function sportTimerStop() {
  if (sportTimerId) { clearInterval(sportTimerId); sportTimerId = null; }
  const sec = Math.round((sportTimerElapsedMs || (sportTimerStartMs ? Date.now() - sportTimerStartMs : 0)) / 1000);
  const mins = Math.floor(sec / 60);
  const dur = $('#sp-duration'); if (dur && mins > 0) dur.value = mins;
  const btn = $('#sp-timer-start'); if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-play"></i> 开始计时'; }
  const stop = $('#sp-timer-stop'); if (stop) stop.disabled = true;
  if (mins > 0) showToast(`计时 ${mins} 分钟，已填入时长，点「记录」保存 💪`);
  else showToast('时长不足 1 分钟');
}

function renderSportRecord(c) {
  const types = SPORT_TYPES;
  const records = loadData('workouts', []);
  const todayRecs = records.filter(r => r.date === today());
  const todayDur = todayRecs.reduce((s, r) => s + (r.duration || 0), 0);
  c.innerHTML = `
    <div class="sport-form-card">
      <h3><i class="fas fa-plus-circle"></i> 添加一次运动</h3>
      <div class="sport-timer">
        <span class="sport-timer-label" id="sp-timer-label">0 秒</span>
        <button class="btn-mini" id="sp-timer-start" onclick="sportTimerStart()"><i class="fas fa-play"></i> 开始计时</button>
        <button class="btn-mini" id="sp-timer-stop" onclick="sportTimerStop()" disabled><i class="fas fa-stop"></i> 结束并记时长</button>
        <span class="sport-timer-hint">运动时点开，结束自动填好时长</span>
      </div>
      <div class="task-input-bar" style="flex-wrap:wrap;gap:10px;">
        <select id="sp-type">${types.map(t => `<option value="${t.key}">${t.icon} ${t.name}</option>`).join('')}</select>
        <input type="date" id="sp-date" value="${today()}">
        <input type="number" id="sp-duration" placeholder="时长(分钟)" min="1" style="width:120px;">
        <input type="number" id="sp-times" placeholder="次数" min="1" value="1" style="width:80px;">
        <input type="text" id="sp-note" placeholder="备注(可选)" maxlength="60" style="flex:1;min-width:140px;">
        <button class="btn-add" onclick="addWorkout()"><i class="fas fa-plus"></i> 记录</button>
      </div>
      <div class="sport-today-tip">今天已记录 <strong>${todayRecs.length}</strong> 次，共 <strong>${todayDur}</strong> 分钟${todayDur>=30?'，棒！🔥':'，目标 30 分钟起～'}</div>
    </div>
      <div class="sport-list" id="sport-list"></div>
  `;
  renderSportList();
  if (sportTimerId) {
    const b = $('#sp-timer-start'); if (b) { b.disabled = true; b.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 计时中…'; }
    const s = $('#sp-timer-stop'); if (s) s.disabled = false;
    updateSportTimerLabel();
  }
}

function addWorkout() {
  const type = $('#sp-type').value;
  const date = $('#sp-date').value || today();
  const duration = parseInt($('#sp-duration').value) || 0;
  const times = parseInt($('#sp-times').value) || 1;
  const note = $('#sp-note').value.trim();
  if (duration <= 0) { showToast('请填写运动时长', 'error'); return; }
  const t = SPORT_TYPES.find(x => x.key === type) || { name: type, met: 4 };
  const profile = loadData('sport_profile', SPORT_DEFAULT_PROFILE);
  const weight = profile.weight || 55;
  const kcal = Math.round(t.met * 3.5 * weight / 200 * duration);
  const records = loadData('workouts', []);
  records.push({ id: uid(), date, type, duration, times, note, kcal, createdAt: new Date().toISOString() });
  saveData('workouts', records);
  renderSportRecord($('#sport-content'));
  showToast(`已记录 ${t.name} ${duration} 分钟 💪`);
}

function renderSportList() {
  const list = $('#sport-list');
  if (!list) return;
  const records = loadData('workouts', []).slice().sort((a, b) => (b.date + b.createdAt).localeCompare(a.date + a.createdAt));
  if (records.length === 0) {
    list.innerHTML = `<div class="empty-state"><i class="fas fa-dumbbell"></i><p>还没有运动记录，动起来记第一笔吧！</p></div>`;
    return;
  }
  list.innerHTML = records.slice(0, 80).map(r => {
    const t = SPORT_TYPES.find(x => x.key === r.type) || { name: r.type, icon: '✨', color: '#A29BFE' };
    return `
      <div class="sport-row">
        <div class="sport-row-icon" style="background:${t.color}22;color:${t.color}">${t.icon}</div>
        <div class="sport-row-main">
          <div class="sport-row-title">${t.name} <span class="sport-row-meta">${r.date} · ${r.duration}分钟 · ${r.times}次${r.kcal ? ` · ≈${r.kcal}千卡` : ''}</span></div>
          ${r.note ? `<div class="sport-row-note">${escapeHtml(r.note)}</div>` : ''}
        </div>
        <button class="plan-del" onclick="deleteWorkout('${r.id}')" title="删除"><i class="fas fa-trash"></i></button>
      </div>`;
  }).join('');
}

function deleteWorkout(id) {
  if (!confirm('确定删除这条运动记录？')) return;
  let records = loadData('workouts', []);
  records = records.filter(r => r.id !== id);
  saveData('workouts', records);
  renderSportRecord($('#sport-content'));
  showToast('已删除');
}

function openSportProfile() {
  const p = loadData('sport_profile', SPORT_DEFAULT_PROFILE);
  const w = prompt('请输入你的体重(kg)，用于估算热量消耗：', p.weight || 55);
  if (w && !isNaN(w) && parseFloat(w) > 0) {
    p.weight = parseFloat(w);
    saveData('sport_profile', p);
    showToast('体重已更新，热量估算更准了');
  }
}

function renderSportStats(c) {
  const records = loadData('workouts', []);
  const totalDur = records.reduce((s, r) => s + (r.duration || 0), 0);
  const totalTimes = records.reduce((s, r) => s + (r.times || 0), 0);
  const now = new Date();
  const dow = (now.getDay() + 6) % 7;
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - dow); weekStart.setHours(0, 0, 0, 0);
  const weekDur = records.filter(r => new Date(r.date) >= weekStart).reduce((s, r) => s + r.duration, 0);
  const monthDur = records.filter(r => r.date.slice(0, 7) === now.toISOString().slice(0, 7)).reduce((s, r) => s + r.duration, 0);
  let streak = 0; const d = new Date();
  while (true) {
    const ds = d.toISOString().split('T')[0];
    if (records.some(r => r.date === ds)) { streak++; d.setDate(d.getDate() - 1); } else break;
  }
  c.innerHTML = `
    <div class="ov-stats">
      <div class="ov-stat-card"><div class="ov-stat-icon" style="background:#FF6B6B22;color:#FF6B6B"><i class="fas fa-clock"></i></div><div class="ov-stat-val">${(totalDur/60).toFixed(1)}<span style="font-size:13px">h</span></div><div class="ov-stat-label">累计运动时长</div></div>
      <div class="ov-stat-card"><div class="ov-stat-icon" style="background:#6C5CE722;color:#6C5CE7"><i class="fas fa-repeat"></i></div><div class="ov-stat-val">${totalTimes}<span style="font-size:13px">次</span></div><div class="ov-stat-label">累计运动次数</div></div>
      <div class="ov-stat-card"><div class="ov-stat-icon" style="background:#00B89422;color:#00B894"><i class="fas fa-calendar-week"></i></div><div class="ov-stat-val">${weekDur}<span style="font-size:13px">分</span></div><div class="ov-stat-label">本周时长</div></div>
      <div class="ov-stat-card"><div class="ov-stat-icon" style="background:#0984E322;color:#0984E3"><i class="fas fa-fire"></i></div><div class="ov-stat-val">${streak}<span style="font-size:13px">天</span></div><div class="ov-stat-label">连续打卡</div></div>
    </div>
    <div class="sport-month-tip">本月累计运动 <strong>${monthDur}</strong> 分钟</div>
    <div class="chart-grid">
      <div class="chart-card"><h3><i class="fas fa-calendar-week"></i> 近7天时长(分钟)</h3><div class="chart-container"><canvas id="sp-week-dur"></canvas></div></div>
      <div class="chart-card"><h3><i class="fas fa-calendar-week"></i> 近7天次数</h3><div class="chart-container"><canvas id="sp-week-times"></canvas></div></div>
      <div class="chart-card"><h3><i class="fas fa-chart-pie"></i> 运动类型分布(时长)</h3><div class="chart-container"><canvas id="sp-type-pie"></canvas></div></div>
    </div>
  `;
  setTimeout(() => renderSportCharts(records), 80);
}

function renderSportCharts(records) {
  const labels = [], durArr = [], timesArr = [];
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(); dt.setDate(dt.getDate() - i);
    const ds = dt.toISOString().split('T')[0];
    labels.push(`${dt.getMonth() + 1}/${dt.getDate()}`);
    const day = records.filter(r => r.date === ds);
    durArr.push(day.reduce((s, r) => s + r.duration, 0));
    timesArr.push(day.reduce((s, r) => s + (r.times || 1), 0));
  }
  charts.spWeekDur = new Chart($('#sp-week-dur'), {
    type: 'bar',
    data: { labels, datasets: [{ label: '分钟', data: durArr, backgroundColor: 'rgba(255,107,107,.6)', borderColor: '#FF6B6B', borderWidth: 2, borderRadius: 6 }] },
    options: chartOptions('分钟', '#FF6B6B')
  });
  charts.spWeekTimes = new Chart($('#sp-week-times'), {
    type: 'bar',
    data: { labels, datasets: [{ label: '次数', data: timesArr, backgroundColor: 'rgba(108,92,231,.6)', borderColor: '#6C5CE7', borderWidth: 2, borderRadius: 6 }] },
    options: chartOptions('次数', '#6C5CE7')
  });
  const byType = {};
  records.forEach(r => { byType[r.type] = (byType[r.type] || 0) + r.duration; });
  const keys = Object.keys(byType);
  if (keys.length) {
    const pieColors = keys.map(k => (SPORT_TYPES.find(t => t.key === k) || { color: '#A29BFE' }).color);
    const pieLabels = keys.map(k => (SPORT_TYPES.find(t => t.key === k) || { name: k }).name);
    charts.spTypePie = new Chart($('#sp-type-pie'), {
      type: 'doughnut',
      data: { labels: pieLabels, datasets: [{ data: keys.map(k => byType[k]), backgroundColor: pieColors, borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 11 } } } } }
    });
  }
}

/* ============================================
   学习技能板块（按月/两月轮换）
   ============================================ */
function skillPeriod() {
  return (loadData('skill_settings', { periodMonths: 1 }).periodMonths) || 1;
}
function skillById(id) { return SKILL_LIB[id] || null; }
function skillIdForMonth(year, m) {
  const period = skillPeriod();
  const plan = SKILL_PLAN[year] || SKILL_PLAN[2027];
  const slot = Math.floor(m / period) % plan.length;
  return plan[slot];
}
function currentSkill() {
  const now = new Date();
  const id = skillIdForMonth(now.getFullYear(), now.getMonth());
  return skillById(id) || { id: id, name: '未配置', icon: '❓', category: '技术', tagline: '', goal: '', durationHint: '', modules: [] };
}
function skillProgress(skillId) {
  const all = loadData('skill_progress', {});
  return all[skillId] || { learned: [], done: false };
}
function totalLessons(skill) {
  return skill.modules.reduce((s, m) => s + m.lessons.length, 0);
}
function skillLessonExists(skill, id) {
  return skill.modules.some(m => m.lessons.some(l => l.id === id));
}

function renderSkill(c) {
  const period = skillPeriod();
  const autoSkill = currentSkill();
  const viewId = currentSkillView || autoSkill.id;
  const skill = skillById(viewId) || autoSkill;
  const prog = skillProgress(skill.id);
  const total = totalLessons(skill);
  const learnedCount = prog.learned.filter(id => skillLessonExists(skill, id)).length;
  const pct = total ? Math.round(learnedCount / total * 100) : 0;
  const isAuto = (viewId === autoSkill.id);
  const year = new Date().getFullYear();

  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-graduation-cap"></i> 学习技能</h1>
          <div class="subtitle">按月份规划全年技能 · 技术类(安身立命) 与 兴趣类(深度钻研) 两类 · 2027 起技术类占比更高</div>
        </div>
        <div class="skill-period-toggle">
          <span>轮换周期</span>
          <button class="period-btn ${period===1?'active':''}" onclick="setSkillPeriod(1)">1个月</button>
          <button class="period-btn ${period===2?'active':''}" onclick="setSkillPeriod(2)">2个月</button>
        </div>
      </div>

      <div class="skill-hero ${isAuto?'':'skill-hero-manual'}">
        <div class="skill-hero-icon">${skill.icon}</div>
        <div class="skill-hero-body">
          <div class="skill-hero-name">${skill.name}</div>
        <div class="skill-hero-badges">
          <span class="skill-cat-badge cat-${skill.category==='技术'?'tech':'interest'}">${skill.category}类 · ${skill.category==='技术'?'安身立命':'滋养身心'}</span>
          ${isAuto?'<span class="skill-badge-auto">本月技能</span>':'<span class="skill-badge-manual">手动查看</span>'}
        </div>
          <div class="skill-hero-tag">${skill.tagline}</div>
          <div class="skill-hero-goal"><i class="fas fa-bullseye"></i> ${skill.goal}</div>
          <div class="skill-hero-dur"><i class="fas fa-hourglass-half"></i> ${skill.durationHint}</div>
        </div>
        <div class="skill-hero-prog">
          <div class="progress-ring-text">${pct}%</div>
          <div class="skill-prog-sub">已学 ${learnedCount}/${total} 课</div>
        </div>
      </div>

      <div class="section-progress-bar">
        <div class="progress-info">当前技能学习进度</div>
        <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        <span class="progress-text">${learnedCount}/${total}</span>
      </div>

      ${!prog.done
        ? `<button class="btn-primary skill-done-btn" onclick="markSkillDone('${skill.id}')"><i class="fas fa-check-circle"></i> 标记本月技能已完成</button>`
        : `<div class="skill-done-flag"><i class="fas fa-trophy"></i> 已于 ${prog.completedAt} 完成「${skill.name}」🎉</div>`}

      <div class="skill-curriculum" id="skill-curriculum"></div>

      <div class="skill-map-title">
        <i class="fas fa-route"></i> 全年技能轮换地图（${year}）
        ${!isAuto ? `<button class="btn-mini" onclick="resetSkillView()"><i class="fas fa-rotate-left"></i> 回到本月</button>` : ''}
      </div>
      <div class="skill-map" id="skill-map"></div>
    </div>
  `;
  renderSkillCurriculum(skill);
  renderSkillMap();
}

function skillLessonTableHTML(t) {
  if (!t || !t.head) return '';
  return `<table class="skill-tbl">
    <thead><tr>${t.head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
}

function renderSkillCurriculum(skill) {
  const box = $('#skill-curriculum');
  if (!box) return;
  const prog = skillProgress(skill.id);
  box.innerHTML = skill.modules.map((m, mi) => `
    <div class="skill-module">
      <div class="skill-module-head">第${mi + 1}模块 · ${m.title}</div>
      <div class="skill-lessons">
        ${m.lessons.map(l => {
          const done = prog.learned.includes(l.id);
          return `
          <div class="skill-lesson ${done ? 'done' : ''}">
            <label class="skill-lesson-check">
              <input type="checkbox" ${done ? 'checked' : ''} onchange="toggleSkillLesson('${skill.id}','${l.id}',this)">
              <span class="skill-lesson-title">${l.title}</span>
            </label>
            <div class="skill-lesson-detail">
              <ul>${l.points.map(p => `<li>${p}</li>`).join('')}</ul>
              ${l.figure ? `<div class="skill-lesson-figure">${l.figure}</div>` : ''}
              ${l.table ? `<div class="skill-lesson-table">${skillLessonTableHTML(l.table)}</div>` : ''}
              <div class="skill-lesson-action"><i class="fas fa-hands-helping"></i> 动手做：${l.action}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function toggleSkillLesson(skillId, lessonId, el) {
  const all = loadData('skill_progress', {});
  const p = all[skillId] || { learned: [], done: false };
  const has = p.learned.includes(lessonId);
  if (has) p.learned = p.learned.filter(x => x !== lessonId);
  else p.learned.push(lessonId);
  p.done = false;
  all[skillId] = p;
  saveData('skill_progress', all);
  const row = el.closest('.skill-lesson');
  if (row) row.classList.toggle('done', !has);
  const skill = skillById(skillId);
  const total = totalLessons(skill);
  const learnedCount = p.learned.filter(id => skillLessonExists(skill, id)).length;
  const pct = total ? Math.round(learnedCount / total * 100) : 0;
  const fill = document.querySelector('.section-progress-bar .progress-bar-fill');
  if (fill) fill.style.width = pct + '%';
  const txt = document.querySelector('.section-progress-bar .progress-text');
  if (txt) txt.textContent = learnedCount + '/' + total;
  const ring = document.querySelector('.skill-hero-prog .progress-ring-text');
  if (ring) ring.textContent = pct + '%';
  const sub = document.querySelector('.skill-hero-prog .skill-prog-sub');
  if (sub) sub.textContent = '已学 ' + learnedCount + '/' + total + ' 课';
  showToast(has ? '已取消标记' : '已学完一课 ✅');
}

function markSkillDone(skillId) {
  const all = loadData('skill_progress', {});
  const p = all[skillId] || { learned: [], done: false };
  const skill = skillById(skillId);
  p.learned = (skill ? skill.modules.flatMap(m => m.lessons.map(l => l.id)) : p.learned);
  p.done = true;
  p.completedAt = today();
  all[skillId] = p;
  saveData('skill_progress', all);
  renderSkill($('#main-content'));
  showToast('太棒了！本月技能已通关 🏆');
}

function setSkillPeriod(m) {
  const s = loadData('skill_settings', { periodMonths: 1 });
  s.periodMonths = m;
  saveData('skill_settings', s);
  renderSkill($('#main-content'));
  showToast('轮换周期已设为 ' + m + ' 个月');
}

function viewSkillByMonth(m) {
  const year = new Date().getFullYear();
  currentSkillView = skillIdForMonth(year, m);
  renderSkill($('#main-content'));
}

function resetSkillView() {
  currentSkillView = null;
  renderSkill($('#main-content'));
}

function renderSkillMap() {
  const box = $('#skill-map');
  if (!box) return;
  const year = new Date().getFullYear();
  const curMonth = new Date().getMonth();
  const autoId = skillIdForMonth(year, curMonth);
  const plan = SKILL_PLAN[year] || SKILL_PLAN[2027];
  const techCount = plan.filter(id => { const s = skillById(id); return s && s.category === '技术'; }).length;
  const interestCount = plan.length - techCount;
  let html = `<div class="skill-map-legend">
    <span class="sml-item cat-tech">● 技术类 · 安身立命（${techCount}）</span>
    <span class="sml-item cat-interest">● 兴趣类 · 深度钻研（${interestCount}）</span>
  </div>`;
  for (let m = 0; m < 12; m++) {
    const id = skillIdForMonth(year, m);
    const sk = skillById(id);
    if (!sk) continue;
    const isCur = (m === curMonth);
    const isView = (currentSkillView === sk.id) || (!currentSkillView && id === autoId && isCur);
    const catCls = sk.category === '技术' ? 'cat-tech' : 'cat-interest';
    const name = sk.name.length > 4 ? sk.name.slice(0, 4) + '…' : sk.name;
    html += `<div class="skill-map-cell ${isCur ? 'cur' : ''} ${isView ? 'view' : ''} ${catCls}" onclick="viewSkillByMonth(${m})" title="${sk.name}">
      <div class="skill-map-month">${m + 1}月</div>
      <div class="skill-map-icon">${sk.icon}</div>
      <div class="skill-map-name">${name}</div>
    </div>`;
  }
  box.innerHTML = html;
}

// ===== 每天的 10 分钟 板块 =====
function gotoModule(mod) {
  $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.module === mod));
  flushUsage();
  currentModule = mod;
  lastModuleSwitch = Date.now();
  renderModule(mod);
}

// 每两周轮换一次（以 2026-07-27 周一为锚点）
function tenminRotation() {
  const EPOCH = new Date(2026, 6, 27);
  const now = new Date();
  const days = Math.floor((now - EPOCH) / 86400000);
  const round = Math.max(0, Math.floor(days / 14));
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const start = new Date(EPOCH.getTime() + round * 14 * 86400000);
  const next = new Date(EPOCH.getTime() + (round + 1) * 14 * 86400000);
  return { round: round + 1, start: fmt(start), next: fmt(next) };
}

// 视频「点击才播放」：进入板块默认只渲染占位图，避免多个视频同时响
const TENMIN_PLAYER = 'https://player.bilibili.com/player.html?page=1&high_quality=1&danmaku=0';
function tenminIframeHTML(v) {
  return `<iframe class="tenmin-iframe" data-bv="${v.bvid}" data-title="${v.title}" src="${TENMIN_PLAYER}&bvid=${v.bvid}&autoplay=1" scrolling="no" frameborder="0" allowfullscreen="true"></iframe>`;
}
function tenminPlaceholderHTML(v) {
  const t = String(v.title).replace(/"/g, '&quot;');
  return `<div class="tenmin-video-ph" onclick="tenminPlay('${v.bvid}','${t.replace(/'/g, "\\'")}')">
      <div class="tenmin-video-ph-inner"><i class="fas fa-play"></i></div>
      <div class="tenmin-video-ph-label">${v.title} · 点击播放</div>
    </div>`;
}
function tenminVideoHTML(v) {
  if (v.type === 'bilibili') return tenminPlaceholderHTML(v);
  const kw = encodeURIComponent(v.keyword);
  return `<a class="tenmin-search-btn" href="https://search.bilibili.com/all?keyword=${kw}" target="_blank" rel="noopener">
      <i class="fas fa-play-circle"></i> 在 B 站搜索跟练：${v.keyword}
    </a>`;
}
function tenminFallbackHTML(v) {
  const kw = encodeURIComponent(v.type === 'search' ? v.keyword : v.title);
  return `<a class="tenmin-fallback" href="https://search.bilibili.com/all?keyword=${kw}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> 视频若无法播放，点此去 B 站搜索同名跟练</a>`;
}
function tenminPlay(bvid, title) {
  // 先暂停同板块其它正在播放的视频，避免同时响
  $$('.tenmin-iframe').forEach(f => {
    const box = f.parentElement;
    if (box && box.classList.contains('tenmin-video')) {
      box.innerHTML = tenminPlaceholderHTML({ bvid: f.dataset.bv, title: f.dataset.title });
    }
  });
  const target = $(`.tenmin-video[data-bv="${bvid}"]`);
  if (target) target.innerHTML = tenminIframeHTML({ bvid, title });
}

let tenminChoice = {}; // 用户手动切换的视频下标（覆盖轮换默认）

function renderTenmin(c) {
  const rot = tenminRotation();
  let html = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-stopwatch"></i> 每天的 10 分钟</h1>
          <div class="subtitle">把小事拆进「早上 / 中午 / 晚上」三个 10 分钟 · 有教程讲解也有视频跟练</div>
        </div>
      </div>
      <div class="tenmin-rotation">
        <i class="fas fa-sync-alt"></i> 当前第 <strong>${rot.round}</strong> 轮（起始 ${rot.start} · 下次更换 ${rot.next}）· 每两周自动换新视频
      </div>
      <div class="tenmin-slots">`;

  TENMIN_SLOTS.forEach(slot => {
    const acts = Object.values(TENMIN_ACTIVITIES).filter(a => a.slot === slot.id);
    html += `
      <div class="tenmin-slot">
        <div class="tenmin-slot-head">
          <span class="tenmin-slot-icon">${slot.icon}</span>
          <div>
            <div class="tenmin-slot-name">${slot.name}</div>
            <div class="tenmin-slot-desc">${slot.desc}</div>
          </div>
        </div>`;
    acts.forEach(act => {
      html += `
        <div class="tenmin-act">
          <div class="tenmin-act-head">
            <span class="tenmin-act-icon">${act.icon}</span>
            <span class="tenmin-act-name">${act.name}</span>
          </div>`;
      if (act.kind === 'internal') {
        html += `
          <div class="tenmin-internal">
            <ul class="tenmin-tutorial">${act.tutorial.map(t => `<li>${t}</li>`).join('')}</ul>
            <button class="tenmin-go-btn" onclick="gotoModule('${act.target}')"><i class="fas fa-arrow-right"></i> 打开${act.target === 'english' ? '英语角' : '每日大事件'}</button>
            <div class="tenmin-note">${act.note}</div>
          </div>`;
      } else {
        const rotIdx = Math.floor((Date.now() - new Date(2026, 6, 27)) / 86400000 / 14) % act.videos.length;
        const showIdx = tenminChoice[act.id] !== undefined ? (tenminChoice[act.id] % act.videos.length) : rotIdx;
        const v = act.videos[showIdx];
        html += `
          <ul class="tenmin-tutorial">${act.tutorial.map(t => `<li>${t}</li>`).join('')}</ul>
          <div class="tenmin-video" id="tenmin-video-${act.id}"${v.type === 'bilibili' ? ` data-bv="${v.bvid}" data-title="${v.title.replace(/"/g, '&quot;')}"` : ''}>${tenminVideoHTML(v)}</div>
          ${tenminFallbackHTML(v)}
          <div class="tenmin-chips">
            ${act.videos.map((vv, i) => `<button class="tenmin-chip ${i === showIdx ? 'on' : ''}" onclick="tenminPick('${act.id}', ${i})">${vv.title}</button>`).join('')}
          </div>
          <div class="tenmin-note">${act.note}</div>`;
      }
      html += `</div>`;
    });
    html += `</div>`;
  });

  html += `
      </div>
    </div>`;
  c.innerHTML = html;
}

function tenminPick(actId, idx) {
  tenminChoice[actId] = idx;
  const act = TENMIN_ACTIVITIES[actId];
  const box = $('#tenmin-video-' + actId);
  if (box) {
    const v = act.videos[idx % act.videos.length];
    // 先暂停其它正在播放的视频
    $$('.tenmin-iframe').forEach(f => {
      const b = f.parentElement;
      if (b && b.classList.contains('tenmin-video')) b.innerHTML = tenminPlaceholderHTML({ bvid: f.dataset.bv, title: f.dataset.title });
    });
    box.innerHTML = (v.type === 'bilibili') ? tenminIframeHTML(v) : tenminVideoHTML(v);
    box.setAttribute('data-bv', v.type === 'bilibili' ? v.bvid : '');
    box.setAttribute('data-title', v.type === 'bilibili' ? v.title.replace(/"/g, '&quot;') : '');
    // 刷新 chip 高亮
    const chips = box.parentElement.querySelectorAll('.tenmin-chip');
    chips.forEach((ch, i) => ch.classList.toggle('on', i === (idx % act.videos.length)));
  }
}

/* ============================================
   美妆 & 穿搭板块
   ============================================ */
let currentBeautyTab = 'makeup';

function bloggerLink(platform, keyword) {
  const kw = encodeURIComponent(keyword);
  if (platform === 'douyin') return `https://www.douyin.com/search/${kw}`;
  if (platform === 'xiaohongshu') return `https://www.xiaohongshu.com/search_result?keyword=${kw}`;
  return `https://search.bilibili.com/all?keyword=${kw}`;
}
const BEAUTY_PLATFORM_LABEL = { douyin: '抖音', xiaohongshu: '小红书', bilibili: 'B站' };

function switchBeautyTab(id) {
  currentBeautyTab = id;
  const c = $('#main-content');
  renderBeauty(c);
  injectUpdateBadge(c, 'beauty');
}

function renderBeauty(c) {
  const isMakeup = currentBeautyTab === 'makeup';
  const bloggers = isMakeup ? MAKEUP_BLOGGERS : FASHION_BLOGGERS;
  const tabName = isMakeup ? '美妆' : '穿搭';
  const wk = (FASHION_WEEKLY || []).slice(-1)[0] || { week: '本周', theme: '白 + 高级灰 · 极简通勤', colors: ['#FFFFFF', '#A8A8A8', '#3A3A3A'], tip: '白配灰最不出错，灰色压住白色的飘，通勤气场稳。' };
  let html = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-palette"></i> 美妆穿搭</h1>
          <div class="subtitle">${isMakeup ? '看博主视频与讲解，边看边学 · 不打系统理论' : '权威色彩搭配 + 上衣配下装 + 审美提高，跟着博主学'}</div>
        </div>
      </div>
      <div class="beauty-tabs">
        ${BEAUTY_TABS.map(t => `<button class="beauty-tab ${t.id === currentBeautyTab ? 'on' : ''}" onclick="switchBeautyTab('${t.id}')"><i>${t.icon}</i> ${t.name}</button>`).join('')}
      </div>`;

  if (isMakeup) {
    // 美妆：只给概念速查 + 博主（不做系统教程）
    html += `
      <h3 class="beauty-section-title"><i class="fas fa-book"></i> 美妆概念速查（边看视频边对照）</h3>
      <div class="beauty-knowledge">`;
    MAKEUP_CONCEPTS.forEach(k => {
      html += `<div class="beauty-card"><div class="beauty-card-title">${k.term}</div><ul class="beauty-card-points"><li>${k.desc}</li></ul></div>`;
    });
    html += `</div>`;
  } else {
    // 本周配色（每周一自动更新）
    html += `
      <div class="fashion-weekly">
        <div class="fashion-weekly-head"><i class="fas fa-calendar-week"></i> 本周配色 · ${wk.week}（每周一自动更新，看顶部更新倒计时）</div>
        <div class="fashion-weekly-body">
          <div class="fashion-weekly-swatches">${wk.colors.map(x => `<span class="fw-swatch" style="background:${x}" title="${x}"></span>`).join('')}</div>
          <div class="fashion-weekly-info">
            <div class="fashion-weekly-theme">${wk.theme}</div>
            <div class="fashion-weekly-tip">${wk.tip}</div>
          </div>
        </div>
      </div>`;

    // ① 权威色彩搭配（精准色卡）
    html += `
      <h3 class="beauty-section-title"><i class="fas fa-palette"></i> 权威色彩搭配（精准色卡，每个色块带真实 HEX）</h3>
      <div class="fashion-palettes">`;
    FASHION_PALETTES.forEach(p => {
      const grad = 'linear-gradient(90deg,' + p.colors.map(x => x.hex).join(',') + ')';
      html += `
        <div class="fashion-palette">
          <div class="fashion-palette-name">${p.name}</div>
          <div class="fashion-palette-bar" style="background:${grad}"></div>
          <div class="fashion-palette-chips">
            ${p.colors.map(x => `<div class="fashion-chip"><span class="fashion-chip-color" style="background:${x.hex}"></span><span class="fashion-chip-hex">${x.hex}</span><span class="fashion-chip-name">${x.name}</span></div>`).join('')}
          </div>
          <div class="fashion-palette-meta"><b>气质：</b>${p.vibe}</div>
          <div class="fashion-palette-meta"><b>适合：</b>${p.suitable}</div>
          <div class="fashion-palette-meta avoid"><b>避雷：</b>${p.avoid}</div>
        </div>`;
    });
    html += `</div>`;

    // ①补：统一色彩搭配总表（什么颜色配什么）
    html += `
      <h3 class="beauty-section-title"><i class="fas fa-rainbow"></i> 颜色搭配总表（什么颜色配什么 · 统一参考）</h3>
      <div class="fashion-color-guide">`;
    FASHION_COLOR_GUIDE.forEach(g => {
      html += `
        <div class="fcg-card">
          <div class="fcg-head">
            <span class="fcg-swatch" style="background:${g.hex}"></span>
            <span class="fcg-name">${g.color}</span>
          </div>
          <div class="fcg-matches"><span class="fcg-label">配</span>${g.matches.map(m => `<span class="fcg-tag">${m}</span>`).join('')}</div>
          <div class="fcg-avoid"><span class="fcg-label bad">避</span>${g.avoid.map(a => `<span class="fcg-tag bad">${a}</span>`).join('')}</div>
          <div class="fcg-note">${g.note}</div>
        </div>`;
    });
    html += `</div>`;

    // ② 图示穿搭模板（带 SVG 上身参考）
    html += `
      <h3 class="beauty-section-title"><i class="fas fa-tshirt"></i> 穿搭模板图鉴（图示参考，照着搭）</h3>
      <div class="fashion-outfits">`;
    FASHION_OUTFITS.forEach(o => {
      html += `
        <div class="fo-card">
          ${outfitSVG(o.top, o.bottom, o.accent)}
          <div class="fo-name">${o.name}</div>
          <div class="fo-meta"><span class="fo-label">场合</span>${o.occasion}</div>
          <div class="fo-meta"><span class="fo-label">适合</span>${o.bodyType}</div>
          <div class="fo-why">${o.why}</div>
          <div class="fo-colors">
            <span class="fo-color"><i style="background:${o.top}"></i>上 ${o.top}</span>
            <span class="fo-color"><i style="background:${o.bottom}"></i>下 ${o.bottom}</span>
            <span class="fo-color"><i style="background:${o.accent}"></i>点缀 ${o.accent}</span>
          </div>
        </div>`;
    });
    html += `</div>`;

    // ③ 上衣配下装
    html += `
      <h3 class="beauty-section-title"><i class="fas fa-tshirt"></i> 什么样的上衣配什么样的下装（直接照着搭）</h3>
      <div class="fashion-match">`;
    FASHION_TOP_BOTTOM.forEach(m => {
      html += `
        <div class="fashion-match-card">
          <div class="fashion-match-top">${m.top}</div>
          <div class="fashion-match-row"><span class="fm-label ok">推荐下装</span>${m.match.map(x => `<span class="fm-tag">${x}</span>`).join('')}</div>
          <div class="fashion-match-row"><span class="fm-label no">避免</span><span class="fm-tag bad">${m.avoid}</span></div>
          <div class="fashion-match-note">${m.note}</div>
        </div>`;
    });
    html += `</div>`;

    // ③ 审美提高
    html += `
      <h3 class="beauty-section-title"><i class="fas fa-eye"></i> 审美提高（核心概念）</h3>
      <div class="beauty-knowledge">`;
    FASHION_AESTHETIC.forEach(a => {
      html += `<div class="beauty-card"><div class="beauty-card-cat">${a.cat}</div><div class="beauty-card-title">${a.title}</div><ul class="beauty-card-points">${a.points.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
    });
    html += `</div>`;

    // 系统基础
    html += `
      <h3 class="beauty-section-title"><i class="fas fa-layer-group"></i> 穿搭系统基础（查漏补缺）</h3>
      <div class="beauty-knowledge">`;
    FASHION_KNOWLEDGE.forEach(k => {
      html += `<div class="beauty-card"><div class="beauty-card-cat">${k.cat}</div><div class="beauty-card-title">${k.title}</div><ul class="beauty-card-points">${k.points.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
    });
    html += `</div>`;
  }

  // 博主（两个 tab 都显示）
  html += `
      <h3 class="beauty-section-title"><i class="fas fa-user-circle"></i> 值得关注的${tabName}博主</h3>
      <div class="beauty-bloggers">`;
  bloggers.forEach(b => {
    const link = bloggerLink(b.platform, b.search);
    html += `
        <div class="beauty-card beauty-blogger">
          <div class="beauty-blogger-head">
            <div class="beauty-blogger-name">${b.name}</div>
            <span class="beauty-blogger-platform">${BEAUTY_PLATFORM_LABEL[b.platform] || b.platform}</span>
          </div>
          <div class="beauty-blogger-focus">${b.focus}</div>
          <div class="beauty-blogger-update"><b>近期动向：</b>${b.update}</div>
          <div class="beauty-blogger-why">${b.why}</div>
          <a class="beauty-blogger-btn" href="${link}" target="_blank" rel="noopener"><i class="fas fa-play-circle"></i> 看 ${b.name.split('（')[0]} 最新视频</a>
        </div>`;
  });
  html += `
      </div>
    </div>`;
  c.innerHTML = html;
}

/* ============================================
   宠物板块（猫猫 / 狗狗 同步双栏）
   ============================================ */
function loadPet() {
  const def = { cats: {}, dogs: { '狗狗': { weights: [], deworm: [], notes: [] } }, food: [], currentCat: PET_DEFAULT_CATS[0] };
  PET_DEFAULT_CATS.forEach(n => { def.cats[n] = { weights: [], deworm: [], notes: [] }; });
  try {
    const raw = localStorage.getItem('mw_pet');
    if (!raw) return def;
    const d = JSON.parse(raw);
    // 旧模型迁移（cat/dog 单只 → cats/dogs 多只）
    if (d.cat && d.cat.weights) { d.cats = { '猫咪': { weights: d.cat.weights, deworm: d.cat.deworm || [], notes: d.cat.notes || [] } }; delete d.cat; }
    if (d.dog && d.dog.weights) { d.dogs = { '狗狗': { weights: d.dog.weights, deworm: d.dog.deworm || [], notes: d.dog.notes || [] } }; delete d.dog; }
    d.cats = d.cats || {}; d.dogs = d.dogs || { '狗狗': { weights: [], deworm: [], notes: [] } };
    d.food = d.food || [];
    // 保证 5 只默认猫咪都在
    PET_DEFAULT_CATS.forEach(n => {
      if (!d.cats[n]) d.cats[n] = { weights: [], deworm: [], notes: [] };
      d.cats[n].weights = d.cats[n].weights || []; d.cats[n].deworm = d.cats[n].deworm || []; d.cats[n].notes = d.cats[n].notes || [];
    });
    Object.keys(d.dogs).forEach(k => { d.dogs[k].weights = d.dogs[k].weights || []; d.dogs[k].deworm = d.dogs[k].deworm || []; d.dogs[k].notes = d.dogs[k].notes || []; });
    if (!d.currentCat || !d.cats[d.currentCat]) d.currentCat = Object.keys(d.cats)[0] || PET_DEFAULT_CATS[0];
    return d;
  } catch { return def; }
}
function savePet(d) { localStorage.setItem('mw_pet', JSON.stringify(d)); }
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

let petAddingCat = false;
let currentPetHealthTab = 'symptom';

function renderPet(c) {
  const d = loadPet();
  const catNames = Object.keys(d.cats);
  const cur = d.currentCat && d.cats[d.currentCat] ? d.currentCat : catNames[0];
  const cat = d.cats[cur];
  const catWeights = cat.weights.slice().sort((a, b) => a.date < b.date ? -1 : 1);
  const catLast = catWeights[catWeights.length - 1];
  const catDeworm = cat.deworm.slice().reverse();

  const dogName = Object.keys(d.dogs)[0];
  const dog = d.dogs[dogName];
  const dogWeights = dog.weights.slice().sort((a, b) => a.date < b.date ? -1 : 1);
  const dogLast = dogWeights[dogWeights.length - 1];
  const dogDeworm = dog.deworm.slice().reverse();

  // 每日养宠小知识（按天轮换）
  const dayIdx = Math.floor(Date.now() / 86400000);
  const tip = PET_DAILY_TIPS[dayIdx % PET_DAILY_TIPS.length];
  const now = new Date();
  const tds = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let html = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-paw"></i> 宠物</h1>
          <div class="subtitle">猫猫 🐱 多只同步管理（${catNames.length} 只）与狗狗 🐶：体重、驱虫、口粮购买一次记全</div>
        </div>
      </div>
      <div class="pet-panels">
        <!-- 猫猫面板（多只） -->
        <div class="pet-panel">
          <div class="pet-panel-head">
            <span class="pet-panel-icon">🐱</span>
            <div>
              <div class="pet-panel-name">猫猫（${catNames.length} 只）</div>
              <div class="pet-panel-sub">当前：${cur}${catLast ? ` · 最新 ${catLast.kg}kg（${catLast.date}）` : ' · 暂无体重'}</div>
            </div>
          </div>
          <div class="pet-cat-chips">
            ${catNames.map(n => `<button class="pet-cat-chip ${n === cur ? 'on' : ''}" onclick="petSelectCat('${n}')">${n}</button>`).join('')}
            <button class="pet-cat-chip add ${petAddingCat ? 'on' : ''}" onclick="petShowAddCat()">+ 添加</button>
          </div>
          ${petAddingCat ? `
          <div class="pet-addcat">
            <input type="text" id="pet-newcat-name" placeholder="猫咪名字" maxlength="10">
            <button onclick="petAddCat()">确定</button>
            <button class="ghost" onclick="petCancelAddCat()">取消</button>
          </div>` : ''}
          <div class="pet-block">
            <div class="pet-block-title">${cur} · 每日体重</div>
            <canvas id="pet-cat-weight"></canvas>
            <div class="pet-form">
              <input type="date" id="pet-cat-wdate" value="${todayStr()}">
              <input type="number" step="0.01" min="0" placeholder="kg" id="pet-cat-wkg">
              <input type="text" placeholder="备注(可选)" id="pet-cat-wnote">
              <button onclick="addPetWeight('cat')">记录</button>
            </div>
            <div class="pet-list">
              ${catWeights.slice(-5).reverse().map(w => `<div class="pet-list-row"><span>${w.date}</span><b>${w.kg}kg</b><span class="pet-note">${escapeHtml(w.note || '')}</span></div>`).join('') || '<div class="pet-empty">暂无记录</div>'}
            </div>
          </div>
          <div class="pet-block">
            <div class="pet-block-title">${cur} · 驱虫记录</div>
            <div class="pet-form">
              <input type="date" id="pet-cat-ddate" value="${todayStr()}">
              <select id="pet-cat-dtype">${PET_DEWORM_TYPES.map(t => `<option>${t}</option>`).join('')}</select>
              <input type="text" placeholder="药品/品牌" id="pet-cat-dprod">
              <button onclick="addPetDeworm('cat')">记录</button>
            </div>
            <div class="pet-list">
              ${catDeworm.map(w => `<div class="pet-list-row"><span>${w.date}</span><b>${w.type}</b><span class="pet-note">${escapeHtml(w.product || '')} ${escapeHtml(w.note || '')}</span></div>`).join('') || '<div class="pet-empty">暂无记录</div>'}
            </div>
          </div>
          <div class="pet-block">
            <div class="pet-block-title">${cur} · 随笔 / 备注（可加图片）</div>
            <div class="pet-form pet-note-form">
              <textarea id="pet-cat-note" placeholder="今天和${cur}的故事、心得、医嘱…"></textarea>
              <input type="file" id="pet-cat-note-img" accept="image/*" class="pet-note-file">
              <button onclick="addPetNote('cat','${cur}')">保存随笔</button>
            </div>
            <div class="pet-note-list">${renderPetNotes(cat.notes)}</div>
          </div>
        </div>

        <!-- 狗狗面板 -->
        <div class="pet-panel">
          <div class="pet-panel-head">
            <span class="pet-panel-icon">🐶</span>
            <div>
              <div class="pet-panel-name">狗狗</div>
              <div class="pet-panel-sub">${dogLast ? `最新体重 ${dogLast.kg}kg（${dogLast.date}）` : '还没有体重记录'}</div>
            </div>
          </div>
          <div class="pet-block">
            <div class="pet-block-title">每日体重</div>
            <canvas id="pet-dog-weight"></canvas>
            <div class="pet-form">
              <input type="date" id="pet-dog-wdate" value="${todayStr()}">
              <input type="number" step="0.01" min="0" placeholder="kg" id="pet-dog-wkg">
              <input type="text" placeholder="备注(可选)" id="pet-dog-wnote">
              <button onclick="addPetWeight('dog')">记录</button>
            </div>
            <div class="pet-list">
              ${dogWeights.slice(-5).reverse().map(w => `<div class="pet-list-row"><span>${w.date}</span><b>${w.kg}kg</b><span class="pet-note">${escapeHtml(w.note || '')}</span></div>`).join('') || '<div class="pet-empty">暂无记录</div>'}
            </div>
          </div>
          <div class="pet-block">
            <div class="pet-block-title">驱虫记录</div>
            <div class="pet-form">
              <input type="date" id="pet-dog-ddate" value="${todayStr()}">
              <select id="pet-dog-dtype">${PET_DEWORM_TYPES.map(t => `<option>${t}</option>`).join('')}</select>
              <input type="text" placeholder="药品/品牌" id="pet-dog-dprod">
              <button onclick="addPetDeworm('dog')">记录</button>
            </div>
            <div class="pet-list">
              ${dogDeworm.map(w => `<div class="pet-list-row"><span>${w.date}</span><b>${w.type}</b><span class="pet-note">${escapeHtml(w.product || '')} ${escapeHtml(w.note || '')}</span></div>`).join('') || '<div class="pet-empty">暂无记录</div>'}
            </div>
          </div>
          <div class="pet-block">
            <div class="pet-block-title">${dogName} · 随笔 / 备注（可加图片）</div>
            <div class="pet-form pet-note-form">
              <textarea id="pet-dog-note" placeholder="今天和${dogName}的故事、心得、医嘱…"></textarea>
              <input type="file" id="pet-dog-note-img" accept="image/*" class="pet-note-file">
              <button onclick="addPetNote('dog','${dogName}')">保存随笔</button>
            </div>
            <div class="pet-note-list">${renderPetNotes(dog.notes)}</div>
          </div>
        </div>
      </div>

      <div class="pet-food">
        <div class="pet-block-title">口粮购买记录（猫粮 / 狗粮，两个区域共享）</div>
        <div class="pet-form pet-food-form">
          <input type="date" id="pet-food-date" value="${todayStr()}">
          <select id="pet-food-kind">${PET_FOOD_KINDS.map(k => `<option>${k}</option>`).join('')}</select>
          <input type="text" placeholder="品牌" id="pet-food-brand">
          <input type="text" placeholder="规格(如 2kg)" id="pet-food-spec">
          <input type="number" step="0.01" min="0" placeholder="价格¥" id="pet-food-price">
          <input type="text" placeholder="备注(可选)" id="pet-food-note">
          <button onclick="addPetFood()">添加</button>
        </div>
        <div class="pet-list">
          ${d.food.slice().reverse().map(f => `<div class="pet-list-row"><span>${f.date}</span><b class="pet-kind-${f.kind === '猫粮' ? 'cat' : 'dog'}">${f.kind}</b><span class="pet-note">${escapeHtml(f.brand || '')} ${escapeHtml(f.spec || '')} ${f.price ? '¥' + f.price : ''} ${escapeHtml(f.note || '')}</span></div>`).join('') || '<div class="pet-empty">暂无购买记录</div>'}
        </div>
      </div>

      <div class="pet-tip">
        <div class="pet-tip-head"><i class="fas fa-lightbulb"></i> 今日养宠小知识 <span class="pet-tip-date">${tds} · 第 ${(dayIdx % PET_DAILY_TIPS.length) + 1}/${PET_DAILY_TIPS.length} 条</span></div>
        <div class="pet-tip-cat">${tip.cat}</div>
        <div class="pet-tip-title">${tip.title}</div>
        <div class="pet-tip-text">${tip.text}</div>
      </div>

      <div class="pet-health">
        <div class="beauty-section-title"><i class="fas fa-heartbeat"></i> 科学养宠指南（症状自查 · 用药参考 · 科普）</div>
        <div class="pet-health-disclaimer"><i class="fas fa-exclamation-triangle"></i> 科普免责：以下内容为科学参考，<b>不能替代执业兽医的诊断与处方</b>。任何用药请遵医嘱、按体重精确给药，<b>切勿自行喂人用药</b>。</div>
        <div class="pet-health-tabs">
          <button class="pet-health-tab ${currentPetHealthTab === 'symptom' ? 'on' : ''}" onclick="switchPetHealthTab('symptom')">🔍 症状自查</button>
          <button class="pet-health-tab ${currentPetHealthTab === 'med' ? 'on' : ''}" onclick="switchPetHealthTab('med')">💊 用药参考</button>
          <button class="pet-health-tab ${currentPetHealthTab === 'article' ? 'on' : ''}" onclick="switchPetHealthTab('article')">📚 科学科普</button>
        </div>
        ${currentPetHealthTab === 'symptom' ? renderPetSymptoms() : currentPetHealthTab === 'med' ? renderPetMeds() : renderPetArticles()}
      </div>
    </div>`;
  c.innerHTML = html;

  // 体重曲线图
  const catCanvas = $('#pet-cat-weight');
  if (catCanvas && catWeights.length) {
    if (charts.petCatWeight) { try { charts.petCatWeight.destroy(); } catch {} }
    charts.petCatWeight = new Chart(catCanvas, {
      type: 'line',
      data: { labels: catWeights.map(w => w.date.slice(5)), datasets: [{ label: '体重 kg', data: catWeights.map(w => parseFloat(w.kg)), borderColor: '#FF6B6B', backgroundColor: 'rgba(255,107,107,.12)', fill: true, tension: .3, pointRadius: 3 }] },
      options: chartOptions('kg', '#FF6B6B')
    });
  }
  const dogCanvas = $('#pet-dog-weight');
  if (dogCanvas && dogWeights.length) {
    if (charts.petDogWeight) { try { charts.petDogWeight.destroy(); } catch {} }
    charts.petDogWeight = new Chart(dogCanvas, {
      type: 'line',
      data: { labels: dogWeights.map(w => w.date.slice(5)), datasets: [{ label: '体重 kg', data: dogWeights.map(w => parseFloat(w.kg)), borderColor: '#0984E3', backgroundColor: 'rgba(9,132,227,.12)', fill: true, tension: .3, pointRadius: 3 }] },
      options: chartOptions('kg', '#0984E3')
    });
  }
}

function switchPetHealthTab(id) { currentPetHealthTab = id; const c = $('#main-content'); renderPet(c); injectUpdateBadge(c, 'pet'); }

function renderPetSymptoms() {
  return '<div class="pet-health-list">' + PET_HEALTH_SYMPTOMS.map(s => `
    <div class="ph-card">
      <div class="ph-card-title"><i class="fas fa-stethoscope"></i> ${s.symptom}</div>
      <div class="ph-row"><span class="ph-k">可能原因</span><div class="ph-v">${s.causes.map(c => `<span class="ph-chip">${c}</span>`).join('')}</div></div>
      <div class="ph-row"><span class="ph-k">可能指向疾病</span><div class="ph-v">${s.diseases.map(c => `<span class="ph-chip dis">${c}</span>`).join('')}</div></div>
      <div class="ph-row"><span class="ph-k ph-danger">🚩 危险信号</span><div class="ph-v">${s.redFlags.map(c => `<span class="ph-chip danger">${c}</span>`).join('')}</div></div>
      <div class="ph-action"><b>如何处理：</b>${s.action}</div>
      <div class="ph-science"><b>科学依据：</b>${s.science}</div>
    </div>`).join('') + '</div>';
}
function renderPetMeds() {
  return '<div class="pet-health-list">' + PET_HEALTH_MEDICATIONS.map(m => `
    <div class="ph-card">
      <div class="ph-card-title"><i class="fas fa-pills"></i> ${m.condition}</div>
      <div class="ph-row"><span class="ph-k">兽医常用（需处方/指导）</span><div class="ph-v">${m.vetRx.map(c => `<div class="ph-line">• ${c}</div>`).join('')}</div></div>
      <div class="ph-toxic"><i class="fas fa-skull-crossbones"></i> ${m.humanToxic}</div>
      <div class="ph-science"><b>科学依据：</b>${m.science}</div>
      <div class="ph-disclaimer"><i class="fas fa-user-md"></i> ${m.disclaimer}</div>
    </div>`).join('') + '</div>';
}
function renderPetArticles() {
  return '<div class="pet-health-list">' + PET_HEALTH_ARTICLES.map(a => `
    <div class="ph-card">
      <div class="ph-card-title"><i class="fas fa-book-medical"></i> ${a.title}</div>
      <div class="ph-article">${a.body.map(p => `<p>${p}</p>`).join('')}</div>
    </div>`).join('') + '</div>';
}

// ===== 记账板块 =====
let currentLedgerTab = 'add';
let currentLedgerStatPeriod = 'month';
function renderLedger(c) {
  c.innerHTML = `
    <div class="module-content">
      <div class="module-header">
        <div>
          <h1><i class="fas fa-wallet"></i> 记账</h1>
          <div class="subtitle">微信 / 支付宝 / 零钱通 / 银行卡 / 花呗 — 每一笔都记得准，月底才知道钱去哪了</div>
        </div>
      </div>
      <div class="checkin-tabs">
        <button class="checkin-tab ${currentLedgerTab==='add'?'active':''}" data-lt="add">记一笔</button>
        <button class="checkin-tab ${currentLedgerTab==='invest'?'active':''}" data-lt="invest">定投计划</button>
        <button class="checkin-tab ${currentLedgerTab==='stats'?'active':''}" data-lt="stats">统计回顾</button>
      </div>
      <div id="ledger-content"></div>
    </div>`;
  $$('.checkin-tab[data-lt]').forEach(t => t.addEventListener('click', () => {
    $$('.checkin-tab[data-lt]').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    currentLedgerTab = t.dataset.lt;
    renderLedgerTab();
  }));
  renderLedgerTab();
}
function ledgerChannelName(k) { return (LEDGER_CHANNELS.find(c => c.key === k) || { name: k }).name; }
function ledgerCatName(k) { return (LEDGER_CATEGORIES.find(c => c.key === k) || { name: k }).name; }
function renderLedgerTab() {
  const c = $('#ledger-content'); if (!c) return;
  if (currentLedgerTab === 'add') renderLedgerAdd(c);
  else if (currentLedgerTab === 'invest') renderLedgerInvest(c);
  else renderLedgerStats(c);
}
function renderLedgerAdd(c) {
  const list = loadData('ledger', []);
  const todayList = list.filter(r => r.date === today());
  c.innerHTML = `
    <div class="ledger-form-card">
      <h3><i class="fas fa-plus-circle"></i> 记一笔</h3>
      <div class="task-input-bar" style="flex-wrap:wrap;gap:10px;">
        <input type="date" id="lg-date" value="${today()}">
        <select id="lg-channel">${LEDGER_CHANNELS.map(ch => `<option value="${ch.key}">${ch.icon} ${ch.name}</option>`).join('')}</select>
        <select id="lg-flow"><option value="exp">支出</option><option value="inc">收益</option></select>
        <select id="lg-cat">${LEDGER_CATEGORIES.map(cat => `<option value="${cat.key}">${cat.icon} ${cat.name}</option>`).join('')}</select>
        <input type="number" step="0.01" id="lg-amount" placeholder="金额¥" min="0" style="width:120px;">
        <input type="text" id="lg-purpose" placeholder="用途(买了什么)" maxlength="40" style="flex:1;min-width:140px;">
      </div>
      <div class="task-input-bar" style="flex-wrap:wrap;gap:10px;margin-top:8px;">
        <input type="text" id="lg-note" placeholder="备注(可选): 如「中午外卖」「地铁卡充值」" maxlength="60" style="flex:1;min-width:200px;">
        <button class="btn-add" onclick="addLedger()"><i class="fas fa-plus"></i> 记录</button>
      </div>
      <div class="ledger-today-tip">今天已记 <strong>${todayList.length}</strong> 笔</div>
    </div>
    <div class="ledger-list" id="ledger-list"></div>`;
  renderLedgerList(list.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 60));
}
function addLedger() {
  const date = $('#lg-date').value || today();
  const channel = $('#lg-channel').value;
  const flow = $('#lg-flow').value;
  const category = $('#lg-cat').value;
  const amount = parseFloat($('#lg-amount').value);
  const purpose = $('#lg-purpose').value.trim();
  const note = $('#lg-note').value.trim();
  if (!(amount > 0)) { showToast('请填写金额', 'error'); return; }
  if (!purpose) { showToast('请填用途（买了什么）', 'error'); return; }
  const list = loadData('ledger', []);
  list.push({ id: uid(), date, channel, flow, category, amount, purpose, note, createdAt: Date.now() });
  saveData('ledger', list);
  renderLedgerAdd($('#ledger-content'));
  showToast(flow === 'exp' ? '支出已记录 💸' : '收益已记录 💰');
}
function renderLedgerList(arr) {
  const box = $('#ledger-list'); if (!box) return;
  if (!arr.length) { box.innerHTML = '<div class="empty-state"><i class="fas fa-receipt"></i><p>还没有记账，第一笔从这里开始～</p></div>'; return; }
  box.innerHTML = arr.map(r => {
    const sign = r.flow === 'inc' ? '+' : '-';
    const color = r.flow === 'inc' ? '#00B894' : '#e17055';
    return `<div class="ledger-row">
      <div class="ledger-row-main">
        <div class="ledger-row-title">${escapeHtml(r.purpose)} <span class="ledger-row-meta">${r.date} · ${ledgerChannelName(r.channel)} · ${ledgerCatName(r.category)}${r.note ? ` · ${escapeHtml(r.note)}` : ''}</span></div>
      </div>
      <div class="ledger-row-amt" style="color:${color}">${sign}¥${r.amount.toFixed(2)}</div>
      <button class="plan-del" onclick="deleteLedger('${r.id}')" title="删除"><i class="fas fa-trash"></i></button>
    </div>`;
  }).join('');
}
function deleteLedger(id) {
  if (!confirm('删除这条记账？')) return;
  saveData('ledger', loadData('ledger', []).filter(r => r.id !== id));
  renderLedgerTab();
}
function renderLedgerInvest(c) {
  c.innerHTML = `
    <div class="ledger-form-card">
      <h3><i class="fas fa-seedling"></i> 定投计划（基金）</h3>
      <p style="color:var(--text-secondary);font-size:13px;margin:0 0 12px;">记录定投哪只基金、每天投多少、计划投几年，自动估算到期大致金额与收益（仅供参考，非投资建议）。</p>
      <div class="task-input-bar" style="flex-wrap:wrap;gap:10px;">
        <input type="text" id="iv-fund" placeholder="基金名称/代码" list="iv-fund-list" style="min-width:160px;">
        <datalist id="iv-fund-list">${LEDGER_FUNDS.map(f => `<option value="${f}">`).join('')}</datalist>
        <input type="number" step="0.01" id="iv-daily" placeholder="每天定投¥" min="0" style="width:120px;">
        <input type="number" id="iv-years" placeholder="定投年数" min="1" value="3" style="width:100px;">
        <input type="number" step="0.1" id="iv-rate" placeholder="预期年化%" value="8" style="width:100px;">
        <input type="date" id="iv-start" value="${today()}">
        <button class="btn-add" onclick="addInvest()"><i class="fas fa-plus"></i> 加入计划</button>
      </div>
    </div>
    <div class="ledger-list" id="invest-list"></div>`;
  renderInvestList();
}
function computeInvest(inv) {
  const daily = inv.daily > 0 ? inv.daily : 0;
  const years = inv.years > 0 ? inv.years : 0;
  const rate = (inv.rate || 0) / 100;
  const n = Math.round(years * 365);
  const totalInvest = daily * n;
  let fv = totalInvest;
  if (rate > 0 && n > 0) {
    const r = rate / 365;
    fv = daily * ((Math.pow(1 + r, n) - 1) / r);
  }
  return { totalInvest, fv, profit: fv - totalInvest };
}
function addInvest() {
  const fund = $('#iv-fund').value.trim();
  const daily = parseFloat($('#iv-daily').value) || 0;
  const years = parseInt($('#iv-years').value) || 0;
  const rate = parseFloat($('#iv-rate').value) || 0;
  const start = $('#iv-start').value || today();
  if (!fund) { showToast('请填基金名称', 'error'); return; }
  if (!(daily > 0) || !(years > 0)) { showToast('请填每天定投金额与年数', 'error'); return; }
  const list = loadData('invest', []);
  list.push({ id: uid(), fund, daily, years, rate, start, createdAt: Date.now() });
  saveData('invest', list);
  renderLedgerInvest($('#ledger-content'));
  showToast('定投计划已加入 📈');
}
function renderInvestList() {
  const box = $('#invest-list'); if (!box) return;
  const list = loadData('invest', []);
  if (!list.length) { box.innerHTML = '<div class="empty-state"><i class="fas fa-seedling"></i><p>还没有定投计划，加一个开始复利之旅～</p></div>'; return; }
  box.innerHTML = list.map(inv => {
    const p = computeInvest(inv);
    return `<div class="invest-card">
      <div class="invest-head"><b>${escapeHtml(inv.fund)}</b><span class="invest-sub">每天 ¥${inv.daily} · ${inv.years} 年 · 预期年化 ${inv.rate}%</span></div>
      <div class="invest-grid">
        <div><span>总投入</span><b>¥${p.totalInvest.toFixed(0)}</b></div>
        <div><span>预计到期</span><b style="color:#00B894">¥${p.fv.toFixed(0)}</b></div>
        <div><span>预计收益</span><b style="color:#0984E3">¥${p.profit.toFixed(0)}</b></div>
      </div>
      <button class="plan-del" onclick="deleteInvest('${inv.id}')" title="删除"><i class="fas fa-trash"></i></button>
    </div>`;
  }).join('');
}
function deleteInvest(id) {
  if (!confirm('删除这条定投计划？')) return;
  saveData('invest', loadData('invest', []).filter(x => x.id !== id));
  renderLedgerInvest($('#ledger-content'));
}
function ledgerRangeDates(period) {
  const now = new Date();
  if (period === 'day') return [today()];
  if (period === 'month') {
    const y = now.getFullYear(), m = now.getMonth(), dim = new Date(y, m + 1, 0).getDate(), out = [];
    for (let i = 1; i <= dim; i++) out.push(`${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
    return out;
  }
  const y = now.getFullYear(), out = [];
  for (let i = 1; i <= 12; i++) for (let d = 1; d <= new Date(y, i, 0).getDate(); d++) out.push(`${y}-${String(i).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  return out;
}
function renderLedgerStats(c) {
  const periods = [['day', '今日'], ['month', '本月'], ['year', '本年']];
  c.innerHTML = `
    <div class="ledger-period-toggle">
      ${periods.map(p => `<button class="ov-period-btn ${currentLedgerStatPeriod === p[0] ? 'on' : ''}" onclick="ledgerSetStatPeriod('${p[0]}')">${p[1]}</button>`).join('')}
    </div>
    <div id="ledger-stats-body"></div>`;
  renderLedgerStatsBody();
}
function ledgerSetStatPeriod(p) { currentLedgerStatPeriod = p; renderLedgerStats($('#ledger-content')); }
function renderLedgerStatsBody() {
  const box = $('#ledger-stats-body'); if (!box) return;
  const range = new Set(ledgerRangeDates(currentLedgerStatPeriod));
  const list = loadData('ledger', []).filter(r => range.has(r.date));
  const exp = list.filter(r => r.flow === 'exp').reduce((s, r) => s + r.amount, 0);
  const inc = list.filter(r => r.flow === 'inc').reduce((s, r) => s + r.amount, 0);
  const byChannel = {}, byCat = {};
  list.forEach(r => { if (r.flow === 'exp') { byChannel[r.channel] = (byChannel[r.channel] || 0) + r.amount; byCat[r.category] = (byCat[r.category] || 0) + r.amount; } });
  const pName = { day: '今日', month: '本月', year: '本年' }[currentLedgerStatPeriod];
  box.innerHTML = `
    <div class="ov-stats">
      <div class="ov-stat-card"><div class="ov-stat-icon" style="background:#e1705522;color:#e17055"><i class="fas fa-arrow-up"></i></div><div class="ov-stat-val">¥${exp.toFixed(2)}</div><div class="ov-stat-label">${pName}支出</div></div>
      <div class="ov-stat-card"><div class="ov-stat-icon" style="background:#00b89422;color:#00b894"><i class="fas fa-arrow-down"></i></div><div class="ov-stat-val">¥${inc.toFixed(2)}</div><div class="ov-stat-label">${pName}收益</div></div>
      <div class="ov-stat-card"><div class="ov-stat-icon" style="background:#0984e322;color:#0984e3"><i class="fas fa-scale-balanced"></i></div><div class="ov-stat-val">¥${(inc - exp).toFixed(2)}</div><div class="ov-stat-label">${pName}结余</div></div>
      <div class="ov-stat-card"><div class="ov-stat-icon" style="background:#6c5ce722;color:#6c5ce7"><i class="fas fa-receipt"></i></div><div class="ov-stat-val">${list.length}</div><div class="ov-stat-label">${pName}笔数</div></div>
    </div>
    <div class="ov-grid">
      <div class="ov-panel"><h3 class="ov-panel-title"><i class="fas fa-credit-card"></i> 按渠道支出</h3><div class="chart-container" style="height:240px"><canvas id="lg-ch-channel"></canvas></div></div>
      <div class="ov-panel"><h3 class="ov-panel-title"><i class="fas fa-tags"></i> 按分类支出</h3><div class="chart-container" style="height:240px"><canvas id="lg-ch-cat"></canvas></div></div>
    </div>
    <div class="ledger-list-title">${pName}明细（${list.length} 笔）</div>
    <div class="ledger-list" id="ledger-stats-list"></div>`;
  setTimeout(() => {
    if (charts.lgChannel) { try { charts.lgChannel.destroy(); } catch {} }
    if (charts.lgCat) { try { charts.lgCat.destroy(); } catch {} }
    const chKeys = Object.keys(byChannel);
    if (chKeys.length) {
      charts.lgChannel = new Chart($('#lg-ch-channel'), {
        type: 'doughnut',
        data: { labels: chKeys.map(k => ledgerChannelName(k)), datasets: [{ data: chKeys.map(k => byChannel[k]), backgroundColor: chKeys.map((k, i) => ['#FF6B6B', '#0984E3', '#00B894', '#6C5CE7', '#FD79A8', '#FDCB6E'][i % 6]), borderWidth: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } }, tooltip: { callbacks: { label: c => `${c.label}: ¥${c.parsed.toFixed(2)}` } } } }
      });
    }
    const catKeys = Object.keys(byCat);
    if (catKeys.length) {
      charts.lgCat = new Chart($('#lg-ch-cat'), {
        type: 'bar',
        data: { labels: catKeys.map(k => ledgerCatName(k)), datasets: [{ label: '支出', data: catKeys.map(k => byCat[k]), backgroundColor: 'rgba(225,112,85,.6)', borderColor: '#e17055', borderWidth: 2, borderRadius: 6 }] },
        options: chartOptions('¥', '#e17055')
      });
    }
    renderLedgerList(list.slice().sort((a, b) => b.createdAt - a.createdAt));
  }, 80);
}

// 穿搭图示：用真实 HEX 色画一个简易上身示意图
function outfitSVG(top, bottom, accent) {
  return `<svg class="fo-svg" viewBox="0 0 200 290" xmlns="http://www.w3.org/2000/svg" aria-label="穿搭示意图">
    <rect width="200" height="290" fill="#fafafc"/>
    <circle cx="100" cy="30" r="17" fill="#f0d9c4" stroke="#e0c4ad"/>
    <path d="M83 26 a17 17 0 0 1 34 0 q0 -12 -17 -12 q-17 0 -17 12z" fill="#3a2e28"/>
    <rect x="94" y="45" width="12" height="10" fill="#f0d9c4"/>
    <polygon points="66,62 134,62 126,130 110,130 100,120 90,130 74,130" fill="${top}" stroke="#e3e3e8"/>
    <polygon points="66,62 58,118 74,120 78,66" fill="${top}" stroke="#e3e3e8"/>
    <polygon points="134,62 142,118 126,120 122,66" fill="${top}" stroke="#e3e3e8"/>
    <rect x="74" y="126" width="52" height="7" fill="${accent}"/>
    <polygon points="74,133 126,133 122,222 78,222" fill="${bottom}" stroke="#e3e3e8"/>
    <line x1="100" y1="150" x2="100" y2="222" stroke="#e3e3e8" stroke-width="2"/>
    <rect x="74" y="222" width="22" height="12" rx="4" fill="#3a3a3a"/>
    <rect x="104" y="222" width="22" height="12" rx="4" fill="#3a3a3a"/>
    <circle cx="150" cy="160" r="13" fill="${accent}"/>
  </svg>`;
}

function petSelectCat(name) { const d = loadPet(); d.currentCat = name; savePet(d); renderPet($('#main-content')); }
function petShowAddCat() { petAddingCat = !petAddingCat; renderPet($('#main-content')); }
function petCancelAddCat() { petAddingCat = false; renderPet($('#main-content')); }
function petAddCat() {
  const input = $('#pet-newcat-name');
  const name = input ? input.value.trim() : '';
  if (!name) { alert('请输入猫咪名字'); return; }
  const d = loadPet();
  if (d.cats[name]) { alert('已存在这只猫咪'); return; }
  d.cats[name] = { weights: [], deworm: [], notes: [] };
  d.currentCat = name; petAddingCat = false; savePet(d); renderPet($('#main-content'));
}

function renderPetNotes(list) {
  if (!list || !list.length) return '<div class="pet-empty">还没有随笔，记一笔吧～</div>';
  return list.slice().reverse().map(n => `
    <div class="pet-note-card">
      <div class="pet-note-date">${n.date}</div>
      ${n.img ? `<img src="${n.img}" class="pet-note-img" alt="随笔图片" onclick="petZoomNote(this)">` : ''}
      ${n.text ? `<div class="pet-note-text">${escapeHtml(n.text)}</div>` : ''}
    </div>`).join('');
}
function petZoomNote(img) {
  const w = window.open('', '_blank');
  if (w) { w.document.write(`<title>随笔图片</title><body style="margin:0;background:#111;display:flex;align-items:center;justify-content:center;height:100vh"><img src="${img.src}" style="max-width:100%;max-height:100%"></body>`); }
}
function addPetNote(kind, name) {
  const ta = kind === 'cat' ? $('#pet-cat-note') : $('#pet-dog-note');
  const imgInput = kind === 'cat' ? $('#pet-cat-note-img') : $('#pet-dog-note-img');
  const text = ta ? ta.value.trim() : '';
  const hasImg = imgInput && imgInput.files && imgInput.files[0];
  if (!text && !hasImg) { showToast('写点什么或选张图片', 'error'); return; }
  const d = loadPet();
  const target = kind === 'cat' ? d.cats[name] : d.dogs[name];
  target.notes = target.notes || [];
  const note = { date: todayStr(), text };
  if (hasImg) {
    compressImageToDataURL(imgInput.files[0], 800, dataUrl => {
      note.img = dataUrl;
      target.notes.push(note);
      savePet(d);
      renderPet($('#main-content'));
      showToast('随笔已保存');
    });
  } else {
    target.notes.push(note);
    savePet(d);
    renderPet($('#main-content'));
    showToast('随笔已保存');
  }
}

function addPetWeight(pet) {
  const date = $('#pet-' + pet + '-wdate').value || todayStr();
  const kg = parseFloat($('#pet-' + pet + '-wkg').value);
  const note = $('#pet-' + pet + '-wnote').value.trim();
  if (!kg || kg <= 0) { alert('请输入有效的体重 kg'); return; }
  const d = loadPet();
  if (pet === 'cat') { d.cats[d.currentCat].weights.push({ date, kg: kg.toFixed(2), note }); }
  else { const dn = Object.keys(d.dogs)[0]; d.dogs[dn].weights.push({ date, kg: kg.toFixed(2), note }); }
  savePet(d);
  renderPet($('#main-content'));
}
function addPetDeworm(pet) {
  const date = $('#pet-' + pet + '-ddate').value || todayStr();
  const type = $('#pet-' + pet + '-dtype').value;
  const product = $('#pet-' + pet + '-dprod').value.trim();
  if (!product) { alert('请填写药品/品牌'); return; }
  const d = loadPet();
  if (pet === 'cat') { d.cats[d.currentCat].deworm.push({ date, type, product, note: '' }); }
  else { const dn = Object.keys(d.dogs)[0]; d.dogs[dn].deworm.push({ date, type, product, note: '' }); }
  savePet(d);
  renderPet($('#main-content'));
}
function addPetFood() {
  const date = $('#pet-food-date').value || todayStr();
  const kind = $('#pet-food-kind').value;
  const brand = $('#pet-food-brand').value.trim();
  const spec = $('#pet-food-spec').value.trim();
  const price = parseFloat($('#pet-food-price').value) || 0;
  const note = $('#pet-food-note').value.trim();
  if (!brand) { alert('请填写品牌'); return; }
  const d = loadPet();
  d.food.push({ date, kind, brand, spec, price, note });
  savePet(d);
  renderPet($('#main-content'));
}

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', init);

// 点击模态框背景关闭
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('show');
  }
});
