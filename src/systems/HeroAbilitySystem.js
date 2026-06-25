import { CELL, COMBAT_CONFIG, GAME_CONFIG, ULTIMATE_CONFIG } from "../config.js";
import { getHeroDisplay } from "../uiText.js";
import { applySlow, clearSlow, markOffense } from "./CombatSystem.js";

const DIRECTIONS = [
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: -1 },
];

const keyOf = (col, row) => `${col},${row}`;

export class HeroAbilitySystem {
  constructor(scene, mapSystem, playerSystem, aiSystem, registry = null) {
    this.scene = scene;
    this.map = mapSystem;
    this.player = playerSystem;
    this.ai = aiSystem;
    this.registry = registry;
    this.hero = playerSystem.hero;
    this.energy = 0;
    this.active = false;
    this.ultimateEndsAt = 0;
    this.emberBurnTimers = new Map();
    this.emberAfterburnTimers = new Map();
    this.emberBurningEnemies = new Set();
    this.shadowBeam = null;
    this.shadowExitPulse = null;
    this.windShockTimers = new Map();
    this.windShockEffects = [];
    this.windTrails = [];
    this.lastWindTrailSample = null;
    this.pendingVoltMeteors = [];
    this.activeVoltImpacts = new Map();
    this.nextVoltMeteorAt = 0;
    this.nextVoltMeteorId = 1;
    this.trail = [];
    this.effectFlashUntil = 0;
    this.effectBack = this.scene.add.graphics().setDepth(6).setVisible(false);
    this.effectFront = this.scene.add.graphics().setDepth(11).setVisible(false);
  }

  opponents() {
    return this.registry?.opponentsOf?.(this.player.ownerId) || this.ai?.enemies?.filter((actor) => actor.alive) || [];
  }

  findOpponent(ownerId) {
    return this.registry?.get?.(ownerId) || this.ai?.enemies?.find((actor) => actor.ownerId === ownerId) || null;
  }

  damageOpponent(actor, amount, reason) {
    if (!actor?.alive) return null;
    if (actor.combatantKind === "player" || actor.ownerId?.startsWith?.("player-")) {
      return actor.takeDamage?.(amount, reason);
    }
    return this.ai?.damageEnemy?.(actor, amount, reason);
  }

  opponentCell(actor) {
    return actor.currentCell?.() || this.ai?.currentCell?.(actor) || this.map?.worldToCell?.(actor.sprite.x, actor.sprite.y);
  }

  update(time, delta) {
    if (!this.player.alive) {
      this.endUltimate("player-defeated", false);
      return;
    }

    this.updateWindTrails(time, delta);
    this.updateVoltMeteorImpacts(time);

    if (!this.active) {
      this.updateEmberAfterburn(delta);
      this.addEnergy((delta / ULTIMATE_CONFIG.fullChargeMs) * 100, false);
    } else {
      const activeDelta = Math.max(0, Math.min(delta, this.ultimateEndsAt - time));

      if (this.hero.ultimate.id === "ember-aura") {
        this.updateEmberAura(activeDelta);
      }
      this.updateEmberAfterburn(activeDelta);
      if (this.hero.ultimate.id === "wind-surge") {
        this.captureWindTrailSample(time);
      }
      if (this.hero.ultimate.id === "volt-guard") {
        this.updateVoltMeteorSchedule(time);
      }
      this.updateShadowBeam(time + activeDelta);

      this.captureTrailSample();
      this.drawEffects(time);

      if (time + delta >= this.ultimateEndsAt) {
        this.endUltimate("expired");
      }
      return;
    }
    this.updateShadowBeam(time);
    this.drawEffects(time);
  }

  addEnergy(amount, emitEvent = true) {
    if (this.active) return this.energy;
    const previous = this.energy;
    this.energy = Phaser.Math.Clamp(this.energy + amount, 0, 100);
    if (emitEvent && previous !== this.energy) {
      this.scene.events.emit("ultimate-energy-changed", this.energy);
    }
    return this.energy;
  }

  isReady() {
    return this.energy >= 100;
  }

  isActive() {
    return this.active;
  }

  getRemainingMs(time = this.scene.time.now) {
    return this.active ? Math.max(0, this.ultimateEndsAt - time) : 0;
  }

  getDisplayState(time = this.scene.time.now) {
    const heroDisplay = getHeroDisplay(this.hero);
    return {
      energy: this.energy,
      ready: this.isReady(),
      active: this.active,
      remainingMs: this.getRemainingMs(time),
      name: heroDisplay?.ultimateName || this.hero.ultimate.name,
    };
  }

  tryActivate(time = this.scene.time.now) {
    if (!this.player.alive || this.active || !this.isReady()) return false;
    const heroDisplay = getHeroDisplay(this.hero);

    this.active = true;
    this.energy = 0;
    this.ultimateEndsAt = time + this.hero.ultimate.durationMs;
    this.emberBurnTimers.clear();
    this.lastWindTrailSample = null;
    this.effectFlashUntil = time + 360;

    if (this.hero.ultimate.id === "shadow-phase") {
      this.player.sprite.setAlpha(0.58);
    }

    if (this.hero.ultimate.id === "volt-guard") {
      this.player.hp = this.player.maxHp || COMBAT_CONFIG.maxHp;
      this.player.invulnerableUntil = Math.max(this.player.invulnerableUntil || 0, this.ultimateEndsAt);
      this.nextVoltMeteorAt = time;
      this.scene.events.emit("actor-health-changed", this.player);
      this.scene.events.emit("player-stats-changed");
    }

    this.scene.events.emit("ultimate-energy-changed", this.energy);
    this.scene.events.emit("ultimate-activated", heroDisplay?.ultimateName || this.hero.ultimate.name);
    return true;
  }

