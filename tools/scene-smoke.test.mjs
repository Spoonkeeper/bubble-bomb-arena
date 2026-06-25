import test from "node:test";
import assert from "node:assert/strict";

function makeGradient() {
  return { addColorStop() {} };
}

function makeCanvasContext() {
  return {
    clearRect() {},
    fillRect() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    quadraticCurveTo() {},
    ellipse() {},
    arc() {},
    fill() {},
    stroke() {},
    save() {},
    restore() {},
    translate() {},
    rotate() {},
    drawImage() {},
    fillText() {},
    createRadialGradient: () => makeGradient(),
    createLinearGradient: () => makeGradient(),
    getImageData: () => ({ data: new Uint8ClampedArray(4 * 176 * 176) }),
    putImageData() {},
    textAlign: "center",
    textBaseline: "middle",
    font: "",
    lineWidth: 1,
    strokeStyle: "#fff",
    fillStyle: "#fff",
    globalAlpha: 1,
    imageSmoothingEnabled: true,
  };
}

function makeDisplayObject(x = 0, y = 0, text = "", width = 120, height = 120) {
  return {
    x,
    y,
    text,
    alpha: 1,
    scale: 1,
    depth: 0,
    visible: true,
    width,
    height,
    setDepth(value) { this.depth = value; return this; },
    setScale(value) { this.scale = value; return this; },
    setAlpha(value) { this.alpha = value; return this; },
    setVisible(value) { this.visible = value; return this; },
    setStrokeStyle() { return this; },
    setFillStyle() { return this; },
    setBlendMode() { return this; },
    setOrigin() { return this; },
    setAngle() { return this; },
    setPosition(nextX, nextY) { this.x = nextX; this.y = nextY; return this; },
    setDisplaySize(width, height) { this.width = width; this.height = height; return this; },
    setInteractive() { return this; },
    on() { return this; },
    once() { return this; },
    setData() { return this; },
    setTexture(key) { this.texture = key; return this; },
    setColor() { return this; },
    setBackgroundColor() { return this; },
    setShadow() { return this; },
    setText(value) { this.text = value; return this; },
    destroy() { this.destroyed = true; },
  };
}

function makeGraphics(textures) {
  return {
    clear() { return this; },
    fillStyle() { return this; },
    lineStyle() { return this; },
    fillCircle() { return this; },
    strokeCircle() { return this; },
    fillEllipse() { return this; },
    strokeEllipse() { return this; },
    fillRect() { return this; },
    strokeRect() { return this; },
    fillRoundedRect() { return this; },
    strokeRoundedRect() { return this; },
    lineBetween() { return this; },
    fillTriangle() { return this; },
    beginPath() { return this; },
    arc() { return this; },
    moveTo() { return this; },
    lineTo() { return this; },
    strokePath() { return this; },
    setDepth() { return this; },
    setVisible() { return this; },
    generateTexture(key, width = 64, height = 64) {
      textures.store.set(key, { width, height, getSourceImage: () => ({ width, height }) });
      return this;
    },
    destroy() {},
  };
}

function createTextures() {
  const store = new Map();
  return {
    store,
    exists(key) { return store.has(key); },
    get(key) {
      const entry = store.get(key) || { width: 64, height: 64, getSourceImage: () => ({ width: 64, height: 64 }) };
      return { getSourceImage: entry.getSourceImage || (() => ({ width: entry.width, height: entry.height })) };
    },
    createCanvas(key, width, height) {
      const context = makeCanvasContext();
      const entry = { width, height, context, getSourceImage: () => ({ width, height }) };
      store.set(key, entry);
      return { context, refresh: () => store.set(key, entry) };
    },
    remove(key) { store.delete(key); },
  };
}

