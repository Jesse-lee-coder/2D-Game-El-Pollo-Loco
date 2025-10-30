class SmallChicken extends MovableObject {

    groundY = 375;
    speed = 0.85;
    height = 50;
    width = 70;
    runDistanceUntilJump = 80 + Math.random() * 320;
    distanceLastJump = 0;
    smallChickenAnimationLoop;
    smallChickenDeadAnimationLoop;

    offset = {
        top: -10,
        left: 10,
        right: 10,
        bottom: 5
    };

    IMAGES_WALKING = [
        'img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'img/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/img/3_enemies_chicken/chicken_small/1_walk/1_w.png')
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.applyGravity();
        let randomX = 900 + Math.random() * 2100;
        this.x = Math.round(randomX / 150) * 150;
        this.speed = 0.85 + Math.random() * 1.1;
        this.animate();
    }

    animate() {
        this.startSmallChickenAnimationLoop();
        this.startSmallChickenDeadAnimationLoop();
    }

    startSmallChickenAnimationLoop() {
        this.smallChickenAnimationLoop = setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
                if (!this.isAboveGround()) {
                    this.distanceLastJump += this.speed;
                } else {
                    this.distanceLastJump = 0;
                }
                if (!this.isAboveGround() && this.speedY === 0 && this.distanceLastJump > this.runDistanceUntilJump) {
                    this.smallChickenJump();
                    this.distanceLastJump = 0;
                }
            }
        }, 1000 / 60);
    }

    startSmallChickenDeadAnimationLoop() {
        this.smallChickenDeadAnimationLoop = setInterval(() => {
            if (this.isDead()) {
                if (!this.isDeadAnimationPlayed) {
                    this.playAnimation(this.IMAGE_DEAD);
                    this.isDeadAnimationPlayed = true;
                }
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
    }

    stopAllLoops() {
        super.stopAllLoops(); 
        if (this.smallChickenAnimationLoop) {
            clearInterval(this.smallChickenAnimationLoop);
            this.smallChickenAnimationLoop = null;
        }
        if (this.smallChickenDeadAnimationLoop) {
            clearInterval(this.smallChickenDeadAnimationLoop);
            this.smallChickenDeadAnimationLoop = null;
        }
    }

    startAllLoops() {
        if (!this.isDead()) {
            super.startAllLoops(); 
            this.animate(); 
        }
    }
}