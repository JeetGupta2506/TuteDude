import { useRef, useEffect } from 'react';
import { WORLD_WIDTH, WORLD_HEIGHT, ZONES } from '../config/constants';
import { MinimapPlayer } from '../types';

const MAP_WIDTH = 160;
const MAP_HEIGHT = 160;
const SCALE_X = MAP_WIDTH / WORLD_WIDTH;
const SCALE_Y = MAP_HEIGHT / WORLD_HEIGHT;

function hexToRgba(hex: number, alpha: number): string {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface MinimapProps {
  players: MinimapPlayer[];
}

export function Minimap({ players }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0a0a2e';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Border
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= MAP_WIDTH; x += MAP_WIDTH / 6) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MAP_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= MAP_HEIGHT; y += MAP_HEIGHT / 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(MAP_WIDTH, y);
      ctx.stroke();
    }

    // Draw zones
    for (const zone of ZONES) {
      const zx = zone.x * SCALE_X;
      const zy = zone.y * SCALE_Y;
      const zw = zone.width * SCALE_X;
      const zh = zone.height * SCALE_Y;

      ctx.fillStyle = hexToRgba(zone.borderColor, 0.15);
      ctx.fillRect(zx, zy, zw, zh);
      ctx.strokeStyle = hexToRgba(zone.borderColor, 0.4);
      ctx.lineWidth = 0.5;
      ctx.strokeRect(zx, zy, zw, zh);
    }

    // Draw players
    for (const p of players) {
      const mx = p.x * SCALE_X;
      const my = p.y * SCALE_Y;

      if (p.isLocal) {
        // Local player — larger, bright with glow
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#818cf8';
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // View cone (small box showing approximate viewport)
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)';
        ctx.lineWidth = 0.5;
        const vw = (window.innerWidth * SCALE_X);
        const vh = (window.innerHeight * SCALE_Y);
        ctx.strokeRect(mx - vw / 2, my - vh / 2, vw, vh);
      } else {
        // Remote player — smaller, white
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [players]);

  return (
    <div className="fixed top-4 right-4 z-10">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-1.5">
        <p className="text-[10px] text-gray-500 text-center mb-1">MINIMAP</p>
        <canvas
          ref={canvasRef}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          className="rounded"
        />
      </div>
    </div>
  );
}
