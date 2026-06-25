import { ENEMY_TYPES, HEROES } from "../config.js";

export const SHADOW_HERO_SHEET_KEY = "shadow-omen-sheet";
export const SHADOW_HERO_SHEET_PATH = "assets/shadow-omen-sheet.png";
export const EMBER_HERO_ASSET_PATHS = {
  "hero-ember": "assets/hero-ember.png",
  "hero-ember-back": "assets/hero-ember-back.png",
  "hero-ember-left": "assets/hero-ember-left.png",
  "hero-ember-right": "assets/hero-ember-right.png",
  "hero-ember-poster": "assets/hero-ember-poster.png",
};
export const VOLT_HERO_ASSET_PATHS = {
  "hero-volt": "assets/hero-volt.png",
  "hero-volt-back": "assets/hero-volt-back.png",
  "hero-volt-left": "assets/hero-volt-left.png",
  "hero-volt-right": "assets/hero-volt-right.png",
  "hero-volt-poster": "assets/hero-volt-poster.png",
};
export const WIND_HERO_ASSET_PATHS = {
  "hero-wind": "assets/hero-wind.png",
  "hero-wind-back": "assets/hero-wind-back.png",
  "hero-wind-left": "assets/hero-wind-left.png",
  "hero-wind-right": "assets/hero-wind-right.png",
  "hero-wind-poster": "assets/hero-wind-poster.png",
};
export const TECH_MAP_ASSET_PATHS = {
  "inferno-floor-a": "assets/inferno-floor-a.png",
  "inferno-floor-b": "assets/inferno-floor-b.png",
  "inferno-wall": "assets/inferno-wall.png",
  "inferno-box": "assets/inferno-box.png",
  "inferno-bomb": "assets/inferno-bomb.png",
  "inferno-explosion": "assets/inferno-explosion.png",
  "inferno-orb-energy": "assets/inferno-orb-energy.png",
  "inferno-orb-speed": "assets/inferno-orb-speed.png",
  "inferno-orb-range": "assets/inferno-orb-range.png",
  "inferno-orb-bomb": "assets/inferno-orb-bomb.png",
  "inferno-orb-shield": "assets/inferno-orb-shield.png",
  "inferno-enemy-0": "assets/inferno-enemy-0.png",
  "inferno-enemy-1": "assets/inferno-enemy-1.png",
  "inferno-enemy-2": "assets/inferno-enemy-2.png",
  "inferno-v3-floor-a": "assets/inferno-v4-floor-a.png",
  "inferno-v3-floor-b": "assets/inferno-v4-floor-b.png",
  "inferno-v3-wall": "assets/inferno-v4-wall.png",
  "inferno-v3-box": "assets/inferno-v4-box.png",
  "inferno-v3-bomb": "assets/inferno-v4-bomb.png",
  "inferno-v3-explosion": "assets/inferno-v4-explosion.png",
  "inferno-v3-orb-energy": "assets/inferno-v4-orb-energy.png",
  "inferno-v3-orb-speed": "assets/inferno-v4-orb-speed.png",
  "inferno-v3-orb-range": "assets/inferno-v4-orb-range.png",
  "inferno-v3-orb-bomb": "assets/inferno-v4-orb-bomb.png",
  "inferno-v3-orb-shield": "assets/inferno-v4-orb-shield.png",
  "inferno-v3-enemy-0": "assets/inferno-v4-enemy-0.png",
  "inferno-v3-enemy-1": "assets/inferno-v4-enemy-1.png",
  "inferno-v3-enemy-2": "assets/inferno-v4-enemy-2.png",
  "wall-solid": "assets/wall-solid-tech.png",
  "box-breakable": "assets/box-breakable-tech.png",
  "homeland-floor-a": "assets/homeland-floor-a.png",
  "homeland-floor-b": "assets/homeland-floor-b.png",
  "homeland-wall": "assets/homeland-wall.png",
  "homeland-box": "assets/homeland-box.png",
  "homeland-bomb": "assets/homeland-bomb.png",
  "homeland-explosion": "assets/homeland-explosion.png",
  "homeland-orb-energy": "assets/homeland-orb-energy.png",
  "homeland-orb-speed": "assets/homeland-orb-speed.png",
  "homeland-orb-range": "assets/homeland-orb-range.png",
  "homeland-orb-bomb": "assets/homeland-orb-bomb.png",
  "homeland-orb-shield": "assets/homeland-orb-shield.png",
  "homeland-enemy-0": "assets/homeland-enemy-0.png",
  "homeland-enemy-1": "assets/homeland-enemy-1.png",
  "homeland-enemy-2": "assets/homeland-enemy-2.png",
  "homeland-v3-floor-a": "assets/homeland-v4-floor-a.png",
  "homeland-v3-floor-b": "assets/homeland-v4-floor-b.png",
  "homeland-v3-wall": "assets/homeland-v4-wall.png",
  "homeland-v3-box": "assets/homeland-v4-box.png",
  "homeland-v3-bomb": "assets/homeland-v4-bomb.png",
  "homeland-v3-explosion": "assets/homeland-v4-explosion.png",
  "homeland-v3-orb-energy": "assets/homeland-v4-orb-energy.png",
  "homeland-v3-orb-speed": "assets/homeland-v4-orb-speed.png",
  "homeland-v3-orb-range": "assets/homeland-v4-orb-range.png",
  "homeland-v3-orb-bomb": "assets/homeland-v4-orb-bomb.png",
  "homeland-v3-orb-shield": "assets/homeland-v4-orb-shield.png",
  "homeland-v3-enemy-0": "assets/homeland-v4-enemy-0.png",
  "homeland-v3-enemy-1": "assets/homeland-v4-enemy-1.png",
  "homeland-v3-enemy-2": "assets/homeland-v4-enemy-2.png",
  "map-preview-inferno": "assets/map-preview-inferno.png",
  "map-preview-homeland": "assets/map-preview-homeland.png",
  "map-preview-abyss": "assets/map-preview-abyss-v3.png",
  "abyss-floor-a": "assets/abyss-floor-a.png",
  "abyss-floor-b": "assets/abyss-floor-b.png",
  "abyss-wall": "assets/abyss-wall.png",
  "abyss-bomb-blackhole": "assets/abyss-bomb-blackhole.png",
  "abyss-explosion": "assets/abyss-explosion.png",
  "abyss-portal-purple-idle": "assets/abyss-portal-purple-idle.png",
  "abyss-portal-purple-open": "assets/abyss-portal-purple-open.png",
  "abyss-portal-gold-idle": "assets/abyss-portal-gold-idle.png",
  "abyss-portal-gold-open": "assets/abyss-portal-gold-open.png",
  "abyss-orb-energy": "assets/abyss-orb-energy.png",
  "abyss-orb-speed": "assets/abyss-orb-speed.png",
  "abyss-orb-range": "assets/abyss-orb-range.png",
  "abyss-orb-bomb": "assets/abyss-orb-bomb.png",
  "abyss-orb-shield": "assets/abyss-orb-shield.png",
  "abyss-enemy-0": "assets/abyss-enemy-0.png",
  "abyss-enemy-1": "assets/abyss-enemy-1.png",
  "abyss-enemy-2": "assets/abyss-enemy-2.png",
};

