/* =========================
   Game globals
   ========================= */

/** @type {HTMLCanvasElement|null} */
let canvas = null;
/** @type {World|null} */
let world = null;
/** @type {Keyboard} */
let keyboard = new Keyboard();

/** @type {boolean} True if the game is paused. */
let isGamePaused = false;
/** @type {boolean} True if the game is finished (win/lose). */
let isGameFinish = false;

/* =========================
   Audio paths
   ========================= */

const PATH_CHARACTER_BOUNCING = "audio/character-bouncing.mp3";
const PATH_ENEMY_STOMP_SOUND = "audio/enemy-stomp-sound.mp3";
const PATH_CHICKEN_DEATH = "audio/chicken-dead.mp3";
const PATH_ENDBOSS_HURT = "audio/endboss-hurt.mp3";
const PATH_COLLECT_BOTTLE = "audio/collect-bottle.mp3";
const PATH_COLLECT_COIN = "audio/collect-coin.mp3";

/* =========================
   Audio instances
   ========================= */

let character_walking = new Audio("audio/character-walking.mp3");
let character_snoring = new Audio("audio/character-snoring.mp3");
let character_death = new Audio("audio/character-death.mp3");
let character_jump = new Audio("audio/character_jump.ogg");
let character_hurt = new Audio("audio/character-hurt.mp3");

let bottle_break = new Audio("audio/bottle-break.mp3");

let endboss_music = new Audio("audio/endboss-music.mp3");
let endboss_noise = new Audio("audio/endboss-noise.mp3");
let endboss_alert = new Audio("audio/endboss_alert.mp3");
let endboss_hit = new Audio("audio/endboss-hit.mp3");
let endboss_death = new Audio("audio/endboss-death.mp3");

let game_music = new Audio("audio/game-music.mp3");
let winning_audio = new Audio("audio/winning-audio.mp3");
let losing_audio = new Audio("audio/losing-audio.mp3");

/** @type {HTMLAudioElement[]} */
const allGameSounds = [
  character_walking, character_snoring, character_death, character_jump,
  character_hurt, bottle_break, endboss_music, endboss_noise,
  endboss_alert, endboss_hit, endboss_death, game_music,
  winning_audio, losing_audio,
];

/** @type {HTMLAudioElement[]} */
const endGameSounds = [
  character_walking, character_snoring, character_death, character_jump,
  character_hurt, bottle_break, endboss_music, endboss_noise,
  endboss_alert, endboss_hit, endboss_death, game_music,
];

/* =========================
   Volumes
   ========================= */

let collect_bottle_volume = 1;
let collect_coin_volume = 0.7;
let character_bouncing_volume = 0.5;
let character_snoring_volume = 1;
let chicken_death_volume = 1;
let character_death_volume = 0.3;
let endboss_noise_volume = 0.3;
let endboss_death_volume = 0.5;
let bottle_break_volume = 0.5;
let enemy_stomp_volume = 0.5;
let game_music_volume_low = 0.03;
let game_music_volume_high = 0.1;
let winning_volume = 0.5;
let losing_volume = 0.5;

/* =========================
   Small helpers
   ========================= */

/**
 * Plays audio safely. Logs the real error once instead of hiding it.
 * @param {HTMLAudioElement} audioElement
 */
function safePlay(audioElement) {
  if (!audioElement || (typeof isMuted !== "undefined" && isMuted) || isGamePaused) return;
  try {
    const p = audioElement.play();
    audioElement._playPromise = p;
    if (p && typeof p.catch === "function") {
      p.catch((err) => {
        if (err && (err.name === "AbortError" || err.name === "NotAllowedError")) return;
        console.error("Audio play failed:", audioElement.src, err);
      });
    }
  } catch (_) {}
}


/**
 * Pauses an audio element safely.
 * Waits for a running play() call to finish
 * to prevent browser play/pause warnings.
 *
 * @param {HTMLAudioElement|null} audio The audio element to pause.
 */
