import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

test("game bundle evaluates and bootstraps Phaser config", () => {
  const bundlePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/game.bundle.js");
  const source = fs.readFileSync(bundlePath, "utf8");

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    window: {},
    document: {},
    navigator: {},
    Phaser: {
      AUTO: "AUTO",
      Scene: class FakeScene {},
      Scale: {
        FIT: "FIT",
        CENTER_BOTH: "CENTER_BOTH",
      },
      Game: class FakeGame {
        constructor(config) {
          this.config = config;
        }
      },
    },
  };

  vm.runInNewContext(source, sandbox, { filename: "game.bundle.js" });

  assert.ok(sandbox.window.ZBBT_CONFIG);
  assert.ok(sandbox.window.ZBBT_GAME);
  assert.equal(sandbox.window.ZBBT_GAME.config.width, 1280);
  assert.equal(sandbox.window.ZBBT_GAME.config.height, 760);
  assert.equal(sandbox.window.ZBBT_GAME.config.scene.length, 5);
  assert.equal(sandbox.window.ZBBT_GAME.config.scene[1].name, "MatchSetupScene");
});
