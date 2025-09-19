class ThrowableObject extends MovableObject {

    offset = {
        top: 8,
        left: 15,
        right: 15,
        bottom: 8
    };

    groundY = 351;
    isSplashing = false;
    world;
    movementLoop;
    rotationAnimationLoop;
    splashAnimationLoop;

    IMAGES_BOTTLE_ROTATION = [
        'img/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'

    ]

    IMAGES_BOTTLE_SPLASH = [
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ]

    constructor(x, y, otherDirection){
        super().loadImage('img/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);

        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = otherDirection;
        this.splashWidth = 80;
        this.splashHeight = 80;
        this.throw();
    }


    throw() {

        this.speedY = 30;
        this.applyGravity();
        this.wasThrown = true;

        if (!this.movementLoop && !this.isSplashing) {
            let throwSpeedX = this.otherDirection ? -10 :10;
            this.movementLoop = setInterval(() => {
            this.x += throwSpeedX;
            this.handleBottleImpact();

            }, 25);
        }
        this.startBottleRotationAnimation();

    }

    handleBottleImpact() {
        if (this.isSplashing || world.bottleHitObject || this.y >= this.groundY) {
            if (!this.isSplashing) {
                this.isSplashing = true;
                this.playBottleSplash();
                this.stopMovementAndRotationLoops();

                setTimeout(() => {
                    const index = world.character.bottles.indexOf(this);
                    if (index > -1) {
                        world.character.bottles.splice(index, 1);
                    }
                    this.stopAllLoops();
                }, 500);
            }
        }
    }

    playBottleSplash() {
        if (!this.isSplashing) return;

        if (typeof bottle_splash !== 'undefined' && typeof bottle_splash.play === 'function') {
            bottle_splash.play();
        }

        this.width = this.splashWidth;
        this.height = this.splashHeight;
        this.stopMovementAndRotationLoops();
        this.startSplashAnimationsLoop();
    }


    startSplashAnimationsLoop() {
        if (!this.splashAnimationLoop) {
            this.splashAnimationLoop = setInterval(() => {
                this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
                if (this.currentImage % this.IMAGES_BOTTLE_SPLASH.length === 0 && this.currentImage > 0) {
                    clearInterval(this.splashAnimationLoop);
                    this.splashAnimationLoop = null;
                }
            }, 1000 / 10);
        }
    }

    stopAllLoops() {
        super.stopAllLoops();

        if (this.movementLoop) {
            clearInterval(this.movementLoop);
            this.movementLoop = null;
        }

        if (this.rotationAnimationLoop) {
            clearInterval(this.rotationAnimationLoop);
            this.rotationAnimationLoop = null;
        }

        if (this.splashAnimationLoop) {
            clearInterval(this.splashAnimationLoop);
            this.splashAnimationLoop = null;
        }
    }

    startAllLoops() {
        super.startAllLoops();
        if (!this.isSplashing) {
            if(this.wasThrown && !this.movementLoop) {
                let throwSpeedX = this.otherDirection ? -10 : 10;
                this.movementLoop = setInterval(() => {
                    this.x += throwSpeedX;
                    this.handleBottleImpact();
                }, 25);
            }
            this.startBottleRotationAnimation();
        }
    }

    startBottleRotationAnimation() {
        if (!this.rotationAnimationLoop) {
            this.rotationAnimationLoop = setInterval(() => {
                if (!this.isSplashing) {
                    this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
                }
            }, 1000 / 25);
        }
    }

    stopMovementAndRotationLoops() {
        if (this.movementLoop) {
            clearInterval(this.movementLoop);
            this.movementLoop = null;
        }

        if (this.rotationAnimationLoop) {
            clearInterval(this.rotationAnimationLoop);
            this.rotationAnimationLoop = null;
        }
    }

}