  endUltimate(reason = "expired", emitEvent = true) {
    if (!this.active) return;

    this.active = false;
    this.ultimateEndsAt = 0;
    this.clearEmberBurnVisuals();
    this.emberBurnTimers.clear();
    this.shadowBeam = null;
    this.windShockTimers.clear();
    this.clearWindShockEffects();
    this.player.sprite.setAlpha(1);
    this.trail = [];
    this.lastWindTrailSample = null;

    if (this.hero.ultimate.id === "shadow-phase") {
      this.snapPlayerOutOfBlockedCell();
      this.shadowExitPulse = {
        x: this.player.sprite.x,
        y: this.player.sprite.y,
        startAt: this.scene.time.now,
        endAt: this.scene.time.now + 420,
      };
    }

    if (emitEvent) {
      this.scene.events.emit("ultimate-ended", {
        heroId: this.hero.id,
        reason,
      });
    }
  }

  movementModifiers() {
    if (!this.active) {
      return { phaseWalls: false, phaseBombs: false, speedMultiplier: 1, speedBonus: 0 };
    }

    if (this.hero.ultimate.id === "shadow-phase") {
      return { phaseWalls: true, phaseBombs: true, speedMultiplier: 1, speedBonus: 1.5 };
    }

    if (this.hero.ultimate.id === "wind-surge") {
      return {
        phaseWalls: false,
        phaseBombs: true,
        speedMultiplier: this.hero.ultimate.speedMultiplier || COMBAT_CONFIG.windSpeedMultiplier,
        speedBonus: 0,
      };
    }

    return { phaseWalls: false, phaseBombs: false, speedMultiplier: 1, speedBonus: 0 };
  }

  bombOptions() {
    return {};
  }

  blocksBombPlacement() {
    return false;
  }

  emberThreatFor(enemy) {
    if (!this.active || this.hero.ultimate.id !== "ember-aura" || !enemy?.alive || !enemy?.sprite) {
      return { inside: false, elapsedMs: 0 };
    }

    const radiusPx = (this.hero.ultimate.radiusTiles || 2) * GAME_CONFIG.TILE_SIZE;
    const distance = Math.hypot(enemy.sprite.x - this.player.sprite.x, enemy.sprite.y - this.player.sprite.y);
    return {
      inside: distance <= radiusPx,
      elapsedMs: this.emberBurnTimers.get(enemy.ownerId) || 0,
      sourceCell: this.map?.worldToCell?.(this.player.sprite.x, this.player.sprite.y) || null,
      radiusTiles: this.hero.ultimate.radiusTiles || 2,
      killAfterMs: this.hero.ultimate.killAfterMs || 5000,
    };
  }

  isCellInsideEmberAura(cell) {
    if (!this.active || this.hero.ultimate.id !== "ember-aura" || !this.map || !cell) return false;
    const radiusPx = (this.hero.ultimate.radiusTiles || 2) * GAME_CONFIG.TILE_SIZE;
    const world = this.map.cellToWorld(cell.col, cell.row);
    return Math.hypot(world.x - this.player.sprite.x, world.y - this.player.sprite.y) <= radiusPx;
  }

  consumeExtraLife(time = this.scene.time.now) {
    return false;
  }

  updateEmberAura(delta) {
    const radiusPx = (this.hero.ultimate.radiusTiles || COMBAT_CONFIG.emberRadiusTiles) * GAME_CONFIG.TILE_SIZE;
    const activeBurns = new Set();
    this.opponents().forEach((enemy) => {
      if (!enemy.alive) {
        this.emberBurnTimers.delete(enemy.ownerId);
        this.emberAfterburnTimers.delete(enemy.ownerId);
        this.applyEnemyBurnVisual(enemy, false);
        return;
      }

      const distance = Math.hypot(enemy.sprite.x - this.player.sprite.x, enemy.sprite.y - this.player.sprite.y);
      if (distance <= radiusPx) {
        activeBurns.add(enemy.ownerId);
        this.applyEnemyBurnVisual(enemy, true);
        this.emberAfterburnTimers.set(enemy.ownerId, COMBAT_CONFIG.emberAfterburnDurationMs);
        const elapsed = (this.emberBurnTimers.get(enemy.ownerId) || 0) + delta;
        this.emberBurnTimers.set(enemy.ownerId, elapsed);
        const result = this.damageOpponent(
          enemy,
          COMBAT_CONFIG.emberDamagePerSecond * (delta / 1000),
          "ember-aura",
        );
        if (result?.defeated || !enemy.alive) {
          this.applyEnemyBurnVisual(enemy, false);
          this.emberBurnTimers.delete(enemy.ownerId);
        }
        return;
      }

      this.emberBurnTimers.delete(enemy.ownerId);
    });

    this.emberBurningEnemies.forEach((ownerId) => {
      if (activeBurns.has(ownerId)) return;
      const enemy = this.findOpponent(ownerId);
      if (enemy && !this.emberAfterburnTimers.has(ownerId)) this.applyEnemyBurnVisual(enemy, false);
    });
  }

