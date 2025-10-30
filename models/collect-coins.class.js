class CollectCoins extends MovableObject {

    height = 130;
    width = 130; 
    x = 300;
    y = 250;
    initialY;
    animationDirection = 1;
    animationSpeedY = 0.8;
    animationRangeY = 12;
    coinsAnimationLoop;
    coinsFloatingLoop;

    offset = {
        top: 47,
        left: 47,
        right: 48,
        bottom: 47
    };

    IMAGES_COINS = [
        'img/img/8_coin/coin_1.png',
        'img/img/8_coin/coin_2.png'
    ]

    constructor() {
        super().loadImage('img/img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COINS);
        let randomX = 300 + Math.random() * 2100;
        this.x = Math.round(randomX / 40) * 40;
        let randomY = 110 + Math.random() * 210;
        this.y = Math.round(randomY / 20) * 20;
        this.initialY = this.y;
        this.animateFloatingEffect();
    }

    animateFloatingEffect() {
            this.coinsAnimationLoop = setInterval(() => {
            this.playAnimation(this.IMAGES_COINS)
        }, 400);
        this.updateFloating();
    }

    updateFloating() {
        this.coinsFloatingLoop = setInterval(() => {
            if (this.animationDirection === 1) {
                this.y -= this.animationSpeedY;
                if (this.y <= this.initialY - this.animationRangeY) {
                    this.animationDirection = -1;
                }
            } else {
                this.y += this.animationSpeedY;
                if (this.y >= this.initialY + this.animationRangeY) {
                    this.animationDirection = 1;
                }
            }
        }, 1000 / 60);        
    }

    stopAllLoops() {
        if (this.coinsAnimationLoop) {
            clearInterval(this.coinsAnimationLoop);
            this.coinsAnimationLoop = null;
        }
        if (this.coinsFloatingLoop) {
            clearInterval(this.coinsFloatingLoop);
            this.coinsFloatingLoop = null;
        }
    }

    startAllLoops() {
        this.animateFloatingEffect();
    }
}