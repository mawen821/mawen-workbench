/* ============================================
   英语角学习数据
   ============================================ */

// ===== 语法体系（完整可展开学习） =====
const GRAMMAR_DATA = [
  {
    id: 1,
    title: "名词 (Nouns)",
    icon: "fa-book",
    intro: "名词是表示人、事物、地点或抽象概念的词。是英语中最基础的词性。",
    sections: [
      {
        heading: "可数名词与不可数名词",
        content: "可数名词可以用数字计数，有单数和复数形式。不可数名词不能直接用数字计数，没有复数形式。",
        examples: [
          { en: "I have two apples.", cn: "我有两个苹果。（可数）" },
          { en: "She drinks water every day.", cn: "她每天喝水。（不可数）" }
        ]
      },
      {
        heading: "名词复数变化规则",
        content: "一般加-s；以s,x,sh,ch结尾加-es；以辅音字母+y结尾，变y为i加-es；以f/fe结尾，变f为v加-es；不规则变化需记忆。",
        examples: [
          { en: "book → books, bus → buses, box → boxes", cn: "规则变化示例" },
          { en: "child → children, foot → feet, mouse → mice", cn: "不规则变化示例" }
        ]
      },
      {
        heading: "名词所有格",
        content: "表示所属关系。单数名词加 's；复数名词以s结尾加 '；不以s结尾加 's。",
        examples: [
          { en: "Tom's book", cn: "汤姆的书" },
          { en: "the students' classroom", cn: "学生们的教室" }
        ]
      }
    ],
    tip: "记住：不可数名词永远没有复数形式，前面不能加a/an，需要用量词来表达数量，如 a piece of paper。"
  },
  {
    id: 2,
    title: "冠词 (Articles)",
    icon: "fa-circle-notch",
    intro: "冠词用在名词前，帮助说明名词的含义。分为不定冠词a/an和定冠词the。",
    sections: [
      {
        heading: "不定冠词 a / an",
        content: "a用在辅音音素开头的词前，an用在元音音素开头的词前。表示\"一个\"，泛指。",
        examples: [
          { en: "a book, a university (u发/ju:/)", cn: "注意：看音素不是字母" },
          { en: "an apple, an hour (h不发音)", cn: "hour虽然h开头但h不发音" }
        ]
      },
      {
        heading: "定冠词 the",
        content: "表示特指，指双方都知道的、上文提过的、或世界上独一无二的事物。",
        examples: [
          { en: "The sun is shining.", cn: "太阳在闪耀。（独一无二）" },
          { en: "Pass me the book on the table.", cn: "把桌上那本书递给我。（特指）" }
        ]
      },
      {
        heading: "零冠词（不加冠词）",
        content: "表示泛指的复数名词、不可数名词、专有名词、三餐、球类运动前通常不加冠词。",
        examples: [
          { en: "I like playing basketball.", cn: "我喜欢打篮球。（球类前零冠词）" },
          { en: "She has breakfast at 7.", cn: "她7点吃早餐。（三餐前零冠词）" }
        ]
      }
    ],
    tip: "判断用a还是an，关键看发音而不是字母。an hour（对），an university（错，应为a university）。"
  },
  {
    id: 3,
    title: "代词 (Pronouns)",
    icon: "fa-user",
    intro: "代词用来代替名词，避免重复。包括人称代词、物主代词、指示代词、不定代词等。",
    sections: [
      {
        heading: "人称代词",
        content: "主格：I, you, he, she, it, we, they（作主语）。宾格：me, you, him, her, it, us, them（作宾语）。",
        examples: [
          { en: "She is my friend. I like her.", cn: "她是我的朋友。我喜欢她。" },
          { en: "They invited us to the party.", cn: "他们邀请我们参加派对。" }
        ]
      },
      {
        heading: "物主代词",
        content: "形容词性：my, your, his, her, its, our, their（后接名词）。名词性：mine, yours, his, hers, ours, theirs（单独使用）。",
        examples: [
          { en: "This is my book. That book is mine.", cn: "这是我的书。那本书是我的。" },
          { en: "Their car is new. Ours is old.", cn: "他们的车是新的。我们的是旧的。" }
        ]
      },
      {
        heading: "反身代词",
        content: "myself, yourself, himself, herself, itself, ourselves, yourselves, themselves。表示\"自己\"。",
        examples: [
          { en: "I can do it myself.", cn: "我自己能做。" },
          { en: "She taught herself English.", cn: "她自学英语。" }
        ]
      }
    ],
    tip: "主格做主语，宾格做宾语。记不住的时候想：谁做的事用主格，承受动作的用宾格。"
  },
  {
    id: 4,
    title: "动词 (Verbs)",
    icon: "fa-running",
    intro: "动词表示动作或状态，是句子的核心。分为实义动词、be动词、助动词、情态动词。",
    sections: [
      {
        heading: "be动词",
        content: "am/is/are。I用am，单数用is，复数用are。表示状态、身份、特征。",
        examples: [
          { en: "I am a student. She is happy. They are friends.", cn: "我是学生。她很开心。他们是朋友。" }
        ]
      },
      {
        heading: "实义动词",
        content: "表示具体动作，如 eat, run, play, study 等。有人称和时态变化。",
        examples: [
          { en: "He plays football every day.", cn: "他每天踢足球。" },
          { en: "She studies English hard.", cn: "她努力学习英语。" }
        ]
      },
      {
        heading: "情态动词",
        content: "can(能够), could(能), may(可以), might(可能), must(必须), should(应该), will(将), would(会)。后接动词原形。",
        examples: [
          { en: "You must finish your homework.", cn: "你必须完成作业。" },
          { en: "She can swim very well.", cn: "她游泳游得很好。" }
        ]
      }
    ],
    tip: "第三人称单数（he/she/it）做主语时，一般现在时动词要加-s/-es。这是初学者最容易忽略的！"
  },
  {
    id: 5,
    title: "一般现在时",
    icon: "fa-clock",
    intro: "表示经常发生的动作、客观事实、习惯或状态。是最基础的时态。",
    sections: [
      {
        heading: "基本用法",
        content: "表示习惯性、经常性的动作（常与always, usually, often, sometimes, never连用）；客观真理和事实。",
        examples: [
          { en: "I usually get up at 6 o'clock.", cn: "我通常6点起床。" },
          { en: "The earth goes around the sun.", cn: "地球绕着太阳转。" }
        ]
      },
      {
        heading: "第三人称单数变化",
        content: "主语是第三人称单数时，动词加-s/-es。规则同名词复数变化。",
        examples: [
          { en: "He works in a bank.", cn: "他在银行工作。" },
          { en: "She watches TV in the evening.", cn: "她晚上看电视。" }
        ]
      },
      {
        heading: "否定句和疑问句",
        content: "借助助动词do/does。第三人称单数用does，其余用do。否定句：don't/doesn't + 动词原形。",
        examples: [
          { en: "Do you like coffee? — Yes, I do.", cn: "你喜欢咖啡吗？— 是的，我喜欢。" },
          { en: "She doesn't speak Chinese.", cn: "她不会说中文。" }
        ]
      }
    ],
    tip: "记住口诀：I/you/复数用do，he/she/it用does。用了does/don't后面动词一定要还原成原形！"
  },
  {
    id: 6,
    title: "一般过去时",
    icon: "fa-history",
    intro: "表示过去某个时间发生的动作或状态。常与yesterday, last week, ago等时间状语连用。",
    sections: [
      {
        heading: "规则动词过去式",
        content: "一般加-ed；以e结尾加-d；以辅音+y结尾变y为i加-ed；重读闭音节结尾双写末尾辅音加-ed。",
        examples: [
          { en: "play→played, live→lived, study→studied, stop→stopped", cn: "规则变化示例" }
        ]
      },
      {
        heading: "不规则动词过去式",
        content: "需要记忆常见的不规则动词，这是考试重点。",
        examples: [
          { en: "go→went, see→saw, eat→ate, buy→bought, take→took", cn: "不规则变化，需牢记" },
          { en: "I went to Beijing last summer.", cn: "去年夏天我去了北京。" }
        ]
      },
      {
        heading: "否定句和疑问句",
        content: "借助助动词did，后面的动词还原成原形。",
        examples: [
          { en: "Did you watch the movie? — Yes, I did.", cn: "你看那部电影了吗？— 看了。" },
          { en: "He didn't go to school yesterday.", cn: "他昨天没去上学。" }
        ]
      }
    ],
    tip: "用了did/didn't，后面的动词一定要还原成原形！这是最常见的错误。"
  },
  {
    id: 7,
    title: "一般将来时",
    icon: "fa-arrow-right",
    intro: "表示将来要发生的动作或状态。常用will或be going to结构。",
    sections: [
      {
        heading: "will + 动词原形",
        content: "表示将来的事实、预测或临时决定。",
        examples: [
          { en: "I will call you tomorrow.", cn: "我明天给你打电话。" },
          { en: "It will rain this afternoon.", cn: "今天下午会下雨。" }
        ]
      },
      {
        heading: "be going to + 动词原形",
        content: "表示计划好的、打算做的某事，或有迹象表明即将发生的事。",
        examples: [
          { en: "I am going to visit my grandma next week.", cn: "我下周要去看望奶奶。" },
          { en: "Look at the clouds! It's going to rain.", cn: "看那些云！要下雨了。" }
        ]
      },
      {
        heading: "will vs be going to 的区别",
        content: "will多用于临时决定和预测；be going to多用于事先计划和有迹象的推测。",
        examples: [
          { en: "(电话响了) I'll answer it.", cn: "临时决定用will" },
          { en: "I'm going to study abroad next year.", cn: "事先计划用be going to" }
        ]
      }
    ],
    tip: "记住：be going to 要根据主语变化be动词 → I am going to / He is going to / They are going to。"
  },
  {
    id: 8,
    title: "现在进行时",
    icon: "fa-spinner",
    intro: "表示此时此刻正在进行的动作，或现阶段正在进行的事。",
    sections: [
      {
        heading: "构成：be + V-ing",
        content: "am/is/are + 动词ing形式。根据主语变化be动词。",
        examples: [
          { en: "I am reading a book now.", cn: "我现在正在看书。" },
          { en: "They are playing basketball.", cn: "他们正在打篮球。" }
        ]
      },
      {
        heading: "V-ing变化规则",
        content: "一般加-ing；以不发音e结尾去e加-ing；重读闭音节双写末辅音加-ing；ie结尾变y加-ing。",
        examples: [
          { en: "read→reading, make→making, run→running, lie→lying", cn: "ing变化规则" }
        ]
      },
      {
        heading: "常用时间状语",
        content: "now, right now, at the moment, look!, listen! 等常与现在进行时搭配。",
        examples: [
          { en: "Look! The bus is coming!", cn: "看！公交车来了！" },
          { en: "Listen! Someone is singing.", cn: "听！有人在唱歌。" }
        ]
      }
    ],
    tip: "有些动词通常不用进行时：know, like, want, need, understand等表示状态或感受的动词。"
  },
  {
    id: 9,
    title: "现在完成时",
    icon: "fa-check-double",
    intro: "表示过去发生的动作对现在造成的影响，或过去开始持续到现在的动作。",
    sections: [
      {
        heading: "构成：have/has + 过去分词",
        content: "I/you/we/they用have；he/she/it用has。过去分词规则同过去式，不规则需记忆。",
        examples: [
          { en: "I have finished my homework.", cn: "我已经完成了作业。" },
          { en: "She has lived here for 5 years.", cn: "她在这里住了5年了。" }
        ]
      },
      {
        heading: "常见标志词",
        content: "already(已经), yet(还), just(刚刚), ever(曾经), never(从未), for+时间段, since+时间点。",
        examples: [
          { en: "Have you ever been to Japan?", cn: "你去过日本吗？" },
          { en: "I have never eaten sushi.", cn: "我从没吃过寿司。" }
        ]
      },
      {
        heading: "have been to vs have gone to",
        content: "have been to：去过（已回来）。have gone to：去了（还没回来）。",
        examples: [
          { en: "She has been to Paris twice.", cn: "她去过巴黎两次。（已回来）" },
          { en: "He has gone to the supermarket.", cn: "他去超市了。（还没回来）" }
        ]
      }
    ],
    tip: "现在完成时强调的是\"过去的动作对现在的影响\"，不要和一般过去时混淆。过去时只关注过去，完成时连接过去和现在。"
  },
  {
    id: 10,
    title: "形容词和副词",
    icon: "fa-star",
    intro: "形容词修饰名词，副词修饰动词、形容词或其他副词。",
    sections: [
      {
        heading: "形容词的位置",
        content: "放在名词前（a beautiful flower）或be动词/系动词后（She is beautiful）。",
        examples: [
          { en: "He is a tall boy.", cn: "他是个高个子男孩。" },
          { en: "The soup tastes delicious.", cn: "汤尝起来很美味。" }
        ]
      },
      {
        heading: "副词的构成和用法",
        content: "形容词+ly构成副词（quick→quickly）。副词修饰动词，说明动作的方式、程度。",
        examples: [
          { en: "She runs quickly.", cn: "她跑得很快。" },
          { en: "He speaks English very well.", cn: "他英语说得很好。" }
        ]
      },
      {
        heading: "比较级和最高级",
        content: "短词加-er/-est（tall→taller→tallest）；长词前加more/most（beautiful→more beautiful→most beautiful）；不规则：good→better→best, bad→worse→worst。",
        examples: [
          { en: "She is taller than me.", cn: "她比我高。" },
          { en: "This is the most beautiful place I've ever seen.", cn: "这是我见过的最美的地方。" }
        ]
      }
    ],
    tip: "good的比较级是better，最高级是best——这是最常见的不规则变化，一定要记住！"
  },
  {
    id: 11,
    title: "介词 (Prepositions)",
    icon: "fa-map-marker-alt",
    intro: "介词表示名词/代词与其他词之间的关系，主要表示时间、地点、方向等。",
    sections: [
      {
        heading: "时间介词 in/on/at",
        content: "in用于年月季节（in 2024, in May）；on用于具体某天（on Monday, on July 4th）；at用于具体时刻（at 8 o'clock）。",
        examples: [
          { en: "I was born in 2000.", cn: "我2000年出生。" },
          { en: "Let's meet on Sunday at 3 pm.", cn: "我们周日下午3点见。" }
        ]
      },
      {
        heading: "地点介词 in/on/at",
        content: "in用于大地方（in China, in the room）；on用于表面（on the table）；at用于具体地点（at school, at the bus stop）。",
        examples: [
          { en: "She lives in Shanghai.", cn: "她住在上海。" },
          { en: "The book is on the desk.", cn: "书在桌子上。" }
        ]
      },
      {
        heading: "常用介词短语",
        content: "in front of(在...前面), behind(在...后面), next to(紧邻), between(在...之间), under(在...下面), over(在...上方)。",
        examples: [
          { en: "The cat is under the table.", cn: "猫在桌子下面。" },
          { en: "The bank is between the post office and the supermarket.", cn: "银行在邮局和超市之间。" }
        ]
      }
    ],
    tip: "口诀：大于天用in，等于天用on，小于天用at。年月日in，星期on，时刻at。"
  },
  {
    id: 12,
    title: "连词 (Conjunctions)",
    icon: "fa-link",
    intro: "连词用来连接词、短语或句子，使表达更丰富流畅。",
    sections: [
      {
        heading: "并列连词",
        content: "and(和), but(但是), or(或者), so(所以)。连接并列的成分。",
        examples: [
          { en: "I like apples and bananas.", cn: "我喜欢苹果和香蕉。" },
          { en: "She is smart but lazy.", cn: "她聪明但懒惰。" }
        ]
      },
      {
        heading: "从属连词",
        content: "because(因为), if(如果), when(当...时), although(虽然), before(在...之前), after(在...之后)。",
        examples: [
          { en: "I stayed home because it rained.", cn: "因为下雨，我待在家里。" },
          { en: "When I got home, Mom was cooking.", cn: "当我到家时，妈妈在做饭。" }
        ]
      },
      {
        heading: "both...and, either...or, neither...nor",
        content: "both...and(两者都), either...or(要么...要么), neither...nor(既不...也不)。",
        examples: [
          { en: "Both Tom and Jerry like cheese.", cn: "汤姆和杰瑞都喜欢奶酪。" },
          { en: "Neither he nor I know the answer.", cn: "他和我都不知道答案。" }
        ]
      }
    ],
    tip: "because和so不能同时用！中文说\"因为...所以\"，英文只用because或so其中一个。"
  },
  {
    id: 13,
    title: "There be 句型",
    icon: "fa-home",
    intro: "There be句型表示\"某处有某物\"，是英语中最常用的句型之一。",
    sections: [
      {
        heading: "基本结构",
        content: "There + be + 主语 + 地点/时间。be动词根据就近原则，与最近的名词保持一致。",
        examples: [
          { en: "There is a book on the desk.", cn: "桌上有一本书。" },
          { en: "There are two apples in the basket.", cn: "篮子里有两个苹果。" }
        ]
      },
      {
        heading: "就近原则",
        content: "当主语是多个名词时，be动词与最近的名词保持一致。",
        examples: [
          { en: "There is a pen and two books on the desk.", cn: "桌上有一支笔和两本书。（靠近pen用is）" },
          { en: "There are two books and a pen on the desk.", cn: "桌上有两本书和一支笔。（靠近books用are）" }
        ]
      },
      {
        heading: "各种时态变化",
        content: "过去时：There was/were；将来时：There will be / There is going to be；完成时：There has/have been。",
        examples: [
          { en: "There was a tree here before.", cn: "以前这里有棵树。" },
          { en: "There will be a meeting tomorrow.", cn: "明天有个会议。" }
        ]
      }
    ],
    tip: "There be和have的区别：There be表示\"客观存在\"，have表示\"拥有\"。不能说 There has，这是最常见的错误！"
  },
  {
    id: 14,
    title: "疑问句型",
    icon: "fa-question-circle",
    intro: "英语中有一般疑问句、特殊疑问句、选择疑问句和反义疑问句等。",
    sections: [
      {
        heading: "一般疑问句",
        content: "用Yes/No回答。把be/情态动词/助动词提到主语前。",
        examples: [
          { en: "Are you a student? — Yes, I am.", cn: "你是学生吗？— 是的。" },
          { en: "Can you swim? — No, I can't.", cn: "你会游泳吗？— 不会。" }
        ]
      },
      {
        heading: "特殊疑问句",
        content: "疑问词(what, where, when, who, why, how) + 一般疑问句语序。",
        examples: [
          { en: "What is your name?", cn: "你叫什么名字？" },
          { en: "Where do you live?", cn: "你住在哪里？" },
          { en: "How old are you?", cn: "你多大了？" }
        ]
      },
      {
        heading: "常用疑问词",
        content: "What(什么), Where(哪里), When(什么时候), Who(谁), Whose(谁的), Why(为什么), How(怎样), How many(多少-可数), How much(多少-不可数/价格)。",
        examples: [
          { en: "How much is this shirt?", cn: "这件衬衫多少钱？" },
          { en: "How many students are there?", cn: "有多少学生？" }
        ]
      }
    ],
    tip: "特殊疑问句的语序：疑问词 + 助动词/be/情态动词 + 主语 + 动词。不要忘了助动词！"
  },
  {
    id: 15,
    title: "被动语态",
    icon: "fa-exchange-alt",
    intro: "被动语态表示主语是动作的承受者。结构为 be + 过去分词。",
    sections: [
      {
        heading: "基本结构",
        content: "be + 过去分词(p.p.)。be动词随时态变化，体现时态。",
        examples: [
          { en: "English is spoken all over the world.", cn: "全世界都说英语。" },
          { en: "The letter was written by Tom.", cn: "这封信是汤姆写的。" }
        ]
      },
      {
        heading: "各时态的被动语态",
        content: "一般现在时：am/is/are + done；一般过去时：was/were + done；一般将来时：will be + done；现在完成时：have/has been + done。",
        examples: [
          { en: "The room is cleaned every day.", cn: "房间每天都被打扫。" },
          { en: "The bridge was built in 1990.", cn: "这座桥建于1990年。" }
        ]
      },
      {
        heading: "主动变被动",
        content: "主动句的宾语变为被动句的主语，谓语变为be+过去分词，主语变为by短语（可省略）。",
        examples: [
          { en: "主动：Tom wrote the letter. → 被动：The letter was written by Tom.", cn: "主动变被动示例" }
        ]
      }
    ],
    tip: "不是所有动词都能用被动语态：不及物动词（如happen, arrive）没有被动语态。"
  },
  {
    id: 16,
    title: "从句入门",
    icon: "fa-sitemap",
    intro: "从句是嵌在主句中的句子，充当主句的某个成分。初学者先了解三大从句。",
    sections: [
      {
        heading: "宾语从句",
        content: "作动词的宾语。引导词：that（可省略）, if/whether（是否）, 疑问词。",
        examples: [
          { en: "I think (that) he is right.", cn: "我认为他是对的。" },
          { en: "I don't know if she will come.", cn: "我不知道她是否会来。" }
        ]
      },
      {
        heading: "定语从句",
        content: "修饰名词（先行词）。引导词：who(人-主语), whom(人-宾语), which(物), that(人/物), whose(谁的)。",
        examples: [
          { en: "The man who is talking to my father is a teacher.", cn: "正在和我父亲说话的那个人是老师。" },
          { en: "This is the book that I bought yesterday.", cn: "这是我昨天买的书。" }
        ]
      },
      {
        heading: "状语从句",
        content: "作状语，表示时间、原因、条件、让步等。引导词：when, because, if, although, so that 等。",
        examples: [
          { en: "I will go if it doesn't rain.", cn: "如果不下雨我就去。（条件）" },
          { en: "She didn't go to school because she was sick.", cn: "她没去上学因为她病了。（原因）" }
        ]
      }
    ],
    tip: "宾语从句的语序永远是陈述语序！不要说 I don't know where is he，应该是 I don't know where he is。"
  },
  {
    id: 17,
    title: "虚拟语气 (Subjunctive Mood)",
    icon: "fa-cloud",
    intro: "虚拟语气表示说话人的愿望、假设、猜测或建议，而非客观事实。是英语语法中的难点，但也是高级表达的必备技能。",
    sections: [
      {
        heading: "什么是虚拟语气？",
        content: "虚拟语气不是表示一个事实，而是表示一种假设、愿望、建议。中文没有明显的虚拟语气形式，所以初学者需要特别注意。核心原则：在虚拟语气中，时态要\"往回退一步\"。",
        examples: [
          { en: "If I were you, I would study harder.", cn: "如果我是你，我会更努力学习。（事实：我不是你）" },
          { en: "I wish I had a bigger house.", cn: "我希望我有一栋更大的房子。（事实：我没有）" }
        ]
      },
      {
        heading: "条件句中的虚拟语气",
        content: "与现在事实相反：If + 主语 + 过去式(were), 主语 + would/could/might + 动词原形。与过去事实相反：If + 主语 + had + 过去分词, 主语 + would/could/might + have + 过去分词。与将来事实相反：If + 主语 + should/were to + 动词原形, 主语 + would + 动词原形。",
        examples: [
          { en: "If I had enough money, I would travel around the world.", cn: "如果我有足够的钱，我会环游世界。（与现在相反）" },
          { en: "If I had studied harder, I would have passed the exam.", cn: "如果我当时更努力学习，我就通过考试了。（与过去相反）" },
          { en: "If it were to rain tomorrow, we would cancel the trip.", cn: "如果明天下雨，我们就取消旅行。（与将来相反）" }
        ]
      },
      {
        heading: "wish 后的虚拟语气",
        content: "wish后的宾语从句需要用虚拟语气。与现在事实相反用过去式；与过去事实相反用had+过去分词；表示将来愿望用would/could+动词原形。",
        examples: [
          { en: "I wish I were taller.", cn: "我希望我更高。（现在：其实不高）" },
          { en: "I wish I had listened to my parents.", cn: "我希望当初听了父母的话。（过去：其实没听）" },
          { en: "I wish it would stop raining.", cn: "我希望雨能停。（将来愿望）" }
        ]
      },
      {
        heading: "suggest/insist/recommend 等词后的虚拟语气",
        content: "在表示建议、要求、命令的动词(如suggest, insist, recommend, demand, require, order)后的that从句中，谓语动词用\"(should) + 动词原形\"（should可省略，美国英语常省略）。",
        examples: [
          { en: "I suggest that he (should) see a doctor.", cn: "我建议他去看医生。" },
          { en: "The teacher insisted that every student (should) finish the homework.", cn: "老师坚持每个学生都要完成作业。" }
        ]
      },
      {
        heading: "as if / as though 后的虚拟语气",
        content: "as if/as though表示\"好像，仿佛\"，后面的从句一般用虚拟语气。与现在事实相反用过去式；与过去事实相反用had+过去分词。",
        examples: [
          { en: "She talks as if she knew everything.", cn: "她说话的样子好像什么都知道。（其实并非全知）" },
          { en: "He looked as though he had seen a ghost.", cn: "他看起来好像见了鬼似的。（其实没见鬼）" }
        ]
      },
      {
        heading: "It is (high/about) time 句型",
        content: "It is time that... / It is high time that... 表示\"是时候做某事了\"，从句用过去式表示虚拟（表示该做而还没做）。",
        examples: [
          { en: "It is high time that we took action.", cn: "我们该采取行动了。（实际还没行动）" },
          { en: "It is time you went to bed.", cn: "你该上床睡觉了。（实际还没睡）" }
        ]
      }
    ],
    tip: "虚拟语气最核心的规则：时态后移。现在变过去，过去变过去完成。If I were 中的 were 是固定用法，不管主语是谁都用were（正式英语中）。"
  }
];

