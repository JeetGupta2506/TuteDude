import { useEffect, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { setupScene } from './setupScene';
import { PlayerAvatar } from './PlayerAvatar';
import { updateCamera } from './camera';
import { socket } from '../socket/socket';
import { useMovement } from '../hooks/useMovement';
import { useOtherPlayers } from '../hooks/useOtherPlayers';
import { WORLD_WIDTH, WORLD_HEIGHT } from '../config/constants';
import { Player, MinimapPlayer } from '../types';

interface CosmosCanvasProps {
  username: string;
  onOnlineCount: (count: number) => void;
  onPositionChange: (x: number, y: number) => void;
  onPlayersUpdate: (players: MinimapPlayer[]) => void;
}

export function CosmosCanvas({ username, onOnlineCount, onPositionChange, onPlayersUpdate }: CosmosCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const worldRef = useRef<PIXI.Container | null>(null);
  const localAvatarRef = useRef<PlayerAvatar | null>(null);
  const remoteAvatarsRef = useRef<Map<string, PlayerAvatar>>(new Map());
  const localPosRef = useRef({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 });

  const handlePositionChange = useCallback((x: number, y: number) => {
    localPosRef.current = { x, y };
    localAvatarRef.current?.setPosition(x, y);
    onPositionChange(x, y);
  }, [onPositionChange]);

  useMovement(socket, handlePositionChange, localPosRef);

  const handlePlayerJoined = useCallback((player: Player) => {
    const world = worldRef.current;
    if (!world || player.socketId === socket.id) return;
    if (remoteAvatarsRef.current.has(player.socketId)) return;

    const avatar = new PlayerAvatar(player.username, player.x, player.y, false);
    world.addChild(avatar.container);
    remoteAvatarsRef.current.set(player.socketId, avatar);
    onOnlineCount(remoteAvatarsRef.current.size + 1);
  }, [onOnlineCount]);

  const handlePlayerMoved = useCallback((data: { socketId: string; x: number; y: number }) => {
    const avatar = remoteAvatarsRef.current.get(data.socketId);
    if (avatar) {
      avatar.setTarget(data.x, data.y);
    }
  }, []);

  const handlePlayerLeft = useCallback((data: { socketId: string }) => {
    const avatar = remoteAvatarsRef.current.get(data.socketId);
    if (avatar) {
      avatar.destroy();
      remoteAvatarsRef.current.delete(data.socketId);
      onOnlineCount(remoteAvatarsRef.current.size + 1);
    }
  }, [onOnlineCount]);

  const handleWorldState = useCallback((data: { players: Player[] }) => {
    const world = worldRef.current;
    if (!world) return;

    for (const player of data.players) {
      if (player.socketId === socket.id) {
        // Set local player position from server
        localPosRef.current = { x: player.x, y: player.y };
        localAvatarRef.current?.setPosition(player.x, player.y);
        continue;
      }
      if (remoteAvatarsRef.current.has(player.socketId)) continue;

      const avatar = new PlayerAvatar(player.username, player.x, player.y, false);
      world.addChild(avatar.container);
      remoteAvatarsRef.current.set(player.socketId, avatar);
    }
    onOnlineCount(remoteAvatarsRef.current.size + 1);
  }, [onOnlineCount]);

  useOtherPlayers(socket, handlePlayerJoined, handlePlayerMoved, handlePlayerLeft, handleWorldState);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000011,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;

    const worldContainer = setupScene(app);
    worldRef.current = worldContainer;

    // Create local avatar
    const localAvatar = new PlayerAvatar(
      username,
      localPosRef.current.x,
      localPosRef.current.y,
      true
    );
    worldContainer.addChild(localAvatar.container);
    localAvatarRef.current = localAvatar;

    // Connect socket and join
    socket.connect();
    socket.emit('user:join', { username });

    // Game loop
    let minimapFrame = 0;
    app.ticker.add(() => {
      // Update camera
      updateCamera(
        worldContainer,
        localPosRef.current.x,
        localPosRef.current.y,
        app.screen.width,
        app.screen.height
      );

      // Interpolate remote avatars
      for (const avatar of remoteAvatarsRef.current.values()) {
        avatar.update();
      }

      // Update minimap every 6 frames (~10fps) to avoid excessive re-renders
      minimapFrame++;
      if (minimapFrame % 6 === 0) {
        const minimapPlayers: MinimapPlayer[] = [
          { x: localPosRef.current.x, y: localPosRef.current.y, isLocal: true },
        ];
        for (const avatar of remoteAvatarsRef.current.values()) {
          minimapPlayers.push({
            x: avatar.container.x,
            y: avatar.container.y,
            isLocal: false,
          });
        }
        onPlayersUpdate(minimapPlayers);
      }
    });

    // Handle resize
    const handleResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      socket.disconnect();
      app.destroy(true);
      appRef.current = null;
    };
  }, [username]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
