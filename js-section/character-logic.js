function handleCharacterDeath(character) {
    if (character.isDead()) {
        character.playAnimation(character.IMAGES_DEAD);
            if (!isGameFinish) {
            character_death.volume = character_death_volume;
            character_death.play();
        }
        
        character.stopAllLoops();
        setTimeout(() => {
            handleLosingScreen();
        }, 1600);

        return true;
    }
    return false;
}

function handleCharacterHurt(character) {
    if (character.isHurt()) {
        character.playAnimation(character.IMAGES_HURT);
        if (!isGameFinish) {
            character_hurt.play();
        }

        character.lastInputTime = Date.now();
        return true;
    }
    return false;
}

function updateJumpAnimation(character) {
    if (character.isAboveGround()) {
        character.playAnimation(character.IMAGES_JUMPING);
        character.lastInputTime = Date.now();
        return true;
    }
    return false;
}

function updateWalkAnimation(character) {
    if (world.keyboard.RIGHT || world.keyboard.LEFT) {
        character.playAnimation(character.IMAGES_WALKING);
    }
}

function processBottleThrow(character) {
    if (world.keyboard.D) {
        let currentTime = new Date().getTime();
        let timeSinceLastThrow = currentTime - character.lastThrow;

        if (timeSinceLastThrow >= character.throwWaitTime && character.collectBottles.length > 0) {
            character.executeBottleThrow(currentTime);
        } 
    }
}