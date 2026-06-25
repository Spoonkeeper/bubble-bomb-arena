import test from "node:test";
import assert from "node:assert/strict";

globalThis.Phaser = {
  Math: {
    Clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
    Between: (min) => min,
    FloatBetween: (min) => min,
    DegToRad: (deg) => (deg * Math.PI) / 180,
  },
  Utils: {
    Array: {
      GetRandom: (items) => items[0],
    },
  },
  Display: {
    Color: {
      IntegerToColor: (value) => ({
        red: (value >> 16) & 255,
        green: (value >> 8) & 255,
        blue: value & 255,
        rgba: "#ffffff",
      }),
      GetColor: (r, g, b) => (r << 16) + (g << 8) + b,
    },
  },
};

const {
  COMBAT_CONFIG,
  HEROES,
  ULTIMATE_CONFIG,
  ENERGY_ORB_CONFIG,
  GAME_CONFIG,
} = await import("../src/config.js");
const { applyDamage, initializeCombatState } = await import("../src/systems/CombatSystem.js");
const { HeroAbilitySystem } = await import("../src/systems/HeroAbilitySystem.js");
const { ItemSystem } = await import("../src/systems/ItemSystem.js");
const { MapSystem } = await import("../src/systems/MapSystem.js");
const { PlayerSystem } = await import("../src/systems/PlayerSystem.js");
const { CombatantRegistry } = await import("../src/multiplayer/CombatantRegistry.js");
const { getHeroDisplay } = await import("../src/uiText.js");
const { WIND_HERO_ASSET_PATHS } = await import("../src/assets/AssetFactory.js");

test("wind hero keeps its mechanics but uses the train leader identity", () => {
  const wind = HEROES.find((hero) => hero.id === "wind");
  const display = getHeroDisplay(wind);

  assert.equal(wind.name, "火车泡泡头头");
  assert.equal(wind.shortName, "火车头头");
  assert.equal(wind.description, "蓝白战甲 / 直接就是撞");
  assert.equal(wind.ultimate.name, "动力全开");
  assert.equal(display.role, "高速冲线，铺设电轨，正面突破封锁");
  assert.equal(display.ultimateSummary, "高速穿越炸弹，沿途留下减速电场。");
  assert.equal(wind.baseStats.speed, 2);
  assert.equal(wind.ultimate.id, "wind-surge");
});

test("train leader exposes four directions and a poster asset", () => {
  assert.deepEqual(Object.keys(WIND_HERO_ASSET_PATHS).sort(), [
    "hero-wind",
    "hero-wind-back",
    "hero-wind-left",
    "hero-wind-poster",
    "hero-wind-right",
  ]);
});

class FakeClock {
  constructor() {
    this.now = 0;
    this.queue = [];
  }

  delayedCall(delay, callback) {
    const event = { at: this.now + delay, callback, cancelled: false };
    this.queue.push(event);
    this.queue.sort((a, b) => a.at - b.at);
    return {
      remove: () => {
        event.cancelled = true;
      },
    };
  }

  advance(delta) {
    this.now += delta;
    while (this.queue.length && this.queue[0].at <= this.now) {
      const event = this.queue.shift();
      if (!event.cancelled) event.callback();
    }
  }
}

function makeSprite(x = 0, y = 0) {
  return {
    x,
    y,
    alpha: 1,
    scale: 1,
    destroyed: false,
    setDepth() {
      return this;
    },
    setScale(scale) {
      this.scale = scale;
      return this;
    },
    setAlpha(alpha) {
      this.alpha = alpha;
      return this;
    },
    setTint() {
      return this;
    },
    clearTint() {
      return this;
    },
    setOrigin() {
      return this;
    },
    setInteractive() {
      return this;
    },
    setStrokeStyle() {
      return this;
    },
    setFillStyle() {
      return this;
    },
    setBlendMode() {
      return this;
    },
    setVisible() {
      return this;
    },
    setPosition(x, y) {
      this.x = x;
      this.y = y;
      return this;
    },
    destroy() {
      this.destroyed = true;
    },
  };
}

