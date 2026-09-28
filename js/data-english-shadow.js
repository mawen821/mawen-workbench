/* ============================================================
   英语角 · 影子跟读（Shadowing）
   ------------------------------------------------------------
   设计目标：解决"只有孤立短句、没连贯性、手机不能听"三大痛点。
   · 每个场景是一段【连贯的生活对话】（像电影/剧集里摘出来的日常片段），
     不再是互不相关的单词或单句；
   · 每行都预生成【本地 mp3】（离线、同源、手机 100% 能放），
     不依赖手机 TTS 引擎，也不依赖任何第三方在线接口；
   · 配套"影子跟读"模式：听一句→看中文→你跟着小声说→再听一遍对比。
   选段聚焦日常生活高频场景，学了就能用。
   ============================================================ */

const SHADOW_SCENES = [
  {
    id: 'shadow-cafe',
    scene: '☕ 咖啡店点单',
    emoji: '☕',
    intro: '周末午后，你在街角咖啡馆点一杯拿铁，顺便问了下有没有低因选项。',
    lines: [
      { en: 'Hi, what can I get for you?', cn: '你好，想喝点什么？' },
      { en: 'I would like a medium latte, please.', cn: '我要一杯中杯拿铁，谢谢。' },
      { en: 'Sure. Would you like it hot or iced?', cn: '好的。要热的还是冰的？' },
      { en: 'Hot, please. Do you have a decaf option?', cn: '热的。你们有低因（脱咖啡因）的选项吗？' },
      { en: 'Yes, we do. Anything else for you today?', cn: '有的。今天还需要别的吗？' },
      { en: 'No, that is all. Thank you so much.', cn: '不用了，就这些。非常感谢。' }
    ]
  },
  {
    id: 'shadow-directions',
    scene: '🚌 问路',
    emoji: '🚌',
    intro: '你刚到一个陌生街区，想找最近的地铁站，向路人打听。',
    lines: [
      { en: 'Excuse me, could you help me, please?', cn: '打扰一下，能帮我个忙吗？' },
      { en: 'Of course. What are you looking for?', cn: '当然可以。你在找什么？' },
      { en: 'I am trying to find the nearest subway station.', cn: '我想找最近的地铁站。' },
      { en: 'Go straight ahead and turn left at the corner.', cn: '一直往前走，到拐角左转。' },
      { en: 'Is it far from here?', cn: '离这儿远吗？' },
      { en: 'No, just a five-minute walk. You cannot miss it.', cn: '不远，步行五分钟就到。你肯定能找到。' }
    ]
  },
  {
    id: 'shadow-phone',
    scene: '📞 约朋友吃饭',
    emoji: '📞',
    intro: '下班前，你给朋友打电话，约周末一起吃饭。',
    lines: [
      { en: 'Hey, are you free this weekend?', cn: '嘿，你这周末有空吗？' },
      { en: 'I think so. Why, what do you have in mind?', cn: '应该有空。怎么了，你有什么打算？' },
      { en: 'I was thinking we could grab dinner on Saturday.', cn: '我在想咱们周六可以一起吃个晚饭。' },
      { en: 'Sounds great. Any place you would recommend?', cn: '听起来不错。你有什么推荐的店吗？' },
      { en: 'There is a new ramen place near the park.', cn: '公园附近新开了一家拉面馆。' },
      { en: 'Perfect. Let us meet at seven, okay?', cn: '太好了。我们七点见，好吗？' }
    ]
  },
  {
    id: 'shadow-shopping',
    scene: '🛍️ 商场退换',
    emoji: '🛍️',
    intro: '你买的那件衬衫尺寸不合适，拿回店里换货。',
    lines: [
      { en: 'Hi, I would like to exchange this shirt.', cn: '你好，我想换一下这件衬衫。' },
      { en: 'Sure. What seems to be the problem?', cn: '好的。是哪里不合适呢？' },
      { en: 'The size is a bit too small for me.', cn: '尺码对我来说有点偏小。' },
      { en: 'No problem. Do you have the receipt?', cn: '没问题。您带小票了吗？' },
      { en: 'Yes, here you are.', cn: '带了，给您。' },
      { en: 'Great. Let me find you a larger size.', cn: '好的。我帮您找一件大一号的。' }
    ]
  },
  {
    id: 'shadow-clinic',
    scene: '🏥 看医生',
    emoji: '🏥',
    intro: '这几天嗓子疼，你去看医生，医生问了症状并给了建议。',
    lines: [
      { en: 'What seems to be the trouble?', cn: '您哪里不舒服？' },
      { en: 'I have had a sore throat since yesterday.', cn: '我从昨天起嗓子就疼。' },
      { en: 'Do you have a fever or a cough?', cn: '您发烧或咳嗽吗？' },
      { en: 'A little cough, but no fever so far.', cn: '有点咳嗽，但目前没有发烧。' },
      { en: 'Drink more water and rest well, please.', cn: '请多喝水，好好休息。' },
      { en: 'Thank you, doctor. I will.', cn: '谢谢医生。我会的。' }
    ]
  },
  {
    id: 'shadow-dinner',
    scene: '🍜 晚餐闲聊',
    emoji: '🍜',
    intro: '和老友坐下吃面，随口聊起最近的工作和生活。',
    lines: [
      { en: 'How have you been lately?', cn: '你最近过得怎么样？' },
      { en: 'Pretty busy, to be honest. And you?', cn: '说实话挺忙的。你呢？' },
      { en: 'Same here. Work has been nonstop.', cn: '我也是。工作一直没停过。' },
      { en: 'We really should do this more often.', cn: '咱们真的该多聚聚。' },
      { en: 'Agreed. It is nice to slow down sometimes.', cn: '同意。偶尔慢下来挺好的。' },
      { en: 'Cheers to a calm evening, then.', cn: '那就为这个安静的夜晚干杯。' }
    ]
  }
];
