import { CELL, COMBAT_CONFIG, GAME_CONFIG } from "../config.js";

const keyOf = (col, row) => `${col},${row}`;

export class MeteorSystem {
  constructor(scene, mapSystem, playerSystem, aiSystem, itemSystem, registry = null) {
    this.scene = scene;
    this.map = mapSystem;
    this.players = Array.isArray(playerSystem) ? playerSystem : [playerSystem].filter(Boolean);
    this.player = this.players[0] || null;
    this.ai = aiSystem;
    this.items = itemSystem;
    this.registry = registry;
    this.config = mapSystem.mapConfig.meteor;
    this.nextWaveAt = this.config.firstDelayMs;
    this.pending = [];
    this.activeImpacts = new Map();
    this.nextImpactId = 1;
  }

  update(time) {
    while (time >= this.nextWaveAt) {
      this.spawnWave(time);
      this.nextWaveAt += this.config.intervalMs;
    }
    this.checkImpactHits();
  }

  static fallPosition(start, target, progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    const gravityProgress = clamped * clamped;
    return {
      x: start.x + (target.x - start.x) * clamped,
      y: start.y + (target.y - start.y) * gravityProgress,
    };
  }

  pendingDangerMap() {
    const danger = new Map();
    this.pending.forEach((meteor) => {
      if (meteor.impacted) return;
      danger.set(keyOf(meteor.col, meteor.row), {
        col: meteor.col,
        row: meteor.row,
        explodeAt: meteor.impactAt,
        kind: "meteor",
      });
    });
    return danger;
  }

  spawnWave(time) {
    const cells = this.pickMeteorCells(this.config.count);
    cells.forEach((cell, index) => this.scheduleMeteor(cell, time, index));
  }

  pickMeteorCells(count) {
    const candidates = [];
    const occupied = new Set();
    this.pending.forEach((meteor) => occupied.add(keyOf(meteor.col, meteor.row)));

    for (let row = 1; row < GAME_CONFIG.GRID_ROWS - 1; row += 1) {
      for (let col = 1; col < GAME_CONFIG.GRID_COLS - 1; col += 1) {
        const key = keyOf(col, row);
        if (occupied.has(key)) continue;
        if (!this.canTargetCell(col, row)) continue;
        const cell = this.map.getCell(col, row);
        candidates.push({ col, row, weight: cell === CELL.BREAKABLE_BOX ? 3 : 1 });
      }
    }

    const chosen = [];
    while (chosen.length < count && candidates.length) {
      const totalWeight = candidates.reduce((sum, cell) => sum + cell.weight, 0);
      let roll = Phaser.Math.Between(1, totalWeight);
      let selectedIndex = 0;
      for (let index = 0; index < candidates.length; index += 1) {
        roll -= candidates[index].weight;
        if (roll <= 0) {
          selectedIndex = index;
          break;
        }
      }
      const [cell] = candidates.splice(selectedIndex, 1);
      chosen.push({ col: cell.col, row: cell.row });
    }
    return chosen;
  }

  canTargetCell(col, row) {
    const cell = this.map.getCell(col, row);
    if (cell === CELL.SOLID_WALL) return false;
    if (this.map.hasBomb(col, row) || this.map.hasExplosionAt(col, row)) return false;
    if (this.items.items?.has?.(keyOf(col, row))) return false;
    return true;
  }

  scheduleMeteor(cell, time, index) {
    const { x, y } = this.map.cellToWorld(cell.col, cell.row);
    const warning = this.scene.add.graphics().setDepth(9);
    const meteorBody = this.scene.add.graphics().setDepth(12);
    const meteor = { ...cell, warning, meteorBody, startAt: time, impactAt: time + this.config.warningMs };
    this.pending.push(meteor);

    this.scene.tweens.add({
      targets: warning,
      alpha: 0.45,
      duration: 180,
      yoyo: true,
      repeat: Math.max(1, Math.floor(this.config.warningMs / 360)),
    });

    const drawWarning = () => {
      if (!warning || warning.destroyed) return;
      warning.clear();
      meteorBody.clear();
      const now = this.scene.time.now;
      const progress = Phaser.Math.Clamp((now - meteor.startAt) / this.config.warningMs, 0, 1);
      const pulse = 0.5 + Math.sin(now / 70 + index) * 0.5;
      const incoming = MeteorSystem.fallPosition({ x: x - 58, y: y - 250 }, { x, y }, progress);
      const incomingX = incoming.x;
      const incomingY = incoming.y;
      const smokeAlpha = 0.34 + progress * 0.18;

      warning.lineStyle(3, 0xff5a22, 0.9);
      warning.strokeCircle(x, y, 19 + pulse * 8);
      warning.lineStyle(2, 0xffd777, 0.68);
      warning.beginPath();
      warning.moveTo(x - 16, y);
      warning.lineTo(x + 16, y);
      warning.moveTo(x, y - 16);
      warning.lineTo(x, y + 16);
      warning.strokePath();
      warning.fillStyle(0xff3d16, 0.16);
      warning.fillCircle(x, y, 17 + pulse * 5);

      for (let trail = 0; trail < 5; trail += 1) {
        const t = trail / 5;
        meteorBody.fillStyle(0x3b342e, smokeAlpha * (1 - t) * 0.62);
        meteorBody.fillCircle(incomingX - 14 - trail * 10, incomingY - 22 - trail * 22, 14 + trail * 4);
        meteorBody.fillStyle(0xff6a1f, (0.55 - t * 0.08) * (1 - progress * 0.2));
        meteorBody.fillCircle(incomingX - 5 - trail * 6, incomingY - 14 - trail * 16, 8 + trail * 2);
      }

      meteorBody.lineStyle(5, 0xff8a2a, 0.72);
      meteorBody.beginPath();
      meteorBody.moveTo(incomingX - 36, incomingY - 86);
      meteorBody.lineTo(incomingX - 8, incomingY - 22);
      meteorBody.strokePath();
      meteorBody.fillStyle(0xff3d16, 0.96);
      meteorBody.fillCircle(incomingX, incomingY, 15);
      meteorBody.fillStyle(0xffd777, 0.82);
      meteorBody.fillCircle(incomingX - 4, incomingY - 5, 8);
      meteorBody.fillStyle(0x2a211c, 0.95);
      meteorBody.fillCircle(incomingX + 3, incomingY + 4, 7);
    };
    drawWarning();
    const repeatDraw = () => {
      drawWarning();
      if (meteor.warning && !meteor.impacted) {
        meteor.drawEvent = this.scene.time.delayedCall(120, repeatDraw);
      }
    };
    meteor.drawEvent = this.scene.time.delayedCall(120, repeatDraw);

    meteor.impactEvent = this.scene.time.delayedCall(this.config.warningMs, () => this.impact(meteor));
  }

