import { GAME_CONFIG } from "./config.js";
import { StartScene } from "./scenes/StartScene.js";
import { MapSelectScene } from "./scenes/MapSelectScene.js";
import { MatchSetupScene } from "./scenes/MatchSetupScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { ResultScene } from "./scenes/ResultScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game-root",
  width: 1280,
  height: 760,
  backgroundColor: "#09171c",
  pixelArt: false,
  antialias: true,
  scene: [StartScene, MatchSetupScene, MapSelectScene, GameScene, ResultScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

window.ZBBT_CONFIG = GAME_CONFIG;
window.ZBBT_GAME = new Phaser.Game(config);

// 注册 Service Worker（PWA 离线支持）
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(
      (reg) => console.log("[PWA] SW registered:", reg.scope),
      (err) => console.warn("[PWA] SW registration failed:", err)
    );
  });
}
