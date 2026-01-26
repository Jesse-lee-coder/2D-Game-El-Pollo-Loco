/**
 * Base class for all movable game objects.
 * Adds gravity, collision detection, movement and damage handling.
 */
class MovableObject extends DrawableObject {
  /** @type {number} */ speed = 0.15;
  /** @type {boolean} */ otherDirection = false;
  /** @type {number} */ speedY = 0;
  /** @type {number} */ acceleration = 2.5;

  /** @type {number} */ energy = 100;
  /** @type {number} */ lastHit = 0;
  /** @type {number} */ groundY;

  /** @type {boolean} */ isDeadAnimationPlayed = false;
  /** @type {boolean} */ isInvulnerable = false;

  /** @type {number|null} */ gravityLoop;

  /** @type {{top:number,left:number,right:number,bottom:number}} */
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  /**
   * Starts gravity loop and applies ground-based gravity.
   */
  applyGravity() {
    if (this.gravityLoop) clearInterval(this.gravityLoop);
    this.gravityLoop = setInterval(() => {
      if (this.groundY !== undefined) this.applyGroundGravity();
    }, 1000 / 35);
  }

  /**
   * Applies gravity until the object reaches the ground.
   */
  applyGroundGravity() {
    if (this.y < this.groundY || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    } else {
      this.y = this.groundY;
      this.speedY = 0;
    }
  }

  /**
   * @returns {boolean} True if the object is above the ground.
   */
  isAboveGround() {
    return this.y < this.groundY;
  }

  /**
   * Checks rectangular collision with another movable object.
   * @param {MovableObject} movableObject
   * @returns {boolean}
   */
  isColliding(movableObject) {
    if (!movableObject || !movableObject.offset) return false;
    return (
      this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
      this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
      this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
      this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom
    );
  }

  /**
   * Applies damage depending on object type.
   * @param {MovableObject|null} attacker
   */
  hit(attacker = null) {
    if (this.isInvulnerable) return;

    if (this instanceof Character) this.reduceCharacterLifePoints(attacker);
    else if (this instanceof Endboss) this.reduceEndbossLifePoints();

    this.lastHit = Date.now();
  }

  /**
   * Reduces character life points depending on attacker type.
   * @param {MovableObject|null} attacker
   */
  reduceCharacterLifePoints(attacker = null) {
    let damage = 4;
    if (attacker instanceof SmallChicken) damage = 5;
    else if (attacker instanceof Chicken) damage = 10;
    else if (attacker instanceof Endboss) damage = 20;

    this.characterLifePoints -= damage;
    if (this.characterLifePoints < 0) this.characterLifePoints = 0;
  }

  /**
   * Reduces endboss life points.
   */
  reduceEndbossLifePoints() {
    this.endbossLifePoints -= 20;
    if (this.endbossLifePoints < 0) this.endbossLifePoints = 0;
  }

  /**
   * Applies jump damage to the endboss.
   */
  takeJumpDamage() {
    if (this.isInvulnerable) return;
    this.endbossLifePoints -= 20;
    if (this.endbossLifePoints < 0) this.endbossLifePoints = 0;
    this.lastHit = Date.now();
  }

  /**
   * @returns {boolean} True if the object was hit recently.
   */
  isHurt() {
    let timePassed = Date.now() - this.lastHit;
    return timePassed / 1000 < 0.6;
  }

  /**
   * @returns {boolean} True if the object is dead.
   */
  isDead() {
    if (this.isInvulnerable) return false;
    if (this instanceof Character) return this.characterLifePoints === 0;
    if (this instanceof Endboss) return this.endbossLifePoints === 0;
    return this.energy === 0;
  }

  /**
   * Plays an animation frame from the given image list.
   * @param {string[]} images
   */
  playAnimation(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  /** Moves object to the right. */
  moveRight() {
    this.x += this.speed;
  }

  /** Moves object to the left. */
  moveLeft() {
    this.x -= this.speed;
  }

  /** Makes the object jump. */
  jump() {
    this.speedY = 30;
  }

  /** Jump used by small chickens. */
  smallChickenJump() {
    this.speedY = 24;
  }

  /**
   * Bounces the object off an enemy and applies temporary invulnerability.
   * @param {MovableObject} enemy
   */
  bounce(enemy) {
    this.isInvulnerable = true;
    this.speedY = 17;
    this.y = enemy.y - this.height + enemy.offset.top;

    //if (this instanceof Character) this.canStomp = false;

    setTimeout(() => {
      this.isInvulnerable = false;
    }, 50);
  }

  /**
   * Stops gravity loop.
   */
  stopAllLoops() {
    if (this.gravityLoop) {
      clearInterval(this.gravityLoop);
      this.gravityLoop = null;
    }
  }

  /**
   * Restarts gravity loop.
   */
  startAllLoops() {
    if (!this.gravityLoop) this.applyGravity();
  }
}
