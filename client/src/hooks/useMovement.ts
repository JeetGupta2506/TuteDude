import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { MOVE_SPEED, THROTTLE_MS, WORLD_WIDTH, WORLD_HEIGHT, AVATAR_RADIUS } from '../config/constants';

export function useMovement(
  socket: Socket,
  onPositionChange: (x: number, y: number) => void,
  posRef: React.MutableRefObject<{ x: number; y: number }>
) {
  const keysRef = useRef<Set<string>>(new Set());
  const lastEmitRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        keysRef.current.add(key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const tick = () => {
      const keys = keysRef.current;
      let dx = 0;
      let dy = 0;

      if (keys.has('w') || keys.has('arrowup')) dy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) dy += 1;
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
      if (keys.has('d') || keys.has('arrowright')) dx += 1;

      if (dx !== 0 || dy !== 0) {
        // Normalize diagonal
        const len = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / len) * MOVE_SPEED;
        dy = (dy / len) * MOVE_SPEED;

        let newX = posRef.current.x + dx;
        let newY = posRef.current.y + dy;

        // Clamp to world bounds
        newX = Math.max(AVATAR_RADIUS, Math.min(WORLD_WIDTH - AVATAR_RADIUS, newX));
        newY = Math.max(AVATAR_RADIUS, Math.min(WORLD_HEIGHT - AVATAR_RADIUS, newY));

        posRef.current.x = newX;
        posRef.current.y = newY;
        onPositionChange(newX, newY);

        // Throttled emit
        const now = Date.now();
        if (now - lastEmitRef.current >= THROTTLE_MS) {
          socket.emit('user:move', { x: newX, y: newY });
          lastEmitRef.current = now;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [socket, onPositionChange, posRef]);
}