function makeGraphics() {
  return {
    clear() {
      return this;
    },
    fillStyle() {
      return this;
    },
    lineStyle() {
      return this;
    },
    fillCircle() {
      return this;
    },
    strokeCircle() {
      return this;
    },
    fillEllipse() {
      return this;
    },
    strokeEllipse() {
      return this;
    },
    beginPath() {
      return this;
    },
    moveTo() {
      return this;
    },
    lineTo() {
      return this;
    },
    strokePath() {
      return this;
    },
    fillRoundedRect() {
      return this;
    },
    strokeRoundedRect() {
      return this;
    },
    setDepth() {
      return this;
    },
    setVisible() {
      return this;
    },
    destroy() {},
  };
}

function createScene() {
  const clock = new FakeClock();
  return {
    time: clock,
    add: {
      image: (x, y) => makeSprite(x, y),
      circle: (x, y) => makeSprite(x, y),
      ellipse: (x, y) => makeSprite(x, y),
      rectangle: (x, y) => makeSprite(x, y),
      text: (x, y) => makeSprite(x, y),
      graphics: () => makeGraphics(),
      group: () => ({ add() {} }),
    },
    tweens: {
      add() {},
      killTweensOf() {},
    },
    events: {
      handlers: new Map(),
      on(name, handler) {
        const list = this.handlers.get(name) || [];
        list.push(handler);
        this.handlers.set(name, list);
      },
      emit(name, payload) {
        const list = this.handlers.get(name) || [];
        list.forEach((handler) => handler(payload));
      },
    },
  };
}

function createPlayer(scene, heroId) {
  const hero = HEROES.find((item) => item.id === heroId);
  return initializeCombatState({
    scene,
    hero,
    ownerId: "player",
    sprite: makeSprite(388, 318),
    stats: { ...hero.baseStats },
    alive: true,
    invulnerableUntil: 0,
    currentCell() {
      return { col: 1, row: 1 };
    },
  }, 0);
}

function createDamageAI(scene, enemies) {
  return {
    enemies,
    aliveCount: () => enemies.filter((enemy) => enemy.alive).length,
    damageEnemy(enemy, amount, reason) {
      const result = applyDamage(enemy, amount, reason, scene);
      if (result.defeated) enemy.alive = false;
      return result;
    },
    defeatEnemy(enemy) {
      enemy.alive = false;
    },
    currentCell(enemy) {
      return { col: Math.round((enemy.sprite.x - 348) / GAME_CONFIG.TILE_SIZE), row: 1 };
    },
  };
}

test("hero config exposes base stats and ultimate metadata", () => {
  assert.equal(ULTIMATE_CONFIG.fullChargeMs, 15000);
  assert.equal(ENERGY_ORB_CONFIG.spawnIntervalMs, 5000);
  assert.equal(ENERGY_ORB_CONFIG.chargeAmount, 50);

  const shadow = HEROES.find((hero) => hero.id === "shadow");
  const ember = HEROES.find((hero) => hero.id === "ember");
  const volt = HEROES.find((hero) => hero.id === "volt");
  const wind = HEROES.find((hero) => hero.id === "wind");

  assert.deepEqual(shadow.baseStats, { speed: 1, maxBombs: 1, blastRange: 3, shield: 0 });
  assert.deepEqual(ember.baseStats, { speed: 1, maxBombs: 2, blastRange: 2, shield: 0 });
  assert.deepEqual(volt.baseStats, { speed: 1, maxBombs: 1, blastRange: 2, shield: 1 });
  assert.deepEqual(wind.baseStats, { speed: 2, maxBombs: 1, blastRange: 1, shield: 0 });

  assert.equal(shadow.ultimate.id, "shadow-phase");
  assert.equal(ember.ultimate.id, "ember-aura");
  assert.equal(ember.ultimate.radiusTiles, 3.5);
  assert.equal(volt.ultimate.id, "volt-guard");
  assert.equal(volt.ultimate.durationMs, 5000);
  assert.equal(wind.ultimate.id, "wind-surge");
});