const toColor = (hex) => Phaser.Display.Color.IntegerToColor(hex);

function drawBubble(g, x, y, radius, fill, edge = 0xffffff, alpha = 1) {
  g.fillStyle(fill, alpha);
  g.fillCircle(x, y, radius);
  g.lineStyle(2, edge, 0.4);
  g.strokeCircle(x, y, radius);
  g.fillStyle(0xffffff, 0.5);
  g.fillCircle(x - radius * 0.35, y - radius * 0.35, Math.max(3, radius * 0.22));
}

function roundedTexture(scene, key, width, height, fill, stroke, drawExtra) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  g.fillStyle(fill, 1);
  g.fillRoundedRect(2, 2, width - 4, height - 4, 8);
  g.lineStyle(2, stroke, 0.45);
  g.strokeRoundedRect(2, 2, width - 4, height - 4, 8);
  if (drawExtra) drawExtra(g);
  g.generateTexture(key, width, height);
  g.destroy();
}

export function preloadCustomHeroAssets(scene) {
  if (!scene.textures.exists(SHADOW_HERO_SHEET_KEY)) {
    scene.load.image(SHADOW_HERO_SHEET_KEY, SHADOW_HERO_SHEET_PATH);
  }

  Object.entries(EMBER_HERO_ASSET_PATHS).forEach(([key, assetPath]) => {
    if (!scene.textures.exists(key)) {
      scene.load.image(key, assetPath);
    }
  });

  Object.entries(VOLT_HERO_ASSET_PATHS).forEach(([key, assetPath]) => {
    if (!scene.textures.exists(key)) {
      scene.load.image(key, assetPath);
    }
  });

  Object.entries(WIND_HERO_ASSET_PATHS).forEach(([key, assetPath]) => {
    if (!scene.textures.exists(key)) {
      scene.load.image(key, assetPath);
    }
  });

  Object.entries(TECH_MAP_ASSET_PATHS).forEach(([key, assetPath]) => {
    if (!scene.textures.exists(key)) {
      scene.load.image(key, assetPath);
    }
  });
}

