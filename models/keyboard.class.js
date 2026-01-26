/**
 * Handles keyboard and touch input for the game.
 * Maps key presses and touch events to movement/action flags.
 */
class Keyboard {
  /** @type {boolean} */ LEFT = false;
  /** @type {boolean} */ RIGHT = false;
  /** @type {boolean} */ UP = false;
  /** @type {boolean} */ DOWN = false;
  /** @type {boolean} */ SPACE = false;
  /** @type {boolean} */ D = false;

  /**
   * Creates the keyboard handler and registers input events.
   */
  constructor() {
    this.registerKeyEvents();
    this.setupTouchControls();
  }

  /**
   * Registers keyboard keydown and keyup listeners.
   */
  registerKeyEvents() {
    this.registerKeyDown();
    this.registerKeyUp();
  }

  /**
   * Handles keydown events and sets movement flags.
   */
  registerKeyDown() {
    window.addEventListener("keydown", (event) => {
      const code = event.keyCode;
      if (code === 32) this.SPACE = true;
      if (code === 37) this.LEFT = true;
      if (code === 38) this.UP = true;
      if (code === 39) this.RIGHT = true;
      if (code === 40) this.DOWN = true;
      if (code === 68) this.D = true;
    });
  }

  /**
   * Handles keyup events and resets movement flags.
   */
  registerKeyUp() {
    window.addEventListener("keyup", (event) => {
      const code = event.keyCode;
      if (code === 32) this.SPACE = false;
      if (code === 37) this.handleStopLeft();
      if (code === 39) this.handleStopRight();
      if (code === 38) this.UP = false;
      if (code === 40) this.DOWN = false;
      if (code === 68) this.D = false;
    });
  }

  /**
   * Stops left movement and walking sound.
   */
  handleStopLeft() {
    this.LEFT = false;
    this.stopWalkingSound();
  }

  /**
   * Stops right movement and walking sound.
   */
  handleStopRight() {
    this.RIGHT = false;
    this.stopWalkingSound();
  }

  /**
   * Sets up touch controls for mobile devices.
   */
  setupTouchControls() {
    const left = document.getElementById("btn_left");
    const right = document.getElementById("btn_right");
    const jump = document.getElementById("btn_jump");
    const thr = document.getElementById("btn_throw");
    if (!left || !right || !jump || !thr) return;

    this.bindMoveButton(left, "LEFT");
    this.bindMoveButton(right, "RIGHT");
    this.bindSimpleButton(jump, "SPACE");
    this.bindSimpleButton(thr, "D");
  }

  /**
   * Binds a movement button (left/right) to touch events.
   * @param {HTMLElement} button
   * @param {keyof Keyboard} prop
   */
  bindMoveButton(button, prop) {
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this[prop] = true;
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      this[prop] = false;
      this.stopWalkingSound();
    });
  }

  /**
   * Binds a simple action button (jump/throw) to touch events.
   * @param {HTMLElement} button
   * @param {keyof Keyboard} prop
   */
  bindSimpleButton(button, prop) {
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this[prop] = true;
    });

    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      this[prop] = false;
    });
  }

  /**
   * Stops the walking sound when no horizontal movement is active.
   */
  stopWalkingSound() {
    if (typeof character_walking === "undefined") return;
    if (this.LEFT || this.RIGHT) return;
    safePause(character_walking);
    character_walking.currentTime = 0;
  }
}
