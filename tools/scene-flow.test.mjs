import test from "node:test";
import assert from "node:assert/strict";

import { beginSceneTransition, resetSceneTransition } from "../src/scenes/SceneFlow.js";

test("scene transition only starts once until the scene is reset", () => {
  const starts = [];
  const scene = {
    scene: { start: (key, data) => starts.push({ key, data }) },
    time: { delayedCall: (_delay, callback) => callback() },
  };

  assert.equal(beginSceneTransition(scene, "MapSelectScene", { mapId: "inferno" }), true);
  assert.equal(beginSceneTransition(scene, "GameScene", { mapId: "homeland" }), false);
  assert.deepEqual(starts, [{ key: "MapSelectScene", data: { mapId: "inferno" } }]);

  resetSceneTransition(scene);
  assert.equal(beginSceneTransition(scene, "StartScene"), true);
  assert.equal(starts.length, 2);
});

test("delayed scene transition remains locked while waiting", () => {
  const starts = [];
  const callbacks = [];
  const scene = {
    scene: { start: (key) => starts.push(key) },
    time: { delayedCall: (_delay, callback) => callbacks.push(callback) },
  };

  assert.equal(beginSceneTransition(scene, "ResultScene", {}, { delayMs: 420 }), true);
  assert.equal(beginSceneTransition(scene, "StartScene"), false);
  assert.deepEqual(starts, []);
  callbacks[0]();
  assert.deepEqual(starts, ["ResultScene"]);
});