test("four hero ultimates expose distinct balanced combat profiles", () => {
  const shadow = HEROES.find((hero) => hero.id === "shadow");
  const ember = HEROES.find((hero) => hero.id === "ember");
  const volt = HEROES.find((hero) => hero.id === "volt");
  const wind = HEROES.find((hero) => hero.id === "wind");

  assert.equal(shadow.ultimate.durationMs, 4500);
  assert.equal(COMBAT_CONFIG.shadowBeamDamage, 22);
  assert.equal(COMBAT_CONFIG.shadowBeamRadiusTiles, 3.5);
  assert.equal(COMBAT_CONFIG.shadowSlowMultiplier, 0.75);
  assert.equal(ember.ultimate.durationMs, 9000);
  assert.equal(COMBAT_CONFIG.emberRadiusTiles, 3.5);
  assert.equal(COMBAT_CONFIG.emberDamagePerSecond, 14);
  assert.equal(volt.ultimate.durationMs, 5000);
  assert.equal(COMBAT_CONFIG.voltMeteorDamage, 35);
  assert.equal(COMBAT_CONFIG.voltMeteorIntervalMs, 1200);
  assert.equal(wind.ultimate.durationMs, 4500);
  assert.equal(COMBAT_CONFIG.windSpeedMultiplier, 3);
  assert.equal(COMBAT_CONFIG.windTrailDamage, 8);
  assert.equal(COMBAT_CONFIG.windSlowMultiplier, 0.78);
});

test("hero ability system charges, activates, and clears energy", () => {
  const scene = createScene();
  const player = createPlayer(scene, "shadow");
  const ai = { enemies: [], aliveCount: () => 0, defeatEnemy() {} };
  const abilities = new HeroAbilitySystem(scene, null, player, ai);

  abilities.update(0, 7500);
  assert.equal(Math.round(abilities.energy), 50);
  abilities.update(7500, 7500);
  assert.equal(abilities.isReady(), true);

  const activated = abilities.tryActivate(15000);
  assert.equal(activated, true);
  assert.equal(abilities.energy, 0);
  assert.equal(abilities.isActive(), true);
});

test("ultimate charge stays paused while an ultimate is active", () => {
  const scene = createScene();
  const player = createPlayer(scene, "wind");
  const ai = { enemies: [], aliveCount: () => 0, defeatEnemy() {} };
  const abilities = new HeroAbilitySystem(scene, null, player, ai);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  abilities.update(0, 3000);
  assert.equal(abilities.energy, 0);
});

test("shadow ultimate phases through walls and bombs for 4.5 seconds", () => {
  const scene = createScene();
  const player = createPlayer(scene, "shadow");
  const ai = { enemies: [], aliveCount: () => 0, defeatEnemy() {} };
  const abilities = new HeroAbilitySystem(scene, null, player, ai);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  assert.deepEqual(abilities.movementModifiers(), { phaseWalls: true, phaseBombs: true, speedMultiplier: 1, speedBonus: 1.5 });

  abilities.update(0, 4500);
  assert.equal(abilities.isActive(), false);
  assert.deepEqual(abilities.movementModifiers(), { phaseWalls: false, phaseBombs: false, speedMultiplier: 1, speedBonus: 0 });
});

test("wind ultimate uses 3x move speed for 4.5 seconds", () => {
  const scene = createScene();
  const player = createPlayer(scene, "wind");
  const ai = { enemies: [], aliveCount: () => 0, defeatEnemy() {} };
  const abilities = new HeroAbilitySystem(scene, null, player, ai);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  assert.equal(abilities.movementModifiers().speedMultiplier, 3);
  assert.equal(abilities.movementModifiers().phaseBombs, true);

  abilities.update(0, 4500);
  assert.equal(abilities.movementModifiers().speedMultiplier, 1);
  assert.equal(abilities.movementModifiers().phaseBombs, false);
});

test("volt ultimate grants five seconds of full invulnerability", () => {
  const scene = createScene();
  const player = new PlayerSystem(scene, {}, { activeCount: () => 0 }, {}, "volt");
  player.sprite = makeSprite(388, 318);
  player.alive = true;
  player.invulnerableUntil = 0;
  player.hp = 35;
  player.stats.shield = 0;
  scene.time.now = 0;

  const ai = { enemies: [], aliveCount: () => 0, defeatEnemy() {} };
  const abilities = new HeroAbilitySystem(scene, null, player, ai);
  player.setAbilitySystem(abilities);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  assert.equal(player.hp, 100);

  scene.time.now = 1000;
  player.hitByExplosion();
  assert.equal(player.alive, true);
  assert.equal(player.hp, 100);
  assert.equal(player.stats.shield, 0);
  assert.equal(abilities.isActive(), true);

  scene.time.now = 4900;
  player.hitByExplosion();
  assert.equal(player.alive, true);
  assert.equal(player.hp, 100);
  assert.equal(abilities.isActive(), true);

  abilities.update(4900, 100);
  assert.equal(abilities.isActive(), false);
  scene.time.now = 5100;
  player.hitByExplosion();
  assert.equal(player.alive, true);
  assert.equal(player.hp, 30);
  scene.time.now = 5200;
  player.hitByExplosion();
  assert.equal(player.alive, false);
});

