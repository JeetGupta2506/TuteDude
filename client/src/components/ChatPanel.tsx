import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatPanelProps {
  isOpen: boolean;
  messages: ChatMessage[];
  connectedPeers: Map<string, string>;
  onSend: (text: string) => void;
}

export function ChatPanel({ isOpen, messages, connectedPeers, onSend }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const peerNames = Array.from(connectedPeers.values());

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-gray-900/90 backdrop-blur-sm border-l border-gray-700/50 flex flex-col transition-transform duration-300 ease-in-out z-20 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700/50">
        <h3 className="text-sm font-semibold text-indigo-400">Proximity Chat</h3>
        <p className="text-xs text-gray-400 mt-1">
          Connected with: {peerNames.join(', ') || 'no one'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-gray-500 text-xs text-center mt-4">
            Say hello! You're nearby.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className="text-sm">
            <span className="font-medium text-indigo-300">{msg.from}: </span>
            <span className="text-gray-200">{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white text-sm rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