export function createGameTextures(scene) {
  roundedTexture(scene, "tile-floor-a", 40, 40, 0x171d22, 0x454b54, (g) => {
    g.lineStyle(1, 0x2a3038, 0.82);
    g.lineBetween(4, 34, 34, 4);
    g.lineStyle(1, 0xff4452, 0.32);
    g.lineBetween(6, 30, 28, 30);
    g.fillStyle(0x58e8ff, 0.08);
    g.fillCircle(31, 10, 4);
  });

  roundedTexture(scene, "tile-floor-b", 40, 40, 0x12181e, 0x3b424c, (g) => {
    g.lineStyle(1, 0x252b34, 0.78);
    g.lineBetween(0, 39, 39, 0);
    g.fillStyle(0xff4452, 0.1);
    g.fillRoundedRect(7, 28, 23, 3, 2);
    g.fillStyle(0x7df4d4, 0.055);
    g.fillRoundedRect(26, 7, 7, 7, 2);
  });

  roundedTexture(scene, "wall-solid", 40, 40, 0x20343b, 0x7ddff0, (g) => {
    g.fillStyle(0x0e1a20, 0.42);
    g.fillRoundedRect(8, 6, 24, 28, 6);
    g.fillStyle(0x58e8ff, 0.28);
    g.fillRoundedRect(13, 8, 14, 4, 2);
  });

  roundedTexture(scene, "box-breakable", 40, 40, 0x8d6038, 0xffc46c, (g) => {
    g.lineStyle(3, 0x4a3022, 0.8);
    g.lineBetween(8, 10, 32, 30);
    g.lineBetween(32, 10, 8, 30);
    g.fillStyle(0xffad45, 0.28);
    g.fillRoundedRect(10, 6, 20, 5, 3);
  });

  roundedTexture(scene, "homeland-floor-a", 40, 40, 0x14120f, 0x8f6f32, (g) => {
    g.lineStyle(1, 0xcaa14a, 0.25);
    g.lineBetween(5, 31, 33, 8);
    g.fillStyle(0xcaa14a, 0.08);
    g.fillCircle(30, 10, 4);
  });

  roundedTexture(scene, "homeland-floor-b", 40, 40, 0x0f0d0b, 0x584622, (g) => {
    g.lineStyle(1, 0x6c5124, 0.45);
    g.lineBetween(0, 39, 39, 0);
    g.fillStyle(0xcaa14a, 0.08);
    g.fillRoundedRect(8, 28, 20, 3, 2);
  });

  roundedTexture(scene, "homeland-wall", 40, 40, 0x17130e, 0xcaa14a, (g) => {
    g.fillStyle(0x2a2115, 1);
    g.fillRoundedRect(7, 7, 26, 26, 5);
    g.lineStyle(2, 0xcaa14a, 0.42);
    g.lineBetween(8, 10, 32, 30);
  });

  roundedTexture(scene, "homeland-box", 40, 40, 0x382817, 0xcaa14a, (g) => {
    g.lineStyle(3, 0x0b0907, 0.76);
    g.lineBetween(9, 10, 31, 30);
    g.lineBetween(31, 10, 9, 30);
    g.fillStyle(0xcaa14a, 0.34);
    g.fillRoundedRect(14, 17, 12, 5, 2);
  });

  if (!scene.textures.exists("bomb")) {
    const g = scene.add.graphics();
    drawBubble(g, 20, 22, 14, 0x1b2931, 0x58e8ff, 1);
    g.lineStyle(3, 0x58e8ff, 0.9);
    g.beginPath();
    g.arc(25, 11, 8, Phaser.Math.DegToRad(205), Phaser.Math.DegToRad(305));
    g.strokePath();
    g.fillStyle(0xffad45, 1);
    g.fillCircle(31, 8, 3);
    g.generateTexture("bomb", 40, 40);
    g.destroy();
  }

  if (!scene.textures.exists("homeland-bomb")) {
    const g = scene.add.graphics();
    drawBubble(g, 20, 22, 14, 0x18130d, 0xcaa14a, 1);
    g.lineStyle(3, 0xcaa14a, 0.9);
    g.beginPath();
    g.arc(25, 11, 8, Phaser.Math.DegToRad(205), Phaser.Math.DegToRad(305));
    g.strokePath();
    g.fillStyle(0xffd777, 1);
    g.fillCircle(31, 8, 3);
    g.generateTexture("homeland-bomb", 40, 40);
    g.destroy();
  }

  if (!scene.textures.exists("explosion")) {
    const g = scene.add.graphics();
    g.fillStyle(0x58e8ff, 0.78);
    g.fillCircle(20, 20, 18);
    g.fillStyle(0xf8ffff, 0.75);
    g.fillCircle(20, 20, 10);
    g.lineStyle(2, 0xfff0a3, 0.8);
    g.strokeCircle(20, 20, 16);
    g.generateTexture("explosion", 40, 40);
    g.destroy();
  }

  createItem(scene, "item-range", 0x58e8ff, "+");
  createItem(scene, "item-bomb", 0xffad45, "B");
  createItem(scene, "item-speed", 0xffe14a, "S");
  createItem(scene, "item-energy-orb", 0x6dff96, "E");
  createItem(scene, "item-shield", 0x9a7cff, "盾");
  HEROES.forEach((hero) => createHero(scene, hero));
  ENEMY_TYPES.forEach((enemy, index) => createEnemy(scene, enemy, index));
  createHomelandEnemies(scene);
  createMapPreview(scene, "map-preview-inferno", 0xff4452, 0x58e8ff, 0x090d12);
  createMapPreview(scene, "map-preview-homeland", 0xcaa14a, 0x5c3712, 0x0a0908);

  // ── Programmatic fallbacks for map-specific texture keys ──
  // These ensure the game still looks correct even when running from
  // file:// protocol (where browser blocks PNG loading) or if any
  // PNG asset fails to load.  Each fallback copies an existing
  // programmatic texture to the key the map config expects.
  ensureMapTextureFallbacks(scene);
}

/**
 * Copy a source texture to a new key if that key doesn't already exist.
 * This creates programmatic fallbacks for PNG-only texture keys.
 */
function textureFallback(scene, targetKey, sourceKey) {
  if (scene.textures.exists(targetKey)) return;
  if (!scene.textures.exists(sourceKey)) return;
  const src = scene.textures.get(sourceKey).getSourceImage();
  if (!src) return;
  const canvas = scene.textures.createCanvas(targetKey, src.width, src.height);
  if (!canvas || !canvas.context) return;
  canvas.context.drawImage(src, 0, 0);
  canvas.refresh();
}

/**
 * Ensure all map texture keys referenced in config.js have a texture.
 * Called after createGameTextures() so the programmatic base textures exist.
 */
