/**
 * Displays a status bar for health, coins, bottles or the endboss.
 * Updates the displayed image based on a percentage value.
 */
class StatusBar extends DrawableObject {
  /** @type {number} */ x = 10;
  /** @type {number} */ y = 0;
  /** @type {number} */ width = 200;
  /** @type {number} */ height = 60;

  /** @type {'health'|'coins'|'bottle'|'endboss'} */
  statusbarType;

  /** @type {number} */ percentage = 100;

  /** @type {string[]} */
  STATUSBAR_HEALTH = [
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /** @type {string[]} */
  STATUSBAR_COIN = [
    "img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
    "img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
    "img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
    "img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
    "img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
    "img/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png",
  ];

  /** @type {string[]} */
  STATUSBAR_BOTTLE = [
    "img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  /** @type {string[]} */
  STATUSBAR_ENDBOSS = [
    "img/img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  /**
   * Creates a new status bar.
   * @param {'health'|'coins'|'bottle'|'endboss'} statusbarType
   */
  constructor(statusbarType) {
    super();
    this.statusbarType = statusbarType;
    this.loadImages(this.getStatusbarImage());
    this.setPositionByStatusbarType();
    this.setStatusbarHealthPercentage();
  }

  /**
   * Sets the initial percentage depending on the status bar type.
   */
  setStatusbarHealthPercentage() {
    if (this.statusbarType === "health" || this.statusbarType === "endboss") {
      this.setPercentage(100);
    } else {
      this.setPercentage(0);
    }
  }

  /**
   * Sets the position of the status bar based on its type.
   */
  setPositionByStatusbarType() {
    if (this.statusbarType === "health") this.y = 0;
    else if (this.statusbarType === "coins") this.y = 50;
    else if (this.statusbarType === "bottle") this.y = 100;
    else if (this.statusbarType === "endboss") {
      this.y = 8;
      this.x = 500;
    }
  }

  /**
   * Returns the correct image set for the status bar type.
   * @returns {string[]}
   */
  getStatusbarImage() {
    if (this.statusbarType === "health") return this.STATUSBAR_HEALTH;
    if (this.statusbarType === "coins") return this.STATUSBAR_COIN;
    if (this.statusbarType === "bottle") return this.STATUSBAR_BOTTLE;
    if (this.statusbarType === "endboss") return this.STATUSBAR_ENDBOSS;
  }

  /**
   * Updates the status bar image based on the given percentage.
   * @param {number} percentage
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const images = this.getStatusbarImage();
    const path = images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the correct image index based on percentage.
   * @returns {number}
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    if (this.percentage > 0) return 1;
    return 0;
  }
}
