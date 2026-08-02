// ============================================
// 运动板块 - 运动类型与基础数据
// 最后更新：2026-07-31
// ============================================

// 运动类型定义：key 用于记录存储，met 为估算热量用的代谢当量
const SPORT_TYPES = [
  { key: 'run',    name: '跑步',       icon: '🏃', color: '#FF6B6B', met: 8.0 },
  { key: 'walk',   name: '快走',       icon: '🚶', color: '#00B894', met: 4.3 },
  { key: 'ride',   name: '骑行',       icon: '🚴', color: '#0984E3', met: 6.0 },
  { key: 'swim',   name: '游泳',       icon: '🏊', color: '#00CEC9', met: 7.0 },
  { key: 'gym',    name: '力量/健身',  icon: '🏋️', color: '#6C5CE7', met: 6.0 },
  { key: 'yoga',   name: '瑜伽/拉伸',  icon: '🧘', color: '#FD79A8', met: 3.0 },
  { key: 'rope',   name: '跳绳',       icon: '🪢', color: '#FDCB6E', met: 10.0 },
  { key: 'ball',   name: '球类',       icon: '⚽', color: '#E17055', met: 6.0 },
  { key: 'dance',  name: '舞蹈',       icon: '💃', color: '#E84393', met: 5.0 },
  { key: 'hike',   name: '爬山/徒步',  icon: '⛰️', color: '#00B894', met: 5.5 },
  { key: 'pilates',name: '普拉提',     icon: '🤸', color: '#A29BFE', met: 3.5 },
  { key: 'taichi', name: '太极/八段锦',icon: '🧎', color: '#74B9FF', met: 2.5 },
  { key: 'aerobics',name:'操课/居家操',icon: '🕺', color: '#E17055', met: 5.0 },
  { key: 'badminton',name:'羽毛球',    icon: '🏸', color: '#00CEC9', met: 5.5 },
  { key: 'tennis', name: '网球',       icon: '🎾', color: '#FDCB6E', met: 6.5 },
  { key: 'elliptical',name:'椭圆机',   icon: '⚙️', color: '#636E72', met: 5.0 },
  { key: 'climb',  name: '攀岩',       icon: '🧗', color: '#E84393', met: 6.5 },
  { key: 'situp',  name: '核心/卷腹',  icon: '💪', color: '#FF7675', met: 3.8 },
  { key: 'stretch',name: '拉伸放松',   icon: '🤲', color: '#55E6C1', met: 2.0 },
  { key: 'other',  name: '其他',       icon: '✨', color: '#A29BFE', met: 4.0 }
];

// 默认个人档案（用于估算热量消耗），体重可在板块内修改
const SPORT_DEFAULT_PROFILE = { weight: 55 };

// 常用运动目标模板（可一键套用）
const SPORT_GOAL_PRESETS = [
  { label: '每周运动 3 次',        times: 3, unit: '次/周' },
  { label: '每天步行 30 分钟',     duration: 30, unit: '分钟/天' },
  { label: '每月累计 600 分钟',    duration: 600, unit: '分钟/月' },
  { label: '每月运动 12 次',       times: 12, unit: '次/月' }
];
