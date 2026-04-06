import { Server } from 'socket.io';
import { euclidean } from '../utils/distance';
import { PROXIMITY_RADIUS } from '../config';

export interface PlayerState {
  socketId: string;
  username: string;
  x: number;
  y: number;
  connections: Set<string>;
}

export function checkProximity(
  movedPlayerId: string,
  players: Map<string, PlayerState>,
  io: Server
) {
  const movedPlayer = players.get(movedPlayerId);
  if (!movedPlayer) return;

  for (const [otherId, otherPlayer] of players) {
    if (otherId === movedPlayerId) continue;

    const dist = euclidean(movedPlayer.x, movedPlayer.y, otherPlayer.x, otherPlayer.y);
    const wasConnected = movedPlayer.connections.has(otherId);

    if (dist < PROXIMITY_RADIUS && !wasConnected) {
      movedPlayer.connections.add(otherId);
      otherPlayer.connections.add(movedPlayerId);
      io.to(movedPlayerId).emit('proximity:connect', {
        peerId: otherId,
        username: otherPlayer.username,
      });
      io.to(otherId).emit('proximity:connect', {
        peerId: movedPlayerId,
        username: movedPlayer.username,
      });
    } else if (dist >= PROXIMITY_RADIUS && wasConnected) {
      movedPlayer.connections.delete(otherId);
      otherPlayer.connections.delete(movedPlayerId);
      io.to(movedPlayerId).emit('proximity:disconnect', { peerId: otherId });
      io.to(otherId).emit('proximity:disconnect', { peerId: movedPlayerId });
    }
  }
}
