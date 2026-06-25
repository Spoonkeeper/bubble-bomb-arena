import { COMBAT_CONFIG, GAME_CONFIG, HEROES, SPAWN_POINTS } from "../config.js";
import {
  applyDamage,
  clearShield,
  clearSlow,
  grantTimedShield,
  initializeCombatState,
  markOffense,
  regenerateHealth,
  updateCombatVisuals,
} from "./CombatSystem.js";

const keyOf = (col, row) => `${col},${row}`;
const directionalTextureForFacing = (hero, facing) => {
  const mapping = {
    down: hero.texture,
    up: `${hero.texture}-back`,
    left: `${hero.texture}-left`,
    right: `${hero.texture}-right`,
  };
  return mapping[facing] || hero.texture;
};

export class PlayerSystem {
  constructor(scene, mapSystem, bombSystem, itemSystem, heroId, options = {}) {
    this.scene = scene;
    this.map = mapSystem;
    this.bombs = bombSystem;
    this.items = itemSystem;
    this.hero = HEROES.find((item) => item.id === heroId) || HEROES[0];
    this.stats = { ...GAME_CONFIG.PLAYER_START, ...(this.hero.baseStats || {}) };
    this.ownerId = options.ownerId || "player";
    this.playerSlot = options.playerSlot || 1;
    this.spawnCell = options.spawnCell || SPAWN_POINTS.player;
    this.inputRouter = options.inputRouter || null;
    this.inputProfile = options.inputProfile || null;
    this.placeCooldown = 0;
    this.ignoredBombKey = null;
    this.invulnerableUntil = 0;
    this.alive = true;
    this.facing = "down";
    this.currentTextureKey = null;
    this.abilitySystem = null;
    initializeCombatState(this, 0);
  }

