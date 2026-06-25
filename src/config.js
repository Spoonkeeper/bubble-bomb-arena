export const GAME_CONFIG = {
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

export const ULTIMATE_CONFIG = {
  fullChargeMs: 15000,
};

export const COMBAT_CONFIG = {
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

export const ENERGY_ORB_CONFIG = {
  id: "energy-orb",
  label: "能量球",
  texture: "item-energy-orb",
  chargeAmount: 50,
  spawnIntervalMs: 5000,
  maxActive: 2,
  lifetimeMs: 10000,
};

export const CELL = {
  EMPTY: 0,
  SOLID_WALL: 1,
  BREAKABLE_BOX: 2,
};

export const MAPS = [
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

export function getMapConfig(mapId = "inferno") {
  return MAPS.find((map) => map.id === mapId) || MAPS[0];
}

export const ITEM_TYPES = [
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

export const HEROES = [
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

export const MENU_THEME = {
  slogan: "一节更比六节强",
  mascotSourceKey: "menu-kid-source",
  mascotSourcePath: "assets/menu-kid-source.jpg",
  mascotTextureKey: "menu-kid-mascot",
};

export const ENEMY_TYPES = [
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

export const SPAWN_POINTS = {
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
