/* ============================================
   自媒体部模块（已拆分为「宠物部」与「好物部」两个独立导航模块）
   每个模块只显示本赛道内容：
   顶部：每日热点仪表盘（本赛道热点 / 排行榜 / 今日拍摄主题）
   六个板块：选题灵感 / 爆款二创 / 复盘&选题（本周灵感 inbox + 复盘）/ 预计完成 / 内容文案 / 运营学院
   - 数据均为「选题灵感 / 爆款形式 / 运营知识」层面的原创整理（基于 2026 公开趋势研究）
   - 链接说明：内置「去抖音看同类爆款」使用抖音网页搜索链接，
     PC 端用浏览器打开、手机端跳 App，均可正常打开；
     具体某条视频链接请粘贴你找到的真实链接（可正常打开）。
   - 每周一自动化会刷新 ZM_WEEKLY（5~10 条「本周灵感」），供「复盘&选题」tab 筛选。
   ============================================ */

// ===== 选题灵感池（宠物 + 好物） =====
const ZM_IDEA_POOL = [
  { id: 'i-pet-persona', track: '宠物', title: '给毛孩子立「人设」', angle: '把宠物当“有名字的角色”：自律学霸狗 / 腹黑心机猫 / 笨萌学渣宠，让它有性格有故事。', why: '2026 宠物号底层密码是“演”宠物，立人设才有记忆点和算法流量。', kw: '宠物 人设 剧情' },
  { id: 'i-pet-skill', track: '宠物', title: '7 天教会狗狗一个新技能 vlog', angle: '记录训练全过程（击掌 / 装死 / 定点），把“笨拙到学会”的过程拍出来。', why: '技能挑战类完播高，过程本身就有人看。', kw: '训犬 挑战 vlog' },
  { id: 'i-pet-correct', track: '宠物', title: '拆家犬 → 天使犬 行为矫正对比', angle: '前后对比 + 干货：怎么把“小恶魔”教成“小天使”。', why: '对比型内容信息密度高，易被收藏转发。', kw: '狗狗 行为矫正 对比' },
  { id: 'i-pet-os', track: '宠物', title: '宠物内心 OS 配音', angle: '给毛孩子配拟人内心戏（打工猫 / 戏精狗），搞笑又共情。', why: '配音类门槛低、传播强，适合日常更新。', kw: '宠物 配音 内心戏' },
  { id: 'i-pet-suspense', track: '宠物', title: '“它连续 N 天在同一位置蹲守”悬念系列', angle: '用悬念前置开头，做连续小剧场，引导追更。', why: '悬念 + 系列化显著提升停留和关注。', kw: '猫咪 日常 悬念 系列' },
  { id: 'i-pet-ai', track: '宠物', title: 'AI 宠物拟人短剧', angle: '猫子柒式：让宠物“做饭 / 摆摊 / 上班”，固定猫设 + 连续剧情。', why: 'AI 宠物是 2026 新风口，14 条视频可涨粉近 20 万。', kw: 'AI宠物 短剧 猫设' },
  { id: 'i-pet-goods', track: '宠物', title: '宠物用品真实测评', angle: '把你赛道里的宠物好物做成真实测评（化毛片 / 猫砂 / 牵引绳）。', why: '垂直 + 好物，天然衔接你的两个赛道。', kw: '宠物用品 真实测评' },
  { id: 'i-pet-reverse', track: '宠物', title: '“我家猫居然会自己开冰箱？”反常识开头', angle: '用反常识 / 视觉冲击做 3 秒钩子，再展开故事。', why: '反常识钩子点击率可提升 3 倍。', kw: '宠物 反常识 钩子' },
  { id: 'i-goods-reverse', track: '好物', title: '反向输出：假装吐槽反转安利', angle: '开头“千万别买这个垃圾”，反转后疯狂安利，反差感拉满。', why: '欲扬先抑是 2026 高转化形式（单条 52 万赞案例）。', kw: '好物 反向种草 反转' },
  { id: 'i-goods-unbox', track: '好物', title: '开箱猎奇：小众新奇好物', angle: '沉浸式开箱少见 / 小众 / 猎奇单品，满足好奇心。', why: '开箱猎奇自带流量属性，适合做差异化。', kw: '好物 开箱 猎奇' },
  { id: 'i-goods-script', track: '好物', title: '痛点 + 场景实测 + 福利促单', angle: '黄金脚本：前 3 秒抛痛点 → 产品亮相 → 多场景实测 → 福利促单。', why: '抖音电商“好看内容”标准结构，转化率高。', kw: '好物 测评 脚本 转化' },
  { id: 'i-goods-seed', track: '好物', title: '好物种草：第一视角闺蜜安利', angle: '口语化聊天式口播，“我自己用了 1 个月才敢推”，信任感拉满。', why: '种草类靠真实感，像朋友安利最易被接受。', kw: '好物 种草 第一视角' },
  { id: 'i-goods-scene', track: '好物', title: '场景展示：生活化实景对话带出产品', angle: '搭建生活场景，人物互动自然展示产品优势，不生硬带货。', why: '场景展示代入感强，适合家居 / 日用。', kw: '好物 场景展示 植入' },
  { id: 'i-goods-story', track: '好物', title: '故事剧情：用短剧自然植入', angle: '用完整小故事承载产品，像追剧一样吸引人，不反感广告。', why: '剧情植入粉丝粘性高、复购强。', kw: '好物 剧情植入 短剧' },
  { id: 'i-goods-price', track: '好物', title: '平价替代：XX 元能买到什么神器', angle: '“XX 元能买到什么？这 5 个神器让我惊了！”平价刚需引流。', why: '低价福利型节奏快、适合起量。', kw: '平价好物 神器 学生党' },
  { id: 'i-goods-vertical', track: '好物', title: '垂直细分：打工人 / 学生党 / 养宠人专属', angle: '只盯一个细分人群（如养宠人好物），做深做透。', why: '极度垂直账号流量倾斜明显，算法偏爱。', kw: '垂直 好物 人群细分' }
];

// ===== 爆款二创模板池 =====
const ZM_HOT_POOL = [
  { id: 'h-persona', track: '宠物', format: '人设封神法', adapt: '给你的宠物取名字、立性格、编小故事（自律学霸 / 腹黑心机 / 笨萌学渣），让它有“灵魂”。', hook: '“如果我是它，这段该怎么演？”', kw: '宠物 人设 爆款' },
  { id: 'h-3s', track: '通用', format: '黄金 3 秒钩子', adapt: '开头即高潮：反常识提问 / 视觉冲击（出糗、炸毛）/ 悬念前置，别再说“大家好今天…”。', hook: '“你家狗睡觉头朝北？这不是巧合！”', kw: '短视频 3秒 钩子' },
  { id: 'h-skill', track: '宠物', format: '技能挑战记录', adapt: '拍“7 天教会它一个新技能”的全过程，把笨拙到学会的起伏剪出来。', hook: '“第 1 天它根本不理我……”', kw: '训犬 挑战 记录' },
  { id: 'h-correct', track: '宠物', format: '行为矫正对比', adapt: '拆家犬→天使犬的前后对比，干货满满，适合做系列。', hook: '“一个月前它还是这样……”', kw: '狗狗 行为矫正 对比' },
  { id: 'h-os', track: '宠物', format: 'AI 配音内心 OS', adapt: '给宠物加拟人内心戏配音，搞笑又共情，低成本日更。', hook: '“铲屎的又晚回来了……”', kw: '宠物 AI 配音' },
  { id: 'h-reverse', track: '好物', format: '反向输出（欲扬先抑）', adapt: '开头假装吐槽产品不好，反转后疯狂安利，反差感拉满。', hook: '“千万别给老婆买这个垃圾玩意”', kw: '好物 反向种草' },
  { id: 'h-unbox', track: '好物', format: '开箱猎奇', adapt: '选新奇 / 小众 / 少见产品，沉浸式开箱，抓住注意力。', hook: '“这玩意儿居然长这样？”', kw: '好物 开箱 猎奇' },
  { id: 'h-scene', track: '好物', format: '场景展示植入', adapt: '生活化实景 + 人物互动自然展示产品，不生硬带货。', hook: '“出门前随手一拿……”', kw: '好物 场景展示' },
  { id: 'h-story', track: '好物', format: '故事剧情植入', adapt: '用短剧承载产品，观众追剧不反感广告，粘性最强。', hook: '“这事儿得从上周说起……”', kw: '好物 剧情植入' },
  { id: 'h-pain', track: '好物', format: '痛点 + 实测 + 促单', adapt: '前 3 秒痛点 → 产品亮相 → 多场景实测 → 福利促单，黄金带货结构。', hook: '“厨房油污擦半小时都擦不干净？”', kw: '好物 测评 带货脚本' }
];

// ===== 内容复盘检查项 =====
const ZM_REVIEW_CHECKS = [
  { key: 'pre3', q: '前 3 秒有强钩子（反常识 / 视觉冲击 / 悬念）？', tip: '前 3 秒定生死：把最精彩或最反常识的放开头，别铺垫。' },
  { key: 'subtitle', q: '加了醒目字幕（方便静音观看）？', tip: '大量用户静音刷视频，黄字大字字幕能保住完播。' },
  { key: 'cover', q: '封面统一风格 + 大字标题？', tip: '统一封面风格建立辨识度；标题用“数字+痛点+方案”。' },
  { key: 'cta', q: '结尾引导了互动（点赞 / 评论 / 关注）？', tip: '明确一句话引导：“评论区告诉我你想看什么”。' },
  { key: 'posttime', q: '发布时间贴合受众活跃时段？', tip: '宠物 / 好物黄金时段常在工作日晚 18-22 点、午休 12 点，测自己的数据。' },
  { key: 'keyword', q: '标题 / 文案含赛道关键词便于搜索？', tip: '埋“宠物用品 / 平价好物 / 测评”等词，提升搜索流量。' },
  { key: 'vertical', q: '内容足够垂直（固定一个细分）？', tip: '只做一个细分（如养宠人好物），算法倾斜、涨粉更快。' },
  { key: 'real', q: '真实生活化、有真人出镜增强信任？', tip: '手机 + 自然光 + 露手 / 露脸，让用户觉得在“分享”而非“推销”。' },
  { key: 'series', q: '做了系列化 / 固定人设便于追更？', tip: '固定人设 + 连续剧情，提升关注与复看。' },
  { key: 'data', q: '看完数据（完播 / 点赞 / 评论）做了复盘？', tip: '用数据反推：完播低看开头，评论少看互动引导。' }
];

