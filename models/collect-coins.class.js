/**
 * Collectable coin object.
 * Plays a spinning animation and floats up and down.
 */
class CollectCoins extends MovableObject {
  /** @type {number} */ height = 130;
  /** @type {number} */ width = 130;
  /** @type {number} */ x = 300;
  /** @type {number} */ y = 250;

  /** @type {number} */ initialY;
  /** @type {number} */ animationDirection = 1;
  /** @type {number} */ animationSpeedY = 0.8;
  /** @type {number} */ animationRangeY = 12;

  /** @type {number|null} */ coinsAnimationLoop;
  /** @type {number|null} */ coinsFloatingLoop;

  /** @type {{top:number,left:number,right:number,bottom:number}} */
  offset = { top: 47, left: 47, right: 48, bottom: 47 };

  /** @type {string[]} */
  IMAGES_COINS = [
    "img/img/8_coin/coin_1.png",
    "img/img/8_coin/coin_2.png",
  ];

  /**
   * Creates a coin at a random position and starts its animations.
   */
  constructor() {
    super().loadImage("img/img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COINS);

    const randomX = 300 + Math.random() * 2100;
    this.x = Math.round(randomX / 40) * 40;

    const randomY = 110 + Math.random() * 210;
    this.y = Math.round(randomY / 20) * 20;

    this.initialY = this.y;
    this.animateFloatingEffect();
  }

  /**
   * Starts coin animation and floating movement.
   */
  animateFloatingEffect() {
    this.coinsAnimationLoop = setInterval(() => {
      this.playAnimation(this.IMAGES_COINS);
    }, 400);

    this.updateFloating();
  }

  /**
   * Updates vertical floating movement.
   */
  updateFloating() {
    this.coinsFloatingLoop = setInterval(() => {
      if (this.animationDirection === 1) {
        this.y -= this.animationSpeedY;
        if (this.y <= this.initialY - this.animationRangeY) this.animationDirection = -1;
      } else {
        this.y += this.animationSpeedY;
        if (this.y >= this.initialY + this.animationRangeY) this.animationDirection = 1;
      }
    }, 1000 / 60);
  }

  /**
   * Stops all coin-related animation loops.
   */
  stopAllLoops() {
    if (this.coinsAnimationLoop) { clearInterval(this.coinsAnimationLoop); this.coinsAnimationLoop = null; }
    if (this.coinsFloatingLoop) { clearInterval(this.coinsFloatingLoop); this.coinsFloatingLoop = null; }
  }

  /**
   * Restarts coin animations.
   */
  startAllLoops() {
    this.animateFloatingEffect();
  }
}
