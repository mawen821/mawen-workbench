// ============================================
// 每天的 10 分钟板块
// 把马雯列举的小事系统分到「早上 / 中午 / 晚上」三个 10 分钟时段
// 每个活动含：教程讲解(tutorial) + 视频跟练(videos)
//   - videos 为数组，支持多套；每两周自动轮换一套（rotIdx = round % 长度）
//   - type:'bilibili' 用 BV 号内嵌播放器；type:'search' 用 B站搜索链接兜底
//   - kind:'internal' 表示跳转到已有板块（英语角 / 每日大事件）
// 最后更新：2026-07-31
// ============================================

const TENMIN_SLOTS = [
  { id: 'morning', name: '早上 10 分钟', icon: '🌅', desc: '起床后唤醒身体与大脑，轻量启动一天' },
  { id: 'noon',    name: '中午 10 分钟', icon: '☀️', desc: '工作间隙放松肩背、活动筋骨、给脑子换气' },
  { id: 'evening', name: '晚上 10 分钟', icon: '🌙', desc: '睡前舒展身心、释放一天、安静下来' }
];

const TENMIN_ACTIVITIES = {
  // ---------- 早上 ----------
  morning_words: {
    id: 'morning_words', name: '晨起背单词', icon: '📚', slot: 'morning', kind: 'internal', target: 'english',
    note: '点下方按钮直接进英语角，用「每日积累」词书最佳。',
    tutorial: [
      `打开「英语角 → 每日单词」，选「每日积累」词书（每周自动补新词，永远有得背）`,
      `每天 10 个生词：先看音标跟读，再看例句理解真实用法`,
      `用「标记已学」清掉熟悉的，留下生词第二天再巩固，滚雪球式积累`
    ]
  },
  morning_news: {
    id: 'morning_news', name: '早上新闻', icon: '📰', slot: 'morning', kind: 'internal', target: 'news',
    note: '点下方按钮直接进每日大事件，扫今日 9 类要闻。',
    tutorial: [
      `打开「每日大事件」，扫一遍 9 类新闻的今日标题，建立全局感`,
      `挑 2 条最关心的（时政 / 经济 / 科技）点开细读，每条约 3 分钟`,
      `顺手记一个关键词到复盘，长期锻炼"信息敏感度"与表达素材`
    ]
  },
  morning_taichi: {
    id: 'morning_taichi', name: '晨练太极（八段锦）', icon: '🧘', slot: 'morning', kind: 'video',
    note: '动作柔和，最适合清晨提振阳气；饭后 1 小时内不练。',
    tutorial: [
      `八段锦共 8 式，先求动作连贯，熟练后再配呼吸（起吸落呼、开吸合呼）`,
      `预备：两脚与肩同宽，松静自然；每式做到位停 1-2 秒`,
      `"重意不重力"：不追求幅度大，肩松、膝微屈、脚趾抓地`,
      `坚持 2-4 周，疏通经络、改善肩颈与睡眠`
    ],
    videos: [
      { type: 'bilibili', bvid: 'BV1MwVVziE7T', title: '八段锦 12 分钟口令版跟练（镜像+正反面）' },
      { type: 'search', keyword: '八段锦 跟练 口令版', title: '换一套：搜"八段锦 跟练"' }
    ]
  },
  morning_face: {
    id: 'morning_face', name: '晨起瘦脸操（消水肿）', icon: '💆', slot: 'morning', kind: 'video',
    note: '晨起浮肿最适合做；配合"睡前少喝水、少低头"效果更好。',
    tutorial: [
      `热毛巾敷下颌 + 指背从下巴提拉至太阳穴，快速消水肿`,
      `下颌线：抬头拉伸颈阔肌（仰头"吻天花板"），改善低头软双下巴`,
      `咬肌放松：揉开下颌硬块；鼓腮 / 鱼嘴呼吸收紧下坠脸颊`,
      `习惯：睡前 3h 少喝水、手机举到视线平齐、尽量平躺睡，脸自然小一圈`
    ],
    videos: [
      { type: 'search', keyword: '10分钟瘦脸操 晨起 消水肿', title: '10 分钟瘦脸操跟练' },
      { type: 'search', keyword: 'Crystal0018 瘦脸操 下颌线', title: '换一套：下颌线专项' }
    ]
  },

  // ---------- 中午 ----------
  noon_back: {
    id: 'noon_back', name: '练背·开肩·体态', icon: '🦋', slot: 'noon', kind: 'video',
    note: '久坐含胸救星；午间花 10 分钟，下午身姿都挺拔。',
    tutorial: [
      `靠墙收背：后脑 / 肩胛 / 臀贴墙，屈肘 90° 手背贴墙，肩胛向中夹紧 5 秒 × 15`,
      `推墙开肩：双手扶墙，踮脚 + 侧身转体，打开胸腔`,
      `门框拉伸：前臂贴门框，身体前倾拉胸肌 30 秒 / 侧，放松紧张前侧`,
      `全程沉肩不耸肩，2-4 周见效，背薄了脸也显小`
    ],
    videos: [
      { type: 'search', keyword: '10分钟 练背 开肩 体态 跟练', title: '10 分钟直角肩天鹅背跟练' },
      { type: 'search', keyword: '改善含胸驼背 10分钟 瑜伽 跟练', title: '换一套：含胸驼背矫正' }
    ]
  },
  noon_folk: {
    id: 'noon_folk', name: '民族舞·简单片段', icon: '🌸', slot: 'noon', kind: 'video',
    note: '选 1-3 分钟片段镜面跟练，午间活动筋骨又放松。',
    tutorial: [
      `选一支简单的古典 / 民族舞片段，镜面跟练最容易上手`,
      `先分手：数节拍 → 练手部 → 加步伐，再连起来`,
      `民族舞讲究"圆、柔、韵"，重点练提沉呼吸与圆场步`,
      `10 分钟刚好记一小段，跳完整个人都松了`
    ],
    videos: [
      { type: 'bilibili', bvid: 'BV1V54JzfE6R', title: '一分钟学会古典舞《惊鸿一面》零基础' },
      { type: 'search', keyword: '古典舞 零基础 跟练 简单', title: '换一套：搜古典舞跟练' }
    ]
  },

  // ---------- 晚上 ----------
  evening_sword: {
    id: 'evening_sword', name: '太极剑·简易剑术', icon: '⚔️', slot: 'evening', kind: 'video',
    note: '初学用木剑 / 竹剑，平底防滑鞋；清晨或傍晚练最佳。',
    tutorial: [
      `初学用木剑 / 竹剑（剑长以直立剑尖不低于耳垂为宜），掌心要空如握蛋`,
      `基本握法：拇指食指轻扣剑柄，剑刃与手臂成一直线，剑身不晃`,
      `从"起势"学：并步持剑 → 开立 → 两臂前举 → 屈膝下蹲（举臂吸、下蹲呼）`,
      `先看动作讲解，一天练一两个式子再串起来，别贪多`
    ],
    videos: [
      { type: 'search', keyword: '32式太极剑 入门 跟练 分解', title: '32 式太极剑分解跟练' },
      { type: 'search', keyword: '太极剑 零基础 教学 跟练', title: '换一套：太极剑基础' }
    ]
  },
  evening_hiphop: {
    id: 'evening_hiphop', name: '街舞·零基础', icon: '🕺', slot: 'evening', kind: 'video',
    note: '睡前释放能量；0.5 倍速慢动作抠细节，对着镜子练。',
    tutorial: [
      `先练律动 Bounce：膝盖微屈弹动，重心在前脚掌，跟 100-120 BPM 音乐`,
      `Top Rock 基础步：双脚与肩宽，右脚点地 + 上身律动，每天 10 分钟`,
      `练隔离 isolation：头 / 肩 / 胸 / 胯分开动，这是街舞精髓`,
      `每次前先做 10 分钟动态热身（肩 / 髋激活），避免拉伤`
    ],
    videos: [
      { type: 'bilibili', bvid: 'BV1KLxtzTE3z', title: 'Waacking 甩手舞零基础教程（街舞基本功）' },
      { type: 'search', keyword: '零基础街舞 基本功 跟练 Toprock', title: '换一套：搜街舞跟练' }
    ]
  },
  evening_jazz: {
    id: 'evening_jazz', name: '爵士舞·零基础', icon: '💃', slot: 'evening', kind: 'video',
    note: '10 分钟专项跟练最有效；跟着口令慢速分解再加速。',
    tutorial: [
      `爵士基本功从"胸部 / 头部 / 胯部"隔离训练开始`,
      `胸部绕环：四个方向定点做大，再连贯成顺滑曲线，核心收紧`,
      `头部绕环 + wave：想象画 8 字，幅度做大、定点干净`,
      `全程头稳定、肩下沉；先慢速分解，熟练再加速`
    ],
    videos: [
      { type: 'bilibili', bvid: 'BV1Cq4y1b7Je', title: '零基础爵士舞基本功 10min 胸部跟练（黎小尤）' },
      { type: 'search', keyword: '零基础爵士舞 基本功 跟练', title: '换一套：搜爵士舞跟练' }
    ]
  }
};