// ===== 每日热点池（宠物 / 好物，按日期轮转） =====
const ZM_DAILY_PET = [
  { t: '亚宠展探展倒计时（8/19-8/23 上海）', d: '第 28 届亚洲宠物展 8 月 19-23 日在上海新国际博览中心开展，32 万㎡、2600+ 展商、1000+ 头部宠物达人到场，单平台话题热度超 17 亿。提前一周发“我要去亚宠展”预告蓄水，展期日更探展 vlog / 新品开箱，是全年最好蹭的一波搜索流量。', kw: '亚宠展 探展 vlog 宠物新品' },
  { t: '猫经济跑赢狗经济', d: '抖音电商宠物行业 GMV 同比 +54%，其中猫市场增速显著跑赢犬市场，猫主人客单价比狗主人高约 30%。内容方向和选品都可以先押猫。', kw: '猫咪 养猫 好物 测评' },
  { t: '主粮工艺内卷：低温烘焙 / 冷鲜 / 多蛋白', d: '猫狗主粮新品沿三条线走——工艺更鲜（低温烘焙、真空烘焙、冷鲜粮）、肉源更野（多蛋白配比、稀有蛋白源）、功能更专（美毛 / 肠胃 / 免疫 / 泌尿）。拍“怎么看懂配料表”这种可收藏干货最吃新算法。', kw: '猫粮 低温烘焙 配料表 怎么选' },
  { t: '携宠出行装备爆发', d: '52% 宠主携宠出行频次提升；千元以上高端宠物推车增速超 100%，车载安全窝 200-400 元价格带亮眼，50 元以上猫用牵引绳增长快，宠物冲锋衣、人宠同款机能装备成新社交货币。', kw: '带宠出行 宠物推车 车载窝 牵引绳' },
  { t: '智能养宠：猫脸识别喂食器', d: '搭载猫脸识别的智能喂食器能区分多只宠物身份、按预设方案精准出粮并记录进食数据，多宠识别已成中高端机型核心竞争点。多猫家庭实测就是天然选题。', kw: '智能喂食器 猫脸识别 多猫家庭' },
  { t: '猫砂升级为“精致养宠必备”', d: '猫砂从“能用就行的耗材”升级为结团防粘、强除臭、低尘护呼吸、可降解。做横评表格（吸水 / 结团 / 粉尘 / 价格）是典型高收藏内容。', kw: '猫砂 横评 除臭 低尘' },
  { t: '猫爬架 / 猫抓板走家居美学路线', d: '从“角落里的笼子”升级成“家的一部分”：向上要垂直空间、向内要美学、向外要自然材质。拍改造前后对比，视觉冲击强。', kw: '猫爬架 家居 改造 前后对比' },
  { t: '情绪代偿：拍宠物，其实在拍人', d: '玩具品类已从“打发时间的小物件”升级为“陪伴+训练+健康+环保”四位一体，背后是宠主的情绪需求。把镜头对准“它独处时在想你”，用户代入的是自己。', kw: '宠物 情绪 陪伴 治愈' },
  { t: 'AI 宠物拟人短剧', d: '固定猫设 + 连续剧情（做饭 / 摆摊 / 上班），系列化天然提升复访率，正好踩中新算法权重。', kw: 'AI宠物 短剧 猫设' },
  { t: '可收藏型干货：养宠清单 / 避坑指南', d: '新算法把收藏率排到第一位。“新手养猫第一个月要买的 12 样”“幼犬疫苗时间表”这类清单式内容会被反复保存回看，长尾流量最稳。', kw: '新手养猫 清单 避坑指南' }
];
const ZM_DAILY_GOODS = [
  { t: '818 发现好物节进行中（8/1-8/18）', d: '抖音年度大促之一，8 月初预热、8 月 18 日爆发，百亿补贴升级为“超值购”频道，平台开放短视频引流赛、全民巅峰赛等玩法。大促期挂车视频的流量和转化都会被加权。', kw: '抖音818 发现好物节 大促' },
  { t: '开学季 / 宿舍好物', d: '8 月下旬到 9 月初是学生党消费高峰：宿舍收纳、桌面神器、便携小家电、护眼台灯、换机潮数码配件。人群极其精准，适合做“XX 元搞定宿舍”合集。', kw: '开学季 宿舍好物 学生党' },
  { t: '轻户外持续爆发', d: '上半年平台户外生活产业带商品售出超 10 亿单，短视频体裁带动销售额同比 +71%。近四个月速开沙滩帐 +359%、野餐炉具 +195%、轻便充气床 +57%，“公园 mini 露营”“骑行露营”是新玩法。', kw: '轻户外 露营 野餐 装备' },
  { t: '便携餐饮具 / 户外聚餐', d: '钛锅 +325%、卡式炉 +302%、喷雾水杯 +256%、便携咖啡壶 +139%，冷藏箱冰包持续热销。“把一顿饭搬到户外”是高完播的场景化选题。', kw: '户外炊具 便携 咖啡壶 钛锅' },
  { t: '小众轻运动新搭子', d: '匹克球 +229%、桨板 +203%、皮划艇充气艇 +142%、小物钓鱼桶 +70%。新奇 + 低门槛 + 出片，天然适合开箱和“第一次体验”类内容。', kw: '匹克球 桨板 小物钓 开箱' },
  { t: '情绪价值消费', d: '用户愿意为“上镜”和“情绪门票”买单：丑萌玩偶、氛围灯、香氛、联名小物，核心卖点是社交分享属性而非功能。', kw: '情绪价值 好物 氛围感 解压' },
  { t: '家居收纳 & 厨房清洁（长青盘）', d: '收纳分隔、免打孔挂钩、油污净、多功能削皮器——痛点强、前后对比直观、9.9-59 元冲动下单区间，退货率低，最适合新手起号。', kw: '家居收纳 厨房清洁 好物 平价' },
  { t: '用“可收藏清单”代替单品安利', d: '算法把收藏率提到第一位，“5 件让厨房不油腻的东西 + 价格表”这类清单，比单推一件货更容易被存下来，长尾持续出单。', kw: '好物清单 合集 平价 收纳' },
  { t: '图文带货', d: '拼图 + 文案 + 小黄车，成本极低、0 粉可试，且图文更容易被搜到，正好承接已破 50% 的搜索流量。适合和短视频组合打。', kw: '图文带货 好物 起号' },
  { t: '换季秋上新预埋', d: '8 月夏末秋初是服饰家纺淡季，也是提前埋搜索词的窗口：薄外套、法兰绒四件套、秋季换季收纳。提前 2-4 周布局关键词，需求起来时你已经排在前面。', kw: '换季 秋上新 家纺 收纳' }
];

// ===== 排行榜（参考榜，基于 2026-08 公开趋势整理，非实时抓取） =====
const ZM_RANK_PET = [
  { t: '猫赛道（增速跑赢犬）', d: '抖音宠物 GMV 同比 +54%，猫市场增速显著领先；猫主人客单价高约 30%，复购稳。', kw: '猫咪 养猫 好物' },
  { t: '功能性主粮 / 零食', d: '低温烘焙、冻干锁鲜、多蛋白配比，美毛 / 肠胃 / 泌尿 / 磨牙洁齿功能细分，是新品最密集的方向。', kw: '猫粮 冻干 低温烘焙 功能' },
  { t: '猫砂 / 清洁除臭', d: '结团防粘、强除臭、低尘护呼吸、可降解四大需求，横评类内容高收藏。', kw: '猫砂 除臭 低尘 横评' },
  { t: '智能养宠硬件', d: '猫脸识别喂食器、智能饮水机、自动猫砂盆、宠物烘干箱、健康项圈，利润率普遍 60%-75%。', kw: '智能喂食器 自动猫砂盆 宠物硬件' },
  { t: '携宠出行 / 户外机能', d: '宠物推车（千元以上增速超 100%）、车载安全窝（200-400 元）、亲子牵引绳、宠物冲锋衣、人宠同款。', kw: '宠物推车 车载窝 带宠出行' },
  { t: 'AI 拟人 / 异宠细分', d: '固定猫设连续剧涨粉快；仓鼠、鹦鹉、鸟、鱼等异宠 TGI 高、竞争小、粘性强。', kw: 'AI宠物 异宠 仓鼠 鹦鹉' }
];
const ZM_RANK_GOODS = [
  { t: '轻户外生活', d: '当下最热：速开沙滩帐 +359%、钛锅 +325%、卡式炉 +302%、喷雾水杯 +256%、匹克球 +229%。', kw: '轻户外 露营 装备' },
  { t: '家居日用收纳', d: '最稳、涨粉最快、退货率低；29.9-89 元转化最佳，利润率 45%-55%。', kw: '家居收纳 好物' },
  { t: '厨房清洁神器', d: '强痛点、高复购、男女通吃；脏→净的视觉冲击是天然完播保障。', kw: '厨房清洁 油污净' },
  { t: '开学季学生党', d: '8 月下旬起爆：宿舍收纳、桌面神器、护眼台灯、便携小家电、数码配件，人群精准。', kw: '开学季 宿舍好物 学生党' },
  { t: '宠物用品', d: '高复购、粘性强、涨粉稳；智能喂食器 / 自动猫砂盆 / 猫砂 / 玩具，和你的宠物号天然联动。', kw: '宠物用品 好物 测评' },
  { t: '情绪价值小物', d: '丑萌玩偶、氛围灯、香氛、联名款——为“上镜”和心理满足买单，社交分享属性强。', kw: '情绪价值 氛围感 解压好物' }
];

// ===== 本周灵感池（每周一自动化刷新 5~10 条，供用户筛选；想做自动进「预计完成」） =====
const ZM_WEEKLY = [
  { id: 'w-pet-5', track: '宠物', kind: '爆款', t: '亚宠展探展 vlog（8/19-8/23 上海）', why: '第 28 届亚洲宠物展 8 月 19-23 日开展，2600+ 展商、单平台话题热度超 17 亿，展期搜索量集中爆发。提前一周发预告蓄水、展期日更探展和新品开箱，是全年性价比最高的一次蹭流量机会。', kw: '亚宠展 探展 vlog 宠物新品' },
  { id: 'w-pet-6', track: '宠物', kind: '灵感', t: '「新手养猫第一个月要买的 12 样」清单', why: '新算法把收藏率提到第一权重，清单式干货正是被反复保存、回看的类型，在 7 天慢推流下长尾最稳。还能自然挂车，一条内容同时喂饱宠物号和好物号。', kw: '新手养猫 清单 必买 避坑' },
  { id: 'w-pet-7', track: '宠物', kind: '爆款', t: '猫砂横评：结团 / 除臭 / 粉尘 三项实测', why: '猫砂已从耗材升级为「精致养宠必备」，四大需求都能拍出可视化对比。横评表格是典型高收藏内容，也是宠物用品带货转化最高的入口之一。', kw: '猫砂 横评 除臭 低尘 实测' },
  { id: 'w-pet-8', track: '宠物', kind: '灵感', t: '带毛孩子出门一整天（推车 / 车载窝 / 冲锋衣）', why: '52% 宠主携宠出行频次提升，千元以上宠物推车增速超 100%，人宠同款机能装备成新社交货币。出行 vlog 天然出片，装备可全程自然挂车。', kw: '带宠出行 宠物推车 车载窝 人宠同款' },
  { id: 'w-goods-5', track: '好物', kind: '爆款', t: '818 发现好物节「我抢了什么」开箱', why: '8/1-8/18 是抖音年度大促，8/18 为爆发日，百亿补贴升级为超值购频道，平台还开了短视频引流赛。大促期挂车视频自带流量与转化加权，错过就得等双十一。', kw: '抖音818 发现好物节 开箱' },
  { id: 'w-goods-6', track: '好物', kind: '灵感', t: '「XX 元搞定整个宿舍」开学季合集', why: '8 月下旬到 9 月初是学生党消费高峰，宿舍收纳 / 桌面神器 / 护眼台灯 / 便携小家电人群极其精准。合集型内容易收藏、客单低、冲动下单多，适合起量。', kw: '开学季 宿舍好物 学生党 合集' },
  { id: 'w-goods-7', track: '好物', kind: '爆款', t: '公园 mini 露营：一个包搞定户外一顿饭', why: '上半年平台户外商品售出超 10 亿单、短视频带动销售额 +71%；钛锅 +325%、卡式炉 +302%、喷雾水杯 +256%。轻量化场景出片好看，一条视频能自然串起 5-8 个链接。', kw: '公园露营 轻户外 便携炊具' },
  { id: 'w-goods-8', track: '好物', kind: '灵感', t: '厨房去油腻清单（附价格表，做成可截图）', why: '算法权重收藏率排第一，「清单 + 价格表 + 可截图」是最容易被存下来的形式，长尾比单推一件货强得多。厨房清洁本身痛点强、复购高、男女通吃。', kw: '厨房清洁 好物清单 去油污 平价' }
];
const ZM_WEEKLY_UPDATED = '2026-08-03';

