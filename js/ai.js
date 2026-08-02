/* ============================================================
   马雯工作台 · AI 学习部
   目标：长期系统学习 AI —— 以「系统课程」为主线（入门→进阶→深入→拓展），
        辅以本周更新 / AI视频 / AI漫剧 / 原理 / 名词 / 主流软件 等参考卡片。
        每周一自动化刷新行业趋势。
   说明：工具链接统一指向官网（电脑浏览器 + 手机均可打开）。
   ============================================================ */

/* ---------- 数据池（每周自动化会刷新带 *_UPDATED 的数据） ---------- */

// 本周更新 inbox：每周一自动化重研趋势后刷新，5~10 条
const AI_WEEKLY = [
  { id: 'w-trend-1', tag: '趋势', t: '中国开源模型下载量全球第一（41%）', why: 'DeepSeek / Kimi K3 / 通义持续降价，国产模型平权，个人学习成本极低。', kw: '开源大模型 2026' },
  { id: 'w-tool-1',  tag: '工具', t: '可灵 AI 降价至约 0.34 元/秒，性价比国产第一', why: '做 AI 视频首选入门，免费 66 积分/日基本够日用。', kw: '可灵AI' },
  { id: 'w-video-1', tag: '视频', t: '即梦 AI Seedance 2.0：音画同步 + 角色一致', why: '与剪映/抖音深度联动，是 AI 漫剧口型对齐的利器。', kw: '即梦AI Seedance' },
  { id: 'w-man-1',   tag: '漫剧', t: '纳米漫剧：工业级 AI 漫剧，单集 30 分钟出片', why: '想量产漫剧可了解这条“角色/场景/资产三记忆”流水线。', kw: 'AI漫剧 流水线' },
  { id: 'w-prin-1',  tag: '原理', t: 'Diffusion 扩散模型：文生图/视频的底层', why: '搞懂它，才真正理解 AI 为什么能“画”出来。', kw: '扩散模型 原理' },
  { id: 'w-tool-2',  tag: '工具', t: 'ComfyUI + Flux + IP-Adapter 锁角色', why: '做长期连载 AI 漫剧必备，避免多镜“变脸”。', kw: 'ComfyUI 角色一致性' },
  { id: 'w-trend-2', tag: '趋势', t: '2026 = Agent 商用元年：AI 从聊天到“干活”', why: 'OpenClaw“龙虾”引爆，值得关注智能体新玩法。', kw: 'AI Agent 2026' },
  { id: 'w-video-2', tag: '视频', t: 'Runway Gen-4 运动笔刷 = 电影级运镜', why: '追求极致画质可一试（需网络环境 + 付费）。', kw: 'Runway Gen-4' }
];
const AI_WEEKLY_UPDATED = '2026-08-02';

// AI 视频工具（参考）
const AI_VIDEO_TOOLS = [
  { name: '可灵 AI', url: 'https://klingai.com', free: '免费66积分/日', strength: '长视频2~3分钟/30fps，人物动作稳定，性价比高(约0.34元/秒)', scene: '自媒体短视频 / 小型广告' },
  { name: '即梦 AI', url: 'https://jimeng.jianying.com', free: '免费60积分/日', strength: '中文理解强，与剪映/抖音联动，角色一致+口型同步', scene: '知识分享 / 生活记录 / 抖音' },
  { name: '海螺 AI', url: 'https://hailuoai.video', free: '免费额度大方', strength: '微表情最强(人脸还原96.5%)，赛博朋克/国风出彩', scene: '创意动画 / 风格化' },
  { name: 'Vidu', url: 'https://vidu.com', free: '免费10次/日', strength: '“参考生”角色一致86.2，国风稳，音视频同出', scene: '漫剧 / 动画' },
  { name: 'Runway Gen-4', url: 'https://runwayml.com', free: '一次性125积分', strength: '电影级画质，运动笔刷独一份', scene: '专业影视(需网络/付费)' },
  { name: 'Pika', url: 'https://pika.art', free: '有限免费', strength: '生成最快，模板多，易上手', scene: '新手 / 快速出片' },
  { name: 'PixVerse V6', url: 'https://pixverse.ai', free: '有限免费', strength: '一站式工作空间，转场/延展/原生音频', scene: '综合视频创作' },
  { name: '千问 Wan2.5', url: 'https://tongyi.aliyun.com', free: '完全免费', strength: '音视频同步输出', scene: '通用 / 零成本' },
  { name: 'Google Veo', url: 'https://deepmind.google', free: '有限免费', strength: '4K / 60秒长视频', scene: '海外 / 高画质' },
  { name: '通义万相 / 万镜一刻', url: 'https://tongyi.aliyun.com', free: '按量', strength: '短剧全链路工业化，压缩制作周期', scene: 'B 端 / 团队量产' }
];

// AI 漫剧 / 漫画 工作流（参考）
const AI_MANHUA_FLOW = [
  { step: '① 剧本 & 分镜', desc: '用 AI 写故事+分镜脚本（景别+画面+台词+镜头运动）。提示词：写3分钟漫剧分镜，古风逆袭，每镜含景别/画面/台词/镜头。', tools: ['豆包', 'DeepSeek', '通义千问', '漫剧工场'] },
  { step: '② 静态插画', desc: '生成角色+分镜图。关键是“角色一致性”：用参考图/锁角色，避免多镜变脸。', tools: ['即梦 AI', 'Midjourney', 'ComfyUI+Flux', '海艺', '漫小芽'] },
  { step: '③ 图生视频', desc: '让分镜动起来。单段 3~10 秒防动作崩坏，运镜用推拉摇移提升质感。', tools: ['可灵', '即梦(Seedance)', 'Runway', 'Pika', '纳米漫剧'] },
  { step: '④ 配音 & 音效', desc: '为每个角色建声线档案，剧本标注情绪。剪映/讯飞免费够用，出海用 ElevenLabs。', tools: ['剪映AI配音', '讯飞配音', 'ElevenLabs', 'Qwen-TTS'] },
  { step: '⑤ 剪辑合成', desc: '片段拼接+音画对齐+自动字幕+BGM，9:16 竖屏导出，一键分发抖音/快手/视频号。', tools: ['剪映', '来画', 'PR', '纳米漫剧流水线'] }
];

// AI 底层原理（参考）
const AI_PRINCIPLES = [
  { t: 'Transformer & 注意力机制', d: '现代 AI 的“底座”架构。self-attention 让模型在处理每个词时，自动关注输入中最相关的部分。几乎全部大模型都基于它。' },
  { t: '神经网络 & 深度学习', d: '受生物神经元启发的多层网络，通过海量数据“训练”不断调整参数来学习规律——这就是“学习”的本质。' },
  { t: '大语言模型 LLM', d: '用海量文本训练、预测“下一个词(token)”的模型。它的理解与生成，靠的是“概率 + 上下文”，不是真的“读懂”。' },
  { t: '扩散模型 Diffusion', d: '图像/视频生成的核心：先给图加噪，再训练模型“去噪”还原，逐步生成清晰画面。Stable Diffusion、可灵、即梦的底层都靠它。' },
  { t: '预训练 / 微调 / LoRA', d: '预训练=通识功底；微调=针对具体任务再训练；LoRA=极轻量的微调，常用于 AI 漫剧锁定“角色一致性”，避免变脸。' },
  { t: '多模态 & Agent', d: '多模态=图文音视频统一理解与生成；Agent=能自己拆解任务、调用工具“动手干活”的 AI——2026 被称为 Agent 商用元年。' }
];

