/* ============================================
   读书板块 - 数据
   三大类：
   1. 搜书：搜索全网图书 + 实时阅读入口
   2. 精选书摘：经典书籍摘抄 / 读书心得 / 经典章节（每周自动更新）
   3. 我的书架：个人读书计划（localStorage，见 app.js）
   ============================================ */

// ===== 1. 搜书引擎（全网图书搜索 + 免费阅读入口） =====
// 顺序即「默认搜索/首选」顺序：国内直连优先——鸠摩搜书(可下)、古诗文网(公版直读)、豆瓣(搜评)、京东/当当(购)，微信读书置后(需登录)
const BOOK_SEARCH_ENGINES = [
  { id: 'jiumo', name: '鸠摩搜书', icon: 'fa-file-pdf', color: '#7b5cff', url: q => `https://www.jiumo.org/#/${encodeURIComponent(q)}` },
  { id: 'gushiwen', name: '古诗文网', icon: 'fa-book', color: '#c0392b', url: q => `https://so.gushiwen.cn/search.aspx?value=${encodeURIComponent(q)}` },
  { id: 'douban', name: '豆瓣读书', icon: 'fa-book-open', color: '#2e963f', url: q => `https://book.douban.com/subject_search?search_text=${encodeURIComponent(q)}` },
  { id: 'jd', name: '京东图书', icon: 'fa-shopping-bag', color: '#e1251b', url: q => `https://search.jd.com/Search?keyword=${encodeURIComponent(q)}` },
  { id: 'dangdang', name: '当当', icon: 'fa-book', color: '#ff6600', url: q => `http://search.dangdang.com/?key=${encodeURIComponent(q)}` },
  { id: 'gutenberg', name: '古登堡(英文)', icon: 'fa-globe', color: '#4285F4', url: q => `https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(q)}` },
  { id: 'weread', name: '微信读书', icon: 'fa-book', color: '#07c160', url: q => `https://weread.qq.com/search?keyword=${encodeURIComponent(q)}` }
];

// 可免费在线阅读的合规平台（正版/公版书）
const BOOK_FREE_PLATFORMS = [
  { name: '古诗文网', desc: '古诗文/经典原文免费在线读', url: 'https://so.gushiwen.cn/' },
  { name: '鸠摩搜书', desc: '搜电子书资源，可下载', url: 'https://www.jiumo.org/' },
  { name: '国家图书馆', desc: '持证可借电子书/论文', url: 'http://www.nlc.cn/' },
  { name: 'Project Gutenberg', desc: '10万+英文公版书免费', url: 'https://www.gutenberg.org/' },
  { name: '微信读书', desc: '海量正版书，会员+免费可读（需登录）', url: 'https://weread.qq.com/' }
];

