export function resetSceneTransition(scene) {
  scene.__sceneTransitionPending = false;
}

export function beginSceneTransition(scene, targetKey, data, options = {}) {
  if (scene.__sceneTransitionPending) return false;
  scene.__sceneTransitionPending = true;
  const start = () => scene.scene.start(targetKey, data);
  if ((options.delayMs || 0) > 0) scene.time.delayedCall(options.delayMs, start);
  else start();
  return true;
}

export function restartSceneOnce(scene, data) {
  if (scene.__sceneTransitionPending) return false;
  scene.__sceneTransitionPending = true;
  scene.scene.restart(data);
  return true;
}
