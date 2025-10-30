function startAllLoops() {
    startMainWorldLoop();
    startCharacterLoops();
    activateCollectionProcesses(world.level.enemies);
    activateCollectionProcesses(world.character.bottles);
    activateCollectionProcesses(world.level.coins);
    activateCollectionProcesses(world.level.clouds);
    playMusicTracks();
}

function stopAllLoops() {
    stopMainWorldLoop();
    stopCharacterLoops();
    pauseCollectionProcesses(world.level.enemies);
    pauseCollectionProcesses(world.character.bottles);
    pauseCollectionProcesses(world.level.coins);
    pauseCollectionProcesses(world.level.clouds);
    pauseSpecificAudio();
    pauseAllAudio();
}

function startCharacterLoops() {
    if (world.character && typeof world.character.startAllLoops === 'function') {
        world.character.startAllLoops();
    }
}

function activateCollectionProcesses(objectsArray) {
    if (objectsArray) {
        objectsArray.forEach(obj => {
            const canStart = (obj instanceof Character || obj instanceof MovableObject) ? !obj.isDead() : true;
            if (obj && canStart && typeof obj.startAllLoops === 'function') {
                obj.startAllLoops();
            }
        });
    }
}

function pauseCollectionProcesses(objectsArray) {
    if (objectsArray) {
        objectsArray.forEach(obj => {
            if (obj && typeof obj.stopAllLoops === 'function') {
                obj.stopAllLoops();
            }
        });
    }
}

function stopMainWorldLoop() {
    if (world.gameLoop) {
        clearInterval(this.gameLoop);
        world.gameLoop = null;
    }
}

function stopCharacterLoops() {
    if (world.character && typeof world.character.stopAllLoops === 'function') {
        world.character.stopAllLoops();
    }
}

function startMainWorldLoop() {
    world.startGameLoop();
}