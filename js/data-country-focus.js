/* ============================================================
   国情与世界 · 本周聚焦（序列化体系）
   ------------------------------------------------------------
   设计目标：把零散的卡片 / 路径 / 框架，串成一条"每周一个不同
   聚焦点"的进阶路线。打开国情与世界板块，顶部永远显示"本周该
   读哪一条"，并累计"体系进度"，让学习从随机刷卡片变成按地图
   推进——每次只聚焦一点，数周之后自然长出一套体系。

   轮换逻辑：自 2026-01-05（周一）起按自然周取模，自动滚动，
   无需人工维护；每周日 21 点后（与杂学开眼错峰）进入新一站。
   每条 station 可指向：
     · 卡片：part + dim + entryId（点击直接展开该卡）
     · 路径：view:'tracks' + entryId = track DOM id
     · 框架：view:'frameworks' + entryId = framework DOM id
   ============================================================ */

const COUNTRY_FOCUS = [
  {
    title: '家底：我们手里最硬的牌（资源禀赋）',
    part: 'china', dim: 'resource', entryId: 'dc-rare',
    hook: '一切认知从"家底"开始。看懂稀土"资源+冶炼+磁体"全产业链控制，也看清氦气贫乏、耕地淡水紧张的另一面。',
    why: '体系化第一步：先分清"有什么、缺什么、消耗多快"，后续所有战略才有锚点。'
  },
  {
    title: '放大器：地理与人口如何被放大',
    part: 'china', dim: 'geo', entryId: '',
    hook: '资源要变成国力，靠地理与人口的"放大器"——大市场摊薄成本、工程师红利提供人力。',
    why: '理解"条件 × 制度 × 技术"如何把家底放大或约束，避免把禀赋当宿命。'
  },
  {
    title: '引擎：钱花在哪，未来就在哪（科研投入）',
    part: 'china', dim: 'assess', entryId: 'dc-rd',
    hook: '2024 年 R&D 3.63 万亿、强度 2.69%，企业占 77.7%——但基础研究仅 6.88%。',
    why: '看投入不只看总量，更看结构：应用强、源头弱，这正是"卡脖子"的底层原因。'
  },
  {
    title: '底盘：全球最完整的制造业体系',
    part: 'china', dim: 'industry', entryId: '',
    hook: '41 个工业大类全覆盖、制造业增加值多年世界第一——一项新产品能在"隔壁车间"找到上下游。',
    why: '"全"是补课的本钱，"尖"才是竞争力；看懂完整度与高端控制力的两张牌。'
  },
  {
    title: '指向：十五五把资源压注到哪几条赛道',
    part: 'china', dim: 'assess', entryId: 'dc-fyp15',
    hook: '六大新兴支柱 + 六大未来产业；"人工智能+"十五五末目标规模 10 万亿+。',
    why: '规划=国家版资产配置。看懂压注清单，就看懂未来 5—10 年最密集的机会与岗位。'
  },
  {
    title: '节奏：用时间轴对抗短期噪音',
    part: 'china', dim: 'assess', entryId: 'dc-timeline',
    hook: '把布局拆成 1—3 年（落地）/ 3—5 年（成势）/ 5 年以上（定局）。',
    why: '同一件事放在 1 年与 10 年尺度下结论常相反；时间轴是宏观判断的坐标系。'
  },
  {
    title: '清醒：优势与劣势的两端',
    part: 'china', dim: 'assess', entryId: 'dc-swl',
    hook: '优势在"体系与规模"，劣势在"源头与尖端的少数关键环节"（芯片/EDA/光刻机/工业软件）。',
    why: '关键判断：短板集中在"少数但致命"的节点。认清两端，才不被自信或焦虑任一边带偏。'
  },
  {
    title: '世界真相：资源地理极度不均',
    part: 'world', dim: 'resource', entryId: 'dw-possess',
    hook: '刚果钴约 70%、中东油气、俄化肥钯、南非铂族、日本精密材料——关键资源高度集中。',
    why: '分布是起点，能不能变成产业与规则才是关键；不均本身就是权力的来源。'
  },
  {
    title: '美国的"体系化持有"：不靠一种矿',
    part: 'world', dim: 'resource', entryId: 'dw-possess',
    hook: '美元+美债、芯片设计与标准、页岩油气、创新生态、氦储备——用规则锁定价值链高端。',
    why: '两层资源观：实物稀缺 ≠ 体系稀缺，后者更不可逆，也解释了博弈为何延伸到支付与标准。'
  },
  {
    title: '重构：产业链为什么在"搬家"',
    part: 'world', dim: 'strategy', entryId: 'dw-global',
    hook: '效率优先的全球化转向"安全+效率"并重：近岸、友岸外包、关键矿产战略化。',
    why: '搬家不是因为别处更便宜，而是"不能只押一个地方"；看懂动机才看得到趋势。'
  },
  {
    title: '大国出招：主要经济体的战略组合',
    part: 'world', dim: 'strategy', entryId: 'dw-global',
    hook: '美国：芯片/通胀削减法 + 出口管制；欧盟：绿色协议+碳边境(CBAM)+数字主权。',
    why: '大国竞争 = 产业政策 + 联盟 + 规则制定权；看组合，别只看单一政策。'
  },
  {
    title: '主线串联：一条线看懂中国',
    part: 'china', dim: 'assess', entryId: 'track-china-main', view: 'tracks',
    hook: '把"资源→地理→科技→产业→规划→战略→优劣势"串成一条因果链，建议按顺序读。',
    why: '读懂一条线，胜过刷十张卡片；零散知识只有在主线里才长成体系。'
  },
  {
    title: '视角训练：三视角 + 战略三角',
    part: 'china', dim: 'assess', entryId: 'fw-triangle', view: 'frameworks',
    hook: '对任何议题各写一句：宏观 / 国家 / 人民；并用"资源—能力—意愿"三角拆力量。',
    why: '防偏见的护栏。只用一个视角，结论必然偏；两套透镜让判断立体起来。'
  },
  {
    title: '长期主义：时间轴透镜',
    part: 'china', dim: 'assess', entryId: 'fw-cycle', view: 'frameworks',
    hook: '把事件放进 1—3 年/3—5 年/5 年以上；短期波动多是长期趋势的噪音。',
    why: '看新闻先问"这是噪声还是趋势"。这套透镜能让你在喧嚣里稳住节奏。'
  },
  {
    title: '最新动态：把规划翻译成"机会地图"',
    part: 'china', dim: 'trend', entryId: 'auto-cn-trend-20260927',
    hook: '把十五五六大赛道翻译成普通人能用的"机会地图"：岗位、技能、资产与风险。',
    why: '宏观最终要落回生活。学会把国家战略读成个人选项，才算真正读懂国情。'
  }
];

/* 自 2026-01-05（周一）起按自然周滚动 */
const COUNTRY_FOCUS_EPOCH = Date.UTC(2026, 0, 5);
function countryFocusWeekIndex(now) {
  const t = (now || new Date()).getTime();
  return Math.floor((t - COUNTRY_FOCUS_EPOCH) / 604800000);
}
function currentFocusStation() {
  const len = COUNTRY_FOCUS.length;
  const i = ((countryFocusWeekIndex() % len) + len) % len;
  return { station: COUNTRY_FOCUS[i], index: i };
}
