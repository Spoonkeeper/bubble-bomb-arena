const CONTROL_CODES = new Set([
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "Space", "KeyQ", "KeyP", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight",
]);

const asList = (value) => Array.isArray(value) ? value : [value];

function normalizedCode(event) {
  if (!event) return "";
  if (event.code === "Shift" || (!event.code && event.key === "Shift")) {
    return event.location === 2 ? "ShiftRight" : "ShiftLeft";
  }
  if (event.code === "Control" || (!event.code && event.key === "Control")) {
    return event.location === 2 ? "ControlRight" : "ControlLeft";
  }
  return event.code || "";
}

export class KeyboardInputRouter {
  constructor(keyboard = null, nativeTarget = typeof window !== "undefined" ? window : null) {
    this.keyboard = keyboard;
    this.nativeTarget = nativeTarget;
    this.down = new Set();
    this.pressed = new Set();
    this.onKeyDown = (event) => this.handleKeyDown(event);
    this.onKeyUp = (event) => this.handleKeyUp(event);
    keyboard?.on?.("keydown", this.onKeyDown);
    keyboard?.on?.("keyup", this.onKeyUp);
    nativeTarget?.addEventListener?.("keydown", this.onKeyDown, true);
    nativeTarget?.addEventListener?.("keyup", this.onKeyUp, true);
  }

  handleKeyDown(event) {
    const code = normalizedCode(event);
    if (!code) return;
    if (CONTROL_CODES.has(code)) event.preventDefault?.();
    if (!this.down.has(code)) this.pressed.add(code);
    this.down.add(code);
  }

  handleKeyUp(event) {
    const code = normalizedCode(event);
    if (!code) return;
    if (CONTROL_CODES.has(code)) event.preventDefault?.();
    this.down.delete(code);
  }

  isDown(codes) {
    return asList(codes).some((code) => this.down.has(code));
  }

  wasPressed(codes) {
    return asList(codes).some((code) => this.pressed.has(code));
  }

  endFrame() {
    this.pressed.clear();
  }

  destroy() {
    this.keyboard?.off?.("keydown", this.onKeyDown);
    this.keyboard?.off?.("keyup", this.onKeyUp);
    this.nativeTarget?.removeEventListener?.("keydown", this.onKeyDown, true);
    this.nativeTarget?.removeEventListener?.("keyup", this.onKeyUp, true);
    this.down.clear();
    this.pressed.clear();
  }
}

export function createInputProfiles(playerCount = 1) {
  if (playerCount === 2) {
    return [
      {
        movement: { left: ["KeyA"], right: ["KeyD"], up: ["KeyW"], down: ["KeyS"] },
        bomb: ["ControlLeft"],
        ultimate: ["KeyQ"],
      },
      {
        movement: { left: ["ArrowLeft"], right: ["ArrowRight"], up: ["ArrowUp"], down: ["ArrowDown"] },
        bomb: ["ControlRight"],
        ultimate: ["KeyP"],
      },
    ];
  }

  return [{
    movement: {
      left: ["KeyA", "ArrowLeft"], right: ["KeyD", "ArrowRight"],
      up: ["KeyW", "ArrowUp"], down: ["KeyS", "ArrowDown"],
    },
    bomb: ["Space"],
    ultimate: ["ShiftLeft", "ShiftRight"],
  }];
}