// AI 名词术语表（参考）
const AI_TERMS = [
  { term: 'Token / 词元', def: 'AI 处理文本的最小单位。计费、上下文长度都按 token 算（中文约 1~2 字=1 token）。' },
  { term: 'Prompt / 提示词', def: '你给 AI 的指令。写好 prompt（角色+任务+格式+约束）是核心技能。' },
  { term: 'Embedding / 词嵌入', def: '把文字变成向量数字，让 AI 能“理解”词语之间的语义关系。' },
  { term: 'LLM / 大语言模型', def: 'Large Language Model，大型语言模型的统称，如 GPT、DeepSeek、通义。' },
  { term: '幻觉 Hallucination', def: 'AI 一本正经地编造错误信息。关键结论要交叉验证，别全信。' },
  { term: 'RAG / 检索增强', def: '让 AI 先查资料再回答，减少幻觉、接入你的私有知识库。' },
  { term: 'Agent / 智能体', def: '能自主规划+调用工具完成任务的 AI（2026 最大热点），如 OpenClaw“龙虾”。' },
  { term: 'MoE / 混合专家', def: 'Mixture of Experts：大模型只激活少量“专家”参数，兼顾强推理与低成本。' },
  { term: 'LoRA', def: '一种轻量微调技术，常用于 AI 漫剧锁定角色形象，避免“变脸”。' },
  { term: '微调 Fine-tuning', def: '在预训练模型基础上，针对某项任务做专项再训练。' },
  { term: '多模态 Multimodal', def: '模型能同时处理文字、图片、音频、视频，并统一理解/生成。' },
  { term: '上下文窗口 Context', def: '模型一次“能看到”的最大文本量，如百万 token（约几本小说）。' },
  { term: '开源权重 Open Weights', def: '模型参数公开、可下载自部署（如 DeepSeek、通义 Qwen、Kimi）。' },
  { term: '端侧模型 On-device', def: '直接在手机/本地设备运行的轻量模型，不上云、保护隐私。' },
  { term: '扩散模型 Diffusion', def: '文生图/视频的基础：通过“加噪→去噪”逐步生成画面。' },
  { term: 'AGI', def: '通用人工智能——能像人一样胜任任何智力任务的 AI，目前仍是目标。' }
];