test("ember ultimate deals 14 damage per second inside a 3.5 tile radius", () => {
  const scene = createScene();
  const player = createPlayer(scene, "ember");
  const enemy = initializeCombatState({
    ownerId: "enemy-0",
    alive: true,
    sprite: makeSprite(player.sprite.x + GAME_CONFIG.TILE_SIZE * 2 - 4, player.sprite.y),
    stats: { shield: 0 },
  });
  const ai = createDamageAI(scene, [enemy]);
  const abilities = new HeroAbilitySystem(scene, null, player, ai);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  abilities.update(0, 1000);
  assert.equal(enemy.hp, 86);
  assert.equal(enemy.alive, true);

  enemy.sprite.x = player.sprite.x + GAME_CONFIG.TILE_SIZE * 4 + 2;
  abilities.update(1000, 1000);
  assert.equal(enemy.hp, 80);
});

test("ember afterburn deals 6 damage per second for 2.5 seconds after leaving", () => {
  const scene = createScene();
  const player = createPlayer(scene, "ember");
  const enemy = initializeCombatState({
    ownerId: "enemy-0",
    alive: true,
    sprite: makeSprite(player.sprite.x + 30, player.sprite.y),
    stats: { shield: 0 },
  });
  const ai = createDamageAI(scene, [enemy]);
  const abilities = new HeroAbilitySystem(scene, null, player, ai);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  abilities.update(0, 1000);
  assert.equal(enemy.hp, 86);

  enemy.sprite.x = player.sprite.x + GAME_CONFIG.TILE_SIZE * 6;
  abilities.update(1000, 1000);
  assert.equal(Math.round(enemy.hp), 80);
  abilities.update(2000, 1000);
  assert.equal(Math.round(enemy.hp), 74);
  abilities.update(3000, 1000);
  assert.equal(Math.round(enemy.hp), 71);
  abilities.update(4000, 1000);
  assert.equal(enemy.alive, true);
  assert.equal(Math.round(enemy.hp), 71);
});

test("shadow beam damages actors in a circular pulse and waits for the previous beam to finish", () => {
  const scene = createScene();
  const player = createPlayer(scene, "shadow");
  player.facing = "right";
  const frontEnemy = initializeCombatState({
    ownerId: "enemy-front",
    alive: true,
    sprite: makeSprite(player.sprite.x + GAME_CONFIG.TILE_SIZE * 3, player.sprite.y),
    stats: { shield: 0 },
  });
  const rearEnemy = initializeCombatState({
    ownerId: "enemy-rear",
    alive: true,
    sprite: makeSprite(player.sprite.x - GAME_CONFIG.TILE_SIZE * 3, player.sprite.y),
    stats: { shield: 0 },
  });
  const sideEnemy = initializeCombatState({
    ownerId: "enemy-side",
    alive: true,
    sprite: makeSprite(player.sprite.x, player.sprite.y - GAME_CONFIG.TILE_SIZE * 4),
    stats: { shield: 0 },
  });
  const farEnemy = initializeCombatState({
    ownerId: "enemy-far",
    alive: true,
    sprite: makeSprite(player.sprite.x + GAME_CONFIG.TILE_SIZE * 5, player.sprite.y),
    stats: { shield: 0 },
  });
  const ai = createDamageAI(scene, [frontEnemy, rearEnemy, sideEnemy, farEnemy]);
  const abilities = new HeroAbilitySystem(scene, null, player, ai);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  assert.equal(abilities.tryFireShadowBeam(100), true);
  abilities.update(100, 800);
  assert.equal(frontEnemy.hp, 78);
  assert.equal(frontEnemy.slowMultiplier, 0.75);
  assert.equal(frontEnemy.slowUntil, 2500);
  assert.equal(rearEnemy.hp, 78);
  assert.equal(sideEnemy.hp, 100);
  assert.equal(farEnemy.hp, 100);
  assert.equal(abilities.tryFireShadowBeam(500), false);

  abilities.update(1001, 1);
  assert.equal(abilities.tryFireShadowBeam(1100), true);
});

