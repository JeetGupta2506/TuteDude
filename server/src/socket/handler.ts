import { Server } from 'socket.io';
import { WORLD_WIDTH, WORLD_HEIGHT } from '../config';
import { PlayerState } from './proximity';
import { handleMovement } from './movement';
import { handleChat } from './chat';
import { User } from '../models/User';

const players = new Map<string, PlayerState>();
let dbConnected = false;

export function setDbConnected(connected: boolean) {
  dbConnected = connected;
}

export function registerSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('user:join', async (data: { username: string }) => {
      const x = Math.random() * (WORLD_WIDTH - 200) + 100;
      const y = Math.random() * (WORLD_HEIGHT - 200) + 100;

      const player: PlayerState = {
        socketId: socket.id,
        username: data.username,
        x,
        y,
        connections: new Set(),
      };

      players.set(socket.id, player);

      // Persist to MongoDB (only if connected)
      if (dbConnected) {
        try {
          await User.findOneAndUpdate(
            { socketId: socket.id },
            { socketId: socket.id, username: data.username, position: { x, y }, lastActive: new Date() },
            { upsert: true }
          );
        } catch (err) {
          console.error('DB save error:', err);
        }
      }

      // Send existing players to the new user
      const existingPlayers = Array.from(players.values()).map((p) => ({
        socketId: p.socketId,
        username: p.username,
        x: p.x,
        y: p.y,
      }));
      socket.emit('world:state', { players: existingPlayers });

      // Broadcast new user to everyone else
      socket.broadcast.emit('user:joined', {
        socketId: socket.id,
        username: data.username,
        x,
        y,
      });
    });

    handleMovement(socket, io, players);
    handleChat(socket, io, players);

    socket.on('disconnect', async () => {
      const player = players.get(socket.id);
      if (player) {
        // Notify connected peers about disconnection
        for (const peerId of player.connections) {
          const peer = players.get(peerId);
          if (peer) {
            peer.connections.delete(socket.id);
            io.to(peerId).emit('proximity:disconnect', { peerId: socket.id });
          }
        }

        players.delete(socket.id);

        if (dbConnected) {
          try {
            await User.deleteOne({ socketId: socket.id });
          } catch (err) {
            console.error('DB delete error:', err);
          }
        }
      }

      socket.broadcast.emit('user:left', { socketId: socket.id });
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
