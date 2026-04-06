import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Player } from '../types';

export function useOtherPlayers(
  socket: Socket,
  onPlayerJoined: (player: Player) => void,
  onPlayerMoved: (data: { socketId: string; x: number; y: number }) => void,
  onPlayerLeft: (data: { socketId: string }) => void,
  onWorldState: (data: { players: Player[] }) => void
) {
  useEffect(() => {
    socket.on('world:state', onWorldState);
    socket.on('user:joined', onPlayerJoined);
    socket.on('user:moved', onPlayerMoved);
    socket.on('user:left', onPlayerLeft);

    return () => {
      socket.off('world:state', onWorldState);
      socket.off('user:joined', onPlayerJoined);
      socket.off('user:moved', onPlayerMoved);
      socket.off('user:left', onPlayerLeft);
    };
  }, [socket, onPlayerJoined, onPlayerMoved, onPlayerLeft, onWorldState]);
}
