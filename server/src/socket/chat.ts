import { Socket, Server } from 'socket.io';
import { PlayerState } from './proximity';

export function handleChat(
  socket: Socket,
  io: Server,
  players: Map<string, PlayerState>
) {
  socket.on('chat:message', (data: { text: string }) => {
    const sender = players.get(socket.id);
    if (!sender) return;

    const message = {
      from: sender.username,
      fromId: socket.id,
      text: data.text,
      timestamp: Date.now(),
    };

    // Send to all connected peers
    for (const peerId of sender.connections) {
      io.to(peerId).emit('chat:message', message);
    }

    // Echo back to sender
    socket.emit('chat:message', message);
  });
}
