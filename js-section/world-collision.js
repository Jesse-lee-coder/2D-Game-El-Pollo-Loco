/**
 * Checks collisions between character/enemies and bottles/enemies.
 * Skips all checks when the game is paused or finished.
 */
function checkCollisions() {
  if (isGameFinish || isGamePaused) return;

  world.level.enemies.forEach((enemy) => {
    if (world.character.isColliding(enemy)) checkCharacterEnemyCollision(enemy);
  });

  checkBottleCollisions();
}

/**
 * Checks collisions for each thrown bottle against enemies.
 */
function checkBottleCollisions() {
  if (isGameFinish || isGamePaused) return;

  world.character.bottles.forEach((bottle) => {
    world.bottleHitObject = false;
    checkBottleEnemyCollisions(bottle);
  });
}

/**
 * Resolves collision between character and one enemy.
 * @param {MovableObject} enemy
 */
function checkCharacterEnemyCollision(enemy) {
  if (isGameFinish || isGamePaused) return;

  const stomp =
    world.character.isAboveGround() &&
    world.character.speedY < 0 &&
    !enemy.isDead() &&
    world.character.canStomp;

  if (stomp) return resolveJumpAttack(enemy);
  if (!enemy.isDead() && !world.character.isHurt() && !world.character.isInvulnerable) {
    world.character.hit(enemy);
  }
}

/**
 * Handles a jump attack depending on the enemy type.
 * @param {MovableObject} enemy
 */
function resolveJumpAttack(enemy) {
  if (enemy instanceof Chicken || enemy instanceof SmallChicken) return defeatChickenByJump(enemy);
  if (enemy instanceof Endboss) damageEndbossByJump(enemy);
}

/**
 * Defeats a chicken by jumping on it.
 * @param {Chicken|SmallChicken} chicken
 */
function defeatChickenByJump(chicken) {
  chicken.energy = 0;
  chicken.isDeadAnimationPlayed = false;
  playEnemyStompSound();
  world.character.bounce(chicken);
  world.removeEnemyAfterTime(chicken, 500);
}

/**
 * Damages the endboss by jumping on it.
 * @param {Endboss} endboss
 */
function damageEndbossByJump(endboss) {
  world.endboss.takeJumpDamage();
  endboss.isDeadAnimationPlayed = false;
  playBouncingSound();
  world.character.bounce(endboss);
}

/**
 * Checks bottle collision against all enemies and triggers splash once.
 * @param {ThrowableObject} bottle
 */
function checkBottleEnemyCollisions(bottle) {
  if (!bottle || bottle.isSplashing || bottle.hasHit) return;

  world.level.enemies.forEach((enemy, enemyIndex) => {
    if (!bottle.isColliding(enemy) || enemy.isDead()) return;
    bottle.hasHit = true;
    resolveBottleHitEnemy(enemy, enemyIndex);

    if (typeof bottle.triggerSplashAndRemove === "function") {
      bottle.triggerSplashAndRemove();
    }
  });
}

/**
 * Resolves a bottle hit depending on enemy type.
 * @param {MovableObject} enemy
 * @param {number} enemyIndex
 */
function resolveBottleHitEnemy(enemy, enemyIndex) {
  if (enemy instanceof Chicken || enemy instanceof SmallChicken) return defeatChickenByBottle(enemy, enemyIndex);
  if (enemy instanceof Endboss) { damageEndbossByBottle(); world.bottleHitObject = true; }
}

/**
 * Damages the endboss when hit by a bottle.
 */
function damageEndbossByBottle() {
  world.endboss.hit();
  world.endboss.playAnimation(world.endboss.IMAGES_HURT);
}

/**
 * Defeats a chicken when hit by a bottle.
 * @param {Chicken|SmallChicken} chicken
 * @param {number} enemyIndex
 */
function defeatChickenByBottle(chicken, enemyIndex) {
  chicken.energy = 0;
  chicken.isDeadAnimationPlayed = false;
  playChickenDeathSound();
  world.removeEnemyAfterTime(chicken, 500, enemyIndex);
  world.bottleHitObject = true;
}
