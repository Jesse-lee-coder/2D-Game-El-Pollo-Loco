class Chicken extends MovableObject {
    character;
    y = 365;
    height = 60;
    width = 80;
    chickenLifePoints = 10;
    chickenAnimationLoop;
    chickenMovementLoop;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };


    IMAGES_WALKING = [
        'img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'img/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.speed = 0.5 + Math.random() * 1;
        let randomX = 800 + Math.random() * 2000;
        this.x = Math.round(randomX / 150) * 150;
        this.animate();
    }

    animate() {
        if (this.chickenAnimationLoop) {
            clearInterval(this.chickenAnimationLoop);
        }
        this.startChickenAnimationLoop();
        if (this.chickenMovementLoop) {
            clearInterval(this.chickenMovementLoop);
        }
        this.startChickenMovementLoop();
    }

    startChickenAnimationLoop() {
        this.chickenAnimationLoop = setInterval(() => {
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

    startChickenMovementLoop() {
        this.chickenMovementLoop = setInterval(() => {
            if (!this.isDead()) {
                this.checkCharacterDirection();
            }
        }, 1000 / 60);
    }

    checkCharacterDirection() {
        if (this.character) {
            if (this.character.x > this.x + 10) {
                this.moveRight();
                this.otherDirection = true;
            } else if (this.character.x < this.x - 10) {
                this.moveLeft();
                this.otherDirection = false;
            }
        } else {
            this.moveLeft();
            this.otherDirection = false;
        }
    }

    startAllLoops() {
        if (!this.isDead()) {
            this.animate();
        }
    }

    stopAllLoops() {
        super.stopAllLoops();

        if (this.chickenAnimationLoop) {
            clearInterval(this.chickenAnimationLoop);
            this.chickenAnimationLoop = null;
        }
        if (this.chickenMovementLoop) {
            clearInterval(this.chickenMovementLoop);
            this.chickenMovementLoop = null;
        }
    }





}


