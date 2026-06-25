import { GAME_CONFIG } from "../config.js";
import { GAME_TEXT, getHeroDisplay, MENU_TEXT, STAT_LABELS } from "../uiText.js";
import { restartSceneOnce } from "../scenes/SceneFlow.js";

export class UISystem {
  constructor(scene, playerSystem, aiSystem, heroAbilitySystem, matchConfig = null) {
    this.scene = scene;
    this.players = Array.isArray(playerSystem) ? playerSystem : [playerSystem];
    this.player = this.players[0];
    this.ai = aiSystem;
    this.abilitySystems = Array.isArray(heroAbilitySystem) ? heroAbilitySystem : [heroAbilitySystem];
    this.abilities = this.abilitySystems[0];
    this.matchConfig = matchConfig;
    this.labels = {};
  }

  create() {
    if (this.players.length === 2) {
      this.createDualHud();
      return;
    }
    const heroDisplay = getHeroDisplay(this.player.hero);

    this.scene.add.rectangle(648, 42, 638, 70, 0x070b10, 0.92)
      .setStrokeStyle(1, 0xff4452, 0.28)
      .setDepth(20);
    this.scene.add.rectangle(648, 92, 638, 44, 0x11151b, 0.92)
      .setStrokeStyle(1, 0x58e8ff, 0.18)
      .setDepth(20);
    this.scene.add.rectangle(648, 42, 638, 70, 0xff4452, 0.045).setDepth(19);
    this.scene.add.rectangle(348, 42, 4, 52, 0xff4452, 0.82).setDepth(21);
    this.scene.add.rectangle(948, 42, 4, 52, 0x58e8ff, 0.56).setDepth(21);

    this.createStat("hp", 388, "HP");
    this.createStat("speed", 486, STAT_LABELS.speed);
    this.createStat("bombs", 584, STAT_LABELS.maxBombs);
    this.createStat("range", 682, STAT_LABELS.blastRange);
    this.createStat("shield", 780, STAT_LABELS.shield);
    this.createStat("enemies", 878, STAT_LABELS.enemies);

    const restart = this.scene.add
      .text(960, 42, MENU_TEXT.restart, {
        fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "15px",
      color: "#09171c",
      fontStyle: "800",
      backgroundColor: "#ff6674",
      padding: { x: 12, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(22)
      .setInteractive({ useHandCursor: true });
    restart.on("pointerdown", () => restartSceneOnce(this.scene, { matchConfig: this.matchConfig, mapId: this.scene.mapId }));

    this.ultimateLabel = this.scene.add.text(398, 80, `Shift / ${heroDisplay?.ultimateName || this.player.hero.ultimate.name}`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: "#d8f8ff",
      fontStyle: "800",
    }).setDepth(22);

    this.energyBarBg = this.scene.add.rectangle(642, 91, 250, 14, 0x1a1418, 0.98)
      .setDepth(21)
      .setStrokeStyle(1, 0xff4452, 0.22);
    this.energyBarFill = this.scene.add.rectangle(517, 91, 0, 12, this.player.hero.accent, 0.95)
      .setDepth(22)
      .setOrigin(0, 0.5);

    this.energyText = this.scene.add.text(776, 80, `${GAME_TEXT.charging} 0%`, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: "#9bc3cf",
      fontStyle: "700",
    }).setDepth(22);

    this.ultimateState = this.scene.add.text(892, 80, GAME_TEXT.ready, {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "14px",
      color: "#9bc3cf",
      fontStyle: "800",
    }).setDepth(22);

    this.message = this.scene.add.text(648, 708, "", {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "15px",
      color: "#f7fdff",
      fontStyle: "800",
      backgroundColor: "rgba(9, 23, 28, 0.76)",
      padding: { x: 14, y: 7 },
    }).setOrigin(0.5).setDepth(30).setAlpha(0);

    this.scene.events.on("player-stats-changed", () => this.update());
    this.scene.events.on("actor-health-changed", () => this.update());
    this.scene.events.on("enemy-count-changed", () => this.update());
    this.scene.events.on("item-picked", (label) => this.toast(`获得 ${label}`));
    this.scene.events.on("enemy-item-picked", (label) => this.toast(`敌人拿到 ${label}`));
    this.scene.events.on("player-shield-used", () => this.toast(GAME_TEXT.shieldSaved));
    this.scene.events.on("ultimate-activated", (label) => this.toast(`${label} 已启动`));
    this.scene.events.on("ultimate-life-saved", () => this.toast(GAME_TEXT.extraLifeSaved));
    this.scene.events.on("bomb-placed", () => this.update());
    this.update();
  }

  createDualHud() {
    this.dualHud = this.players.map((player, index) => {
      const abilities = this.abilitySystems[index];
      const left = index === 0 ? 348 : 656;
      const accent = player.hero.accent;
      this.scene.add.rectangle(left + 146, 53, 292, 82, 0x070b10, 0.94)
        .setStrokeStyle(2, accent, 0.48).setDepth(20);
      this.scene.add.rectangle(left + (index === 0 ? 2 : 290), 53, 4, 66, accent, 0.88).setDepth(21);
      const title = this.scene.add.text(left + 16, 19, `P${index + 1}  ${getHeroDisplay(player.hero).name}`, {
        fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "14px", color: "#f8fdff", fontStyle: "900",
      }).setDepth(22);
      const hp = this.scene.add.text(left + 16, 43, "HP 100/100", this.smallStyle("#d8f8ff")).setDepth(22);
      const bombs = this.scene.add.text(left + 150, 43, "炸弹 0/1", this.smallStyle("#d8f8ff")).setDepth(22);
      const barBg = this.scene.add.rectangle(left + 16, 72, 178, 10, 0x1a1418, 0.98)
        .setOrigin(0, 0.5).setStrokeStyle(1, accent, 0.25).setDepth(21);
      const bar = this.scene.add.rectangle(left + 16, 72, 0, 8, accent, 0.96).setOrigin(0, 0.5).setDepth(22);
      const state = this.scene.add.text(left + 204, 62, "0%", this.smallStyle("#8fb6c1")).setDepth(22);
      const status = this.scene.add.text(left + 204, 20, "作战中", {
        fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "11px", color: "#7df4d4", fontStyle: "900",
        backgroundColor: "rgba(12, 30, 34, 0.84)", padding: { x: 8, y: 3 },
      }).setDepth(23);
      return { player, abilities, title, hp, bombs, barBg, bar, state, status };
    });

    this.aliveLabel = this.scene.add.text(640, 104, "", {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "13px", color: "#d8f8ff", fontStyle: "900",
      backgroundColor: "rgba(7,11,16,0.92)", padding: { x: 14, y: 5 },
    }).setOrigin(0.5).setDepth(22);
    this.message = this.scene.add.text(648, 708, "", {
      fontFamily: '"Microsoft YaHei", sans-serif', fontSize: "15px", color: "#f7fdff", fontStyle: "800",
      backgroundColor: "rgba(9, 23, 28, 0.76)", padding: { x: 14, y: 7 },
    }).setOrigin(0.5).setDepth(30).setAlpha(0);
    ["player-stats-changed", "actor-health-changed", "enemy-count-changed", "combatant-defeated"].forEach((event) => {
      this.scene.events.on(event, () => this.update());
    });
    this.scene.events.on("item-picked", (label) => this.toast(`获得 ${label}`));
    this.scene.events.on("ultimate-activated", (label) => this.toast(`${label} 已启动`));
    this.update();
  }

  createStat(key, x, label) {
    this.scene.add.text(x, 18, label, this.smallStyle("#8fb6c1"))
      .setOrigin(0.5, 0)
      .setDepth(21);
    this.labels[key] = this.scene.add.text(x, 39, "0", this.valueStyle())
      .setOrigin(0.5, 0)
      .setDepth(21);
  }

  update() {
    if (this.players.length === 2) {
      this.dualHud?.forEach((hud) => {
        const state = hud.abilities.getDisplayState(this.scene.time.now);
        if (!hud.player.alive) {
          hud.hp.setText(`HP 0/${hud.player.maxHp}`).setColor("#ff6674");
          hud.bombs.setAlpha(0.28);
          hud.bar.width = 0;
          hud.barBg.setAlpha(0.28);
          hud.state.setText("LOCKED").setColor("#ff6674");
          hud.status.setText("bye man").setColor("#ffffff").setBackgroundColor("#9d2332");
          hud.title.setAlpha(0.42);
          return;
        }
        hud.hp.setText(`HP ${Math.ceil(hud.player.hp)}/${hud.player.maxHp}`);
        hud.hp.setColor("#d8f8ff");
        hud.bombs.setAlpha(1);
        hud.barBg.setAlpha(1);
        hud.title.setAlpha(1);
        hud.status.setText("作战中").setColor("#7df4d4").setBackgroundColor("rgba(12, 30, 34, 0.84)");
        hud.bombs.setText(`炸弹 ${hud.player.bombs.activeCount(hud.player.ownerId)}/${hud.player.stats.maxBombs}`);
        hud.bar.width = Math.round(178 * state.energy / 100);
        hud.bar.setFillStyle(hud.player.hero.accent, state.ready ? 1 : 0.9);
        hud.state.setText(state.active ? `${Math.ceil(state.remainingMs / 1000)}s` : state.ready ? "READY" : `${Math.round(state.energy)}%`)
          .setColor(state.ready ? "#7df4d4" : "#8fb6c1");
      });
      const alivePlayers = this.players.filter((player) => player.alive).length;
      this.aliveLabel?.setText(`存活 ${alivePlayers + this.ai.aliveCount()} / ${this.players.length + this.matchConfig.aiCount}`);
      return;
    }
    this.labels.hp.setText(`${Math.ceil(this.player.hp)}/${this.player.maxHp}`);
    this.labels.speed.setText(String(this.player.stats.speed));
    this.labels.bombs.setText(`${this.player.bombs.activeCount(this.player.ownerId)}/${this.player.stats.maxBombs}`);
    this.labels.range.setText(String(this.player.stats.blastRange));
    this.labels.shield.setText(this.player.shieldActive ? "1" : "0");
    this.labels.enemies.setText(`${this.ai.aliveCount()}/${this.matchConfig?.aiCount ?? GAME_CONFIG.ENEMY_COUNT}`);

    const state = this.abilities.getDisplayState(this.scene.time.now);
    const fillWidth = Math.round((250 * state.energy) / 100);
    this.energyBarFill.width = fillWidth;
    this.energyBarFill.setFillStyle(this.player.hero.accent, state.ready ? 1 : 0.92);
    this.energyText.setText(`${GAME_TEXT.charging} ${Math.round(state.energy)}%`);

    if (state.active) {
      this.ultimateState.setText(`${GAME_TEXT.active} ${Math.ceil(state.remainingMs / 1000)}s`).setColor("#ffdf71");
    } else if (state.ready) {
      this.ultimateState.setText("Ready / Shift").setColor("#7df4d4");
    } else {
      this.ultimateState.setText(GAME_TEXT.ready).setColor("#9bc3cf");
    }
  }

  toast(text) {
    this.message.setText(text).setAlpha(1);
    this.scene.tweens.killTweensOf(this.message);
    this.scene.tweens.add({
      targets: this.message,
      alpha: 0,
      delay: 850,
      duration: 350,
    });
  }

  smallStyle(color) {
    return {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "13px",
      color,
      fontStyle: "700",
    };
  }

  valueStyle() {
    return {
      fontFamily: '"Microsoft YaHei", sans-serif',
      fontSize: "19px",
      color: "#58e8ff",
      fontStyle: "900",
    };
  }
}