// ===== 每日单词（小学/初中/高中） =====
const WORDS_DATA = {
  primary: [
    { en: "apple", phonetic: "/ˈæp(ə)l/", cn: "n. 苹果", example: "I eat an apple every day." },
    { en: "book", phonetic: "/bʊk/", cn: "n. 书", example: "This is a good book." },
    { en: "cat", phonetic: "/kæt/", cn: "n. 猫", example: "The cat is on the chair." },
    { en: "dog", phonetic: "/dɒɡ/", cn: "n. 狗", example: "My dog likes to run." },
    { en: "egg", phonetic: "/eɡ/", cn: "n. 鸡蛋", example: "I have an egg for breakfast." },
    { en: "fish", phonetic: "/fɪʃ/", cn: "n. 鱼", example: "Fish live in water." },
    { en: "green", phonetic: "/ɡriːn/", cn: "adj. 绿色的", example: "The grass is green." },
    { en: "happy", phonetic: "/ˈhæpi/", cn: "adj. 快乐的", example: "I am happy today." },
    { en: "ice", phonetic: "/aɪs/", cn: "n. 冰", example: "The ice is cold." },
    { en: "jump", phonetic: "/dʒʌmp/", cn: "v. 跳跃", example: "Frogs can jump high." },
    { en: "king", phonetic: "/kɪŋ/", cn: "n. 国王", example: "The king lives in a castle." },
    { en: "love", phonetic: "/lʌv/", cn: "v. 爱", example: "I love my family." },
    { en: "milk", phonetic: "/mɪlk/", cn: "n. 牛奶", example: "I drink milk every morning." },
    { en: "nose", phonetic: "/nəʊz/", cn: "n. 鼻子", example: "We smell with our nose." },
    { en: "orange", phonetic: "/ˈɒrɪndʒ/", cn: "n. 橙子 adj. 橙色的", example: "The orange is sweet." },
    { en: "pen", phonetic: "/pen/", cn: "n. 笔", example: "I write with a pen." },
    { en: "queen", phonetic: "/kwiːn/", cn: "n. 女王", example: "The queen is very kind." },
    { en: "rain", phonetic: "/reɪn/", cn: "n. 雨", example: "The rain is heavy." },
    { en: "sun", phonetic: "/sʌn/", cn: "n. 太阳", example: "The sun is bright." },
    { en: "tree", phonetic: "/triː/", cn: "n. 树", example: "The tree is very tall." },
    { en: "umbrella", phonetic: "/ʌmˈbrelə/", cn: "n. 雨伞", example: "Take an umbrella, it's raining." },
    { en: "water", phonetic: "/ˈwɔːtə/", cn: "n. 水", example: "I drink a lot of water." },
    { en: "box", phonetic: "/bɒks/", cn: "n. 盒子", example: "The box is on the floor." },
    { en: "yellow", phonetic: "/ˈjeləʊ/", cn: "adj. 黄色的", example: "The sunflower is yellow." },
    { en: "zoo", phonetic: "/zuː/", cn: "n. 动物园", example: "Let's go to the zoo." },
    { en: "school", phonetic: "/skuːl/", cn: "n. 学校", example: "I go to school by bus." },
    { en: "teacher", phonetic: "/ˈtiːtʃə/", cn: "n. 老师", example: "My teacher is very nice." },
    { en: "student", phonetic: "/ˈstjuːd(ə)nt/", cn: "n. 学生", example: "I am a good student." },
    { en: "friend", phonetic: "/frend/", cn: "n. 朋友", example: "She is my best friend." },
    { en: "family", phonetic: "/ˈfæmɪli/", cn: "n. 家庭", example: "I love my family." },
    { en: "mother", phonetic: "/ˈmʌðə/", cn: "n. 母亲", example: "My mother cooks dinner." },
    { en: "father", phonetic: "/ˈfɑːðə/", cn: "n. 父亲", example: "My father drives a car." },
    { en: "brother", phonetic: "/ˈbrʌðə/", cn: "n. 兄弟", example: "My brother is tall." },
    { en: "sister", phonetic: "/ˈsɪstə/", cn: "n. 姐妹", example: "My sister likes reading." },
    { en: "house", phonetic: "/haʊs/", cn: "n. 房子", example: "We live in a big house." },
    { en: "food", phonetic: "/fuːd/", cn: "n. 食物", example: "The food is delicious." },
    { en: "color", phonetic: "/ˈkʌlə/", cn: "n. 颜色", example: "What's your favorite color?" },
    { en: "morning", phonetic: "/ˈmɔːnɪŋ/", cn: "n. 早晨", example: "Good morning, everyone!" },
    { en: "afternoon", phonetic: "/ˌɑːftəˈnuːn/", cn: "n. 下午", example: "See you this afternoon." },
    { en: "evening", phonetic: "/ˈiːv(ə)nɪŋ/", cn: "n. 晚上", example: "I watch TV in the evening." },
    { en: "night", phonetic: "/naɪt/", cn: "n. 夜晚", example: "Good night, sleep well." },
    { en: "day", phonetic: "/deɪ/", cn: "n. 白天，天", example: "What day is it today?" },
    { en: "week", phonetic: "/wiːk/", cn: "n. 周", example: "There are seven days in a week." },
    { en: "month", phonetic: "/mʌnθ/", cn: "n. 月", example: "January is the first month." },
    { en: "year", phonetic: "/jɪə/", cn: "n. 年", example: "Happy New Year!" },
    { en: "big", phonetic: "/bɪɡ/", cn: "adj. 大的", example: "The elephant is very big." },
    { en: "small", phonetic: "/smɔːl/", cn: "adj. 小的", example: "The mouse is small." },
    { en: "good", phonetic: "/ɡʊd/", cn: "adj. 好的", example: "This is a good idea." },
    { en: "bad", phonetic: "/bæd/", cn: "adj. 坏的", example: "The weather is bad today." },
    { en: "new", phonetic: "/njuː/", cn: "adj. 新的", example: "I have a new bag." },
    { en: "old", phonetic: "/əʊld/", cn: "adj. 旧的，老的", example: "This book is very old." },
    { en: "hot", phonetic: "/hɒt/", cn: "adj. 热的", example: "The soup is very hot." },
    { en: "cold", phonetic: "/kəʊld/", cn: "adj. 冷的", example: "It is cold in winter." },
    { en: "fast", phonetic: "/fɑːst/", cn: "adj. 快的", example: "The rabbit is fast." },
    { en: "slow", phonetic: "/sləʊ/", cn: "adj. 慢的", example: "The turtle is slow." },
    { en: "eat", phonetic: "/iːt/", cn: "v. 吃", example: "I eat breakfast at 7." },
    { en: "drink", phonetic: "/drɪŋk/", cn: "v. 喝", example: "She drinks tea every day." },
    { en: "run", phonetic: "/rʌn/", cn: "v. 跑", example: "He runs very fast." },
    { en: "swim", phonetic: "/swɪm/", cn: "v. 游泳", example: "I can swim in the pool." },
    { en: "sing", phonetic: "/sɪŋ/", cn: "v. 唱歌", example: "She sings beautifully." },
    { en: "play", phonetic: "/pleɪ/", cn: "v. 玩", example: "Children like to play." },
    { en: "flower", phonetic: "/ˈflaʊə/", cn: "n. 花", example: "The flower is very beautiful." },
    { en: "river", phonetic: "/ˈrɪvə/", cn: "n. 河流", example: "There is a river near my house." },
    { en: "bird", phonetic: "/bɜːd/", cn: "n. 鸟", example: "The bird can fly high." },
    { en: "street", phonetic: "/striːt/", cn: "n. 街道", example: "The street is clean and quiet." },
    { en: "market", phonetic: "/ˈmɑːkɪt/", cn: "n. 市场", example: "I go to the market with my mother." },
    { en: "chair", phonetic: "/tʃeə/", cn: `n. 椅子`, example: "Sit on the chair, please." },
    { en: "table", phonetic: "/ˈteɪbl/", cn: `n. 桌子`, example: "The book is on the table." },
    { en: "window", phonetic: "/ˈwɪndəʊ/", cn: `n. 窗户`, example: "Please open the window." },
    { en: "door", phonetic: "/dɔː/", cn: `n. 门`, example: "Close the door, please." },
    { en: "floor", phonetic: "/flɔː/", cn: `n. 地板`, example: "The cat is sleeping on the floor." },
    { en: "wall", phonetic: "/wɔːl/", cn: `n. 墙壁`, example: "There is a picture on the wall." },
    { en: "garden", phonetic: "/ˈɡɑːdn/", cn: `n. 花园`, example: "We have a beautiful garden." },
    { en: "park", phonetic: "/pɑːk/", cn: `n. 公园`, example: "Let's play in the park." },
    { en: "library", phonetic: "/ˈlaɪbrəri/", cn: `n. 图书馆`, example: "I borrow books from the library." },
    { en: "hospital", phonetic: "/ˈhɒspɪtl/", cn: `n. 医院`, example: "He works in a hospital." },
    { en: "bank", phonetic: "/bæŋk/", cn: `n. 银行`, example: "My mother works at a bank." },
    { en: "city", phonetic: "/ˈsɪti/", cn: `n. 城市`, example: "Beijing is a big city." },
    { en: "country", phonetic: "/ˈkʌntri/", cn: `n. 国家，乡村`, example: "China is a great country." },
    { en: "world", phonetic: "/wɜːld/", cn: `n. 世界`, example: "The world is very big." },
    { en: "map", phonetic: "/mæp/", cn: `n. 地图`, example: "Look at the map of China." },
    { en: "star", phonetic: "/stɑː/", cn: `n. 星星`, example: "I can see many stars at night." },
    { en: "moon", phonetic: "/muːn/", cn: `n. 月亮`, example: "The moon is bright tonight." },
    { en: "cloud", phonetic: "/klaʊd/", cn: `n. 云`, example: "There are white clouds in the sky." },
    { en: "wind", phonetic: "/wɪnd/", cn: `n. 风`, example: "The wind is strong today." },
    { en: "snow", phonetic: "/snəʊ/", cn: `n. 雪`, example: "The snow is white and cold." },
    { en: "spring", phonetic: "/sprɪŋ/", cn: `n. 春天`, example: "Flowers grow in spring." },
    { en: "summer", phonetic: "/ˈsʌmə/", cn: `n. 夏天`, example: "It is very hot in summer." },
    { en: "autumn", phonetic: "/ˈɔːtəm/", cn: `n. 秋天`, example: "Leaves fall in autumn." },
    { en: "winter", phonetic: "/ˈwɪntə/", cn: `n. 冬天`, example: "It snows in winter." },
    { en: "red", phonetic: "/red/", cn: `adj. 红色的`, example: "I like the red dress." },
    { en: "blue", phonetic: "/bluː/", cn: `adj. 蓝色的`, example: "The sky is blue." },
    { en: "white", phonetic: "/waɪt/", cn: `adj. 白色的`, example: "The cloud is white." },
    { en: "black", phonetic: "/blæk/", cn: `adj. 黑色的`, example: "I have a black cat." },
    { en: "brown", phonetic: "/braʊn/", cn: `adj. 棕色的`, example: "The bear is brown." },
    { en: "purple", phonetic: "/ˈpɜːpl/", cn: `adj. 紫色的`, example: "She likes purple flowers." },
    { en: "read", phonetic: "/riːd/", cn: `v. 读`, example: "I read a book every day." },
    { en: "write", phonetic: "/raɪt/", cn: `v. 写`, example: "I can write my name." },
    { en: "draw", phonetic: "/drɔː/", cn: `v. 画`, example: "She likes to draw pictures." },
    { en: "dance", phonetic: "/dɑːns/", cn: `v. 跳舞`, example: "They dance at the party." },
    { en: "sleep", phonetic: "/sliːp/", cn: `v. 睡觉`, example: "I sleep at nine o'clock." }
  ],
  middle: [
    { en: "achieve", phonetic: "/əˈtʃiːv/", cn: "v. 实现，达成", example: "You can achieve your goals with hard work." },
    { en: "beautiful", phonetic: "/ˈbjuːtɪf(ə)l/", cn: "adj. 美丽的", example: "What a beautiful sunset!" },
    { en: "culture", phonetic: "/ˈkʌltʃə/", cn: "n. 文化", example: "Chinese culture has a long history." },
    { en: "develop", phonetic: "/dɪˈveləp/", cn: "v. 发展", example: "Cities develop very fast." },
    { en: "environment", phonetic: "/ɪnˈvaɪrənmənt/", cn: "n. 环境", example: "We should protect the environment." },
    { en: "future", phonetic: "/ˈfjuːtʃə/", cn: "n. 未来", example: "Think about your future career." },
    { en: "government", phonetic: "/ˈɡʌv(ə)nmənt/", cn: "n. 政府", example: "The government makes new laws." },
    { en: "healthy", phonetic: "/ˈhelθi/", cn: "adj. 健康的", example: "Eat healthy food every day." },
    { en: "important", phonetic: "/ɪmˈpɔːt(ə)nt/", cn: "adj. 重要的", example: "Education is very important." },
    { en: "journey", phonetic: "/ˈdʒɜːni/", cn: "n. 旅程", example: "Life is a long journey." },
    { en: "knowledge", phonetic: "/ˈnɒlɪdʒ/", cn: "n. 知识", example: "Knowledge is power." },
    { en: "language", phonetic: "/ˈlæŋɡwɪdʒ/", cn: "n. 语言", example: "English is a global language." },
    { en: "memory", phonetic: "/ˈmem(ə)ri/", cn: "n. 记忆", example: "I have a good memory." },
    { en: "nature", phonetic: "/ˈneɪtʃə/", cn: "n. 自然", example: "We should respect nature." },
    { en: "opportunity", phonetic: "/ˌɒpəˈtjuːnɪti/", cn: "n. 机会", example: "Don't miss this opportunity." },
    { en: "problem", phonetic: "/ˈprɒbləm/", cn: "n. 问题", example: "We need to solve this problem." },
    { en: "question", phonetic: "/ˈkwestʃ(ə)n/", cn: "n. 问题", example: "Can you answer my question?" },
    { en: "remember", phonetic: "/rɪˈmembə/", cn: "v. 记住", example: "Remember to lock the door." },
    { en: "success", phonetic: "/səkˈses/", cn: "n. 成功", example: "Hard work leads to success." },
    { en: "together", phonetic: "/təˈɡeðə/", cn: "adv. 一起", example: "Let's work together." },
    { en: "understand", phonetic: "/ˌʌndəˈstænd/", cn: "v. 理解", example: "I don't understand this word." },
    { en: "volunteer", phonetic: "/ˌvɒlənˈtɪə/", cn: "n. 志愿者 v. 自愿", example: "She works as a volunteer." },
    { en: "weather", phonetic: "/ˈweðə/", cn: "n. 天气", example: "The weather is nice today." },
    { en: "experience", phonetic: "/ɪkˈspɪəriəns/", cn: "n. 经验 v. 体验", example: "Travel gives you experience." },
    { en: "difficult", phonetic: "/ˈdɪfɪk(ə)lt/", cn: "adj. 困难的", example: "This question is difficult." },
    { en: "different", phonetic: "/ˈdɪf(ə)r(ə)nt/", cn: "adj. 不同的", example: "We are different but equal." },
    { en: "interest", phonetic: "/ˈɪntrəst/", cn: "n. 兴趣 v. 使感兴趣", example: "I have an interest in music." },
    { en: "practice", phonetic: "/ˈpræktɪs/", cn: "n./v. 练习", example: "Practice makes perfect." },
    { en: "improve", phonetic: "/ɪmˈpruːv/", cn: "v. 改善", example: "I want to improve my English." },
    { en: "consider", phonetic: "/kənˈsɪdə/", cn: "v. 考虑", example: "Please consider my suggestion." },
    { en: "suggest", phonetic: "/səˈdʒest/", cn: "v. 建议", example: "I suggest we leave early." },
    { en: "explain", phonetic: "/ɪkˈspleɪn/", cn: "v. 解释", example: "Can you explain this to me?" },
    { en: "discover", phonetic: "/dɪˈskʌvə/", cn: "v. 发现", example: "Scientists discovered a new planet." },
    { en: "imagine", phonetic: "/ɪˈmædʒɪn/", cn: "v. 想象", example: "Imagine living on Mars." },
    { en: "popular", phonetic: "/ˈpɒpjʊlə/", cn: "adj. 受欢迎的", example: "This song is very popular." },
    { en: "possible", phonetic: "/ˈpɒsɪb(ə)l/", cn: "adj. 可能的", example: "Anything is possible." },
    { en: "serious", phonetic: "/ˈsɪəriəs/", cn: "adj. 严肃的，严重的", example: "This is a serious problem." },
    { en: "traditional", phonetic: "/trəˈdɪʃ(ə)n(ə)l/", cn: "adj. 传统的", example: "Dumplings are traditional Chinese food." },
    { en: "various", phonetic: "/ˈveəriəs/", cn: "adj. 各种各样的", example: "There are various colors to choose." },
    { en: "ability", phonetic: "/əˈbɪlɪti/", cn: "n. 能力", example: "She has the ability to lead." },
    { en: "advantage", phonetic: "/ədˈvɑːntɪdʒ/", cn: "n. 优势", example: "Speaking English is an advantage." },
    { en: "purpose", phonetic: "/ˈpɜːpəs/", cn: "n. 目的", example: "What's the purpose of this meeting?" },
    { en: "realize", phonetic: "/ˈrɪəlaɪz/", cn: "v. 意识到", example: "I didn't realize I was wrong." },
    { en: "ancient", phonetic: "/ˈeɪnʃənt/", cn: "adj. 古老的", example: "The Great Wall is an ancient building." },
    { en: "century", phonetic: "/ˈsentʃəri/", cn: "n. 世纪", example: "This building is from the 19th century." },
    { en: "produce", phonetic: "/prəˈdjuːs/", cn: "v. 生产", example: "This factory produces cars." },
    { en: "provide", phonetic: "/prəˈvaɪd/", cn: "v. 提供", example: "Schools provide education." },
    { en: "receive", phonetic: "/rɪˈsiːv/", cn: "v. 收到", example: "I received your letter yesterday." },
    { en: "believe", phonetic: "/bɪˈliːv/", cn: "v. 相信", example: "I believe you can do it." },
    { en: "decide", phonetic: "/dɪˈsaɪd/", cn: "v. 决定", example: "She decided to study abroad." },
    { en: "expect", phonetic: "/ɪkˈspekt/", cn: "v. 期望", example: "I expect to see you soon." },
    { en: "happen", phonetic: "/ˈhæpən/", cn: "v. 发生", example: "What happened to you?" },
    { en: "include", phonetic: "/ɪnˈkluːd/", cn: "v. 包含", example: "The price includes breakfast." },
    { en: "instead", phonetic: "/ɪnˈsted/", cn: "adv. 代替，反而", example: "Let's walk instead of taking the bus." },
    { en: "although", phonetic: "/ɔːlˈðəʊ/", cn: "conj. 虽然", example: "Although it rained, we had fun." },
    { en: "unless", phonetic: "/ʌnˈles/", cn: "conj. 除非", example: "You won't pass unless you study." },
    { en: "whether", phonetic: "/ˈweðə/", cn: "conj. 是否", example: "I don't know whether he will come." },
    { en: "however", phonetic: "/haʊˈevə/", cn: "adv. 然而", example: "I tried; however, I failed." },
    { en: "communicate", phonetic: "/kəˈmjuːnɪkeɪt/", cn: "v. 交流，沟通", example: "We need to communicate better with each other." },
    { en: "necessary", phonetic: "/ˈnesəs(ə)ri/", cn: "adj. 必要的", example: "Sleep is necessary for good health." },
    { en: "courage", phonetic: "/ˈkʌrɪdʒ/", cn: "n. 勇气", example: "It takes courage to tell the truth." },
    { en: "especially", phonetic: "/ɪˈspeʃ(ə)li/", cn: "adv. 尤其，特别", example: "I love animals, especially dogs." },
    { en: "prepare", phonetic: "/prɪˈpeə/", cn: "v. 准备", example: "Let's prepare for the exam together." },
    { en: "encourage", phonetic: "/ɪnˈkʌrɪdʒ/", cn: "v. 鼓励", example: "Parents should encourage their children to try new things." },
    { en: "effort", phonetic: "/ˈefət/", cn: "n. 努力", example: "Your effort will be rewarded one day." },
    { en: "respect", phonetic: "/rɪˈspekt/", cn: "v./n. 尊重，尊敬", example: "We should respect people with different opinions." },
    { en: "responsible", phonetic: "/rɪˈspɒnsɪb(ə)l/", cn: "adj. 负责的", example: "You should be responsible for your own actions." },
    { en: "attention", phonetic: "/əˈtenʃ(ə)n/", cn: "n. 注意力", example: "Please pay attention to the teacher." },
    { en: "challenge", phonetic: `/ˈtʃælɪndʒ/`, cn: `n. 挑战 v. 向...挑战`, example: "Learning English is a challenge for me." },
    { en: "condition", phonetic: `/kənˈdɪʃn/`, cn: `n. 条件，状况`, example: "The road condition is very bad." },
    { en: "contribute", phonetic: `/kənˈtrɪbjuːt/`, cn: `v. 贡献`, example: "Everyone should contribute to society." },
    { en: "depend", phonetic: `/dɪˈpend/`, cn: `v. 依赖，取决于`, example: "It depends on the weather." },
    { en: "describe", phonetic: `/dɪˈskraɪb/`, cn: `v. 描述`, example: "Can you describe the person?" },
    { en: "determine", phonetic: `/dɪˈtɜːmɪn/`, cn: `v. 决定`, example: "You determine your own future." },
    { en: "economy", phonetic: `/ɪˈkɒnəmi/`, cn: `n. 经济`, example: "The economy is growing fast." },
    { en: "educate", phonetic: `/ˈedʒukeɪt/`, cn: `v. 教育`, example: "We should educate children well." },
    { en: "effective", phonetic: `/ɪˈfektɪv/`, cn: `adj. 有效的`, example: "This is an effective method." },
    { en: "election", phonetic: `/ɪˈlekʃn/`, cn: `n. 选举`, example: "The election will be held next month." },
    { en: "emotion", phonetic: `/ɪˈməʊʃn/`, cn: `n. 情感`, example: "She couldn't hide her emotion." },
    { en: "equal", phonetic: `/ˈiːkwəl/`, cn: `adj. 平等的`, example: "Everyone is equal before the law." },
    { en: "event", phonetic: `/ɪˈvent/`, cn: `n. 事件`, example: "The sports event was exciting." },
    { en: "examine", phonetic: `/ɪɡˈzæmɪn/`, cn: `v. 检查，考试`, example: "The doctor examined the patient." },
    { en: "explore", phonetic: `/ɪkˈsplɔː/`, cn: `v. 探索`, example: "We want to explore the ocean." },
    { en: "express", phonetic: `/ɪkˈspres/`, cn: `v. 表达`, example: "I can't express my feelings in words." },
    { en: "factory", phonetic: `/ˈfæktəri/`, cn: `n. 工厂`, example: "My father works in a factory." },
    { en: "freedom", phonetic: `/ˈfriːdəm/`, cn: `n. 自由`, example: "We should cherish our freedom." },
    { en: "generation", phonetic: `/ˌdʒenəˈreɪʃn/`, cn: `n. 一代人`, example: "The younger generation loves technology." },
    { en: "global", phonetic: `/ˈɡləʊbl/`, cn: `adj. 全球的`, example: "We face a global warming problem." },
    { en: "history", phonetic: `/ˈhɪstri/`, cn: `n. 历史`, example: "China has a long history." },
    { en: "honest", phonetic: `/ˈɒnɪst/`, cn: `adj. 诚实的`, example: "He is an honest boy." },
    { en: "industry", phonetic: `/ˈɪndəstri/`, cn: `n. 工业，行业`, example: "The IT industry is booming." },
    { en: "introduce", phonetic: `/ˌɪntrəˈdjuːs/`, cn: `v. 介绍`, example: "Let me introduce my friend to you." },
    { en: "involve", phonetic: `/ɪnˈvɒlv/`, cn: `v. 涉及，参与`, example: "Don't involve me in this matter." },
    { en: "medical", phonetic: `/ˈmedɪkl/`, cn: `adj. 医学的`, example: "He needs medical attention." },
    { en: "method", phonetic: `/ˈmeθəd/`, cn: `n. 方法`, example: "We need a new method to solve this." },
    { en: "modern", phonetic: `/ˈmɒdn/`, cn: `adj. 现代的`, example: "This is a modern building." },
    { en: "nation", phonetic: `/ˈneɪʃn/`, cn: `n. 国家，民族`, example: "The whole nation celebrated the victory." },
    { en: "organize", phonetic: `/ˈɔːɡənaɪz/`, cn: `v. 组织`, example: "She organized a charity event." },
    { en: "policy", phonetic: `/ˈpɒləsi/`, cn: `n. 政策`, example: "The new policy helps students." },
    { en: "protect", phonetic: `/prəˈtekt/`, cn: `v. 保护`, example: "We must protect the earth." },
    { en: "original", phonetic: `/əˈrɪdʒənl/`, cn: `adj. 原始的，原创的`, example: "This is the original painting." }
  ],
  high: [
    { en: "abandon", phonetic: "/əˈbændən/", cn: "v. 放弃，抛弃", example: "Never abandon your dreams." },
    { en: "benefit", phonetic: "/ˈbenɪfɪt/", cn: "n. 益处 v. 获益", example: "Exercise benefits your health." },
    { en: "concept", phonetic: "/ˈkɒnsept/", cn: "n. 概念", example: "This concept is hard to understand." },
    { en: "demonstrate", phonetic: "/ˈdemənstreɪt/", cn: "v. 证明，展示", example: "She demonstrated great courage." },
    { en: "establish", phonetic: "/ɪˈstæblɪʃ/", cn: "v. 建立", example: "The school was established in 1900." },
    { en: "fundamental", phonetic: "/ˌfʌndəˈment(ə)l/", cn: "adj. 基本的", example: "Reading is a fundamental skill." },
    { en: "generate", phonetic: "/ˈdʒenəreɪt/", cn: "v. 产生", example: "Solar panels generate electricity." },
    { en: "indicate", phonetic: "/ˈɪndɪkeɪt/", cn: "v. 表明，指示", example: "The data indicates a clear trend." },
    { en: "justify", phonetic: "/ˈdʒʌstɪfaɪ/", cn: "v. 证明...正当", example: "How can you justify your behavior?" },
    { en: "maintain", phonetic: "/meɪnˈteɪn/", cn: "v. 维持", example: "It's hard to maintain a friendship." },
    { en: "negotiate", phonetic: "/nɪˈɡəʊʃieɪt/", cn: "v. 谈判", example: "They negotiated a peace treaty." },
    { en: "obvious", phonetic: "/ˈɒbviəs/", cn: "adj. 明显的", example: "The answer is obvious." },
    { en: "participate", phonetic: "/pɑːˈtɪsɪpeɪt/", cn: "v. 参与", example: "Everyone should participate in the discussion." },
    { en: "qualify", phonetic: "/ˈkwɒlɪfaɪ/", cn: "v. 使合格", example: "She qualified as a doctor last year." },
    { en: "recognize", phonetic: "/ˈrekəɡnaɪz/", cn: "v. 认出，承认", example: "I didn't recognize you at first." },
    { en: "significant", phonetic: "/sɪɡˈnɪfɪkənt/", cn: "adj. 重要的", example: "There was a significant improvement." },
    { en: "tendency", phonetic: "/ˈtendənsi/", cn: "n. 倾向", example: "There is a tendency to eat more in winter." },
    { en: "unique", phonetic: "/juːˈniːk/", cn: "adj. 独特的", example: "Every person is unique." },
    { en: "vital", phonetic: "/ˈvaɪt(ə)l/", cn: "adj. 至关重要的", example: "Water is vital for life." },
    { en: "widespread", phonetic: "/ˈwaɪdspred/", cn: "adj. 普遍的", example: "The disease was widespread." },
    { en: "accumulate", phonetic: "/əˈkjuːmjʊleɪt/", cn: "v. 积累", example: "He accumulated a lot of wealth." },
    { en: "circumstance", phonetic: "/ˈsɜːkəmstəns/", cn: "n. 情况", example: "Under no circumstances should you give up." },
    { en: "distinguish", phonetic: "/dɪˈstɪŋɡwɪʃ/", cn: "v. 区分", example: "Can you distinguish between the two?" },
    { en: "emphasize", phonetic: "/ˈemfəsaɪz/", cn: "v. 强调", example: "The teacher emphasized the importance of reading." },
    { en: "frequently", phonetic: "/ˈfriːkwəntli/", cn: "adv. 频繁地", example: "He frequently visits the library." },
    { en: "guarantee", phonetic: "/ˌɡærənˈtiː/", cn: "v./n. 保证", example: "I guarantee you'll love it." },
    { en: "hesitate", phonetic: "/ˈhezɪteɪt/", cn: "v. 犹豫", example: "Don't hesitate to ask for help." },
    { en: "influence", phonetic: "/ˈɪnflʊəns/", cn: "n./v. 影响", example: "Parents influence their children." },
    { en: "persistent", phonetic: "/pəˈsɪstənt/", cn: "adj. 坚持的", example: "She is persistent in her studies." },
    { en: "subsequent", phonetic: "/ˈsʌbsɪkwənt/", cn: "adj. 随后的", example: "Subsequent events proved him right." },
    { en: "thorough", phonetic: "/ˈθʌrə/", cn: "adj. 彻底的", example: "We need a thorough investigation." },
    { en: "sophisticated", phonetic: "/səˈfɪstɪkeɪtɪd/", cn: "adj. 复杂的，精密的", example: "This is a sophisticated system." },
    { en: "consequence", phonetic: "/ˈkɒnsɪkw(ə)ns/", cn: "n. 后果", example: "Think about the consequences." },
    { en: "alternative", phonetic: "/ɔːlˈtɜːnətɪv/", cn: "n. 替代方案 adj. 另类的", example: "Is there an alternative solution?" },
    { en: "perspective", phonetic: "/pəˈspektɪv/", cn: "n. 视角", example: "Try to see things from a different perspective." },
    { en: "comprehensive", phonetic: "/ˌkɒmprɪˈhensɪv/", cn: "adj. 全面的", example: "We need a comprehensive plan." },
    { en: "inevitable", phonetic: "/ɪnˈevɪtəb(ə)l/", cn: "adj. 不可避免的", example: "Change is inevitable." },
    { en: "legitimate", phonetic: "/lɪˈdʒɪtɪmət/", cn: "adj. 合法的，合理的", example: "He has a legitimate reason." },
    { en: "predominant", phonetic: "/prɪˈdɒmɪnənt/", cn: "adj. 主要的", example: "English is the predominant language." },
    { en: "reluctant", phonetic: "/rɪˈlʌktənt/", cn: "adj. 不情愿的", example: "She was reluctant to leave." },
    { en: "sufficient", phonetic: "/səˈfɪʃ(ə)nt/", cn: "adj. 足够的", example: "We have sufficient food." },
    { en: "tremendous", phonetic: "/trɪˈmendəs/", cn: "adj. 巨大的", example: "She made tremendous progress." },
    { en: "controversial", phonetic: "/ˌkɒntrəˈvɜːʃ(ə)l/", cn: "adj. 有争议的", example: "This is a controversial topic." },
    { en: "elaborate", phonetic: "/ɪˈlæb(ə)rət/", cn: "v. 详述 adj. 精心的", example: "Can you elaborate on your idea?" },
    { en: "fluctuate", phonetic: "/ˈflʌktʃueɪt/", cn: "v. 波动", example: "Prices fluctuate every day." },
    { en: "hypothesis", phonetic: "/haɪˈpɒθɪsɪs/", cn: "n. 假设", example: "The experiment tested the hypothesis." },
    { en: "implement", phonetic: "/ˈɪmplɪment/", cn: "v. 实施", example: "We need to implement the new policy." },
    { en: "notion", phonetic: "/ˈnəʊʃ(ə)n/", cn: "n. 概念，观念", example: "I have no notion of what he means." },
    { en: "perceive", phonetic: "/pəˈsiːv/", cn: "v. 察觉", example: "She perceived a change in his tone." },
    { en: "rigid", phonetic: "/ˈrɪdʒɪd/", cn: "adj. 僵硬的，严格的", example: "The rules are too rigid." },
    { en: "stimulate", phonetic: "/ˈstɪmjʊleɪt/", cn: "v. 刺激", example: "Coffee stimulates the brain." },
    { en: "underlying", phonetic: "/ˌʌndəˈlaɪɪŋ/", cn: "adj. 潜在的", example: "What's the underlying cause?" },
    { en: "versatile", phonetic: "/ˈvɜːsətaɪl/", cn: "adj. 多才多艺的", example: "She is a versatile artist." },
    { en: "whereby", phonetic: "/weəˈbaɪ/", cn: "adv. 凭借", example: "He found a way whereby he could succeed." },
    { en: "yield", phonetic: "/jiːld/", cn: "v. 产出 n. 产量", example: "The investment yielded good returns." },
    { en: "ambiguous", phonetic: "/æmˈbɪɡjuəs/", cn: "adj. 模糊的", example: "His answer was ambiguous." },
    { en: "coincide", phonetic: "/ˌkəʊɪnˈsaɪd/", cn: "v. 巧合", example: "Their views coincide on this matter." },
    { en: "deliberate", phonetic: "/dɪˈlɪb(ə)rət/", cn: "adj. 故意的", example: "It was a deliberate mistake." },
    { en: "phenomenon", phonetic: "/fɪˈnɒmɪnən/", cn: "n. 现象", example: "This is a common social phenomenon." },
    { en: "acknowledge", phonetic: "/əkˈnɒlɪdʒ/", cn: "v. 承认，确认", example: "He acknowledged that he had made a mistake." },
    { en: "considerable", phonetic: "/kənˈsɪd(ə)rəb(ə)l/", cn: "adj. 相当大的，可观的", example: "A considerable amount of work remains to be done." },
    { en: "controversy", phonetic: "/ˈkɒntrəvɜːsi/", cn: "n. 争论，争议", example: "The decision caused a lot of controversy." },
    { en: "deteriorate", phonetic: "/dɪˈtɪəriəreɪt/", cn: "v. 恶化，变坏", example: "The patient's condition began to deteriorate." },
    { en: "devote", phonetic: `/dɪˈvəʊt/`, cn: `v. 致力于`, example: "She devoted herself to teaching." },
    { en: "enrich", phonetic: `/ɪnˈrɪtʃ/`, cn: `v. 丰富`, example: "Reading enriches our minds." },
    { en: "evaluate", phonetic: `/ɪˈvæljueɪt/`, cn: `v. 评估`, example: "We need to evaluate the results." },
    { en: "evolve", phonetic: `/ɪˈvɒlv/`, cn: `v. 进化，演变`, example: "Technology evolves rapidly." },
    { en: "exploit", phonetic: `/ɪkˈsplɔɪt/`, cn: `v. 开发，利用`, example: "We should not exploit natural resources blindly." },
    { en: "foster", phonetic: `/ˈfɒstə/`, cn: `v. 培养`, example: "Schools should foster creativity." },
    { en: "hinder", phonetic: `/ˈhɪndə/`, cn: `v. 阻碍`, example: "Lack of money hindered the project." },
    { en: "impose", phonetic: `/ɪmˈpəʊz/`, cn: `v. 施加`, example: "The government imposed new taxes." },
    { en: "infer", phonetic: `/ɪnˈfɜː/`, cn: `v. 推断`, example: "We can infer the answer from the text." },
    { en: "inherit", phonetic: `/ɪnˈherɪt/`, cn: `v. 继承`, example: "She inherited a large fortune." },
    { en: "inspect", phonetic: `/ɪnˈspekt/`, cn: `v. 检查`, example: "The officer inspected the documents." },
    { en: "inspire", phonetic: `/ɪnˈspaɪə/`, cn: `v. 激励`, example: "Her story inspired many people." },
    { en: "interpret", phonetic: `/ɪnˈtɜːprɪt/`, cn: `v. 解释，口译`, example: "Can you interpret this poem?" },
    { en: "intervene", phonetic: `/ˌɪntəˈviːn/`, cn: `v. 干预`, example: "The UN intervened to stop the conflict." },
    { en: "manifest", phonetic: `/ˈmænɪfest/`, cn: `v. 表明 adj. 明显的`, example: "His anger manifested in his voice." },
    { en: "modify", phonetic: `/ˈmɒdɪfaɪ/`, cn: `v. 修改`, example: "We need to modify the plan." },
    { en: "motivate", phonetic: `/ˈməʊtɪveɪt/`, cn: `v. 激励`, example: "The teacher motivated the students." },
    { en: "obscure", phonetic: `/əbˈskjʊə/`, cn: `adj. 模糊的 v. 掩盖`, example: "The meaning of the poem is obscure." },
    { en: "orient", phonetic: `/ˈɔːriənt/`, cn: `v. 定向 n. 东方`, example: "You need to orient yourself in the city." },
    { en: "parallel", phonetic: `/ˈpærəlel/`, cn: `adj. 平行的 n. 平行线`, example: "The two roads run parallel." },
    { en: "prejudice", phonetic: `/ˈpredʒədɪs/`, cn: `n. 偏见`, example: "We should fight against prejudice." },
    { en: "preserve", phonetic: `/prɪˈzɜːv/`, cn: `v. 保护，保存`, example: "We must preserve our cultural heritage." },
    { en: "prevail", phonetic: `/prɪˈveɪl/`, cn: `v. 盛行`, example: "Justice will prevail in the end." },
    { en: "profound", phonetic: `/prəˈfaʊnd/`, cn: `adj. 深刻的`, example: "The book had a profound impact on me." },
    { en: "propagate", phonetic: `/ˈprɒpəɡeɪt/`, cn: `v. 传播`, example: "Rumors propagate quickly online." },
    { en: "restrain", phonetic: `/rɪˈstreɪn/`, cn: `v. 抑制`, example: "He restrained himself from shouting." },
    { en: "retrieve", phonetic: `/rɪˈtriːv/`, cn: `v. 取回`, example: "I need to retrieve my lost password." },
    { en: "scrutinize", phonetic: `/ˈskruːtənaɪz/`, cn: `v. 仔细检查`, example: "The committee scrutinized the report." },
    { en: "shift", phonetic: `/ʃɪft/`, cn: `v. 转移 n. 转变`, example: "There was a shift in public opinion." },
    { en: "simultaneous", phonetic: `/ˌsɪmlˈteɪniəs/`, cn: `adj. 同时发生的`, example: "The two events were simultaneous." },
    { en: "substitute", phonetic: `/ˈsʌbstɪtjuːt/`, cn: `n. 替代品 v. 替代`, example: "Honey is a good substitute for sugar." }
  ],

  // ===== 四级（CET-4） =====
  cet4: [
    { en: "absolute", phonetic: "/ˈæbsəluːt/", cn: `adj. 绝对的`, example: "I have absolute confidence in you." },
    { en: "academic", phonetic: "/ˌækəˈdemɪk/", cn: `adj. 学术的 n. 学者`, example: "She has achieved academic success." },
    { en: "access", phonetic: "/ˈækses/", cn: `n. 接近，入口 v. 访问`, example: "Students can access the library online." },
    { en: "accommodate", phonetic: "/əˈkɒmədeɪt/", cn: `v. 容纳，提供住宿`, example: "The hotel can accommodate 500 guests." },
    { en: "accomplish", phonetic: "/əˈkʌmplɪʃ/", cn: `v. 完成，实现`, example: "We accomplished the task ahead of time." },
    { en: "account", phonetic: "/əˈkaʊnt/", cn: `n. 账户 v. 解释`, example: "Please open a bank account for me." },
    { en: "accurate", phonetic: "/ˈækjərət/", cn: `adj. 准确的`, example: "The clock gives accurate time." },
    { en: "adequate", phonetic: "/ˈædɪkwət/", cn: `adj. 足够的`, example: "We have adequate food for the trip." },
    { en: "adjust", phonetic: "/əˈdʒʌst/", cn: `v. 调整`, example: "You need to adjust to the new environment." },
    { en: "administration", phonetic: "/ədˌmɪnɪˈstreɪʃn/", cn: `n. 管理，行政`, example: "The administration building is over there." },
    { en: "adopt", phonetic: "/əˈdɒpt/", cn: `v. 采取，收养`, example: "They decided to adopt a new strategy." },
    { en: "advance", phonetic: "/ədˈvɑːns/", cn: `n./v. 提前，进步`, example: "Please pay in advance for the ticket." },
    { en: "advertise", phonetic: "/ˈædvətaɪz/", cn: `v. 做广告`, example: "They advertise their products on TV." },
    { en: "afford", phonetic: "/əˈfɔːd/", cn: `v. 买得起`, example: "I can't afford a new car right now." },
    { en: "agent", phonetic: "/ˈeɪdʒənt/", cn: `n. 代理人`, example: "The agent sold the house quickly." },
    { en: "agriculture", phonetic: "/ˈæɡrɪkʌltʃə/", cn: `n. 农业`, example: "Agriculture is the backbone of the economy." },
    { en: "aircraft", phonetic: "/ˈeəkrɑːft/", cn: `n. 飞机，航空器`, example: "The aircraft landed safely." },
    { en: "ambition", phonetic: "/æmˈbɪʃn/", cn: `n. 雄心，抱负`, example: "Her ambition is to become a doctor." },
    { en: "amount", phonetic: "/əˈmaʊnt/", cn: `n. 数量 v. 总计`, example: "A large amount of money was spent." },
    { en: "analyze", phonetic: "/ˈænəlaɪz/", cn: `v. 分析`, example: "Scientists analyze the data carefully." },
    { en: "announce", phonetic: "/əˈnaʊns/", cn: `v. 宣布`, example: "The company announced a new plan." },
    { en: "annual", phonetic: "/ˈænjuəl/", cn: `adj. 每年的`, example: "The annual meeting will be held in May." },
    { en: "apply", phonetic: "/əˈplaɪ/", cn: `v. 申请，应用`, example: "I want to apply for a scholarship." },
    { en: "appreciate", phonetic: "/əˈpriːʃieɪt/", cn: `v. 欣赏，感激`, example: "I really appreciate your help." },
    { en: "approach", phonetic: "/əˈprəʊtʃ/", cn: `n. 方法 v. 接近`, example: "We need a new approach to the problem." },
    { en: "appropriate", phonetic: "/əˈprəʊpriət/", cn: `adj. 合适的`, example: "Wear appropriate clothes for the interview." },
    { en: "approve", phonetic: "/əˈpruːv/", cn: `v. 批准，赞成`, example: "The plan was approved by the board." },
    { en: "argue", phonetic: "/ˈɑːɡjuː/", cn: `v. 争论`, example: "They argue about money all the time." },
    { en: "arrange", phonetic: "/əˈreɪndʒ/", cn: `v. 安排`, example: "I will arrange a meeting for tomorrow." },
    { en: "aspect", phonetic: "/ˈæspekt/", cn: `n. 方面`, example: "We considered every aspect of the issue." },
    { en: "assess", phonetic: "/əˈses/", cn: `v. 评估`, example: "Teachers assess students' progress regularly." },
    { en: "assign", phonetic: "/əˈsaɪn/", cn: `v. 分配`, example: "The teacher assigned us a difficult task." },
    { en: "assist", phonetic: "/əˈsɪst/", cn: `v. 协助`, example: "Can you assist me with this project?" },
    { en: "associate", phonetic: "/əˈsəʊʃieɪt/", cn: `v. 联系 n. 同事`, example: "I associate this song with my childhood." },
    { en: "assume", phonetic: "/əˈsjuːm/", cn: `v. 假定`, example: "Don't assume anything without evidence." },
    { en: "assure", phonetic: "/əˈʃʊə/", cn: `v. 保证`, example: "I assure you that everything will be fine." },
    { en: "atmosphere", phonetic: "/ˈætməsfɪə/", cn: `n. 气氛，大气`, example: "The restaurant has a warm atmosphere." },
    { en: "attach", phonetic: "/əˈtætʃ/", cn: `v. 附上，系`, example: "Please attach your resume to the email." },
    { en: "attempt", phonetic: "/əˈtempt/", cn: `n./v. 尝试`, example: "He made an attempt to climb the mountain." },
    { en: "attend", phonetic: "/əˈtend/", cn: `v. 出席`, example: "All students must attend the lecture." },
    { en: "attitude", phonetic: "/ˈætɪtjuːd/", cn: `n. 态度`, example: "Her attitude toward work is positive." },
    { en: "attract", phonetic: "/əˈtrækt/", cn: `v. 吸引`, example: "The city attracts many tourists." },
    { en: "audience", phonetic: "/ˈɔːdiəns/", cn: `n. 观众`, example: "The audience cheered loudly." },
    { en: "authority", phonetic: "/ɔːˈθɒrəti/", cn: `n. 权力，当局`, example: "The local authority made the decision." },
    { en: "available", phonetic: "/əˈveɪləbl/", cn: `adj. 可用的`, example: "This book is available online." },
    { en: "average", phonetic: "/ˈævərɪdʒ/", cn: `adj. 平均的 n. 平均`, example: "The average score was 80 points." },
    { en: "award", phonetic: "/əˈwɔːd/", cn: `n. 奖品 v. 授予`, example: "She won the best actress award." },
    { en: "aware", phonetic: "/əˈweə/", cn: `adj. 意识到的`, example: "Are you aware of the risks?" },
    { en: "balance", phonetic: "/ˈbæləns/", cn: `n. 平衡 v. 使平衡`, example: "It's important to balance work and rest." },
    { en: "budget", phonetic: "/ˈbʌdʒɪt/", cn: `n. 预算`, example: "We need to stick to our budget." },
    { en: "behavior", phonetic: `/bɪˈheɪvjə/`, cn: `n. 行为`, example: "His behavior was very strange." },
    { en: "belong", phonetic: `/bɪˈlɒŋ/`, cn: `v. 属于`, example: "This book belongs to the library." },
    { en: "board", phonetic: `/bɔːd/`, cn: `n. 木板 v. 上（车/船）`, example: "Please board the train now." },
    { en: "brief", phonetic: `/briːf/`, cn: `adj. 简短的`, example: "He gave a brief introduction." },
    { en: "campaign", phonetic: `/kæmˈpeɪn/`, cn: `n. 运动，战役`, example: "They launched a campaign against smoking." },
    { en: "capacity", phonetic: `/kəˈpæsəti/`, cn: `n. 能力，容量`, example: "The stadium has a capacity of 50,000." },
    { en: "category", phonetic: `/ˈkætəɡəri/`, cn: `n. 类别`, example: "Books are divided into categories." },
    { en: "character", phonetic: `/ˈkærəktə/`, cn: `n. 性格，角色`, example: "He has a strong character." },
    { en: "charge", phonetic: `/tʃɑːdʒ/`, cn: `v. 收费 n. 负责`, example: "Who is in charge of this project?" },
    { en: "civil", phonetic: `/ˈsɪvl/`, cn: `adj. 公民的`, example: "We have civil rights and duties." },
    { en: "claim", phonetic: `/kleɪm/`, cn: `v. 声称 n. 要求`, example: "She claimed that she was innocent." },
    { en: "classic", phonetic: `/ˈklæsɪk/`, cn: `adj. 经典的`, example: "This is a classic novel." },
    { en: "climate", phonetic: `/ˈklaɪmət/`, cn: `n. 气候`, example: "The climate is changing." },
    { en: "commit", phonetic: `/kəˈmɪt/`, cn: `v. 犯（罪），承诺`, example: "He committed a serious crime." },
    { en: "community", phonetic: `/kəˈmjuːnəti/`, cn: `n. 社区`, example: "We live in a friendly community." },
    { en: "compare", phonetic: `/kəmˈpeə/`, cn: `v. 比较`, example: "Compare the two pictures carefully." },
    { en: "compete", phonetic: `/kəmˈpiːt/`, cn: `v. 竞争`, example: "They compete for the championship." },
    { en: "complex", phonetic: `/ˈkɒmpleks/`, cn: `adj. 复杂的`, example: "This is a complex problem." },
    { en: "concern", phonetic: `/kənˈsɜːn/`, cn: `v. 关心 n. 担忧`, example: "Her health is my main concern." },
    { en: "confirm", phonetic: `/kənˈfɜːm/`, cn: `v. 确认`, example: "Please confirm your reservation." },
    { en: "constant", phonetic: `/ˈkɒnstənt/`, cn: `adj. 不断的`, example: "There is a constant need for energy." },
    { en: "contact", phonetic: `/ˈkɒntækt/`, cn: `n./v. 接触，联系`, example: "Please contact me by email." },
    { en: "contain", phonetic: `/kənˈteɪn/`, cn: `v. 包含`, example: "The box contains old letters." },
    { en: "destination", phonetic: `/ˌdestɪˈneɪʃn/`, cn: `n. 目的地`, example: "What is your final destination?" },
    { en: "convince", phonetic: `/kənˈvɪns/`, cn: `v. 说服`, example: "I convinced him to join the team." },
    { en: "crisis", phonetic: `/ˈkraɪsɪs/`, cn: `n. 危机`, example: "The country faces an economic crisis." },
    { en: "critical", phonetic: `/ˈkrɪtɪkl/`, cn: `adj. 关键的`, example: "This is a critical moment." },
    { en: "deliver", phonetic: `/dɪˈlɪvə/`, cn: `v. 递送`, example: "The postman delivers letters every day." },
    { en: "demand", phonetic: `/dɪˈmɑːnd/`, cn: `n./v. 需求`, example: "There is a high demand for engineers." },
    { en: "deposit", phonetic: `/dɪˈpɒzɪt/`, cn: `n. 存款 v. 存放`, example: "I need to deposit some money." },
    { en: "description", phonetic: `/dɪˈskrɪpʃn/`, cn: `n. 描述`, example: "The description matches the suspect." },
    { en: "despite", phonetic: `/dɪˈspaɪt/`, cn: `prep. 尽管`, example: "Despite the rain, we went out." },
    { en: "device", phonetic: `/dɪˈvaɪs/`, cn: `n. 设备`, example: "This is a useful electronic device." }
  ],

  // ===== 考研 =====
  postgrad: [
    { en: "abstain", phonetic: "/əbˈsteɪn/", cn: `v. 弃权，戒除`, example: "He abstained from voting on the proposal." },
    { en: "absurd", phonetic: "/əbˈsɜːd/", cn: `adj. 荒谬的`, example: "It would be absurd to ignore the facts." },
    { en: "abundant", phonetic: "/əˈbʌndənt/", cn: `adj. 丰富的`, example: "The region has abundant natural resources." },
    { en: "accelerate", phonetic: "/əkˈseləreɪt/", cn: `v. 加速`, example: "The car accelerated to overtake the truck." },
    { en: "acquaint", phonetic: "/əˈkweɪnt/", cn: `v. 使熟悉`, example: "Please acquaint yourself with the safety rules." },
    { en: "acquire", phonetic: "/əˈkwaɪə/", cn: `v. 获得`, example: "He acquired a rare painting at auction." },
    { en: "adapt", phonetic: "/əˈdæpt/", cn: `v. 适应，改编`, example: "Children adapt to new environments quickly." },
    { en: "adjacent", phonetic: "/əˈdʒeɪsnt/", cn: `adj. 毗邻的`, example: "The park is adjacent to the school." },
    { en: "administer", phonetic: "/ədˈmɪnɪstə/", cn: `v. 管理，实施`, example: "The test was administered by trained staff." },
    { en: "advocate", phonetic: "/ˈædvəkeɪt/", cn: `v. 提倡 n. 倡导者`, example: "She advocates equal pay for women." },
    { en: "aesthetic", phonetic: "/iːsˈθetɪk/", cn: `adj. 审美的`, example: "The building has great aesthetic value." },
    { en: "affiliate", phonetic: "/əˈfɪlieɪt/", cn: `v. 附属 n. 分支机构`, example: "The company is affiliated with a global group." },
    { en: "affirm", phonetic: "/əˈfɜːm/", cn: `v. 断言，确认`, example: "He affirmed his loyalty to the team." },
    { en: "aggravate", phonetic: "/ˈæɡrəveɪt/", cn: `v. 加重，恶化`, example: "Stress can aggravate the illness." },
    { en: "aggregate", phonetic: "/ˈæɡrɪɡət/", cn: `n. 总计 adj. 合计的`, example: "The aggregate profit rose by ten percent." },
    { en: "allege", phonetic: "/əˈledʒ/", cn: `v. 宣称`, example: "The report alleges that the company lied." },
    { en: "allocate", phonetic: "/ˈæləkeɪt/", cn: `v. 分配`, example: "The government allocated funds for education." },
    { en: "alliance", phonetic: "/əˈlaɪəns/", cn: `n. 联盟`, example: "The two countries formed an alliance." },
    { en: "amend", phonetic: "/əˈmend/", cn: `v. 修正`, example: "The constitution was amended last year." },
    { en: "ample", phonetic: "/ˈæmpl/", cn: `adj. 充足的`, example: "There is ample evidence to support the claim." },
    { en: "analogy", phonetic: "/əˈnælədʒi/", cn: `n. 类比`, example: "He drew an analogy between life and a journey." },
    { en: "anonymous", phonetic: "/əˈnɒnɪməs/", cn: `adj. 匿名的`, example: "The donation came from an anonymous source." },
    { en: "anticipate", phonetic: "/ænˈtɪsɪpeɪt/", cn: `v. 预期`, example: "We anticipate a busy holiday season." },
    { en: "apparatus", phonetic: "/ˌæpəˈreɪtəs/", cn: `n. 器械，设备`, example: "The lab has modern apparatus." },
    { en: "appraisal", phonetic: "/əˈpreɪzl/", cn: `n. 评估`, example: "The employee received a fair appraisal." },
    { en: "aptitude", phonetic: "/ˈæptɪtjuːd/", cn: `n. 才能`, example: "She has an aptitude for mathematics." },
    { en: "arbitrary", phonetic: "/ˈɑːbɪtrəri/", cn: `adj. 任意的`, example: "The decision seemed arbitrary and unfair." },
    { en: "articulate", phonetic: "/ɑːˈtɪkjuleɪt/", cn: `v. 清楚表达 adj. 善于表达的`, example: "He articulated his ideas clearly." },
    { en: "ascend", phonetic: "/əˈsend/", cn: `v. 上升`, example: "The plane ascended through the clouds." },
    { en: "ascribe", phonetic: "/əˈskraɪb/", cn: `v. 归因于`, example: "She ascribed her success to hard work." },
    { en: "assemble", phonetic: "/əˈsembl/", cn: `v. 集合，组装`, example: "The workers assembled the cars efficiently." },
    { en: "assimilate", phonetic: "/əˈsɪməleɪt/", cn: `v. 吸收，同化`, example: "It takes time to assimilate new knowledge." },
    { en: "attribute", phonetic: "/əˈtrɪbjuːt/", cn: `v. 归因 n. 属性`, example: "He attributed his failure to bad luck." },
    { en: "audit", phonetic: "/ˈɔːdɪt/", cn: `n./v. 审计`, example: "The company conducts an annual audit." },
    { en: "authentic", phonetic: "/ɔːˈθentɪk/", cn: `adj. 真实的`, example: "This is an authentic Italian recipe." },
    { en: "authorize", phonetic: "/ˈɔːθəraɪz/", cn: `v. 授权`, example: "Only the manager can authorize payments." },
    { en: "autonomy", phonetic: "/ɔːˈtɒnəmi/", cn: `n. 自主权`, example: "The region was granted autonomy." },
    { en: "avert", phonetic: "/əˈvɜːt/", cn: `v. 避免`, example: "Quick action averted a disaster." },
    { en: "ballot", phonetic: "/ˈbælət/", cn: `n. 选票 v. 投票`, example: "The voters cast their ballot in silence." },
    { en: "barren", phonetic: "/ˈbærən/", cn: `adj. 贫瘠的`, example: "The land was barren and dry." },
    { en: "bewilder", phonetic: "/bɪˈwɪldə/", cn: `v. 使迷惑`, example: "The complicated rules bewildered the beginners." },
    { en: "bilateral", phonetic: "/ˌbaɪˈlætərəl/", cn: `adj. 双边的`, example: "They signed a bilateral trade agreement." },
    { en: "boost", phonetic: "/buːst/", cn: `v. 推动 n. 提升`, example: "The new policy boosted the economy." },
    { en: "breach", phonetic: "/briːtʃ/", cn: `n./v. 违反`, example: "He was sued for breach of contract." },
    { en: "brutal", phonetic: "/ˈbruːtl/", cn: `adj. 残忍的`, example: "The winter was brutal that year." },
    { en: "bureaucracy", phonetic: "/bjʊəˈrɒkrəsi/", cn: `n. 官僚主义`, example: "Reform is needed to reduce bureaucracy." },
    { en: "candidate", phonetic: "/ˈkændɪdət/", cn: `n. 候选人`, example: "She is the best candidate for the job." },
    { en: "casualty", phonetic: "/ˈkæʒuəlti/", cn: `n. 伤亡`, example: "Fortunately, there were no casualties." },
    { en: "celestial", phonetic: "/səˈlestʃl/", cn: `adj. 天体的`, example: "The telescope observes celestial bodies." },
    { en: "chronicle", phonetic: "/ˈkrɒnɪkl/", cn: `n. 编年史 v. 记录`, example: "The book chronicles the history of the city." }
  ],

  // ===== 雅思（IELTS） =====
  ielts: [
    { en: "accommodation", phonetic: "/əˌkɒməˈdeɪʃn/", cn: `n. 住宿`, example: "Student accommodation is quite expensive here." },
    { en: "adolescent", phonetic: "/ˌædəˈlesnt/", cn: `n. 青少年 adj. 青春期的`, example: "Many adolescents face peer pressure." },
    { en: "agenda", phonetic: "/əˈdʒendə/", cn: `n. 议程`, example: "The first item on the agenda is the budget." },
    { en: "agricultural", phonetic: "/ˌæɡrɪˈkʌltʃərəl/", cn: `adj. 农业的`, example: "Agricultural exports increased this year." },
    { en: "anxiety", phonetic: "/æŋˈzaɪəti/", cn: `n. 焦虑`, example: "She felt anxiety before the exam." },
    { en: "archaeology", phonetic: "/ˌɑːkiˈɒlədʒi/", cn: `n. 考古学`, example: "He studies archaeology at university." },
    { en: "artificial", phonetic: "/ˌɑːtɪˈfɪʃl/", cn: `adj. 人工的`, example: "The lake contains artificial fish." },
    { en: "assignment", phonetic: "/əˈsaɪnmənt/", cn: `n. 作业`, example: "The assignment is due next Monday." },
    { en: "assumption", phonetic: "/əˈsʌmpʃn/", cn: `n. 假设`, example: "His theory is based on a false assumption." },
    { en: "brochure", phonetic: "/ˈbrəʊʃə/", cn: `n. 小册子`, example: "I picked up a travel brochure at the airport." },
    { en: "cafeteria", phonetic: "/ˌkæfəˈtɪəriə/", cn: `n. 自助餐厅`, example: "We had lunch in the school cafeteria." },
    { en: "calendar", phonetic: "/ˈkælɪndə/", cn: `n. 日历`, example: "Mark the exam date on your calendar." },
    { en: "canvas", phonetic: "/ˈkænvəs/", cn: `n. 帆布，画布`, example: "The artist painted on a large canvas." },
    { en: "capsule", phonetic: "/ˈkæpsjuːl/", cn: `n. 胶囊`, example: "Take one capsule after each meal." },
    { en: "carrier", phonetic: "/ˈkæriə/", cn: `n. 运输公司，载体`, example: "The airline is a major international carrier." },
    { en: "certificate", phonetic: "/səˈtɪfɪkət/", cn: `n. 证书`, example: "She received a certificate of completion." },
    { en: "chronic", phonetic: "/ˈkrɒnɪk/", cn: `adj. 慢性的`, example: "He suffers from chronic back pain." },
    { en: "civic", phonetic: "/ˈsɪvɪk/", cn: `adj. 市民的`, example: "Voting is a civic duty." },
    { en: "collaborate", phonetic: "/kəˈlæbəreɪt/", cn: `v. 合作`, example: "The two teams collaborated on the project." },
    { en: "commute", phonetic: "/kəˈmjuːt/", cn: `v. 通勤 n. 通勤路程`, example: "He commutes to work by subway." },
    { en: "compile", phonetic: "/kəmˈpaɪl/", cn: `v. 编纂`, example: "They compiled a list of useful resources." },
    { en: "compulsory", phonetic: "/kəmˈpʌlsəri/", cn: `adj. 强制的`, example: "Education is compulsory for all children." },
    { en: "conform", phonetic: "/kənˈfɔːm/", cn: `v. 遵守`, example: "Products must conform to safety standards." },
    { en: "consensus", phonetic: "/kənˈsensəs/", cn: `n. 共识`, example: "The committee reached a consensus." },
    { en: "constitute", phonetic: "/ˈkɒnstɪtjuːt/", cn: `v. 构成`, example: "Women constitute half of the workforce." },
    { en: "construct", phonetic: "/kənˈstrʌkt/", cn: `v. 建造`, example: "They constructed a new bridge over the river." },
    { en: "consume", phonetic: "/kənˈsjuːm/", cn: `v. 消耗`, example: "The car consumes a lot of fuel." },
    { en: "context", phonetic: "/ˈkɒntekst/", cn: `n. 语境`, example: "Guess the meaning from the context." },
    { en: "convey", phonetic: "/kənˈveɪ/", cn: `v. 传达`, example: "Words cannot convey my gratitude." },
    { en: "coordinate", phonetic: "/kəʊˈɔːdɪneɪt/", cn: `v. 协调`, example: "She coordinates the volunteer program." },
    { en: "corporate", phonetic: "/ˈkɔːpərət/", cn: `adj. 公司的`, example: "The corporate office is in Shanghai." },
    { en: "correspond", phonetic: "/ˌkɒrɪˈspɒnd/", cn: `v. 相符，通信`, example: "The data corresponds with our prediction." },
    { en: "counsel", phonetic: "/ˈkaʊnsl/", cn: `n. 建议 v. 咨询`, example: "She counsels students on career choices." },
    { en: "credential", phonetic: "/krəˈdenʃl/", cn: `n. 资格证书`, example: "You need proper credentials to practice medicine." },
    { en: "credible", phonetic: "/ˈkredəbl/", cn: `adj. 可信的`, example: "The witness gave a credible account." },
    { en: "curriculum", phonetic: "/kəˈrɪkjələm/", cn: `n. 课程`, example: "The school updated its curriculum." },
    { en: "deadline", phonetic: "/ˈdedlaɪn/", cn: `n. 截止日期`, example: "The deadline for applications is Friday." },
    { en: "debate", phonetic: "/dɪˈbeɪt/", cn: `n./v. 辩论`, example: "The candidates will debate on TV tonight." },
    { en: "decade", phonetic: "/ˈdekeɪd/", cn: `n. 十年`, example: "The city has changed a lot over the past decade." },
    { en: "dedicate", phonetic: "/ˈdedɪkeɪt/", cn: `v. 奉献`, example: "She dedicated her life to teaching." },
    { en: "delegate", phonetic: "/ˈdelɪɡət/", cn: `n. 代表 v. 授权`, example: "Each club sent a delegate to the meeting." },
    { en: "democracy", phonetic: "/dɪˈmɒkrəsi/", cn: `n. 民主`, example: "A healthy democracy depends on free elections." },
    { en: "demonstrate", phonetic: "/ˈdemənstreɪt/", cn: `v. 证明，示范`, example: "The teacher demonstrated the experiment." },
    { en: "depict", phonetic: "/dɪˈpɪkt/", cn: `v. 描绘`, example: "The painting depicts a rural scene." },
    { en: "derive", phonetic: "/dɪˈraɪv/", cn: `v. 源于`, example: "The word derives from Latin." },
    { en: "dispute", phonetic: "/dɪˈspjuːt/", cn: `n./v. 争端`, example: "The border dispute remains unresolved." },
    { en: "diverse", phonetic: "/daɪˈvɜːs/", cn: `adj. 多样的`, example: "The city has a diverse population." },
    { en: "domestic", phonetic: "/dəˈmestɪk/", cn: `adj. 国内的，家庭的`, example: "Domestic flights are cheaper than international ones." },
    { en: "donate", phonetic: "/dəʊˈneɪt/", cn: `v. 捐赠`, example: "He donated blood at the hospital." },
    { en: "emphasize", phonetic: "/ˈemfəsaɪz/", cn: `v. 强调`, example: "The report emphasizes the need for reform." },
    { en: "ecology", phonetic: `/iˈkɒlədʒi/`, cn: `n. 生态学`, example: "She studies ecology at university." },
    { en: "ecosystem", phonetic: `/ˈiːkəʊsɪstəm/`, cn: `n. 生态系统`, example: "We must protect the forest ecosystem." },
    { en: "eligible", phonetic: `/ˈelɪdʒəbl/`, cn: `adj. 合格的`, example: "Only members are eligible to vote." },
    { en: "eliminate", phonetic: `/ɪˈlɪmɪneɪt/`, cn: `v. 消除`, example: "We need to eliminate poverty." },
    { en: "empirical", phonetic: `/ɪmˈpɪrɪkl/`, cn: `adj. 经验主义的`, example: "The theory is based on empirical data." },
    { en: "endeavor", phonetic: `/ɪnˈdevə/`, cn: `n./v. 努力`, example: "We should endeavor to do our best." },
    { en: "enhance", phonetic: `/ɪnˈhɑːns/`, cn: `v. 增强`, example: "Technology enhances our lives." },
    { en: "entity", phonetic: `/ˈentəti/`, cn: `n. 实体`, example: "The company is a legal entity." },
    { en: "episode", phonetic: `/ˈepɪsəʊd/`, cn: `n. 片段，一集`, example: "I watched the last episode yesterday." },
    { en: "equity", phonetic: `/ˈekwəti/`, cn: `n. 公平`, example: "We should strive for social equity." },
    { en: "erosion", phonetic: `/ɪˈrəʊʒn/`, cn: `n. 侵蚀`, example: "Soil erosion is a serious problem." },
    { en: "ethical", phonetic: `/ˈeθɪkl/`, cn: `adj. 伦理的`, example: "This is an ethical dilemma." },
    { en: "incentive", phonetic: `/ɪnˈsentɪv/`, cn: `n. 激励`, example: "Money is a strong incentive for workers." },
    { en: "eventually", phonetic: `/ɪˈventʃuəli/`, cn: `adv. 最终`, example: "He eventually found a good job." },
    { en: "evident", phonetic: `/ˈevɪdənt/`, cn: `adj. 明显的`, example: "It is evident that he is lying." },
    { en: "integrate", phonetic: `/ˈɪntɪɡreɪt/`, cn: `v. 整合`, example: "We need to integrate different systems." },
    { en: "exhibit", phonetic: `/ɪɡˈzɪbɪt/`, cn: `v. 展览 n. 展品`, example: "The museum exhibits ancient artifacts." },
    { en: "expand", phonetic: `/ɪkˈspænd/`, cn: `v. 扩展`, example: "The company plans to expand overseas." },
    { en: "exposure", phonetic: `/ɪkˈspəʊʒə/`, cn: `n. 接触，曝光`, example: "Exposure to the sun can damage your skin." },
    { en: "facilitate", phonetic: `/fəˈsɪlɪteɪt/`, cn: `v. 促进`, example: "Technology facilitates communication." },
    { en: "fatigue", phonetic: `/fəˈtiːɡ/`, cn: `n. 疲劳`, example: "Driver fatigue causes many accidents." },
    { en: "feasible", phonetic: `/ˈfiːzəbl/`, cn: `adj. 可行的`, example: "Is this plan feasible?" },
    { en: "feature", phonetic: `/ˈfiːtʃə/`, cn: `n. 特征 v. 以...为特色`, example: "Safety is a key feature of this car." },
    { en: "flourish", phonetic: `/ˈflʌrɪʃ/`, cn: `v. 繁荣`, example: "The economy flourished in the 1990s." },
    { en: "format", phonetic: `/ˈfɔːmæt/`, cn: `n. 格式`, example: "The test format has changed." },
    { en: "formula", phonetic: `/ˈfɔːmjələ/`, cn: `n. 公式`, example: "Do you remember the formula?" },
    { en: "fragment", phonetic: `/ˈfræɡmənt/`, cn: `n. 碎片`, example: "The vase broke into fragments." },
    { en: "framework", phonetic: `/ˈfreɪmwɜːk/`, cn: `n. 框架`, example: "We need a legal framework." },
    { en: "hierarchy", phonetic: `/ˈhaɪərɑːki/`, cn: `n. 等级制度`, example: "The company has a strict hierarchy." },
    { en: "identify", phonetic: `/aɪˈdentɪfaɪ/`, cn: `v. 识别`, example: "Can you identify the suspect?" },
    { en: "illustrate", phonetic: `/ˈɪləstreɪt/`, cn: `v. 说明`, example: "Let me illustrate with an example." }
  ],

  // ===== 托福（TOEFL） =====
  toefl: [
    { en: "abstraction", phonetic: "/æbˈstrækʃn/", cn: `n. 抽象`, example: "Mathematics deals with abstraction." },
    { en: "accessible", phonetic: "/əkˈsesəbl/", cn: `adj. 可进入的，易接近的`, example: "The museum is accessible to wheelchair users." },
    { en: "acid", phonetic: "/ˈæsɪd/", cn: `n. 酸 adj. 酸的`, example: "Acid rain damages forests and lakes." },
    { en: "adaptation", phonetic: "/ˌædæpˈteɪʃn/", cn: `n. 适应，改编`, example: "The film is an adaptation of a novel." },
    { en: "advent", phonetic: "/ˈædvent/", cn: `n. 到来`, example: "The advent of the internet changed everything." },
    { en: "agitate", phonetic: "/ˈædʒɪteɪt/", cn: `v. 鼓动，搅动`, example: "The workers agitated for better wages." },
    { en: "agrarian", phonetic: "/əˈɡreəriən/", cn: `adj. 农业的`, example: "The country underwent agrarian reform." },
    { en: "alloy", phonetic: "/ˈælɔɪ/", cn: `n. 合金`, example: "Bronze is an alloy of copper and tin." },
    { en: "amass", phonetic: "/əˈmæs/", cn: `v. 积聚`, example: "He amassed a fortune over the years." },
    { en: "anomaly", phonetic: "/əˈnɒməli/", cn: `n. 异常`, example: "Scientists detected an anomaly in the data." },
    { en: "anthropology", phonetic: "/ˌænθrəˈpɒlədʒi/", cn: `n. 人类学`, example: "She majors in anthropology." },
    { en: "antibiotic", phonetic: "/ˌæntibaɪˈɒtɪk/", cn: `n. 抗生素`, example: "The doctor prescribed an antibiotic." },
    { en: "apex", phonetic: "/ˈeɪpeks/", cn: `n. 顶点`, example: "They reached the apex of the mountain." },
    { en: "archipelago", phonetic: "/ˌɑːkɪˈpeləɡəʊ/", cn: `n. 群岛`, example: "Indonesia is a large archipelago." },
    { en: "arid", phonetic: "/ˈærɪd/", cn: `adj. 干旱的`, example: "The desert is an arid region." },
    { en: "array", phonetic: "/əˈreɪ/", cn: `n. 一系列，阵列`, example: "The store offers a wide array of goods." },
    { en: "asteroid", phonetic: "/ˈæstərɔɪd/", cn: `n. 小行星`, example: "An asteroid passed close to Earth." },
    { en: "augment", phonetic: "/ɔːɡˈment/", cn: `v. 增加`, example: "He augmented his income by tutoring." },
    { en: "austere", phonetic: "/ɒˈstɪə/", cn: `adj. 朴素的`, example: "The monk lived an austere life." },
    { en: "bacterium", phonetic: "/bækˈtɪəriəm/", cn: `n. 细菌`, example: "The bacterium can cause disease." },
    { en: "benchmark", phonetic: "/ˈbentʃmɑːk/", cn: `n. 基准`, example: "This test sets the benchmark for quality." },
    { en: "biodegradable", phonetic: "/ˌbaɪəʊdɪˈɡreɪdəbl/", cn: `adj. 可生物降解的`, example: "Use biodegradable packaging to protect the environment." },
    { en: "bizarre", phonetic: "/bɪˈzɑː/", cn: `adj. 奇异的`, example: "He had a bizarre dream last night." },
    { en: "brittle", phonetic: "/ˈbrɪtl/", cn: `adj. 脆的`, example: "The old paper was brittle and yellow." },
    { en: "bulk", phonetic: "/bʌlk/", cn: `n. 大部分，体积`, example: "The bulk of the work is done." },
    { en: "calculus", phonetic: "/ˈkælkjələs/", cn: `n. 微积分`, example: "Calculus is required for engineering majors." },
    { en: "canopy", phonetic: "/ˈkænəpi/", cn: `n. 树冠`, example: "Monkeys live in the forest canopy." },
    { en: "carbohydrate", phonetic: "/ˌkɑːbəʊˈhaɪdreɪt/", cn: `n. 碳水化合物`, example: "Bread is rich in carbohydrates." },
    { en: "catastrophe", phonetic: "/kəˈtæstrəfi/", cn: `n. 灾难`, example: "The earthquake was a major catastrophe." },
    { en: "cavity", phonetic: "/ˈkævəti/", cn: `n. 洞`, example: "The dentist filled a cavity in my tooth." },
    { en: "cellular", phonetic: "/ˈseljələ/", cn: `adj. 细胞的`, example: "Smoking damages cellular structures." },
    { en: "census", phonetic: "/ˈsensəs/", cn: `n. 人口普查`, example: "The census is held every ten years." },
    { en: "ceramic", phonetic: "/səˈræmɪk/", cn: `adj. 陶瓷的 n. 陶瓷`, example: "She makes ceramic bowls by hand." },
    { en: "cognitive", phonetic: "/ˈkɒɡnətɪv/", cn: `adj. 认知的`, example: "The disease affects cognitive function." },
    { en: "coherent", phonetic: "/kəʊˈhɪərənt/", cn: `adj. 连贯的`, example: "She gave a coherent explanation." },
    { en: "collide", phonetic: "/kəˈlaɪd/", cn: `v. 碰撞`, example: "The two cars collided at the crossing." },
    { en: "commodity", phonetic: "/kəˈmɒdəti/", cn: `n. 商品`, example: "Oil is an important commodity." },
    { en: "compatible", phonetic: "/kəmˈpætəbl/", cn: `adj. 兼容的`, example: "The software is compatible with all systems." },
    { en: "compensate", phonetic: "/ˈkɒmpenseɪt/", cn: `v. 补偿`, example: "The company compensated the victims." },
    { en: "conceive", phonetic: "/kənˈsiːv/", cn: `v. 构想`, example: "He conceived a brilliant plan." },
    { en: "contaminate", phonetic: "/kənˈtæmɪneɪt/", cn: `v. 污染`, example: "The river was contaminated by waste." },
    { en: "cylinder", phonetic: "/ˈsɪlɪndə/", cn: `n. 圆柱体`, example: "The engine has four cylinders." },
    { en: "decompose", phonetic: "/ˌdiːkəmˈpəʊz/", cn: `v. 分解`, example: "Leaves decompose into soil." },
    { en: "deficient", phonetic: "/dɪˈfɪʃnt/", cn: `adj. 缺乏的`, example: "His diet is deficient in vitamins." },
    { en: "detergent", phonetic: "/dɪˈtɜːdʒənt/", cn: `n. 洗涤剂`, example: "Use detergent to clean the clothes." },
    { en: "deviate", phonetic: "/ˈdiːvieɪt/", cn: `v. 偏离`, example: "Do not deviate from the original plan." },
    { en: "diameter", phonetic: "/daɪˈæmɪtə/", cn: `n. 直径`, example: "The pipe has a diameter of ten centimeters." },
    { en: "digest", phonetic: "/daɪˈdʒest/", cn: `v. 消化`, example: "Some foods are hard to digest." },
    { en: "diminish", phonetic: "/dɪˈmɪnɪʃ/", cn: `v. 减少`, example: "The threat has diminished over time." },
    { en: "discharge", phonetic: "/dɪsˈtʃɑːdʒ/", cn: `v. 排放 n. 排出物`, example: "The factory was fined for illegal discharge." }
  ]
};