// ===== 抖音算法机制（大数据推送）知识卡 =====
const ZM_ALGO = [
  { t: '核心逻辑', d: '去中心化推荐 + 阶梯式流量池 + 多维度考核。0 粉也能靠好内容突围；百万粉老号数据差照样限流。2026 的关键变化：已从「单条内容赛马」升级为「内容 + 创作者」双轨评估。' },
  { t: '双塔模型（新）', d: '推荐系统由单塔升级为「内容 + 创作者」双塔：除了这条视频本身，还综合账号原创率、粉丝平均停留时长、历史内容质量，算出一个账号信任权重（占比可达 30%）。真人出镜 + 垂直深耕 + 稳定更新的号，流量倾斜非常明显。' },
  { t: '7 级流量池', d: '初始池 50-200 → 基础池 500（2 秒停留≥65%）→ 待推荐池 1000（完播≥28%）→ 待爆池 1 万（收藏≥3%/评论≥1.5%）→ 热门池 10 万（叠加人工审核）→ 大爆款池 100-500 万（复访≥8%/铁粉互动≥5%）。' },
  { t: '赛马机制（赛程变长）', d: '同标签、同时段内容同台 PK，数据优者晋级。但赛程已从 24 小时拉长到 7 天——首发不爆不再等于判死刑，慢热干货有翻盘机会。' },
  { t: '7 天慢推流', d: '考核窗口从 24 小时扩到 168 小时（7 天），部分品类可观察到 30 天。发布后只要持续被收藏 / 复访，仍能二次、三次推流。别再发完就删低数据视频。' },
  { t: '2026 权重排序', d: '收藏率 > 复访回看 > 铁粉深度互动 > 整体停留时长 > 5 秒完播 > 评论质量 > 点赞。点赞已滑到末位——「随手认可」不值钱，「有用到想存起来」才值钱。' },
  { t: '收藏率是第一指标', d: '想被收藏，内容得有「保存价值」：①工具属性（步骤清单 / 尺寸对照 / 选购表）②认知增量（反常识、行业内幕）③方法体系（系列教程）。开头别硬憋悬念，直接点明「这条能帮你解决什么」。' },
  { t: '内容裁判机制（新）', d: '垂直领域的资深用户（长期看宠物、长期买好物的人）互动权重更高。一条走心的懂行评论，比 100 个路人点赞更能推动流量。评论区要认真回、引导专业讨论。' },
  { t: '标签三协同 → 动态预测', d: '账号标签 + 内容标签 + 兴趣标签仍是基础，但已从「静态关键词打标」转向「动态行为预测」，更看用户刷到后的实时反应。内容方向摇摆 = 算法锁不住人群 = 流量杂乱。' },
  { t: '铁粉机制', d: '新视频优先推给铁粉，铁粉互动权重远高于路人，变现价值也最高。养铁粉 = 稳定更新 + 固定栏目 + 按时直播 + 评论区维护。系列化内容是把路人熬成铁粉的最快路径。' },
  { t: '搜索流量破 50%', d: '抖音搜索流量占比已突破 50%，分发正从「推荐流驱动」转向「搜索流驱动」。标题 / 文案 / 口播要埋「品类 + 场景 + 人群」关键词（如「猫砂 除臭 低尘」），密度控制在 2%-3%：低了搜不到，高了触发堆砌检测。' },
  { t: '带货新规：分级技术服务费', d: '2026-07-08 起精选联盟废除统一 10% 技术服务费，改五档评级（每月 8 日更新、次月 9 日执行）：A 级全额返还实收 0%、B+ 级 5%-7%、B 级 10%、C 级 20%、D 级 40%。考核合规经营、结算健康度、稳定更新、内容原创度、带货转化。做好物号 = 别断更、别搬运、控退货。' },
  { t: '流量在往中小账号走', d: '新规下平台流量明显向「几百到几千粉的优质中小号」倾斜，靠套路博眼球的大号反而被收紧。对新号来说，现在是相对友好的窗口期。' },
  { t: '付费撬动', d: 'DOU+（加热视频）、巨量千川（电商直播）、小店随心推（电商短视频）——用于冷启动、测素材、打标签，替代不了内容本身。' },
  { t: '反作弊与原创', d: '搬运、批量 AI 剪辑、低质拼接会被卡在待推荐池，还会直接拉低带货评级。原创度已是晋级硬门槛。' }
];
const ZM_ALGO_UPDATED = '2026-08-03';

// ===== 自媒体运转模式 / 如何做 / 如何赚钱 =====
const ZM_MODE_FLOW = [
  { s: '内容生产', d: '垂直 + 人设 + 钩子，持续产出' },
  { s: '算法分发', d: '流量池赛马 → 拿到曝光' },
  { s: '用户行为', d: '完播 / 互动 / 关注 / 收藏' },
  { s: '粉丝资产', d: '沉淀可反复触达的粉丝' },
  { s: '变现', d: '带货 / 广告 / 知识付费 / 私域' },
  { s: '数据复盘', d: '反哺下一条内容' }
];
const ZM_MODE_NOTE = '平台不直接给你钱，而是用流量兑换你的「注意力价值」：好内容 → 平台给曝光 → 你积累粉丝 → 粉丝通过消费/广告/打赏变成收入。关键三句话：先做流量后变现、垂直胜泛流量、数据驱动迭代。';

const ZM_HOWTO = [
  { n: '选赛道', d: '做「小而美」垂直（宠物/好物），别碰泛娱乐、泛剧情、泛美妆——竞争大、变现弱。' },
  { n: '定人设', d: '具体身份+性格，如“边 996 边养猫的打工人”。人设越具体越易被记住，粉丝才记得你是谁。' },
  { n: '测内容', d: '前 10 条做 AB 测试，找“哪种场景+哪种情绪”最戳人，别追求条条爆。' },
  { n: '踩节点', d: '展会/大促/季节：618(+98%)、它博会(+237%)、亚宠展(+96%)、夏季降温防晒。' },
  { n: '做闭环', d: '短视频引流 + 挂车/直播 + 每周复盘，复制爆款结构放大。' }
];

const ZM_MONEY = [
  { tier: '0 粉就能做', items: [
    { n: '团购带货', d: '挂 POI 团购链接，按核销拿佣金 5%-30%，0 粉可开、无需保证金。' },
    { n: '种草激励计划', d: '拍开箱/测评，平台按搜索成交给分成，不用粉丝、不用带货资质。' },
    { n: '小说 / 短剧推广', d: '剪悬念片段挂官方链接，CPS 50%-70%，不露脸也能做。' },
    { n: '游戏发行人 / 全民任务', d: '按要求拍视频挂小游戏/短剧，按播放/点击/转化赚佣金。' },
    { n: '直播打赏', d: '实名即可开播，靠才艺/聊天赚音浪（平台 50% 分成）。' },
    { n: '图文带货', d: '拼图+文案+小黄车，2026 红利，0 粉可试、成本低。' }
  ] },
  { tier: '1000 粉', items: [
    { n: '商品橱窗 + 视频带货', d: '挂精选联盟商品，按成交拿佣金 10%-50%。' },
    { n: '直播带货', d: '从 30-80 元刚需品练手，真实测评+场景最易转化。' },
    { n: '本地商家代运营', d: '帮小店上架团购、拍视频、投同城流量，月服务费 2000-8000。' }
  ] },
  { tier: '1 万粉 +', items: [
    { n: '星图商单', d: '1 万粉≈500-2000 元/条，10 万粉 5000-2 万；垂直号报价高于泛娱乐 3-5 倍。' },
    { n: '广告分成 / 视频赞赏', d: '万粉开通，靠视频流量赚广告分成，粉丝可直接打赏。' },
    { n: '知识付费 / 付费专栏', d: '养宠/好物测评课，客单 99-1980，高利润长现金流。' },
    { n: '私域引流', d: '抖音引流微信，做高客单服务/社群/咨询。' }
  ] },
  { tier: '最适合你（宠物+好物）', items: [
    { n: '短视频 / 图文挂车带货', d: '佣金 10%-50%，宠物用品复购强、好物测评转化高，两个赛道都能挂。' },
    { n: '星图广告', d: '垂直宠物/好物号报价高，品牌最爱“真实养宠人+好物实测”人设。' },
    { n: '知识付费', d: '《新手养宠避坑》《平价好物测评课》等，一次制作长期变现。' },
    { n: '私域社群', d: '宠物交流群 / 好物团购群，复购与信任复利最高。' }
  ] }
];
const ZM_MONEY_TIP = '避坑：不买粉、不搬运、不发敏感；选品定生死（刚需高频+低客单+高佣）；新手先做低价高转化，别贪高客单。';

