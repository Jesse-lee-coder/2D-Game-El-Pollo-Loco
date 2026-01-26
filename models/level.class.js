/**
 * Represents a game level.
 * Holds all objects that belong to a specific level.
 */
class Level {
  /** @type {any[]} */ enemies;
  /** @type {any[]} */ clouds;
  /** @type {any[]} */ backgroundObjects;
  /** @type {any[]} */ bottles;
  /** @type {any[]} */ coins;

  /** @type {number} */ level_end_x = 3600;

  /**
   * Creates a new level with all required game objects.
   * @param {any[]} enemies All enemy objects.
   * @param {any[]} clouds Background cloud objects.
   * @param {any[]} backgroundObjects Background layers.
   * @param {any[]} bottles Collectable bottles.
   * @param {any[]} coins Collectable coins.
   */
  constructor(enemies, clouds, backgroundObjects, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles;
    this.coins = coins;
  }
}
