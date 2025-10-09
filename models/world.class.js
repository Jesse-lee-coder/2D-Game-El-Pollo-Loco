class World {
    level = level1;
    character = new Character();
    endboss;
    movableObject = new MovableObject();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBar('health');
    statusBarCoins = new StatusBar('coins');
    statusBarBottles = new StatusBar('bottle');
    statusBarEndboss = new StatusBar('endboss');
    displayEndbossStatusBar = false;
    //throwableObjects = [];
    bottleHitObject = false;
    totalAmountOfCoins;
    totalAmountOfBottles;
    gameLoop;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        //this.run();
        this.startGameLoop();
        this.totalAmountOfBottles = this.level.bottles.length;
        this.totalAmountOfCoins = this.level.coins.length;
    }

    setWorld() {
        this.character.world = this;
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        this.level.enemies.forEach(enemy => {
      enemy.world = this;
      if (enemy instanceof Chicken || enemy instanceof Endboss) {
        enemy.character = this.character;
      }
    });
    }

    startGameLoop() {
        this.gameLoop = setInterval(() => {
            checkCollisions();
            this.handleItemCollection(this.level.bottles, this.character.collectBottles, 700);
            this.handleItemCollection(this.level.coins, this.character.collectCoins, 500);
            this.updateStatusBars();
        }, 20);
    }

    updateStatusBars() {
        this.statusBarHealth.setPercentage(this.character.characterLifePoints);

        if(this.endboss) {
            this.statusBarEndboss.setPercentage(this.endboss.endbossLifePoints);
        }

        this.updateStatusBarProgress(
            this.totalAmountOfBottles,
            this.character.collectBottles,
            this.statusBarBottles
        );        
        
        this.updateStatusBarProgress(
            this.totalAmountOfCoins,
            this.character.collectCoins,
            this.statusBarCoins
        );
    }

    updateStatusBarProgress(totalItemsAmount, collectedItems, statusBar) {
        if (totalItemsAmount > 0) {
            let percentage = (collectedItems.length / totalItemsAmount) * 100;
            statusBar.setPercentage(percentage);
        }

    }

    handleItemCollection(worldItems, collectedItems) {
    
        worldItems.forEach((item, index) => {
            if (this.character.isColliding(item)) {
        
            collectedItems.push(item);

            worldItems.splice(index, 1);
            }
  });

    }

/*
    run() {
        setInterval(() => {

            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }*/

    removeEnemyAfterTime(removeEnemy, timeMs, indexToRemove = -1) {
        setTimeout(() => {
      const currentEnemyIndex = indexToRemove !== -1 ? indexToRemove : this.level.enemies.indexOf(removeEnemy);

      if (currentEnemyIndex > -1) {
        this.level.enemies.splice(currentEnemyIndex, 1);
      }
    }, timeMs);
   }

    removeBottle(bottleIndex) {
    this.character.bottles.splice(bottleIndex, 1);
  }

  /*
    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100)
            this.throwableObjects.push(bottle);
            
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusBarHealth.setPercentage(this.character.characterLifePoints);
        }    
    });
}*/


    draw() {
        this.drawBackgroundLayer();
        this.drawUILayer();
        this.drawGameLayer();
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    drawBackgroundLayer() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects)
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawUILayer() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        if (this.displayEndbossStatusBar) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    drawGameLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        //this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.character.bottles);
        this.ctx.translate(-this.camera_x, 0);
    }
   


    addObjectsToMap(objects){
        objects.forEach( o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if(mo.otherDirection) {
            this.flipImage(mo);
        };

        mo.draw(this.ctx);
        //mo.drawFrame(this.ctx);

        if(mo.otherDirection) {
            this.flipImageBack(mo);
        };
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
// Param Kommentare hinzufügen
}