function createSceneShell() {
  const textures = createTextures();
  const scheduled = [];
  const tweenCalls = [];
  const handlers = new Map();
  const sceneManager = {
    lastStart: null,
    start(key, data) { this.lastStart = { key, data }; },
    restart(data) { this.lastRestart = data; },
  };

  return {
    textures,
    load: {
      image(key) {
        textures.store.set(key, {
          width: 1536,
          height: 1024,
          getSourceImage: () => ({ width: 1536, height: 1024 }),
        });
      },
    },
    add: {
      image: (x, y, key) => {
        const image = makeDisplayObject(x, y);
        image.texture = key;
        return image;
      },
      circle: (x, y, radius) => makeDisplayObject(x, y, "", radius * 2, radius * 2),
      ellipse: (x, y, width, height) => makeDisplayObject(x, y, "", width, height),
      rectangle: (x, y, width, height) => makeDisplayObject(x, y, "", width, height),
      text: (x, y, value) => makeDisplayObject(x, y, value),
      graphics: () => makeGraphics(textures),
      group: () => ({ add() {} }),
      renderTexture: () => ({
        draw() {},
        saveTexture(key) {
          textures.store.set(key, {
            width: 40,
            height: 40,
            getSourceImage: () => ({ width: 40, height: 40 }),
          });
        },
        destroy() {},
      }),
    },
    time: {
      now: 0,
      delayedCall(delay, callback) {
        scheduled.push({ at: this.now + delay, callback });
        return { remove() {} };
      },
    },
    tweens: {
      add(config) { tweenCalls.push(config); return config; },
      chain() {},
      killTweensOf() {},
    },
    input: {
      keyboard: {
        createCursorKeys() {
          return {
            left: { isDown: false },
            right: { isDown: false },
            up: { isDown: false },
            down: { isDown: false },
          };
        },
        addKeys() {
          return {
            W: { isDown: false },
            A: { isDown: false },
            S: { isDown: false },
            D: { isDown: false },
            SPACE: { isDown: false },
            SHIFT: { isDown: false },
          };
        },
        addCapture() {},
        once() {},
      },
    },
    cameras: { main: { setBackgroundColor() {} } },
    scene: sceneManager,
    events: {
      on(name, handler) {
        const list = handlers.get(name) || [];
        list.push(handler);
        handlers.set(name, list);
      },
      emit(name, payload) {
        const list = handlers.get(name) || [];
        list.forEach((handler) => handler(payload));
      },
    },
    __scheduled: scheduled,
    __tweenCalls: tweenCalls,
  };
}

globalThis.document = {
  createElement() {
    return {
      width: 0,
      height: 0,
      getContext: () => makeCanvasContext(),
    };
  },
};

globalThis.Phaser = {
  AUTO: "AUTO",
  BlendModes: { ADD: "ADD" },
  Scale: { FIT: "FIT", CENTER_BOTH: "CENTER_BOTH" },
  Scene: class FakeScene {},
  Input: {
    Keyboard: {
      KeyCodes: { W: 87, A: 65, S: 83, D: 68, SPACE: 32, SHIFT: 16, UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39 },
      JustDown: () => false,
    },
  },
  Math: {
    Clamp: (value, min, max) => Math.min(max, Math.max(min, value)),
    Between: (min) => min,
    FloatBetween: (min) => min,
    DegToRad: (deg) => (deg * Math.PI) / 180,
    Sin: Math.sin,
  },
  Utils: { Array: { GetRandom: (items) => items[0] } },
  Display: {
    Color: {
      IntegerToColor(value) {
        return {
          red: (value >> 16) & 255,
          green: (value >> 8) & 255,
          blue: value & 255,
          rgba: "#ffffff",
        };
      },
      GetColor: (r, g, b) => (r << 16) + (g << 8) + b,
    },
  },
  Game: class FakeGame {
    constructor(config) {
      this.config = config;
    }
  },
};

const { StartScene } = await import("../src/scenes/StartScene.js");
const { MatchSetupScene } = await import("../src/scenes/MatchSetupScene.js");
const { MapSelectScene } = await import("../src/scenes/MapSelectScene.js");
const { GameScene } = await import("../src/scenes/GameScene.js");
const { ResultScene } = await import("../src/scenes/ResultScene.js");
const { resetSceneTransition } = await import("../src/scenes/SceneFlow.js");

function hydrate(scene) {
  return Object.assign(scene, createSceneShell());
}