// 主流 AI 软件（按场景分类，参考）
const AI_SOFTWARE = [
  { cat: '💬 对话 / 大模型', items: [
    { name: 'ChatGPT', url: 'https://chatgpt.com', note: 'GPT-5 系列，全球标杆' },
    { name: 'Claude', url: 'https://claude.ai', note: '4 Opus，长文/代码强' },
    { name: 'Gemini', url: 'https://gemini.google.com', note: '3 Ultra，多模态+谷歌生态' },
    { name: 'DeepSeek', url: 'https://chat.deepseek.com', note: 'R1/V4，免费+推理强' },
    { name: '豆包', url: 'https://doubao.com', note: '5.0，中文/抖音生态' },
    { name: 'Kimi', url: 'https://kimi.com', note: 'K2.5/K3，长文本神器' },
    { name: '通义千问', url: 'https://tongyi.aliyun.com', note: '3.5 Max，阿里生态' },
    { name: '文心一言', url: 'https://yiyan.baidu.com', note: '5.0，百度生态' },
    { name: '腾讯元宝', url: 'https://yuanbao.tencent.com', note: '微信生态' },
    { name: '智谱清言', url: 'https://chatglm.cn', note: 'GLM 系列' },
    { name: 'Grok', url: 'https://grok.com', note: '实时抓 X 信息' },
    { name: 'Perplexity', url: 'https://perplexity.ai', note: '带引用的 AI 搜索' }
  ] },
  { cat: '🎨 AI 绘画', items: [
    { name: 'Midjourney V7', url: 'https://midjourney.com', note: '艺术质感公认第一' },
    { name: '即梦 AI', url: 'https://jimeng.jianying.com', note: '中文友好，操作简单' },
    { name: '可灵(图)', url: 'https://klingai.com', note: '人像/国风强' },
    { name: 'Stable Diffusion', url: 'https://stability.ai', note: '开源可本地部署' },
    { name: 'Adobe Firefly', url: 'https://firefly.adobe.com', note: '嵌 PS/AI，版权干净' },
    { name: '海艺 AI', url: 'https://civitai.com', note: '动画风格出色' },
    { name: 'Canva AI', url: 'https://canva.com', note: '模板多，营销人首选' },
    { name: 'DALL·E 4', url: 'https://openai.com/dall-e', note: '含在 ChatGPT 内' }
  ] },
  { cat: '🎬 AI 视频', items: [
    { name: '可灵 AI', url: 'https://klingai.com', note: '长视频+免费慷慨' },
    { name: '即梦(Seedance)', url: 'https://jimeng.jianying.com', note: '角色一致+口型同步' },
    { name: '海螺 AI', url: 'https://hailuoai.video', note: '微表情最强' },
    { name: 'Vidu', url: 'https://vidu.com', note: '动画/国风稳' },
    { name: 'Runway', url: 'https://runwayml.com', note: '电影级(需网络)' },
    { name: 'Pika', url: 'https://pika.art', note: '易用快速' },
    { name: 'PixVerse', url: 'https://pixverse.ai', note: '一站式工作空间' },
    { name: '千问 Wan2.5', url: 'https://tongyi.aliyun.com', note: '完全免费' },
    { name: 'Veo', url: 'https://deepmind.google', note: '4K/60秒' },
    { name: '通义万相', url: 'https://tongyi.aliyun.com', note: '短剧工业化' }
  ] },
  { cat: '💻 AI 编程', items: [
    { name: 'Cursor', url: 'https://cursor.com', note: '理解整个项目，程序员新宠' },
    { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', note: '嵌 IDE，老牌稳定' },
    { name: 'Trae', url: 'https://trae.com', note: '字节出品，国内可直连免费' }
  ] },
  { cat: '📝 AI 办公', items: [
    { name: 'Microsoft Copilot', url: 'https://microsoft.com/copilot', note: '嵌 Office 全家桶' },
    { name: 'WPS AI', url: 'https://wps.cn', note: '深度嵌 WPS' },
    { name: '腾讯文档 AI', url: 'https://docs.qq.com', note: '文档协作+AI' },
    { name: '飞书 AI', url: 'https://feishu.cn', note: '企业用户首选' },
    { name: 'Notion AI', url: 'https://notion.so', note: '笔记+AI' },
    { name: 'AIPPT', url: 'https://aippt.com', note: '主题生成 PPT' }
  ] },
  { cat: '🎵 数字人 / 音乐', items: [
    { name: 'HeyGen', url: 'https://heygen.com', note: '数字人视频' },
    { name: '腾讯智影', url: 'https://zenvideo.qq.com', note: '数字人/剪辑' },
    { name: 'Suno v4', url: 'https://suno.com', note: 'AI 写歌' },
    { name: 'ElevenLabs', url: 'https://elevenlabs.io', note: '顶级 AI 配音' }
  ] },
  { cat: '🦞 AI Agent / 漫剧专用', items: [
    { name: 'OpenClaw（龙虾）', url: 'https://openclaw.ai', note: '能“动手”的桌面智能体' },
    { name: 'OpenAI Operator', url: 'https://openai.com', note: '自动操作浏览器' },
    { name: 'AutoGLM', url: 'https://zhipuai.cn', note: '智谱手机智能体' },
    { name: '纳米漫剧', url: 'https://nano-manju.com', note: '工业级 AI 漫剧流水线' }
  ] }
];

// 资源资讯：最新行业视频 / 博主解读 / 文档 / 文章推送（每周一自动化刷新）
// 视频 / 博主：plat + kw 生成站内搜索链接（保证能打开、永远有最新内容）
// 文档 / 文章：url 直达官网
const AI_RESOURCES = [
  // —— 视频：最新行业视频 ——
  { id: 'rv-1', type: '视频', title: '2026 国产 AI 视频工具横评（可灵/即梦/海螺/千问）', source: 'B站·行业盘点', topic: 'AI视频工具选型', why: '一张图看懂今年做视频该用哪个、谁免费额度最慷慨，省得挨个试。', plat: 'bili', kw: '2026 AI视频工具横评 可灵 即梦 海螺' },
  { id: 'rv-2', type: '视频', title: 'Sora 关停后，2026 视频生成格局到底变了什么', source: 'B站·科普', topic: '行业格局', why: '搞懂为何国产可灵/即梦崛起，帮你判断该押注哪条技术线。', plat: 'bili', kw: 'Sora 关停 2026 视频生成 格局 国产' },
  { id: 'rv-3', type: '视频', title: '纳米漫剧工业级流水线实拍拆解（单集30分钟出片）', source: 'B站·漫剧', topic: 'AI漫剧工业化', why: '想量产漫剧必看：角色/场景/资产“三记忆”怎么搭。', plat: 'bili', kw: '纳米漫剧 工业级 AI漫剧 流水线 拆解' },
  { id: 'rv-4', type: '视频', title: 'Google I/O / OpenAI DevDay 2026 重点回顾', source: 'YouTube·官方', topic: '年度技术发布', why: '把握大厂年度方向：多模态、Agent、端侧模型新动向。', plat: 'youtube', kw: 'Google IO 2026 AI OpenAI DevDay highlights' },
  { id: 'rv-5', type: '视频', title: '2026 AI Agent 实战盘点（龙虾/千问/AutoGLM）', source: 'B站·Agent', topic: '智能体落地', why: 'Agent 商用元年，看别人怎么把 AI 从“聊天”变成“干活”。', plat: 'bili', kw: '2026 AI Agent 实战 盘点 智能体 龙虾' },

  // —— 博主：视频解读 / 讲解 ——
  { id: 'rb-1', type: '博主', title: '李宏毅 机器学习 / 深度学习（台大，零基础友好）', source: '李宏毅', topic: 'ML/DL 原理', why: '把梯度下降、注意力、Transformer 讲成人话，建立“技术直觉”。', plat: 'bili', kw: '李宏毅 机器学习 深度学习' },
  { id: 'rb-2', type: '博主', title: '李沐 动手学深度学习（Amazon 首席科学家，带代码）', source: '李沐', topic: 'DL 实战', why: '从听懂到会做的关键一步，每节带 PyTorch 代码，跟着敲就跑通。', plat: 'bili', kw: '李沐 动手学深度学习' },
  { id: 'rb-3', type: '博主', title: 'Andrej Karpathy：Neural Networks Zero to Hero', source: 'Karpathy', topic: '从零手写 GPT', why: 'OpenAI 创始成员，把大模型底层机制掰开揉碎，想吃透 AI 必看。', plat: 'youtube', kw: 'Karpathy Neural Networks Zero to Hero' },
  { id: 'rb-4', type: '博主', title: '3Blue1Brown：神经网络可视化讲解', source: '3Blue1Brown', topic: '直觉理解', why: '最直观的动画讲清神经网络/梯度下降，看一遍胜过读十篇。', plat: 'youtube', kw: '3Blue1Brown neural networks' },
  { id: 'rb-5', type: '博主', title: '同济子豪兄：中文实战向 AI 教程', source: '同济子豪兄', topic: 'CV/论文复现', why: '中文、代码全、跟得上最新论文，适合想动手做项目的人。', plat: 'bili', kw: '同济子豪兄 深度学习 实战' },
  { id: 'rb-6', type: '博主', title: 'Dwarkesh Patel：对话 AI 顶级大佬的深度访谈', source: 'Dwarkesh Patel', topic: '前沿思想', why: '听 Sam Altman 等亲述方向，建立对“下一步”的判断力。', plat: 'youtube', kw: 'Dwarkesh Patel AI interview' },

  // —— 文档：文件 / 教程 ——
  { id: 'rd-1', type: '文档', title: 'OpenAI Cookbook（官方代码范例）', source: 'OpenAI', topic: 'RAG/Agent/微调实战', why: '从“会调 API”到“能搭应用”：RAG、函数调用、微调都有可跑代码。', url: 'https://cookbook.openai.com' },
  { id: 'rd-2', type: '文档', title: 'Hugging Face 课程 & 文档', source: 'Hugging Face', topic: '开源模型/扩散/RLHF', why: '“AI 界的 GitHub”，NLP/扩散/强化学习课程 + 海量模型卡。', url: 'https://huggingface.co/learn' },
  { id: 'rd-3', type: '文档', title: 'ComfyUI Wiki（中文系统教程）', source: 'ComfyUI', topic: '可视化工作流/锁角色', why: '做 AI 漫剧锁“角色一致性”的核心工具，官方中文百科从入门到高级。', url: 'https://www.comfyui-wiki.com' },
  { id: 'rd-4', type: '文档', title: 'Anthropic Prompt 工程指南', source: 'Anthropic', topic: '写好提示词', why: '讲清“清晰+具体+角色”的通用写法，换哪个模型都适用。', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering' },

  // —— 文章：相关文章推送 / 资讯源 ——
  { id: 'ra-1', type: '文章', title: 'The Batch（Andrew Ng 每周 AI 信）', source: 'DeepLearning.AI', topic: '每周研究+新闻', why: '最有阅读的 AI newsletter，吴恩达亲自写“主编来信”，去噪不跟风。', url: 'https://www.deeplearning.ai/the-batch/' },
  { id: 'ra-2', type: '文章', title: 'Import AI（Jack Clark，研究+政策）', source: 'Import AI', topic: '研究/治理/算力', why: '2016 年至今最长寿的 AI 通讯，看清研究界到底在忙什么。', url: 'https://importai.substack.com' },
  { id: 'ra-3', type: '文章', title: 'Ben\'s Bites（AI 产品/创业日报）', source: 'Ben\'s Bites', topic: '产品/创业动态', why: 'builder 必看：每周新发布的 AI 产品、demo、小工具抢先看。', url: 'https://bensbites.com' },
  { id: 'ra-4', type: '文章', title: 'TLDR AI（开发者每日速览）', source: 'TLDR', topic: '论文/仓库/工程', why: '头条+两句话+直链，最快扫完当天技术信号，适合工程师。', url: 'https://tldr.tech/ai' },
  { id: 'ra-5', type: '文章', title: '量子位 / 机器之心（中文 AI 媒体）', source: '量子位', topic: '中文前沿快讯', why: '跟进最快的中文 AI 媒体，发布/融资/论文中文第一时间翻译解读。', url: 'https://www.qbitai.com' }
];
const AI_RESOURCES_UPDATED = '2026-08-02';

/* ============================================================
   系统课程（主线）：入门 → 进阶 → 深入 → 拓展
   每个阶段：明确学习目标 + 分步实操（每步含 动作/原理/工具/为什么用这工具/工具成因）
            + 作业（任务 + 成果）。所有进度本地保存。
   ============================================================ */
const AI_COURSE = [
  {
    id: 's1', level: '入门', levelKey: 'start',
    title: '用对话 AI 写出你的第一个动物角色与剧本',
    goal: '学会把模糊的想法，变成 AI 能懂、还能拍成片的结构化设定与脚本。',
    kind: 'steps',
    steps: [
      {
        n: 1,
        do: '注册并打开一个免费中文对话 AI（豆包 / DeepSeek / 通义千问网页版），完成首次对话。',
        principle: '大语言模型本质是“基于海量文本训练、预测下一个最合理词”的概率模型；你给的提示词（Prompt）就是它的“任务说明书”。',
        tool: '豆包 / DeepSeek / 通义千问（网页版，均免费）',
        why: '中文理解好、免费、无需翻墙；先练“把想法说清楚”这项最核心能力，比直接画图更省成本、更可控。',
        origin: '2022.11 ChatGPT 引爆全球；2023 起国产大模型为“中文免费可用”刚需快速涌现，到 2025 中国开源模型下载量已全球第一（41%）——所以今天普通人零门槛就能用上。'
      },
      {
        n: 2,
        do: '用 Prompt 写一份“动物人物”设定：名字 / 性格 / 外貌 / 口头禅 / 世界观。',
        principle: '模型对“结构化、带约束”的指令遵循度更高——角色一致性来自你给的明确锚点（越具体越不乱跑）。',
        tool: '同一个对话 AI',
        why: '这一步产出的“角色卡”是后面画图、写剧本、做视频的“总蓝图”，必须先定，否则后续每一步都会跑偏。',
        origin: 'Prompt 工程随 ChatGPT 普及成为独立技能；“角色卡 / 人设模板”是创作者社区沉淀下来的最佳实践，专门解决“AI 瞎编人设”的痛点。'
      },
      {
        n: 3,
        do: '让 AI 把这个角色写进一个 30 秒漫剧脚本（3 个镜头：开场/冲突/反转）。',
        principle: '分镜 = 把故事拆成“画面 + 台词 + 镜头运动”；模型在给定角色后，擅长做这种结构化扩写。',
        tool: '对话 AI',
        why: '脚本是后续所有环节（画图、视频、配音、剪辑）的“施工图纸”，没它寸步难行。',
        origin: 'AI 辅助编剧 2024 起在短剧公司规模化落地，分镜脚本模板因此标准化、可复用。'
      }
    ],
    homework: {
      task: '产出一份「会说话的动物角色卡 + 30 秒 3 镜头脚本」：角色名、性格、外貌、口头禅、世界观，外加每镜的画面与台词。',
      outcome: '你能独立用 AI 把一个灵感，变成可执行的创作蓝图——这是入行的第一步。'
    }
  },
  {
    id: 's2', level: '进阶', levelKey: 'mid',
    title: '用 AI 绘画生成角色立绘（动物人物形象）',
    goal: '把文字角色卡，变成一张风格统一、可复用的角色图（后续视频/漫剧的“脸”）。',
    kind: 'steps',
    steps: [
      {
        n: 1,
        do: '选绘图 AI（即梦 / Midjourney / 通义万相），把角色卡翻译成“画面提示词”（风格+主体+动作+光线）。',
        principle: '文生图模型（扩散模型）从噪声起步，逐步“去噪”逼近文本描述的图像；提示词 = 去噪的方向盘。',
        tool: '即梦（字节）/ Midjourney / 通义万相',
        why: '即梦对中文和最火的“动物拟人”风格支持好、免费额度友好，适合入门；Midjourney 质感更电影感但需付费订阅。',
        origin: '2022 Stable Diffusion 开源让文生图平民化；2023 Midjourney 出圈；2024 起国产即梦/豆包图生图因“中文+免费”占领大众市场。'
      },
      {
        n: 2,
        do: '固定角色“种子 / 参考图”，生成多张挑优，锁定同一张脸。',
        principle: '通过固定随机种子或上传参考图，约束模型输出接近同一张脸——这是“角色一致性”的雏形。',
        tool: '绘图 AI 的“垫图 / seed / 参考图”功能',
        why: '漫剧/连载必须角色每集长得一样，一致性是商业底线，否则观众出戏。',
        origin: '角色一致性是文生图最大痛点，直接催生了“垫图→图生图→IP-Adapter→LoRA”一整条技术线（详见阶段 4 / 原理）。'
      },
      {
        n: 3,
        do: '导出一张“角色设定立绘”（正面全身 + 表情特写），作为后续锚点图。',
        principle: '一张清晰立绘 = 后续锁角色 / 转视频的“锚点”，所有镜头都从它衍生。',
        tool: '绘图 AI 导出（png，去背景更佳）',
        why: '后面图生视频、ComfyUI 锁角色都要吃这张图，现在定好能省大量返工。',
        origin: '工业漫剧流程把“角色立绘定稿”定为标准环节，正是为了后续批量生产不跑偏。'
      }
    ],
    homework: {
      task: '用 AI 画出你的动物角色立绘 1 张（正面全身 + 表情），并附一句话说明你选的画风与提示词要点。',
      outcome: '你拥有了可复用的角色视觉资产——从“看不见”到“有形象”。'
    }
  },
  {
    id: 's3', level: '进阶', levelKey: 'mid',
    title: '图生视频让角色动起来',
    goal: '把静态立绘变成会动、会说话的 5~10 秒片段，迈出漫剧第一步。',
    kind: 'steps',
    steps: [
      {
        n: 1,
        do: '选视频 AI（可灵 / 即梦 / 海螺），上传上一步的立绘 + 写运动提示词。',
        principle: '图生视频模型在“首帧受约束”下，用扩散 + 光流预测后续帧，生成连贯动作。',
        tool: '可灵（快手）/ 即梦（字节）/ 海螺（MiniMax）',
        why: '可灵画质与时长国内领先、免费额度慷慨；即梦能直接吃你上一步的图、联动剪映最顺。',
        origin: '2024 Sora 展示惊艳但未开放；国产可灵/即梦 2024–2025 抢先免费开放，奠定国内视频生成第一梯队。'
      },
      {
        n: 2,
        do: '写“运镜 + 动作”提示词（如：镜头推近，猫咪歪头，尾巴轻摆）。',
        principle: '运动描述越具体，模型动作越可控——这是“视频版 Prompt 工程”。',
        tool: '视频 AI 的提示词框',
        why: '可控运镜让片段能剪进故事，而非随机炫技，观感立刻专业一档。',
        origin: '视频生成从“一句话生成”进化到“首尾帧 + 运镜 + 镜头语言”精细控制，是 2025 的关键迭代。'
      },
      {
        n: 3,
        do: '生成多段，按“动作稳、不变形、像角色”挑选可用片段。',
        principle: '当前模型单次生成有限且不稳定，靠“多生成 + 人工挑选”补足质量（类似赛马思路）。',
        tool: '视频 AI + 你的审美',
        why: '人审是质量的最后一道关，机器目前还替不了这道判断。',
        origin: 'AIGC 生产普遍采用“批量生成 + 人工精选”工作流，效率与质量兼得。'
      }
    ],
    homework: {
      task: '生成 1 段 5~10 秒的角色动态片段，说明你用的工具、运镜提示词和为什么选这条片段。',
      outcome: '你的角色“活”了——从一张图变成一个会动的镜头。'
    }
  },
  {
    id: 's4', level: '深入', levelKey: 'deep',
    title: 'AI 漫剧全流程实操（从 0 到 1 分钟成片）',
    goal: '串起 剧本→分镜→锁角色→视频→配音→剪辑，产出一支可发布的漫剧。',
    kind: 'steps',
    steps: [
      {
        n: 1,
        do: '用 ComfyUI + LoRA / FaceID 锁定角色，解决“每帧脸变”。',
        principle: 'LoRA 是“在小数据集上微调的小模型”；FaceID / IP-Adapter 把参考脸编码进生成——二者保证跨镜头一致。',
        tool: 'ComfyUI（开源节点式工作流）+ 角色 LoRA / FaceID 模型',
        why: '商业漫剧必须角色不乱变；ComfyUI 可复用工作流、批量出片，是工业级选择。',
        origin: '角色一致性痛点 → ControlNet(2023) → IP-Adapter → LoRA 生态；ComfyUI 因“可视化复用工作流”成为生产力标配。'
      },
      {
        n: 2,
        do: '按分镜用工作流批量生成镜头（图生视频 + 运镜）。',
        principle: '复用阶段 3 方法，但改用工作流批量跑，把“手工作坊”升级为“流水线”。',
        tool: 'ComfyUI + 可灵 / 即梦 API',
        why: '批量 + 自动化把单集成片时间从“天级”压到“小时级”——纳米漫剧单集 30 分钟出片即此思路。',
        origin: '2025“纳米漫剧”等平台把流程工业化、模板化，让个人也能量产。'
      },
      {
        n: 3,
        do: 'AI 配音 + 对口型（剪映 / 必剪 / HeyGen）。',
        principle: 'TTS 把文本变语音；唇形同步模型让嘴型匹配语音。',
        tool: '剪映（免费、中文配音全）/ HeyGen（数字人唇形强）',
        why: '漫剧需要“说话”，配音对口型是观感关键，观众买不买账看这步。',
        origin: '2023 起 TTS 拟真度飙升，2024 唇形同步开源化，催生数字人 / 漫剧配音平民化。'
      },
      {
        n: 4,
        do: '剪辑合成（剪映 / 必剪）：加字幕、转场、BGM，9:16 竖屏导出。',
        principle: '剪辑 = 把片段按节奏拼成叙事；AI 可自动字幕 / 踩点。',
        tool: '剪映（手机/电脑免费）',
        why: '最终成片观感由剪辑决定，剪映零门槛，人人能上手。',
        origin: '短视频爆发让剪映类工具成为国民级生产力，内置 AI 字幕/配乐直接拉低门槛。'
      }
    ],
    homework: {
      task: '用上述流程做出 1 分钟 AI 漫剧成片（哪怕粗糙）：含角色、3 个以上镜头、配音、字幕，并导出 9:16。',
      outcome: '你走通了“从 0 到成片”的完整闭环，具备做账号 / 接单 / 带货的基础能力。'
    }
  },
  {
    id: 's5', level: '深入', levelKey: 'deep',
    title: '原理进阶：这些工具为什么是这样',
    goal: '不只“会用”，还懂“为什么”，能判断新工具、排错、选路线、不被割。',
    kind: 'steps',
    steps: [
      {
        n: 1,
        do: '搞懂 Transformer & 注意力机制（对话 / 文本的底层）。',
        principle: '注意力让模型处理词时“看上下文权重”，是 LLM 的基础架构（源自 2017 论文《Attention Is All You Need》）。',
        tool: '无（看图解 / 视频，如 3Blue1Brown）',
        why: '懂它你就懂“为什么 Prompt 要具体”“为什么会胡说（幻觉）”——遇到问题能自己排。',
        origin: '2017 Google 提出，取代 RNN，开启大模型时代；今天所有对话 AI 都站在它肩上。'
      },
      {
        n: 2,
        do: '搞懂扩散模型（图像 / 视频的底层）。',
        principle: '从噪声逐步去噪逼近目标图；Stable Diffusion 把它开源平民化（2022）。',
        tool: '无',
        why: '懂它你就懂“为什么要多生成挑选”“为什么角色会漂”——阶段 2/3 的坑一眼看穿。',
        origin: '2020 DDPM 理论 → 2022 SD 开源引爆文生图，可灵/即梦底层同宗。'
      },
      {
        n: 3,
        do: '搞懂 LoRA / 微调 & 多模态 / Agent（进阶与未来）。',
        principle: 'LoRA = 低秩微调，小成本定制风格/角色；多模态 = 图文音视频统一；Agent = 模型自己调用工具完成任务。',
        tool: '无',
        why: '懂这些你就站在“下一批工具”前面，能预测趋势、识别割韭菜话术。',
        origin: 'LoRA(2021) 因省钱成定制标配；2025 被称为 Agent 商用元年，AI 从“聊天”走向“干活”。'
      }
    ],
    homework: {
      task: '用自己话写 3 句话：Transformer / 扩散模型 / LoRA 分别解决了什么问题？存到下方作业框。',
      outcome: '你从“使用者”升级为“理解者”——具备跟进行业、持续学习的能力。'
    }
  },
  {
    id: 's6', level: '拓展', levelKey: 'expand',
    title: 'AI 给生活带来的变化、适用与优劣（建立判断力）',
    goal: '看清 AI 对自身生存技能与行业的影响，建立“用 AI 开阔生存技能”的方法论。',
    kind: 'macro',
    sections: [
      { h: '🌍 AI 给生活带来的变化', items: [
        '创作平民化：人人能拍漫剧 / 做动画 / 出绘本，门槛从“专业团队”降到“一个人 + 一台手机”。',
        '信息获取重构：从“搜关键词”变成“直接对话问”，答案更聚焦。',
        '工作自动化：文案、设计、剪辑、编程大量提效，重复性劳动被接管。',
        '新职业涌现：AI 漫剧师、提示词工程师、Agent 搭建师、AI 配音员、AI 教学内容创作者。'
      ] },
      { h: '🎯 适用的范围', items: [
        '内容创作：短视频、漫剧、漫画、绘本、音乐。',
        '电商与带货：商品图、种草视频、直播数字人。',
        '教育与知识：个性化讲解、课件、外语陪练。',
        '办公与编程：写稿、做表、写代码、自动化流程。',
        '不适用：需强责任 / 高可靠 / 情感深度 / 合法合规兜底的事（医疗诊断、司法判决必须由人把关）。'
      ] },
      { h: '✅ 优势', items: [
        '门槛低：零基础也能上手。',
        '速度快、成本低：原本几天的事几分钟。',
        '可规模化：一套流程能批量产出。',
        '启发灵感：给你方向和草稿，再人工打磨。'
      ] },
      { h: '⚠️ 劣势 / 风险', items: [
        '幻觉与事实错误：AI 会一本正经地编，关键结论要人核。',
        '版权与肖像合规：商用需注意素材授权与真人肖像。',
        '同质化：大家都用同款工具，作品容易“撞脸”，需加入个人风格。',
        '被平台 / 模型绑定：规则变动会影响你的账号与产出。',
        '对原理无知易被割：不懂就被“速成课 / 神器”割韭菜。'
      ] },
      { h: '🧭 给你的生存建议', items: [
        '把 AI 当“杠杆”而非“替代”：用它放大你的创意与执行力。',
        '用阶段 1–4 的技能做账号 / 接单 / 带货，把兴趣变成收入。',
        '用阶段 5 的判断力选工具、避坑、跟进行业，不让别人替你思考。',
        '每周看一次「本周更新」，保持与时代同频。'
      ] }
    ],
    homework: {
      task: '写下「我打算用 AI 漫剧 / 动物角色，在哪个具体场景变现或提升自己」，以及第一步行动。',
      outcome: '你建立了 AI 时代的方法论与行动方向——从“认识 AI”走到“用 AI 开路”。'
    }
  }
];

/* ---------- 状态 ---------- */
let currentAiTab = 'course';
let aiContainer = null;
let aiWeekFilter = 'all';
let aiTermKw = '';
let aiResType = 'all';

/* ---------- 工具 ---------- */
function aiEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function aiTagCls(tag) {
  if (tag === '视频' || tag === '漫剧') return 'zm-tag-pet';
  if (tag === '工具' || tag === '趋势') return 'zm-tag-goods';
  return 'zm-tag-all';
}
function aiDayIdx() {
  var d = new Date();
  var start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}
function loadAiHw() { return loadData('ai_hw', {}); }

/* ---------- 主渲染 ---------- */
function renderAi(c) {
  aiContainer = c;
  c.innerHTML =
    '<div class="zm-dash">' +
      '<div class="zm-dash-head">' +
        '<div class="zm-dash-date">🤖 AI 学习部 · 系统跟进行业步伐</div>' +
        '<button class="zm-mini-btn" onclick="refreshAiWeekly()">↻ 刷新本周</button>' +
      '</div>' +
      '<div class="zm-theme-card">' +
        (function () {
          var th = AI_WEEKLY[aiDayIdx() % AI_WEEKLY.length];
          return '<div class="zm-theme-t">本周学习主题：' + aiEsc(th.t) + '</div>' +
                 '<div class="zm-theme-d">建议从这条入手 —— ' + aiEsc(th.why) + '</div>';
        })() +
      '</div>' +
      '<div class="zm-dash-cols" style="grid-template-columns:repeat(2,1fr)">' +
        '<div class="zm-note"><b>📌 主线</b><br>按「系统课程」从入门学到深入：每个阶段有分步实操 + 作业，做完打勾。其它 tab 是随时查的参考。</div>' +
        '<div class="zm-note"><b>🔄 更新</b><br>每周一 09:00 自动重研趋势并刷新本页数据（更新于 <span class="zm-update-tag">' + aiEsc(AI_WEEKLY_UPDATED) + '</span>）。</div>' +
      '</div>' +
    '</div>' +
    '<div class="book-tabs">' +
      tabBtn('course', '系统课程') +
      tabBtn('weekly', '本周更新') +
      tabBtn('video', 'AI视频') +
      tabBtn('manhua', 'AI漫剧/漫画') +
      tabBtn('principle', '原理与逻辑') +
      tabBtn('terms', '名词术语') +
      tabBtn('software', '主流软件') +
      tabBtn('resources', '资源资讯') +
    '</div>' +
    '<div id="ai-content"></div>';
  switchAiTab(currentAiTab);
}
function tabBtn(key, label) {
  return '<button class="book-tab ' + (currentAiTab === key ? 'active' : '') +
    '" onclick="switchAiTab(\'' + key + '\')">' + label + '</button>';
}
function switchAiTab(key) {
  currentAiTab = key;
  var map = { course: '系统课程', weekly: '本周更新', video: 'AI视频', manhua: 'AI漫剧/漫画', principle: '原理与逻辑', terms: '名词术语', software: '主流软件', resources: '资源资讯' };
  var tabs = aiContainer.querySelectorAll('.book-tab');
  tabs.forEach(function (b) { b.classList.toggle('active', b.textContent === map[key]); });
  var box = aiContainer.querySelector('#ai-content');
  if (key === 'course') renderAiCourse(box);
  else if (key === 'weekly') renderAiWeekly(box);
  else if (key === 'video') renderAiVideo(box);
  else if (key === 'manhua') renderAiManhua(box);
  else if (key === 'principle') renderAiPrinciple(box);
  else if (key === 'terms') renderAiTerms(box);
  else if (key === 'software') renderAiSoftware(box);
  else if (key === 'resources') renderAiResources(box);
}

/* ---------- 系统课程（主线） ---------- */
function renderAiCourse(box) {
  var hw = loadAiHw();
  var total = AI_COURSE.length;
  var done = AI_COURSE.filter(function (s) { return hw[s.id] && hw[s.id].done; }).length;
  var pct = Math.round(done / total * 100);
  var html = '<div class="ai-course-head">' +
    '<div class="ai-course-h">🎓 系统课程 · 从入门到深入，逐步跟进行业</div>' +
    '<div class="ai-progress"><div class="ai-progress-fill" style="width:' + pct + '%"></div>' +
      '<span class="ai-progress-text">已完成 ' + done + ' / ' + total + ' 阶段（' + pct + '%）</span></div>' +
    '<div class="ai-legend">难度：' +
      '<span class="ai-lv ai-lv-start">入门</span>' +
      '<span class="ai-lv ai-lv-mid">进阶</span>' +
      '<span class="ai-lv ai-lv-deep">深入</span>' +
      '<span class="ai-lv ai-lv-expand">拓展</span></div>' +
  '</div>';

  AI_COURSE.forEach(function (s, i) {
    var st = hw[s.id] || {};
    html += '<div class="ai-stage">' +
      '<div class="ai-stage-h">' +
        '<span class="ai-lv ai-lv-' + s.levelKey + '">' + aiEsc(s.level) + '</span>' +
        '<span class="ai-stage-no">阶段 ' + (i + 1) + '</span>' +
        '<span class="ai-stage-title">' + aiEsc(s.title) + '</span>' +
      '</div>' +
      '<div class="ai-goal">🎯 本阶段目标：' + aiEsc(s.goal) + '</div>';

    if (s.kind === 'steps') {
      html += '<div class="ai-steps">';
      s.steps.forEach(function (stp) {
        html += '<div class="ai-step">' +
          '<div class="ai-step-n">第 ' + stp.n + ' 步</div>' +
          '<div class="ai-step-do"><b>👉 怎么做：</b>' + aiEsc(stp.do) + '</div>' +
          '<div class="ai-step-principle"><b>🧩 背后的原理：</b>' + aiEsc(stp.principle) + '</div>' +
          '<div class="ai-step-tool"><b>🛠️ 用到的工具：</b>' + aiEsc(stp.tool) + '</div>' +
          '<div class="ai-step-why"><b>❓ 为什么用这个工具：</b>' + aiEsc(stp.why) + '</div>' +
          '<div class="ai-step-origin"><b>🌱 这个工具是怎么来的：</b>' + aiEsc(stp.origin) + '</div>' +
        '</div>';
      });
      html += '</div>';
    } else if (s.kind === 'macro') {
      html += '<div class="ai-macro">';
      s.sections.forEach(function (sec) {
        html += '<div class="ai-section">' +
          '<div class="ai-section-h">' + aiEsc(sec.h) + '</div>' +
          '<ul class="ai-section-list">' + sec.items.map(function (x) { return '<li>' + aiEsc(x) + '</li>'; }).join('') + '</ul>' +
        '</div>';
      });
      html += '</div>';
    }

    // 作业块
    html += '<div class="ai-homework">' +
      '<div class="ai-hw-h">📝 本阶段作业（以作业形式逐步学）</div>' +
      '<div class="ai-hw-task"><b>任务：</b>' + aiEsc(s.homework.task) + '</div>' +
      '<div class="ai-hw-outcome"><b>成果：</b>' + aiEsc(s.homework.outcome) + '</div>' +
      '<textarea class="zm-textarea" id="ai-hw-' + s.id + '" placeholder="在这里写下你的作业成果（可随时保存，本地留存）" oninput="aiSaveHwText(\'' + s.id + '\', this.value)">' + aiEsc(st.text || '') + '</textarea>' +
      '<div class="ai-hw-foot">' +
        '<button class="zm-mini-btn ' + (st.done ? 'on' : '') + '" id="ai-hw-btn-' + s.id + '" onclick="aiToggleHw(\'' + s.id + '\')">' + (st.done ? '✓ 已完成' : '标记完成') + '</button>' +
        (st.text ? '<span class="ai-hw-saved">已保存草稿</span>' : '') +
      '</div>' +
    '</div>';

    html += '</div>'; // .ai-stage
  });

  box.innerHTML = html;
}
function aiSaveHwText(id, v) {
  var h = loadAiHw();
  h[id] = h[id] || {};
  h[id].text = v;
  saveData('ai_hw', h);
  var foot = aiContainer.querySelector('#ai-hw-btn-' + id);
  if (foot && !foot.parentNode.querySelector('.ai-hw-saved')) {
    var sp = document.createElement('span');
    sp.className = 'ai-hw-saved';
    sp.textContent = '已保存草稿';
    foot.parentNode.appendChild(sp);
  }
}
function aiToggleHw(id) {
  var h = loadAiHw();
  h[id] = h[id] || {};
  h[id].done = !h[id].done;
  saveData('ai_hw', h);
  renderAiCourse(aiContainer.querySelector('#ai-content'));
  showToast(h[id].done ? '本阶段作业已标记完成 🎉' : '已取消完成');
}

/* ---------- 本周更新 inbox ---------- */
function renderAiWeekly(box) {
  var pick = loadData('ai_weekly_pick', {});
  var list = AI_WEEKLY.filter(function (it) { return aiWeekFilter === 'all' || it.tag === aiWeekFilter; });
  var html = '<div class="zm-card-grid">';
  html += '<div class="zm-card" style="grid-column:1/-1">' +
    '<div class="zm-academy-h">📡 本周 AI 速览 <span class="zm-update-tag">更新于 ' + aiEsc(AI_WEEKLY_UPDATED) + '</span></div>' +
    '<div class="zm-form-row" style="flex-wrap:wrap;gap:8px;margin:8px 0">' +
      ['all', '趋势', '工具', '视频', '漫剧', '原理'].map(function (f) {
        return '<button class="zm-mini-btn ' + (aiWeekFilter === f ? 'on' : '') + '" onclick="aiSetWeekFilter(\'' + f + '\')">' + (f === 'all' ? '全部' : f) + '</button>';
      }).join('') +
    '</div>' +
    '<div class="ai-weekly-meta">已收藏 ' + Object.keys(pick).length + ' / 共 ' + AI_WEEKLY.length + ' 条 · 点「收藏」进你的学习清单</div>' +
  '</div>';
  list.forEach(function (it) {
    var on = pick[it.id];
    html += '<div class="zm-card">' +
      '<div class="zm-card-row"><span class="zm-tag ' + aiTagCls(it.tag) + '">' + aiEsc(it.tag) + '</span>' +
        '<button class="zm-mini-btn ' + (on ? 'on' : '') + '" onclick="aiToggleWeek(\'' + it.id + '\')">' + (on ? '✓ 已收藏' : '☆ 收藏') + '</button></div>' +
      '<div class="zm-card-t">' + aiEsc(it.t) + '</div>' +
      '<div class="zm-card-d">' + aiEsc(it.why) + '</div>' +
      '<a class="zm-link" href="https://www.baidu.com/s?wd=' + encodeURIComponent(it.kw) + '" target="_blank" rel="noopener">🔍 搜一搜：' + aiEsc(it.kw) + '</a>' +
    '</div>';
  });
  html += '</div>';
  box.innerHTML = html;
}
function aiSetWeekFilter(f) { aiWeekFilter = f; renderAiWeekly(aiContainer.querySelector('#ai-content')); }
function aiToggleWeek(id) {
  var pick = loadData('ai_weekly_pick', {});
  if (pick[id]) delete pick[id]; else pick[id] = true;
  saveData('ai_weekly_pick', pick);
  renderAiWeekly(aiContainer.querySelector('#ai-content'));
  showToast(pick[id] ? '已加入学习清单' : '已取消收藏');
}
function refreshAiWeekly() {
  showToast('本周数据由每周一自动化更新；已是最新（' + AI_WEEKLY_UPDATED + '）');
}

/* ---------- AI 视频 ---------- */
function renderAiVideo(box) {
  var html = '<div class="zm-card" style="grid-column:1/-1"><div class="zm-academy-h">🎬 主流 AI 视频工具（2026）</div>' +
    '<div class="zm-card-d">文生视频 / 图生视频。新手从「可灵 + 即梦」免费额度起步；追求画质再试 Runway。注意：免费版多带水印、有时长限制。</div></div>';
  AI_VIDEO_TOOLS.forEach(function (t) {
    html += '<div class="zm-card">' +
      '<div class="zm-card-row"><a class="zm-card-t" href="' + t.url + '" target="_blank" rel="noopener">' + aiEsc(t.name) + '</a>' +
        '<span class="zm-tag zm-tag-goods">' + aiEsc(t.free) + '</span></div>' +
      '<div class="zm-card-d"><b>优势：</b>' + aiEsc(t.strength) + '<br><b>适合：</b>' + aiEsc(t.scene) + '</div>' +
      '<a class="zm-link" href="' + t.url + '" target="_blank" rel="noopener">🔗 打开官网</a>' +
    '</div>';
  });
  box.innerHTML = '<div class="zm-card-grid">' + html + '</div>';
}

/* ---------- AI 漫剧 / 漫画 ---------- */
function renderAiManhua(box) {
  var html = '<div class="zm-card" style="grid-column:1/-1"><div class="zm-academy-h">📺 AI 漫剧 / 漫画 全流程</div>' +
    '<div class="zm-card-d">一个人做一部剧已成为可能。流程：剧本 → 插画 → 图生视频 → 配音 → 剪辑。关键是<b>角色一致性</b>（用参考图 / LoRA / IP-Adapter 锁脸）。系统课程「阶段 4」会带你一步步实操。</div></div>';
  AI_MANHUA_FLOW.forEach(function (f) {
    html += '<div class="zm-card">' +
      '<div class="zm-card-t">' + aiEsc(f.step) + '</div>' +
      '<div class="zm-card-d">' + aiEsc(f.desc) + '</div>' +
      '<div class="zm-form-row" style="flex-wrap:wrap;gap:6px;margin-top:6px">' +
        f.tools.map(function (x) { return '<span class="zm-tag zm-tag-all">' + aiEsc(x) + '</span>'; }).join('') +
      '</div>' +
    '</div>';
  });
  html += '<div class="zm-card" style="grid-column:1/-1"><div class="zm-academy-h">💰 四大变现路径</div>' +
    '<ul class="ai-path-points">' +
      '<li>平台广告/流量分成：抖音/快手/视频号漫剧号，优质内容月入过万不难</li>' +
      '<li>IP 授权与周边：打造原创角色，出表情包/周边/授权</li>' +
      '<li>定制漫剧服务：企业/个人品牌漫剧，客单价 500~5000 元</li>' +
      '<li>培训与知识付费：录制 AI 漫剧教程售卖或一对一教学</li>' +
    '</ul></div>';
  box.innerHTML = '<div class="zm-card-grid">' + html + '</div>';
}

/* ---------- 原理与逻辑 ---------- */
function renderAiPrinciple(box) {
  var html = AI_PRINCIPLES.map(function (p) {
    return '<div class="zm-card"><div class="zm-card-t">' + aiEsc(p.t) + '</div>' +
      '<div class="zm-card-d">' + aiEsc(p.d) + '</div></div>';
  }).join('');
  box.innerHTML = '<div class="zm-card-grid">' + html + '</div>';
}

/* ---------- 名词术语 ---------- */
function renderAiTerms(box) {
  var list = AI_TERMS.filter(function (t) {
    if (!aiTermKw) return true;
    var k = aiTermKw.toLowerCase();
    return t.term.toLowerCase().indexOf(k) >= 0 || t.def.toLowerCase().indexOf(k) >= 0;
  });
  var html = '<div class="zm-card" style="grid-column:1/-1">' +
    '<div class="zm-academy-h">📖 AI 名词术语表</div>' +
    '<input class="zm-input" id="ai-term-search" placeholder="搜索名词，如 token / Agent / 扩散…" value="' + aiEsc(aiTermKw) + '" oninput="aiSearchTerm(this.value)">' +
    '<div class="ai-weekly-meta">共 ' + AI_TERMS.length + ' 条，当前显示 ' + list.length + ' 条</div>' +
  '</div>';
  list.forEach(function (t) {
    html += '<div class="zm-card"><div class="zm-card-t">' + aiEsc(t.term) + '</div>' +
      '<div class="zm-card-d">' + aiEsc(t.def) + '</div></div>';
  });
  if (!list.length) html += '<div class="zm-note">没有匹配的名词，换个关键词试试。</div>';
  box.innerHTML = '<div class="zm-card-grid">' + html + '</div>';
}
function aiSearchTerm(v) { aiTermKw = v; renderAiTerms(aiContainer.querySelector('#ai-content')); }

/* ---------- 主流软件 ---------- */
function renderAiSoftware(box) {
  var html = '';
  AI_SOFTWARE.forEach(function (g) {
    html += '<div class="zm-card" style="grid-column:1/-1">' +
      '<div class="zm-academy-h">' + aiEsc(g.cat) + '</div>' +
      '<div class="zm-card-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">' +
        g.items.map(function (it) {
          return '<div class="zm-card" style="margin:0">' +
            '<div class="zm-card-row"><a class="zm-card-t" href="' + it.url + '" target="_blank" rel="noopener">' + aiEsc(it.name) + '</a></div>' +
            '<div class="zm-card-d">' + aiEsc(it.note) + '</div></div>';
        }).join('') +
      '</div>' +
    '</div>';
  });
  box.innerHTML = html;
}

/* ---------- 资源资讯：最新行业视频 / 博主解读 / 文档 / 文章推送 ---------- */
function aiResTypeKey(t) {
  if (t === '视频') return 'video';
  if (t === '博主') return 'creator';
  if (t === '文档') return 'doc';
  return 'article';
}
function aiOpenUrl(r) {
  if (r.url) return r.url;
  var q = encodeURIComponent(r.kw);
  if (r.plat === 'youtube') return 'https://www.youtube.com/results?search_query=' + q;
  return 'https://search.bilibili.com/all?keyword=' + q;
}
function aiSetResType(t) {
  aiResType = t;
  renderAiResources(aiContainer.querySelector('#ai-content'));
}
function aiToggleResFav(id) {
  var fav = loadData('ai_res_fav', {});
  if (fav[id]) delete fav[id]; else fav[id] = 1;
  saveData('ai_res_fav', fav);
  renderAiResources(aiContainer.querySelector('#ai-content'));
  showToast(fav[id] ? '已收藏 ⭐' : '已取消收藏');
}
function renderAiResources(box) {
  var fav = loadData('ai_res_fav', {});
  var types = ['all', '视频', '博主', '文档', '文章'];
  var list = AI_RESOURCES.filter(function (it) { return aiResType === 'all' || it.type === aiResType; });
  var html = '<div class="zm-card-grid">';
  html += '<div class="zm-card" style="grid-column:1/-1">' +
    '<div class="zm-academy-h">📚 资源资讯 · 最新行业视频 / 博主解读 / 文档 / 文章推送 <span class="zm-update-tag">更新于 ' + aiEsc(AI_RESOURCES_UPDATED) + '</span></div>' +
    '<div class="ai-res-note">📌 每周一自动刷新。视频/博主点开是<b>站内搜索</b>（保证能打开、永远有最新内容）；文档/文章直达官网。海外源（YouTube / 部分 newsletter）需自行网络环境。</div>' +
    '<div class="zm-form-row" style="flex-wrap:wrap;gap:8px;margin:10px 0">' +
      types.map(function (t) {
        return '<button class="zm-mini-btn ' + (aiResType === t ? 'on' : '') + '" onclick="aiSetResType(\'' + t + '\')">' + (t === 'all' ? '全部' : t) + '</button>';
      }).join('') +
    '</div>' +
  '</div>';

  list.forEach(function (r) {
    var isFav = !!fav[r.id];
    var url = aiOpenUrl(r);
    html += '<div class="zm-card ai-res-card">' +
      '<div class="ai-res-top">' +
        '<span class="ai-res-type ai-res-type-' + aiResTypeKey(r.type) + '">' + aiEsc(r.type) + '</span>' +
        '<a class="ai-res-src" href="' + aiEsc(url) + '" target="_blank" rel="noopener">' + aiEsc(r.source) + '</a>' +
      '</div>' +
      '<div class="zm-card-t"><a href="' + aiEsc(url) + '" target="_blank" rel="noopener">' + aiEsc(r.title) + '</a></div>' +
      '<div class="zm-card-d"><b>主题：</b>' + aiEsc(r.topic) + '</div>' +
      '<div class="zm-card-d"><b>为什么看：</b>' + aiEsc(r.why) + '</div>' +
      '<div class="ai-res-foot">' +
        '<a class="zm-mini-btn" href="' + aiEsc(url) + '" target="_blank" rel="noopener">打开 / 看解读</a>' +
        '<button class="zm-mini-btn ' + (isFav ? 'on' : '') + '" onclick="aiToggleResFav(\'' + r.id + '\')">' + (isFav ? '★ 已收藏' : '☆ 收藏') + '</button>' +
      '</div>' +
    '</div>';
  });

  var favList = AI_RESOURCES.filter(function (r) { return fav[r.id]; });
  if (favList.length) {
    html += '<div class="zm-card" style="grid-column:1/-1"><div class="zm-academy-h">⭐ 我的收藏</div><div class="ai-res-fav">';
    favList.forEach(function (r) {
      html += '<div class="ai-res-fav-item"><a href="' + aiEsc(aiOpenUrl(r)) + '" target="_blank" rel="noopener">' + aiEsc(r.title) + '</a><button class="zm-mini-btn" onclick="aiToggleResFav(\'' + r.id + '\')">移除</button></div>';
    });
    html += '</div></div>';
  }

  html += '</div>';
  box.innerHTML = html;
}
