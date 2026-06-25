import {
  createGameTextures,
  preloadCustomHeroAssets,
} from "../assets/AssetFactory.js";
import { ENEMY_TYPES, ENERGY_ORB_CONFIG, GAME_CONFIG, HEROES, ITEM_TYPES, SPAWN_POINTS, getMapConfig } from "../config.js";
import { AISystem } from "../systems/AISystem.js";
import { BombSystem } from "../systems/BombSystem.js";
import { ExplosionSystem } from "../systems/ExplosionSystem.js";
import { HeroAbilitySystem } from "../systems/HeroAbilitySystem.js";
import { ItemSystem } from "../systems/ItemSystem.js";
import { MapSystem } from "../systems/MapSystem.js";
import { MeteorSystem } from "../systems/MeteorSystem.js";
import { PlayerSystem } from "../systems/PlayerSystem.js";
import { PortalSystem } from "../systems/PortalSystem.js";
import { UISystem } from "../systems/UISystem.js";
import { CombatantRegistry } from "../multiplayer/CombatantRegistry.js";
import { KeyboardInputRouter, createInputProfiles } from "../multiplayer/KeyboardInputRouter.js";
import { TouchInputRouter, isMobileDevice } from "../mobile/TouchInputRouter.js";
import { normalizeMatchConfig } from "../multiplayer/MatchConfig.js";
import {
  GAME_TEXT,
  getHeroDisplay,
  getItemDisplay,
  MAP_LEGEND,
  STAT_LABELS,
} from "../uiText.js";
import { addPanelFrame, addTechOverlay, preloadTechUi } from "../ui/TechVisualKit.js";
import { beginSceneTransition, resetSceneTransition } from "./SceneFlow.js";

const PANEL_COLORS = {
  shell: 0x070b10,
  card: 0x11151b,
  cardAlt: 0x171a21,
  border: 0xffffff,
  accent: 0xff4452,
  cool: 0x58e8ff,
  warm: 0xff6674,
  text: "#f8fdff",
  muted: "#9bc3cf",
};

const HERO_PORTRAIT_SCALES = {
  shadow: 0.62,
  ember: 0.64,
  volt: 0.6,
  wind: 0.6,
};