test("start scene is a pure home screen and enters match setup", () => {
  const scene = hydrate(new StartScene());
  scene.preload();
  scene.create();
  assert.equal(scene.startText.text, "开始部署");
  assert.equal(scene.selectorSlots.length, 0);
  assert.equal(scene.heroKeyArt.texture, "menu-hero-ensemble-v1");
  assert.equal(scene.techOverlay.texture, "ui-tech-overlay-v1");
  assert.equal(scene.startButtonSkin.texture, "ui-primary-button-v1");
  assert.equal(scene.mascot, undefined);
  scene.startGame();
  assert.deepEqual(scene.scene.lastStart, {
    key: "MatchSetupScene",
    data: undefined,
  });
});

test("map select scene creates map cards and starts selected map", () => {
  const scene = hydrate(new MapSelectScene());
  scene.init({ heroId: "volt" });
  scene.preload();
  scene.create();
  assert.equal(scene.cards.length, 3);
  assert.equal(scene.techOverlay.texture, "ui-tech-overlay-v1");
  assert.equal(scene.confirmButtonSkin.texture, "ui-primary-button-v1");
  assert.ok(scene.backButton);
  assert.ok(scene.backText);
  assert.equal(scene.backButton.x > scene.confirmButton.x + scene.confirmButton.width / 2, true);
  assert.equal(scene.backButton.y > scene.confirmButton.y, true);
  const [firstCard, secondCard, thirdCard] = scene.cards;
  const firstRight = firstCard.card.x + firstCard.card.width / 2;
  const secondLeft = secondCard.card.x - secondCard.card.width / 2;
  const secondRight = secondCard.card.x + secondCard.card.width / 2;
  const thirdLeft = thirdCard.card.x - thirdCard.card.width / 2;
  assert.equal(firstRight < secondLeft, true);
  assert.equal(secondRight < thirdLeft, true);
  assert.ok(secondLeft - firstRight >= 24);
  assert.ok(thirdLeft - secondRight >= 24);
  assert.ok(firstCard.selectionPulse);
  assert.ok(secondCard.selectionPulse);
  assert.ok(thirdCard.selectionPulse);
  assert.ok(firstCard.img.width < firstCard.imageFrame.width);
  assert.ok(firstCard.img.height < firstCard.imageFrame.height);
  scene.selectedMapId = "homeland";
  scene.refreshSelection();
  assert.equal(firstCard.selectionPulse.alpha, 0);
  assert.equal(secondCard.selectionPulse.alpha > 0, true);
  assert.ok(secondCard.img.width < secondCard.imageFrame.width);
  assert.ok(secondCard.img.height < secondCard.imageFrame.height);
  scene.selectedMapId = "abyss";
  scene.refreshSelection();
  assert.equal(thirdCard.selectionPulse.alpha > 0, true);
  scene.enterSelectedMap();
  assert.deepEqual(scene.scene.lastStart, {
    key: "GameScene",
    data: { matchConfig: { playerCount: 1, aiCount: 3, playerHeroes: ["volt"] }, mapId: "abyss" },
  });
  resetSceneTransition(scene);
  scene.returnToStart();
  assert.deepEqual(scene.scene.lastStart, {
    key: "MatchSetupScene",
    data: { matchConfig: { playerCount: 1, aiCount: 3, playerHeroes: ["volt"] } },
  });
});

