function playGameMusic() {
    game_music.play();
    game_music.volume = game_music_volume_high;
}

function playPickupSound(audioPath, volume, durationMs) {
    if (!isMuted && !isGameFinish) {
        let audio = new Audio(audioPath);
        audio.play();
        audio.volume = volume;
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, durationMs);
    }
}

function playBouncingSound() {
    if (!isMuted && !isGameFinish) {
        let bouncing = new Audio(PATH_CHARACTER_BOUNCING);
        bouncing.volume = character_bouncing_volume;
        bouncing.play();
        setTimeout(() => {
            bouncing.pause();
            bouncing.currentTime = 0;
        }, 500);
    }
}

function playEnemyStompSound() {
    if (!isMuted && !isGameFinish) {
        let stompKillSound = new Audio(PATH_ENEMY_STOMP_SOUND);
        stompKillSound.volume = enemy_stomp_volume;
        stompKillSound.play();
        setTimeout(() => {
            stompKillSound.pause();
            stompKillSound.currentTime = 0;
        }, 800);
    }
}

function playChickenDeathSound() {
    if (!isMuted && !isGameFinish) {
        let chicken_death = new Audio(PATH_CHICKEN_DEATH);
        chicken_death.volume = chicken_death_volume;
        chicken_death.play();
        setTimeout(() => {
            chicken_death.pause();
            chicken_death.currentTime = 0;
        }, 1000);
    }
}

function playMusicTracks() {
    if (typeof game_music !== 'undefined' && typeof game_music.play === 'function') {
        game_music.play();
    }
    if (this.endboss && this.endboss.isEndbossActive && typeof endboss_music !== 'undefined' && typeof endboss_music.play === 'function') {
        endboss_music.play();
    }
}

function pauseAllAudio() {
    allGameSounds.forEach(audio => {
        if (audio && typeof audio.pause === 'function') {
            audio.pause();
        }
    });
}

function pauseSpecificAudio() {
    if (typeof game_music !== 'undefined' && typeof game_music.pause === 'function') {
        game_music.pause();
        game_music.currentTime = 0;
    }
    if (typeof endboss_music !== 'undefined' && typeof endboss_music.pause === 'function') {
        endboss_music.pause();
        endboss_music.currentTime = 0;
    }
}