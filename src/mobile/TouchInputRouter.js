const asList = (value) => Array.isArray(value) ? value : [value];

const DIRECTION_CODES = ["LEFT", "RIGHT", "UP", "DOWN"];
const ACTION_CODES = ["BOMB", "ULTIMATE"];

/**
 * Detect whether the current environment is a mobile/touch device.
 * Used by Task 5 to decide whether to create a TouchInputRouter.
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
   * @param {Phaser.Scene} scene - The active Phaser scene (for pointer events and canvas reference).
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
    this._deadZone = 12;
    this._maxRadius = 60; // base radius

    // Canvas reference
    this._canvas = scene.game.canvas;

    // Build DOM overlay
    this._overlay = this._createOverlay();

    // Position overlay to match canvas
    this._syncOverlayRect();
    this._resizeObserver = new ResizeObserver(() => this._syncOverlayRect());
    this._resizeObserver.observe(this._canvas);

    // Bind Phaser pointer events for joystick
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

    // Joystick base
    this._joystickBase = document.createElement("div");
    this._joystickBase.style.cssText =
      "position:absolute;display:none;width:120px;height:120px;border-radius:50%;" +
      "background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.35);" +
      "transform:translate(-50%,-50%);pointer-events:none;";
    overlay.appendChild(this._joystickBase);

    // Joystick thumb
    this._joystickThumb = document.createElement("div");
    this._joystickThumb.style.cssText =
      "position:absolute;width:60px;height:60px;border-radius:50%;" +
      "background:rgba(255,255,255,0.45);border:2px solid rgba(255,255,255,0.65);" +
      "transform:translate(-50%,-50%);pointer-events:none;";
    this._joystickBase.appendChild(this._joystickThumb);

    // Bomb button (💣)
    this._bombBtn = this._createActionButton("BOMB", "💣", "rgba(255,80,80,0.55)", "#ff5050");
    overlay.appendChild(this._bombBtn);

    // Ultimate button (⚡)
    this._ultimateBtn = this._createActionButton("ULTIMATE", "⚡", "rgba(88,232,255,0.55)", "#58e8ff");
    overlay.appendChild(this._ultimateBtn);

    document.body.appendChild(overlay);
    return overlay;
  }

  _createActionButton(code, label, bg, borderColor) {
    const btn = document.createElement("div");
    btn.setAttribute("data-touch-code", code);
    btn.style.cssText =
      "position:absolute;width:88px;height:88px;border-radius:50%;" +
      `background:${bg};border:2px solid ${borderColor};` +
      "display:flex;align-items:center;justify-content:center;" +
      "font-size:36px;line-height:1;user-select:none;" +
      "pointer-events:auto;touch-action:none;" +
      "transform:translate(-50%,-50%);";
    btn.textContent = label;

    const onDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.down.has(code)) this.pressed.add(code);
      this.down.add(code);
    };
    const onUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.down.delete(code);
    };

    btn.addEventListener("pointerdown", onDown);
    btn.addEventListener("pointerup", onUp);
    btn.addEventListener("pointerleave", onUp);
    btn.addEventListener("pointercancel", onUp);

    // Store cleanup references
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

    // Reposition buttons relative to overlay size
    const w = rect.width;
    const h = rect.height;

    // Bomb button: bottom-right, left side of the two buttons
    if (this._bombBtn) {
      this._bombBtn.style.left = (w - 120) + "px";
      this._bombBtn.style.top = (h - 90) + "px";
    }

    // Ultimate button: bottom-right, right side
    if (this._ultimateBtn) {
      this._ultimateBtn.style.left = (w - 30) + "px";
      this._ultimateBtn.style.top = (h - 90) + "px";
    }

    // Reposition active joystick so it stays pinned to the game coordinate
    if (this._joystickActive) {
      const scaleX = rect.width / this.scene.scale.width;
      const scaleY = rect.height / this.scene.scale.height;

      const left = rect.left + this._joystickBaseX * scaleX;
      const top = rect.top + this._joystickBaseY * scaleY;

      this._joystickBase.style.left = left + "px";
      this._joystickBase.style.top = top + "px";
    }

    // Default joystick position (bottom-left area)
    this._defaultJoystickX = 140;
    this._defaultJoystickY = h - 140;
  }

  // ── Joystick pointer handling ────────────────────────────────

  _isInJoystickZone(pointer) {
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;
    return pointer.x < w * 0.35 && pointer.y > h * 0.5;
  }

  _handlePointerDown(pointer) {
    if (!this._isInJoystickZone(pointer)) return;
    if (this._joystickActive) return;

    this._joystickActive = true;
    this._joystickPointerId = pointer.id;
    this._joystickBaseX = pointer.x;
    this._joystickBaseY = pointer.y;

    // Position the joystick base at the touch point
    const canvasRect = this._canvas.getBoundingClientRect();
    const scaleX = canvasRect.width / this.scene.scale.width;
    const scaleY = canvasRect.height / this.scene.scale.height;

    const left = canvasRect.left + pointer.x * scaleX;
    const top = canvasRect.top + pointer.y * scaleY;

    this._joystickBase.style.left = left + "px";
    this._joystickBase.style.top = top + "px";
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

    if (dist > this._deadZone) {
      // Determine primary direction
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const newDir = absDx > absDy ? (dx > 0 ? "RIGHT" : "LEFT") : (dy > 0 ? "DOWN" : "UP");

      // Track pressed: add to pressed if this direction wasn't already down
      if (!this.down.has(newDir)) this.pressed.add(newDir);

      // Clear previous direction states and set the new one
      for (const code of DIRECTION_CODES) this.down.delete(code);
      this.down.add(newDir);

      // Constrain thumb
      const clampedDist = Math.min(dist, this._maxRadius);
      const ratio = clampedDist / dist;
      const thumbDx = dx * ratio;
      const thumbDy = dy * ratio;

      // Thumb position relative to base center (base is 120px, thumb is 60px)
      // The thumb is centered inside the base, so we offset from center
      const baseHalf = 60; // half of 120px base
      const thumbHalf = 30; // half of 60px thumb
      const px = baseHalf + thumbDx - thumbHalf;
      const py = baseHalf + thumbDy - thumbHalf;
      this._joystickThumb.style.left = px + "px";
      this._joystickThumb.style.top = py + "px";
    } else {
      // Within dead zone — reset thumb to center
      this._joystickThumb.style.left = "50%";
      this._joystickThumb.style.top = "50%";
    }
  }

  _handlePointerUp(pointer) {
    if (!this._joystickActive) return;
    if (pointer.id !== this._joystickPointerId) return;
    this._joystickActive = false;
    this._joystickPointerId = null;

    // Reset joystick visuals
    this._joystickBase.style.display = "none";
    this._joystickThumb.style.left = "50%";
    this._joystickThumb.style.top = "50%";

    // Clear all direction states
    for (const code of DIRECTION_CODES) this.down.delete(code);
  }

  // ── Public API (mirrors KeyboardInputRouter) ─────────────────

  /**
   * Check if any of the given codes is currently held down.
   * @param {string|string[]} codes
   * @returns {boolean}
   */
  isDown(codes) {
    return asList(codes).some((code) => this.down.has(code));
  }

  /**
   * Check if any of the given codes was pressed this frame.
   * @param {string|string[]} codes
   * @returns {boolean}
   */
  wasPressed(codes) {
    return asList(codes).some((code) => this.pressed.has(code));
  }

  /**
   * Clear the pressed set at the end of each frame.
   */
  endFrame() {
    this.pressed.clear();
  }

  /**
   * Remove all event listeners and DOM elements.
   */
  destroy() {
    // Unbind Phaser pointer events
    if (this.scene && this.scene.input) {
      this.scene.input.off("pointerdown", this._onPointerDown);
      this.scene.input.off("pointermove", this._onPointerMove);
      this.scene.input.off("pointerup", this._onPointerUp);
    }

    // Remove DOM button listeners
    for (const btn of [this._bombBtn, this._ultimateBtn]) {
      if (!btn) continue;
      btn.removeEventListener("pointerdown", btn._onDown);
      btn.removeEventListener("pointerup", btn._onUp);
      btn.removeEventListener("pointerleave", btn._onUp);
      btn.removeEventListener("pointercancel", btn._onUp);
      btn.remove();
    }

    // Remove joystick elements
    if (this._joystickBase) this._joystickBase.remove();
    if (this._overlay) this._overlay.remove();

    // Disconnect ResizeObserver
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    // Clear state
    this.down.clear();
    this.pressed.clear();
    this._joystickActive = false;
    this._joystickPointerId = null;
  }
}