test("hero abilities damage another registered player but never the caster", () => {
  const scene = createScene();
  const player = createPlayer(scene, "shadow");
  player.ownerId = "player-1";
  const opponent = createPlayer(scene, "ember");
  opponent.ownerId = "player-2";
  opponent.sprite.x = player.sprite.x + GAME_CONFIG.TILE_SIZE * 2;
  opponent.takeDamage = (amount, reason) => {
    const result = applyDamage(opponent, amount, reason, scene);
    if (result.defeated) opponent.alive = false;
    return result;
  };
  const registry = new CombatantRegistry();
  registry.register(player, { kind: "player", slot: 1 });
  registry.register(opponent, { kind: "player", slot: 2 });
  const abilities = new HeroAbilitySystem(scene, null, player, createDamageAI(scene, []), registry);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  abilities.tryFireShadowBeam(100);
  abilities.update(100, 800);

  assert.equal(player.hp, 100);
  assert.equal(opponent.hp, 78);
});

test("wind ultimate leaves lightning trail that damages and slows enemies", () => {
  const scene = createScene();
  const player = createPlayer(scene, "wind");
  const enemy = initializeCombatState({
    ownerId: "enemy-0",
    alive: true,
    sprite: makeSprite(player.sprite.x + 8, player.sprite.y),
    stats: { shield: 0 },
  });
  const ai = createDamageAI(scene, [enemy]);
  const abilities = new HeroAbilitySystem(scene, null, player, ai);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  player.sprite.x += GAME_CONFIG.TILE_SIZE;
  abilities.update(0, 100);
  assert.equal(abilities.windTrails.length > 0, true);
  enemy.sprite.x = abilities.windTrails[0].x;
  enemy.sprite.y = abilities.windTrails[0].y;

  abilities.update(100, 100);
  assert.equal(enemy.hp, 92);
  assert.equal(enemy.slowMultiplier, 0.78);
  abilities.update(599, 100);
  assert.equal(enemy.hp, 92);
  abilities.update(700, 100);
  assert.equal(enemy.hp, 84);

  enemy.sprite.x = player.sprite.x + GAME_CONFIG.TILE_SIZE * 6;
  abilities.update(700, 100);
  assert.equal(enemy.slowMultiplier, 1);

  abilities.update(2700, 100);
  assert.equal(abilities.windTrails.length, 0);
});

test("wind trail merges repeated samples in the same tile instead of stacking hazards", () => {
  const scene = createScene();
  const player = createPlayer(scene, "wind");
  const map = {
    worldToCell: (x, y) => ({
      col: Math.floor(x / GAME_CONFIG.TILE_SIZE),
      row: Math.floor(y / GAME_CONFIG.TILE_SIZE),
    }),
  };
  const abilities = new HeroAbilitySystem(scene, map, player, createDamageAI(scene, []));

  player.sprite.x = 100;
  player.sprite.y = 100;
  abilities.captureWindTrailSample(0);
  abilities.lastWindTrailSample = null;
  player.sprite.x = 110;
  abilities.captureWindTrailSample(200);

  assert.equal(abilities.windTrails.length, 1);
  assert.equal(abilities.windTrails[0].expiresAt, 200 + COMBAT_CONFIG.windTrailDurationMs);
});

test("shadow space action fires the pulse and places a bomb together", () => {
  const scene = createScene();
  const map = {
    worldToCell: () => ({ col: 3, row: 4 }),
  };
  let bombsPlaced = 0;
  const bombs = {
    placeBomb(ownerId, col, row) {
      bombsPlaced += 1;
      return { ownerId, col, row };
    },
  };
  const player = new PlayerSystem(scene, map, bombs, {}, "shadow");
  player.sprite = makeSprite(100, 100);
  player.keys = { SPACE: {} };
  let beamsFired = 0;
  player.setAbilitySystem({
    tryFireShadowBeam() {
      beamsFired += 1;
      return true;
    },
    blocksBombPlacement: () => false,
    bombOptions: () => ({}),
  });
  Phaser.Input = { Keyboard: { JustDown: () => true } };

  player.tryPlaceBomb(100);

  assert.equal(beamsFired, 1);
  assert.equal(bombsPlaced, 1);
});

