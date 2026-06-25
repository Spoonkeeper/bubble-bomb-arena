export const HERO_DISPLAY = {
  shadow: {
    name: "暗影泡泡守卫",
    shortName: "暗影",
    description: "紫黑潜行 / 穿墙奇袭",
    role: "绕图突袭，穿越阻挡，制造突然进攻窗口",
    ultimateName: "幽影穿行",
    ultimateSummary: "4.5秒穿墙穿弹；幽影光波造成22伤害与减速。",
  },
  ember: {
    name: "盛趣泡泡彬哥",
    shortName: "彬哥",
    description: "黑白配色 / 高手真的不说",
    role: "火圈压制，封锁路线，逼迫敌人离开安全位",
    ultimateName: "灼焰领域",
    ultimateSummary: "3.5格火圈：14/秒；离圈后余烬持续灼烧。",
  },
  volt: {
    name: "字节泡泡可姐",
    shortName: "可姐",
    description: "神人不摆 / 静电护场",
    role: "短时间完全免伤，强行穿过爆炸节奏",
    ultimateName: "续命护场",
    ultimateSummary: "回满血并无敌；锁定敌人召唤35伤害生命落石。",
  },
  wind: {
    name: "火车泡泡头头",
    shortName: "火车头头",
    description: "蓝白战甲 / 直接就是撞",
    role: "高速冲线，铺设电轨，正面突破封锁",
    ultimateName: "动力全开",
    ultimateSummary: "高速穿越炸弹，沿途留下减速电场。",
  },
};

export const MENU_TEXT = {
  title: "炸爽彬彬堂",
  slogan: "一节更比六节强",
  brand: "SPOON",
  selectHeroes: "备选英雄",
  chooseHero: "设为主角",
  startGame: "进入部署",
  enterMap: "进入地图",
  mapSelectTitle: "选择战场",
  rolePrefix: "定位",
  ultimatePrefix: "大招",
  statTitle: "基础参数",
  resultWin: "闯关成功",
  resultLose: "本局失利",
  resultLeadWin: "作战完成，主角海报已生成",
  resultLeadLose: "战局暂停，下一轮重新部署",
  resultBodyWin: "敌方阵容已清空。保持节奏，继续扩大优势。",
  resultBodyLose: "这次被炸弹节奏抢先一步。调整路线，下一局继续冲。",
  currentHero: "本局主角",
  resultPanelWin: "胜利结算",
  resultPanelLose: "复盘结算",
  battleSummaryWin: "敌人全部清除",
  battleSummaryLose: "重新选择路线",
  battleLabelWin: "战况",
  battleLabelLose: "复盘",
  restart: "重新开始",
  restartHint: "按 Enter 或点击按钮，回到选人页重新部署。",
};

export const GAME_TEXT = {
  title: "炸爽彬彬堂",
  subtitle: "泡泡炸弹闯关",
  boardSize: "棋盘尺寸：15 x 13（每格 40px）",
  goalTitle: "闯关目标",
  goalBody: "放置炸弹，炸开箱子，收集道具和能量球，击败 3 名敌人即可通关。",
  itemTitle: "道具一览",
  mapTitle: "地图要点",
  controlTitle: "操作说明",
  moveLabel: "移动",
  bombLabel: "放置炸弹",
  ultimateLabel: "释放大招",
  moveValue: "WASD / 方向键",
  bombValue: "Space",
  ultimateValue: "Shift",
  boardElements: "地图元素",
  heroPanelTitle: "当前主角",
  enemyPanelTitle: "敌方阵容",
  shieldSaved: "护盾挡下了一次爆炸",
  extraLifeSaved: "续命护场正在保护可姐",
  ready: "准备中",
  charging: "充能",
  active: "大招中",
};

export const ITEM_DISPLAY = {
  range: {
    label: "范围+1",
    description: "增加十字爆炸的延伸范围。",
  },
  bomb: {
    label: "炸弹+1",
    description: "增加同时可放下的炸弹数量。",
  },
  speed: {
    label: "速度+1",
    description: "提升角色的移动速度。",
  },
  shield: {
    label: "护盾",
    description: "抵消一次爆炸伤害。",
  },
  "energy-orb": {
    label: "能量球",
    description: "拾取后立即补充 50% 大招充能。",
  },
};

export const STAT_LABELS = {
  speed: "速度",
  maxBombs: "炸弹",
  blastRange: "范围",
  shield: "护甲",
  enemies: "敌人",
};

export const MAP_LEGEND = [
  { texture: "tile-floor-a", label: "可通行地面" },
  { texture: "wall-solid", label: "固定墙体" },
  { texture: "box-breakable", label: "可破坏箱子" },
  { texture: "bomb", label: "泡泡炸弹" },
];

export function getHeroDisplay(hero) {
  if (!hero) return null;
  return HERO_DISPLAY[hero.id] || {
    name: hero.name,
    shortName: hero.shortName,
    description: hero.description,
    role: hero.role,
    ultimateName: hero.ultimate?.name,
    ultimateSummary: hero.ultimate?.summary,
  };
}

export function getItemDisplay(itemId, fallbackLabel = itemId) {
  return ITEM_DISPLAY[itemId] || { label: fallbackLabel, description: "" };
}
