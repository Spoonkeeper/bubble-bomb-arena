import { COMBAT_CONFIG, ENEMY_TYPES, GAME_CONFIG, SPAWN_POINTS } from "../config.js";
import {
  applyDamage,
  clearSlow,
  grantTimedShield,
  initializeCombatState,
  markOffense,
  regenerateHealth,
  updateCombatVisuals,
} from "./CombatSystem.js";

const DIRECTIONS = [
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: -1 },
];

const ENEMY_RADIUS = 13;
const keyOf = (col, row) => `${col},${row}`;

export class AISystem {
  constructor(scene, mapSystem, bombSystem, playerSystem, itemSystem, options = {}) {
    this.scene = scene;
    this.map = mapSystem;
    this.bombs = bombSystem;
    this.players = Array.isArray(playerSystem) ? playerSystem : [playerSystem].filter(Boolean);
    this.player = this.players[0] || null;
    this.items = itemSystem;
    this.aiCount = options.aiCount ?? GAME_CONFIG.ENEMY_COUNT;
    this.registry = options.registry || null;
    this.enemies = [];
    this.meteorSystem = null;
    this.heroAbilitySystem = null;
    this.portalSystem = null;
  }

  setMeteorSystem(meteorSystem) {
    this.meteorSystem = meteorSystem;
  }

  setPortalSystem(portalSystem) {
    this.portalSystem = portalSystem;
  }

  setHeroAbilitySystem(heroAbilitySystem) {
    this.heroAbilitySystem = heroAbilitySystem;
    this.heroAbilitySystems = Array.isArray(heroAbilitySystem) ? heroAbilitySystem : [heroAbilitySystem].filter(Boolean);
  }

  abilitySystems() {
    return this.heroAbilitySystems || [this.heroAbilitySystem].filter(Boolean);
  }

  create() {
    const spawnCells = SPAWN_POINTS.aiByPlayerCount?.[this.players.length] || SPAWN_POINTS.enemies;
    spawnCells.slice(0, this.aiCount).forEach((cell, index) => {
      const type = ENEMY_TYPES[index % ENEMY_TYPES.length];
      const { x, y } = this.map.cellToWorld(cell.col, cell.row);
      const texture = this.map.mapConfig?.enemyTextures?.[index] || type.texture;
      const sprite = this.scene.add.image(x, y, texture).setDepth(6);
      const enemy = {
        ownerId: `enemy-${index}`,
        hero: { id: "enemy" },
        sprite,
        direction: { col: 0, row: 0 },
        directionTimer: 0,
        mode: "scout",
        baseSpeed: 68 + index * 8,
        alive: true,
        stats: { speed: 1, maxBombs: 1, blastRange: 2, shield: 0 },
        bombCooldown: 700 + index * 500,
        ignoredBombKey: null,
        fleeBombKey: null,
        fleeBombUntil: 0,
        escapeUntil: 0,
        invulnerableUntil: 0,
      };
      initializeCombatState(enemy, 0);
      enemy.grantShield = () => grantTimedShield(enemy, this.scene, this.scene.time.now);
      enemy.currentCell = () => this.currentCell(enemy);
      enemy.takeDamage = (amount, reason) => this.damageEnemy(enemy, amount, reason);
      this.enemies.push(enemy);
      this.registry?.register?.(enemy, { kind: "ai", slot: index });
    });
  }

