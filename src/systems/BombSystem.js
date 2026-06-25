import { GAME_CONFIG } from "../config.js";

export class BombSystem {
  constructor(scene, mapSystem) {
    this.scene = scene;
    this.map = mapSystem;
    this.explosionSystem = null;
    this.activeByOwner = new Map();
  }

  setExplosionSystem(explosionSystem) {
    this.explosionSystem = explosionSystem;
  }

  activeCount(ownerId) {
    return this.activeByOwner.get(ownerId) || 0;
  }

  placeBomb(ownerId, col, row, range, maxBombs, options = {}) {
    if (this.map.hasBomb(col, row) || this.map.isBlocked(col, row)) return null;
    if (this.activeCount(ownerId) >= maxBombs) return null;

    const { x, y } = this.map.cellToWorld(col, row);
    const texture = options.texture || this.map.mapConfig?.textures?.bomb || "bomb";
    const sprite = this.scene.add.image(x, y, texture).setDepth(5);
    this.scene.tweens.add({
      targets: sprite,
      scale: 1.12,
      duration: 360,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    const animation = this.map.mapConfig?.bombAnimation;
    if (animation) {
      this.scene.tweens.add({
        targets: sprite,
        angle: animation.rotation,
        duration: animation.durationMs,
        repeat: -1,
        ease: "Linear",
      });
    }

    const bomb = {
      ownerId,
      col,
      row,
      range: options.rangeOverride ?? range,
      sprite,
      exploded: false,
      explodeAt: this.scene.time.now + (options.fuseMs ?? GAME_CONFIG.BOMB_DELAY),
      explosionDurationMs: options.explosionDurationMs ?? GAME_CONFIG.EXPLOSION_DURATION,
      tags: options.tags || [],
    };
    this.map.placeBomb(col, row, bomb);
    this.activeByOwner.set(ownerId, this.activeCount(ownerId) + 1);
    this.scene.time.delayedCall(options.fuseMs ?? GAME_CONFIG.BOMB_DELAY, () => this.explode(bomb));
    return bomb;
  }

  explode(bomb) {
    if (!bomb || bomb.exploded) return;
    bomb.exploded = true;
    this.map.removeBomb(bomb.col, bomb.row);
    this.activeByOwner.set(bomb.ownerId, Math.max(0, this.activeCount(bomb.ownerId) - 1));
    this.scene.tweens.killTweensOf(bomb.sprite);
    bomb.sprite.destroy();
    this.explosionSystem.createExplosion(bomb.col, bomb.row, bomb.range, bomb.explosionDurationMs);
  }

  predictedDangerCells(extraBomb = null) {
    return new Set(this.predictedDangerMap(extraBomb).keys());
  }

  predictedDangerMap(extraBomb = null) {
    const now = this.scene.time.now;
    const danger = new Set();
    const timings = new Map();
    const bombs = [];
    this.map.bombs.forEach((bomb) => bombs.push(bomb));
    if (extraBomb) {
      bombs.push({
        ...extraBomb,
        explodeAt: extraBomb.explodeAt ?? now + GAME_CONFIG.BOMB_DELAY,
      });
    }
    bombs.forEach((bomb) => {
      const markDanger = (col, row) => {
        const key = `${col},${row}`;
        danger.add(key);
        const explodeAt = bomb.explodeAt ?? now + GAME_CONFIG.BOMB_DELAY;
        const previous = timings.get(key);
        if (!previous || explodeAt < previous.explodeAt) {
          timings.set(key, { explodeAt, bomb });
        }
      };

      markDanger(bomb.col, bomb.row);
      [
        { col: 1, row: 0 },
        { col: -1, row: 0 },
        { col: 0, row: 1 },
        { col: 0, row: -1 },
      ].forEach((dir) => {
        for (let step = 1; step <= bomb.range; step += 1) {
          const col = bomb.col + dir.col * step;
          const row = bomb.row + dir.row * step;
          const cell = this.map.getCell(col, row);
          if (cell === 1) break;
          markDanger(col, row);
          if (cell === 2) break;
        }
      });
    });
    return timings;
  }
}
