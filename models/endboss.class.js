/**
 * Final boss enemy.
 * Controls movement, attack behavior, sounds and win condition.
 */
class Endboss extends MovableObject {
  /** @type {Character} */ character;

  /** @type {number} */ height = 400;
  /** @type {number} */ width = 250;
  /** @type {number} */ y = 55;
  /** @type {number} */ speed = 3.5;

  /** @type {number} */ endbossLifePoints = 100;
  /** @type {boolean} */ isEndbossActive = false;

  /** @type {number|null} */ endbossAnimationLoop;
  /** @type {number|null} */ endbossMovementLoop;

  /** @type {{top:number,left:number,right:number,bottom:number}} */
  offset = { top: 70, left: 5, right: 0, bottom: 10 };

  /** @type {string[]} */
  IMAGES_WALKING = [
    "img/img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /** @type {string[]} */
  IMAGES_ALERT = [
    "img/img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /** @type {string[]} */
  IMAGES_ATTACK = [
    "img/img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /** @type {string[]} */
  IMAGES_HURT = [
    "img/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** @type {string[]} */
  IMAGES_DEAD = [
    "img/img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Creates the endboss and starts its animation and movement loops.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.animate();
  }

  /**
   * Starts animation and movement loops (clears old ones first).
   */
  animate() {
    if (this.endbossAnimationLoop) clearInterval(this.endbossAnimationLoop);
    if (this.endbossMovementLoop) clearInterval(this.endbossMovementLoop);
    this.startEndbossAnimationLoop();
    this.startEndbossMovementLoop();
  }

  /**
   * Controls animation state (alert, walk, attack, hurt, dead).
   */
  startEndbossAnimationLoop() {
    this.endbossAnimationLoop = setInterval(() => {
      if (this.isDead()) return this.handleEndbossDeadState();

      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        this.playEndbossHurtSound();
      } else if (this.hasDetectedCharacter) {
        this.manageAttackOrWalkBehavior();
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 250);
  }

  /**
   * Controls endboss movement and activation.
   */
  startEndbossMovementLoop() {
    this.endbossMovementLoop = setInterval(() => {
      if (this.isDead()) return;
      this.handleEndbossActivation();
      this.handleFirstContact();
    }, 1000 / 60);
  }

  /**
   * Activates the endboss when the player gets close or damages it.
   */
  handleEndbossActivation() {
    if (this.isEndbossActive || !this.world || !this.world.character) return;
    if (this.endbossLifePoints <= 75 || this.world.character.x > 2000) {
      this.world.displayEndbossStatusBar = true;
      this.hasDetectedCharacter = true;
      this.isEndbossActive = true;
      this.startEndbossMusic();
      this.playEndbossAlertSound();
    }
  }

  /**
   * Moves towards the character after detection.
   */
  handleFirstContact() {
    if (!this.hasDetectedCharacter) return;

    if (this.world.character.x < this.x - 50) {
      this.moveLeft();
      this.otherDirection = false;
    } else if (this.world.character.x > this.x + 50) {
      this.moveRight();
      this.otherDirection = true;
    }
  }

  /**
   * Switches between attack and walking animations.
   */
  manageAttackOrWalkBehavior() {
    if (this.character && Math.abs(this.character.x - this.x) < 200) {
      this.playAnimation(this.IMAGES_ATTACK);
      if (!this.attackSoundActive) this.playEndbossAttackSound();
    } else {
      this.playAnimation(this.IMAGES_WALKING);
      if (this.attackSoundActive) {
        safePause(endboss_noise);
        endboss_noise.currentTime = 0;
        this.attackSoundActive = false;
      }
    }
  }

  /**
   * Plays death animation once and triggers win screen.
   */
  handleEndbossDeadState() {
    if (this.isDeadAnimationPlayed) return;
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      this.isDeadAnimationPlayed = true;
      this.onEndbossDeath();
    }, 100);
  }

  /**
   * Starts endboss background music.
   */
  startEndbossMusic() {
    if (isMuted) return;
    safePause(game_music);
    game_music.currentTime = 0;
    endboss_music.volume = endboss_noise_volume;
    safePlay(endboss_music);

  }

  /**
   * Plays alert sound when endboss is activated.
   */
  playEndbossAlertSound() {
    if (isMuted) return;
    endboss_alert.currentTime = 0;
    safePlay(endboss_alert);
    setTimeout(() => {
      safePause(endboss_alert);
      endboss_alert.currentTime = 0;
    }, 1200);
  }

  /**
   * Plays hurt sound when endboss takes damage.
   */
  playEndbossHurtSound() {
    if (isMuted) return;
    const hit = new Audio(PATH_ENDBOSS_HURT);
    hit.volume = enemy_stomp_volume;
    safePlay(hit);
    setTimeout(() => {
      safePause(hit);
      hit.currentTime = 0;
    }, 1000);
  }

  /**
   * Plays attack sound while the endboss is attacking.
   */
  playEndbossAttackSound() {
    if (!isMuted) {
      endboss_noise.currentTime = 0;
      endboss_noise.volume = endboss_noise_volume;
      safePlay(endboss_noise);
    }
    this.attackSoundActive = true;
  }

  /**
   * Handles endboss death: stops loops, plays sound and shows win screen.
   */
  onEndbossDeath() {
    this.stopAllLoops();

    if (!isMuted) {
      endboss_death.currentTime = 0;
      endboss_death.volume = endboss_death_volume;
      safePlay(endboss_death);
    }

    setTimeout(() => handleWinningScreen(), 1300);
  }

  /**
   * Stops all endboss loops.
   */
  stopAllLoops() {
    if (this.endbossAnimationLoop) clearInterval(this.endbossAnimationLoop);
    if (this.endbossMovementLoop) clearInterval(this.endbossMovementLoop);
    this.endbossAnimationLoop = null;
    this.endbossMovementLoop = null;
  }

  /**
   * Resets all endboss-related audio tracks.
   */
  resetAudio() {
    [endboss_death, endboss_music, endboss_noise, endboss_alert].forEach((a) => {
      safePause(a);
      a.currentTime = 0;
    });
  }

  /**
   * Restarts endboss loops if still alive.
   */
  startAllLoops() {
    if (!this.isDead()) this.animate();
  }
}
