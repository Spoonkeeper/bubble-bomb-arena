(() => {
const __bundle = {};
// config.js
{
const GAME_CONFIG = {
  GRID_COLS: 15,
  GRID_ROWS: 13,
  TILE_SIZE: 40,
  BOARD_OFFSET_X: 348,
  BOARD_OFFSET_Y: 118,
  BOMB_DELAY: 2500,
  EXPLOSION_DURATION: 400,
  ITEM_DROP_RATE: 0.3,
  ENEMY_COUNT: 3,
  PLAYER_START: {
    speed: 1,
    maxBombs: 1,
    blastRange: 2,
    shield: 0,
  },
};

const ULTIMATE_CONFIG = {
  fullChargeMs: 15000,
};

const COMBAT_CONFIG = {
  maxHp: 100,
  regenDelayMs: 3000,
  regenPerSecond: 15,
  voltRegenPerSecond: 30,
  bombDamage: 70,
  meteorDamage: 50,
  shieldDurationMs: 7000,
  windSpeedMultiplier: 3,
  windTrailDurationMs: 2200,
  windTrailDamage: 8,
  windTrailTickMs: 600,
  windSlowMultiplier: 0.78,
  slowMultiplier: 0.7,
  shadowSlowMultiplier: 0.75,
  shadowSlowDurationMs: 1600,
  emberDamagePerSecond: 14,
  emberRadiusTiles: 3.5,
  emberAfterburnDamagePerSecond: 6,
  emberAfterburnDurationMs: 2500,
  shadowBeamDamage: 22,
  shadowBeamRadiusTiles: 3.5,
  shadowBeamAngleDeg: 360,
  shadowBeamDurationMs: 900,
  windShockDamage: 10,
  windShockCooldownMs: 500,
  voltMeteorDamage: 35,
  voltMeteorIntervalMs: 1200,
  voltMeteorWarningMs: 1300,
  voltMeteorImpactMs: 450,
};

const ENERGY_ORB_CONFIG = {
  id: "energy-orb",
  label: "能量球",
  texture: "item-energy-orb",
  chargeAmount: 50,
  spawnIntervalMs: 5000,
  maxActive: 2,
  lifetimeMs: 10000,
};

const CELL = {
  EMPTY: 0,
  SOLID_WALL: 1,
  BREAKABLE_BOX: 2,
};

const MAPS = [
  {
    id: "inferno",
    name: "炸爆炼狱",
    description: "经典箱阵，节奏稳定",
    tags: ["经典", "箱阵", "红黑"],
    previewTexture: "map-preview-inferno",
    layout: "inferno",
    theme: "inferno",
    textures: {
      floorA: "inferno-v3-floor-a",
      floorB: "inferno-v3-floor-b",
      wall: "inferno-v3-wall",
      box: "inferno-v3-box",
      bomb: "inferno-v3-bomb",
      explosion: "inferno-v3-explosion",
    },
    itemTextures: {
      "energy-orb": "inferno-v3-orb-energy",
      speed: "inferno-v3-orb-speed",
      range: "inferno-v3-orb-range",
      bomb: "inferno-v3-orb-bomb",
      shield: "inferno-v3-orb-shield",
    },
    enemyTextures: ["inferno-v3-enemy-0", "inferno-v3-enemy-1", "inferno-v3-enemy-2"],
    bombAnimation: { rotation: 360, durationMs: 1050 },
    meteor: null,
  },
  {
    id: "homeland",
    name: "破猛故土",
    description: "陨石压场，路线开阔",
    tags: ["陨石", "开放", "黑金"],
    previewTexture: "map-preview-homeland",
    layout: "homeland",
    theme: "homeland",
    textures: {
      floorA: "homeland-v3-floor-a",
      floorB: "homeland-v3-floor-b",
      wall: "homeland-v3-wall",
      box: "homeland-v3-box",
      bomb: "homeland-v3-bomb",
      explosion: "homeland-v3-explosion",
    },
    itemTextures: {
      "energy-orb": "homeland-v3-orb-energy",
      speed: "homeland-v3-orb-speed",
      range: "homeland-v3-orb-range",
      bomb: "homeland-v3-orb-bomb",
      shield: "homeland-v3-orb-shield",
    },
    enemyTextures: ["homeland-v3-enemy-0", "homeland-v3-enemy-1", "homeland-v3-enemy-2"],
    bombAnimation: { rotation: -360, durationMs: 1450 },
    meteor: {
      enabled: true,
      firstDelayMs: 6000,
      intervalMs: 7000,
      warningMs: 1600,
      impactMs: 450,
      count: 3,
    },
  },
  {
    id: "abyss",
    name: "暗激深渊",
    description: "无障碍深渊，双向传送",
    tags: ["空场", "传送", "深渊"],
    previewTexture: "map-preview-abyss",
    layout: "abyss",
    theme: "abyss",
    textures: {
      floorA: "abyss-floor-a",
      floorB: "abyss-floor-b",
      wall: "abyss-wall",
      box: "abyss-wall",
      bomb: "abyss-bomb-blackhole",
      explosion: "abyss-explosion",
      portalHorizontalIdle: "abyss-portal-purple-idle",
      portalHorizontalOpen: "abyss-portal-purple-open",
      portalVerticalIdle: "abyss-portal-gold-idle",
      portalVerticalOpen: "abyss-portal-gold-open",
    },
    enemyTextures: ["abyss-enemy-0", "abyss-enemy-1", "abyss-enemy-2"],
    itemTextures: {
      "energy-orb": "abyss-orb-energy",
      speed: "abyss-orb-speed",
      range: "abyss-orb-range",
      bomb: "abyss-orb-bomb",
      shield: "abyss-orb-shield",
    },
    bombAnimation: { rotation: 360, durationMs: 1150 },
    portal: {
      enabled: true,
      channelMs: 1000,
      openMs: 3000,
      cooldownMs: 5000,
    },
    orbField: {
      enabled: true,
      spawnIntervalMs: 4000,
      maxActive: 4,
      lifetimeMs: 9000,
      weights: {
        "energy-orb": 30,
        speed: 20,
        range: 20,
        bomb: 15,
        shield: 15,
      },
      textures: {
        "energy-orb": "abyss-orb-energy",
        speed: "abyss-orb-speed",
        range: "abyss-orb-range",
        bomb: "abyss-orb-bomb",
        shield: "abyss-orb-shield",
      },
    },
    meteor: null,
  },
];

function getMapConfig(mapId = "inferno") {
  return MAPS.find((map) => map.id === mapId) || MAPS[0];
}

const ITEM_TYPES = [
  {
    id: "range",
    label: "范围+1",
    texture: "item-range",
    apply(player) {
      player.stats.blastRange += 1;
    },
  },
  {
    id: "bomb",
    label: "炸弹+1",
    texture: "item-bomb",
    apply(player) {
      player.stats.maxBombs += 1;
    },
  },
  {
    id: "speed",
    label: "速度+1",
    texture: "item-speed",
    apply(player) {
      player.stats.speed += 1;
    },
  },
  {
    id: "shield",
    label: "护盾",
    texture: "item-shield",
    apply(player) {
      player.grantShield?.();
    },
  },
];

const HEROES = [
  {
    id: "shadow",
    name: "暗影泡泡守卫",
    shortName: "暗影",
    texture: "hero-shadow",
    accent: 0x9a7cff,
    description: "兜帽面罩 / 紫黑泡泡能量",
    role: "偷线、绕图、奇袭",
    baseStats: { speed: 1, maxBombs: 1, blastRange: 3, shield: 0 },
    ultimate: {
      id: "shadow-phase",
      name: "幽影穿行",
      durationMs: 4500,
      summary: "4.5 秒穿墙穿弹并提速，以幽影光波减速敌人。",
    },
  },
  {
    id: "ember",
    name: "盛趣泡泡彬哥",
    shortName: "彬哥",
    texture: "hero-ember",
    accent: 0xffad45,
    description: "黑白配色 / 高手真的不说",
    role: "范围压制、追杀、逼走位",
    baseStats: { speed: 1, maxBombs: 2, blastRange: 2, shield: 0 },
    ultimate: {
      id: "ember-aura",
      name: "灼焰领域",
      durationMs: 9000,
      radiusTiles: 3.5,
      killAfterMs: 5000,
      summary: "9 秒灼焰领域，持续压制并留下短暂余烬。",
    },
  },
  {
    id: "volt",
    name: "字节泡泡可姐",
    shortName: "可姐",
    texture: "hero-volt",
    accent: 0x58e8ff,
    description: "神人不摆 / 天天要抠手道拐",
    role: "容错、生存、拖回合",
    baseStats: { speed: 1, maxBombs: 1, blastRange: 2, shield: 1 },
    ultimate: {
      id: "volt-guard",
      name: "续命护场",
      durationMs: 5000,
      summary: "5 秒无敌状态，爆炸和陨石伤害都不会击败可姐。",
    },
  },
  {
    id: "wind",
    name: "火车泡泡头头",
    shortName: "火车头头",
    texture: "hero-wind",
    accent: 0x48a8ff,
    description: "蓝白战甲 / 直接就是撞",
    role: "高速冲线，铺设电轨，正面突破封锁",
    baseStats: { speed: 2, maxBombs: 1, blastRange: 1, shield: 0 },
    ultimate: {
      id: "wind-surge",
      name: "动力全开",
      durationMs: 4500,
      speedMultiplier: 3,
      summary: "高速穿越炸弹，沿途留下减速电场。",
    },
  },
];

const MENU_THEME = {
  slogan: "一节更比六节强",
  mascotSourceKey: "menu-kid-source",
  mascotSourcePath: "assets/menu-kid-source.jpg",
  mascotTextureKey: "menu-kid-mascot",
};

const ENEMY_TYPES = [
  {
    id: "bot",
    name: "训练机器人",
    texture: "enemy-bot",
    accent: 0xffad45,
  },
  {
    id: "drone",
    name: "泡泡无人机",
    texture: "enemy-drone",
    accent: 0x58e8ff,
  },
  {
    id: "dummy",
    name: "护盾靶机",
    texture: "enemy-dummy",
    accent: 0x9a7cff,
  },
];

const SPAWN_POINTS = {
  player: { col: 1, row: 1 },
  enemies: [
    { col: 13, row: 11 },
    { col: 13, row: 1 },
    { col: 1, row: 11 },
  ],
  players: [
    { col: 1, row: 1 },
    { col: 13, row: 11 },
  ],
  aiByPlayerCount: {
    1: [
      { col: 13, row: 11 },
      { col: 13, row: 1 },
      { col: 1, row: 11 },
    ],
    2: [
      { col: 13, row: 1 },
      { col: 1, row: 11 },
    ],
  },
};
Object.assign(__bundle, { GAME_CONFIG, ULTIMATE_CONFIG, COMBAT_CONFIG, ENERGY_ORB_CONFIG, CELL, MAPS, getMapConfig, ITEM_TYPES, HEROES, MENU_THEME, ENEMY_TYPES, SPAWN_POINTS });
}

// uiText.js
{
const HERO_DISPLAY = {
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

const MENU_TEXT = {
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

const GAME_TEXT = {
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

const ITEM_DISPLAY = {
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

const STAT_LABELS = {
  speed: "速度",
  maxBombs: "炸弹",
  blastRange: "范围",
  shield: "护甲",
  enemies: "敌人",
};

const MAP_LEGEND = [
  { texture: "tile-floor-a", label: "可通行地面" },
  { texture: "wall-solid", label: "固定墙体" },
  { texture: "box-breakable", label: "可破坏箱子" },
  { texture: "bomb", label: "泡泡炸弹" },
];

function getHeroDisplay(hero) {
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

function getItemDisplay(itemId, fallbackLabel = itemId) {
  return ITEM_DISPLAY[itemId] || { label: fallbackLabel, description: "" };
}
Object.assign(__bundle, { HERO_DISPLAY, MENU_TEXT, GAME_TEXT, ITEM_DISPLAY, STAT_LABELS, MAP_LEGEND, getHeroDisplay, getItemDisplay });
}

// ui/TechVisualKit.js
{
const TECH_UI_ASSETS = {
  overlay: { key: "ui-tech-overlay-v1", path: "assets/ui-tech-overlay-v1.png" },
  panel: { key: "ui-panel-frame-v1", path: "assets/ui-panel-frame-v1.png" },
  primaryButton: { key: "ui-primary-button-v1", path: "assets/ui-primary-button-v1.png" },
};

function preloadTechUi(scene) {
  Object.values(TECH_UI_ASSETS).forEach(({ key, path }) => {
    if (!scene.textures.exists(key)) scene.load.image(key, path);
  });
}

function addTechOverlay(scene, depth = 80, alpha = 0.96) {
  const overlay = scene.add.image(640, 380, TECH_UI_ASSETS.overlay.key)
    .setDisplaySize(1280, 760)
    .setDepth(depth)
    .setAlpha(0);
  overlay.setScale(1.018);
  scene.tweens.add({
    targets: overlay,
    alpha,
    scaleX: 1,
    scaleY: 1,
    duration: 560,
    ease: "Cubic.easeOut",
  });
  return overlay;
}

function addPanelFrame(scene, x, y, width, height, depth = 6, alpha = 0.86) {
  const frame = scene.add.image(x, y, TECH_UI_ASSETS.panel.key)
    .setDisplaySize(width, height)
    .setDepth(depth)
    .setAlpha(alpha);
  scene.tweens.add({
    targets: frame,
    alpha: Math.min(1, alpha + 0.09),
    duration: 1350,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });
  return frame;
}

function addPrimaryButtonSkin(scene, x, y, width, height, depth = 10) {
  return scene.add.image(x, y, TECH_UI_ASSETS.primaryButton.key)
    .setDisplaySize(width, height)
    .setDepth(depth);
}

function wireTechButton(scene, hitTarget, visualTargets, options = {}) {
  const targets = Array.isArray(visualTargets) ? visualTargets : [visualTargets];
  const baseScales = targets.map((target) => ({
    target,
    x: target.scaleX ?? 1,
    y: target.scaleY ?? 1,
  }));
  const hoverScale = options.hoverScale || 1.035;
  hitTarget.on("pointerover", () => {
    baseScales.forEach(({ target, x, y }) => {
      scene.tweens.add({ targets: target, scaleX: x * hoverScale, scaleY: y * hoverScale, duration: 120, ease: "Quad.easeOut" });
    });
  });
  hitTarget.on("pointerout", () => {
    baseScales.forEach(({ target, x, y }) => {
      scene.tweens.add({ targets: target, scaleX: x, scaleY: y, duration: 150, ease: "Quad.easeOut" });
    });
  });
  hitTarget.on("pointerdown", () => {
    baseScales.forEach(({ target, x, y }) => {
      scene.tweens.add({ targets: target, scaleX: x * 0.975, scaleY: y * 0.975, duration: 70, yoyo: true, ease: "Quad.easeOut" });
    });
  });
}

function addAmbientTechMotion(scene, depth = 2) {
  const scan = scene.add.rectangle(640, 86, 196, 2, 0x58e8ff, 0.34).setDepth(depth);
  scene.tweens.add({
    targets: scan,
    x: 1080,
    alpha: 0.05,
    duration: 2200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });
  return scan;
}
Object.assign(__bundle, { TECH_UI_ASSETS, preloadTechUi, addTechOverlay, addPanelFrame, addPrimaryButtonSkin, wireTechButton, addAmbientTechMotion });
}

// assets/AssetFactory.js
{
const { ENEMY_TYPES, HEROES } = __bundle;
const SHADOW_HERO_SHEET_KEY = "shadow-omen-sheet";
const SHADOW_HERO_SHEET_PATH = "assets/shadow-omen-sheet.png";
const EMBER_HERO_ASSET_PATHS = {
  "hero-ember": "assets/hero-ember.png",
  "hero-ember-back": "assets/hero-ember-back.png",
  "hero-ember-left": "assets/hero-ember-left.png",
  "hero-ember-right": "assets/hero-ember-right.png",
  "hero-ember-poster": "assets/hero-ember-poster.png",
};
const VOLT_HERO_ASSET_PATHS = {
  "hero-volt": "assets/hero-volt.png",
  "hero-volt-back": "assets/hero-volt-back.png",
  "hero-volt-left": "assets/hero-volt-left.png",
  "hero-volt-right": "assets/hero-volt-right.png",
  "hero-volt-poster": "assets/hero-volt-poster.png",
};
const WIND_HERO_ASSET_PATHS = {
  "hero-wind": "assets/hero-wind.png",
  "hero-wind-back": "assets/hero-wind-back.png",
  "hero-wind-left": "assets/hero-wind-left.png",
  "hero-wind-right": "assets/hero-wind-right.png",
  "hero-wind-poster": "assets/hero-wind-poster.png",
};
const TECH_MAP_ASSET_PATHS = {
  "inferno-floor-a": "assets/inferno-floor-a.png",
  "inferno-floor-b": "assets/inferno-floor-b.png",
  "inferno-wall": "assets/inferno-wall.png",
  "inferno-box": "assets/inferno-box.png",
  "inferno-bomb": "assets/inferno-bomb.png",
  "inferno-explosion": "assets/inferno-explosion.png",
  "inferno-orb-energy": "assets/inferno-orb-energy.png",
  "inferno-orb-speed": "assets/inferno-orb-speed.png",
  "inferno-orb-range": "assets/inferno-orb-range.png",
  "inferno-orb-bomb": "assets/inferno-orb-bomb.png",
  "inferno-orb-shield": "assets/inferno-orb-shield.png",
  "inferno-enemy-0": "assets/inferno-enemy-0.png",
  "inferno-enemy-1": "assets/inferno-enemy-1.png",
  "inferno-enemy-2": "assets/inferno-enemy-2.png",
  "inferno-v3-floor-a": "assets/inferno-v4-floor-a.png",
  "inferno-v3-floor-b": "assets/inferno-v4-floor-b.png",
  "inferno-v3-wall": "assets/inferno-v4-wall.png",
  "inferno-v3-box": "assets/inferno-v4-box.png",
  "inferno-v3-bomb": "assets/inferno-v4-bomb.png",
  "inferno-v3-explosion": "assets/inferno-v4-explosion.png",
  "inferno-v3-orb-energy": "assets/inferno-v4-orb-energy.png",
  "inferno-v3-orb-speed": "assets/inferno-v4-orb-speed.png",
  "inferno-v3-orb-range": "assets/inferno-v4-orb-range.png",
  "inferno-v3-orb-bomb": "assets/inferno-v4-orb-bomb.png",
  "inferno-v3-orb-shield": "assets/inferno-v4-orb-shield.png",
  "inferno-v3-enemy-0": "assets/inferno-v4-enemy-0.png",
  "inferno-v3-enemy-1": "assets/inferno-v4-enemy-1.png",
  "inferno-v3-enemy-2": "assets/inferno-v4-enemy-2.png",
  "wall-solid": "assets/wall-solid-tech.png",
  "box-breakable": "assets/box-breakable-tech.png",
  "homeland-floor-a": "assets/homeland-floor-a.png",
  "homeland-floor-b": "assets/homeland-floor-b.png",
  "homeland-wall": "assets/homeland-wall.png",
  "homeland-box": "assets/homeland-box.png",
  "homeland-bomb": "assets/homeland-bomb.png",
  "homeland-explosion": "assets/homeland-explosion.png",
  "homeland-orb-energy": "assets/homeland-orb-energy.png",
  "homeland-orb-speed": "assets/homeland-orb-speed.png",
  "homeland-orb-range": "assets/homeland-orb-range.png",
  "homeland-orb-bomb": "assets/homeland-orb-bomb.png",
  "homeland-orb-shield": "assets/homeland-orb-shield.png",
  "homeland-enemy-0": "assets/homeland-enemy-0.png",
  "homeland-enemy-1": "assets/homeland-enemy-1.png",
  "homeland-enemy-2": "assets/homeland-enemy-2.png",
  "homeland-v3-floor-a": "assets/homeland-v4-floor-a.png",
  "homeland-v3-floor-b": "assets/homeland-v4-floor-b.png",
  "homeland-v3-wall": "assets/homeland-v4-wall.png",
  "homeland-v3-box": "assets/homeland-v4-box.png",
  "homeland-v3-bomb": "assets/homeland-v4-bomb.png",
  "homeland-v3-explosion": "assets/homeland-v4-explosion.png",
  "homeland-v3-orb-energy": "assets/homeland-v4-orb-energy.png",
  "homeland-v3-orb-speed": "assets/homeland-v4-orb-speed.png",
  "homeland-v3-orb-range": "assets/homeland-v4-orb-range.png",
  "homeland-v3-orb-bomb": "assets/homeland-v4-orb-bomb.png",
  "homeland-v3-orb-shield": "assets/homeland-v4-orb-shield.png",
  "homeland-v3-enemy-0": "assets/homeland-v4-enemy-0.png",
  "homeland-v3-enemy-1": "assets/homeland-v4-enemy-1.png",
  "homeland-v3-enemy-2": "assets/homeland-v4-enemy-2.png",
  "map-preview-inferno": "assets/map-preview-inferno.png",
  "map-preview-homeland": "assets/map-preview-homeland.png",
  "map-preview-abyss": "assets/map-preview-abyss-v3.png",
  "abyss-floor-a": "assets/abyss-floor-a.png",
  "abyss-floor-b": "assets/abyss-floor-b.png",
  "abyss-wall": "assets/abyss-wall.png",
  "abyss-bomb-blackhole": "assets/abyss-bomb-blackhole.png",
  "abyss-explosion": "assets/abyss-explosion.png",
  "abyss-portal-purple-idle": "assets/abyss-portal-purple-idle.png",
  "abyss-portal-purple-open": "assets/abyss-portal-purple-open.png",
  "abyss-portal-gold-idle": "assets/abyss-portal-gold-idle.png",
  "abyss-portal-gold-open": "assets/abyss-portal-gold-open.png",
  "abyss-orb-energy": "assets/abyss-orb-energy.png",
  "abyss-orb-speed": "assets/abyss-orb-speed.png",
  "abyss-orb-range": "assets/abyss-orb-range.png",
  "abyss-orb-bomb": "assets/abyss-orb-bomb.png",
  "abyss-orb-shield": "assets/abyss-orb-shield.png",
  "abyss-enemy-0": "assets/abyss-enemy-0.png",
  "abyss-enemy-1": "assets/abyss-enemy-1.png",
  "abyss-enemy-2": "assets/abyss-enemy-2.png",
};

const toColor = (hex) => Phaser.Display.Color.IntegerToColor(hex);

function drawBubble(g, x, y, radius, fill, edge = 0xffffff, alpha = 1) {
  g.fillStyle(fill, alpha);
  g.fillCircle(x, y, radius);
  g.lineStyle(2, edge, 0.4);
  g.strokeCircle(x, y, radius);
  g.fillStyle(0xffffff, 0.5);
  g.fillCircle(x - radius * 0.35, y - radius * 0.35, Math.max(3, radius * 0.22));
}

function roundedTexture(scene, key, width, height, fill, stroke, drawExtra) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  g.fillStyle(fill, 1);
  g.fillRoundedRect(2, 2, width - 4, height - 4, 8);
  g.lineStyle(2, stroke, 0.45);
  g.strokeRoundedRect(2, 2, width - 4, height - 4, 8);
  if (drawExtra) drawExtra(g);
  g.generateTexture(key, width, height);
  g.destroy();
}

function preloadCustomHeroAssets(scene) {
  if (!scene.textures.exists(SHADOW_HERO_SHEET_KEY)) {
    scene.load.image(SHADOW_HERO_SHEET_KEY, SHADOW_HERO_SHEET_PATH);
  }

  Object.entries(EMBER_HERO_ASSET_PATHS).forEach(([key, assetPath]) => {
    if (!scene.textures.exists(key)) {
      scene.load.image(key, assetPath);
    }
  });

  Object.entries(VOLT_HERO_ASSET_PATHS).forEach(([key, assetPath]) => {
    if (!scene.textures.exists(key)) {
      scene.load.image(key, assetPath);
    }
  });

  Object.entries(WIND_HERO_ASSET_PATHS).forEach(([key, assetPath]) => {
    if (!scene.textures.exists(key)) {
      scene.load.image(key, assetPath);
    }
  });

  Object.entries(TECH_MAP_ASSET_PATHS).forEach(([key, assetPath]) => {
    if (!scene.textures.exists(key)) {
      scene.load.image(key, assetPath);
    }
  });
}

function createGameTextures(scene) {
  roundedTexture(scene, "tile-floor-a", 40, 40, 0x171d22, 0x454b54, (g) => {
    g.lineStyle(1, 0x2a3038, 0.82);
    g.lineBetween(4, 34, 34, 4);
    g.lineStyle(1, 0xff4452, 0.32);
    g.lineBetween(6, 30, 28, 30);
    g.fillStyle(0x58e8ff, 0.08);
    g.fillCircle(31, 10, 4);
  });

  roundedTexture(scene, "tile-floor-b", 40, 40, 0x12181e, 0x3b424c, (g) => {
    g.lineStyle(1, 0x252b34, 0.78);
    g.lineBetween(0, 39, 39, 0);
    g.fillStyle(0xff4452, 0.1);
    g.fillRoundedRect(7, 28, 23, 3, 2);
    g.fillStyle(0x7df4d4, 0.055);
    g.fillRoundedRect(26, 7, 7, 7, 2);
  });

  roundedTexture(scene, "wall-solid", 40, 40, 0x20343b, 0x7ddff0, (g) => {
    g.fillStyle(0x0e1a20, 0.42);
    g.fillRoundedRect(8, 6, 24, 28, 6);
    g.fillStyle(0x58e8ff, 0.28);
    g.fillRoundedRect(13, 8, 14, 4, 2);
  });

  roundedTexture(scene, "box-breakable", 40, 40, 0x8d6038, 0xffc46c, (g) => {
    g.lineStyle(3, 0x4a3022, 0.8);
    g.lineBetween(8, 10, 32, 30);
    g.lineBetween(32, 10, 8, 30);
    g.fillStyle(0xffad45, 0.28);
    g.fillRoundedRect(10, 6, 20, 5, 3);
  });

  roundedTexture(scene, "homeland-floor-a", 40, 40, 0x14120f, 0x8f6f32, (g) => {
    g.lineStyle(1, 0xcaa14a, 0.25);
    g.lineBetween(5, 31, 33, 8);
    g.fillStyle(0xcaa14a, 0.08);
    g.fillCircle(30, 10, 4);
  });

  roundedTexture(scene, "homeland-floor-b", 40, 40, 0x0f0d0b, 0x584622, (g) => {
    g.lineStyle(1, 0x6c5124, 0.45);
    g.lineBetween(0, 39, 39, 0);
    g.fillStyle(0xcaa14a, 0.08);
    g.fillRoundedRect(8, 28, 20, 3, 2);
  });

  roundedTexture(scene, "homeland-wall", 40, 40, 0x17130e, 0xcaa14a, (g) => {
    g.fillStyle(0x2a2115, 1);
    g.fillRoundedRect(7, 7, 26, 26, 5);
    g.lineStyle(2, 0xcaa14a, 0.42);
    g.lineBetween(8, 10, 32, 30);
  });

  roundedTexture(scene, "homeland-box", 40, 40, 0x382817, 0xcaa14a, (g) => {
    g.lineStyle(3, 0x0b0907, 0.76);
    g.lineBetween(9, 10, 31, 30);
    g.lineBetween(31, 10, 9, 30);
    g.fillStyle(0xcaa14a, 0.34);
    g.fillRoundedRect(14, 17, 12, 5, 2);
  });

  if (!scene.textures.exists("bomb")) {
    const g = scene.add.graphics();
    drawBubble(g, 20, 22, 14, 0x1b2931, 0x58e8ff, 1);
    g.lineStyle(3, 0x58e8ff, 0.9);
    g.beginPath();
    g.arc(25, 11, 8, Phaser.Math.DegToRad(205), Phaser.Math.DegToRad(305));
    g.strokePath();
    g.fillStyle(0xffad45, 1);
    g.fillCircle(31, 8, 3);
    g.generateTexture("bomb", 40, 40);
    g.destroy();
  }

  if (!scene.textures.exists("homeland-bomb")) {
    const g = scene.add.graphics();
    drawBubble(g, 20, 22, 14, 0x18130d, 0xcaa14a, 1);
    g.lineStyle(3, 0xcaa14a, 0.9);
    g.beginPath();
    g.arc(25, 11, 8, Phaser.Math.DegToRad(205), Phaser.Math.DegToRad(305));
    g.strokePath();
    g.fillStyle(0xffd777, 1);
    g.fillCircle(31, 8, 3);
    g.generateTexture("homeland-bomb", 40, 40);
    g.destroy();
  }

  if (!scene.textures.exists("explosion")) {
    const g = scene.add.graphics();
    g.fillStyle(0x58e8ff, 0.78);
    g.fillCircle(20, 20, 18);
    g.fillStyle(0xf8ffff, 0.75);
    g.fillCircle(20, 20, 10);
    g.lineStyle(2, 0xfff0a3, 0.8);
    g.strokeCircle(20, 20, 16);
    g.generateTexture("explosion", 40, 40);
    g.destroy();
  }

  createItem(scene, "item-range", 0x58e8ff, "+");
  createItem(scene, "item-bomb", 0xffad45, "B");
  createItem(scene, "item-speed", 0xffe14a, "S");
  createItem(scene, "item-energy-orb", 0x6dff96, "E");
  createItem(scene, "item-shield", 0x9a7cff, "盾");
  HEROES.forEach((hero) => createHero(scene, hero));
  ENEMY_TYPES.forEach((enemy, index) => createEnemy(scene, enemy, index));
  createHomelandEnemies(scene);
  createMapPreview(scene, "map-preview-inferno", 0xff4452, 0x58e8ff, 0x090d12);
  createMapPreview(scene, "map-preview-homeland", 0xcaa14a, 0x5c3712, 0x0a0908);

  // ── Programmatic fallbacks for map-specific texture keys ──
  // These ensure the game still looks correct even when running from
  // file:// protocol (where browser blocks PNG loading) or if any
  // PNG asset fails to load.  Each fallback copies an existing
  // programmatic texture to the key the map config expects.
  ensureMapTextureFallbacks(scene);
}

/**
 * Copy a source texture to a new key if that key doesn't already exist.
 * This creates programmatic fallbacks for PNG-only texture keys.
 */
function textureFallback(scene, targetKey, sourceKey) {
  if (scene.textures.exists(targetKey)) return;
  if (!scene.textures.exists(sourceKey)) return;
  const src = scene.textures.get(sourceKey).getSourceImage();
  if (!src) return;
  const canvas = scene.textures.createCanvas(targetKey, src.width, src.height);
  if (!canvas || !canvas.context) return;
  canvas.context.drawImage(src, 0, 0);
  canvas.refresh();
}

/**
 * Ensure all map texture keys referenced in config.js have a texture.
 * Called after createGameTextures() so the programmatic base textures exist.
 */
function ensureMapTextureFallbacks(scene) {
  // ── Inferno map (v3/v4 keys) ──
  textureFallback(scene, "inferno-v3-floor-a", "tile-floor-a");
  textureFallback(scene, "inferno-v3-floor-b", "tile-floor-b");
  textureFallback(scene, "inferno-v3-wall", "wall-solid");
  textureFallback(scene, "inferno-v3-box", "box-breakable");
  textureFallback(scene, "inferno-v3-bomb", "bomb");
  textureFallback(scene, "inferno-v3-explosion", "explosion");
  textureFallback(scene, "inferno-v3-orb-energy", "item-energy-orb");
  textureFallback(scene, "inferno-v3-orb-speed", "item-speed");
  textureFallback(scene, "inferno-v3-orb-range", "item-range");
  textureFallback(scene, "inferno-v3-orb-bomb", "item-bomb");
  textureFallback(scene, "inferno-v3-orb-shield", "item-shield");
  textureFallback(scene, "inferno-v3-enemy-0", "enemy-bot");
  textureFallback(scene, "inferno-v3-enemy-1", "enemy-drone");
  textureFallback(scene, "inferno-v3-enemy-2", "enemy-dummy");

  // Also handle base inferno keys (non-v3 fallback)
  textureFallback(scene, "inferno-floor-a", "tile-floor-a");
  textureFallback(scene, "inferno-floor-b", "tile-floor-b");
  textureFallback(scene, "inferno-wall", "wall-solid");
  textureFallback(scene, "inferno-box", "box-breakable");
  textureFallback(scene, "inferno-bomb", "bomb");
  textureFallback(scene, "inferno-explosion", "explosion");
  textureFallback(scene, "inferno-orb-energy", "item-energy-orb");
  textureFallback(scene, "inferno-orb-speed", "item-speed");
  textureFallback(scene, "inferno-orb-range", "item-range");
  textureFallback(scene, "inferno-orb-bomb", "item-bomb");
  textureFallback(scene, "inferno-orb-shield", "item-shield");
  textureFallback(scene, "inferno-enemy-0", "enemy-bot");
  textureFallback(scene, "inferno-enemy-1", "enemy-drone");
  textureFallback(scene, "inferno-enemy-2", "enemy-dummy");

  // ── Homeland map (v3 keys) ──
  textureFallback(scene, "homeland-v3-floor-a", "homeland-floor-a");
  textureFallback(scene, "homeland-v3-floor-b", "homeland-floor-b");
  textureFallback(scene, "homeland-v3-wall", "homeland-wall");
  textureFallback(scene, "homeland-v3-box", "homeland-box");
  textureFallback(scene, "homeland-v3-bomb", "homeland-bomb");
  textureFallback(scene, "homeland-v3-explosion", "explosion");
  textureFallback(scene, "homeland-v3-orb-energy", "item-energy-orb");
  textureFallback(scene, "homeland-v3-orb-speed", "item-speed");
  textureFallback(scene, "homeland-v3-orb-range", "item-range");
  textureFallback(scene, "homeland-v3-orb-bomb", "item-bomb");
  textureFallback(scene, "homeland-v3-orb-shield", "item-shield");
  textureFallback(scene, "homeland-v3-enemy-0", "homeland-enemy-0");
  textureFallback(scene, "homeland-v3-enemy-1", "homeland-enemy-1");
  textureFallback(scene, "homeland-v3-enemy-2", "homeland-enemy-2");

  // ── Abyss map ──
  textureFallback(scene, "abyss-floor-a", "tile-floor-a");
  textureFallback(scene, "abyss-floor-b", "tile-floor-b");
  textureFallback(scene, "abyss-wall", "wall-solid");
  textureFallback(scene, "abyss-bomb-blackhole", "bomb");
  textureFallback(scene, "abyss-explosion", "explosion");
  textureFallback(scene, "abyss-orb-energy", "item-energy-orb");
  textureFallback(scene, "abyss-orb-speed", "item-speed");
  textureFallback(scene, "abyss-orb-range", "item-range");
  textureFallback(scene, "abyss-orb-bomb", "item-bomb");
  textureFallback(scene, "abyss-orb-shield", "item-shield");
  textureFallback(scene, "abyss-enemy-0", "enemy-bot");
  textureFallback(scene, "abyss-enemy-1", "enemy-drone");
  textureFallback(scene, "abyss-enemy-2", "enemy-dummy");

  // ── Abyss portal textures (create simple colored circles) ──
  createPortalTexture(scene, "abyss-portal-purple-idle", 0x9a7cff, false);
  createPortalTexture(scene, "abyss-portal-purple-open", 0x9a7cff, true);
  createPortalTexture(scene, "abyss-portal-gold-idle", 0xffad45, false);
  createPortalTexture(scene, "abyss-portal-gold-open", 0xffad45, true);

  // ── Map preview for abyss ──
  createMapPreview(scene, "map-preview-abyss", 0x9a7cff, 0x58e8ff, 0x070b12);

  // ── Map preview for abyss ──
  createMapPreview(scene, "map-preview-abyss", 0x9a7cff, 0x58e8ff, 0x070b12);

  // ── UI background fallbacks (for file:// mode) ──
  createMenuBgFallback(scene, "menu-hero-ensemble-v1", 0x03070d, 0xff4452);
  createMenuBgFallback(scene, "menu-spoon-wallpaper-v2", 0x061016, 0x58e8ff);

  // ── Result art fallbacks ──
  HEROES.forEach((hero) => {
    createResultArtFallback(scene, `result-${hero.id}-win-v1`, hero.accent, "WIN");
    createResultArtFallback(scene, `result-${hero.id}-lose-v1`, 0x444444, "LOSE");
  });

  // ── Shadow-hero sheet fallback (generate hero textures if sheet missing) ──
  // This is already handled inside createShadowHeroTextures().
}

/**
 * Draw a simple dark background with radial glow as fallback for menu wallpapers.
 */
function createMenuBgFallback(scene, key, bgColor, accent) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  const w = 1280;
  const h = 760;
  // Fill solid background
  g.fillStyle(bgColor, 1);
  g.fillRect(0, 0, w, h);
  // Radial glow accent
  g.fillStyle(accent, 0.08);
  g.fillCircle(w / 2, h / 2, 400);
  // Scan-line hint
  g.lineStyle(1, accent, 0.04);
  for (let y = 0; y < h; y += 8) {
    g.lineBetween(0, y, w, y);
  }
  g.generateTexture(key, w, h);
  g.destroy();
}

/**
 * Draw a simple result banner as fallback for hero result art.
 */
function createResultArtFallback(scene, key, color, label) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  const w = 280;
  const h = 200;
  g.fillStyle(0x081116, 1);
  g.fillRoundedRect(0, 0, w, h, 16);
  g.lineStyle(3, color, 0.7);
  g.strokeRoundedRect(2, 2, w - 4, h - 4, 15);
  g.fillStyle(color, 0.2);
  g.fillCircle(w / 2, h / 2, 60);
  g.generateTexture(key, w, h);
  g.destroy();
}
function createPortalTexture(scene, key, color, isOpen) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  const size = 40;
  // Outer glow
  g.fillStyle(color, isOpen ? 0.9 : 0.45);
  g.fillCircle(size / 2, size / 2, size / 2 - 2);
  // Inner ring
  g.lineStyle(3, 0xffffff, isOpen ? 0.8 : 0.3);
  g.strokeCircle(size / 2, size / 2, size / 4);
  if (isOpen) {
    // Bright center for open portal
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(size / 2, size / 2, size / 6);
  }
  g.generateTexture(key, size, size);
  g.destroy();
}

function createMenuMascotTexture(scene, sourceKey, textureKey) {
  if (scene.textures.exists(textureKey) || !scene.textures.exists(sourceKey)) return;

  const sourceImage = scene.textures.get(sourceKey)?.getSourceImage?.();
  if (!sourceImage) return;

  const size = 240;
  const stickerCanvas = scene.textures.createCanvas(textureKey, size, size);
  const ctx = stickerCanvas.context;
  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = "rgba(8, 17, 22, 0.78)";
  ctx.beginPath();
  ctx.ellipse(122, 206, 70, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  drawStickerBubble(ctx, 118, 112, 88, "#58e8ff", "#ffad45");

  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = 176;
  faceCanvas.height = 176;
  const faceCtx = faceCanvas.getContext("2d");
  const cover = coverCrop(sourceImage.width, sourceImage.height, 148, 148);
  faceCtx.drawImage(
    sourceImage,
    cover.sx,
    cover.sy,
    cover.sw,
    cover.sh,
    14,
    12,
    148,
    148,
  );
  const faceData = faceCtx.getImageData(0, 0, faceCanvas.width, faceCanvas.height);
  const pixels = faceData.data;
  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const alpha = pixels[index + 3];

    if (alpha === 0) continue;
    if (red > 236 && green > 236 && blue > 236) {
      pixels[index + 3] = 0;
      continue;
    }

    pixels[index] = posterize(red, 5, 1.08);
    pixels[index + 1] = posterize(green, 5, 1.05);
    pixels[index + 2] = posterize(blue, 5, 1.02);
  }
  faceCtx.putImageData(faceData, 0, 0);

  ctx.save();
  ctx.translate(117, 110);
  ctx.rotate(Phaser.Math.DegToRad(-8));
  ctx.drawImage(faceCanvas, -87, -87, 174, 174);
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(117, 110, 95, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(88,232,255,0.85)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(117, 110, 104, Phaser.Math.DegToRad(206), Phaser.Math.DegToRad(340));
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,173,69,0.92)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(117, 110, 104, Phaser.Math.DegToRad(28), Phaser.Math.DegToRad(168));
  ctx.stroke();

  ctx.fillStyle = "#09171c";
  roundRect(ctx, 54, 172, 126, 35, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 2;
  roundRect(ctx, 54, 172, 126, 35, 14);
  ctx.stroke();

  ctx.fillStyle = "#58e8ff";
  ctx.font = '900 16px "Microsoft YaHei", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("小SPOON", 117, 190);

  drawSpark(ctx, 34, 56, 14, "#ffad45");
  drawSpark(ctx, 199, 48, 11, "#58e8ff");
  drawSpark(ctx, 196, 176, 9, "#7df4d4");
  drawBubbleAccent(ctx, 36, 136, 16, "#7df4d4");
  drawBubbleAccent(ctx, 206, 126, 13, "#9a7cff");
  drawBubbleAccent(ctx, 176, 28, 10, "#58e8ff");

  stickerCanvas.refresh();
}

function createItem(scene, key, color, label) {
  if (scene.textures.exists(key)) return;
  const baseKey = `${key}-base`;
  const g = scene.add.graphics();
  drawBubble(g, 20, 20, 13, color, 0xffffff, 0.95);
  g.fillStyle(0x09171c, 0.86);
  g.fillCircle(20, 20, 8);
  g.generateTexture(baseKey, 40, 40);
  g.destroy();

  const text = scene.add.text(20, 20, label, {
    fontFamily: '"Microsoft YaHei", sans-serif',
    fontSize: label.length > 1 ? "10px" : "13px",
    color: "#ffffff",
    fontStyle: "700",
  });
  text.setOrigin(0.5);
  const rt = scene.add.renderTexture(0, 0, 40, 40);
  rt.draw(baseKey, 0, 0);
  rt.draw(text, 0, 0);
  rt.saveTexture(key);
  text.destroy();
  rt.destroy();
  scene.textures.remove(baseKey);
}

function createHero(scene, hero) {
  if (hero.id === "shadow" && scene.textures.exists(SHADOW_HERO_SHEET_KEY)) {
    createShadowHeroTextures(scene, hero);
    return;
  }

  const directions = [
    { key: hero.texture, facing: "down" },
    { key: `${hero.texture}-back`, facing: "up" },
    { key: `${hero.texture}-left`, facing: "left" },
    { key: `${hero.texture}-right`, facing: "right" },
  ];
  directions.forEach((dir) => {
    if (!scene.textures.exists(dir.key)) {
      createHeroTextureVariant(scene, hero, dir.key, 1, dir.facing);
    }
  });

  const posterKey = `${hero.texture}-poster`;
  if (!scene.textures.exists(posterKey)) {
    createHeroTextureVariant(scene, hero, posterKey, 4, "down");
  }
}

function createHeroTextureVariant(scene, hero, textureKey, scale = 1, facing = "down") {
  if (scene.textures.exists(textureKey)) return;

  const width = Math.round(64 * scale);
  const height = Math.round(68 * scale);
  const color = toColor(hero.accent);
  const dark = Phaser.Display.Color.GetColor(
    Math.max(20, color.red * 0.2),
    Math.max(22, color.green * 0.2),
    Math.max(32, color.blue * 0.28),
  );
  const g = scene.add.graphics();
  const px = (value) => Math.round(value * scale);
  const stroke = Math.max(2, Math.round(2 * scale));

  g.fillStyle(0x081116, 0.72);
  g.fillEllipse(px(32), px(58), px(36), px(13));
  g.fillStyle(0x18242c, 1);
  g.fillRoundedRect(px(19), px(30), px(26), px(29), px(10));
  g.fillStyle(dark, 1);
  g.fillRoundedRect(px(16), px(26), px(32), px(31), px(11));
  g.fillStyle(hero.accent, 0.32);
  g.fillRoundedRect(px(21), px(34), px(22), px(19), px(8));
  g.lineStyle(stroke, hero.accent, 0.5);
  g.lineBetween(px(20), px(42), px(44), px(42));

  const isBack = facing === "up";
  const isLeft = facing === "left";
  const isRight = facing === "right";

  if (hero.id === "shadow") {
    g.fillStyle(isBack ? 0x0f0d1f : 0x16132a, 1);
    g.fillTriangle(px(13), px(29), px(32), px(3), px(51), px(29));
    g.fillCircle(px(32), px(27), px(18));
    g.fillStyle(0x0b121c, 1);
    g.fillRoundedRect(px(20), px(23), px(24), px(13), px(7));
    if (!isBack) {
      g.fillStyle(0x78dfff, 0.95);
      if (isLeft) {
        g.fillCircle(px(24), px(29), px(4));
      } else if (isRight) {
        g.fillCircle(px(40), px(29), px(4));
      } else {
        g.fillCircle(px(26), px(29), px(4));
        g.fillCircle(px(38), px(29), px(4));
      }
    }
    g.fillStyle(0x9a7cff, 0.6);
    g.fillTriangle(px(17), px(37), px(5), px(60), px(24), px(49));
    drawBubble(g, px(10), px(45), px(7), hero.accent, 0xffffff, 0.9);
  } else if (hero.id === "ember") {
    g.fillStyle(isBack ? 0xb87620 : 0xff9b2f, 1);
    g.fillRoundedRect(px(16), px(10), px(32), px(23), px(10));
    g.fillStyle(0x2c1d16, 1);
    g.fillRoundedRect(px(14), px(27), px(36), px(10), px(5));
    g.fillStyle(isBack ? 0x2a160c : 0x341d12, 1);
    g.fillCircle(px(32), px(27), px(14));
    g.fillStyle(isBack ? 0xc2906b : 0xffd6a1, 1);
    g.fillCircle(px(32), px(30), px(12));
    if (!isBack) {
      g.fillStyle(0x111820, 1);
      if (isLeft) {
        g.fillCircle(px(25), px(29), Math.max(2, px(2)));
      } else if (isRight) {
        g.fillCircle(px(39), px(29), Math.max(2, px(2)));
      } else {
        g.fillCircle(px(27), px(29), Math.max(2, px(2)));
        g.fillCircle(px(37), px(29), Math.max(2, px(2)));
      }
      g.lineStyle(stroke, 0x5a2b15, 1);
      g.lineBetween(px(27), px(35), px(37), px(35));
    }
    drawBubble(g, px(11), px(45), px(7), hero.accent, 0xffffff, 0.9);
    drawBubble(g, px(52), px(43), px(6), hero.accent, 0xffffff, 0.85);
  } else if (hero.id === "volt") {
    g.fillStyle(isBack ? 0x0d2538 : 0x14314a, 1);
    g.fillCircle(px(32), px(26), px(14));
    g.fillStyle(0x0f2234, 1);
    g.fillTriangle(px(20), px(20), px(29), px(4), px(31), px(22));
    g.fillTriangle(px(31), px(18), px(43), px(5), px(39), px(23));
    g.fillStyle(isBack ? 0xb89c34 : 0xffe14a, 1);
    g.fillTriangle(px(43), px(6), px(35), px(28), px(47), px(20));
    g.fillStyle(isBack ? 0x8ab0b6 : 0xd9faff, 1);
    g.fillCircle(px(32), px(30), px(11));
    if (!isBack) {
      g.fillStyle(0x0b1b26, 1);
      if (isLeft) {
        g.fillCircle(px(25), px(29), Math.max(2, px(2)));
      } else if (isRight) {
        g.fillCircle(px(39), px(29), Math.max(2, px(2)));
      } else {
        g.fillCircle(px(27), px(29), Math.max(2, px(2)));
        g.fillCircle(px(37), px(29), Math.max(2, px(2)));
      }
    }
    g.lineStyle(stroke, hero.accent, 0.8);
    g.lineBetween(px(6), px(39), px(16), px(32));
    g.lineBetween(px(48), px(36), px(58), px(28));
    drawBubble(g, px(12), px(47), px(7), hero.accent, 0xffffff, 0.9);
  } else {
    g.fillStyle(isBack ? 0xbccad1 : 0xeaf7ff, 1);
    g.fillCircle(px(32), px(27), px(14));
    g.fillTriangle(px(20), px(17), px(11), px(31), px(28), px(24));
    g.fillTriangle(px(33), px(12), px(48), px(24), px(34), px(26));
    g.fillStyle(isBack ? 0xa4bac2 : 0xdaf3ff, 1);
    g.fillCircle(px(32), px(31), px(11));
    if (!isBack) {
      g.fillStyle(0x0f2330, 1);
      if (isLeft) {
        g.fillCircle(px(25), px(30), Math.max(2, px(2)));
      } else if (isRight) {
        g.fillCircle(px(39), px(30), Math.max(2, px(2)));
      } else {
        g.fillCircle(px(27), px(30), Math.max(2, px(2)));
        g.fillCircle(px(37), px(30), Math.max(2, px(2)));
      }
    }
    g.fillStyle(hero.accent, 0.76);
    if (isLeft) {
      g.fillTriangle(px(10), px(38), px(24), px(47), px(11), px(52));
    } else if (isRight) {
      g.fillTriangle(px(43), px(38), px(59), px(47), px(42), px(52));
    } else {
      g.fillTriangle(px(43), px(38), px(59), px(47), px(42), px(52));
    }
    g.lineStyle(stroke, hero.accent, 0.65);
    g.beginPath();
    g.arc(px(16), px(46), px(11), Phaser.Math.DegToRad(260), Phaser.Math.DegToRad(80));
    g.strokePath();
    drawBubble(g, px(12), px(46), px(7), hero.accent, 0xffffff, 0.88);
  }

  g.fillStyle(hero.accent, 0.9);
  g.fillRoundedRect(px(22), px(53), px(7), px(9), px(3));
  g.fillRoundedRect(px(35), px(53), px(7), px(9), px(3));

  const arrowColor = 0xffffff;
  if (isBack) {
    g.fillStyle(arrowColor, 0.6);
    g.fillTriangle(px(32), px(4), px(26), px(11), px(38), px(11));
  } else if (isLeft) {
    g.fillStyle(arrowColor, 0.6);
    g.fillTriangle(px(8), px(10), px(16), px(6), px(16), px(14));
  } else if (isRight) {
    g.fillStyle(arrowColor, 0.6);
    g.fillTriangle(px(56), px(10), px(48), px(6), px(48), px(14));
  }

  g.generateTexture(textureKey, width, height);
  g.destroy();
}

function createHeroTexture(scene, hero, textureKey, scale = 1) {
  createHeroTextureVariant(scene, hero, textureKey, scale, "down");
}

function createShadowHeroTextures(scene, hero) {
  const sourceImage = scene.textures.get(SHADOW_HERO_SHEET_KEY)?.getSourceImage?.();
  if (!sourceImage) {
    ["down", "up", "left", "right"].forEach((facing) => {
      const key = facing === "down" ? hero.texture : `${hero.texture}-${facing === "up" ? "back" : facing}`;
      createHeroTextureVariant(scene, hero, key, 1, facing);
    });
    createHeroTextureVariant(scene, hero, `${hero.texture}-poster`, 4, "down");
    return;
  }

  const crops = {
    front: { sx: 34, sy: 242, sw: 384, sh: 412 },
    back: { sx: 430, sy: 248, sw: 406, sh: 408 },
    left: { sx: 854, sy: 266, sw: 348, sh: 390 },
    right: { sx: 1238, sy: 270, sw: 372, sh: 394 },
  };

  createShadowHeroTexture(scene, hero.texture, sourceImage, crops.front, 64, 68, 2);
  createShadowHeroTexture(scene, `${hero.texture}-back`, sourceImage, crops.back, 64, 68, 2);
  createShadowHeroTexture(scene, `${hero.texture}-left`, sourceImage, crops.left, 64, 68, 2);
  createShadowHeroTexture(scene, `${hero.texture}-right`, sourceImage, crops.right, 64, 68, 2);
  createShadowHeroTexture(scene, `${hero.texture}-poster`, sourceImage, crops.front, 256, 272, 10);
}

function createShadowHeroTexture(scene, textureKey, sourceImage, crop, width, height, bottomPadding) {
  if (scene.textures.exists(textureKey)) return;

  const canvasTexture = scene.textures.createCanvas(textureKey, width, height);
  const ctx = canvasTexture.context;
  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;

  const availableHeight = height - bottomPadding;
  const scale = Math.min(width / crop.sw, availableHeight / crop.sh);
  const drawWidth = crop.sw * scale;
  const drawHeight = crop.sh * scale;
  const drawX = (width - drawWidth) / 2;
  const drawY = availableHeight - drawHeight;

  ctx.drawImage(
    sourceImage,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  );

  canvasTexture.refresh();
}

function createEnemy(scene, enemy, index) {
  if (scene.textures.exists(enemy.texture)) return;
  const g = scene.add.graphics();
  const shape = index === 1 ? "drone" : index === 2 ? "dummy" : "bot";
  g.fillStyle(0x0d1b22, 1);
  g.fillEllipse(22, 37, 28, 10);
  if (shape === "drone") {
    drawBubble(g, 22, 22, 14, enemy.accent, 0xffffff, 0.88);
    g.fillStyle(0x0a151b, 0.85);
    g.fillRoundedRect(15, 18, 14, 9, 4);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(19, 22, 2);
    g.fillCircle(25, 22, 2);
  } else if (shape === "dummy") {
    g.fillStyle(0x27333b, 1);
    g.fillRoundedRect(9, 8, 26, 31, 10);
    g.lineStyle(3, enemy.accent, 0.9);
    g.strokeRoundedRect(12, 11, 20, 24, 8);
    g.fillStyle(enemy.accent, 0.95);
    g.fillCircle(22, 23, 5);
  } else {
    g.fillStyle(0x23343c, 1);
    g.fillRoundedRect(9, 11, 26, 26, 9);
    g.fillStyle(enemy.accent, 0.92);
    g.fillRoundedRect(14, 18, 16, 6, 3);
    g.lineStyle(2, enemy.accent, 0.8);
    g.lineBetween(10, 14, 4, 8);
    g.lineBetween(34, 14, 40, 8);
  }
  g.generateTexture(enemy.texture, 44, 44);
  g.destroy();
}

function createHomelandEnemies(scene) {
  for (let index = 0; index < 3; index += 1) {
    const key = `homeland-enemy-${index}`;
    if (scene.textures.exists(key)) continue;
    const g = scene.add.graphics();
    g.fillStyle(0x050505, 0.48);
    g.fillEllipse(22, 37, 28, 10);
    g.fillStyle(index === 1 ? 0x2a1f12 : 0x211b13, 1);
    g.fillRoundedRect(9, 9, 26, 29, 8);
    g.lineStyle(2, 0xcaa14a, 0.86);
    g.strokeRoundedRect(11, 11, 22, 25, 7);
    g.fillStyle(0x050505, 0.82);
    g.fillRoundedRect(14, 18, 16, 7, 3);
    g.fillStyle(0xffd777, 0.95);
    g.fillCircle(18, 22, 2);
    g.fillCircle(26, 22, 2);
    if (index === 2) {
      g.fillStyle(0x5c3712, 0.82);
      g.fillTriangle(13, 15, 22, 4, 31, 15);
    }
    g.generateTexture(key, 44, 44);
    g.destroy();
  }
}

function createMapPreview(scene, key, accent, secondary, fill) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  g.fillStyle(fill, 1);
  g.fillRoundedRect(0, 0, 420, 250, 12);
  g.lineStyle(4, accent, 0.76);
  g.strokeRoundedRect(18, 18, 384, 214, 12);
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 11; col += 1) {
      const x = 48 + col * 30;
      const y = 48 + row * 24;
      const border = row === 0 || row === 6 || col === 0 || col === 10;
      const openHomeland = key.includes("homeland") && (row === 3 || col === 5);
      const block = border || (!openHomeland && col % 2 === 0 && row % 2 === 0);
      g.fillStyle(block ? accent : ((col * 7 + row * 5) % 5 === 0 ? secondary : 0x171b20), block ? 0.58 : 0.62);
      g.fillRoundedRect(x, y, 22, 16, 2);
    }
  }
  if (key.includes("homeland")) {
    [120, 210, 300].forEach((x, index) => {
      const y = 88 + index * 42;
      g.lineStyle(2, accent, 0.68);
      g.strokeCircle(x, y, 18);
      g.lineBetween(x - 12, y, x + 12, y);
      g.lineBetween(x, y - 12, x, y + 12);
    });
  }
  g.generateTexture(key, 420, 250);
  g.destroy();
}

function coverCrop(width, height, targetWidth, targetHeight) {
  const targetRatio = targetWidth / targetHeight;
  const sourceRatio = width / height;
  if (sourceRatio > targetRatio) {
    const sw = height * targetRatio;
    return { sx: (width - sw) / 2, sy: 0, sw, sh: height };
  }
  const sh = width / targetRatio;
  return { sx: 0, sy: (height - sh) / 2, sw: width, sh };
}

function posterize(value, levels, contrast) {
  const stepped = Math.round((value / 255) * (levels - 1)) * (255 / (levels - 1));
  return Phaser.Math.Clamp((stepped - 128) * contrast + 128, 0, 255);
}

function drawStickerBubble(ctx, x, y, radius, mainColor, accentColor) {
  const gradient = ctx.createRadialGradient(x - 24, y - 28, 12, x, y, radius + 18);
  gradient.addColorStop(0, "rgba(255,255,255,0.34)");
  gradient.addColorStop(0.35, "rgba(88,232,255,0.24)");
  gradient.addColorStop(1, "rgba(8,17,22,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius + 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(11, 24, 32, 0.88)";
  ctx.beginPath();
  ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
  ctx.fill();

  const ring = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
  ring.addColorStop(0, mainColor);
  ring.addColorStop(1, accentColor);
  ctx.strokeStyle = ring;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.ellipse(x - radius * 0.34, y - radius * 0.42, radius * 0.3, radius * 0.16, Phaser.Math.DegToRad(-24), 0, Math.PI * 2);
  ctx.fill();
}

function drawBubbleAccent(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.86;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.68)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.52)";
  ctx.beginPath();
  ctx.arc(x - radius * 0.3, y - radius * 0.28, Math.max(2, radius * 0.24), 0, Math.PI * 2);
  ctx.fill();
}

function drawSpark(ctx, x, y, radius, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(radius * 0.34, -radius * 0.34);
  ctx.lineTo(radius, 0);
  ctx.lineTo(radius * 0.34, radius * 0.34);
  ctx.lineTo(0, radius);
  ctx.lineTo(-radius * 0.34, radius * 0.34);
  ctx.lineTo(-radius, 0);
  ctx.lineTo(-radius * 0.34, -radius * 0.34);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
Object.assign(__bundle, { SHADOW_HERO_SHEET_KEY, SHADOW_HERO_SHEET_PATH, EMBER_HERO_ASSET_PATHS, VOLT_HERO_ASSET_PATHS, WIND_HERO_ASSET_PATHS, TECH_MAP_ASSET_PATHS, preloadCustomHeroAssets, createGameTextures, createMenuMascotTexture });
}

// multiplayer/MatchConfig.js
{
const { HEROES } = __bundle;
const heroIds = () => HEROES.map((hero) => hero.id);

const DEFAULT_MATCH_CONFIG = {
  playerCount: 1,
  aiCount: 3,
  playerHeroes: [HEROES[0].id],
};

function normalizeMatchConfig(config = {}) {
  const playerCount = Number(config.playerCount) === 2 ? 2 : 1;
  const minAi = playerCount === 1 ? 1 : 0;
  const maxAi = 4 - playerCount;
  const requestedAi = Number.isFinite(Number(config.aiCount)) ? Number(config.aiCount) : maxAi;
  const aiCount = Math.max(minAi, Math.min(maxAi, Math.floor(requestedAi)));
  const validIds = heroIds();
  const first = validIds.includes(config.playerHeroes?.[0]) ? config.playerHeroes[0] : validIds[0];
  const playerHeroes = [first];

  if (playerCount === 2) {
    const requestedSecond = config.playerHeroes?.[1];
    const second = validIds.includes(requestedSecond) && requestedSecond !== first
      ? requestedSecond
      : validIds.find((id) => id !== first);
    playerHeroes.push(second);
  }

  return { playerCount, aiCount, playerHeroes };
}

function matchConfigWith(config, changes) {
  return normalizeMatchConfig({ ...config, ...changes });
}
Object.assign(__bundle, { DEFAULT_MATCH_CONFIG, normalizeMatchConfig, matchConfigWith });
}

// multiplayer/KeyboardInputRouter.js
{
const CONTROL_CODES = new Set([
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "Space", "KeyQ", "KeyP", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight",
]);

const asList = (value) => Array.isArray(value) ? value : [value];

function normalizedCode(event) {
  if (!event) return "";
  if (event.code === "Shift" || (!event.code && event.key === "Shift")) {
    return event.location === 2 ? "ShiftRight" : "ShiftLeft";
  }
  if (event.code === "Control" || (!event.code && event.key === "Control")) {
    return event.location === 2 ? "ControlRight" : "ControlLeft";
  }
  return event.code || "";
}

class KeyboardInputRouter {
  constructor(keyboard = null, nativeTarget = typeof window !== "undefined" ? window : null) {
    this.keyboard = keyboard;
    this.nativeTarget = nativeTarget;
    this.down = new Set();
    this.pressed = new Set();
    this.onKeyDown = (event) => this.handleKeyDown(event);
    this.onKeyUp = (event) => this.handleKeyUp(event);
    keyboard?.on?.("keydown", this.onKeyDown);
    keyboard?.on?.("keyup", this.onKeyUp);
    nativeTarget?.addEventListener?.("keydown", this.onKeyDown, true);
    nativeTarget?.addEventListener?.("keyup", this.onKeyUp, true);
  }

  handleKeyDown(event) {
    const code = normalizedCode(event);
    if (!code) return;
    if (CONTROL_CODES.has(code)) event.preventDefault?.();
    if (!this.down.has(code)) this.pressed.add(code);
    this.down.add(code);
  }

  handleKeyUp(event) {
    const code = normalizedCode(event);
    if (!code) return;
    if (CONTROL_CODES.has(code)) event.preventDefault?.();
    this.down.delete(code);
  }

  isDown(codes) {
    return asList(codes).some((code) => this.down.has(code));
  }

  wasPressed(codes) {
    return asList(codes).some((code) => this.pressed.has(code));
  }

  endFrame() {
    this.pressed.clear();
  }

  destroy() {
    this.keyboard?.off?.("keydown", this.onKeyDown);
    this.keyboard?.off?.("keyup", this.onKeyUp);
    this.nativeTarget?.removeEventListener?.("keydown", this.onKeyDown, true);
    this.nativeTarget?.removeEventListener?.("keyup", this.onKeyUp, true);
    this.down.clear();
    this.pressed.clear();
  }
}

function createInputProfiles(playerCount = 1) {
  if (playerCount === 2) {
    return [
      {
        movement: { left: ["KeyA"], right: ["KeyD"], up: ["KeyW"], down: ["KeyS"] },
        bomb: ["ControlLeft"],
        ultimate: ["KeyQ"],
      },
      {
        movement: { left: ["ArrowLeft"], right: ["ArrowRight"], up: ["ArrowUp"], down: ["ArrowDown"] },
        bomb: ["ControlRight"],
        ultimate: ["KeyP"],
      },
    ];
  }

  return [{
    movement: {
      left: ["KeyA", "ArrowLeft"], right: ["KeyD", "ArrowRight"],
      up: ["KeyW", "ArrowUp"], down: ["KeyS", "ArrowDown"],
    },
    bomb: ["Space"],
    ultimate: ["ShiftLeft", "ShiftRight"],
  }];
}
Object.assign(__bundle, { KeyboardInputRouter, createInputProfiles });
}

// multiplayer/CombatantRegistry.js
{
class CombatantRegistry {
  constructor() {
    this.entries = new Map();
  }

  register(actor, metadata = {}) {
    if (!actor?.ownerId) throw new Error("Combatants require an ownerId");
    actor.combatantKind = metadata.kind || actor.combatantKind || "ai";
    actor.combatantSlot = metadata.slot ?? actor.combatantSlot ?? 0;
    this.entries.set(actor.ownerId, actor);
    return actor;
  }

  get(ownerId) {
    return this.entries.get(ownerId) || null;
  }

  all() {
    return [...this.entries.values()];
  }

  alive() {
    return this.all().filter((actor) => actor.alive);
  }

  players() {
    return this.all().filter((actor) => actor.combatantKind === "player");
  }

  opponentsOf(ownerId) {
    return this.alive().filter((actor) => actor.ownerId !== ownerId);
  }

  outcome() {
    const alive = this.alive();
    if (alive.length > 1) return null;
    if (alive.length === 1) return { type: "winner", winner: alive[0] };
    return { type: "draw", winner: null };
  }
}
Object.assign(__bundle, { CombatantRegistry });
}

// systems/CombatSystem.js
{
const { COMBAT_CONFIG } = __bundle;
const clamp = (value, min, max) => {
  if (globalThis.Phaser?.Math?.Clamp) return Phaser.Math.Clamp(value, min, max);
  return Math.min(max, Math.max(min, value));
};

function nowFrom(scene, fallback = 0) {
  return typeof scene?.time?.now === "number" ? scene.time.now : fallback;
}

function emit(scene, eventName, payload) {
  scene?.events?.emit?.(eventName, payload);
}

function initializeCombatState(actor, time = 0) {
  actor.maxHp = COMBAT_CONFIG.maxHp;
  actor.hp = COMBAT_CONFIG.maxHp;
  actor.alive = actor.alive !== false;
  actor.shieldActive = false;
  actor.shieldEndsAt = 0;
  actor.lastOffenseAt = time;
  actor.lastDamageAt = -Infinity;
  actor.invulnerableUntil = actor.invulnerableUntil || 0;
  actor.slowUntil = 0;
  actor.slowMultiplier = 1;
  actor.slowReason = null;
  actor.stats = actor.stats || {};
  if (actor.stats.shield === undefined || actor.stats.shield === null) actor.stats.shield = 0;
  return actor;
}

function markOffense(actor, time = 0) {
  if (!actor) return;
  actor.lastOffenseAt = time;
}

function regenerateHealth(actor, scene, delta = 0) {
  if (!actor?.alive || actor.hp >= actor.maxHp) return actor?.hp ?? 0;
  const now = nowFrom(scene);
  const lastPressureAt = Math.max(actor.lastOffenseAt ?? 0, actor.lastDamageAt ?? -Infinity);
  if (now - lastPressureAt < COMBAT_CONFIG.regenDelayMs) return actor.hp;

  const rate =
    actor.hero?.id === "volt" || actor.heroId === "volt"
      ? COMBAT_CONFIG.voltRegenPerSecond
      : COMBAT_CONFIG.regenPerSecond;
  const nextHp = clamp(actor.hp + rate * (delta / 1000), 0, actor.maxHp);
  if (nextHp !== actor.hp) {
    actor.hp = nextHp;
    emit(scene, "actor-health-changed", actor);
    if (actor.ownerId === "player") emit(scene, "player-stats-changed");
  }
  return actor.hp;
}

function grantTimedShield(actor, scene, time = nowFrom(scene)) {
  if (!actor?.alive) return false;
  actor.shieldActive = true;
  actor.shieldEndsAt = time + COMBAT_CONFIG.shieldDurationMs;
  actor.stats = actor.stats || {};
  actor.stats.shield = 1;
  ensureShieldEffect(actor, scene);
  updateCombatVisuals(actor, scene);
  emit(scene, actor.ownerId === "player" ? "player-stats-changed" : "actor-shield-changed", actor);
  return true;
}

function expireShieldIfNeeded(actor, sceneOrTime) {
  if (!actor?.shieldActive) return false;
  const now = typeof sceneOrTime === "number" ? sceneOrTime : nowFrom(sceneOrTime);
  if (now <= actor.shieldEndsAt) return false;
  clearShield(actor, typeof sceneOrTime === "number" ? null : sceneOrTime);
  return true;
}

function clearShield(actor, scene = null) {
  if (!actor) return;
  actor.shieldActive = false;
  actor.shieldEndsAt = 0;
  actor.stats = actor.stats || {};
  actor.stats.shield = 0;
  actor.shieldEffect?.destroy?.();
  actor.shieldEffect = null;
  emit(scene, actor.ownerId === "player" ? "player-stats-changed" : "actor-shield-changed", actor);
}

function applyDamage(actor, amount, reason = "damage", scene, time = nowFrom(scene)) {
  if (!actor?.alive) {
    return { ignored: true, shielded: false, damaged: false, defeated: false, hp: actor?.hp ?? 0, reason };
  }

  expireShieldIfNeeded(actor, scene ?? time);

  if (time < (actor.invulnerableUntil || 0)) {
    return { ignored: true, shielded: false, damaged: false, defeated: false, hp: actor.hp, reason };
  }

  if (actor.shieldActive) {
    actor.lastDamageAt = time;
    clearShield(actor, scene);
    flashActor(actor, scene, 0x9a7cff);
    emit(scene, actor.ownerId === "player" ? "player-shield-used" : "actor-shield-used", { actor, reason });
    return { ignored: false, shielded: true, damaged: false, defeated: false, hp: actor.hp, reason };
  }

  actor.hp = clamp((actor.hp ?? COMBAT_CONFIG.maxHp) - amount, 0, actor.maxHp || COMBAT_CONFIG.maxHp);
  actor.lastDamageAt = time;
  flashActor(actor, scene, damageTint(reason));
  emit(scene, "actor-health-changed", actor);
  if (actor.ownerId === "player") emit(scene, "player-stats-changed");
  const defeated = actor.hp <= 0;
  return { ignored: false, shielded: false, damaged: true, defeated, hp: actor.hp, reason };
}

function applySlow(actor, scene, durationMs, multiplier = COMBAT_CONFIG.slowMultiplier, reason = "slow", time = nowFrom(scene)) {
  if (!actor?.alive || durationMs <= 0) return false;
  const now = time;
  actor.slowUntil = Math.max(actor.slowUntil || 0, now + durationMs);
  actor.slowMultiplier = Math.min(actor.slowMultiplier || 1, multiplier);
  actor.slowReason = reason;
  ensureSlowEffect(actor, scene);
  updateStatusEffects(actor, scene);
  return true;
}

function clearSlow(actor) {
  if (!actor) return;
  actor.slowUntil = 0;
  actor.slowMultiplier = 1;
  actor.slowReason = null;
  actor.slowEffect?.destroy?.();
  actor.slowEffect = null;
}

function updateStatusEffects(actor, scene) {
  if (!actor) return;
  const now = nowFrom(scene);
  if (!actor.alive || (actor.slowUntil || 0) <= now) {
    if ((actor.slowMultiplier || 1) !== 1 || actor.slowEffect) clearSlow(actor);
    return;
  }

  actor.slowMultiplier = actor.slowMultiplier || COMBAT_CONFIG.slowMultiplier;
  if (actor.slowEffect && actor.sprite) {
    actor.slowEffect.setPosition?.(actor.sprite.x, actor.sprite.y - 24);
    const remainingRatio = clamp((actor.slowUntil - now) / COMBAT_CONFIG.shadowSlowDurationMs, 0, 1);
    actor.slowEffect.setAlpha?.(0.28 + remainingRatio * 0.48);
  }
}

function updateCombatVisuals(actor, scene) {
  if (!actor) return;
  expireShieldIfNeeded(actor, scene);
  updateStatusEffects(actor, scene);
  if (actor.shieldActive) ensureShieldEffect(actor, scene);
  if (actor.shieldEffect && actor.sprite) {
    actor.shieldEffect.setPosition?.(actor.sprite.x, actor.sprite.y);
    const remaining = Math.max(0, actor.shieldEndsAt - nowFrom(scene));
    const alpha = 0.28 + Math.min(1, remaining / COMBAT_CONFIG.shieldDurationMs) * 0.34;
    actor.shieldEffect.setAlpha?.(alpha);
  }
  updateHealthBar(actor, scene);
}

function ensureSlowEffect(actor, scene) {
  if (actor.slowEffect || !actor.sprite) return;
  if (scene?.add?.text) {
    actor.slowEffect = scene.add
      .text(actor.sprite.x, actor.sprite.y - 24, "vvv", {
        fontFamily: "Arial",
        fontSize: "12px",
        color: "#9ad8ff",
        fontStyle: "900",
      })
      .setOrigin?.(0.5)
      ?.setDepth?.((actor.sprite.depth || 6) + 5);
    return;
  }
  if (scene?.add?.circle) {
    actor.slowEffect = scene.add
      .circle(actor.sprite.x, actor.sprite.y - 24, 8, 0x7df4d4, 0.24)
      .setDepth?.((actor.sprite.depth || 6) + 5)
      ?.setStrokeStyle?.(2, 0x9ad8ff, 0.72);
  }
}

function ensureShieldEffect(actor, scene) {
  if (actor.shieldEffect || !scene?.add?.circle || !actor.sprite) return;
  actor.shieldEffect = scene.add
    .circle(actor.sprite.x, actor.sprite.y, 23, 0x7cf7ff, 0.18)
    .setDepth?.((actor.sprite.depth || 6) + 1)
    ?.setStrokeStyle?.(3, 0xc7f7ff, 0.8);
}

function flashActor(actor, scene, tint) {
  if (!actor?.sprite) return;
  actor.sprite.setTint?.(tint);
  scene?.time?.delayedCall?.(120, () => actor.sprite?.clearTint?.());
}

function updateHealthBar(actor, scene) {
  if (!actor?.sprite || !scene?.add?.rectangle) return;
  if (!actor.alive) {
    actor.healthBarBg?.destroy?.();
    actor.healthBarFill?.destroy?.();
    actor.healthBarBg = null;
    actor.healthBarFill = null;
    return;
  }

  if (!actor.healthBarBg) {
    actor.healthBarBg = scene.add
      .rectangle(actor.sprite.x, actor.sprite.y - 30, 30, 4, 0x12080a, 0.78)
      .setDepth?.((actor.sprite.depth || 6) + 3);
    actor.healthBarFill = scene.add
      .rectangle(actor.sprite.x - 15, actor.sprite.y - 30, 30, 4, 0x58ff8a, 0.92)
      .setOrigin?.(0, 0.5)
      ?.setDepth?.((actor.sprite.depth || 6) + 4);
  }

  actor.healthBarBg?.setPosition?.(actor.sprite.x, actor.sprite.y - 30);
  actor.healthBarFill?.setPosition?.(actor.sprite.x - 15, actor.sprite.y - 30);
  const ratio = clamp((actor.hp ?? actor.maxHp) / (actor.maxHp || COMBAT_CONFIG.maxHp), 0, 1);
  actor.healthBarFill.width = Math.max(0, 30 * ratio);
  const color = ratio > 0.55 ? 0x58ff8a : ratio > 0.25 ? 0xffd777 : 0xff4452;
  actor.healthBarFill?.setFillStyle?.(color, 0.92);
}

function damageTint(reason) {
  if (reason === "ember-aura") return 0xff7a1f;
  if (reason === "ember-afterburn") return 0xff5a1f;
  if (reason === "wind-shock") return 0x7df4d4;
  if (reason === "wind-trail") return 0x7df4d4;
  if (reason === "shadow-beam") return 0x9a7cff;
  if (reason === "volt-meteor") return 0x79ff8c;
  if (reason === "meteor") return 0xffd777;
  return 0xff4b4b;
}
Object.assign(__bundle, { initializeCombatState, markOffense, regenerateHealth, grantTimedShield, expireShieldIfNeeded, clearShield, applyDamage, applySlow, clearSlow, updateStatusEffects, updateCombatVisuals });
}

// systems/MapSystem.js
{
const { CELL, GAME_CONFIG, SPAWN_POINTS, getMapConfig } = __bundle;
const systems_MapSystem_js_keyOf = (col, row) => `${col},${row}`;

class MapSystem {
  constructor(scene, mapId = "inferno") {
    this.scene = scene;
    this.mapId = mapId;
    this.mapConfig = getMapConfig(mapId);
    this.cells = [];
    this.tileSprites = new Map();
    this.boxSprites = new Map();
    this.bombs = new Map();
    this.explosions = new Set();
  }

  create() {
    this.staticGroup = this.scene.add.group();
    this.boxGroup = this.scene.add.group();
    this.buildCells();
    this.drawMap();
  }

  buildCells() {
    if (this.mapConfig.layout === "abyss") {
      this.buildAbyssCells();
      return;
    }
    if (this.mapConfig.layout === "homeland") {
      this.buildHomelandCells();
      return;
    }
    this.buildInfernoCells();
  }

  buildAbyssCells() {
    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      this.cells[row] = [];
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        const boundary =
          row === 0 ||
          col === 0 ||
          row === GAME_CONFIG.GRID_ROWS - 1 ||
          col === GAME_CONFIG.GRID_COLS - 1;
        this.cells[row][col] = boundary ? CELL.SOLID_WALL : CELL.EMPTY;
      }
    }
  }

  buildInfernoCells() {
    // Deterministic arena generation keeps the MVP replayable while preserving
    // safe spawn corridors for the player and all three enemies.
    const safe = new Set([
      systems_MapSystem_js_keyOf(1, 1),
      systems_MapSystem_js_keyOf(1, 2),
      systems_MapSystem_js_keyOf(2, 1),
      systems_MapSystem_js_keyOf(13, 11),
      systems_MapSystem_js_keyOf(13, 10),
      systems_MapSystem_js_keyOf(12, 11),
      systems_MapSystem_js_keyOf(13, 1),
      systems_MapSystem_js_keyOf(13, 2),
      systems_MapSystem_js_keyOf(12, 1),
      systems_MapSystem_js_keyOf(1, 11),
      systems_MapSystem_js_keyOf(1, 10),
      systems_MapSystem_js_keyOf(2, 11),
    ]);

    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      this.cells[row] = [];
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        const border = row === 0 || col === 0 || row === GAME_CONFIG.GRID_ROWS - 1 || col === GAME_CONFIG.GRID_COLS - 1;
        const pillar = col % 2 === 0 && row % 2 === 0;
        if (border || pillar) {
          this.cells[row][col] = CELL.SOLID_WALL;
        } else if (!safe.has(systems_MapSystem_js_keyOf(col, row)) && this.shouldPlaceBox(col, row)) {
          this.cells[row][col] = CELL.BREAKABLE_BOX;
        } else {
          this.cells[row][col] = CELL.EMPTY;
        }
      }
    }

    SPAWN_POINTS.enemies.forEach((cell) => {
      this.cells[cell.row][cell.col] = CELL.EMPTY;
    });
    this.cells[SPAWN_POINTS.player.row][SPAWN_POINTS.player.col] = CELL.EMPTY;
  }

  buildHomelandCells() {
    const safe = new Set([
      systems_MapSystem_js_keyOf(1, 1),
      systems_MapSystem_js_keyOf(1, 2),
      systems_MapSystem_js_keyOf(2, 1),
      systems_MapSystem_js_keyOf(13, 11),
      systems_MapSystem_js_keyOf(13, 10),
      systems_MapSystem_js_keyOf(12, 11),
      systems_MapSystem_js_keyOf(13, 1),
      systems_MapSystem_js_keyOf(13, 2),
      systems_MapSystem_js_keyOf(12, 1),
      systems_MapSystem_js_keyOf(1, 11),
      systems_MapSystem_js_keyOf(1, 10),
      systems_MapSystem_js_keyOf(2, 11),
      systems_MapSystem_js_keyOf(7, 6),
      systems_MapSystem_js_keyOf(7, 5),
      systems_MapSystem_js_keyOf(7, 7),
      systems_MapSystem_js_keyOf(6, 6),
      systems_MapSystem_js_keyOf(8, 6),
    ]);
    const openCross = new Set();
    for (let col = 1; col < GAME_CONFIG.GRID_COLS - 1; col += 1) openCross.add(systems_MapSystem_js_keyOf(col, 6));
    for (let row = 1; row < GAME_CONFIG.GRID_ROWS - 1; row += 1) openCross.add(systems_MapSystem_js_keyOf(7, row));
    for (let col = 3; col <= 11; col += 1) {
      openCross.add(systems_MapSystem_js_keyOf(col, 3));
      openCross.add(systems_MapSystem_js_keyOf(col, 9));
    }

    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      this.cells[row] = [];
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        const border = row === 0 || col === 0 || row === GAME_CONFIG.GRID_ROWS - 1 || col === GAME_CONFIG.GRID_COLS - 1;
        const pillar = col % 2 === 0 && row % 2 === 0 && !openCross.has(systems_MapSystem_js_keyOf(col, row));
        if (border || pillar) {
          this.cells[row][col] = CELL.SOLID_WALL;
        } else if (!safe.has(systems_MapSystem_js_keyOf(col, row)) && !openCross.has(systems_MapSystem_js_keyOf(col, row)) && this.shouldPlaceHomelandBox(col, row)) {
          this.cells[row][col] = CELL.BREAKABLE_BOX;
        } else {
          this.cells[row][col] = CELL.EMPTY;
        }
      }
    }

    SPAWN_POINTS.enemies.forEach((cell) => {
      this.cells[cell.row][cell.col] = CELL.EMPTY;
    });
    this.cells[SPAWN_POINTS.player.row][SPAWN_POINTS.player.col] = CELL.EMPTY;
  }

  shouldPlaceBox(col, row) {
    const pattern = (col * 11 + row * 7 + col * row) % 10;
    return pattern < 5 || (col + row) % 7 === 0;
  }

  shouldPlaceHomelandBox(col, row) {
    const pattern = (col * 13 + row * 5 + col * row * 3) % 12;
    return pattern < 4 || (col + row) % 8 === 0;
  }

  drawMap() {
    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        const { x, y } = this.cellToWorld(col, row);
        const floorKey = (col + row) % 2 === 0 ? this.mapConfig.textures.floorA : this.mapConfig.textures.floorB;
        const floor = this.scene.add.image(x, y, floorKey).setDepth(0);
        this.staticGroup.add(floor);

        if (this.cells[row][col] === CELL.SOLID_WALL) {
          const wall = this.scene.add.image(x, y, this.mapConfig.textures.wall).setDepth(2);
          this.staticGroup.add(wall);
          this.tileSprites.set(systems_MapSystem_js_keyOf(col, row), wall);
        }

        if (this.cells[row][col] === CELL.BREAKABLE_BOX) {
          this.addBoxSprite(col, row);
        }
      }
    }
  }

  addBoxSprite(col, row) {
    const { x, y } = this.cellToWorld(col, row);
    const box = this.scene.add.image(x, y, this.mapConfig.textures.box).setDepth(3);
    this.boxGroup.add(box);
    this.boxSprites.set(systems_MapSystem_js_keyOf(col, row), box);
  }

  cellToWorld(col, row) {
    return {
      x: GAME_CONFIG.BOARD_OFFSET_X + col * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
      y: GAME_CONFIG.BOARD_OFFSET_Y + row * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
    };
  }

  worldToCell(x, y) {
    return {
      col: Math.floor((x - GAME_CONFIG.BOARD_OFFSET_X) / GAME_CONFIG.TILE_SIZE),
      row: Math.floor((y - GAME_CONFIG.BOARD_OFFSET_Y) / GAME_CONFIG.TILE_SIZE),
    };
  }

  isInside(col, row) {
    return col >= 0 && row >= 0 && col < GAME_CONFIG.GRID_COLS && row < GAME_CONFIG.GRID_ROWS;
  }

  getCell(col, row) {
    if (!this.isInside(col, row)) return CELL.SOLID_WALL;
    return this.cells[row][col];
  }

  hasBomb(col, row) {
    return this.bombs.has(systems_MapSystem_js_keyOf(col, row));
  }

  isBlocked(col, row, ignoreBombKey = null, traversal = {}) {
    if (!this.isInside(col, row)) {
      return true;
    }
    const key = systems_MapSystem_js_keyOf(col, row);
    const cell = this.getCell(col, row);
    const phaseWalls = traversal.phaseWalls === true;
    const phaseBombs = traversal.phaseBombs === true;
    const boundaryWall =
      cell === CELL.SOLID_WALL &&
      (col === 0 || row === 0 || col === GAME_CONFIG.GRID_COLS - 1 || row === GAME_CONFIG.GRID_ROWS - 1);

    if (boundaryWall) {
      return true;
    }

    if (!phaseWalls && (cell === CELL.SOLID_WALL || cell === CELL.BREAKABLE_BOX)) {
      return true;
    }

    return !phaseBombs && cell === CELL.EMPTY && this.bombs.has(key) && key !== ignoreBombKey;
  }

  canMoveToWorld(x, y, radius, ignoreBombKey = null, traversal = {}) {
    // Sample the four corners of a small collision box so characters slide
    // along walls instead of snapping from cell center to cell center.
    const samples = [
      this.worldToCell(x - radius, y - radius),
      this.worldToCell(x + radius, y - radius),
      this.worldToCell(x - radius, y + radius),
      this.worldToCell(x + radius, y + radius),
    ];
    return samples.every((sample) => !this.isBlocked(sample.col, sample.row, ignoreBombKey, traversal));
  }

  overlapsCellWorld(x, y, radius, cellKey) {
    const samples = [
      this.worldToCell(x - radius, y - radius),
      this.worldToCell(x + radius, y - radius),
      this.worldToCell(x - radius, y + radius),
      this.worldToCell(x + radius, y + radius),
    ];
    return samples.some((sample) => systems_MapSystem_js_keyOf(sample.col, sample.row) === cellKey);
  }

  overlappedBombKeyWorld(x, y, radius) {
    const samples = [
      this.worldToCell(x - radius, y - radius),
      this.worldToCell(x + radius, y - radius),
      this.worldToCell(x - radius, y + radius),
      this.worldToCell(x + radius, y + radius),
      this.worldToCell(x, y),
    ];
    const hit = samples.find((sample) => this.bombs.has(systems_MapSystem_js_keyOf(sample.col, sample.row)));
    return hit ? systems_MapSystem_js_keyOf(hit.col, hit.row) : null;
  }

  placeBomb(col, row, bomb) {
    this.bombs.set(systems_MapSystem_js_keyOf(col, row), bomb);
  }

  removeBomb(col, row) {
    this.bombs.delete(systems_MapSystem_js_keyOf(col, row));
  }

  destroyBox(col, row) {
    if (this.getCell(col, row) !== CELL.BREAKABLE_BOX) return false;
    this.cells[row][col] = CELL.EMPTY;
    const key = systems_MapSystem_js_keyOf(col, row);
    const sprite = this.boxSprites.get(key);
    if (sprite) {
      this.scene.tweens.add({
        targets: sprite,
        alpha: 0,
        scale: 1.22,
        angle: 8,
        duration: 150,
        onComplete: () => sprite.destroy(),
      });
      this.boxSprites.delete(key);
    }
    return true;
  }

  markExplosion(col, row) {
    this.explosions.add(systems_MapSystem_js_keyOf(col, row));
  }

  clearExplosion(col, row) {
    this.explosions.delete(systems_MapSystem_js_keyOf(col, row));
  }

  hasExplosionAt(col, row) {
    return this.explosions.has(systems_MapSystem_js_keyOf(col, row));
  }
}
Object.assign(__bundle, { MapSystem });
}