// ===== 口语跟读短句 =====
const SPEAKING_DATA = [
  { en: "How are you doing today?", cn: "你今天过得怎么样？", scene: "日常问候" },
  { en: "It's nice to meet you.", cn: "很高兴认识你。", scene: "初次见面" },
  { en: "Could you please help me?", cn: "请问你能帮帮我吗？", scene: "请求帮助" },
  { en: "What do you mean by that?", cn: "你那样说是什么意思？", scene: "表达疑问" },
  { en: "I'm sorry, I didn't catch that.", cn: "抱歉，我没听清。", scene: "没听清时" },
  { en: "Let me think about it for a moment.", cn: "让我想一下。", scene: "需要思考" },
  { en: "That sounds like a great idea!", cn: "听起来是个好主意！", scene: "表示赞同" },
  { en: "I'm looking forward to it.", cn: "我很期待。", scene: "表达期待" },
  { en: "Could you say that again, please?", cn: "能请你再说一遍吗？", scene: "请求重复" },
  { en: "I completely agree with you.", cn: "我完全同意你的看法。", scene: "表示赞同" },
  { en: "What's your opinion on this?", cn: "你对此有什么看法？", scene: "征求意见" },
  { en: "I'd like to make a reservation.", cn: "我想预约。", scene: "餐厅/酒店" },
  { en: "How much does this cost?", cn: "这个多少钱？", scene: "购物" },
  { en: "Where is the nearest restroom?", cn: "最近的洗手间在哪里？", scene: "问路" },
  { en: "Can I pay by credit card?", cn: "我可以用信用卡付款吗？", scene: "支付" },
  { en: "I'll have the same, please.", cn: "请给我来一样的。", scene: "点餐" },
  { en: "What time does it open?", cn: "几点开门？", scene: "询问时间" },
  { en: "I'm sorry for being late.", cn: "抱歉我迟到了。", scene: "道歉" },
  { en: "No worries, it's fine.", cn: "没关系，没事的。", scene: "回应道歉" },
  { en: "Have a nice day!", cn: "祝你有美好的一天！", scene: "告别" },
  { en: "I'm just browsing, thank you.", cn: "我只是随便看看，谢谢。", scene: "购物" },
  { en: "Could I get the bill, please?", cn: "请给我账单好吗？", scene: "结账" },
  { en: "What do you recommend?", cn: "你有什么推荐？", scene: "寻求建议" },
  { en: "I'll take it.", cn: "我要买这个。", scene: "购物决定" },
  { en: "Excuse me, where is the exit?", cn: "打扰一下，出口在哪里？", scene: "问路" },
  { en: "Do you have this in a larger size?", cn: "这个有更大号的吗？", scene: "购物" },
  { en: "I'd like to try the local specialty, please.", cn: "我想尝尝当地的特色菜。", scene: "点餐" },
  { en: "Is it within walking distance from here?", cn: "从这里走路能到吗？", scene: "问路" },
  { en: "It's been ages! How have you been?", cn: "好久不见！你最近怎么样？", scene: "社交" },
  { en: "Is there a direct train to the airport?", cn: "有直达机场的火车吗？", scene: "旅行" }
];

