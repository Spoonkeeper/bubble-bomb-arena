import test from "node:test";
import assert from "node:assert/strict";

globalThis.Phaser = {
  Math: {
    Clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
  },
};

const { ExplosionSystem } = await import("../src/systems/ExplosionSystem.js");
const { CombatantRegistry } = await import("../src/multiplayer/CombatantRegistry.js");

function keyOf(col, row) {
  return `${col},${row}`;
}

function createScene() {
  return {
    add: {
      image: () => ({
        setDepth() { return this; },
        setScale() { return this; },
        setAlpha() { return this; },
        destroy() { this.destroyed = true; },
      }),
    },
    tweens: { add() {} },
    time: { delayedCall() {} },
  };
}

function createMap() {
  const explosions = new Set();
  return {
    getCell() { return 0; },
    cellToWorld(col, row) { return { x: col * 40 + 20, y: row * 40 + 20 }; },
    markExplosion(col, row) { explosions.add(keyOf(col, row)); },
    clearExplosion(col, row) { explosions.delete(keyOf(col, row)); },
    hasExplosionAt(col, row) { return explosions.has(keyOf(col, row)); },
    destroyBox() { return false; },
  };
}

test("one active bomb explosion damages each actor only once", () => {
  const scene = createScene();
  const map = createMap();
  const items = { removeAt() {}, maybeDrop() {} };
  const explosions = new ExplosionSystem(scene, map, items);
  const player = {
    alive: true,
    currentCell: () => ({ col: 3, row: 3 }),
    isPhasingThroughWalls: () => false,
    hitCount: 0,
    hitByExplosion() { this.hitCount += 1; },
  };
  const enemy = { ownerId: "enemy-0", alive: true };
  const ai = {
    enemies: [enemy],
    currentCell: () => ({ col: 3, row: 3 }),
    hitEnemiesInExplosions(hitContext) {
      if (!hitContext?.canHitActor?.("enemy-0", { col: 3, row: 3 })) return;
      enemy.hitCount = (enemy.hitCount || 0) + 1;
    },
  };

  explosions.connect(player, ai);
  explosions.createExplosion(3, 3, 0, 400);
  explosions.checkActiveHits();
  explosions.checkActiveHits();

  assert.equal(player.hitCount, 1);
  assert.equal(enemy.hitCount, 1);
});

test("one explosion damages both registered players once", () => {
  const scene = createScene();
  const map = createMap();
  const explosions = new ExplosionSystem(scene, map, { removeAt() {}, maybeDrop() {} });
  const registry = new CombatantRegistry();
  const players = ["player-1", "player-2"].map((ownerId) => ({
    ownerId,
    alive: true,
    currentCell: () => ({ col: 4, row: 4 }),
    isPhasingThroughWalls: () => false,
    hits: 0,
    hitByExplosion() { this.hits += 1; },
  }));
  players.forEach((player, index) => registry.register(player, { kind: "player", slot: index + 1 }));

  explosions.connect(players, null, registry);
  explosions.createExplosion(4, 4, 0, 400);
  explosions.checkActiveHits();

  assert.equal(players[0].hits, 1);
  assert.equal(players[1].hits, 1);
});