// systems/ItemSystem.js
{
const { CELL, ENERGY_ORB_CONFIG, GAME_CONFIG, ITEM_TYPES, getItemDisplay } = __bundle;
const systems_ItemSystem_js_keyOf = (col, row) => `${col},${row}`;

class ItemSystem {
  constructor(scene, mapSystem) {
    this.scene = scene;
    this.map = mapSystem;
    this.items = new Map();
    this.spawnConfig = mapSystem.mapConfig?.orbField || ENERGY_ORB_CONFIG;
    this.nextEnergyOrbAt = this.spawnConfig.spawnIntervalMs;
  }

  maybeDrop(col, row) {
    if (Math.random() > GAME_CONFIG.ITEM_DROP_RATE) return;
    const itemType = Phaser.Utils.Array.GetRandom(ITEM_TYPES);
    this.createItem(col, row, itemType);
  }

  createItem(col, row, itemType, options = {}) {
    const key = systems_ItemSystem_js_keyOf(col, row);
    if (this.items.has(key)) return;
    const { x, y } = this.map.cellToWorld(col, row);
    const texture = this.map.mapConfig?.itemTextures?.[itemType.id] || itemType.texture;
    const themedType = texture === itemType.texture ? itemType : { ...itemType, texture };
    const sprite = this.scene.add.image(x, y, themedType.texture).setDepth(4);
    const bobTween = this.scene.tweens.add({
      targets: sprite,
      y: y - 4,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    const item = { col, row, type: themedType, sprite, bobTween, kind: options.kind || "pickup", expireEvent: null };
    if (options.lifetimeMs) {
      item.expireEvent = this.scene.time.delayedCall(options.lifetimeMs, () => {
        this.removeAt(col, row);
      });
    }
    this.items.set(key, item);
    return item;
  }

  pickupAt(col, row, playerSystem) {
    const key = systems_ItemSystem_js_keyOf(col, row);
    const item = this.items.get(key);
    if (!item) return null;
    if (item.type.id === ENERGY_ORB_CONFIG.id && playerSystem.abilitySystem?.isActive?.()) {
      return null;
    }
    item.type.apply(playerSystem);
    this.destroyItem(key, item);
    this.scene.events.emit("item-picked", getItemDisplay(item.type.id, item.type.label).label);
    return item.type;
  }

  pickupByActor(col, row, actor, eventName = "item-picked") {
    const key = systems_ItemSystem_js_keyOf(col, row);
    const item = this.items.get(key);
    if (!item) return null;
    if (item.type.id === ENERGY_ORB_CONFIG.id) return null;
    item.type.apply(actor);
    this.destroyItem(key, item);
    this.scene.events.emit(eventName, getItemDisplay(item.type.id, item.type.label).label);
    return item.type;
  }

  nearest(cell, maxDistance = 8) {
    let best = null;
    this.items.forEach((item) => {
      if (item.type.id === ENERGY_ORB_CONFIG.id) return;
      const distance = Math.abs(item.col - cell.col) + Math.abs(item.row - cell.row);
      if (distance <= maxDistance && (!best || distance < best.distance)) {
        best = { ...item, distance };
      }
    });
    return best;
  }

  removeAt(col, row) {
    const key = systems_ItemSystem_js_keyOf(col, row);
    const item = this.items.get(key);
    if (!item) return;
    this.destroyItem(key, item);
  }

  update(time, actors = []) {
    if (time < this.nextEnergyOrbAt) return;

    while (this.nextEnergyOrbAt <= time) {
      this.nextEnergyOrbAt += this.spawnConfig.spawnIntervalMs;
      this.spawnEnergyOrb(actors);
    }
  }

  spawnEnergyOrb(actors = []) {
    if (this.map.mapConfig?.orbField?.enabled) {
      return this.spawnMapOrb(actors);
    }
    if (this.countEnergyOrbs() >= this.spawnConfig.maxActive) return null;
    const candidates = [];

    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        if (this.canSpawnEnergyOrbAt(col, row, actors)) {
          candidates.push({ col, row });
        }
      }
    }

    if (!candidates.length) return null;
    const cell = Phaser.Utils.Array.GetRandom(candidates);
    this.createItem(cell.col, cell.row, {
      id: ENERGY_ORB_CONFIG.id,
      label: ENERGY_ORB_CONFIG.label,
      texture: ENERGY_ORB_CONFIG.texture,
      apply(playerSystem) {
        playerSystem.addEnergy?.(ENERGY_ORB_CONFIG.chargeAmount);
      },
    }, {
      kind: "energy-orb",
      lifetimeMs: this.spawnConfig.lifetimeMs,
    });
    return cell;
  }

  spawnMapOrb(actors = []) {
    if (this.countEnergyOrbs() >= this.spawnConfig.maxActive) return null;
    const candidates = [];
    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        if (this.canSpawnEnergyOrbAt(col, row, actors)) candidates.push({ col, row });
      }
    }
    if (!candidates.length) return null;
    const cell = Phaser.Utils.Array.GetRandom(candidates);
    const typeId = this.pickWeightedOrbType();
    return this.createMapOrb(cell, typeId);
  }

  pickWeightedOrbType() {
    const weights = this.spawnConfig.weights || { [ENERGY_ORB_CONFIG.id]: 1 };
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = Math.random() * total;
    for (const [id, weight] of entries) {
      roll -= weight;
      if (roll <= 0) return id;
    }
    return entries.at(-1)?.[0] || ENERGY_ORB_CONFIG.id;
  }

  createMapOrb(cell, typeId) {
    const baseType = typeId === ENERGY_ORB_CONFIG.id
      ? {
          id: ENERGY_ORB_CONFIG.id,
          label: ENERGY_ORB_CONFIG.label,
          texture: ENERGY_ORB_CONFIG.texture,
          apply(actor) {
            actor.addEnergy?.(ENERGY_ORB_CONFIG.chargeAmount);
          },
        }
      : ITEM_TYPES.find((item) => item.id === typeId);
    if (!baseType) return null;
    const itemType = {
      ...baseType,
      texture: this.spawnConfig.textures?.[typeId] || baseType.texture,
    };
    return this.createItem(cell.col, cell.row, itemType, {
      kind: "map-orb",
      lifetimeMs: this.spawnConfig.lifetimeMs,
    });
  }

  countEnergyOrbs() {
    let total = 0;
    this.items.forEach((item) => {
      if (item.kind === "energy-orb" || item.kind === "map-orb") total += 1;
    });
    return total;
  }

  canSpawnEnergyOrbAt(col, row, actors = []) {
    if (this.map.getCell(col, row) !== CELL.EMPTY) return false;
    if (this.map.hasBomb(col, row) || this.map.hasExplosionAt(col, row)) return false;
    if (this.items.has(systems_ItemSystem_js_keyOf(col, row))) return false;
    if (this.isPortalCell(col, row)) return false;

    return actors.every((actor) => {
      if (!actor?.alive || !actor.currentCell) return true;
      const cell = actor.currentCell(actor);
      return cell.col !== col || cell.row !== row;
    });
  }

  isPortalCell(col, row) {
    if (!this.map.mapConfig?.portal?.enabled) return false;
    return (
      (row === 6 && (col === 1 || col === 13)) ||
      (col === 7 && (row === 1 || row === 11))
    );
  }

  destroyItem(key, item) {
    item.expireEvent?.remove?.();
    this.scene.tweens.killTweensOf?.(item.sprite);
    item.sprite.destroy();
    this.items.delete(key);
  }
}
Object.assign(__bundle, { ItemSystem });
}

