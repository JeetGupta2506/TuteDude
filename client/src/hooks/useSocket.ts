import { useEffect } from 'react';
import { Socket } from 'socket.io-client';

export function useSocket(socket: Socket) {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);
}