  create() {
    const spawn = this.spawnCell;
    const { x, y } = this.map.cellToWorld(spawn.col, spawn.row);
    this.sprite = this.scene.add.image(x, y, this.hero.texture).setDepth(7);
    this.sprite.setData("role", "player");
    this.applyFacingTexture();

    if (this.inputRouter && this.inputProfile) return;
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = this.scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      SHIFT: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });
    this.scene.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.SPACE,
      Phaser.Input.Keyboard.KeyCodes.SHIFT,
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    ]);
  }

  update(time, delta) {
    if (!this.alive) return;
    regenerateHealth(this, this.scene, delta);
    updateCombatVisuals(this, this.scene);
    this.move(delta);
    this.pickupItem();
    this.tryPlaceBomb(time);
    this.tryActivateUltimate(time);
  }

  move(delta) {
    const routed = this.inputRouter && this.inputProfile;
    const left = routed ? this.inputRouter.isDown(this.inputProfile.movement.left) : this.cursors.left.isDown || this.keys.A.isDown;
    const right = routed ? this.inputRouter.isDown(this.inputProfile.movement.right) : this.cursors.right.isDown || this.keys.D.isDown;
    const up = routed ? this.inputRouter.isDown(this.inputProfile.movement.up) : this.cursors.up.isDown || this.keys.W.isDown;
    const down = routed ? this.inputRouter.isDown(this.inputProfile.movement.down) : this.cursors.down.isDown || this.keys.S.isDown;
    const rawDx = Number(right) - Number(left);
    const rawDy = Number(down) - Number(up);
    this.updateFacing(rawDx, rawDy);

    let dx = rawDx;
    let dy = rawDy;
    if (dx === 0 && dy === 0) return;

    const length = Math.hypot(dx, dy) || 1;
    dx /= length;
    dy /= length;
    const movement =
      this.abilitySystem?.movementModifiers() || { phaseWalls: false, phaseBombs: false, speedMultiplier: 1, speedBonus: 0 };
    const pixelsPerSecond =
      (102 + (this.stats.speed + (movement.speedBonus || 0)) * 24) *
      movement.speedMultiplier *
      (this.slowMultiplier || 1);
    const step = (pixelsPerSecond * delta) / 1000;

    const radius = 13;
    this.refreshIgnoredBombFromOverlap(radius);
    const nextX = this.sprite.x + dx * step;
    const nextY = this.sprite.y + dy * step;
    if (this.map.canMoveToWorld(nextX, this.sprite.y, radius, this.ignoredBombKey, movement)) {
      this.sprite.x = nextX;
    }
    if (this.map.canMoveToWorld(this.sprite.x, nextY, radius, this.ignoredBombKey, movement)) {
      this.sprite.y = nextY;
    }

    // The player can step off the bomb they just placed, but it blocks them
    // only after the full collision box has left that tile.
    if (this.ignoredBombKey && !this.map.overlapsCellWorld(this.sprite.x, this.sprite.y, radius, this.ignoredBombKey)) {
      this.ignoredBombKey = null;
    }
  }

  refreshIgnoredBombFromOverlap(radius) {
    if (this.ignoredBombKey) return;
    const overlappedBombKey = this.map.overlappedBombKeyWorld?.(this.sprite.x, this.sprite.y, radius);
    if (overlappedBombKey) {
      this.ignoredBombKey = overlappedBombKey;
    }
  }

  updateFacing(dx, dy) {
    if (dx === 0 && dy === 0) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = dx > 0 ? "right" : "left";
    } else {
      this.facing = dy > 0 ? "down" : "up";
    }

    this.applyFacingTexture();
  }

  applyFacingTexture() {
    if (!this.sprite) return;
    const textureKey = directionalTextureForFacing(this.hero, this.facing);
    if (this.scene.textures.exists(textureKey) && this.currentTextureKey !== textureKey) {
      this.sprite.setTexture(textureKey);
      this.currentTextureKey = textureKey;
    }
  }

  tryPlaceBomb(time) {
    const pressed = this.inputRouter && this.inputProfile
      ? this.inputRouter.wasPressed(this.inputProfile.bomb)
      : Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    if (!pressed || time < this.placeCooldown) return;
    const firedShadowBeam = this.abilitySystem?.tryFireShadowBeam?.(time) === true;
    if (this.abilitySystem?.blocksBombPlacement?.()) return;
    const cell = this.currentCell();
    const bomb = this.bombs.placeBomb(
      this.ownerId,
      cell.col,
      cell.row,
      this.stats.blastRange,
      this.stats.maxBombs,
      this.abilitySystem?.bombOptions?.() || {},
    );
    if (bomb) {
      markOffense(this, time);
      this.ignoredBombKey = keyOf(cell.col, cell.row);
      this.placeCooldown = time + 140;
      this.scene.events.emit("bomb-placed", this.ownerId);
    } else if (firedShadowBeam) {
      this.placeCooldown = time + 140;
    }
  }

  tryActivateUltimate(time) {
    const pressed = this.inputRouter && this.inputProfile
      ? this.inputRouter.wasPressed(this.inputProfile.ultimate)
      : Phaser.Input.Keyboard.JustDown(this.keys.SHIFT);
    if (!pressed) return;
    if (this.abilitySystem?.tryActivate(time)) {
      markOffense(this, time);
    }
  }

  pickupItem() {
    const cell = this.currentCell();
    if (this.items.pickupAt(cell.col, cell.row, this)) {
      this.scene.events.emit("player-stats-changed");
    }
  }

  currentCell() {
    return this.map.worldToCell(this.sprite.x, this.sprite.y);
  }

  hitByExplosion() {
    this.takeDamage(COMBAT_CONFIG.bombDamage, "explosion");
  }

  takeDamage(amount, reason = "damage") {
    const result = applyDamage(this, amount, reason, this.scene);
    if (result.defeated) {
      this.defeat(reason);
    }
    return result;
  }

  defeat(reason = "defeated") {
    if (!this.alive) return false;
    this.alive = false;
    this.hp = 0;
    clearSlow(this);
    clearShield(this, this.scene);
    this.healthBarBg?.destroy?.();
    this.healthBarFill?.destroy?.();
    this.healthBarBg = null;
    this.healthBarFill = null;
    this.abilitySystem?.endUltimate?.("player-defeated", false);

    if (this.sprite) {
      const sprite = this.sprite;
      this.scene.tweens.killTweensOf(sprite);
      sprite.setTint?.(0xff4358);

      const burst = this.scene.add.circle(sprite.x, sprite.y, 18, 0xff4358, 0.1)
        .setDepth(15)
        .setStrokeStyle(3, 0xff6674, 0.9);
      this.scene.tweens.add({
        targets: burst,
        alpha: 0,
        scaleX: 2.4,
        scaleY: 2.4,
        duration: 360,
        ease: "Cubic.easeOut",
        onComplete: () => burst.destroy(),
      });

      this.scene.tweens.add({
        targets: sprite,
        alpha: 0,
        scaleX: 0.32,
        scaleY: 0.32,
        angle: reason === "ember-aura" ? -14 : 12,
        duration: 340,
        ease: "Cubic.easeIn",
        onComplete: () => sprite.destroy(),
      });
    }

    this.scene.events.emit("player-defeated", this.ownerId);
    this.scene.events.emit("combatant-defeated", this.ownerId);
    return true;
  }

  grantShield() {
    return grantTimedShield(this, this.scene, this.scene.time.now);
  }

  setAbilitySystem(abilitySystem) {
    this.abilitySystem = abilitySystem;
  }

  addEnergy(amount) {
    this.abilitySystem?.addEnergy(amount);
  }

  isPhasingThroughWalls() {
    return this.abilitySystem?.movementModifiers?.().phaseWalls === true;
  }
}
