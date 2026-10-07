/* ============================================================
   西方塔罗 板块 · 渲染逻辑
   ------------------------------------------------------------
   与东方命理共用 mwStageState / mwTodayLesson 的阶段解锁引擎
   （在 destiny.js 里定义，本文件依赖它先加载）
   ============================================================ */

var tarotTab = 'today';
var tarotStage = '';
var tarotOpen = {};
var tarotTouched = false;     // 用户是否手动操作过课程展开
var tarotArcana = 'all';
var tarotSuit = 'all';
var tarotKw = '';
var tarotFav = null;
var tarotDraw = null;      // {spreadId, cards:[{card, rev}]}
var tarotShowCard = null;

function trFavs() {
  if (!tarotFav) tarotFav = loadData('tarot_fav', {});
  return tarotFav;
}
function trToggleFav(id) {
  var f = trFavs();
  if (f[id]) delete f[id]; else f[id] = 1;
  saveData('tarot_fav', f);
  renderTarotBody();
}

function renderTarot(c) {
  if (typeof TAROT_COURSE === 'undefined') {
    c.innerHTML = '<div class="module-content"><div class="empty-state">塔罗数据未加载</div></div>';
    return;
  }
  if (!tarotStage) tarotStage = TAROT_STAGES[0].id;
  var tabs = [
    { k: 'today', label: '今日', icon: 'fa-sun' },
    { k: 'course', label: '系统课程', icon: 'fa-graduation-cap' },
    { k: 'cards', label: '78 张牌库', icon: 'fa-layer-group' },
    { k: 'draw', label: '抽牌解读', icon: 'fa-hand-sparkles' },
    { k: 'spread', label: '牌阵', icon: 'fa-th-large' },
    { k: 'skill', label: '实战技巧', icon: 'fa-lightbulb' },
    { k: 'combo', label: '牌组合', icon: 'fa-link' },
    { k: 'fav', label: '我的收藏', icon: 'fa-star' }
  ];
  c.innerHTML =
    '<div class="module-content">' +
      '<div class="module-header"><div>' +
        '<h1><i class="fas fa-moon"></i> 西方塔罗</h1>' +
        '<div class="subtitle">78 张牌 · 从新手到能给人解读 —— 全部课程随时可学，今日一牌每日自动更新</div>' +
      '</div></div>' +
      '<div class="mw-tabs">' +
        tabs.map(function (t) {
          return '<button class="mw-tab ' + (t.k === tarotTab ? 'active' : '') + '" onclick="switchTarotTab(\'' + t.k + '\')">' +
            '<i class="fas ' + t.icon + '"></i> ' + t.label + '</button>';
        }).join('') +
      '</div>' +
      '<div id="tarot-body"></div>' +
    '</div>';
  renderTarotBody();
}

function switchTarotTab(k) {
  tarotTab = k;
  renderTarot($('#main-content'));
  injectUpdateBadge($('#main-content'), 'tarot');
}
function switchTarotStage(s) { tarotStage = s; tarotOpen = {}; renderTarot($('#main-content')); injectUpdateBadge($('#main-content'), 'tarot'); }

function renderTarotBody() {
  var box = $('#tarot-body');
  if (!box) return;
  var f = {
    today: renderTarotToday, course: renderTarotCourse, cards: renderTarotCards, draw: renderTarotDraw,
    spread: renderTarotSpread, skill: renderTarotSkill, combo: renderTarotCombo, fav: renderTarotFav
  }[tarotTab];
  box.innerHTML = f ? f() : '';
  // 首次进入某阶段、且用户还没手动展开任何课程时，默认展开第一课（用标志位防止递归）
  if (tarotTab === 'course' && !tarotTouched) {
    var first = TAROT_COURSE.filter(function (x) { return x.stage === tarotStage; })[0];
    if (first) {
      tarotTouched = true;
      tarotOpen[first.id] = true;
      renderTarotBody();
    }
  }
}

