import { useState } from 'react';

interface UsernamePromptProps {
  onSubmit: (username: string) => void;
}

export function UsernamePrompt({ onSubmit }: UsernamePromptProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.1,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-gray-900/80 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-8 w-80 shadow-2xl shadow-indigo-500/10"
      >
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Virtual Cosmos
        </h1>
        <p className="text-gray-400 text-center text-sm mb-6">
          Enter your name to join the cosmos
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          maxLength={20}
          autoFocus
          className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors mb-4"
        />

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
        >
          Enter Cosmos
        </button>
      </form>
    </div>
  );
}
