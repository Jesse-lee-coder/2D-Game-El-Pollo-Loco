/**
 * Stops the main world loop and all object-related loops.
 */
function stopAllLoops() {
  if (!world) return;

  if (world.gameLoop) {
    clearInterval(world.gameLoop);
    world.gameLoop = null;
  }

  if (world.character?.stopAllLoops) world.character.stopAllLoops();

  const groups = ["enemies", "clouds", "bottles", "coins"];
  groups.forEach(g => pauseCollectionProcesses(world.level[g]));
}


/**
 * Starts the main world loop and all object-related loops.
 */
function startAllLoops() {
  if (!world) return;

  if (!world.gameLoop && world.startGameLoop) world.startGameLoop();

  if (world.character?.startAllLoops) world.character.startAllLoops();

  const groups = ["enemies", "clouds", "bottles", "coins"];
  groups.forEach(g => activateCollectionProcesses(world.level[g]));
}


/**
 * Starts only character loops (movement/animation/gravity).
 */
function startCharacterLoops() {
  if (world && world.character && typeof world.character.startAllLoops === "function") {
    world.character.startAllLoops();
  }
}

/**
 * Starts loops for objects that support startAllLoops().
 * Dead Character/MovableObject instances are skipped.
 * @param {any[]|null|undefined} objectsArray
 */
function activateCollectionProcesses(objectsArray) {
  if (!objectsArray) return;

  objectsArray.forEach((obj) => {
    const isMoving = obj instanceof Character || obj instanceof MovableObject;
    const canStart = !isMoving || !obj.isDead();
    if (obj && canStart && typeof obj.startAllLoops === "function") obj.startAllLoops();
  });
}

/**
 * Stops loops for objects that support stopAllLoops().
 * @param {any[]|null|undefined} objectsArray
 */
function pauseCollectionProcesses(objectsArray) {
  if (!objectsArray) return;

  objectsArray.forEach((obj) => {
    if (obj && typeof obj.stopAllLoops === "function") obj.stopAllLoops();
  });
}

/**
 * Stops only the main world interval loop.
 */
function stopMainWorldLoop() {
  if (!world || !world.gameLoop) return;
  clearInterval(world.gameLoop);
  world.gameLoop = null;
}

/**
 * Stops only the character loops (movement/animation/gravity).
 */
function stopCharacterLoops() {
  if (world && world.character && typeof world.character.stopAllLoops === "function") {
    world.character.stopAllLoops();
  }
}

/**
 * Starts only the main world loop.
 */
function startMainWorldLoop() {
  if (world && typeof world.startGameLoop === "function") world.startGameLoop();
}