/* ---------- 今日 ---------- */
function renderTarotToday() {
  var ss = mwStageState('tar', TAROT_STAGES, TAROT_COURSE);
  var done = mwDoneMap('tar');
  var t = mwTodayLesson('tar', TAROT_STAGES, TAROT_COURSE, TAROT_DAILY);
  var di = mwDayIndex();
  var daily = TAROT_DAILY[di % TAROT_DAILY.length];
  var dcard = null;
  if (daily.type === 'card' && daily.cardId) dcard = TAROT_CARDS.filter(function (x) { return x.id === daily.cardId; })[0];
  if (!dcard) dcard = TAROT_CARDS[di % TAROT_CARDS.length];

  var html = '<div class="mw-hero">' +
    '<div class="mw-hero-l"><div class="mw-hero-t">今日一课</div>' +
    (t && t.kind === 'course'
      ? '<div class="mw-hero-h">' + escapeHtml(t.item.title) + '</div>' +
        '<div class="mw-hero-d">' + escapeHtml(t.item.goal) + '</div>' +
        '<button class="mw-btn primary" onclick="gotoTarotCourse(\'' + t.item.stage + '\',\'' + t.item.id + '\')"><i class="fas fa-play"></i> 开始这一课</button>' +
        '<div class="mw-hero-x">还有 ' + t.pending + ' 课等你（已解锁未学完）</div>'
      : '<div class="mw-hero-h">' + escapeHtml(daily.text.slice(0, 40)) + '…</div>' +
        '<div class="mw-hero-d">' + escapeHtml(daily.text) + '</div>' +
        '<div class="mw-hero-x">🎉 本阶段已学完，已切换到每日精进，保持手感</div>') +
    '</div>' +
    '<div class="mw-hero-r"><div class="mw-ring"><div class="mw-ring-v">' + Object.keys(done).length + '/' + TAROT_COURSE.length +
      '</div><div class="mw-ring-l">课程进度</div></div></div></div>';

  html += '<div class="mw-sec-t"><i class="fas fa-star"></i> 今日一牌 · ' + escapeHtml(dcard.name) + ' ' + escapeHtml(dcard.en) + '</div>' +
    '<div class="mw-card mw-card-today" onclick="trOpenCard(\'' + dcard.id + '\')">' +
      '<div class="mw-ct-name"><b>' + escapeHtml(dcard.name) + '</b><em>' + escapeHtml(dcard.en) + (dcard.num !== '' ? ' · ' + dcard.num : '') + '</em></div>' +
      '<div class="mw-ct-kw">' + (dcard.kw || []).map(function (k) { return '<i>' + escapeHtml(k) + '</i>'; }).join('') + '</div>' +
      '<p class="mw-ct-up">' + escapeHtml(dcard.upright) + '</p>' +
      (daily.angle ? '<div class="mw-ct-angle">💫 ' + escapeHtml(daily.angle) + '</div>' : '') +
      (daily.text ? '<p class="mw-ct-text">' + escapeHtml(daily.text) + '</p>' : '') +
      '<button class="mw-btn ghost sm">查看完整牌义（正/逆位 · 象征 · 用法）</button>' +
    '</div>';

  html += '<div class="mw-sec-t"><i class="fas fa-route"></i> 学习路径（学完自动解锁下一阶段）</div><div class="mw-stage-list">';
  ss.forEach(function (s) {
    var pctN = Math.round(s.pct * 100);
    html += '<div class="mw-stage ' + (s.unlocked ? '' : 'locked') + '" onclick="switchTarotStage(\'' + s.stage.id + '\')">' +
      '<div class="mw-stage-h"><i class="fas ' + s.stage.icon + '"></i> ' + escapeHtml(s.stage.label) +
        (s.unlocked ? '' : ' <span class="mw-lock">🔒</span>') + '</div>' +
      '<div class="mw-stage-bar"><i style="width:' + pctN + '%"></i></div>' +
      '<div class="mw-stage-f"><span>' + s.done + '/' + s.total + ' 课 · ' + pctN + '%</span>' +
        '<span class="mw-stage-r">' + (s.unlocked ? '已开放' : escapeHtml(s.reason)) + '</span></div>' +
      '<p class="mw-stage-intro">' + escapeHtml(s.stage.intro) + '</p></div>';
  });
  html += '</div>';
  return html;
}