test("match setup scene enforces unique dual heroes and forwards match config", () => {
  const scene = hydrate(new MatchSetupScene());
  scene.init({ matchConfig: { playerCount: 2, aiCount: 0, playerHeroes: ["shadow", "shadow"] } });
  scene.preload();
  scene.create();
  assert.equal(scene.techOverlay.texture, "ui-tech-overlay-v1");
  assert.equal(scene.confirmButtonSkin.texture, "ui-primary-button-v1");
  assert.equal(scene.matchConfig.playerCount, 2);
  assert.equal(scene.matchConfig.aiCount, 0);
  assert.notEqual(scene.matchConfig.playerHeroes[0], scene.matchConfig.playerHeroes[1]);
  scene.setEditingPlayerSlot(0);
  scene.selectHeroForActiveSlot("wind");
  assert.equal(scene.matchConfig.playerHeroes[0], "wind");
  scene.setEditingPlayerSlot(1);
  scene.selectHeroForActiveSlot("volt");
  assert.equal(scene.matchConfig.playerHeroes[1], "volt");
  scene.selectHeroForActiveSlot("wind");
  assert.equal(scene.matchConfig.playerHeroes[1], "volt");
  scene.confirm();
  assert.deepEqual(scene.scene.lastStart, {
    key: "MapSelectScene",
    data: { matchConfig: scene.matchConfig },
  });
});

test("match setup scene keeps panels, hero cards, and actions inside a clean layout", () => {
  const scene = hydrate(new MatchSetupScene());
  scene.init({ matchConfig: { playerCount: 2, aiCount: 2, playerHeroes: ["shadow", "ember"] } });
  scene.preload();
  scene.create();

  const panels = [scene.modePanel, scene.lineupPanel, scene.heroPanel];
  panels.forEach((panel) => {
    assert.ok(panel.x - panel.width / 2 >= 52);
    assert.ok(panel.x + panel.width / 2 <= 1228);
    assert.ok(panel.y - panel.height / 2 >= 150);
    assert.ok(panel.y + panel.height / 2 <= 650);
  });
  assert.ok(scene.modePanel.x + scene.modePanel.width / 2 < scene.lineupPanel.x - scene.lineupPanel.width / 2);
  assert.ok(scene.lineupPanel.x + scene.lineupPanel.width / 2 < scene.heroPanel.x - scene.heroPanel.width / 2);
  scene.heroButtons.forEach(({ frame, label }) => {
    assert.ok(frame.x - frame.width / 2 >= scene.heroPanel.x - scene.heroPanel.width / 2);
    assert.ok(frame.x + frame.width / 2 <= scene.heroPanel.x + scene.heroPanel.width / 2);
    assert.ok(label.x >= frame.x - frame.width / 2);
  });
  assert.ok(scene.backButton.y < 742);
  assert.ok(scene.confirmButton.y < 742);
});

test("start scene home composition and button stay within bounds", () => {
  const scene = hydrate(new StartScene());
  scene.preload();
  scene.create();

  const titleRight = scene.title.x + scene.title.width;
  const buttonLeft = scene.startButton.x - scene.startButton.width / 2;
  const buttonBottom = scene.startButton.y + scene.startButton.height / 2;

  assert.equal(titleRight < buttonLeft, true);
  assert.equal(buttonBottom < 760, true);
  assert.equal(scene.startButton.x > 900, true);
});

test("start scene clears stale deployment state when revisited", () => {
  const scene = hydrate(new StartScene());
  scene.preload();
  scene.create();
  scene.beginDeployment();
  assert.equal(scene.isDeploying, true);

  scene.create();
  assert.equal(scene.isDeploying, false);
  scene.beginDeployment();
  assert.equal(scene.isDeploying, true);
});

test("game scene create and one update tick do not throw", () => {
  const scene = hydrate(new GameScene());
  scene.init({ heroId: "ember", mapId: "inferno" });
  scene.preload();
  scene.create();
  scene.update(16, 16);
  assert.equal(scene.techOverlay.texture, "ui-tech-overlay-v1");
  assert.equal(scene.leftPanelSkin.texture, "ui-panel-frame-v1");
  assert.equal(scene.rightPanelSkin.texture, "ui-panel-frame-v1");
  assert.ok(scene.uiSystem);
  assert.ok(scene.heroAbilitySystem);
  assert.equal(scene.uiSystem.ultimateLabel.text.includes("Shift /"), true);
});

test("homeland game scene creates meteor system and themed map", () => {
  const scene = hydrate(new GameScene());
  scene.init({ heroId: "shadow", mapId: "homeland" });
  scene.preload();
  scene.create();
  assert.equal(scene.techOverlay.texture, "ui-tech-overlay-v1");
  assert.ok(scene.meteorSystem);
  assert.equal(scene.mapSystem.mapConfig.id, "homeland");
  assert.equal(scene.mapSystem.mapConfig.textures.bomb, "homeland-v3-bomb");
});

