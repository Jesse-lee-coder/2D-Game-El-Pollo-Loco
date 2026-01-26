/**
 * Base class for all drawable objects.
 * Handles image loading, caching and drawing on the canvas.
 */
class DrawableObject {
  /** @type {number} */ height = 150;
  /** @type {number} */ width = 100;
  /** @type {number} */ x = 120;
  /** @type {number} */ y = 280;

  /** @type {HTMLImageElement} */ img;
  /** @type {Object<string, HTMLImageElement>} */ imageCache = {};
  /** @type {number} */ currentImage = 0;

  /**
   * Loads a single image and sets it as the current image.
   * @param {string} path Image file path.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads multiple images and stores them in the image cache.
   * @param {string[]} arr Array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx
   */
draw(ctx) {
  if (!this.img) return;              
  if (!this.img.complete) return;   
  ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
}

}
