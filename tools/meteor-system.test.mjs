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
};

const { CELL, COMBAT_CONFIG } = await import("../src/config.js");
const { applyDamage, initializeCombatState } = await import("../src/systems/CombatSystem.js");
const { MapSystem } = await import("../src/systems/MapSystem.js");
const { MeteorSystem } = await import("../src/systems/MeteorSystem.js");

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
    destroyed: false,
    setDepth() { return this; },
    setScale() { return this; },
    setAlpha() { return this; },
    destroy() { this.destroyed = true; },
  };
}

function makeGraphics() {
  return {
    destroyed: false,
    clear() { return this; },
    fillStyle() { return this; },
    lineStyle() { return this; },
    fillCircle() { return this; },
    strokeCircle() { return this; },
    fillEllipse() { return this; },
    strokeRoundedRect() { return this; },
    fillRoundedRect() { return this; },
    beginPath() { return this; },
    moveTo() { return this; },
    lineTo() { return this; },
    strokePath() { return this; },
    generateTexture() { return this; },
    setDepth() { return this; },
    destroy() { this.destroyed = true; },
  };
}

function createDamagePlayer(cell = { col: 3, row: 3 }) {
  const player = initializeCombatState({
    ownerId: "player",
    alive: true,
    stats: { shield: 0 },
    sprite: makeSprite(),
    currentCell: () => cell,
  });
  player.takeDamage = (amount, reason) => {
    const result = applyDamage(player, amount, reason, { time: { now: 0 }, events: { emit() {} } });
    if (result.defeated) player.alive = false;
    return result;
  };
  return player;
}

function createScene() {
  const clock = new FakeClock();
  const tweenCalls = [];
  return {
    time: clock,
    tweenCalls,
    add: {
      image: (x, y) => makeSprite(x, y),
      graphics: () => makeGraphics(),
      group: () => ({ add() {} }),
    },
    tweens: {
      add(config) {
        tweenCalls.push(config);
      },
      killTweensOf() {},
    },
  };
}

test("meteor fall position accelerates downward toward impact", () => {
  const start = { x: 100, y: -180 };
  const target = { x: 140, y: 220 };
  const first = MeteorSystem.fallPosition(start, target, 0.25);
  const second = MeteorSystem.fallPosition(start, target, 0.5);
  const third = MeteorSystem.fallPosition(start, target, 0.75);

  assert.equal(first.y - start.y < second.y - first.y, true);
  assert.equal(second.y - first.y < third.y - second.y, true);
  assert.equal(third.x > first.x, true);
});

test("homeland meteor targets valid cells only", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "homeland");
  map.create();
  map.placeBomb(1, 2, {});
  const items = { items: new Map([["2,1", {}]]), removeAt() {}, maybeDrop() {} };
  const player = { alive: true, currentCell: () => ({ col: 1, row: 1 }), hitByExplosion() {} };
  const ai = { enemies: [], currentCell() {}, defeatEnemy() {} };
  const meteors = new MeteorSystem(scene, map, player, ai, items);

  assert.equal(meteors.canTargetCell(0, 1), false);
  assert.equal(meteors.canTargetCell(1, 2), false);
  assert.equal(meteors.canTargetCell(2, 1), false);

  const picked = meteors.pickMeteorCells(3);
  assert.equal(picked.length, 3);
  picked.forEach((cell) => {
    assert.notEqual(map.getCell(cell.col, cell.row), CELL.SOLID_WALL);
    assert.equal(map.hasBomb(cell.col, cell.row), false);
  });
});

test("meteor impact destroys boxes and deals 50 damage to enemies", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "homeland");
  map.create();
  map.cells[3][3] = CELL.BREAKABLE_BOX;
  const items = { items: new Map(), removeAt() {}, maybeDropCalled: false, maybeDrop() { this.maybeDropCalled = true; } };
  const player = { alive: true, currentCell: () => ({ col: 1, row: 1 }), hitByExplosion() {} };
  const enemy = initializeCombatState({ alive: true, sprite: map.cellToWorld(3, 3), stats: { shield: 0 } });
  const ai = {
    enemies: [enemy],
    currentCell: () => ({ col: 3, row: 3 }),
    damageEnemy(target, amount, reason) {
      target.reason = reason;
      const result = applyDamage(target, amount, reason, scene);
      if (result.defeated) target.alive = false;
      return result;
    },
  };
  const meteors = new MeteorSystem(scene, map, player, ai, items);

  meteors.impact({ col: 3, row: 3, warning: makeGraphics() });
  assert.equal(map.getCell(3, 3), CELL.EMPTY);
  assert.equal(enemy.alive, true);
  assert.equal(enemy.hp, COMBAT_CONFIG.maxHp - COMBAT_CONFIG.meteorDamage);
  assert.equal(enemy.reason, "meteor");
  scene.time.advance(meteors.config.impactMs + 20);
  assert.equal(items.maybeDropCalled, true);
});

test("active meteor impact only damages the same player once", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "homeland");
  map.create();
  const items = { items: new Map(), removeAt() {}, maybeDrop() {} };
  const player = createDamagePlayer({ col: 3, row: 3 });
  const ai = { enemies: [], currentCell() {}, damageEnemy() {} };
  const meteors = new MeteorSystem(scene, map, player, ai, items);

  meteors.impact({ col: 3, row: 3, warning: makeGraphics(), meteorBody: makeGraphics() });
  assert.equal(player.hp, 50);
  meteors.checkImpactHits();
  meteors.update(100);
  assert.equal(player.hp, 50);
});

test("meteor impact vanishes in place instead of expanding after landing", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "homeland");
  map.create();
  const items = { items: new Map(), removeAt() {}, maybeDrop() {} };
  const player = { alive: true, currentCell: () => ({ col: 1, row: 1 }), hitByExplosion() {} };
  const ai = { enemies: [], currentCell() {}, defeatEnemy() {} };
  const meteors = new MeteorSystem(scene, map, player, ai, items);

  meteors.impact({ col: 3, row: 3, warning: makeGraphics(), meteorBody: makeGraphics() });
  const impactTween = scene.tweenCalls.at(-1);

  assert.equal("scaleX" in impactTween, false);
  assert.equal("scaleY" in impactTween, false);
  assert.equal(impactTween.duration <= 180, true);
});