// ===== 自媒体怎么赚钱 · 流动深读（按日期轮流更新，每天一篇） =====
const ZM_MONETIZE = [
  {
    id: 'douyin-touliu', cat: '投流机制', title: '抖音投流机制：ROI 是怎么算出来的',
    summary: '为什么有的直播间"烧钱不赚钱"？拆解自然流量（O 端）与付费流量如何叠加，eCPM、GPM、千川怎么配合。',
    body: [
      '抖音流量是"分层赛马"：内容先进小流量池，完播/互动/转化达标才进更大池；付费投流（千川/随心推）是把内容推给"更可能转化"的人，和自然流量叠加，不是替代。',
      '核心指标：eCPM=预估千次曝光收益，决定你能不能抢到流量；GPM=千次曝光成交金额，是直播间健康度的命门；ROI=成交金额/消耗，>1 才不亏（还得再扣退货、物流、佣金）。',
      '可操作：①先测自然模型（不投流也能出单）再小预算"放量"；②人群包从"相似达人粉丝/成交人群"起步，别一上来通投；③看 GPM 而非只盯在线人数——高人气低 GPM 是虚火；④单计划 ROI 连续低于 0.8 及时关停，避免"为爱发电"。',
      '误区：以为"投了就有量"——素材/承接不行，投流只是加速亏钱；把"消耗"当成"投入产出"。',
      '案例：一条短视频自然跑出 5 万播放、GPM 800，再投 500 元千川放大到 30 万播放、成交 1.2 万，ROI 2.4——前提是自然模型已被验证。'
    ]
  },
  {
    id: 'xiaohongshu-touliu', cat: '投流机制', title: '小红书投流：搜索流量 + 信息流的双引擎',
    summary: '小红书跟抖音不一样——搜索占比高，"种草"靠笔记权重，投流是"加速"不是"凭空造"。',
    body: [
      '双引擎：信息流（发现页，靠封面标题点击率）+ 搜索流（用户主动搜"XX 怎么选"，购买意图强）。小红书用户习惯"搜完再买"，搜索流转化往往更稳。',
      '笔记权重（自然）：封面点击率、互动率（赞藏评）、搜索收录、关键词布局。投流前先让笔记自然跑出"搜得到、点得开、留得下"。',
      '可操作：①标题/正文埋"长尾关键词"（如"油皮平价防晒 学生党"），别只堆热词；②信息流测封面（3–5 版 A/B），选 CTR 高的加码；③搜索流投"品类词+场景词"，抢购买意图；④薯条/聚光从小额测试，看"赞藏成本"和"搜索进店率"。',
      '误区：投流买"赞藏"刷数据——平台识别异常互动会降权；笔记没收录就投，钱打水漂。',
      '案例：一篇"租房好物"笔记自然获 2000 赞，投 300 元搜索流（词"租房必备"），带来 1.1 万阅读、带货 80 单——因为搜索意图精准。'
    ]
  },
  {
    id: 'live-commission', cat: '直播带货', title: '直播带货分佣真相：坑位费 / 佣金 / 退货率',
    summary: '你看到的"GMV 破亿"主播赚多少？拆解坑位费、佣金、退货率三道坎。',
    body: [
      '两种合作：①坑位费（固定出场费，大主播常见，几万到几百万）+ 佣金（GMV 的 10–30%）；②纯佣金（中小主播/CPS，按成交抽成，风险共担）。',
      '退货率吞噬利润：服饰/美妆退货率常 30–60%，"GMV"≠"实收"。平台按 GMV 抽佣、达人按 GMV 抽佣，但退货后商家要退、达人佣金有时也退——算 ROI 必须按"确认收货后净额"。',
      '可操作（商家视角）：①算"到手 ROI"=净利/(坑位+佣金+投流)，别被 GMV 迷惑；②选"佣金+低坑位"或纯佣达人，先小单测转化；③控制退货：详情页如实、尺码表清晰、发货快；④自播沉淀私域，降低对头部主播依赖。',
      '误区：盲目追大主播坑位费，ROI 可能为负；只看 GMV 不看退货和退款。',
      '案例：坑位 20 万+佣金 20%，GMV 150 万，退货 50%→实收 75 万，佣金 15 万+坑位 20 万=35 万，货成本 45 万→净亏 5 万（还没算投流）。'
    ]
  },
  {
    id: 'short-video-tuangou', cat: '短视频带货', title: '短视频带货（橱窗/小黄车）：选品比文案重要',
    summary: '不直播也能卖货——短视频挂车靠"场景化种草 + 精准选品"。',
    body: [
      '逻辑：短视频做"使用场景/痛点"内容 → 挂小黄车/橱窗 → 用户被种草直接下单。适合客单低、决策快、有视觉冲击的品（家居神器、食品、美妆工具）。',
      '选品是核心：单条收益=佣金率×转化率×客单。高佣低转化不如中佣高转化。看选品库的转化率与带货口碑而非只盯佣金比例。',
      '可操作：①选题从"我踩过的坑/真实使用"出发，别硬广；②视频前 3 秒抛痛点，中间演示，结尾挂车；③批量测 10–20 条，留下跑出转化的复制放大；④挂车标题写"好处+人群"（如"油头救星 学生党 39 元"）。',
      '误区：什么火带什么（同质化、无信任）；一条不爆就放弃（短视频是概率战，靠量+迭代）。',
      '案例：一条"厨房去油神器"实拍，挂车客单 39、佣金 30%，自然 8 万播放成交 600 单→佣金 7000，零投流。'
    ]
  },
  {
    id: 'private-domain', cat: '私域变现', title: '私域变现：把粉丝变成可复购的资产',
    summary: '公域流量越来越贵，私域（微信/企微/社群）是把一次性流量变成"能反复卖"的资产。',
    body: [
      '为什么重要：公域获客成本（CAC）逐年涨，私域复购几乎零边际成本。一个 500 人精准社群，月复购可能顶得上 5 万公域曝光。',
      '路径：公域内容/直播 → 引导加企微/进群（钩子：资料包、优惠券、1v1 咨询）→ 朋友圈/社群运营 → 复购+转介绍。',
      '可操作：①钩子要"高价值低门槛"（如免费模板、答疑）；②企微打标签分层（新客/老客/沉睡），发不同内容；③社群别只发广告——60% 价值内容+30% 互动+10% 转化；④用 SOP 自动化欢迎/跟进，但保留真人感。',
      '误区：一上来就拼命发广告→被删；把私域当"免费群发器"（微信封控+掉粉）；不分层一刀切。',
      '案例：知识博主把直播观众导 2000 企微，每月社群推 1 次专栏，复购率 25%，比纯公域 GMV 稳定且毛利高。'
    ]
  },
  {
    id: 'knowledge-pay', cat: '知识付费', title: '知识付费：从专栏到训练营的转化漏斗',
    summary: '知识怎么变成钱？拆解"免费引流→低价体验→高价交付"的漏斗。',
    body: [
      '漏斗：短视频/直播免费内容（建立信任）→ 9.9 体验课/资料包（低门槛）→ 199–999 系统课/训练营（核心利润）→ 1v1 咨询/高阶社群（高客单）。',
      '关键：前端内容必须"真有用+可验证"，信任够了才有人付费。交付质量决定复购和口碑（转介绍是最便宜的流量）。',
      '可操作：①先打磨一门"标杆课"再扩品类；②体验课设计成"让学员拿到一个小结果"，自然升单；③训练营用"作业+点评+社群"提高完课率（完课率高→好评多→转化高）；④用企业微信/小鹅通等工具做交付与续费提醒。',
      '误区：只卖课不交付（差评反噬）；课程堆时长不重结果；定价拍脑袋不测意愿。',
      '案例：理财博主免费讲"记账 3 招"→9.9 记账表→699 训练营（完课率 70%、转介绍 30%），单月 40 万。'
    ]
  },
  {
    id: 'ad-platform', cat: '广告接单', title: '广告接单（星图/蒲公英）：报价的底层逻辑',
    summary: '达人怎么靠"接广告"赚钱？拆解报价、CPM、保量条款。',
    body: [
      '平台：抖音星图、小红书蒲公英、B站花火——品牌方通过平台下单，达人收"商单"费用，平台抽约 10%。',
      '报价逻辑：通常按"粉丝量×单价 + 近期数据（阅读/播放/互动）"评估；垂类（美妆/3C/母婴）单价高于泛娱乐。CPM（千次曝光成本）是品牌核心考核。',
      '可操作（达人）：①稳定更新+清晰人设，商单才多；②报价参考"近 30 天平均播放×行业 CPM"，别盲目对标头部；③看"保量条款"（平台常承诺曝光保底，未达补量）；④接与调性相符的品牌，保护账号权重和粉丝信任。',
      '误区：为钱接不相关/夸大宣传的广告→掉粉+限流；刷数据接单（平台识别后封号风险）。',
      '案例：50 万粉垂类达人，近 30 天均播 15 万，行业 CPM 约 20 元→单条报价≈3000+，含保量。'
    ]
  },
  {
    id: 'mcn-model', cat: '行业背后', title: '行业背后故事：MCN 怎么赚钱',
    summary: '你以为 MCN 靠"捧红达人"？真相是"保底+分成+中介+培训"四件套。',
    body: [
      'MCN 盈利来源：①签约达人抽成（直播/商单收入的 10–30% 分成）；②给达人发"保底工资"换更长合约和更高抽成（赌达人能起来）；③中介撮合商单赚差价；④卖课/培训/代运营（To B 服务，最稳的现金流）。',
      '真相：能跑出头部达人的概率极低，MCN 多数利润来自"批量中腰部达人矩阵 + To B 服务"，而非单靠造星。',
      '可操作（想签 MCN）：①看清分成比例、合约期限、解约条款（天价违约金是坑）；②问清"保底是否要达标才发、商单是否透明"；③保留自己账号所有权与私域；④优先选"不压账号、分成合理、有真实资源"的。',
      '误区：以为签约就有人捧你——多数新人只是"被抽成"；忽略解约成本。',
      '案例：某 MCN 签 200 达人，仅 3 个头部贡献 60% 利润，其余靠代运营/培训养团队。'
    ]
  },
  {
    id: 'viral-cost', cat: '行业背后', title: '行业背后故事：一条"爆款"的真实成本结构',
    summary: '你看到的"随手拍就火了"，背后可能是投流+加热+矩阵的精密算账。',
    body: [
      '成本结构：①内容制作（拍摄/剪辑/脚本，团队或外包）；②投流加热（千川/薯条，少则几百多则几十万）；③矩阵铺量（多个号同时发，赌概率）；④水军/数据（部分灰色，平台严打，风险高）。',
      '真相：很多"爆款"是"小预算测出模型→大预算放量"的结果，不是运气。账号能稳定变现，靠的是"单位经济模型为正"（每条内容 ROI>1）。',
      '可操作（普通创作者）：①先验证"不投流也能出单/涨粉"的最小模型；②把投流当"放大器"而非"救命药"；③做内容矩阵分散风险；④盯单位 ROI，不追虚播放。',
      '误区：盲目模仿爆款形式忽视自己的供应链/人设；为数据刷量踩平台红线被封。',
      '案例：一个家居号，先 3 个月自然起号验证"实用测评"模型，再每月投 2 万放大，月净利从 0 到 6 万——前提模型已正。'
    ]
  },
  {
    id: 'why-90-fail', cat: '行业背后', title: '行业背后故事：为什么 90% 新人赚不到钱',
    summary: '不是"平台不给你机会"，是冷启动的认知误区把大多数人挡在门外。',
    body: [
      '常见死法：①急于变现，粉丝 0 信任就硬广→掉粉；②内容没差异化，在红海里卷；③不数据复盘，一条不火就换方向；④低估"持续输出"的体力活，更新断更；⑤把"播放量"当"收入"，没设计变现路径。',
      '机制：平台给新号"冷启动流量"但极短（前几条定调性），不达标就进"低权重池"；内容是"概率+复利"，靠量×迭代×时间。',
      '可操作：①先定"人设+赛道+变现路径"三件套再动笔；②前 30 条只练"选题+开头+完播"，不计较单条；③每周复盘留存/转化数据，不是只看赞；④设计"引流→低价→高价"漏斗，哪怕现在只做免费。',
      '误区：等"灵感"才更；盲目追热点丢人设；把同行当敌人而非学习对象。',
      '结论：赚到钱的人，几乎都是"先有价值→再有流量→最后变现"的慢变量玩家。'
    ]
  }
];
let zmMoneyOffset = 0;
function zmDayIndex(n) { var d = new Date(); var start = new Date(d.getFullYear(), 0, 0); return Math.floor((d - start) / 86400000) % n; }
function renderZmMoneyFlow() {
  var c = document.getElementById('zm-money-flow'); if (!c) return;
  var n = ZM_MONETIZE.length;
  var idx = (zmDayIndex(n) + zmMoneyOffset) % n; if (idx < 0) idx += n;
  var feat = ZM_MONETIZE[idx];
  var tds = zmDateKey();
  var list = ZM_MONETIZE.map(function (a) {
    return '<button class="zm-mz-item" onclick="zmReadMonetize(\'' + a.id + '\')"><span class="zm-mz-cat">' + zmEsc(a.cat) + '</span><b>' + zmEsc(a.title) + '</b><span class="zm-mz-sum">' + zmEsc(a.summary) + '</span></button>';
  }).join('');
  c.innerHTML = `
    <div class="zm-mz-featured">
      <div class="zm-mz-flag">📌 今日深读 · ${tds} · 第 ${idx + 1}/${n} 篇（每天轮换）</div>
      <div class="zm-mz-title">${zmEsc(feat.title)}</div>
      <div class="zm-mz-cat-line"><span class="zm-mz-cat">${zmEsc(feat.cat)}</span></div>
      <p class="zm-mz-summary">${zmEsc(feat.summary)}</p>
      <button class="zm-mz-read" onclick="zmReadMonetize('${feat.id}')">读全文（${feat.body.length} 段）↗</button>
      <button class="zm-mz-next" onclick="zmMoneyNext()">换一篇 ›</button>
    </div>
    <div class="zm-mz-list-head">全部专题（点开即读，随时可看）</div>
    <div class="zm-mz-list">${list}</div>`;
}
function zmMoneyNext() { zmMoneyOffset++; if (zmContainer) renderZimeiti(zmContainer); else renderZmMoneyFlow(); }
function zmReadMonetize(id) {
  var a = ZM_MONETIZE.find(function (x) { return x.id === id; }); if (!a) return;
  var html = '<div class="zm-mz-full"><div class="zm-mz-cat-line"><span class="zm-mz-cat">' + zmEsc(a.cat) + '</span></div>' + a.body.map(function (p) { return '<p>' + zmEsc(p) + '</p>'; }).join('') + '</div>';
  if (window.openZoom) window.openZoom('💡 ' + a.title, html);
}