function ensureMapTextureFallbacks(scene) {
  // ── Inferno map (v3/v4 keys) ──
  textureFallback(scene, "inferno-v3-floor-a", "tile-floor-a");
  textureFallback(scene, "inferno-v3-floor-b", "tile-floor-b");
  textureFallback(scene, "inferno-v3-wall", "wall-solid");
  textureFallback(scene, "inferno-v3-box", "box-breakable");
  textureFallback(scene, "inferno-v3-bomb", "bomb");
  textureFallback(scene, "inferno-v3-explosion", "explosion");
  textureFallback(scene, "inferno-v3-orb-energy", "item-energy-orb");
  textureFallback(scene, "inferno-v3-orb-speed", "item-speed");
  textureFallback(scene, "inferno-v3-orb-range", "item-range");
  textureFallback(scene, "inferno-v3-orb-bomb", "item-bomb");
  textureFallback(scene, "inferno-v3-orb-shield", "item-shield");
  textureFallback(scene, "inferno-v3-enemy-0", "enemy-bot");
  textureFallback(scene, "inferno-v3-enemy-1", "enemy-drone");
  textureFallback(scene, "inferno-v3-enemy-2", "enemy-dummy");

  // Also handle base inferno keys (non-v3 fallback)
  textureFallback(scene, "inferno-floor-a", "tile-floor-a");
  textureFallback(scene, "inferno-floor-b", "tile-floor-b");
  textureFallback(scene, "inferno-wall", "wall-solid");
  textureFallback(scene, "inferno-box", "box-breakable");
  textureFallback(scene, "inferno-bomb", "bomb");
  textureFallback(scene, "inferno-explosion", "explosion");
  textureFallback(scene, "inferno-orb-energy", "item-energy-orb");
  textureFallback(scene, "inferno-orb-speed", "item-speed");
  textureFallback(scene, "inferno-orb-range", "item-range");
  textureFallback(scene, "inferno-orb-bomb", "item-bomb");
  textureFallback(scene, "inferno-orb-shield", "item-shield");
  textureFallback(scene, "inferno-enemy-0", "enemy-bot");
  textureFallback(scene, "inferno-enemy-1", "enemy-drone");
  textureFallback(scene, "inferno-enemy-2", "enemy-dummy");

  // ── Homeland map (v3 keys) ──
  textureFallback(scene, "homeland-v3-floor-a", "homeland-floor-a");
  textureFallback(scene, "homeland-v3-floor-b", "homeland-floor-b");
  textureFallback(scene, "homeland-v3-wall", "homeland-wall");
  textureFallback(scene, "homeland-v3-box", "homeland-box");
  textureFallback(scene, "homeland-v3-bomb", "homeland-bomb");
  textureFallback(scene, "homeland-v3-explosion", "explosion");
  textureFallback(scene, "homeland-v3-orb-energy", "item-energy-orb");
  textureFallback(scene, "homeland-v3-orb-speed", "item-speed");
  textureFallback(scene, "homeland-v3-orb-range", "item-range");
  textureFallback(scene, "homeland-v3-orb-bomb", "item-bomb");
  textureFallback(scene, "homeland-v3-orb-shield", "item-shield");
  textureFallback(scene, "homeland-v3-enemy-0", "homeland-enemy-0");
  textureFallback(scene, "homeland-v3-enemy-1", "homeland-enemy-1");
  textureFallback(scene, "homeland-v3-enemy-2", "homeland-enemy-2");

  // ── Abyss map ──
  textureFallback(scene, "abyss-floor-a", "tile-floor-a");
  textureFallback(scene, "abyss-floor-b", "tile-floor-b");
  textureFallback(scene, "abyss-wall", "wall-solid");
  textureFallback(scene, "abyss-bomb-blackhole", "bomb");
  textureFallback(scene, "abyss-explosion", "explosion");
  textureFallback(scene, "abyss-orb-energy", "item-energy-orb");
  textureFallback(scene, "abyss-orb-speed", "item-speed");
  textureFallback(scene, "abyss-orb-range", "item-range");
  textureFallback(scene, "abyss-orb-bomb", "item-bomb");
  textureFallback(scene, "abyss-orb-shield", "item-shield");
  textureFallback(scene, "abyss-enemy-0", "enemy-bot");
  textureFallback(scene, "abyss-enemy-1", "enemy-drone");
  textureFallback(scene, "abyss-enemy-2", "enemy-dummy");

  // ── Abyss portal textures (create simple colored circles) ──
  createPortalTexture(scene, "abyss-portal-purple-idle", 0x9a7cff, false);
  createPortalTexture(scene, "abyss-portal-purple-open", 0x9a7cff, true);
  createPortalTexture(scene, "abyss-portal-gold-idle", 0xffad45, false);
  createPortalTexture(scene, "abyss-portal-gold-open", 0xffad45, true);

  // ── Map preview for abyss ──
  createMapPreview(scene, "map-preview-abyss", 0x9a7cff, 0x58e8ff, 0x070b12);

  // ── Map preview for abyss ──
  createMapPreview(scene, "map-preview-abyss", 0x9a7cff, 0x58e8ff, 0x070b12);

  // ── UI background fallbacks (for file:// mode) ──
  createMenuBgFallback(scene, "menu-hero-ensemble-v1", 0x03070d, 0xff4452);
  createMenuBgFallback(scene, "menu-spoon-wallpaper-v2", 0x061016, 0x58e8ff);

  // ── Result art fallbacks ──
  HEROES.forEach((hero) => {
    createResultArtFallback(scene, `result-${hero.id}-win-v1`, hero.accent, "WIN");
    createResultArtFallback(scene, `result-${hero.id}-lose-v1`, 0x444444, "LOSE");
  });

  // ── Shadow-hero sheet fallback (generate hero textures if sheet missing) ──
  // This is already handled inside createShadowHeroTextures().
}

/**
 * Draw a simple dark background with radial glow as fallback for menu wallpapers.
 */
function createMenuBgFallback(scene, key, bgColor, accent) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  const w = 1280;
  const h = 760;
  // Fill solid background
  g.fillStyle(bgColor, 1);
  g.fillRect(0, 0, w, h);
  // Radial glow accent
  g.fillStyle(accent, 0.08);
  g.fillCircle(w / 2, h / 2, 400);
  // Scan-line hint
  g.lineStyle(1, accent, 0.04);
  for (let y = 0; y < h; y += 8) {
    g.lineBetween(0, y, w, y);
  }
  g.generateTexture(key, w, h);
  g.destroy();
}

