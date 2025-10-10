function checkCollisions() {
    world.level.enemies.forEach((enemy) => {
        if (world.character.isColliding(enemy)) {
            checkCharacterEnemyCollision(enemy);
        }
    });

    checkBottleCollisions();
}

function checkBottleCollisions() {
    world.character.bottles.forEach((bottle, bottleIndex) => {
        world.bottleHitObject = false;
        checkBottleEnemyCollisions(bottle, bottleIndex);

        if (world.bottleHitObject) {
            world.removeBottle(bottleIndex);
        }
    });
}

function checkCharacterEnemyCollision(enemy) {
    if (world.character.isAboveGround() && world.character.speedY < 0 && !enemy.isDead()) {
        resolveJumpAttack(enemy);
    }
    else if (!enemy.isDead()) {
        world.character.hit();
    }
}

function resolveJumpAttack(enemy) {
    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
        defeatChickenByJump(enemy);
    }
    else if (enemy instanceof Endboss) {
        damageEndbossByJump(enemy);
    }
}

function defeatChickenByJump(chicken) {
    chicken.energy = 0;
    chicken.isDeadAnimationPlayed = false;
    world.character.bounce(chicken);
    world.removeEnemyAfterTime(chicken, 500);
}

function damageEndbossByJump(endboss) {
    world.endboss.takeJumpDamage();
    endboss.isDeadAnimationPlayed = false;
    world.character.bounce(endboss);
}

function checkBottleEnemyCollisions(bottle) {
    world.level.enemies.forEach((enemy, enemyIndex) => {
        if (bottle.isColliding(enemy) && !enemy.isDead()) {
            world.bottleHitObject = true;
            resolveBottleHitEnemy(enemy, enemyIndex);
        }
    });
}

function resolveBottleHitEnemy(enemy, enemyIndex) {
    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
        defeatChickenByBottle(enemy, enemyIndex);
    }
    else if (enemy instanceof Endboss) {
        damageEndbossByBottle(enemy, enemyIndex);
        world.bottleHitObject = true;
    }
}

function damageEndbossByBottle() {
    world.endboss.hit();
    world.endboss.playAnimation(world.endboss.IMAGES_HURT);
}

function defeatChickenByBottle(chicken, enemyIndex) {
    chicken.energy = 0;
    chicken.isDeadAnimationPlayed = false;
    world.removeEnemyAfterTime(chicken, 500, enemyIndex);
    world.bottleHitObject = true;
}