test("volt ultimate schedules green meteors over living enemies every second", () => {
  const scene = createScene();
  const player = createPlayer(scene, "volt");
  const enemyA = initializeCombatState({
    ownerId: "enemy-a",
    alive: true,
    sprite: makeSprite(468, 318),
    stats: { shield: 0 },
  });
  const enemyB = initializeCombatState({
    ownerId: "enemy-b",
    alive: true,
    sprite: makeSprite(508, 318),
    stats: { shield: 0 },
  });
  const ai = createDamageAI(scene, [enemyA, enemyB]);
  ai.currentCell = (enemy) => (enemy === enemyA ? { col: 3, row: 3 } : { col: 4, row: 3 });
  const map = {
    cellToWorld: (col, row) => ({ x: 348 + col * GAME_CONFIG.TILE_SIZE, y: 118 + row * GAME_CONFIG.TILE_SIZE }),
    markExplosion() {},
    clearExplosion() {},
    destroyBox() { return false; },
  };
  const abilities = new HeroAbilitySystem(scene, map, player, ai);

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  abilities.update(0, 100);
  assert.equal(abilities.pendingVoltMeteors.length, 2);
  assert.equal(abilities.pendingVoltMeteors[0].explodeAt, 1300);
  assert.equal(!!abilities.pendingVoltMeteors[0].meteorBody, true);
  assert.equal(abilities.pendingVoltMeteorDangerMap().has("3,3"), true);

  scene.time.advance(1200);
  abilities.update(1200, 100);
  assert.equal(abilities.pendingVoltMeteors.length, 4);

  scene.time.advance(100);
  assert.equal(enemyA.hp, 65);
  assert.equal(enemyB.hp, 65);
});

test("map movement supports phasing through walls and bombs only when requested", () => {
  const scene = createScene();
  scene.textures = { exists: () => false };
  const map = new MapSystem(scene);
  map.create();
  map.cells[1][2] = 1;
  map.placeBomb(2, 1, { ownerId: "enemy-0" });

  const wallWorld = map.cellToWorld(2, 1);
  assert.equal(map.canMoveToWorld(wallWorld.x, wallWorld.y, 13, null, { phaseWalls: false, phaseBombs: false }), false);
  assert.equal(map.canMoveToWorld(wallWorld.x, wallWorld.y, 13, null, { phaseWalls: true, phaseBombs: false }), true);
});

test("actors already overlapping a bomb can move out instead of being body-blocked", () => {
  const scene = createScene();
  scene.textures = { exists: () => false };
  const map = new MapSystem(scene);
  map.create();
  const player = new PlayerSystem(scene, map, { activeCount: () => 0 }, {}, "shadow");
  const start = map.cellToWorld(1, 1);
  player.sprite = makeSprite(start.x, start.y);
  player.alive = true;
  player.cursors = {
    left: { isDown: false },
    right: { isDown: true },
    up: { isDown: false },
    down: { isDown: false },
  };
  player.keys = {
    A: { isDown: false },
    D: { isDown: true },
    W: { isDown: false },
    S: { isDown: false },
  };
  player.abilitySystem = {
    movementModifiers: () => ({ phaseWalls: false, phaseBombs: false, speedMultiplier: 1, speedBonus: 0 }),
  };
  map.placeBomb(1, 1, { ownerId: "enemy-0" });

  player.move(120);
  assert.equal(player.sprite.x > start.x, true);
  assert.equal(player.ignoredBombKey, "1,1");
});

test("shadow phasing still cannot leave the map bounds", () => {
  const scene = createScene();
  const map = new MapSystem(scene);
  map.create();

  const outsideLeft = map.cellToWorld(0, 1);
  assert.equal(
    map.canMoveToWorld(outsideLeft.x - GAME_CONFIG.TILE_SIZE, outsideLeft.y, 13, null, {
      phaseWalls: true,
      phaseBombs: true,
    }),
    false,
  );
});

