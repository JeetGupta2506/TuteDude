interface ConnectionIndicatorProps {
  connectedPeers: Map<string, string>;
}

export function ConnectionIndicator({ connectedPeers }: ConnectionIndicatorProps) {
  if (connectedPeers.size === 0) return null;

  const peers = Array.from(connectedPeers.values());

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-2 z-10">
      <p className="text-xs text-gray-400 mb-1">Connected</p>
      <div className="space-y-1">
        {peers.map((name, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-white">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
