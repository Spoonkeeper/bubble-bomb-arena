import { GAME_CONFIG } from "../src/config.js";
import { MapSystem } from "../src/systems/MapSystem.js";
import { BombSystem } from "../src/systems/BombSystem.js";
import { ExplosionSystem } from "../src/systems/ExplosionSystem.js";
import { AISystem } from "../src/systems/AISystem.js";

globalThis.Phaser = globalThis.Phaser || {
  Math: {
    Between(min) {
      return min;
    },
  },
};

const keyOf = (col, row) => `${col},${row}`;

class FakeClock {
  constructor() {
    this.now = 0;
    this.queue = [];
  }

  delayedCall(delay, callback) {
    const event = { at: this.now + delay, callback, cancelled: false };
    this.queue.push(event);
    this.queue.sort((a, b) => a.at - b.at);
    return {
      remove: () => {
        event.cancelled = true;
      },
    };
  }

  tick(delta) {
    this.now += delta;
    while (this.queue.length && this.queue[0].at <= this.now) {
      const event = this.queue.shift();
      if (!event.cancelled) event.callback();
    }
  }
}

function makeSprite(x, y) {
  return {
    x,
    y,
    alpha: 1,
    scale: 1,
    angle: 0,
    destroyed: false,
    setDepth() {
      return this;
    },
    setScale(scale) {
      this.scale = scale;
      return this;
    },
    setAlpha(alpha) {
      this.alpha = alpha;
      return this;
    },
    setOrigin() {
      return this;
    },
    setInteractive() {
      return this;
    },
    on() {
      return this;
    },
    setStrokeStyle() {
      return this;
    },
    setData() {
      return this;
    },
    destroy() {
      this.destroyed = true;
    },
  };
}

function createScene() {
  const clock = new FakeClock();
  const scene = {
    time: clock,
    add: {
      image: (x, y) => makeSprite(x, y),
      rectangle: (x, y) => makeSprite(x, y),
      circle: (x, y) => makeSprite(x, y),
      text: (x, y) => makeSprite(x, y),
      group: () => ({
        add() {},
      }),
    },
    tweens: {
      add(config) {
        if (typeof config.onComplete === "function" && !config.delay && !config.duration) {
          config.onComplete();
        }
      },
      killTweensOf() {},
    },
    events: {
      handlers: new Map(),
      emit(name, payload) {
        const listeners = this.handlers.get(name) || [];
        listeners.forEach((listener) => listener(payload));
      },
      on(name, listener) {
        const listeners = this.handlers.get(name) || [];
        listeners.push(listener);
        this.handlers.set(name, listeners);
      },
    },
  };
  return scene;
}

function createPlayer(path) {
  let index = 0;
  return {
    alive: true,
    currentCell() {
      return path[Math.min(index, path.length - 1)];
    },
    advance(frame) {
      if (frame < path.length - 1) index = frame;
    },
    hitByExplosion() {
      this.alive = false;
    },
  };
}

function clearArenaAroundEnemies(map) {
  const cells = [
    { col: 13, row: 11 },
    { col: 13, row: 1 },
    { col: 1, row: 11 },
  ];
  cells.forEach(({ col, row }) => {
    const candidates = [
      { col: col - 1, row },
      { col: col, row: row - 1 },
      { col: col - 2, row },
      { col: col, row: row - 2 },
    ];
    candidates.forEach((cell) => {
      if (map.getCell(cell.col, cell.row) === 2) {
        map.cells[cell.row][cell.col] = 0;
      }
    });
  });
}

function createArena({
  playerPath,
  clearArena = false,
  activeEnemyIds = null,
  mutateMap = null,
}) {
  const scene = createScene();
  const map = new MapSystem(scene);
  map.create();
  if (clearArena) clearArenaAroundEnemies(map);
  if (mutateMap) mutateMap(map);

  const items = {
    pickupByActor() {
      return false;
    },
    removeAt() {},
    maybeDrop() {},
    nearest() {
      return null;
    },
  };
  const bombs = new BombSystem(scene, map);
  const explosions = new ExplosionSystem(scene, map, items);
  bombs.setExplosionSystem(explosions);
  const player = createPlayer(playerPath);
  const ai = new AISystem(scene, map, bombs, player, items);
  ai.create();
  if (activeEnemyIds) {
    ai.enemies.forEach((enemy) => {
      if (!activeEnemyIds.includes(enemy.ownerId)) enemy.alive = false;
    });
  }
  explosions.connect(player, ai);

  return { scene, map, items, bombs, explosions, player, ai };
}

