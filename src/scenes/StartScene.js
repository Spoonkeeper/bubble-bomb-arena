import { MENU_TEXT } from "../uiText.js";
import { addAmbientTechMotion, addPrimaryButtonSkin, addTechOverlay, preloadTechUi, wireTechButton } from "../ui/TechVisualKit.js";
import { beginSceneTransition, resetSceneTransition } from "./SceneFlow.js";

const MENU_HERO_KEY = "menu-hero-ensemble-v1";
const MENU_HERO_PATH = "assets/menu-hero-ensemble-v1.png";
const FONT = '"Microsoft YaHei", sans-serif';

export class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
    this.selectorSlots = [];
    this.isDeploying = false;
  }

  preload() {
    preloadTechUi(this);
    if (!this.textures.exists(MENU_HERO_KEY)) {
      this.load.image(MENU_HERO_KEY, MENU_HERO_PATH);
    }
  }

  create() {
    resetSceneTransition(this);
    this.isDeploying = false;
    this.cameras.main.setBackgroundColor("#03070d");
    this.drawHeroKeyArt();
    this.drawTitle();
    this.drawHeroEnergy();
    this.drawStartButton();
    this.techOverlay = addTechOverlay(this, 80, 0.94);
    this.ambientScan = addAmbientTechMotion(this, 18);
    this.input.keyboard.once("keydown-ENTER", () => this.beginDeployment());

    // 移动端：点击画布任意位置即开始
    if (typeof window !== "undefined" && "ontouchstart" in window) {
      this.input.once("pointerdown", () => {
        if (!this.isDeploying) this.beginDeployment();
      });
    }
  }

  drawHeroKeyArt() {
    this.heroKeyArt = this.add.image(640, 380, MENU_HERO_KEY)
      .setDisplaySize(1280, 760)
      .setScale(1.04)
      .setDepth(-20);

    this.add.rectangle(235, 126, 470, 252, 0x02060c, 0.7).setDepth(-10);
    this.add.rectangle(1092, 666, 376, 188, 0x02060c, 0.62).setDepth(-10);
    this.add.rectangle(640, 758, 1280, 4, 0xff3348, 0.88).setDepth(30);
    this.tweens.add({
      targets: this.heroKeyArt,
      scaleX: 1,
      scaleY: 1,
      duration: 720,
      ease: "Cubic.easeOut",
    });
  }

  drawTitle() {
    this.title = this.add.text(58, 48, MENU_TEXT.title, {
      fontFamily: FONT,
      fontSize: "68px",
      color: "#f8fdff",
      fontStyle: "900",
    }).setDepth(20).setShadow(0, 8, "#000000", 14, true, true);

    this.slogan = this.add.text(64, 130, MENU_TEXT.slogan, {
      fontFamily: FONT,
      fontSize: "28px",
      color: "#ff4358",
      fontStyle: "900",
    }).setDepth(20);

    this.add.text(66, 177, "四英雄集结 / 本地竞技", {
      fontFamily: FONT,
      fontSize: "15px",
      color: "#a8bbc7",
      fontStyle: "700",
    }).setDepth(20);

    this.add.rectangle(64, 214, 310, 3, 0xff3348, 0.92).setOrigin(0, 0.5).setDepth(21);
    this.titleScan = this.add.rectangle(64, 214, 76, 3, 0xffffff, 0.96).setOrigin(0, 0.5).setDepth(22);

    this.title.x = 18;
    this.title.alpha = 0;
    this.slogan.x = 30;
    this.slogan.alpha = 0;
    this.tweens.add({ targets: this.title, x: 58, alpha: 1, duration: 620, ease: "Cubic.easeOut" });
    this.tweens.add({ targets: this.slogan, x: 64, alpha: 1, duration: 700, delay: 90, ease: "Cubic.easeOut" });
    this.tweens.add({
      targets: this.titleScan,
      x: 298,
      alpha: 0.12,
      duration: 1250,
      delay: 1800,
      repeat: -1,
      repeatDelay: 2600,
      ease: "Cubic.easeInOut",
    });
  }

  drawHeroEnergy() {
    const zones = [
      { x: 637, y: 208, color: 0x925cff, radius: 46 },
      { x: 386, y: 420, color: 0xff5b28, radius: 40 },
      { x: 914, y: 380, color: 0x71f186, radius: 42 },
      { x: 678, y: 610, color: 0x4db9ff, radius: 48 },
    ];

    this.energyNodes = zones.map((zone, zoneIndex) => {
      const halo = this.add.circle(zone.x, zone.y, zone.radius, zone.color, 0.05)
        .setDepth(5).setStrokeStyle(2, zone.color, 0.35);
      this.tweens.add({
        targets: halo,
        scaleX: 1.28,
        scaleY: 1.28,
        alpha: 0.015,
        duration: 1100 + zoneIndex * 130,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      for (let i = 0; i < 4; i += 1) {
        const spark = this.add.rectangle(
          zone.x - 36 + i * 22,
          zone.y + 20 - (i % 2) * 24,
          zoneIndex === 3 ? 22 : 5,
          zoneIndex === 3 ? 2 : 5,
          zone.color,
          0.72,
        ).setDepth(6);
        this.tweens.add({
          targets: spark,
          y: spark.y - 18 - i * 3,
          x: spark.x + (zoneIndex === 3 ? 14 : (i % 2 ? 8 : -8)),
          alpha: 0,
          duration: 620 + i * 120,
          delay: i * 150,
          repeat: -1,
          repeatDelay: 420,
          ease: "Quad.easeOut",
        });
      }
      return { ...zone, halo };
    });
  }

  drawStartButton() {
    this.startGlow = this.add.rectangle(1080, 664, 316, 84, 0xff3348, 0.16)
      .setDepth(10).setStrokeStyle(2, 0xff4358, 0.7);
    this.startButtonSkin = addPrimaryButtonSkin(this, 1080, 664, 326, 82, 11);
    this.startButton = this.add.rectangle(1080, 664, 286, 68, 0xff3348, 0.03)
      .setDepth(11).setStrokeStyle(2, 0xffffff, 0.36).setInteractive({ useHandCursor: true });
    this.startText = this.add.text(1080, 664, "开始部署", {
      fontFamily: FONT,
      fontSize: "27px",
      color: "#080d13",
      fontStyle: "900",
    }).setOrigin(0.5).setDepth(12);
    this.add.text(1080, 713, "ENTER / LOCAL BATTLE", {
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      color: "#92a9b5",
      fontStyle: "700",
    }).setOrigin(0.5).setDepth(12);

    this.startButton.on("pointerover", () => {
      this.startButton.setScale(1.035);
      this.startGlow.setScale(1.08);
    });
    this.startButton.on("pointerout", () => {
      this.startButton.setScale(1);
      this.startGlow.setScale(1);
    });
    this.startButton.on("pointerdown", () => this.beginDeployment());
    wireTechButton(this, this.startButton, [this.startButtonSkin, this.startText], { hoverScale: 1.04 });
    this.tweens.add({
      targets: this.startGlow,
      alpha: 0.34,
      scaleX: 1.06,
      scaleY: 1.13,
      duration: 820,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  beginDeployment() {
    if (this.isDeploying) return;
    this.isDeploying = true;
    this.startText.setText("能量汇聚中");
    this.energyNodes.forEach((node) => {
      this.tweens.add({
        targets: node.halo,
        x: 640,
        y: 380,
        scaleX: 0.18,
        scaleY: 0.18,
        alpha: 0.82,
        duration: 280,
        ease: "Cubic.easeIn",
      });
    });
    beginSceneTransition(this, "MatchSetupScene", undefined, { delayMs: 300 });
  }

  startGame() {
    return beginSceneTransition(this, "MatchSetupScene");
  }
}
