import * as PIXI from 'pixi.js';

export function updateCamera(
  worldContainer: PIXI.Container,
  localX: number,
  localY: number,
  screenWidth: number,
  screenHeight: number
) {
  worldContainer.x = screenWidth / 2 - localX;
  worldContainer.y = screenHeight / 2 - localY;
}
