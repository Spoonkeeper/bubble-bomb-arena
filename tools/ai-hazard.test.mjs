import test from "node:test";
import assert from "node:assert/strict";

globalThis.Phaser = {
  Math: {
    Between: (min) => min,
    Clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
  },
};

const { MapSystem } = await import("../src/systems/MapSystem.js");
const { AISystem } = await import("../src/systems/AISystem.js");

function makeSprite(x = 0, y = 0) {
  return {
    x,
    y,
    destroyed: false,
    setDepth() {
      return this;
    },
    destroy() {
      this.destroyed = true;
    },
  };
}

function makeGraphics() {
  return {
    clear() { return this; },
    fillStyle() { return this; },
    lineStyle() { return this; },
    fillCircle() { return this; },
    strokeCircle() { return this; },
    fillRect() { return this; },
    strokeRect() { return this; },
    fillRoundedRect() { return this; },
    strokeRoundedRect() { return this; },
    beginPath() { return this; },
    moveTo() { return this; },
    lineTo() { return this; },
    strokePath() { return this; },
    generateTexture() { return this; },
    setDepth() { return this; },
    destroy() {},
  };
}

function createScene() {
  return {
    time: { now: 0, delayedCall() {} },
    add: {
      image: (x, y) => makeSprite(x, y),
      graphics: () => makeGraphics(),
      group: () => ({ add() {} }),
    },
    tweens: {
      add() {},
      killTweensOf() {},
    },
    events: {
      emit() {},
    },
  };
}

function createAISystem(scene, map) {
  const bombSystem = {
    predictedDangerMap: () => new Map(),
    predictedDangerCells: () => new Set(),
    activeCount: () => 99,
    placeBomb: () => null,
  };
  const player = {
    alive: false,
    currentCell: () => ({ col: 1, row: 1 }),
  };
  const items = {
    pickupByActor: () => null,
    nearest: () => null,
  };
  return new AISystem(scene, map, bombSystem, player, items);
}

function addEnemy(ai, map, col, row) {
  const world = map.cellToWorld(col, row);
  const enemy = {
    ownerId: "enemy-0",
    sprite: makeSprite(world.x, world.y),
    direction: { col: 0, row: 0 },
    directionTimer: 0,
    mode: "scout",
    baseSpeed: 80,
    alive: true,
    stats: { speed: 1, maxBombs: 1, blastRange: 2, shield: 0 },
    bombCooldown: 999999,
    ignoredBombKey: null,
    fleeBombKey: null,
    fleeBombUntil: 0,
    escapeUntil: 0,
    invulnerableUntil: 0,
  };
  ai.enemies.push(enemy);
  return enemy;
}

test("AI flees a pending meteor before it lands", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "homeland");
  map.create();
  const ai = createAISystem(scene, map);
  const enemy = addEnemy(ai, map, 5, 5);
  ai.meteorSystem = {
    pendingDangerMap: () => new Map([["5,5", { explodeAt: 1600, kind: "meteor" }]]),
  };

  ai.update(0, 16);

  assert.equal(enemy.mode, "flee");
  assert.notDeepEqual(enemy.direction, { col: 0, row: 0 });
});

test("AI leaves ember aura before burn time reaches lethal duration", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "homeland");
  map.create();
  const ai = createAISystem(scene, map);
  const enemy = addEnemy(ai, map, 7, 6);
  ai.heroAbilitySystem = {
    emberThreatFor: () => ({
      inside: true,
      elapsedMs: 4200,
      sourceCell: { col: 7, row: 7 },
      radiusTiles: 5,
    }),
    isCellInsideEmberAura: (cell) => Math.abs(cell.col - 7) + Math.abs(cell.row - 7) <= 5,
  };

  ai.update(0, 16);

  assert.equal(enemy.mode, "ember-flee");
  assert.notDeepEqual(enemy.direction, { col: 0, row: 0 });
});

test("AI flees wind lightning trail cells", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "homeland");
  map.create();
  const ai = createAISystem(scene, map);
  const enemy = addEnemy(ai, map, 6, 6);
  ai.heroAbilitySystem = {
    emberThreatFor: () => ({ inside: false }),
    shadowBeamThreatFor: () => ({ inside: false }),
    windThreatFor: () => ({ inside: true }),
    isCellInsideShadowBeam: () => false,
    isCellInsideWindThreat: (cell) => cell.col === 6 && cell.row === 6,
  };

  ai.update(0, 16);

  assert.equal(enemy.mode, "skill-flee");
  assert.notDeepEqual(enemy.direction, { col: 0, row: 0 });
});

test("AI treats volt green meteor warnings as meteor danger", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "homeland");
  map.create();
  const ai = createAISystem(scene, map);
  const enemy = addEnemy(ai, map, 5, 5);
  ai.heroAbilitySystem = {
    pendingVoltMeteorDangerMap: () => new Map([["5,5", { explodeAt: 1600, kind: "volt-meteor" }]]),
  };

  ai.update(0, 16);

  assert.equal(enemy.mode, "flee");
  assert.notDeepEqual(enemy.direction, { col: 0, row: 0 });
});

test("AI does not route through a portal whose exit is inside a hero skill hazard", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "abyss");
  map.create();
  const ai = createAISystem(scene, map);
  ai.setPortalSystem({
    groupForCell: (cell) => (cell.col === 1 && cell.row === 6 ? { id: "horizontal" } : null),
    pairedDestination: () => ({ col: 13, row: 6 }),
    canPlanThrough: () => true,
    isDestinationSafe: () => true,
  });
  ai.setHeroAbilitySystem({
    isCellInsideEmberAura: (cell) => cell.col === 13 && cell.row === 6,
    isCellInsideShadowBeam: () => false,
    isCellInsideWindThreat: () => false,
  });

  const direction = ai.findStep(
    { col: 2, row: 6 },
    (cell) => cell.col === 12 && cell.row === 6,
    new Set(),
    null,
    20,
  );

  assert.deepEqual(direction, { col: 1, row: 0 });
});
