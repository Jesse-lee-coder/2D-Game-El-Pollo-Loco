/**
 * Small chicken enemy.
 * Moves continuously to the left and performs periodic jumps.
 */
class SmallChicken extends MovableObject {
  /** @type {number} */ groundY = 375;
  /** @type {number} */ speed = 0.85;
  /** @type {number} */ height = 50;
  /** @type {number} */ width = 70;

  /** @type {number} */ runDistanceUntilJump = 80 + Math.random() * 320;
  /** @type {number} */ distanceLastJump = 0;

  /** @type {number|null} */ smallChickenAnimationLoop;
  /** @type {number|null} */ smallChickenDeadAnimationLoop;

  /** @type {{top:number,left:number,right:number,bottom:number}} */
  offset = { top: -10, left: 10, right: 10, bottom: 5 };

  /** @type {string[]} */
  IMAGES_WALKING = [
    "img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /** @type {string[]} */
  IMAGE_DEAD = ["img/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Creates a small chicken with random speed and position.
   */
  constructor() {
    super().loadImage("img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.applyGravity();

    const randomX = 900 + Math.random() * 2100;
    this.x = Math.round(randomX / 150) * 150;
    this.speed = 0.85 + Math.random() * 1.1;
    this.animate();
  }

  /**
   * Starts animation loops for movement and death handling.
   */
  animate() {
    this.startSmallChickenAnimationLoop();
    this.startSmallChickenDeadAnimationLoop();
  }

  /**
   * Controls movement and jumping behavior.
   */
  startSmallChickenAnimationLoop() {
    this.smallChickenAnimationLoop = setInterval(() => {
      if (this.isDead()) return;

      this.moveLeft();

      if (!this.isAboveGround()) this.distanceLastJump += this.speed;
      else this.distanceLastJump = 0;

      if (!this.isAboveGround() && this.speedY === 0 && this.distanceLastJump > this.runDistanceUntilJump) {
        this.smallChickenJump();
        this.distanceLastJump = 0;
      }
    }, 1000 / 60);
  }

  /**
   * Plays walking animation or dead image.
   */
  startSmallChickenDeadAnimationLoop() {
    this.smallChickenDeadAnimationLoop = setInterval(() => {
      if (this.isDead()) {
        if (!this.isDeadAnimationPlayed) {
          this.playAnimation(this.IMAGE_DEAD);
          this.isDeadAnimationPlayed = true;
        }
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 150);
  }

  /**
   * Stops all small chicken related loops.
   */
  stopAllLoops() {
    super.stopAllLoops();
    if (this.smallChickenAnimationLoop) {
      clearInterval(this.smallChickenAnimationLoop);
      this.smallChickenAnimationLoop = null;
    }
    if (this.smallChickenDeadAnimationLoop) {
      clearInterval(this.smallChickenDeadAnimationLoop);
      this.smallChickenDeadAnimationLoop = null;
    }
  }

  /**
   * Restarts loops if the small chicken is still alive.
   */
  startAllLoops() {
    if (!this.isDead()) {
      super.startAllLoops();
      this.animate();
    }
  }
}