function runScenario({
  name,
  playerPath,
  durationMs = 18000,
  clearArena = false,
  activeEnemyIds = null,
  mutateMap = null,
}) {
  const { scene, map, bombs, explosions, player, ai } = createArena({
    playerPath,
    clearArena,
    activeEnemyIds,
    mutateMap,
  });

  const stats = {
    bombsPlaced: new Map(),
    selfBombDeaths: [],
    totalDeaths: [],
  };
  const explosionOwners = new Map();
  const startPositions = new Map(
    ai.enemies.map((enemy) => [enemy.ownerId, { x: enemy.sprite.x, y: enemy.sprite.y }]),
  );
  const maxDisplacementByEnemy = new Map(
    ai.enemies.map((enemy) => [enemy.ownerId, 0]),
  );

  const originalPlaceBomb = bombs.placeBomb.bind(bombs);
  bombs.placeBomb = (ownerId, col, row, range, maxBombs) => {
    const bomb = originalPlaceBomb(ownerId, col, row, range, maxBombs);
    if (bomb && ownerId.startsWith("enemy-")) {
      stats.bombsPlaced.set(ownerId, (stats.bombsPlaced.get(ownerId) || 0) + 1);
    }
    return bomb;
  };

  const originalMarkExplosion = map.markExplosion.bind(map);
  map.markExplosion = (col, row) => {
    originalMarkExplosion(col, row);
    const ownerId = scene.__activeExplosionOwner;
    if (ownerId) explosionOwners.set(keyOf(col, row), ownerId);
  };
  const originalClearExplosion = map.clearExplosion.bind(map);
  map.clearExplosion = (col, row) => {
    originalClearExplosion(col, row);
    explosionOwners.delete(keyOf(col, row));
  };

  const originalExplode = bombs.explode.bind(bombs);
  bombs.explode = (bomb) => {
    scene.__activeExplosionOwner = bomb.ownerId;
    try {
      originalExplode(bomb);
    } finally {
      scene.__activeExplosionOwner = null;
    }
  };

  const originalHitEnemies = ai.hitEnemiesInExplosions.bind(ai);
  ai.hitEnemiesInExplosions = () => {
    const before = ai.enemies.map((enemy) => ({
      ownerId: enemy.ownerId,
      alive: enemy.alive,
      cell: ai.currentCell(enemy),
    }));
    originalHitEnemies();
    before.forEach((entry) => {
      if (!entry.alive) return;
      const enemy = ai.enemies.find((candidate) => candidate.ownerId === entry.ownerId);
      if (!enemy || enemy.alive) return;
      stats.totalDeaths.push(entry.ownerId);
      const ownerAtCell = explosionOwners.get(keyOf(entry.cell.col, entry.cell.row));
      if (ownerAtCell === entry.ownerId) stats.selfBombDeaths.push(entry.ownerId);
    });
  };

  const stepMs = 100;
  const frames = Math.ceil(durationMs / stepMs);
  for (let frame = 0; frame < frames; frame += 1) {
    player.advance(frame);
    ai.update(scene.time.now, stepMs);
    explosions.checkActiveHits();
    ai.enemies.forEach((enemy) => {
      const start = startPositions.get(enemy.ownerId);
      if (!start) return;
      const dx = enemy.sprite.x - start.x;
      const dy = enemy.sprite.y - start.y;
      const displacement = Math.hypot(dx, dy);
      maxDisplacementByEnemy.set(
        enemy.ownerId,
        Math.max(maxDisplacementByEnemy.get(enemy.ownerId) || 0, displacement),
      );
    });
    scene.time.tick(stepMs);
  }

  return {
    name,
    bombsPlaced: Object.fromEntries(stats.bombsPlaced),
    movementByEnemy: Object.fromEntries(
      [...maxDisplacementByEnemy.entries()].map(([ownerId, displacement]) => [
        ownerId,
        Number(displacement.toFixed(1)),
      ]),
    ),
    selfBombDeaths: stats.selfBombDeaths,
    totalDeaths: stats.totalDeaths,
    aliveEnemies: ai.aliveCount(),
  };
}