  updateEmberAfterburn(delta) {
    if (!this.emberAfterburnTimers.size) return;
    this.emberAfterburnTimers.forEach((remainingMs, ownerId) => {
      const enemy = this.findOpponent(ownerId);
      if (!enemy?.alive) {
        this.emberAfterburnTimers.delete(ownerId);
        if (enemy) this.applyEnemyBurnVisual(enemy, false);
        return;
      }

      if (this.emberBurnTimers.has(ownerId)) {
        this.applyEnemyBurnVisual(enemy, true);
        return;
      }

      const damageDelta = Math.min(delta, remainingMs);
      const nextRemaining = remainingMs - damageDelta;
      if (nextRemaining > 0) {
        this.emberAfterburnTimers.set(ownerId, nextRemaining);
      }
      this.applyEnemyBurnVisual(enemy, true);
      const result = this.damageOpponent(
        enemy,
        COMBAT_CONFIG.emberAfterburnDamagePerSecond * (damageDelta / 1000),
        "ember-afterburn",
      );
      if (result?.defeated || !enemy.alive) {
        this.emberAfterburnTimers.delete(ownerId);
        this.applyEnemyBurnVisual(enemy, false);
        return;
      }

      if (nextRemaining <= 0) {
        this.emberAfterburnTimers.delete(ownerId);
        this.applyEnemyBurnVisual(enemy, false);
      }
    });
  }

  tryFireShadowBeam(time = this.scene.time.now) {
    if (!this.active || this.hero.ultimate.id !== "shadow-phase" || this.shadowBeam) return false;
    this.shadowBeam = {
      startAt: time,
      endAt: time + COMBAT_CONFIG.shadowBeamDurationMs,
      x: this.player.sprite.x,
      y: this.player.sprite.y,
      damaged: new Set(),
    };
    markOffense(this.player, time);
    this.scene.events.emit("shadow-beam-fired");
    return true;
  }

  updateShadowBeam(time = this.scene.time.now) {
    if (!this.shadowBeam) return;
    if (time > this.shadowBeam.endAt) {
      this.shadowBeam = null;
      return;
    }

    this.opponents().forEach((enemy) => {
      if (!enemy.alive || this.shadowBeam.damaged.has(enemy.ownerId)) return;
      if (!this.isPointInsideShadowBeam(enemy.sprite.x, enemy.sprite.y, time)) return;
      this.shadowBeam.damaged.add(enemy.ownerId);
      this.damageOpponent(enemy, COMBAT_CONFIG.shadowBeamDamage, "shadow-beam");
      applySlow(
        enemy,
        this.scene,
        COMBAT_CONFIG.shadowSlowDurationMs,
        COMBAT_CONFIG.shadowSlowMultiplier,
        "shadow-slow",
        time,
      );
    });
  }

  shadowBeamThreatFor(enemy) {
    if (!enemy?.alive || !this.shadowBeam) return { inside: false };
    return {
      inside: this.isPointInsideShadowBeam(enemy.sprite.x, enemy.sprite.y),
      sourceCell: this.map?.worldToCell?.(this.shadowBeam.x, this.shadowBeam.y) || null,
    };
  }

  isCellInsideShadowBeam(cell) {
    if (!this.shadowBeam || !this.map || !cell) return false;
    const world = this.map.cellToWorld(cell.col, cell.row);
    return this.isPointInsideShadowBeam(world.x, world.y);
  }

  isPointInsideShadowBeam(x, y, time = this.scene.time.now) {
    if (!this.shadowBeam) return false;
    const dx = x - this.shadowBeam.x;
    const dy = y - this.shadowBeam.y;
    const distance = Math.hypot(dx, dy);
    const progress = Phaser.Math.Clamp(
      (time - this.shadowBeam.startAt) / COMBAT_CONFIG.shadowBeamDurationMs,
      0,
      1,
    );
    const maxRadius = COMBAT_CONFIG.shadowBeamRadiusTiles * GAME_CONFIG.TILE_SIZE;
    if (distance > maxRadius * progress || distance <= 1) return false;
    return true;
  }

  captureWindTrailSample(time = this.scene.time.now) {
    const x = this.player.sprite.x;
    const y = this.player.sprite.y;
    const minDistance = GAME_CONFIG.TILE_SIZE * 0.42;
    if (
      this.lastWindTrailSample &&
      Math.hypot(x - this.lastWindTrailSample.x, y - this.lastWindTrailSample.y) < minDistance
    ) {
      return;
    }

    const cell = this.map?.worldToCell?.(x, y);
    const cellKey = cell ? keyOf(cell.col, cell.row) : `${Math.round(x / GAME_CONFIG.TILE_SIZE)},${Math.round(y / GAME_CONFIG.TILE_SIZE)}`;
    const existingTrail = this.windTrails.find((trail) => trail.cellKey === cellKey);
    if (existingTrail) {
      existingTrail.x = x;
      existingTrail.y = y;
      existingTrail.bornAt = time;
      existingTrail.expiresAt = time + COMBAT_CONFIG.windTrailDurationMs;
      this.lastWindTrailSample = { x, y };
      return;
    }

    const trail = {
      x,
      y,
      cellKey,
      bornAt: time,
      expiresAt: time + COMBAT_CONFIG.windTrailDurationMs,
    };
    this.windTrails.unshift(trail);
    this.lastWindTrailSample = { x, y };
  }