// ===== 经典阅读（中英对照） =====
const READING_DATA = [
  {
    title: "The Happy Day (快乐的一天)",
    level: "初级",
    difficulty: "⭐",
    paragraphs: [
      { en: "Sarah woke up early in the morning. The sun was shining brightly through her window. She stretched her arms and smiled. Today was going to be a special day.", cn: "莎拉早上很早就醒了。阳光透过窗户灿烂地照进来。她伸了伸懒腰，微笑着。今天将是特别的一天。" },
      { en: "She put on her favorite blue dress and went downstairs. Her mother was making breakfast in the kitchen. The smell of pancakes filled the air.", cn: "她穿上最喜欢的蓝色裙子，下了楼。妈妈正在厨房做早餐。空气中弥漫着煎饼的香味。" },
      { en: "Good morning, Mom! Sarah said happily. Her mother turned around and gave her a big hug. Good morning, sweetheart. Happy birthday!", cn: "早上好，妈妈！莎拉开心地说。妈妈转过身给了她一个大大的拥抱。早上好，亲爱的。生日快乐！" },
      { en: "Sarah had forgotten it was her own birthday! She felt so surprised and happy. Her father came in with a big box wrapped in colorful paper.", cn: "莎拉都忘了今天是自己的生日！她感到又惊喜又开心。爸爸拿着一个用彩色纸包裹的大盒子走了进来。" },
      { en: "This is for you, he said with a smile. Sarah opened the box carefully. Inside was a beautiful bicycle! It was red and shiny. She had wanted one for a long time.", cn: "这是给你的，他微笑着说。莎拉小心地打开盒子。里面是一辆漂亮的自行车！红色的，闪闪发亮。她想要一辆已经很久了。" },
      { en: "Thank you, Dad! Thank you, Mom! She hugged them both. It was the best birthday ever. Sometimes the best things in life come when you least expect them.", cn: "谢谢你，爸爸！谢谢你，妈妈！她拥抱了他们两个。这是最好的生日。有时候，生活中最美好的事情往往在你最意想不到的时候到来。" }
    ],
    vocabulary: [
      { word: "stretch", meaning: "v. 伸展" },
      { word: "pancake", meaning: "n. 煎饼" },
      { word: "sweetheart", meaning: "n. 亲爱的" },
      { word: "wrap", meaning: "v. 包裹" },
      { word: "shiny", meaning: "adj. 闪亮的" }
    ]
  },
  {
    title: "A Letter to My Future Self (致未来的自己)",
    level: "初中级",
    difficulty: "⭐⭐",
    paragraphs: [
      { en: "Dear future me, I am writing this letter to you from the year 2024. I wonder where you are now and what you are doing. I hope you are happy and healthy.", cn: "亲爱的未来的我，我在2024年给你写这封信。我想知道你现在在哪里，在做什么。我希望你快乐健康。" },
      { en: "Right now, I am a student trying my best to learn and grow every day. I have many dreams. I want to travel the world, learn different languages, and help people who need it.", cn: "现在，我是一个学生，每天尽力学习和成长。我有很多梦想。我想环游世界，学习不同的语言，帮助需要帮助的人。" },
      { en: "I hope you have not given up on these dreams. Life can be difficult sometimes, but I believe that you are stronger than you think. Remember the time when you were afraid to speak in front of the class, but you did it anyway?", cn: "我希望你没有放弃这些梦想。生活有时会很艰难，但我相信你比你想象的更强大。还记得你害怕在全班面前发言，但还是做到了的那次吗？" },
      { en: "I want you to know that it is okay to make mistakes. Every mistake is a lesson that helps you grow. Do not be too hard on yourself. Be kind to yourself, just as you are kind to others.", cn: "我想让你知道，犯错没关系。每一个错误都是帮助你成长的教训。不要对自己太苛刻。善待自己，就像你善待别人一样。" },
      { en: "If you are reading this and feeling lost, remember that it is never too late to start over. Life is not a race. Everyone moves at their own pace. What matters is that you keep moving forward.", cn: "如果你读到这封信时感到迷茫，请记住，重新开始永远不晚。生活不是一场比赛。每个人都有自己的节奏。重要的是你一直在向前走。" },
      { en: "Take care of the people you love. Spend time with your family. Call your old friends. And most importantly, never stop learning. The world is full of wonderful things waiting to be discovered.", cn: "照顾好你爱的人。花时间陪伴家人。给老朋友打电话。最重要的是，永远不要停止学习。这个世界充满了等待被发现的美好事物。" },
      { en: "With love and hope, your past self.", cn: "带着爱与希望，过去的你。" }
    ],
    vocabulary: [
      { word: "wonder", meaning: "v. 想知道" },
      { word: "give up", meaning: "phr. 放弃" },
      { word: "be hard on", meaning: "phr. 对...苛刻" },
      { word: "pace", meaning: "n. 节奏" },
      { word: "matter", meaning: "v. 重要" }
    ]
  },
  {
    title: "The Power of Habit (习惯的力量)",
    level: "中级",
    difficulty: "⭐⭐⭐",
    paragraphs: [
      { en: "Have you ever thought about how much of your daily life is controlled by habits? Studies show that about 40% of our daily actions are not decisions, but habits. This means nearly half of what we do every day is automatic.", cn: "你是否想过，你的日常生活有多少是被习惯控制的？研究表明，我们大约40%的日常行为不是决定，而是习惯。这意味着我们每天所做的事情中有将近一半是自动的。" },
      { en: "Habits are powerful because they free our brains from making countless small decisions. Imagine if you had to consciously decide to brush your teeth, tie your shoes, or drive to work every single time. Your brain would be exhausted before noon.", cn: "习惯之所以强大，是因为它们解放了我们的大脑，使其不必做出无数微小的决定。想象一下，如果每次你都必须有意识地决定刷牙、系鞋带或开车上班，你的大脑在中午之前就会筋疲力尽。" },
      { en: "The problem is that not all habits are good ones. Bad habits — like checking your phone too often, eating junk food, or procrastinating — can slowly damage your life. The good news is that habits can be changed.", cn: "问题是，并非所有习惯都是好习惯。坏习惯——比如频繁看手机、吃垃圾食品或拖延——会慢慢损害你的生活。好消息是，习惯是可以改变的。" },
      { en: "To build a new habit, start small. If you want to read more, don't set a goal of reading a book a week. Start with just five pages a day. The key is consistency, not intensity. Small actions repeated daily become powerful habits over time.", cn: "要养成新习惯，从小处开始。如果你想多读书，不要设定一周读一本书的目标。从每天五页开始。关键是坚持，而不是强度。每天重复的小行动会随着时间推移变成强大的习惯。" },
      { en: "It takes about 21 to 66 days to form a new habit, depending on its complexity. During this time, your brain is literally rewiring itself. The more you repeat an action, the stronger the neural pathway becomes, until the behavior feels natural.", cn: "养成一个新习惯大约需要21到66天，取决于其复杂程度。在这段时间里，你的大脑确实在重新连接自己。你越是重复一个动作，神经通路就变得越强，直到这种行为感觉变得自然。" },
      { en: "Remember, you cannot eliminate a bad habit; you can only replace it. If you want to stop checking your phone before bed, replace that habit with reading a book or listening to calm music. The brain needs a new routine to follow.", cn: "记住，你不能消除一个坏习惯；你只能替换它。如果你想在睡前不再看手机，用读书或听轻音乐来替换那个习惯。大脑需要一个新的程序来遵循。" },
      { en: "Your habits shape your future. Choose them wisely, for they will determine who you become. As the saying goes: first we make our habits, then our habits make us.", cn: "你的习惯塑造你的未来。明智地选择它们，因为它们将决定你成为什么样的人。正如俗话所说：我们先养成习惯，然后习惯造就我们。" }
    ],
    vocabulary: [
      { word: "automatic", meaning: "adj. 自动的" },
      { word: "exhausted", meaning: "adj. 筋疲力尽的" },
      { word: "procrastinate", meaning: "v. 拖延" },
      { word: "consistency", meaning: "n. 一致性，坚持" },
      { word: "intensity", meaning: "n. 强度" },
      { word: "neural", meaning: "adj. 神经的" },
      { word: "eliminate", meaning: "v. 消除" }
    ]
  },
  {
    title: "The Little Star (小星星的故事)",
    level: "初级",
    difficulty: "⭐",
    paragraphs: [
      { en: "Once upon a time, there was a little star in the night sky. The little star was not as big or as bright as the other stars. It felt sad and small.", cn: "从前，夜空中有一颗小星星。这颗小星星不像其他星星那样大、那样亮。它感到又难过又渺小。" },
      { en: "Why can't I be big and bright like the others? the little star asked the moon. The moon smiled kindly. Every star is special in its own way, the moon said.", cn: "为什么我不能像其他星星一样又大又亮呢？小星星问月亮。月亮慈祥地笑了。每颗星星都有自己特别的地方，月亮说。" },
      { en: "One night, a little girl looked up at the sky. She saw the little star and pointed at it. Look, Mommy! That star is so cute! she said happily.", cn: "一天晚上，一个小女孩抬头看天空。她看到了那颗小星星，指着它说。看，妈妈！那颗星星好可爱！她开心地说。" },
      { en: "The little star was surprised. Someone had noticed it! From that day on, the little star shone as brightly as it could. It learned that you don't have to be the biggest to be special.", cn: "小星星很惊讶。有人注意到它了！从那天起，小星星尽它所能地闪耀着。它明白了，你不一定要成为最大的才能与众不同。" },
      { en: "We are all like that little star. We may feel small sometimes, but to someone, we are the brightest light in their sky.", cn: "我们都像那颗小星星。有时我们可能感到渺小，但对某个人来说，我们是他们天空中最亮的光。" }
    ],
    vocabulary: [
      { word: "once upon a time", meaning: "phr. 从前" },
      { word: "bright", meaning: "adj. 明亮的" },
      { word: "point", meaning: "v. 指" },
      { word: "cute", meaning: "adj. 可爱的" },
      { word: "surprised", meaning: "adj. 惊讶的" }
    ]
  },
  {
    title: "Why We Should Read (为什么我们应该阅读)",
    level: "中级",
    difficulty: "⭐⭐⭐",
    paragraphs: [
      { en: "In today's fast-paced world, many people have given up reading. They prefer short videos and quick messages. But reading is one of the most valuable habits you can develop, and here is why.", cn: "在当今快节奏的世界里，很多人放弃了阅读。他们更喜欢短视频和快速消息。但阅读是你能养成的最有价值的习惯之一，以下是原因。" },
      { en: "First, reading improves your brain. When you read, your brain is actively working — imagining scenes, understanding ideas, and making connections. Studies show that people who read regularly have slower cognitive decline as they age.", cn: "首先，阅读能改善你的大脑。当你阅读时，你的大脑在积极工作——想象场景、理解概念、建立联系。研究表明，经常阅读的人随着年龄增长，认知能力下降得更慢。" },
      { en: "Second, reading builds empathy. When you read a novel, you step into someone else's shoes. You experience their emotions, understand their struggles, and see the world from their perspective. This makes you more understanding in real life.", cn: "其次，阅读能培养同理心。当你读小说时，你设身处地地体验别人的生活。你感受他们的情感，理解他们的挣扎，从他们的角度看世界。这让你在现实生活中更加善解人意。" },
      { en: "Third, reading reduces stress. Getting lost in a good book can lower your heart rate and ease muscle tension. Just six minutes of reading can reduce stress by up to 68%, according to a study by the University of Sussex.", cn: "第三，阅读能减轻压力。沉浸在一本好书中可以降低心率，缓解肌肉紧张。根据苏塞克斯大学的研究，仅仅六分钟的阅读就能将压力减少高达68%。" },
      { en: "Fourth, reading expands your vocabulary. The more you read, the more words you encounter. These words naturally become part of your own vocabulary, making you a better communicator and writer.", cn: "第四，阅读扩展你的词汇量。你读得越多，遇到的词就越多。这些词自然而然地成为你自己词汇的一部分，使你成为更好的沟通者和写作者。" },
      { en: "Finally, reading is a form of entertainment that costs almost nothing. A library card gives you access to millions of books. In a world where we pay for everything, reading remains one of life's greatest free pleasures.", cn: "最后，阅读是一种几乎不花钱的娱乐方式。一张图书馆借书证就能让你接触到数百万本书。在一个什么都要花钱的世界里，阅读仍然是生活中最大的免费乐趣之一。" },
      { en: "So pick up a book today. Start with just ten minutes a day. Your future self will thank you for it.", cn: "所以今天就拿起一本书吧。从每天十分钟开始。未来的你会感谢你今天的决定。" }
    ],
    vocabulary: [
      { word: "fast-paced", meaning: "adj. 快节奏的" },
      { word: "cognitive", meaning: "adj. 认知的" },
      { word: "empathy", meaning: "n. 同理心" },
      { word: "tension", meaning: "n. 紧张" },
      { word: "encounter", meaning: "v. 遇到" },
      { word: "entertainment", meaning: "n. 娱乐" }
    ]
  },
  {
    title: "The Seasons of Life (人生的四季)",
    level: "中高级",
    difficulty: "⭐⭐⭐⭐",
    paragraphs: [
      { en: "Nature has its four seasons, and so does life. Each season brings its own beauty, challenges, and lessons. Understanding the seasons of life can help us navigate our journey with more wisdom and patience.", cn: "大自然有四季，人生亦然。每个季节都有其独特的美、挑战和教训。理解人生的四季能帮助我们以更多的智慧和耐心来导航我们的旅程。" },
      { en: "Spring is the season of beginnings. In life, this is our childhood and youth — a time of learning, growing, and dreaming. Everything seems possible. The world is full of wonder, and each day brings new discoveries. Like seeds planted in spring, the experiences of our youth take root and shape who we become.", cn: "春天是开始的季节。在人生中，这就是我们的童年和青年——一个学习、成长和梦想的时期。一切似乎都是可能的。世界充满了奇妙，每一天都带来新的发现。就像春天播下的种子，我们年轻时的经历扎根并塑造了我们成为的人。" },
      { en: "Summer is the season of action and energy. This is our adult years — the time when we work hard, build careers, raise families, and pursue our ambitions. The days are long and full of activity. Sometimes the heat is intense, and we may feel overwhelmed. But summer is also when we harvest the rewards of our springtime efforts.", cn: "夏天是行动和能量的季节。这是我们的成年时期——我们努力工作、建立事业、养育家庭、追求抱负的时间。日子漫长而充实。有时炎热是强烈的，我们可能感到不堪重负。但夏天也是我们收获春天努力回报的时候。" },
      { en: "Autumn is the season of reflection and gratitude. As the leaves change color and fall, we too begin to slow down and appreciate what we have built. This is the time when we realize what truly matters — not the titles or the wealth, but the relationships, the memories, and the impact we have made on others.", cn: "秋天是反思和感恩的季节。当树叶变色飘落时，我们也开始放慢脚步，感恩我们所建立的一切。这个时候我们意识到什么才是真正重要的——不是头衔或财富，而是人际关系、回忆，以及我们对他人的影响。" },
      { en: "Winter is the season of rest and wisdom. It may seem cold and quiet, but beneath the surface, the earth is preparing for new growth. In life, winter represents our later years — a time to share our wisdom with the next generation, to tell our stories, and to find peace in the life we have lived.", cn: "冬天是休息和智慧的季节。它看似寒冷安静，但在表面之下，大地正在为新的生长做准备。在人生中，冬天代表我们的晚年——与下一代分享智慧、讲述我们的故事、在我们所经历的生活中找到平静的时光。" },
      { en: "The beauty of seasons is that they always come again. No winter lasts forever, and no spring skips its turn. Whatever season you are in right now, remember: it is temporary, and it has something valuable to teach you. Embrace it fully, for each season is a gift.", cn: "四季之美在于它们总会再次来临。没有冬天会永远持续，也没有春天会错过它的轮次。无论你现在处于哪个季节，请记住：它是暂时的，它有宝贵的东西要教你。充分拥抱它，因为每个季节都是一份礼物。" }
    ],
    vocabulary: [
      { word: "navigate", meaning: "v. 导航，航行" },
      { word: "ambition", meaning: "n. 抱负" },
      { word: "overwhelmed", meaning: "adj. 不堪重负的" },
      { word: "reflection", meaning: "n. 反思" },
      { word: "gratitude", meaning: "n. 感恩" },
      { word: "temporary", meaning: "adj. 暂时的" },
      { word: "embrace", meaning: "v. 拥抱" }
    ]
  },
  {
    title: "The Fox and the Grapes (狐狸与葡萄)",
    level: "初级",
    difficulty: "⭐",
    paragraphs: [
      { en: "One hot summer day, a fox was walking through an orchard. He was very thirsty and hungry. Suddenly, he saw a bunch of ripe grapes hanging from a vine. The grapes were purple and juicy, and they looked delicious.", cn: "一个炎热的夏日，一只狐狸走过果园。他又渴又饿。突然，他看到藤蔓上挂着一串成熟的葡萄。葡萄紫莹莹的，汁水饱满，看起来美味极了。" },
      { en: "\"Those grapes are exactly what I need to quench my thirst,\" the fox said to himself. He stepped back a few paces, then ran and jumped as high as he could. But he missed the grapes by a long way.", cn: "\"那些葡萄正好能解我的渴，\"狐狸自言自语道。他退后几步，然后跑起来，尽力跳得高高的。但他差得远，没够到葡萄。" },
      { en: "He tried again. One, two, three — he jumped! But still he could not reach the grapes. He tried a third time with all his strength, but it was no use. The grapes hung too high for him to reach.", cn: "他又试了一次。一、二、三——他跳了起来！但还是够不到葡萄。他使出全身力气试了第三次，但没有用。葡萄挂得太高了，他够不着。" },
      { en: "Finally, the fox gave up. He walked away with his head held high, muttering to himself, \"Those grapes are probably sour anyway. I am sure they are not worth eating.\"", cn: "最后，狐狸放弃了。他昂着头走开了，嘴里嘟囔着：\"那些葡萄多半是酸的。我敢肯定它们不值得吃。\"" },
      { en: "Moral: It is easy to despise what you cannot have. Instead of making excuses, we should accept our limitations with honesty and grace.", cn: "寓意：人们很容易贬低自己得不到的东西。与其找借口，不如诚实优雅地接受自己的局限。" }
    ],
    vocabulary: [
      { word: "orchard", meaning: "n. 果园" },
      { word: "vine", meaning: "n. 藤蔓" },
      { word: "quench", meaning: "v. 解渴" },
      { word: "mutter", meaning: "v. 嘟囔" },
      { word: "despise", meaning: "v. 轻视，鄙视" }
    ]
  }
];