test("abyss game scene creates portal system without enabling meteors", () => {
  const scene = hydrate(new GameScene());
  scene.init({
    mapId: "abyss",
    matchConfig: { playerCount: 1, aiCount: 3, playerHeroes: ["shadow"] },
  });
  scene.preload();
  scene.create();
  assert.equal(scene.mapSystem.mapId, "abyss");
  assert.ok(scene.portalSystem);
  assert.equal(scene.portalSystem.enabled, true);
  assert.equal(scene.meteorSystem, null);
  assert.equal(scene.aiSystem.portalSystem, scene.portalSystem);
});

test("dual game scene creates two diagonal players and requested AI count", () => {
  const scene = hydrate(new GameScene());
  scene.init({
    matchConfig: { playerCount: 2, aiCount: 1, playerHeroes: ["shadow", "ember"] },
    mapId: "inferno",
  });
  scene.preload();
  scene.create();
  assert.equal(scene.playerSystems.length, 2);
  assert.equal(scene.aiSystem.enemies.length, 1);
  assert.deepEqual(scene.playerSystems.map((player) => player.currentCell()), [
    { col: 1, row: 1 },
    { col: 13, row: 11 },
  ]);
  assert.equal(scene.heroAbilitySystems.length, 2);
});

test("player two P key activates the second ultimate system", () => {
  const scene = hydrate(new GameScene());
  scene.init({
    matchConfig: { playerCount: 2, aiCount: 0, playerHeroes: ["shadow", "ember"] },
    mapId: "inferno",
  });
  scene.preload();
  scene.create();
  scene.heroAbilitySystems[1].addEnergy(100);
  scene.inputRouter.handleKeyDown({ code: "KeyP", key: "p", preventDefault() {} });
  scene.playerSystems[1].tryActivateUltimate(100);

  assert.equal(scene.heroAbilitySystems[0].isActive(), false);
  assert.equal(scene.heroAbilitySystems[1].isActive(), true);
});

test("defeated dual player disappears and both HUD surfaces show eliminated state", () => {
  const scene = hydrate(new GameScene());
  scene.init({
    matchConfig: { playerCount: 2, aiCount: 1, playerHeroes: ["shadow", "ember"] },
    mapId: "inferno",
  });
  scene.preload();
  scene.create();

  const playerTwo = scene.playerSystems[1];
  playerTwo.takeDamage(100, "explosion");
  scene.uiSystem.update();

  assert.equal(playerTwo.alive, false);
  assert.equal(scene.playerInfoPanels[1].defeatStamp.visible, true);
  assert.equal(scene.uiSystem.dualHud[1].status.text, "bye man");
  const deathTween = scene.__tweenCalls.find((config) => config.targets === playerTwo.sprite && config.onComplete);
  assert.ok(deathTween);
  deathTween.onComplete();
  assert.equal(playerTwo.sprite.destroyed, true);
});

test("game scene side panels do not overlap the playable board", () => {
  const scene = hydrate(new GameScene());
  scene.init({ heroId: "shadow", mapId: "inferno" });
  scene.preload();
  scene.create();

  const leftPanelRight = scene.leftPanel.x + scene.leftPanel.width / 2;
  const rightPanelLeft = scene.rightPanel.x - scene.rightPanel.width / 2;
  const boardLeft = scene.boardFrame.x - scene.boardFrame.width / 2;
  const boardRight = scene.boardFrame.x + scene.boardFrame.width / 2;
  const rightPanelBottom = scene.rightPanel.y + scene.rightPanel.height / 2;

  assert.equal(leftPanelRight < boardLeft, true);
  assert.equal(boardRight < rightPanelLeft, true);
  assert.equal(rightPanelBottom < 760, true);
});