  impact(meteor) {
    meteor.impacted = true;
    this.pending = this.pending.filter((item) => item !== meteor);
    meteor.drawEvent?.remove?.();
    this.scene.tweens.killTweensOf?.(meteor.warning);
    meteor.warning?.destroy?.();
    meteor.meteorBody?.destroy?.();

    const { x, y } = this.map.cellToWorld(meteor.col, meteor.row);
    const impact = this.scene.add.graphics().setDepth(10);
    impact.fillStyle(0xff3d16, 0.68);
    impact.fillCircle(x, y, 28);
    impact.fillStyle(0xffd777, 0.56);
    impact.fillCircle(x - 4, y - 5, 14);
    impact.fillStyle(0x2e2925, 0.38);
    impact.fillCircle(x - 18, y - 18, 18);
    impact.fillCircle(x + 20, y - 12, 16);
    impact.fillCircle(x + 2, y + 18, 20);
    impact.lineStyle(5, 0xff8a2a, 0.78);
    impact.strokeCircle(x, y, 30);
    impact.lineStyle(2, 0x2a211c, 0.72);
    impact.beginPath();
    impact.moveTo(x - 30, y + 8);
    impact.lineTo(x + 30, y - 8);
    impact.moveTo(x - 18, y - 22);
    impact.lineTo(x + 18, y + 24);
    impact.strokePath();
    this.scene.tweens.add({
      targets: impact,
      alpha: 0,
      duration: Math.min(180, this.config.impactMs),
      onComplete: () => impact.destroy(),
    });

    this.items.removeAt(meteor.col, meteor.row);
    if (this.map.destroyBox(meteor.col, meteor.row)) {
      this.scene.time.delayedCall(this.config.impactMs + 20, () => this.items.maybeDrop(meteor.col, meteor.row));
    }

    const key = keyOf(meteor.col, meteor.row);
    this.activeImpacts.set(key, {
      id: this.nextImpactId++,
      col: meteor.col,
      row: meteor.row,
      hitActors: new Set(),
    });
    this.map.markExplosion(meteor.col, meteor.row);
    this.checkImpactHits();
    this.scene.time.delayedCall(this.config.impactMs, () => {
      this.activeImpacts.delete(key);
      this.map.clearExplosion(meteor.col, meteor.row);
    });
  }

  checkImpactHits() {
    if (!this.activeImpacts.size) return;
    if (this.registry) {
      this.registry.alive().forEach((actor) => {
        const actorCell = actor.currentCell?.() || this.ai.currentCell?.(actor);
        if (!actorCell) return;
        const impact = this.activeImpacts.get(keyOf(actorCell.col, actorCell.row));
        if (!impact || impact.hitActors.has(actor.ownerId)) return;
        impact.hitActors.add(actor.ownerId);
        actor.takeDamage?.(COMBAT_CONFIG.meteorDamage, "meteor");
      });
      return;
    }
    if (this.player.alive) {
      const playerCell = this.player.currentCell();
      const impact = this.activeImpacts.get(keyOf(playerCell.col, playerCell.row));
      if (impact && !impact.hitActors.has("player")) {
        impact.hitActors.add("player");
        this.player.takeDamage?.(COMBAT_CONFIG.meteorDamage, "meteor");
      }
    }

    this.ai.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      const enemyCell = this.ai.currentCell(enemy);
      const impact = this.activeImpacts.get(keyOf(enemyCell.col, enemyCell.row));
      const actorKey = enemy.ownerId || `enemy-${this.ai.enemies.indexOf(enemy)}`;
      if (impact && !impact.hitActors.has(actorKey)) {
        impact.hitActors.add(actorKey);
        this.ai.damageEnemy?.(enemy, COMBAT_CONFIG.meteorDamage, "meteor");
      }
    });
  }
}
