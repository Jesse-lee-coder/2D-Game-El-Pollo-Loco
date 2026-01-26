/**
 * Represents a throwable bottle object.
 * Handles movement, rotation, collision and splash animation.
 */
class ThrowableObject extends MovableObject {
  /** @type {any} */ world;
  /** @type {number} */ groundY = 351;

  /** @type {boolean} */ isSplashing = false;
  /** @type {boolean} */ hasHit = false;

  /** @type {number|null} */ movementLoop;
  /** @type {number|null} */ rotationAnimationLoop;
  /** @type {number|null} */ splashAnimationLoop;

  /** @type {{top:number,left:number,right:number,bottom:number}} */
  offset = { top: 8, left: 15, right: 15, bottom: 8 };

  /** @type {string[]} */
  IMAGES_BOTTLE_ROTATION = [
    "img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /** @type {string[]} */
  IMAGES_BOTTLE_SPLASH = [
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a new throwable bottle.
   * @param {number} x Start x-position.
   * @param {number} y Start y-position.
   * @param {boolean} otherDirection Throw direction.
   */
  constructor(x, y, otherDirection) {
    super().loadImage("img/img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.otherDirection = otherDirection;
    this.splashWidth = 80;
    this.splashHeight = 80;
    this.throw();
  }

  /**
   * Starts bottle movement and rotation.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.wasThrown = true;

    if (!this.movementLoop && !this.isSplashing) {
      const throwSpeedX = this.otherDirection ? -10 : 10;
      this.movementLoop = setInterval(() => {
        this.x += throwSpeedX;
        this.handleBottleImpact();
      }, 25);
    }
    this.startBottleRotationAnimation();
  }

  /**
   * Checks for ground or enemy impact.
   */
  handleBottleImpact() {
    if (this.isSplashing) return;

    if (this.y >= this.groundY || world.bottleHitObject) {
      this.triggerSplashAndRemove();
    }
  }

  /**
   * Triggers splash animation and removes bottle.
   */
  triggerSplashAndRemove() {
    if (this.isSplashing) return;

    this.hasHit = true;
    this.isSplashing = true;
    this.playBottleSplash();
    this.stopMovementAndRotationLoops();

    setTimeout(() => {
      const index = world.character.bottles.indexOf(this);
      if (index > -1) world.character.bottles.splice(index, 1);
      this.stopAllLoops();
    }, 500);
  }

  /**
   * Plays splash sound and animation.
   */
  playBottleSplash() {
    if (!this.isSplashing) return;
    if (!isMuted && !isGameFinish && typeof bottle_break !== "undefined") {
      bottle_break.currentTime = 0;
      bottle_break.volume = bottle_break_volume;
      safePlay(bottle_break);
    }

    this.width = this.splashWidth;
    this.height = this.splashHeight;
    this.stopMovementAndRotationLoops();
    this.startSplashAnimationsLoop();
  }

  /**
   * Starts splash animation loop.
   */
  startSplashAnimationsLoop() {
    if (!this.splashAnimationLoop) {
      this.splashAnimationLoop = setInterval(() => {
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
        if (
          this.currentImage % this.IMAGES_BOTTLE_SPLASH.length === 0 &&
          this.currentImage > 0
        ) {
          clearInterval(this.splashAnimationLoop);
          this.splashAnimationLoop = null;
        }
      }, 1000 / 10);
    }
  }

  /**
   * Stops all animation and movement loops.
   */
  stopAllLoops() {
    super.stopAllLoops();
    if (this.movementLoop) clearInterval(this.movementLoop);
    if (this.rotationAnimationLoop) clearInterval(this.rotationAnimationLoop);
    if (this.splashAnimationLoop) clearInterval(this.splashAnimationLoop);

    this.movementLoop = null;
    this.rotationAnimationLoop = null;
    this.splashAnimationLoop = null;
  }

  /**
   * Restarts movement and rotation if bottle is active.
   */
  startAllLoops() {
    super.startAllLoops();

    if (!this.isSplashing) {
      if (this.wasThrown && !this.movementLoop) {
        const throwSpeedX = this.otherDirection ? -10 : 10;
        this.movementLoop = setInterval(() => {
          this.x += throwSpeedX;
          this.handleBottleImpact();
        }, 25);
      }
      this.startBottleRotationAnimation();
    }
  }

  /**
   * Starts bottle rotation animation.
   */
  startBottleRotationAnimation() {
    if (!this.rotationAnimationLoop) {
      this.rotationAnimationLoop = setInterval(() => {
        if (!this.isSplashing) {
          this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
        }
      }, 1000 / 25);
    }
  }

  /**
   * Stops movement and rotation loops.
   */
  stopMovementAndRotationLoops() {
    if (this.movementLoop) clearInterval(this.movementLoop);
    if (this.rotationAnimationLoop) clearInterval(this.rotationAnimationLoop);
    this.movementLoop = null;
    this.rotationAnimationLoop = null;
  }
}