// systems/BombSystem.js
{
const { GAME_CONFIG } = __bundle;
class BombSystem {
  constructor(scene, mapSystem) {
    this.scene = scene;
    this.map = mapSystem;
    this.explosionSystem = null;
    this.activeByOwner = new Map();
  }

  setExplosionSystem(explosionSystem) {
    this.explosionSystem = explosionSystem;
  }

  activeCount(ownerId) {
    return this.activeByOwner.get(ownerId) || 0;
  }

  placeBomb(ownerId, col, row, range, maxBombs, options = {}) {
    if (this.map.hasBomb(col, row) || this.map.isBlocked(col, row)) return null;
    if (this.activeCount(ownerId) >= maxBombs) return null;

    const { x, y } = this.map.cellToWorld(col, row);
    const texture = options.texture || this.map.mapConfig?.textures?.bomb || "bomb";
    const sprite = this.scene.add.image(x, y, texture).setDepth(5);
    this.scene.tweens.add({
      targets: sprite,
      scale: 1.12,
      duration: 360,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    const animation = this.map.mapConfig?.bombAnimation;
    if (animation) {
      this.scene.tweens.add({
        targets: sprite,
        angle: animation.rotation,
        duration: animation.durationMs,
        repeat: -1,
        ease: "Linear",
      });
    }

    const bomb = {
      ownerId,
      col,
      row,
      range: options.rangeOverride ?? range,
      sprite,
      exploded: false,
      explodeAt: this.scene.time.now + (options.fuseMs ?? GAME_CONFIG.BOMB_DELAY),
      explosionDurationMs: options.explosionDurationMs ?? GAME_CONFIG.EXPLOSION_DURATION,
      tags: options.tags || [],
    };
    this.map.placeBomb(col, row, bomb);
    this.activeByOwner.set(ownerId, this.activeCount(ownerId) + 1);
    this.scene.time.delayedCall(options.fuseMs ?? GAME_CONFIG.BOMB_DELAY, () => this.explode(bomb));
    return bomb;
  }

  explode(bomb) {
    if (!bomb || bomb.exploded) return;
    bomb.exploded = true;
    this.map.removeBomb(bomb.col, bomb.row);
    this.activeByOwner.set(bomb.ownerId, Math.max(0, this.activeCount(bomb.ownerId) - 1));
    this.scene.tweens.killTweensOf(bomb.sprite);
    bomb.sprite.destroy();
    this.explosionSystem.createExplosion(bomb.col, bomb.row, bomb.range, bomb.explosionDurationMs);
  }

  predictedDangerCells(extraBomb = null) {
    return new Set(this.predictedDangerMap(extraBomb).keys());
  }

  predictedDangerMap(extraBomb = null) {
    const now = this.scene.time.now;
    const danger = new Set();
    const timings = new Map();
    const bombs = [];
    this.map.bombs.forEach((bomb) => bombs.push(bomb));
    if (extraBomb) {
      bombs.push({
        ...extraBomb,
        explodeAt: extraBomb.explodeAt ?? now + GAME_CONFIG.BOMB_DELAY,
      });
    }
    bombs.forEach((bomb) => {
      const markDanger = (col, row) => {
        const key = `${col},${row}`;
        danger.add(key);
        const explodeAt = bomb.explodeAt ?? now + GAME_CONFIG.BOMB_DELAY;
        const previous = timings.get(key);
        if (!previous || explodeAt < previous.explodeAt) {
          timings.set(key, { explodeAt, bomb });
        }
      };

      markDanger(bomb.col, bomb.row);
      [
        { col: 1, row: 0 },
        { col: -1, row: 0 },
        { col: 0, row: 1 },
        { col: 0, row: -1 },
      ].forEach((dir) => {
        for (let step = 1; step <= bomb.range; step += 1) {
          const col = bomb.col + dir.col * step;
          const row = bomb.row + dir.row * step;
          const cell = this.map.getCell(col, row);
          if (cell === 1) break;
          markDanger(col, row);
          if (cell === 2) break;
        }
      });
    });
    return timings;
  }
}
Object.assign(__bundle, { BombSystem });
}

// systems/ExplosionSystem.js
{
const { CELL, COMBAT_CONFIG, GAME_CONFIG } = __bundle;
class ExplosionSystem {
  constructor(scene, mapSystem, itemSystem) {
    this.scene = scene;
    this.map = mapSystem;
    this.items = itemSystem;
    this.playerSystem = null;
    this.playerSystems = [];
    this.aiSystem = null;
    this.registry = null;
    this.activeSprites = [];
    this.pendingDrops = [];
    this.activeImpacts = new Map();
    this.nextImpactId = 1;
  }

  connect(playerSystem, aiSystem, registry = null) {
    this.playerSystems = Array.isArray(playerSystem) ? playerSystem : [playerSystem].filter(Boolean);
    this.playerSystem = this.playerSystems[0] || null;
    this.aiSystem = aiSystem;
    this.registry = registry;
  }

  createExplosion(col, row, range, durationMs = GAME_CONFIG.EXPLOSION_DURATION) {
    this.pendingDrops = [];
    const cells = this.calculateCells(col, row, range);
    const impact = {
      id: this.nextImpactId++,
      cells: new Set(cells.map((cell) => `${cell.col},${cell.row}`)),
      hitActors: new Set(),
    };
    this.activeImpacts.set(impact.id, impact);
    cells.forEach((cell) => {
      this.items.removeAt(cell.col, cell.row);
      this.map.markExplosion(cell.col, cell.row);
      const { x, y } = this.map.cellToWorld(cell.col, cell.row);
      const texture = this.map.mapConfig?.textures?.explosion || "explosion";
      const sprite = this.scene.add.image(x, y, texture).setDepth(8).setScale(0.55).setAlpha(0.96);
      this.activeSprites.push(sprite);
      this.scene.tweens.add({
        targets: sprite,
        scale: 0.96,
        angle: this.map.mapConfig?.theme === "homeland" ? 28 : 12,
        alpha: 0.08,
        duration: durationMs,
        ease: "Quad.easeOut",
      });
      this.scene.time.delayedCall(durationMs, () => {
        this.map.clearExplosion(cell.col, cell.row);
        sprite.destroy();
      });
    });
    this.scene.time.delayedCall(durationMs, () => {
      this.activeImpacts.delete(impact.id);
    });
    this.pendingDrops.forEach((cell) => {
      this.scene.time.delayedCall(durationMs + 20, () => this.items.maybeDrop(cell.col, cell.row));
    });
    this.checkActiveHits();
  }

  calculateCells(col, row, range) {
    // Bubble blasts propagate in a cross. Solid walls stop the ray immediately;
    // breakable boxes are included, destroyed, and then stop that ray.
    const cells = [{ col, row }];
    const directions = [
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
    ];

    directions.forEach((dir) => {
      for (let step = 1; step <= range; step += 1) {
        const nextCol = col + dir.col * step;
        const nextRow = row + dir.row * step;
        const cell = this.map.getCell(nextCol, nextRow);
        if (cell === CELL.SOLID_WALL) break;
        cells.push({ col: nextCol, row: nextRow });
        if (cell === CELL.BREAKABLE_BOX) {
          if (this.map.destroyBox(nextCol, nextRow)) {
            this.pendingDrops.push({ col: nextCol, row: nextRow });
          }
          break;
        }
      }
    });

    return cells;
  }

  checkActiveHits() {
    if (this.registry) {
      this.registry.alive().forEach((actor) => {
        const cell = actor.currentCell?.() || this.aiSystem?.currentCell?.(actor);
        if (!cell) return;
        const impacts = [
          ...this.impactsAt(cell.col, cell.row),
          ...this.adjacentImpactsWhileActorPhasing(actor, cell),
        ];
        const impact = impacts.find((item) => !item.hitActors.has(actor.ownerId));
        if (!impact) return;
        impact.hitActors.add(actor.ownerId);
        if (actor.combatantKind === "player") actor.hitByExplosion?.();
        else actor.takeDamage?.(COMBAT_CONFIG.bombDamage, "explosion");
      });
      return;
    }
    if (!this.playerSystem || !this.aiSystem) return;
    const playerCell = this.playerSystem.currentCell();
    const playerImpacts = [
      ...this.impactsAt(playerCell.col, playerCell.row),
      ...this.adjacentImpactsWhilePhasing(playerCell),
    ];
    const playerImpact = playerImpacts.find((impact) => !impact.hitActors.has("player"));
    if (playerImpact) {
      playerImpact.hitActors.add("player");
      this.playerSystem.hitByExplosion();
    }
    this.aiSystem.hitEnemiesInExplosions({
      canHitActor: (actorId, cell) => {
        const impact = this.impactsAt(cell.col, cell.row).find((item) => !item.hitActors.has(actorId));
        if (!impact) return false;
        impact.hitActors.add(actorId);
        return true;
      },
    });
  }

  playerTouchesAdjacentExplosionWhilePhasing(playerCell) {
    if (!this.playerSystem.isPhasingThroughWalls?.()) return false;
    if (this.map.getCell(playerCell.col, playerCell.row) !== CELL.SOLID_WALL) return false;

    return [
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
    ].some((dir) => this.map.hasExplosionAt(playerCell.col + dir.col, playerCell.row + dir.row));
  }

  impactsAt(col, row) {
    const key = `${col},${row}`;
    return [...this.activeImpacts.values()].filter((impact) => impact.cells.has(key));
  }

  adjacentImpactsWhilePhasing(playerCell) {
    if (!this.playerSystem.isPhasingThroughWalls?.()) return [];
    if (this.map.getCell(playerCell.col, playerCell.row) !== CELL.SOLID_WALL) return [];

    return [
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
    ].flatMap((dir) => this.impactsAt(playerCell.col + dir.col, playerCell.row + dir.row));
  }

  adjacentImpactsWhileActorPhasing(actor, actorCell) {
    if (!actor.isPhasingThroughWalls?.()) return [];
    if (this.map.getCell(actorCell.col, actorCell.row) !== CELL.SOLID_WALL) return [];
    return [
      { col: 1, row: 0 }, { col: -1, row: 0 },
      { col: 0, row: 1 }, { col: 0, row: -1 },
    ].flatMap((dir) => this.impactsAt(actorCell.col + dir.col, actorCell.row + dir.row));
  }
}
Object.assign(__bundle, { ExplosionSystem });
}

// systems/PlayerSystem.js
{
const { COMBAT_CONFIG, GAME_CONFIG, HEROES, SPAWN_POINTS, applyDamage, clearShield, clearSlow, grantTimedShield, initializeCombatState, markOffense, regenerateHealth, updateCombatVisuals } = __bundle;
const systems_PlayerSystem_js_keyOf = (col, row) => `${col},${row}`;
const directionalTextureForFacing = (hero, facing) => {
  const mapping = {
    down: hero.texture,
    up: `${hero.texture}-back`,
    left: `${hero.texture}-left`,
    right: `${hero.texture}-right`,
  };
  return mapping[facing] || hero.texture;
};

class PlayerSystem {
  constructor(scene, mapSystem, bombSystem, itemSystem, heroId, options = {}) {
    this.scene = scene;
    this.map = mapSystem;
    this.bombs = bombSystem;
    this.items = itemSystem;
    this.hero = HEROES.find((item) => item.id === heroId) || HEROES[0];
    this.stats = { ...GAME_CONFIG.PLAYER_START, ...(this.hero.baseStats || {}) };
    this.ownerId = options.ownerId || "player";
    this.playerSlot = options.playerSlot || 1;
    this.spawnCell = options.spawnCell || SPAWN_POINTS.player;
    this.inputRouter = options.inputRouter || null;
    this.inputProfile = options.inputProfile || null;
    this.placeCooldown = 0;
    this.ignoredBombKey = null;
    this.invulnerableUntil = 0;
    this.alive = true;
    this.facing = "down";
    this.currentTextureKey = null;
    this.abilitySystem = null;
    initializeCombatState(this, 0);
  }

  create() {
    const spawn = this.spawnCell;
    const { x, y } = this.map.cellToWorld(spawn.col, spawn.row);
    this.sprite = this.scene.add.image(x, y, this.hero.texture).setDepth(7);
    this.sprite.setData("role", "player");
    this.applyFacingTexture();

    if (this.inputRouter && this.inputProfile) return;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = this.scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });
    this.scene.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.SHIFT,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    ]);
  }

  update(time, delta) {
    if (!this.alive) return;
    regenerateHealth(this, this.scene, delta);
    updateCombatVisuals(this, this.scene);
    this.move(delta);
    this.pickupItem();
    this.tryPlaceBomb(time);
    this.tryActivateUltimate(time);
  }

  move(delta) {
    const routed = this.inputRouter && this.inputProfile;
    const left = routed ? this.inputRouter.isDown(this.inputProfile.movement.left) : this.cursors.left.isDown || this.keys.A.isDown;
    const right = routed ? this.inputRouter.isDown(this.inputProfile.movement.right) : this.cursors.right.isDown || this.keys.D.isDown;
    const up = routed ? this.inputRouter.isDown(this.inputProfile.movement.up) : this.cursors.up.isDown || this.keys.W.isDown;
    const down = routed ? this.inputRouter.isDown(this.inputProfile.movement.down) : this.cursors.down.isDown || this.keys.S.isDown;
    const rawDx = Number(right) - Number(left);
    const rawDy = Number(down) - Number(up);
    this.updateFacing(rawDx, rawDy);

    let dx = rawDx;
    let dy = rawDy;
    if (dx === 0 && dy === 0) return;

    const length = Math.hypot(dx, dy) || 1;
    dx /= length;
    dy /= length;
    const movement =
      this.abilitySystem?.movementModifiers() || { phaseWalls: false, phaseBombs: false, speedMultiplier: 1, speedBonus: 0 };
    const pixelsPerSecond =
      (102 + (this.stats.speed + (movement.speedBonus || 0)) * 24) *
      movement.speedMultiplier *
      (this.slowMultiplier || 1);
    const step = (pixelsPerSecond * delta) / 1000;

    const radius = 13;
    this.refreshIgnoredBombFromOverlap(radius);
    const nextX = this.sprite.x + dx * step;
    const nextY = this.sprite.y + dy * step;
    if (this.map.canMoveToWorld(nextX, this.sprite.y, radius, this.ignoredBombKey, movement)) {
      this.sprite.x = nextX;
    }
    if (this.map.canMoveToWorld(this.sprite.x, nextY, radius, this.ignoredBombKey, movement)) {
      this.sprite.y = nextY;
    }

    // The player can step off the bomb they just placed, but it blocks them
    // only after the full collision box has left that tile.
    if (this.ignoredBombKey && !this.map.overlapsCellWorld(this.sprite.x, this.sprite.y, radius, this.ignoredBombKey)) {
      this.ignoredBombKey = null;
    }
  }

  refreshIgnoredBombFromOverlap(radius) {
    if (this.ignoredBombKey) return;
    const overlappedBombKey = this.map.overlappedBombKeyWorld?.(this.sprite.x, this.sprite.y, radius);
    if (overlappedBombKey) {
      this.ignoredBombKey = overlappedBombKey;
    }
  }

  updateFacing(dx, dy) {
    if (dx === 0 && dy === 0) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = dx > 0 ? "right" : "left";
    } else {
      this.facing = dy > 0 ? "down" : "up";
    }

    this.applyFacingTexture();
  }

  applyFacingTexture() {
    if (!this.sprite) return;
    const textureKey = directionalTextureForFacing(this.hero, this.facing);
    if (this.scene.textures.exists(textureKey) && this.currentTextureKey !== textureKey) {
      this.sprite.setTexture(textureKey);
      this.currentTextureKey = textureKey;
    }
  }

  tryPlaceBomb(time) {
    const pressed = this.inputRouter && this.inputProfile
      ? this.inputRouter.wasPressed(this.inputProfile.bomb)
      : Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    if (!pressed || time < this.placeCooldown) return;
    const firedShadowBeam = this.abilitySystem?.tryFireShadowBeam?.(time) === true;
    if (this.abilitySystem?.blocksBombPlacement?.()) return;
    const cell = this.currentCell();
    const bomb = this.bombs.placeBomb(
      this.ownerId,
      cell.col,
      cell.row,
      this.stats.blastRange,
      this.stats.maxBombs,
      this.abilitySystem?.bombOptions?.() || {},
    );
    if (bomb) {
      markOffense(this, time);
      this.ignoredBombKey = systems_PlayerSystem_js_keyOf(cell.col, cell.row);
      this.placeCooldown = time + 140;
      this.scene.events.emit("bomb-placed", this.ownerId);
    } else if (firedShadowBeam) {
      this.placeCooldown = time + 140;
    }
  }

  tryActivateUltimate(time) {
    const pressed = this.inputRouter && this.inputProfile
      ? this.inputRouter.wasPressed(this.inputProfile.ultimate)
      : Phaser.Input.Keyboard.JustDown(this.keys.SHIFT);
    if (!pressed) return;
    if (this.abilitySystem?.tryActivate(time)) {
      markOffense(this, time);
    }
  }

  pickupItem() {
    const cell = this.currentCell();
    if (this.items.pickupAt(cell.col, cell.row, this)) {
      this.scene.events.emit("player-stats-changed");
    }
  }

  currentCell() {
    return this.map.worldToCell(this.sprite.x, this.sprite.y);
  }

  hitByExplosion() {
    this.takeDamage(COMBAT_CONFIG.bombDamage, "explosion");
  }

  takeDamage(amount, reason = "damage") {
    const result = applyDamage(this, amount, reason, this.scene);
    if (result.defeated) {
      this.defeat(reason);
    }
    return result;
  }

  defeat(reason = "defeated") {
    if (!this.alive) return false;
    this.alive = false;
    this.hp = 0;
    clearSlow(this);
    clearShield(this, this.scene);
    this.healthBarBg?.destroy?.();
    this.healthBarFill?.destroy?.();
    this.healthBarBg = null;
    this.healthBarFill = null;
    this.abilitySystem?.endUltimate?.("player-defeated", false);

    if (this.sprite) {
      const sprite = this.sprite;
      this.scene.tweens.killTweensOf(sprite);
      sprite.setTint?.(0xff4358);

      const burst = this.scene.add.circle(sprite.x, sprite.y, 18, 0xff4358, 0.1)
        .setDepth(15)
        .setStrokeStyle(3, 0xff6674, 0.9);
      this.scene.tweens.add({
        targets: burst,
        alpha: 0,
        scaleX: 2.4,
        scaleY: 2.4,
        duration: 360,
        ease: "Cubic.easeOut",
        onComplete: () => burst.destroy(),
      });

      this.scene.tweens.add({
        targets: sprite,
        alpha: 0,
        scaleX: 0.32,
        scaleY: 0.32,
        angle: reason === "ember-aura" ? -14 : 12,
        duration: 340,
        ease: "Cubic.easeIn",
        onComplete: () => sprite.destroy(),
      });
    }

    this.scene.events.emit("player-defeated", this.ownerId);
    this.scene.events.emit("combatant-defeated", this.ownerId);
    return true;
  }

  grantShield() {
    return grantTimedShield(this, this.scene, this.scene.time.now);
  }

  setAbilitySystem(abilitySystem) {
    this.abilitySystem = abilitySystem;
  }

  addEnergy(amount) {
    this.abilitySystem?.addEnergy(amount);
  }

  isPhasingThroughWalls() {
    return this.abilitySystem?.movementModifiers?.().phaseWalls === true;
  }
}
Object.assign(__bundle, { PlayerSystem });
}

// systems/AISystem.js
{
const { COMBAT_CONFIG, ENEMY_TYPES, GAME_CONFIG, SPAWN_POINTS, applyDamage, clearSlow, grantTimedShield, initializeCombatState, markOffense, regenerateHealth, updateCombatVisuals } = __bundle;
const DIRECTIONS = [
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: -1 },
];

const ENEMY_RADIUS = 13;
const systems_AISystem_js_keyOf = (col, row) => `${col},${row}`;

class AISystem {
  constructor(scene, mapSystem, bombSystem, playerSystem, itemSystem, options = {}) {
    this.scene = scene;
    this.map = mapSystem;
    this.bombs = bombSystem;
    this.players = Array.isArray(playerSystem) ? playerSystem : [playerSystem].filter(Boolean);
    this.player = this.players[0] || null;
    this.items = itemSystem;
    this.aiCount = options.aiCount ?? GAME_CONFIG.ENEMY_COUNT;
    this.registry = options.registry || null;
    this.enemies = [];
    this.meteorSystem = null;
    this.heroAbilitySystem = null;
    this.portalSystem = null;
  }

  setMeteorSystem(meteorSystem) {
    this.meteorSystem = meteorSystem;
  }

  setPortalSystem(portalSystem) {
    this.portalSystem = portalSystem;
  }

  setHeroAbilitySystem(heroAbilitySystem) {
    this.heroAbilitySystem = heroAbilitySystem;
    this.heroAbilitySystems = Array.isArray(heroAbilitySystem) ? heroAbilitySystem : [heroAbilitySystem].filter(Boolean);
  }

  abilitySystems() {
    return this.heroAbilitySystems || [this.heroAbilitySystem].filter(Boolean);
  }

  create() {
    const spawnCells = SPAWN_POINTS.aiByPlayerCount?.[this.players.length] || SPAWN_POINTS.enemies;
    spawnCells.slice(0, this.aiCount).forEach((cell, index) => {
      const type = ENEMY_TYPES[index % ENEMY_TYPES.length];
      const { x, y } = this.map.cellToWorld(cell.col, cell.row);
      const texture = this.map.mapConfig?.enemyTextures?.[index] || type.texture;
      const sprite = this.scene.add.image(x, y, texture).setDepth(6);
      const enemy = {
        ownerId: `enemy-${index}`,
        hero: { id: "enemy" },
        sprite,
        direction: { col: 0, row: 0 },
        directionTimer: 0,
        mode: "scout",
        baseSpeed: 68 + index * 8,
        alive: true,
        stats: { speed: 1, maxBombs: 1, blastRange: 2, shield: 0 },
        bombCooldown: 700 + index * 500,
        ignoredBombKey: null,
        fleeBombKey: null,
        fleeBombUntil: 0,
        escapeUntil: 0,
        invulnerableUntil: 0,
      };
      initializeCombatState(enemy, 0);
      enemy.grantShield = () => grantTimedShield(enemy, this.scene, this.scene.time.now);
      enemy.currentCell = () => this.currentCell(enemy);
      enemy.takeDamage = (amount, reason) => this.damageEnemy(enemy, amount, reason);
      this.enemies.push(enemy);
      this.registry?.register?.(enemy, { kind: "ai", slot: index });
    });
  }

