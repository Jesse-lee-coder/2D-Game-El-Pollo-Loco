let canvas;
let world;
let keyboard = new Keyboard();
let isGamePaused = false;


const PATH_CHARACTER_BOUNCING = 'audio/character-bouncing.mp3';
const PATH_ENEMY_STOMP_SOUND = 'audio/enemy-stomp-sound.mp3';
const PATH_CHICKEN_DEATH = 'audio/chicken-dead.mp3';
const PATH_ENDBOSS_HURT = 'audio/endboss-hurt.mp3';
const PATH_COLLECT_BOTTLE = 'audio/collect-bottle.mp3';
const PATH_COLLECT_COIN = 'audio/collect-coin.mp3';

let character_walking = new Audio('audio/character-walking.mp3');
let character_snoring = new Audio('audio/character-snoring.mp3');
let character_death = new Audio('audio/character-death.mp3');
let character_jump = new Audio('audio/character_jump.ogg');
let character_hurt = new Audio('audio/character-hurt.mp3');
let bottle_break = new Audio('audio/bottle-break.mp3');
let endboss_music = new Audio('audio/endboss-music.mp3');
let endboss_noise = new Audio('audio/endboss-noise.mp3');
let endboss_alert = new Audio('audio/endboss_alert.mp3');
let endboss_hit = new Audio('audio/endboss-hit.mp3'); 
let endboss_death = new Audio('audio/endboss-death.mp3');
let game_music = new Audio('audio/game-music.mp3');
let winning_audio = new Audio('audio/winning-audio.mp3');
let losing_audio = new Audio('audio/losing-audio.mp3');

const allGameSounds = [
    character_walking,
    character_snoring,
    character_death,
    character_jump,
    character_hurt,
    bottle_break, 
    endboss_music,
    endboss_noise,
    endboss_alert,
    endboss_hit,
    endboss_death,
    game_music,
    winning_audio,
    losing_audio,
];

const endGameSounds = [
    character_walking,
    character_snoring,
    character_death,
    character_jump,
    character_hurt,
    bottle_break, 
    endboss_music,
    endboss_noise,
    endboss_alert,
    endboss_hit,
    endboss_death,
    game_music,
];

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

function toggleGamePause() {
    const { pausePlayIconRef } = getRefs();

    isGamePaused = !isGamePaused;

    if (isGamePaused) {
        stopAllLoops();
        pauseAllAudio();
        setIcon(pausePlayIconRef, 'icons/play-icon.png', 'play game icon', 'Play')
    } else {
        startAllLoops();
        setIcon(pausePlayIconRef, 'icons/pause-icon.png', 'pause game icon', 'Pause')
    }
}

function pauseAllAudio() {
    allGameSounds.forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
            audio.pause();
        }
    });
}

function setIcon(ref, icon, altText, title) {
    ref.src = icon
    ref.alt = altText;
    ref.title = title;
}

function handleWinningScreen() {
    let overlayWinningRef = document.getElementById('overlay_winning');
    stopAllLoops()
    isGameFinish = true;
    winning_audio.play();
    winning_audio.volume = winning_volume;
    overlayWinningRef.classList.add('d-flex')
}

function handleLosingScreen() {
    let overlayGameOverRef = document.getElementById('overlay_game_over');
    stopAllLoops()
    isGameFinish = true;
    losing_audio.play();
    losing_audio.volume = losing_volume;
    setTimeout(() => {
        losing_audio.pause();
        losing_audio.currentTime = 0;
    }, 2000);
    overlayGameOverRef.classList.add('d-flex')
}