  updateWindTrails(time = this.scene.time.now) {
    this.windTrails = this.windTrails.filter((trail) => trail.expiresAt > time);
    if (!this.opponents().length) return;

    const trailRadius = GAME_CONFIG.TILE_SIZE * 0.58;
    const enemiesOnTrail = new Set();
    this.opponents().forEach((enemy) => {
      if (!enemy.alive) return;
      const onTrail = this.windTrails.some(
        (trail) => Math.hypot(enemy.sprite.x - trail.x, enemy.sprite.y - trail.y) <= trailRadius,
      );
      if (!onTrail) {
        if (enemy.slowReason === "wind-trail") clearSlow(enemy);
        return;
      }

      enemiesOnTrail.add(enemy.ownerId);
      applySlow(enemy, this.scene, 140, COMBAT_CONFIG.windSlowMultiplier, "wind-trail", time);
      const lastShockAt = this.windShockTimers.get(enemy.ownerId) ?? -Infinity;
      if (time - lastShockAt < COMBAT_CONFIG.windTrailTickMs) return;
      this.windShockTimers.set(enemy.ownerId, time);
      this.applyEnemyShockVisual(enemy);
      this.damageOpponent(enemy, COMBAT_CONFIG.windTrailDamage, "wind-trail");
    });

    this.windShockTimers.forEach((_, ownerId) => {
      if (!enemiesOnTrail.has(ownerId)) this.windShockTimers.delete(ownerId);
    });
  }

  windThreatFor(enemy) {
    if (!enemy?.alive) return { inside: false };
    const trailRadius = GAME_CONFIG.TILE_SIZE * 0.85;
    const insideTrail = this.windTrails.some(
      (trail) => Math.hypot(enemy.sprite.x - trail.x, enemy.sprite.y - trail.y) <= trailRadius,
    );
    return { inside: insideTrail };
  }

  isCellInsideWindThreat(cell) {
    if (!this.map || !cell) return false;
    const world = this.map.cellToWorld(cell.col, cell.row);
    return this.windTrails.some(
      (trail) => Math.hypot(world.x - trail.x, world.y - trail.y) <= GAME_CONFIG.TILE_SIZE * 0.85,
    );
  }

  updateVoltMeteorSchedule(time = this.scene.time.now) {
    if (!this.active || this.hero.ultimate.id !== "volt-guard") return;
    while (time >= this.nextVoltMeteorAt) {
      this.scheduleVoltMeteorWave(this.nextVoltMeteorAt);
      this.nextVoltMeteorAt += COMBAT_CONFIG.voltMeteorIntervalMs;
    }
  }

  scheduleVoltMeteorWave(time = this.scene.time.now) {
    const enemies = this.opponents();
    enemies.forEach((enemy, index) => {
      const cell = this.opponentCell(enemy);
      if (!cell || !this.map?.cellToWorld) return;
      this.scheduleVoltMeteor(cell, time, index);
    });
  }

  scheduleVoltMeteor(cell, time = this.scene.time.now, index = 0) {
    const warningMs = COMBAT_CONFIG.voltMeteorWarningMs;
    const impactMs = COMBAT_CONFIG.voltMeteorImpactMs;
    const world = this.map.cellToWorld(cell.col, cell.row);
    const meteor = {
      id: `volt-meteor-${this.nextVoltMeteorId++}`,
      col: cell.col,
      row: cell.row,
      x: world.x,
      y: world.y,
      createdAt: time,
      explodeAt: time + warningMs,
      impactEndsAt: time + warningMs + impactMs,
      hitActors: new Set(),
      warning: null,
      meteorBody: null,
      drawEvent: null,
    };

    this.createVoltMeteorWarning(meteor, index);
    this.pendingVoltMeteors.push(meteor);
    this.scene.time.delayedCall?.(warningMs, () => this.impactVoltMeteor(meteor));
  }

  createVoltMeteorWarning(meteor, index = 0) {
    const warning = this.scene.add.graphics?.();
    const meteorBody = this.scene.add.graphics?.();
    if (!warning || !meteorBody) return null;
    warning.setDepth?.(9);
    meteorBody.setDepth?.(12);
    meteor.warning = warning;
    meteor.meteorBody = meteorBody;

    const drawVoltMeteor = () => {
      if (!meteor.warning || meteor.impacted) return;
      warning.clear();
      meteorBody.clear();
      const now = this.scene.time.now;
      const progress = Phaser.Math.Clamp((now - meteor.createdAt) / COMBAT_CONFIG.voltMeteorWarningMs, 0, 1);
      const fall = this.voltMeteorFallPosition(
        { x: meteor.x, y: meteor.y - 260 },
        { x: meteor.x, y: meteor.y },
        progress,
      );
      const pulse = 0.5 + Math.sin(now / 62 + index) * 0.5;
      const warningRadius = 18 + pulse * 8 + progress * 3;

      warning.lineStyle(4, 0x79ff8c, 0.88);
      warning.strokeCircle(meteor.x, meteor.y, warningRadius);
      warning.lineStyle(2, 0xd8ffd9, 0.78);
      warning.strokeCircle(meteor.x, meteor.y, 10 + pulse * 3);
      warning.fillStyle(0x16ff72, 0.14 + pulse * 0.07);
      warning.fillCircle(meteor.x, meteor.y, 16 + pulse * 5);
      this.drawCross(warning, meteor.x, meteor.y, 14, 0x79ff8c, 0.8);

      for (let trail = 0; trail < 4; trail += 1) {
        const fade = 1 - trail / 4;
        meteorBody.fillStyle(0x123a26, 0.24 * fade * (1 - progress * 0.24));
        meteorBody.fillCircle(fall.x, fall.y - 26 - trail * 24, 12 + trail * 4);
        meteorBody.lineStyle(2, 0x79ff8c, 0.18 * fade);
        meteorBody.strokeCircle(fall.x, fall.y - 24 - trail * 24, 10 + trail * 5);
      }

      meteorBody.lineStyle(4, 0xd8ffd9, 0.78);
      meteorBody.beginPath();
      meteorBody.moveTo(fall.x, fall.y - 78);
      meteorBody.lineTo(fall.x, fall.y - 26);
      meteorBody.strokePath();
      meteorBody.fillStyle(0x2cff86, 0.96);
      meteorBody.fillCircle(fall.x, fall.y, 15);
      meteorBody.fillStyle(0xd8ffd9, 0.82);
      meteorBody.fillCircle(fall.x - 5, fall.y - 6, 7);
      meteorBody.fillStyle(0x0b2a19, 0.92);
      meteorBody.fillCircle(fall.x + 4, fall.y + 4, 8);
      this.drawCross(meteorBody, fall.x, fall.y, 12, 0xd8ffd9, 0.72);
    };

    drawVoltMeteor();
    const repeatDraw = () => {
      drawVoltMeteor();
      if (meteor.warning && !meteor.impacted) {
        meteor.drawEvent = this.scene.time.delayedCall?.(80, repeatDraw);
      }
    };
    meteor.drawEvent = this.scene.time.delayedCall?.(80, repeatDraw);
    return warning;
  }