  update(time, delta) {
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      regenerateHealth(enemy, this.scene, delta);
      updateCombatVisuals(enemy, this.scene);

      const current = this.currentCell(enemy);
      if (this.items.pickupByActor(current.col, current.row, enemy, "enemy-item-picked")) {
        this.scene.events.emit("enemy-powered-up");
      }

      const dangerMap = this.predictedDangerMap();
      const danger = new Set(dangerMap.keys());
      const currentIsDanger = this.isDanger(current, danger);
      const waitingOnOwnBomb = enemy.fleeBombKey && time < enemy.fleeBombUntil;
      if (currentIsDanger) {
        this.enterFleeMode(enemy, current, dangerMap, time);
      } else if (enemy.mode === "flee" && waitingOnOwnBomb) {
        this.applyDirection(enemy, { col: 0, row: 0 }, 160);
      } else if (enemy.mode === "flee") {
        enemy.mode = "hunt";
        enemy.fleeBombKey = null;
        enemy.fleeBombUntil = 0;
        enemy.escapeUntil = 0;
      }

      const emberEscape = currentIsDanger ? null : this.findEmberEscapeDirection(enemy, current, danger);
      if (emberEscape) {
        enemy.mode = "ember-flee";
        this.applyDirection(enemy, emberEscape, 140);
      }

      const abilityEscape = currentIsDanger || emberEscape ? null : this.findHeroAbilityEscapeDirection(enemy, current, danger);
      if (abilityEscape) {
        enemy.mode = "skill-flee";
        this.applyDirection(enemy, abilityEscape, 120);
      }

      const escapePlan = currentIsDanger || emberEscape || abilityEscape ? null : this.findEscapePlanAfterBomb(enemy, current, time);
      if (!currentIsDanger && !emberEscape && !abilityEscape && this.shouldPlantBomb(enemy, current, time, escapePlan)) {
        const bomb = this.bombs.placeBomb(
          enemy.ownerId,
          current.col,
          current.row,
          enemy.stats.blastRange,
          enemy.stats.maxBombs,
        );
        if (bomb) {
          markOffense(enemy, time);
          enemy.ignoredBombKey = systems_AISystem_js_keyOf(current.col, current.row);
          enemy.fleeBombKey = systems_AISystem_js_keyOf(current.col, current.row);
          enemy.fleeBombUntil = time + GAME_CONFIG.BOMB_DELAY + GAME_CONFIG.EXPLOSION_DURATION;
          enemy.bombCooldown = time + Phaser.Math.Between(2200, 3600);
          enemy.mode = "flee";
          enemy.escapeUntil = time + 500;
          this.applyDirection(enemy, escapePlan.direction, 120);
          this.scene.events.emit("enemy-bomb-placed");
        }
      }

      enemy.directionTimer -= delta;
      if (enemy.directionTimer <= 0) {
        this.planDirection(enemy, time);
      }

      if (this.moveEnemy(enemy, delta)) {
        this.planDirection(enemy, time);
      }
    });
  }

  currentCell(enemy) {
    return this.map.worldToCell(enemy.sprite.x, enemy.sprite.y);
  }

  predictedDangerMap(extraBomb = null) {
    const dangerMap = this.bombs.predictedDangerMap(extraBomb);
    this.meteorSystem?.pendingDangerMap?.().forEach((hazard, key) => {
      const existing = dangerMap.get(key);
      if (!existing || hazard.explodeAt < existing.explodeAt) {
        dangerMap.set(key, hazard);
      }
    });
    this.abilitySystems().forEach((ability) => {
      ability.pendingVoltMeteorDangerMap?.().forEach((hazard, key) => {
        const existing = dangerMap.get(key);
        if (!existing || hazard.explodeAt < existing.explodeAt) dangerMap.set(key, hazard);
      });
    });
    return dangerMap;
  }

  predictedDangerCells(extraBomb = null) {
    return new Set(this.predictedDangerMap(extraBomb).keys());
  }

  planDirection(enemy, time) {
    const current = this.currentCell(enemy);
    const dangerMap = this.predictedDangerMap();
    const danger = new Set(dangerMap.keys());
    if (this.isDanger(current, danger)) {
      this.enterFleeMode(enemy, current, dangerMap, time);
      return;
    }

    const emberEscape = this.findEmberEscapeDirection(enemy, current, danger);
    if (emberEscape) {
      enemy.mode = "ember-flee";
      this.applyDirection(enemy, emberEscape, 140);
      return;
    }

    const abilityEscape = this.findHeroAbilityEscapeDirection(enemy, current, danger);
    if (abilityEscape) {
      enemy.mode = "skill-flee";
      this.applyDirection(enemy, abilityEscape, 120);
      return;
    }

    const targets = this.listTargets(enemy);
    const attackStep = this.findAttackStep(enemy, current, targets, danger);
    if (attackStep) {
      enemy.mode = "hunt";
      this.applyDirection(enemy, attackStep, 140);
      return;
    }

    const item = this.findPreferredItem(enemy, current);
    if (item) {
      enemy.mode = "scout";
      const direction =
        this.findStep(
          current,
          (cell) => cell.col === item.col && cell.row === item.row,
          danger,
          enemy.ignoredBombKey,
          10,
        ) || this.findSafeNeighbor(current, danger, enemy.ignoredBombKey) || { col: 0, row: 0 };
      this.applyDirection(enemy, direction, 220);
      return;
    }

    if (this.canClearBoxNow(enemy, current, time)) {
      enemy.mode = "clear";
      this.applyDirection(enemy, { col: 0, row: 0 }, 180);
      return;
    }

    const boxStep = this.findStep(
      current,
      (cell) => this.canPrepareBoxAttack(enemy, cell),
      danger,
      enemy.ignoredBombKey,
      12,
    );
    enemy.mode = "scout";
    this.applyDirection(
      enemy,
      boxStep || this.findSafeNeighbor(current, danger, enemy.ignoredBombKey) || { col: 0, row: 0 },
      boxStep ? 240 : 150,
    );
  }

  enterFleeMode(enemy, current, dangerMap, time) {
    enemy.mode = "flee";
    enemy.escapeUntil = time + 450;
    const danger = new Set(dangerMap.keys());
    const portalGroup = this.portalSystem?.groupForCell?.(current);
    const portalDestination = this.portalSystem?.pairedDestination?.(current);
    const currentHazard = dangerMap.get(systems_AISystem_js_keyOf(current.col, current.row));
    if (
      portalGroup &&
      portalDestination &&
      this.portalSystem.canPlanThrough(portalGroup.id) &&
      this.isPortalDestinationSafe(portalDestination, danger) &&
      (!currentHazard || currentHazard.explodeAt > time + this.portalSystem.config.channelMs + 100)
    ) {
      this.applyDirection(enemy, { col: 0, row: 0 }, 120);
      return;
    }
    const escapePlan = this.findTimedEscapePlan(enemy, current, dangerMap, time);
    this.applyDirection(
      enemy,
      escapePlan?.direction ||
        this.findEscapeStep(current, danger, enemy.ignoredBombKey, 10) ||
        this.findSafeNeighbor(current, danger, enemy.ignoredBombKey) ||
        { col: 0, row: 0 },
      90,
    );
  }

  findEmberEscapeDirection(enemy, current, danger) {
    const ability = this.abilitySystems().find((item) => item.emberThreatFor?.(enemy)?.inside);
    const threat = ability?.emberThreatFor?.(enemy);
    if (!threat?.inside) return null;

    return (
      this.findStep(
        current,
        (cell) => !ability.isCellInsideEmberAura(cell),
        danger,
        enemy.ignoredBombKey,
        Math.max(8, (threat.radiusTiles || 5) + 4),
      ) ||
      this.findSafeNeighborAwayFromEmber(current, danger, enemy.ignoredBombKey) ||
      null
    );
  }

  findHeroAbilityEscapeDirection(enemy, current, danger) {
    const shadowAbility = this.abilitySystems().find((item) => item.shadowBeamThreatFor?.(enemy)?.inside);
    const shadowThreat = shadowAbility?.shadowBeamThreatFor?.(enemy);
    if (shadowThreat?.inside) {
      return (
        this.findStep(
          current,
          (cell) => !shadowAbility.isCellInsideShadowBeam(cell),
          danger,
          enemy.ignoredBombKey,
          8,
        ) ||
        this.findSafeNeighborAwayFromHeroAbility(current, danger, enemy.ignoredBombKey) ||
        null
      );
    }

    const windAbility = this.abilitySystems().find((item) => item.windThreatFor?.(enemy)?.inside);
    const windThreat = windAbility?.windThreatFor?.(enemy);
    if (windThreat?.inside) {
      return (
        this.findStep(
          current,
          (cell) => !windAbility.isCellInsideWindThreat(cell),
          danger,
          enemy.ignoredBombKey,
          6,
        ) ||
        this.findSafeNeighborAwayFromHeroAbility(current, danger, enemy.ignoredBombKey) ||
        null
      );
    }

    return null;
  }

  findSafeNeighborAwayFromHeroAbility(current, danger, ignoreKey) {
    return (
      DIRECTIONS.find((dir) => {
        const next = { col: current.col + dir.col, row: current.row + dir.row };
        return (
          !this.map.isBlocked(next.col, next.row, ignoreKey) &&
          !this.isDanger(next, danger) &&
          this.abilitySystems().every((ability) =>
            !ability.isCellInsideShadowBeam?.(next) && !ability.isCellInsideWindThreat?.(next))
        );
      }) || null
    );
  }

  findPreferredItem(enemy, current) {
    const wantsShield = !enemy.shieldActive || enemy.hp <= 70;
    let shield = null;
    if (wantsShield) {
      this.items.items?.forEach?.((item) => {
        if (item.type?.id !== "shield") return;
        const distance = Math.abs(item.col - current.col) + Math.abs(item.row - current.row);
        if (distance <= 8 && (!shield || distance < shield.distance)) {
          shield = { ...item, distance };
        }
      });
    }
    return shield || this.items.nearest(current, 6);
  }

  findSafeNeighborAwayFromEmber(current, danger, ignoreKey) {
    return (
      DIRECTIONS.find((dir) => {
        const next = { col: current.col + dir.col, row: current.row + dir.row };
        return (
          !this.map.isBlocked(next.col, next.row, ignoreKey) &&
          !this.isDanger(next, danger) &&
          this.abilitySystems().every((ability) => !ability.isCellInsideEmberAura?.(next))
        );
      }) || null
    );
  }

  moveEnemy(enemy, delta) {
    const { col, row } = enemy.direction;
    if (col === 0 && row === 0) {
      this.releaseIgnoredBomb(enemy);
      return false;
    }

    const speedMultiplier = enemy.slowMultiplier || 1;
    const step = ((enemy.baseSpeed + enemy.stats.speed * 18) * speedMultiplier * delta) / 1000;
    let moved = false;
    this.refreshIgnoredBombFromOverlap(enemy);
    const nextX = enemy.sprite.x + col * step;
    const nextY = enemy.sprite.y + row * step;

    if (col !== 0 && this.map.canMoveToWorld(nextX, enemy.sprite.y, ENEMY_RADIUS, enemy.ignoredBombKey)) {
      enemy.sprite.x = nextX;
      moved = true;
    }
    if (row !== 0 && this.map.canMoveToWorld(enemy.sprite.x, nextY, ENEMY_RADIUS, enemy.ignoredBombKey)) {
      enemy.sprite.y = nextY;
      moved = true;
    }

    this.releaseIgnoredBomb(enemy);
    return !moved;
  }

  releaseIgnoredBomb(enemy) {
    if (
      enemy.ignoredBombKey &&
      !this.map.overlapsCellWorld(enemy.sprite.x, enemy.sprite.y, ENEMY_RADIUS, enemy.ignoredBombKey)
    ) {
      enemy.ignoredBombKey = null;
    }
  }

  refreshIgnoredBombFromOverlap(enemy) {
    if (enemy.ignoredBombKey) return;
    const overlappedBombKey = this.map.overlappedBombKeyWorld?.(enemy.sprite.x, enemy.sprite.y, ENEMY_RADIUS);
    if (overlappedBombKey) {
      enemy.ignoredBombKey = overlappedBombKey;
    }
  }

  applyDirection(enemy, direction, timer) {
    const current = this.currentCell(enemy);
    const center = this.map.cellToWorld(current.col, current.row);
    if (direction.col !== 0 && direction.row === 0) {
      enemy.sprite.y = center.y;
    } else if (direction.row !== 0 && direction.col === 0) {
      enemy.sprite.x = center.x;
    }
    enemy.direction = direction;
    enemy.directionTimer = timer;
  }

  findAttackStep(enemy, current, targets, danger) {
    for (const target of targets) {
      if (!target?.alive) continue;
      const setupStep = this.findStep(
        current,
        (cell) => this.isAttackCell(cell, target, enemy, danger),
        danger,
        enemy.ignoredBombKey,
        12,
      );
      if (setupStep) return setupStep;
    }

    const bestOption = targets
      .filter((target) => target?.alive)
      .map((target) => this.bestCombatDirection(enemy, current, target, danger))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)[0];

    return bestOption?.dir || null;
  }

  bestCombatDirection(enemy, current, target, danger) {
    const currentDistance = Math.abs(current.col - target.cell.col) + Math.abs(current.row - target.cell.row);
    const canPressureFromCurrent =
      this.canHitTargetFrom(current, target.cell, enemy.stats.blastRange) ||
      this.nearCell(current, target.cell, target.kind === "player" ? 1 : 2);
    const options = [...DIRECTIONS, { col: 0, row: 0 }]
      .filter((dir) => {
        if (dir.col === 0 && dir.row === 0) {
          return canPressureFromCurrent;
        }
        return !this.map.isBlocked(current.col + dir.col, current.row + dir.row, enemy.ignoredBombKey);
      })
      .map((dir) => {
        const next = { col: current.col + dir.col, row: current.row + dir.row };
        const distance = Math.abs(next.col - target.cell.col) + Math.abs(next.row - target.cell.row);
        const safeBonus = this.isDanger(next, danger) ? -1000 : 0;
        const lineBonus = this.canHitTargetFrom(next, target.cell, enemy.stats.blastRange) ? 30 : 0;
        const closeBonus = this.nearCell(next, target.cell, target.kind === "player" ? 1 : 2) ? 16 : 0;
        const stayPenalty = dir.col === 0 && dir.row === 0 ? -6 : 0;
        return {
          dir,
          target,
          distance,
          score: safeBonus + lineBonus + closeBonus - distance * 7 + stayPenalty,
        };
      })
      .sort((a, b) => b.score - a.score);

    if (!canPressureFromCurrent) {
      const hasNonWorseningMove = options.some(
        (option) => (option.dir.col !== 0 || option.dir.row !== 0) && option.distance <= currentDistance,
      );
      if (!hasNonWorseningMove) return null;
    }

    return options[0] || null;
  }

  shouldPlantBomb(enemy, current, time, escapePlan) {
    if (time < enemy.bombCooldown || this.bombs.activeCount(enemy.ownerId) >= enemy.stats.maxBombs) return false;
    if (!escapePlan || this.isDanger(current, this.predictedDangerCells())) return false;

    const targets = this.listTargets(enemy);
    for (const target of targets) {
      if (!target?.alive) continue;
      if (this.canHitTargetFrom(current, target.cell, enemy.stats.blastRange)) return true;
      if (target.kind === "player" && this.nearCell(current, target.cell, 1)) return true;
      if (target.kind !== "player" && this.nearCell(current, target.cell, 2)) return true;
    }

    return this.adjacentBoxAny(current);
  }

  findStep(start, predicate, danger, ignoreKey, maxDepth, allowDangerTransit = false) {
    const queue = [{ ...start, depth: 0, first: null }];
    const seen = new Set([systems_AISystem_js_keyOf(start.col, start.row)]);

    while (queue.length) {
      const cell = queue.shift();
      if (cell.depth > 0 && predicate(cell)) return cell.first;
      if (cell.depth >= maxDepth) continue;

      DIRECTIONS.forEach((dir) => {
        const next = {
          col: cell.col + dir.col,
          row: cell.row + dir.row,
          depth: cell.depth + 1,
          first: cell.first || dir,
        };
        const nextKey = systems_AISystem_js_keyOf(next.col, next.row);
        if (seen.has(nextKey) || this.map.isBlocked(next.col, next.row, ignoreKey)) return;
        if (!allowDangerTransit && danger.has(nextKey) && !predicate(next)) return;
        seen.add(nextKey);
        queue.push(next);
      });

      const portalGroup = this.portalSystem?.groupForCell?.(cell);
      const portalDestination = this.portalSystem?.pairedDestination?.(cell);
      if (
        portalGroup &&
        portalDestination &&
        this.portalSystem.canPlanThrough(portalGroup.id) &&
        this.isPortalDestinationSafe(portalDestination, danger)
      ) {
        const destinationKey = systems_AISystem_js_keyOf(portalDestination.col, portalDestination.row);
        if (!seen.has(destinationKey)) {
          seen.add(destinationKey);
          queue.push({
            ...portalDestination,
            depth: cell.depth + 1,
            first: cell.first || { col: 0, row: 0 },
          });
        }
      }
    }

    return null;
  }

  isPortalDestinationSafe(cell, danger = new Set()) {
    if (!this.portalSystem?.isDestinationSafe?.(cell, danger)) return false;
    return this.abilitySystems().every((ability) => (
      !ability.isCellInsideEmberAura?.(cell) &&
      !ability.isCellInsideShadowBeam?.(cell) &&
      !ability.isCellInsideWindThreat?.(cell)
    ));
  }

  findEscapeStep(start, danger, ignoreKey, maxDepth) {
    const quick = this.findSafeNeighbor(start, danger, ignoreKey);
    if (quick) return quick;

    const queue = [{ ...start, depth: 0, first: null }];
    const seen = new Set([systems_AISystem_js_keyOf(start.col, start.row)]);
    let best = null;

    while (queue.length) {
      const cell = queue.shift();
      if (cell.depth > 0 && !this.isDanger(cell, danger)) return cell.first;
      if (!best || cell.depth > best.depth) best = cell;
      if (cell.depth >= maxDepth) continue;

      DIRECTIONS.forEach((dir) => {
        const next = {
          col: cell.col + dir.col,
          row: cell.row + dir.row,
          depth: cell.depth + 1,
          first: cell.first || dir,
        };
        const nextKey = systems_AISystem_js_keyOf(next.col, next.row);
        if (seen.has(nextKey) || this.map.isBlocked(next.col, next.row, ignoreKey)) return;
        if (this.map.hasExplosionAt(next.col, next.row)) return;
        seen.add(nextKey);
        queue.push(next);
      });
    }

    return best?.first || null;
  }

  findSafeNeighbor(cell, danger, ignoreKey) {
    return (
      DIRECTIONS.find((dir) => {
        const next = { col: cell.col + dir.col, row: cell.row + dir.row };
        return !this.map.isBlocked(next.col, next.row, ignoreKey) && !this.isDanger(next, danger);
      }) || null
    );
  }

  hasEscapeRouteAfterBomb(enemy, origin) {
    return !!this.findEscapePlanAfterBomb(enemy, origin, this.scene.time.now);
  }

  findEscapePlanAfterBomb(enemy, origin, time) {
    const dangerMap = this.predictedDangerMap({
      col: origin.col,
      row: origin.row,
      range: enemy.stats.blastRange,
      explodeAt: time + GAME_CONFIG.BOMB_DELAY,
    });
    return this.findTimedEscapePlan(enemy, origin, dangerMap, time, systems_AISystem_js_keyOf(origin.col, origin.row));
  }

  findTimedEscapePlan(enemy, origin, dangerMap, startTime, ignoreKey = enemy.ignoredBombKey) {
    const startKey = systems_AISystem_js_keyOf(origin.col, origin.row);
    const tileTravelMs = this.tileTravelTime(enemy);
    const deadlineBuffer = 80;
    const queue = [{ col: origin.col, row: origin.row, depth: 0, first: null }];
    const seen = new Set([startKey]);

    while (queue.length) {
      const cell = queue.shift();
      const arrivalAt = startTime + cell.depth * tileTravelMs;
      const hazard = dangerMap.get(systems_AISystem_js_keyOf(cell.col, cell.row));
      const canTransitHere = !hazard || hazard.explodeAt > arrivalAt + deadlineBuffer;
      if (cell.depth > 0 && !hazard) {
        return {
          direction: cell.first,
          steps: cell.depth,
          safeAt: arrivalAt,
        };
      }
      if (!canTransitHere) continue;

      DIRECTIONS.forEach((dir) => {
        const next = {
          col: cell.col + dir.col,
          row: cell.row + dir.row,
          depth: cell.depth + 1,
          first: cell.first || dir,
        };
        const nextKey = systems_AISystem_js_keyOf(next.col, next.row);
        if (seen.has(nextKey) || this.map.isBlocked(next.col, next.row, ignoreKey)) return;
        if (this.map.hasExplosionAt(next.col, next.row)) return;

        const nextArrivalAt = startTime + next.depth * tileTravelMs;
        const nextHazard = dangerMap.get(nextKey);
        if (nextHazard && nextHazard.explodeAt <= nextArrivalAt + deadlineBuffer) return;

        seen.add(nextKey);
        queue.push(next);
      });
    }

    return null;
  }

  findDirectEscapePlan(enemy, origin, dangerMap, startTime, ignoreKey = enemy.ignoredBombKey) {
    const tileTravelMs = this.tileTravelTime(enemy);
    const deadlineBuffer = 80;
    const maxDepth = 8;

    for (const direction of DIRECTIONS) {
      for (let step = 1; step <= maxDepth; step += 1) {
        const col = origin.col + direction.col * step;
        const row = origin.row + direction.row * step;
        if (this.map.isBlocked(col, row, ignoreKey) || this.map.hasExplosionAt(col, row)) break;

        const arrivalAt = startTime + step * tileTravelMs;
        const hazard = dangerMap.get(systems_AISystem_js_keyOf(col, row));
        if (hazard && hazard.explodeAt <= arrivalAt + deadlineBuffer) break;
        if (!hazard) {
          return {
            direction,
            steps: step,
            safeAt: arrivalAt,
          };
        }
      }
    }

    return null;
  }

  tileTravelTime(enemy) {
    const pixelsPerSecond = (enemy.baseSpeed + enemy.stats.speed * 18) * (enemy.slowMultiplier || 1);
    return (GAME_CONFIG.TILE_SIZE / pixelsPerSecond) * 1000;
  }

  isAttackCell(cell, target, enemy, danger = this.predictedDangerCells()) {
    if (!target?.alive || this.isDanger(cell, danger)) return false;
    if (!this.hasEscapeRouteAfterBomb(enemy, cell)) return false;
    return (
      this.canHitTargetFrom(cell, target.cell, enemy.stats.blastRange) ||
      this.nearCell(cell, target.cell, target.kind === "player" ? 1 : 2)
    );
  }

  listTargets(enemy) {
    const current = this.currentCell(enemy);
    const targets = [];
    this.players.filter((player) => player.alive).forEach((player) => {
      const cell = player.currentCell();
      targets.push({
        ownerId: player.ownerId,
        kind: "player",
        cell,
        alive: true,
        distance: Math.abs(cell.col - current.col) + Math.abs(cell.row - current.row),
      });
    });

    const others = this.enemies
      .filter((other) => other !== enemy && other.alive)
      .map((other) => {
        const cell = this.currentCell(other);
        return {
          ownerId: other.ownerId,
          kind: "enemy",
          cell,
          alive: true,
          distance: Math.abs(cell.col - current.col) + Math.abs(cell.row - current.row),
        };
      });

    return [...targets, ...others].sort((a, b) => a.distance - b.distance);
  }

  pickTarget(enemy) {
    return this.listTargets(enemy)[0] || null;
  }

  isCombatTarget(target) {
    return !!target;
  }

  nearCell(cell, target, distance) {
    return Math.abs(cell.col - target.col) + Math.abs(cell.row - target.row) <= distance;
  }

  canHitTargetFrom(cell, target, range) {
    if (target.col !== cell.col && target.row !== cell.row) return false;

    const deltaCol = Math.sign(target.col - cell.col);
    const deltaRow = Math.sign(target.row - cell.row);
    const distance = Math.abs(target.col - cell.col) + Math.abs(target.row - cell.row);
    if (distance > range) return false;

    for (let step = 1; step <= distance; step += 1) {
      const col = cell.col + deltaCol * step;
      const row = cell.row + deltaRow * step;
      const mapCell = this.map.getCell(col, row);
      if (mapCell === 1 || mapCell === 2) return false;
    }

    return true;
  }

  adjacentBoxAny(cell) {
    return DIRECTIONS.some((dir) => this.map.getCell(cell.col + dir.col, cell.row + dir.row) === 2);
  }

  canPrepareBoxAttack(enemy, cell) {
    return this.adjacentBoxAny(cell) && this.hasEscapeRouteAfterBomb(enemy, cell);
  }

  canClearBoxNow(enemy, current, time) {
    return (
      this.canPrepareBoxAttack(enemy, current) &&
      time >= enemy.bombCooldown &&
      this.bombs.activeCount(enemy.ownerId) < enemy.stats.maxBombs
    );
  }

  isDanger(cell, predicted = this.bombs.predictedDangerCells()) {
    return this.map.hasExplosionAt(cell.col, cell.row) || predicted.has(systems_AISystem_js_keyOf(cell.col, cell.row));
  }

  hitEnemiesInExplosions(hitContext = null) {
    let changed = false;
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      const cell = this.currentCell(enemy);
      if (!this.map.hasExplosionAt(cell.col, cell.row)) return;
      if (hitContext?.canHitActor && !hitContext.canHitActor(enemy.ownerId, cell)) return;
      const result = this.damageEnemy(enemy, COMBAT_CONFIG.bombDamage, "explosion", false);
      changed = result.defeated || changed;
    });

    if (changed) this.scene.events.emit("enemy-count-changed");
  }

  damageEnemy(enemy, amount, reason = "damage", emitEvent = true) {
    const result = applyDamage(enemy, amount, reason, this.scene);
    if (result.shielded) {
      enemy.mode = "flee";
      enemy.escapeUntil = this.scene.time.now + 450;
    }
    if (result.damaged && !result.defeated) {
      enemy.mode = "flee";
      enemy.escapeUntil = this.scene.time.now + 260;
    }
    if (result.defeated) {
      this.defeatEnemy(enemy, reason, emitEvent);
    }
    return result;
  }

  defeatEnemy(enemy, reason = "defeated", emitEvent = true) {
    if (!enemy?.alive) return false;
    enemy.alive = false;
    enemy.hp = 0;
    clearSlow(enemy);
    enemy.shieldEffect?.destroy?.();
    enemy.healthBarBg?.destroy?.();
    enemy.healthBarFill?.destroy?.();
    this.scene.tweens.killTweensOf(enemy.sprite);
    this.scene.tweens.add({
      targets: enemy.sprite,
      alpha: 0,
      scale: reason === "ember-aura" ? 1.6 : 1.45,
      angle: reason === "ember-aura" ? -18 : 20,
      duration: 180,
      onComplete: () => enemy.sprite.destroy(),
    });
    if (emitEvent) this.scene.events.emit("enemy-count-changed");
    if (emitEvent) this.scene.events.emit("combatant-defeated", enemy.ownerId);
    return true;
  }

  aliveCount() {
    return this.enemies.filter((enemy) => enemy.alive).length;
  }
}
Object.assign(__bundle, { AISystem });
}

// systems/HeroAbilitySystem.js
{
const { CELL, COMBAT_CONFIG, GAME_CONFIG, ULTIMATE_CONFIG, getHeroDisplay, applySlow, clearSlow, markOffense } = __bundle;
const DIRECTIONS = [
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: -1 },
];

const systems_HeroAbilitySystem_js_keyOf = (col, row) => `${col},${row}`;

class HeroAbilitySystem {
  constructor(scene, mapSystem, playerSystem, aiSystem, registry = null) {
    this.scene = scene;
    this.map = mapSystem;
    this.player = playerSystem;
    this.ai = aiSystem;
    this.registry = registry;
    this.hero = playerSystem.hero;
    this.energy = 0;
    this.active = false;
    this.ultimateEndsAt = 0;
    this.emberBurnTimers = new Map();
    this.emberAfterburnTimers = new Map();
    this.emberBurningEnemies = new Set();
    this.shadowBeam = null;
    this.shadowExitPulse = null;
    this.windShockTimers = new Map();
    this.windShockEffects = [];
    this.windTrails = [];
    this.lastWindTrailSample = null;
    this.pendingVoltMeteors = [];
    this.activeVoltImpacts = new Map();
    this.nextVoltMeteorAt = 0;
    this.nextVoltMeteorId = 1;
    this.trail = [];
    this.effectFlashUntil = 0;
    this.effectBack = this.scene.add.graphics().setDepth(6).setVisible(false);
    this.effectFront = this.scene.add.graphics().setDepth(11).setVisible(false);
  }

  opponents() {
    return this.registry?.opponentsOf?.(this.player.ownerId) || this.ai?.enemies?.filter((actor) => actor.alive) || [];
  }

  findOpponent(ownerId) {
    return this.registry?.get?.(ownerId) || this.ai?.enemies?.find((actor) => actor.ownerId === ownerId) || null;
  }

  damageOpponent(actor, amount, reason) {
    if (!actor?.alive) return null;
    if (actor.combatantKind === "player" || actor.ownerId?.startsWith?.("player-")) {
      return actor.takeDamage?.(amount, reason);
    }
    return this.ai?.damageEnemy?.(actor, amount, reason);
  }

  opponentCell(actor) {
    return actor.currentCell?.() || this.ai?.currentCell?.(actor) || this.map?.worldToCell?.(actor.sprite.x, actor.sprite.y);
  }

  update(time, delta) {
    if (!this.player.alive) {
      this.endUltimate("player-defeated", false);
      return;
    }

    this.updateWindTrails(time, delta);
    this.updateVoltMeteorImpacts(time);

    if (!this.active) {
      this.updateEmberAfterburn(delta);
      this.addEnergy((delta / ULTIMATE_CONFIG.fullChargeMs) * 100, false);
    } else {
      const activeDelta = Math.max(0, Math.min(delta, this.ultimateEndsAt - time));

      if (this.hero.ultimate.id === "ember-aura") {
        this.updateEmberAura(activeDelta);
      }
      this.updateEmberAfterburn(activeDelta);
      if (this.hero.ultimate.id === "wind-surge") {
        this.captureWindTrailSample(time);
      }
      if (this.hero.ultimate.id === "volt-guard") {
        this.updateVoltMeteorSchedule(time);
      }
      this.updateShadowBeam(time + activeDelta);

      this.captureTrailSample();
      this.drawEffects(time);

      if (time + delta >= this.ultimateEndsAt) {
        this.endUltimate("expired");
      }
      return;
    }
    this.updateShadowBeam(time);
    this.drawEffects(time);
  }

  addEnergy(amount, emitEvent = true) {
    if (this.active) return this.energy;
    const previous = this.energy;
    this.energy = Phaser.Math.Clamp(this.energy + amount, 0, 100);
    if (emitEvent && previous !== this.energy) {
      this.scene.events.emit("ultimate-energy-changed", this.energy);
    }
    return this.energy;
  }

  isReady() {
    return this.energy >= 100;
  }

  isActive() {
    return this.active;
  }

  getRemainingMs(time = this.scene.time.now) {
    return this.active ? Math.max(0, this.ultimateEndsAt - time) : 0;
  }

  getDisplayState(time = this.scene.time.now) {
    const heroDisplay = getHeroDisplay(this.hero);
    return {
      energy: this.energy,
      ready: this.isReady(),
      active: this.active,
      remainingMs: this.getRemainingMs(time),
      name: heroDisplay?.ultimateName || this.hero.ultimate.name,
    };
  }

  tryActivate(time = this.scene.time.now) {
    if (!this.player.alive || this.active || !this.isReady()) return false;
    const heroDisplay = getHeroDisplay(this.hero);

    this.active = true;
    this.energy = 0;
    this.ultimateEndsAt = time + this.hero.ultimate.durationMs;
    this.emberBurnTimers.clear();
    this.lastWindTrailSample = null;
    this.effectFlashUntil = time + 360;

    if (this.hero.ultimate.id === "shadow-phase") {
      this.player.sprite.setAlpha(0.58);
    }

    if (this.hero.ultimate.id === "volt-guard") {
      this.player.hp = this.player.maxHp || COMBAT_CONFIG.maxHp;
      this.player.invulnerableUntil = Math.max(this.player.invulnerableUntil || 0, this.ultimateEndsAt);
      this.nextVoltMeteorAt = time;
      this.scene.events.emit("actor-health-changed", this.player);
      this.scene.events.emit("player-stats-changed");
    }

    this.scene.events.emit("ultimate-energy-changed", this.energy);
    this.scene.events.emit("ultimate-activated", heroDisplay?.ultimateName || this.hero.ultimate.name);
    return true;
  }

  endUltimate(reason = "expired", emitEvent = true) {
    if (!this.active) return;

    this.active = false;
    this.ultimateEndsAt = 0;
    this.clearEmberBurnVisuals();
    this.emberBurnTimers.clear();
    this.shadowBeam = null;
    this.windShockTimers.clear();
    this.clearWindShockEffects();
    this.player.sprite.setAlpha(1);
    this.trail = [];
    this.lastWindTrailSample = null;

    if (this.hero.ultimate.id === "shadow-phase") {
      this.snapPlayerOutOfBlockedCell();
      this.shadowExitPulse = {
        x: this.player.sprite.x,
        y: this.player.sprite.y,
        startAt: this.scene.time.now,
        endAt: this.scene.time.now + 420,
      };
    }

    if (emitEvent) {
      this.scene.events.emit("ultimate-ended", {
        heroId: this.hero.id,
        reason,
      });
    }
  }

  movementModifiers() {
    if (!this.active) {
      return { phaseWalls: false, phaseBombs: false, speedMultiplier: 1, speedBonus: 0 };
    }

    if (this.hero.ultimate.id === "shadow-phase") {
      return { phaseWalls: true, phaseBombs: true, speedMultiplier: 1, speedBonus: 1.5 };
    }

    if (this.hero.ultimate.id === "wind-surge") {
      return {
        phaseWalls: false,
        phaseBombs: true,
        speedMultiplier: this.hero.ultimate.speedMultiplier || COMBAT_CONFIG.windSpeedMultiplier,
        speedBonus: 0,
      };
    }

    return { phaseWalls: false, phaseBombs: false, speedMultiplier: 1, speedBonus: 0 };
  }

  bombOptions() {
    return {};
  }

  blocksBombPlacement() {
    return false;
  }

  emberThreatFor(enemy) {
    if (!this.active || this.hero.ultimate.id !== "ember-aura" || !enemy?.alive || !enemy?.sprite) {
      return { inside: false, elapsedMs: 0 };
    }

    const radiusPx = (this.hero.ultimate.radiusTiles || 2) * GAME_CONFIG.TILE_SIZE;
    const distance = Math.hypot(enemy.sprite.x - this.player.sprite.x, enemy.sprite.y - this.player.sprite.y);
    return {
      inside: distance <= radiusPx,
      elapsedMs: this.emberBurnTimers.get(enemy.ownerId) || 0,
      sourceCell: this.map?.worldToCell?.(this.player.sprite.x, this.player.sprite.y) || null,
      radiusTiles: this.hero.ultimate.radiusTiles || 2,
      killAfterMs: this.hero.ultimate.killAfterMs || 5000,
    };
  }

  isCellInsideEmberAura(cell) {
    if (!this.active || this.hero.ultimate.id !== "ember-aura" || !this.map || !cell) return false;
    const radiusPx = (this.hero.ultimate.radiusTiles || 2) * GAME_CONFIG.TILE_SIZE;
    const world = this.map.cellToWorld(cell.col, cell.row);
    return Math.hypot(world.x - this.player.sprite.x, world.y - this.player.sprite.y) <= radiusPx;
  }

  consumeExtraLife(time = this.scene.time.now) {
    return false;
  }

  updateEmberAura(delta) {
    const radiusPx = (this.hero.ultimate.radiusTiles || COMBAT_CONFIG.emberRadiusTiles) * GAME_CONFIG.TILE_SIZE;
    const activeBurns = new Set();
    this.opponents().forEach((enemy) => {
      if (!enemy.alive) {
        this.emberBurnTimers.delete(enemy.ownerId);
        this.emberAfterburnTimers.delete(enemy.ownerId);
        this.applyEnemyBurnVisual(enemy, false);
        return;
      }

      const distance = Math.hypot(enemy.sprite.x - this.player.sprite.x, enemy.sprite.y - this.player.sprite.y);
      if (distance <= radiusPx) {
        activeBurns.add(enemy.ownerId);
        this.applyEnemyBurnVisual(enemy, true);
        this.emberAfterburnTimers.set(enemy.ownerId, COMBAT_CONFIG.emberAfterburnDurationMs);
        const elapsed = (this.emberBurnTimers.get(enemy.ownerId) || 0) + delta;
        this.emberBurnTimers.set(enemy.ownerId, elapsed);
        const result = this.damageOpponent(
          enemy,
          COMBAT_CONFIG.emberDamagePerSecond * (delta / 1000),
          "ember-aura",
        );
        if (result?.defeated || !enemy.alive) {
          this.applyEnemyBurnVisual(enemy, false);
          this.emberBurnTimers.delete(enemy.ownerId);
        }
        return;
      }

      this.emberBurnTimers.delete(enemy.ownerId);
    });

    this.emberBurningEnemies.forEach((ownerId) => {
      if (activeBurns.has(ownerId)) return;
      const enemy = this.findOpponent(ownerId);
      if (enemy && !this.emberAfterburnTimers.has(ownerId)) this.applyEnemyBurnVisual(enemy, false);
    });
  }

  updateEmberAfterburn(delta) {
    if (!this.emberAfterburnTimers.size) return;
    this.emberAfterburnTimers.forEach((remainingMs, ownerId) => {
      const enemy = this.findOpponent(ownerId);
      if (!enemy?.alive) {
        this.emberAfterburnTimers.delete(ownerId);
        if (enemy) this.applyEnemyBurnVisual(enemy, false);
        return;
      }

      if (this.emberBurnTimers.has(ownerId)) {
        this.applyEnemyBurnVisual(enemy, true);
        return;
      }

      const damageDelta = Math.min(delta, remainingMs);
      const nextRemaining = remainingMs - damageDelta;
      if (nextRemaining > 0) {
        this.emberAfterburnTimers.set(ownerId, nextRemaining);
      }
      this.applyEnemyBurnVisual(enemy, true);
      const result = this.damageOpponent(
        enemy,
        COMBAT_CONFIG.emberAfterburnDamagePerSecond * (damageDelta / 1000),
        "ember-afterburn",
      );
      if (result?.defeated || !enemy.alive) {
        this.emberAfterburnTimers.delete(ownerId);
        this.applyEnemyBurnVisual(enemy, false);
        return;
      }

      if (nextRemaining <= 0) {
        this.emberAfterburnTimers.delete(ownerId);
        this.applyEnemyBurnVisual(enemy, false);
      }
    });
  }

