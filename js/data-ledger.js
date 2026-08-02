// ============================================
// 记账板块 - 渠道 / 分类 / 定投 基础数据
// 最后更新：2026-08-01
// ============================================

// 支付渠道（微信 / 支付宝 / 零钱通 / 银行卡 / 花呗 / 现金）
const LEDGER_CHANNELS = [
  { key: 'wechat',       name: '微信',     icon: '💬' },
  { key: 'alipay',       name: '支付宝',   icon: '🅰️' },
  { key: 'lingqiantong', name: '零钱通',   icon: '🐧' },
  { key: 'bankcard',     name: '银行卡',   icon: '💳' },
  { key: 'huabei',       name: '花呗',     icon: '🌸' },
  { key: 'cash',         name: '现金',     icon: '💵' }
];

// 支出 / 收益 用途分类（琐碎化、多元化）
const LEDGER_CATEGORIES = [
  { key: 'traffic', name: '交通类', icon: '🚌' },
  { key: 'comm',    name: '通讯类', icon: '📱' },
  { key: 'pocket',  name: '零花类', icon: '🪙' },
  { key: 'snack',   name: '零食类', icon: '🍪' },
  { key: 'beauty',  name: '美妆类', icon: '💄' },
  { key: 'food',    name: '餐饮类', icon: '🍜' },
  { key: 'study',   name: '学习类', icon: '📚' },
  { key: 'pet',     name: '宠物类', icon: '🐾' },
  { key: 'cloth',   name: '穿搭类', icon: '👗' },
  { key: 'medical', name: '医疗类', icon: '💊' },
  { key: 'home',    name: '居家类', icon: '🏠' },
  { key: 'fun',     name: '娱乐类', icon: '🎮' },
  { key: 'social',  name: '人情类', icon: '🎁' },
  { key: 'other',   name: '其他',   icon: '📦' }
];

// 常用定投基金参考（用户也可自定义填写）
const LEDGER_FUNDS = [
  '沪深300ETF联接', '中证500ETF联接', '创业板ETF', '纳斯达克100QDII',
  '白酒指数基金', '消费ETF', '医药ETF', '科创50ETF', '红利低波ETF', '黄金ETF'
];
