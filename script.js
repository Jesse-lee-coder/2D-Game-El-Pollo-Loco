/** @type {boolean} True if sound is muted. */
let isMuted = true;
/** @type {boolean} True if touch controls are active. */
let isTouchDeviceGlobal = false;
/** @type {boolean} True if the user has interacted (needed for reliable audio playback). */
window.userInteracted = false;

/** Marks that the user interacted at least once (audio can safely start afterwards). */
function markUserInteracted() {
  window.userInteracted = true;
}

/** Registers one-time listeners to unlock audio after the first user interaction. */
function initUserInteractionTracking() {
  document.addEventListener("pointerdown", markUserInteracted, { once: true });
  document.addEventListener("keydown", markUserInteracted, { once: true });
}
initUserInteractionTracking();

/** @param {string} id @returns {HTMLElement|null} */
function byId(id) {
  return document.getElementById(id);
}

/** @param {Element|null} el @param {boolean} show */
function setFlexVisible(el, show) {
  if (!el) return;
  el.classList.toggle("d-flex", show);
  el.classList.toggle("d-none", !show);
}

/** @param {HTMLImageElement|null} img @param {string} src */
function setImgSrc(img, src) {
  if (img) img.src = src;
}

/**
 * Shows or hides the mobile navigation.
 * Kept for compatibility because other files call this function.
 * @param {boolean} visible
 */
function setMobileNavVisible(visible) {
  const nav = byId("mobile_nav");
  if (!nav) return;
  nav.classList.toggle("d-flex", visible);
  nav.classList.toggle("d-none", !visible);
}

/** @returns {boolean} True if device supports touch input. */
function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/** @returns {boolean} True if mobile nav should be shown. */
function shouldShowMobileNav() {
  const tabletLike = window.innerWidth <= 1400 || window.innerHeight <= 950;
  return isTouchDevice() && tabletLike;
}


/** @returns {boolean} True if controls should be moved into the game screen. */
function shouldControlsBeInsideGameScreen() {
  const lowHeight = window.innerHeight <= 460;
  return shouldShowMobileNav() || lowHeight;
}

/** @returns {boolean} True if the game should look like fullscreen even without fullscreen. */
function shouldForceFullscreenLook() {
  const compactLandscape = window.innerHeight <= 380 && window.innerWidth <= 820;
  const portraitTablet = window.innerWidth <= 900 && window.innerHeight >= 900;
  return compactLandscape || portraitTablet;
}

/** @param {HTMLElement|null} navElement */
function updateTouchDeviceStatus(navElement) {
  const show = !!navElement && shouldShowMobileNav();
  setFlexVisible(navElement, show);
  isTouchDeviceGlobal = show;
}

/**
 * Applies layout rules for small screens and mobile controls.
 */
function applyResponsiveGameMode() {
  const gameScreen = byId("fullscreen");
  if (!gameScreen) return;
  handleMobileNavPlacement(gameScreen);
  applyFullscreenLook(gameScreen);
}

/**
 * Moves and shows the mobile navigation when needed.
 * @param {HTMLElement} gameScreen
 */
function handleMobileNavPlacement(gameScreen) {
  const mobileNav = byId("mobile_nav");
  if (!mobileNav) return;

  if (shouldControlsBeInsideGameScreen()) {
    moveMobileNavIntoGame(gameScreen, mobileNav);
    return;
  }
  gameScreen.classList.remove("has-mobile-nav");
}

/**
 * Appends the mobile nav to the game screen and shows it.
 * @param {HTMLElement} gameScreen
 * @param {HTMLElement} mobileNav
 */
function moveMobileNavIntoGame(gameScreen, mobileNav) {
  if (mobileNav.parentElement !== gameScreen) gameScreen.appendChild(mobileNav);
  setFlexVisible(mobileNav, true);
  gameScreen.classList.add("has-mobile-nav");
}

/**
 * Applies forced fullscreen styles for small screens.
 * @param {HTMLElement} gameScreen
 */
function applyFullscreenLook(gameScreen) {
  const fullscreenBox = document.querySelector(".fullscreen-box");
  const force = shouldForceFullscreenLook();

  gameScreen.classList.toggle("small-screen-mode", force);
  gameScreen.classList.toggle("force-fullscreen", force);
  if (fullscreenBox) fullscreenBox.style.display = force ? "none" : "";
}

