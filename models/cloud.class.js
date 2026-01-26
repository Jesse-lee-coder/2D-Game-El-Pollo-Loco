/**
 * A moving cloud in the background.
 * Clouds continuously move to the left to create a parallax effect.
 */
class Cloud extends MovableObject {
  /** @type {World} */ world;

  /** @type {number} */ height = 250;
  /** @type {number} */ width = 450;
  /** @type {number} */ speed = 0.6;

  /** @type {number|null} */ animateCloudsLoop;

  /**
   * Creates a cloud at a given x-position with a small random y-offset.
   * @param {string} path Image path.
   * @param {number} x Horizontal position.
   */
  constructor(path, x) {
    super().loadImage(path);
    this.x = x;
    this.y = 10 + Math.random() * 35;
    this.animateClouds();
  }

  /**
   * Starts the cloud movement loop if not running yet.
   */
  animateClouds() {
    if (this.animateCloudsLoop) return;
    this.animateCloudsLoop = setInterval(() => this.moveLeft(), 1000 / 60);
  }

  /**
   * Stops the cloud movement loop.
   */
  stopAllLoops() {
    if (!this.animateCloudsLoop) return;
    clearInterval(this.animateCloudsLoop);
    this.animateCloudsLoop = null;
  }

  /**
   * Restarts the cloud movement loop.
   */
  startAllLoops() {
    this.animateClouds();
  }
}