function gotoTarotCourse(stage, id) {
  tarotStage = stage; tarotTab = 'course'; tarotOpen[id] = true;
  renderTarot($('#main-content'));
  injectUpdateBadge($('#main-content'), 'tarot');
  setTimeout(function () { var el = document.getElementById('tr-c-' + id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 90);
}

/* ---------- 系统课程 ---------- */
function renderTarotCourse() {
  var ss = mwStageState('tar', TAROT_STAGES, TAROT_COURSE);
  var cur = ss.filter(function (s) { return s.stage.id === tarotStage; })[0] || ss[0];
  var done = mwDoneMap('tar');
  var notes = loadData('tar_notes', {});

  var html = '<div class="mw-stage-tabs">' + ss.map(function (s) {
    return '<button class="mw-stage-tab ' + (s.stage.id === cur.stage.id ? 'active' : '') + ' ' + (s.unlocked ? '' : 'locked') + '" onclick="switchTarotStage(\'' + s.stage.id + '\')">' +
      '<i class="fas ' + s.stage.icon + '"></i> ' + escapeHtml(s.stage.label) +
      '<em>' + s.done + '/' + s.total + (s.unlocked ? '' : ' 🔒') + '</em></button>';
  }).join('') + '</div>';

  html += '<div class="mw-stage-desc"><i class="fas ' + cur.stage.icon + '"></i><div><b>' + escapeHtml(cur.stage.label) + '</b>' +
    '<p>' + escapeHtml(cur.stage.intro) + '</p><p class="mw-goal">🎯 ' + escapeHtml(cur.stage.goal) + '</p>' +
    (cur.unlocked ? '' : '<p class="mw-lockmsg">🔒 ' + escapeHtml(cur.reason) + '</p>') + '</div></div>';

  if (!cur.unlocked) {
    html += '<div class="mw-empty">这一阶段还没开放。把上一阶段的课再学几节，或等几天，它会自动解锁 ✨</div>';
    return html;
  }

  html += '<div class="mw-lessons">' + cur.list.map(function (c) {
    var isDone = !!done[c.id];
    return '<div class="mw-lesson ' + (isDone ? 'done' : '') + '" id="tr-c-' + c.id + '">' +
      '<div class="mw-lesson-h" onclick="toggleTarotCourse(\'' + c.id + '\')">' +
        '<span class="mw-no">' + (c.order || 0) + '</span>' +
        '<div class="mw-lesson-t"><h3>' + escapeHtml(c.title) + '</h3><p>' + escapeHtml(c.goal) + '</p></div>' +
        '<span class="mw-min">' + (c.minutes || 10) + '′</span>' +
        (isDone ? '<span class="mw-done-b">✓ 已学完</span>' : '') +
        '<i class="fas fa-chevron-down mw-chev"></i></div>' +
      (tarotOpen[c.id] ? renderTarotLessonBody(c, notes[c.id] || '', isDone) : '') +
    '</div>';
  }).join('') + '</div>';
  return html;
}

function renderTarotLessonBody(c, nt, isDone) {
  var qs = loadData('tar_quiz', {});
  var picked = qs[c.id] || {};
  return '<div class="mw-lesson-b">' +
    (c.body || []).map(function (b) {
      return (b.h ? '<h4 class="mw-b-h">' + escapeHtml(b.h) + '</h4>' : '') + '<p>' + escapeHtml(b.p) + '</p>';
    }).join('') +
    ((c.points || []).length ? '<div class="mw-pts"><div class="mw-pts-l"><i class="fas fa-list"></i> 关键要点</div><ul>' +
      c.points.map(function (p) { return '<li>' + escapeHtml(p) + '</li>'; }).join('') + '</ul></div>' : '') +
    (c.practice ? '<div class="mw-prac"><div class="mw-prac-l"><i class="fas fa-running"></i> 今日练习</div><p>' + escapeHtml(c.practice.q) + '</p>' +
      (c.practice.tips ? '<div class="mw-tip">💡 ' + escapeHtml(c.practice.tips) + '</div>' : '') + '</div>' : '') +
    ((c.quiz || []).length ? '<div class="mw-quiz"><div class="mw-quiz-l"><i class="fas fa-question-circle"></i> 自检</div>' +
      c.quiz.map(function (q, qi) {
        var p = picked[qi];
        return '<div class="mw-q"><p class="mw-q-t">' + (qi + 1) + '. ' + escapeHtml(q.q) + '</p><div class="mw-q-opts">' +
          q.options.map(function (o, oi) {
            var cls = '';
            if (p !== undefined) { if (oi === q.answer) cls = ' right'; else if (oi === p) cls = ' wrong'; }
            return '<button class="mw-q-o' + cls + '" onclick="trAnswer(\'' + c.id + '\',' + qi + ',' + oi + ')">' + escapeHtml(o) + '</button>';
          }).join('') + '</div>' +
          (p !== undefined ? '<div class="mw-q-why">' + (p === q.answer ? '✅ 答对了。' : '❌ 再想想。') + escapeHtml(q.why) + '</div>' : '') + '</div>';
      }).join('') + '</div>' : '') +
    '<div class="mw-note"><div class="mw-note-l"><i class="fas fa-pen-nib"></i> 我的笔记（写完自动保存）</div>' +
      '<textarea class="mw-note-i" placeholder="这一课你记住了什么？" oninput="trSave(\'tar_notes\',\'' + c.id + '\',this.value)">' + escapeHtml(nt) + '</textarea></div>' +
    '<div class="mw-actions">' +
      '<button class="mw-btn ' + (isDone ? 'ghost' : 'primary') + '" onclick="trToggleDone(\'' + c.id + '\')">' +
        (isDone ? '↩ 取消「已学完」' : '✓ 标记学完，推进下一阶段') +
      '</button>' +
      (((c.keywords || []).length) ? ('<div class="mw-kws">' + c.keywords.map(function (k) { return '<i>' + escapeHtml(k) + '</i>'; }).join('') + '</div>') : '') +
    '</div></div>';
}
function trSave(ns, k, v) { var m = loadData(ns, {}); if (v && v.trim()) m[k] = v; else delete m[k]; saveData(ns, m); }
function toggleTarotCourse(id, force) { tarotOpen[id] = force ? true : !tarotOpen[id]; renderTarotBody(); }
function trToggleDone(id) {
  var m = mwDoneMap('tar');
  if (m[id]) { delete m[id]; showToast('已取消标记'); }
  else { m[id] = Date.now(); showToast('✓ 学完一课，进度已推进'); }
  saveData('tar_done', m);
  renderTarot($('#main-content'));
  injectUpdateBadge($('#main-content'), 'tarot');
}
function trAnswer(cid, qi, oi) { var q = loadData('tar_quiz', {}); q[cid] = q[cid] || {}; q[cid][qi] = oi; saveData('tar_quiz', q); renderTarotBody(); }

/* ---------- 78 张牌库 ---------- */
function trSetArcana(a) { tarotArcana = a; tarotSuit = 'all'; renderTarotBody(); }
function trSetSuit(s) { tarotSuit = s; renderTarotBody(); }
function trSearch(v) { tarotKw = v; renderTarotBody(); }

function renderTarotCards() {
  var fav = trFavs();
  var kw = (tarotKw || '').trim();
  var list = TAROT_CARDS.filter(function (c) {
    if (tarotArcana !== 'all' && c.arcana !== tarotArcana) return false;
    if (tarotArcana === 'minor' && tarotSuit !== 'all' && c.suit !== tarotSuit) return false;
    if (kw) {
      var hay = c.name + c.en + (c.kw || []).join('') + c.upright + c.reversed;
      if (hay.toLowerCase().indexOf(kw.toLowerCase()) < 0) return false;
    }
    return true;
  });
  var suits = [['all', '全部'], ['wands', '权杖 · 火'], ['cups', '圣杯 · 水'], ['swords', '宝剑 · 风'], ['pentacles', '星币 · 土']];
  return '<div class="mw-intro"><i class="fas fa-layer-group"></i> 共 78 张。点开看完整牌义——正位、逆位、画面象征、生活化用法、组合提示。</div>' +
    '<input class="mw-search" placeholder="搜索牌名 / 关键词，如：愚者、抉择、The Fool" value="' + escapeHtml(tarotKw) + '" oninput="trSearch(this.value)">' +
    '<div class="mw-chips">' +
      '<button class="mw-chip ' + (tarotArcana === 'all' ? 'on' : '') + '" onclick="trSetArcana(\'all\')">全部 78</button>' +
      '<button class="mw-chip ' + (tarotArcana === 'major' ? 'on' : '') + '" onclick="trSetArcana(\'major\')">大阿卡纳 22</button>' +
      '<button class="mw-chip ' + (tarotArcana === 'minor' ? 'on' : '') + '" onclick="trSetArcana(\'minor\')">小阿卡纳 56</button>' +
      (tarotArcana === 'minor' ? suits.map(function (s) {
        return '<button class="mw-chip ' + (tarotSuit === s[0] ? 'on' : '') + '" onclick="trSetSuit(\'' + s[0] + '\')">' + s[1] + '</button>';
      }).join('') : '') +
    '</div>' +
    '<div class="mw-cards-grid">' + list.map(function (cd) {
      return '<div class="mw-card-tile" onclick="trOpenCard(\'' + cd.id + '\')">' +
        '<div class="mw-tile-h"><b>' + escapeHtml(cd.name) + '</b>' +
          (fav[cd.id] ? '<span class="mw-star">★</span>' : '') + '</div>' +
        '<em>' + escapeHtml(cd.en) + (cd.num !== '' && cd.num != null ? ' · ' + cd.num : '') + '</em>' +
        '<div class="mw-tile-kw">' + (cd.kw || []).slice(0, 3).map(function (k) { return '<i>' + escapeHtml(k) + '</i>'; }).join('') + '</div>' +
        '<p>' + escapeHtml(String(cd.upright).slice(0, 56)) + '…</p>' +
      '</div>';
    }).join('') + '</div>' +
    (list.length === 0 ? '<div class="mw-empty">没有匹配的牌</div>' : '');
}

function trOpenCard(id) {
  var cd = TAROT_CARDS.filter(function (x) { return x.id === id; })[0];
  if (!cd) return;
  var m = document.getElementById('zoom-modal');
  if (!m) return;
  var fav = trFavs();
  m.querySelector('.zoom-modal-title').innerHTML = escapeHtml(cd.name) + '　' + escapeHtml(cd.en) +
    (cd.num !== '' && cd.num != null ? '（' + cd.num + '）' : '') +
    ' <button class="mw-btn ghost sm" onclick="trToggleFav(\'' + cd.id + '\');trOpenCard(\'' + cd.id + '\')">' +
    (fav[cd.id] ? '★ 已收藏' : '☆ 收藏') + '</button>';
  m.querySelector('.zoom-modal-body').innerHTML =
    '<div class="mw-gua-detail">' +
      '<div class="mw-gd-row"><b>属性</b><span>' + (cd.arcana === 'major' ? '大阿卡纳' : '小阿卡纳 · ' + suitName(cd.suit)) +
        (cd.element ? ' · ' + escapeHtml(cd.element) : '') + (cd.planet ? ' · ' + escapeHtml(cd.planet) : '') + '</span></div>' +
      '<div class="mw-gd-kw">' + (cd.kw || []).map(function (k) { return '<i>' + escapeHtml(k) + '</i>'; }).join('') + '</div>' +
      '<div class="mw-gd-sec"><b>正位</b><p>' + escapeHtml(cd.upright) + '</p></div>' +
      '<div class="mw-gd-sec rev"><b>逆位</b><p>' + escapeHtml(cd.reversed) + '</p></div>' +
      '<div class="mw-gd-sec"><b>画面象征</b><p>' + escapeHtml(cd.symbol) + '</p></div>' +
      '<div class="mw-gd-sec"><b>生活化用法</b><p>' + escapeHtml(cd.life) + '</p></div>' +
      '<div class="mw-gd-sec"><b>组合提示</b><p>' + escapeHtml(cd.pair) + '</p></div>' +
    '</div>';
  m.style.display = 'flex';
}
function suitName(s) {
  return { wands: '权杖（火）', cups: '圣杯（水）', swords: '宝剑（风）', pentacles: '星币（土）' }[s] || s || '';
}

/* ---------- 抽牌解读 ---------- */
function trPickSpread(id) {
  var sp = TAROT_SPREADS.filter(function (x) { return x.id === id; })[0];
  if (!sp) return;
  var pool = TAROT_CARDS.slice();
  var n = Math.min(sp.cards, pool.length);
  var picked = [];
  for (var i = 0; i < n; i++) {
    var idx = Math.floor(Math.random() * pool.length);
    picked.push({ card: pool[idx], rev: Math.random() < 0.35 });
    pool.splice(idx, 1);
  }
  tarotDraw = { spreadId: sp.id, cards: picked, at: Date.now() };
  saveData('tarot_lastdraw', tarotDraw);
  renderTarotBody();
}
function renderTarotDraw() {
  if (!tarotDraw) tarotDraw = loadData('tarot_lastdraw', null);
  var html = '<div class="mw-intro"><i class="fas fa-hand-sparkles"></i> 选一个牌阵，系统会随机抽牌（含正逆位）。' +
    '抽完后照着「位置 → 牌义 → ��成一句话」的顺序读，你会发现解读没有想象中难。</div>' +
    '<div class="mw-chips">' + TAROT_SPREADS.map(function (s) {
      return '<button class="mw-chip ' + (tarotDraw && tarotDraw.spreadId === s.id ? 'on' : '') + '" onclick="trPickSpread(\'' + s.id + '\')">' +
        escapeHtml(s.name) + '（' + s.cards + '张）</button>';
    }).join('') + '</div>';
  if (!tarotDraw) {
    html += '<div class="mw-empty">选一个牌阵开始抽牌 ✨</div>';
    return html;
  }
  var sp = TAROT_SPREADS.filter(function (x) { return x.id === tarotDraw.spreadId; })[0];
  html += '<div class="mw-draw-head"><b>' + escapeHtml(sp.name) + '</b><span>' + escapeHtml(sp.use) + '</span>' +
    '<button class="mw-btn ghost sm" onclick="trPickSpread(\'' + sp.id + '\')">🎲 重新抽</button></div>';
  html += '<div class="mw-draw-grid">' + tarotDraw.cards.map(function (d, i) {
    var pos = (sp.positions && sp.positions[i]) ? sp.positions[i] : ('第 ' + (i + 1) + ' 张');
    return '<div class="mw-draw-card ' + (d.rev ? 'rev' : '') + '" onclick="trOpenCard(\'' + d.card.id + '\')">' +
      '<div class="mw-dc-pos">' + escapeHtml(pos) + '</div>' +
      '<div class="mw-dc-name"><b>' + escapeHtml(d.card.name) + '</b>' +
        '<span class="mw-dc-rev">' + (d.rev ? '逆位' : '正位') + '</span></div>' +
      '<p>' + escapeHtml(String(d.rev ? d.card.reversed : d.card.upright).slice(0, 120)) + '…</p>' +
      '<div class="mw-dc-more">点击查看完整牌义</div></div>';
  }).join('') + '</div>';
  html += '<div class="mw-card"><div class="mw-sec-t"><i class="fas fa-list-ol"></i> 怎么读这一组</div>' +
    '<ol class="mw-tool-s">' + (sp.steps || []).map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ol>' +
    (sp.example ? '<div class="mw-tip"><b>示例：</b>' + escapeHtml(sp.example) + '</div>' : '') +
    (sp.caution ? '<div class="mw-warn sm">⚠ ' + escapeHtml(sp.caution) + '</div>' : '') + '</div>';
  html += '<div class="mw-card mw-warn sm"><i class="fas fa-exclamation-triangle"></i> 塔罗是自我觉察与决策辅助工具，不替代专业医疗 / 法律 / 金融建议。</div>';
  return html;
}

/* ---------- 牌阵 ---------- */
function renderTarotSpread() {
  return '<div class="mw-intro"><i class="fas fa-th-large"></i> 牌阵决定"牌放在什么位置上说话"。' +
    '新手先用单张和三张，熟练后再上凯尔特十字。</div>' +
    '<div class="mw-spreads">' + TAROT_SPREADS.map(function (s) {
      return '<div class="mw-spread"><div class="mw-spread-h"><b>' + escapeHtml(s.name) + '</b>' +
        '<span class="mw-spread-n">' + s.cards + ' 张</span><span class="mw-spread-lv">' + escapeHtml(s.level) + '</span></div>' +
        '<div class="mw-sec-t sm">位置</div><ol class="mw-tool-s">' +
          (s.positions || []).map(function (p) { return '<li>' + escapeHtml(p) + '</li>'; }).join('') + '</ol>' +
        '<div class="mw-spread-u">' + escapeHtml(s.use) + '</div>' +
        '<div class="mw-sec-t sm">步骤</div><ol class="mw-tool-s">' +
          (s.steps || []).map(function (p) { return '<li>' + escapeHtml(p) + '</li>'; }).join('') + '</ol>' +
        (s.example ? '<div class="mw-tip"><b>示例：</b>' + escapeHtml(s.example) + '</div>' : '') +
        (s.caution ? '<div class="mw-warn sm">⚠ ' + escapeHtml(s.caution) + '</div>' : '') +
        '<button class="mw-btn primary sm" onclick="switchTarotTab(\'draw\');setTimeout(function(){trPickSpread(\'' + s.id + '\')},60)">用这个牌阵抽牌</button>' +
      '</div>';
    }).join('') + '</div>';
}

/* ---------- 技巧 / 组合 / 收藏 ---------- */
function renderTarotSkill() {
  var cats = {};
  TAROT_SKILLS.forEach(function (s) { (cats[s.cat] = cats[s.cat] || []).push(s); });
  return '<div class="mw-intro"><i class="fas fa-lightbulb"></i> 这些是真正拉开"会看牌"和"会解读"差距的东西。</div>' +
    Object.keys(cats).map(function (k) {
      return '<div class="mw-sec-t"><i class="fas fa-tag"></i> ' + escapeHtml(k) + '</div>' +
        '<div class="mw-skills">' + cats[k].map(function (s) {
          return '<div class="mw-skill"><b>' + escapeHtml(s.t) + '</b><p>' + escapeHtml(s.d) + '</p>' +
            (s.why ? '<div class="mw-tip">💡 ' + escapeHtml(s.why) + '</div>' : '') + '</div>';
        }).join('') + '</div>';
    }).join('');
}

function renderTarotCombo() {
  var nameOf = function (id) { var c = TAROT_CARDS.filter(function (x) { return x.id === id; })[0]; return c ? c.name : id; };
  return '<div class="mw-intro"><i class="fas fa-link"></i> 牌从来不是单独说话的，两张牌放一起会出现第三种意思。</div>' +
    '<div class="mw-combos">' + TAROT_COMBOS.map(function (cb) {
      return '<div class="mw-combo"><div class="mw-combo-h"><b>' + escapeHtml(nameOf(cb.a)) + '</b> + <b>' + escapeHtml(nameOf(cb.b)) + '</b></div>' +
        '<p>' + escapeHtml(cb.text) + '</p></div>';
    }).join('') + '</div>';
}

function renderTarotFav() {
  var fav = trFavs();
  var ks = Object.keys(fav);
  var notes = loadData('tar_notes', {});
  var nk = Object.keys(notes).filter(function (k) { return (notes[k] || '').trim(); });
  var html = '<div class="mw-stats">' +
    '<div class="mw-stat"><b>' + Object.keys(mwDoneMap('tar')).length + '</b><span>已学完课程</span></div>' +
    '<div class="mw-stat"><b>' + TAROT_COURSE.length + '</b><span>课程总数</span></div>' +
    '<div class="mw-stat"><b>' + ks.length + '</b><span>收藏的牌</span></div>' +
    '<div class="mw-stat"><b>' + nk.length + '</b><span>学习笔记</span></div></div>';
  html += '<div class="mw-sec-t"><i class="fas fa-star"></i> 我收藏的牌（' + ks.length + '）</div>';
  html += ks.length ? '<div class="mw-cards-grid">' + ks.map(function (id) {
    var cd = TAROT_CARDS.filter(function (x) { return x.id === id; })[0];
    if (!cd) return '';
    return '<div class="mw-card-tile" onclick="trOpenCard(\'' + cd.id + '\')">' +
      '<div class="mw-tile-h"><b>' + escapeHtml(cd.name) + '</b><span class="mw-star">★</span></div>' +
      '<em>' + escapeHtml(cd.en) + '</em>' +
      '<p>' + escapeHtml(String(cd.upright).slice(0, 60)) + '…</p></div>';
  }).join('') + '</div>' : '<div class="mw-empty">还没有收藏。在牌库里点开一张牌可以收藏它。</div>';
  html += '<div class="mw-sec-t"><i class="fas fa-pen-nib"></i> 学习笔记（' + nk.length + '）</div>';
  html += nk.length ? '<div class="mw-note-list">' + nk.map(function (k) {
    var c = TAROT_COURSE.filter(function (x) { return x.id === k; })[0];
    return '<div class="mw-note-item"><div class="mw-note-h">' + (c ? escapeHtml(c.title) : k) + '</div>' +
      '<p>' + escapeHtml(notes[k]) + '</p></div>';
  }).join('') + '</div>' : '<div class="mw-empty">还没有笔记。</div>';
  return html;
}