function safePause(audio) {
  if (!audio) return;
  const p = audio._playPromise;
  if (p && typeof p.finally === "function") {
    p.finally(() => { if (!audio.paused) audio.pause(); });
  } else {
    if (!audio.paused) audio.pause();
  }
}

/* =========================
   Init / world start
   ========================= */

/** Initializes canvas, resets world, prepares the level and starts the game world. */
function init() {
  canvas = /** @type {HTMLCanvasElement|null} */ (document.getElementById("canvas"));
  if (!canvas) return console.error("Canvas not found!");
  resetWorldAndCanvas();
  if (!prepareLevel()) return;
  startWorld();
}

/** Clears the canvas and stops old world loops if available. */
function resetWorldAndCanvas() {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (typeof stopAllLoops === "function") stopAllLoops();
}

/** @returns {boolean} True if setupLevel exists and was executed. */
function prepareLevel() {
  if (typeof setupLevel !== "function") return false;
  setupLevel();
  return true;
}

/** Creates a new world instance and starts background music. */
function startWorld() {
  if (!canvas) return;
  world = new World(canvas, keyboard);
}

/* =========================
   Pause / resume
   ========================= */

/** Toggles pause state, loops and audio, and updates the pause icon. */
function toggleGamePause() {
  const icon = /** @type {HTMLImageElement|null} */ (document.getElementById("game_pause_box_img_play"));
  if (!icon) return;
  isGamePaused = !isGamePaused;

  if (isGamePaused) stopAndShowPlayIcon(icon);
  else startAndShowPauseIcon(icon);
}

/** @param {HTMLImageElement} icon */
function stopAndShowPlayIcon(icon) {
  if (typeof stopAllLoops === "function") stopAllLoops();
  pauseAllAudio();
  icon.src = "icons/play-icon.png";
  icon.title = "Resume";
}

/** @param {HTMLImageElement} icon */
function startAndShowPauseIcon(icon) {
  if (typeof startAllLoops === "function") startAllLoops();
  resumeAllAudio();
  icon.src = "icons/pause-icon.png";
  icon.title = "Pause";
}

/** Resumes music depending on endboss state and mute/finish flags. */
function resumeAllAudio() {
  if (isGameFinish || typeof isMuted !== "undefined" && isMuted) return;
  const bossActive = !!(world && world.endboss && world.endboss.isEndbossActive);
  if (bossActive && endboss_music.paused && !endboss_music.muted) safePlay(endboss_music);
  if (!bossActive && game_music.paused && !game_music.muted) safePlay(game_music);
}

/* =========================
   End screens
   ========================= */

/** Shows the winning screen with sound. */
function handleWinningScreen() {
  if (typeof setMobileNavVisible === "function") setMobileNavVisible(false);
  showEndScreen("overlay_winning", winning_audio, winning_volume);
}

/** Shows the losing screen with sound. */
function handleLosingScreen() {
  if (typeof setMobileNavVisible === "function") setMobileNavVisible(false);
  showEndScreen("overlay_game_over", losing_audio, losing_volume);
}

/**
 * Shows an end overlay and plays the end sound.
 * @param {string} overlayId
 * @param {HTMLAudioElement} audio
 * @param {number} volume
 */
function showEndScreen(overlayId, audio, volume) {
  if (document.fullscreenElement && typeof exitFullscreen === "function") exitFullscreen();

  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  isGameFinish = true;
  stopGameForEndScreen(audio);


  if (audio) { audio.currentTime = 0; audio.volume = volume; safePlay(audio); }

  overlay.classList.remove("d-none");
  overlay.classList.add("d-flex");
}

/**
 * Stops game loops and audio before showing an end screen.
 */
function stopGameForEndScreen(endSound) {
  if (typeof stopAllLoops === "function") stopAllLoops();
  if (typeof pauseAllAudio === "function") pauseAllAudio([endSound]);
  if (typeof pauseSpecificAudio === "function") pauseSpecificAudio();
}