// ===== 2. 精选书摘（经典摘抄 / 读书心得 / 经典章节） =====
// 每条：{ id, title, author, category, type('excerpt'|'note'|'chapter'), content, source }
// type: excerpt=经典摘录, note=读书心得, chapter=经典章节
// 由每周自动化任务追加新条目（保留最近约20条）
const BOOK_FEATURED = [
  {
    id: 'bf-1',
    title: `活着`,
    author: `余华`,
    category: `文学`,
    type: `excerpt`,
    content: `「人是为活着本身而活着的，而不是为了活着之外的任何事物所活着。」\n\n富贵的一生被苦难反复碾过——家产败光、亲人接连离世，到最后只剩一头老牛相伴。余华用最平静的笔调写最深的痛，却让人读出一种倔强的生命力：活着不需要理由，活着本身就是全部的意义。备考疲惫时读它，会明白咬牙坚持本身就是答案。`,
    source: `《活着》第一章`
  },
  {
    id: 'bf-2',
    title: `人类简史`,
    author: `尤瓦尔·赫拉利`,
    category: `历史`,
    type: `note`,
    content: `读书心得：作者提出人类靠"讲故事的能力"实现大规模协作——金钱、宗教、国家都是"想象的共同体"。认知革命后，智人能用虚构故事把陌生人团结起来，这才战胜了其他人类物种。\n\n启发：申论写作中"共识""价值观""制度"的本质，也是把分散的个体凝聚成合力。理解这一点，能更通透地看懂政策为何强调"共同愿景"。`,
    source: `读书心得 · 认知革命`
  },
  {
    id: 'bf-3',
    title: `沉思录`,
    author: `马可·奥勒留`,
    category: `哲学`,
    type: `excerpt`,
    content: `「你拥有控制自己理性的力量，而不在控制外界事物。看清这一点，你便能找到内心的安宁。」\n\n这位罗马皇帝在军旅间隙写下的自我对话，核心是"控制二分法"：能改变的尽力，不能改变的释然。备考与工作中，焦虑多来自想控制不可控之事；把精力收回到"我今天能做什么"，心就稳了。`,
    source: `《沉思录》卷八`
  },
  {
    id: 'bf-4',
    title: `小王子`,
    author: `圣埃克苏佩里`,
    category: `文学`,
    type: `excerpt`,
    content: `「真正重要的东西，用眼睛是看不见的，只有用心才能看清。」\n\n狐狸让小王子懂得"驯养"意味着责任与独一无二。长大后我们习惯用数字衡量一切（成绩、薪资、排名），却忘了感受的温度。这本书是给所有"长大了的儿童"的提醒：别让功利遮蔽了本心。`,
    source: `《小王子》第二十一章`
  },
  {
    id: 'bf-5',
    title: `穷查理宝典`,
    author: `查理·芒格`,
    category: `商业`,
    type: `note`,
    content: `读书心得：芒格一生推崇"多元思维模型"——不要只用经济学眼光看问题，要把心理学、数学、工程、生物等多学科模型叠在一起，才能接住现实世界的复杂性。\n\n对应到学习：申论与公考不是单一学科，而是政治、经济、法律、社会的交叉。建立"多学科透镜"，比死记模板管用得多。`,
    source: `读书心得 · 多元思维模型`
  },
  {
    id: 'bf-6',
    title: `万历十五年`,
    author: `黄仁宇`,
    category: `历史`,
    type: `excerpt`,
    content: `「中国二千年来，以道德代替法制，至明代而极，这就是一切问题的症结。」\n\n黄仁宇用"大历史观"，从一个看似平淡的年份切入，揭示制度积弊如何拖垮一个王朝。这种"从细节看结构"的视角极适合申论：不堆砌口号，而从机制层面剖析因果，正是高分作文的底层逻辑。`,
    source: `《万历十五年》自序`
  },
  {
    id: 'bf-7',
    title: `非暴力沟通`,
    author: `马歇尔·卢森堡`,
    category: `心理`,
    type: `excerpt`,
    content: `「暴力的根源在于人们忽视彼此的感受与需要，而将冲突归咎于对方。」\n\n非暴力沟通四步：观察（不说评判）、表达感受、说出需要、提出请求。无论是家庭还是职场，把"你总是……"换成"我看到……我感到……因为我需要……你愿意……"，关系会柔软许多。`,
    source: `《非暴力沟通》第四章`
  },
  {
    id: 'bf-8',
    title: `红楼梦（黛玉葬花）`,
    author: `曹雪芹`,
    category: `文学`,
    type: `chapter`,
    content: `第二十七回"黛玉葬花"：她肩扛花锄、囊收残红，哭吟《葬花吟》——"一朝春尽红颜老，花落人亡两不知"。以落花自况，写尽寄人篱下的孤洁与对美好的执拗守护。\n\n这一段是中国文学"以景写情"的巅峰：不直说悲，悲已从花间漫出。读经典章节，学的是"用意象承载情绪"的笔法，对写作极有裨益。`,
    source: `《红楼梦》第二十七回`
  }
];

