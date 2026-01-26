/**
 * Main game world.
 * Holds level objects, runs the game loop and draws everything on the canvas.
 */
class World {
  /** @type {Character} */ character = new Character();
  /** @type {Endboss} */ endboss;
  /** @type {MovableObject} */ movableObject = new MovableObject();
  /** @type {Level} */ level = level1;

  /** @type {HTMLCanvasElement} */ canvas;
  /** @type {CanvasRenderingContext2D} */ ctx;
  /** @type {Keyboard} */ keyboard;
  /** @type {number} */ camera_x = 0;

  /** @type {StatusBar} */ statusBarHealth = new StatusBar("health");
  /** @type {StatusBar} */ statusBarCoins = new StatusBar("coins");
  /** @type {StatusBar} */ statusBarBottles = new StatusBar("bottle");
  /** @type {StatusBar} */ statusBarEndboss = new StatusBar("endboss");

  /** @type {boolean} */ displayEndbossStatusBar = false;
  /** @type {boolean} */ bottleHitObject = false;

  /** @type {number} */ totalAmountOfCoins;
  /** @type {number} */ totalAmountOfBottles;

  /** @type {number|null} */ gameLoop;

  /**
   * Creates a new world instance and starts rendering + the game loop.
   * @param {HTMLCanvasElement} canvas
   * @param {Keyboard} keyboard
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.totalAmountOfBottles = this.level.bottles.length;
    this.totalAmountOfCoins = this.level.coins.length;
    this.draw();
    this.startGameLoop();
  }

  /**
   * Connects world references and finds the endboss in the enemy list.
   */
  setWorld() {
    this.character.world = this;
    this.endboss = this.level.enemies.find((e) => e instanceof Endboss);

    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      if (enemy instanceof Chicken || enemy instanceof SmallChicken || enemy instanceof Endboss) {
        enemy.character = this.character;
      }
    });
  }

  /**
   * Starts the main world logic loop (collisions, collecting items, UI).
   */
  startGameLoop() {
    this.gameLoop = setInterval(() => {
      checkCollisions();
      this.handleItemCollection(this.level.bottles, this.character.collectBottles, PATH_COLLECT_BOTTLE, collect_bottle_volume, 700);
      this.handleItemCollection(this.level.coins, this.character.collectCoins, PATH_COLLECT_COIN, collect_coin_volume, 500);
      this.updateStatusBars();
    }, 20);
  }

  /**
   * Updates all status bars based on current values.
   */
  updateStatusBars() {
    this.statusBarHealth.setPercentage(this.character.characterLifePoints);
    if (this.endboss) this.statusBarEndboss.setPercentage(this.endboss.endbossLifePoints);

    this.updateStatusBarProgress(this.totalAmountOfBottles, this.character.collectBottles, this.statusBarBottles);
    this.updateStatusBarProgress(this.totalAmountOfCoins, this.character.collectCoins, this.statusBarCoins);
  }

  /**
   * Updates a progress status bar based on collected items.
   * @param {number} totalItemsAmount
   * @param {any[]} collectedItems
   * @param {StatusBar} statusBar
   */
  updateStatusBarProgress(totalItemsAmount, collectedItems, statusBar) {
    if (totalItemsAmount <= 0) return;
    const percentage = (collectedItems.length / totalItemsAmount) * 100;
    statusBar.setPercentage(percentage);
  }

  /**
   * Collects items if the character collides with them and plays a pickup sound.
   * @param {any[]} worldItems
   * @param {any[]} collectedItems
   * @param {string} audioPath
   * @param {number} volume
   * @param {number} durationMs
   */
  handleItemCollection(worldItems, collectedItems, audioPath, volume, durationMs) {
    worldItems.forEach((item, index) => {
      if (!this.character.isColliding(item)) return;
      collectedItems.push(item);
      worldItems.splice(index, 1);
      playPickupSound(audioPath, volume, durationMs);
    });
  }

  /**
   * Removes an enemy after a delay (by object or explicit index).
   * @param {any} removeEnemy
   * @param {number} timeMs
   * @param {number} indexToRemove
   */
  removeEnemyAfterTime(removeEnemy, timeMs, indexToRemove = -1) {
    setTimeout(() => {
      const idx = indexToRemove !== -1 ? indexToRemove : this.level.enemies.indexOf(removeEnemy);
      if (idx > -1) this.level.enemies.splice(idx, 1);
    }, timeMs);
  }

  /**
   * Removes a thrown bottle from the character bottle list.
   * @param {number} bottleIndex
   */
  removeBottle(bottleIndex) {
    this.character.bottles.splice(bottleIndex, 1);
  }

  /**
   * Render loop: draws background, UI and game objects.
   */
draw() {
  try {
    this.drawBackgroundLayer();
    this.drawUILayer();
    this.drawGameLayer();
  } catch (err) {
    console.error("World.draw() failed:", err);
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    return; 
  }

  requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws background objects and clouds with camera translation.
   */
  drawBackgroundLayer() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws UI elements (status bars).
   */
  drawUILayer() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    if (this.displayEndbossStatusBar) this.addToMap(this.statusBarEndboss);
  }

  /**
   * Draws coins, character, enemies and bottles with camera translation.
   */
  drawGameLayer() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.coins);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.character.bottles);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws an array of drawable objects.
   * @param {any[]} objects
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Draws one object and flips it if it faces the other direction.
   * @param {any} mo
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips the drawing context to render an object mirrored.
   * @param {any} mo
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the context after flipping.
   * @param {any} mo
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