/**
 * Draw a simple result banner as fallback for hero result art.
 */
function createResultArtFallback(scene, key, color, label) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  const w = 280;
  const h = 200;
  g.fillStyle(0x081116, 1);
  g.fillRoundedRect(0, 0, w, h, 16);
  g.lineStyle(3, color, 0.7);
  g.strokeRoundedRect(2, 2, w - 4, h - 4, 15);
  g.fillStyle(color, 0.2);
  g.fillCircle(w / 2, h / 2, 60);
  g.generateTexture(key, w, h);
  g.destroy();
}
function createPortalTexture(scene, key, color, isOpen) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  const size = 40;
  // Outer glow
  g.fillStyle(color, isOpen ? 0.9 : 0.45);
  g.fillCircle(size / 2, size / 2, size / 2 - 2);
  // Inner ring
  g.lineStyle(3, 0xffffff, isOpen ? 0.8 : 0.3);
  g.strokeCircle(size / 2, size / 2, size / 4);
  if (isOpen) {
    // Bright center for open portal
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(size / 2, size / 2, size / 6);
  }
  g.generateTexture(key, size, size);
  g.destroy();
}

export function createMenuMascotTexture(scene, sourceKey, textureKey) {
  if (scene.textures.exists(textureKey) || !scene.textures.exists(sourceKey)) return;

  const sourceImage = scene.textures.get(sourceKey)?.getSourceImage?.();
  if (!sourceImage) return;

  const size = 240;
  const stickerCanvas = scene.textures.createCanvas(textureKey, size, size);
  const ctx = stickerCanvas.context;
  ctx.clearRect(0, 0, size, size);

  ctx.fillStyle = "rgba(8, 17, 22, 0.78)";
  ctx.beginPath();
  ctx.ellipse(122, 206, 70, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  drawStickerBubble(ctx, 118, 112, 88, "#58e8ff", "#ffad45");

  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = 176;
  faceCanvas.height = 176;
  const faceCtx = faceCanvas.getContext("2d");
  const cover = coverCrop(sourceImage.width, sourceImage.height, 148, 148);
  faceCtx.drawImage(
    sourceImage,
    cover.sx,
    cover.sy,
    cover.sw,
    cover.sh,
    14,
    12,
    148,
    148,
  );
  const faceData = faceCtx.getImageData(0, 0, faceCanvas.width, faceCanvas.height);
  const pixels = faceData.data;
  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const alpha = pixels[index + 3];

    if (alpha === 0) continue;
    if (red > 236 && green > 236 && blue > 236) {
      pixels[index + 3] = 0;
      continue;
    }

    pixels[index] = posterize(red, 5, 1.08);
    pixels[index + 1] = posterize(green, 5, 1.05);
    pixels[index + 2] = posterize(blue, 5, 1.02);
  }
  faceCtx.putImageData(faceData, 0, 0);

  ctx.save();
  ctx.translate(117, 110);
  ctx.rotate(Phaser.Math.DegToRad(-8));
  ctx.drawImage(faceCanvas, -87, -87, 174, 174);
  ctx.restore();

  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(117, 110, 95, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(88,232,255,0.85)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(117, 110, 104, Phaser.Math.DegToRad(206), Phaser.Math.DegToRad(340));
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,173,69,0.92)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(117, 110, 104, Phaser.Math.DegToRad(28), Phaser.Math.DegToRad(168));
  ctx.stroke();

  ctx.fillStyle = "#09171c";
  roundRect(ctx, 54, 172, 126, 35, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 2;
  roundRect(ctx, 54, 172, 126, 35, 14);
  ctx.stroke();

  ctx.fillStyle = "#58e8ff";
  ctx.font = '900 16px "Microsoft YaHei", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("小SPOON", 117, 190);

  drawSpark(ctx, 34, 56, 14, "#ffad45");
  drawSpark(ctx, 199, 48, 11, "#58e8ff");
  drawSpark(ctx, 196, 176, 9, "#7df4d4");
  drawBubbleAccent(ctx, 36, 136, 16, "#7df4d4");
  drawBubbleAccent(ctx, 206, 126, 13, "#9a7cff");
  drawBubbleAccent(ctx, 176, 28, 10, "#58e8ff");

  stickerCanvas.refresh();
}

function createItem(scene, key, color, label) {
  if (scene.textures.exists(key)) return;
  const baseKey = `${key}-base`;
  const g = scene.add.graphics();
  drawBubble(g, 20, 20, 13, color, 0xffffff, 0.95);
  g.fillStyle(0x09171c, 0.86);
  g.fillCircle(20, 20, 8);
  g.generateTexture(baseKey, 40, 40);
  g.destroy();

  const text = scene.add.text(20, 20, label, {
    fontFamily: '"Microsoft YaHei", sans-serif',
    fontSize: label.length > 1 ? "10px" : "13px",
    color: "#ffffff",
    fontStyle: "700",
  });
  text.setOrigin(0.5);
  const rt = scene.add.renderTexture(0, 0, 40, 40);
  rt.draw(baseKey, 0, 0);
  rt.draw(text, 0, 0);
  rt.saveTexture(key);
  text.destroy();
  rt.destroy();
  scene.textures.remove(baseKey);
}

function createHero(scene, hero) {
  if (hero.id === "shadow" && scene.textures.exists(SHADOW_HERO_SHEET_KEY)) {
    createShadowHeroTextures(scene, hero);
    return;
  }

  const directions = [
    { key: hero.texture, facing: "down" },
    { key: `${hero.texture}-back`, facing: "up" },
    { key: `${hero.texture}-left`, facing: "left" },
    { key: `${hero.texture}-right`, facing: "right" },
  ];
  directions.forEach((dir) => {
    if (!scene.textures.exists(dir.key)) {
      createHeroTextureVariant(scene, hero, dir.key, 1, dir.facing);
    }
  });

  const posterKey = `${hero.texture}-poster`;
  if (!scene.textures.exists(posterKey)) {
    createHeroTextureVariant(scene, hero, posterKey, 4, "down");
  }
}

function createHeroTextureVariant(scene, hero, textureKey, scale = 1, facing = "down") {
  if (scene.textures.exists(textureKey)) return;

  const width = Math.round(64 * scale);
  const height = Math.round(68 * scale);
  const color = toColor(hero.accent);
  const dark = Phaser.Display.Color.GetColor(
    Math.max(20, color.red * 0.2),
    Math.max(22, color.green * 0.2),
    Math.max(32, color.blue * 0.28),
  );
  const g = scene.add.graphics();
  const px = (value) => Math.round(value * scale);
  const stroke = Math.max(2, Math.round(2 * scale));

  g.fillStyle(0x081116, 0.72);
  g.fillEllipse(px(32), px(58), px(36), px(13));
  g.fillStyle(0x18242c, 1);
  g.fillRoundedRect(px(19), px(30), px(26), px(29), px(10));
  g.fillStyle(dark, 1);
  g.fillRoundedRect(px(16), px(26), px(32), px(31), px(11));
  g.fillStyle(hero.accent, 0.32);
  g.fillRoundedRect(px(21), px(34), px(22), px(19), px(8));
  g.lineStyle(stroke, hero.accent, 0.5);
  g.lineBetween(px(20), px(42), px(44), px(42));

  const isBack = facing === "up";
  const isLeft = facing === "left";
  const isRight = facing === "right";

  if (hero.id === "shadow") {
    g.fillStyle(isBack ? 0x0f0d1f : 0x16132a, 1);
    g.fillTriangle(px(13), px(29), px(32), px(3), px(51), px(29));
    g.fillCircle(px(32), px(27), px(18));
    g.fillStyle(0x0b121c, 1);
    g.fillRoundedRect(px(20), px(23), px(24), px(13), px(7));
    if (!isBack) {
      g.fillStyle(0x78dfff, 0.95);
      if (isLeft) {
        g.fillCircle(px(24), px(29), px(4));
      } else if (isRight) {
        g.fillCircle(px(40), px(29), px(4));
      } else {
        g.fillCircle(px(26), px(29), px(4));
        g.fillCircle(px(38), px(29), px(4));
      }
    }
    g.fillStyle(0x9a7cff, 0.6);
    g.fillTriangle(px(17), px(37), px(5), px(60), px(24), px(49));
    drawBubble(g, px(10), px(45), px(7), hero.accent, 0xffffff, 0.9);
  } else if (hero.id === "ember") {
    g.fillStyle(isBack ? 0xb87620 : 0xff9b2f, 1);
    g.fillRoundedRect(px(16), px(10), px(32), px(23), px(10));
    g.fillStyle(0x2c1d16, 1);
    g.fillRoundedRect(px(14), px(27), px(36), px(10), px(5));
    g.fillStyle(isBack ? 0x2a160c : 0x341d12, 1);
    g.fillCircle(px(32), px(27), px(14));
    g.fillStyle(isBack ? 0xc2906b : 0xffd6a1, 1);
    g.fillCircle(px(32), px(30), px(12));
    if (!isBack) {
      g.fillStyle(0x111820, 1);
      if (isLeft) {
        g.fillCircle(px(25), px(29), Math.max(2, px(2)));
      } else if (isRight) {
        g.fillCircle(px(39), px(29), Math.max(2, px(2)));
      } else {
        g.fillCircle(px(27), px(29), Math.max(2, px(2)));
        g.fillCircle(px(37), px(29), Math.max(2, px(2)));
      }
      g.lineStyle(stroke, 0x5a2b15, 1);
      g.lineBetween(px(27), px(35), px(37), px(35));
    }
    drawBubble(g, px(11), px(45), px(7), hero.accent, 0xffffff, 0.9);
    drawBubble(g, px(52), px(43), px(6), hero.accent, 0xffffff, 0.85);
  } else if (hero.id === "volt") {
    g.fillStyle(isBack ? 0x0d2538 : 0x14314a, 1);
    g.fillCircle(px(32), px(26), px(14));
    g.fillStyle(0x0f2234, 1);
    g.fillTriangle(px(20), px(20), px(29), px(4), px(31), px(22));
    g.fillTriangle(px(31), px(18), px(43), px(5), px(39), px(23));
    g.fillStyle(isBack ? 0xb89c34 : 0xffe14a, 1);
    g.fillTriangle(px(43), px(6), px(35), px(28), px(47), px(20));
    g.fillStyle(isBack ? 0x8ab0b6 : 0xd9faff, 1);
    g.fillCircle(px(32), px(30), px(11));
    if (!isBack) {
      g.fillStyle(0x0b1b26, 1);
      if (isLeft) {
        g.fillCircle(px(25), px(29), Math.max(2, px(2)));
      } else if (isRight) {
        g.fillCircle(px(39), px(29), Math.max(2, px(2)));
      } else {
        g.fillCircle(px(27), px(29), Math.max(2, px(2)));
        g.fillCircle(px(37), px(29), Math.max(2, px(2)));
      }
    }
    g.lineStyle(stroke, hero.accent, 0.8);
    g.lineBetween(px(6), px(39), px(16), px(32));
    g.lineBetween(px(48), px(36), px(58), px(28));
    drawBubble(g, px(12), px(47), px(7), hero.accent, 0xffffff, 0.9);
  } else {
    g.fillStyle(isBack ? 0xbccad1 : 0xeaf7ff, 1);
    g.fillCircle(px(32), px(27), px(14));
    g.fillTriangle(px(20), px(17), px(11), px(31), px(28), px(24));
    g.fillTriangle(px(33), px(12), px(48), px(24), px(34), px(26));
    g.fillStyle(isBack ? 0xa4bac2 : 0xdaf3ff, 1);
    g.fillCircle(px(32), px(31), px(11));
    if (!isBack) {
      g.fillStyle(0x0f2330, 1);
      if (isLeft) {
        g.fillCircle(px(25), px(30), Math.max(2, px(2)));
      } else if (isRight) {
        g.fillCircle(px(39), px(30), Math.max(2, px(2)));
      } else {
        g.fillCircle(px(27), px(30), Math.max(2, px(2)));
        g.fillCircle(px(37), px(30), Math.max(2, px(2)));
      }
    }
    g.fillStyle(hero.accent, 0.76);
    if (isLeft) {
      g.fillTriangle(px(10), px(38), px(24), px(47), px(11), px(52));
    } else if (isRight) {
      g.fillTriangle(px(43), px(38), px(59), px(47), px(42), px(52));
    } else {
      g.fillTriangle(px(43), px(38), px(59), px(47), px(42), px(52));
    }
    g.lineStyle(stroke, hero.accent, 0.65);
    g.beginPath();
    g.arc(px(16), px(46), px(11), Phaser.Math.DegToRad(260), Phaser.Math.DegToRad(80));
    g.strokePath();
    drawBubble(g, px(12), px(46), px(7), hero.accent, 0xffffff, 0.88);
  }

  g.fillStyle(hero.accent, 0.9);
  g.fillRoundedRect(px(22), px(53), px(7), px(9), px(3));
  g.fillRoundedRect(px(35), px(53), px(7), px(9), px(3));

  const arrowColor = 0xffffff;
  if (isBack) {
    g.fillStyle(arrowColor, 0.6);
    g.fillTriangle(px(32), px(4), px(26), px(11), px(38), px(11));
  } else if (isLeft) {
    g.fillStyle(arrowColor, 0.6);
    g.fillTriangle(px(8), px(10), px(16), px(6), px(16), px(14));
  } else if (isRight) {
    g.fillStyle(arrowColor, 0.6);
    g.fillTriangle(px(56), px(10), px(48), px(6), px(48), px(14));
  }

  g.generateTexture(textureKey, width, height);
  g.destroy();
}

function createHeroTexture(scene, hero, textureKey, scale = 1) {
  createHeroTextureVariant(scene, hero, textureKey, scale, "down");
}

function createShadowHeroTextures(scene, hero) {
  const sourceImage = scene.textures.get(SHADOW_HERO_SHEET_KEY)?.getSourceImage?.();
  if (!sourceImage) {
    ["down", "up", "left", "right"].forEach((facing) => {
      const key = facing === "down" ? hero.texture : `${hero.texture}-${facing === "up" ? "back" : facing}`;
      createHeroTextureVariant(scene, hero, key, 1, facing);
    });
    createHeroTextureVariant(scene, hero, `${hero.texture}-poster`, 4, "down");
    return;
  }

  const crops = {
    front: { sx: 34, sy: 242, sw: 384, sh: 412 },
    back: { sx: 430, sy: 248, sw: 406, sh: 408 },
    left: { sx: 854, sy: 266, sw: 348, sh: 390 },
    right: { sx: 1238, sy: 270, sw: 372, sh: 394 },
  };

  createShadowHeroTexture(scene, hero.texture, sourceImage, crops.front, 64, 68, 2);
  createShadowHeroTexture(scene, `${hero.texture}-back`, sourceImage, crops.back, 64, 68, 2);
  createShadowHeroTexture(scene, `${hero.texture}-left`, sourceImage, crops.left, 64, 68, 2);
  createShadowHeroTexture(scene, `${hero.texture}-right`, sourceImage, crops.right, 64, 68, 2);
  createShadowHeroTexture(scene, `${hero.texture}-poster`, sourceImage, crops.front, 256, 272, 10);
}

function createShadowHeroTexture(scene, textureKey, sourceImage, crop, width, height, bottomPadding) {
  if (scene.textures.exists(textureKey)) return;

  const canvasTexture = scene.textures.createCanvas(textureKey, width, height);
  const ctx = canvasTexture.context;
  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;

  const availableHeight = height - bottomPadding;
  const scale = Math.min(width / crop.sw, availableHeight / crop.sh);
  const drawWidth = crop.sw * scale;
  const drawHeight = crop.sh * scale;
  const drawX = (width - drawWidth) / 2;
  const drawY = availableHeight - drawHeight;

  ctx.drawImage(
    sourceImage,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  );

  canvasTexture.refresh();
}

function createEnemy(scene, enemy, index) {
  if (scene.textures.exists(enemy.texture)) return;
  const g = scene.add.graphics();
  const shape = index === 1 ? "drone" : index === 2 ? "dummy" : "bot";
  g.fillStyle(0x0d1b22, 1);
  g.fillEllipse(22, 37, 28, 10);
  if (shape === "drone") {
    drawBubble(g, 22, 22, 14, enemy.accent, 0xffffff, 0.88);
    g.fillStyle(0x0a151b, 0.85);
    g.fillRoundedRect(15, 18, 14, 9, 4);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(19, 22, 2);
    g.fillCircle(25, 22, 2);
  } else if (shape === "dummy") {
    g.fillStyle(0x27333b, 1);
    g.fillRoundedRect(9, 8, 26, 31, 10);
    g.lineStyle(3, enemy.accent, 0.9);
    g.strokeRoundedRect(12, 11, 20, 24, 8);
    g.fillStyle(enemy.accent, 0.95);
    g.fillCircle(22, 23, 5);
  } else {
    g.fillStyle(0x23343c, 1);
    g.fillRoundedRect(9, 11, 26, 26, 9);
    g.fillStyle(enemy.accent, 0.92);
    g.fillRoundedRect(14, 18, 16, 6, 3);
    g.lineStyle(2, enemy.accent, 0.8);
    g.lineBetween(10, 14, 4, 8);
    g.lineBetween(34, 14, 40, 8);
  }
  g.generateTexture(enemy.texture, 44, 44);
  g.destroy();
}

function createHomelandEnemies(scene) {
  for (let index = 0; index < 3; index += 1) {
    const key = `homeland-enemy-${index}`;
    if (scene.textures.exists(key)) continue;
    const g = scene.add.graphics();
    g.fillStyle(0x050505, 0.48);
    g.fillEllipse(22, 37, 28, 10);
    g.fillStyle(index === 1 ? 0x2a1f12 : 0x211b13, 1);
    g.fillRoundedRect(9, 9, 26, 29, 8);
    g.lineStyle(2, 0xcaa14a, 0.86);
    g.strokeRoundedRect(11, 11, 22, 25, 7);
    g.fillStyle(0x050505, 0.82);
    g.fillRoundedRect(14, 18, 16, 7, 3);
    g.fillStyle(0xffd777, 0.95);
    g.fillCircle(18, 22, 2);
    g.fillCircle(26, 22, 2);
    if (index === 2) {
      g.fillStyle(0x5c3712, 0.82);
      g.fillTriangle(13, 15, 22, 4, 31, 15);
    }
    g.generateTexture(key, 44, 44);
    g.destroy();
  }
}

function createMapPreview(scene, key, accent, secondary, fill) {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  g.fillStyle(fill, 1);
  g.fillRoundedRect(0, 0, 420, 250, 12);
  g.lineStyle(4, accent, 0.76);
  g.strokeRoundedRect(18, 18, 384, 214, 12);
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 11; col += 1) {
      const x = 48 + col * 30;
      const y = 48 + row * 24;
      const border = row === 0 || row === 6 || col === 0 || col === 10;
      const openHomeland = key.includes("homeland") && (row === 3 || col === 5);
      const block = border || (!openHomeland && col % 2 === 0 && row % 2 === 0);
      g.fillStyle(block ? accent : ((col * 7 + row * 5) % 5 === 0 ? secondary : 0x171b20), block ? 0.58 : 0.62);
      g.fillRoundedRect(x, y, 22, 16, 2);
    }
  }
  if (key.includes("homeland")) {
    [120, 210, 300].forEach((x, index) => {
      const y = 88 + index * 42;
      g.lineStyle(2, accent, 0.68);
      g.strokeCircle(x, y, 18);
      g.lineBetween(x - 12, y, x + 12, y);
      g.lineBetween(x, y - 12, x, y + 12);
    });
  }
  g.generateTexture(key, 420, 250);
  g.destroy();
}