  impactVoltMeteor(meteor) {
    meteor.impacted = true;
    this.pendingVoltMeteors = this.pendingVoltMeteors.filter((item) => item !== meteor);
    meteor.drawEvent?.remove?.();
    meteor.warning?.destroy?.();
    meteor.meteorBody?.destroy?.();
    const impact = this.scene.add.graphics?.();
    if (impact) {
      impact.setDepth?.(12);
      impact.fillStyle(0x79ff8c, 0.34);
      impact.fillCircle(meteor.x, meteor.y, 25);
      impact.lineStyle(5, 0xd8ffd9, 0.86);
      impact.strokeCircle(meteor.x, meteor.y, 24);
      impact.lineStyle(2, 0x23ff88, 0.62);
      impact.strokeCircle(meteor.x, meteor.y, 36);
      this.drawCross(impact, meteor.x, meteor.y, 19, 0xd8ffd9, 0.92);
      this.scene.tweens.add?.({
        targets: impact,
        alpha: 0,
        duration: 260,
        onComplete: () => impact.destroy?.(),
      });
    }

    this.activeVoltImpacts.set(meteor.id, meteor);
    this.opponents().forEach((enemy) => {
      if (!enemy.alive || meteor.hitActors.has(enemy.ownerId)) return;
      const cell = this.opponentCell(enemy);
      if (!cell || cell.col !== meteor.col || cell.row !== meteor.row) return;
      meteor.hitActors.add(enemy.ownerId);
      this.damageOpponent(enemy, COMBAT_CONFIG.voltMeteorDamage, "volt-meteor");
    });
  }

  updateVoltMeteorImpacts(time = this.scene.time.now) {
    this.activeVoltImpacts.forEach((meteor, id) => {
      if (time <= meteor.impactEndsAt) return;
      this.activeVoltImpacts.delete(id);
    });
  }

  pendingVoltMeteorDangerMap() {
    const dangerMap = new Map();
    this.pendingVoltMeteors.forEach((meteor) => {
      dangerMap.set(keyOf(meteor.col, meteor.row), {
        explodeAt: meteor.explodeAt,
        kind: "volt-meteor",
      });
    });
    return dangerMap;
  }

  voltMeteorFallPosition(start, target, progress) {
    const clamped = Phaser.Math.Clamp(progress, 0, 1);
    const gravityProgress = clamped * clamped;
    return {
      x: start.x + (target.x - start.x) * clamped,
      y: start.y + (target.y - start.y) * gravityProgress,
    };
  }

  applyEnemyShockVisual(enemy) {
    if (!enemy?.sprite) return;
    enemy.sprite.setTint?.(0xbefcff);
    this.scene.time.delayedCall?.(70, () => enemy.sprite?.setTint?.(0x31e9ff));
    this.scene.time.delayedCall?.(150, () => enemy.sprite?.clearTint?.());

    const ring = this.scene.add.graphics?.();
    if (!ring) return;
    ring.setDepth?.(13);
    const { x, y } = enemy.sprite;
    const sparkOffset = (this.scene.time.now || 0) % 17;
    ring.lineStyle(4, 0x7df4d4, 0.92);
    ring.strokeCircle(x, y, 24);
    ring.lineStyle(2, 0xffffff, 0.82);
    ring.strokeCircle(x, y, 15);
    ring.lineStyle(3, 0x31e9ff, 0.96);
    for (let index = 0; index < 5; index += 1) {
      const angle = (Math.PI * 2 * index) / 5 + sparkOffset;
      const inner = 13 + (index % 2) * 4;
      const outer = 28 + (index % 3) * 6;
      ring.beginPath();
      ring.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
      ring.lineTo(x + Math.cos(angle + 0.22) * outer, y + Math.sin(angle + 0.22) * outer);
      ring.lineTo(x + Math.cos(angle - 0.08) * (outer - 7), y + Math.sin(angle - 0.08) * (outer - 7));
      ring.strokePath();
    }
    ring.fillStyle(0x7df4d4, 0.28);
    ring.fillCircle(x, y, 21);
    this.windShockEffects.push(ring);
    this.scene.tweens.add?.({
      targets: ring,
      alpha: 0,
      duration: 180,
      onComplete: () => {
        ring.destroy?.();
        this.windShockEffects = this.windShockEffects.filter((item) => item !== ring);
      },
    });
  }

  clearWindShockEffects() {
    this.windShockEffects?.forEach((effect) => effect.destroy?.());
    this.windShockEffects = [];
  }

  facingVector() {
    if (this.player.facing === "left") return { x: -1, y: 0 };
    if (this.player.facing === "right") return { x: 1, y: 0 };
    if (this.player.facing === "up") return { x: 0, y: -1 };
    return { x: 0, y: 1 };
  }