// ===== 3.5 经典书单（马雯指定的必读经典，附找书/阅读资源） =====
// 每本：{ id, title, author, tag, blurb }
// 资源链接在渲染时由 BOOK_SEARCH_ENGINES 动态生成（豆瓣/微信读书/京东/鸠摩等）
const BOOK_SHELF_CLASSICS = [
  { id: 'bc-wangyangming', title: `王阳明《传习录》`, author: `王阳明（王守仁）`, tag: `国学·心学`, blurb: `“知行合一”“致良知”——把道理变成行动力的东方心学原典。` },
  { id: 'bc-zhouyi', title: `周易`, author: `佚名（群经之首）`, tag: `国学·哲学`, blurb: `阴阳变化之道，中国人的底层思维模型与决策智慧源头。` },
  { id: 'bc-renzhi', title: `认知觉醒`, author: `周岭`, tag: `自我成长`, blurb: `用脑科学讲清“为什么道理都懂却做不到”，帮你开启内在成长。` },
  { id: 'bc-dangxia', title: `当下的力量`, author: `埃克哈特·托利`, tag: `心灵·觉察`, blurb: `放下对过去与未来的纠缠，在“当下”获得内在的平静与力量。` },
  { id: 'bc-diceng', title: `底层逻辑`, author: `刘润`, tag: `商业思维`, blurb: `看清事物本质的“不变之理”，在复杂世界里做更对的判断。` },
  { id: 'bc-jinqian', title: `金钱心理学`, author: `摩根·豪泽尔`, tag: `财商`, blurb: `理财的本质是心理与行为，而非公式——9 个关于财富的温情真相。` },
  { id: 'bc-poorrich', title: `穷爸爸富爸爸`, author: `罗伯特·清崎`, tag: `财商`, blurb: `资产与负债的启蒙：让钱为你工作，而非一辈子为钱工作。` },
  { id: 'bc-7habits', title: `高效能人士的7个习惯`, author: `史蒂芬·柯维`, tag: `自我管理`, blurb: `从“依赖”到“独立”再到“互赖”的底层习惯体系，影响一代人。` },
  { id: 'bc-hama', title: `蛤蟆先生去看心理医生`, author: `罗伯特·戴博德`, tag: `心理`, blurb: `用童话式对话讲清抑郁与自我重建，心理学入门最温柔的一本。` },
  { id: 'bc-yonggan', title: `被讨厌的勇气`, author: `岸见一郎 / 古贺史健`, tag: `心理·阿德勒`, blurb: `“课题分离”与“共同体感觉”——阿德勒哲学帮你摆脱讨好与内耗。` },
  { id: 'bc-renxing', title: `理解人性`, author: `阿尔弗雷德·阿德勒`, tag: `心理`, blurb: `个体心理学创始人剖析自卑、优越感与社会兴趣，看懂人与人的底层动力。` },
  { id: 'bc-eer', title: `额尔古纳河右岸`, author: `迟子建`, tag: `文学`, blurb: `鄂温克族的百年沧桑，一部写尽自然、信仰与生命的温柔史诗。` },
  { id: 'bc-zhai', title: `窄门`, author: `安德烈·纪德`, tag: `文学`, blurb: `“因为抱着永不实现的理想，才能拥有无限可能的幸福”——关于爱与信仰的拉扯。` },
  { id: 'bc-bainian', title: `百年孤独`, author: `加西亚·马尔克斯`, tag: `文学`, blurb: `马孔多家族七代人的魔幻轮回，写尽孤独、命运与时间的重量。` }
];