/** Initializes listeners that keep responsive layout up-to-date. */
function initResponsiveListeners() {
  const mobileNav = byId("mobile_nav");
  updateTouchDeviceStatus(mobileNav);

  const apply = () => {
    updateTouchDeviceStatus(mobileNav);
    applyResponsiveGameMode();
  };

  const mq = window.matchMedia("(any-pointer: coarse)");
  mq.addEventListener("change", apply);
  window.addEventListener("resize", apply);
}

/** Go back to start page. */
function back() {
  window.location.href = "index.html";
}

/** @param {string} url */
function navigateTo(url) {
  window.location.href = url;
}

/** Loads the saved sound preference from localStorage. */
function loadSoundPreference() {
  const saved = localStorage.getItem("soundMuted");
  isMuted = saved === "true";
}

/** Updates UI icon + mutes/unmutes all game sounds. */
function updateSoundToggleDisplay() {
  const img = /** @type {HTMLImageElement|null} */ (byId("sound_box_img_play"));
  setImgSrc(img, isMuted ? "icons/volume-off.png" : "icons/volume-on.png");

  if (!Array.isArray(allGameSounds)) return;
  allGameSounds.forEach((sound) => (sound.muted = isMuted));
}

/** Initializes sound UI state. */
function initPlay() {
  loadSoundPreference();
  updateSoundToggleDisplay();
}

/** @returns {boolean} True if audio can be started/resumed now. */
function canStartAudioNow() {
  return !!window.userInteracted && !isMuted;
}

/** Toggles sound mute state and stores it. */
function toggleSound() {
  isMuted = !isMuted;
  localStorage.setItem("soundMuted", String(isMuted));
  updateSoundToggleDisplay();

  if (isMuted) {
    if (typeof muteAllSoundsNow === "function") muteAllSoundsNow();
    return;
  }
  if (!canStartAudioNow()) return;
  if (typeof resumeAllAudio === "function") resumeAllAudio();
  else if (typeof playGameMusic === "function") playGameMusic();
}

/**
 * Immediately mutes and stops all sounds.
 * Useful when leaving the game or toggling mute on.
 */
function muteAllSoundsNow() {
  if (typeof pauseAllAudio === "function") pauseAllAudio();
  if (typeof pauseSpecificAudio === "function") pauseSpecificAudio();
  if (!Array.isArray(allGameSounds)) return;
  allGameSounds.forEach((s) => { if (s) s.muted = true; });
}

/** @param {boolean} isOn */
function setCanvasFullscreenStyles(isOn) {
  const canvas = /** @type {HTMLCanvasElement|null} */ (byId("canvas"));
  if (!canvas) return;
  canvas.style.width = isOn ? "100vw" : "";
  canvas.style.height = isOn ? "100vh" : "";
  canvas.style.maxWidth = isOn ? "100vw" : "";
  canvas.style.maxHeight = isOn ? "100vh" : "";
  canvas.style.borderRadius = isOn ? "0" : "";
}

/** Enters fullscreen mode for the given element. @param {HTMLElement} el */
function enterFullscreen(el) {
  if (el.requestFullscreen) el.requestFullscreen();
  setCanvasFullscreenStyles(true);

  const icon = /** @type {HTMLImageElement|null} */ (byId("fullscreen_img"));
  setImgSrc(icon, "icons/minimize-fullscreen.png");
  el.classList.add("fullscreen-active");
  applyResponsiveGameMode();
}

/** Exits fullscreen and resets UI state. */
function exitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen();
  setCanvasFullscreenStyles(false);

  const icon = /** @type {HTMLImageElement|null} */ (byId("fullscreen_img"));
  setImgSrc(icon, "icons/maximize-fullscreen.png");

  const el = byId("fullscreen");
  if (el) el.classList.remove("fullscreen-active");
  applyResponsiveGameMode();
}

/** Toggles fullscreen mode for the game screen. */
function fullscreen() {
  const el = byId("fullscreen");
  if (!el) return;
  document.fullscreenElement ? exitFullscreen() : enterFullscreen(el);
}

