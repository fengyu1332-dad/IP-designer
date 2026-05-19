export interface ThemeOption {
  value: string;
  label: string;
}

export interface ThemeCategory {
  id: string;
  name: string;
  description: string;
  subThemes: string[];
}

export const WEATHER_OPTIONS: ThemeOption[] = [
  { value: '晴天', label: '☀️ 晴天' },
  { value: '晨光', label: '🌅 晨光' },
  { value: '阴雨', label: '🌧️ 阴雨' },
  { value: '大雾', label: '🌫️ 大雾' },
  { value: '暮色', label: '🌙 暮色' },
  { value: '星空', label: '🌌 星空' },
];

export const MOOD_OPTIONS: ThemeOption[] = [
  { value: '平静', label: '😌 平静' },
  { value: '充满干劲', label: '💪 充满干劲' },
  { value: '焦虑反思', label: '🤔 焦虑反思' },
  { value: '感恩', label: '🙏 感恩' },
  { value: '疲惫但充实', label: '😴 疲惫但充实' },
  { value: '松弛感', label: '🌿 松弛感' },
];

export const THEME_CATEGORIES: ThemeCategory[] = [
  {
    id: 'career-belief',
    name: '职业信念与长期主义',
    description: '稳重、专业，画面需传递出时间沉淀的厚重感',
    subThemes: [
      '晨光中提包前行的背影',
      '深夜复盘的办公桌',
      '行业大会上专注听讲的侧影',
      '多年与客户的合影对比',
      '被反复修改的商业计划书',
      '解决复杂技术难题的草稿',
    ],
  },
  {
    id: 'hardcore-hobby',
    name: '硬核爱好与探索',
    description: '画面需强调"实操性"与"工具感"，避免悬浮',
    subThemes: [
      '户外生存技能训练',
      'AI/编程工具逆向分析',
      '长跑配速与GPS轨迹',
      '深潜气瓶与浮力配平',
      '桥牌/德扑战术复盘',
      '健身PR记录与生理指标',
    ],
  },
  {
    id: 'family-responsibility',
    name: '家庭责任与陪伴',
    description: '弱化面部特写，强调整体氛围与互动感',
    subThemes: [
      '升学路径规划研究',
      '亲子户外挑战',
      '家庭共建日常',
      '睡前高质量陪伴',
      '辅导孩子功课的瞬间',
      '家庭宠物陪伴场景',
    ],
  },
  {
    id: 'daily-life',
    name: '日常烟火与碎片',
    description: '画面需具备"抓拍感"和粗糙的真实颗粒感',
    subThemes: [
      '街头的流浪猫狗',
      '搞砸的料理',
      '意外的阵雨',
      '深夜空荡的街道',
      '路边咖啡馆',
      '一份用心制作的早餐',
    ],
  },
  {
    id: 'cognitive-awakening',
    name: '认知觉醒与感悟',
    description: '视觉上需大量留白，呈现极简或意境感',
    subThemes: [
      '商业系统逻辑重构',
      '经典书籍划线页',
      '旷野与天空的留白',
      '手绘思维导图草稿',
      '对热点事件的反思记录',
      '偶然发现的励志名言书法',
    ],
  },
  {
    id: 'humanistic-care',
    name: '人文关怀与共情',
    description: '充满纪实感，光影对比强烈，凸显岁月痕迹',
    subThemes: [
      '适老化科技普及场景',
      '街头老手艺人',
      '社区邻里互助',
      '义工活动服务场景',
      '公共交通上的温暖让座',
      '偏远山区儿童的眼神特写',
    ],
  },
];

export const getThemeById = (id: string): ThemeCategory | undefined => {
  return THEME_CATEGORIES.find((theme) => theme.id === id);
};

export const getAllThemes = (): ThemeCategory[] => {
  return THEME_CATEGORIES;
};

export const PRIMARY_THEMES = THEME_CATEGORIES.map((t) => t.name);