function coverCrop(width, height, targetWidth, targetHeight) {
  const targetRatio = targetWidth / targetHeight;
  const sourceRatio = width / height;
  if (sourceRatio > targetRatio) {
    const sw = height * targetRatio;
    return { sx: (width - sw) / 2, sy: 0, sw, sh: height };
  }
  const sh = width / targetRatio;
  return { sx: 0, sy: (height - sh) / 2, sw: width, sh };
}

function posterize(value, levels, contrast) {
  const stepped = Math.round((value / 255) * (levels - 1)) * (255 / (levels - 1));
  return Phaser.Math.Clamp((stepped - 128) * contrast + 128, 0, 255);
}

function drawStickerBubble(ctx, x, y, radius, mainColor, accentColor) {
  const gradient = ctx.createRadialGradient(x - 24, y - 28, 12, x, y, radius + 18);
  gradient.addColorStop(0, "rgba(255,255,255,0.34)");
  gradient.addColorStop(0.35, "rgba(88,232,255,0.24)");
  gradient.addColorStop(1, "rgba(8,17,22,0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius + 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(11, 24, 32, 0.88)";
  ctx.beginPath();
  ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
  ctx.fill();

  const ring = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
  ring.addColorStop(0, mainColor);
  ring.addColorStop(1, accentColor);
  ctx.strokeStyle = ring;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.ellipse(x - radius * 0.34, y - radius * 0.42, radius * 0.3, radius * 0.16, Phaser.Math.DegToRad(-24), 0, Math.PI * 2);
  ctx.fill();
}

function drawBubbleAccent(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.86;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.68)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.52)";
  ctx.beginPath();
  ctx.arc(x - radius * 0.3, y - radius * 0.28, Math.max(2, radius * 0.24), 0, Math.PI * 2);
  ctx.fill();
}

function drawSpark(ctx, x, y, radius, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(radius * 0.34, -radius * 0.34);
  ctx.lineTo(radius, 0);
  ctx.lineTo(radius * 0.34, radius * 0.34);
  ctx.lineTo(0, radius);
  ctx.lineTo(-radius * 0.34, radius * 0.34);
  ctx.lineTo(-radius, 0);
  ctx.lineTo(-radius * 0.34, -radius * 0.34);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
