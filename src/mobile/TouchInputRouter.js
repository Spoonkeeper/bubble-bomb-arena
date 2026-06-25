const asList = (value) => Array.isArray(value) ? value : [value];

const DIRECTION_CODES = ["LEFT", "RIGHT", "UP", "DOWN"];
const ACTION_CODES = ["BOMB", "ULTIMATE"];

/**
 * Detect whether the current environment is a mobile/touch device.
 */
export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)
  );
}

export class TouchInputRouter {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.down = new Set();
    this.pressed = new Set();

    // Joystick state
    this._joystickActive = false;
    this._joystickPointerId = null;
    this._joystickBaseX = 0;
    this._joystickBaseY = 0;
    this._deadZone = 8;       // smaller dead zone for responsiveness
    this._maxRadius = 40;     // smaller thumb travel (base radius)

    this._canvas = scene.game.canvas;
    this._overlay = this._createOverlay();

    this._syncOverlayRect();
    this._resizeObserver = new ResizeObserver(() => this._syncOverlayRect());
    this._resizeObserver.observe(this._canvas);

    this._onPointerDown = (pointer) => this._handlePointerDown(pointer);
    this._onPointerMove = (pointer) => this._handlePointerMove(pointer);
    this._onPointerUp = (pointer) => this._handlePointerUp(pointer);

