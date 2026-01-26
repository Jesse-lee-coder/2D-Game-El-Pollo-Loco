/**
 * Collectable bottle object.
 * Can be picked up by the character and used as a throwable item.
 */
class CollectBottle extends MovableObject {
  /** @type {number} */ x = 300;
  /** @type {number} */ y = 290;

  /** @type {{top:number,left:number,right:number,bottom:number}} */
  offset = { top: 30, left: 30, right: 27, bottom: 25 };

  /**
   * Creates a collectable bottle at a random x-position.
   * @param {string} path Image path of the bottle.
   */
  constructor(path) {
    super().loadImage(path);
    this.x = 400 + Math.random() * 2000;
  }
}