// ===== 状态 =====
let currentZmTab = 'idea';
let currentZmIdeaCat = '__init__';
let zmContainer = null;
let zmTrack = '宠物'; // '宠物' | '好物'

// ===== 工具 =====
function zmDouyin(kw) { return 'https://www.douyin.com/search/' + encodeURIComponent(kw || ''); }
function zmDateKey(d) { d = d || new Date(); var p = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); }
function zmEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function zmTrackCls(t) { return t === '宠物' ? 'zm-tag-pet' : (t === '好物' ? 'zm-tag-goods' : 'zm-tag-all'); }
function zmDayIdx() { return Math.floor((Date.now() - new Date(2026, 0, 1)) / 86400000); }

// ===== 每日灵感来源（每天 1 批，宠物 + 好物 各 1） =====
function ensureZmInspiration(force) {
  if (typeof ZM_IDEA_POOL === 'undefined' || !ZM_IDEA_POOL.length) return;
  var list = loadData('mw_zm_inspiration', []);
  var today = zmDateKey();
  if (!force && list.length && list[0] && list[0].date === today) return;
  var pets = ZM_IDEA_POOL.filter(function (x) { return x.track === '宠物'; });
  var goods = ZM_IDEA_POOL.filter(function (x) { return x.track === '好物'; });
  var dayIdx = zmDayIdx();
  var pick = [pets[dayIdx % pets.length], goods[dayIdx % goods.length]];
  list.unshift({ date: today, items: pick.map(function (x) { return x.id; }) });
  if (list.length > 30) list = list.slice(0, 30);
  saveData('mw_zm_inspiration', list);
}

// ===== 每日热点挑选（按赛道） =====
function zmDailyPick(track) {
  var dayIdx = zmDayIdx();
  var arr = track === '宠物' ? ZM_DAILY_PET : ZM_DAILY_GOODS;
  var hot = arr[dayIdx % arr.length];
  var broadens = track === '宠物' ? [
    '给今天的热点加一个「反常识开头」，完播率往往差 3 倍。',
    '把热点做成连续 3 天的系列（如训练打卡），关注率比单条高很多。',
    '用 AI 配音给宠物加内心戏，低成本产出有记忆点的内容。',
    '在标题/文案埋「宠物 / 萌宠」赛道关键词，吃搜索流量（已破 50%）。',
    '结合喂养场景（冻干/低温烘焙）天然带算法加权，拍开袋瞬间。'
  ] : [
    '开头用「反向种草」假装吐槽再反转安利，转化反差感拉满。',
    '做成「痛点+场景实测+福利促单」黄金结构，电商转化率高。',
    '用平价神器合集（XX 元能买到什么）快速起量、冲动下单多。',
    '在标题/文案埋「好物 / 平价 / 测评」关键词，吃搜索流量（已破 50%）。',
    '结合夏季降温/防晒等季节风口，提前布局吃搜索红利。'
  ];
  var theme = '今天用「' + hot.t + '」做' + (track === '宠物' ? '宠物' : '好物') + '内容钩子' + (track === '宠物' ? '，用宠物出镜带出信任感，顺势承接好物转化。' : '，用真实测评+场景展示建立信任，承接搜索流量。');
  return { hot: hot, broaden: broadens[dayIdx % broadens.length], theme: theme };
}

// ===== 主渲染（track: 'pet' | 'goods'） =====
function renderZimeiti(c, track) {
  zmContainer = c;
  if (track) zmTrack = (track === 'goods') ? '好物' : '宠物';
  if (currentZmIdeaCat === '__init__') currentZmIdeaCat = zmTrack;
  var isPet = zmTrack === '宠物';
  ensureZmInspiration();
  var dp = zmDailyPick(zmTrack);
  var mine = loadData('mw_zm_daily_mine', []);
  var dashArr = isPet ? ZM_DAILY_PET : ZM_DAILY_GOODS;
  var rankArr = isPet ? ZM_RANK_PET : ZM_RANK_GOODS;
  c.innerHTML = `
    <div class="module-content zm-module">
      <div class="module-header">
        <div>
          <h1><i class="${isPet ? 'fas fa-paw' : 'fas fa-gift'}"></i> ${isPet ? '宠物部' : '好物部'}</h1>
          <div class="subtitle">${isPet ? '宠物赛道' : '好物推荐'} — 每日热点 / 选题灵感 / 爆款二创 / 复盘&选题 / 预计完成 / 内容文案 / 运营学院</div>
        </div>
      </div>

      <div class="zm-note">
        <i class="fas fa-info-circle"></i>
        <span>「${isPet ? '宠物部' : '好物部'}」已按赛道独立拆分，只显示本赛道内容。热点为「选题灵感 + 爆款形式 + 运营知识」原创整理（基于 2026 公开趋势研究）；内置「去抖音看同类爆款」用网页搜索链接，电脑/手机都能打开。真实某条视频请粘贴你找到的链接。每周一会自动补充 5-10 条「本周灵感」到「复盘&选题」tab 供你筛选。</span>
      </div>

      <section class="zm-dash">
        <div class="zm-dash-head">
          <span><i class="fas fa-calendar-day"></i> 每日热点仪表盘</span>
          <span class="zm-dash-date">${zmDateKey()}</span>
          <button class="zm-mini-btn" onclick="refreshZmDaily()"><i class="fas fa-sync-alt"></i> 刷新今日</button>
        </div>

        <div class="zm-theme-card">
          <div class="zm-theme-label"><i class="fas fa-crosshairs"></i> 今日拍摄主题推荐</div>
          <div class="zm-theme-body">${zmEsc(dp.theme)}</div>
          <div class="zm-theme-broaden"><i class="fas fa-lightbulb"></i> 思路拓宽：${zmEsc(dp.broaden)}</div>
        </div>

        <div class="zm-dash-cols">
          <div class="zm-dash-col">
            <h4 class="zm-dash-h ${isPet ? 'zm-dash-h-pet' : 'zm-dash-h-goods'}"><i class="${isPet ? 'fas fa-paw' : 'fas fa-gift'}"></i> ${isPet ? '🐾 宠物热点' : '🎁 好物热点'}</h4>
            <ul class="zm-dash-list">
              ${dashArr.map(function (x) {
                return '<li><span class="zm-dash-t">' + zmEsc(x.t) + '</span><span class="zm-dash-d">' + zmEsc(x.d) + '</span><a class="zm-link" href="' + zmDouyin(x.kw) + '" target="_blank" rel="noopener">看同类 ↗</a></li>';
              }).join('')}
            </ul>
          </div>
          <div class="zm-dash-col">
            <h4 class="zm-dash-h zm-dash-h-rank"><i class="fas fa-trophy"></i> 🏆 排行榜（参考）</h4>
            <div class="zm-rank-block">
              <div class="zm-rank-sub">${isPet ? '宠物高热方向' : '好物高热品类'}</div>
              ${rankArr.map(function (x, i) {
                return '<div class="zm-rank-item"><span class="zm-rank-no">' + (i + 1) + '</span><span class="zm-rank-t">' + zmEsc(x.t) + '</span><span class="zm-rank-d">' + zmEsc(x.d) + '</span><a class="zm-link" href="' + zmDouyin(x.kw) + '" target="_blank" rel="noopener">↗</a></div>';
              }).join('')}
            </div>
          </div>
        </div>

        <div class="zm-dash-add">
          <input id="zm-daily-kw" class="zm-input" placeholder="粘贴你今天抓到的真实热点 / 视频链接（可正常打开）">
          <button class="zm-btn" onclick="addZmDaily()"><i class="fas fa-plus"></i> 添加</button>
        </div>
        ${mine.length ? `
        <div class="zm-dash-mine">
          <div class="zm-dash-mine-title"><i class="fas fa-bookmark"></i> 我抓取的热点（${mine.length}）</div>
          ${mine.map(function (m) {
            return '<div class="zm-mine-item"><div class="zm-mine-head"><span class="zm-mine-date">' + m.date + '</span><button class="zm-mini-btn" onclick="delZmDaily(\'' + m.id + '\')"><i class="fas fa-trash"></i></button></div>' + (m.link ? '<a class="zm-mine-link" href="' + zmEsc(m.link) + '" target="_blank" rel="noopener">' + zmEsc(m.link) + ' ↗</a>' : '<span class="zm-mine-nolink">' + zmEsc(m.text) + '</span>') + '</div>';
          }).join('')}
        </div>` : ''}
      </section>

      <div class="book-tabs">
        <button class="book-tab ${currentZmTab === 'idea' ? 'active' : ''}" onclick="switchZmTab('idea')"><i class="fas fa-lightbulb"></i> 选题灵感</button>
        <button class="book-tab ${currentZmTab === 'hot' ? 'active' : ''}" onclick="switchZmTab('hot')"><i class="fas fa-fire"></i> 爆款二创</button>
        <button class="book-tab ${currentZmTab === 'review' ? 'active' : ''}" onclick="switchZmTab('review')"><i class="fas fa-chart-line"></i> 复盘&选题</button>
        <button class="book-tab ${currentZmTab === 'plan' ? 'active' : ''}" onclick="switchZmTab('plan')"><i class="fas fa-tasks"></i> 预计完成</button>
        <button class="book-tab ${currentZmTab === 'copy' ? 'active' : ''}" onclick="switchZmTab('copy')"><i class="fas fa-pen"></i> 内容文案</button>
        <button class="book-tab ${currentZmTab === 'academy' ? 'active' : ''}" onclick="switchZmTab('academy')"><i class="fas fa-graduation-cap"></i> 运营学院</button>
      </div>
      <div id="zm-content"></div>
    </div>
  `;
  var cc = document.getElementById('zm-content');
  if (currentZmTab === 'idea') renderZmIdea(cc);
  else if (currentZmTab === 'hot') renderZmHot(cc);
  else if (currentZmTab === 'review') renderZmPick(cc);
  else if (currentZmTab === 'plan') renderZmPlan(cc);
  else if (currentZmTab === 'copy') renderZmCopy(cc);
  else renderZmAcademy(cc);
}

