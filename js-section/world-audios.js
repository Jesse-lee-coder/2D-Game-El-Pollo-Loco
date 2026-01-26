/**
 * Starts the main game music if sound is enabled and the game is not finished.
 */
function playGameMusic() {
  if (isMuted || isGameFinish || isGamePaused) return;
  if (!game_music.paused) return;   // verhindert Doppelstart
  game_music.volume = game_music_volume_low;
  game_music.currentTime = 0;
  safePlay(game_music);
}




/**
 * Plays a short pickup sound (e.g. bottle/coin) and stops it after a duration.
 * @param {string} path Audio file path.
 * @param {number} volume Volume (0..1).
 * @param {number} durationMs Stop after this time in ms.
 */
function playPickupSound(path, volume, durationMs) {
  if (isMuted || isGameFinish) return;
  const audio = new Audio(path);
  audio.volume = volume;
  safePlay(audio);

  setTimeout(() => {
   safePause(audio);
   audio.currentTime = 0;
 }, durationMs);
}

/**
 * Plays the character bouncing sound (very short).
 */
function playBouncingSound() {
  if (isMuted || isGameFinish) return;
  const s = new Audio(PATH_CHARACTER_BOUNCING);
  s.volume = character_bouncing_volume;
  safePlay(s);

  setTimeout(() => {
   safePause(s);
   s.currentTime = 0;
 }, 300);
}

/**
 * Plays the stomp sound when an enemy is defeated by jumping on it.
 */
function playEnemyStompSound() {
  if (isMuted || isGameFinish) return;
  const s = new Audio(PATH_ENEMY_STOMP_SOUND);
  s.volume = enemy_stomp_volume;
  safePlay(s);

  setTimeout(() => {
   safePause(s);
   s.currentTime = 0;
 }, 500);
}

/**
 * Plays the chicken death sound (short).
 */
function playChickenDeathSound() {
  if (isMuted || isGameFinish) return;
  const s = new Audio(PATH_CHICKEN_DEATH);
  s.volume = chicken_death_volume;
  safePlay(s);

  setTimeout(() => {
   safePause(s);
   s.currentTime = 0;
 }, 800);
}

/**
 * Pauses all registered game sounds (does not reset time).
 */
function pauseAllAudio(except = []) {
  if (!Array.isArray(allGameSounds)) return;
  allGameSounds.forEach((a) => {
    if (!a) return;
    if (except.includes(a)) return;
    safePause(a);
  });
}





/**
 * Pauses and resets selected background tracks (music only).
 */
function pauseSpecificAudio() {
  [game_music, endboss_music].forEach((a) => safePauseAndReset(a));
}


function safePauseAndReset(audio) {
  if (!audio) return;
  safePause(audio);
  const p = audio._playPromise;
  if (p && typeof p.finally === "function") {
    p.finally(() => { audio.currentTime = 0; });
  } else {
    audio.currentTime = 0;
  }
}





