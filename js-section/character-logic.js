function handleCharacterDeath(character) {
    if (character.isDead()) {
        character.playAnimation(character.IMAGES_DEAD);
        
        character.stopAllLoops();

        return true;
    }
    return false;
}


function handleCharacterHurt(character) {
    if (character.isHurt()) {
        character.playAnimation(character.IMAGES_HURT);

        character.lastActivityTime = Date.now();
        return true;
    }
    return false;
}

function updateJumpAnimation(character) {
    if (character.isAboveGround()) {
        character.playAnimation(character.IMAGES_JUMPING);
        character.lastActivityTime = Date.now();
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