/** Hides credits tooltip when rotate overlay is visible. */
function toggleCredits() {
  const overlay = byId("overlay_rotate_device");
  const credits = document.querySelector(".footer-credits");
  if (!overlay || !credits) return;
  const visible = window.getComputedStyle(overlay).display !== "none";
  credits.classList.toggle("hide-credits", visible);
}
setInterval(toggleCredits, 200);

/** @param {HTMLElement|null} overlay */
function hideOverlay(overlay) {
  if (!overlay) return;
  overlay.classList.add("d-none");
  overlay.classList.remove("d-flex");
}

/** Resets pause flag + pause icon UI. */
function resetPauseStateAndUI() {
  if (typeof isGamePaused !== "undefined") isGamePaused = false;
  const img = /** @type {HTMLImageElement|null} */ (byId("game_pause_box_img_play"));
  if (!img) return;
  img.src = "icons/pause-icon.png";
  img.title = "Pause";
}

/** @param {boolean} resetFinish */
function stopAndPauseGame(resetFinish) {
  if (typeof stopAllLoops === "function") stopAllLoops();
  if (typeof pauseAllAudio === "function") pauseAllAudio();
  if (typeof pauseSpecificAudio === "function") pauseSpecificAudio();

  if (resetFinish && typeof isGameFinish !== "undefined") isGameFinish = false;
  if (typeof isGamePaused !== "undefined") isGamePaused = false;
}

/** Hides start/menu/game screens. */
function hideAllScreens() {
  const start = byId("start_screen");
  const menu = byId("menu_screen");
  const game = byId("game_screen");
  if (start) start.classList.add("d-none");
  if (menu) menu.classList.add("d-none");
  if (game) game.classList.add("d-none");
}

/** Handles leaving the game screen. */
function handleNonGameScreen() {
  if (document.fullscreenElement && typeof exitFullscreen === "function") exitFullscreen();
  stopAndPauseGame(false);

  setMobileNavVisible(false);
  hideOverlay(byId("overlay_winning"));
  hideOverlay(byId("overlay_game_over"));
  resetPauseStateAndUI();
}

/** @param {HTMLElement} game */
function showGameScreen(game) {
  game.classList.remove("d-none");
  if (typeof isGameFinish !== "undefined") isGameFinish = false;
  if (typeof isGamePaused !== "undefined") isGamePaused = false;

  if (typeof init === "function") init();
  if (canStartAudioNow() && typeof playGameMusic === "function") playGameMusic();

  resetPauseStateAndUI();
  updateTouchDeviceStatus(byId("mobile_nav"));
  applyResponsiveGameMode();
}

/** @param {"start"|"menu"|"game"} screen */
function showScreen(screen) {
  if (screen !== "game") handleNonGameScreen();
  hideAllScreens();

  const start = byId("start_screen");
  const menu = byId("menu_screen");
  const game = byId("game_screen");

  if (screen === "start" && start) start.classList.remove("d-none");
  if (screen === "menu" && menu) menu.classList.remove("d-none");
  if (screen === "game" && game) showGameScreen(game);
}

/** Resets overlays and restarts the game. */
function resetGame() {
  stopAndPauseGame(true);
  hideOverlay(byId("overlay_winning"));
  hideOverlay(byId("overlay_game_over"));
  resetPauseStateAndUI();
  showScreen("game");
}

/** Initializes the app when the DOM is ready. */
function initApp() {
  initResponsiveListeners();
  initPlay();
  applyResponsiveGameMode();
}
document.addEventListener("DOMContentLoaded", initApp);

/** Logs global errors to help debugging. */
function logGlobalError(e) {
  console.error("Global error:", e.message, "at",
    e.filename + ":" + e.lineno + ":" + e.colno, e.error);
}
window.addEventListener("error", logGlobalError);

/** Handles global promise rejections (keeps console clean for expected audio aborts). */
function handleUnhandledRejection(e) {
  const r = e.reason;
  if (r && (r.name === "AbortError" || r.name === "NotAllowedError")) { e.preventDefault(); return; }
  console.error("Unhandled promise rejection:", r);
}
window.addEventListener("unhandledrejection", handleUnhandledRejection);
