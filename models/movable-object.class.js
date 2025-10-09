class MovableObject extends DrawableObject {

    speed = 0.15; 
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    groundY;
    isDeadAnimationPlayed = false;
    isInvulnerable = false;
    gravityLoop;

    applyGravity(){
        if (this.gravityLoop) clearInterval(this.gravityLoop);

        this.gravityLoop = setInterval(() => {
            if (this instanceof Character ) {
                this.applyGroundGravity();
            } 
        }, 1000 / 35);
    }

    applyGroundGravity() {
        if (this.y < this.groundY || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        } else {
            this.y = this.groundY;
            this.speedY = 0;
        }
    }

    isAboveGround(){
        return this.y < this.groundY;
        
        
    }

    isColliding(movableObject) {
        if (!movableObject || !movableObject.offset) return false;
        return this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
            this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
            this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
            this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom;
    }

    hit() {
        if (this.isInvulnerable) return;
        console.log("Character wurde getroffen!");
        if (this instanceof Character) {
            this.reduceCharacterLifePoints()
        } else if (this instanceof Endboss){
            this.reduceEndbossLifePoints()
        }
         this.lastHit = new Date().getTime();

    this.isInvulnerable = true;
    setTimeout(() => {
        this.isInvulnerable = false;
    }, 300); // 0,3 Sekunde Schutzzeit


    }

    reduceCharacterLifePoints(){
        this.characterLifePoints -= 4;
        if (this.characterLifePoints < 0) {
            this.characterLifePoints = 0;
        } 
    }

    reduceEndbossLifePoints(){
        this.endbossLifePoints -= 20;
        if (this.endbossLifePoints < 0) {
            this.endbossLifePoints = 0;
        } 
    }

    takeJumpDamage(){
        if (this.isInvulnerable) {
            return;            
        }
        this.endbossLifePoints -= 15;
        if (this.endbossLifePoints < 0) {
            this.endbossLifePoints = 0;
        } 
        this.lastHit = new Date().getTime();
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
        timepassed = timepassed / 1000; // Difference in seconds
        return timepassed < 1;
    }   

    isDead() {
        if (this.isInvulnerable) return false;
        if (this instanceof Character) return this.characterLifePoints == 0;
        if (this instanceof Endboss) return this.endbossLifePoints == 0;
        return this.energy == 0;
    }


    playAnimation(images){
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 30;
    }

    bounce(enemy) {
        this.isInvulnerable = true; 
        this.speedY = 17; 

        this.y = enemy.y - this.height + enemy.offset.top;

        setTimeout(() => {
            this.isInvulnerable = false;
        }, 200);
    }

    startAllLoops() {
        if (!this.gravityLoop) {
            this.applyGravity(); 
        }
    }

    stopAllLoops() {
        if (this.gravityLoop) {
            clearInterval(this.gravityLoop);
            this.gravityLoop = null;
        }
    }


}