function refreshZmDaily() { ensureZmInspiration(true); if (zmContainer) renderZimeiti(zmContainer); showToast('已刷新今日灵感'); }

function addZmDaily() {
  var el = document.getElementById('zm-daily-kw');
  var v = el ? el.value.trim() : '';
  if (!v) { showToast('先粘贴热点或链接', 'error'); return; }
  var isLink = /^https?:\/\//i.test(v);
  var mine = loadData('mw_zm_daily_mine', []);
  mine.unshift({ id: 'zd-' + Date.now(), text: isLink ? '' : v, link: isLink ? v : '', date: zmDateKey() });
  if (mine.length > 50) mine = mine.slice(0, 50);
  saveData('mw_zm_daily_mine', mine);
  showToast('已记录今天抓取的热点');
  if (zmContainer) renderZimeiti(zmContainer);
}
function delZmDaily(id) {
  var mine = loadData('mw_zm_daily_mine', []).filter(function (m) { return m.id !== id; });
  saveData('mw_zm_daily_mine', mine);
  if (zmContainer) renderZimeiti(zmContainer);
}

function switchZmTab(t) {
  currentZmTab = t;
  if (zmContainer) renderZimeiti(zmContainer);
}

// ===== 板块一：选题灵感 =====
function renderZmIdea(c) {
  var insp = loadData('mw_zm_inspiration', []);
  var saved = loadData('mw_zm_ideas', []);
  var savedMap = {};
  saved.forEach(function (s) { savedMap[s.id] = s.status; });
  var today = insp.length ? insp[0] : null;
  var pool = ZM_IDEA_POOL.filter(function (x) {
    return currentZmIdeaCat === 'all' || x.track === currentZmIdeaCat;
  });
  var cats = ['all', '宠物', '好物'];

  function ideaCard(x) {
    var st = savedMap[x.id] || '';
    var btns = `
      <button class="zm-mini-btn ${st === 'want' ? 'on' : ''}" onclick="saveZmIdea('${x.id}','want')"><i class="fas fa-bookmark"></i> 想做</button>
      <button class="zm-mini-btn ${st === 'done' ? 'on' : ''}" onclick="saveZmIdea('${x.id}','done')"><i class="fas fa-check"></i> 已拍</button>
      <a class="zm-link" href="${zmDouyin(x.kw)}" target="_blank" rel="noopener">去抖音看同类爆款 ↗</a>`;
    return `
      <div class="zm-card">
        <div class="zm-card-top">
          <span class="zm-tag ${zmTrackCls(x.track)}">${x.track}</span>
          ${st === 'done' ? '<span class="zm-done-flag">已拍</span>' : ''}
        </div>
        <h3 class="zm-card-title">${zmEsc(x.title)}</h3>
        <p class="zm-card-angle">${zmEsc(x.angle)}</p>
        <p class="zm-card-why"><i class="fas fa-lightbulb"></i> ${zmEsc(x.why)}</p>
        <div class="zm-card-actions">${btns}</div>
      </div>`;
  }

  c.innerHTML = `
    <div class="zm-idea-wrap">
      ${today ? `
      <div class="zm-today">
        <h3><i class="fas fa-sun"></i> 今日灵感（${today.date} · ${zmTrack}）</h3>
        <div class="zm-card-row">
          ${today.items.map(function (id) {
            var x = ZM_IDEA_POOL.find(function (p) { return p.id === id; });
            return x && x.track === zmTrack ? ideaCard(x) : '';
          }).join('')}
        </div>
      </div>` : ''}

      <div class="zm-cats">
        ${cats.map(function (cat) { return `<button class="book-cat-chip ${cat === currentZmIdeaCat ? 'active' : ''}" onclick="switchZmIdeaCat('${cat}')">${cat === 'all' ? '全部' : cat}</button>`; }).join('')}
      </div>

      <div class="zm-card-grid">
        ${pool.map(ideaCard).join('')}
      </div>

      ${saved.length ? `
      <div class="zm-saved">
        <h4><i class="fas fa-bookmark"></i> 我的选题（${saved.length}）</h4>
        <div class="zm-saved-list">
          ${saved.map(function (s) {
            var x = ZM_IDEA_POOL.find(function (p) { return p.id === s.id; });
            if (!x) return '';
            return `<span class="zm-saved-item ${s.status === 'done' ? 'done' : ''}">${zmEsc(x.title)} ${s.status === 'done' ? '✓' : '·'}</span>`;
          }).join('')}
        </div>
      </div>` : ''}
    </div>
  `;
}

function switchZmIdeaCat(cat) { currentZmIdeaCat = cat; if (zmContainer) renderZimeiti(zmContainer); }

function saveZmIdea(id, status) {
  var saved = loadData('mw_zm_ideas', []);
  var idx = saved.findIndex(function (s) { return s.id === id; });
  if (idx >= 0) {
    if (saved[idx].status === status) saved.splice(idx, 1);
    else saved[idx].status = status;
  } else {
    saved.push({ id: id, status: status });
  }
  saveData('mw_zm_ideas', saved);
  if (zmContainer) renderZimeiti(zmContainer);
}

// ===== 板块二：爆款二创 =====
function renderZmHot(c) {
  var mine = loadData('mw_zm_hot', []);
  c.innerHTML = `
    <div class="zm-hot-wrap">
      <div class="zm-section-title"><i class="fas fa-fire"></i> 爆款形式 · 二创改编模板</div>
      <div class="zm-card-grid">
        ${ZM_HOT_POOL.filter(function (x) { return x.track === zmTrack || x.track === '通用'; }).map(function (x) {
          return `
          <div class="zm-card">
            <div class="zm-card-top">
              <span class="zm-tag ${zmTrackCls(x.track)}">${x.track}</span>
              <span class="zm-format">${zmEsc(x.format)}</span>
            </div>
            <p class="zm-card-angle"><b>怎么改编成你的版本：</b>${zmEsc(x.adapt)}</p>
            <p class="zm-card-why"><i class="fas fa-quote-left"></i> 开头示范：${zmEsc(x.hook)}</p>
            <div class="zm-card-actions">
              <a class="zm-link" href="${zmDouyin(x.kw)}" target="_blank" rel="noopener">去抖音看同类爆款 ↗</a>
            </div>
          </div>`;
        }).join('')}
      </div>

      <div class="zm-add-hot">
        <h4><i class="fas fa-plus-circle"></i> 我发现的爆款（粘贴真实链接，可正常打开）</h4>
        <div class="zm-form-row">
          <select id="zm-hot-platform" class="zm-input">
            <option value="抖音">抖音</option>
            <option value="小红书">小红书</option>
            <option value="视频号">视频号</option>
            <option value="其他">其他</option>
          </select>
          <input id="zm-hot-link" class="zm-input" placeholder="粘贴视频链接（如 v.douyin.com/...）">
        </div>
        <textarea id="zm-hot-note" class="zm-textarea" placeholder="备注：为什么火 / 我可以怎么二创（选填）"></textarea>
        <button class="zm-btn" onclick="addZmHot()"><i class="fas fa-save"></i> 保存这条爆款</button>
      </div>

      ${mine.length ? `
      <div class="zm-mine-list">
        <h4><i class="fas fa-list"></i> 我的爆款库（${mine.length}）</h4>
        ${mine.map(function (m) {
          return `
          <div class="zm-mine-item">
            <div class="zm-mine-head">
              <span class="zm-tag ${zmTrackCls(m.platform === '抖音' ? '宠物' : '好物')}">${zmEsc(m.platform)}</span>
              <span class="zm-mine-date">${m.date}</span>
              <button class="zm-mini-btn" onclick="delZmHot('${m.id}')"><i class="fas fa-trash"></i></button>
            </div>
            ${m.link ? `<a class="zm-mine-link" href="${zmEsc(m.link)}" target="_blank" rel="noopener">${zmEsc(m.link)} ↗</a>` : '<span class="zm-mine-nolink">（未填链接）</span>'}
            ${m.note ? `<p class="zm-mine-note">${zmEsc(m.note)}</p>` : ''}
          </div>`;
        }).join('')}
      </div>` : '<p class="zm-empty">还没有收藏的爆款，看到好视频就粘进来吧。</p>'}
    </div>
  `;
}

function addZmHot() {
  var platform = document.getElementById('zm-hot-platform').value;
  var link = document.getElementById('zm-hot-link').value.trim();
  var note = document.getElementById('zm-hot-note').value.trim();
  if (!link && !note) { showToast('至少填链接或备注', 'error'); return; }
  var mine = loadData('mw_zm_hot', []);
  mine.unshift({ id: 'zh-' + Date.now(), platform: platform, link: link, note: note, date: zmDateKey() });
  saveData('mw_zm_hot', mine);
  showToast('已保存到爆款库');
  if (zmContainer) renderZimeiti(zmContainer);
}

function delZmHot(id) {
  var mine = loadData('mw_zm_hot', []).filter(function (m) { return m.id !== id; });
  saveData('mw_zm_hot', mine);
  if (zmContainer) renderZimeiti(zmContainer);
}

