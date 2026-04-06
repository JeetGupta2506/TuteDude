import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage, ProximityEvent } from '../types';

export function useProximityChat(socket: Socket) {
  const [connectedPeers, setConnectedPeers] = useState<Map<string, string>>(new Map());
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const handleConnect = (data: ProximityEvent) => {
      setConnectedPeers((prev) => {
        const next = new Map(prev);
        next.set(data.peerId, data.username);
        return next;
      });
    };

    const handleDisconnect = (data: { peerId: string }) => {
      setConnectedPeers((prev) => {
        const next = new Map(prev);
        next.delete(data.peerId);
        // Clear messages when no peers left
        if (next.size === 0) {
          setMessages([]);
        }
        return next;
      });
    };

    const handleMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('proximity:connect', handleConnect);
    socket.on('proximity:disconnect', handleDisconnect);
    socket.on('chat:message', handleMessage);

    return () => {
      socket.off('proximity:connect', handleConnect);
      socket.off('proximity:disconnect', handleDisconnect);
      socket.off('chat:message', handleMessage);
    };
  }, [socket]);

  const sendMessage = useCallback(
    (text: string) => {
      if (text.trim() && connectedPeers.size > 0) {
        socket.emit('chat:message', { text: text.trim() });
      }
    },
    [socket, connectedPeers]
  );

  return {
    connectedPeers,
    messages,
    sendMessage,
    isChatOpen: connectedPeers.size > 0,
  };
}