// ===== 每日跟读（短语+短文） =====
const PRACTICE_DATA = {
  phrases: [
    {
      en: "Actions speak louder than words.",
      cn: `行动胜于言辞。`,
      tip: `注意 actions 的连读和 louder 的发音`,
      tags: [`谚语`, `日常`]
    },
    {
      en: "I'm really looking forward to the weekend.",
      cn: `我非常期待周末。`,
      tip: `looking forward to 连读，to 后接名词`,
      tags: [`日常`, `口语`]
    },
    {
      en: "Could you do me a favor and pass the salt?",
      cn: `你能帮我个忙把盐递过来吗？`,
      tip: `do me a favor 连读，pass the salt 注意节奏`,
      tags: [`餐厅`, `请求`]
    },
    {
      en: "It's been a while since we last met.",
      cn: `我们上次见面已经有一段时间了。`,
      tip: `It's been 连读，since we 弱读`,
      tags: [`社交`, `日常`]
    },
    {
      en: "The early bird catches the worm.",
      cn: `早起的鸟儿有虫吃。`,
      tip: `early bird 连读，catches the 注意节奏`,
      tags: [`谚语`, `日常`]
    },
    {
      en: "I can't agree with you more on this point.",
      cn: `在这一点上我再同意不过了。`,
      tip: `can't agree 连读，on this point 注意重音`,
      tags: [`观点`, `口语`]
    },
    {
      en: "Practice makes perfect, so keep trying.",
      cn: `熟能生巧，继续努力。`,
      tip: `practice makes 连读，keep trying 注意节奏`,
      tags: [`谚语`, `鼓励`]
    },
    {
      en: "Would you mind opening the window for me?",
      cn: `你介意帮我打开窗户吗？`,
      tip: `Would you 弱读为 Woul-dya，mind opening 连读`,
      tags: [`请求`, `日常`]
    },
    {
      en: "She has a great sense of humor and always makes people laugh.",
      cn: `她很有幽默感，总是让人发笑。`,
      tip: `sense of humor 连读，makes people 注意节奏`,
      tags: [`描述`, `口语`]
    },
    {
      en: "Let's call it a day and continue tomorrow.",
      cn: `今天就到这里吧，明天继续。`,
      tip: `Let's call 连读，call it a day 整体节奏`,
      tags: [`工作`, `日常`]
    },
    {
      en: "I'm sorry to hear that. Is there anything I can do?",
      cn: `听到这个消息我很遗憾。有什么我能帮忙的吗？`,
      tip: `sorry to hear 连读，anything I can 连读`,
      tags: [`安慰`, `口语`]
    },
    {
      en: "The weather forecast says it's going to rain tomorrow.",
      cn: `天气预报说明天会下雨。`,
      tip: `weather forecast 注意重音，going to 弱读为 gonna`,
      tags: [`天气`, `日常`]
    },
    {
      en: "Don't put off until tomorrow what you can do today.",
      cn: `今日事今日毕。`,
      tip: `put off 连读，what you can 连读`,
      tags: [`谚语`, `鼓励`]
    },
    {
      en: "I appreciate your help. It means a lot to me.",
      cn: `感谢你的帮助。这对我意义重大。`,
      tip: `appreciate your 连读，means a lot 连读`,
      tags: [`感谢`, `口语`]
    },
    {
      en: "Time flies when you're having fun.",
      cn: `快乐时光飞逝。`,
      tip: `Time flies 连读，when you're 弱读`,
      tags: [`谚语`, `日常`]
    }
  ],
  articles: [
    {
      title: `Morning Routine (晨间日常)`,
      en: `I wake up at six thirty every morning. First, I drink a glass of water. Then I do some stretching exercises for ten minutes. After that, I make breakfast — usually oatmeal with fruit. I eat slowly and read a few pages of a book. This quiet time in the morning helps me feel ready for the day.`,
      cn: `我每天早上六点半起床。首先，我喝一杯水。然后我做十分钟的拉伸运动。之后，我做早餐——通常是燕麦粥配水果。我慢慢吃，读几页书。这段安静的晨间时光帮助我为新的一天做好准备。`,
      tip: `注意一般现在时的用法，wake up / drink / do / make / eat / read 一系列动词的节奏感`,
      difficulty: `⭐`,
      tags: [`日常`, `初级`]
    },
    {
      title: `A Walk in the Park (公园散步)`,
      en: `Last Sunday, I went for a walk in the park near my home. The trees were turning yellow and orange. The air was cool and fresh. I saw an old man practicing Tai Chi under a big tree. A little girl was chasing pigeons on the grass. I sat on a bench and just watched the world go by. Sometimes, the simplest moments are the most beautiful.`,
      cn: `上周日，我去了家附近的公园散步。树正在变黄变橙。空气凉爽清新。我看到一位老人在大树下练太极。一个小女孩在草地上追鸽子。我坐在长椅上，静静看着世界从身边流过。有时候，最简单的时刻才是最美的。`,
      tip: `注意过去时 went / saw / sat，以及进行时 were turning / was practicing / was chasing`,
      difficulty: `⭐⭐`,
      tags: [`生活`, `初中级`]
    },
    {
      title: `Learning from Failure (从失败中学习)`,
      en: `Failure is not the opposite of success. It is a part of success. Every time you fail, you learn something new about yourself and about the world. Thomas Edison failed thousands of times before he invented the light bulb. When someone asked him about his failures, he said, "I have not failed. I have just found ten thousand ways that do not work." This is the mindset we should all aim for.`,
      cn: `失败不是成功的对立面。它是成功的一部分。每次你失败，你都会学到关于自己和新事物的东西。托马斯·爱迪生在发明灯泡之前失败了数千次。当有人问他关于失败时，他说："我没有失败。我只是找到了一万种行不通的方法。" 这就是我们所有人都应该追求的心态。`,
      tip: `注意 every time 引导时间状语从句，aim for 的连读`,
      difficulty: `⭐⭐⭐`,
      tags: [`励志`, `中级`]
    },
    {
      title: `The Art of Listening (倾听的艺术)`,
      en: `Most people listen with the intention of replying, not with the intention of understanding. True listening means putting aside your own thoughts and truly focusing on what the other person is saying. When you listen deeply, you make the other person feel valued. You also learn things you would never learn by talking. Good listeners are rare, and they are always the people others want to be around.`,
      cn: `大多数人倾听是为了回答，而不是为了理解。真正的倾听意味着放下自己的想法，真正专注于对方在说什么。当你深入倾听时，你让对方感到被重视。你也会学到通过交谈永远学不到的东西。好的倾听者很罕见，他们总是别人想要亲近的人。`,
      tip: `注意 intention of 弱读，putting aside 连读，what the other person 连读节奏`,
      difficulty: `⭐⭐⭐`,
      tags: [`沟通`, `中级`]
    },
    {
      title: `A Simple Recipe (简单食谱)`,
      en: `Here is a simple recipe for tomato egg noodles. First, boil water in a pot and cook the noodles for three minutes. While waiting, cut two tomatoes into small pieces and beat two eggs in a bowl. Heat some oil in a pan, scramble the eggs, and set them aside. In the same pan, cook the tomatoes until they become soft. Add the eggs back, mix well, and pour everything over the noodles. Add a little salt and sesame oil. Enjoy your meal!`,
      cn: `这是一份简单的番茄鸡蛋面的做法。首先，在锅中烧水，煮面条三分钟。等待时，将两个番茄切成小块，在碗中打散两个鸡蛋。在平底锅中热油，炒鸡蛋，盛出备用。在同一个锅中，炒番茄直到变软。把鸡蛋放回，拌匀，浇在面条上。加少许盐和香油。好好享用！`,
      tip: `注意步骤动词 boil / cut / beat / heat / scramble / cook / add / mix / pour 的节奏`,
      difficulty: `⭐⭐`,
      tags: [`生活`, `初中级`]
    },
    {
      title: `Why We Read (我们为什么阅读)`,
      en: `We read to understand the world and ourselves better. Books can take us to places we have never been and introduce us to people we would never meet. When we read, we borrow someone else's thoughts and experiences. We learn from their mistakes and successes. Reading also helps us slow down in a fast world. It gives our minds a quiet space to think, to imagine, and to grow. In short, reading makes us wiser, kinder, and more alive.`,
      cn: `我们阅读是为了更好地理解世界和自己。书籍可以带我们去从未去过的地方，介绍我们认识永远不会遇到的人。当我们阅读时，我们借用了别人的思想和经验。我们从他们的错误和成功中学习。阅读也帮助我们在快节奏的世界中慢下来。它给了我们的心灵一个安静的空间去思考、去想象、去成长。简而言之，阅读让我们更智慧、更善良、更有活力。`,
      tip: `注意 take us to 连读，would never 弱读，someone else's 连读`,
      difficulty: `⭐⭐⭐`,
      tags: [`思考`, `中级`]
    },
    {
      title: `My First Job Interview (我的第一次面试)`,
      en: `I was nervous before my first job interview. I prepared for days — researching the company, practicing my answers, and choosing the right clothes. When I walked in, my hands were shaking. But the interviewer was kind and made me feel comfortable. She asked about my strengths and weaknesses. I answered honestly. A week later, I got the job. I learned that being prepared and being yourself is more important than being perfect.`,
      cn: `第一次面试前我很紧张。我准备了几天——研究公司、练习回答、选择合适的衣服。当我走进去时，手在发抖。但面试官很和善，让我感到放松。她问了我的优点和缺点。我诚实地回答了。一周后，我得到了这份工作。我学到了充分准备和做自己比完美更重要。`,
      tip: `注意过去时 was / prepared / walked / asked / answered / got / learned 的节奏`,
      difficulty: `⭐⭐⭐`,
      tags: [`职场`, `中级`]
    },
    {
      title: `The Value of Time (时间的价值)`,
      en: `Time is the one thing we can never get back. You can lose money and earn it again. You can lose a friend and make a new one. But every minute you lose is gone forever. This is why it is so important to spend time wisely. Not just on work, but on the people you love, the things you enjoy, and the dreams you chase. Remember: the best investment you can make is in how you spend your time.`,
      cn: `时间是我们永远无法找回的东西。你可以失去金钱再赚回来。你可以失去一个朋友再交新的。但你失去的每一分钟都永远消失了。这就是为什么明智地使用时间如此重要。不仅仅是工作，还有你爱的人、你喜欢的事、你追逐的梦想。记住：你能做的最好的投资在于你如何使用你的时间。`,
      tip: `注意 get back / lose money / make a new one 的搭配，spend time wisely 注意重音`,
      difficulty: `⭐⭐⭐`,
      tags: [`思考`, `中级`]
    }
  ]
};

/* ============================================
   词书体系（单词书切换 / 自定义词书）
   - 系统预置词书 id 与 WORDS_DATA 的 key 对应
   - 自定义词书存于 localStorage（mw_word_books），由工作台「新建词书」功能写入
   - 每日积累词书（daily）由每周自动化往 DAILY_ACCUM_WORDS 追加新词
   ============================================ */

const WORD_BOOKS_META = [
  { id: 'primary',  name: '小学',     desc: '小学基础词汇，打好英语地基', icon: 'fa-child',          builtin: true },
  { id: 'middle',   name: '初中',     desc: '初中核心词汇，日常交流够用', icon: 'fa-school',          builtin: true },
  { id: 'high',     name: '高中',     desc: '高中词汇，应对高考与阅读',   icon: 'fa-graduation-cap',  builtin: true },
  { id: 'cet4',     name: '四级',     desc: '大学英语四级词汇',           icon: 'fa-book-open',       builtin: true },
  { id: 'postgrad', name: '考研',     desc: '考研英语核心词汇',           icon: 'fa-graduation-cap',  builtin: true },
  { id: 'ielts',    name: '雅思',     desc: '雅思备考词汇',               icon: 'fa-globe',           builtin: true },
  { id: 'toefl',    name: '托福',     desc: '托福备考词汇',               icon: 'fa-globe',           builtin: true },
  { id: 'daily',    name: '每日积累', desc: '每周自动补充的实用新词，永远有得背', icon: 'fa-seedling', builtin: true }
];

// 每日积累词书单词（由每周自动化追加；此处为初始示例词，覆盖生活/职场/科技/文化）
const DAILY_ACCUM_WORDS = [
  { en: 'serendipity', phonetic: '/ˌserənˈdɪpəti/', cn: `n. 意外发现美好事物的能力；机缘巧合`, example: `Finding this little cafe was pure serendipity.` },
  { en: 'resilience', phonetic: '/rɪˈzɪliəns/', cn: `n. 韧性；恢复力`, example: `Her resilience helped her get through hard times.` },
  { en: 'meticulous', phonetic: '/məˈtɪkjələs/', cn: `adj. 一丝不苟的；非常细致的`, example: `He is meticulous about every detail of his work.` },
  { en: 'ambiguous', phonetic: '/æmˈbɪɡjuəs/', cn: `adj. 模棱两可的；含糊不清的`, example: `The instructions were ambiguous and confusing.` },
  { en: 'pragmatic', phonetic: '/præɡˈmætɪk/', cn: `adj. 务实的；注重实际的`, example: `We need a pragmatic solution, not a perfect one.` },
  { en: 'ubiquitous', phonetic: '/juːˈbɪkwɪtəs/', cn: `adj. 无处不在的；普遍存在的`, example: `Smartphones are now ubiquitous in daily life.` },
  { en: 'candid', phonetic: '/ˈkændɪd/', cn: `adj. 坦率的；真诚的`, example: `She gave a candid answer about her mistakes.` },
  { en: 'eloquent', phonetic: '/ˈeləkwənt/', cn: `adj. 雄辩的；有说服力的`, example: `His eloquent speech moved the whole audience.` },
  { en: 'nourish', phonetic: '/ˈnʌrɪʃ/', cn: `v. 滋养；培育`, example: `Good books nourish the mind.` },
  { en: 'threshold', phonetic: '/ˈθreʃhoʊld/', cn: `n. 门槛；临界点`, example: `We are at the threshold of a new era.` },
  { en: 'alleviate', phonetic: '/əˈliːvieɪt/', cn: `v. 减轻；缓解`, example: `This medicine can alleviate the pain.` },
  { en: 'coherent', phonetic: '/koʊˈhɪrənt/', cn: `adj. 连贯的；有条理的`, example: `She gave a clear and coherent explanation.` },
  { en: 'profound', phonetic: '/prəˈfaʊnd/', cn: `adj. 深刻的；意义深远的`, example: `The book had a profound impact on my life.` },
  { en: 'tentative', phonetic: '/ˈtentətɪv/', cn: `adj. 试探性的；初步的`, example: `We made a tentative plan for the trip.` },
  { en: 'versatile', phonetic: '/ˈvɜːrsətl/', cn: `adj. 多才多艺的；多功能的`, example: `A smartphone is a versatile device.` },
  { en: 'circumvent', phonetic: '/ˌsɜːrkəmˈvent/', cn: `v. 规避；绕开`, example: `They tried to circumvent the strict rules.` },
  { en: 'empirical', phonetic: '/ɪmˈpɪrɪkl/', cn: `adj. 经验主义的；基于实证的`, example: `The theory is supported by empirical evidence.` },
  { en: 'intrinsic', phonetic: '/ɪnˈtrɪnzɪk/', cn: `adj. 内在的；固有的`, example: `Curiosity is intrinsic to human nature.` },
  { en: 'paradigm', phonetic: '/ˈpærədaɪm/', cn: `n. 范式；典范`, example: `The discovery caused a paradigm shift in science.` },
  { en: 'sustainable', phonetic: '/səˈsteɪnəbl/', cn: `adj. 可持续的`, example: `We should build a sustainable future.` },
  // —— 生活日常 ——
  { en: 'kitchen', phonetic: '/ˈkɪtʃɪn/', cn: `n. 厨房`, example: "The kitchen smells of fresh bread." },
  { en: 'laundry', phonetic: '/ˈlɔːndri/', cn: `n. 待洗衣物；洗衣店`, example: "I have a pile of laundry to do." },
  { en: 'grocery', phonetic: '/ˈɡroʊsəri/', cn: `n. 食品杂货`, example: "We buy groceries every Saturday." },
  { en: 'neighbor', phonetic: '/ˈneɪbə/', cn: `n. 邻居`, example: "My neighbor is very friendly." },
  { en: 'borrow', phonetic: '/ˈbɒrəʊ/', cn: `v. 借入`, example: "Can I borrow your pen?" },
  { en: 'return', phonetic: '/rɪˈtɜːn/', cn: `v. 归还；返回`, example: "Please return the book next week." },
  { en: 'tidy', phonetic: '/ˈtaɪdi/', cn: `adj. 整洁的；v. 整理`, example: "She keeps her room tidy." },
  { en: 'sweep', phonetic: '/swiːp/', cn: `v. 清扫`, example: "He sweeps the floor every morning." },
  { en: 'boil', phonetic: '/bɔɪl/', cn: `v. 煮沸`, example: "Boil the water before drinking." },
  { en: 'slice', phonetic: '/slaɪs/', cn: `n. 薄片；v. 切片`, example: "She cut a slice of cake." },
  // —— 职场工作 ——
  { en: 'deadline', phonetic: '/ˈdedlaɪn/', cn: `n. 截止期限`, example: "We finished the project before the deadline." },
  { en: 'colleague', phonetic: '/ˈkɒliːɡ/', cn: `n. 同事`, example: "My colleagues helped me a lot." },
  { en: 'meeting', phonetic: '/ˈmiːtɪŋ/', cn: `n. 会议`, example: "We have a meeting at ten." },
  { en: 'promote', phonetic: '/prəˈməʊt/', cn: `v. 晋升；提拔`, example: "She was promoted to manager." },
  { en: 'resign', phonetic: '/rɪˈzaɪn/', cn: `v. 辞职`, example: "He resigned from his job last month." },
  { en: 'salary', phonetic: '/ˈsæləri/', cn: `n. 薪水`, example: "Her salary increased this year." },
  { en: 'overtime', phonetic: '/ˈəʊvətaɪm/', cn: `n. 加班`, example: "I worked overtime to finish the report." },
  { en: 'client', phonetic: '/ˈklaɪənt/', cn: `n. 客户`, example: "The client approved our plan." },
  { en: 'task', phonetic: '/tɑːsk/', cn: `n. 任务`, example: "This task is quite challenging." },
  { en: 'feedback', phonetic: '/ˈfiːdbæk/', cn: `n. 反馈`, example: "Thank you for your useful feedback." },
  // —— 科技数码 ——
  { en: 'algorithm', phonetic: '/ˈælɡərɪðəm/', cn: `n. 算法`, example: "The app uses a smart algorithm." },
  { en: 'device', phonetic: '/dɪˈvaɪs/', cn: `n. 设备；装置`, example: "This device connects to the TV." },
  { en: 'software', phonetic: '/ˈsɒftweə/', cn: `n. 软件`, example: "We need better software for this." },
  { en: 'update', phonetic: '/ʌpˈdeɪt/', cn: `v./n. 更新`, example: "Please update your app to the latest version." },
  { en: 'data', phonetic: '/ˈdeɪtə/', cn: `n. 数据`, example: "The data shows a clear trend." },
  { en: 'battery', phonetic: '/ˈbætri/', cn: `n. 电池`, example: "My phone battery is low." },
  { en: 'wireless', phonetic: '/ˈwaɪələs/', cn: `adj. 无线的`, example: "We use a wireless mouse." },
  { en: 'download', phonetic: '/ˌdaʊnˈləʊd/', cn: `v. 下载`, example: "I downloaded the file last night." },
  { en: 'password', phonetic: '/ˈpɑːswɜːd/', cn: `n. 密码`, example: "Use a strong password for safety." },
  { en: 'backup', phonetic: '/ˈbækʌp/', cn: `n. 备份`, example: "Keep a backup of your photos." },
  // —— 情感心理 ——
  { en: 'grateful', phonetic: '/ˈɡreɪtfl/', cn: `adj. 感激的`, example: "I am grateful for your help." },
  { en: 'anxious', phonetic: '/ˈæŋkʃəs/', cn: `adj. 焦虑的`, example: "She felt anxious before the exam." },
  { en: 'lonely', phonetic: '/ˈləʊnli/', cn: `adj. 孤独的`, example: "He lives alone and feels lonely." },
  { en: 'excited', phonetic: '/ɪkˈsaɪtɪd/', cn: `adj. 兴奋的`, example: "The kids are excited about the trip." },
  { en: 'relieved', phonetic: '/rɪˈliːvd/', cn: `adj. 如释重负的`, example: "I was relieved to hear the good news." },
  { en: 'embarrassed', phonetic: '/ɪmˈbærəst/', cn: `adj. 尴尬的`, example: "He was embarrassed by the mistake." },
  { en: 'confident', phonetic: '/ˈkɒnfɪdənt/', cn: `adj. 自信的`, example: "She is confident in her ability." },
  { en: 'ashamed', phonetic: '/əˈʃeɪmd/', cn: `adj. 羞愧的`, example: "I am ashamed of my rude words." },
  { en: 'content', phonetic: '/kənˈtent/', cn: `adj. 满足的`, example: "He is content with a simple life." },
  { en: 'nervous', phonetic: '/ˈnɜːvəs/', cn: `adj. 紧张的`, example: "Do not be nervous about the speech." },
  // —— 环境自然 ——
  { en: 'recycle', phonetic: '/riːˈsaɪkl/', cn: `v. 回收`, example: "We recycle paper and plastic." },
  { en: 'pollution', phonetic: '/pəˈluːʃn/', cn: `n. 污染`, example: "Air pollution is a big problem." },
  { en: 'climate', phonetic: '/ˈklaɪmət/', cn: `n. 气候`, example: "The climate is getting warmer." },
  { en: 'renewable', phonetic: '/rɪˈnjuːəbl/', cn: `adj. 可再生的`, example: "Solar power is renewable energy." },
  { en: 'wildlife', phonetic: '/ˈwaɪldlaɪf/', cn: `n. 野生动物`, example: "We should protect wildlife." },
  { en: 'oxygen', phonetic: '/ˈɒksɪdʒən/', cn: `n. 氧气`, example: "Trees produce oxygen for us." },
  { en: 'drought', phonetic: '/draʊt/', cn: `n. 干旱`, example: "The drought ruined the crops." },
  { en: 'harvest', phonetic: '/ˈhɑːvɪst/', cn: `n./v. 收获`, example: "Farmers harvest rice in autumn." },
  { en: 'shelter', phonetic: '/ˈʃeltə/', cn: `n. 庇护所`, example: "The cave gave them shelter from the rain." },
  { en: 'habitat', phonetic: '/ˈhæbɪtæt/', cn: `n. 栖息地`, example: "We must protect the panda's habitat." },
  // —— 健康身体 ——
  { en: 'nutrition', phonetic: '/njuˈtrɪʃn/', cn: `n. 营养`, example: "Good nutrition keeps you healthy." },
  { en: 'exercise', phonetic: '/ˈeksəsaɪz/', cn: `n./v. 锻炼`, example: "Daily exercise is good for you." },
  { en: 'stretch', phonetic: '/stretʃ/', cn: `v. 伸展`, example: "Stretch your arms after sitting long." },
  { en: 'sleepy', phonetic: '/ˈsliːpi/', cn: `adj. 困倦的`, example: "I feel sleepy after lunch." },
  { en: 'vaccine', phonetic: '/ˈvæksiːn/', cn: `n. 疫苗`, example: "The vaccine protects against the flu." },
  { en: 'symptom', phonetic: '/ˈsɪmptəm/', cn: `n. 症状`, example: "A cough is a symptom of a cold." },
  { en: 'allergy', phonetic: '/ˈælədʒi/', cn: `n. 过敏`, example: "He has an allergy to peanuts." },
  { en: 'pharmacy', phonetic: '/ˈfɑːməsi/', cn: `n. 药房`, example: "Buy the medicine at the pharmacy." },
  { en: 'therapy', phonetic: '/ˈθerəpi/', cn: `n. 治疗；疗法`, example: "She receives physical therapy." },
  { en: 'balance', phonetic: '/ˈbæləns/', cn: `n./v. 平衡`, example: "Try to balance work and rest." },
  // —— 旅行出行 ——
  { en: 'luggage', phonetic: '/ˈlʌɡɪdʒ/', cn: `n. 行李`, example: "Where can I leave my luggage?" },
  { en: 'passport', phonetic: '/ˈpɑːspɔːt/', cn: `n. 护照`, example: "Do not forget your passport." },
  { en: 'boarding', phonetic: '/ˈbɔːdɪŋ/', cn: `n. 登机`, example: "Boarding starts in ten minutes." },
  { en: 'souvenir', phonetic: '/ˌsuːvənɪə/', cn: `n. 纪念品`, example: "She bought a souvenir from Paris." },
  { en: 'currency', phonetic: '/ˈkʌrənsi/', cn: `n. 货币`, example: "What is the local currency?" },
  { en: 'flight', phonetic: '/flaɪt/', cn: `n. 航班`, example: "My flight was delayed." },
  { en: 'arrival', phonetic: '/əˈraɪvl/', cn: `n. 到达`, example: "The arrival time is 8 p.m." },
  { en: 'departure', phonetic: '/dɪˈpɑːtʃə/', cn: `n. 离开；出发`, example: "The departure gate is B12." },
  { en: 'transit', phonetic: '/ˈtrænzɪt/', cn: `n. 中转；公共交通`, example: "We are in transit at the airport." },
  { en: 'visa', phonetic: '/ˈviːzə/', cn: `n. 签证`, example: "Do I need a visa for this trip?" },
  // —— 学习成长 ——
  { en: 'fluent', phonetic: '/ˈfluːənt/', cn: `adj. 流利的`, example: "She is fluent in three languages." },
  { en: 'memorize', phonetic: '/ˈmeməraɪz/', cn: `v. 记住；背诵`, example: "Try to memorize ten words a day." },
  { en: 'practice', phonetic: '/ˈpræktɪs/', cn: `n./v. 练习`, example: "Practice makes perfect." },
  { en: 'review', phonetic: '/rɪˈvjuː/', cn: `v./n. 复习`, example: "Review your notes before the test." },
  { en: 'improve', phonetic: '/ɪmˈpruːv/', cn: `v. 提高；改善`, example: "He wants to improve his English." },
  { en: 'vocabulary', phonetic: '/vəˈkæbjələri/', cn: `n. 词汇`, example: "Reading builds your vocabulary." },
  { en: 'grammar', phonetic: '/ˈɡræmə/', cn: `n. 语法`, example: "Her grammar is very accurate." },
  { en: 'accent', phonetic: '/ˈæksent/', cn: `n. 口音`, example: "He speaks with a French accent." },
  { en: 'pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃn/', cn: `n. 发音`, example: "Your pronunciation is clear." },
  { en: 'brainstorm', phonetic: '/ˈbreɪnstɔːm/', cn: `v. 头脑风暴`, example: "Let us brainstorm some ideas." },
  // —— 社交沟通 ——
  { en: 'compliment', phonetic: '/ˈkɒmplɪmənt/', cn: `n./v. 赞美`, example: "She gave him a nice compliment." },
  { en: 'apologize', phonetic: '/əˈpɒlədʒaɪz/', cn: `v. 道歉`, example: "I apologized for being late." },
  { en: 'interrupt', phonetic: '/ˌɪntəˈrʌpt/', cn: `v. 打断`, example: "Sorry to interrupt your meeting." },
  { en: 'gossip', phonetic: '/ˈɡɒsɪp/', cn: `n./v. 闲聊；八卦`, example: "They like to gossip at lunch." },
  { en: 'negotiate', phonetic: '/nɪˈɡəʊʃieɪt/', cn: `v. 谈判`, example: "We negotiated a better price." },
  { en: 'persuade', phonetic: '/pəˈsweɪd/', cn: `v. 说服`, example: "He persuaded me to join." },
  { en: 'encourage', phonetic: '/ɪnˈkʌrɪdʒ/', cn: `v. 鼓励`, example: "My teacher encouraged me a lot." },
  { en: 'forgive', phonetic: '/fəˈɡɪv/', cn: `v. 原谅`, example: "It is hard to forgive and forget." },
  { en: 'trust', phonetic: '/trʌst/', cn: `n./v. 信任`, example: "Trust is the base of friendship." },
  { en: 'argue', phonetic: '/ˈɑːɡjuː/', cn: `v. 争论`, example: "They argued about the plan." },
  // ── 2026-08-02 补充（主题：生活日常 / 购物 / 餐饮）──
  { en: 'haggle', phonetic: '/ˈhæɡl/', cn: `v. 讨价还价，砍价`, example: 'Tourists often haggle over prices at the night market.' },
  { en: 'splurge', phonetic: '/splɜːdʒ/', cn: `v./n. 挥霍；一次性大手笔花钱`, example: 'She decided to splurge on a really good winter coat.' },
  { en: 'thrifty', phonetic: '/ˈθrɪfti/', cn: `adj. 节俭的，会精打细算的`, example: 'Being thrifty does not mean living a joyless life.' },
  { en: 'voucher', phonetic: '/ˈvaʊtʃə(r)/', cn: `n. 代金券，优惠券；凭单`, example: 'The restaurant sent me a voucher for a free dessert.' },
  { en: 'refund', phonetic: '/ˈriːfʌnd/', cn: `n. 退款；v. 退还（款项）`, example: 'The shop gave me a full refund without asking questions.' },
  { en: 'warranty', phonetic: '/ˈwɒrənti/', cn: `n. 保修，质保（书面担保）`, example: 'The laptop comes with a two-year warranty.' },
  { en: 'counterfeit', phonetic: '/ˈkaʊntəfɪt/', cn: `adj. 假冒的；n. 赝品，仿冒品`, example: 'The handbag turned out to be a clever counterfeit.' },
  { en: 'clearance', phonetic: '/ˈklɪərəns/', cn: `n. 清仓甩卖；清除`, example: 'I bought these boots at a clearance sale for half price.' },
  { en: 'overpriced', phonetic: '/ˌəʊvəˈpraɪst/', cn: `adj. 定价过高的，不值这个价的`, example: 'The coffee here is tasty but badly overpriced.' },
  { en: 'impulsive', phonetic: '/ɪmˈpʌlsɪv/', cn: `adj. 冲动的，凭一时兴起的`, example: 'Late-night shopping makes me impulsive.' },
  { en: 'staple', phonetic: '/ˈsteɪpl/', cn: `n. 主食；日常必需品；adj. 主要的`, example: 'Rice is a staple in most Asian households.' },
  { en: 'pantry', phonetic: '/ˈpæntri/', cn: `n. 食品储藏柜，储物间`, example: 'Check the pantry before you order more snacks.' },
  { en: 'perishable', phonetic: '/ˈperɪʃəbl/', cn: `adj. （食物）易腐坏的，不耐放的`, example: 'Keep perishable food in the fridge, not on the counter.' },
  { en: 'stale', phonetic: '/steɪl/', cn: `adj. 不新鲜的，走味的；陈旧的`, example: 'The bread went stale after only two days.' },
  { en: 'ripe', phonetic: '/raɪp/', cn: `adj. 成熟的，熟透的；时机成熟的`, example: 'These avocados are not ripe enough to eat yet.' },
  { en: 'marinate', phonetic: '/ˈmærɪneɪt/', cn: `v. 腌制，浸泡入味`, example: 'Marinate the chicken for at least an hour before frying.' },
  { en: 'simmer', phonetic: '/ˈsɪmə(r)/', cn: `v. 小火慢炖，微沸`, example: 'Let the soup simmer gently for twenty minutes.' },
  { en: 'garnish', phonetic: '/ˈɡɑːnɪʃ/', cn: `v. 装饰（菜肴）；n. 配菜装饰`, example: 'He likes to garnish the dish with fresh mint.' },
  { en: 'seasoning', phonetic: '/ˈsiːzənɪŋ/', cn: `n. 调味料，佐料`, example: 'Add a little seasoning just before serving.' },
  { en: 'savoury', phonetic: '/ˈseɪvəri/', cn: `adj. 咸香的，非甜口的；美味的`, example: 'I prefer savoury snacks to sweet ones.' },
  { en: 'bland', phonetic: '/blænd/', cn: `adj. 味道平淡的；乏味无趣的`, example: 'The soup tasted rather bland without any salt.' },
  { en: 'hearty', phonetic: '/ˈhɑːti/', cn: `adj. （饭菜）丰盛的；热情真挚的`, example: 'We had a hearty breakfast before the long hike.' },
  { en: 'succulent', phonetic: '/ˈsʌkjələnt/', cn: `adj. 多汁鲜美的`, example: 'The steak was tender and succulent.' },
  { en: 'leftovers', phonetic: '/ˈleftəʊvəz/', cn: `n. 剩菜剩饭`, example: 'I packed the leftovers for lunch tomorrow.' },
  { en: 'cutlery', phonetic: '/ˈkʌtləri/', cn: `n. 餐具（刀叉勺的总称）`, example: 'Please set the cutlery on the right side of the plate.' },
  { en: 'utensil', phonetic: '/juːˈtensl/', cn: `n. 厨房用具，器皿`, example: 'A wooden utensil will not scratch the pan.' },
  { en: 'declutter', phonetic: '/ˌdiːˈklʌtə(r)/', cn: `v. 清理杂物，断舍离`, example: 'I spent Sunday morning trying to declutter my desk.' },
  { en: 'errand', phonetic: '/ˈerənd/', cn: `n. 差事，跑腿的小事`, example: 'I have a few errands to run after work.' },
  { en: 'chore', phonetic: '/tʃɔː(r)/', cn: `n. 家务杂活；烦人的例行事`, example: 'We split the household chores evenly.' },
  { en: 'brew', phonetic: '/bruː/', cn: `v. 冲泡（茶或咖啡）；酿造`, example: 'She brews her own coffee every single morning.' },
  { en: 'exquisite', phonetic: '/ɪkˈskwɪzɪt/', cn: `adj. 精致的，精美绝伦的`, example: 'The dessert was small but absolutely exquisite.' },
  { en: 'rummage', phonetic: '/ˈrʌmɪdʒ/', cn: `v. 翻找，乱翻一气`, example: 'She rummaged through her bag looking for the receipt.' }
];

