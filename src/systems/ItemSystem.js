import { CELL, ENERGY_ORB_CONFIG, GAME_CONFIG, ITEM_TYPES } from "../config.js";
import { getItemDisplay } from "../uiText.js";

const keyOf = (col, row) => `${col},${row}`;

export class ItemSystem {
  constructor(scene, mapSystem) {
    this.scene = scene;
    this.map = mapSystem;
    this.items = new Map();
    this.spawnConfig = mapSystem.mapConfig?.orbField || ENERGY_ORB_CONFIG;
    this.nextEnergyOrbAt = this.spawnConfig.spawnIntervalMs;
  }

  maybeDrop(col, row) {
    if (Math.random() > GAME_CONFIG.ITEM_DROP_RATE) return;
    const itemType = Phaser.Utils.Array.GetRandom(ITEM_TYPES);
    this.createItem(col, row, itemType);
  }

  createItem(col, row, itemType, options = {}) {
    const key = keyOf(col, row);
    if (this.items.has(key)) return;
    const { x, y } = this.map.cellToWorld(col, row);
    const texture = this.map.mapConfig?.itemTextures?.[itemType.id] || itemType.texture;
    const themedType = texture === itemType.texture ? itemType : { ...itemType, texture };
    const sprite = this.scene.add.image(x, y, themedType.texture).setDepth(4);
    const bobTween = this.scene.tweens.add({
      targets: sprite,
      y: y - 4,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    const item = { col, row, type: themedType, sprite, bobTween, kind: options.kind || "pickup", expireEvent: null };
    if (options.lifetimeMs) {
      item.expireEvent = this.scene.time.delayedCall(options.lifetimeMs, () => {
        this.removeAt(col, row);
      });
    }
    this.items.set(key, item);
    return item;
  }

  pickupAt(col, row, playerSystem) {
    const key = keyOf(col, row);
    const item = this.items.get(key);
    if (!item) return null;
    if (item.type.id === ENERGY_ORB_CONFIG.id && playerSystem.abilitySystem?.isActive?.()) {
      return null;
    }
    item.type.apply(playerSystem);
    this.destroyItem(key, item);
    this.scene.events.emit("item-picked", getItemDisplay(item.type.id, item.type.label).label);
    return item.type;
  }

  pickupByActor(col, row, actor, eventName = "item-picked") {
    const key = keyOf(col, row);
    const item = this.items.get(key);
    if (!item) return null;
    if (item.type.id === ENERGY_ORB_CONFIG.id) return null;
    item.type.apply(actor);
    this.destroyItem(key, item);
    this.scene.events.emit(eventName, getItemDisplay(item.type.id, item.type.label).label);
    return item.type;
  }

  nearest(cell, maxDistance = 8) {
    let best = null;
    this.items.forEach((item) => {
      if (item.type.id === ENERGY_ORB_CONFIG.id) return;
      const distance = Math.abs(item.col - cell.col) + Math.abs(item.row - cell.row);
      if (distance <= maxDistance && (!best || distance < best.distance)) {
        best = { ...item, distance };
      }
    });
    return best;
  }

  removeAt(col, row) {
    const key = keyOf(col, row);
    const item = this.items.get(key);
    if (!item) return;
    this.destroyItem(key, item);
  }

  update(time, actors = []) {
    if (time < this.nextEnergyOrbAt) return;

    while (this.nextEnergyOrbAt <= time) {
      this.nextEnergyOrbAt += this.spawnConfig.spawnIntervalMs;
      this.spawnEnergyOrb(actors);
    }
  }

  spawnEnergyOrb(actors = []) {
    if (this.map.mapConfig?.orbField?.enabled) {
      return this.spawnMapOrb(actors);
    }
    if (this.countEnergyOrbs() >= this.spawnConfig.maxActive) return null;
    const candidates = [];

    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        if (this.canSpawnEnergyOrbAt(col, row, actors)) {
          candidates.push({ col, row });
        }
      }
    }

    if (!candidates.length) return null;
    const cell = Phaser.Utils.Array.GetRandom(candidates);
    this.createItem(cell.col, cell.row, {
      id: ENERGY_ORB_CONFIG.id,
      label: ENERGY_ORB_CONFIG.label,
      texture: ENERGY_ORB_CONFIG.texture,
      apply(playerSystem) {
        playerSystem.addEnergy?.(ENERGY_ORB_CONFIG.chargeAmount);
      },
    }, {
      kind: "energy-orb",
      lifetimeMs: this.spawnConfig.lifetimeMs,
    });
    return cell;
  }

  spawnMapOrb(actors = []) {
    if (this.countEnergyOrbs() >= this.spawnConfig.maxActive) return null;
    const candidates = [];
    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        if (this.canSpawnEnergyOrbAt(col, row, actors)) candidates.push({ col, row });
      }
    }
    if (!candidates.length) return null;
    const cell = Phaser.Utils.Array.GetRandom(candidates);
    const typeId = this.pickWeightedOrbType();
    return this.createMapOrb(cell, typeId);
  }

  pickWeightedOrbType() {
    const weights = this.spawnConfig.weights || { [ENERGY_ORB_CONFIG.id]: 1 };
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = Math.random() * total;
    for (const [id, weight] of entries) {
      roll -= weight;
      if (roll <= 0) return id;
    }
    return entries.at(-1)?.[0] || ENERGY_ORB_CONFIG.id;
  }

  createMapOrb(cell, typeId) {
    const baseType = typeId === ENERGY_ORB_CONFIG.id
      ? {
          id: ENERGY_ORB_CONFIG.id,
          label: ENERGY_ORB_CONFIG.label,
          texture: ENERGY_ORB_CONFIG.texture,
          apply(actor) {
            actor.addEnergy?.(ENERGY_ORB_CONFIG.chargeAmount);
          },
        }
      : ITEM_TYPES.find((item) => item.id === typeId);
    if (!baseType) return null;
    const itemType = {
      ...baseType,
      texture: this.spawnConfig.textures?.[typeId] || baseType.texture,
    };
    return this.createItem(cell.col, cell.row, itemType, {
      kind: "map-orb",
      lifetimeMs: this.spawnConfig.lifetimeMs,
    });
  }

  countEnergyOrbs() {
    let total = 0;
    this.items.forEach((item) => {
      if (item.kind === "energy-orb" || item.kind === "map-orb") total += 1;
    });
    return total;
  }

  canSpawnEnergyOrbAt(col, row, actors = []) {
    if (this.map.getCell(col, row) !== CELL.EMPTY) return false;
    if (this.map.hasBomb(col, row) || this.map.hasExplosionAt(col, row)) return false;
    if (this.items.has(keyOf(col, row))) return false;
    if (this.isPortalCell(col, row)) return false;

    return actors.every((actor) => {
      if (!actor?.alive || !actor.currentCell) return true;
      const cell = actor.currentCell(actor);
      return cell.col !== col || cell.row !== row;
    });
  }

  isPortalCell(col, row) {
    if (!this.map.mapConfig?.portal?.enabled) return false;
    return (
      (row === 6 && (col === 1 || col === 13)) ||
      (col === 7 && (row === 1 || row === 11))
    );
  }

  destroyItem(key, item) {
    item.expireEvent?.remove?.();
    this.scene.tweens.killTweensOf?.(item.sprite);
    item.sprite.destroy();
    this.items.delete(key);
  }
}
