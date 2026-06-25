import test from "node:test";
import assert from "node:assert/strict";

const { normalizeMatchConfig } = await import("../src/multiplayer/MatchConfig.js");
const { KeyboardInputRouter, createInputProfiles } = await import("../src/multiplayer/KeyboardInputRouter.js");
const { CombatantRegistry } = await import("../src/multiplayer/CombatantRegistry.js");

test("match config enforces player, AI, total count, and unique heroes", () => {
  assert.deepEqual(normalizeMatchConfig({ playerCount: 1, aiCount: 0, playerHeroes: ["shadow"] }), {
    playerCount: 1,
    aiCount: 1,
    playerHeroes: ["shadow"],
  });
  assert.deepEqual(normalizeMatchConfig({ playerCount: 2, aiCount: 3, playerHeroes: ["ember", "ember"] }), {
    playerCount: 2,
    aiCount: 2,
    playerHeroes: ["ember", "shadow"],
  });
});

test("dual player profiles isolate Q and P ultimate keys", () => {
  const router = new KeyboardInputRouter();
  const [p1, p2] = createInputProfiles(2);

  router.handleKeyDown({ code: "ControlLeft", preventDefault() {} });
  assert.equal(router.wasPressed(p1.bomb), true);
  assert.equal(router.wasPressed(p2.bomb), false);
  router.endFrame();

  router.handleKeyDown({ code: "KeyP", preventDefault() {} });
  assert.equal(router.wasPressed(p1.ultimate), false);
  assert.equal(router.wasPressed(p2.ultimate), true);

  router.endFrame();
  router.handleKeyUp({ code: "KeyP" });
  router.handleKeyDown({ code: "KeyQ", preventDefault() {} });
  assert.equal(router.wasPressed(p1.ultimate), true);
  assert.equal(router.wasPressed(p2.ultimate), false);
});

test("combatant registry returns opponents and resolves winner or draw", () => {
  const registry = new CombatantRegistry();
  const p1 = { ownerId: "player-1", alive: true };
  const p2 = { ownerId: "player-2", alive: true };
  const ai = { ownerId: "enemy-0", alive: true };
  registry.register(p1, { kind: "player", slot: 1 });
  registry.register(p2, { kind: "player", slot: 2 });
  registry.register(ai, { kind: "ai", slot: 0 });

  assert.deepEqual(registry.opponentsOf("player-1").map((actor) => actor.ownerId), ["player-2", "enemy-0"]);
  assert.equal(registry.outcome(), null);
  p1.alive = false;
  ai.alive = false;
  assert.equal(registry.outcome().winner.ownerId, "player-2");
  p2.alive = false;
  assert.equal(registry.outcome().type, "draw");
});
