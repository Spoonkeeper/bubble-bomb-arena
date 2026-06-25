import { MAPS, MENU_THEME } from "../config.js";
import {
  createGameTextures,
  createMenuMascotTexture,
  preloadCustomHeroAssets,
} from "../assets/AssetFactory.js";
import { MENU_TEXT } from "../uiText.js";
import { normalizeMatchConfig } from "../multiplayer/MatchConfig.js";
import { addAmbientTechMotion, addPanelFrame, addPrimaryButtonSkin, addTechOverlay, preloadTechUi, wireTechButton } from "../ui/TechVisualKit.js";
import { beginSceneTransition, resetSceneTransition } from "./SceneFlow.js";

const MENU_BG_KEY = "menu-spoon-wallpaper-v2";
const MENU_BG_PATH = "assets/menu-spoon-wallpaper-v2.png";
const MAP_PREVIEWS = {
  inferno: { key: "map-preview-inferno-v2", path: "assets/map-preview-inferno-v2.png", accent: 0xff3446 },
  homeland: { key: "map-preview-homeland-v2", path: "assets/map-preview-homeland-v2.png", accent: 0xd64242 },
  abyss: { key: "map-preview-abyss-v3", path: "assets/map-preview-abyss-v3.png", accent: 0xa45cff },
};

export class MapSelectScene extends Phaser.Scene {
  constructor() {
    super("MapSelectScene");
    this.heroId = "shadow";
    this.selectedMapId = MAPS[0].id;
    this.cards = [];
  }

  init(data) {
    this.matchConfig = normalizeMatchConfig(data?.matchConfig || { playerHeroes: [data?.heroId || this.heroId] });
    this.heroId = this.matchConfig.playerHeroes[0];
    this.selectedMapId = data?.mapId || this.selectedMapId || MAPS[0].id;
  }

  preload() {
    preloadTechUi(this);
    if (!this.textures.exists(MENU_BG_KEY)) this.load.image(MENU_BG_KEY, MENU_BG_PATH);
    Object.values(MAP_PREVIEWS).forEach((preview) => {
      if (!this.textures.exists(preview.key)) this.load.image(preview.key, preview.path);
    });
    if (!this.textures.exists(MENU_THEME.mascotSourceKey)) {
      this.load.image(MENU_THEME.mascotSourceKey, MENU_THEME.mascotSourcePath);
    }
    preloadCustomHeroAssets(this);
  }

  create() {
    resetSceneTransition(this);
    createGameTextures(this);
    createMenuMascotTexture(this, MENU_THEME.mascotSourceKey, MENU_THEME.mascotTextureKey);
    this.cameras.main.setBackgroundColor("#050912");

    this.drawBackdrop();
    this.drawTitle();
    this.drawBackButton();
    this.drawCards();
    this.drawConfirmButton();
    this.refreshSelection();

    this.input.keyboard.once("keydown-ENTER", () => this.enterSelectedMap());
  }

  drawBackdrop() {
    const bg = this.add.image(640, 380, MENU_BG_KEY).setDepth(-50);
    bg.setScale(Math.max(1280 / bg.width, 760 / bg.height));
    bg.setAlpha(1);
    this.add.rectangle(640, 380, 1280, 760, 0x030711, 0.18).setDepth(-49);
    this.add.rectangle(640, 412, 1120, 574, 0x040811, 0.34)
      .setDepth(-20)
      .setStrokeStyle(1, 0xff3446, 0.22);
    this.add.rectangle(640, 174, 1040, 3, 0xff3446, 0.72).setDepth(-19);
    this.add.rectangle(640, 676, 1040, 3, 0xff3446, 0.5).setDepth(-19);
    this.techOverlay = addTechOverlay(this, 80, 0.94);
    this.ambientScan = addAmbientTechMotion(this, 1);
  }