// ===== 板块三：复盘&选题（本周灵感 inbox + 复盘） =====
function zmReviewHTML() {
  var reviews = loadData('mw_zm_review', []);
  var __h = `
    <div class="zm-review-wrap">
      <div class="zm-add-review">
        <h4><i class="fas fa-pen"></i> 复盘一次发布</h4>
        <div class="zm-form-row">
          <input id="zm-rv-date" class="zm-input" type="date" value="${zmDateKey()}">
          <select id="zm-rv-platform" class="zm-input">
            <option value="抖音">抖音</option><option value="小红书">小红书</option><option value="视频号">视频号</option>
          </select>
          <select id="zm-rv-type" class="zm-input">
            <option value="宠物">宠物</option><option value="好物">好物</option>
          </select>
        </div>
        <input id="zm-rv-topic" class="zm-input" placeholder="选题 / 产品名">
        <input id="zm-rv-link" class="zm-input" placeholder="视频链接（选填，粘贴真实链接）">
        <div class="zm-form-row">
          <input id="zm-rv-views" class="zm-input" type="number" placeholder="播放量">
          <input id="zm-rv-likes" class="zm-input" type="number" placeholder="点赞">
          <input id="zm-rv-comments" class="zm-input" type="number" placeholder="评论">
        </div>
        <textarea id="zm-rv-strength" class="zm-textarea" placeholder="这次哪里做得好（自评优势）"></textarea>
        <textarea id="zm-rv-weak" class="zm-textarea" placeholder="这次哪里不足（自评短板）"></textarea>
        <div class="zm-checks">
          <div class="zm-checks-title">逐项勾选「本次做到了」——未勾的会生成优化建议：</div>
          ${ZM_REVIEW_CHECKS.map(function (ck) {
            return `<label class="zm-check"><input type="checkbox" id="zmck-${ck.key}"> <span>${zmEsc(ck.q)}</span></label>`;
          }).join('')}
        </div>
        <button class="zm-btn" onclick="saveZmReview()"><i class="fas fa-save"></i> 保存复盘</button>
      </div>

      ${reviews.length ? `
      <div class="zm-review-list">
        <h4><i class="fas fa-history"></i> 复盘记录（${reviews.length}）</h4>
        ${reviews.map(function (r) {
          return `
          <div class="zm-review-item">
            <div class="zm-review-head">
              <span class="zm-tag ${zmTrackCls(r.type)}">${zmEsc(r.type)}</span>
              <b>${zmEsc(r.topic)}</b>
              <span class="zm-mine-date">${r.date} · ${zmEsc(r.platform)}</span>
            </div>
            ${r.link ? `<a class="zm-mine-link" href="${zmEsc(r.link)}" target="_blank" rel="noopener">${zmEsc(r.link)} ↗</a>` : ''}
            <div class="zm-review-data">播放 ${r.views || '-'} ｜ 点赞 ${r.likes || '-'} ｜ 评论 ${r.comments || '-'}</div>
            ${r.strength ? `<p class="zm-rv-line"><b>优势：</b>${zmEsc(r.strength)}</p>` : ''}
            ${r.weak ? `<p class="zm-rv-line"><b>不足：</b>${zmEsc(r.weak)}</p>` : ''}
            ${r.suggestions && r.suggestions.length ? `
              <div class="zm-suggest">
                <div class="zm-suggest-title"><i class="fas fa-wrench"></i> 优化建议</div>
                <ul>${r.suggestions.map(function (s) { return '<li>' + zmEsc(s) + '</li>'; }).join('')}</ul>
              </div>` : ''}
            ${r.nextOpt ? `<p class="zm-rv-next"><i class="fas fa-arrow-right"></i> <b>下次如何优化：</b>${zmEsc(r.nextOpt)}</p>` : ''}
          </div>`;
        }).join('')}
      </div>` : '<p class="zm-empty">还没有复盘记录，发完一条就回来填，越复盘越懂你的观众。</p>'}
    </div>
  `;
  return __h;
}
function renderZmReview(c) { c.innerHTML = zmReviewHTML(); }

function renderZmPick(c) {
  var picks = loadData('mw_zm_weekly_pick', {});
  var wk = ZM_WEEKLY.filter(function (x) { return x.track === zmTrack; });
  var total = wk.length;
  var wanted = wk.filter(function (x) { return picks[x.id] === 'want'; }).length;
  var inbox = wk.filter(function (x) { return picks[x.id] !== 'skip'; }).map(function (x) {
    var st = picks[x.id] || '';
    var btns = st === 'want'
      ? '<span class="zm-pick-done"><i class="fas fa-check"></i> 已选 ✓ · 在「预计完成」</span><button class="zm-mini-btn" onclick="zmWeeklyPick(\'' + x.id + '\',\'unwant\')"><i class="fas fa-undo"></i> 取消</button>'
      : '<button class="zm-mini-btn zm-want" onclick="zmWeeklyPick(\'' + x.id + '\',\'want\')"><i class="fas fa-bookmark"></i> 想做</button><button class="zm-mini-btn" onclick="zmWeeklyPick(\'' + x.id + '\',\'skip\')"><i class="fas fa-forward"></i> 跳过</button>';
    return `
      <div class="zm-card">
        <div class="zm-card-top">
          <span class="zm-tag ${zmTrackCls(x.track)}">${x.track}</span>
          <span class="zm-kind zm-kind-${x.kind === '爆款' ? 'hot' : 'idea'}">${x.kind}</span>
        </div>
        <h3 class="zm-card-title">${zmEsc(x.t)}</h3>
        <p class="zm-card-why"><i class="fas fa-lightbulb"></i> ${zmEsc(x.why)}</p>
        <div class="zm-card-actions">
          <a class="zm-link" href="${zmDouyin(x.kw)}" target="_blank" rel="noopener">去抖音看同类爆款 ↗</a>
          ${btns}
        </div>
      </div>`;
  }).join('');
  c.innerHTML = `
    <div class="zm-pick-wrap">
      <div class="zm-section-title"><i class="fas fa-inbox"></i> 本周灵感 inbox <span class="zm-update-tag">更新于 ${ZM_WEEKLY_UPDATED}</span></div>
      <p class="zm-pick-tip">每周一自动补充 5-10 条爆款 / 灵感供你筛选；点「想做」会自动加进「预计完成」计划。<span class="zm-pick-prog">本周已选 ${wanted} / ${total}</span></p>
      ${inbox ? '<div class="zm-card-grid">' + inbox + '</div>' : '<p class="zm-empty">本周灵感都已处理完，周一会刷新新一批。</p>'}
      <hr class="zm-hr">
      ${zmReviewHTML()}
    </div>
  `;
}

function zmWeeklyPick(id, decision) {
  var picks = loadData('mw_zm_weekly_pick', {});
  if (decision === 'want') {
    picks[id] = 'want';
    var item = ZM_WEEKLY.find(function (x) { return x.id === id; });
    var plan = loadData('mw_zm_plan', []);
    if (item && !plan.some(function (p) { return p.fromId === id; })) {
      plan.unshift({ id: 'zp-' + Date.now(), text: item.t, track: item.track, fromId: id, status: 'planned', created: Date.now() });
      saveData('mw_zm_plan', plan);
    }
    showToast('已加入「预计完成」');
  } else if (decision === 'unwant') {
    delete picks[id];
    var plan2 = loadData('mw_zm_plan', []).filter(function (p) { return p.fromId !== id; });
    saveData('mw_zm_plan', plan2);
  } else {
    picks[id] = 'skip';
  }
  saveData('mw_zm_weekly_pick', picks);
  if (zmContainer) renderZimeiti(zmContainer);
}

