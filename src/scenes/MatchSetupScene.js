import { HEROES, MENU_THEME } from "../config.js";
import { createGameTextures, createMenuMascotTexture, preloadCustomHeroAssets } from "../assets/AssetFactory.js";
import { normalizeMatchConfig } from "../multiplayer/MatchConfig.js";
import { getHeroDisplay, MENU_TEXT } from "../uiText.js";
import { addAmbientTechMotion, addPanelFrame, addPrimaryButtonSkin, addTechOverlay, preloadTechUi, wireTechButton } from "../ui/TechVisualKit.js";
import { beginSceneTransition, resetSceneTransition } from "./SceneFlow.js";

const MENU_BG_KEY = "menu-spoon-wallpaper-v2";
const MENU_BG_PATH = "assets/menu-spoon-wallpaper-v2.png";
const FONT = '"Microsoft YaHei", sans-serif';

export class MatchSetupScene extends Phaser.Scene {
  constructor() {
    super("MatchSetupScene");
    this.matchConfig = normalizeMatchConfig();
    this.playerButtons = [];
    this.aiButtons = [];
    this.heroButtons = [];
    this.editingPlayerSlot = 0;
  }

  init(data = {}) {
    this.matchConfig = normalizeMatchConfig(data.matchConfig || {
      playerCount: 1,
      aiCount: 3,
      playerHeroes: [HEROES[0].id],
    });
    this.editingPlayerSlot = 0;
  }

  preload() {
    preloadTechUi(this);
    if (!this.textures.exists(MENU_BG_KEY)) this.load.image(MENU_BG_KEY, MENU_BG_PATH);
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
    this.drawHeader();
    this.drawModePanel();
    this.drawLineupPanel();
    this.drawHeroPanel();
    this.drawActions();
    this.refresh();
    this.input.keyboard.once("keydown-ENTER", () => this.confirm());

    // 移动端：所有按钮已通过 setInteractive + pointerdown 支持触摸操作
    // 额外添加底部右侧触摸热区作为 Enter 键的移动端替代
    if (typeof window !== "undefined" && "ontouchstart" in window) {
      const mobileConfirmZone = this.add.rectangle(900, 704, 440, 90, 0x000000, 0)
        .setDepth(9)
        .setInteractive();
      mobileConfirmZone.on("pointerdown", () => this.confirm());
    }
  }