  update(time, delta) {
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      regenerateHealth(enemy, this.scene, delta);
      updateCombatVisuals(enemy, this.scene);

      const current = this.currentCell(enemy);
      if (this.items.pickupByActor(current.col, current.row, enemy, "enemy-item-picked")) {
        this.scene.events.emit("enemy-powered-up");
      }

      const dangerMap = this.predictedDangerMap();
      const danger = new Set(dangerMap.keys());
      const currentIsDanger = this.isDanger(current, danger);
      const waitingOnOwnBomb = enemy.fleeBombKey && time < enemy.fleeBombUntil;
      if (currentIsDanger) {
        this.enterFleeMode(enemy, current, dangerMap, time);
      } else if (enemy.mode === "flee" && waitingOnOwnBomb) {
        this.applyDirection(enemy, { col: 0, row: 0 }, 160);
      } else if (enemy.mode === "flee") {
        enemy.mode = "hunt";
        enemy.fleeBombKey = null;
        enemy.fleeBombUntil = 0;
        enemy.escapeUntil = 0;
      }

      const emberEscape = currentIsDanger ? null : this.findEmberEscapeDirection(enemy, current, danger);
      if (emberEscape) {
        enemy.mode = "ember-flee";
        this.applyDirection(enemy, emberEscape, 140);
      }

      const abilityEscape = currentIsDanger || emberEscape ? null : this.findHeroAbilityEscapeDirection(enemy, current, danger);
      if (abilityEscape) {
        enemy.mode = "skill-flee";
        this.applyDirection(enemy, abilityEscape, 120);
      }

      const escapePlan = currentIsDanger || emberEscape || abilityEscape ? null : this.findEscapePlanAfterBomb(enemy, current, time);
      if (!currentIsDanger && !emberEscape && !abilityEscape && this.shouldPlantBomb(enemy, current, time, escapePlan)) {
        const bomb = this.bombs.placeBomb(
          enemy.ownerId,
          current.col,
          current.row,
          enemy.stats.blastRange,
          enemy.stats.maxBombs,
        );
        if (bomb) {
          markOffense(enemy, time);
          enemy.ignoredBombKey = keyOf(current.col, current.row);
          enemy.fleeBombKey = keyOf(current.col, current.row);
          enemy.fleeBombUntil = time + GAME_CONFIG.BOMB_DELAY + GAME_CONFIG.EXPLOSION_DURATION;
          enemy.bombCooldown = time + Phaser.Math.Between(2200, 3600);
          enemy.mode = "flee";
          enemy.escapeUntil = time + 500;
          this.applyDirection(enemy, escapePlan.direction, 120);
          this.scene.events.emit("enemy-bomb-placed");
        }
      }

      enemy.directionTimer -= delta;
      if (enemy.directionTimer <= 0) {
        this.planDirection(enemy, time);
      }

      if (this.moveEnemy(enemy, delta)) {
        this.planDirection(enemy, time);
      }
    });
  }

  currentCell(enemy) {
    return this.map.worldToCell(enemy.sprite.x, enemy.sprite.y);
  }

  predictedDangerMap(extraBomb = null) {
    const dangerMap = this.bombs.predictedDangerMap(extraBomb);
    this.meteorSystem?.pendingDangerMap?.().forEach((hazard, key) => {
      const existing = dangerMap.get(key);
      if (!existing || hazard.explodeAt < existing.explodeAt) {
        dangerMap.set(key, hazard);
      }
    });
    this.abilitySystems().forEach((ability) => {
      ability.pendingVoltMeteorDangerMap?.().forEach((hazard, key) => {
        const existing = dangerMap.get(key);
        if (!existing || hazard.explodeAt < existing.explodeAt) dangerMap.set(key, hazard);
      });
    });
    return dangerMap;
  }

  predictedDangerCells(extraBomb = null) {
    return new Set(this.predictedDangerMap(extraBomb).keys());
  }

  planDirection(enemy, time) {
    const current = this.currentCell(enemy);
    const dangerMap = this.predictedDangerMap();
    const danger = new Set(dangerMap.keys());
    if (this.isDanger(current, danger)) {
      this.enterFleeMode(enemy, current, dangerMap, time);
      return;
    }

    const emberEscape = this.findEmberEscapeDirection(enemy, current, danger);
    if (emberEscape) {
      enemy.mode = "ember-flee";
      this.applyDirection(enemy, emberEscape, 140);
      return;
    }

    const abilityEscape = this.findHeroAbilityEscapeDirection(enemy, current, danger);
    if (abilityEscape) {
      enemy.mode = "skill-flee";
      this.applyDirection(enemy, abilityEscape, 120);
      return;
    }

    const targets = this.listTargets(enemy);
    const attackStep = this.findAttackStep(enemy, current, targets, danger);
    if (attackStep) {
      enemy.mode = "hunt";
      this.applyDirection(enemy, attackStep, 140);
      return;
    }

    const item = this.findPreferredItem(enemy, current);
    if (item) {
      enemy.mode = "scout";
      const direction =
        this.findStep(
          current,
          (cell) => cell.col === item.col && cell.row === item.row,
          danger,
          enemy.ignoredBombKey,
          10,
        ) || this.findSafeNeighbor(current, danger, enemy.ignoredBombKey) || { col: 0, row: 0 };
      this.applyDirection(enemy, direction, 220);
      return;
    }

    if (this.canClearBoxNow(enemy, current, time)) {
      enemy.mode = "clear";
      this.applyDirection(enemy, { col: 0, row: 0 }, 180);
      return;
    }

    const boxStep = this.findStep(
      current,
      (cell) => this.canPrepareBoxAttack(enemy, cell),
      danger,
      enemy.ignoredBombKey,
      12,
    );
    enemy.mode = "scout";
    this.applyDirection(
      enemy,
      boxStep || this.findSafeNeighbor(current, danger, enemy.ignoredBombKey) || { col: 0, row: 0 },
      boxStep ? 240 : 150,
    );
  }

  enterFleeMode(enemy, current, dangerMap, time) {
    enemy.mode = "flee";
    enemy.escapeUntil = time + 450;
    const danger = new Set(dangerMap.keys());
    const portalGroup = this.portalSystem?.groupForCell?.(current);
    const portalDestination = this.portalSystem?.pairedDestination?.(current);
    const currentHazard = dangerMap.get(keyOf(current.col, current.row));
    if (
      portalGroup &&
      portalDestination &&
      this.portalSystem.canPlanThrough(portalGroup.id) &&
      this.isPortalDestinationSafe(portalDestination, danger) &&
      (!currentHazard || currentHazard.explodeAt > time + this.portalSystem.config.channelMs + 100)
    ) {
      this.applyDirection(enemy, { col: 0, row: 0 }, 120);
      return;
    }
    const escapePlan = this.findTimedEscapePlan(enemy, current, dangerMap, time);
    this.applyDirection(
      enemy,
      escapePlan?.direction ||
        this.findEscapeStep(current, danger, enemy.ignoredBombKey, 10) ||
        this.findSafeNeighbor(current, danger, enemy.ignoredBombKey) ||
        { col: 0, row: 0 },
      90,
    );
  }

  findEmberEscapeDirection(enemy, current, danger) {
    const ability = this.abilitySystems().find((item) => item.emberThreatFor?.(enemy)?.inside);
    const threat = ability?.emberThreatFor?.(enemy);
    if (!threat?.inside) return null;

    return (
      this.findStep(
        current,
        (cell) => !ability.isCellInsideEmberAura(cell),
        danger,
        enemy.ignoredBombKey,
        Math.max(8, (threat.radiusTiles || 5) + 4),
      ) ||
      this.findSafeNeighborAwayFromEmber(current, danger, enemy.ignoredBombKey) ||
      null
    );
  }

  findHeroAbilityEscapeDirection(enemy, current, danger) {
    const shadowAbility = this.abilitySystems().find((item) => item.shadowBeamThreatFor?.(enemy)?.inside);
    const shadowThreat = shadowAbility?.shadowBeamThreatFor?.(enemy);
    if (shadowThreat?.inside) {
      return (
        this.findStep(
          current,
          (cell) => !shadowAbility.isCellInsideShadowBeam(cell),
          danger,
          enemy.ignoredBombKey,
          8,
        ) ||
        this.findSafeNeighborAwayFromHeroAbility(current, danger, enemy.ignoredBombKey) ||
        null
      );
    }

    const windAbility = this.abilitySystems().find((item) => item.windThreatFor?.(enemy)?.inside);
    const windThreat = windAbility?.windThreatFor?.(enemy);
    if (windThreat?.inside) {
      return (
        this.findStep(
          current,
          (cell) => !windAbility.isCellInsideWindThreat(cell),
          danger,
          enemy.ignoredBombKey,
          6,
        ) ||
        this.findSafeNeighborAwayFromHeroAbility(current, danger, enemy.ignoredBombKey) ||
        null
      );
    }

    return null;
  }

  findSafeNeighborAwayFromHeroAbility(current, danger, ignoreKey) {
    return (
      DIRECTIONS.find((dir) => {
        const next = { col: current.col + dir.col, row: current.row + dir.row };
        return (
          !this.map.isBlocked(next.col, next.row, ignoreKey) &&
          !this.isDanger(next, danger) &&
          this.abilitySystems().every((ability) =>
            !ability.isCellInsideShadowBeam?.(next) && !ability.isCellInsideWindThreat?.(next))
        );
      }) || null
    );
  }

  findPreferredItem(enemy, current) {
    const wantsShield = !enemy.shieldActive || enemy.hp <= 70;
    let shield = null;
    if (wantsShield) {
      this.items.items?.forEach?.((item) => {
        if (item.type?.id !== "shield") return;
        const distance = Math.abs(item.col - current.col) + Math.abs(item.row - current.row);
        if (distance <= 8 && (!shield || distance < shield.distance)) {
          shield = { ...item, distance };
        }
      });
    }
    return shield || this.items.nearest(current, 6);
  }

  findSafeNeighborAwayFromEmber(current, danger, ignoreKey) {
    return (
      DIRECTIONS.find((dir) => {
        const next = { col: current.col + dir.col, row: current.row + dir.row };
        return (
          !this.map.isBlocked(next.col, next.row, ignoreKey) &&
          !this.isDanger(next, danger) &&
          this.abilitySystems().every((ability) => !ability.isCellInsideEmberAura?.(next))
        );
      }) || null
    );
  }

  moveEnemy(enemy, delta) {
    const { col, row } = enemy.direction;
    if (col === 0 && row === 0) {
      this.releaseIgnoredBomb(enemy);
      return false;
    }

    const speedMultiplier = enemy.slowMultiplier || 1;
    const step = ((enemy.baseSpeed + enemy.stats.speed * 18) * speedMultiplier * delta) / 1000;
    let moved = false;
    this.refreshIgnoredBombFromOverlap(enemy);
    const nextX = enemy.sprite.x + col * step;
    const nextY = enemy.sprite.y + row * step;

    if (col !== 0 && this.map.canMoveToWorld(nextX, enemy.sprite.y, ENEMY_RADIUS, enemy.ignoredBombKey)) {
      enemy.sprite.x = nextX;
      moved = true;
    }
    if (row !== 0 && this.map.canMoveToWorld(enemy.sprite.x, nextY, ENEMY_RADIUS, enemy.ignoredBombKey)) {
      enemy.sprite.y = nextY;
      moved = true;
    }

    this.releaseIgnoredBomb(enemy);
    return !moved;
  }

  releaseIgnoredBomb(enemy) {
    if (
      enemy.ignoredBombKey &&
      !this.map.overlapsCellWorld(enemy.sprite.x, enemy.sprite.y, ENEMY_RADIUS, enemy.ignoredBombKey)
    ) {
      enemy.ignoredBombKey = null;
    }
  }

  refreshIgnoredBombFromOverlap(enemy) {
    if (enemy.ignoredBombKey) return;
    const overlappedBombKey = this.map.overlappedBombKeyWorld?.(enemy.sprite.x, enemy.sprite.y, ENEMY_RADIUS);
    if (overlappedBombKey) {
      enemy.ignoredBombKey = overlappedBombKey;
    }
  }

  applyDirection(enemy, direction, timer) {
    const current = this.currentCell(enemy);
    const center = this.map.cellToWorld(current.col, current.row);
    if (direction.col !== 0 && direction.row === 0) {
      enemy.sprite.y = center.y;
    } else if (direction.row !== 0 && direction.col === 0) {
      enemy.sprite.x = center.x;
    }
    enemy.direction = direction;
    enemy.directionTimer = timer;
  }

  findAttackStep(enemy, current, targets, danger) {
    for (const target of targets) {
      if (!target?.alive) continue;
      const setupStep = this.findStep(
        current,
        (cell) => this.isAttackCell(cell, target, enemy, danger),
        danger,
        enemy.ignoredBombKey,
        12,
      );
      if (setupStep) return setupStep;
    }

    const bestOption = targets
      .filter((target) => target?.alive)
      .map((target) => this.bestCombatDirection(enemy, current, target, danger))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)[0];

    return bestOption?.dir || null;
  }

  bestCombatDirection(enemy, current, target, danger) {
    const currentDistance = Math.abs(current.col - target.cell.col) + Math.abs(current.row - target.cell.row);
    const canPressureFromCurrent =
      this.canHitTargetFrom(current, target.cell, enemy.stats.blastRange) ||
      this.nearCell(current, target.cell, target.kind === "player" ? 1 : 2);
    const options = [...DIRECTIONS, { col: 0, row: 0 }]
      .filter((dir) => {
        if (dir.col === 0 && dir.row === 0) {
          return canPressureFromCurrent;
        }
        return !this.map.isBlocked(current.col + dir.col, current.row + dir.row, enemy.ignoredBombKey);
      })
      .map((dir) => {
        const next = { col: current.col + dir.col, row: current.row + dir.row };
        const distance = Math.abs(next.col - target.cell.col) + Math.abs(next.row - target.cell.row);
        const safeBonus = this.isDanger(next, danger) ? -1000 : 0;
        const lineBonus = this.canHitTargetFrom(next, target.cell, enemy.stats.blastRange) ? 30 : 0;
        const closeBonus = this.nearCell(next, target.cell, target.kind === "player" ? 1 : 2) ? 16 : 0;
        const stayPenalty = dir.col === 0 && dir.row === 0 ? -6 : 0;
        return {
          dir,
          target,
          distance,
          score: safeBonus + lineBonus + closeBonus - distance * 7 + stayPenalty,
        };
      })
      .sort((a, b) => b.score - a.score);

    if (!canPressureFromCurrent) {
      const hasNonWorseningMove = options.some(
        (option) => (option.dir.col !== 0 || option.dir.row !== 0) && option.distance <= currentDistance,
      );
      if (!hasNonWorseningMove) return null;
    }

    return options[0] || null;
  }

  shouldPlantBomb(enemy, current, time, escapePlan) {
    if (time < enemy.bombCooldown || this.bombs.activeCount(enemy.ownerId) >= enemy.stats.maxBombs) return false;
    if (!escapePlan || this.isDanger(current, this.predictedDangerCells())) return false;

    const targets = this.listTargets(enemy);
    for (const target of targets) {
      if (!target?.alive) continue;
      if (this.canHitTargetFrom(current, target.cell, enemy.stats.blastRange)) return true;
      if (target.kind === "player" && this.nearCell(current, target.cell, 1)) return true;
      if (target.kind !== "player" && this.nearCell(current, target.cell, 2)) return true;
    }

    return this.adjacentBoxAny(current);
  }

  findStep(start, predicate, danger, ignoreKey, maxDepth, allowDangerTransit = false) {
    const queue = [{ ...start, depth: 0, first: null }];
    const seen = new Set([keyOf(start.col, start.row)]);

    while (queue.length) {
      const cell = queue.shift();
      if (cell.depth > 0 && predicate(cell)) return cell.first;
      if (cell.depth >= maxDepth) continue;

      DIRECTIONS.forEach((dir) => {
        const next = {
          col: cell.col + dir.col,
          row: cell.row + dir.row,
          depth: cell.depth + 1,
          first: cell.first || dir,
        };
        const nextKey = keyOf(next.col, next.row);
        if (seen.has(nextKey) || this.map.isBlocked(next.col, next.row, ignoreKey)) return;
        if (!allowDangerTransit && danger.has(nextKey) && !predicate(next)) return;
        seen.add(nextKey);
        queue.push(next);
      });

      const portalGroup = this.portalSystem?.groupForCell?.(cell);
      const portalDestination = this.portalSystem?.pairedDestination?.(cell);
      if (
        portalGroup &&
        portalDestination &&
        this.portalSystem.canPlanThrough(portalGroup.id) &&
        this.isPortalDestinationSafe(portalDestination, danger)
      ) {
        const destinationKey = keyOf(portalDestination.col, portalDestination.row);
        if (!seen.has(destinationKey)) {
          seen.add(destinationKey);
          queue.push({
            ...portalDestination,
            depth: cell.depth + 1,
            first: cell.first || { col: 0, row: 0 },
          });
        }
      }
    }

    return null;
  }

  isPortalDestinationSafe(cell, danger = new Set()) {
    if (!this.portalSystem?.isDestinationSafe?.(cell, danger)) return false;
    return this.abilitySystems().every((ability) => (
      !ability.isCellInsideEmberAura?.(cell) &&
      !ability.isCellInsideShadowBeam?.(cell) &&
      !ability.isCellInsideWindThreat?.(cell)
    ));
  }

  findEscapeStep(start, danger, ignoreKey, maxDepth) {
    const quick = this.findSafeNeighbor(start, danger, ignoreKey);
    if (quick) return quick;

    const queue = [{ ...start, depth: 0, first: null }];
    const seen = new Set([keyOf(start.col, start.row)]);
    let best = null;

    while (queue.length) {
      const cell = queue.shift();
      if (cell.depth > 0 && !this.isDanger(cell, danger)) return cell.first;
      if (!best || cell.depth > best.depth) best = cell;
      if (cell.depth >= maxDepth) continue;

      DIRECTIONS.forEach((dir) => {
        const next = {
          col: cell.col + dir.col,
          row: cell.row + dir.row,
          depth: cell.depth + 1,
          first: cell.first || dir,
        };
        const nextKey = keyOf(next.col, next.row);
        if (seen.has(nextKey) || this.map.isBlocked(next.col, next.row, ignoreKey)) return;
        if (this.map.hasExplosionAt(next.col, next.row)) return;
        seen.add(nextKey);
        queue.push(next);
      });
    }

    return best?.first || null;
  }

  findSafeNeighbor(cell, danger, ignoreKey) {
    return (
      DIRECTIONS.find((dir) => {
        const next = { col: cell.col + dir.col, row: cell.row + dir.row };
        return !this.map.isBlocked(next.col, next.row, ignoreKey) && !this.isDanger(next, danger);
      }) || null
    );
  }

  hasEscapeRouteAfterBomb(enemy, origin) {
    return !!this.findEscapePlanAfterBomb(enemy, origin, this.scene.time.now);
  }

  findEscapePlanAfterBomb(enemy, origin, time) {
    const dangerMap = this.predictedDangerMap({
      col: origin.col,
      row: origin.row,
      range: enemy.stats.blastRange,
      explodeAt: time + GAME_CONFIG.BOMB_DELAY,
    });
    return this.findTimedEscapePlan(enemy, origin, dangerMap, time, keyOf(origin.col, origin.row));
  }

  findTimedEscapePlan(enemy, origin, dangerMap, startTime, ignoreKey = enemy.ignoredBombKey) {
    const startKey = keyOf(origin.col, origin.row);
    const tileTravelMs = this.tileTravelTime(enemy);
    const deadlineBuffer = 80;
    const queue = [{ col: origin.col, row: origin.row, depth: 0, first: null }];
    const seen = new Set([startKey]);

    while (queue.length) {
      const cell = queue.shift();
      const arrivalAt = startTime + cell.depth * tileTravelMs;
      const hazard = dangerMap.get(keyOf(cell.col, cell.row));
      const canTransitHere = !hazard || hazard.explodeAt > arrivalAt + deadlineBuffer;
      if (cell.depth > 0 && !hazard) {
        return {
          direction: cell.first,
          steps: cell.depth,
          safeAt: arrivalAt,
        };
      }
      if (!canTransitHere) continue;

      DIRECTIONS.forEach((dir) => {
        const next = {
          col: cell.col + dir.col,
          row: cell.row + dir.row,
          depth: cell.depth + 1,
          first: cell.first || dir,
        };
        const nextKey = keyOf(next.col, next.row);
        if (seen.has(nextKey) || this.map.isBlocked(next.col, next.row, ignoreKey)) return;
        if (this.map.hasExplosionAt(next.col, next.row)) return;

        const nextArrivalAt = startTime + next.depth * tileTravelMs;
        const nextHazard = dangerMap.get(nextKey);
        if (nextHazard && nextHazard.explodeAt <= nextArrivalAt + deadlineBuffer) return;

        seen.add(nextKey);
        queue.push(next);
      });
    }

    return null;
  }

  findDirectEscapePlan(enemy, origin, dangerMap, startTime, ignoreKey = enemy.ignoredBombKey) {
    const tileTravelMs = this.tileTravelTime(enemy);
    const deadlineBuffer = 80;
    const maxDepth = 8;

    for (const direction of DIRECTIONS) {
      for (let step = 1; step <= maxDepth; step += 1) {
        const col = origin.col + direction.col * step;
        const row = origin.row + direction.row * step;
        if (this.map.isBlocked(col, row, ignoreKey) || this.map.hasExplosionAt(col, row)) break;

        const arrivalAt = startTime + step * tileTravelMs;
        const hazard = dangerMap.get(keyOf(col, row));
        if (hazard && hazard.explodeAt <= arrivalAt + deadlineBuffer) break;
        if (!hazard) {
          return {
            direction,
            steps: step,
            safeAt: arrivalAt,
          };
        }
      }
    }

    return null;
  }

  tileTravelTime(enemy) {
    const pixelsPerSecond = (enemy.baseSpeed + enemy.stats.speed * 18) * (enemy.slowMultiplier || 1);
    return (GAME_CONFIG.TILE_SIZE / pixelsPerSecond) * 1000;
  }

  isAttackCell(cell, target, enemy, danger = this.predictedDangerCells()) {
    if (!target?.alive || this.isDanger(cell, danger)) return false;
    if (!this.hasEscapeRouteAfterBomb(enemy, cell)) return false;
    return (
      this.canHitTargetFrom(cell, target.cell, enemy.stats.blastRange) ||
      this.nearCell(cell, target.cell, target.kind === "player" ? 1 : 2)
    );
  }

  listTargets(enemy) {
    const current = this.currentCell(enemy);
    const targets = [];
    this.players.filter((player) => player.alive).forEach((player) => {
      const cell = player.currentCell();
      targets.push({
        ownerId: player.ownerId,
        kind: "player",
        cell,
        alive: true,
        distance: Math.abs(cell.col - current.col) + Math.abs(cell.row - current.row),
      });
    });

    const others = this.enemies
      .filter((other) => other !== enemy && other.alive)
      .map((other) => {
        const cell = this.currentCell(other);
        return {
          ownerId: other.ownerId,
          kind: "enemy",
          cell,
          alive: true,
          distance: Math.abs(cell.col - current.col) + Math.abs(cell.row - current.row),
        };
      });

    return [...targets, ...others].sort((a, b) => a.distance - b.distance);
  }

  pickTarget(enemy) {
    return this.listTargets(enemy)[0] || null;
  }

  isCombatTarget(target) {
    return !!target;
  }

  nearCell(cell, target, distance) {
    return Math.abs(cell.col - target.col) + Math.abs(cell.row - target.row) <= distance;
  }

  canHitTargetFrom(cell, target, range) {
    if (target.col !== cell.col && target.row !== cell.row) return false;

    const deltaCol = Math.sign(target.col - cell.col);
    const deltaRow = Math.sign(target.row - cell.row);
    const distance = Math.abs(target.col - cell.col) + Math.abs(target.row - cell.row);
    if (distance > range) return false;

    for (let step = 1; step <= distance; step += 1) {
      const col = cell.col + deltaCol * step;
      const row = cell.row + deltaRow * step;
      const mapCell = this.map.getCell(col, row);
      if (mapCell === 1 || mapCell === 2) return false;
    }

    return true;
  }

  adjacentBoxAny(cell) {
    return DIRECTIONS.some((dir) => this.map.getCell(cell.col + dir.col, cell.row + dir.row) === 2);
  }

  canPrepareBoxAttack(enemy, cell) {
    return this.adjacentBoxAny(cell) && this.hasEscapeRouteAfterBomb(enemy, cell);
  }

  canClearBoxNow(enemy, current, time) {
    return (
      this.canPrepareBoxAttack(enemy, current) &&
      time >= enemy.bombCooldown &&
      this.bombs.activeCount(enemy.ownerId) < enemy.stats.maxBombs
    );
  }

  isDanger(cell, predicted = this.bombs.predictedDangerCells()) {
    return this.map.hasExplosionAt(cell.col, cell.row) || predicted.has(keyOf(cell.col, cell.row));
  }

  hitEnemiesInExplosions(hitContext = null) {
    let changed = false;
    this.enemies.forEach((enemy) => {
      if (!enemy.alive) return;
      const cell = this.currentCell(enemy);
      if (!this.map.hasExplosionAt(cell.col, cell.row)) return;
      if (hitContext?.canHitActor && !hitContext.canHitActor(enemy.ownerId, cell)) return;
      const result = this.damageEnemy(enemy, COMBAT_CONFIG.bombDamage, "explosion", false);
      changed = result.defeated || changed;
    });

    if (changed) this.scene.events.emit("enemy-count-changed");
  }

  damageEnemy(enemy, amount, reason = "damage", emitEvent = true) {
    const result = applyDamage(enemy, amount, reason, this.scene);
    if (result.shielded) {
      enemy.mode = "flee";
      enemy.escapeUntil = this.scene.time.now + 450;
    }
    if (result.damaged && !result.defeated) {
      enemy.mode = "flee";
      enemy.escapeUntil = this.scene.time.now + 260;
    }
    if (result.defeated) {
      this.defeatEnemy(enemy, reason, emitEvent);
    }
    return result;
  }

  defeatEnemy(enemy, reason = "defeated", emitEvent = true) {
    if (!enemy?.alive) return false;
    enemy.alive = false;
    enemy.hp = 0;
    clearSlow(enemy);
    enemy.shieldEffect?.destroy?.();
    enemy.healthBarBg?.destroy?.();
    enemy.healthBarFill?.destroy?.();
    this.scene.tweens.killTweensOf(enemy.sprite);
    this.scene.tweens.add({
      targets: enemy.sprite,
      alpha: 0,
      scale: reason === "ember-aura" ? 1.6 : 1.45,
      angle: reason === "ember-aura" ? -18 : 20,
      duration: 180,
      onComplete: () => enemy.sprite.destroy(),
    });
    if (emitEvent) this.scene.events.emit("enemy-count-changed");
    if (emitEvent) this.scene.events.emit("combatant-defeated", enemy.ownerId);
    return true;
  }

  aliveCount() {
    return this.enemies.filter((enemy) => enemy.alive).length;
  }
}
