export class CombatantRegistry {
  constructor() {
    this.entries = new Map();
  }

  register(actor, metadata = {}) {
    if (!actor?.ownerId) throw new Error("Combatants require an ownerId");
    actor.combatantKind = metadata.kind || actor.combatantKind || "ai";
    actor.combatantSlot = metadata.slot ?? actor.combatantSlot ?? 0;
    this.entries.set(actor.ownerId, actor);
    return actor;
  }

  get(ownerId) {
    return this.entries.get(ownerId) || null;
  }

  all() {
    return [...this.entries.values()];
  }

  alive() {
    return this.all().filter((actor) => actor.alive);
  }

  players() {
    return this.all().filter((actor) => actor.combatantKind === "player");
  }

  opponentsOf(ownerId) {
    return this.alive().filter((actor) => actor.ownerId !== ownerId);
  }

  outcome() {
    const alive = this.alive();
    if (alive.length > 1) return null;
    if (alive.length === 1) return { type: "winner", winner: alive[0] };
    return { type: "draw", winner: null };
  }
}
