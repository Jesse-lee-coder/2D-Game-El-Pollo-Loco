class Character extends MovableObject{

    height = 280;
    y = 155; 
    speed = 10;
    lastInputTime = Date.now();
    idleTimeout = 6000;
    isRightMovementAllowed = true;
    isLeftMovementAllowed = true;
    characterMovementLoop;
    characterAnimationLoop;

    IMAGES_IDLE = [
        'img/img/2_character_pepe/1_idle/idle/I-1.png',
        'img/img/2_character_pepe/1_idle/idle/I-2.png',
        'img/img/2_character_pepe/1_idle/idle/I-3.png',
        'img/img/2_character_pepe/1_idle/idle/I-4.png',
        'img/img/2_character_pepe/1_idle/idle/I-5.png',
        'img/img/2_character_pepe/1_idle/idle/I-6.png',
        'img/img/2_character_pepe/1_idle/idle/I-7.png',
        'img/img/2_character_pepe/1_idle/idle/I-8.png',
        'img/img/2_character_pepe/1_idle/idle/I-9.png',
        'img/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_WALKING = [
        'img/img/2_character_pepe/2_walk/W-21.png',
        'img/img/2_character_pepe/2_walk/W-22.png',
        'img/img/2_character_pepe/2_walk/W-23.png',
        'img/img/2_character_pepe/2_walk/W-24.png',
        'img/img/2_character_pepe/2_walk/W-25.png',
        'img/img/2_character_pepe/2_walk/W-26.png'

    ];

    IMAGES_JUMPING = [
        'img/img/2_character_pepe/3_jump/J-31.png',
        'img/img/2_character_pepe/3_jump/J-32.png',
        'img/img/2_character_pepe/3_jump/J-33.png',
        'img/img/2_character_pepe/3_jump/J-34.png',
        'img/img/2_character_pepe/3_jump/J-35.png',
        'img/img/2_character_pepe/3_jump/J-36.png',
        'img/img/2_character_pepe/3_jump/J-37.png',
        'img/img/2_character_pepe/3_jump/J-38.png',
        'img/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/img/2_character_pepe/5_dead/D-51.png',
        'img/img/2_character_pepe/5_dead/D-52.png',
        'img/img/2_character_pepe/5_dead/D-53.png',
        'img/img/2_character_pepe/5_dead/D-54.png',
        'img/img/2_character_pepe/5_dead/D-55.png',
        'img/img/2_character_pepe/5_dead/D-56.png',
        'img/img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/img/2_character_pepe/4_hurt/H-41.png',
        'img/img/2_character_pepe/4_hurt/H-42.png',
        'img/img/2_character_pepe/4_hurt/H-43.png'

    ];


    world;
    // walking_sound = new Audio('Audiofile')

    constructor() {
        super().loadImage('img/img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.animate();
        
    }

    animate() {

        this.startMovementLoop();
        this.startAnimationLoop();

    }

    startMovementLoop() {
        this.characterMovementLoop = setInterval(() => {
            this.updateLastInputTime();
            this.executeMovement();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    executeMovement() {
        this.executeRightMovement();
        this.executeLeftMovement();
        this.executeJump();
    }

    executeRightMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && this.isRightMovementAllowed) {
            this.moveRight();
            // sound hinzufügen this.sounds()
            this.otherDirection = false;
        }
    }

    executeLeftMovement() {
        if (this.world.keyboard.LEFT && this.x > 0 && this.isLeftMovementAllowed) {
            this.moveLeft();
            // sound hinzufügen this.sounds()
            this.otherDirection = true;
        }
    }

    executeJump() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }
    }

    updateLastInputTime() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE) {
            this.lastInputTime = Date.now();
        }
    }

    startAnimationLoop() {
        this.characterAnimationLoop = setInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation(); 
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                if (this.hasBeenIdle()) {
                    this.playAnimation(this.IMAGES_LONG_IDLE);
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                }
            }
        }, 50); 
    }

    playDeathAnimation() {
        let i = this.currentImage;
        if (i < this.IMAGES_DEAD.length) {
            let path = this.IMAGES_DEAD[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        } else {
            // nach der Animation → beim ersten Bild stehen bleiben
            this.img = this.imageCache[this.IMAGES_DEAD[0]];
            this.stopAllLoops();
        }
    }



    hasBeenIdle() {
        let timePassed = Date.now() - this.lastInputTime;
        return timePassed > this.idleTimeout;
    }

    stopAllLoops() {
        super.stopAllLoops();
        this.clearCharacterLoops();

    }

    clearCharacterLoops() {
        if (this.characterMovementLoop) {
            clearInterval(this.characterMovementLoop);
            this.characterMovementLoop = null;
        }
        if (this.characterAnimationLoop) {
            clearInterval(this.characterAnimationLoop);
            this.characterAnimationLoop = null;
        }

    }

    jump(){
        this.speedY = 30;
    }

}