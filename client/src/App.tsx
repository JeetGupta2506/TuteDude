import { useState, useCallback } from 'react';
import { CosmosCanvas } from './canvas/CosmosCanvas';
import { ChatPanel } from './components/ChatPanel';
import { ConnectionIndicator } from './components/ConnectionIndicator';
import { HUD } from './components/HUD';
import { Minimap } from './components/Minimap';
import { UsernamePrompt } from './components/UsernamePrompt';
import { useProximityChat } from './hooks/useProximityChat';
import { useSocket } from './hooks/useSocket';
import { socket } from './socket/socket';
import { MinimapPlayer } from './types';

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [minimapPlayers, setMinimapPlayers] = useState<MinimapPlayer[]>([]);

  useSocket(socket);
  const { connectedPeers, messages, sendMessage, isChatOpen } = useProximityChat(socket);

  const handlePositionChange = useCallback((x: number, y: number) => {
    setPosition({ x, y });
  }, []);

  if (!username) {
    return <UsernamePrompt onSubmit={setUsername} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <CosmosCanvas
        username={username}
        onOnlineCount={setOnlineCount}
        onPositionChange={handlePositionChange}
        onPlayersUpdate={setMinimapPlayers}
      />
      <HUD x={position.x} y={position.y} onlineCount={onlineCount} />
      <Minimap players={minimapPlayers} />
      <ConnectionIndicator connectedPeers={connectedPeers} />
      <ChatPanel
        isOpen={isChatOpen}
        messages={messages}
        connectedPeers={connectedPeers}
        onSend={sendMessage}
      />

      {/* Instructions */}
      <div className="fixed bottom-4 right-4 bg-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-lg px-3 py-2 z-10">
        <p className="text-xs text-gray-500">Use WASD or Arrow keys to move</p>
      </div>
    </div>
  );
}
