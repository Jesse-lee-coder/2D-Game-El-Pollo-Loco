class Cloud extends MovableObject {
    speed = 0.6;
    width = 450;
    height = 250;
    animateCloudsLoops;
    world;

   
    constructor(path, x) {
        super().loadImage(path);
        this.x = x;
        this.y = 10 + Math.random() * 35;
        this.animateClouds();
    }

    animateClouds() {
        if (!this.animateCloudsLoops) {
            this.animateCloudsLoop = setInterval(() => {
                this.moveLeft(); 
            }, 1000 / 60); 
        }
    }

    startAllLoops() {
        this.animateClouds();
    }

    stopAllLoops() {
        if (this.animateCloudsLoops) {
            clearInterval(this.animateCloudsLoops);
            this.animateCloudsLoops = null;
        }
    }

}