class CollectBottle extends MovableObject {
    
    x = 300;
    y = 290;

    offset = {
        top: 30,
        left: 30,
        right: 27,
        bottom: 25
    };

    constructor(path) {
        super().loadImage(path)
        this.x = 400 + Math.random() * 2000;
    }
}