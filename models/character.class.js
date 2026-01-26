/**
 * Main player character (Pepe).
 * Handles movement, animations, idle behavior and bottle throwing.
 */
class Character extends MovableObject {
  /** @type {number} */ height = 280;
  /** @type {number} */ width = 150;
  /** @type {number} */ groundY = 155;
  /** @type {number} */ speed = 10;

  /** @type {number} */ characterLifePoints = 100;
  /** @type {number} */ lastInputTime = Date.now();
  /** @type {number} */ idleTimeout = 6000;

  /** @type {boolean} */ isAbleToMoveRight = true;
  /** @type {boolean} */ isAbleToMoveLeft = true;
  /** @type {boolean} */ canStomp = false;

  /** @type {any[]} */ collectBottles = [];
  /** @type {any[]} */ collectCoins = [];
  /** @type {ThrowableObject[]} */ bottles = [];

  /** @type {number} */ lastThrow = 0;
  /** @type {number} */ throwWaitTime = 500;

  /** @type {World} */ world;

  /** @type {{top:number,left:number,right:number,bottom:number}} */
  offset = { top: 120, left: 18, right: 28, bottom: 13 };

  /** @type {string[]} */
  IMAGES_IDLE = [
    "img/img/2_character_pepe/1_idle/idle/I-1.png",
    "img/img/2_character_pepe/1_idle/idle/I-2.png",
    "img/img/2_character_pepe/1_idle/idle/I-3.png",
    "img/img/2_character_pepe/1_idle/idle/I-4.png",
    "img/img/2_character_pepe/1_idle/idle/I-5.png",
    "img/img/2_character_pepe/1_idle/idle/I-6.png",
    "img/img/2_character_pepe/1_idle/idle/I-7.png",
    "img/img/2_character_pepe/1_idle/idle/I-8.png",
    "img/img/2_character_pepe/1_idle/idle/I-9.png",
    "img/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /** @type {string[]} */
  IMAGES_LONG_IDLE = [
    "img/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /** @type {string[]} */
  IMAGES_WALKING = [
    "img/img/2_character_pepe/2_walk/W-21.png",
    "img/img/2_character_pepe/2_walk/W-22.png",
    "img/img/2_character_pepe/2_walk/W-23.png",
    "img/img/2_character_pepe/2_walk/W-24.png",
    "img/img/2_character_pepe/2_walk/W-25.png",
    "img/img/2_character_pepe/2_walk/W-26.png",
  ];

  /** @type {string[]} */
  IMAGES_JUMPING = [
    "img/img/2_character_pepe/3_jump/J-31.png",
    "img/img/2_character_pepe/3_jump/J-32.png",
    "img/img/2_character_pepe/3_jump/J-33.png",
    "img/img/2_character_pepe/3_jump/J-34.png",
    "img/img/2_character_pepe/3_jump/J-35.png",
    "img/img/2_character_pepe/3_jump/J-36.png",
    "img/img/2_character_pepe/3_jump/J-37.png",
    "img/img/2_character_pepe/3_jump/J-38.png",
    "img/img/2_character_pepe/3_jump/J-39.png",
  ];

  /** @type {string[]} */
  IMAGES_DEAD = [
    "img/img/2_character_pepe/5_dead/D-51.png",
    "img/img/2_character_pepe/5_dead/D-52.png",
    "img/img/2_character_pepe/5_dead/D-53.png",
    "img/img/2_character_pepe/5_dead/D-54.png",
    "img/img/2_character_pepe/5_dead/D-55.png",
    "img/img/2_character_pepe/5_dead/D-56.png",
    "img/img/2_character_pepe/5_dead/D-57.png",
  ];

  /** @type {string[]} */
  IMAGES_HURT = [
    "img/img/2_character_pepe/4_hurt/H-41.png",
    "img/img/2_character_pepe/4_hurt/H-42.png",
    "img/img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Creates the character and starts gravity + animation loops.
   */
  constructor() {
    super().loadImage("img/img/2_character_pepe/1_idle/idle/I-1.png");
    [this.IMAGES_IDLE, this.IMAGES_LONG_IDLE, this.IMAGES_WALKING, this.IMAGES_JUMPING, this.IMAGES_DEAD, this.IMAGES_HURT]
      .forEach((set) => this.loadImages(set));
    this.applyGravity();
    this.animate();
  }

  /**
   * Starts movement, animation and idle loops.
   */
  animate() {
    this.startMovementLoop();
    this.startAnimationLoop();
    this.startIdleAnimationLoop();
  }

  /**
   * Movement loop (60 FPS): reads input, moves and updates camera.
   */
  startMovementLoop() {
    this.characterMovementLoop = setInterval(() => {
      this.updateLastInputTime();
      this.moveControl();
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);
  }

  /**
   * Handles all movement inputs.
   */
  moveControl() {
    this.moveRightControl();
    this.moveLeftControl();
    this.jumpControl();
  }

  /**
   * Moves the character to the right if possible.
   */
  moveRightControl() {
    if (!this.world.keyboard.RIGHT || this.x >= this.world.level.level_end_x) return;
    this.otherDirection = false;
    this.moveRight();
    this.playWalkingSound();
  }

  /**
   * Moves the character to the left if possible.
   */
  moveLeftControl() {
    if (!this.world.keyboard.LEFT || this.x <= 0) return;
    this.otherDirection = true;
    this.moveLeft();
    this.playWalkingSound();
  }

  /**
   * Performs a jump if the character is on the ground.
   */
  jumpControl() {
    if (!this.world.keyboard.SPACE || this.isAboveGround() || isGameFinish) return;
    character_jump.currentTime = 0;
    safePlay(character_jump);
    this.jump();
    this.canStomp = true;
  }

  /**
   * Plays walking sound while moving on the ground.
   */
  playWalkingSound() {
    if (this.isAboveGround() || isGameFinish) { safePause(character_walking); character_walking.currentTime = 0; return; }
    if (!character_walking.paused) return;
    safePause(character_snoring); character_snoring.currentTime = 0;
    character_walking.volume = 0.3; character_walking.currentTime = 0;
    safePlay(character_walking);
  }

  /**
   * Animation loop: death/hurt/jump/walk + bottle throwing.
   */
  startAnimationLoop() {
    this.characterAnimationLoop = setInterval(() => {
      if (handleCharacterDeath(this)) return;
      if (handleCharacterHurt(this)) return;
      if (updateJumpAnimation(this)) return;
      updateWalkAnimation(this);
      processBottleThrow(this);
    }, 60);
  }

  /**
   * Idle loop: switches between idle and long-idle + snoring.
   */
  startIdleAnimationLoop() {
    this.characterIdleAnimationLoop = setInterval(() => {
      if (this.isDead() || this.isHurt() || this.isAboveGround()) { safePause(character_snoring); character_snoring.currentTime = 0; return; }
      if (!this.isMoving()) this.idleControl();
      else this.stopSnoring();
    }, 200);
  }

  /**
   * @returns {boolean} True if any movement or action key is pressed.
   */
  isMoving() {
    const k = this.world.keyboard;
    return k.RIGHT || k.LEFT || k.SPACE || k.D;
  }

  /**
   * Chooses idle animation depending on how long the player is inactive.
   */
  idleControl() {
    if (this.hasBeenIdle()) { this.playAnimation(this.IMAGES_LONG_IDLE); this.playSnoring(); }
    else { this.playAnimation(this.IMAGES_IDLE); this.stopSnoring(); }
  }

  /**
   * Plays snoring sound in long idle state and lowers music volume.
   */
  playSnoring() {
    if (isGameFinish || isMuted) return;
    safePause(character_walking); character_walking.currentTime = 0;
    if (!character_snoring.paused) return;
    character_snoring.volume = character_snoring_volume;
    character_snoring.currentTime = 0;
    safePlay(character_snoring);
    game_music.volume = game_music_volume_low;
  }

  /**
   * Stops snoring and restores music volume.
   */
  stopSnoring() {
    safePause(character_snoring);
    character_snoring.currentTime = 0;
    game_music.volume = game_music_volume_high;
  }

  /**
   * @returns {boolean} True if no input happened for the idle timeout.
   */
  hasBeenIdle() {
    return Date.now() - this.lastInputTime > this.idleTimeout;
  }

  /**
   * Updates last input timestamp when any movement/action key is pressed.
   */
  updateLastInputTime() {
    const k = this.world.keyboard;
    if (k.RIGHT || k.LEFT || k.SPACE || k.D) this.lastInputTime = Date.now();
  }

  /**
   * Throws a bottle if cooldown is ready and bottles are available.
   * @param {number} now Current timestamp (ms).
   */
  executeBottleThrow(now) {
    if (now - this.lastThrow < this.throwWaitTime) return;
    if (this.collectBottles.length === 0) return;
    const x = this.x + (this.otherDirection ? -5 : 80);
    this.collectBottles.splice(0, 1);
    this.bottles.push(new ThrowableObject(x, this.y + 130, this.otherDirection));
    this.lastThrow = now;
    this.updateLastInputTime();
  }

  /**
   * Clears all character-specific intervals.
   */
  clearCharacterLoops() {
    clearInterval(this.characterMovementLoop);
    clearInterval(this.characterAnimationLoop);
    clearInterval(this.characterIdleAnimationLoop);
  }

  /**
   * Stops gravity and all character loops and audio.
   */
  stopAllLoops() {
    super.stopAllLoops();
    this.clearCharacterLoops();
    safePause(character_walking);
    safePause(character_snoring);
  }

  /**
   * Restarts gravity and all character loops (if not dead).
   */
  startAllLoops() {
    if (this.isDead()) return;
    super.startAllLoops();
    this.animate();
  }
}