  tryFireShadowBeam(time = this.scene.time.now) {
    if (!this.active || this.hero.ultimate.id !== "shadow-phase" || this.shadowBeam) return false;
    this.shadowBeam = {
      startAt: time,
      endAt: time + COMBAT_CONFIG.shadowBeamDurationMs,
      x: this.player.sprite.x,
      y: this.player.sprite.y,
      damaged: new Set(),
    };
    markOffense(this.player, time);
    this.scene.events.emit("shadow-beam-fired");
    return true;
  }

  updateShadowBeam(time = this.scene.time.now) {
    if (!this.shadowBeam) return;
    if (time > this.shadowBeam.endAt) {
      this.shadowBeam = null;
      return;
    }

    this.opponents().forEach((enemy) => {
      if (!enemy.alive || this.shadowBeam.damaged.has(enemy.ownerId)) return;
      if (!this.isPointInsideShadowBeam(enemy.sprite.x, enemy.sprite.y, time)) return;
      this.shadowBeam.damaged.add(enemy.ownerId);
      this.damageOpponent(enemy, COMBAT_CONFIG.shadowBeamDamage, "shadow-beam");
      applySlow(
        enemy,
        this.scene,
        COMBAT_CONFIG.shadowSlowDurationMs,
        COMBAT_CONFIG.shadowSlowMultiplier,
        "shadow-slow",
        time,
      );
    });
  }

  shadowBeamThreatFor(enemy) {
    if (!enemy?.alive || !this.shadowBeam) return { inside: false };
    return {
      inside: this.isPointInsideShadowBeam(enemy.sprite.x, enemy.sprite.y),
      sourceCell: this.map?.worldToCell?.(this.shadowBeam.x, this.shadowBeam.y) || null,
    };
  }

  isCellInsideShadowBeam(cell) {
    if (!this.shadowBeam || !this.map || !cell) return false;
    const world = this.map.cellToWorld(cell.col, cell.row);
    return this.isPointInsideShadowBeam(world.x, world.y);
  }

  isPointInsideShadowBeam(x, y, time = this.scene.time.now) {
    if (!this.shadowBeam) return false;
    const dx = x - this.shadowBeam.x;
    const dy = y - this.shadowBeam.y;
    const distance = Math.hypot(dx, dy);
    const progress = Phaser.Math.Clamp(
      (time - this.shadowBeam.startAt) / COMBAT_CONFIG.shadowBeamDurationMs,
      0,
      1,
    );
    const maxRadius = COMBAT_CONFIG.shadowBeamRadiusTiles * GAME_CONFIG.TILE_SIZE;
    if (distance > maxRadius * progress || distance <= 1) return false;
    return true;
  }

  captureWindTrailSample(time = this.scene.time.now) {
    const x = this.player.sprite.x;
    const y = this.player.sprite.y;
    const minDistance = GAME_CONFIG.TILE_SIZE * 0.42;
    if (
      this.lastWindTrailSample &&
      Math.hypot(x - this.lastWindTrailSample.x, y - this.lastWindTrailSample.y) < minDistance
    ) {
      return;
    }

    const cell = this.map?.worldToCell?.(x, y);
    const cellKey = cell ? systems_HeroAbilitySystem_js_keyOf(cell.col, cell.row) : `${Math.round(x / GAME_CONFIG.TILE_SIZE)},${Math.round(y / GAME_CONFIG.TILE_SIZE)}`;
    const existingTrail = this.windTrails.find((trail) => trail.cellKey === cellKey);
    if (existingTrail) {
      existingTrail.x = x;
      existingTrail.y = y;
      existingTrail.bornAt = time;
      existingTrail.expiresAt = time + COMBAT_CONFIG.windTrailDurationMs;
      this.lastWindTrailSample = { x, y };
      return;
    }

    const trail = {
      x,
      y,
      cellKey,
      bornAt: time,
      expiresAt: time + COMBAT_CONFIG.windTrailDurationMs,
    };
    this.windTrails.unshift(trail);
    this.lastWindTrailSample = { x, y };
  }

  updateWindTrails(time = this.scene.time.now) {
    this.windTrails = this.windTrails.filter((trail) => trail.expiresAt > time);
    if (!this.opponents().length) return;

    const trailRadius = GAME_CONFIG.TILE_SIZE * 0.58;
    const enemiesOnTrail = new Set();
    this.opponents().forEach((enemy) => {
      if (!enemy.alive) return;
      const onTrail = this.windTrails.some(
        (trail) => Math.hypot(enemy.sprite.x - trail.x, enemy.sprite.y - trail.y) <= trailRadius,
      );
      if (!onTrail) {
        if (enemy.slowReason === "wind-trail") clearSlow(enemy);
        return;
      }

      enemiesOnTrail.add(enemy.ownerId);
      applySlow(enemy, this.scene, 140, COMBAT_CONFIG.windSlowMultiplier, "wind-trail", time);
      const lastShockAt = this.windShockTimers.get(enemy.ownerId) ?? -Infinity;
      if (time - lastShockAt < COMBAT_CONFIG.windTrailTickMs) return;
      this.windShockTimers.set(enemy.ownerId, time);
      this.applyEnemyShockVisual(enemy);
      this.damageOpponent(enemy, COMBAT_CONFIG.windTrailDamage, "wind-trail");
    });

    this.windShockTimers.forEach((_, ownerId) => {
      if (!enemiesOnTrail.has(ownerId)) this.windShockTimers.delete(ownerId);
    });
  }

  windThreatFor(enemy) {
    if (!enemy?.alive) return { inside: false };
    const trailRadius = GAME_CONFIG.TILE_SIZE * 0.85;
    const insideTrail = this.windTrails.some(
      (trail) => Math.hypot(enemy.sprite.x - trail.x, enemy.sprite.y - trail.y) <= trailRadius,
    );
    return { inside: insideTrail };
  }

  isCellInsideWindThreat(cell) {
    if (!this.map || !cell) return false;
    const world = this.map.cellToWorld(cell.col, cell.row);
    return this.windTrails.some(
      (trail) => Math.hypot(world.x - trail.x, world.y - trail.y) <= GAME_CONFIG.TILE_SIZE * 0.85,
    );
  }

  updateVoltMeteorSchedule(time = this.scene.time.now) {
    if (!this.active || this.hero.ultimate.id !== "volt-guard") return;
    while (time >= this.nextVoltMeteorAt) {
      this.scheduleVoltMeteorWave(this.nextVoltMeteorAt);
      this.nextVoltMeteorAt += COMBAT_CONFIG.voltMeteorIntervalMs;
    }
  }

  scheduleVoltMeteorWave(time = this.scene.time.now) {
    const enemies = this.opponents();
    enemies.forEach((enemy, index) => {
      const cell = this.opponentCell(enemy);
      if (!cell || !this.map?.cellToWorld) return;
      this.scheduleVoltMeteor(cell, time, index);
    });
  }

  scheduleVoltMeteor(cell, time = this.scene.time.now, index = 0) {
    const warningMs = COMBAT_CONFIG.voltMeteorWarningMs;
    const impactMs = COMBAT_CONFIG.voltMeteorImpactMs;
    const world = this.map.cellToWorld(cell.col, cell.row);
    const meteor = {
      id: `volt-meteor-${this.nextVoltMeteorId++}`,
      col: cell.col,
      row: cell.row,
      x: world.x,
      y: world.y,
      createdAt: time,
      explodeAt: time + warningMs,
      impactEndsAt: time + warningMs + impactMs,
      hitActors: new Set(),
      warning: null,
      meteorBody: null,
      drawEvent: null,
    };

    this.createVoltMeteorWarning(meteor, index);
    this.pendingVoltMeteors.push(meteor);
    this.scene.time.delayedCall?.(warningMs, () => this.impactVoltMeteor(meteor));
  }

  createVoltMeteorWarning(meteor, index = 0) {
    const warning = this.scene.add.graphics?.();
    const meteorBody = this.scene.add.graphics?.();
    if (!warning || !meteorBody) return null;
    warning.setDepth?.(9);
    meteorBody.setDepth?.(12);
    meteor.warning = warning;
    meteor.meteorBody = meteorBody;

    const drawVoltMeteor = () => {
      if (!meteor.warning || meteor.impacted) return;
      warning.clear();
      meteorBody.clear();
      const now = this.scene.time.now;
      const progress = Phaser.Math.Clamp((now - meteor.createdAt) / COMBAT_CONFIG.voltMeteorWarningMs, 0, 1);
      const fall = this.voltMeteorFallPosition(
        { x: meteor.x, y: meteor.y - 260 },
        { x: meteor.x, y: meteor.y },
        progress,
      );
      const pulse = 0.5 + Math.sin(now / 62 + index) * 0.5;
      const warningRadius = 18 + pulse * 8 + progress * 3;

      warning.lineStyle(4, 0x79ff8c, 0.88);
      warning.strokeCircle(meteor.x, meteor.y, warningRadius);
      warning.lineStyle(2, 0xd8ffd9, 0.78);
      warning.strokeCircle(meteor.x, meteor.y, 10 + pulse * 3);
      warning.fillStyle(0x16ff72, 0.14 + pulse * 0.07);
      warning.fillCircle(meteor.x, meteor.y, 16 + pulse * 5);
      this.drawCross(warning, meteor.x, meteor.y, 14, 0x79ff8c, 0.8);

      for (let trail = 0; trail < 4; trail += 1) {
        const fade = 1 - trail / 4;
        meteorBody.fillStyle(0x123a26, 0.24 * fade * (1 - progress * 0.24));
        meteorBody.fillCircle(fall.x, fall.y - 26 - trail * 24, 12 + trail * 4);
        meteorBody.lineStyle(2, 0x79ff8c, 0.18 * fade);
        meteorBody.strokeCircle(fall.x, fall.y - 24 - trail * 24, 10 + trail * 5);
      }

      meteorBody.lineStyle(4, 0xd8ffd9, 0.78);
      meteorBody.beginPath();
      meteorBody.moveTo(fall.x, fall.y - 78);
      meteorBody.lineTo(fall.x, fall.y - 26);
      meteorBody.strokePath();
      meteorBody.fillStyle(0x2cff86, 0.96);
      meteorBody.fillCircle(fall.x, fall.y, 15);
      meteorBody.fillStyle(0xd8ffd9, 0.82);
      meteorBody.fillCircle(fall.x - 5, fall.y - 6, 7);
      meteorBody.fillStyle(0x0b2a19, 0.92);
      meteorBody.fillCircle(fall.x + 4, fall.y + 4, 8);
      this.drawCross(meteorBody, fall.x, fall.y, 12, 0xd8ffd9, 0.72);
    };

    drawVoltMeteor();
    const repeatDraw = () => {
      drawVoltMeteor();
      if (meteor.warning && !meteor.impacted) {
        meteor.drawEvent = this.scene.time.delayedCall?.(80, repeatDraw);
      }
    };
    meteor.drawEvent = this.scene.time.delayedCall?.(80, repeatDraw);
    return warning;
  }

  impactVoltMeteor(meteor) {
    meteor.impacted = true;
    this.pendingVoltMeteors = this.pendingVoltMeteors.filter((item) => item !== meteor);
    meteor.drawEvent?.remove?.();
    meteor.warning?.destroy?.();
    meteor.meteorBody?.destroy?.();
    const impact = this.scene.add.graphics?.();
    if (impact) {
      impact.setDepth?.(12);
      impact.fillStyle(0x79ff8c, 0.34);
      impact.fillCircle(meteor.x, meteor.y, 25);
      impact.lineStyle(5, 0xd8ffd9, 0.86);
      impact.strokeCircle(meteor.x, meteor.y, 24);
      impact.lineStyle(2, 0x23ff88, 0.62);
      impact.strokeCircle(meteor.x, meteor.y, 36);
      this.drawCross(impact, meteor.x, meteor.y, 19, 0xd8ffd9, 0.92);
      this.scene.tweens.add?.({
        targets: impact,
        alpha: 0,
        duration: 260,
        onComplete: () => impact.destroy?.(),
      });
    }

    this.activeVoltImpacts.set(meteor.id, meteor);
    this.opponents().forEach((enemy) => {
      if (!enemy.alive || meteor.hitActors.has(enemy.ownerId)) return;
      const cell = this.opponentCell(enemy);
      if (!cell || cell.col !== meteor.col || cell.row !== meteor.row) return;
      meteor.hitActors.add(enemy.ownerId);
      this.damageOpponent(enemy, COMBAT_CONFIG.voltMeteorDamage, "volt-meteor");
    });
  }

  updateVoltMeteorImpacts(time = this.scene.time.now) {
    this.activeVoltImpacts.forEach((meteor, id) => {
      if (time <= meteor.impactEndsAt) return;
      this.activeVoltImpacts.delete(id);
    });
  }

  pendingVoltMeteorDangerMap() {
    const dangerMap = new Map();
    this.pendingVoltMeteors.forEach((meteor) => {
      dangerMap.set(systems_HeroAbilitySystem_js_keyOf(meteor.col, meteor.row), {
        explodeAt: meteor.explodeAt,
        kind: "volt-meteor",
      });
    });
    return dangerMap;
  }

  voltMeteorFallPosition(start, target, progress) {
    const clamped = Phaser.Math.Clamp(progress, 0, 1);
    const gravityProgress = clamped * clamped;
    return {
      x: start.x + (target.x - start.x) * clamped,
      y: start.y + (target.y - start.y) * gravityProgress,
    };
  }

  applyEnemyShockVisual(enemy) {
    if (!enemy?.sprite) return;
    enemy.sprite.setTint?.(0xbefcff);
    this.scene.time.delayedCall?.(70, () => enemy.sprite?.setTint?.(0x31e9ff));
    this.scene.time.delayedCall?.(150, () => enemy.sprite?.clearTint?.());

    const ring = this.scene.add.graphics?.();
    if (!ring) return;
    ring.setDepth?.(13);
    const { x, y } = enemy.sprite;
    const sparkOffset = (this.scene.time.now || 0) % 17;
    ring.lineStyle(4, 0x7df4d4, 0.92);
    ring.strokeCircle(x, y, 24);
    ring.lineStyle(2, 0xffffff, 0.82);
    ring.strokeCircle(x, y, 15);
    ring.lineStyle(3, 0x31e9ff, 0.96);
    for (let index = 0; index < 5; index += 1) {
      const angle = (Math.PI * 2 * index) / 5 + sparkOffset;
      const inner = 13 + (index % 2) * 4;
      const outer = 28 + (index % 3) * 6;
      ring.beginPath();
      ring.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
      ring.lineTo(x + Math.cos(angle + 0.22) * outer, y + Math.sin(angle + 0.22) * outer);
      ring.lineTo(x + Math.cos(angle - 0.08) * (outer - 7), y + Math.sin(angle - 0.08) * (outer - 7));
      ring.strokePath();
    }
    ring.fillStyle(0x7df4d4, 0.28);
    ring.fillCircle(x, y, 21);
    this.windShockEffects.push(ring);
    this.scene.tweens.add?.({
      targets: ring,
      alpha: 0,
      duration: 180,
      onComplete: () => {
        ring.destroy?.();
        this.windShockEffects = this.windShockEffects.filter((item) => item !== ring);
      },
    });
  }

  clearWindShockEffects() {
    this.windShockEffects?.forEach((effect) => effect.destroy?.());
    this.windShockEffects = [];
  }

  facingVector() {
    if (this.player.facing === "left") return { x: -1, y: 0 };
    if (this.player.facing === "right") return { x: 1, y: 0 };
    if (this.player.facing === "up") return { x: 0, y: -1 };
    return { x: 0, y: 1 };
  }

  applyEnemyBurnVisual(enemy, burning) {
    if (!enemy?.sprite) return;
    if (burning) {
      this.emberBurningEnemies.add(enemy.ownerId);
      enemy.sprite.setTint?.(0xff8c2a);
      return;
    }

    this.emberBurningEnemies.delete(enemy.ownerId);
    enemy.sprite.clearTint?.();
  }

  clearEmberBurnVisuals() {
    if (!this.ai?.enemies && !this.registry) {
      this.emberBurningEnemies.clear();
      return;
    }
    this.opponents().forEach((enemy) => this.applyEnemyBurnVisual(enemy, false));
    this.emberBurningEnemies.clear();
  }

  captureTrailSample() {
    this.trail.unshift({ x: this.player.sprite.x, y: this.player.sprite.y });
    this.trail = this.trail.slice(0, 6);
  }

  snapPlayerOutOfBlockedCell() {
    if (!this.map || !this.player?.currentCell) return;
    const start = this.player.currentCell();
    if (!this.map.isInside(start.col, start.row)) return;
    const radius = 13;
    if (this.map.canMoveToWorld(this.player.sprite.x, this.player.sprite.y, radius)) return;

    const queue = [{ col: start.col, row: start.row }];
    const seen = new Set([systems_HeroAbilitySystem_js_keyOf(start.col, start.row)]);

    while (queue.length) {
      const cell = queue.shift();
      if (this.isTraversableForEndState(cell.col, cell.row)) {
        const world = this.map.cellToWorld(cell.col, cell.row);
        if (this.map.canMoveToWorld(world.x, world.y, radius)) {
          this.player.sprite.setPosition(world.x, world.y);
          this.player.ignoredBombKey = null;
          this.scene.events.emit("shadow-phase-ejected", cell);
          return;
        }
      }

      DIRECTIONS.forEach((dir) => {
        const next = { col: cell.col + dir.col, row: cell.row + dir.row };
        const nextKey = systems_HeroAbilitySystem_js_keyOf(next.col, next.row);
        if (!this.map.isInside(next.col, next.row) || seen.has(nextKey)) return;
        seen.add(nextKey);
        queue.push(next);
      });
    }
  }

  isTraversableForEndState(col, row) {
    return this.map.getCell(col, row) === CELL.EMPTY && !this.map.hasBomb(col, row);
  }

  drawEffects(time) {
    if (this.shadowExitPulse && time >= this.shadowExitPulse.endAt) this.shadowExitPulse = null;
    this.effectBack.clear();
    this.effectFront.clear();
    const hasResidualEffects =
      this.active || this.windTrails.length > 0 || this.emberAfterburnTimers.size > 0 || !!this.shadowBeam || !!this.shadowExitPulse;
    this.effectBack.setVisible(hasResidualEffects);
    this.effectFront.setVisible(hasResidualEffects);

    if (!this.active) {
      this.drawWindTrailResidues(time);
      this.drawBurningEnemyEffects(time);
      this.drawShadowBeamEffect(time);
      this.drawShadowExitEffect(time);
      return;
    }

    if (this.hero.ultimate.id === "shadow-phase") {
      this.drawShadowEffects(time);
      return;
    }

    if (this.hero.ultimate.id === "ember-aura") {
      this.drawEmberEffects(time);
      return;
    }

    if (this.hero.ultimate.id === "volt-guard") {
      this.drawVoltEffects(time);
      return;
    }

    if (this.hero.ultimate.id === "wind-surge") {
      this.drawWindEffects(time);
    }
  }

  drawShadowEffects(time) {
    const { x, y } = this.player.sprite;
    const pulse = 0.18 + (Math.sin(time / 140) + 1) * 0.05;

    this.trail.forEach((sample, index) => {
      const alpha = Math.max(0.08, 0.22 - index * 0.03);
      this.effectBack.fillStyle(0x5c2cff, alpha);
      this.effectBack.fillCircle(sample.x, sample.y, 18 - index);
    });

    this.effectFront.lineStyle(3, 0x9a7cff, 0.62);
    this.effectFront.strokeCircle(x, y, 28);
    this.effectFront.fillStyle(0x9a7cff, pulse);
    this.effectFront.fillCircle(x, y, 20);
    this.effectFront.lineStyle(2, 0x2b103b, 0.72);
    this.effectFront.strokeEllipse(x, y, 64, 28);
    this.drawShadowBeamEffect(time);
  }

  drawShadowExitEffect(time) {
    if (!this.shadowExitPulse) return;
    const progress = Phaser.Math.Clamp(
      (time - this.shadowExitPulse.startAt) / (this.shadowExitPulse.endAt - this.shadowExitPulse.startAt),
      0,
      1,
    );
    const radius = 20 + progress * 36;
    const alpha = 0.72 * (1 - progress);
    this.effectFront.lineStyle(4, 0xd8b6ff, alpha);
    this.effectFront.strokeCircle(this.shadowExitPulse.x, this.shadowExitPulse.y, radius);
    this.effectFront.lineStyle(2, 0x6f38ff, alpha * 0.78);
    this.effectFront.strokeCircle(this.shadowExitPulse.x, this.shadowExitPulse.y, radius * 0.62);
  }

  drawShadowBeamEffect(time) {
    if (!this.shadowBeam) return;
    const progress = Phaser.Math.Clamp(
      (time - this.shadowBeam.startAt) / COMBAT_CONFIG.shadowBeamDurationMs,
      0,
      1,
    );
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const radius = COMBAT_CONFIG.shadowBeamRadiusTiles * GAME_CONFIG.TILE_SIZE * easedProgress;
    const visualRadius = Math.min(COMBAT_CONFIG.shadowBeamRadiusTiles * GAME_CONFIG.TILE_SIZE, radius + 16);
    const x = this.shadowBeam.x;
    const y = this.shadowBeam.y;
    const coreAlpha = 0.08 + (1 - progress) * 0.08;
    const edgeAlpha = 0.42 + (1 - progress) * 0.22;
    const rippleOffset = Math.sin(time / 48) * 5;

    this.effectBack.fillStyle(0x5224ff, coreAlpha);
    this.effectBack.fillCircle(x, y, visualRadius);
    this.effectBack.fillStyle(0xb86bff, 0.045 + (1 - progress) * 0.035);
    this.effectBack.fillCircle(x, y, Math.max(18, visualRadius * 0.68));

    this.effectFront.lineStyle(5, 0xd8b6ff, edgeAlpha);
    this.effectFront.strokeCircle(x, y, visualRadius + rippleOffset);
    this.effectFront.lineStyle(2, 0x8f48ff, 0.34);
    this.effectFront.strokeCircle(x, y, Math.max(10, visualRadius * 0.72 - rippleOffset * 0.5));
    this.effectFront.lineStyle(1, 0xf1dcff, 0.22);
    this.effectFront.strokeCircle(x, y, Math.max(8, visualRadius * 0.42 + rippleOffset));

    for (let index = 0; index < 16; index += 1) {
      const spokeAngle = time / 240 + (Math.PI * 2 * index) / 16;
      const spokeLength = visualRadius * (0.55 + (index % 4) * 0.1);
      const inner = Math.max(10, spokeLength * 0.24);
      this.effectFront.lineStyle(index % 4 === 0 ? 3 : 2, index % 4 === 0 ? 0xd8b6ff : 0x8f48ff, index % 4 === 0 ? 0.24 : 0.16);
      this.effectFront.beginPath();
      this.effectFront.moveTo(x + Math.cos(spokeAngle) * inner, y + Math.sin(spokeAngle) * inner);
      this.effectFront.lineTo(x + Math.cos(spokeAngle) * spokeLength, y + Math.sin(spokeAngle) * spokeLength);
      this.effectFront.strokePath();
    }

    for (let index = 0; index < 18; index += 1) {
      const travel = ((time / 95 + index * 0.13) % 1) * visualRadius;
      const angle = time / 180 + (Math.PI * 2 * index) / 18;
      const px = x + Math.cos(angle) * travel;
      const py = y + Math.sin(angle) * travel;
      this.effectFront.fillStyle(0xd6b7ff, 0.18 + (index % 3) * 0.055);
      this.effectFront.fillCircle(px, py, 2 + (index % 2));
    }

    this.effectFront.fillStyle(0xf1dcff, 0.2 + (1 - progress) * 0.22);
    this.effectFront.fillCircle(x, y, 8 + Math.sin(time / 35) * 2);
  }

  drawEmberEffects(time) {
    const { x, y } = this.player.sprite;
    const radiusPx = (this.hero.ultimate.radiusTiles || 2) * GAME_CONFIG.TILE_SIZE;
    const pulse = Math.sin(time / 130);
    const breathingRadius = radiusPx + pulse * 10;

    this.effectBack.fillStyle(0xff2a12, 0.09);
    this.effectBack.fillCircle(x, y, breathingRadius);
    this.effectBack.fillStyle(0xff7a1f, 0.08);
    this.effectBack.fillCircle(x, y, radiusPx * 0.68 + Math.cos(time / 170) * 8);
    this.effectBack.lineStyle(7, 0xff5a1f, 0.42);
    this.effectBack.strokeCircle(x, y, breathingRadius - 4);
    this.effectBack.lineStyle(3, 0xffd66b, 0.28);
    this.effectBack.strokeCircle(x, y, radiusPx - 22 + Math.sin(time / 90) * 5);
    this.effectBack.lineStyle(2, 0xfff0a8, 0.16);
    this.effectBack.strokeCircle(x, y, radiusPx * 0.48 + Math.cos(time / 120) * 4);

    for (let index = 0; index < 22; index += 1) {
      const orbit = index % 2 === 0 ? time / 260 : -time / 310;
      const angle = orbit + (Math.PI * 2 * index) / 22;
      const flameRadius = radiusPx - 10 + Math.sin(time / 100 + index * 0.7) * 14;
      const px = x + Math.cos(angle) * flameRadius;
      const py = y + Math.sin(angle) * flameRadius;
      const flameSize = 5 + ((index + Math.floor(time / 120)) % 3);
      this.effectFront.fillStyle(0xff5a1f, 0.68);
      this.effectFront.fillCircle(px, py, flameSize + 2);
      this.effectFront.fillStyle(0xffd66b, 0.62);
      this.effectFront.fillCircle(px, py - flameSize * 0.7, Math.max(2, flameSize - 2));
    }

    for (let index = 0; index < 10; index += 1) {
      const angle = time / 180 + (Math.PI * 2 * index) / 10;
      const px = x + Math.cos(angle) * (radiusPx * 0.34 + Math.sin(time / 90 + index) * 10);
      const py = y + Math.sin(angle) * (radiusPx * 0.24 + Math.cos(time / 110 + index) * 6);
      this.effectFront.fillStyle(0xfff0a8, 0.35);
      this.effectFront.fillCircle(px, py, 3);
    }

    this.drawBurningEnemyEffects(time);

    this.effectFront.fillStyle(0xff6d1f, 0.22);
    this.effectFront.fillEllipse(x, y + 10, 124, 54);
  }

  drawBurningEnemyEffects(time) {
    this.opponents().forEach((enemy, enemyIndex) => {
      const burning = this.emberBurnTimers.has(enemy.ownerId);
      const afterburn = this.emberAfterburnTimers.has(enemy.ownerId);
      if (!enemy.alive || (!burning && !afterburn)) return;

      const elapsed = this.emberBurnTimers.get(enemy.ownerId) || 0;
      const afterburnHeat = afterburn
        ? Phaser.Math.Clamp((this.emberAfterburnTimers.get(enemy.ownerId) || 0) / COMBAT_CONFIG.emberAfterburnDurationMs, 0.22, 0.72)
        : 0;
      const heat = burning
        ? Phaser.Math.Clamp(elapsed / (this.hero.ultimate.killAfterMs || 5000), 0.25, 1)
        : afterburnHeat;
      const { x, y } = enemy.sprite;

      this.effectFront.lineStyle(2 + heat * 2, 0xff7a1f, 0.45 + heat * 0.25);
      this.effectFront.strokeCircle(x, y + 2, 18 + Math.sin(time / 80 + enemyIndex) * 3);

      for (let index = 0; index < 5; index += 1) {
        const angle = time / 95 + enemyIndex + (Math.PI * 2 * index) / 5;
        const px = x + Math.cos(angle) * (13 + heat * 9);
        const py = y - 8 + Math.sin(angle) * 13 - ((time / 35 + index * 7) % 16);
        this.effectFront.fillStyle(0xff3d16, 0.55 + heat * 0.22);
        this.effectFront.fillCircle(px, py, 4 + heat * 3);
        this.effectFront.fillStyle(0xffe06b, 0.58);
        this.effectFront.fillCircle(px, py - 4, 2 + heat * 1.5);
      }
    });
  }

  drawVoltEffects(time) {
    const { x, y } = this.player.sprite;
    const flashBoost = time < this.effectFlashUntil ? 1.32 : 1;
    const crossColor = 0x79ff8c;

    this.effectBack.fillStyle(0x0d2011, 0.18);
    this.effectBack.fillCircle(x, y, 34);
    this.effectBack.lineStyle(3, crossColor, 0.68);
    this.effectBack.strokeCircle(x, y, 26);

    this.drawCross(this.effectFront, x, y - 28, 12 * flashBoost, crossColor, 0.85);
    this.drawCross(this.effectFront, x - 26, y + 2, 9 * flashBoost, 0x44f26e, 0.74);
    this.drawCross(this.effectFront, x + 26, y + 2, 9 * flashBoost, 0x44f26e, 0.74);
  }

  drawWindEffects(time) {
    const { x, y } = this.player.sprite;
    this.drawWindTrailResidues(time);

    this.trail.forEach((sample, index) => {
      const alpha = Math.max(0.08, 0.24 - index * 0.035);
      this.effectBack.fillStyle(0x58e8ff, alpha);
      this.effectBack.fillEllipse(sample.x, sample.y, 28 - index * 2, 18 - index);
    });

    for (let index = 0; index < 3; index += 1) {
      const offset = (time / 90 + index) % 1;
      const px = x - 16 + index * 16;
      const py = y - 22 + Math.sin(time / 80 + index) * 8;
      this.effectFront.lineStyle(3, 0x7df4d4, 0.88);
      this.effectFront.beginPath();
      this.effectFront.moveTo(px, py - 8);
      this.effectFront.lineTo(px + 6, py + 2);
      this.effectFront.lineTo(px - 4, py + 6);
      this.effectFront.lineTo(px + 2, py + 19 + offset * 2);
      this.effectFront.strokePath();
    }

    this.effectFront.lineStyle(2, 0x58e8ff, 0.55);
    this.effectFront.strokeEllipse(x, y, 50, 24);
  }

  drawWindTrailResidues(time) {
    this.windTrails.forEach((trail, index) => {
      const age = Phaser.Math.Clamp((time - trail.bornAt) / COMBAT_CONFIG.windTrailDurationMs, 0, 1);
      const alpha = 0.34 * (1 - age);
      const pulse = Math.sin(time / 70 + index) * 4;
      this.effectBack.fillStyle(0x31e9ff, alpha * 0.46);
      this.effectBack.fillEllipse(trail.x, trail.y, 34 + pulse, 19 + pulse * 0.35);
      this.effectFront.lineStyle(2, 0x7df4d4, alpha + 0.08);
      this.effectFront.strokeEllipse(trail.x, trail.y, 38 + pulse, 22);
      this.effectFront.lineStyle(3, 0xd9ffff, alpha + 0.1);
      this.effectFront.beginPath();
      this.effectFront.moveTo(trail.x - 11, trail.y);
      this.effectFront.lineTo(trail.x - 3, trail.y - 9);
      this.effectFront.lineTo(trail.x + 2, trail.y + 8);
      this.effectFront.lineTo(trail.x + 11, trail.y);
      this.effectFront.strokePath();
      this.effectFront.lineStyle(1, 0xd9ffff, alpha * 0.72);
      this.effectFront.strokeCircle(trail.x, trail.y, 8 + Math.sin(time / 80 + index) * 2);
    });
  }

  drawCross(graphics, x, y, size, color, alpha) {
    graphics.lineStyle(4, color, alpha);
    graphics.beginPath();
    graphics.moveTo(x - size, y);
    graphics.lineTo(x + size, y);
    graphics.moveTo(x, y - size);
    graphics.lineTo(x, y + size);
    graphics.strokePath();
  }
}
Object.assign(__bundle, { HeroAbilitySystem });
}

// systems/MeteorSystem.js
{
const { CELL, COMBAT_CONFIG, GAME_CONFIG } = __bundle;
const systems_MeteorSystem_js_keyOf = (col, row) => `${col},${row}`;

class MeteorSystem {
  constructor(scene, mapSystem, playerSystem, aiSystem, itemSystem, registry = null) {
    this.scene = scene;
    this.map = mapSystem;
    this.players = Array.isArray(playerSystem) ? playerSystem : [playerSystem].filter(Boolean);
    this.player = this.players[0] || null;
    this.ai = aiSystem;
    this.items = itemSystem;
    this.registry = registry;
    this.config = mapSystem.mapConfig.meteor;
    this.nextWaveAt = this.config.firstDelayMs;
    this.pending = [];
    this.activeImpacts = new Map();
    this.nextImpactId = 1;
  }

  update(time) {
    while (time >= this.nextWaveAt) {
      this.spawnWave(time);
      this.nextWaveAt += this.config.intervalMs;
    }
    this.checkImpactHits();
  }

  static fallPosition(start, target, progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    const gravityProgress = clamped * clamped;
    return {
      x: start.x + (target.x - start.x) * clamped,
      y: start.y + (target.y - start.y) * gravityProgress,
    };
  }

  pendingDangerMap() {
    const danger = new Map();
    this.pending.forEach((meteor) => {
      if (meteor.impacted) return;
      danger.set(systems_MeteorSystem_js_keyOf(meteor.col, meteor.row), {
        col: meteor.col,
        row: meteor.row,
        explodeAt: meteor.impactAt,
        kind: "meteor",
      });
    });
    return danger;
  }

  spawnWave(time) {
    const cells = this.pickMeteorCells(this.config.count);
    cells.forEach((cell, index) => this.scheduleMeteor(cell, time, index));
  }

  pickMeteorCells(count) {
    const candidates = [];
    const occupied = new Set();
    this.pending.forEach((meteor) => occupied.add(systems_MeteorSystem_js_keyOf(meteor.col, meteor.row)));

    for (let row = 1; row < GAME_CONFIG.GRID_ROWS - 1; row += 1) {
      for (let col = 1; col < GAME_CONFIG.GRID_COLS - 1; col += 1) {
        const key = systems_MeteorSystem_js_keyOf(col, row);
        if (occupied.has(key)) continue;
        if (!this.canTargetCell(col, row)) continue;
        const cell = this.map.getCell(col, row);
        candidates.push({ col, row, weight: cell === CELL.BREAKABLE_BOX ? 3 : 1 });
      }
    }

    const chosen = [];
    while (chosen.length < count && candidates.length) {
      const totalWeight = candidates.reduce((sum, cell) => sum + cell.weight, 0);
      let roll = Phaser.Math.Between(1, totalWeight);
      let selectedIndex = 0;
      for (let index = 0; index < candidates.length; index += 1) {
        roll -= candidates[index].weight;
        if (roll <= 0) {
          selectedIndex = index;
          break;
        }
      }
      const [cell] = candidates.splice(selectedIndex, 1);
      chosen.push({ col: cell.col, row: cell.row });
    }
    return chosen;
  }

  canTargetCell(col, row) {
    const cell = this.map.getCell(col, row);
    if (cell === CELL.SOLID_WALL) return false;
    if (this.map.hasBomb(col, row) || this.map.hasExplosionAt(col, row)) return false;
    if (this.items.items?.has?.(systems_MeteorSystem_js_keyOf(col, row))) return false;
    return true;
  }

  scheduleMeteor(cell, time, index) {
    const { x, y } = this.map.cellToWorld(cell.col, cell.row);
    const warning = this.scene.add.graphics().setDepth(9);
    const meteorBody = this.scene.add.graphics().setDepth(12);
    const meteor = { ...cell, warning, meteorBody, startAt: time, impactAt: time + this.config.warningMs };
    this.pending.push(meteor);

    this.scene.tweens.add({
      targets: warning,
      alpha: 0.45,
      duration: 180,
      yoyo: true,
      repeat: Math.max(1, Math.floor(this.config.warningMs / 360)),
    });

    const drawWarning = () => {
      if (!warning || warning.destroyed) return;
      warning.clear();
      meteorBody.clear();
      const now = this.scene.time.now;
      const progress = Phaser.Math.Clamp((now - meteor.startAt) / this.config.warningMs, 0, 1);
      const pulse = 0.5 + Math.sin(now / 70 + index) * 0.5;
      const incoming = MeteorSystem.fallPosition({ x: x - 58, y: y - 250 }, { x, y }, progress);
      const incomingX = incoming.x;
      const incomingY = incoming.y;
      const smokeAlpha = 0.34 + progress * 0.18;

      warning.lineStyle(3, 0xff5a22, 0.9);
      warning.strokeCircle(x, y, 19 + pulse * 8);
      warning.lineStyle(2, 0xffd777, 0.68);
      warning.beginPath();
      warning.moveTo(x - 16, y);
      warning.lineTo(x + 16, y);
      warning.moveTo(x, y - 16);
      warning.lineTo(x, y + 16);
      warning.strokePath();
      warning.fillStyle(0xff3d16, 0.16);
      warning.fillCircle(x, y, 17 + pulse * 5);

      for (let trail = 0; trail < 5; trail += 1) {
        const t = trail / 5;
        meteorBody.fillStyle(0x3b342e, smokeAlpha * (1 - t) * 0.62);
        meteorBody.fillCircle(incomingX - 14 - trail * 10, incomingY - 22 - trail * 22, 14 + trail * 4);
        meteorBody.fillStyle(0xff6a1f, (0.55 - t * 0.08) * (1 - progress * 0.2));
        meteorBody.fillCircle(incomingX - 5 - trail * 6, incomingY - 14 - trail * 16, 8 + trail * 2);
      }

      meteorBody.lineStyle(5, 0xff8a2a, 0.72);
      meteorBody.beginPath();
      meteorBody.moveTo(incomingX - 36, incomingY - 86);
      meteorBody.lineTo(incomingX - 8, incomingY - 22);
      meteorBody.strokePath();
      meteorBody.fillStyle(0xff3d16, 0.96);
      meteorBody.fillCircle(incomingX, incomingY, 15);
      meteorBody.fillStyle(0xffd777, 0.82);
      meteorBody.fillCircle(incomingX - 4, incomingY - 5, 8);
      meteorBody.fillStyle(0x2a211c, 0.95);
      meteorBody.fillCircle(incomingX + 3, incomingY + 4, 7);
    };
    drawWarning();
    const repeatDraw = () => {
      drawWarning();
      if (meteor.warning && !meteor.impacted) {
        meteor.drawEvent = this.scene.time.delayedCall(120, repeatDraw);
      }
    };
    meteor.drawEvent = this.scene.time.delayedCall(120, repeatDraw);

    meteor.impactEvent = this.scene.time.delayedCall(this.config.warningMs, () => this.impact(meteor));
  }

  impact(meteor) {
    meteor.impacted = true;
    this.pending = this.pending.filter((item) => item !== meteor);
    meteor.drawEvent?.remove?.();
    this.scene.tweens.killTweensOf?.(meteor.warning);
    meteor.warning?.destroy?.();
    meteor.meteorBody?.destroy?.();

    const { x, y } = this.map.cellToWorld(meteor.col, meteor.row);
    const impact = this.scene.add.graphics().setDepth(10);
    impact.fillStyle(0xff3d16, 0.68);
    impact.fillCircle(x, y, 28);
    impact.fillStyle(0xffd777, 0.56);
    impact.fillCircle(x - 4, y - 5, 14);
    impact.fillStyle(0x2e2925, 0.38);
    impact.fillCircle(x - 18, y - 18, 18);
    impact.fillCircle(x + 20, y - 12, 16);
    impact.fillCircle(x + 2, y + 18, 20);
    impact.lineStyle(5, 0xff8a2a, 0.78);
    impact.strokeCircle(x, y, 30);
    impact.lineStyle(2, 0x2a211c, 0.72);
    impact.beginPath();
    impact.moveTo(x - 30, y + 8);
    impact.lineTo(x + 30, y - 8);
    impact.moveTo(x - 18, y - 22);
    impact.lineTo(x + 18, y + 24);
    impact.strokePath();
    this.scene.tweens.add({
      targets: impact,
      alpha: 0,
      duration: Math.min(180, this.config.impactMs),
      onComplete: () => impact.destroy(),
    });

    this.items.removeAt(meteor.col, meteor.row);
    if (this.map.destroyBox(meteor.col, meteor.row)) {
      this.scene.time.delayedCall(this.config.impactMs + 20, () => this.items.maybeDrop(meteor.col, meteor.row));
    }

    const key = systems_MeteorSystem_js_keyOf(meteor.col, meteor.row);
    this.activeImpacts.set(key, {
      id: this.nextImpactId++,
      col: meteor.col,
      row: meteor.row,
      hitActors: new Set(),
    });
    this.map.markExplosion(meteor.col, meteor.row);
    this.checkImpactHits();
    this.scene.time.delayedCall(this.config.impactMs, () => {
      this.activeImpacts.delete(key);
      this.map.clearExplosion(meteor.col, meteor.row);
    });
  }

  checkImpactHits() {
    if (!this.activeImpacts.size) return;
    if (this.registry) {
      this.registry.alive().forEach((actor) => {
        const actorCell = actor.currentCell?.() || this.ai.currentCell?.(actor);
        if (!actorCell) return;
        const impact = this.activeImpacts.get(systems_MeteorSystem_js_keyOf(actorCell.col, actorCell.row));
        if (!impact || impact.hitActors.has(actor.ownerId)) return;
        impact.hitActors.add(actor.ownerId);
        actor.takeDamage?.(COMBAT_CONFIG.meteorDamage, "meteor");
      });
      return;
    }
    if (this.player.alive) {
      const playerCell = this.player.currentCell();
      const impact = this.activeImpacts.get(systems_MeteorSystem_js_keyOf(playerCell.col, playerCell.row));
      if (impact && !impact.hitActors.has("player")) {
        impact.hitActors.add("player");
        this.player.takeDamage?.(COMBAT_CONFIG.meteorDamage, "meteor");
      }
    }

    this.ai.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      const enemyCell = this.ai.currentCell(enemy);
      const impact = this.activeImpacts.get(systems_MeteorSystem_js_keyOf(enemyCell.col, enemyCell.row));
      const actorKey = enemy.ownerId || `enemy-${this.ai.enemies.indexOf(enemy)}`;
      if (impact && !impact.hitActors.has(actorKey)) {
        impact.hitActors.add(actorKey);
        this.ai.damageEnemy?.(enemy, COMBAT_CONFIG.meteorDamage, "meteor");
      }
    });
  }
}
Object.assign(__bundle, { MeteorSystem });
}