  applyEnemyBurnVisual(enemy, burning) {
    if (!enemy?.sprite) return;
    if (burning) {
      this.emberBurningEnemies.add(enemy.ownerId);
      enemy.sprite.setTint?.(0xff8c2a);
      return;
    }

    this.emberBurningEnemies.delete(enemy.ownerId);
    enemy.sprite.clearTint?.();
  }

  clearEmberBurnVisuals() {
    if (!this.ai?.enemies && !this.registry) {
      this.emberBurningEnemies.clear();
      return;
    }
    this.opponents().forEach((enemy) => this.applyEnemyBurnVisual(enemy, false));
    this.emberBurningEnemies.clear();
  }

  captureTrailSample() {
    this.trail.unshift({ x: this.player.sprite.x, y: this.player.sprite.y });
    this.trail = this.trail.slice(0, 6);
  }

  snapPlayerOutOfBlockedCell() {
    if (!this.map || !this.player?.currentCell) return;
    const start = this.player.currentCell();
    if (!this.map.isInside(start.col, start.row)) return;
    const radius = 13;
    if (this.map.canMoveToWorld(this.player.sprite.x, this.player.sprite.y, radius)) return;

    const queue = [{ col: start.col, row: start.row }];
    const seen = new Set([keyOf(start.col, start.row)]);

    while (queue.length) {
      const cell = queue.shift();
      if (this.isTraversableForEndState(cell.col, cell.row)) {
        const world = this.map.cellToWorld(cell.col, cell.row);
        if (this.map.canMoveToWorld(world.x, world.y, radius)) {
          this.player.sprite.setPosition(world.x, world.y);
          this.player.ignoredBombKey = null;
          this.scene.events.emit("shadow-phase-ejected", cell);
          return;
        }
      }

      DIRECTIONS.forEach((dir) => {
        const next = { col: cell.col + dir.col, row: cell.row + dir.row };
        const nextKey = keyOf(next.col, next.row);
        if (!this.map.isInside(next.col, next.row) || seen.has(nextKey)) return;
        seen.add(nextKey);
        queue.push(next);
      });
    }
  }

  isTraversableForEndState(col, row) {
    return this.map.getCell(col, row) === CELL.EMPTY && !this.map.hasBomb(col, row);
  }

  drawEffects(time) {
    if (this.shadowExitPulse && time >= this.shadowExitPulse.endAt) this.shadowExitPulse = null;
    this.effectBack.clear();
    this.effectFront.clear();
    const hasResidualEffects =
      this.active || this.windTrails.length > 0 || this.emberAfterburnTimers.size > 0 || !!this.shadowBeam || !!this.shadowExitPulse;
    this.effectBack.setVisible(hasResidualEffects);
    this.effectFront.setVisible(hasResidualEffects);

    if (!this.active) {
      this.drawWindTrailResidues(time);
      this.drawBurningEnemyEffects(time);
      this.drawShadowBeamEffect(time);
      this.drawShadowExitEffect(time);
      return;
    }

    if (this.hero.ultimate.id === "shadow-phase") {
      this.drawShadowEffects(time);
      return;
    }

    if (this.hero.ultimate.id === "ember-aura") {
      this.drawEmberEffects(time);
      return;
    }

    if (this.hero.ultimate.id === "volt-guard") {
      this.drawVoltEffects(time);
      return;
    }

    if (this.hero.ultimate.id === "wind-surge") {
      this.drawWindEffects(time);
    }
  }

  drawShadowEffects(time) {
    const { x, y } = this.player.sprite;
    const pulse = 0.18 + (Math.sin(time / 140) + 1) * 0.05;

    this.trail.forEach((sample, index) => {
      const alpha = Math.max(0.08, 0.22 - index * 0.03);
      this.effectBack.fillStyle(0x5c2cff, alpha);
      this.effectBack.fillCircle(sample.x, sample.y, 18 - index);
    });

    this.effectFront.lineStyle(3, 0x9a7cff, 0.62);
    this.effectFront.strokeCircle(x, y, 28);
    this.effectFront.fillStyle(0x9a7cff, pulse);
    this.effectFront.fillCircle(x, y, 20);
    this.effectFront.lineStyle(2, 0x2b103b, 0.72);
    this.effectFront.strokeEllipse(x, y, 64, 28);
    this.drawShadowBeamEffect(time);
  }

  drawShadowExitEffect(time) {
    if (!this.shadowExitPulse) return;
    const progress = Phaser.Math.Clamp(
      (time - this.shadowExitPulse.startAt) / (this.shadowExitPulse.endAt - this.shadowExitPulse.startAt),
      0,
      1,
    );
    const radius = 20 + progress * 36;
    const alpha = 0.72 * (1 - progress);
    this.effectFront.lineStyle(4, 0xd8b6ff, alpha);
    this.effectFront.strokeCircle(this.shadowExitPulse.x, this.shadowExitPulse.y, radius);
    this.effectFront.lineStyle(2, 0x6f38ff, alpha * 0.78);
    this.effectFront.strokeCircle(this.shadowExitPulse.x, this.shadowExitPulse.y, radius * 0.62);
  }