  drawTitle() {
    this.title = this.add.text(74, 62, MENU_TEXT.mapSelectTitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "62px",
      color: "#f8fdff",
      fontStyle: "900",
    }).setDepth(20).setShadow(0, 7, "#02070c", 14, true, true);
    this.add.text(80, 134, `${MENU_TEXT.title} / ${MENU_TEXT.slogan}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "22px",
      color: "#ff5364",
      fontStyle: "900",
    }).setDepth(20);
    this.add.text(80, 706, "SELECTED MAP LOADS CHARACTER DATA, AI, ITEMS AND ULTIMATE SYSTEM WITHOUT CHANGES", {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      color: "#7f9aa5",
      fontStyle: "700",
    }).setDepth(20);
    this.tweens.add({
      targets: this.title,
      x: 82,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawCards() {
    const positions = [
      { x: 246, y: 410 },
      { x: 640, y: 410 },
      { x: 1034, y: 410 },
    ];

    MAPS.forEach((map, index) => {
      const preview = MAP_PREVIEWS[map.id] || MAP_PREVIEWS.inferno;
      const pos = positions[index] || positions[0];
      const card = this.add.rectangle(pos.x, pos.y, 342, 368, 0x080d16, 0.88)
        .setDepth(5)
        .setStrokeStyle(2, preview.accent, 0.34)
        .setInteractive({ useHandCursor: true });
      const cardSkin = addPanelFrame(this, pos.x, pos.y, 366, 392, 5, 0.72);
      const glow = this.add.rectangle(pos.x, pos.y, 320, 340, preview.accent, 0.04).setDepth(6);
      const selectionPulse = this.add.rectangle(pos.x, pos.y, 358, 386, preview.accent, 0)
        .setDepth(4)
        .setStrokeStyle(3, preview.accent, 0);
      const frame = this.add.rectangle(pos.x, pos.y, 320, 344, 0x02050a, 0)
        .setDepth(9)
        .setStrokeStyle(1, 0xffffff, 0.18);
      const topAccent = this.add.rectangle(pos.x - 98, pos.y - 174, 96, 4, preview.accent, 0.9)
        .setDepth(10);
      const bottomAccent = this.add.rectangle(pos.x + 92, pos.y + 174, 104, 4, preview.accent, 0.62)
        .setDepth(10);
      const imageFrame = this.add.rectangle(pos.x, pos.y - 78, 300, 184, 0x02050a, 0.9)
        .setDepth(6)
        .setStrokeStyle(2, preview.accent, 0.5);
      const imageInner = this.add.rectangle(pos.x, pos.y - 78, 284, 166, 0x07101a, 0.95)
        .setDepth(6);
      const img = this.add.image(pos.x, pos.y - 78, preview.key).setDisplaySize(280, 156).setDepth(7);
      const shade = this.add.rectangle(pos.x, pos.y + 76, 306, 112, 0x050912, 0.78).setDepth(8);
      const name = this.add.text(pos.x - 145, pos.y + 38, map.name, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "27px",
        color: "#f8fdff",
        fontStyle: "900",
      }).setDepth(9);
      const desc = this.add.text(pos.x - 145, pos.y + 80, map.description, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "14px",
        color: "#d2e5ec",
        fontStyle: "700",
        wordWrap: { width: 282 },
        lineSpacing: 8,
      }).setDepth(9);

      const tagObjects = [];
      map.tags.forEach((tag, tagIndex) => {
        const tx = pos.x - 145 + tagIndex * 94;
        const tagBg = this.add.rectangle(tx + 37, pos.y + 146, 74, 28, 0x111923, 0.94)
          .setStrokeStyle(1, preview.accent, 0.34)
          .setDepth(9);
        const tagText = this.add.text(tx, pos.y + 137, tag, {
          fontFamily: '"Microsoft YaHei", sans-serif',
          fontSize: "12px",
          color: Phaser.Display.Color.IntegerToColor(preview.accent).rgba,
          fontStyle: "900",
        }).setDepth(10);
        tagObjects.push(tagBg, tagText);
      });

      const scan = this.add.rectangle(pos.x - 142, pos.y - 146, 62, 4, preview.accent, 0.88)
        .setDepth(10)
        .setOrigin(0, 0.5);
      this.tweens.add({
        targets: scan,
        x: pos.x + 80,
        alpha: 0.18,
        duration: 1500 + index * 220,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      card.on("pointerdown", () => {
        this.selectedMapId = map.id;
        this.refreshSelection();
      });

      this.cards.push({
        map,
        preview,
        card,
        cardSkin,
        glow,
        selectionPulse,
        frame,
        imageFrame,
        imageInner,
        imageBaseWidth: 280,
        imageBaseHeight: 156,
        topAccent,
        bottomAccent,
        img,
        shade,
        name,
        desc,
        tagObjects,
        scan,
      });
    });
  }

  drawConfirmButton() {
    this.confirmGlow = this.add.ellipse(640, 668, 300, 80, 0xff3446, 0.2).setDepth(10);
    this.confirmButtonSkin = addPrimaryButtonSkin(this, 640, 668, 314, 84, 11);
    this.confirmButton = this.add.rectangle(640, 668, 272, 70, 0xff3446, 0.03)
      .setDepth(11)
      .setStrokeStyle(3, 0xffffff, 0.32)
      .setInteractive({ useHandCursor: true });
    this.confirmButton.on("pointerdown", () => this.enterSelectedMap());
    this.confirmText = this.add.text(640, 668, MENU_TEXT.enterMap, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "27px",
      color: "#0a1015",
      fontStyle: "900",
    }).setOrigin(0.5).setDepth(12);
    wireTechButton(this, this.confirmButton, [this.confirmButtonSkin, this.confirmText]);

    this.tweens.add({
      targets: [this.confirmGlow, this.confirmButton],
      scaleX: 1.035,
      scaleY: 1.05,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawBackButton() {
    this.backButton = this.add.rectangle(884, 712, 146, 42, 0x080d16, 0.9)
      .setDepth(24)
      .setStrokeStyle(2, 0xff5364, 0.52)
      .setInteractive({ useHandCursor: true });
    this.backText = this.add.text(884, 712, "返回开始页", {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "17px",
      color: "#f8fdff",
      fontStyle: "900",
    }).setOrigin(0.5).setDepth(25);
    this.backLine = this.add.rectangle(832, 732, 44, 3, 0xff5364, 0.82).setDepth(25);
    this.backButton.on("pointerdown", () => this.returnToStart());
    this.backText.setInteractive({ useHandCursor: true }).on("pointerdown", () => this.returnToStart());
    this.tweens.add({
      targets: this.backLine,
      x: 934,
      alpha: 0.25,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  refreshSelection() {
    this.cards.forEach((entry) => {
      const selected = entry.map.id === this.selectedMapId;
      entry.card.setStrokeStyle(selected ? 4 : 2, entry.preview.accent, selected ? 0.9 : 0.28);
      entry.glow.setFillStyle(entry.preview.accent, selected ? 0.14 : 0.035);
      entry.img.setDisplaySize(
        selected ? entry.imageBaseWidth + 10 : entry.imageBaseWidth,
        selected ? entry.imageBaseHeight + 6 : entry.imageBaseHeight,
      );
      entry.imageFrame.setStrokeStyle(selected ? 3 : 2, entry.preview.accent, selected ? 0.78 : 0.42);
      entry.name.setColor(selected ? "#ffffff" : "#d9e8ee");
      entry.scan.setAlpha(selected ? 0.92 : 0.38);
      entry.selectionPulse.setAlpha(selected ? 0.58 : 0);
      entry.selectionPulse.setScale(1);
      entry.topAccent.setAlpha(selected ? 1 : 0.48);
      entry.bottomAccent.setAlpha(selected ? 0.82 : 0.34);

      this.tweens.killTweensOf(entry.selectionPulse);
      if (selected) {
        this.tweens.add({
          targets: entry.selectionPulse,
          alpha: 0.12,
          scaleX: 1.04,
          scaleY: 1.055,
          duration: 820,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }
    });
  }

  enterSelectedMap() {
    return beginSceneTransition(this, "GameScene", {
      matchConfig: this.matchConfig,
      mapId: this.selectedMapId,
    });
  }

  returnToStart() {
    return beginSceneTransition(this, "MatchSetupScene", { matchConfig: this.matchConfig });
  }
}
