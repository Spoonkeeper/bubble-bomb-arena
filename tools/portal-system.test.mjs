import test from "node:test";
import assert from "node:assert/strict";

globalThis.Phaser = {
  Math: {
    Clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
  },
};

const { PortalSystem } = await import("../src/systems/PortalSystem.js");

function displayObject(x = 0, y = 0) {
  return {
    x,
    y,
    alpha: 1,
    scale: 1,
    setDepth() { return this; },
    setAlpha(value) { this.alpha = value; return this; },
    setScale(value) { this.scale = value; return this; },
    setStrokeStyle() { return this; },
    setFillStyle() { return this; },
    setBlendMode() { return this; },
    setVisible() { return this; },
    setText() { return this; },
    destroy() { this.destroyed = true; },
  };
}

function createHarness() {
  const scene = {
    time: { now: 0 },
    add: {
      image: (x, y) => displayObject(x, y),
      circle: (x, y) => displayObject(x, y),
      rectangle: (x, y) => displayObject(x, y),
      text: (x, y) => displayObject(x, y),
      graphics: () => ({
        clear() { return this; },
        fillStyle() { return this; },
        lineStyle() { return this; },
        fillCircle() { return this; },
        strokeCircle() { return this; },
        beginPath() { return this; },
        arc() { return this; },
        strokePath() { return this; },
        setDepth() { return this; },
        destroy() {},
      }),
    },
    tweens: {
      add() { return {}; },
      killTweensOf() {},
    },
  };
  const map = {
    mapConfig: {
      id: "abyss",
      portal: { enabled: true, channelMs: 1000, openMs: 3000, cooldownMs: 5000 },
      textures: {
        portalHorizontal: "abyss-portal-purple",
        portalVertical: "abyss-portal-gold",
      },
    },
    cellToWorld(col, row) { return { x: col * 40 + 20, y: row * 40 + 20 }; },
    worldToCell(x, y) { return { col: Math.floor(x / 40), row: Math.floor(y / 40) }; },
    hasBomb() { return false; },
    hasExplosionAt() { return false; },
  };
  const actor = {
    ownerId: "player-1",
    alive: true,
    sprite: displayObject(60, 260),
    currentCell() { return map.worldToCell(this.sprite.x, this.sprite.y); },
  };
  const registry = { all: () => [actor] };
  const portals = new PortalSystem(scene, map, registry);
  portals.create();
  return { scene, map, actor, portals };
}

test("portal channels for one second, opens for three seconds, then cools for five", () => {
  const { actor, portals } = createHarness();

  portals.update(0, 0);
  portals.update(999, 999);
  assert.equal(portals.groupState("horizontal"), "charging");

  portals.update(1000, 1);
  assert.equal(portals.groupState("horizontal"), "open");
  assert.deepEqual(actor.currentCell(), { col: 13, row: 6 });

  portals.update(3999, 2999);
  assert.equal(portals.groupState("horizontal"), "open");
  portals.update(4000, 1);
  assert.equal(portals.groupState("horizontal"), "cooldown");
  portals.update(8999, 4999);
  assert.equal(portals.groupState("horizontal"), "cooldown");
  portals.update(9000, 1);
  assert.equal(portals.groupState("horizontal"), "idle");
});

test("an actor teleports only once during the same open window", () => {
  const { actor, portals } = createHarness();
  portals.update(0, 0);
  portals.update(1000, 1000);
  assert.deepEqual(actor.currentCell(), { col: 13, row: 6 });

  portals.update(1200, 200);
  assert.deepEqual(actor.currentCell(), { col: 13, row: 6 });
});
