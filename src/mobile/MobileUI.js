import { isMobileDevice } from "./TouchInputRouter.js";

/**
 * MobileUI — 移动端辅助 UI：
 * - 全屏切换按钮（右上角）
 * - 竖屏时暂停游戏并提示横屏
 */
export class MobileUI {
  constructor(scene) {
    this.scene = scene;
    if (!isMobileDevice()) return;

    this._addFullscreenButton();
    this._addOrientationListener();
  }

  _addFullscreenButton() {
    // 右上角全屏按钮，使用 Phaser text（避免 DOM 干扰触摸事件）
    const btn = this.scene.add.text(
      this.scene.scale.width - 50, 16,
      "\u26F6",
      { fontSize: "28px", color: "#ffffff88" }
    )
      .setOrigin(0.5, 0)
      .setDepth(100)
      .setInteractive({ useHandCursor: true });

    btn.on("pointerdown", () => {
      const doc = document.documentElement;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        doc.requestFullscreen?.() || doc.webkitRequestFullscreen?.();
      }
    });
  }

  _addOrientationListener() {
    // 竖屏时暂停游戏（CSS ::after 已显示提示文字）
    const checkOrientation = () => {
      const isPortrait = window.innerWidth < window.innerHeight;
      if (isPortrait) {
        this.scene.scene.pause();
      } else {
        this.scene.scene.resume();
      }
    };

    // 初始检查
    checkOrientation();

    // 监听旋转
    window.addEventListener("orientationchange", () => {
      setTimeout(checkOrientation, 200); // 等旋转动画完成
    });

    // 也监听 resize（某些设备不触发 orientationchange）
    window.addEventListener("resize", () => {
      setTimeout(checkOrientation, 200);
    });
  }
}