test("result scene create does not throw and shows restart control", () => {
  const scene = hydrate(new ResultScene());
  scene.init({
    result: "win",
    heroId: "wind",
    stats: { speed: 2, maxBombs: 1, blastRange: 1, shield: 0 },
  });
  scene.preload();
  scene.create();
  assert.equal(scene.techOverlay.texture, "ui-tech-overlay-v1");
  assert.equal(scene.restartButtonSkin.texture, "ui-primary-button-v1");
  assert.equal(scene.restartText.text, "重新开始");
  assert.equal(scene.resultTitle.text, "闯关成功");
  assert.equal(scene.posterSprite.texture, "result-wind-win-v1");
});

test("result scene poster and result panel remain separated", () => {
  const scene = hydrate(new ResultScene());
  scene.init({
    result: "lose",
    heroId: "volt",
    stats: { speed: 1, maxBombs: 1, blastRange: 2, shield: 1 },
  });
  scene.preload();
  scene.create();

  const frameRight = scene.posterFrame.x + scene.posterFrame.width / 2;
  const sidePanelLeft = scene.resultPanel.x - scene.resultPanel.width / 2;
  const restartBottom = scene.restartButton.y + scene.restartButton.height / 2;

  assert.equal(frameRight < sidePanelLeft, true);
  assert.equal(restartBottom < 760, true);
  assert.equal(scene.posterSprite.texture, "result-volt-lose-v1");
});

test("dual result scene presents winner and loser in a two-up layout", () => {
  const scene = hydrate(new ResultScene());
  scene.init({
    result: "win",
    winner: { ownerId: "player-2", kind: "player", heroId: "wind" },
    matchConfig: { playerCount: 2, aiCount: 0, playerHeroes: ["shadow", "wind"] },
    heroId: "wind",
    stats: {},
  });
  scene.preload();
  scene.create();

  assert.equal(scene.duelCards.length, 2);
  assert.equal(scene.duelCards[0].state, "lose");
  assert.equal(scene.duelCards[0].portrait.texture, "result-shadow-lose-v1");
  assert.equal(scene.duelCards[1].state, "win");
  assert.equal(scene.duelCards[1].portrait.texture, "result-wind-win-v1");
  const leftCardRight = scene.duelCards[0].frame.x + scene.duelCards[0].frame.width / 2;
  const rightCardLeft = scene.duelCards[1].frame.x - scene.duelCards[1].frame.width / 2;
  assert.equal(leftCardRight < rightCardLeft, true);
  scene.duelCards.forEach(({ frame }) => {
    assert.equal(frame.x - frame.width / 2 >= 0, true);
    assert.equal(frame.x + frame.width / 2 <= 1280, true);
    assert.equal(frame.y + frame.height / 2 < scene.restartButton.y - scene.restartButton.height / 2, true);
  });
  assert.equal(scene.restartButton.x, 640);
});

test("AI victory renders every dual player in a defeated state", () => {
  const scene = hydrate(new ResultScene());
  scene.init({
    result: "lose",
    winner: { ownerId: "ai-1", kind: "ai" },
    matchConfig: { playerCount: 2, aiCount: 1, playerHeroes: ["ember", "volt"] },
    heroId: "ember",
    stats: {},
  });
  scene.preload();
  scene.create();

  assert.deepEqual(scene.duelCards.map((card) => card.state), ["lose", "lose"]);
  assert.equal(scene.duelTitle.text, "AI 获胜");
});

test("result scene names player two winner and supports a draw", () => {
  const winnerScene = hydrate(new ResultScene());
  winnerScene.init({
    result: "win",
    winner: { ownerId: "player-2", kind: "player", heroId: "ember" },
    heroId: "ember",
    stats: { speed: 1, maxBombs: 2, blastRange: 2, shield: 0 },
  });
  winnerScene.preload();
  winnerScene.create();
  assert.equal(winnerScene.resultTitle.text, "玩家2获胜");

  const drawScene = hydrate(new ResultScene());
  drawScene.init({ result: "draw", heroId: "shadow", stats: {} });
  drawScene.preload();
  drawScene.create();
  assert.equal(drawScene.resultTitle.text, "本局平局");
});
