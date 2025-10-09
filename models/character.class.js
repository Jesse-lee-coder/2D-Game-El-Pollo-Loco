class Character extends MovableObject{

    height = 280;
    y = 155; 
    characterLifePoints = 100;
    groundY = 155;
    speed = 10;
    lastInputTime = Date.now();
    idleTimeout = 6000;
    isAbleToMoveRight = true;
    isAbleToMoveLeft = true;
    characterMovementLoop;
    characterAnimationLoop;
    characterIdleAnimationLoop;
    collectBottles = [];
    collectCoins = [];
    bottles = [];
    lastThrow = 0;
    throwWaitTime = 500;
    world;

    offset = {
        top: 120,
        left: 18,
        right: 28,
        bottom: 13
    };

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
        this.startIdleAnimationLoop();

    }

    /*setCharacterToGroundLevel() {
        return 155;
    }*/

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
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x && this.isAbleToMoveRight) {
            this.moveRight();
            // sound hinzufügen this.sounds()
            this.otherDirection = false;
        }
    }

    executeLeftMovement() {
        if (this.world.keyboard.LEFT && this.x > 0 && this.isAbleToMoveLeft) {
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

    executeBottleThrow(currentTime) {
        let bottleX = this.x + (this.otherDirection ? -5 : 80);
        this.collectBottles.splice(0, 1);
        let bottle = new ThrowableObject(bottleX, this.y + 130, this.otherDirection);
        this.bottles.push(bottle);
        this.lastThrow = currentTime;
        this.lastInputTime = Date.now();
    }

    updateLastInputTime() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE || this.world.keyboard.D) {
            this.lastInputTime = Date.now();
        }
    }

    startAnimationLoop() {
        this.characterAnimationLoop = setInterval(() => {
            if (handleCharacterDeath(this)) return;
            if (handleCharacterHurt(this)) return;
            if (updateJumpAnimation(this)) return;
            updateWalkAnimation(this);
            processBottleThrow(this);
        }, 50);
    }

    startIdleAnimationLoop() {
        this.characterIdleAnimationLoop = setInterval(() => {
            const isCharacterMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE || this.world.keyboard.D;
            if (!this.isDead() && !this.isHurt() && !this.isAboveGround() && !isCharacterMoving) {
                this.playIdleAnimations();
            }
        }, 200);
    }

    playIdleAnimations(){
        if(this.hasBeenIdle()){
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /*playDeathAnimation() {
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
    }*/



    hasBeenIdle() {
        let timePassed = Date.now() - this.lastInputTime;
        return timePassed > this.idleTimeout;
    }

    startAllLoops() {
        if (!this.isDead()) {
            super.startAllLoops();
            this.animate();
        }
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
        if (this.characterIdleAnimationLoop) {
            clearInterval(this.characterIdleAnimationLoop);
            this.characterIdleAnimationLoop = null;
        }

    }

    draw(ctx) {
        super.draw(ctx);
    }


}