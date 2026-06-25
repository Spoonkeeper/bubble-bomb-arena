import { COMBAT_CONFIG } from "../config.js";

const clamp = (value, min, max) => {
  if (globalThis.Phaser?.Math?.Clamp) return Phaser.Math.Clamp(value, min, max);
  return Math.min(max, Math.max(min, value));
};

function nowFrom(scene, fallback = 0) {
  return typeof scene?.time?.now === "number" ? scene.time.now : fallback;
}

function emit(scene, eventName, payload) {
  scene?.events?.emit?.(eventName, payload);
}

export function initializeCombatState(actor, time = 0) {
  actor.maxHp = COMBAT_CONFIG.maxHp;
  actor.hp = COMBAT_CONFIG.maxHp;
  actor.alive = actor.alive !== false;
  actor.shieldActive = false;
  actor.shieldEndsAt = 0;
  actor.lastOffenseAt = time;
  actor.lastDamageAt = -Infinity;
  actor.invulnerableUntil = actor.invulnerableUntil || 0;
  actor.slowUntil = 0;
  actor.slowMultiplier = 1;
  actor.slowReason = null;
  actor.stats = actor.stats || {};
  if (actor.stats.shield === undefined || actor.stats.shield === null) actor.stats.shield = 0;
  return actor;
}

export function markOffense(actor, time = 0) {
  if (!actor) return;
  actor.lastOffenseAt = time;
}

export function regenerateHealth(actor, scene, delta = 0) {
  if (!actor?.alive || actor.hp >= actor.maxHp) return actor?.hp ?? 0;
  const now = nowFrom(scene);
  const lastPressureAt = Math.max(actor.lastOffenseAt ?? 0, actor.lastDamageAt ?? -Infinity);
  if (now - lastPressureAt < COMBAT_CONFIG.regenDelayMs) return actor.hp;

  const rate =
    actor.hero?.id === "volt" || actor.heroId === "volt"
      ? COMBAT_CONFIG.voltRegenPerSecond
      : COMBAT_CONFIG.regenPerSecond;
  const nextHp = clamp(actor.hp + rate * (delta / 1000), 0, actor.maxHp);
  if (nextHp !== actor.hp) {
    actor.hp = nextHp;
    emit(scene, "actor-health-changed", actor);
    if (actor.ownerId === "player") emit(scene, "player-stats-changed");
  }
  return actor.hp;
}

export function grantTimedShield(actor, scene, time = nowFrom(scene)) {
  if (!actor?.alive) return false;
  actor.shieldActive = true;
  actor.shieldEndsAt = time + COMBAT_CONFIG.shieldDurationMs;
  actor.stats = actor.stats || {};
  actor.stats.shield = 1;
  ensureShieldEffect(actor, scene);
  updateCombatVisuals(actor, scene);
  emit(scene, actor.ownerId === "player" ? "player-stats-changed" : "actor-shield-changed", actor);
  return true;
}

export function expireShieldIfNeeded(actor, sceneOrTime) {
  if (!actor?.shieldActive) return false;
  const now = typeof sceneOrTime === "number" ? sceneOrTime : nowFrom(sceneOrTime);
  if (now <= actor.shieldEndsAt) return false;
  clearShield(actor, typeof sceneOrTime === "number" ? null : sceneOrTime);
  return true;
}

export function clearShield(actor, scene = null) {
  if (!actor) return;
  actor.shieldActive = false;
  actor.shieldEndsAt = 0;
  actor.stats = actor.stats || {};
  actor.stats.shield = 0;
  actor.shieldEffect?.destroy?.();
  actor.shieldEffect = null;
  emit(scene, actor.ownerId === "player" ? "player-stats-changed" : "actor-shield-changed", actor);
}

export function applyDamage(actor, amount, reason = "damage", scene, time = nowFrom(scene)) {
  if (!actor?.alive) {
    return { ignored: true, shielded: false, damaged: false, defeated: false, hp: actor?.hp ?? 0, reason };
  }

  expireShieldIfNeeded(actor, scene ?? time);

  if (time < (actor.invulnerableUntil || 0)) {
    return { ignored: true, shielded: false, damaged: false, defeated: false, hp: actor.hp, reason };
  }

  if (actor.shieldActive) {
    actor.lastDamageAt = time;
    clearShield(actor, scene);
    flashActor(actor, scene, 0x9a7cff);
    emit(scene, actor.ownerId === "player" ? "player-shield-used" : "actor-shield-used", { actor, reason });
    return { ignored: false, shielded: true, damaged: false, defeated: false, hp: actor.hp, reason };
  }

  actor.hp = clamp((actor.hp ?? COMBAT_CONFIG.maxHp) - amount, 0, actor.maxHp || COMBAT_CONFIG.maxHp);
  actor.lastDamageAt = time;
  flashActor(actor, scene, damageTint(reason));
  emit(scene, "actor-health-changed", actor);
  if (actor.ownerId === "player") emit(scene, "player-stats-changed");
  const defeated = actor.hp <= 0;
  return { ignored: false, shielded: false, damaged: true, defeated, hp: actor.hp, reason };
}

export function applySlow(actor, scene, durationMs, multiplier = COMBAT_CONFIG.slowMultiplier, reason = "slow", time = nowFrom(scene)) {
  if (!actor?.alive || durationMs <= 0) return false;
  const now = time;
  actor.slowUntil = Math.max(actor.slowUntil || 0, now + durationMs);
  actor.slowMultiplier = Math.min(actor.slowMultiplier || 1, multiplier);
  actor.slowReason = reason;
  ensureSlowEffect(actor, scene);
  updateStatusEffects(actor, scene);
  return true;
}