// ===== 板块四：预计完成 / 已完成（内容生产计划） =====
function renderZmPlan(c) {
  var plan = loadData('mw_zm_plan', []);
  var planned = plan.filter(function (p) { return p.status === 'planned'; });
  var done = plan.filter(function (p) { return p.status === 'done'; });
  function card(p) {
    return `
      <div class="zm-plan-item ${p.status === 'done' ? 'done' : ''}">
        <div class="zm-plan-head">
          <span class="zm-tag ${zmTrackCls(p.track)}">${zmEsc(p.track)}</span>
          <span class="zm-plan-text">${zmEsc(p.text)}</span>
        </div>
        <div class="zm-plan-actions">
          ${p.status === 'planned'
            ? '<button class="zm-mini-btn zm-done-btn" onclick="toggleZmPlan(\'' + p.id + '\')"><i class="fas fa-check"></i> 标记完成</button>'
            : '<button class="zm-mini-btn" onclick="toggleZmPlan(\'' + p.id + '\')"><i class="fas fa-undo"></i> 退回预计</button>'}
          <button class="zm-mini-btn" onclick="delZmPlan('${p.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
  }
  c.innerHTML = `
    <div class="zm-plan-wrap">
      <div class="zm-plan-stats">
        <div class="zm-plan-stat"><b>${planned.length}</b><span>预计完成</span></div>
        <div class="zm-plan-stat done"><b>${done.length}</b><span>已完成</span></div>
      </div>
      <div class="zm-add-plan">
        <div class="zm-form-row">
          <select id="zm-plan-track" class="zm-input"><option value="宠物">宠物</option><option value="好物">好物</option></select>
          <input id="zm-plan-text" class="zm-input" placeholder="要拍的选题 / 产品（如：拍一期猫咪冻干开袋）">
        </div>
        <button class="zm-btn" onclick="addZmPlan()"><i class="fas fa-plus"></i> 加入预计完成</button>
      </div>
      <div class="zm-plan-cols">
        <div class="zm-plan-col">
          <h4><i class="fas fa-tasks"></i> 预计完成（${planned.length}）</h4>
          ${planned.length ? planned.map(card).join('') : '<p class="zm-empty">还没有计划。从「复盘&选题」点「想做」会自动进来，也可以手动添加。</p>'}
        </div>
        <div class="zm-plan-col">
          <h4><i class="fas fa-check-circle"></i> 已完成（${done.length}）</h4>
          ${done.length ? done.map(card).join('') : '<p class="zm-empty">拍完就标记为已完成吧。</p>'}
        </div>
      </div>
    </div>
  `;
}

function addZmPlan() {
  var el = document.getElementById('zm-plan-text');
  var text = el ? el.value.trim() : '';
  if (!text) { showToast('先填写要拍的内容', 'error'); return; }
  var track = document.getElementById('zm-plan-track').value;
  var plan = loadData('mw_zm_plan', []);
  plan.unshift({ id: 'zp-' + Date.now(), text: text, track: track, fromId: '', status: 'planned', created: Date.now() });
  saveData('mw_zm_plan', plan);
  showToast('已加入预计完成');
  if (zmContainer) renderZimeiti(zmContainer);
}
function toggleZmPlan(id) {
  var plan = loadData('mw_zm_plan', []);
  var it = plan.find(function (p) { return p.id === id; });
  if (it) it.status = it.status === 'planned' ? 'done' : 'planned';
  saveData('mw_zm_plan', plan);
  if (zmContainer) renderZimeiti(zmContainer);
}
function delZmPlan(id) {
  var plan = loadData('mw_zm_plan', []).filter(function (p) { return p.id !== id; });
  saveData('mw_zm_plan', plan);
  if (zmContainer) renderZimeiti(zmContainer);
}

// ===== 板块五：内容文案 =====
function renderZmCopy(c) {
  c.innerHTML = `
    <div class="zm-copy-wrap">
      <div class="zm-add-review">
        <h4><i class="fas fa-pen"></i> 生成内容文案</h4>
        <input id="zm-copy-name" class="zm-input" placeholder="选题 / 产品名（必填）">
        <div class="zm-form-row">
          <select id="zm-copy-track" class="zm-input"><option value="宠物">宠物</option><option value="好物">好物</option></select>
          <select id="zm-copy-platform" class="zm-input"><option value="抖音">抖音</option><option value="小红书">小红书</option><option value="视频号">视频号</option></select>
          <select id="zm-copy-style" class="zm-input"><option value="种草">种草</option><option value="测评">测评</option><option value="剧情">剧情</option><option value="口播">口播</option></select>
        </div>
        <button class="zm-btn" onclick="genZmCopy()"><i class="fas fa-magic"></i> 生成文案</button>
      </div>
      <div id="zm-copy-result" class="zm-copy-result"></div>
    </div>
  `;
}

function petPersona() {
  var a = ['自律学霸', '腹黑心机', '笨萌学渣', '戏精本精', '反差萌'];
  return a[Math.floor(Math.random() * a.length)];
}

function genZmCopy() {
  var name = (document.getElementById('zm-copy-name').value || '').trim();
  if (!name) { showToast('先填写选题 / 产品名', 'error'); return; }
  var track = document.getElementById('zm-copy-track').value;
  var platform = document.getElementById('zm-copy-platform').value;
  var style = document.getElementById('zm-copy-style').value;

  var titles = [], hooks = [], body = [], cta = '', tags = [];
  if (track === '宠物') {
    titles = [
      '谁懂啊，' + name + '今天又整活了😂（附人设配方）',
      name + '的「' + petPersona() + '」人设，是怎么一步步立住的',
      '养' + name + '第 30 天，它成了我账号的流量密码'
    ];
    hooks = [
      '别再只拍' + name + '吃饭睡觉了！2026 宠物号拼的是“演”——',
      '我家' + name + '最近火了，靠的不是可爱，是这 3 秒钩子：'
    ];
  } else {
    titles = [
      name + '到底是不是智商税？真实测评给你看',
      '后悔没早买' + name + '，早买早享受',
      '不到 XX 元搞定' + name + '？这波真的血赚'
    ];
    hooks = [
      '（反常识）千万别买' + name + '？看完这期你再决定',
      '（视觉冲击）' + name + '实测翻车现场，但真相是……'
    ];
  }

  if (style === '测评') {
    body = ['0-3s 痛点钩子：' + (track === '宠物' ? '养' + name + '最头疼的 1 件事' : '买' + name + '前最怕踩的坑'),
            '3-15s 产品/主角亮相：真实展示，不棚拍',
            '15-35s 场景实测：多场景验证真的好用',
            '35-45s 优缺点 + 福利促单：说清为什么现在买'];
  } else if (style === '种草') {
    body = ['第一视角自用分享，像闺蜜安利：“我自己用了 1 个月才敢推' + name + '”',
            '真实生活化场景植入，不硬广',
            '口语化聊天式口播，信任感拉满'];
  } else if (style === '剧情') {
    body = ['用 30 秒小剧场带出' + name + '：有冲突、有反转',
            '固定角色人设，观众追更',
            '产品/宠物自然融入剧情，不突兀'];
  } else {
    body = ['口播框架：痛点 → 观点 → 证据 → 行动',
            '前 3 秒抛反常识观点抓住注意力',
            '中间用' + name + '的真实案例支撑',
            '结尾引导互动'];
  }

  cta = (platform === '小红书' ? '“建议收藏，下次照着拍！”' : '“点个赞，下期教你' + (track === '宠物' ? '训练' + name : '挑' + name) + '”') + ' 评论区告诉我你想看什么？';

  var tagBase = track === '宠物' ? ['宠物', '萌宠', '养宠日常', '撸猫撸狗'] : ['好物分享', '好物推荐', '平价好物', '种草'];
  if (style === '测评') tagBase.push('真实测评');
  if (style === '种草') tagBase.push('好物种草');
  if (style === '剧情') tagBase.push('短剧');
  tagBase.push(platform);
  tags = tagBase.map(function (t) { return '#' + t; }).join(' ');

  var plain = '【标题备选】\n' + titles.join('\n') +
    '\n\n【开头钩子】\n' + hooks.join('\n') +
    '\n\n【正文结构】\n' + body.map(function (b, i) { return (i + 1) + '. ' + b; }).join('\n') +
    '\n\n【结尾 CTA】\n' + cta +
    '\n\n【话题标签】\n' + tags;

  var html = `
    <div class="zm-copy-card">
      <div class="zm-copy-head">
        <b>已生成 · ${zmEsc(name)}（${track} / ${platform} / ${style}）</b>
        <button class="zm-mini-btn" onclick="copyZmText(this)"><i class="fas fa-copy"></i> 复制全文</button>
      </div>
      <div class="zm-copy-block"><span class="zm-copy-label">标题备选</span><ul>${titles.map(function (t) { return '<li>' + zmEsc(t) + '</li>'; }).join('')}</ul></div>
      <div class="zm-copy-block"><span class="zm-copy-label">开头钩子</span><ul>${hooks.map(function (t) { return '<li>' + zmEsc(t) + '</li>'; }).join('')}</ul></div>
      <div class="zm-copy-block"><span class="zm-copy-label">正文结构</span><ol>${body.map(function (b) { return '<li>' + zmEsc(b) + '</li>'; }).join('')}</ol></div>
      <div class="zm-copy-block"><span class="zm-copy-label">结尾 CTA</span><p>${zmEsc(cta)}</p></div>
      <div class="zm-copy-block"><span class="zm-copy-label">话题标签</span><p class="zm-tags">${zmEsc(tags)}</p></div>
    </div>`;

  var box = document.getElementById('zm-copy-result');
  box.innerHTML = html;
  box.dataset.text = plain;
}

function copyZmText(btn) {
  var box = document.getElementById('zm-copy-result');
  var text = box ? box.dataset.text : '';
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { showToast('已复制'); }, function () { fallbackCopy(text); });
  } else { fallbackCopy(text); }
}
function fallbackCopy(text) {
  try {
    var ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    showToast('已复制');
  } catch (e) { showToast('复制失败，请手动选择', 'error'); }
}

// ===== 板块六：运营学院 =====
function renderZmAcademy(c) {
  var algoMine = loadData('mw_zm_algo_mine', []);
  c.innerHTML = `
    <div class="zm-academy">
      <div class="zm-academy-section">
        <div class="zm-academy-h"><i class="fas fa-brain"></i> 抖音算法机制（大数据推送） <span class="zm-update-tag">更新于 ${ZM_ALGO_UPDATED}</span></div>
        <p class="zm-academy-intro">抖音不直接给你流量，而是用「流量池赛马 + 标签匹配」把优质内容推给对的人。看懂下面 10 张卡，你就懂为什么有的视频爆、有的石沉大海。</p>
        <div class="zm-algo-grid">
          ${ZM_ALGO.map(function (x) {
            return '<div class="zm-algo-card"><div class="zm-algo-t">' + zmEsc(x.t) + '</div><div class="zm-algo-d">' + zmEsc(x.d) + '</div></div>';
          }).join('')}
        </div>
        <div class="zm-note-sm"><i class="fas fa-pen"></i> 读到的新机制/新变动，粘在这里（我会定期帮你更新上方知识卡）：</div>
        <div class="zm-form-row">
          <input id="zm-algo-note" class="zm-input" placeholder="例如：听说现在搜索流量权重又调高了…">
          <button class="zm-btn" onclick="addZmAlgoNote()"><i class="fas fa-plus"></i> 记录</button>
        </div>
        ${algoMine.length ? '<div class="zm-algo-mine">' + algoMine.map(function (m) {
          return '<div class="zm-mine-item"><div class="zm-mine-head"><span class="zm-mine-date">' + m.date + '</span><button class="zm-mini-btn" onclick="delZmAlgoNote(\'' + m.id + '\')"><i class="fas fa-trash"></i></button></div><span class="zm-mine-nolink">' + zmEsc(m.text) + '</span></div>';
        }).join('') + '</div>' : ''}
      </div>

      <div class="zm-academy-section">
        <div class="zm-academy-h"><i class="fas fa-project-diagram"></i> 自媒体的运转模式</div>
        <div class="zm-flow">
          ${ZM_MODE_FLOW.map(function (x, i) {
            return '<div class="zm-flow-step"><div class="zm-flow-s">' + zmEsc(x.s) + '</div><div class="zm-flow-d">' + zmEsc(x.d) + '</div></div>' + (i < ZM_MODE_FLOW.length - 1 ? '<div class="zm-flow-arrow">→</div>' : '');
          }).join('')}
        </div>
        <p class="zm-academy-intro">${zmEsc(ZM_MODE_NOTE)}</p>
      </div>

      <div class="zm-academy-section">
        <div class="zm-academy-h"><i class="fas fa-shoe-prints"></i> 如何做自媒体（起号 5 步）</div>
        <div class="zm-howto">
          ${ZM_HOWTO.map(function (x, i) {
            return '<div class="zm-howto-item"><span class="zm-howto-no">' + (i + 1) + '</span><div class="zm-howto-body"><b>' + zmEsc(x.n) + '</b><span>' + zmEsc(x.d) + '</span></div></div>';
          }).join('')}
        </div>
      </div>

      <div class="zm-academy-section">
        <div class="zm-academy-h"><i class="fas fa-coins"></i> 自媒体如何赚钱（变现地图）</div>
        <div class="zm-money">
          ${ZM_MONEY.map(function (tier) {
            return '<div class="zm-money-tier"><div class="zm-money-tier-h">' + zmEsc(tier.tier) + '</div>' + tier.items.map(function (it) {
              return '<div class="zm-money-item"><b>' + zmEsc(it.n) + '</b><span>' + zmEsc(it.d) + '</span></div>';
            }).join('') + '</div>';
          }).join('')}
        </div>
        <p class="zm-money-tip"><i class="fas fa-exclamation-triangle"></i> ${zmEsc(ZM_MONEY_TIP)}</p>
        <div id="zm-money-flow"></div>
      </div>
    </div>
  `;
  renderZmMoneyFlow();
}
function addZmAlgoNote() {
  var el = document.getElementById('zm-algo-note');
  var v = el ? el.value.trim() : '';
  if (!v) { showToast('先写点发现', 'error'); return; }
  var mine = loadData('mw_zm_algo_mine', []);
  mine.unshift({ id: 'za-' + Date.now(), text: v, date: zmDateKey() });
  if (mine.length > 30) mine = mine.slice(0, 30);
  saveData('mw_zm_algo_mine', mine);
  showToast('已记录，我会在刷新时纳入知识卡');
  if (zmContainer) renderZimeiti(zmContainer);
}
function delZmAlgoNote(id) {
  var mine = loadData('mw_zm_algo_mine', []).filter(function (m) { return m.id !== id; });
  saveData('mw_zm_algo_mine', mine);
  if (zmContainer) renderZimeiti(zmContainer);
}