// systems/PortalSystem.js
{
const cellKey = (cell) => `${cell.col},${cell.row}`;

const PORTAL_GROUPS = {
  horizontal: {
    color: 0xa45cff,
    idleTexture: "portalHorizontalIdle",
    openTexture: "portalHorizontalOpen",
    endpoints: [
      { col: 1, row: 6 },
      { col: 13, row: 6 },
    ],
  },
  vertical: {
    color: 0xffd45a,
    idleTexture: "portalVerticalIdle",
    openTexture: "portalVerticalOpen",
    endpoints: [
      { col: 7, row: 1 },
      { col: 7, row: 11 },
    ],
  },
};

class PortalSystem {
  constructor(scene, mapSystem, registry, aiSystem = null) {
    this.scene = scene;
    this.map = mapSystem;
    this.registry = registry;
    this.aiSystem = aiSystem;
    this.config = mapSystem.mapConfig?.portal || null;
    this.enabled = this.config?.enabled === true;
    this.groups = new Map();
    this.requiresExit = new Set();
  }

  create() {
    if (!this.enabled) return;
    Object.entries(PORTAL_GROUPS).forEach(([id, definition]) => {
      const group = {
        id,
        ...definition,
        state: "idle",
        chargingOwnerId: null,
        chargeStartedAt: 0,
        openUntil: 0,
        cooldownUntil: 0,
        teleported: new Set(),
        visuals: [],
      };
      definition.endpoints.forEach((cell) => {
        const { x, y } = this.map.cellToWorld(cell.col, cell.row);
        const textureKey = this.map.mapConfig.textures[definition.idleTexture];
        const sprite = this.scene.add.image(x, y, textureKey).setDepth(4);
        const halo = this.scene.add.circle(x, y, 19, definition.color, 0.035)
          .setDepth(3)
          .setStrokeStyle(2, definition.color, 0.34);
        const progress = this.scene.add.graphics().setDepth(12);
        group.visuals.push({ cell, sprite, halo, progress });
      });
      this.groups.set(id, group);
    });
  }

  update(time) {
    if (!this.enabled) return;
    this.releaseExitedActors();
    this.groups.forEach((group) => {
      if (group.state === "open") {
        this.teleportWaitingActors(group);
        if (time >= group.openUntil) this.beginCooldown(group, time);
      } else if (group.state === "cooldown") {
        if (time >= group.cooldownUntil) this.resetGroup(group);
      } else {
        this.updateChannel(group, time);
      }
      this.updateVisuals(group, time);
    });
  }

  groupState(groupId) {
    return this.groups.get(groupId)?.state || "disabled";
  }

  isPortalCell(cell) {
    return this.groupForCell(cell) !== null;
  }

  groupForCell(cell) {
    for (const group of this.groups.values()) {
      if (group.endpoints.some((endpoint) => cellKey(endpoint) === cellKey(cell))) return group;
    }
    return null;
  }

  pairedDestination(cell) {
    const group = this.groupForCell(cell);
    if (!group) return null;
    return group.endpoints.find((endpoint) => cellKey(endpoint) !== cellKey(cell)) || null;
  }

  canPlanThrough(groupId) {
    const state = this.groupState(groupId);
    return state === "idle" || state === "charging" || state === "open";
  }

  isDestinationSafe(cell, danger = new Set()) {
    const key = cellKey(cell);
    return (
      !danger.has(key) &&
      !this.map.hasBomb(cell.col, cell.row) &&
      !this.map.hasExplosionAt(cell.col, cell.row)
    );
  }

  updateChannel(group, time) {
    const candidates = this.actorsAtEndpoints(group)
      .filter((actor) => !this.requiresExit.has(actor.ownerId));
    const chargingActor =
      candidates.find((actor) => actor.ownerId === group.chargingOwnerId) ||
      candidates[0] ||
      null;

    if (!chargingActor) {
      group.state = "idle";
      group.chargingOwnerId = null;
      group.chargeStartedAt = 0;
      return;
    }

    if (group.chargingOwnerId !== chargingActor.ownerId) {
      group.chargingOwnerId = chargingActor.ownerId;
      group.chargeStartedAt = time;
    }
    group.state = "charging";
    if (time - group.chargeStartedAt >= this.config.channelMs) {
      this.openGroup(group, time);
      this.teleportWaitingActors(group);
    }
  }

  openGroup(group, time) {
    group.state = "open";
    group.openUntil = time + this.config.openMs;
    group.teleported.clear();
    group.chargingOwnerId = null;
    group.chargeStartedAt = 0;
    this.scene.events?.emit?.("portal-opened", group.id);
    this.pulseGroup(group, 1.55, 250);
  }

  beginCooldown(group, time) {
    group.state = "cooldown";
    group.cooldownUntil = time + this.config.cooldownMs;
    group.teleported.clear();
    this.scene.events?.emit?.("portal-cooldown", group.id);
    this.pulseGroup(group, 0.72, 180);
  }

  resetGroup(group) {
    group.state = "idle";
    group.cooldownUntil = 0;
    group.openUntil = 0;
    group.chargingOwnerId = null;
    group.chargeStartedAt = 0;
    this.scene.events?.emit?.("portal-ready", group.id);
  }

  actorsAtEndpoints(group) {
    return this.registry.all().filter((actor) => {
      if (!actor?.alive || !actor.sprite) return false;
      const cell = this.actorCell(actor);
      return group.endpoints.some((endpoint) => cellKey(endpoint) === cellKey(cell));
    });
  }

  actorCell(actor) {
    if (typeof actor.currentCell === "function") return actor.currentCell(actor);
    return this.map.worldToCell(actor.sprite.x, actor.sprite.y);
  }

  teleportWaitingActors(group) {
    this.actorsAtEndpoints(group).forEach((actor) => {
      if (group.teleported.has(actor.ownerId) || this.requiresExit.has(actor.ownerId)) return;
      const origin = this.actorCell(actor);
      const destination = this.pairedDestination(origin);
      if (!destination) return;
      this.teleportActor(actor, origin, destination, group);
    });
  }

  teleportActor(actor, origin, destination, group) {
    const start = this.map.cellToWorld(origin.col, origin.row);
    const target = this.map.cellToWorld(destination.col, destination.row);
    actor.sprite.x = target.x;
    actor.sprite.y = target.y;
    if (this.map.hasBomb(destination.col, destination.row)) {
      actor.ignoredBombKey = cellKey(destination);
    }
    group.teleported.add(actor.ownerId);
    this.requiresExit.add(actor.ownerId);
    this.createTeleportBurst(start, group.color);
    this.createTeleportBurst(target, group.color);
    this.scene.events?.emit?.("combatant-teleported", actor.ownerId, group.id);
  }

  releaseExitedActors() {
    this.registry.all().forEach((actor) => {
      if (!actor?.alive || !actor.sprite) {
        this.requiresExit.delete(actor?.ownerId);
        return;
      }
      if (!this.isPortalCell(this.actorCell(actor))) this.requiresExit.delete(actor.ownerId);
    });
  }

  createTeleportBurst(position, color) {
    const ring = this.scene.add.circle(position.x, position.y, 10, color, 0.08)
      .setDepth(13)
      .setStrokeStyle(3, color, 0.9);
    this.scene.tweens.add({
      targets: ring,
      scale: 2.4,
      alpha: 0,
      duration: 260,
      ease: "Cubic.easeOut",
      onComplete: () => ring.destroy(),
    });
  }

  pulseGroup(group, scale, duration) {
    group.visuals.forEach(({ sprite, halo }) => {
      this.scene.tweens.killTweensOf(sprite);
      this.scene.tweens.killTweensOf(halo);
      this.scene.tweens.add({
        targets: [sprite, halo],
        scale,
        duration,
        yoyo: true,
        ease: "Cubic.easeOut",
      });
    });
  }

  updateVisuals(group, time) {
    let progress = 0;
    if (group.state === "charging") {
      progress = Phaser.Math.Clamp((time - group.chargeStartedAt) / this.config.channelMs, 0, 1);
    } else if (group.state === "open") {
      progress = Phaser.Math.Clamp((group.openUntil - time) / this.config.openMs, 0, 1);
    } else if (group.state === "cooldown") {
      progress = Phaser.Math.Clamp(1 - (group.cooldownUntil - time) / this.config.cooldownMs, 0, 1);
    }

    group.visuals.forEach(({ sprite, halo, progress: arc }) => {
      const open = group.state === "open";
      const textureProperty = open ? group.openTexture : group.idleTexture;
      const textureKey = this.map.mapConfig.textures[textureProperty];
      sprite.setTexture?.(textureKey);
      sprite.setAlpha(group.state === "cooldown" ? 0.34 : group.state === "idle" ? 0.7 : 1);
      halo.setAlpha(group.state === "open" ? 0.42 : group.state === "charging" ? 0.18 + progress * 0.2 : 0.05);
      arc.clear();
      if (group.state !== "idle") {
        const center = { x: sprite.x, y: sprite.y };
        arc.lineStyle(3, group.color, group.state === "cooldown" ? 0.42 : 0.92);
        arc.beginPath();
        arc.arc(center.x, center.y, 25, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        arc.strokePath();
      }
    });
  }
}
Object.assign(__bundle, { PortalSystem });
}

// scenes/SceneFlow.js
{
function resetSceneTransition(scene) {
  scene.__sceneTransitionPending = false;
}

function beginSceneTransition(scene, targetKey, data, options = {}) {
  if (scene.__sceneTransitionPending) return false;
  scene.__sceneTransitionPending = true;
  const start = () => scene.scene.start(targetKey, data);
  if ((options.delayMs || 0) > 0) scene.time.delayedCall(options.delayMs, start);
  else start();
  return true;
}

function restartSceneOnce(scene, data) {
  if (scene.__sceneTransitionPending) return false;
  scene.__sceneTransitionPending = true;
  scene.scene.restart(data);
  return true;
}
Object.assign(__bundle, { resetSceneTransition, beginSceneTransition, restartSceneOnce });
}

// systems/UISystem.js
{
const { GAME_CONFIG, GAME_TEXT, getHeroDisplay, MENU_TEXT, STAT_LABELS, restartSceneOnce } = __bundle;
class UISystem {
  constructor(scene, playerSystem, aiSystem, heroAbilitySystem, matchConfig = null) {
    this.scene = scene;
    this.players = Array.isArray(playerSystem) ? playerSystem : [playerSystem];
    this.player = this.players[0];
    this.ai = aiSystem;
    this.abilitySystems = Array.isArray(heroAbilitySystem) ? heroAbilitySystem : [heroAbilitySystem];
    this.abilities = this.abilitySystems[0];
    this.matchConfig = matchConfig;
    this.labels = {};
  }

  create() {
    if (this.players.length === 2) {
      this.createDualHud();
      return;
    }
    const heroDisplay = getHeroDisplay(this.player.hero);

    this.scene.add.rectangle(648, 42, 638, 70, 0x070b10, 0.92)
      .setStrokeStyle(1, 0xff4452, 0.28)
      .setDepth(20);
    this.scene.add.rectangle(648, 92, 638, 44, 0x11151b, 0.92)
      .setStrokeStyle(1, 0x58e8ff, 0.18)
      .setDepth(20);
    this.scene.add.rectangle(648, 42, 638, 70, 0xff4452, 0.045).setDepth(19);
    this.scene.add.rectangle(348, 42, 4, 52, 0xff4452, 0.82).setDepth(21);
    this.scene.add.rectangle(948, 42, 4, 52, 0x58e8ff, 0.56).setDepth(21);

    this.createStat("hp", 388, "HP");
    this.createStat("speed", 486, STAT_LABELS.speed);
    this.createStat("bombs", 584, STAT_LABELS.maxBombs);
    this.createStat("range", 682, STAT_LABELS.blastRange);
    this.createStat("shield", 780, STAT_LABELS.shield);
    this.createStat("enemies", 878, STAT_LABELS.enemies);

    const restart = this.scene.add
      .text(960, 42, MENU_TEXT.restart, {
        fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "15px",
      color: "#09171c",
      fontStyle: "800",
      backgroundColor: "#ff6674",
      padding: { x: 12, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(22)
      .setInteractive({ useHandCursor: true });
    restart.on("pointerdown", () => restartSceneOnce(this.scene, { matchConfig: this.matchConfig, mapId: this.scene.mapId }));

    this.ultimateLabel = this.scene.add.text(398, 80, `Shift / ${heroDisplay?.ultimateName || this.player.hero.ultimate.name}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: "#d8f8ff",
      fontStyle: "800",
    }).setDepth(22);

    this.energyBarBg = this.scene.add.rectangle(642, 91, 250, 14, 0x1a1418, 0.98)
      .setDepth(21)
      .setStrokeStyle(1, 0xff4452, 0.22);
    this.energyBarFill = this.scene.add.rectangle(517, 91, 0, 12, this.player.hero.accent, 0.95)
      .setDepth(22)
      .setOrigin(0, 0.5);

    this.energyText = this.scene.add.text(776, 80, `${GAME_TEXT.charging} 0%`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: "#9bc3cf",
      fontStyle: "700",
    }).setDepth(22);

    this.ultimateState = this.scene.add.text(892, 80, GAME_TEXT.ready, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: "#9bc3cf",
      fontStyle: "800",
    }).setDepth(22);

    this.message = this.scene.add.text(648, 708, "", {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "15px",
      color: "#f7fdff",
      fontStyle: "800",
      backgroundColor: "rgba(9, 23, 28, 0.76)",
      padding: { x: 14, y: 7 },
    }).setOrigin(0.5).setDepth(30).setAlpha(0);

    this.scene.events.on("player-stats-changed", () => this.update());
    this.scene.events.on("actor-health-changed", () => this.update());
    this.scene.events.on("enemy-count-changed", () => this.update());
    this.scene.events.on("item-picked", (label) => this.toast(`获得 ${label}`));
    this.scene.events.on("enemy-item-picked", (label) => this.toast(`敌人拿到 ${label}`));
    this.scene.events.on("player-shield-used", () => this.toast(GAME_TEXT.shieldSaved));
    this.scene.events.on("ultimate-activated", (label) => this.toast(`${label} 已启动`));
    this.scene.events.on("ultimate-life-saved", () => this.toast(GAME_TEXT.extraLifeSaved));
    this.scene.events.on("bomb-placed", () => this.update());
    this.update();
  }

  createDualHud() {
    this.dualHud = this.players.map((player, index) => {
      const abilities = this.abilitySystems[index];
      const left = index === 0 ? 348 : 656;
      const accent = player.hero.accent;
      this.scene.add.rectangle(left + 146, 53, 292, 82, 0x070b10, 0.94)
        .setStrokeStyle(2, accent, 0.48).setDepth(20);
      this.scene.add.rectangle(left + (index === 0 ? 2 : 290), 53, 4, 66, accent, 0.88).setDepth(21);
      const title = this.scene.add.text(left + 16, 19, `P${index + 1}  ${getHeroDisplay(player.hero).name}`, {
        fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "14px", color: "#f8fdff", fontStyle: "900",
      }).setDepth(22);
      const hp = this.scene.add.text(left + 16, 43, "HP 100/100", this.smallStyle("#d8f8ff")).setDepth(22);
      const bombs = this.scene.add.text(left + 150, 43, "炸弹 0/1", this.smallStyle("#d8f8ff")).setDepth(22);
      const barBg = this.scene.add.rectangle(left + 16, 72, 178, 10, 0x1a1418, 0.98)
        .setOrigin(0, 0.5).setStrokeStyle(1, accent, 0.25).setDepth(21);
      const bar = this.scene.add.rectangle(left + 16, 72, 0, 8, accent, 0.96).setOrigin(0, 0.5).setDepth(22);
      const state = this.scene.add.text(left + 204, 62, "0%", this.smallStyle("#8fb6c1")).setDepth(22);
      const status = this.scene.add.text(left + 204, 20, "作战中", {
        fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "11px", color: "#7df4d4", fontStyle: "900",
        backgroundColor: "rgba(12, 30, 34, 0.84)", padding: { x: 8, y: 3 },
      }).setDepth(23);
      return { player, abilities, title, hp, bombs, barBg, bar, state, status };
    });

    this.aliveLabel = this.scene.add.text(640, 104, "", {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "13px", color: "#d8f8ff", fontStyle: "900",
      backgroundColor: "rgba(7,11,16,0.92)", padding: { x: 14, y: 5 },
    }).setOrigin(0.5).setDepth(22);
    this.message = this.scene.add.text(648, 708, "", {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "15px", color: "#f7fdff", fontStyle: "800",
      backgroundColor: "rgba(9, 23, 28, 0.76)", padding: { x: 14, y: 7 },
    }).setOrigin(0.5).setDepth(30).setAlpha(0);
    ["player-stats-changed", "actor-health-changed", "enemy-count-changed", "combatant-defeated"].forEach((event) => {
      this.scene.events.on(event, () => this.update());
    });
    this.scene.events.on("item-picked", (label) => this.toast(`获得 ${label}`));
    this.scene.events.on("ultimate-activated", (label) => this.toast(`${label} 已启动`));
    this.update();
  }

  createStat(key, x, label) {
    this.scene.add.text(x, 18, label, this.smallStyle("#8fb6c1"))
      .setOrigin(0.5, 0)
      .setDepth(21);
    this.labels[key] = this.scene.add.text(x, 39, "0", this.valueStyle())
      .setOrigin(0.5, 0)
      .setDepth(21);
  }

  update() {
    if (this.players.length === 2) {
      this.dualHud?.forEach((hud) => {
        const state = hud.abilities.getDisplayState(this.scene.time.now);
        if (!hud.player.alive) {
          hud.hp.setText(`HP 0/${hud.player.maxHp}`).setColor("#ff6674");
          hud.bombs.setAlpha(0.28);
          hud.bar.width = 0;
          hud.barBg.setAlpha(0.28);
          hud.state.setText("LOCKED").setColor("#ff6674");
          hud.status.setText("bye man").setColor("#ffffff").setBackgroundColor("#9d2332");
          hud.title.setAlpha(0.42);
          return;
        }
        hud.hp.setText(`HP ${Math.ceil(hud.player.hp)}/${hud.player.maxHp}`);
        hud.hp.setColor("#d8f8ff");
        hud.bombs.setAlpha(1);
        hud.barBg.setAlpha(1);
        hud.title.setAlpha(1);
        hud.status.setText("作战中").setColor("#7df4d4").setBackgroundColor("rgba(12, 30, 34, 0.84)");
        hud.bombs.setText(`炸弹 ${hud.player.bombs.activeCount(hud.player.ownerId)}/${hud.player.stats.maxBombs}`);
        hud.bar.width = Math.round(178 * state.energy / 100);
        hud.bar.setFillStyle(hud.player.hero.accent, state.ready ? 1 : 0.9);
        hud.state.setText(state.active ? `${Math.ceil(state.remainingMs / 1000)}s` : state.ready ? "READY" : `${Math.round(state.energy)}%`)
          .setColor(state.ready ? "#7df4d4" : "#8fb6c1");
      });
      const alivePlayers = this.players.filter((player) => player.alive).length;
      this.aliveLabel?.setText(`存活 ${alivePlayers + this.ai.aliveCount()} / ${this.players.length + this.matchConfig.aiCount}`);
      return;
    }
    this.labels.hp.setText(`${Math.ceil(this.player.hp)}/${this.player.maxHp}`);
    this.labels.speed.setText(String(this.player.stats.speed));
    this.labels.bombs.setText(`${this.player.bombs.activeCount(this.player.ownerId)}/${this.player.stats.maxBombs}`);
    this.labels.range.setText(String(this.player.stats.blastRange));
    this.labels.shield.setText(this.player.shieldActive ? "1" : "0");
    this.labels.enemies.setText(`${this.ai.aliveCount()}/${this.matchConfig?.aiCount ?? GAME_CONFIG.ENEMY_COUNT}`);

    const state = this.abilities.getDisplayState(this.scene.time.now);
    const fillWidth = Math.round((250 * state.energy) / 100);
    this.energyBarFill.width = fillWidth;
    this.energyBarFill.setFillStyle(this.player.hero.accent, state.ready ? 1 : 0.92);
    this.energyText.setText(`${GAME_TEXT.charging} ${Math.round(state.energy)}%`);

    if (state.active) {
      this.ultimateState.setText(`${GAME_TEXT.active} ${Math.ceil(state.remainingMs / 1000)}s`).setColor("#ffdf71");
    } else if (state.ready) {
      this.ultimateState.setText("Ready / Shift").setColor("#7df4d4");
    } else {
      this.ultimateState.setText(GAME_TEXT.ready).setColor("#9bc3cf");
    }
  }

  toast(text) {
    this.message.setText(text).setAlpha(1);
    this.scene.tweens.killTweensOf(this.message);
    this.scene.tweens.add({
      targets: this.message,
      alpha: 0,
      delay: 850,
      duration: 350,
    });
  }

  smallStyle(color) {
    return {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color,
      fontStyle: "700",
    };
  }

  valueStyle() {
    return {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "19px",
      color: "#58e8ff",
      fontStyle: "900",
    };
  }
}
Object.assign(__bundle, { UISystem });
}

// mobile/TouchInputRouter.js
{
const asList = (value) => Array.isArray(value) ? value : [value];

const DIRECTION_CODES = ["LEFT", "RIGHT", "UP", "DOWN"];
const ACTION_CODES = ["BOMB", "ULTIMATE"];

/**
 * Detect whether the current environment is a mobile/touch device.
 * Used by Task 5 to decide whether to create a TouchInputRouter.
 */
function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)
  );
}

class TouchInputRouter {
  /**
   * @param {Phaser.Scene} scene - The active Phaser scene (for pointer events and canvas reference).
   */
  constructor(scene) {
    this.scene = scene;
    this.down = new Set();
    this.pressed = new Set();

    // Joystick state
    this._joystickActive = false;
    this._joystickPointerId = null;
    this._joystickBaseX = 0;
    this._joystickBaseY = 0;
    this._deadZone = 12;
    this._maxRadius = 60; // base radius

    // Canvas reference
    this._canvas = scene.game.canvas;

    // Build DOM overlay
    this._overlay = this._createOverlay();

    // Position overlay to match canvas
    this._syncOverlayRect();
    this._resizeObserver = new ResizeObserver(() => this._syncOverlayRect());
    this._resizeObserver.observe(this._canvas);

    // Bind Phaser pointer events for joystick
    this._onPointerDown = (pointer) => this._handlePointerDown(pointer);
    this._onPointerMove = (pointer) => this._handlePointerMove(pointer);
    this._onPointerUp = (pointer) => this._handlePointerUp(pointer);

    scene.input.on("pointerdown", this._onPointerDown);
    scene.input.on("pointermove", this._onPointerMove);
    scene.input.on("pointerup", this._onPointerUp);
  }

  // ── DOM overlay ──────────────────────────────────────────────

  _createOverlay() {
    const overlay = document.createElement("div");
    overlay.setAttribute("data-touch-router", "overlay");
    overlay.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;" +
      "pointer-events:none;z-index:10;overflow:hidden;";

    // Joystick base
    this._joystickBase = document.createElement("div");
    this._joystickBase.style.cssText =
      "position:absolute;display:none;width:120px;height:120px;border-radius:50%;" +
      "background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.35);" +
      "transform:translate(-50%,-50%);pointer-events:none;";
    overlay.appendChild(this._joystickBase);

    // Joystick thumb
    this._joystickThumb = document.createElement("div");
    this._joystickThumb.style.cssText =
      "position:absolute;width:60px;height:60px;border-radius:50%;" +
      "background:rgba(255,255,255,0.45);border:2px solid rgba(255,255,255,0.65);" +
      "transform:translate(-50%,-50%);pointer-events:none;";
    this._joystickBase.appendChild(this._joystickThumb);

    // Bomb button (💣)
    this._bombBtn = this._createActionButton("BOMB", "💣", "rgba(255,80,80,0.55)", "#ff5050");
    overlay.appendChild(this._bombBtn);

    // Ultimate button (⚡)
    this._ultimateBtn = this._createActionButton("ULTIMATE", "⚡", "rgba(88,232,255,0.55)", "#58e8ff");
    overlay.appendChild(this._ultimateBtn);

    document.body.appendChild(overlay);
    return overlay;
  }

  _createActionButton(code, label, bg, borderColor) {
    const btn = document.createElement("div");
    btn.setAttribute("data-touch-code", code);
    btn.style.cssText =
      "position:absolute;width:88px;height:88px;border-radius:50%;" +
      `background:${bg};border:2px solid ${borderColor};` +
      "display:flex;align-items:center;justify-content:center;" +
      "font-size:36px;line-height:1;user-select:none;" +
      "pointer-events:auto;touch-action:none;" +
      "transform:translate(-50%,-50%);";
    btn.textContent = label;

    const onDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.down.has(code)) this.pressed.add(code);
      this.down.add(code);
    };
    const onUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.down.delete(code);
    };

    btn.addEventListener("pointerdown", onDown);
    btn.addEventListener("pointerup", onUp);
    btn.addEventListener("pointerleave", onUp);
    btn.addEventListener("pointercancel", onUp);

    // Store cleanup references
    btn._onDown = onDown;
    btn._onUp = onUp;

    return btn;
  }

  // ── Overlay positioning ──────────────────────────────────────

  _syncOverlayRect() {
    const rect = this._canvas.getBoundingClientRect();
    if (!this._overlay) return;
    this._overlay.style.top = rect.top + "px";
    this._overlay.style.left = rect.left + "px";
    this._overlay.style.width = rect.width + "px";
    this._overlay.style.height = rect.height + "px";

    // Reposition buttons relative to overlay size
    const w = rect.width;
    const h = rect.height;

    // Bomb button: bottom-right, left side of the two buttons
    if (this._bombBtn) {
      this._bombBtn.style.left = (w - 120) + "px";
      this._bombBtn.style.top = (h - 90) + "px";
    }

    // Ultimate button: bottom-right, right side
    if (this._ultimateBtn) {
      this._ultimateBtn.style.left = (w - 30) + "px";
      this._ultimateBtn.style.top = (h - 90) + "px";
    }

    // Reposition active joystick so it stays pinned to the game coordinate
    if (this._joystickActive) {
      const scaleX = rect.width / this.scene.scale.width;
      const scaleY = rect.height / this.scene.scale.height;

      const left = rect.left + this._joystickBaseX * scaleX;
      const top = rect.top + this._joystickBaseY * scaleY;

      this._joystickBase.style.left = left + "px";
      this._joystickBase.style.top = top + "px";
    }

    // Default joystick position (bottom-left area)
    this._defaultJoystickX = 140;
    this._defaultJoystickY = h - 140;
  }

  // ── Joystick pointer handling ────────────────────────────────

  _isInJoystickZone(pointer) {
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    return pointer.x < w * 0.35 && pointer.y > h * 0.5;
  }

  _handlePointerDown(pointer) {
    if (!this._isInJoystickZone(pointer)) return;
    if (this._joystickActive) return;

    this._joystickActive = true;
    this._joystickPointerId = pointer.id;
    this._joystickBaseX = pointer.x;
    this._joystickBaseY = pointer.y;

    // Position the joystick base at the touch point
    const canvasRect = this._canvas.getBoundingClientRect();
    const scaleX = canvasRect.width / this.scene.scale.width;
    const scaleY = canvasRect.height / this.scene.scale.height;

    const left = canvasRect.left + pointer.x * scaleX;
    const top = canvasRect.top + pointer.y * scaleY;

    this._joystickBase.style.left = left + "px";
    this._joystickBase.style.top = top + "px";
    this._joystickBase.style.display = "block";
    this._joystickThumb.style.left = "50%";
    this._joystickThumb.style.top = "50%";
  }

  _handlePointerMove(pointer) {
    if (!this._joystickActive) return;
    if (pointer.id !== this._joystickPointerId) return;

    const dx = pointer.x - this._joystickBaseX;
    const dy = pointer.y - this._joystickBaseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this._deadZone) {
      // Determine primary direction
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const newDir = absDx > absDy ? (dx > 0 ? "RIGHT" : "LEFT") : (dy > 0 ? "DOWN" : "UP");

      // Track pressed: add to pressed if this direction wasn't already down
      if (!this.down.has(newDir)) this.pressed.add(newDir);

      // Clear previous direction states and set the new one
      for (const code of DIRECTION_CODES) this.down.delete(code);
      this.down.add(newDir);

      // Constrain thumb
      const clampedDist = Math.min(dist, this._maxRadius);
      const ratio = clampedDist / dist;
      const thumbDx = dx * ratio;
      const thumbDy = dy * ratio;

      // Thumb position relative to base center (base is 120px, thumb is 60px)
      // The thumb is centered inside the base, so we offset from center
      const baseHalf = 60; // half of 120px base
      const thumbHalf = 30; // half of 60px thumb
      const px = baseHalf + thumbDx - thumbHalf;
      const py = baseHalf + thumbDy - thumbHalf;
      this._joystickThumb.style.left = px + "px";
      this._joystickThumb.style.top = py + "px";
    } else {
      // Within dead zone — reset thumb to center
      this._joystickThumb.style.left = "50%";
      this._joystickThumb.style.top = "50%";
    }
  }

  _handlePointerUp(pointer) {
    if (!this._joystickActive) return;
    if (pointer.id !== this._joystickPointerId) return;
    this._joystickActive = false;
    this._joystickPointerId = null;

    // Reset joystick visuals
    this._joystickBase.style.display = "none";
    this._joystickThumb.style.left = "50%";
    this._joystickThumb.style.top = "50%";

    // Clear all direction states
    for (const code of DIRECTION_CODES) this.down.delete(code);
  }

  // ── Public API (mirrors KeyboardInputRouter) ─────────────────

  /**
   * Check if any of the given codes is currently held down.
   * @param {string|string[]} codes
   * @returns {boolean}
   */
  isDown(codes) {
    return asList(codes).some((code) => this.down.has(code));
  }

  /**
   * Check if any of the given codes was pressed this frame.
   * @param {string|string[]} codes
   * @returns {boolean}
   */
  wasPressed(codes) {
    return asList(codes).some((code) => this.pressed.has(code));
  }

  /**
   * Clear the pressed set at the end of each frame.
   */
  endFrame() {
    this.pressed.clear();
  }

  /**
   * Remove all event listeners and DOM elements.
   */
  destroy() {
    // Unbind Phaser pointer events
    if (this.scene && this.scene.input) {
      this.scene.input.off("pointerdown", this._onPointerDown);
      this.scene.input.off("pointermove", this._onPointerMove);
      this.scene.input.off("pointerup", this._onPointerUp);
    }

    // Remove DOM button listeners
    for (const btn of [this._bombBtn, this._ultimateBtn]) {
      if (!btn) continue;
      btn.removeEventListener("pointerdown", btn._onDown);
      btn.removeEventListener("pointerup", btn._onUp);
      btn.removeEventListener("pointerleave", btn._onUp);
      btn.removeEventListener("pointercancel", btn._onUp);
      btn.remove();
    }

    // Remove joystick elements
    if (this._joystickBase) this._joystickBase.remove();
    if (this._overlay) this._overlay.remove();

    // Disconnect ResizeObserver
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    // Clear state
    this.down.clear();
    this.pressed.clear();
    this._joystickActive = false;
    this._joystickPointerId = null;
  }
}
Object.assign(__bundle, { isMobileDevice, TouchInputRouter });
}

// mobile/MobileUI.js
{
const { isMobileDevice } = __bundle;
/**
 * MobileUI — 移动端辅助 UI：
 * - 全屏切换按钮（右上角）
 * - 竖屏时暂停游戏并提示横屏
 */
class MobileUI {
  constructor(scene) {
    this.scene = scene;
    if (!isMobileDevice()) return;

    this._addFullscreenButton();
    this._addOrientationListener();
  }

  _addFullscreenButton() {
    // 右上角全屏按钮，使用 Phaser text（避免 DOM 干扰触摸事件）
    const btn = this.scene.add.text(
      this.scene.scale.width - 50, 16,
      "\u26F6",
      { fontSize: "28px", color: "#ffffff88" }
    )
      .setOrigin(0.5, 0)
      .setDepth(100)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerdown", () => {
      const doc = document.documentElement;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        doc.requestFullscreen?.() || doc.webkitRequestFullscreen?.();
      }
    });
  }

  _addOrientationListener() {
    // 竖屏时暂停游戏（CSS ::after 已显示提示文字）
    const checkOrientation = () => {
      const isPortrait = window.innerWidth < window.innerHeight;
      if (isPortrait) {
        this.scene.scene.pause();
      } else {
        this.scene.scene.resume();
      }
    };

    // 初始检查
    checkOrientation();

    // 监听旋转
    window.addEventListener("orientationchange", () => {
      setTimeout(checkOrientation, 200); // 等旋转动画完成
    });

    // 也监听 resize（某些设备不触发 orientationchange）
    window.addEventListener("resize", () => {
      setTimeout(checkOrientation, 200);
    });
  }
}
Object.assign(__bundle, { MobileUI });
}

// scenes/StartScene.js
{
const { MENU_TEXT, addAmbientTechMotion, addPrimaryButtonSkin, addTechOverlay, preloadTechUi, wireTechButton, beginSceneTransition, resetSceneTransition } = __bundle;
const MENU_HERO_KEY = "menu-hero-ensemble-v1";
const MENU_HERO_PATH = "assets/menu-hero-ensemble-v1.png";
const FONT = '"Microsoft YaHei", sans-serif';

class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
    this.selectorSlots = [];
    this.isDeploying = false;
  }

  preload() {
    preloadTechUi(this);
    if (!this.textures.exists(MENU_HERO_KEY)) {
      this.load.image(MENU_HERO_KEY, MENU_HERO_PATH);
    }
  }

  create() {
    resetSceneTransition(this);
    this.isDeploying = false;
    this.cameras.main.setBackgroundColor("#03070d");
    this.drawHeroKeyArt();
    this.drawTitle();
    this.drawHeroEnergy();
    this.drawStartButton();
    this.techOverlay = addTechOverlay(this, 80, 0.94);
    this.ambientScan = addAmbientTechMotion(this, 18);
    this.input.keyboard.once("keydown-ENTER", () => this.beginDeployment());
  }

  drawHeroKeyArt() {
    this.heroKeyArt = this.add.image(640, 380, MENU_HERO_KEY)
      .setDisplaySize(1280, 760)
      .setScale(1.04)
      .setDepth(-20);

    this.add.rectangle(235, 126, 470, 252, 0x02060c, 0.7).setDepth(-10);
    this.add.rectangle(1092, 666, 376, 188, 0x02060c, 0.62).setDepth(-10);
    this.add.rectangle(640, 758, 1280, 4, 0xff3348, 0.88).setDepth(30);
    this.tweens.add({
      targets: this.heroKeyArt,
      scaleX: 1,
      scaleY: 1,
      duration: 720,
      ease: "Cubic.easeOut",
    });
  }

  drawTitle() {
    this.title = this.add.text(58, 48, MENU_TEXT.title, {
      fontFamily: FONT,
      fontSize: "68px",
      color: "#f8fdff",
      fontStyle: "900",
    }).setDepth(20).setShadow(0, 8, "#000000", 14, true, true);

    this.slogan = this.add.text(64, 130, MENU_TEXT.slogan, {
      fontFamily: FONT,
      fontSize: "28px",
      color: "#ff4358",
      fontStyle: "900",
    }).setDepth(20);

    this.add.text(66, 177, "四英雄集结 / 本地竞技", {
      fontFamily: FONT,
      fontSize: "15px",
      color: "#a8bbc7",
      fontStyle: "700",
    }).setDepth(20);

    this.add.rectangle(64, 214, 310, 3, 0xff3348, 0.92).setOrigin(0, 0.5).setDepth(21);
    this.titleScan = this.add.rectangle(64, 214, 76, 3, 0xffffff, 0.96).setOrigin(0, 0.5).setDepth(22);

    this.title.x = 18;
    this.title.alpha = 0;
    this.slogan.x = 30;
    this.slogan.alpha = 0;
    this.tweens.add({ targets: this.title, x: 58, alpha: 1, duration: 620, ease: "Cubic.easeOut" });
    this.tweens.add({ targets: this.slogan, x: 64, alpha: 1, duration: 700, delay: 90, ease: "Cubic.easeOut" });
    this.tweens.add({
      targets: this.titleScan,
      x: 298,
      alpha: 0.12,
      duration: 1250,
      delay: 1800,
      repeat: -1,
      repeatDelay: 2600,
      ease: "Cubic.easeInOut",
    });
  }

  drawHeroEnergy() {
    const zones = [
      { x: 637, y: 208, color: 0x925cff, radius: 46 },
      { x: 386, y: 420, color: 0xff5b28, radius: 40 },
      { x: 914, y: 380, color: 0x71f186, radius: 42 },
      { x: 678, y: 610, color: 0x4db9ff, radius: 48 },
    ];

    this.energyNodes = zones.map((zone, zoneIndex) => {
      const halo = this.add.circle(zone.x, zone.y, zone.radius, zone.color, 0.05)
        .setDepth(5).setStrokeStyle(2, zone.color, 0.35);
      this.tweens.add({
        targets: halo,
        scaleX: 1.28,
        scaleY: 1.28,
        alpha: 0.015,
        duration: 1100 + zoneIndex * 130,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      for (let i = 0; i < 4; i += 1) {
        const spark = this.add.rectangle(
          zone.x - 36 + i * 22,
          zone.y + 20 - (i % 2) * 24,
          zoneIndex === 3 ? 22 : 5,
          zoneIndex === 3 ? 2 : 5,
          zone.color,
          0.72,
        ).setDepth(6);
        this.tweens.add({
          targets: spark,
          y: spark.y - 18 - i * 3,
          x: spark.x + (zoneIndex === 3 ? 14 : (i % 2 ? 8 : -8)),
          alpha: 0,
          duration: 620 + i * 120,
          delay: i * 150,
          repeat: -1,
          repeatDelay: 420,
          ease: "Quad.easeOut",
        });
      }
      return { ...zone, halo };
    });
  }

  drawStartButton() {
    this.startGlow = this.add.rectangle(1080, 664, 316, 84, 0xff3348, 0.16)
      .setDepth(10).setStrokeStyle(2, 0xff4358, 0.7);
    this.startButtonSkin = addPrimaryButtonSkin(this, 1080, 664, 326, 82, 11);
    this.startButton = this.add.rectangle(1080, 664, 286, 68, 0xff3348, 0.03)
      .setDepth(11).setStrokeStyle(2, 0xffffff, 0.36).setInteractive({ useHandCursor: true });
    this.startText = this.add.text(1080, 664, "开始部署", {
      fontFamily: FONT,
      fontSize: "27px",
      color: "#080d13",
      fontStyle: "900",
    }).setOrigin(0.5).setDepth(12);
    this.add.text(1080, 713, "ENTER / LOCAL BATTLE", {
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      color: "#92a9b5",
      fontStyle: "700",
    }).setOrigin(0.5).setDepth(12);

    this.startButton.on("pointerover", () => {
      this.startButton.setScale(1.035);
      this.startGlow.setScale(1.08);
    });
    this.startButton.on("pointerout", () => {
      this.startButton.setScale(1);
      this.startGlow.setScale(1);
    });
    this.startButton.on("pointerdown", () => this.beginDeployment());
    wireTechButton(this, this.startButton, [this.startButtonSkin, this.startText], { hoverScale: 1.04 });
    this.tweens.add({
      targets: this.startGlow,
      alpha: 0.34,
      scaleX: 1.06,
      scaleY: 1.13,
      duration: 820,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  beginDeployment() {
    if (this.isDeploying) return;
    this.isDeploying = true;
    this.startText.setText("能量汇聚中");
    this.energyNodes.forEach((node) => {
      this.tweens.add({
        targets: node.halo,
        x: 640,
        y: 380,
        scaleX: 0.18,
        scaleY: 0.18,
        alpha: 0.82,
        duration: 280,
        ease: "Cubic.easeIn",
      });
    });
    beginSceneTransition(this, "MatchSetupScene", undefined, { delayMs: 300 });
  }

  startGame() {
    return beginSceneTransition(this, "MatchSetupScene");
  }
}
Object.assign(__bundle, { StartScene });
}

// scenes/MatchSetupScene.js
{
const { HEROES, MENU_THEME, createGameTextures, createMenuMascotTexture, preloadCustomHeroAssets, normalizeMatchConfig, getHeroDisplay, MENU_TEXT, addAmbientTechMotion, addPanelFrame, addPrimaryButtonSkin, addTechOverlay, preloadTechUi, wireTechButton, beginSceneTransition, resetSceneTransition } = __bundle;
const MENU_BG_KEY = "menu-spoon-wallpaper-v2";
const MENU_BG_PATH = "assets/menu-spoon-wallpaper-v2.png";
const FONT = '"Microsoft YaHei", sans-serif';

class MatchSetupScene extends Phaser.Scene {
  constructor() {
    super("MatchSetupScene");
    this.matchConfig = normalizeMatchConfig();
    this.playerButtons = [];
    this.aiButtons = [];
    this.heroButtons = [];
    this.editingPlayerSlot = 0;
  }

  init(data = {}) {
    this.matchConfig = normalizeMatchConfig(data.matchConfig || {
      playerCount: 1,
      aiCount: 3,
      playerHeroes: [HEROES[0].id],
    });
    this.editingPlayerSlot = 0;
  }

  preload() {
    preloadTechUi(this);
    if (!this.textures.exists(MENU_BG_KEY)) this.load.image(MENU_BG_KEY, MENU_BG_PATH);
    if (!this.textures.exists(MENU_THEME.mascotSourceKey)) {
      this.load.image(MENU_THEME.mascotSourceKey, MENU_THEME.mascotSourcePath);
    }
    preloadCustomHeroAssets(this);
  }

  create() {
    resetSceneTransition(this);
    createGameTextures(this);
    createMenuMascotTexture(this, MENU_THEME.mascotSourceKey, MENU_THEME.mascotTextureKey);
    this.cameras.main.setBackgroundColor("#050912");
    this.drawBackdrop();
    this.drawHeader();
    this.drawModePanel();
    this.drawLineupPanel();
    this.drawHeroPanel();
    this.drawActions();
    this.refresh();
    this.input.keyboard.once("keydown-ENTER", () => this.confirm());
  }

  drawBackdrop() {
    const bg = this.add.image(640, 380, MENU_BG_KEY).setDepth(-30);
    bg.setScale(Math.max(1280 / bg.width, 760 / bg.height));
    this.add.rectangle(640, 380, 1280, 760, 0x030711, 0.16).setDepth(-29);
    this.add.rectangle(640, 401, 1176, 514, 0x040912, 0.48).setDepth(-28).setStrokeStyle(1, 0xff4353, 0.26);
    this.add.rectangle(640, 139, 1120, 3, 0xff4353, 0.82).setDepth(-10);
    this.add.rectangle(640, 657, 1120, 2, 0x58e8ff, 0.3).setDepth(-10);
    this.scanLine = this.add.rectangle(80, 139, 180, 3, 0xff5364, 0.92).setOrigin(0, 0.5).setDepth(-9);
    this.tweens.add({ targets: this.scanLine, x: 1020, alpha: 0.2, duration: 2100, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.techOverlay = addTechOverlay(this, 80, 0.94);
    this.ambientScan = addAmbientTechMotion(this, 2);
  }

  drawHeader() {
    this.add.text(76, 42, MENU_TEXT.title, {
      fontFamily: FONT, fontSize: "48px", color: "#f8fdff", fontStyle: "900",
    }).setDepth(20).setShadow(0, 5, "#02070c", 10, true, true);
    this.add.text(78, 101, "对局部署 / MATCH CONFIGURATION", {
      fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#ff6674", fontStyle: "800",
    }).setDepth(20);
    this.summaryText = this.add.text(1178, 78, "", {
      fontFamily: FONT, fontSize: "20px", color: "#f8fdff", fontStyle: "900",
    }).setOrigin(1, 0.5).setDepth(20);
    this.add.text(1178, 104, "本地同屏竞技 · 最多四名参战者", {
      fontFamily: FONT, fontSize: "12px", color: "#8fb6c1", fontStyle: "700",
    }).setOrigin(1, 0.5).setDepth(20);
  }

  makePanel(x, y, width, height, accent = 0xff5364) {
    const panel = this.add.rectangle(x, y, width, height, 0x070d16, 0.9)
      .setDepth(4).setStrokeStyle(2, accent, 0.32);
    this.add.rectangle(x - width / 2 + 3, y, 5, height - 18, accent, 0.7).setDepth(5);
    this.add.rectangle(x, y - height / 2 + 2, width - 18, 3, accent, 0.58).setDepth(5);
    return panel;
  }

  sectionTitle(x, y, index, title, subtitle, accent = 0xff5364) {
    const indexText = this.add.text(x, y, `0${index}`, { fontFamily: "Arial", fontSize: "13px", color: Phaser.Display.Color.IntegerToColor(accent).rgba, fontStyle: "900" }).setDepth(8);
    const titleText = this.add.text(x + 36, y - 7, title, { fontFamily: FONT, fontSize: "21px", color: "#f8fdff", fontStyle: "900" }).setDepth(8);
    const subtitleText = this.add.text(x + 36, y + 21, subtitle, { fontFamily: FONT, fontSize: "11px", color: "#83a2ad", fontStyle: "700", wordWrap: { width: 220 } }).setDepth(8);
    return { indexText, titleText, subtitleText };
  }

  drawModePanel() {
    this.modePanel = this.makePanel(240, 397, 300, 486, 0xff5364);
    this.modePanelSkin = addPanelFrame(this, 240, 397, 322, 504, 6, 0.7);
    this.sectionTitle(112, 174, 1, "选择对局规模", "人数与AI数量会自动保持在四人以内");

    [1, 2].forEach((count, index) => {
      const x = 166 + index * 142;
      const button = this.add.rectangle(x, 256, 122, 64, 0x101923, 0.96)
        .setDepth(7).setStrokeStyle(2, 0x58e8ff, 0.24).setInteractive({ useHandCursor: true });
      const label = this.add.text(x, 248, count === 1 ? "单人" : "双人", { fontFamily: FONT, fontSize: "19px", color: "#f8fdff", fontStyle: "900" }).setOrigin(0.5).setDepth(8);
      const sub = this.add.text(x, 273, `${count}P`, { fontFamily: "Arial", fontSize: "11px", color: "#7f9aa5", fontStyle: "800" }).setOrigin(0.5).setDepth(8);
      button.on("pointerdown", () => {
        this.matchConfig = normalizeMatchConfig({ ...this.matchConfig, playerCount: count, aiCount: count === 1 ? 3 : 2 });
        this.editingPlayerSlot = count === 2 ? 1 : 0;
        this.refresh();
      });
      this.playerButtons.push({ count, button, label, sub });
    });

    this.add.text(112, 318, "AI 敌人", { fontFamily: FONT, fontSize: "15px", color: "#ff6674", fontStyle: "900" }).setDepth(8);
    this.add.text(112, 342, "单人至少1名 · 双人允许0名", { fontFamily: FONT, fontSize: "11px", color: "#83a2ad", fontStyle: "700" }).setDepth(8);
    [0, 1, 2, 3].forEach((count, index) => {
      const x = 137 + index * 69;
      const button = this.add.rectangle(x, 388, 54, 50, 0x101923, 0.96)
        .setDepth(7).setStrokeStyle(2, 0xff6674, 0.2).setInteractive({ useHandCursor: true });
      const label = this.add.text(x, 388, String(count), { fontFamily: "Arial", fontSize: "20px", color: "#f8fdff", fontStyle: "900" }).setOrigin(0.5).setDepth(8);
      button.on("pointerdown", () => {
        const min = this.matchConfig.playerCount === 1 ? 1 : 0;
        if (count < min || count > 4 - this.matchConfig.playerCount) return;
        this.matchConfig = normalizeMatchConfig({ ...this.matchConfig, aiCount: count });
        this.refresh();
      });
      this.aiButtons.push({ count, button, label });
    });

    this.controlHint = this.add.text(112, 446, "", {
      fontFamily: FONT, fontSize: "12px", color: "#bcd3db", fontStyle: "700", lineSpacing: 8, wordWrap: { width: 244 },
    }).setDepth(8);
    this.add.rectangle(240, 574, 244, 1, 0xff5364, 0.24).setDepth(8);
    this.add.text(112, 590, "胜利条件", { fontFamily: FONT, fontSize: "12px", color: "#ff6674", fontStyle: "900" }).setDepth(8);
    this.add.text(112, 613, "全员竞争，最后存活者获胜", { fontFamily: FONT, fontSize: "12px", color: "#d8eef4", fontStyle: "700" }).setDepth(8);
  }

  createLineupCard(y, slotLabel, accent) {
    const bg = this.add.rectangle(620, y, 338, 112, 0x0c141e, 0.94).setDepth(7).setStrokeStyle(1, accent, 0.28).setInteractive({ useHandCursor: true });
    const bar = this.add.rectangle(455, y, 6, 112, accent, 0.82).setDepth(8);
    const portraitFrame = this.add.rectangle(510, y, 82, 88, 0x050a12, 0.9).setDepth(8).setStrokeStyle(1, accent, 0.42);
    const portrait = this.add.image(510, y, HEROES[0].texture).setScale(1.48).setDepth(9);
    const slot = this.add.text(566, y - 36, slotLabel, { fontFamily: "Arial", fontSize: "11px", color: Phaser.Display.Color.IntegerToColor(accent).rgba, fontStyle: "900" }).setDepth(9);
    const name = this.add.text(566, y - 15, "", { fontFamily: FONT, fontSize: "18px", color: "#f8fdff", fontStyle: "900", wordWrap: { width: 205 } }).setDepth(9);
    const desc = this.add.text(566, y + 17, "", { fontFamily: FONT, fontSize: "11px", color: "#91abb5", fontStyle: "700", wordWrap: { width: 205 }, maxLines: 2 }).setDepth(9);
    return { bg, bar, portraitFrame, portrait, slot, name, desc };
  }

  drawLineupPanel() {
    this.lineupPanel = this.makePanel(620, 397, 392, 486, 0x58e8ff);
    this.lineupPanelSkin = addPanelFrame(this, 620, 397, 414, 504, 6, 0.68);
    this.sectionTitle(452, 174, 2, "参战阵容", "玩家出生在对角，AI填补其余位置", 0x58e8ff);
    this.p1Card = this.createLineupCard(287, "PLAYER 01", 0xff5364);
    this.p2Card = this.createLineupCard(421, "PLAYER 02", 0x58e8ff);
    this.p1Card.bg.on("pointerdown", () => this.setEditingPlayerSlot(0));
    this.p2Card.bg.on("pointerdown", () => this.setEditingPlayerSlot(1));
    this.aiSummaryBox = this.add.rectangle(620, 557, 338, 88, 0x0a111a, 0.94).setDepth(7).setStrokeStyle(1, 0xffad45, 0.26);
    this.aiSummaryTitle = this.add.text(474, 530, "AI 敌方编队", { fontFamily: FONT, fontSize: "14px", color: "#ffbd63", fontStyle: "900" }).setDepth(8);
    this.aiSummaryText = this.add.text(474, 557, "", { fontFamily: FONT, fontSize: "12px", color: "#d9e8ee", fontStyle: "700", wordWrap: { width: 285 } }).setDepth(8);
    this.add.text(474, 609, "玩家技能与炸弹可互相造成影响", { fontFamily: FONT, fontSize: "11px", color: "#7f9aa5", fontStyle: "700" }).setDepth(8);
  }

  drawHeroPanel() {
    this.heroPanel = this.makePanel(1010, 397, 356, 486, 0x9a7cff);
    this.heroPanelSkin = addPanelFrame(this, 1010, 397, 378, 504, 6, 0.7);
    const heroHeading = this.sectionTitle(852, 174, 3, "选择玩家1英雄", "点击中间玩家卡可切换编辑对象", 0x9a7cff);
    this.heroPanelTitle = heroHeading.titleText;
    this.heroPanelSubtitle = heroHeading.subtitleText;
    HEROES.forEach((hero, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 930 + col * 160;
      const y = 316 + row * 190;
      const glow = this.add.rectangle(x, y, 142, 166, hero.accent, 0).setDepth(6);
      const frame = this.add.rectangle(x, y, 142, 166, 0x0b121b, 0.96)
        .setDepth(7).setStrokeStyle(2, hero.accent, 0.3).setInteractive({ useHandCursor: true });
      const portraitFrame = this.add.rectangle(x, y - 28, 116, 92, 0x050a12, 0.86).setDepth(8).setStrokeStyle(1, hero.accent, 0.22);
      const portrait = this.add.image(x, y - 28, hero.texture).setScale(1.48).setDepth(9);
      const label = this.add.text(x - 58, y + 31, getHeroDisplay(hero).name, {
        fontFamily: FONT, fontSize: "13px", color: "#f8fdff", fontStyle: "900", wordWrap: { width: 116 }, align: "center",
      }).setOrigin(0, 0).setDepth(9);
      const role = this.add.text(x, y + 67, "", { fontFamily: FONT, fontSize: "11px", color: "#8fb6c1", fontStyle: "800" }).setOrigin(0.5).setDepth(9);
      frame.on("pointerdown", () => this.selectHeroForActiveSlot(hero.id));
      this.tweens.add({ targets: glow, scaleX: 1.035, scaleY: 1.04, alpha: 0.05, duration: 900 + index * 80, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.heroButtons.push({ hero, glow, frame, portraitFrame, portrait, label, role });
    });
  }

  drawActions() {
    this.backButton = this.add.rectangle(164, 704, 176, 54, 0x080e16, 0.96).setDepth(12).setStrokeStyle(2, 0xff5364, 0.48).setInteractive({ useHandCursor: true });
    this.add.text(164, 704, "返回首页", { fontFamily: FONT, fontSize: "16px", color: "#f8fdff", fontStyle: "900" }).setOrigin(0.5).setDepth(13);
    this.backButton.on("pointerdown", () => beginSceneTransition(this, "StartScene"));

    this.confirmGlow = this.add.ellipse(1064, 704, 300, 72, 0xff4353, 0.18).setDepth(11);
    this.confirmButtonSkin = addPrimaryButtonSkin(this, 1064, 704, 306, 72, 12);
    this.confirmButton = this.add.rectangle(1064, 704, 272, 58, 0xff4353, 0.03).setDepth(12).setStrokeStyle(3, 0xffffff, 0.18).setInteractive({ useHandCursor: true });
    this.confirmText = this.add.text(1064, 704, "确认阵容 · 选择地图", { fontFamily: FONT, fontSize: "20px", color: "#081016", fontStyle: "900" }).setOrigin(0.5).setDepth(13);
    this.confirmButton.on("pointerdown", () => this.confirm());
    wireTechButton(this, this.confirmButton, [this.confirmButtonSkin, this.confirmText]);
    this.tweens.add({ targets: [this.confirmGlow, this.confirmButton], scaleX: 1.025, scaleY: 1.05, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  refreshLineupCard(card, hero, enabled = true) {
    const copy = getHeroDisplay(hero);
    card.portrait.setTexture(hero.texture).setAlpha(enabled ? 1 : 0.2);
    card.name.setText(enabled ? copy.name : "等待第二位玩家").setColor(enabled ? "#f8fdff" : "#607680");
    card.desc.setText(enabled ? copy.description : "切换双人模式后选择英雄");
    card.bg.setAlpha(enabled ? 1 : 0.56);
  }

  refresh() {
    const { playerCount, aiCount, playerHeroes } = this.matchConfig;
    const p1Hero = HEROES.find((hero) => hero.id === playerHeroes[0]) || HEROES[0];
    const p2Hero = HEROES.find((hero) => hero.id === playerHeroes[1]) || HEROES.find((hero) => hero.id !== p1Hero.id);
    this.summaryText.setText(`${playerCount}P  +  ${aiCount} AI  /  ${playerCount + aiCount} 人`);
    this.controlHint.setText(playerCount === 2
      ? "P1  WASD / 左Ctrl炸弹 / Q大招\nP2  方向键 / 右Ctrl炸弹 / P大招"
      : "移动  WASD / 方向键\n炸弹  Space · 大招  Shift");

    this.playerButtons.forEach((entry) => {
      const selected = entry.count === playerCount;
      entry.button.setFillStyle(selected ? 0x17313b : 0x101923, 0.98).setStrokeStyle(selected ? 3 : 2, selected ? 0x58e8ff : 0x31505c, selected ? 0.92 : 0.22);
      entry.label.setColor(selected ? "#ffffff" : "#8fb6c1");
      entry.sub.setColor(selected ? "#58e8ff" : "#607680");
    });
    this.aiButtons.forEach((entry) => {
      const enabled = entry.count >= (playerCount === 1 ? 1 : 0) && entry.count <= 4 - playerCount;
      const selected = entry.count === aiCount;
      entry.button.setAlpha(enabled ? 1 : 0.25).setFillStyle(selected ? 0x3b1c24 : 0x101923, 0.98).setStrokeStyle(selected ? 3 : 2, selected ? 0xff6674 : 0x56343c, selected ? 0.92 : 0.2);
      entry.label.setColor(selected ? "#ffffff" : "#8fb6c1");
    });

    this.refreshLineupCard(this.p1Card, p1Hero, true);
    this.refreshLineupCard(this.p2Card, p2Hero, playerCount === 2);
    this.p1Card.bg.setStrokeStyle(this.editingPlayerSlot === 0 ? 3 : 1, 0xff5364, this.editingPlayerSlot === 0 ? 0.94 : 0.28);
    this.p2Card.bg.setStrokeStyle(this.editingPlayerSlot === 1 && playerCount === 2 ? 3 : 1, 0x58e8ff, this.editingPlayerSlot === 1 && playerCount === 2 ? 0.94 : 0.28);
    this.aiSummaryText.setText(aiCount === 0 ? "无AI · 两名玩家直接对决" : `${aiCount} 名AI加入战场 · 目标选择保持公平`);
    this.heroPanelTitle.setText(this.editingPlayerSlot === 0 ? "选择玩家1英雄" : "选择玩家2英雄");
    this.heroPanelSubtitle.setText(playerCount === 2 ? "点击中间玩家卡可切换，双方英雄不能相同" : "单人模式：选择本局出战英雄");

    this.heroButtons.forEach((entry) => {
      const isP1 = entry.hero.id === playerHeroes[0];
      const isP2 = playerCount === 2 && entry.hero.id === playerHeroes[1];
      const disabled = this.editingPlayerSlot === 1 && isP1;
      const selectedForActiveSlot = this.editingPlayerSlot === 0 ? isP1 : isP2;
      entry.frame.setAlpha(disabled ? 0.38 : 1).setFillStyle(selectedForActiveSlot ? 0x17212d : 0x0b121b, 0.98).setStrokeStyle(selectedForActiveSlot ? 3 : 2, entry.hero.accent, selectedForActiveSlot ? 0.94 : 0.28);
      entry.portrait.setAlpha(disabled ? 0.3 : 1);
      entry.glow.setAlpha(selectedForActiveSlot ? 0.18 : 0.02);
      entry.role.setText(isP1 ? "P1 已选择" : isP2 ? "P2 已选择" : disabled ? "不可重复" : "点击选择");
      entry.role.setColor(isP1 ? "#ff6674" : isP2 ? "#58e8ff" : "#8fb6c1");
    });
  }

  setEditingPlayerSlot(slot) {
    if (slot === 1 && this.matchConfig.playerCount !== 2) return false;
    this.editingPlayerSlot = slot === 1 ? 1 : 0;
    this.refresh();
    return true;
  }

  selectHeroForActiveSlot(heroId) {
    if (!HEROES.some((hero) => hero.id === heroId)) return false;
    const heroes = [...this.matchConfig.playerHeroes];
    if (this.editingPlayerSlot === 1) {
      if (this.matchConfig.playerCount !== 2 || heroId === heroes[0]) return false;
      heroes[1] = heroId;
    } else {
      heroes[0] = heroId;
    }
    this.matchConfig = normalizeMatchConfig({ ...this.matchConfig, playerHeroes: heroes });
    this.refresh();
    return true;
  }

  confirm() {
    return beginSceneTransition(this, "MapSelectScene", { matchConfig: normalizeMatchConfig(this.matchConfig) });
  }
}
Object.assign(__bundle, { MatchSetupScene });
}

// scenes/MapSelectScene.js
{
const { MAPS, MENU_THEME, createGameTextures, createMenuMascotTexture, preloadCustomHeroAssets, MENU_TEXT, normalizeMatchConfig, addAmbientTechMotion, addPanelFrame, addPrimaryButtonSkin, addTechOverlay, preloadTechUi, wireTechButton, beginSceneTransition, resetSceneTransition } = __bundle;
const MENU_BG_KEY = "menu-spoon-wallpaper-v2";
const MENU_BG_PATH = "assets/menu-spoon-wallpaper-v2.png";
const MAP_PREVIEWS = {
  inferno: { key: "map-preview-inferno-v2", path: "assets/map-preview-inferno-v2.png", accent: 0xff3446 },
  homeland: { key: "map-preview-homeland-v2", path: "assets/map-preview-homeland-v2.png", accent: 0xd64242 },
  abyss: { key: "map-preview-abyss-v3", path: "assets/map-preview-abyss-v3.png", accent: 0xa45cff },
};

class MapSelectScene extends Phaser.Scene {
  constructor() {
    super("MapSelectScene");
    this.heroId = "shadow";
    this.selectedMapId = MAPS[0].id;
    this.cards = [];
  }

  init(data) {
    this.matchConfig = normalizeMatchConfig(data?.matchConfig || { playerHeroes: [data?.heroId || this.heroId] });
    this.heroId = this.matchConfig.playerHeroes[0];
    this.selectedMapId = data?.mapId || this.selectedMapId || MAPS[0].id;
  }

  preload() {
    preloadTechUi(this);
    if (!this.textures.exists(MENU_BG_KEY)) this.load.image(MENU_BG_KEY, MENU_BG_PATH);
    Object.values(MAP_PREVIEWS).forEach((preview) => {
      if (!this.textures.exists(preview.key)) this.load.image(preview.key, preview.path);
    });
    if (!this.textures.exists(MENU_THEME.mascotSourceKey)) {
      this.load.image(MENU_THEME.mascotSourceKey, MENU_THEME.mascotSourcePath);
    }
    preloadCustomHeroAssets(this);
  }

  create() {
    resetSceneTransition(this);
    createGameTextures(this);
    createMenuMascotTexture(this, MENU_THEME.mascotSourceKey, MENU_THEME.mascotTextureKey);
    this.cameras.main.setBackgroundColor("#050912");

    this.drawBackdrop();
    this.drawTitle();
    this.drawBackButton();
    this.drawCards();
    this.drawConfirmButton();
    this.refreshSelection();

    this.input.keyboard.once("keydown-ENTER", () => this.enterSelectedMap());
  }

  drawBackdrop() {
    const bg = this.add.image(640, 380, MENU_BG_KEY).setDepth(-50);
    bg.setScale(Math.max(1280 / bg.width, 760 / bg.height));
    bg.setAlpha(1);
    this.add.rectangle(640, 380, 1280, 760, 0x030711, 0.18).setDepth(-49);
    this.add.rectangle(640, 412, 1120, 574, 0x040811, 0.34)
      .setDepth(-20)
      .setStrokeStyle(1, 0xff3446, 0.22);
    this.add.rectangle(640, 174, 1040, 3, 0xff3446, 0.72).setDepth(-19);
    this.add.rectangle(640, 676, 1040, 3, 0xff3446, 0.5).setDepth(-19);
    this.techOverlay = addTechOverlay(this, 80, 0.94);
    this.ambientScan = addAmbientTechMotion(this, 1);
  }

  drawTitle() {
    this.title = this.add.text(74, 62, MENU_TEXT.mapSelectTitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "62px",
      color: "#f8fdff",
      fontStyle: "900",
    }).setDepth(20).setShadow(0, 7, "#02070c", 14, true, true);
    this.add.text(80, 134, `${MENU_TEXT.title} / ${MENU_TEXT.slogan}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "22px",
      color: "#ff5364",
      fontStyle: "900",
    }).setDepth(20);
    this.add.text(80, 706, "SELECTED MAP LOADS CHARACTER DATA, AI, ITEMS AND ULTIMATE SYSTEM WITHOUT CHANGES", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#7f9aa5",
      fontStyle: "700",
    }).setDepth(20);
    this.tweens.add({
      targets: this.title,
      x: 82,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawCards() {
    const positions = [
      { x: 246, y: 410 },
      { x: 640, y: 410 },
      { x: 1034, y: 410 },
    ];

    MAPS.forEach((map, index) => {
      const preview = MAP_PREVIEWS[map.id] || MAP_PREVIEWS.inferno;
      const pos = positions[index] || positions[0];
      const card = this.add.rectangle(pos.x, pos.y, 342, 368, 0x080d16, 0.88)
        .setDepth(5)
        .setStrokeStyle(2, preview.accent, 0.34)
        .setInteractive({ useHandCursor: true });
      const cardSkin = addPanelFrame(this, pos.x, pos.y, 366, 392, 5, 0.72);
      const glow = this.add.rectangle(pos.x, pos.y, 320, 340, preview.accent, 0.04).setDepth(6);
      const selectionPulse = this.add.rectangle(pos.x, pos.y, 358, 386, preview.accent, 0)
        .setDepth(4)
        .setStrokeStyle(3, preview.accent, 0);
      const frame = this.add.rectangle(pos.x, pos.y, 320, 344, 0x02050a, 0)
        .setDepth(9)
        .setStrokeStyle(1, 0xffffff, 0.18);
      const topAccent = this.add.rectangle(pos.x - 98, pos.y - 174, 96, 4, preview.accent, 0.9)
        .setDepth(10);
      const bottomAccent = this.add.rectangle(pos.x + 92, pos.y + 174, 104, 4, preview.accent, 0.62)
        .setDepth(10);
      const imageFrame = this.add.rectangle(pos.x, pos.y - 78, 300, 184, 0x02050a, 0.9)
        .setDepth(6)
        .setStrokeStyle(2, preview.accent, 0.5);
      const imageInner = this.add.rectangle(pos.x, pos.y - 78, 284, 166, 0x07101a, 0.95)
        .setDepth(6);
      const img = this.add.image(pos.x, pos.y - 78, preview.key).setDisplaySize(280, 156).setDepth(7);
      const shade = this.add.rectangle(pos.x, pos.y + 76, 306, 112, 0x050912, 0.78).setDepth(8);
      const name = this.add.text(pos.x - 145, pos.y + 38, map.name, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "27px",
        color: "#f8fdff",
        fontStyle: "900",
      }).setDepth(9);
      const desc = this.add.text(pos.x - 145, pos.y + 80, map.description, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "14px",
        color: "#d2e5ec",
        fontStyle: "700",
        wordWrap: { width: 282 },
        lineSpacing: 8,
      }).setDepth(9);

      const tagObjects = [];
      map.tags.forEach((tag, tagIndex) => {
        const tx = pos.x - 145 + tagIndex * 94;
        const tagBg = this.add.rectangle(tx + 37, pos.y + 146, 74, 28, 0x111923, 0.94)
          .setStrokeStyle(1, preview.accent, 0.34)
          .setDepth(9);
        const tagText = this.add.text(tx, pos.y + 137, tag, {
          fontFamily: '"Microsoft YaHei", sans-serif',
          fontSize: "12px",
          color: Phaser.Display.Color.IntegerToColor(preview.accent).rgba,
          fontStyle: "900",
        }).setDepth(10);
        tagObjects.push(tagBg, tagText);
      });

      const scan = this.add.rectangle(pos.x - 142, pos.y - 146, 62, 4, preview.accent, 0.88)
        .setDepth(10)
        .setOrigin(0, 0.5);
      this.tweens.add({
        targets: scan,
        x: pos.x + 80,
        alpha: 0.18,
        duration: 1500 + index * 220,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      card.on("pointerdown", () => {
        this.selectedMapId = map.id;
        this.refreshSelection();
      });

      this.cards.push({
        map,
        preview,
        card,
        cardSkin,
        glow,
        selectionPulse,
        frame,
        imageFrame,
        imageInner,
        imageBaseWidth: 280,
        imageBaseHeight: 156,
        topAccent,
        bottomAccent,
        img,
        shade,
        name,
        desc,
        tagObjects,
        scan,
      });
    });
  }

  drawConfirmButton() {
    this.confirmGlow = this.add.ellipse(640, 668, 300, 80, 0xff3446, 0.2).setDepth(10);
    this.confirmButtonSkin = addPrimaryButtonSkin(this, 640, 668, 314, 84, 11);
    this.confirmButton = this.add.rectangle(640, 668, 272, 70, 0xff3446, 0.03)
      .setDepth(11)
      .setStrokeStyle(3, 0xffffff, 0.32)
      .setInteractive({ useHandCursor: true });
    this.confirmButton.on("pointerdown", () => this.enterSelectedMap());
    this.confirmText = this.add.text(640, 668, MENU_TEXT.enterMap, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "27px",
      color: "#0a1015",
      fontStyle: "900",
    }).setOrigin(0.5).setDepth(12);
    wireTechButton(this, this.confirmButton, [this.confirmButtonSkin, this.confirmText]);

    this.tweens.add({
      targets: [this.confirmGlow, this.confirmButton],
      scaleX: 1.035,
      scaleY: 1.05,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawBackButton() {
    this.backButton = this.add.rectangle(884, 712, 146, 42, 0x080d16, 0.9)
      .setDepth(24)
      .setStrokeStyle(2, 0xff5364, 0.52)
      .setInteractive({ useHandCursor: true });
    this.backText = this.add.text(884, 712, "返回开始页", {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "17px",
      color: "#f8fdff",
      fontStyle: "900",
    }).setOrigin(0.5).setDepth(25);
    this.backLine = this.add.rectangle(832, 732, 44, 3, 0xff5364, 0.82).setDepth(25);
    this.backButton.on("pointerdown", () => this.returnToStart());
    this.backText.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.returnToStart());
    this.tweens.add({
      targets: this.backLine,
      x: 934,
      alpha: 0.25,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  refreshSelection() {
    this.cards.forEach((entry) => {
      const selected = entry.map.id === this.selectedMapId;
      entry.card.setStrokeStyle(selected ? 4 : 2, entry.preview.accent, selected ? 0.9 : 0.28);
      entry.glow.setFillStyle(entry.preview.accent, selected ? 0.14 : 0.035);
      entry.img.setDisplaySize(
        selected ? entry.imageBaseWidth + 10 : entry.imageBaseWidth,
        selected ? entry.imageBaseHeight + 6 : entry.imageBaseHeight,
      );
      entry.imageFrame.setStrokeStyle(selected ? 3 : 2, entry.preview.accent, selected ? 0.78 : 0.42);
      entry.name.setColor(selected ? "#ffffff" : "#d9e8ee");
      entry.scan.setAlpha(selected ? 0.92 : 0.38);
      entry.selectionPulse.setAlpha(selected ? 0.58 : 0);
      entry.selectionPulse.setScale(1);
      entry.topAccent.setAlpha(selected ? 1 : 0.48);
      entry.bottomAccent.setAlpha(selected ? 0.82 : 0.34);

      this.tweens.killTweensOf(entry.selectionPulse);
      if (selected) {
        this.tweens.add({
          targets: entry.selectionPulse,
          alpha: 0.12,
          scaleX: 1.04,
          scaleY: 1.055,
          duration: 820,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }
    });
  }

  enterSelectedMap() {
    return beginSceneTransition(this, "GameScene", {
      matchConfig: this.matchConfig,
      mapId: this.selectedMapId,
    });
  }

  returnToStart() {
    return beginSceneTransition(this, "MatchSetupScene", { matchConfig: this.matchConfig });
  }
}
Object.assign(__bundle, { MapSelectScene });
}

// scenes/GameScene.js
{
const { createGameTextures, preloadCustomHeroAssets, ENEMY_TYPES, ENERGY_ORB_CONFIG, GAME_CONFIG, HEROES, ITEM_TYPES, SPAWN_POINTS, getMapConfig, AISystem, BombSystem, ExplosionSystem, HeroAbilitySystem, ItemSystem, MapSystem, MeteorSystem, PlayerSystem, PortalSystem, UISystem, CombatantRegistry, KeyboardInputRouter, createInputProfiles, TouchInputRouter, isMobileDevice, MobileUI, normalizeMatchConfig, GAME_TEXT, getHeroDisplay, getItemDisplay, MAP_LEGEND, STAT_LABELS, addPanelFrame, addTechOverlay, preloadTechUi, beginSceneTransition, resetSceneTransition } = __bundle;
const PANEL_COLORS = {
  shell: 0x070b10,
  card: 0x11151b,
  cardAlt: 0x171a21,
  border: 0xffffff,
  accent: 0xff4452,
  cool: 0x58e8ff,
  warm: 0xff6674,
  text: "#f8fdff",
  muted: "#9bc3cf",
};

const HERO_PORTRAIT_SCALES = {
  shadow: 0.62,
  ember: 0.64,
  volt: 0.6,
  wind: 0.6,
};

const TOUCH_PROFILE = {
  movement: { left: ["LEFT"], right: ["RIGHT"], up: ["UP"], down: ["DOWN"] },
  bomb: ["BOMB"],
  ultimate: ["ULTIMATE"],
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.matchConfig = normalizeMatchConfig(data.matchConfig || { playerHeroes: [data.heroId || "shadow"] });
    this.heroId = this.matchConfig.playerHeroes[0];
    this.mapId = data.mapId || "inferno";
    this.mapConfig = getMapConfig(this.mapId);
    this.ended = false;
  }

  preload() {
    preloadTechUi(this);
    preloadCustomHeroAssets(this);
  }

  create() {
    resetSceneTransition(this);
    createGameTextures(this);
    this.playerInfoPanels = [];
    this.drawFrame();

    this.mapSystem = new MapSystem(this, this.mapId);
    this.mapSystem.create();
    this.itemSystem = new ItemSystem(this, this.mapSystem);
    this.bombSystem = new BombSystem(this, this.mapSystem);
    this.explosionSystem = new ExplosionSystem(this, this.mapSystem, this.itemSystem);
    this.bombSystem.setExplosionSystem(this.explosionSystem);

    this.registry = new CombatantRegistry();
    const mobile = isMobileDevice();
    if (mobile) {
      this.inputRouter = new TouchInputRouter(this);
    } else {
      this.inputRouter = new KeyboardInputRouter(this.input.keyboard);
    }
    const inputProfiles = mobile
      ? Array(this.matchConfig.playerCount).fill(TOUCH_PROFILE)
      : createInputProfiles(this.matchConfig.playerCount);
    this.playerSystems = this.matchConfig.playerHeroes.map((heroId, index) => {
      const player = new PlayerSystem(this, this.mapSystem, this.bombSystem, this.itemSystem, heroId, {
        ownerId: `player-${index + 1}`,
        playerSlot: index + 1,
        spawnCell: SPAWN_POINTS.players[index],
        inputRouter: this.inputRouter,
        inputProfile: inputProfiles[index],
      });
      return player;
    });
    this.playerSystems.forEach((player, index) => {
      player.create();
      this.registry.register(player, { kind: "player", slot: index + 1 });
    });
    this.playerSystem = this.playerSystems[0];
    this.aiSystem = new AISystem(this, this.mapSystem, this.bombSystem, this.playerSystems, this.itemSystem, {
      aiCount: this.matchConfig.aiCount,
      registry: this.registry,
    });
    this.aiSystem.create();
    this.portalSystem = this.mapSystem.mapConfig.portal?.enabled
      ? new PortalSystem(this, this.mapSystem, this.registry, this.aiSystem)
      : null;
    this.portalSystem?.create();
    this.aiSystem.setPortalSystem(this.portalSystem);
    this.heroAbilitySystems = this.playerSystems.map((player) => {
      const abilities = new HeroAbilitySystem(this, this.mapSystem, player, this.aiSystem, this.registry);
      player.setAbilitySystem(abilities);
      return abilities;
    });
    this.heroAbilitySystem = this.heroAbilitySystems[0];
    this.aiSystem.setHeroAbilitySystem(this.heroAbilitySystems);
    this.explosionSystem.connect(this.playerSystems, this.aiSystem, this.registry);
    this.meteorSystem = this.mapSystem.mapConfig.meteor?.enabled
      ? new MeteorSystem(this, this.mapSystem, this.playerSystems, this.aiSystem, this.itemSystem, this.registry)
      : null;
    this.aiSystem.setMeteorSystem(this.meteorSystem);
    this.createAbyssPlayerAuras();

    this.uiSystem = new UISystem(this, this.playerSystems, this.aiSystem, this.heroAbilitySystems, this.matchConfig);
    this.uiSystem.create();
    this.onCombatantDefeated = (ownerId) => this.showPlayerDefeated(ownerId);
    this.events.on("combatant-defeated", this.onCombatantDefeated);
    const cleanup = () => {
      this.inputRouter?.destroy();
      this.events.off?.("combatant-defeated", this.onCombatantDefeated);
    };
    if (this.events.once) this.events.once("shutdown", cleanup);
    else this.events.on("shutdown", cleanup);

    this.mobileUI = new MobileUI(this);
  }

  update(time, delta) {
    if (this.ended) return;

    this.itemSystem.update(time, this.registry.all());

    this.playerSystems.forEach((player) => player.update(time, delta));
    this.aiSystem.update(time, delta);
    this.portalSystem?.update(time, delta);
    this.heroAbilitySystems.forEach((abilities) => abilities.update(time, delta));
    this.meteorSystem?.update(time, delta);
    this.explosionSystem.checkActiveHits();
    this.uiSystem.update();
    this.inputRouter.endFrame();
    this.updateAbyssPlayerAuras();
    const outcome = this.resolveOutcome();
    if (outcome) this.finish(outcome);
  }

  createAbyssPlayerAuras() {
    this.abyssPlayerAuras = [];
    if (this.mapConfig.theme !== "abyss") return;
    this.playerSystems.forEach((player) => {
      const aura = this.add.circle(player.sprite.x, player.sprite.y + 12, 19, player.hero.accent, 0.05)
        .setDepth(5)
        .setStrokeStyle(2, player.hero.accent, 0.28);
      this.tweens.add({
        targets: aura,
        scale: 1.16,
        alpha: 0.12,
        duration: 820,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.abyssPlayerAuras.push({ player, aura });
    });
  }

  updateAbyssPlayerAuras() {
    this.abyssPlayerAuras?.forEach(({ player, aura }) => {
      aura.setVisible(player.alive);
      if (player.alive) {
        aura.x = player.sprite.x;
        aura.y = player.sprite.y + 12;
      }
    });
  }

  resolveOutcome() {
    if (this.matchConfig.playerCount === 2) return this.registry.outcome();
    const player = this.playerSystem;
    const aliveEnemies = this.aiSystem.enemies.filter((enemy) => enemy.alive);
    if (!player.alive && aliveEnemies.length === 0) return { type: "draw", winner: null };
    if (!player.alive) return { type: "winner", winner: aliveEnemies[0] };
    if (aliveEnemies.length === 0) return { type: "winner", winner: player };
    return null;
  }

  finish(outcome) {
    if (this.ended) return;
    this.ended = true;
    const winnerData = outcome.winner ? {
      ownerId: outcome.winner.ownerId,
      kind: outcome.winner.combatantKind,
      heroId: outcome.winner.combatantKind === "player" ? outcome.winner.hero?.id : null,
      texture: outcome.winner.sprite?.texture?.key,
      stats: { ...outcome.winner.stats },
    } : null;
    beginSceneTransition(this, "ResultScene", {
        result: outcome.type === "draw" ? "draw" : winnerData.kind === "player" ? "win" : "lose",
        winner: winnerData,
        matchConfig: this.matchConfig,
        heroId: winnerData?.heroId || this.heroId,
        stats: winnerData?.stats || this.playerSystem.stats,
      }, { delayMs: 420 });
  }

  drawFrame() {
    this.add.rectangle(640, 380, 1280, 760, 0x05070c);

    for (let index = 0; index < 30; index += 1) {
      this.add.circle(
        Phaser.Math.Between(24, 1256),
        Phaser.Math.Between(24, 736),
        Phaser.Math.Between(2, 5),
        Phaser.Utils.Array.GetRandom([0xff4452, 0xff6674, 0x58e8ff, 0x7df4d4]),
        Phaser.Math.FloatBetween(0.035, 0.11),
      );
    }

    this.add.rectangle(640, 380, 1280, 760, 0x11151d, 0.16);
    this.add.rectangle(260, 112, 320, 96, 0xff4452, 0.052).setAngle(-14);
    this.add.rectangle(1030, 642, 330, 112, 0xff4452, 0.045).setAngle(-12);
    this.add.rectangle(648, 382, 1120, 676, 0x070a0f, 0.42).setStrokeStyle(1, 0xff4452, 0.11);

    this.playfieldShell = this.add.rectangle(640, 392, 1240, 706, 0x070b10, 0.86).setStrokeStyle(1, 0xff4452, 0.16);
    this.boardFrame = this.add.rectangle(
      GAME_CONFIG.BOARD_OFFSET_X + (GAME_CONFIG.GRID_COLS * GAME_CONFIG.TILE_SIZE) / 2,
      GAME_CONFIG.BOARD_OFFSET_Y + (GAME_CONFIG.GRID_ROWS * GAME_CONFIG.TILE_SIZE) / 2,
      GAME_CONFIG.GRID_COLS * GAME_CONFIG.TILE_SIZE + 24,
      GAME_CONFIG.GRID_ROWS * GAME_CONFIG.TILE_SIZE + 24,
      0x080b10,
      0.6,
    ).setStrokeStyle(3, PANEL_COLORS.accent, 0.48);
    this.add.rectangle(this.boardFrame.x, this.boardFrame.y, this.boardFrame.width + 20, this.boardFrame.height + 20, 0xff4452, 0.035)
      .setStrokeStyle(1, 0x58e8ff, 0.16);

    this.drawLeftPanel();
    if (this.matchConfig.playerCount === 2) this.drawSecondPlayerPanel();
    else this.drawRightPanel();

    this.add.text(494, 700, GAME_TEXT.boardSize, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color: "#d8f8ff",
      fontStyle: "800",
      backgroundColor: "rgba(10, 12, 18, 0.78)",
      padding: { x: 14, y: 6 },
    }).setDepth(10);
    this.techOverlay = addTechOverlay(this, 60, 0.88);
  }

  drawLeftPanel() {
    const hero = HEROES.find((item) => item.id === this.heroId) || HEROES[0];
    const copy = getHeroDisplay(hero);
    const leftX = 174;

    this.leftPanel = this.add.rectangle(leftX, 380, 300, 684, PANEL_COLORS.shell, 0.92)
      .setStrokeStyle(2, PANEL_COLORS.accent, 0.28);
    this.leftPanelSkin = addPanelFrame(this, leftX, 380, 322, 706, 0, 0.62);
    this.add.rectangle(leftX, 92, 258, 82, PANEL_COLORS.cardAlt, 0.88)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.34);
    this.add.rectangle(leftX - 118, 380, 4, 628, PANEL_COLORS.accent, 0.76);
    this.add.rectangle(leftX + 122, 112, 58, 3, PANEL_COLORS.cool, 0.42);

    this.add.text(44, 44, GAME_TEXT.title, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "34px",
      color: "#f8fdff",
      fontStyle: "900",
    });
    this.add.text(46, 82, GAME_TEXT.subtitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "16px",
      color: "#d8f8ff",
      fontStyle: "800",
    });

    this.cardTag(50, 130, GAME_TEXT.heroPanelTitle, hero.accent);
    this.add.rectangle(leftX, 286, 248, 308, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(2, hero.accent, 0.42);
    this.add.rectangle(leftX, 206, 210, 154, 0xff4452, 0.035).setStrokeStyle(1, 0xff4452, 0.16);
    this.add.ellipse(leftX, 334, 206, 30, 0x04080b, 0.26);

    const portraitKey = this.textures.exists(`${hero.texture}-poster`) ? `${hero.texture}-poster` : hero.texture;
    const portraitScale = this.textures.exists(`${hero.texture}-poster`)
      ? HERO_PORTRAIT_SCALES[hero.id] || 0.54
      : 2.2;
    this.add.image(leftX, 236, portraitKey).setScale(portraitScale).setDepth(4);

    this.add.text(leftX, 370, copy.name, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "20px",
      color: PANEL_COLORS.text,
      fontStyle: "900",
      align: "center",
      wordWrap: { width: 220 },
    }).setOrigin(0.5);
    this.add.text(leftX, 402, `${copy.description}\n${STAT_LABELS.speed}/${hero.baseStats?.speed ?? 1}  ${STAT_LABELS.maxBombs}/${hero.baseStats?.maxBombs ?? 1}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "12px",
      color: PANEL_COLORS.muted,
      fontStyle: "700",
      align: "center",
      wordWrap: { width: 218 },
      lineSpacing: 5,
    }).setOrigin(0.5, 0);

    this.add.rectangle(leftX, 526, 248, 124, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.2);
    this.drawStatChip(112, 492, STAT_LABELS.speed, hero.baseStats?.speed ?? 1, hero.accent);
    this.drawStatChip(236, 492, STAT_LABELS.maxBombs, hero.baseStats?.maxBombs ?? 1, hero.accent);
    this.drawStatChip(112, 546, STAT_LABELS.blastRange, hero.baseStats?.blastRange ?? 2, hero.accent);
    this.drawStatChip(236, 546, STAT_LABELS.shield, hero.baseStats?.shield ?? 0, hero.accent);

    this.cardTag(50, 596, GAME_TEXT.controlTitle, PANEL_COLORS.warm);
    this.add.rectangle(leftX, 662, 248, 108, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(1, PANEL_COLORS.warm, 0.28);
    this.drawControlRow(64, 628, GAME_TEXT.moveLabel, GAME_TEXT.moveValue);
    this.drawControlRow(64, 660, GAME_TEXT.bombLabel, this.matchConfig.playerCount === 2 ? "左 Ctrl" : GAME_TEXT.bombValue);
    this.drawControlRow(64, 692, GAME_TEXT.ultimateLabel, this.matchConfig.playerCount === 2 ? "Q" : GAME_TEXT.ultimateValue);
    this.playerInfoPanels[0] = this.createDefeatPanel(1, leftX, 300, hero.accent);
  }

  drawSecondPlayerPanel() {
    const hero = HEROES.find((item) => item.id === this.matchConfig.playerHeroes[1]) || HEROES[1];
    const copy = getHeroDisplay(hero);
    const rightX = 1118;
    this.rightPanel = this.add.rectangle(rightX, 380, 272, 684, PANEL_COLORS.shell, 0.92)
      .setStrokeStyle(2, hero.accent, 0.34);
    this.rightPanelSkin = addPanelFrame(this, rightX, 380, 294, 706, 0, 0.62);
    this.add.rectangle(rightX + 118, 380, 4, 628, hero.accent, 0.8);
    this.cardTag(996, 58, "玩家 2", hero.accent);
    this.add.rectangle(rightX, 278, 230, 360, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(2, hero.accent, 0.42);
    const portraitKey = this.textures.exists(`${hero.texture}-poster`) ? `${hero.texture}-poster` : hero.texture;
    const portraitScale = this.textures.exists(`${hero.texture}-poster`) ? (HERO_PORTRAIT_SCALES[hero.id] || 0.54) : 2.2;
    this.add.image(rightX, 216, portraitKey).setScale(portraitScale).setDepth(4);
    this.add.text(rightX, 388, copy.name, {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "19px", color: PANEL_COLORS.text,
      fontStyle: "900", align: "center", wordWrap: { width: 214 },
    }).setOrigin(0.5);
    this.add.text(rightX, 424, copy.description, {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "12px", color: PANEL_COLORS.muted,
      fontStyle: "700", align: "center", wordWrap: { width: 210 }, lineSpacing: 4,
    }).setOrigin(0.5, 0);
    this.add.rectangle(rightX, 526, 230, 116, PANEL_COLORS.card, 0.9).setStrokeStyle(1, hero.accent, 0.26);
    this.drawStatChip(1068, 500, STAT_LABELS.speed, hero.baseStats?.speed ?? 1, hero.accent);
    this.drawStatChip(1178, 500, STAT_LABELS.maxBombs, hero.baseStats?.maxBombs ?? 1, hero.accent);
    this.drawStatChip(1068, 550, STAT_LABELS.blastRange, hero.baseStats?.blastRange ?? 2, hero.accent);
    this.drawStatChip(1178, 550, STAT_LABELS.shield, hero.baseStats?.shield ?? 0, hero.accent);
    this.cardTag(996, 594, GAME_TEXT.controlTitle, PANEL_COLORS.cool);
    this.add.rectangle(rightX, 662, 230, 108, PANEL_COLORS.card, 0.9).setStrokeStyle(1, PANEL_COLORS.cool, 0.3);
    this.drawControlRow(1006, 628, GAME_TEXT.moveLabel, "方向键");
    this.drawControlRow(1006, 660, GAME_TEXT.bombLabel, "右 Ctrl");
    this.drawControlRow(1006, 692, GAME_TEXT.ultimateLabel, "P");
    this.playerInfoPanels[1] = this.createDefeatPanel(2, rightX, 272, hero.accent);
  }

  createDefeatPanel(slot, x, width, accent) {
    const overlay = this.add.rectangle(x, 380, width - 14, 650, 0x08090d, 0)
      .setDepth(32)
      .setStrokeStyle(2, 0xff4358, 0.68)
      .setVisible(false);
    const slashA = this.add.rectangle(x, 380, width - 54, 5, 0xff4358, 0.76)
      .setAngle(-12).setDepth(33).setVisible(false);
    const slashB = this.add.rectangle(x, 380, width - 54, 2, accent, 0.46)
      .setAngle(12).setDepth(33).setVisible(false);
    const slotLabel = this.add.text(x, 340, `PLAYER ${slot}`, {
      fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#ff8b97", fontStyle: "900",
    }).setOrigin(0.5).setDepth(34).setVisible(false);
    const defeatStamp = this.add.text(x, 380, "bye man", {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "38px", color: "#ffffff", fontStyle: "900",
      backgroundColor: "rgba(157, 35, 50, 0.92)", padding: { x: 24, y: 10 },
    }).setOrigin(0.5).setAngle(-5).setDepth(35).setVisible(false);
    const subLabel = this.add.text(x, 438, "COMBATANT ELIMINATED", {
      fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#ff8b97", fontStyle: "900",
    }).setOrigin(0.5).setDepth(34).setVisible(false);
    return { overlay, slashA, slashB, slotLabel, defeatStamp, subLabel };
  }

  showPlayerDefeated(ownerId) {
    if (!ownerId?.startsWith?.("player-")) return;
    const slot = Number(ownerId.split("-")[1]);
    const panel = this.playerInfoPanels[slot - 1];
    if (!panel || panel.defeatStamp.visible) return;
    Object.values(panel).forEach((object) => object.setVisible(true));
    panel.overlay.setAlpha(0);
    panel.defeatStamp.setScale(1.22).setAlpha(0);
    this.tweens.add({ targets: panel.overlay, alpha: 0.82, duration: 220, ease: "Quad.easeOut" });
    this.tweens.add({
      targets: panel.defeatStamp,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 280,
      ease: "Back.easeOut",
    });
  }

  drawRightPanel() {
    const rightX = 1118;
    this.rightPanel = this.add.rectangle(rightX, 380, 272, 684, PANEL_COLORS.shell, 0.92)
      .setStrokeStyle(2, PANEL_COLORS.accent, 0.28);
    this.rightPanelSkin = addPanelFrame(this, rightX, 380, 294, 706, 0, 0.62);
    this.add.rectangle(rightX + 118, 380, 4, 628, PANEL_COLORS.accent, 0.76);

    this.add.rectangle(rightX, 126, 230, 116, PANEL_COLORS.cardAlt, 0.88)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.34);
    this.cardTag(996, 78, GAME_TEXT.goalTitle, PANEL_COLORS.warm);
    this.add.text(1010, 112, GAME_TEXT.goalBody, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color: PANEL_COLORS.muted,
      fontStyle: "700",
      wordWrap: { width: 214 },
      lineSpacing: 6,
    });

    this.add.rectangle(rightX, 326, 230, 252, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.32);
    this.cardTag(996, 194, GAME_TEXT.itemTitle, PANEL_COLORS.cool);

    [...ITEM_TYPES, { id: ENERGY_ORB_CONFIG.id, texture: ENERGY_ORB_CONFIG.texture }].forEach((item, index) => {
      const display = getItemDisplay(item.id, item.label);
      const y = 234 + index * 44;
      const texture = this.mapConfig.itemTextures?.[item.id] || item.texture;
      this.add.image(1028, y, texture).setScale(0.86);
      this.add.text(1058, y - 11, display.label, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "13px",
        color: PANEL_COLORS.text,
        fontStyle: "900",
      });
      this.add.text(1058, y + 5, display.description, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "11px",
        color: PANEL_COLORS.muted,
        fontStyle: "700",
        wordWrap: { width: 144 },
        lineSpacing: 4,
      });
    });

    this.add.rectangle(rightX, 560, 230, 194, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.22);
    this.cardTag(996, 476, GAME_TEXT.mapTitle, PANEL_COLORS.cool);

    const mapLegend = MAP_LEGEND.map((entry) => {
      if (entry.texture === "tile-floor-a") return { ...entry, texture: this.mapConfig.textures.floorA };
      if (entry.texture === "wall-solid") return { ...entry, texture: this.mapConfig.textures.wall };
      if (entry.texture === "box-breakable") return { ...entry, texture: this.mapConfig.textures.box };
      if (entry.texture === "bomb") return { ...entry, texture: this.mapConfig.textures.bomb };
      return entry;
    });

    mapLegend.forEach((entry, index) => {
      const y = 516 + index * 30;
      this.add.image(1028, y, entry.texture).setScale(0.76);
      this.add.text(1058, y - 9, entry.label, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "12px",
        color: "#d8f8ff",
        fontStyle: "800",
        wordWrap: { width: 150 },
      });
    });

    this.add.text(1010, 642, GAME_TEXT.enemyPanelTitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: PANEL_COLORS.text,
      fontStyle: "900",
    });
    ENEMY_TYPES.forEach((enemy, index) => {
      this.add.rectangle(1032 + index * 66, 680, 48, 48, 0x141820, 0.86)
        .setStrokeStyle(1, enemy.accent, 0.32);
      this.add.image(1032 + index * 66, 680, enemy.texture).setScale(0.76);
    });
  }

  drawStatChip(x, y, label, value, accent) {
    this.add.rectangle(x, y, 104, 42, PANEL_COLORS.cardAlt, 0.9)
      .setStrokeStyle(1, accent, 0.34);
    this.add.text(x - 38, y - 11, label, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "11px",
      color: PANEL_COLORS.muted,
      fontStyle: "700",
    });
    this.add.text(x - 38, y + 1, String(value), {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "20px",
      color: Phaser.Display.Color.IntegerToColor(accent).rgba,
      fontStyle: "900",
    });
  }

  drawControlRow(x, y, label, value) {
    this.add.text(x, y, label, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color: PANEL_COLORS.text,
      fontStyle: "800",
    });
    this.add.text(x + 118, y, value, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "12px",
      color: PANEL_COLORS.muted,
      fontStyle: "700",
      wordWrap: { width: 104 },
    });
  }

  cardTag(x, y, text, accent) {
    this.add.rectangle(x + 72, y + 12, 144, 30, 0x15171e, 0.92)
      .setStrokeStyle(1, accent, 0.34);
    this.add.rectangle(x + 2, y + 28, 52, 3, accent, 0.75);
    this.add.text(x, y, text, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "15px",
      color: Phaser.Display.Color.IntegerToColor(accent).rgba,
      fontStyle: "900",
    });
  }
}
Object.assign(__bundle, { GameScene });
}

// scenes/ResultScene.js
{
const { HEROES, MENU_THEME, createGameTextures, createMenuMascotTexture, preloadCustomHeroAssets, getHeroDisplay, MENU_TEXT, STAT_LABELS, addAmbientTechMotion, addPanelFrame, addPrimaryButtonSkin, addTechOverlay, preloadTechUi, wireTechButton, beginSceneTransition, resetSceneTransition } = __bundle;
const MENU_BG_KEY = "menu-spoon-wallpaper-v2";
const MENU_BG_PATH = "assets/menu-spoon-wallpaper-v2.png";
const RESULT_ART = Object.fromEntries(HEROES.flatMap((hero) => [
  [`result-${hero.id}-win-v1`, `assets/result-${hero.id}-win-v1.png`],
  [`result-${hero.id}-lose-v1`, `assets/result-${hero.id}-lose-v1.png`],
]));
const resultArtKey = (hero, state) => `result-${hero.id}-${state}-v1`;

const HERO_POSTER_LAYOUTS = {
  shadow: { x: 356, y: 438, scale: 1.48 },
  ember: { x: 360, y: 446, scale: 1.5 },
  volt: { x: 350, y: 438, scale: 1.32 },
  wind: { x: 356, y: 440, scale: 1.3 },
};

class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  init(data) {
    this.result = data.result || "lose";
    this.winner = data.winner || null;
    this.matchConfig = data.matchConfig || null;
    this.heroId = data.heroId || "shadow";
    this.stats = data.stats || {};
  }

  preload() {
    preloadTechUi(this);
    if (!this.textures.exists(MENU_BG_KEY)) this.load.image(MENU_BG_KEY, MENU_BG_PATH);
    Object.entries(RESULT_ART).forEach(([key, path]) => {
      if (!this.textures.exists(key)) this.load.image(key, path);
    });
    if (!this.textures.exists(MENU_THEME.mascotSourceKey)) {
      this.load.image(MENU_THEME.mascotSourceKey, MENU_THEME.mascotSourcePath);
    }
    preloadCustomHeroAssets(this);
  }

  create() {
    resetSceneTransition(this);
    createGameTextures(this);
    createMenuMascotTexture(this, MENU_THEME.mascotSourceKey, MENU_THEME.mascotTextureKey);

    this.isDraw = this.result === "draw";
    this.isWin = this.result === "win";
    this.isDualResult = this.matchConfig?.playerCount === 2 && this.matchConfig?.playerHeroes?.length === 2;
    this.hero = HEROES.find((entry) => entry.id === this.heroId) || HEROES[0];
    this.isAiWinner = this.winner?.kind === "ai";
    this.copy = getHeroDisplay(this.hero);
    this.heroAccent = this.isAiWinner ? 0xff6674 : this.hero.accent;
    this.stateAccent = this.isDraw ? 0x9bc3cf : this.isWin ? 0xffd45a : 0xff3446;

    this.cameras.main.setBackgroundColor("#050912");
    this.drawBackdrop();
    if (this.isDualResult) {
      this.drawDuelResult();
    } else {
      this.drawHeroPoster();
      this.drawResultPanel();
    }
    this.drawRestartButton();

    this.input.keyboard.once("keydown-ENTER", () => this.restart());
  }

  restart() {
    return beginSceneTransition(this, "StartScene", { heroId: this.heroId });
  }

  drawBackdrop() {
    const bg = this.add.image(640, 380, MENU_BG_KEY).setDepth(-50);
    bg.setScale(Math.max(1280 / bg.width, 760 / bg.height));
    bg.setAlpha(this.isWin ? 1 : 0.88);
    this.add.rectangle(640, 380, 1280, 760, 0x030711, this.isWin ? 0.1 : 0.24).setDepth(-49);
    this.add.rectangle(390, 418, 570, 560, 0x030711, 0.24).setDepth(-48);
    this.add.rectangle(920, 412, 470, 560, 0x030711, 0.36).setDepth(-48);
    this.add.rectangle(640, 142, 1110, 3, this.stateAccent, 0.72).setDepth(-20);
    this.add.rectangle(640, 690, 1110, 3, this.stateAccent, 0.5).setDepth(-20);
    this.techOverlay = addTechOverlay(this, 80, 0.94);
    this.ambientScan = addAmbientTechMotion(this, 2);
  }

  drawHeroPoster() {
    const layout = HERO_POSTER_LAYOUTS[this.hero.id] || HERO_POSTER_LAYOUTS.shadow;
    const state = this.isWin && !this.isAiWinner ? "win" : "lose";
    this.posterFrame = this.add.rectangle(370, 446, 520, 496, 0x050a12, 0.34)
      .setDepth(5)
      .setStrokeStyle(2, this.heroAccent, 0.34);
    this.posterFrameSkin = addPanelFrame(this, 370, 446, 548, 522, 6, 0.7);
    this.add.rectangle(370, 212, 438, 4, this.heroAccent, 0.62).setDepth(6);
    this.add.ellipse(374, 628, 340, 72, this.stateAccent, this.isWin ? 0.16 : 0.08)
      .setDepth(7)
      .setStrokeStyle(3, this.stateAccent, this.isWin ? 0.58 : 0.3);
    this.add.rectangle(370, 442, 340, 410, this.heroAccent, 0.09).setDepth(7);
    this.posterSprite = this.add.image(layout.x, layout.y, resultArtKey(this.hero, state))
      .setDisplaySize(360, 480)
      .setDepth(12);
    this.drawStateEffects(layout.x, layout.y, state, this.heroAccent, 360);
    this.tweens.add({
      targets: this.posterSprite,
      y: layout.y - (state === "win" ? 10 : 4),
      angle: state === "win" ? 0.8 : -0.5,
      duration: state === "win" ? 900 : 1450,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawDuelResult() {
    const heroes = this.matchConfig.playerHeroes.map((heroId) => HEROES.find((hero) => hero.id === heroId) || HEROES[0]);
    const winnerSlot = this.winner?.ownerId?.startsWith?.("player-") ? Number(this.winner.ownerId.split("-")[1]) : 0;
    const title = this.isDraw ? "本局平局" : this.isAiWinner ? "AI 获胜" : `玩家 ${winnerSlot} 胜利`;
    this.duelTitle = this.add.text(640, 64, title, {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "54px", color: "#f8fdff", fontStyle: "900",
    }).setOrigin(0.5).setDepth(22).setShadow(0, 7, "#02070c", 14, true, true);
    this.duelTitle.setAlpha(0).setScale(1.08);
    this.tweens.add({ targets: this.duelTitle, alpha: 1, scaleX: 1, scaleY: 1, duration: 520, ease: "Back.easeOut" });
    this.add.text(640, 120, this.isAiWinner ? "两名玩家均已败北 / REDEPLOY" : "FINAL COMBAT REPORT / 最终对决", {
      fontFamily: "Arial, sans-serif", fontSize: "13px", color: this.isAiWinner ? "#ff6674" : "#9bc3cf", fontStyle: "900",
    }).setOrigin(0.5).setDepth(22);
    this.add.rectangle(640, 146, 720, 3, this.isAiWinner ? 0xff4353 : 0x58e8ff, 0.72).setDepth(20);

    const centers = [350, 930];
    this.duelCards = heroes.map((hero, index) => {
      const slot = index + 1;
      const state = winnerSlot === slot && !this.isDraw && !this.isAiWinner ? "win" : "lose";
      const accent = state === "win" ? 0xffd45a : 0xff4353;
      const copy = getHeroDisplay(hero);
      const frame = this.add.rectangle(centers[index], 398, 484, 492, 0x050a12, 0.58)
        .setDepth(5).setStrokeStyle(2, accent, state === "win" ? 0.72 : 0.38);
      const frameSkin = addPanelFrame(this, centers[index], 398, 508, 518, 6, state === "win" ? 0.84 : 0.58);
      const stateLabel = this.add.text(centers[index], 174, state === "win" ? "VICTOR / 胜利" : this.isDraw ? "DRAW / 平局" : "DEFEATED / 败北", {
        fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "17px", color: Phaser.Display.Color.IntegerToColor(accent).rgba, fontStyle: "900",
      }).setOrigin(0.5).setDepth(18);
      const portrait = this.add.image(centers[index], 398, resultArtKey(hero, state)).setDisplaySize(330, 440).setDepth(12);
      const name = this.add.text(centers[index], 612, `P${slot}  ${copy.name}`, {
        fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "22px", color: "#f8fdff", fontStyle: "900",
      }).setOrigin(0.5).setDepth(18);
      this.drawStateEffects(centers[index], 398, state, hero.accent, 330);
      this.tweens.add({
        targets: portrait,
        y: portrait.y + (state === "win" ? -8 : 4),
        alpha: state === "win" ? 1 : 0.86,
        duration: state === "win" ? 840 : 1380,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      return { hero, state, frame, frameSkin, stateLabel, portrait, name };
    });

    this.vsMark = this.add.text(640, 394, this.isAiWinner ? "×" : "VS", {
      fontFamily: "Arial Black, sans-serif", fontSize: "38px", color: this.isAiWinner ? "#ff4353" : "#ffffff", fontStyle: "900",
    }).setOrigin(0.5).setDepth(25).setShadow(0, 0, this.isAiWinner ? "#ff4353" : "#58e8ff", 16, true, true);
    this.tweens.add({ targets: this.vsMark, scaleX: 1.12, scaleY: 1.12, alpha: 0.72, duration: 620, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  drawStateEffects(x, y, state, accent, spread) {
    const color = state === "win" ? accent : 0xff4353;
    for (let index = 0; index < (state === "win" ? 9 : 5); index += 1) {
      const offset = -spread / 2 + (spread / Math.max(1, (state === "win" ? 8 : 4))) * index;
      const spark = this.add.rectangle(x + offset, y + (state === "win" ? 170 : -150 + index * 64), state === "win" ? 4 : 54, state === "win" ? 18 : 2, color, state === "win" ? 0.66 : 0.42).setDepth(10);
      this.tweens.add({
        targets: spark,
        y: spark.y + (state === "win" ? -70 : 0),
        x: spark.x + (state === "win" ? (index % 2 ? 12 : -12) : 42),
        alpha: 0,
        duration: state === "win" ? 720 + index * 55 : 360 + index * 70,
        delay: index * 80,
        repeat: -1,
        repeatDelay: state === "win" ? 420 : 780,
        ease: "Quad.easeOut",
      });
    }
  }

  drawResultPanel() {
    const accentColor = Phaser.Display.Color.IntegerToColor(this.stateAccent).rgba;
    const heroAccentColor = Phaser.Display.Color.IntegerToColor(this.heroAccent).rgba;
    this.resultPanel = this.add.rectangle(858, 406, 420, 510, 0x070d15, 0.78)
      .setDepth(6)
      .setStrokeStyle(2, this.stateAccent, 0.26);
    this.resultPanelSkin = addPanelFrame(this, 858, 406, 448, 536, 7, 0.7);
    const winnerSlot = this.winner?.ownerId?.startsWith?.("player-") ? this.winner.ownerId.split("-")[1] : null;
    const resultTitle = this.isDraw
      ? "本局平局"
      : winnerSlot
        ? `玩家${winnerSlot}获胜`
        : this.isAiWinner
          ? "AI获胜"
          : this.isWin ? MENU_TEXT.resultWin : MENU_TEXT.resultLose;
    const panelTitle = this.isDraw ? "NO SURVIVORS" : this.isWin ? MENU_TEXT.resultPanelWin : MENU_TEXT.resultPanelLose;
    const lead = this.isDraw ? "最后的冲击没有留下赢家" : this.isAiWinner ? "对手控制了最终战场" : this.isWin ? MENU_TEXT.resultLeadWin : MENU_TEXT.resultLeadLose;
    const body = this.isDraw ? "所有参战者同时出局，本轮不判定胜者。" : this.isAiWinner ? "重新部署，下一局夺回最后生存权。" : this.isWin ? MENU_TEXT.resultBodyWin : MENU_TEXT.resultBodyLose;
    this.add.text(660, 186, panelTitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "15px",
      color: accentColor,
      fontStyle: "900",
    }).setDepth(12);
    this.add.rectangle(660, 214, 160, 4, this.stateAccent, 0.9).setOrigin(0, 0.5).setDepth(12);

    this.resultTitle = this.add.text(656, 236, resultTitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: winnerSlot || this.isAiWinner || this.isDraw ? "48px" : "64px",
      color: "#f8fdff",
      fontStyle: "900",
    }).setDepth(12).setShadow(0, 6, "#02070c", 12, true, true);

    this.add.text(662, 320, lead, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "22px",
      color: accentColor,
      fontStyle: "900",
      wordWrap: { width: 344 },
    }).setDepth(12);
    this.add.text(662, 368, body, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "16px",
      color: "#cfe2e8",
      fontStyle: "700",
      wordWrap: { width: 344 },
      lineSpacing: 8,
    }).setDepth(12);

    this.add.rectangle(840, 492, 344, 86, 0x101923, 0.86)
      .setDepth(8)
      .setStrokeStyle(1, this.heroAccent, 0.26);
    this.add.text(680, 464, MENU_TEXT.currentHero, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color: "#93aab4",
      fontStyle: "900",
    }).setDepth(12);
    this.add.text(680, 488, this.copy.name, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "28px",
      color: "#f8fdff",
      fontStyle: "900",
      wordWrap: { width: 310 },
    }).setDepth(12);
    this.add.text(680, 532, `${this.copy.description} / ${this.copy.shortName}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: heroAccentColor,
      fontStyle: "800",
      wordWrap: { width: 310 },
    }).setDepth(12);

    const stats = [
      [STAT_LABELS.speed, this.stats.speed ?? this.hero.baseStats?.speed ?? 1],
      [STAT_LABELS.maxBombs, this.stats.maxBombs ?? this.hero.baseStats?.maxBombs ?? 1],
      [STAT_LABELS.blastRange, this.stats.blastRange ?? this.hero.baseStats?.blastRange ?? 2],
      [STAT_LABELS.shield, this.stats.shield ?? this.hero.baseStats?.shield ?? 0],
    ];
    stats.forEach(([label, value], index) => {
      const x = 680 + (index % 2) * 164;
      const y = 578 + Math.floor(index / 2) * 64;
      this.add.rectangle(x + 62, y + 24, 124, 50, 0x101923, 0.84)
        .setDepth(8)
        .setStrokeStyle(1, this.stateAccent, 0.18);
      this.add.text(x + 10, y + 7, label, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "12px",
        color: "#93aab4",
        fontStyle: "700",
      }).setDepth(12);
      this.add.text(x + 10, y + 22, String(value), {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "20px",
        color: accentColor,
        fontStyle: "900",
      }).setDepth(12);
    });

    this.add.text(78, 706, `${MENU_TEXT.title} / ${MENU_TEXT.slogan}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "18px",
      color: "#ff5364",
      fontStyle: "900",
    }).setDepth(20);

    this.tweens.add({
      targets: this.resultTitle,
      scaleX: this.isWin ? 1.022 : 1.01,
      scaleY: this.isWin ? 1.022 : 1.01,
      duration: this.isWin ? 920 : 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawRestartButton() {
    const buttonX = this.isDualResult ? 640 : 1040;
    const buttonY = this.isDualResult ? 700 : 666;
    this.restartGlow = this.add.ellipse(buttonX, buttonY, 278, 78, this.stateAccent, 0.2).setDepth(10);
    this.restartButtonSkin = addPrimaryButtonSkin(this, buttonX, buttonY, 294, 82, 11);
    this.restartButton = this.add.rectangle(buttonX, buttonY, 252, 68, this.stateAccent, 0.03)
      .setDepth(11)
      .setStrokeStyle(3, 0xffffff, 0.32)
      .setInteractive({ useHandCursor: true });
    this.restartButton.on("pointerdown", () => this.restart());
    this.restartText = this.add.text(buttonX, buttonY, MENU_TEXT.restart, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "27px",
      color: "#0a1015",
      fontStyle: "900",
    }).setOrigin(0.5).setDepth(12);
    wireTechButton(this, this.restartButton, [this.restartButtonSkin, this.restartText]);
    this.add.text(buttonX - 126, this.isDualResult ? 738 : 712, MENU_TEXT.restartHint, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "12px",
      color: "#93aab4",
      fontStyle: "700",
      wordWrap: { width: 260 },
    }).setDepth(12);
    this.tweens.add({
      targets: [this.restartGlow, this.restartButton],
      scaleX: 1.03,
      scaleY: 1.05,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawMascot() {
    this.mascot = this.add.image(1148, 158, MENU_THEME.mascotTextureKey).setScale(0.24).setDepth(23);
    this.tweens.add({
      targets: this.mascot,
      y: this.isWin ? 140 : 172,
      angle: this.isWin ? 8 : -6,
      duration: this.isWin ? 720 : 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
}
Object.assign(__bundle, { ResultScene });
}

// main.js
{
const { GAME_CONFIG, StartScene, MapSelectScene, MatchSetupScene, GameScene, ResultScene } = __bundle;
const config = {
  type: Phaser.AUTO,
  parent: "game-root",
  width: 1280,
  height: 760,
  backgroundColor: "#09171c",
  pixelArt: false,
  antialias: true,
  scene: [StartScene, MatchSetupScene, MapSelectScene, GameScene, ResultScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

window.ZBBT_CONFIG = GAME_CONFIG;
window.ZBBT_GAME = new Phaser.Game(config);

// 注册 Service Worker（PWA 离线支持）
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(
      (reg) => console.log("[PWA] SW registered:", reg.scope),
      (err) => console.warn("[PWA] SW registration failed:", err)
    );
  });
}
}
})();
