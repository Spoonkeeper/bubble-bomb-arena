export const TECH_UI_ASSETS = {
  overlay: { key: "ui-tech-overlay-v1", path: "assets/ui-tech-overlay-v1.png" },
  panel: { key: "ui-panel-frame-v1", path: "assets/ui-panel-frame-v1.png" },
  primaryButton: { key: "ui-primary-button-v1", path: "assets/ui-primary-button-v1.png" },
};

export function preloadTechUi(scene) {
  Object.values(TECH_UI_ASSETS).forEach(({ key, path }) => {
    if (!scene.textures.exists(key)) scene.load.image(key, path);
  });
}

export function addTechOverlay(scene, depth = 80, alpha = 0.96) {
  const overlay = scene.add.image(640, 380, TECH_UI_ASSETS.overlay.key)
    .setDisplaySize(1280, 760)
    .setDepth(depth)
    .setAlpha(0);
  overlay.setScale(1.018);
  scene.tweens.add({
    targets: overlay,
    alpha,
    scaleX: 1,
    scaleY: 1,
    duration: 560,
    ease: "Cubic.easeOut",
  });
  return overlay;
}

export function addPanelFrame(scene, x, y, width, height, depth = 6, alpha = 0.86) {
  const frame = scene.add.image(x, y, TECH_UI_ASSETS.panel.key)
    .setDisplaySize(width, height)
    .setDepth(depth)
    .setAlpha(alpha);
  scene.tweens.add({
    targets: frame,
    alpha: Math.min(1, alpha + 0.09),
    duration: 1350,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });
  return frame;
}

export function addPrimaryButtonSkin(scene, x, y, width, height, depth = 10) {
  return scene.add.image(x, y, TECH_UI_ASSETS.primaryButton.key)
    .setDisplaySize(width, height)
    .setDepth(depth);
}

export function wireTechButton(scene, hitTarget, visualTargets, options = {}) {
  const targets = Array.isArray(visualTargets) ? visualTargets : [visualTargets];
  const baseScales = targets.map((target) => ({
    target,
    x: target.scaleX ?? 1,
    y: target.scaleY ?? 1,
  }));
  const hoverScale = options.hoverScale || 1.035;
  hitTarget.on("pointerover", () => {
    baseScales.forEach(({ target, x, y }) => {
      scene.tweens.add({ targets: target, scaleX: x * hoverScale, scaleY: y * hoverScale, duration: 120, ease: "Quad.easeOut" });
    });
  });
  hitTarget.on("pointerout", () => {
    baseScales.forEach(({ target, x, y }) => {
      scene.tweens.add({ targets: target, scaleX: x, scaleY: y, duration: 150, ease: "Quad.easeOut" });
    });
  });
  hitTarget.on("pointerdown", () => {
    baseScales.forEach(({ target, x, y }) => {
      scene.tweens.add({ targets: target, scaleX: x * 0.975, scaleY: y * 0.975, duration: 70, yoyo: true, ease: "Quad.easeOut" });
    });
  });
}

export function addAmbientTechMotion(scene, depth = 2) {
  const scan = scene.add.rectangle(640, 86, 196, 2, 0x58e8ff, 0.34).setDepth(depth);
  scene.tweens.add({
    targets: scan,
    x: 1080,
    alpha: 0.05,
    duration: 2200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });
  return scan;
}
