/* ============================================================
   东方命理 板块 · 渲染逻辑
   ------------------------------------------------------------
   通用机制：分阶段解锁式成长。
     · 第 1 阶段默认开放
     · 后续阶段：上一阶段完成 ≥60% 即解锁；或自首次进入起每满 7 天自动解锁一级
       （保证"学完就自动更新"，也保证不学也在成长节奏上推进）
     · 每阶段内课程按 order 推进；已学完的课程永远可回看
     · "今日一课"按天轮换：优先从【已解锁未学完】里挑；全学完则转每日池，
       保证学完之后仍有源源不断的内容
   ============================================================ */

/* ---------- 通用：阶段解锁引擎（塔罗板块复用） ---------- */
function mwDayIndex() {
  var EPOCH = Date.UTC(2026, 0, 1);
  return Math.floor((Date.now() - EPOCH) / 86400000);
}
function mwDaysSinceStart(ns) {
  var st = loadData(ns + '_start', 0);
  if (!st) { saveData(ns + '_start', Date.now()); return 0; }
  return Math.floor((Date.now() - st) / 86400000);
}
function mwDoneMap(ns) { return loadData(ns + '_done', {}); }

/* 返回每个阶段的解锁与完成情况 */
function mwStageState(ns, stages, courses) {
  var done = mwDoneMap(ns);
  var startDays = mwDaysSinceStart(ns);
  var out = [];
  for (var i = 0; i < stages.length; i++) {
    var st = stages[i];
    var list = courses.filter(function (c) { return c.stage === st.id; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var d = 0;
    list.forEach(function (c) { if (done[c.id]) d++; });
    var total = list.length;
    var pct = total ? d / total : 0;
    /* 全部阶段一律开放：不再要求"学完上一阶段"才能进入下一阶段。
       顺序只是「建议路径」，进度照常记录，可随时跳读任意课程。 */
    var unlocked = true, reason = '';
    var prev = i > 0 ? out[i - 1] : null;
    if (i === 0) reason = '建议从这里开始';
    else if (prev && prev.pct >= 0.6) reason = '上一阶段已完成 ' + Math.round(prev.pct * 100) + '%，继续推进';
    else reason = '建议先学前一阶段，但也可以直接跳读';
    out.push({ stage: st, list: list, total: total, done: d, pct: pct, unlocked: unlocked, reason: reason, suggested: (i === 0 || (prev && prev.pct >= 0.6)) });
  }
  return out;
}

/* 所有已解锁课程 */
function mwUnlockedCourses(ns, stages, courses) {
  var ss = mwStageState(ns, stages, courses), r = [];
  ss.forEach(function (s) { if (s.unlocked) r = r.concat(s.list); });
  return r;
}

/* 今日一课：优先未学完的已解锁课程；全学完则从每日池轮换 */
function mwTodayLesson(ns, stages, courses, dailyPool) {
  var done = mwDoneMap(ns);
  var un = mwUnlockedCourses(ns, stages, courses).filter(function (c) { return !done[c.id]; });
  var di = mwDayIndex();
  if (un.length) return { kind: 'course', item: un[di % un.length], pending: un.length };
  if (dailyPool && dailyPool.length) return { kind: 'daily', item: dailyPool[di % dailyPool.length], pending: 0 };
  return null;
}

/* ---------- 东方命理 ---------- */
var destinyTab = 'today';
var destinyStage = '';
var destinyOpen = {};
var destinyTouched = false;   // 用户是否手动操作过课程展开
var destinyGuaKw = '';
var destinyGuaArcana = 'all';

function dstSave(ns, k, v) {
  var m = loadData(ns, {});
  if (v && String(v).trim()) m[k] = v; else delete m[k];
  saveData(ns, m);
}

function renderDestiny(c) {
  if (typeof DESTINY_COURSE === 'undefined') {
    c.innerHTML = '<div class="module-content"><div class="empty-state">东方命理数据未加载</div></div>';
    return;
  }
  if (!destinyStage) destinyStage = DESTINY_STAGES[0].id;
  var tabs = [
    { k: 'today', label: '今日', icon: 'fa-sun' },
    { k: 'course', label: '系统课程', icon: 'fa-graduation-cap' },
    { k: 'liuliu', label: '小六壬', icon: 'fa-hand-peace' },
    { k: 'bagua', label: '八卦', icon: 'fa-dharmachakra' },
    { k: 'gua64', label: '六十四卦', icon: 'fa-book' },
    { k: 'tool', label: '起卦工具', icon: 'fa-coins' },
    { k: 'case', label: '实战案例', icon: 'fa-comments' },
    { k: 'note', label: '我的笔记', icon: 'fa-pen-nib' }
  ];
  c.innerHTML =
    '<div class="module-content">' +
      '<div class="module-header"><div>' +
        '<h1><i class="fas fa-yin-yang"></i> 东方命理</h1>' +
        '<div class="subtitle">小六壬 · 易经八卦 · 五行干支 —— 从新手到能实践的系统课（全部课程随时可学，今日内容每日自动更新）</div>' +
      '</div></div>' +
      '<div class="mw-tabs">' +
        tabs.map(function (t) {
          return '<button class="mw-tab ' + (t.k === destinyTab ? 'active' : '') + '" onclick="switchDestinyTab(\'' + t.k + '\')">' +
            '<i class="fas ' + t.icon + '"></i> ' + t.label + '</button>';
        }).join('') +
      '</div>' +
      '<div id="destiny-body"></div>' +
    '</div>';
  renderDestinyBody();
}

function switchDestinyTab(k) {
  destinyTab = k;
  renderDestiny($('#main-content'));
  injectUpdateBadge($('#main-content'), 'destiny');
}
function switchDestinyStage(s) {
  destinyStage = s; destinyOpen = {};
  renderDestiny($('#main-content'));
  injectUpdateBadge($('#main-content'), 'destiny');
}

function renderDestinyBody() {
  var box = $('#destiny-body');
  if (!box) return;
  var f = {
    today: renderDestinyToday, course: renderDestinyCourse, liuliu: renderDestinyLiuliu,
    bagua: renderDestinyBagua, gua64: renderDestinyGua64, tool: renderDestinyTool,
    case: renderDestinyCase, note: renderDestinyNote
  }[destinyTab];
  box.innerHTML = f ? f() : '';
  // 首次进入某阶段、且用户还没手动展开任何课程时，默认展开第一课（用标志位防止递归）
  if (destinyTab === 'course' && !destinyTouched) {
    var first = DESTINY_COURSE.filter(function (x) { return x.stage === destinyStage; })[0];
    if (first) {
      destinyTouched = true;
      destinyOpen[first.id] = true;
      renderDestinyBody();
    }
  }
}

/* ---------- 今日 ---------- */
function renderDestinyToday() {
  var ss = mwStageState('dst', DESTINY_STAGES, DESTINY_COURSE);
  var done = mwDoneMap('dst');
  var totalAll = DESTINY_COURSE.length;
  var doneAll = Object.keys(done).length;
  var t = mwTodayLesson('dst', DESTINY_STAGES, DESTINY_COURSE, DESTINY_DAILY);
  var dayIdx = mwDayIndex();
  var daily = DESTINY_DAILY[dayIdx % DESTINY_DAILY.length];
  var gua = (typeof GUA64 !== 'undefined') ? GUA64[dayIdx % GUA64.length] : null;

  var html = '<div class="mw-hero">' +
    '<div class="mw-hero-l"><div class="mw-hero-t">今日一课</div>' +
    (t && t.kind === 'course'
      ? '<div class="mw-hero-h">' + escapeHtml(t.item.title) + '</div>' +
        '<div class="mw-hero-d">' + escapeHtml(t.item.goal) + '</div>' +
        '<button class="mw-btn primary" onclick="gotoDestinyCourse(\'' + t.item.stage + '\',\'' + t.item.id + '\')"><i class="fas fa-play"></i> 开始这一课</button>' +
        '<div class="mw-hero-x">还有 ' + t.pending + ' 课等你（已解锁未学完）</div>'
      : '<div class="mw-hero-h">' + escapeHtml(t ? t.item.t : '继续精进') + '</div>' +
        '<div class="mw-hero-d">' + escapeHtml(t ? t.item.d : '') + '</div>' +
        '<div class="mw-hero-x">🎉 本阶段课程已全部学完，已切换到每日精进内容，保持手感</div>') +
    '</div>' +
    '<div class="mw-hero-r">' +
      '<div class="mw-ring"><div class="mw-ring-v">' + doneAll + '/' + totalAll + '</div><div class="mw-ring-l">课程进度</div></div>' +
    '</div></div>';

  html += '<div class="mw-sec-t"><i class="fas fa-seedling"></i> 今日一理</div>' +
    '<div class="mw-card mw-daily">' + escapeHtml(daily.d || daily.t) + '</div>';

  if (gua) {
    html += '<div class="mw-sec-t"><i class="fas fa-book"></i> 今日一卦 · ' + escapeHtml(gua.full) + '</div>' +
      '<div class="mw-card mw-gua-today">' +
        '<div class="mw-gua-sym">' + (gua.symbol || '') + '</div>' +
        '<div class="mw-gua-main">' +
          '<div class="mw-gua-meta">上' + escapeHtml(gua.upper) + ' 下' + escapeHtml(gua.lower) + ' · ' + escapeHtml(gua.nature) + ' · ' + escapeHtml(gua.element) + '</div>' +
          '<div class="mw-gua-j">「' + escapeHtml(gua.judgment) + '」</div>' +
          '<p>' + escapeHtml(gua.meaning) + '</p>' +
          '<button class="mw-btn ghost sm" onclick="switchDestinyTab(\'gua64\')">查看六爻与完整解读</button>' +
        '</div></div>';
  }

  html += '<div class="mw-sec-t"><i class="fas fa-route"></i> 学习路径（全部开放，按建议顺序读效果最好）</div><div class="mw-stage-list">';
  ss.forEach(function (s, i) {
    var pctN = Math.round(s.pct * 100);
    html += '<div class="mw-stage ' + (s.suggested ? '' : 'locked') + '" onclick="switchDestinyStage(\'' + s.stage.id + '\')">' +
      '<div class="mw-stage-h"><i class="fas ' + s.stage.icon + '"></i> ' + escapeHtml(s.stage.label) +
        (s.pct >= 1 ? ' <span class="mw-lock">✅</span>' : '') + '</div>' +
      '<div class="mw-stage-bar"><i style="width:' + pctN + '%"></i></div>' +
      '<div class="mw-stage-f"><span>' + s.done + '/' + s.total + ' 课 · ' + pctN + '%</span>' +
        '<span class="mw-stage-r">' + (s.unlocked ? '已开放' : escapeHtml(s.reason)) + '</span></div>' +
      '<p class="mw-stage-intro">' + escapeHtml(s.stage.intro) + '</p>' +
    '</div>';
  });
  html += '</div>';
  return html;
}

function gotoDestinyCourse(stage, id) {
  destinyStage = stage; destinyTab = 'course'; destinyOpen[id] = true;
  renderDestiny($('#main-content'));
  injectUpdateBadge($('#main-content'), 'destiny');
  setTimeout(function () { var el = document.getElementById('dst-c-' + id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 90);
}

/* ---------- 系统课程 ---------- */
function renderDestinyCourse() {
  var ss = mwStageState('dst', DESTINY_STAGES, DESTINY_COURSE);
  var cur = ss.filter(function (s) { return s.stage.id === destinyStage; })[0] || ss[0];
  var done = mwDoneMap('dst');
  var notes = loadData('dst_notes', {});

  var html = '<div class="mw-stage-tabs">' + ss.map(function (s) {
    return '<button class="mw-stage-tab ' + (s.stage.id === cur.stage.id ? 'active' : '') + ' ' + (s.unlocked ? '' : 'locked') + '" onclick="switchDestinyStage(\'' + s.stage.id + '\')">' +
      '<i class="fas ' + s.stage.icon + '"></i> ' + escapeHtml(s.stage.label) +
      '<em>' + s.done + '/' + s.total + (s.unlocked ? '' : ' 🔒') + '</em></button>';
  }).join('') + '</div>';

  html += '<div class="mw-stage-desc"><i class="fas ' + cur.stage.icon + '"></i> <div><b>' + escapeHtml(cur.stage.label) + '</b>' +
    '<p>' + escapeHtml(cur.stage.intro) + '</p><p class="mw-goal">🎯 ' + escapeHtml(cur.stage.goal) + '</p>' +
    (cur.unlocked ? '' : '<p class="mw-lockmsg">🔒 ' + escapeHtml(cur.reason) + '</p>') + '</div></div>';

  if (!cur.unlocked) {
    html += '<div class="mw-empty">这一阶段还没开放。把上一阶段的课再学几节，或等几天，它会自动解锁 ✨</div>';
    return html;
  }

  html += '<div class="mw-lessons">' + cur.list.map(function (c) {
    var isDone = !!done[c.id];
    var open = !!destinyOpen[c.id];
    var nt = notes[c.id] || '';
    return '<div class="mw-lesson ' + (isDone ? 'done' : '') + '" id="dst-c-' + c.id + '">' +
      '<div class="mw-lesson-h" onclick="toggleDestinyCourse(\'' + c.id + '\')">' +
        '<span class="mw-no">' + (c.order || 0) + '</span>' +
        '<div class="mw-lesson-t"><h3>' + escapeHtml(c.title) + '</h3>' +
          '<p>' + escapeHtml(c.goal) + '</p></div>' +
        '<span class="mw-min">' + (c.minutes || 10) + '′</span>' +
        (isDone ? '<span class="mw-done-b">✓ 已学完</span>' : '') +
        '<i class="fas fa-chevron-down mw-chev"></i></div>' +
      (open ? renderDestinyLessonBody(c, nt, isDone) : '') +
    '</div>';
  }).join('') + '</div>';
  return html;
}

function renderDestinyLessonBody(c, nt, isDone) {
  var qs = loadData('dst_quiz', {});
  var picked = qs[c.id] || {};
  return '<div class="mw-lesson-b">' +
    (c.body || []).map(function (b) {
      return (b.h ? '<h4 class="mw-b-h">' + escapeHtml(b.h) + '</h4>' : '') + '<p>' + escapeHtml(b.p) + '</p>';
    }).join('') +
    ((c.points || []).length ? '<div class="mw-pts"><div class="mw-pts-l"><i class="fas fa-list"></i> 关键要点</div><ul>' +
      c.points.map(function (p) { return '<li>' + escapeHtml(p) + '</li>'; }).join('') + '</ul></div>' : '') +
    (c.practice ? '<div class="mw-prac"><div class="mw-prac-l"><i class="fas fa-running"></i> 今日练习</div>' +
      '<p>' + escapeHtml(c.practice.q) + '</p>' + (c.practice.tips ? '<div class="mw-tip">💡 ' + escapeHtml(c.practice.tips) + '</div>' : '') + '</div>' : '') +
    ((c.quiz || []).length ? '<div class="mw-quiz"><div class="mw-quiz-l"><i class="fas fa-question-circle"></i> 自检</div>' +
      c.quiz.map(function (q, qi) {
        var p = picked[qi];
        return '<div class="mw-q"><p class="mw-q-t">' + (qi + 1) + '. ' + escapeHtml(q.q) + '</p>' +
          '<div class="mw-q-opts">' + q.options.map(function (o, oi) {
            var cls = '';
            if (p !== undefined) { if (oi === q.answer) cls = ' right'; else if (oi === p) cls = ' wrong'; }
            return '<button class="mw-q-o' + cls + '" onclick="dstAnswer(\'' + c.id + '\',' + qi + ',' + oi + ')">' + escapeHtml(o) + '</button>';
          }).join('') + '</div>' +
          (p !== undefined ? '<div class="mw-q-why">' + (p === q.answer ? '✅ 答对了。' : '❌ 再想想。') + escapeHtml(q.why) + '</div>' : '') +
        '</div>';
      }).join('') + '</div>' : '') +
    '<div class="mw-note"><div class="mw-note-l"><i class="fas fa-pen-nib"></i> 我的笔记（写完自动保存）</div>' +
      '<textarea class="mw-note-i" placeholder="这一课你记住了什么？想怎么用？" oninput="dstSave(\'dst_notes\',\'' + c.id + '\',this.value)">' + escapeHtml(nt) + '</textarea></div>' +
    '<div class="mw-actions">' +
      '<button class="mw-btn ' + (isDone ? 'ghost' : 'primary') + '" onclick="dstToggleDone(\'' + c.id + '\')">' +
        (isDone ? '↩ 取消「已学完」' : '✓ 标记学完，推进下一阶段') + '</button>' +
    '</div>' +
  '</div>';
}

function toggleDestinyCourse(id, force) {
  destinyOpen[id] = force ? true : !destinyOpen[id];
  renderDestinyBody();
}
function dstToggleDone(id) {
  var m = mwDoneMap('dst');
  if (m[id]) { delete m[id]; showToast('已取消标记'); }
  else { m[id] = Date.now(); showToast('✓ 学完一课，进度已推进'); }
  saveData('dst_done', m);
  renderDestiny($('#main-content'));
  injectUpdateBadge($('#main-content'), 'destiny');
}
function dstAnswer(cid, qi, oi) {
  var q = loadData('dst_quiz', {});
  q[cid] = q[cid] || {}; q[cid][qi] = oi;
  saveData('dst_quiz', q);
  renderDestinyBody();
}

/* ---------- 小六壬 ---------- */
var llForm = { m: '', d: '', h: '' };
function renderDestinyLiuliu() {
  var html = '<div class="mw-intro"><i class="fas fa-hand-peace"></i> 小六壬是最轻最快的掐指占法：不用铜钱不用蓍草，' +
    '按「月上起日、日上起时」掐指一算就能出结果。适合日常小事的即时判断。</div>';

  html += '<div class="mw-card mw-ll-form"><div class="mw-sec-t"><i class="fas fa-calculator"></i> 掐指起课</div>' +
    '<div class="mw-ll-row">' +
      '<div><label>农历月份</label><select onchange="llForm.m=this.value;llCalc()"><option value="">选择</option>' +
      [1,2,3,4,5,6,7,8,9,10,11,12].map(function (i) { return '<option value="' + i + '"' + (llForm.m == i ? ' selected' : '') + '>' + i + ' 月</option>'; }).join('') +
      '</select></div>' +
      '<div><label>农历日期</label><select onchange="llForm.d=this.value;llCalc()"><option value="">选择</option>' +
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(function (i) { return '<option value="' + i + '"' + (llForm.d == i ? ' selected' : '') + '>' + i + ' 日</option>'; }).join('') +
      '</select></div>' +
      '<div><label>时辰</label><select onchange="llForm.h=this.value;llCalc()"><option value="">选择</option>' +
      LIULIU_HOURS.map(function (h, i) { return '<option value="' + i + '"' + (llForm.h === String(i) ? ' selected' : '') + '>' + h.z + '时 ' + h.t + '</option>'; }).join('') +
      '</select></div>' +
    '</div><div id="ll-result"></div></div>';

  html += '<div class="mw-sec-t"><i class="fas fa-list"></i> 六神详解</div><div class="mw-gods">' +
    LIULIU_GODS.map(function (g) {
      return '<div class="mw-god" onclick="llToggle(\'' + g.id + '\')">' +
        '<div class="mw-god-h"><span class="mw-god-e">' + g.emoji + '</span>' +
          '<div><b>' + g.name + '</b><em>' + g.deity + ' · ' + g.element + ' · ' + g.dir + '</em></div>' +
          '<span class="mw-god-j j-' + (g.jixiong.indexOf('吉') === 0 ? 'good' : 'bad') + '">' + g.jixiong + '</span>' +
          '<i class="fas fa-chevron-down"></i></div>' +
        '<div class="mw-god-b" id="god-' + g.id + '" style="display:none">' +
          '<p class="mw-god-short">' + escapeHtml(g.short) + '</p>' +
          '<div class="mw-god-dy">' + escapeHtml(g.duanyu) + '</div>' +
          '<p>' + escapeHtml(g.detail) + '</p>' +
          '<div class="mw-god-how">' + Object.keys(g.how).map(function (k) {
            var kn = { shiwu: '失物', xingren: '行人', bing: '疾病', qiu_cai: '求财', guansi: '官事', juece: '决策' }[k] || k;
            return '<div class="mw-god-hi"><b>' + kn + '</b><span>' + escapeHtml(g.how[k]) + '</span></div>';
          }).join('') + '</div>' +
          '<div class="mw-god-adv">💡 ' + escapeHtml(g.advice) + '</div>' +
          '<div class="mw-god-num">常见数：' + escapeHtml(g.nums) + '</div>' +
        '</div></div>';
    }).join('') + '</div>';
  return html;
}
function llToggle(id) {
  var el = document.getElementById('god-' + id);
  if (el) el.style.display = (el.style.display === 'none' ? 'block' : 'none');
}
function llCalc() {
  var box = document.getElementById('ll-result');
  if (!box) return;
  if (!llForm.m || !llForm.d || llForm.h === '') { box.innerHTML = '<div class="mw-tip">选好农历月、日与时辰，自动出结果。</div>'; return; }
  var m = parseInt(llForm.m, 10), d = parseInt(llForm.d, 10), h = parseInt(llForm.h, 10);
  var seq = LIULIU_GODS.slice().sort(function (a, b) { return a.order - b.order; });
  var i1 = (m - 1) % 6;                 // 正月起大安，顺数到所求月
  var i2 = (i1 + (d - 1)) % 6;          // 月上起初一，顺数到所求日
  var i3 = (i2 + h) % 6;                // 日上起子时，顺数到所求时辰
  var g = seq[i3];
  var gm = seq[i1], gd = seq[i2];
  box.innerHTML = '<div class="mw-ll-out">' +
    '<div class="mw-ll-steps">月起：<b>' + gm.name + '</b> → 日落：<b>' + gd.name + '</b> → 时落：<b class="hl">' + g.name + '</b></div>' +
    '<div class="mw-ll-res"><span class="mw-god-e">' + g.emoji + '</span><div><b>' + g.name + '</b>' +
      '<em>' + g.deity + ' · ' + g.element + ' · ' + g.jixiong + '</em><p>' + escapeHtml(g.short) + '</p></div></div>' +
    '<div class="mw-god-dy">' + escapeHtml(g.duanyu) + '</div>' +
    '<p>' + escapeHtml(g.detail) + '</p>' +
    '<div class="mw-god-how">' + Object.keys(g.how).map(function (k) {
      var kn = { shiwu: '失物', xingren: '行人', bing: '疾病', qiu_cai: '求财', guansi: '官事', juece: '决策' }[k] || k;
      return '<div class="mw-god-hi"><b>' + kn + '</b><span>' + escapeHtml(g.how[k]) + '</span></div>';
    }).join('') + '</div>' +
    '<div class="mw-god-adv">💡 ' + escapeHtml(g.advice) + '</div>' +
  '</div>';
}

/* ---------- 八卦 ---------- */
function renderDestinyBagua() {
  if (typeof BAGUA8 === 'undefined') return '<div class="mw-empty">八卦数据未加载</div>';
  return '<div class="mw-intro"><i class="fas fa-dharmachakra"></i> 八卦是八种「世界的原型状态」。' +
    '学会它，你就有了一套把万事万物归类的思维网格——这是后面起卦断事的地基。</div>' +
    '<div class="mw-bagua-grid">' + BAGUA8.map(function (b) {
      return '<div class="mw-bagua">' +
        '<div class="mw-bagua-sym">' + b.symbol + '</div>' +
        '<div class="mw-bagua-n">' + b.name + '<em>第 ' + b.num + '</em></div>' +
        '<div class="mw-bagua-meta"><span>自然：' + escapeHtml(b.nature) + '</span><span>五行：' + escapeHtml(b.element) + '</span>' +
          '<span>先天：' + escapeHtml(b.xian) + '</span><span>后天：' + escapeHtml(b.hou) + '</span>' +
          '<span>人伦：' + escapeHtml(b.family) + '</span><span>身体：' + escapeHtml(b.body) + '</span></div>' +
        '<div class="mw-bagua-kw">' + (b.kw || []).map(function (k) { return '<i>' + escapeHtml(k) + '</i>'; }).join('') + '</div>' +
        '<p>' + escapeHtml(b.desc) + '</p>' +
        '<div class="mw-bagua-life"><b>生活里遇到它：</b>' + escapeHtml(b.life) + '</div>' +
      '</div>';
    }).join('') + '</div>' +
    '<div class="mw-card"><div class="mw-sec-t"><i class="fas fa-exchange-alt"></i> 五行生克</div>' +
      '<p>' + escapeHtml(WUXING_REL && WUXING_REL.note ? WUXING_REL.note : '') + '</p>' +
      '<div class="mw-wx"><div><b>相生</b>' + WUXING_REL.sheng.map(function (p) { return '<i>' + p[0] + '→' + p[1] + '</i>'; }).join('') + '</div>' +
      '<div><b>相克</b>' + WUXING_REL.ke.map(function (p) { return '<i>' + p[0] + '→' + p[1] + '</i>'; }).join('') + '</div></div>' +
    '</div>';
}

/* ---------- 六十四卦 ---------- */
function dstGuaSearch(v) { destinyGuaKw = v; renderDestinyBody(); }
function renderDestinyGua64() {
  if (typeof GUA64 === 'undefined') return '<div class="mw-empty">六十四卦数据未加载</div>';
  var kw = (destinyGuaKw || '').trim();
  var list = GUA64.filter(function (g) {
    if (!kw) return true;
    return (g.full + g.name + g.nature + g.judgment + (g.kw || []).join('')).indexOf(kw) >= 0;
  });
  return '<div class="mw-intro"><i class="fas fa-book"></i> 六十四卦是《易经》的主体。每一卦是一类人生处境，卦辞是古人给的行动建议。</div>' +
    '<input class="mw-search" placeholder="搜索卦名 / 卦辞 / 关键词，如：乾、困、决策" value="' + escapeHtml(destinyGuaKw) + '" oninput="dstGuaSearch(this.value)">' +
    '<div class="mw-gua-grid">' + list.map(function (g) {
      return '<div class="mw-gua-c" onclick="dstGuaOpen(\'' + g.no + '\')">' +
        '<div class="mw-gua-c-h"><span class="mw-gua-c-s">' + (g.symbol || '') + '</span>' +
          '<div><b>' + g.no + '. ' + escapeHtml(g.full) + '</b><em>上' + escapeHtml(g.upper) + ' 下' + escapeHtml(g.lower) + ' · ' + escapeHtml(g.element) + '</em></div></div>' +
        '<div class="mw-gua-c-j">' + escapeHtml(g.judgment) + '</div>' +
        '<div class="mw-gua-c-kw">' + (g.kw || []).slice(0, 4).map(function (k) { return '<i>' + escapeHtml(k) + '</i>'; }).join('') + '</div>' +
      '</div>';
    }).join('') + '</div>';
}
function dstGuaOpen(no) {
  var g = GUA64.filter(function (x) { return String(x.no) === String(no); })[0];
  if (!g) return;
  var m = document.getElementById('zoom-modal');
  if (!m) return;
  m.querySelector('.zoom-modal-title').innerHTML = g.symbol + '　' + g.no + '. ' + g.full +
    '<em style="font-size:13px;font-weight:400;color:#6E6480;margin-left:8px">上' + g.upper + ' 下' + g.lower + '</em>';
  m.querySelector('.zoom-modal-body').innerHTML =
    '<div class="mw-gua-detail">' +
      '<div class="mw-gd-row"><b>卦辞</b><span>' + escapeHtml(g.judgment) + '</span></div>' +
      '<div class="mw-gd-row"><b>大象传</b><span>' + escapeHtml(g.image) + '</span></div>' +
      '<div class="mw-gd-sec"><b>卦义</b><p>' + escapeHtml(g.meaning) + '</p></div>' +
      '<div class="mw-gd-sec"><b>生活化解读</b><p>' + escapeHtml(g.life) + '</p></div>' +
      '<div class="mw-gd-sec"><b>六爻要点</b><p>' + escapeHtml(g.yao) + '</p></div>' +
      '<div class="mw-gd-sec"><b>提醒</b><p>' + escapeHtml(g.caution) + '</p></div>' +
      '<div class="mw-gd-kw">' + (g.kw || []).map(function (k) { return '<i>' + escapeHtml(k) + '</i>'; }).join('') + '</div>' +
    '</div>';
  m.style.display = 'flex';
}

/* ---------- 起卦工具 ---------- */
function renderDestinyTool() {
  return '<div class="mw-intro"><i class="fas fa-coins"></i> 四种起卦法，按事情的轻重选。小事掐指，大事摇卦。</div>' +
    '<div class="mw-tools">' + DESTINY_TOOLS.map(function (t) {
      return '<div class="mw-tool"><div class="mw-tool-h"><i class="fas ' + t.icon + '"></i> ' + escapeHtml(t.name) + '</div>' +
        '<p class="mw-tool-d">' + escapeHtml(t.desc) + '</p>' +
        '<div class="mw-tool-w"><b>适合</b>' + escapeHtml(t.when) + '</div>' +
        '<ol class="mw-tool-s">' + (t.steps || []).map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ol>' +
      '</div>';
    }).join('') + '</div>' +
    '<div class="mw-card mw-warn"><i class="fas fa-exclamation-triangle"></i> ' +
      '术数是自我觉察与决策辅助的思维工具，<b>不替代</b>专业医疗、法律、金融建议。' +
      '身体不适请就医，合同请找律师，大额投资请做尽调。同一件事一周最多起一卦。' +
    '</div>';
}

/* ---------- 实战案例 ---------- */
function renderDestinyCase() {
  return '<div class="mw-intro"><i class="fas fa-comments"></i> 看别人怎么断，比自己闷头练快得多。' +
    '重点看每个案例最后的「lesson」——那才是能迁移的东西。</div>' +
    '<div class="mw-cases">' + DESTINY_CASES.map(function (cs) {
      return '<div class="mw-case"><div class="mw-case-h"><span class="mw-case-cat">' + escapeHtml(cs.cat) + '</span>' +
        '<b>' + escapeHtml(cs.q) + '</b><em>' + escapeHtml(cs.method) + '</em></div>' +
        '<div class="mw-case-set">' + escapeHtml(cs.setup) + '</div>' +
        '<ol class="mw-case-steps">' + (cs.steps || []).map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ol>' +
        '<div class="mw-case-r"><b>结果</b><span>' + escapeHtml(cs.result) + '</span></div>' +
        '<div class="mw-case-read"><b>怎么读</b><p>' + escapeHtml(cs.read) + '</p></div>' +
        '<div class="mw-case-ans"><b>最后给了什么建议</b><p>' + escapeHtml(cs.answer) + '</p></div>' +
        '<div class="mw-case-lesson"><i class="fas fa-lightbulb"></i> ' + escapeHtml(cs.lesson) + '</div>' +
      '</div>';
    }).join('') + '</div>';
}

/* ---------- 我的笔记 ---------- */
function renderDestinyNote() {
  var notes = loadData('dst_notes', {});
  var done = mwDoneMap('dst');
  var ks = Object.keys(notes).filter(function (k) { return (notes[k] || '').trim(); });
  var ss = mwStageState('dst', DESTINY_STAGES, DESTINY_COURSE);
  var html = '<div class="mw-stats">' +
    '<div class="mw-stat"><b>' + Object.keys(done).length + '</b><span>已学完课程</span></div>' +
    '<div class="mw-stat"><b>' + DESTINY_COURSE.length + '</b><span>课程总数</span></div>' +
    '<div class="mw-stat"><b>' + ks.length + '</b><span>学习笔记</span></div>' +
    '<div class="mw-stat"><b>' + ss.filter(function (s) { return s.unlocked; }).length + '/' + ss.length + '</b><span>已开放阶段</span></div>' +
  '</div>';
  html += '<div class="mw-sec-t"><i class="fas fa-pen-nib"></i> 我的课程笔记（' + ks.length + '）</div>';
  html += ks.length ? '<div class="mw-note-list">' + ks.map(function (k) {
    var c = DESTINY_COURSE.filter(function (x) { return x.id === k; })[0];
    return '<div class="mw-note-item"><div class="mw-note-h">' + (c ? escapeHtml(c.title) : k) +
      '</div><p>' + escapeHtml(notes[k]) + '</p>' +
      (c ? '<button class="mw-btn ghost sm" onclick="gotoDestinyCourse(\'' + c.stage + '\',\'' + c.id + '\')">回到课程</button>' : '') + '</div>';
  }).join('') + '</div>' : '<div class="mw-empty">还没有笔记。在课程里写下你的想法，会汇总在这里。</div>';
  return html;
}
