export interface Player {
  socketId: string;
  username: string;
  x: number;
  y: number;
}

export interface ChatMessage {
  from: string;
  fromId: string;
  text: string;
  timestamp: number;
}

export interface ProximityEvent {
  peerId: string;
  username: string;
}

export interface MinimapPlayer {
  x: number;
  y: number;
  isLocal: boolean;
}
