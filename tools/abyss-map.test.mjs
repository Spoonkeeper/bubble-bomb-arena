import test from "node:test";
import assert from "node:assert/strict";

globalThis.Phaser = {
  Math: {
    Between: (min) => min,
    FloatBetween: (min) => min,
  },
  Utils: {
    Array: {
      GetRandom: (items) => items[0],
    },
  },
};

const { CELL, MAPS } = await import("../src/config.js");
const { MapSystem } = await import("../src/systems/MapSystem.js");
const { ItemSystem } = await import("../src/systems/ItemSystem.js");
const { BombSystem } = await import("../src/systems/BombSystem.js");

function makeDisplayObject(x = 0, y = 0) {
  return {
    x,
    y,
    setDepth() { return this; },
    setAlpha() { return this; },
    setScale() { return this; },
    setStrokeStyle() { return this; },
    setBlendMode() { return this; },
    destroy() {},
  };
}

function createScene() {
  return {
    time: {
      now: 0,
      delayedCall() { return { remove() {} }; },
    },
    add: {
      image: (x, y) => makeDisplayObject(x, y),
      group: () => ({ add() {} }),
    },
    tweens: {
      add() { return {}; },
      killTweensOf() {},
    },
    events: { emit() {} },
  };
}

test("abyss map exposes portal and orb-field configuration", () => {
  const abyss = MAPS.find((map) => map.id === "abyss");
  assert.ok(abyss);
  assert.equal(abyss.layout, "abyss");
  assert.equal(abyss.portal.channelMs, 1000);
  assert.equal(abyss.portal.openMs, 3000);
  assert.equal(abyss.portal.cooldownMs, 5000);
  assert.equal(abyss.orbField.spawnIntervalMs, 4000);
  assert.equal(abyss.orbField.maxActive, 4);
  assert.equal(abyss.orbField.lifetimeMs, 9000);
});

test("abyss map contains only empty interior cells and solid boundary walls", () => {
  const map = new MapSystem(createScene(), "abyss");
  map.create();

  for (let row = 0; row < map.cells.length; row += 1) {
    for (let col = 0; col < map.cells[row].length; col += 1) {
      const boundary = row === 0 || col === 0 || row === 12 || col === 14;
      assert.equal(map.getCell(col, row), boundary ? CELL.SOLID_WALL : CELL.EMPTY);
    }
  }
});

test("abyss orb field uses map-specific timing, textures, and excludes portal cells", () => {
  const scene = createScene();
  const map = new MapSystem(scene, "abyss");
  map.create();
  const items = new ItemSystem(scene, map);

  assert.equal(items.spawnConfig.spawnIntervalMs, 4000);
  assert.equal(items.spawnConfig.maxActive, 4);
  assert.equal(items.canSpawnEnergyOrbAt(1, 6, []), false);
  assert.equal(items.canSpawnEnergyOrbAt(7, 1, []), false);

  const created = items.createMapOrb({ col: 3, row: 3 }, "speed");
  assert.equal(created.type.id, "speed");
  assert.equal(created.type.texture, "abyss-orb-speed");
  assert.equal(created.kind, "map-orb");
});

test("abyss black-hole bomb rotates in place without directional travel", () => {
  const tweenCalls = [];
  const scene = createScene();
  scene.tweens.add = (config) => {
    tweenCalls.push(config);
    return config;
  };
  scene.time.delayedCall = () => ({ remove() {} });
  const map = new MapSystem(scene, "abyss");
  map.create();
  const bombs = new BombSystem(scene, map);
  const bomb = bombs.placeBomb("player-1", 3, 3, 2, 1);

  assert.ok(bomb);
  const rotation = tweenCalls.find((config) => config.angle === 360);
  assert.ok(rotation);
  assert.equal(rotation.repeat, -1);
  assert.equal("x" in rotation, false);
  assert.equal("y" in rotation, false);
});