  drawShadowBeamEffect(time) {
    if (!this.shadowBeam) return;
    const progress = Phaser.Math.Clamp(
      (time - this.shadowBeam.startAt) / COMBAT_CONFIG.shadowBeamDurationMs,
      0,
      1,
    );
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const radius = COMBAT_CONFIG.shadowBeamRadiusTiles * GAME_CONFIG.TILE_SIZE * easedProgress;
    const visualRadius = Math.min(COMBAT_CONFIG.shadowBeamRadiusTiles * GAME_CONFIG.TILE_SIZE, radius + 16);
    const x = this.shadowBeam.x;
    const y = this.shadowBeam.y;
    const coreAlpha = 0.08 + (1 - progress) * 0.08;
    const edgeAlpha = 0.42 + (1 - progress) * 0.22;
    const rippleOffset = Math.sin(time / 48) * 5;

    this.effectBack.fillStyle(0x5224ff, coreAlpha);
    this.effectBack.fillCircle(x, y, visualRadius);
    this.effectBack.fillStyle(0xb86bff, 0.045 + (1 - progress) * 0.035);
    this.effectBack.fillCircle(x, y, Math.max(18, visualRadius * 0.68));

    this.effectFront.lineStyle(5, 0xd8b6ff, edgeAlpha);
    this.effectFront.strokeCircle(x, y, visualRadius + rippleOffset);
    this.effectFront.lineStyle(2, 0x8f48ff, 0.34);
    this.effectFront.strokeCircle(x, y, Math.max(10, visualRadius * 0.72 - rippleOffset * 0.5));
    this.effectFront.lineStyle(1, 0xf1dcff, 0.22);
    this.effectFront.strokeCircle(x, y, Math.max(8, visualRadius * 0.42 + rippleOffset));

    for (let index = 0; index < 16; index += 1) {
      const spokeAngle = time / 240 + (Math.PI * 2 * index) / 16;
      const spokeLength = visualRadius * (0.55 + (index % 4) * 0.1);
      const inner = Math.max(10, spokeLength * 0.24);
      this.effectFront.lineStyle(index % 4 === 0 ? 3 : 2, index % 4 === 0 ? 0xd8b6ff : 0x8f48ff, index % 4 === 0 ? 0.24 : 0.16);
      this.effectFront.beginPath();
      this.effectFront.moveTo(x + Math.cos(spokeAngle) * inner, y + Math.sin(spokeAngle) * inner);
      this.effectFront.lineTo(x + Math.cos(spokeAngle) * spokeLength, y + Math.sin(spokeAngle) * spokeLength);
      this.effectFront.strokePath();
    }

    for (let index = 0; index < 18; index += 1) {
      const travel = ((time / 95 + index * 0.13) % 1) * visualRadius;
      const angle = time / 180 + (Math.PI * 2 * index) / 18;
      const px = x + Math.cos(angle) * travel;
      const py = y + Math.sin(angle) * travel;
      this.effectFront.fillStyle(0xd6b7ff, 0.18 + (index % 3) * 0.055);
      this.effectFront.fillCircle(px, py, 2 + (index % 2));
    }

    this.effectFront.fillStyle(0xf1dcff, 0.2 + (1 - progress) * 0.22);
    this.effectFront.fillCircle(x, y, 8 + Math.sin(time / 35) * 2);
  }

  drawEmberEffects(time) {
    const { x, y } = this.player.sprite;
    const radiusPx = (this.hero.ultimate.radiusTiles || 2) * GAME_CONFIG.TILE_SIZE;
    const pulse = Math.sin(time / 130);
    const breathingRadius = radiusPx + pulse * 10;

    this.effectBack.fillStyle(0xff2a12, 0.09);
    this.effectBack.fillCircle(x, y, breathingRadius);
    this.effectBack.fillStyle(0xff7a1f, 0.08);
    this.effectBack.fillCircle(x, y, radiusPx * 0.68 + Math.cos(time / 170) * 8);
    this.effectBack.lineStyle(7, 0xff5a1f, 0.42);
    this.effectBack.strokeCircle(x, y, breathingRadius - 4);
    this.effectBack.lineStyle(3, 0xffd66b, 0.28);
    this.effectBack.strokeCircle(x, y, radiusPx - 22 + Math.sin(time / 90) * 5);
    this.effectBack.lineStyle(2, 0xfff0a8, 0.16);
    this.effectBack.strokeCircle(x, y, radiusPx * 0.48 + Math.cos(time / 120) * 4);

    for (let index = 0; index < 22; index += 1) {
      const orbit = index % 2 === 0 ? time / 260 : -time / 310;
      const angle = orbit + (Math.PI * 2 * index) / 22;
      const flameRadius = radiusPx - 10 + Math.sin(time / 100 + index * 0.7) * 14;
      const px = x + Math.cos(angle) * flameRadius;
      const py = y + Math.sin(angle) * flameRadius;
      const flameSize = 5 + ((index + Math.floor(time / 120)) % 3);
      this.effectFront.fillStyle(0xff5a1f, 0.68);
      this.effectFront.fillCircle(px, py, flameSize + 2);
      this.effectFront.fillStyle(0xffd66b, 0.62);
      this.effectFront.fillCircle(px, py - flameSize * 0.7, Math.max(2, flameSize - 2));
    }

    for (let index = 0; index < 10; index += 1) {
      const angle = time / 180 + (Math.PI * 2 * index) / 10;
      const px = x + Math.cos(angle) * (radiusPx * 0.34 + Math.sin(time / 90 + index) * 10);
      const py = y + Math.sin(angle) * (radiusPx * 0.24 + Math.cos(time / 110 + index) * 6);
      this.effectFront.fillStyle(0xfff0a8, 0.35);
      this.effectFront.fillCircle(px, py, 3);
    }

    this.drawBurningEnemyEffects(time);

    this.effectFront.fillStyle(0xff6d1f, 0.22);
    this.effectFront.fillEllipse(x, y + 10, 124, 54);
  }