const scenarios = [
  {
    name: "default-box-pressure",
    playerPath: Array.from({ length: 220 }, () => ({ col: 1, row: 1 })),
  },
  {
    name: "corner-tour",
    clearArena: true,
    durationMs: 24000,
    playerPath: [
      ...Array.from({ length: 60 }, () => ({ col: 1, row: 1 })),
      ...Array.from({ length: 60 }, () => ({ col: 10, row: 1 })),
      ...Array.from({ length: 60 }, () => ({ col: 10, row: 11 })),
      ...Array.from({ length: 60 }, () => ({ col: 1, row: 11 })),
    ],
  },
  {
    name: "player-top-lure",
    clearArena: true,
    playerPath: Array.from({ length: 220 }, (_, index) => ({ col: 10 - (index % 4), row: 1 })),
  },
  {
    name: "player-bottom-lure",
    clearArena: true,
    playerPath: Array.from({ length: 220 }, (_, index) => ({ col: 10 - (index % 4), row: 11 })),
  },
  {
    name: "enemy-0-drill",
    activeEnemyIds: ["enemy-0"],
    mutateMap(map) {
      map.cells[11][12] = 2;
      map.cells[10][13] = 0;
      map.cells[9][13] = 0;
      map.cells[8][13] = 0;
    },
    playerPath: Array.from({ length: 220 }, () => ({ col: 10, row: 11 })),
  },
  {
    name: "enemy-1-drill",
    clearArena: true,
    activeEnemyIds: ["enemy-1"],
    playerPath: Array.from({ length: 220 }, () => ({ col: 10, row: 1 })),
  },
  {
    name: "enemy-2-drill",
    clearArena: true,
    activeEnemyIds: ["enemy-2"],
    playerPath: Array.from({ length: 220 }, () => ({ col: 1, row: 8 })),
  },
];

const freeForAllArena = createArena({
  playerPath: Array.from({ length: 4 }, () => ({ col: 1, row: 1 })),
});
const enemy0 = freeForAllArena.ai.enemies.find((enemy) => enemy.ownerId === "enemy-0");
const enemy1 = freeForAllArena.ai.enemies.find((enemy) => enemy.ownerId === "enemy-1");
const freeForAllTargets = {
  "enemy-0": freeForAllArena.ai.pickTarget(enemy0),
  "enemy-1": freeForAllArena.ai.pickTarget(enemy1),
};
const freeForAllFailures = Object.entries({
  "enemy-0": { col: 13, row: 1 },
  "enemy-1": { col: 13, row: 11 },
}).flatMap(([ownerId, expectedCell]) => {
  const actual = freeForAllTargets[ownerId]?.cell;
  if (actual?.col === expectedCell.col && actual?.row === expectedCell.row) return [];
  return [
    {
      ownerId,
      expectedCell,
      actualCell: actual || null,
      actualKind: freeForAllTargets[ownerId]?.kind || null,
    },
  ];
});

const results = scenarios.map(runScenario);
const failures = results.filter((result) => result.selfBombDeaths.length > 0);
const bombers = new Set(
  results.flatMap((result) => Object.keys(result.bombsPlaced)),
);
const missingBombers = ["enemy-0", "enemy-1", "enemy-2"].filter((ownerId) => !bombers.has(ownerId));
const openingMovement = results.find((result) => result.name === "default-box-pressure");
const stalledEnemies = ["enemy-0", "enemy-1", "enemy-2"].filter(
  (ownerId) => (openingMovement?.movementByEnemy?.[ownerId] || 0) < 5,
);
const combatFreezeFailures = ["enemy-0", "enemy-1", "enemy-2"].filter(
  (ownerId) => (openingMovement?.movementByEnemy?.[ownerId] || 0) < 60,
);

console.log(
  JSON.stringify(
      {
      passed:
        failures.length === 0 &&
        missingBombers.length === 0 &&
        freeForAllFailures.length === 0 &&
        stalledEnemies.length === 0 &&
        combatFreezeFailures.length === 0,
      failures,
      freeForAllFailures,
      missingBombers: [...missingBombers],
      stalledEnemies,
      combatFreezeFailures,
      results,
    },
    null,
    2,
  ),
);
