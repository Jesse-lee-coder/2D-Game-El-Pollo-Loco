/**
 * A normal chicken enemy.
 * Moves left/right depending on the character position and plays walk/dead animations.
 */
class Chicken extends MovableObject {
  /** @type {Character} */ character;

  /** @type {number} */ height = 60;
  /** @type {number} */ width = 80;
  /** @type {number} */ y = 365;
  /** @type {number} */ chickenLifePoints = 10;

  /** @type {number|null} */ chickenAnimationLoop;
  /** @type {number|null} */ chickenMovementLoop;

  /** @type {{top:number,left:number,right:number,bottom:number}} */
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  /** @type {string[]} */
  IMAGES_WALKING = [
    "img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /** @type {string[]} */
  IMAGE_DEAD = ["img/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Creates a chicken with random speed and position, then starts its loops.
   */
  constructor() {
    super().loadImage("img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.speed = 0.5 + Math.random() * 1;
    const randomX = 800 + Math.random() * 2000;
    this.x = Math.round(randomX / 150) * 150;
    this.animate();
  }

  /**
   * Starts the animation and movement loops (clears old ones first).
   */
  animate() {
    if (this.chickenAnimationLoop) clearInterval(this.chickenAnimationLoop);
    if (this.chickenMovementLoop) clearInterval(this.chickenMovementLoop);
    this.startChickenAnimationLoop();
    this.startChickenMovementLoop();
  }

  /**
   * Plays walking animation, or dead image once when defeated.
   */
  startChickenAnimationLoop() {
    this.chickenAnimationLoop = setInterval(() => {
      if (this.isDead()) return this.playDeadOnce();
      this.playAnimation(this.IMAGES_WALKING);
    }, 150);
  }

  /**
   * Moves continuously while alive.
   */
  startChickenMovementLoop() {
    this.chickenMovementLoop = setInterval(() => {
      if (!this.isDead()) this.checkCharacterDirection();
    }, 1000 / 60);
  }

  /**
   * Sets movement direction based on character position (fallback: move left).
   */
  checkCharacterDirection() {
    if (!this.character) { this.moveLeft(); this.otherDirection = false; return; }
    if (this.character.x > this.x + 10) { this.moveRight(); this.otherDirection = true; return; }
    if (this.character.x < this.x - 10) { this.moveLeft(); this.otherDirection = false; }
  }

  /**
   * Plays the dead sprite once (prevents re-playing every frame).
   */
  playDeadOnce() {
    if (this.isDeadAnimationPlayed) return;
    this.playAnimation(this.IMAGE_DEAD);
    this.isDeadAnimationPlayed = true;
  }

  /**
   * Stops gravity and clears chicken-specific loops.
   */
  stopAllLoops() {
    super.stopAllLoops();
    if (this.chickenAnimationLoop) { clearInterval(this.chickenAnimationLoop); this.chickenAnimationLoop = null; }
    if (this.chickenMovementLoop) { clearInterval(this.chickenMovementLoop); this.chickenMovementLoop = null; }
  }

  /**
   * Restarts loops if the chicken is still alive.
   */
  startAllLoops() {
    if (!this.isDead()) this.animate();
  }
}
