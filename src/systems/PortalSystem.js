const cellKey = (cell) => `${cell.col},${cell.row}`;

const PORTAL_GROUPS = {
  horizontal: {
    color: 0xa45cff,
    idleTexture: "portalHorizontalIdle",
    openTexture: "portalHorizontalOpen",
    endpoints: [
      { col: 1, row: 6 },
      { col: 13, row: 6 },
    ],
  },
  vertical: {
    color: 0xffd45a,
    idleTexture: "portalVerticalIdle",
    openTexture: "portalVerticalOpen",
    endpoints: [
      { col: 7, row: 1 },
      { col: 7, row: 11 },
    ],
  },
};

export class PortalSystem {
  constructor(scene, mapSystem, registry, aiSystem = null) {
    this.scene = scene;
    this.map = mapSystem;
    this.registry = registry;
    this.aiSystem = aiSystem;
    this.config = mapSystem.mapConfig?.portal || null;
    this.enabled = this.config?.enabled === true;
    this.groups = new Map();
    this.requiresExit = new Set();
  }

  create() {
    if (!this.enabled) return;
    Object.entries(PORTAL_GROUPS).forEach(([id, definition]) => {
      const group = {
        id,
        ...definition,
        state: "idle",
        chargingOwnerId: null,
        chargeStartedAt: 0,
        openUntil: 0,
        cooldownUntil: 0,
        teleported: new Set(),
        visuals: [],
      };
      definition.endpoints.forEach((cell) => {
        const { x, y } = this.map.cellToWorld(cell.col, cell.row);
        const textureKey = this.map.mapConfig.textures[definition.idleTexture];
        const sprite = this.scene.add.image(x, y, textureKey).setDepth(4);
        const halo = this.scene.add.circle(x, y, 19, definition.color, 0.035)
          .setDepth(3)
          .setStrokeStyle(2, definition.color, 0.34);
        const progress = this.scene.add.graphics().setDepth(12);
        group.visuals.push({ cell, sprite, halo, progress });
      });
      this.groups.set(id, group);
    });
  }

  update(time) {
    if (!this.enabled) return;
    this.releaseExitedActors();
    this.groups.forEach((group) => {
      if (group.state === "open") {
        this.teleportWaitingActors(group);
        if (time >= group.openUntil) this.beginCooldown(group, time);
      } else if (group.state === "cooldown") {
        if (time >= group.cooldownUntil) this.resetGroup(group);
      } else {
        this.updateChannel(group, time);
      }
      this.updateVisuals(group, time);
    });
  }

  groupState(groupId) {
    return this.groups.get(groupId)?.state || "disabled";
  }

  isPortalCell(cell) {
    return this.groupForCell(cell) !== null;
  }

  groupForCell(cell) {
    for (const group of this.groups.values()) {
      if (group.endpoints.some((endpoint) => cellKey(endpoint) === cellKey(cell))) return group;
    }
    return null;
  }

  pairedDestination(cell) {
    const group = this.groupForCell(cell);
    if (!group) return null;
    return group.endpoints.find((endpoint) => cellKey(endpoint) !== cellKey(cell)) || null;
  }

  canPlanThrough(groupId) {
    const state = this.groupState(groupId);
    return state === "idle" || state === "charging" || state === "open";
  }

  isDestinationSafe(cell, danger = new Set()) {
    const key = cellKey(cell);
    return (
      !danger.has(key) &&
      !this.map.hasBomb(cell.col, cell.row) &&
      !this.map.hasExplosionAt(cell.col, cell.row)
    );
  }

  updateChannel(group, time) {
    const candidates = this.actorsAtEndpoints(group)
      .filter((actor) => !this.requiresExit.has(actor.ownerId));
    const chargingActor =
      candidates.find((actor) => actor.ownerId === group.chargingOwnerId) ||
      candidates[0] ||
      null;

    if (!chargingActor) {
      group.state = "idle";
      group.chargingOwnerId = null;
      group.chargeStartedAt = 0;
      return;
    }

    if (group.chargingOwnerId !== chargingActor.ownerId) {
      group.chargingOwnerId = chargingActor.ownerId;
      group.chargeStartedAt = time;
    }
    group.state = "charging";
    if (time - group.chargeStartedAt >= this.config.channelMs) {
      this.openGroup(group, time);
      this.teleportWaitingActors(group);
    }
  }

  openGroup(group, time) {
    group.state = "open";
    group.openUntil = time + this.config.openMs;
    group.teleported.clear();
    group.chargingOwnerId = null;
    group.chargeStartedAt = 0;
    this.scene.events?.emit?.("portal-opened", group.id);
    this.pulseGroup(group, 1.55, 250);
  }