const TOUCH_PROFILE = {
  movement: { left: ["LEFT"], right: ["RIGHT"], up: ["UP"], down: ["DOWN"] },
  bomb: ["BOMB"],
  ultimate: ["ULTIMATE"],
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.matchConfig = normalizeMatchConfig(data.matchConfig || { playerHeroes: [data.heroId || "shadow"] });
    this.heroId = this.matchConfig.playerHeroes[0];
    this.mapId = data.mapId || "inferno";
    this.mapConfig = getMapConfig(this.mapId);
    this.ended = false;
  }

  preload() {
    preloadTechUi(this);
    preloadCustomHeroAssets(this);
  }

  create() {
    resetSceneTransition(this);
    createGameTextures(this);
    this.playerInfoPanels = [];
    this.drawFrame();

    this.mapSystem = new MapSystem(this, this.mapId);
    this.mapSystem.create();
    this.itemSystem = new ItemSystem(this, this.mapSystem);
    this.bombSystem = new BombSystem(this, this.mapSystem);
    this.explosionSystem = new ExplosionSystem(this, this.mapSystem, this.itemSystem);
    this.bombSystem.setExplosionSystem(this.explosionSystem);

    this.registry = new CombatantRegistry();
    const mobile = isMobileDevice();
    if (mobile) {
      this.inputRouter = new TouchInputRouter(this);
    } else {
      this.inputRouter = new KeyboardInputRouter(this.input.keyboard);
    }
    const inputProfiles = mobile
      ? Array(this.matchConfig.playerCount).fill(TOUCH_PROFILE)
      : createInputProfiles(this.matchConfig.playerCount);
    this.playerSystems = this.matchConfig.playerHeroes.map((heroId, index) => {
      const player = new PlayerSystem(this, this.mapSystem, this.bombSystem, this.itemSystem, heroId, {
        ownerId: `player-${index + 1}`,
        playerSlot: index + 1,
        spawnCell: SPAWN_POINTS.players[index],
        inputRouter: this.inputRouter,
        inputProfile: inputProfiles[index],
      });
      return player;
    });
    this.playerSystems.forEach((player, index) => {
      player.create();
      this.registry.register(player, { kind: "player", slot: index + 1 });
    });
    this.playerSystem = this.playerSystems[0];
    this.aiSystem = new AISystem(this, this.mapSystem, this.bombSystem, this.playerSystems, this.itemSystem, {
      aiCount: this.matchConfig.aiCount,
      registry: this.registry,
    });
    this.aiSystem.create();
    this.portalSystem = this.mapSystem.mapConfig.portal?.enabled
      ? new PortalSystem(this, this.mapSystem, this.registry, this.aiSystem)
      : null;
    this.portalSystem?.create();
    this.aiSystem.setPortalSystem(this.portalSystem);
    this.heroAbilitySystems = this.playerSystems.map((player) => {
      const abilities = new HeroAbilitySystem(this, this.mapSystem, player, this.aiSystem, this.registry);
      player.setAbilitySystem(abilities);
      return abilities;
    });
    this.heroAbilitySystem = this.heroAbilitySystems[0];
    this.aiSystem.setHeroAbilitySystem(this.heroAbilitySystems);
    this.explosionSystem.connect(this.playerSystems, this.aiSystem, this.registry);
    this.meteorSystem = this.mapSystem.mapConfig.meteor?.enabled
      ? new MeteorSystem(this, this.mapSystem, this.playerSystems, this.aiSystem, this.itemSystem, this.registry)
      : null;
    this.aiSystem.setMeteorSystem(this.meteorSystem);
    this.createAbyssPlayerAuras();

    this.uiSystem = new UISystem(this, this.playerSystems, this.aiSystem, this.heroAbilitySystems, this.matchConfig);
    this.uiSystem.create();
    this.onCombatantDefeated = (ownerId) => this.showPlayerDefeated(ownerId);
    this.events.on("combatant-defeated", this.onCombatantDefeated);
    const cleanup = () => {
      this.inputRouter?.destroy();
      this.events.off?.("combatant-defeated", this.onCombatantDefeated);
    };
    if (this.events.once) this.events.once("shutdown", cleanup);
    else this.events.on("shutdown", cleanup);
  }

  update(time, delta) {
    if (this.ended) return;

    this.itemSystem.update(time, this.registry.all());

    this.playerSystems.forEach((player) => player.update(time, delta));
    this.aiSystem.update(time, delta);
    this.portalSystem?.update(time, delta);
    this.heroAbilitySystems.forEach((abilities) => abilities.update(time, delta));
    this.meteorSystem?.update(time, delta);
    this.explosionSystem.checkActiveHits();
    this.uiSystem.update();
    this.inputRouter.endFrame();
    this.updateAbyssPlayerAuras();
    const outcome = this.resolveOutcome();
    if (outcome) this.finish(outcome);
  }

  createAbyssPlayerAuras() {
    this.abyssPlayerAuras = [];
    if (this.mapConfig.theme !== "abyss") return;
    this.playerSystems.forEach((player) => {
      const aura = this.add.circle(player.sprite.x, player.sprite.y + 12, 19, player.hero.accent, 0.05)
        .setDepth(5)
        .setStrokeStyle(2, player.hero.accent, 0.28);
      this.tweens.add({
        targets: aura,
        scale: 1.16,
        alpha: 0.12,
        duration: 820,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      this.abyssPlayerAuras.push({ player, aura });
    });
  }

  updateAbyssPlayerAuras() {
    this.abyssPlayerAuras?.forEach(({ player, aura }) => {
      aura.setVisible(player.alive);
      if (player.alive) {
        aura.x = player.sprite.x;
        aura.y = player.sprite.y + 12;
      }
    });
  }

  resolveOutcome() {
    if (this.matchConfig.playerCount === 2) return this.registry.outcome();
    const player = this.playerSystem;
    const aliveEnemies = this.aiSystem.enemies.filter((enemy) => enemy.alive);
    if (!player.alive && aliveEnemies.length === 0) return { type: "draw", winner: null };
    if (!player.alive) return { type: "winner", winner: aliveEnemies[0] };
    if (aliveEnemies.length === 0) return { type: "winner", winner: player };
    return null;
  }

  finish(outcome) {
    if (this.ended) return;
    this.ended = true;
    const winnerData = outcome.winner ? {
      ownerId: outcome.winner.ownerId,
      kind: outcome.winner.combatantKind,
      heroId: outcome.winner.combatantKind === "player" ? outcome.winner.hero?.id : null,
      texture: outcome.winner.sprite?.texture?.key,
      stats: { ...outcome.winner.stats },
    } : null;
    beginSceneTransition(this, "ResultScene", {
        result: outcome.type === "draw" ? "draw" : winnerData.kind === "player" ? "win" : "lose",
        winner: winnerData,
        matchConfig: this.matchConfig,
        heroId: winnerData?.heroId || this.heroId,
        stats: winnerData?.stats || this.playerSystem.stats,
      }, { delayMs: 420 });
  }

  drawFrame() {
    this.add.rectangle(640, 380, 1280, 760, 0x05070c);

    for (let index = 0; index < 30; index += 1) {
      this.add.circle(
        Phaser.Math.Between(24, 1256),
        Phaser.Math.Between(24, 736),
        Phaser.Math.Between(2, 5),
        Phaser.Utils.Array.GetRandom([0xff4452, 0xff6674, 0x58e8ff, 0x7df4d4]),
        Phaser.Math.FloatBetween(0.035, 0.11),
      );
    }

    this.add.rectangle(640, 380, 1280, 760, 0x11151d, 0.16);
    this.add.rectangle(260, 112, 320, 96, 0xff4452, 0.052).setAngle(-14);
    this.add.rectangle(1030, 642, 330, 112, 0xff4452, 0.045).setAngle(-12);
    this.add.rectangle(648, 382, 1120, 676, 0x070a0f, 0.42).setStrokeStyle(1, 0xff4452, 0.11);

    this.playfieldShell = this.add.rectangle(640, 392, 1240, 706, 0x070b10, 0.86).setStrokeStyle(1, 0xff4452, 0.16);
    this.boardFrame = this.add.rectangle(
      GAME_CONFIG.BOARD_OFFSET_X + (GAME_CONFIG.GRID_COLS * GAME_CONFIG.TILE_SIZE) / 2,
      GAME_CONFIG.BOARD_OFFSET_Y + (GAME_CONFIG.GRID_ROWS * GAME_CONFIG.TILE_SIZE) / 2,
      GAME_CONFIG.GRID_COLS * GAME_CONFIG.TILE_SIZE + 24,
      GAME_CONFIG.GRID_ROWS * GAME_CONFIG.TILE_SIZE + 24,
      0x080b10,
      0.6,
    ).setStrokeStyle(3, PANEL_COLORS.accent, 0.48);
    this.add.rectangle(this.boardFrame.x, this.boardFrame.y, this.boardFrame.width + 20, this.boardFrame.height + 20, 0xff4452, 0.035)
      .setStrokeStyle(1, 0x58e8ff, 0.16);

    this.drawLeftPanel();
    if (this.matchConfig.playerCount === 2) this.drawSecondPlayerPanel();
    else this.drawRightPanel();

    this.add.text(494, 700, GAME_TEXT.boardSize, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color: "#d8f8ff",
      fontStyle: "800",
      backgroundColor: "rgba(10, 12, 18, 0.78)",
      padding: { x: 14, y: 6 },
    }).setDepth(10);
    this.techOverlay = addTechOverlay(this, 60, 0.88);
  }

  drawLeftPanel() {
    const hero = HEROES.find((item) => item.id === this.heroId) || HEROES[0];
    const copy = getHeroDisplay(hero);
    const leftX = 174;

    this.leftPanel = this.add.rectangle(leftX, 380, 300, 684, PANEL_COLORS.shell, 0.92)
      .setStrokeStyle(2, PANEL_COLORS.accent, 0.28);
    this.leftPanelSkin = addPanelFrame(this, leftX, 380, 322, 706, 0, 0.62);
    this.add.rectangle(leftX, 92, 258, 82, PANEL_COLORS.cardAlt, 0.88)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.34);
    this.add.rectangle(leftX - 118, 380, 4, 628, PANEL_COLORS.accent, 0.76);
    this.add.rectangle(leftX + 122, 112, 58, 3, PANEL_COLORS.cool, 0.42);

    this.add.text(44, 44, GAME_TEXT.title, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "34px",
      color: "#f8fdff",
      fontStyle: "900",
    });
    this.add.text(46, 82, GAME_TEXT.subtitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "16px",
      color: "#d8f8ff",
      fontStyle: "800",
    });

    this.cardTag(50, 130, GAME_TEXT.heroPanelTitle, hero.accent);
    this.add.rectangle(leftX, 286, 248, 308, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(2, hero.accent, 0.42);
    this.add.rectangle(leftX, 206, 210, 154, 0xff4452, 0.035).setStrokeStyle(1, 0xff4452, 0.16);
    this.add.ellipse(leftX, 334, 206, 30, 0x04080b, 0.26);

    const portraitKey = this.textures.exists(`${hero.texture}-poster`) ? `${hero.texture}-poster` : hero.texture;
    const portraitScale = this.textures.exists(`${hero.texture}-poster`)
      ? HERO_PORTRAIT_SCALES[hero.id] || 0.54
      : 2.2;
    this.add.image(leftX, 236, portraitKey).setScale(portraitScale).setDepth(4);

    this.add.text(leftX, 370, copy.name, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "20px",
      color: PANEL_COLORS.text,
      fontStyle: "900",
      align: "center",
      wordWrap: { width: 220 },
    }).setOrigin(0.5);
    this.add.text(leftX, 402, `${copy.description}\n${STAT_LABELS.speed}/${hero.baseStats?.speed ?? 1}  ${STAT_LABELS.maxBombs}/${hero.baseStats?.maxBombs ?? 1}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "12px",
      color: PANEL_COLORS.muted,
      fontStyle: "700",
      align: "center",
      wordWrap: { width: 218 },
      lineSpacing: 5,
    }).setOrigin(0.5, 0);

    this.add.rectangle(leftX, 526, 248, 124, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.2);
    this.drawStatChip(112, 492, STAT_LABELS.speed, hero.baseStats?.speed ?? 1, hero.accent);
    this.drawStatChip(236, 492, STAT_LABELS.maxBombs, hero.baseStats?.maxBombs ?? 1, hero.accent);
    this.drawStatChip(112, 546, STAT_LABELS.blastRange, hero.baseStats?.blastRange ?? 2, hero.accent);
    this.drawStatChip(236, 546, STAT_LABELS.shield, hero.baseStats?.shield ?? 0, hero.accent);

    this.cardTag(50, 596, GAME_TEXT.controlTitle, PANEL_COLORS.warm);
    this.add.rectangle(leftX, 662, 248, 108, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(1, PANEL_COLORS.warm, 0.28);
    this.drawControlRow(64, 628, GAME_TEXT.moveLabel, GAME_TEXT.moveValue);
    this.drawControlRow(64, 660, GAME_TEXT.bombLabel, this.matchConfig.playerCount === 2 ? "左 Ctrl" : GAME_TEXT.bombValue);
    this.drawControlRow(64, 692, GAME_TEXT.ultimateLabel, this.matchConfig.playerCount === 2 ? "Q" : GAME_TEXT.ultimateValue);
    this.playerInfoPanels[0] = this.createDefeatPanel(1, leftX, 300, hero.accent);
  }

  drawSecondPlayerPanel() {
    const hero = HEROES.find((item) => item.id === this.matchConfig.playerHeroes[1]) || HEROES[1];
    const copy = getHeroDisplay(hero);
    const rightX = 1118;
    this.rightPanel = this.add.rectangle(rightX, 380, 272, 684, PANEL_COLORS.shell, 0.92)
      .setStrokeStyle(2, hero.accent, 0.34);
    this.rightPanelSkin = addPanelFrame(this, rightX, 380, 294, 706, 0, 0.62);
    this.add.rectangle(rightX + 118, 380, 4, 628, hero.accent, 0.8);
    this.cardTag(996, 58, "玩家 2", hero.accent);
    this.add.rectangle(rightX, 278, 230, 360, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(2, hero.accent, 0.42);
    const portraitKey = this.textures.exists(`${hero.texture}-poster`) ? `${hero.texture}-poster` : hero.texture;
    const portraitScale = this.textures.exists(`${hero.texture}-poster`) ? (HERO_PORTRAIT_SCALES[hero.id] || 0.54) : 2.2;
    this.add.image(rightX, 216, portraitKey).setScale(portraitScale).setDepth(4);
    this.add.text(rightX, 388, copy.name, {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "19px", color: PANEL_COLORS.text,
      fontStyle: "900", align: "center", wordWrap: { width: 214 },
    }).setOrigin(0.5);
    this.add.text(rightX, 424, copy.description, {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "12px", color: PANEL_COLORS.muted,
      fontStyle: "700", align: "center", wordWrap: { width: 210 }, lineSpacing: 4,
    }).setOrigin(0.5, 0);
    this.add.rectangle(rightX, 526, 230, 116, PANEL_COLORS.card, 0.9).setStrokeStyle(1, hero.accent, 0.26);
    this.drawStatChip(1068, 500, STAT_LABELS.speed, hero.baseStats?.speed ?? 1, hero.accent);
    this.drawStatChip(1178, 500, STAT_LABELS.maxBombs, hero.baseStats?.maxBombs ?? 1, hero.accent);
    this.drawStatChip(1068, 550, STAT_LABELS.blastRange, hero.baseStats?.blastRange ?? 2, hero.accent);
    this.drawStatChip(1178, 550, STAT_LABELS.shield, hero.baseStats?.shield ?? 0, hero.accent);
    this.cardTag(996, 594, GAME_TEXT.controlTitle, PANEL_COLORS.cool);
    this.add.rectangle(rightX, 662, 230, 108, PANEL_COLORS.card, 0.9).setStrokeStyle(1, PANEL_COLORS.cool, 0.3);
    this.drawControlRow(1006, 628, GAME_TEXT.moveLabel, "方向键");
    this.drawControlRow(1006, 660, GAME_TEXT.bombLabel, "右 Ctrl");
    this.drawControlRow(1006, 692, GAME_TEXT.ultimateLabel, "P");
    this.playerInfoPanels[1] = this.createDefeatPanel(2, rightX, 272, hero.accent);
  }

  createDefeatPanel(slot, x, width, accent) {
    const overlay = this.add.rectangle(x, 380, width - 14, 650, 0x08090d, 0)
      .setDepth(32)
      .setStrokeStyle(2, 0xff4358, 0.68)
      .setVisible(false);
    const slashA = this.add.rectangle(x, 380, width - 54, 5, 0xff4358, 0.76)
      .setAngle(-12).setDepth(33).setVisible(false);
    const slashB = this.add.rectangle(x, 380, width - 54, 2, accent, 0.46)
      .setAngle(12).setDepth(33).setVisible(false);
    const slotLabel = this.add.text(x, 340, `PLAYER ${slot}`, {
      fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#ff8b97", fontStyle: "900",
    }).setOrigin(0.5).setDepth(34).setVisible(false);
    const defeatStamp = this.add.text(x, 380, "bye man", {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "38px", color: "#ffffff", fontStyle: "900",
      backgroundColor: "rgba(157, 35, 50, 0.92)", padding: { x: 24, y: 10 },
    }).setOrigin(0.5).setAngle(-5).setDepth(35).setVisible(false);
    const subLabel = this.add.text(x, 438, "COMBATANT ELIMINATED", {
      fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#ff8b97", fontStyle: "900",
    }).setOrigin(0.5).setDepth(34).setVisible(false);
    return { overlay, slashA, slashB, slotLabel, defeatStamp, subLabel };
  }

  showPlayerDefeated(ownerId) {
    if (!ownerId?.startsWith?.("player-")) return;
    const slot = Number(ownerId.split("-")[1]);
    const panel = this.playerInfoPanels[slot - 1];
    if (!panel || panel.defeatStamp.visible) return;
    Object.values(panel).forEach((object) => object.setVisible(true));
    panel.overlay.setAlpha(0);
    panel.defeatStamp.setScale(1.22).setAlpha(0);
    this.tweens.add({ targets: panel.overlay, alpha: 0.82, duration: 220, ease: "Quad.easeOut" });
    this.tweens.add({
      targets: panel.defeatStamp,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 280,
      ease: "Back.easeOut",
    });
  }

  drawRightPanel() {
    const rightX = 1118;
    this.rightPanel = this.add.rectangle(rightX, 380, 272, 684, PANEL_COLORS.shell, 0.92)
      .setStrokeStyle(2, PANEL_COLORS.accent, 0.28);
    this.rightPanelSkin = addPanelFrame(this, rightX, 380, 294, 706, 0, 0.62);
    this.add.rectangle(rightX + 118, 380, 4, 628, PANEL_COLORS.accent, 0.76);

    this.add.rectangle(rightX, 126, 230, 116, PANEL_COLORS.cardAlt, 0.88)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.34);
    this.cardTag(996, 78, GAME_TEXT.goalTitle, PANEL_COLORS.warm);
    this.add.text(1010, 112, GAME_TEXT.goalBody, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color: PANEL_COLORS.muted,
      fontStyle: "700",
      wordWrap: { width: 214 },
      lineSpacing: 6,
    });

    this.add.rectangle(rightX, 326, 230, 252, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.32);
    this.cardTag(996, 194, GAME_TEXT.itemTitle, PANEL_COLORS.cool);

    [...ITEM_TYPES, { id: ENERGY_ORB_CONFIG.id, texture: ENERGY_ORB_CONFIG.texture }].forEach((item, index) => {
      const display = getItemDisplay(item.id, item.label);
      const y = 234 + index * 44;
      const texture = this.mapConfig.itemTextures?.[item.id] || item.texture;
      this.add.image(1028, y, texture).setScale(0.86);
      this.add.text(1058, y - 11, display.label, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "13px",
        color: PANEL_COLORS.text,
        fontStyle: "900",
      });
      this.add.text(1058, y + 5, display.description, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "11px",
        color: PANEL_COLORS.muted,
        fontStyle: "700",
        wordWrap: { width: 144 },
        lineSpacing: 4,
      });
    });

    this.add.rectangle(rightX, 560, 230, 194, PANEL_COLORS.card, 0.9)
      .setStrokeStyle(1, PANEL_COLORS.accent, 0.22);
    this.cardTag(996, 476, GAME_TEXT.mapTitle, PANEL_COLORS.cool);

    const mapLegend = MAP_LEGEND.map((entry) => {
      if (entry.texture === "tile-floor-a") return { ...entry, texture: this.mapConfig.textures.floorA };
      if (entry.texture === "wall-solid") return { ...entry, texture: this.mapConfig.textures.wall };
      if (entry.texture === "box-breakable") return { ...entry, texture: this.mapConfig.textures.box };
      if (entry.texture === "bomb") return { ...entry, texture: this.mapConfig.textures.bomb };
      return entry;
    });

    mapLegend.forEach((entry, index) => {
      const y = 516 + index * 30;
      this.add.image(1028, y, entry.texture).setScale(0.76);
      this.add.text(1058, y - 9, entry.label, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "12px",
        color: "#d8f8ff",
        fontStyle: "800",
        wordWrap: { width: 150 },
      });
    });

    this.add.text(1010, 642, GAME_TEXT.enemyPanelTitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: PANEL_COLORS.text,
      fontStyle: "900",
    });
    ENEMY_TYPES.forEach((enemy, index) => {
      this.add.rectangle(1032 + index * 66, 680, 48, 48, 0x141820, 0.86)
        .setStrokeStyle(1, enemy.accent, 0.32);
      this.add.image(1032 + index * 66, 680, enemy.texture).setScale(0.76);
    });
  }

  drawStatChip(x, y, label, value, accent) {
    this.add.rectangle(x, y, 104, 42, PANEL_COLORS.cardAlt, 0.9)
      .setStrokeStyle(1, accent, 0.34);
    this.add.text(x - 38, y - 11, label, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "11px",
      color: PANEL_COLORS.muted,
      fontStyle: "700",
    });
    this.add.text(x - 38, y + 1, String(value), {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "20px",
      color: Phaser.Display.Color.IntegerToColor(accent).rgba,
      fontStyle: "900",
    });
  }

  drawControlRow(x, y, label, value) {
    this.add.text(x, y, label, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color: PANEL_COLORS.text,
      fontStyle: "800",
    });
    this.add.text(x + 118, y, value, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "12px",
      color: PANEL_COLORS.muted,
      fontStyle: "700",
      wordWrap: { width: 104 },
    });
  }

  cardTag(x, y, text, accent) {
    this.add.rectangle(x + 72, y + 12, 144, 30, 0x15171e, 0.92)
      .setStrokeStyle(1, accent, 0.34);
    this.add.rectangle(x + 2, y + 28, 52, 3, accent, 0.75);
    this.add.text(x, y, text, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "15px",
      color: Phaser.Display.Color.IntegerToColor(accent).rgba,
      fontStyle: "900",
    });
  }
}