// 可一键导入的词库市场（真实词书，由 AI 基于公开词表整理，覆盖常见教材与考试）
const IMPORT_BOOKS = [
  {
    id: 'nce1', name: '新概念英语第一册', icon: 'fa-child', desc: '新概念1册基础词汇，零起点入门必背',
    words: [
      { en: 'excuse', phonetic: '/ɪkˈskjuːz/', cn: `v. 原谅`, example: `Excuse me, is this your bag?` },
      { en: 'handbag', phonetic: '/ˈhændbæɡ/', cn: `n. 手提包`, example: `She left her handbag on the bus.` },
      { en: 'umbrella', phonetic: '/ʌmˈbrelə/', cn: `n. 伞`, example: `Take an umbrella, it may rain.` },
      { en: 'pencil', phonetic: '/ˈpensl/', cn: `n. 铅笔`, example: `He wrote with a red pencil.` },
      { en: 'book', phonetic: '/bʊk/', cn: `n. 书`, example: `This is a good book to read.` },
      { en: 'watch', phonetic: '/wɒtʃ/', cn: `n. 手表`, example: `My watch is ten minutes slow.` },
      { en: 'coat', phonetic: '/kəʊt/', cn: `n. 上衣，外衣`, example: `Put on your coat, it is cold.` },
      { en: 'dress', phonetic: '/dres/', cn: `n. 连衣裙`, example: `She wore a blue dress to the party.` },
      { en: 'car', phonetic: '/kɑː/', cn: `n. 小汽车`, example: `He drives a new car.` },
      { en: 'house', phonetic: '/haʊs/', cn: `n. 房子`, example: `They live in a big house.` },
      { en: 'please', phonetic: '/pliːz/', cn: `int. 请`, example: `Please close the door.` },
      { en: 'ticket', phonetic: '/ˈtɪkɪt/', cn: `n. 票`, example: `I bought a ticket for the train.` },
      { en: 'school', phonetic: '/skuːl/', cn: `n. 学校`, example: `The children go to school by bus.` },
      { en: 'teacher', phonetic: '/ˈtiːtʃə/', cn: `n. 老师`, example: `Our teacher is very kind.` },
      { en: 'student', phonetic: '/ˈstjuːdənt/', cn: `n. 学生`, example: `She is a new student here.` },
      { en: 'meet', phonetic: '/miːt/', cn: `v. 遇见`, example: `Nice to meet you.` },
      { en: 'Chinese', phonetic: '/ˌtʃaɪˈniːz/', cn: `adj./n. 中国的；中国人`, example: `He is Chinese and speaks Chinese.` },
      { en: 'name', phonetic: '/neɪm/', cn: `n. 名字`, example: `What is your name?` },
      { en: 'job', phonetic: '/dʒɒb/', cn: `n. 工作`, example: `She found a new job in the city.` },
      { en: 'policeman', phonetic: '/pəˈliːsmən/', cn: `n. 警察`, example: `The policeman helped the old man.` },
      { en: 'nurse', phonetic: '/nɜːs/', cn: `n. 护士`, example: `The nurse took care of the patient.` },
      { en: 'father', phonetic: '/ˈfɑːðə/', cn: `n. 父亲`, example: `My father works in a factory.` },
      { en: 'mother', phonetic: '/ˈmʌðə/', cn: `n. 母亲`, example: `His mother is a teacher.` },
      { en: 'sister', phonetic: '/ˈsɪstə/', cn: `n. 姐，妹`, example: `My sister is younger than me.` },
      { en: 'friend', phonetic: '/frend/', cn: `n. 朋友`, example: `He is my best friend.` },
      { en: 'window', phonetic: '/ˈwɪndəʊ/', cn: `n. 窗户`, example: `Please open the window, it is stuffy.` },
      { en: 'door', phonetic: '/dɔː/', cn: `n. 门`, example: `He closed the door quietly.` },
      { en: 'water', phonetic: '/ˈwɔːtə/', cn: `n. 水`, example: `May I have a glass of water?` },
      { en: 'food', phonetic: '/fuːd/', cn: `n. 食物`, example: `The food here is delicious.` },
      { en: 'bread', phonetic: '/bred/', cn: `n. 面包`, example: `I eat bread for breakfast.` },
      { en: 'milk', phonetic: '/mɪlk/', cn: `n. 牛奶`, example: `The child drinks milk every day.` },
      { en: 'tea', phonetic: '/tiː/', cn: `n. 茶`, example: `Would you like a cup of tea?` },
      { en: 'apple', phonetic: '/ˈæpl/', cn: `n. 苹果`, example: `She ate a red apple.` },
      { en: 'egg', phonetic: '/eɡ/', cn: `n. 鸡蛋`, example: `I had a boiled egg this morning.` },
      { en: 'cup', phonetic: '/kʌp/', cn: `n. 杯子`, example: `He filled the cup with coffee.` },
      { en: 'plate', phonetic: '/pleɪt/', cn: `n. 盘子`, example: `There is a plate on the table.` },
      { en: 'hello', phonetic: '/həˈləʊ/', cn: `int. 你好`, example: `Hello, nice to see you.` },
      { en: 'sorry', phonetic: '/ˈsɒri/', cn: `adj. 抱歉的`, example: `Sorry, I am late again.` },
      { en: 'thank', phonetic: '/θæŋk/', cn: `v. 感谢`, example: `Thank you for your help.` },
      { en: 'clean', phonetic: '/kliːn/', cn: `adj. 干净的`, example: `The room is clean and tidy.` },
      { en: 'happy', phonetic: '/ˈhæpi/', cn: `adj. 快乐的`, example: `She is happy with the gift.` },
      { en: 'open', phonetic: '/ˈəʊpən/', cn: `v. 打开`, example: `Please open your book to page ten.` },
      { en: 'give', phonetic: '/ɡɪv/', cn: `v. 给`, example: `He gave me a pen.` }
    ]
  },
  {
    id: 'nce2', name: '新概念英语第二册', icon: 'fa-book-open', desc: '新概念2册初级词汇，巩固时态与日常表达',
    words: [
      { en: 'airport', phonetic: '/ˈeəpɔːt/', cn: `n. 机场`, example: `We arrived at the airport two hours early.` },
      { en: 'luggage', phonetic: '/ˈlʌɡɪdʒ/', cn: `n. 行李`, example: `He carried his luggage to the taxi.` },
      { en: 'delay', phonetic: '/dɪˈleɪ/', cn: `n./v. 延误`, example: `The train was delayed by the storm.` },
      { en: 'headache', phonetic: '/ˈhedeɪk/', cn: `n. 头痛`, example: `She had a bad headache yesterday.` },
      { en: 'fever', phonetic: '/ˈfiːvə/', cn: `n. 发烧`, example: `The child has a high fever.` },
      { en: 'medicine', phonetic: '/ˈmedsn/', cn: `n. 药`, example: `Take the medicine after meals.` },
      { en: 'hospital', phonetic: '/ˈhɒspɪtl/', cn: `n. 医院`, example: `He was sent to the hospital at once.` },
      { en: 'exercise', phonetic: '/ˈeksəsaɪz/', cn: `n./v. 锻炼`, example: `Daily exercise keeps you healthy.` },
      { en: 'wonder', phonetic: '/ˈwʌndə/', cn: `v. 想知道`, example: `I wonder what he is doing now.` },
      { en: 'secret', phonetic: '/ˈsiːkrət/', cn: `n. 秘密`, example: `Can you keep a secret?` },
      { en: 'appearance', phonetic: '/əˈpɪərəns/', cn: `n. 外表，出现`, example: `His appearance has changed a lot.` },
      { en: 'appreciate', phonetic: '/əˈpriːʃieɪt/', cn: `v. 欣赏，感激`, example: `I appreciate your help very much.` },
      { en: 'penny', phonetic: '/ˈpeni/', cn: `n. 便士`, example: `This costs only a few pennies.` },
      { en: 'pound', phonetic: '/paʊnd/', cn: `n. 英镑`, example: `A book costs five pounds.` },
      { en: 'basket', phonetic: '/ˈbɑːskɪt/', cn: `n. 篮子`, example: `She put the fruit in a basket.` },
      { en: 'mistake', phonetic: '/mɪˈsteɪk/', cn: `n. 错误`, example: `He made a mistake in the test.` },
      { en: 'present', phonetic: '/ˈpreznt/', cn: `n. 礼物`, example: `She gave him a birthday present.` },
      { en: 'trap', phonetic: '/træp/', cn: `n./v. 陷阱；困住`, example: `The mouse was trapped in the box.` },
      { en: 'believe', phonetic: '/bɪˈliːv/', cn: `v. 相信`, example: `I believe what he told me.` },
      { en: 'retire', phonetic: '/rɪˈtaɪə/', cn: `v. 退休`, example: `My grandfather retired last year.` },
      { en: 'company', phonetic: '/ˈkʌmpəni/', cn: `n. 公司；陪伴`, example: `He works for a big company.` },
      { en: 'afford', phonetic: '/əˈfɔːd/', cn: `v. 负担得起`, example: `We cannot afford a new car.` },
      { en: 'deposit', phonetic: '/dɪˈpɒzɪt/', cn: `n./v. 押金；存款`, example: `You must pay a deposit first.` },
      { en: 'collect', phonetic: '/kəˈlekt/', cn: `v. 收集`, example: `She collects stamps as a hobby.` },
      { en: 'journey', phonetic: '/ˈdʒɜːni/', cn: `n. 旅行`, example: `It was a long journey by train.` },
      { en: 'holiday', phonetic: '/ˈhɒlədeɪ/', cn: `n. 假期`, example: `We went to the beach for the holiday.` },
      { en: 'weekend', phonetic: '/ˈwiːkend/', cn: `n. 周末`, example: `What do you do on the weekend?` },
      { en: 'weather', phonetic: '/ˈweðə/', cn: `n. 天气`, example: `The weather is fine today.` },
      { en: 'rain', phonetic: '/reɪn/', cn: `n./v. 雨；下雨`, example: `It began to rain heavily.` },
      { en: 'snow', phonetic: '/snəʊ/', cn: `n./v. 雪；下雪`, example: `The ground was covered with snow.` },
      { en: 'shop', phonetic: '/ʃɒp/', cn: `n. 商店`, example: `She went to the shop to buy milk.` },
      { en: 'market', phonetic: '/ˈmɑːkɪt/', cn: `n. 市场`, example: `We buy fresh food at the market.` },
      { en: 'post', phonetic: '/pəʊst/', cn: `n./v. 邮政；邮寄`, example: `I will post the letter today.` },
      { en: 'letter', phonetic: '/ˈletə/', cn: `n. 信`, example: `He received a letter from his friend.` },
      { en: 'walk', phonetic: '/wɔːk/', cn: `v./n. 走路`, example: `We walk to school every day.` },
      { en: 'town', phonetic: '/taʊn/', cn: `n. 城镇`, example: `The town is small but beautiful.` },
      { en: 'village', phonetic: '/ˈvɪlɪdʒ/', cn: `n. 村庄`, example: `He was born in a quiet village.` },
      { en: 'bridge', phonetic: '/brɪdʒ/', cn: `n. 桥`, example: `They crossed the bridge on foot.` },
      { en: 'boat', phonetic: '/bəʊt/', cn: `n. 小船`, example: `We took a boat across the lake.` },
      { en: 'travel', phonetic: '/ˈtrævl/', cn: `v. 旅行`, example: `They love to travel by train.` },
      { en: 'arrive', phonetic: '/əˈraɪv/', cn: `v. 到达`, example: `We arrived at the station at noon.` },
      { en: 'invite', phonetic: '/ɪnˈvaɪt/', cn: `v. 邀请`, example: `She invited me to her party.` },
      { en: 'birthday', phonetic: '/ˈbɜːθdeɪ/', cn: `n. 生日`, example: `Happy birthday to you!` }
    ]
  },
  {
    id: 'nce3', name: '新概念英语第三册', icon: 'fa-graduation-cap', desc: '新概念3册中级词汇，学术与抽象概念入门',
    words: [
      { en: 'society', phonetic: '/səˈsaɪəti/', cn: `n. 社会`, example: `Technology changes our society.` },
      { en: 'tradition', phonetic: '/trəˈdɪʃn/', cn: `n. 传统`, example: `We should respect our tradition.` },
      { en: 'education', phonetic: '/ˌedʒuˈkeɪʃn/', cn: `n. 教育`, example: `Education is the key to the future.` },
      { en: 'economy', phonetic: '/ɪˈkɒnəmi/', cn: `n. 经济`, example: `The local economy is growing fast.` },
      { en: 'democracy', phonetic: '/dɪˈmɒkrəsi/', cn: `n. 民主`, example: `Democracy values every voice.` },
      { en: 'experiment', phonetic: '/ɪkˈsperɪmənt/', cn: `n./v. 实验`, example: `They did an experiment in the lab.` },
      { en: 'theory', phonetic: '/ˈθɪəri/', cn: `n. 理论`, example: `His theory explains the problem.` },
      { en: 'invention', phonetic: '/ɪnˈvenʃn/', cn: `n. 发明`, example: `The telephone was a great invention.` },
      { en: 'freedom', phonetic: '/ˈfriːdəm/', cn: `n. 自由`, example: `Freedom of speech is important.` },
      { en: 'responsibility', phonetic: '/rɪˌspɒnsəˈbɪləti/', cn: `n. 责任`, example: `He took responsibility for the mistake.` },
      { en: 'success', phonetic: '/səkˈses/', cn: `n. 成功`, example: `Hard work leads to success.` },
      { en: 'failure', phonetic: '/ˈfeɪljə/', cn: `n. 失败`, example: `Failure is a step toward success.` },
      { en: 'opportunity', phonetic: '/ˌɒpəˈtjuːnəti/', cn: `n. 机会`, example: `This is a good opportunity to learn.` },
      { en: 'analysis', phonetic: '/əˈnæləsɪs/', cn: `n. 分析`, example: `We need a careful analysis of the data.` },
      { en: 'conclusion', phonetic: '/kənˈkluːʒn/', cn: `n. 结论`, example: `They drew a clear conclusion.` },
      { en: 'hypothesis', phonetic: '/haɪˈpɒθəsɪs/', cn: `n. 假设`, example: `The hypothesis was proved by the test.` },
      { en: 'achieve', phonetic: '/əˈtʃiːv/', cn: `v. 实现，达成`, example: `She achieved her dream at last.` },
      { en: 'conduct', phonetic: '/kənˈdʌkt/', cn: `v. 进行，引导`, example: `He conducted the meeting well.` },
      { en: 'demonstrate', phonetic: '/ˈdemənstreɪt/', cn: `v. 演示，证明`, example: `The teacher demonstrated the method.` },
      { en: 'antique', phonetic: '/ænˈtiːk/', cn: `adj./n. 古老的；古董`, example: `This shop sells antique furniture.` },
      { en: 'assemble', phonetic: '/əˈsembl/', cn: `v. 集合，装配`, example: `The parts are easy to assemble.` },
      { en: 'attach', phonetic: '/əˈtætʃ/', cn: `v. 附上，系`, example: `Please attach the file to the email.` },
      { en: 'bargain', phonetic: '/ˈbɑːɡɪn/', cn: `n./v. 便宜货；讨价`, example: `I bargained with the seller for a lower price.` },
      { en: 'candidate', phonetic: '/ˈkændɪdət/', cn: `n. 候选人`, example: `He is the best candidate for the job.` },
      { en: 'communicate', phonetic: '/kəˈmjuːnɪkeɪt/', cn: `v. 交流`, example: `We communicate by email every day.` },
      { en: 'culture', phonetic: '/ˈkʌltʃə/', cn: `n. 文化`, example: `Food is a big part of culture.` },
      { en: 'climate', phonetic: '/ˈklaɪmət/', cn: `n. 气候`, example: `The climate here is warm and wet.` },
      { en: 'environment', phonetic: '/ɪnˈvaɪrənmənt/', cn: `n. 环境`, example: `We must protect the environment.` },
      { en: 'government', phonetic: '/ˈɡʌvənmənt/', cn: `n. 政府`, example: `The government made a new policy.` },
      { en: 'population', phonetic: '/ˌpɒpjuˈleɪʃn/', cn: `n. 人口`, example: `The population of the city is huge.` },
      { en: 'technology', phonetic: '/tekˈnɒlədʒi/', cn: `n. 科技`, example: `Technology changes our lives fast.` },
      { en: 'knowledge', phonetic: '/ˈnɒlɪdʒ/', cn: `n. 知识`, example: `Reading gives us knowledge.` },
      { en: 'research', phonetic: '/rɪˈsɜːtʃ/', cn: `n./v. 研究`, example: `They did research on the river.` },
      { en: 'discover', phonetic: '/dɪˈskʌvə/', cn: `v. 发现`, example: `Columbus discovered America.` },
      { en: 'create', phonetic: '/kriˈeɪt/', cn: `v. 创造`, example: `Artists create beauty from nothing.` },
      { en: 'design', phonetic: '/dɪˈzaɪn/', cn: `v./n. 设计`, example: `She designed a nice poster.` },
      { en: 'develop', phonetic: '/dɪˈveləp/', cn: `v. 发展`, example: `The town developed quickly.` },
      { en: 'improve', phonetic: '/ɪmˈpruːv/', cn: `v. 改善`, example: `We should improve our English.` },
      { en: 'reduce', phonetic: '/rɪˈdjuːs/', cn: `v. 减少`, example: `We must reduce waste.` },
      { en: 'increase', phonetic: '/ɪnˈkriːs/', cn: `v. 增加`, example: `The price increased last month.` },
      { en: 'require', phonetic: '/rɪˈkwaɪə/', cn: `v. 需要`, example: `The job requires patience.` },
      { en: 'protect', phonetic: '/prəˈtekt/', cn: `v. 保护`, example: `We should protect wild animals.` },
      { en: 'solve', phonetic: '/sɒlv/', cn: `v. 解决`, example: `They solved the problem together.` }
    ]
  },
  {
    id: 'nce4', name: '新概念英语第四册', icon: 'fa-university', desc: '新概念4册高阶词汇，学术精读与写作利器',
    words: [
      { en: 'beast', phonetic: '/biːst/', cn: `n. 野兽`, example: `The beast lived deep in the forest.` },
      { en: 'census', phonetic: '/ˈsensəs/', cn: `n. 人口普查`, example: `The national census is held every ten years.` },
      { en: 'alpinist', phonetic: '/ˈælpɪnɪst/', cn: `n. 登山运动员`, example: `The alpinist reached the summit at dawn.` },
      { en: 'attain', phonetic: '/əˈteɪn/', cn: `v. 达到，获得`, example: `He attained great success through effort.` },
      { en: 'coarse', phonetic: '/kɔːs/', cn: `adj. 粗糙的`, example: `The cloth was coarse and uncomfortable.` },
      { en: 'flee', phonetic: '/fliː/', cn: `v. 逃离`, example: `They fled the burning building quickly.` },
      { en: 'impoverished', phonetic: '/ɪmˈpɒvərɪʃt/', cn: `adj. 贫困的`, example: `The war left many families impoverished.` },
      { en: 'linen', phonetic: '/ˈlɪnɪn/', cn: `n. 亚麻布`, example: `She bought a set of linen sheets.` },
      { en: 'perilous', phonetic: '/ˈperələs/', cn: `adj. 危险的`, example: `They crossed the perilous mountain road.` },
      { en: 'shepherd', phonetic: '/ˈʃepəd/', cn: `n. 牧羊人`, example: `The shepherd watched his flock on the hill.` },
      { en: 'shudder', phonetic: '/ˈʃʌdə/', cn: `v. 不寒而栗`, example: `She shuddered at the cold wind.` },
      { en: 'solitary', phonetic: '/ˈsɒlətəri/', cn: `adj. 孤独的`, example: `He lived a solitary life in the village.` },
      { en: 'summit', phonetic: '/ˈsʌmɪt/', cn: `n. 顶峰`, example: `They reached the summit of the mountain.` },
      { en: 'absurd', phonetic: '/əbˈsɜːd/', cn: `adj. 荒唐的`, example: `His excuse sounded absolutely absurd.` },
      { en: 'combative', phonetic: '/ˈkɒmbətɪv/', cn: `adj. 好斗的`, example: `He has a combative attitude in debates.` },
      { en: 'competitive', phonetic: '/kəmˈpetətɪv/', cn: `adj. 竞争的`, example: `The market is highly competitive.` },
      { en: 'contest', phonetic: '/ˈkɒntest/', cn: `n. 比赛`, example: `She won the singing contest.` },
      { en: 'deduce', phonetic: '/dɪˈdjuːs/', cn: `v. 推断`, example: `We can deduce the answer from the clues.` },
      { en: 'disgrace', phonetic: '/dɪsˈɡreɪs/', cn: `n./v. 丢脸`, example: `His behavior brought disgrace to the family.` },
      { en: 'fury', phonetic: '/ˈfjʊəri/', cn: `n. 狂怒`, example: `She left the room in a fury.` },
      { en: 'prestige', phonetic: '/preˈstiːʒ/', cn: `n. 声望`, example: `The university has great academic prestige.` },
      { en: 'savage', phonetic: '/ˈsævɪdʒ/', cn: `adj. 凶猛的`, example: `The savage storm destroyed the village.` },
      { en: 'spectator', phonetic: '/spekˈteɪtə/', cn: `n. 观众`, example: `The match drew thousands of spectators.` },
      { en: 'apparatus', phonetic: '/ˌæpəˈreɪtəs/', cn: `n. 仪器`, example: `The lab has new scientific apparatus.` },
      { en: 'appreciation', phonetic: '/əˌpriːʃiˈeɪʃn/', cn: `n. 欣赏`, example: `He has a deep appreciation of music.` },
      { en: 'ancient', phonetic: '/ˈeɪnʃənt/', cn: `adj. 古老的`, example: `They visited an ancient temple.` },
      { en: 'civilization', phonetic: '/ˌsɪvəlaɪˈzeɪʃn/', cn: `n. 文明`, example: `The river gave birth to a great civilization.` },
      { en: 'philosophy', phonetic: '/fəˈlɒsəfi/', cn: `n. 哲学`, example: `He studied philosophy at college.` },
      { en: 'psychology', phonetic: '/saɪˈkɒlədʒi/', cn: `n. 心理学`, example: `Psychology helps us understand people.` },
      { en: 'phenomenon', phonetic: '/fəˈnɒmɪnən/', cn: `n. 现象`, example: `An aurora is a natural phenomenon.` },
      { en: 'astronomy', phonetic: '/əˈstrɒnəmi/', cn: `n. 天文学`, example: `Astronomy studies the stars.` },
      { en: 'geometry', phonetic: '/dʒiˈɒmətri/', cn: `n. 几何`, example: `Geometry deals with shapes.` },
      { en: 'literature', phonetic: '/ˈlɪtrətʃə/', cn: `n. 文学`, example: `She loves English literature.` },
      { en: 'renaissance', phonetic: '/rɪˈneɪsns/', cn: `n. 文艺复兴`, example: `The Renaissance changed Europe.` },
      { en: 'architecture', phonetic: '/ˈɑːkɪtektʃə/', cn: `n. 建筑`, example: `The architecture here is amazing.` },
      { en: 'conservation', phonetic: '/ˌkɒnsəˈveɪʃn/', cn: `n. 保护`, example: `Conservation of forests matters.` },
      { en: 'diplomatic', phonetic: '/ˌdɪpləˈmætɪk/', cn: `adj. 外交的`, example: `They had a diplomatic meeting.` },
      { en: 'endeavor', phonetic: '/ɪnˈdevə/', cn: `n./v. 努力`, example: `He made every endeavor to win.` },
      { en: 'extravagant', phonetic: '/ɪkˈstrævəɡənt/', cn: `adj. 奢侈的`, example: `The party was rather extravagant.` },
      { en: 'ingenious', phonetic: '/ɪnˈdʒiːniəs/', cn: `adj. 巧妙的`, example: `It was an ingenious plan.` },
      { en: 'notable', phonetic: '/ˈnəʊtəbl/', cn: `adj. 显著的`, example: `He is a notable scientist.` },
      { en: 'profound', phonetic: '/prəˈfaʊnd/', cn: `adj. 深刻的`, example: `The book had a profound impact.` },
      { en: 'scrutinize', phonetic: '/ˈskruːtənaɪz/', cn: `v. 仔细检查`, example: `The judge scrutinized the evidence.` }
    ]
  },
  {
    id: 'kaoyan', name: '考研英语核心高频词', icon: 'fa-pen-fancy', desc: '历年考研真题高频词，阅读写作冲刺必备',
    words: [
      { en: 'analyze', phonetic: '/ˈænəlaɪz/', cn: `v. 分析`, example: `We should analyze the problem first.` },
      { en: 'estimate', phonetic: '/ˈestɪmeɪt/', cn: `v. 估计`, example: `The cost is estimated at one million.` },
      { en: 'highlight', phonetic: '/ˈhaɪlaɪt/', cn: `v. 强调`, example: `The report highlights the main risk.` },
      { en: 'justify', phonetic: '/ˈdʒʌstɪfaɪ/', cn: `v. 证明合理`, example: `He justified his choice with facts.` },
      { en: 'undermine', phonetic: '/ˌʌndəˈmaɪn/', cn: `v. 削弱`, example: `Lack of trust undermines a team.` },
      { en: 'phenomenon', phonetic: '/fəˈnɒmɪnən/', cn: `n. 现象`, example: `This is a common social phenomenon.` },
      { en: 'hypothesis', phonetic: '/haɪˈpɒθəsɪs/', cn: `n. 假设`, example: `The hypothesis was tested by experiments.` },
      { en: 'crisis', phonetic: '/ˈkraɪsɪs/', cn: `n. 危机`, example: `The company faced a financial crisis.` },
      { en: 'perspective', phonetic: '/pəˈspektɪv/', cn: `n. 视角`, example: `We should see it from a new perspective.` },
      { en: 'trend', phonetic: '/trend/', cn: `n. 趋势`, example: `There is a trend toward remote work.` },
      { en: 'crucial', phonetic: '/ˈkruːʃl/', cn: `adj. 关键的`, example: `Timing is crucial for success.` },
      { en: 'explicit', phonetic: '/ɪkˈsplɪsɪt/', cn: `adj. 明确的`, example: `The instructions were explicit and clear.` },
      { en: 'substantial', phonetic: '/səbˈstænʃl/', cn: `adj. 大量的`, example: `They made substantial progress.` },
      { en: 'priority', phonetic: '/praɪˈɒrəti/', cn: `n. 优先`, example: `Health should be a top priority.` },
      { en: 'appropriate', phonetic: '/əˈprəʊpriət/', cn: `adj. 适当的`, example: `This gift is appropriate for the event.` },
      { en: 'feature', phonetic: '/ˈfiːtʃə/', cn: `n./v. 特征；以…为特色`, example: `The film features many famous actors.` },
      { en: 'variety', phonetic: '/vəˈraɪəti/', cn: `n. 多样`, example: `There is a variety of books to choose.` },
      { en: 'tendency', phonetic: '/ˈtendənsi/', cn: `n. 倾向`, example: `He has a tendency to work late.` },
      { en: 'advantage', phonetic: '/ədˈvɑːntɪdʒ/', cn: `n. 优势`, example: `The new method has clear advantages.` },
      { en: 'challenge', phonetic: '/ˈtʃælɪndʒ/', cn: `n. 挑战`, example: `Climate change is a global challenge.` },
      { en: 'consequence', phonetic: '/ˈkɒnsɪkwəns/', cn: `n. 后果`, example: `Poor choices have serious consequences.` },
      { en: 'criterion', phonetic: '/kraɪˈtɪəriən/', cn: `n. 标准`, example: `The criteria for selection were strict.` },
      { en: 'dilemma', phonetic: '/dɪˈlemə/', cn: `n. 困境`, example: `He faced a dilemma between two jobs.` },
      { en: 'evidence', phonetic: '/ˈevɪdəns/', cn: `n. 证据`, example: `The evidence supports the theory.` },
      { en: 'factor', phonetic: '/ˈfæktə/', cn: `n. 因素`, example: `Cost is a key factor in the decision.` }
    ]
  },
  {
    id: 'business', name: '商务英语核心词', icon: 'fa-briefcase', desc: '会议谈判邮件高频词，职场沟通直接用',
    words: [
      { en: 'negotiation', phonetic: '/nɪˌɡəʊʃiˈeɪʃn/', cn: `n. 谈判`, example: `The negotiation ended with a deal.` },
      { en: 'contract', phonetic: '/ˈkɒntrækt/', cn: `n. 合同`, example: `Please review the contract carefully.` },
      { en: 'quotation', phonetic: '/kwəʊˈteɪʃn/', cn: `n. 报价`, example: `We received a quotation from the supplier.` },
      { en: 'payment', phonetic: '/ˈpeɪmənt/', cn: `n. 付款`, example: `The payment is due next week.` },
      { en: 'logistics', phonetic: '/ləˈdʒɪstɪks/', cn: `n. 物流`, example: `Logistics is key to online retail.` },
      { en: 'agenda', phonetic: '/əˈdʒendə/', cn: `n. 议程`, example: `Let us review the agenda for the meeting.` },
      { en: 'deadline', phonetic: '/ˈdedlaɪn/', cn: `n. 截止日期`, example: `The proposal deadline is Friday.` },
      { en: 'collaborate', phonetic: '/kəˈlæbəreɪt/', cn: `v. 合作`, example: `We collaborate with teams abroad.` },
      { en: 'feedback', phonetic: '/ˈfiːdbæk/', cn: `n. 反馈`, example: `We value your feedback on the product.` },
      { en: 'proposal', phonetic: '/prəˈpəʊzl/', cn: `n. 提案`, example: `He submitted a new project proposal.` },
      { en: 'conference', phonetic: '/ˈkɒnfərəns/', cn: `n. 会议`, example: `She spoke at the annual conference.` },
      { en: 'exhibition', phonetic: '/ˌeksɪˈbɪʃn/', cn: `n. 展览`, example: `Our firm has a booth at the exhibition.` },
      { en: 'keynote', phonetic: '/ˈkiːnəʊt/', cn: `n. 主旨演讲`, example: `The keynote was about market trends.` },
      { en: 'networking', phonetic: '/ˈnetwɜːkɪŋ/', cn: `n. 社交`, example: `The event is good for networking.` },
      { en: 'client', phonetic: '/ˈklaɪənt/', cn: `n. 客户`, example: `We met an important client today.` },
      { en: 'invoice', phonetic: '/ˈɪnvɔɪs/', cn: `n. 发票`, example: `Please send the invoice by email.` },
      { en: 'discount', phonetic: '/ˈdɪskaʊnt/', cn: `n./v. 折扣`, example: `We offer a ten percent discount.` },
      { en: 'revenue', phonetic: '/ˈrevənjuː/', cn: `n. 收入`, example: `The company grew its revenue this year.` },
      { en: 'stakeholder', phonetic: '/ˈsteɪkhəʊldə/', cn: `n. 利益相关者`, example: `We informed every stakeholder of the plan.` },
      { en: 'merger', phonetic: '/ˈmɜːdʒə/', cn: `n. 合并`, example: `The merger created a larger firm.` },
      { en: 'acquisition', phonetic: '/ˌækwɪˈzɪʃn/', cn: `n. 收购`, example: `The acquisition cost two billion.` },
      { en: 'benchmark', phonetic: '/ˈbentʃmɑːk/', cn: `n. 基准`, example: `We use last year as a benchmark.` },
      { en: 'budget', phonetic: '/ˈbʌdʒɪt/', cn: `n. 预算`, example: `The project is over the budget.` },
      { en: 'profit', phonetic: '/ˈprɒfɪt/', cn: `n. 利润`, example: `The shop made a small profit.` }
    ]
  },
  {
    id: 'travel', name: '旅游英语核心词', icon: 'fa-plane', desc: '出行住宿交通高频词，出国旅游随身宝典',
    words: [
      { en: 'luggage', phonetic: '/ˈlʌɡɪdʒ/', cn: `n. 行李`, example: `Where can I leave my luggage?` },
      { en: 'delay', phonetic: '/dɪˈleɪ/', cn: `n./v. 延误`, example: `My flight was delayed by fog.` },
      { en: 'transfer', phonetic: '/trænsˈfɜː/', cn: `n./v. 转机，换乘`, example: `I have a transfer in Dubai.` },
      { en: 'reservation', phonetic: '/ˌrezəˈveɪʃn/', cn: `n. 预订`, example: `I made a hotel reservation online.` },
      { en: 'flight', phonetic: '/flaɪt/', cn: `n. 航班`, example: `The flight takes about three hours.` },
      { en: 'recommendation', phonetic: '/ˌrekəmenˈdeɪʃn/', cn: `n. 推荐`, example: `Do you have a restaurant recommendation?` },
      { en: 'vegetarian', phonetic: '/ˌvedʒəˈteəriən/', cn: `n./adj. 素食者`, example: `She is a vegetarian and avoids meat.` },
      { en: 'peak', phonetic: '/piːk/', cn: `n./adj. 高峰`, example: `July is the peak season for travel.` },
      { en: 'package', phonetic: '/ˈpækɪdʒ/', cn: `n. 套餐`, example: `We bought a package tour to Bali.` },
      { en: 'booking', phonetic: '/ˈbʊkɪŋ/', cn: `n. 预订`, example: `Your booking is confirmed by email.` },
      { en: 'airport', phonetic: '/ˈeəpɔːt/', cn: `n. 机场`, example: `The airport is far from the city.` },
      { en: 'sightseeing', phonetic: '/ˈsaɪtsiːɪŋ/', cn: `n. 观光`, example: `We went sightseeing in the old town.` },
      { en: 'attraction', phonetic: '/əˈtrækʃn/', cn: `n. 景点`, example: `The museum is a top attraction.` },
      { en: 'heritage', phonetic: '/ˈherɪtɪdʒ/', cn: `n. 遗产`, example: `This site is a world heritage.` },
      { en: 'currency', phonetic: '/ˈkʌrənsi/', cn: `n. 货币`, example: `You can change currency at the bank.` },
      { en: 'passport', phonetic: '/ˈpɑːspɔːt/', cn: `n. 护照`, example: `Do not forget your passport at home.` },
      { en: 'visa', phonetic: '/ˈviːzə/', cn: `n. 签证`, example: `I need a visa to visit that country.` },
      { en: 'itinerary', phonetic: '/aɪˈtɪnərəri/', cn: `n. 行程`, example: `Our itinerary includes three cities.` },
      { en: 'excursion', phonetic: '/ɪkˈskɜːʃn/', cn: `n. 短途旅行`, example: `We joined a day excursion to the lake.` },
      { en: 'fare', phonetic: '/feə/', cn: `n. 票价`, example: `The train fare is quite cheap.` },
      { en: 'accommodation', phonetic: '/əˌkɒməˈdeɪʃn/', cn: `n. 住宿`, example: `We found cheap accommodation near the sea.` },
      { en: 'resort', phonetic: '/rɪˈzɔːt/', cn: `n. 度假村`, example: `They stayed at a beach resort.` },
      { en: 'destination', phonetic: '/ˌdestɪˈneɪʃn/', cn: `n. 目的地`, example: `Paris is a popular destination.` },
      { en: 'harbor', phonetic: '/ˈhɑːbə/', cn: `n. 港口`, example: `The harbor was full of fishing boats.` },
      { en: 'highway', phonetic: '/ˈhaɪweɪ/', cn: `n. 高速公路`, example: `The highway was closed by snow.` }
    ]
  },
  {
    id: 'daily_abroad', name: '国外日常交流英语', icon: 'fa-comments', desc: '出国生活高频口语：打招呼/问路/求助/道谢/告别实用句子 日常交流 口语 出国 生活',
    words: [
      { en: "Hello, how are you?", phonetic: '/həˈləʊ haʊ ɑː ju/', cn: `你好吗？`, example: `You can say "Hello, how are you?" when you meet someone.` },
      { en: "Nice to meet you.", phonetic: '/naɪs tə miːt ju/', cn: `很高兴认识你。`, example: `Say "Nice to meet you" when you are introduced.` },
      { en: "How's it going?", phonetic: '/haʊz ɪt ˈɡəʊɪŋ/', cn: `最近怎么样？`, example: `"How's it going?" is a casual greeting.` },
      { en: "What's your name?", phonetic: '/wɒts jɔː neɪm/', cn: `你叫什么名字？`, example: `Ask "What's your name?" politely.` },
      { en: "Where are you from?", phonetic: '/weər ɑː ju frɒm/', cn: `你来自哪里？`, example: `"Where are you from?" asks about your hometown.` },
      { en: "I'm from China.", phonetic: '/aɪm frɒm ˈtʃaɪnə/', cn: `我来自中国。`, example: `Answer with "I'm from China."` },
      { en: "Do you speak English?", phonetic: '/duː ju spiːk ˈɪŋɡlɪʃ/', cn: `你会说英语吗？`, example: `Ask "Do you speak English?" when abroad.` },
      { en: "Could you say that again?", phonetic: '/kʊd ju seɪ ðæt əˈɡen/', cn: `你能再说一遍吗？`, example: `Use this when you miss something.` },
      { en: "I don't understand.", phonetic: '/aɪ dəʊnt ˌʌndəˈstænd/', cn: `我不明白。`, example: `Say "I don't understand" honestly.` },
      { en: "Can you help me?", phonetic: '/kæn ju help mi/', cn: `你能帮我吗？`, example: `"Can you help me?" asks for aid.` },
      { en: "Thank you very much.", phonetic: '/θæŋk ju ˈveri mʌtʃ/', cn: `非常感谢。`, example: `Say "Thank you very much" for big help.` },
      { en: "You're welcome.", phonetic: '/jɔː ˈwelkəm/', cn: `不客气。`, example: `Reply "You're welcome" to thanks.` },
      { en: "I'm sorry.", phonetic: '/aɪm ˈsɒri/', cn: `对不起。`, example: `Say "I'm sorry" for a mistake.` },
      { en: "Excuse me.", phonetic: '/ɪkˈskjuːz mi/', cn: `打扰一下。`, example: `Use "Excuse me" to get attention.` },
      { en: "Have a nice day.", phonetic: '/hæv ə naɪs deɪ/', cn: `祝你有美好的一天。`, example: `Say "Have a nice day" when leaving.` },
      { en: "See you later.", phonetic: '/siː ju ˈleɪtə/', cn: `回头见。`, example: `"See you later" is a casual goodbye.` },
      { en: "Good morning.", phonetic: '/ɡʊd ˈmɔːnɪŋ/', cn: `早上好。`, example: `Say "Good morning" before noon.` },
      { en: "Good afternoon.", phonetic: '/ɡʊd ˌɑːftəˈnuːn/', cn: `下午好。`, example: `Say "Good afternoon" after noon.` },
      { en: "Good evening.", phonetic: '/ɡʊd ˈiːvnɪŋ/', cn: `晚上好。`, example: `Say "Good evening" at night.` },
      { en: "How much is this?", phonetic: '/haʊ mʌtʃ ɪz ðɪs/', cn: `这个多少钱？`, example: `Ask "How much is this?" in shops.` },
      { en: "Where is the restroom?", phonetic: '/weər ɪz ðə ˈrestruːm/', cn: `洗手间在哪？`, example: `"Where is the restroom?" is useful abroad.` },
      { en: "I need a doctor.", phonetic: '/aɪ niːd ə ˈdɒktə/', cn: `我需要看医生。`, example: `Say "I need a doctor" in an emergency.` },
      { en: "I'm lost.", phonetic: '/aɪm lɒst/', cn: `我迷路了。`, example: `"I'm lost" asks for directions.` },
      { en: "What time is it?", phonetic: '/wɒt taɪm ɪz ɪt/', cn: `现在几点？`, example: `Ask "What time is it?" to check.` },
      { en: "Can I take a photo?", phonetic: '/kæn aɪ teɪk ə ˈfəʊtəʊ/', cn: `我可以拍照吗？`, example: `Ask "Can I take a photo?" first.` },
      { en: "Could you speak slowly?", phonetic: '/kʊd ju spiːk ˈsləʊli/', cn: `你能说慢点吗？`, example: `"Could you speak slowly?" helps you learn.` },
      { en: "I agree.", phonetic: '/aɪ əˈɡriː/', cn: `我同意。`, example: `Say "I agree" to show support.` },
      { en: "I disagree.", phonetic: '/aɪ ˌdɪsəˈɡriː/', cn: `我不同意。`, example: `"I disagree" gives another view.` },
      { en: "That's a good idea.", phonetic: '/ðæts ə ɡʊd aɪˈdɪə/', cn: `好主意。`, example: `Praise with "That's a good idea."` },
      { en: "What do you think?", phonetic: '/wɒt duː ju θɪŋk/', cn: `你怎么看？`, example: `Ask "What do you think?" for opinions.` },
      { en: "Let's go.", phonetic: '/lets ɡəʊ/', cn: `我们走吧。`, example: `Say "Let's go" to start moving.` },
      { en: "Wait a moment.", phonetic: '/weɪt ə ˈməʊmənt/', cn: `等一下。`, example: `"Wait a moment" asks for a pause.` },
      { en: "It doesn't matter.", phonetic: '/ɪt ˈdʌznt ˈmætə/', cn: `没关系。`, example: `Reply "It doesn't matter" to mistakes.` },
      { en: "No problem.", phonetic: '/nəʊ ˈprɒbləm/', cn: `没问题。`, example: `Say "No problem" to reassure.` },
      { en: "Take care.", phonetic: '/teɪk keə/', cn: `保重。`, example: `"Take care" is a warm goodbye.` },
      { en: "I'm fine, thanks.", phonetic: '/aɪm faɪn θæŋks/', cn: `我很好，谢谢。`, example: `Answer "I'm fine, thanks."` },
      { en: "Pleased to meet you.", phonetic: '/pliːzd tə miːt ju/', cn: `幸会。`, example: `A formal "Pleased to meet you."` },
      { en: "How do you spell that?", phonetic: '/haʊ duː ju spel ðæt/', cn: `这个怎么拼？`, example: `Ask to spell a word.` },
      { en: "Could you write it down?", phonetic: '/kʊd ju raɪt ɪt daʊn/', cn: `你能写下来吗？`, example: `"Could you write it down?" clarifies.` },
      { en: "Is this seat taken?", phonetic: '/ɪz ðɪs siːt ˈteɪkən/', cn: `这个座位有人吗？`, example: `Ask "Is this seat taken?" on transit.` }
    ]
  },
  {
    id: 'ordering', name: '餐厅点餐英语', icon: 'fa-utensils', desc: '餐厅/咖啡馆点餐用语：看菜单/点菜/忌口/买单/小费实用句子 点餐 餐厅 吃饭 出国',
    words: [
      { en: "Could I see the menu, please?", phonetic: '/kʊd aɪ siː ðə ˈmenjuː pliːz/', cn: `请给我菜单好吗？`, example: `Say this when you are ready to order.` },
      { en: "I'd like to order.", phonetic: '/aɪd laɪk tə ˈɔːdə/', cn: `我想点餐。`, example: `"I'd like to order" starts your meal.` },
      { en: "What do you recommend?", phonetic: '/wɒt duː ju ˌrekəˈmend/', cn: `你推荐什么？`, example: `Ask the waiter for ideas.` },
      { en: "I'm vegetarian.", phonetic: '/aɪm ˌvedʒəˈteəriən/', cn: `我是素食者。`, example: `Tell them "I'm vegetarian."` },
      { en: "No meat, please.", phonetic: '/nəʊ miːt pliːz/', cn: `请不要放肉。`, example: `"No meat, please" is clear.` },
      { en: "I'm allergic to nuts.", phonetic: '/aɪm əˈlɜːdʒɪk tə nʌts/', cn: `我对坚果过敏。`, example: `State your allergies clearly.` },
      { en: "A table for two, please.", phonetic: '/ə ˈteɪbl fɔː tuː pliːz/', cn: `请来两位的桌位。`, example: `Ask for "a table for two."` },
      { en: "Do you have a reservation?", phonetic: '/duː ju hæv ə ˌrezəˈveɪʃn/', cn: `您有预订吗？`, example: `They may ask this on arrival.` },
      { en: "Could we have the bill, please?", phonetic: '/kʊd wi hæv ðə bɪl pliːz/', cn: `请买单。`, example: `Ask for the bill to pay.` },
      { en: "It's on me.", phonetic: '/ɪts ɒn mi/', cn: `我来请客。`, example: `Say "It's on me" to treat.` },
      { en: "Keep the change.", phonetic: '/kiːp ðə tʃeɪndʒ/', cn: `不用找零了。`, example: `"Keep the change" tips the waiter.` },
      { en: "Is service included?", phonetic: '/ɪz ˈsɜːvɪs ɪnˈkluːdɪd/', cn: `含服务费吗？`, example: `Ask before tipping.` },
      { en: "I'd like a glass of water.", phonetic: '/aɪd laɪk ə ɡlɑːs əv ˈwɔːtə/', cn: `我要一杯水。`, example: `Ask for water first.` },
      { en: "The food is delicious.", phonetic: '/ðə fuːd ɪz dɪˈlɪʃəs/', cn: `这食物很好吃。`, example: `Compliment the meal.` },
      { en: "It's too salty.", phonetic: '/ɪts tuː ˈsɔːlti/', cn: `太咸了。`, example: `"It's too salty" gives feedback.` },
      { en: "It's too spicy.", phonetic: '/ɪts tuː ˈspaɪsi/', cn: `太辣了。`, example: `Warn if you dislike spice.` },
      { en: "Could I have some napkins?", phonetic: '/kʊd aɪ hæv səm ˈnæpkɪnz/', cn: `能给我些餐巾纸吗？`, example: `Ask for napkins.` },
      { en: "I'd like it to go.", phonetic: '/aɪd laɪk ɪt tə ɡəʊ/', cn: `我要打包带走。`, example: `"I'd like it to go" for takeout.` },
      { en: "Medium rare, please.", phonetic: '/ˈmiːdiəm reə pliːz/', cn: `请做三分熟。`, example: `Order steak doneness.` },
      { en: "A cup of coffee, please.", phonetic: '/ə kʌp əv ˈkɒfi pliːz/', cn: `请来一杯咖啡。`, example: `Order a drink.` },
      { en: "Do you accept cards?", phonetic: '/duː ju əkˈsept kɑːdz/', cn: `收银行卡吗？`, example: `Check payment methods.` },
      { en: "Where is the restroom?", phonetic: '/weər ɪz ðə ˈrestruːm/', cn: `洗手间在哪？`, example: `Ask inside the restaurant.` },
      { en: "Could I have the Wi-Fi password?", phonetic: '/kʊd aɪ hæv ðə ˈwaɪfaɪ ˈpɑːswɜːd/', cn: `能给我 WiFi 密码吗？`, example: `Ask to get online.` },
      { en: "I'm full, thank you.", phonetic: '/aɪm fʊl θæŋk ju/', cn: `我吃饱了，谢谢。`, example: `Politely decline more food.` },
      { en: "That was a great meal.", phonetic: '/ðæt wɒz ə ɡreɪt miːl/', cn: `这顿饭很棒。`, example: `Thank the host.` },
      { en: "Can I get a doggy bag?", phonetic: '/kæn aɪ ɡet ə ˈdɒɡi bæɡ/', cn: `能打包吗？`, example: `A "doggy bag" takes leftovers.` },
      { en: "What's today's special?", phonetic: '/wɒts təˈdeɪz ˈspeʃl/', cn: `今日特餐是什么？`, example: `Ask for the special.` },
      { en: "A bottle of red wine, please.", phonetic: '/ə ˈbɒtl əv red waɪn pliːz/', cn: `请来一瓶红酒。`, example: `Order wine.` },
      { en: "Could you bring the menu?", phonetic: '/kʊd ju brɪŋ ðə ˈmenjuː/', cn: `能拿菜单来吗？`, example: `Ask again for the menu.` },
      { en: "I didn't order this.", phonetic: '/aɪ ˈdɪdnt ˈɔːdə ðɪs/', cn: `我没点这个。`, example: `Point out a wrong dish.` },
      { en: "This is not what I ordered.", phonetic: '/ðɪs ɪz nɒt wɒt aɪ ˈɔːdəd/', cn: `这不是我点的。`, example: `Clarify the mistake.` },
      { en: "Could we have more bread?", phonetic: '/kʊd wi hæv mɔː bred/', cn: `能再来点面包吗？`, example: `Ask for more.` },
      { en: "How spicy is this?", phonetic: '/haʊ ˈspaɪsi ɪz ðɪs/', cn: `这个有多辣？`, example: `Check the spice level.` },
      { en: "I'd like the set lunch.", phonetic: '/aɪd laɪk ðə set lʌntʃ/', cn: `我要套餐午餐。`, example: `Order a set meal.` },
      { en: "No ice, please.", phonetic: '/nəʊ aɪs pliːz/', cn: `请不要加冰。`, example: `"No ice, please" for drinks.` },
      { en: "A refill, please.", phonetic: '/ə ˈriːfɪl pliːz/', cn: `请续杯。`, example: `Ask to refill a drink.` },
      { en: "Could I sit by the window?", phonetic: '/kʊd aɪ sɪt baɪ ðə ˈwɪndəʊ/', cn: `我能坐窗边吗？`, example: `Request a seat.` },
      { en: "The food is cold.", phonetic: '/ðə fuːd ɪz kəʊld/', cn: `菜凉了。`, example: `Complain politely.` },
      { en: "Thank you for the service.", phonetic: '/θæŋk ju fɔː ðə ˈsɜːvɪs/', cn: `谢谢你的服务。`, example: `Tip with thanks.` },
      { en: "We're ready to order.", phonetic: '/wɪə ˈredi tə ˈɔːdə/', cn: `我们准备好点餐了。`, example: `Tell the waiter you are set.` }
    ]
  },
  {
    id: 'subway', name: '地铁与交通出行英语', icon: 'fa-subway', desc: '地铁/公交/打车出行用语：买票/换乘/问路/出站实用句子 地铁 交通 出行 公交 打车 出国',
    words: [
      { en: "Where is the nearest subway station?", phonetic: '/weər ɪz ðə ˈnɪərɪst ˈsʌbweɪ ˈsteɪʃn/', cn: `最近的地铁站在哪？`, example: `Ask for the station.` },
      { en: "I'd like a one-way ticket.", phonetic: '/aɪd laɪk ə ˈwʌnweɪ ˈtɪkɪt/', cn: `我要单程票。`, example: `Buy a single ticket.` },
      { en: "A return ticket, please.", phonetic: '/ə rɪˈtɜːn ˈtɪkɪt pliːz/', cn: `请来一张往返票。`, example: `Ask for a round trip.` },
      { en: "How much is the fare?", phonetic: '/haʊ mʌtʃ ɪz ðə feə/', cn: `票价多少？`, example: `Ask the fare.` },
      { en: "Which line goes to the center?", phonetic: '/wɪtʃ laɪn ɡəʊz tə ðə ˈsentə/', cn: `哪条线去市中心？`, example: `Ask the right line.` },
      { en: "Do I need to transfer?", phonetic: '/duː aɪ niːd tə trænsˈfɜː/', cn: `我需要换乘吗？`, example: `Check transfers.` },
      { en: "Where do I change trains?", phonetic: '/weər duː aɪ tʃeɪndʒ treɪnz/', cn: `我在哪换车？`, example: `Ask for the transfer spot.` },
      { en: "Is this the right platform?", phonetic: '/ɪz ðɪs ðə raɪt ˈplætfɔːm/', cn: `是这个站台吗？`, example: `Confirm the platform.` },
      { en: "Which exit should I take?", phonetic: '/wɪtʃ ˈeksɪt ʃʊd aɪ teɪk/', cn: `我该走哪个出口？`, example: `Ask for the exit.` },
      { en: "The train is arriving.", phonetic: '/ðə treɪn ɪz əˈraɪvɪŋ/', cn: `列车进站了。`, example: `Listen for this announcement.` },
      { en: "Mind the gap.", phonetic: '/maɪnd ðə ɡæp/', cn: `小心站台间隙。`, example: `Heed the warning.` },
      { en: "The doors are closing.", phonetic: '/ðə dɔːz ɑː ˈkləʊzɪŋ/', cn: `车门关闭中。`, example: `Step back when hearing this.` },
      { en: "Next stop is Central.", phonetic: '/nekst stɒp ɪz ˈsentrəl/', cn: `下一站是中央站。`, example: `Hear your stop announced.` },
      { en: "Please give up your seat.", phonetic: '/pliːz ɡɪv ʌp jɔː siːt/', cn: `请让座。`, example: `Kindly offer your seat.` },
      { en: "Where can I buy a ticket?", phonetic: '/weər kæn aɪ baɪ ə ˈtɪkɪt/', cn: `我在哪买票？`, example: `Find the machine.` },
      { en: "Does this bus go to the park?", phonetic: '/dʌz ðɪs bʌs ɡəʊ tə ðə pɑːk/', cn: `这趟公交去公园吗？`, example: `Ask the bus driver.` },
      { en: "How often does the bus come?", phonetic: '/haʊ ˈɒfn dʌz ðə bʌs kʌm/', cn: `公交多久一班？`, example: `Ask the frequency.` },
      { en: "I missed the train.", phonetic: '/aɪ mɪst ðə treɪn/', cn: `我错过火车了。`, example: `Explain your delay.` },
      { en: "The train is delayed.", phonetic: '/ðə treɪn ɪz dɪˈleɪd/', cn: `列车晚点了。`, example: `Check the board.` },
      { en: "How long is the journey?", phonetic: '/haʊ lɒŋ ɪz ðə ˈdʒɜːni/', cn: `旅途多久？`, example: `Ask the trip length.` },
      { en: "Could you tell me when to get off?", phonetic: '/kʊd ju tel mi wen tə ɡet ɒf/', cn: `能告诉我何时下车吗？`, example: `Ask a fellow rider.` },
      { en: "I'd like to top up my card.", phonetic: '/aɪd laɪk tə tɒp ʌp maɪ kɑːd/', cn: `我想给卡充值。`, example: `Add fare to your pass.` },
      { en: "Is there a direct train?", phonetic: '/ɪz ðeə ə dəˈrekt treɪn/', cn: `有直达车吗？`, example: `Ask to avoid transfers.` },
      { en: "Which direction is uptown?", phonetic: '/wɪtʃ dəˈrekʃn ɪz ˈʌptaʊn/', cn: `哪个方向是市区？`, example: `Check the direction.` },
      { en: "Where is the taxi stand?", phonetic: '/weər ɪz ðə ˈtæksi stænd/', cn: `出租车站在哪？`, example: `Find a cab.` },
      { en: "Please take me to this address.", phonetic: '/pliːz teɪk mi tə ðɪs əˈdres/', cn: `请送我到这个地址。`, example: `Show the driver.` },
      { en: "How much is the fare to the airport?", phonetic: '/haʊ mʌtʃ ɪz ðə feə tə ðə ˈeəpɔːt/', cn: `去机场多少钱？`, example: `Ask the taxi fare.` },
      { en: "Keep the meter on, please.", phonetic: '/kiːp ðə ˈmiːtə ɒn pliːz/', cn: `请打表。`, example: `Ensure the meter runs.` },
      { en: "Could you slow down?", phonetic: '/kʊd ju sləʊ daʊn/', cn: `能开慢点吗？`, example: `Ask the driver.` },
      { en: "Stop here, please.", phonetic: '/stɒp hɪə pliːz/', cn: `请在这里停。`, example: `Tell the driver to stop.` },
      { en: "Where can I rent a bike?", phonetic: '/weər kæn aɪ rent ə baɪk/', cn: `我在哪能租自行车？`, example: `Find bike share.` },
      { en: "Is the station far from here?", phonetic: '/ɪz ðə ˈsteɪʃn fɑː frɒm hɪə/', cn: `车站离这远吗？`, example: `Ask the distance.` },
      { en: "Could you show me on the map?", phonetic: '/kʊd ju ʃəʊ mi ɒn ðə mæp/', cn: `能在地图上指给我吗？`, example: `Ask to point it out.` },
      { en: "I'm looking for the bus stop.", phonetic: '/aɪm ˈlʊkɪŋ fɔː ðə bʌs stɒp/', cn: `我在找公交站。`, example: `Tell what you seek.` },
      { en: "What time is the last train?", phonetic: '/wɒt taɪm ɪz ðə lɑːst treɪn/', cn: `末班车几点？`, example: `Plan your return.` }
    ]
  },
  {
    id: 'shopping', name: '购物英语', icon: 'fa-shopping-bag', desc: '商场/集市购物用语：问价/试穿/砍价/退换/付款实用句子 购物 商场 砍价 买东西 出国',
    words: [
      { en: "How much does this cost?", phonetic: '/haʊ mʌtʃ dʌz ðɪs kɒst/', cn: `这个多少钱？`, example: `Ask the price.` },
      { en: "Could you give me a discount?", phonetic: '/kʊd ju ɡɪv mi ə ˈdɪskaʊnt/', cn: `能给我打个折吗？`, example: `Negotiate politely.` },
      { en: "That's too expensive.", phonetic: '/ðæts tuː ɪkˈspensɪv/', cn: `太贵了。`, example: `State your budget.` },
      { en: "I'm just looking, thanks.", phonetic: '/aɪm dʒʌst ˈlʊkɪŋ θæŋks/', cn: `我只是看看，谢谢。`, example: `Browse without help.` },
      { en: "Do you have this in a larger size?", phonetic: '/duː ju hæv ðɪs ɪn ə ˈlɑːdʒə saɪz/', cn: `这款有更大码吗？`, example: `Ask for a size.` },
      { en: "Do you have this in blue?", phonetic: '/duː ju hæv ðɪs ɪn bluː/', cn: `这款有蓝色吗？`, example: `Ask for a color.` },
      { en: "May I try this on?", phonetic: '/meɪ aɪ traɪ ðɪs ɒn/', cn: `我可以试穿吗？`, example: `Ask to try it.` },
      { en: "Where is the fitting room?", phonetic: '/weər ɪz ðə ˈfɪtɪŋ ruːm/', cn: `试衣间在哪？`, example: `Find the room.` },
      { en: "It doesn't fit me.", phonetic: '/ɪt ˈdʌznt fɪt mi/', cn: `我穿着不合身。`, example: `Return the item.` },
      { en: "I'll take it.", phonetic: '/aɪl teɪk ɪt/', cn: `我要了。`, example: `Decide to buy.` },
      { en: "Could you wrap it as a gift?", phonetic: '/kʊd ju ræp ɪt əz ə ɡɪft/', cn: `能包装成礼物吗？`, example: `Ask for gift wrap.` },
      { en: "Do you accept credit cards?", phonetic: '/duː ju əkˈsept ˈkredɪt kɑːdz/', cn: `收信用卡吗？`, example: `Check payment.` },
      { en: "Can I pay by phone?", phonetic: '/kæn aɪ peɪ baɪ fəʊn/', cn: `能手机支付吗？`, example: `Use mobile pay.` },
      { en: "Where is the checkout?", phonetic: '/weər ɪz ðə ˈtʃekaʊt/', cn: `收银台在哪？`, example: `Find the counter.` },
      { en: "Can I get a receipt, please?", phonetic: '/kæn aɪ ɡet ə rɪˈsiːt pliːz/', cn: `能给我小票吗？`, example: `Ask for proof.` },
      { en: "Is there a sale today?", phonetic: '/ɪz ðeə ə seɪl təˈdeɪ/', cn: `今天有打折吗？`, example: `Look for deals.` },
      { en: "This is on sale.", phonetic: '/ðɪs ɪz ɒn seɪl/', cn: `这个在特价。`, example: `Spot a bargain.` },
      { en: "Can I return this?", phonetic: '/kæn aɪ rɪˈtɜːn ðɪs/', cn: `我能退这个吗？`, example: `Ask about returns.` },
      { en: "I'd like a refund.", phonetic: '/aɪd laɪk ə rɪˈfʌnd/', cn: `我要退款。`, example: `Request your money back.` },
      { en: "Do you have a bigger one?", phonetic: '/duː ju hæv ə ˈbɪɡə wʌn/', cn: `有更大的吗？`, example: `Ask for larger.` },
      { en: "What's your best price?", phonetic: '/wɒts jɔː best praɪs/', cn: `最低多少钱？`, example: `Push for the floor price.` },
      { en: "I'll think about it.", phonetic: '/aɪl θɪŋk əˈbaʊt ɪt/', cn: `我考虑一下。`, example: `Delay the buy.` },
      { en: "No, thank you.", phonetic: '/nəʊ θæŋk ju/', cn: `不用了，谢谢。`, example: `Politely decline.` },
      { en: "Could you bag it, please?", phonetic: '/kʊd ju bæɡ ɪt pliːz/', cn: `能装袋吗？`, example: `Ask to bag it.` },
      { en: "Is tax included?", phonetic: '/ɪz tæks ɪnˈkluːdɪd/', cn: `含税吗？`, example: `Check the total.` },
      { en: "Do you ship abroad?", phonetic: '/duː ju ʃɪp əˈbrɔːd/', cn: `你们寄国外吗？`, example: `Ask about shipping.` },
      { en: "Can I see that one?", phonetic: '/kæn aɪ siː ðæt wʌn/', cn: `我能看看那个吗？`, example: `Point to an item.` },
      { en: "It's a little small.", phonetic: '/ɪts ə ˈlɪtl smɔːl/', cn: `有点小。`, example: `Note the fit.` },
      { en: "It's a little big.", phonetic: '/ɪts ə ˈlɪtl bɪɡ/', cn: `有点大。`, example: `Note the fit.` },
      { en: "Do you have anything cheaper?", phonetic: '/duː ju hæv ˈeniθɪŋ ˈtʃiːpə/', cn: `有更便宜的吗？`, example: `Ask for budget options.` },
      { en: "What size are you looking for?", phonetic: '/wɒt saɪz ɑː ju ˈlʊkɪŋ fɔː/', cn: `您找什么尺码？`, example: `The clerk may ask this.` },
      { en: "This is out of stock.", phonetic: '/ðɪs ɪz aʊt əv stɒk/', cn: `这个没货了。`, example: `Hear this from staff.` },
      { en: "When will it be back?", phonetic: '/wen wɪl ɪt bi bæk/', cn: `什么时候补货？`, example: `Ask restock time.` },
      { en: "Could you hold it for me?", phonetic: '/kʊd ju həʊld ɪt fɔː mi/', cn: `能帮我留着吗？`, example: `Reserve an item.` },
      { en: "I'm looking for a gift for my friend.", phonetic: '/aɪm ˈlʊkɪŋ fɔː ə ɡɪft fɔː maɪ frend/', cn: `我在给朋友挑礼物。`, example: `Tell the clerk your goal.` },
      { en: "How much is the total?", phonetic: '/haʊ mʌtʃ ɪz ðə ˈtəʊtl/', cn: `一共多少钱？`, example: `Ask the final sum.` },
      { en: "Can I pay in cash?", phonetic: '/kæn aɪ peɪ ɪn kæʃ/', cn: `能现金付吗？`, example: `Pay with bills.` },
      { en: "Do you have a loyalty card?", phonetic: '/duː ju hæv ə ˈlɔɪəlti kɑːd/', cn: `有会员卡吗？`, example: `Ask to earn points.` },
      { en: "Where can I park?", phonetic: '/weər kæn aɪ pɑːk/', cn: `我在哪停车？`, example: `Find parking.` },
      { en: "The price is reasonable.", phonetic: '/ðə praɪs ɪz ˈriːznəbl/', cn: `价格合理。`, example: `Agree to buy.` }
    ]
  },
  {
    id: 'life', name: '海外生活实用英语', icon: 'fa-home', desc: '海外生活办事用语：邮局/银行/医院/租房/挂失等实用句子 生活 办事 邮局 银行 医院 租房 出国',
    words: [
      { en: "Where is the post office?", phonetic: '/weər ɪz ðə pəʊst ˈɒfɪs/', cn: `邮局在哪？`, example: `Ask for the post office.` },
      { en: "I'd like to send this parcel.", phonetic: '/aɪd laɪk tə send ðɪs ˈpɑːsl/', cn: `我想寄这个包裹。`, example: `Say this at the counter.` },
      { en: "I need to open a bank account.", phonetic: '/aɪ niːd tə ˈəʊpən ə bæŋk əˈkaʊnt/', cn: `我要开个银行账户。`, example: `Say this at the bank.` },
      { en: "Could I withdraw some cash?", phonetic: '/kʊd aɪ wɪðˈdrɔː səm kæʃ/', cn: `我能取点现金吗？`, example: `Say this at the ATM.` },
      { en: "Where is the nearest ATM?", phonetic: '/weər ɪz ðə ˈnɪərɪst eɪ-ti-em/', cn: `最近的取款机在哪？`, example: `Find some cash.` },
      { en: "I'd like to exchange money.", phonetic: '/aɪd laɪk tə ɪksˈtʃeɪndʒ ˈmʌni/', cn: `我想换钱。`, example: `Say this at a bureau.` },
      { en: "I need to see a doctor.", phonetic: '/aɪ niːd tə siː ə ˈdɒktə/', cn: `我需要看医生。`, example: `Say this at the clinic.` },
      { en: "I have a headache.", phonetic: '/aɪ hæv ə ˈhedeɪk/', cn: `我头痛。`, example: `Describe your symptoms.` },
      { en: "I have a fever.", phonetic: '/aɪ hæv ə ˈfiːvə/', cn: `我发烧了。`, example: `Describe your symptoms.` },
      { en: "Where is the pharmacy?", phonetic: '/weər ɪz ðə ˈfɑːməsi/', cn: `药店在哪？`, example: `Find some medicine.` },
      { en: "Do you have medicine for a cold?", phonetic: '/duː ju hæv ˈmedsn fɔː ə kəʊld/', cn: `有治感冒的药吗？`, example: `Ask the pharmacist.` },
      { en: "I need to do laundry.", phonetic: '/aɪ niːd tə duː ˈlɔːndri/', cn: `我要洗衣服。`, example: `Find a washer.` },
      { en: "Where is the laundromat?", phonetic: '/weər ɪz ðə ˈlɔːndrəmæt/', cn: `自助洗衣店在哪？`, example: `Ask the locals.` },
      { en: "I'm looking for an apartment.", phonetic: '/aɪm ˈlʊkɪŋ fɔːr ən əˈpɑːtmənt/', cn: `我在找公寓。`, example: `Tell the agent.` },
      { en: "How much is the rent?", phonetic: '/haʊ mʌtʃ ɪz ðə rent/', cn: `租金多少？`, example: `Ask the landlord.` },
      { en: "The water is leaking.", phonetic: '/ðə ˈwɔːtə ɪz ˈliːkɪŋ/', cn: `水管漏水了。`, example: `Report a fault.` },
      { en: "Could you call a plumber?", phonetic: '/kʊd ju kɔːl ə ˈplʌmə/', cn: `能叫个水管工吗？`, example: `Request a repair.` },
      { en: "I need to buy a SIM card.", phonetic: '/aɪ niːd tə baɪ ə sɪm kɑːd/', cn: `我要买张 SIM 卡。`, example: `Say this at the phone shop.` },
      { en: "Where is the supermarket?", phonetic: '/weər ɪz ðə ˈsuːpəmɑːkɪt/', cn: `超市在哪？`, example: `Ask for groceries.` },
      { en: "What are the business hours?", phonetic: '/wɒt ɑː ðə ˈbɪznəs ˈaʊəz/', cn: `营业时间是什么？`, example: `Plan your visit.` },
      { en: "I'd like to report a lost card.", phonetic: '/aɪd laɪk tə rɪˈpɔːt ə lɒst kɑːd/', cn: `我要挂失一张卡。`, example: `Say this at the bank.` },
      { en: "Could I get a copy of my passport?", phonetic: '/kʊd aɪ ɡet ə ˈkɒpi əv maɪ ˈpɑːspɔːt/', cn: `能复印我的护照吗？`, example: `Say this at a print shop.` },
      { en: "Where can I print a document?", phonetic: '/weər kæn aɪ prɪnt ə ˈdɒkjumənt/', cn: `我在哪能打印文件？`, example: `Find a printer.` },
      { en: "I need a haircut.", phonetic: '/aɪ niːd ə ˈheəkʌt/', cn: `我要理发。`, example: `Say this at the salon.` },
      { en: "The Wi-Fi is not working.", phonetic: '/ðə ˈwaɪfaɪ ɪz nɒt ˈwɜːkɪŋ/', cn: `WiFi 用不了。`, example: `Tell the host.` },
      { en: "Could you help me with my luggage?", phonetic: '/kʊd ju help mi wɪð maɪ ˈlʌɡɪdʒ/', cn: `能帮我拿行李吗？`, example: `Say this at the station.` },
      { en: "I'd like to extend my visa.", phonetic: '/aɪd laɪk tə ɪkˈstend maɪ ˈviːzə/', cn: `我想续签签证。`, example: `Say this at immigration.` },
      { en: "Where is the police station?", phonetic: '/weər ɪz ðə pəˈliːs ˈsteɪʃn/', cn: `警察局在哪？`, example: `Report a crime.` },
      { en: "I lost my wallet.", phonetic: '/aɪ lɒst maɪ ˈwɒlɪt/', cn: `我钱包丢了。`, example: `Tell the police.` },
      { en: "Could you recommend a good restaurant?", phonetic: '/kʊd ju ˌrekəˈmend ə ɡʊd ˈrestrɒnt/', cn: `能推荐家好餐馆吗？`, example: `Ask the locals.` },
      { en: "Is the tap water safe to drink?", phonetic: '/ɪz ðə tæp ˈwɔːtə seɪf tə drɪŋk/', cn: `自来水能喝吗？`, example: `Ask about safety.` },
      { en: "Where can I buy a power adapter?", phonetic: '/weər kæn aɪ baɪ ə ˈpaʊə əˈdæptə/', cn: `我在哪买转换插头？`, example: `Find electronics.` },
      { en: "I need a trash bag.", phonetic: '/aɪ niːd ə træʃ bæɡ/', cn: `我需要个垃圾袋。`, example: `Say this at the store.` },
      { en: "How do I sort the recycling?", phonetic: '/haʊ duː aɪ sɔːt ðə riːˈsaɪklɪŋ/', cn: `垃圾怎么分类？`, example: `Ask the neighbor.` },
      { en: "Where is the emergency exit?", phonetic: '/weər ɪz ðə ɪˈmɜːdʒənsi ˈeksɪt/', cn: `紧急出口在哪？`, example: `Note your safety.` }
    ]
  },
  {
    id: 'sentences', name: '实用口语句型', icon: 'fa-quote-right', desc: '万能口语句型与交际套路：请求/同意/礼貌/澄清/表达观点，搭子任何场景都能用 句型 口语 套路 万能句 出国',
    words: [
      { en: "Could you please...?", phonetic: '/kʊd ju pliːz/', cn: `你能……吗？`, example: `"Could you please open the window?" is polite.` },
      { en: "Would you mind...?", phonetic: '/wʊd ju maɪnd/', cn: `你介意……吗？`, example: `"Would you mind closing the door?" is polite.` },
      { en: "I'd like to...", phonetic: '/aɪd laɪk tə/', cn: `我想……`, example: `"I'd like to book a room." states a want.` },
      { en: "I was wondering if...", phonetic: '/aɪ wɒz ˈwʌndərɪŋ ɪf/', cn: `我想知道是否……`, example: `A soft way to ask.` },
      { en: "Could you tell me...?", phonetic: '/kʊd ju tel mi/', cn: `你能告诉我……吗？`, example: `"Could you tell me the time?" asks.` },
      { en: "How do I get to...?", phonetic: '/haʊ duː aɪ ɡet tə/', cn: `我怎么去……？`, example: `Ask for directions.` },
      { en: "Is it possible to...?", phonetic: '/ɪz ɪt ˈpɒsəbl tə/', cn: `……有可能吗？`, example: `Check if something can be done.` },
      { en: "I'm interested in...", phonetic: '/aɪm ˈɪntrəstɪd ɪn/', cn: `我对……感兴趣。`, example: `"I'm interested in art." shares a hobby.` },
      { en: "What's the difference between...?", phonetic: '/wɒts ðə ˈdɪfrəns bɪˈtwiːn/', cn: `……和……有什么区别？`, example: `Ask to compare two things.` },
      { en: "Can I have...?", phonetic: '/kæn aɪ hæv/', cn: `能给我……吗？`, example: `"Can I have some water?" requests.` },
      { en: "Do you happen to know...?", phonetic: '/duː ju ˈhæpən tə nəʊ/', cn: `你知道……吗？`, example: `A soft way to ask.` },
      { en: "I'm afraid that...", phonetic: '/aɪm əˈfreɪd ðæt/', cn: `恐怕……`, example: `"I'm afraid that I'm late." gives bad news.` },
      { en: "I'd rather...", phonetic: '/aɪd ˈrɑːðə/', cn: `我宁愿……`, example: `"I'd rather walk." shows a preference.` },
      { en: "I'm used to...", phonetic: '/aɪm juːst tə/', cn: `我习惯……`, example: `"I'm used to the cold." shares a habit.` },
      { en: "It's a good idea to...", phonetic: '/ɪts ə ɡʊd aɪˈdɪə tə/', cn: `……是个好主意。`, example: `Give advice this way.` },
      { en: "You'd better...", phonetic: '/juːd ˈbetə/', cn: `你最好……`, example: `"You'd better hurry." warns someone.` },
      { en: "Let me know if...", phonetic: '/let mi nəʊ ɪf/', cn: `如果……告诉我。`, example: `"Let me know if you need help." offers.` },
      { en: "I'm looking forward to...", phonetic: '/aɪm ˈlʊkɪŋ ˈfɔːwəd tə/', cn: `我期待……`, example: `"I'm looking forward to it." shows eagerness.` },
      { en: "What do you mean by...?", phonetic: '/wɒt duː ju miːn baɪ/', cn: `你说的……是什么意思？`, example: `Ask to clarify.` },
      { en: "How about...?", phonetic: '/haʊ əˈbaʊt/', cn: `……怎么样？`, example: `"How about a coffee?" suggests.` },
      { en: "Why don't we...?", phonetic: '/waɪ dəʊnt wi/', cn: `我们为什么不……？`, example: `"Why don't we go now?" proposes.` },
      { en: "I suggest that...", phonetic: '/aɪ səˈdʒest ðæt/', cn: `我建议……`, example: `Offer a plan this way.` },
      { en: "It's very kind of you to...", phonetic: '/ɪts ˈveri kaɪnd əv ju tə/', cn: `你……真是太好了。`, example: `Thank someone warmly.` },
      { en: "I appreciate your...", phonetic: '/aɪ əˈpriːʃieɪt jɔː/', cn: `我很感激你的……`, example: `"I appreciate your help." says thanks.` },
      { en: "May I ask...?", phonetic: '/meɪ aɪ ɑːsk/', cn: `我能问……吗？`, example: `"May I ask your name?" is polite.` },
      { en: "Could you repeat that?", phonetic: '/kʊd ju rɪˈpiːt ðæt/', cn: `能重复一遍吗？`, example: `Ask again to hear.` },
      { en: "I didn't catch that.", phonetic: '/aɪ ˈdɪdnt kætʃ ðæt/', cn: `我没听清。`, example: `Admit you missed it.` },
      { en: "That makes sense.", phonetic: '/ðæt meɪks sens/', cn: `有道理。`, example: `Agree with the logic.` },
      { en: "I see what you mean.", phonetic: '/aɪ siː wɒt ju miːn/', cn: `我明白你的意思。`, example: `Show understanding.` },
      { en: "To be honest, ...", phonetic: '/tə bi ˈɒnɪst/', cn: `说实话，……`, example: `Share a frank view.` },
      { en: "As far as I know, ...", phonetic: '/æz fɑːr əz aɪ nəʊ/', cn: `据我所知，……`, example: `Give limited information.` },
      { en: "In my opinion, ...", phonetic: '/ɪn maɪ əˈpɪnjən/', cn: `在我看来，……`, example: `State your view.` },
      { en: "It depends on...", phonetic: '/ɪt dɪˈpendz ɒn/', cn: `这取决于……`, example: `Give a conditional answer.` },
      { en: "There's no doubt that...", phonetic: '/ðeəz nəʊ daʊt ðæt/', cn: `毫无疑问……`, example: `State certainty.` },
      { en: "I'm not sure, but...", phonetic: '/aɪm nɒt ʃʊə bʌt/', cn: `我不确定，但是……`, example: `Guess carefully.` },
      { en: "The point is...", phonetic: '/ðə pɔɪnt ɪz/', cn: `关键是……`, example: `Emphasize the core.` },
      { en: "What I mean is...", phonetic: '/wɒt aɪ miːn ɪz/', cn: `我的意思是……`, example: `Rephrase yourself.` },
      { en: "Let's put it this way.", phonetic: '/lets pʊt ɪt ðɪs weɪ/', cn: `这么说吧。`, example: `Reframe the idea.` },
      { en: "Long story short, ...", phonetic: '/lɒŋ ˈstɔːri ʃɔːt/', cn: `长话短说，……`, example: `Summarize quickly.` },
      { en: "Just to be clear, ...", phonetic: '/dʒʌst tə bi klɪə/', cn: `说清楚一点，……`, example: `Avoid a misunderstanding.` },
      { en: "I'm with you on that.", phonetic: '/aɪm wɪð ju ɒn ðæt/', cn: `这点我同意你。`, example: `Show agreement.` },
      { en: "That's exactly what I think.", phonetic: '/ðæts ɪɡˈzæktli wɒt aɪ θɪŋk/', cn: `这正是我想的。`, example: `Strong agreement.` },
      { en: "I couldn't agree more.", phonetic: '/aɪ ˈkʊdnt əˈɡriː mɔː/', cn: `我完全同意。`, example: `Strong agreement.` },
      { en: "That's a relief.", phonetic: '/ðæts ə rɪˈliːf/', cn: `那就放心了。`, example: `Express relief.` },
      { en: "I'll keep that in mind.", phonetic: '/aɪl kiːp ðæt ɪn maɪnd/', cn: `我会记在心里。`, example: `Promise to remember.` }
    ]
  }
];