  drawBurningEnemyEffects(time) {
    this.opponents().forEach((enemy, enemyIndex) => {
      const burning = this.emberBurnTimers.has(enemy.ownerId);
      const afterburn = this.emberAfterburnTimers.has(enemy.ownerId);
      if (!enemy.alive || (!burning && !afterburn)) return;

      const elapsed = this.emberBurnTimers.get(enemy.ownerId) || 0;
      const afterburnHeat = afterburn
        ? Phaser.Math.Clamp((this.emberAfterburnTimers.get(enemy.ownerId) || 0) / COMBAT_CONFIG.emberAfterburnDurationMs, 0.22, 0.72)
        : 0;
      const heat = burning
        ? Phaser.Math.Clamp(elapsed / (this.hero.ultimate.killAfterMs || 5000), 0.25, 1)
        : afterburnHeat;
      const { x, y } = enemy.sprite;

      this.effectFront.lineStyle(2 + heat * 2, 0xff7a1f, 0.45 + heat * 0.25);
      this.effectFront.strokeCircle(x, y + 2, 18 + Math.sin(time / 80 + enemyIndex) * 3);

      for (let index = 0; index < 5; index += 1) {
        const angle = time / 95 + enemyIndex + (Math.PI * 2 * index) / 5;
        const px = x + Math.cos(angle) * (13 + heat * 9);
        const py = y - 8 + Math.sin(angle) * 13 - ((time / 35 + index * 7) % 16);
        this.effectFront.fillStyle(0xff3d16, 0.55 + heat * 0.22);
        this.effectFront.fillCircle(px, py, 4 + heat * 3);
        this.effectFront.fillStyle(0xffe06b, 0.58);
        this.effectFront.fillCircle(px, py - 4, 2 + heat * 1.5);
      }
    });
  }

  drawVoltEffects(time) {
    const { x, y } = this.player.sprite;
    const flashBoost = time < this.effectFlashUntil ? 1.32 : 1;
    const crossColor = 0x79ff8c;

    this.effectBack.fillStyle(0x0d2011, 0.18);
    this.effectBack.fillCircle(x, y, 34);
    this.effectBack.lineStyle(3, crossColor, 0.68);
    this.effectBack.strokeCircle(x, y, 26);

    this.drawCross(this.effectFront, x, y - 28, 12 * flashBoost, crossColor, 0.85);
    this.drawCross(this.effectFront, x - 26, y + 2, 9 * flashBoost, 0x44f26e, 0.74);
    this.drawCross(this.effectFront, x + 26, y + 2, 9 * flashBoost, 0x44f26e, 0.74);
  }

  drawWindEffects(time) {
    const { x, y } = this.player.sprite;
    this.drawWindTrailResidues(time);

    this.trail.forEach((sample, index) => {
      const alpha = Math.max(0.08, 0.24 - index * 0.035);
      this.effectBack.fillStyle(0x58e8ff, alpha);
      this.effectBack.fillEllipse(sample.x, sample.y, 28 - index * 2, 18 - index);
    });

    for (let index = 0; index < 3; index += 1) {
      const offset = (time / 90 + index) % 1;
      const px = x - 16 + index * 16;
      const py = y - 22 + Math.sin(time / 80 + index) * 8;
      this.effectFront.lineStyle(3, 0x7df4d4, 0.88);
      this.effectFront.beginPath();
      this.effectFront.moveTo(px, py - 8);
      this.effectFront.lineTo(px + 6, py + 2);
      this.effectFront.lineTo(px - 4, py + 6);
      this.effectFront.lineTo(px + 2, py + 19 + offset * 2);
      this.effectFront.strokePath();
    }

    this.effectFront.lineStyle(2, 0x58e8ff, 0.55);
    this.effectFront.strokeEllipse(x, y, 50, 24);
  }

  drawWindTrailResidues(time) {
    this.windTrails.forEach((trail, index) => {
      const age = Phaser.Math.Clamp((time - trail.bornAt) / COMBAT_CONFIG.windTrailDurationMs, 0, 1);
      const alpha = 0.34 * (1 - age);
      const pulse = Math.sin(time / 70 + index) * 4;
      this.effectBack.fillStyle(0x31e9ff, alpha * 0.46);
      this.effectBack.fillEllipse(trail.x, trail.y, 34 + pulse, 19 + pulse * 0.35);
      this.effectFront.lineStyle(2, 0x7df4d4, alpha + 0.08);
      this.effectFront.strokeEllipse(trail.x, trail.y, 38 + pulse, 22);
      this.effectFront.lineStyle(3, 0xd9ffff, alpha + 0.1);
      this.effectFront.beginPath();
      this.effectFront.moveTo(trail.x - 11, trail.y);
      this.effectFront.lineTo(trail.x - 3, trail.y - 9);
      this.effectFront.lineTo(trail.x + 2, trail.y + 8);
      this.effectFront.lineTo(trail.x + 11, trail.y);
      this.effectFront.strokePath();
      this.effectFront.lineStyle(1, 0xd9ffff, alpha * 0.72);
      this.effectFront.strokeCircle(trail.x, trail.y, 8 + Math.sin(time / 80 + index) * 2);
    });
  }

  drawCross(graphics, x, y, size, color, alpha) {
    graphics.lineStyle(4, color, alpha);
    graphics.beginPath();
    graphics.moveTo(x - size, y);
    graphics.lineTo(x + size, y);
    graphics.moveTo(x, y - size);
    graphics.lineTo(x, y + size);
    graphics.strokePath();
  }
}