  drawBackdrop() {
    const bg = this.add.image(640, 380, MENU_BG_KEY).setDepth(-30);
    bg.setScale(Math.max(1280 / bg.width, 760 / bg.height));
    this.add.rectangle(640, 380, 1280, 760, 0x030711, 0.16).setDepth(-29);
    this.add.rectangle(640, 401, 1176, 514, 0x040912, 0.48).setDepth(-28).setStrokeStyle(1, 0xff4353, 0.26);
    this.add.rectangle(640, 139, 1120, 3, 0xff4353, 0.82).setDepth(-10);
    this.add.rectangle(640, 657, 1120, 2, 0x58e8ff, 0.3).setDepth(-10);
    this.scanLine = this.add.rectangle(80, 139, 180, 3, 0xff5364, 0.92).setOrigin(0, 0.5).setDepth(-9);
    this.tweens.add({ targets: this.scanLine, x: 1020, alpha: 0.2, duration: 2100, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.techOverlay = addTechOverlay(this, 80, 0.94);
    this.ambientScan = addAmbientTechMotion(this, 2);
  }

  drawHeader() {
    this.add.text(76, 42, MENU_TEXT.title, {
      fontFamily: FONT, fontSize: "48px", color: "#f8fdff", fontStyle: "900",
    }).setDepth(20).setShadow(0, 5, "#02070c", 10, true, true);
    this.add.text(78, 101, "对局部署 / MATCH CONFIGURATION", {
      fontFamily: "Arial, sans-serif", fontSize: "14px", color: "#ff6674", fontStyle: "800",
    }).setDepth(20);
    this.summaryText = this.add.text(1178, 78, "", {
      fontFamily: FONT, fontSize: "20px", color: "#f8fdff", fontStyle: "900",
    }).setOrigin(1, 0.5).setDepth(20);
    this.add.text(1178, 104, "本地同屏竞技 · 最多四名参战者", {
      fontFamily: FONT, fontSize: "12px", color: "#8fb6c1", fontStyle: "700",
    }).setOrigin(1, 0.5).setDepth(20);
  }

  makePanel(x, y, width, height, accent = 0xff5364) {
    const panel = this.add.rectangle(x, y, width, height, 0x070d16, 0.9)
      .setDepth(4).setStrokeStyle(2, accent, 0.32);
    this.add.rectangle(x - width / 2 + 3, y, 5, height - 18, accent, 0.7).setDepth(5);
    this.add.rectangle(x, y - height / 2 + 2, width - 18, 3, accent, 0.58).setDepth(5);
    return panel;
  }

  sectionTitle(x, y, index, title, subtitle, accent = 0xff5364) {
    const indexText = this.add.text(x, y, `0${index}`, { fontFamily: "Arial", fontSize: "13px", color: Phaser.Display.Color.IntegerToColor(accent).rgba, fontStyle: "900" }).setDepth(8);
    const titleText = this.add.text(x + 36, y - 7, title, { fontFamily: FONT, fontSize: "21px", color: "#f8fdff", fontStyle: "900" }).setDepth(8);
    const subtitleText = this.add.text(x + 36, y + 21, subtitle, { fontFamily: FONT, fontSize: "11px", color: "#83a2ad", fontStyle: "700", wordWrap: { width: 220 } }).setDepth(8);
    return { indexText, titleText, subtitleText };
  }

  drawModePanel() {
    this.modePanel = this.makePanel(240, 397, 300, 486, 0xff5364);
    this.modePanelSkin = addPanelFrame(this, 240, 397, 322, 504, 6, 0.7);
    this.sectionTitle(112, 174, 1, "选择对局规模", "人数与AI数量会自动保持在四人以内");

    [1, 2].forEach((count, index) => {
      const x = 166 + index * 142;
      const button = this.add.rectangle(x, 256, 122, 64, 0x101923, 0.96)
        .setDepth(7).setStrokeStyle(2, 0x58e8ff, 0.24).setInteractive({ useHandCursor: true });
      const label = this.add.text(x, 248, count === 1 ? "单人" : "双人", { fontFamily: FONT, fontSize: "19px", color: "#f8fdff", fontStyle: "900" }).setOrigin(0.5).setDepth(8);
      const sub = this.add.text(x, 273, `${count}P`, { fontFamily: "Arial", fontSize: "11px", color: "#7f9aa5", fontStyle: "800" }).setOrigin(0.5).setDepth(8);
      button.on("pointerdown", () => {
        this.matchConfig = normalizeMatchConfig({ ...this.matchConfig, playerCount: count, aiCount: count === 1 ? 3 : 2 });
        this.editingPlayerSlot = count === 2 ? 1 : 0;
        this.refresh();
      });
      this.playerButtons.push({ count, button, label, sub });
    });

    this.add.text(112, 318, "AI 敌人", { fontFamily: FONT, fontSize: "15px", color: "#ff6674", fontStyle: "900" }).setDepth(8);
    this.add.text(112, 342, "单人至少1名 · 双人允许0名", { fontFamily: FONT, fontSize: "11px", color: "#83a2ad", fontStyle: "700" }).setDepth(8);
    [0, 1, 2, 3].forEach((count, index) => {
      const x = 137 + index * 69;
      const button = this.add.rectangle(x, 388, 54, 50, 0x101923, 0.96)
        .setDepth(7).setStrokeStyle(2, 0xff6674, 0.2).setInteractive({ useHandCursor: true });
      const label = this.add.text(x, 388, String(count), { fontFamily: "Arial", fontSize: "20px", color: "#f8fdff", fontStyle: "900" }).setOrigin(0.5).setDepth(8);
      button.on("pointerdown", () => {
        const min = this.matchConfig.playerCount === 1 ? 1 : 0;
        if (count < min || count > 4 - this.matchConfig.playerCount) return;
        this.matchConfig = normalizeMatchConfig({ ...this.matchConfig, aiCount: count });
        this.refresh();
      });
      this.aiButtons.push({ count, button, label });
    });

    this.controlHint = this.add.text(112, 446, "", {
      fontFamily: FONT, fontSize: "12px", color: "#bcd3db", fontStyle: "700", lineSpacing: 8, wordWrap: { width: 244 },
    }).setDepth(8);
    this.add.rectangle(240, 574, 244, 1, 0xff5364, 0.24).setDepth(8);
    this.add.text(112, 590, "胜利条件", { fontFamily: FONT, fontSize: "12px", color: "#ff6674", fontStyle: "900" }).setDepth(8);
    this.add.text(112, 613, "全员竞争，最后存活者获胜", { fontFamily: FONT, fontSize: "12px", color: "#d8eef4", fontStyle: "700" }).setDepth(8);
  }

  createLineupCard(y, slotLabel, accent) {
    const bg = this.add.rectangle(620, y, 338, 112, 0x0c141e, 0.94).setDepth(7).setStrokeStyle(1, accent, 0.28).setInteractive({ useHandCursor: true });
    const bar = this.add.rectangle(455, y, 6, 112, accent, 0.82).setDepth(8);
    const portraitFrame = this.add.rectangle(510, y, 82, 88, 0x050a12, 0.9).setDepth(8).setStrokeStyle(1, accent, 0.42);
    const portrait = this.add.image(510, y, HEROES[0].texture).setScale(1.48).setDepth(9);
    const slot = this.add.text(566, y - 36, slotLabel, { fontFamily: "Arial", fontSize: "11px", color: Phaser.Display.Color.IntegerToColor(accent).rgba, fontStyle: "900" }).setDepth(9);
    const name = this.add.text(566, y - 15, "", { fontFamily: FONT, fontSize: "18px", color: "#f8fdff", fontStyle: "900", wordWrap: { width: 205 } }).setDepth(9);
    const desc = this.add.text(566, y + 17, "", { fontFamily: FONT, fontSize: "11px", color: "#91abb5", fontStyle: "700", wordWrap: { width: 205 }, maxLines: 2 }).setDepth(9);
    return { bg, bar, portraitFrame, portrait, slot, name, desc };
  }

  drawLineupPanel() {
    this.lineupPanel = this.makePanel(620, 397, 392, 486, 0x58e8ff);
    this.lineupPanelSkin = addPanelFrame(this, 620, 397, 414, 504, 6, 0.68);
    this.sectionTitle(452, 174, 2, "参战阵容", "玩家出生在对角，AI填补其余位置", 0x58e8ff);
    this.p1Card = this.createLineupCard(287, "PLAYER 01", 0xff5364);
    this.p2Card = this.createLineupCard(421, "PLAYER 02", 0x58e8ff);
    this.p1Card.bg.on("pointerdown", () => this.setEditingPlayerSlot(0));
    this.p2Card.bg.on("pointerdown", () => this.setEditingPlayerSlot(1));
    this.aiSummaryBox = this.add.rectangle(620, 557, 338, 88, 0x0a111a, 0.94).setDepth(7).setStrokeStyle(1, 0xffad45, 0.26);
    this.aiSummaryTitle = this.add.text(474, 530, "AI 敌方编队", { fontFamily: FONT, fontSize: "14px", color: "#ffbd63", fontStyle: "900" }).setDepth(8);
    this.aiSummaryText = this.add.text(474, 557, "", { fontFamily: FONT, fontSize: "12px", color: "#d9e8ee", fontStyle: "700", wordWrap: { width: 285 } }).setDepth(8);
    this.add.text(474, 609, "玩家技能与炸弹可互相造成影响", { fontFamily: FONT, fontSize: "11px", color: "#7f9aa5", fontStyle: "700" }).setDepth(8);
  }

  drawHeroPanel() {
    this.heroPanel = this.makePanel(1010, 397, 356, 486, 0x9a7cff);
    this.heroPanelSkin = addPanelFrame(this, 1010, 397, 378, 504, 6, 0.7);
    const heroHeading = this.sectionTitle(852, 174, 3, "选择玩家1英雄", "点击中间玩家卡可切换编辑对象", 0x9a7cff);
    this.heroPanelTitle = heroHeading.titleText;
    this.heroPanelSubtitle = heroHeading.subtitleText;
    HEROES.forEach((hero, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 930 + col * 160;
      const y = 316 + row * 190;
      const glow = this.add.rectangle(x, y, 142, 166, hero.accent, 0).setDepth(6);
      const frame = this.add.rectangle(x, y, 142, 166, 0x0b121b, 0.96)
        .setDepth(7).setStrokeStyle(2, hero.accent, 0.3).setInteractive({ useHandCursor: true });
      const portraitFrame = this.add.rectangle(x, y - 28, 116, 92, 0x050a12, 0.86).setDepth(8).setStrokeStyle(1, hero.accent, 0.22);
      const portrait = this.add.image(x, y - 28, hero.texture).setScale(1.48).setDepth(9);
      const label = this.add.text(x - 58, y + 31, getHeroDisplay(hero).name, {
        fontFamily: FONT, fontSize: "13px", color: "#f8fdff", fontStyle: "900", wordWrap: { width: 116 }, align: "center",
      }).setOrigin(0, 0).setDepth(9);
      const role = this.add.text(x, y + 67, "", { fontFamily: FONT, fontSize: "11px", color: "#8fb6c1", fontStyle: "800" }).setOrigin(0.5).setDepth(9);
      frame.on("pointerdown", () => this.selectHeroForActiveSlot(hero.id));
      this.tweens.add({ targets: glow, scaleX: 1.035, scaleY: 1.04, alpha: 0.05, duration: 900 + index * 80, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      this.heroButtons.push({ hero, glow, frame, portraitFrame, portrait, label, role });
    });
  }

  drawActions() {
    this.backButton = this.add.rectangle(164, 704, 176, 54, 0x080e16, 0.96).setDepth(12).setStrokeStyle(2, 0xff5364, 0.48).setInteractive({ useHandCursor: true });
    this.add.text(164, 704, "返回首页", { fontFamily: FONT, fontSize: "16px", color: "#f8fdff", fontStyle: "900" }).setOrigin(0.5).setDepth(13);
    this.backButton.on("pointerdown", () => beginSceneTransition(this, "StartScene"));

    this.confirmGlow = this.add.ellipse(1064, 704, 300, 72, 0xff4353, 0.18).setDepth(11);
    this.confirmButtonSkin = addPrimaryButtonSkin(this, 1064, 704, 306, 72, 12);
    this.confirmButton = this.add.rectangle(1064, 704, 272, 58, 0xff4353, 0.03).setDepth(12).setStrokeStyle(3, 0xffffff, 0.18).setInteractive({ useHandCursor: true });
    this.confirmText = this.add.text(1064, 704, "确认阵容 · 选择地图", { fontFamily: FONT, fontSize: "20px", color: "#081016", fontStyle: "900" }).setOrigin(0.5).setDepth(13);
    this.confirmButton.on("pointerdown", () => this.confirm());
    wireTechButton(this, this.confirmButton, [this.confirmButtonSkin, this.confirmText]);
    this.tweens.add({ targets: [this.confirmGlow, this.confirmButton], scaleX: 1.025, scaleY: 1.05, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  refreshLineupCard(card, hero, enabled = true) {
    const copy = getHeroDisplay(hero);
    card.portrait.setTexture(hero.texture).setAlpha(enabled ? 1 : 0.2);
    card.name.setText(enabled ? copy.name : "等待第二位玩家").setColor(enabled ? "#f8fdff" : "#607680");
    card.desc.setText(enabled ? copy.description : "切换双人模式后选择英雄");
    card.bg.setAlpha(enabled ? 1 : 0.56);
  }

  refresh() {
    const { playerCount, aiCount, playerHeroes } = this.matchConfig;
    const p1Hero = HEROES.find((hero) => hero.id === playerHeroes[0]) || HEROES[0];
    const p2Hero = HEROES.find((hero) => hero.id === playerHeroes[1]) || HEROES.find((hero) => hero.id !== p1Hero.id);
    this.summaryText.setText(`${playerCount}P  +  ${aiCount} AI  /  ${playerCount + aiCount} 人`);
    this.controlHint.setText(playerCount === 2
      ? "P1  WASD / 左Ctrl炸弹 / Q大招\nP2  方向键 / 右Ctrl炸弹 / P大招"
      : "移动  WASD / 方向键\n炸弹  Space · 大招  Shift");

    this.playerButtons.forEach((entry) => {
      const selected = entry.count === playerCount;
      entry.button.setFillStyle(selected ? 0x17313b : 0x101923, 0.98).setStrokeStyle(selected ? 3 : 2, selected ? 0x58e8ff : 0x31505c, selected ? 0.92 : 0.22);
      entry.label.setColor(selected ? "#ffffff" : "#8fb6c1");
      entry.sub.setColor(selected ? "#58e8ff" : "#607680");
    });
    this.aiButtons.forEach((entry) => {
      const enabled = entry.count >= (playerCount === 1 ? 1 : 0) && entry.count <= 4 - playerCount;
      const selected = entry.count === aiCount;
      entry.button.setAlpha(enabled ? 1 : 0.25).setFillStyle(selected ? 0x3b1c24 : 0x101923, 0.98).setStrokeStyle(selected ? 3 : 2, selected ? 0xff6674 : 0x56343c, selected ? 0.92 : 0.2);
      entry.label.setColor(selected ? "#ffffff" : "#8fb6c1");
    });

    this.refreshLineupCard(this.p1Card, p1Hero, true);
    this.refreshLineupCard(this.p2Card, p2Hero, playerCount === 2);
    this.p1Card.bg.setStrokeStyle(this.editingPlayerSlot === 0 ? 3 : 1, 0xff5364, this.editingPlayerSlot === 0 ? 0.94 : 0.28);
    this.p2Card.bg.setStrokeStyle(this.editingPlayerSlot === 1 && playerCount === 2 ? 3 : 1, 0x58e8ff, this.editingPlayerSlot === 1 && playerCount === 2 ? 0.94 : 0.28);
    this.aiSummaryText.setText(aiCount === 0 ? "无AI · 两名玩家直接对决" : `${aiCount} 名AI加入战场 · 目标选择保持公平`);
    this.heroPanelTitle.setText(this.editingPlayerSlot === 0 ? "选择玩家1英雄" : "选择玩家2英雄");
    this.heroPanelSubtitle.setText(playerCount === 2 ? "点击中间玩家卡可切换，双方英雄不能相同" : "单人模式：选择本局出战英雄");

    this.heroButtons.forEach((entry) => {
      const isP1 = entry.hero.id === playerHeroes[0];
      const isP2 = playerCount === 2 && entry.hero.id === playerHeroes[1];
      const disabled = this.editingPlayerSlot === 1 && isP1;
      const selectedForActiveSlot = this.editingPlayerSlot === 0 ? isP1 : isP2;
      entry.frame.setAlpha(disabled ? 0.38 : 1).setFillStyle(selectedForActiveSlot ? 0x17212d : 0x0b121b, 0.98).setStrokeStyle(selectedForActiveSlot ? 3 : 2, entry.hero.accent, selectedForActiveSlot ? 0.94 : 0.28);
      entry.portrait.setAlpha(disabled ? 0.3 : 1);
      entry.glow.setAlpha(selectedForActiveSlot ? 0.18 : 0.02);
      entry.role.setText(isP1 ? "P1 已选择" : isP2 ? "P2 已选择" : disabled ? "不可重复" : "点击选择");
      entry.role.setColor(isP1 ? "#ff6674" : isP2 ? "#58e8ff" : "#8fb6c1");
    });
  }

  setEditingPlayerSlot(slot) {
    if (slot === 1 && this.matchConfig.playerCount !== 2) return false;
    this.editingPlayerSlot = slot === 1 ? 1 : 0;
    this.refresh();
    return true;
  }

  selectHeroForActiveSlot(heroId) {
    if (!HEROES.some((hero) => hero.id === heroId)) return false;
    const heroes = [...this.matchConfig.playerHeroes];
    if (this.editingPlayerSlot === 1) {
      if (this.matchConfig.playerCount !== 2 || heroId === heroes[0]) return false;
      heroes[1] = heroId;
    } else {
      heroes[0] = heroId;
    }
    this.matchConfig = normalizeMatchConfig({ ...this.matchConfig, playerHeroes: heroes });
    this.refresh();
    return true;
  }

  confirm() {
    return beginSceneTransition(this, "MapSelectScene", { matchConfig: normalizeMatchConfig(this.matchConfig) });
  }
}
