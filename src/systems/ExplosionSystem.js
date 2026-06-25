import { CELL, COMBAT_CONFIG, GAME_CONFIG } from "../config.js";

export class ExplosionSystem {
  constructor(scene, mapSystem, itemSystem) {
    this.scene = scene;
    this.map = mapSystem;
    this.items = itemSystem;
    this.playerSystem = null;
    this.playerSystems = [];
    this.aiSystem = null;
    this.registry = null;
    this.activeSprites = [];
    this.pendingDrops = [];
    this.activeImpacts = new Map();
    this.nextImpactId = 1;
  }

  connect(playerSystem, aiSystem, registry = null) {
    this.playerSystems = Array.isArray(playerSystem) ? playerSystem : [playerSystem].filter(Boolean);
    this.playerSystem = this.playerSystems[0] || null;
    this.aiSystem = aiSystem;
    this.registry = registry;
  }

  createExplosion(col, row, range, durationMs = GAME_CONFIG.EXPLOSION_DURATION) {
    this.pendingDrops = [];
    const cells = this.calculateCells(col, row, range);
    const impact = {
      id: this.nextImpactId++,
      cells: new Set(cells.map((cell) => `${cell.col},${cell.row}`)),
      hitActors: new Set(),
    };
    this.activeImpacts.set(impact.id, impact);
    cells.forEach((cell) => {
      this.items.removeAt(cell.col, cell.row);
      this.map.markExplosion(cell.col, cell.row);
      const { x, y } = this.map.cellToWorld(cell.col, cell.row);
      const texture = this.map.mapConfig?.textures?.explosion || "explosion";
      const sprite = this.scene.add.image(x, y, texture).setDepth(8).setScale(0.55).setAlpha(0.96);
      this.activeSprites.push(sprite);
      this.scene.tweens.add({
        targets: sprite,
        scale: 0.96,
        angle: this.map.mapConfig?.theme === "homeland" ? 28 : 12,
        alpha: 0.08,
        duration: durationMs,
        ease: "Quad.easeOut",
      });
      this.scene.time.delayedCall(durationMs, () => {
        this.map.clearExplosion(cell.col, cell.row);
        sprite.destroy();
      });
    });
    this.scene.time.delayedCall(durationMs, () => {
      this.activeImpacts.delete(impact.id);
    });
    this.pendingDrops.forEach((cell) => {
      this.scene.time.delayedCall(durationMs + 20, () => this.items.maybeDrop(cell.col, cell.row));
    });
    this.checkActiveHits();
  }

  calculateCells(col, row, range) {
    // Bubble blasts propagate in a cross. Solid walls stop the ray immediately;
    // breakable boxes are included, destroyed, and then stop that ray.
    const cells = [{ col, row }];
    const directions = [
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
    ];

    directions.forEach((dir) => {
      for (let step = 1; step <= range; step += 1) {
        const nextCol = col + dir.col * step;
        const nextRow = row + dir.row * step;
        const cell = this.map.getCell(nextCol, nextRow);
        if (cell === CELL.SOLID_WALL) break;
        cells.push({ col: nextCol, row: nextRow });
        if (cell === CELL.BREAKABLE_BOX) {
          if (this.map.destroyBox(nextCol, nextRow)) {
            this.pendingDrops.push({ col: nextCol, row: nextRow });
          }
          break;
        }
      }
    });

    return cells;
  }

  checkActiveHits() {
    if (this.registry) {
      this.registry.alive().forEach((actor) => {
        const cell = actor.currentCell?.() || this.aiSystem?.currentCell?.(actor);
        if (!cell) return;
        const impacts = [
          ...this.impactsAt(cell.col, cell.row),
          ...this.adjacentImpactsWhileActorPhasing(actor, cell),
        ];
        const impact = impacts.find((item) => !item.hitActors.has(actor.ownerId));
        if (!impact) return;
        impact.hitActors.add(actor.ownerId);
        if (actor.combatantKind === "player") actor.hitByExplosion?.();
        else actor.takeDamage?.(COMBAT_CONFIG.bombDamage, "explosion");
      });
      return;
    }
    if (!this.playerSystem || !this.aiSystem) return;
    const playerCell = this.playerSystem.currentCell();
    const playerImpacts = [
      ...this.impactsAt(playerCell.col, playerCell.row),
      ...this.adjacentImpactsWhilePhasing(playerCell),
    ];
    const playerImpact = playerImpacts.find((impact) => !impact.hitActors.has("player"));
    if (playerImpact) {
      playerImpact.hitActors.add("player");
      this.playerSystem.hitByExplosion();
    }
    this.aiSystem.hitEnemiesInExplosions({
      canHitActor: (actorId, cell) => {
        const impact = this.impactsAt(cell.col, cell.row).find((item) => !item.hitActors.has(actorId));
        if (!impact) return false;
        impact.hitActors.add(actorId);
        return true;
      },
    });
  }

  playerTouchesAdjacentExplosionWhilePhasing(playerCell) {
    if (!this.playerSystem.isPhasingThroughWalls?.()) return false;
    if (this.map.getCell(playerCell.col, playerCell.row) !== CELL.SOLID_WALL) return false;

    return [
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
    ].some((dir) => this.map.hasExplosionAt(playerCell.col + dir.col, playerCell.row + dir.row));
  }

  impactsAt(col, row) {
    const key = `${col},${row}`;
    return [...this.activeImpacts.values()].filter((impact) => impact.cells.has(key));
  }

  adjacentImpactsWhilePhasing(playerCell) {
    if (!this.playerSystem.isPhasingThroughWalls?.()) return [];
    if (this.map.getCell(playerCell.col, playerCell.row) !== CELL.SOLID_WALL) return [];

    return [
      { col: 1, row: 0 },
      { col: -1, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: -1 },
    ].flatMap((dir) => this.impactsAt(playerCell.col + dir.col, playerCell.row + dir.row));
  }

  adjacentImpactsWhileActorPhasing(actor, actorCell) {
    if (!actor.isPhasingThroughWalls?.()) return [];
    if (this.map.getCell(actorCell.col, actorCell.row) !== CELL.SOLID_WALL) return [];
    return [
      { col: 1, row: 0 }, { col: -1, row: 0 },
      { col: 0, row: 1 }, { col: 0, row: -1 },
    ].flatMap((dir) => this.impactsAt(actorCell.col + dir.col, actorCell.row + dir.row));
  }
}