// ===== 精选书摘 / 经典书籍摘要 推送池 =====
// 读书板块改为「每 3 日推送精选书摘 + 经典书籍摘要」：
// ensureBookDigest() 从该池按日期轮流抽取若干本，写入 localStorage 展示（不重复过快）。
// 内容为原创摘要/摘录（ transformative summary ），均为可读的短内容，不涉及全书转载。
const BOOK_DIGEST_POOL = [
  { id: 'd-huozhe', title: '活着', author: '余华', category: '文学', type: 'summary',
    content: '福贵的一生被苦难反复碾过：家产败光、亲人接连离世，到最后只剩一头老牛相伴。余华用最平静的笔调写最深的痛，却让人读出倔强的生命力——活着不需要理由，活着本身就是全部的意义。', source: '原创摘要' },
  { id: 'd-bainian', title: '百年孤独', author: '加西亚·马尔克斯', category: '文学', type: 'summary',
    content: '马孔多家族七代人的魔幻轮回：失眠症、升天的美人、连绵的香蕉热雨。马尔克斯以虚实交错的笔法写尽孤独、命运与时间的重量，是拉美魔幻现实主义的巅峰。', source: '原创摘要' },
  { id: 'd-renlei', title: '人类简史', author: '尤瓦尔·赫拉利', category: '历史', type: 'note',
    content: '作者提出：人类靠“讲故事的能力”实现大规模协作——金钱、宗教、国家都是“想象的共同体”。认知革命后，智人能用虚构故事把陌生人团结起来，这才战胜了其他人类物种。', source: '读书笔记 · 认知革命' },
  { id: 'd-honglou', title: '红楼梦', author: '曹雪芹', category: '文学', type: 'summary',
    content: '中国古典四大名著之首。以贾史王薛四大家族的兴衰为线，写宝黛钗的爱情悲剧与封建家族的崩解。草蛇灰线、伏脉千里，是写人、写情、写世态的巅峰之作。', source: '原创摘要' },
  { id: 'd-lunyu', title: '论语', author: '孔子及其弟子', category: '国学', type: 'excerpt',
    content: '“学而不思则罔，思而不学则殆。”“己所不欲，勿施于人。”论语是儒家根本，记录孔子与弟子的言行，讲修身、为学、处世的底色，全文已内置可离线读。', source: '原创摘录' },
  { id: 'd-daode', title: '道德经', author: '老子', category: '国学', type: 'excerpt',
    content: '“道可道，非常道；名可名，非常名。”老子以五千言讲辩证智慧：柔弱胜刚强、无为而无不为。八十一章短小却极深，是东方思维的源头之一，全文已内置可离线读。', source: '原创摘录' },
  { id: 'd-sunzi', title: '孙子兵法', author: '孙武', category: '国学', type: 'summary',
    content: '“兵者，诡道也。”“知彼知己，百战不殆。”孙子不讲蛮力，讲谋略、形势与主动权——其思想早已超出军事，成为竞争与决策的底层方法论。', source: '原创摘要' },
  { id: 'd-weicheng', title: '围城', author: '钱钟书', category: '文学', type: 'summary',
    content: '“城外的人想冲进去，城里的人想逃出来。”方鸿渐的婚姻与职场漂泊，是钱钟书对人生困境的幽默解构——婚姻、工作、理想，莫不如是。', source: '原创摘要' },
  { id: 'd-1984', title: '1984', author: '乔治·奥威尔', category: '文学', type: 'summary',
    content: '“战争即和平，自由即奴役，无知即力量。”老大哥在看着你。奥威尔以极权寓言警示：当语言被篡改、记忆被抹去，个体将失去反抗的武器。', source: '原创摘要' },
  { id: 'd-kite', title: '追风筝的人', author: '卡勒德·胡赛尼', category: '文学', type: 'summary',
    content: '“为你，千千万万遍。”阿富汗少年阿米尔的背叛与救赎，写尽友谊、愧疚与自我和解。风筝是童年的牵绊，也是一生想追回的善良。', source: '原创摘要' },
  { id: 'd-xiaowangzi', title: '小王子', author: '圣埃克苏佩里', category: '文学', type: 'excerpt',
    content: '“真正重要的东西，用眼睛是看不见的，只有用心才能看清。”狐狸让小王子懂得“驯养”意味着责任与独一无二。这是给所有“长大了的儿童”的提醒。', source: '原创摘录' },
  { id: 'd-chenmo', title: '沉默的大多数', author: '王小波', category: '杂文', type: 'note',
    content: '王小波以辛辣幽默拆解荒诞：比起沉默地随大流，独立思考才是稀缺的勇气。他推崇“有智、有趣、有性”的真实生活，反对被话语霸权裹挟。', source: '读书笔记' },
  { id: 'd-wanli', title: '万历十五年', author: '黄仁宇', category: '历史', type: 'summary',
    content: '“中国二千年来，以道德代替法制，至明代而极，这就是一切问题的症结。”黄仁宇用“大历史观”，从一个平淡年份切入，揭示制度积弊如何拖垮一个王朝。', source: '原创摘要' },
  { id: 'd-pingfan', title: '平凡的世界', author: '路遥', category: '文学', type: 'summary',
    content: '以陕北孙少安、孙少平兄弟的命运为线，写尽改革开放初期普通人在苦难与尊严中挣扎向上的力量。平凡人活出不平凡，是这代人的精神底色。', source: '原创摘要' },
  { id: 'd-santi', title: '三体', author: '刘慈欣', category: '科幻', type: 'summary',
    content: '从红岸基地到三体文明的监听，人类在宇宙尺度下面临生存与文明的终极抉择。硬核想象与冷峻哲思交织，把中国科幻推向世界。', source: '原创摘要' },
  { id: 'd-chansilu', title: '沉思录', author: '马可·奥勒留', category: '哲学', type: 'excerpt',
    content: '“你拥有控制自己理性的力量，而不在控制外界事物。”这位罗马皇帝在军旅间隙写下的自我对话，核心是“控制二分法”：能改变的尽力，不能改变的释然。', source: '原创摘录' },
  { id: 'd-feibaoli', title: '非暴力沟通', author: '马歇尔·卢森堡', category: '心理', type: 'note',
    content: '沟通四步：观察（不说评判）、表达感受、说出需要、提出请求。把“你总是……”换成“我看到……我感到……因为我需要……”，关系会柔软许多。', source: '读书笔记' },
  { id: 'd-yonggan', title: '被讨厌的勇气', author: '岸见一郎 / 古贺史健', category: '心理', type: 'summary',
    content: '“课题分离”与“共同体感觉”——阿德勒哲学帮你摆脱讨好与内耗。自由就是被别人讨厌：你不必为满足他人期待而活，人生是连续的刹那。', source: '原创摘要' },
  { id: 'd-bird', title: '你当像鸟飞往你的山', author: '塔拉·韦斯特弗', category: '传记', type: 'summary',
    content: '一个从不上学的山中女孩，靠自学考入剑桥。塔拉写原生家庭的束缚与教育的救赎：教育不是把人变成别人，而是让人能自己定义自己。', source: '原创摘要' },
  { id: 'd-hama', title: '蛤蟆先生去看心理医生', author: '罗伯特·戴博德', category: '心理', type: 'summary',
    content: '用童话式对话讲清抑郁与自我重建。蛤蟆在苍鹭引导下，从“儿童自我状态”走向“成人自我状态”——真正能让你好起来的，是你自己。', source: '原创摘要' },
  { id: 'd-renjian', title: '人间值得', author: '中村恒子', category: '心理', type: 'note',
    content: '90岁心理医生恒子的朴素活法：人生不必太用力，只要能照亮某个角落就够了。工作、婚姻、孤独，她都给出“刚刚好”的答案。', source: '读书笔记' },
  { id: 'd-xinliu', title: '心流', author: '米哈里·契克森米哈赖', category: '心理', type: 'summary',
    content: '当挑战与能力匹配，人会进入全神贯注、忘记时间的“心流”。幸福不在终点，而在每一次专注投入的过程里。', source: '原创摘要' },
  { id: 'd-na瓦尔', title: '纳瓦尔宝典', author: '纳瓦尔·拉维坎特', category: '财商', type: 'note',
    content: '财富与幸福的底层逻辑：用专长+杠杆（代码/媒体）放大产出；幸福是去除杂念后的当下平静。追求“无用之用”，而非盲目勤奋。', source: '读书笔记' },
  { id: 'd-zhizhi', title: '置身事内', author: '兰小欢', category: '经济', type: 'summary',
    content: '读懂中国经济，先读懂地方政府如何投资与招商。兰小欢以财税、土地、金融为线索，把宏观政策落回“具体的人如何行动”，是理解当下的钥匙。', source: '原创摘要' }
];

// （「我的书架」及预置书正文解析已于 2026-08-02 移除；读书板块改为每 3 日推送书摘/摘要）
