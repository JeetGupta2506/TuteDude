export const WORLD_WIDTH = 3000;
export const WORLD_HEIGHT = 3000;
export const PROXIMITY_RADIUS = 150;
export const MOVE_SPEED = 3;
export const THROTTLE_MS = 60;
export const INTERPOLATION_SPEED = 0.15;
export const SOCKET_URL = 'http://localhost:3001';
export const AVATAR_RADIUS = 20;

export interface Zone {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;      // fill color
  borderColor: number; // border color
  emoji: string;
}

export const ZONES: Zone[] = [
  {
    name: 'Lounge',
    x: 200,
    y: 200,
    width: 600,
    height: 500,
    color: 0x1a1a4e,
    borderColor: 0x6366f1,
    emoji: '\u2615',
  },
  {
    name: 'Meeting Room',
    x: 1100,
    y: 200,
    width: 700,
    height: 500,
    color: 0x1a3a2e,
    borderColor: 0x22c55e,
    emoji: '\uD83D\uDCBC',
  },
  {
    name: 'Playground',
    x: 2000,
    y: 200,
    width: 700,
    height: 500,
    color: 0x3a1a3e,
    borderColor: 0xd946ef,
    emoji: '\uD83C\uDFAE',
  },
  {
    name: 'Library',
    x: 200,
    y: 1000,
    width: 600,
    height: 500,
    color: 0x2e2a1a,
    borderColor: 0xeab308,
    emoji: '\uD83D\uDCDA',
  },
  {
    name: 'Garden',
    x: 1100,
    y: 1000,
    width: 700,
    height: 500,
    color: 0x0e2e1a,
    borderColor: 0x10b981,
    emoji: '\uD83C\uDF3F',
  },
  {
    name: 'Auditorium',
    x: 2000,
    y: 1000,
    width: 700,
    height: 500,
    color: 0x2e1a1a,
    borderColor: 0xef4444,
    emoji: '\uD83C\uDFA4',
  },
  {
    name: 'Cafe',
    x: 200,
    y: 1800,
    width: 600,
    height: 500,
    color: 0x2e1e0e,
    borderColor: 0xf97316,
    emoji: '\u2615',
  },
  {
    name: 'Studio',
    x: 1100,
    y: 1800,
    width: 700,
    height: 500,
    color: 0x1a1e3e,
    borderColor: 0x3b82f6,
    emoji: '\uD83C\uDFA8',
  },
  {
    name: 'Rooftop',
    x: 2000,
    y: 1800,
    width: 700,
    height: 500,
    color: 0x1e1e2e,
    borderColor: 0x8b5cf6,
    emoji: '\u2B50',
  },
];
