import { Socket, Server } from 'socket.io';
import { PlayerState, checkProximity } from './proximity';

export function handleMovement(
  socket: Socket,
  io: Server,
  players: Map<string, PlayerState>
) {
  socket.on('user:move', (data: { x: number; y: number }) => {
    const player = players.get(socket.id);
    if (!player) return;

    player.x = data.x;
    player.y = data.y;

    socket.broadcast.emit('user:moved', {
      socketId: socket.id,
      x: data.x,
      y: data.y,
    });

    checkProximity(socket.id, players, io);
  });
}
