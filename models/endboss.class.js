class Endboss extends MovableObject {

    character;
    height = 400;
    width = 250;
    y = 55;
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
        } else {
            this.playAnimation(this.IMAGES_WALKING);
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

    onEndbossDeath() {
        this.stopAllLoops();

    // Noch hinzufügen, was passieren soll.
    }

    startAllLoops() {
        if (!this.isDead()) {
            this.animate();
        }
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



}