  beginCooldown(group, time) {
    group.state = "cooldown";
    group.cooldownUntil = time + this.config.cooldownMs;
    group.teleported.clear();
    this.scene.events?.emit?.("portal-cooldown", group.id);
    this.pulseGroup(group, 0.72, 180);
  }

  resetGroup(group) {
    group.state = "idle";
    group.cooldownUntil = 0;
    group.openUntil = 0;
    group.chargingOwnerId = null;
    group.chargeStartedAt = 0;
    this.scene.events?.emit?.("portal-ready", group.id);
  }

  actorsAtEndpoints(group) {
    return this.registry.all().filter((actor) => {
      if (!actor?.alive || !actor.sprite) return false;
      const cell = this.actorCell(actor);
      return group.endpoints.some((endpoint) => cellKey(endpoint) === cellKey(cell));
    });
  }

  actorCell(actor) {
    if (typeof actor.currentCell === "function") return actor.currentCell(actor);
    return this.map.worldToCell(actor.sprite.x, actor.sprite.y);
  }

  teleportWaitingActors(group) {
    this.actorsAtEndpoints(group).forEach((actor) => {
      if (group.teleported.has(actor.ownerId) || this.requiresExit.has(actor.ownerId)) return;
      const origin = this.actorCell(actor);
      const destination = this.pairedDestination(origin);
      if (!destination) return;
      this.teleportActor(actor, origin, destination, group);
    });
  }

  teleportActor(actor, origin, destination, group) {
    const start = this.map.cellToWorld(origin.col, origin.row);
    const target = this.map.cellToWorld(destination.col, destination.row);
    actor.sprite.x = target.x;
    actor.sprite.y = target.y;
    if (this.map.hasBomb(destination.col, destination.row)) {
      actor.ignoredBombKey = cellKey(destination);
    }
    group.teleported.add(actor.ownerId);
    this.requiresExit.add(actor.ownerId);
    this.createTeleportBurst(start, group.color);
    this.createTeleportBurst(target, group.color);
    this.scene.events?.emit?.("combatant-teleported", actor.ownerId, group.id);
  }

  releaseExitedActors() {
    this.registry.all().forEach((actor) => {
      if (!actor?.alive || !actor.sprite) {
        this.requiresExit.delete(actor?.ownerId);
        return;
      }
      if (!this.isPortalCell(this.actorCell(actor))) this.requiresExit.delete(actor.ownerId);
    });
  }

  createTeleportBurst(position, color) {
    const ring = this.scene.add.circle(position.x, position.y, 10, color, 0.08)
      .setDepth(13)
      .setStrokeStyle(3, color, 0.9);
    this.scene.tweens.add({
      targets: ring,
      scale: 2.4,
      alpha: 0,
      duration: 260,
      ease: "Cubic.easeOut",
      onComplete: () => ring.destroy(),
    });
  }

  pulseGroup(group, scale, duration) {
    group.visuals.forEach(({ sprite, halo }) => {
      this.scene.tweens.killTweensOf(sprite);
      this.scene.tweens.killTweensOf(halo);
      this.scene.tweens.add({
        targets: [sprite, halo],
        scale,
        duration,
        yoyo: true,
        ease: "Cubic.easeOut",
      });
    });
  }

  updateVisuals(group, time) {
    let progress = 0;
    if (group.state === "charging") {
      progress = Phaser.Math.Clamp((time - group.chargeStartedAt) / this.config.channelMs, 0, 1);
    } else if (group.state === "open") {
      progress = Phaser.Math.Clamp((group.openUntil - time) / this.config.openMs, 0, 1);
    } else if (group.state === "cooldown") {
      progress = Phaser.Math.Clamp(1 - (group.cooldownUntil - time) / this.config.cooldownMs, 0, 1);
    }

    group.visuals.forEach(({ sprite, halo, progress: arc }) => {
      const open = group.state === "open";
      const textureProperty = open ? group.openTexture : group.idleTexture;
      const textureKey = this.map.mapConfig.textures[textureProperty];
      sprite.setTexture?.(textureKey);
      sprite.setAlpha(group.state === "cooldown" ? 0.34 : group.state === "idle" ? 0.7 : 1);
      halo.setAlpha(group.state === "open" ? 0.42 : group.state === "charging" ? 0.18 + progress * 0.2 : 0.05);
      arc.clear();
      if (group.state !== "idle") {
        const center = { x: sprite.x, y: sprite.y };
        arc.lineStyle(3, group.color, group.state === "cooldown" ? 0.42 : 0.92);
        arc.beginPath();
        arc.arc(center.x, center.y, 25, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        arc.strokePath();
      }
    });
  }
}
