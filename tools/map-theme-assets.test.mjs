import test from "node:test";
import assert from "node:assert/strict";

globalThis.Phaser = { Math: { Clamp: (value, min, max) => Math.min(max, Math.max(min, value)) } };
const { MAPS } = await import("../src/config.js");

test("every map declares its own bomb, explosion, orb, and enemy art", () => {
  const requiredOrbs = ["energy-orb", "speed", "range", "bomb", "shield"];
  MAPS.forEach((map) => {
    assert.ok(map.textures.bomb.startsWith(`${map.id}-`));
    assert.ok(map.textures.explosion.startsWith(`${map.id}-`));
    assert.equal(map.enemyTextures.length, 3);
    requiredOrbs.forEach((orb) => assert.ok(map.itemTextures[orb].startsWith(`${map.id}-`)));
  });
});
