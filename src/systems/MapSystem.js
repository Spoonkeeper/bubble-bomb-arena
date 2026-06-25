import { CELL, GAME_CONFIG, SPAWN_POINTS, getMapConfig } from "../config.js";

const keyOf = (col, row) => `${col},${row}`;

export class MapSystem {
  constructor(scene, mapId = "inferno") {
    this.scene = scene;
    this.mapId = mapId;
    this.mapConfig = getMapConfig(mapId);
    this.cells = [];
    this.tileSprites = new Map();
    this.boxSprites = new Map();
    this.bombs = new Map();
    this.explosions = new Set();
  }

  create() {
    this.staticGroup = this.scene.add.group();
    this.boxGroup = this.scene.add.group();
    this.buildCells();
    this.drawMap();
  }

  buildCells() {
    if (this.mapConfig.layout === "abyss") {
      this.buildAbyssCells();
      return;
    }
    if (this.mapConfig.layout === "homeland") {
      this.buildHomelandCells();
      return;
    }
    this.buildInfernoCells();
  }

  buildAbyssCells() {
    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      this.cells[row] = [];
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        const boundary =
          row === 0 ||
          col === 0 ||
          row === GAME_CONFIG.GRID_ROWS - 1 ||
          col === GAME_CONFIG.GRID_COLS - 1;
        this.cells[row][col] = boundary ? CELL.SOLID_WALL : CELL.EMPTY;
      }
    }
  }

  buildInfernoCells() {
    // Deterministic arena generation keeps the MVP replayable while preserving
    // safe spawn corridors for the player and all three enemies.
    const safe = new Set([
      keyOf(1, 1),
      keyOf(1, 2),
      keyOf(2, 1),
      keyOf(13, 11),
      keyOf(13, 10),
      keyOf(12, 11),
      keyOf(13, 1),
      keyOf(13, 2),
      keyOf(12, 1),
      keyOf(1, 11),
      keyOf(1, 10),
      keyOf(2, 11),
    ]);

    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      this.cells[row] = [];
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        const border = row === 0 || col === 0 || row === GAME_CONFIG.GRID_ROWS - 1 || col === GAME_CONFIG.GRID_COLS - 1;
        const pillar = col % 2 === 0 && row % 2 === 0;
        if (border || pillar) {
          this.cells[row][col] = CELL.SOLID_WALL;
        } else if (!safe.has(keyOf(col, row)) && this.shouldPlaceBox(col, row)) {
          this.cells[row][col] = CELL.BREAKABLE_BOX;
        } else {
          this.cells[row][col] = CELL.EMPTY;
        }
      }
    }

    SPAWN_POINTS.enemies.forEach((cell) => {
      this.cells[cell.row][cell.col] = CELL.EMPTY;
    });
    this.cells[SPAWN_POINTS.player.row][SPAWN_POINTS.player.col] = CELL.EMPTY;
  }

  buildHomelandCells() {
    const safe = new Set([
      keyOf(1, 1),
      keyOf(1, 2),
      keyOf(2, 1),
      keyOf(13, 11),
      keyOf(13, 10),
      keyOf(12, 11),
      keyOf(13, 1),
      keyOf(13, 2),
      keyOf(12, 1),
      keyOf(1, 11),
      keyOf(1, 10),
      keyOf(2, 11),
      keyOf(7, 6),
      keyOf(7, 5),
      keyOf(7, 7),
      keyOf(6, 6),
      keyOf(8, 6),
    ]);
    const openCross = new Set();
    for (let col = 1; col < GAME_CONFIG.GRID_COLS - 1; col += 1) openCross.add(keyOf(col, 6));
    for (let row = 1; row < GAME_CONFIG.GRID_ROWS - 1; row += 1) openCross.add(keyOf(7, row));
    for (let col = 3; col <= 11; col += 1) {
      openCross.add(keyOf(col, 3));
      openCross.add(keyOf(col, 9));
    }

    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      this.cells[row] = [];
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        const border = row === 0 || col === 0 || row === GAME_CONFIG.GRID_ROWS - 1 || col === GAME_CONFIG.GRID_COLS - 1;
        const pillar = col % 2 === 0 && row % 2 === 0 && !openCross.has(keyOf(col, row));
        if (border || pillar) {
          this.cells[row][col] = CELL.SOLID_WALL;
        } else if (!safe.has(keyOf(col, row)) && !openCross.has(keyOf(col, row)) && this.shouldPlaceHomelandBox(col, row)) {
          this.cells[row][col] = CELL.BREAKABLE_BOX;
        } else {
          this.cells[row][col] = CELL.EMPTY;
        }
      }
    }

    SPAWN_POINTS.enemies.forEach((cell) => {
      this.cells[cell.row][cell.col] = CELL.EMPTY;
    });
    this.cells[SPAWN_POINTS.player.row][SPAWN_POINTS.player.col] = CELL.EMPTY;
  }

  shouldPlaceBox(col, row) {
    const pattern = (col * 11 + row * 7 + col * row) % 10;
    return pattern < 5 || (col + row) % 7 === 0;
  }

  shouldPlaceHomelandBox(col, row) {
    const pattern = (col * 13 + row * 5 + col * row * 3) % 12;
    return pattern < 4 || (col + row) % 8 === 0;
  }

  drawMap() {
    for (let row = 0; row < GAME_CONFIG.GRID_ROWS; row += 1) {
      for (let col = 0; col < GAME_CONFIG.GRID_COLS; col += 1) {
        const { x, y } = this.cellToWorld(col, row);
        const floorKey = (col + row) % 2 === 0 ? this.mapConfig.textures.floorA : this.mapConfig.textures.floorB;
        const floor = this.scene.add.image(x, y, floorKey).setDepth(0);
        this.staticGroup.add(floor);

        if (this.cells[row][col] === CELL.SOLID_WALL) {
          const wall = this.scene.add.image(x, y, this.mapConfig.textures.wall).setDepth(2);
          this.staticGroup.add(wall);
          this.tileSprites.set(keyOf(col, row), wall);
        }

        if (this.cells[row][col] === CELL.BREAKABLE_BOX) {
          this.addBoxSprite(col, row);
        }
      }
    }
  }

  addBoxSprite(col, row) {
    const { x, y } = this.cellToWorld(col, row);
    const box = this.scene.add.image(x, y, this.mapConfig.textures.box).setDepth(3);
    this.boxGroup.add(box);
    this.boxSprites.set(keyOf(col, row), box);
  }

  cellToWorld(col, row) {
    return {
      x: GAME_CONFIG.BOARD_OFFSET_X + col * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
      y: GAME_CONFIG.BOARD_OFFSET_Y + row * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
    };
  }

  worldToCell(x, y) {
    return {
      col: Math.floor((x - GAME_CONFIG.BOARD_OFFSET_X) / GAME_CONFIG.TILE_SIZE),
      row: Math.floor((y - GAME_CONFIG.BOARD_OFFSET_Y) / GAME_CONFIG.TILE_SIZE),
    };
  }

  isInside(col, row) {
    return col >= 0 && row >= 0 && col < GAME_CONFIG.GRID_COLS && row < GAME_CONFIG.GRID_ROWS;
  }

  getCell(col, row) {
    if (!this.isInside(col, row)) return CELL.SOLID_WALL;
    return this.cells[row][col];
  }

  hasBomb(col, row) {
    return this.bombs.has(keyOf(col, row));
  }

  isBlocked(col, row, ignoreBombKey = null, traversal = {}) {
    if (!this.isInside(col, row)) {
      return true;
    }
    const key = keyOf(col, row);
    const cell = this.getCell(col, row);
    const phaseWalls = traversal.phaseWalls === true;
    const phaseBombs = traversal.phaseBombs === true;
    const boundaryWall =
      cell === CELL.SOLID_WALL &&
      (col === 0 || row === 0 || col === GAME_CONFIG.GRID_COLS - 1 || row === GAME_CONFIG.GRID_ROWS - 1);

    if (boundaryWall) {
      return true;
    }

    if (!phaseWalls && (cell === CELL.SOLID_WALL || cell === CELL.BREAKABLE_BOX)) {
      return true;
    }

    return !phaseBombs && cell === CELL.EMPTY && this.bombs.has(key) && key !== ignoreBombKey;
  }

  canMoveToWorld(x, y, radius, ignoreBombKey = null, traversal = {}) {
    // Sample the four corners of a small collision box so characters slide
    // along walls instead of snapping from cell center to cell center.
    const samples = [
      this.worldToCell(x - radius, y - radius),
      this.worldToCell(x + radius, y - radius),
      this.worldToCell(x - radius, y + radius),
      this.worldToCell(x + radius, y + radius),
    ];
    return samples.every((sample) => !this.isBlocked(sample.col, sample.row, ignoreBombKey, traversal));
  }

  overlapsCellWorld(x, y, radius, cellKey) {
    const samples = [
      this.worldToCell(x - radius, y - radius),
      this.worldToCell(x + radius, y - radius),
      this.worldToCell(x - radius, y + radius),
      this.worldToCell(x + radius, y + radius),
    ];
    return samples.some((sample) => keyOf(sample.col, sample.row) === cellKey);
  }

  overlappedBombKeyWorld(x, y, radius) {
    const samples = [
      this.worldToCell(x - radius, y - radius),
      this.worldToCell(x + radius, y - radius),
      this.worldToCell(x - radius, y + radius),
      this.worldToCell(x + radius, y + radius),
      this.worldToCell(x, y),
    ];
    const hit = samples.find((sample) => this.bombs.has(keyOf(sample.col, sample.row)));
    return hit ? keyOf(hit.col, hit.row) : null;
  }

  placeBomb(col, row, bomb) {
    this.bombs.set(keyOf(col, row), bomb);
  }

  removeBomb(col, row) {
    this.bombs.delete(keyOf(col, row));
  }

  destroyBox(col, row) {
    if (this.getCell(col, row) !== CELL.BREAKABLE_BOX) return false;
    this.cells[row][col] = CELL.EMPTY;
    const key = keyOf(col, row);
    const sprite = this.boxSprites.get(key);
    if (sprite) {
      this.scene.tweens.add({
        targets: sprite,
        alpha: 0,
        scale: 1.22,
        angle: 8,
        duration: 150,
        onComplete: () => sprite.destroy(),
      });
      this.boxSprites.delete(key);
    }
    return true;
  }

  markExplosion(col, row) {
    this.explosions.add(keyOf(col, row));
  }

  clearExplosion(col, row) {
    this.explosions.delete(keyOf(col, row));
  }

  hasExplosionAt(col, row) {
    return this.explosions.has(keyOf(col, row));
  }
}
