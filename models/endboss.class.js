class Endboss extends MovableObject {

    character;
    height = 400;
    width = 250;
    y = 55;
    speed = 3.5;
    endbossLifePoints = 100;
    isEndbossActive = false;
    endbossAnimationLoop;
    endbossMovementLoop;

    offset = {
        top: 70,
        left: 5,
        right: 0,
        bottom: 10
    };
    
    IMAGES_WALKING = [
        'img/img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'img/img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor(){
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2500 ;
        this.animate();
    }

    animate(){

        if (this.endbossAnimationLoop) {
            clearInterval(this.endbossAnimationLoop);
        }
        this.startEndbossAnimationLoop()
        if (this.endbossMovementLoop) {
            clearInterval(this.endbossMovementLoop);
        }
        this.startEndbossMovementLoop()
    }

    startEndbossAnimationLoop() {
        this.endbossAnimationLoop = setInterval(() => {
            if (this.isDead()) {
                this.handleEndbossDeadState();
                return;
            }

            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.playEndbossHurtSound();
            } else if (this.hasDetectedCharacter) {
                this.manageAttackOrWalkBehavior()
            } else {
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 250);
    }

    startEndbossMovementLoop() {
        this.endbossMovementLoop = setInterval(() => {
            if (this.isDead()) return;
            this.handleEndbossActivation()
            this.handleFirstContact()
        }, 1000 / 60);
    }

    handleEndbossActivation() {
        if (!this.isEndbossActive && this.world && this.world.character) {
            if (this.endbossLifePoints <= 75 || this.world.character.x > 2200) {
                this.world.displayEndbossStatusBar = true;
                this.hasDetectedCharacter = true;
                this.isEndbossActive = true;
                this.startEndbossMusic();
                this.playEndbossAlertSound();
            }
        }
    }

    handleFirstContact() {
        if (this.hasDetectedCharacter) {
            if (this.world.character.x < this.x - 50) {
                this.moveLeft();
                this.otherDirection = false;
            } else if (this.world.character.x > this.x + 50) {
                this.moveRight();
                this.otherDirection = true;
            }
        }
    }

    manageAttackOrWalkBehavior() {
        if (this.character && Math.abs(this.character.x - this.x) < 200) {
            this.playAnimation(this.IMAGES_ATTACK);
            if (!this.attackSoundActive) {
                this.playEndbossAttackSound()
            }
        } else {
            this.playAnimation(this.IMAGES_WALKING);
            if (this.attackSoundActive) {
                endboss_noise.pause();
                endboss_noise.currentTime = 0;
                this.attackSoundActive = false;
            }
        }
    }

    handleEndbossDeadState() {
        if (!this.isDeadAnimationPlayed) {
            this.playAnimation(this.IMAGES_DEAD);
            setTimeout(() => {
                this.isDeadAnimationPlayed = true;
                this.onEndbossDeath();
            }, 100);
        }
    }

    startEndbossMusic() {
        if (!isMuted) {
            game_music.pause();
            game_music.currentTime = 0;
            endboss_music.volume = endboss_noise_volume;
            endboss_music.play();
        }

    }

    playEndbossAlertSound() {
        if (!isMuted) {
            endboss_alert.currentTime = 0;
            endboss_alert.play();
            setTimeout(() => {
                endboss_alert.pause();
                endboss_alert.currentTime = 0;
            }, 1200);
        }

    }

    playEndbossHurtSound() {
        if (!isMuted) {
            let endboss_hit = new Audio(PATH_ENDBOSS_HURT);
            endboss_hit.volume = enemy_stomp_volume;
            endboss_hit.play();
            setTimeout(() => {
                endboss_hit.pause();
                endboss_hit.currentTime = 0;
            }, 1000);
        }

    }

    playEndbossAttackSound () {
        if (!isMuted) {
            endboss_noise.currentTime = 0;
            endboss_noise.play();
            endboss_noise.volume = endboss_noise_volume;
        }
        this.attackSoundActive = true;

    }

    onEndbossDeath() {
        this.stopAllLoops();

        if (!isMuted) {
            endboss_death.currentTime = 0;
            endboss_death.play();
            endboss_death.volume = endboss_death_volume;
        }

        setTimeout(() => {
            handleWinningScreen();
        }, 2300);

    }

    stopAllLoops() {
        if (this.endbossAnimationLoop) {
            clearInterval(this.endbossAnimationLoop);
            this.endbossAnimationLoop = null;
        }
        if (this.endbossMovementLoop) {
            clearInterval(this.endbossMovementLoop);
            this.endbossMovementLoop = null;
        }
    }

    resetAudio() {
        endboss_death.pause();
        endboss_death.currentTime = 0;
        endboss_music.pause();
        endboss_music.currentTime = 0;
        endboss_noise.pause();
        endboss_noise.currentTime = 0;
        endboss_alert.pause();
        endboss_alert.currentTime = 0;
    }

    startAllLoops() {
        if (!this.isDead()) {
            this.animate();
        }
    }
}