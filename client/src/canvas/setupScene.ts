import * as PIXI from 'pixi.js';
import { WORLD_WIDTH, WORLD_HEIGHT, ZONES } from '../config/constants';

export function setupScene(app: PIXI.Application): PIXI.Container {
  const worldContainer = new PIXI.Container();
  app.stage.addChild(worldContainer);

  // Dark space background
  const bg = new PIXI.Graphics();
  bg.beginFill(0x0a0a2e);
  bg.drawRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  bg.endFill();
  worldContainer.addChild(bg);

  // Grid lines
  const grid = new PIXI.Graphics();
  grid.lineStyle(1, 0xffffff, 0.04);
  for (let x = 0; x <= WORLD_WIDTH; x += 100) {
    grid.moveTo(x, 0);
    grid.lineTo(x, WORLD_HEIGHT);
  }
  for (let y = 0; y <= WORLD_HEIGHT; y += 100) {
    grid.moveTo(0, y);
    grid.lineTo(WORLD_WIDTH, y);
  }
  worldContainer.addChild(grid);

  // Zones
  for (const zone of ZONES) {
    const zoneContainer = new PIXI.Container();

    // Zone fill
    const fill = new PIXI.Graphics();
    fill.beginFill(zone.color, 0.5);
    fill.drawRoundedRect(zone.x, zone.y, zone.width, zone.height, 16);
    fill.endFill();
    zoneContainer.addChild(fill);

    // Zone border
    const border = new PIXI.Graphics();
    border.lineStyle(2, zone.borderColor, 0.6);
    border.drawRoundedRect(zone.x, zone.y, zone.width, zone.height, 16);
    zoneContainer.addChild(border);

    // Corner accent lines (decorative)
    const accents = new PIXI.Graphics();
    accents.lineStyle(2, zone.borderColor, 0.3);
    const accentLen = 30;
    // Top-left
    accents.moveTo(zone.x + 16, zone.y);
    accents.lineTo(zone.x + 16 + accentLen, zone.y);
    accents.moveTo(zone.x, zone.y + 16);
    accents.lineTo(zone.x, zone.y + 16 + accentLen);
    // Top-right
    accents.moveTo(zone.x + zone.width - 16, zone.y);
    accents.lineTo(zone.x + zone.width - 16 - accentLen, zone.y);
    accents.moveTo(zone.x + zone.width, zone.y + 16);
    accents.lineTo(zone.x + zone.width, zone.y + 16 + accentLen);
    zoneContainer.addChild(accents);

    // Emoji icon (top-left inside zone)
    const emoji = new PIXI.Text(zone.emoji, {
      fontSize: 28,
    });
    emoji.x = zone.x + 16;
    emoji.y = zone.y + 12;
    zoneContainer.addChild(emoji);

    // Zone name label
    const label = new PIXI.Text(zone.name, {
      fontSize: 20,
      fontWeight: 'bold',
      fill: zone.borderColor,
      fontFamily: 'Segoe UI, system-ui, sans-serif',
    });
    label.x = zone.x + 52;
    label.y = zone.y + 16;
    zoneContainer.addChild(label);

    // Subtle inner glow dots (decorative)
    const dots = new PIXI.Graphics();
    for (let i = 0; i < 8; i++) {
      const dx = zone.x + 40 + Math.random() * (zone.width - 80);
      const dy = zone.y + 60 + Math.random() * (zone.height - 100);
      dots.beginFill(zone.borderColor, 0.08);
      dots.drawCircle(dx, dy, Math.random() * 20 + 10);
      dots.endFill();
    }
    zoneContainer.addChild(dots);

    worldContainer.addChild(zoneContainer);
  }

  // Stars
  const stars = new PIXI.Graphics();
  for (let i = 0; i < 300; i++) {
    const sx = Math.random() * WORLD_WIDTH;
    const sy = Math.random() * WORLD_HEIGHT;
    const size = Math.random() * 2 + 0.5;
    const alpha = Math.random() * 0.6 + 0.2;
    stars.beginFill(0xffffff, alpha);
    stars.drawCircle(sx, sy, size);
    stars.endFill();
  }
  worldContainer.addChild(stars);

  // World border
  const worldBorder = new PIXI.Graphics();
  worldBorder.lineStyle(2, 0x4444ff, 0.3);
  worldBorder.drawRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  worldContainer.addChild(worldBorder);

  return worldContainer;
}
