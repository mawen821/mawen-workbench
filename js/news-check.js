/* ============================================================
   每日大事件 · 我的想法 自动校正引擎（纯本地、离线、无需联网）
   ------------------------------------------------------------
   作用：你写完一段批注后，它帮你做三件事
     ① 贴合度打分：你的想法覆盖了多少这条新闻的关键信息
     ② 抓得准：列出你说中了的要点
     ③ 还差什么：列出没覆盖的分析维度，并给出可补充的具体方向
   实现：本地关键词抽取 + 六维分析框架匹配，不依赖任何在线接口。
   ============================================================ */

/* ---------- 中文关键词抽取 ---------- */
var NC_STOP = ('的 了 是 在 和 与 对 为 将 也 等 中 从 到 被 把 而 及 或 其 这 那 之 以 并 就 都 更 最 很 ' +
  '一个 我们 他们 可以 表示 指出 认为 强调 要求 显示 相关 进行 通过 目前 近日 当天 日前 同时 此外 ' +
  '一是 二是 三是 方面 工作 国家 有关 此次 此次 本次 该 该地 各地 全国 全球 本次 亿 万 个 家 项 条 ' +
  '年 月 日 号 点 分 上午 下午 晚间 消息 报道 记者 编辑 来源 新华 央视 人民 网 ').split(/\s+/);

