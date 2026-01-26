/**
 * Represents a static background object in the game world.
 * Used for parallax background layers.
 */
class BackgroundObject extends MovableObject {

  /** @type {number} */
  width = 720;

  /** @type {number} */
  height = 480;

  /**
   * Creates a new background object.
   * @param {string} imagePath Path to the background image.
   * @param {number} x Horizontal position in the world.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
