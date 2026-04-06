import * as PIXI from 'pixi.js';
import { AVATAR_RADIUS, PROXIMITY_RADIUS, INTERPOLATION_SPEED } from '../config/constants';

function hashColor(username: string): number {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  // Convert HSL to hex (s=70%, l=60%)
  const s = 0.7, l = 0.6;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (hue < 60) { r = c; g = x; }
  else if (hue < 120) { r = x; g = c; }
  else if (hue < 180) { g = c; b = x; }
  else if (hue < 240) { g = x; b = c; }
  else if (hue < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (v: number) => Math.round((v + m) * 255);
  return (toHex(r) << 16) + (toHex(g) << 8) + toHex(b);
}

export class PlayerAvatar {
  container: PIXI.Container;
  private circle: PIXI.Graphics;
  private label: PIXI.Text;
  private radiusCircle: PIXI.Graphics | null = null;
  private glowCircle: PIXI.Graphics;
  private isLocal: boolean;
  private color: number;

  targetX: number;
  targetY: number;

  constructor(username: string, x: number, y: number, isLocal: boolean) {
    this.isLocal = isLocal;
    this.targetX = x;
    this.targetY = y;
    this.color = hashColor(username);

    this.container = new PIXI.Container();
    this.container.x = x;
    this.container.y = y;

    // Glow (hidden by default)
    this.glowCircle = new PIXI.Graphics();
    this.glowCircle.beginFill(this.color, 0.15);
    this.glowCircle.drawCircle(0, 0, AVATAR_RADIUS + 12);
    this.glowCircle.endFill();
    this.glowCircle.visible = false;
    this.container.addChild(this.glowCircle);

    // Main circle
    this.circle = new PIXI.Graphics();
    this.circle.beginFill(this.color);
    this.circle.drawCircle(0, 0, AVATAR_RADIUS);
    this.circle.endFill();
    // White border
    this.circle.lineStyle(2, 0xffffff, 0.8);
    this.circle.drawCircle(0, 0, AVATAR_RADIUS);
    this.container.addChild(this.circle);

    // Username label
    this.label = new PIXI.Text(username, {
      fontSize: 12,
      fill: 0xffffff,
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      align: 'center',
    });
    this.label.anchor.set(0.5, 0);
    this.label.y = AVATAR_RADIUS + 6;
    this.container.addChild(this.label);

    // Proximity radius indicator (local player only)
    if (isLocal) {
      this.radiusCircle = new PIXI.Graphics();
      this.radiusCircle.lineStyle(1, 0xffffff, 0.15);
      this.radiusCircle.drawCircle(0, 0, PROXIMITY_RADIUS);
      this.container.addChild(this.radiusCircle);
    }
  }

  setPosition(x: number, y: number) {
    this.container.x = x;
    this.container.y = y;
    this.targetX = x;
    this.targetY = y;
  }

  setTarget(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  update() {
    if (!this.isLocal) {
      this.container.x += (this.targetX - this.container.x) * INTERPOLATION_SPEED;
      this.container.y += (this.targetY - this.container.y) * INTERPOLATION_SPEED;
    }
  }

  highlight(connected: boolean) {
    this.glowCircle.visible = connected;
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
