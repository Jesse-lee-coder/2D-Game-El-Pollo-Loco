let isMuted = true;
let isGameFinish = false;
let isTouchDeviceGlobal = false;
let initialCanvasRef;
const isPortrait = window.matchMedia("(orientation: portrait)").matches;
const isLandscape = window.matchMedia("(orientation: landscape)").matches;

function isTouchDevice() {
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
}

document.addEventListener('DOMContentLoaded', () => {
    const { mobileNavRef } = getRefs();
    updateTouchDeviceStatus(mobileNavRef);
    const mediaQueryTouch = window.matchMedia('(any-pointer: coarse)');
    mediaQueryTouch.addEventListener('change', () => {
        updateTouchDeviceStatus(mobileNavRef);
    });
});

function updateTouchDeviceStatus(mobileNavElement) {
    if (mobileNavElement) {
        if (isTouchDevice()) {
            mobileNavElement.classList.add('d-flex');
            mobileNavElement.classList.remove('d-none');
        } else {
            mobileNavElement.classList.remove('d-flex');
            mobileNavElement.classList.add('d-none');
        }
    }
}

function getRefs() {
    return {
        soundBoxImgPlayRef: document.getElementById('sound_box_img_play'),
        fullscreenRef: document.getElementById('fullscreen'),
        mobileNavRef: document.getElementById('mobile_nav'),
        canvasRef: document.getElementById('canvas'),
        fullscreenRef: document.getElementById('fullscreen'),
        fullscreenImgRef: document.getElementById('fullscreen_img'),
        pausePlayIconRef: document.getElementById('game_pause_box_img_play'),
        overlayGameOverRef: document.getElementById('overlay_game_over'),
        overlayWinningRef: document.getElementById('overlay_winning'),
    };
}

function back() {
    window.history.back();
}

function navigateTo(url) {
    window.location.href = url;
}

function initPlay() {
    updateSoundToggleDisplay();
}

async function startGame() {
    const { canvasRef } = getRefs();

    try {
        handleTry(canvasRef);
    } catch (error) {
        console.error("Error starting the game:", error);
    }
}

async function handleTry(canvasRef) {
    initPlay();
    await setupLevel();

    if (!canvasRef) {
        throw new Error("Canvas element with ID 'canvas' was not found.");
    }

    initialCanvasRef = canvasRef;
    world = new World(initialCanvasRef, keyboard);

    if (!world) {
        throw new Error("The game world could not be initialized.");
    }
}

async function resetGame() {
    const { overlayWinningRef, overlayGameOverRef, canvasRef, pausePlayIconRef } = getRefs();

    stopAllLoops();
    resetAudioPlayback();
    resetGameUIAndState(overlayWinningRef, overlayGameOverRef, canvasRef, pausePlayIconRef);
    await initializeNewGameWorld();
    startBackgroundMusic();
}

function resetAudioPlayback() {
    const audioElements = [...endGameSounds, losing_audio, winning_audio];

    audioElements.forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}

function resetGameUIAndState(overlayWinningRef, overlayGameOverRef, canvasRef, pausePlayIconRef) {
    isGameFinish = false;
    isGamePaused = false;

    overlayGameOverRef.classList.remove('d-flex');
    overlayWinningRef.classList.remove('d-flex');
    canvasRef.classList.remove('d-none');

    setIcon(pausePlayIconRef, 'icons/pause-icon.png', 'game pause icon', 'Pause');
}

async function initializeNewGameWorld() {
    await setupLevel(); 

    if (!initialCanvasRef) {
        throw new Error("Canvas reference is missing. Cannot initialize new game world.");
    }
    world = new World(initialCanvasRef, keyboard);
}

function startBackgroundMusic() {
    if (game_music && !isMuted) {
        game_music.play();
        game_music.volume = game_music_volume_loude;
    }
}

function toggleSound() {
    isMuted = !isMuted;
    updateSoundToggleDisplay();
}

function updateSoundToggleDisplay() {
    const { soundBoxImgPlayRef } = getRefs();
    const img = isMuted ? 'icons/volume-off.png' : 'icons/volume-on.png';
    const audioStatus = isMuted ? 'Volume off' : 'Volume on';
    const alt = isMuted ? 'voulume off icon' : 'volume on icon';
    allGameSounds.forEach(sound => {
        sound.muted = isMuted;
    });

    soundBoxImgPlayRef.src = img;
    soundBoxImgPlayRef.title = audioStatus;
    soundBoxImgPlayRef.alt = alt;
}

function fullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        exitFullscreen();
    } else {
        const { fullscreenRef } = getRefs();
        if (fullscreenRef) {
            enterFullscreen(fullscreenRef);
        } else {
            enterFullscreen(document.documentElement);
        }
    }
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    const { fullscreenRef, canvasRef, fullscreenImgRef } = getRefs();
    if (canvasRef) {
        setAllPropertiesForEnterFullscreen(fullscreenRef, canvasRef, fullscreenImgRef);
    }
}

function setAllPropertiesForEnterFullscreen(fullscreenRef, canvasRef, fullscreenImgRef) {
    canvasRef.style.width = '100%';
    canvasRef.style.height = '100%';
    canvasRef.style.borderRadius = '0px';
    fullscreenRef.style.borderRadius = '0px';
    fullscreenImgRef.src = 'icons/minimize-fullscreen.png';
    fullscreenImgRef.alt = 'minimize fullscreen icon';
    fullscreenImgRef.title = 'minimize fullscreen';
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }

    const { fullscreenRef, canvasRef, fullscreenImgRef } = getRefs();

    if (canvasRef) {
        removeAllPropertiesForExitFullscreen(fullscreenRef, canvasRef, fullscreenImgRef);
    }
}

function removeAllPropertiesForExitFullscreen(fullscreenRef, canvasRef, fullscreenImgRef) {
    canvasRef.style.width = '';
    canvasRef.style.height = '';
    canvasRef.style.borderRadius = '';
    fullscreenRef.style.borderRadius = '';
    fullscreenImgRef.src = 'icons/maximize-fullscreen.png';
    fullscreenImgRef.alt = 'maximize fullscreen icon';
    fullscreenImgRef.title = 'maximize fullscreen';
}