test("shadow phasing still cannot enter outer boundary walls", () => {
  const scene = createScene();
  const map = new MapSystem(scene);
  map.create();

  const boundaryWall = map.cellToWorld(0, 1);
  assert.equal(
    map.canMoveToWorld(boundaryWall.x, boundaryWall.y, 13, null, {
      phaseWalls: true,
      phaseBombs: true,
    }),
    false,
  );
});

test("shadow ultimate ending ejects the full collision body from a wall edge", () => {
  const scene = createScene();
  scene.textures = { exists: () => false };
  const map = new MapSystem(scene);
  map.create();
  map.cells[1][2] = 1;

  const player = createPlayer(scene, "shadow");
  const safeCell = map.cellToWorld(1, 1);
  player.sprite.setPosition(safeCell.x + GAME_CONFIG.TILE_SIZE / 2 - 4, safeCell.y);
  player.currentCell = () => map.worldToCell(player.sprite.x, player.sprite.y);
  assert.equal(player.currentCell().col, 1);
  assert.equal(map.canMoveToWorld(player.sprite.x, player.sprite.y, 13), false);

  const abilities = new HeroAbilitySystem(scene, map, player, createDamageAI(scene, []));
  abilities.active = true;
  abilities.endUltimate("expired");

  assert.equal(map.canMoveToWorld(player.sprite.x, player.sprite.y, 13), true);
  assert.deepEqual(player.currentCell(), { col: 1, row: 1 });
});

test("energy orbs spawn on schedule, respect limits, and expire", () => {
  const scene = createScene();
  const map = new MapSystem(scene);
  map.create();
  const items = new ItemSystem(scene, map);

  items.update(4999, []);
  assert.equal(items.countEnergyOrbs(), 0);

  items.update(5000, []);
  assert.equal(items.countEnergyOrbs(), 1);

  items.update(10000, []);
  assert.equal(items.countEnergyOrbs(), 2);

  items.update(15000, []);
  assert.equal(items.countEnergyOrbs(), 2);

  scene.time.advance(10000);
  assert.equal(items.countEnergyOrbs(), 0);
});

test("energy orbs avoid occupied cells and do not help enemies", () => {
  const scene = createScene();
  const map = new MapSystem(scene);
  map.create();
  const items = new ItemSystem(scene, map);

  const playerCell = { col: 1, row: 1 };
  const orbCell = items.spawnEnergyOrb([
    {
      alive: true,
      currentCell: () => playerCell,
    },
  ]);

  assert.notDeepEqual(orbCell, playerCell);

  const enemyPickup = items.pickupByActor(orbCell.col, orbCell.row, { ownerId: "enemy-0" });
  assert.equal(enemyPickup, null);
  assert.equal(items.countEnergyOrbs(), 1);
});

test("energy orbs do not charge during an active ultimate and can be collected after it ends", () => {
  const scene = createScene();
  const map = new MapSystem(scene);
  map.create();
  const items = new ItemSystem(scene, map);
  const player = new PlayerSystem(scene, map, { activeCount: () => 0 }, items, "shadow");
  player.sprite = makeSprite(388, 318);
  player.alive = true;
  player.invulnerableUntil = 0;

  const ai = { enemies: [], aliveCount: () => 0, defeatEnemy() {} };
  const abilities = new HeroAbilitySystem(scene, map, player, ai);
  player.setAbilitySystem(abilities);

  items.createItem(1, 1, {
    id: ENERGY_ORB_CONFIG.id,
    label: ENERGY_ORB_CONFIG.label,
    texture: ENERGY_ORB_CONFIG.texture,
    apply(target) {
      target.addEnergy?.(ENERGY_ORB_CONFIG.chargeAmount);
    },
  }, {
    kind: "energy-orb",
    lifetimeMs: ENERGY_ORB_CONFIG.lifetimeMs,
  });

  abilities.addEnergy(100);
  abilities.tryActivate(0);
  const whileActive = items.pickupAt(1, 1, player);
  assert.equal(whileActive, null);
  assert.equal(items.countEnergyOrbs(), 1);
  assert.equal(abilities.energy, 0);

  abilities.update(0, 5000);
  const picked = items.pickupAt(1, 1, player);
  assert.equal(picked.id, ENERGY_ORB_CONFIG.id);
  assert.equal(abilities.energy, 50);
  assert.equal(items.countEnergyOrbs(), 0);
});