function ncClean(t) {
  return String(t || '').replace(/[“”"'\'（）()《》〈〉【】\[\]，。、；：！？\n\r\t 0-9a-zA-Z·—\-]/g, ' ');
}

/* 从新闻里抽关键术语（2~4 字，按 频次 × 长度 排序） */
function ncTerms(n) {
  var text = ncClean([n.title, n.summary, n.meaning, (n.expert && n.expert.view) || '', n.detail].join(' '));
  var runs = text.split(/[^一-龥]+/).filter(function (s) { return s.length >= 2; });
  var freq = {};
  runs.forEach(function (run) {
    for (var len = 2; len <= 4; len++) {
      for (var i = 0; i + len <= run.length; i++) {
        var w = run.substr(i, len);
        freq[w] = (freq[w] || 0) + 1;
      }
    }
  });
  var stop = {};
  NC_STOP.forEach(function (s) { stop[s] = 1; });
  var list = [];
  Object.keys(freq).forEach(function (w) {
    if (stop[w]) return;
    if (freq[w] < 2) return;
    list.push({ w: w, s: freq[w] * w.length });
  });
  // 去掉被更长词完全包含且分数更低的短词
  list.sort(function (a, b) { return b.s - a.s; });
  var keep = [];
  list.forEach(function (it) {
    var covered = keep.some(function (k) { return k.w.indexOf(it.w) >= 0 && k.s >= it.s; });
    if (!covered) keep.push(it);
  });
  return keep.slice(0, 18).map(function (k) { return k.w; });
}

/* 新闻自带要点（最该被提到的内容） */
function ncKeyPoints(n) {
  var pts = [];
  if (n.points && n.points.length) pts = pts.concat(n.points);
  if (n.meaning) pts.push(n.meaning);
  if (n.expert && n.expert.view) pts.push(n.expert.view);
  if (!pts.length && n.summary) pts.push(n.summary);
  return pts.slice(0, 6).map(function (s) { return String(s).replace(/\s+/g, ' ').trim(); });
}

/* ---------- 六维分析框架 ---------- */
var NC_DIMS = [
  { id: 'fact',    label: '事实复述', w: 14, tip: '先用一句话说清"发生了什么"，别上来就下判断。',
    kw: ['发生', '宣布', '发布', '表示', '出台', '召开', '签署', '启动', '落地', '通过', '实施', '下调', '上调', '增长', '下降'] },
  { id: 'cause',   label: '原因分析', w: 20, tip: '追问一句"为什么会这样"——背景、动因、底层逻辑是什么。',
    kw: ['因为', '由于', '原因', '背景', '根源', '导致', '背后', '底层', '动因', '出于', '为了', '源于', '本质是'] },
  { id: 'effect',  label: '影响判断', w: 20, tip: '谁会受影响？行业、普通人、市场分别是什么反应。',
    kw: ['影响', '意味着', '后果', '冲击', '利好', '利空', '带动', '风险', '机会', '受益', '承压', '利好于', '传导', '拉动', '提振'] },
  { id: 'trend',   label: '趋势展望', w: 16, tip: '往后看：接下来会怎么走，还有哪些变量。',
    kw: ['未来', '下一步', '长期', '短期', '接下来', '趋势', '之后', '今后', '走向', '预计', '有望', '后续', '随着'] },
  { id: 'doubt',   label: '反面质疑', w: 14, tip: '反过来想：哪些地方还不确定、存在风险或被忽略。',
    kw: ['但是', '然而', '不过', '隐忧', '问题', '不足', '挑战', '反过来看', '值得警惕', '不确定性', '存疑', '未必', '未必能', '隐患'] },
  { id: 'self',    label: '个人关联', w: 16, tip: '落到自己：这件事跟你有什么关系，你要不要做个动作。',
    kw: ['我', '我们', '自己', '对我', '身边', '我的', '工作', '生活', '收入', '消费', '花钱', '买', '打算', '应该', '需要', '建议', '我该'] }
];

/* ---------- 主函数：校正一段想法 ---------- */
function ncCheck(n, note) {
  var text = String(note || '').trim();
  if (!text) return null;
  var terms = ncTerms(n);
  var pts = ncKeyPoints(n);

  // 1) 命中术语
  var hit = [], miss = [];
  terms.forEach(function (t) { (text.indexOf(t) >= 0 ? hit : miss).push(t); });

  // 2) 六维覆盖
  var dims = NC_DIMS.map(function (d) {
    var ok = d.kw.some(function (k) { return text.indexOf(k) >= 0; });
    return { id: d.id, label: d.label, w: d.w, tip: d.tip, ok: ok };
  });
  var dimScore = 0, dimTotal = 0;
  dims.forEach(function (d) { dimTotal += d.w; if (d.ok) dimScore += d.w; });

  // 3) 要点覆盖（每条要点取 2~4 字碎片去比对，命中率粗算）
  var ptHit = [], ptMiss = [];
  pts.forEach(function (p) {
    var frag = ncClean(p).split(/[^一-龥]+/).filter(function (s) { return s.length >= 2; });
    var c = 0;
    frag.forEach(function (f) {
      for (var i = 0; i + 3 <= f.length; i += 3) {
        var w = f.substr(i, 3);
        if (text.indexOf(w) >= 0) { c++; break; }
      }
      if (f.length >= 2 && text.indexOf(f.substr(0, 3)) >= 0) c++;
    });
    if (c >= Math.max(1, Math.ceil(frag.length * 0.25))) ptHit.push(p); else ptMiss.push(p);
  });

  // 4) 长度与结构
  var len = text.replace(/\s/g, '').length;
  var lenScore = len < 10 ? 20 : (len < 30 ? 55 : (len < 80 ? 78 : (len < 200 ? 92 : 100)));

  var termRate = terms.length ? hit.length / terms.length : 0;
  var ptRate = pts.length ? ptHit.length / pts.length : 0;
  var score = Math.round(termRate * 26 + (dimScore / dimTotal) * 46 + ptRate * 16 + (lenScore / 100) * 12);
  score = Math.max(0, Math.min(100, score));

  var level = score >= 80 ? { t: '很到位', c: '#7FB09A' } :
              score >= 62 ? { t: '基本贴合' , c: '#7B9BC4' } :
              score >= 42 ? { t: '还需补充', c: '#D9B36B' } :
                            { t: '偏题或太简略', c: '#C8654D' };

  return {
    score: score, level: level, len: len,
    hit: hit, miss: miss, dims: dims,
    ptHit: ptHit, ptMiss: ptMiss,
    terms: terms, points: pts
  };
}
