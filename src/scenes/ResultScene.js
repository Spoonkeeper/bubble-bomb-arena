import { HEROES, MENU_THEME } from "../config.js";
import {
  createGameTextures,
  createMenuMascotTexture,
  preloadCustomHeroAssets,
} from "../assets/AssetFactory.js";
import { getHeroDisplay, MENU_TEXT, STAT_LABELS } from "../uiText.js";
import { addAmbientTechMotion, addPanelFrame, addPrimaryButtonSkin, addTechOverlay, preloadTechUi, wireTechButton } from "../ui/TechVisualKit.js";
import { beginSceneTransition, resetSceneTransition } from "./SceneFlow.js";

const MENU_BG_KEY = "menu-spoon-wallpaper-v2";
const MENU_BG_PATH = "assets/menu-spoon-wallpaper-v2.png";
const RESULT_ART = Object.fromEntries(HEROES.flatMap((hero) => [
  [`result-${hero.id}-win-v1`, `assets/result-${hero.id}-win-v1.png`],
  [`result-${hero.id}-lose-v1`, `assets/result-${hero.id}-lose-v1.png`],
]));
const resultArtKey = (hero, state) => `result-${hero.id}-${state}-v1`;

const HERO_POSTER_LAYOUTS = {
  shadow: { x: 356, y: 438, scale: 1.48 },
  ember: { x: 360, y: 446, scale: 1.5 },
  volt: { x: 350, y: 438, scale: 1.32 },
  wind: { x: 356, y: 440, scale: 1.3 },
};

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  init(data) {
    this.result = data.result || "lose";
    this.winner = data.winner || null;
    this.matchConfig = data.matchConfig || null;
    this.heroId = data.heroId || "shadow";
    this.stats = data.stats || {};
  }

  preload() {
    preloadTechUi(this);
    if (!this.textures.exists(MENU_BG_KEY)) this.load.image(MENU_BG_KEY, MENU_BG_PATH);
    Object.entries(RESULT_ART).forEach(([key, path]) => {
      if (!this.textures.exists(key)) this.load.image(key, path);
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

    this.isDraw = this.result === "draw";
    this.isWin = this.result === "win";
    this.isDualResult = this.matchConfig?.playerCount === 2 && this.matchConfig?.playerHeroes?.length === 2;
    this.hero = HEROES.find((entry) => entry.id === this.heroId) || HEROES[0];
    this.isAiWinner = this.winner?.kind === "ai";
    this.copy = getHeroDisplay(this.hero);
    this.heroAccent = this.isAiWinner ? 0xff6674 : this.hero.accent;
    this.stateAccent = this.isDraw ? 0x9bc3cf : this.isWin ? 0xffd45a : 0xff3446;

    this.cameras.main.setBackgroundColor("#050912");
    this.drawBackdrop();
    if (this.isDualResult) {
      this.drawDuelResult();
    } else {
      this.drawHeroPoster();
      this.drawResultPanel();
    }
    this.drawRestartButton();

    this.input.keyboard.once("keydown-ENTER", () => this.restart());
  }

  restart() {
    return beginSceneTransition(this, "StartScene", { heroId: this.heroId });
  }

  drawBackdrop() {
    const bg = this.add.image(640, 380, MENU_BG_KEY).setDepth(-50);
    bg.setScale(Math.max(1280 / bg.width, 760 / bg.height));
    bg.setAlpha(this.isWin ? 1 : 0.88);
    this.add.rectangle(640, 380, 1280, 760, 0x030711, this.isWin ? 0.1 : 0.24).setDepth(-49);
    this.add.rectangle(390, 418, 570, 560, 0x030711, 0.24).setDepth(-48);
    this.add.rectangle(920, 412, 470, 560, 0x030711, 0.36).setDepth(-48);
    this.add.rectangle(640, 142, 1110, 3, this.stateAccent, 0.72).setDepth(-20);
    this.add.rectangle(640, 690, 1110, 3, this.stateAccent, 0.5).setDepth(-20);
    this.techOverlay = addTechOverlay(this, 80, 0.94);
    this.ambientScan = addAmbientTechMotion(this, 2);
  }

  drawHeroPoster() {
    const layout = HERO_POSTER_LAYOUTS[this.hero.id] || HERO_POSTER_LAYOUTS.shadow;
    const state = this.isWin && !this.isAiWinner ? "win" : "lose";
    this.posterFrame = this.add.rectangle(370, 446, 520, 496, 0x050a12, 0.34)
      .setDepth(5)
      .setStrokeStyle(2, this.heroAccent, 0.34);
    this.posterFrameSkin = addPanelFrame(this, 370, 446, 548, 522, 6, 0.7);
    this.add.rectangle(370, 212, 438, 4, this.heroAccent, 0.62).setDepth(6);
    this.add.ellipse(374, 628, 340, 72, this.stateAccent, this.isWin ? 0.16 : 0.08)
      .setDepth(7)
      .setStrokeStyle(3, this.stateAccent, this.isWin ? 0.58 : 0.3);
    this.add.rectangle(370, 442, 340, 410, this.heroAccent, 0.09).setDepth(7);
    this.posterSprite = this.add.image(layout.x, layout.y, resultArtKey(this.hero, state))
      .setDisplaySize(360, 480)
      .setDepth(12);
    this.drawStateEffects(layout.x, layout.y, state, this.heroAccent, 360);
    this.tweens.add({
      targets: this.posterSprite,
      y: layout.y - (state === "win" ? 10 : 4),
      angle: state === "win" ? 0.8 : -0.5,
      duration: state === "win" ? 900 : 1450,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawDuelResult() {
    const heroes = this.matchConfig.playerHeroes.map((heroId) => HEROES.find((hero) => hero.id === heroId) || HEROES[0]);
    const winnerSlot = this.winner?.ownerId?.startsWith?.("player-") ? Number(this.winner.ownerId.split("-")[1]) : 0;
    const title = this.isDraw ? "本局平局" : this.isAiWinner ? "AI 获胜" : `玩家 ${winnerSlot} 胜利`;
    this.duelTitle = this.add.text(640, 64, title, {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "54px", color: "#f8fdff", fontStyle: "900",
    }).setOrigin(0.5).setDepth(22).setShadow(0, 7, "#02070c", 14, true, true);
    this.duelTitle.setAlpha(0).setScale(1.08);
    this.tweens.add({ targets: this.duelTitle, alpha: 1, scaleX: 1, scaleY: 1, duration: 520, ease: "Back.easeOut" });
    this.add.text(640, 120, this.isAiWinner ? "两名玩家均已败北 / REDEPLOY" : "FINAL COMBAT REPORT / 最终对决", {
      fontFamily: "Arial, sans-serif", fontSize: "13px", color: this.isAiWinner ? "#ff6674" : "#9bc3cf", fontStyle: "900",
    }).setOrigin(0.5).setDepth(22);
    this.add.rectangle(640, 146, 720, 3, this.isAiWinner ? 0xff4353 : 0x58e8ff, 0.72).setDepth(20);

    const centers = [350, 930];
    this.duelCards = heroes.map((hero, index) => {
      const slot = index + 1;
      const state = winnerSlot === slot && !this.isDraw && !this.isAiWinner ? "win" : "lose";
      const accent = state === "win" ? 0xffd45a : 0xff4353;
      const copy = getHeroDisplay(hero);
      const frame = this.add.rectangle(centers[index], 398, 484, 492, 0x050a12, 0.58)
        .setDepth(5).setStrokeStyle(2, accent, state === "win" ? 0.72 : 0.38);
      const frameSkin = addPanelFrame(this, centers[index], 398, 508, 518, 6, state === "win" ? 0.84 : 0.58);
      const stateLabel = this.add.text(centers[index], 174, state === "win" ? "VICTOR / 胜利" : this.isDraw ? "DRAW / 平局" : "DEFEATED / 败北", {
        fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "17px", color: Phaser.Display.Color.IntegerToColor(accent).rgba, fontStyle: "900",
      }).setOrigin(0.5).setDepth(18);
      const portrait = this.add.image(centers[index], 398, resultArtKey(hero, state)).setDisplaySize(330, 440).setDepth(12);
      const name = this.add.text(centers[index], 612, `P${slot}  ${copy.name}`, {
        fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "22px", color: "#f8fdff", fontStyle: "900",
      }).setOrigin(0.5).setDepth(18);
      this.drawStateEffects(centers[index], 398, state, hero.accent, 330);
      this.tweens.add({
        targets: portrait,
        y: portrait.y + (state === "win" ? -8 : 4),
        alpha: state === "win" ? 1 : 0.86,
        duration: state === "win" ? 840 : 1380,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      return { hero, state, frame, frameSkin, stateLabel, portrait, name };
    });

    this.vsMark = this.add.text(640, 394, this.isAiWinner ? "×" : "VS", {
      fontFamily: "Arial Black, sans-serif", fontSize: "38px", color: this.isAiWinner ? "#ff4353" : "#ffffff", fontStyle: "900",
    }).setOrigin(0.5).setDepth(25).setShadow(0, 0, this.isAiWinner ? "#ff4353" : "#58e8ff", 16, true, true);
    this.tweens.add({ targets: this.vsMark, scaleX: 1.12, scaleY: 1.12, alpha: 0.72, duration: 620, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  drawStateEffects(x, y, state, accent, spread) {
    const color = state === "win" ? accent : 0xff4353;
    for (let index = 0; index < (state === "win" ? 9 : 5); index += 1) {
      const offset = -spread / 2 + (spread / Math.max(1, (state === "win" ? 8 : 4))) * index;
      const spark = this.add.rectangle(x + offset, y + (state === "win" ? 170 : -150 + index * 64), state === "win" ? 4 : 54, state === "win" ? 18 : 2, color, state === "win" ? 0.66 : 0.42).setDepth(10);
      this.tweens.add({
        targets: spark,
        y: spark.y + (state === "win" ? -70 : 0),
        x: spark.x + (state === "win" ? (index % 2 ? 12 : -12) : 42),
        alpha: 0,
        duration: state === "win" ? 720 + index * 55 : 360 + index * 70,
        delay: index * 80,
        repeat: -1,
        repeatDelay: state === "win" ? 420 : 780,
        ease: "Quad.easeOut",
      });
    }
  }

  drawResultPanel() {
    const accentColor = Phaser.Display.Color.IntegerToColor(this.stateAccent).rgba;
    const heroAccentColor = Phaser.Display.Color.IntegerToColor(this.heroAccent).rgba;
    this.resultPanel = this.add.rectangle(858, 406, 420, 510, 0x070d15, 0.78)
      .setDepth(6)
      .setStrokeStyle(2, this.stateAccent, 0.26);
    this.resultPanelSkin = addPanelFrame(this, 858, 406, 448, 536, 7, 0.7);
    const winnerSlot = this.winner?.ownerId?.startsWith?.("player-") ? this.winner.ownerId.split("-")[1] : null;
    const resultTitle = this.isDraw
      ? "本局平局"
      : winnerSlot
        ? `玩家${winnerSlot}获胜`
        : this.isAiWinner
          ? "AI获胜"
          : this.isWin ? MENU_TEXT.resultWin : MENU_TEXT.resultLose;
    const panelTitle = this.isDraw ? "NO SURVIVORS" : this.isWin ? MENU_TEXT.resultPanelWin : MENU_TEXT.resultPanelLose;
    const lead = this.isDraw ? "最后的冲击没有留下赢家" : this.isAiWinner ? "对手控制了最终战场" : this.isWin ? MENU_TEXT.resultLeadWin : MENU_TEXT.resultLeadLose;
    const body = this.isDraw ? "所有参战者同时出局，本轮不判定胜者。" : this.isAiWinner ? "重新部署，下一局夺回最后生存权。" : this.isWin ? MENU_TEXT.resultBodyWin : MENU_TEXT.resultBodyLose;
    this.add.text(660, 186, panelTitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "15px",
      color: accentColor,
      fontStyle: "900",
    }).setDepth(12);
    this.add.rectangle(660, 214, 160, 4, this.stateAccent, 0.9).setOrigin(0, 0.5).setDepth(12);

    this.resultTitle = this.add.text(656, 236, resultTitle, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: winnerSlot || this.isAiWinner || this.isDraw ? "48px" : "64px",
      color: "#f8fdff",
      fontStyle: "900",
    }).setDepth(12).setShadow(0, 6, "#02070c", 12, true, true);

    this.add.text(662, 320, lead, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "22px",
      color: accentColor,
      fontStyle: "900",
      wordWrap: { width: 344 },
    }).setDepth(12);
    this.add.text(662, 368, body, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "16px",
      color: "#cfe2e8",
      fontStyle: "700",
      wordWrap: { width: 344 },
      lineSpacing: 8,
    }).setDepth(12);

    this.add.rectangle(840, 492, 344, 86, 0x101923, 0.86)
      .setDepth(8)
      .setStrokeStyle(1, this.heroAccent, 0.26);
    this.add.text(680, 464, MENU_TEXT.currentHero, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color: "#93aab4",
      fontStyle: "900",
    }).setDepth(12);
    this.add.text(680, 488, this.copy.name, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "28px",
      color: "#f8fdff",
      fontStyle: "900",
      wordWrap: { width: 310 },
    }).setDepth(12);
    this.add.text(680, 532, `${this.copy.description} / ${this.copy.shortName}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: heroAccentColor,
      fontStyle: "800",
      wordWrap: { width: 310 },
    }).setDepth(12);

    const stats = [
      [STAT_LABELS.speed, this.stats.speed ?? this.hero.baseStats?.speed ?? 1],
      [STAT_LABELS.maxBombs, this.stats.maxBombs ?? this.hero.baseStats?.maxBombs ?? 1],
      [STAT_LABELS.blastRange, this.stats.blastRange ?? this.hero.baseStats?.blastRange ?? 2],
      [STAT_LABELS.shield, this.stats.shield ?? this.hero.baseStats?.shield ?? 0],
    ];
    stats.forEach(([label, value], index) => {
      const x = 680 + (index % 2) * 164;
      const y = 578 + Math.floor(index / 2) * 64;
      this.add.rectangle(x + 62, y + 24, 124, 50, 0x101923, 0.84)
        .setDepth(8)
        .setStrokeStyle(1, this.stateAccent, 0.18);
      this.add.text(x + 10, y + 7, label, {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "12px",
        color: "#93aab4",
        fontStyle: "700",
      }).setDepth(12);
      this.add.text(x + 10, y + 22, String(value), {
        fontFamily: '"Microsoft YaHei", sans-serif',
        fontSize: "20px",
        color: accentColor,
        fontStyle: "900",
      }).setDepth(12);
    });

    this.add.text(78, 706, `${MENU_TEXT.title} / ${MENU_TEXT.slogan}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "18px",
      color: "#ff5364",
      fontStyle: "900",
    }).setDepth(20);

    this.tweens.add({
      targets: this.resultTitle,
      scaleX: this.isWin ? 1.022 : 1.01,
      scaleY: this.isWin ? 1.022 : 1.01,
      duration: this.isWin ? 920 : 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawRestartButton() {
    const buttonX = this.isDualResult ? 640 : 1040;
    const buttonY = this.isDualResult ? 700 : 666;
    this.restartGlow = this.add.ellipse(buttonX, buttonY, 278, 78, this.stateAccent, 0.2).setDepth(10);
    this.restartButtonSkin = addPrimaryButtonSkin(this, buttonX, buttonY, 294, 82, 11);
    this.restartButton = this.add.rectangle(buttonX, buttonY, 252, 68, this.stateAccent, 0.03)
      .setDepth(11)
      .setStrokeStyle(3, 0xffffff, 0.32)
      .setInteractive({ useHandCursor: true });
    this.restartButton.on("pointerdown", () => this.restart());
    this.restartText = this.add.text(buttonX, buttonY, MENU_TEXT.restart, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "27px",
      color: "#0a1015",
      fontStyle: "900",
    }).setOrigin(0.5).setDepth(12);
    wireTechButton(this, this.restartButton, [this.restartButtonSkin, this.restartText]);
    this.add.text(buttonX - 126, this.isDualResult ? 738 : 712, MENU_TEXT.restartHint, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "12px",
      color: "#93aab4",
      fontStyle: "700",
      wordWrap: { width: 260 },
    }).setDepth(12);
    this.tweens.add({
      targets: [this.restartGlow, this.restartButton],
      scaleX: 1.03,
      scaleY: 1.05,
      duration: 980,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  drawMascot() {
    this.mascot = this.add.image(1148, 158, MENU_THEME.mascotTextureKey).setScale(0.24).setDepth(23);
    this.tweens.add({
      targets: this.mascot,
      y: this.isWin ? 140 : 172,
      angle: this.isWin ? 8 : -6,
      duration: this.isWin ? 720 : 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
}
