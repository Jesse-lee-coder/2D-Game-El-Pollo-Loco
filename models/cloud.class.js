class Cloud extends MovableObject {

    world;
    height = 250;
    width = 450;
    speed = 0.6;
    animateCloudsLoop;
    
    constructor(path, x) {
        super().loadImage(path);
        this.x = x;
        this.y = 10 + Math.random() * 35;
        this.animateClouds();
    }

    animateClouds() {
        if (!this.animateCloudsLoop) {
            this.animateCloudsLoop = setInterval(() => {
                this.moveLeft(); 
            }, 1000 / 60); 
        }
    }

    stopAllLoops() {
        if (this.animateCloudsLoop) {
            clearInterval(this.animateCloudsLoop);
            this.animateCloudsLoop = null;
        }
    }

    startAllLoops() {
        this.animateClouds();
    }
}