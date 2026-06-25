import test from "node:test";
import assert from "node:assert/strict";

globalThis.Phaser = {
  Math: {
    Clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
  },
};

const { COMBAT_CONFIG } = await import("../src/config.js");
const {
  applySlow,
  applyDamage,
  expireShieldIfNeeded,
  grantTimedShield,
  initializeCombatState,
  markOffense,
  regenerateHealth,
  updateStatusEffects,
} = await import("../src/systems/CombatSystem.js");

function makeActor(heroId = "shadow") {
  return {
    hero: { id: heroId },
    stats: { shield: 0 },
    alive: true,
    sprite: {
      x: 100,
      y: 100,
      setAlpha() { return this; },
      setTint() { return this; },
      clearTint() { return this; },
    },
  };
}

function makeScene(now = 0) {
  return {
    time: { now },
    add: {
      circle: () => ({
        setDepth() { return this; },
        setAlpha() { return this; },
        setStrokeStyle() { return this; },
        setPosition() { return this; },
        destroy() { this.destroyed = true; },
      }),
    },
    tweens: { add() {}, killTweensOf() {} },
    events: { emit() {} },
  };
}

test("combat config exposes requested health, damage, regen, and shield values", () => {
  assert.equal(COMBAT_CONFIG.maxHp, 100);
  assert.equal(COMBAT_CONFIG.regenDelayMs, 3000);
  assert.equal(COMBAT_CONFIG.regenPerSecond, 15);
  assert.equal(COMBAT_CONFIG.voltRegenPerSecond, 30);
  assert.equal(COMBAT_CONFIG.bombDamage, 70);
  assert.equal(COMBAT_CONFIG.meteorDamage, 50);
  assert.equal(COMBAT_CONFIG.shieldDurationMs, 7000);
  assert.equal(COMBAT_CONFIG.windSpeedMultiplier, 3);
  assert.equal(COMBAT_CONFIG.windTrailDurationMs, 2200);
  assert.equal(COMBAT_CONFIG.windTrailDamage, 8);
  assert.equal(COMBAT_CONFIG.windTrailTickMs, 600);
  assert.equal(COMBAT_CONFIG.windSlowMultiplier, 0.78);
  assert.equal(COMBAT_CONFIG.slowMultiplier, 0.7);
  assert.equal(COMBAT_CONFIG.shadowSlowMultiplier, 0.75);
  assert.equal(COMBAT_CONFIG.shadowSlowDurationMs, 1600);
  assert.equal(COMBAT_CONFIG.emberDamagePerSecond, 14);
  assert.equal(COMBAT_CONFIG.emberRadiusTiles, 3.5);
  assert.equal(COMBAT_CONFIG.emberAfterburnDamagePerSecond, 6);
  assert.equal(COMBAT_CONFIG.emberAfterburnDurationMs, 2500);
  assert.equal(COMBAT_CONFIG.shadowBeamDamage, 22);
  assert.equal(COMBAT_CONFIG.shadowBeamRadiusTiles, 3.5);
  assert.equal(COMBAT_CONFIG.shadowBeamAngleDeg, 360);
  assert.equal(COMBAT_CONFIG.shadowBeamDurationMs, 900);
  assert.equal(COMBAT_CONFIG.windShockDamage, 10);
  assert.equal(COMBAT_CONFIG.windShockCooldownMs, 500);
  assert.equal(COMBAT_CONFIG.voltMeteorDamage, 35);
  assert.equal(COMBAT_CONFIG.voltMeteorIntervalMs, 1200);
  assert.equal(COMBAT_CONFIG.voltMeteorWarningMs, 1300);
});

test("bomb damage removes 70 health without shield", () => {
  const actor = initializeCombatState(makeActor(), 0);
  const result = applyDamage(actor, COMBAT_CONFIG.bombDamage, "explosion", makeScene(100));
  assert.equal(actor.hp, 30);
  assert.equal(result.defeated, false);
});

test("meteor damage removes 50 health but does not defeat a full-health actor", () => {
  const actor = initializeCombatState(makeActor(), 0);
  const result = applyDamage(actor, COMBAT_CONFIG.meteorDamage, "meteor", makeScene(100));
  assert.equal(actor.hp, 50);
  assert.equal(result.defeated, false);
});

test("health regenerates after three seconds without offense and volt regenerates faster", () => {
  const normal = initializeCombatState(makeActor("shadow"), 0);
  normal.hp = 40;
  markOffense(normal, 0);
  regenerateHealth(normal, makeScene(2999), 1000);
  assert.equal(normal.hp, 40);
  regenerateHealth(normal, makeScene(3000), 1000);
  assert.equal(normal.hp, 55);

  const volt = initializeCombatState(makeActor("volt"), 0);
  volt.hp = 40;
  markOffense(volt, 0);
  regenerateHealth(volt, makeScene(3000), 1000);
  assert.equal(volt.hp, 70);
});

test("timed shield blocks one damage instance, does not stack, and expires after seven seconds", () => {
  const scene = makeScene(1000);
  const actor = initializeCombatState(makeActor(), 0);
  grantTimedShield(actor, scene, 1000);
  assert.equal(actor.shieldActive, true);
  assert.equal(actor.shieldEndsAt, 8000);
  grantTimedShield(actor, scene, 3000);
  assert.equal(actor.shieldEndsAt, 10000);

  const shielded = applyDamage(actor, 10, "ember-aura", makeScene(4000));
  assert.equal(shielded.shielded, true);
  assert.equal(actor.hp, 100);
  assert.equal(actor.shieldActive, false);

  grantTimedShield(actor, scene, 5000);
  expireShieldIfNeeded(actor, makeScene(12001));
  assert.equal(actor.shieldActive, false);
});

test("taking damage delays regeneration so ember aura keeps its full DPS", () => {
  const actor = initializeCombatState(makeActor(), 0);
  actor.hp = 80;
  markOffense(actor, 0);
  applyDamage(actor, COMBAT_CONFIG.emberDamagePerSecond, "ember-aura", makeScene(4000));
  assert.equal(actor.hp, 66);

  regenerateHealth(actor, makeScene(5000), 1000);
  assert.equal(actor.hp, 66);
  regenerateHealth(actor, makeScene(7000), 1000);
  assert.equal(actor.hp, 81);
});

test("temporary slow applies and expires cleanly", () => {
  const scene = makeScene(1000);
  const actor = initializeCombatState(makeActor(), 0);

  assert.equal(applySlow(actor, scene, 2000, 0.7, "shadow-slow"), true);
  assert.equal(actor.slowMultiplier, 0.7);
  assert.equal(actor.slowUntil, 3000);
  assert.equal(actor.slowReason, "shadow-slow");

  updateStatusEffects(actor, makeScene(2999));
  assert.equal(actor.slowMultiplier, 0.7);

  updateStatusEffects(actor, makeScene(3001));
  assert.equal(actor.slowMultiplier, 1);
  assert.equal(actor.slowUntil, 0);
});
