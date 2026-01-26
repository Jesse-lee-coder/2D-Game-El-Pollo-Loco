/**
 * Handles the death state of the character.
 * Plays death animation and triggers the losing screen.
 * @param {Character} character
 * @returns {boolean} True if death was handled.
 */
function handleCharacterDeath(character) {
  if (!character.isDead()) return false;

  character.playAnimation(character.IMAGES_DEAD);

  if (character.currentImage % character.IMAGES_DEAD.length === 0) {
    freezeOnLastFrame(character, character.IMAGES_DEAD);
  }

  if (!isGameFinish) { character_death.volume = character_death_volume; safePlay(character_death); }

  character.stopAllLoops();
  setTimeout(handleLosingScreen, 1300);
  return true;
}

/**
 * Freezes an object on the last frame of an animation.
 * Prevents the image from disappearing after the animation ends.
 *
 * @param {DrawableObject} obj The animated object.
 * @param {string[]} images The animation image list.
 */
function freezeOnLastFrame(obj, images) {
  const last = images[images.length - 1];
  obj.img = obj.imageCache[last];
}

/**
 * Handles the hurt state of the character.
 * Plays hurt animation and sound once per hurt phase.
 * @param {Character} character
 * @returns {boolean} True if hurt was handled.
 */
function handleCharacterHurt(character) {
  if (!character.isHurt()) {
    character._hurtSoundPlayed = false;
    return false;}

  character.playAnimation(character.IMAGES_HURT);

  if (!character._hurtSoundPlayed && !isGameFinish) {
    character_hurt.currentTime = 0;
    safePlay(character_hurt);
    character._hurtSoundPlayed = true;}
  character.lastInputTime = Date.now();
  return true;
}

/**
 * Updates the jump animation while the character is in the air.
 * @param {Character} character
 * @returns {boolean} True if jump animation was processed.
 */
function updateJumpAnimation(character) {
  if (!character.isAboveGround()) {
    character.lastJumpFrameTime = 0;
    return false;}

  if (!character.isDead() && !character.isHurt()) {
    if (!character.lastJumpFrameTime || Date.now() - character.lastJumpFrameTime > 70) {
      character.playAnimation(character.IMAGES_JUMPING);
      character.lastJumpFrameTime = Date.now();
    }
  }
  return true;
}

/**
 * Updates walking animation when moving left or right.
 * @param {Character} character
 */
function updateWalkAnimation(character) {
  if (!world || !world.keyboard) return;
  if (world.keyboard.RIGHT || world.keyboard.LEFT) {
    character.playAnimation(character.IMAGES_WALKING);
  }
}

/**
 * Handles bottle throwing with cooldown and inventory check.
 * @param {Character} character
 */
function processBottleThrow(character) {
  if (!world || !world.keyboard || !world.keyboard.D) return;

  const now = Date.now();
  const canThrow =
    now - character.lastThrow >= character.throwWaitTime &&
    character.collectBottles.length > 0;

  if (canThrow) character.executeBottleThrow(now);
}