    scene.input.on("pointerdown", this._onPointerDown);
    scene.input.on("pointermove", this._onPointerMove);
    scene.input.on("pointerup", this._onPointerUp);
  }

  // ── DOM overlay ──────────────────────────────────────────────

  _createOverlay() {
    const overlay = document.createElement("div");
    overlay.setAttribute("data-touch-router", "overlay");
    overlay.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;" +
      "pointer-events:none;z-index:10;overflow:hidden;";

    // Joystick base (smaller: 80px)
    this._joystickBase = document.createElement("div");
    this._joystickBase.style.cssText =
      "position:absolute;display:none;width:80px;height:80px;border-radius:50%;" +
      "background:rgba(255,255,255,0.12);border:2px solid rgba(255,255,255,0.3);" +
      "transform:translate(-50%,-50%);pointer-events:none;";
    overlay.appendChild(this._joystickBase);

    // Joystick thumb (smaller: 40px)
    this._joystickThumb = document.createElement("div");
    this._joystickThumb.style.cssText =
      "position:absolute;width:40px;height:40px;border-radius:50%;" +
      "background:rgba(255,255,255,0.4);border:2px solid rgba(255,255,255,0.55);" +
      "transform:translate(-50%,-50%);pointer-events:none;";
    this._joystickBase.appendChild(this._joystickThumb);

    // Bomb button (smaller: 64px)
    this._bombBtn = this._createActionButton("BOMB", "💣", "rgba(255,68,82,0.5)", "#ff4452");
    overlay.appendChild(this._bombBtn);

    // Ultimate button (smaller: 64px)
    this._ultimateBtn = this._createActionButton("ULTIMATE", "⚡", "rgba(88,232,255,0.5)", "#58e8ff");
    overlay.appendChild(this._ultimateBtn);

    document.body.appendChild(overlay);
    return overlay;
  }

  _createActionButton(code, label, bg, borderColor) {
    const btn = document.createElement("div");
    btn.setAttribute("data-touch-code", code);
    btn.style.cssText =
      "position:absolute;width:64px;height:64px;border-radius:50%;" +
      `background:${bg};border:2px solid ${borderColor};` +
      "display:flex;align-items:center;justify-content:center;" +
      "font-size:28px;line-height:1;user-select:none;" +
      "pointer-events:auto;touch-action:none;" +
      "transform:translate(-50%,-50%);" +
      "transition: transform 0.08s ease-out;";
    btn.textContent = label;

    const onDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.down.has(code)) this.pressed.add(code);
      this.down.add(code);
      btn.style.transform = "translate(-50%,-50%) scale(0.85)";
    };
    const onUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.down.delete(code);
      btn.style.transform = "translate(-50%,-50%) scale(1)";
    };

    btn.addEventListener("pointerdown", onDown);
    btn.addEventListener("pointerup", onUp);
    btn.addEventListener("pointerleave", onUp);
    btn.addEventListener("pointercancel", onUp);

    btn._onDown = onDown;
    btn._onUp = onUp;

    return btn;
  }

  // ── Overlay positioning ──────────────────────────────────────

  _syncOverlayRect() {
    const rect = this._canvas.getBoundingClientRect();
    if (!this._overlay) return;
    this._overlay.style.top = rect.top + "px";
    this._overlay.style.left = rect.left + "px";
    this._overlay.style.width = rect.width + "px";
    this._overlay.style.height = rect.height + "px";

    const w = rect.width;
    const h = rect.height;

    // Buttons at bottom-right edge of overlay
    if (this._bombBtn) {
      this._bombBtn.style.left = (w - 100) + "px";
      this._bombBtn.style.top = (h - 60) + "px";
    }
    if (this._ultimateBtn) {
      this._ultimateBtn.style.left = (w - 30) + "px";
      this._ultimateBtn.style.top = (h - 60) + "px";
    }

    // Re-anchor active joystick to game coords
    if (this._joystickActive) {
      const scaleX = rect.width / this.scene.scale.width;
      const scaleY = rect.height / this.scene.scale.height;
      this._joystickBase.style.left = (rect.left + this._joystickBaseX * scaleX) + "px";
      this._joystickBase.style.top = (rect.top + this._joystickBaseY * scaleY) + "px";
    }

    this._defaultJoystickY = h - 100;
  }

  // ── Joystick pointer handling ────────────────────────────────

  _isInJoystickZone(pointer) {
    // Left half of the screen is the joystick zone
    const w = this.scene.scale.width;
    return pointer.x < w * 0.5;
  }

  _handlePointerDown(pointer) {
    if (!this._isInJoystickZone(pointer)) return;
    if (this._joystickActive) return;

    this._joystickActive = true;
    this._joystickPointerId = pointer.id;
    this._joystickBaseX = pointer.x;
    this._joystickBaseY = pointer.y;

    const canvasRect = this._canvas.getBoundingClientRect();
    const scaleX = canvasRect.width / this.scene.scale.width;
    const scaleY = canvasRect.height / this.scene.scale.height;

    this._joystickBase.style.left = (canvasRect.left + pointer.x * scaleX) + "px";
    this._joystickBase.style.top = (canvasRect.top + pointer.y * scaleY) + "px";
    this._joystickBase.style.display = "block";
    this._joystickThumb.style.left = "50%";
    this._joystickThumb.style.top = "50%";
  }

  _handlePointerMove(pointer) {
    if (!this._joystickActive) return;
    if (pointer.id !== this._joystickPointerId) return;

    const dx = pointer.x - this._joystickBaseX;
    const dy = pointer.y - this._joystickBaseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Clear all directions first
    for (const code of DIRECTION_CODES) this.down.delete(code);

    if (dist > this._deadZone) {
      // 8-direction based on angle for smooth diagonal movement
      const angle = Math.atan2(dy, dx);
      const norm = angle < 0 ? angle + Math.PI * 2 : angle;
      const sector = Math.round(norm / (Math.PI / 4)) % 8;

      const map = [
        ["RIGHT"],           // 0: →
        ["RIGHT", "DOWN"],   // 1: ↘
        ["DOWN"],            // 2: ↓
        ["LEFT", "DOWN"],    // 3: ↙
        ["LEFT"],            // 4: ←
        ["LEFT", "UP"],      // 5: ↖
        ["UP"],              // 6: ↑
        ["RIGHT", "UP"],     // 7: ↗
      ];
      const newDirs = map[sector];

      for (const dir of newDirs) {
        if (!this.down.has(dir)) this.pressed.add(dir);
        this.down.add(dir);
      }

      // Thumb follows finger proportionally within the max radius
      const clampedDist = Math.min(dist, this._maxRadius);
      const ratio = clampedDist / dist;
      // Thumb offset from center: 50% ± (thumb travel in percent of base)
      const pctX = 50 + (dx * ratio / this._maxRadius) * 50;
      const pctY = 50 + (dy * ratio / this._maxRadius) * 50;
      this._joystickThumb.style.left = pctX + "%";
      this._joystickThumb.style.top = pctY + "%";
    } else {
      // Dead zone — thumb centered
      this._joystickThumb.style.left = "50%";
      this._joystickThumb.style.top = "50%";
    }
  }

  _handlePointerUp(pointer) {
    if (!this._joystickActive) return;
    if (pointer.id !== this._joystickPointerId) return;
    this._joystickActive = false;
    this._joystickPointerId = null;

    this._joystickBase.style.display = "none";
    this._joystickThumb.style.left = "50%";
    this._joystickThumb.style.top = "50%";

    for (const code of DIRECTION_CODES) this.down.delete(code);
  }

  // ── Public API (mirrors KeyboardInputRouter) ─────────────────

  /** @param {string|string[]} codes */
  isDown(codes) {
    return asList(codes).some((code) => this.down.has(code));
  }

  /** @param {string|string[]} codes */
  wasPressed(codes) {
    return asList(codes).some((code) => this.pressed.has(code));
  }

  endFrame() {
    this.pressed.clear();
  }

  destroy() {
    if (this.scene && this.scene.input) {
      this.scene.input.off("pointerdown", this._onPointerDown);
      this.scene.input.off("pointermove", this._onPointerMove);
      this.scene.input.off("pointerup", this._onPointerUp);
    }

    for (const btn of [this._bombBtn, this._ultimateBtn]) {
      if (!btn) continue;
      btn.removeEventListener("pointerdown", btn._onDown);
      btn.removeEventListener("pointerup", btn._onUp);
      btn.removeEventListener("pointerleave", btn._onUp);
      btn.removeEventListener("pointercancel", btn._onUp);
      btn.remove();
    }

    if (this._joystickBase) this._joystickBase.remove();
    if (this._overlay) this._overlay.remove();

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    this.down.clear();
    this.pressed.clear();
    this._joystickActive = false;
    this._joystickPointerId = null;
  }
}