export function clearSlow(actor) {
  if (!actor) return;
  actor.slowUntil = 0;
  actor.slowMultiplier = 1;
  actor.slowReason = null;
  actor.slowEffect?.destroy?.();
  actor.slowEffect = null;
}

export function updateStatusEffects(actor, scene) {
  if (!actor) return;
  const now = nowFrom(scene);
  if (!actor.alive || (actor.slowUntil || 0) <= now) {
    if ((actor.slowMultiplier || 1) !== 1 || actor.slowEffect) clearSlow(actor);
    return;
  }

  actor.slowMultiplier = actor.slowMultiplier || COMBAT_CONFIG.slowMultiplier;
  if (actor.slowEffect && actor.sprite) {
    actor.slowEffect.setPosition?.(actor.sprite.x, actor.sprite.y - 24);
    const remainingRatio = clamp((actor.slowUntil - now) / COMBAT_CONFIG.shadowSlowDurationMs, 0, 1);
    actor.slowEffect.setAlpha?.(0.28 + remainingRatio * 0.48);
  }
}

export function updateCombatVisuals(actor, scene) {
  if (!actor) return;
  expireShieldIfNeeded(actor, scene);
  updateStatusEffects(actor, scene);
  if (actor.shieldActive) ensureShieldEffect(actor, scene);
  if (actor.shieldEffect && actor.sprite) {
    actor.shieldEffect.setPosition?.(actor.sprite.x, actor.sprite.y);
    const remaining = Math.max(0, actor.shieldEndsAt - nowFrom(scene));
    const alpha = 0.28 + Math.min(1, remaining / COMBAT_CONFIG.shieldDurationMs) * 0.34;
    actor.shieldEffect.setAlpha?.(alpha);
  }
  updateHealthBar(actor, scene);
}

function ensureSlowEffect(actor, scene) {
  if (actor.slowEffect || !actor.sprite) return;
  if (scene?.add?.text) {
    actor.slowEffect = scene.add
      .text(actor.sprite.x, actor.sprite.y - 24, "vvv", {
        fontFamily: "Arial",
        fontSize: "12px",
        color: "#9ad8ff",
        fontStyle: "900",
      })
      .setOrigin?.(0.5)
      ?.setDepth?.((actor.sprite.depth || 6) + 5);
    return;
  }
  if (scene?.add?.circle) {
    actor.slowEffect = scene.add
      .circle(actor.sprite.x, actor.sprite.y - 24, 8, 0x7df4d4, 0.24)
      .setDepth?.((actor.sprite.depth || 6) + 5)
      ?.setStrokeStyle?.(2, 0x9ad8ff, 0.72);
  }
}

function ensureShieldEffect(actor, scene) {
  if (actor.shieldEffect || !scene?.add?.circle || !actor.sprite) return;
  actor.shieldEffect = scene.add
    .circle(actor.sprite.x, actor.sprite.y, 23, 0x7cf7ff, 0.18)
    .setDepth?.((actor.sprite.depth || 6) + 1)
    ?.setStrokeStyle?.(3, 0xc7f7ff, 0.8);
}

function flashActor(actor, scene, tint) {
  if (!actor?.sprite) return;
  actor.sprite.setTint?.(tint);
  scene?.time?.delayedCall?.(120, () => actor.sprite?.clearTint?.());
}

function updateHealthBar(actor, scene) {
  if (!actor?.sprite || !scene?.add?.rectangle) return;
  if (!actor.alive) {
    actor.healthBarBg?.destroy?.();
    actor.healthBarFill?.destroy?.();
    actor.healthBarBg = null;
    actor.healthBarFill = null;
    return;
  }

  if (!actor.healthBarBg) {
    actor.healthBarBg = scene.add
      .rectangle(actor.sprite.x, actor.sprite.y - 30, 30, 4, 0x12080a, 0.78)
      .setDepth?.((actor.sprite.depth || 6) + 3);
    actor.healthBarFill = scene.add
      .rectangle(actor.sprite.x - 15, actor.sprite.y - 30, 30, 4, 0x58ff8a, 0.92)
      .setOrigin?.(0, 0.5)
      ?.setDepth?.((actor.sprite.depth || 6) + 4);
  }

  actor.healthBarBg?.setPosition?.(actor.sprite.x, actor.sprite.y - 30);
  actor.healthBarFill?.setPosition?.(actor.sprite.x - 15, actor.sprite.y - 30);
  const ratio = clamp((actor.hp ?? actor.maxHp) / (actor.maxHp || COMBAT_CONFIG.maxHp), 0, 1);
  actor.healthBarFill.width = Math.max(0, 30 * ratio);
  const color = ratio > 0.55 ? 0x58ff8a : ratio > 0.25 ? 0xffd777 : 0xff4452;
  actor.healthBarFill?.setFillStyle?.(color, 0.92);
}

function damageTint(reason) {
  if (reason === "ember-aura") return 0xff7a1f;
  if (reason === "ember-afterburn") return 0xff5a1f;
  if (reason === "wind-shock") return 0x7df4d4;
  if (reason === "wind-trail") return 0x7df4d4;
  if (reason === "shadow-beam") return 0x9a7cff;
  if (reason === "volt-meteor") return 0x79ff8c;
  if (reason === "meteor") return 0xffd777;
  return 0xff4b4b;
}
