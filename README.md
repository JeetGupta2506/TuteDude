﻿# Virtual Cosmos

> A 2D virtual environment where users move around and interact through proximity-based real-time chat.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PixiJS](https://img.shields.io/badge/PixiJS-7-e72264?logo=pixijs)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)

---

## What is Virtual Cosmos?

Virtual Cosmos is a real-time multiplayer 2D space where users are represented as colored avatars. When two users walk close to each other (within a 150px proximity radius), a chat panel automatically appears — simulating natural, real-world proximity-based conversation. When they walk away, the chat disconnects.

The world is a 3000×3000 canvas divided into **9 themed zones** — Lounge, Meeting Room, Playground, Library, Garden, Auditorium, Cafe, Studio, and Rooftop — each with its own color, emoji, and atmosphere.

---

## Features

| Feature | Description |
|---|---|
| **2D Movement** | Move your avatar with `WASD` or Arrow keys across a 3000×3000 world |
| **Real-Time Multiplayer** | See all connected users move in real time via Socket.IO |
| **Proximity Detection** | Server-side Euclidean distance check within a 150px radius |
| **Proximity Chat** | Chat panel auto-opens when near another user, auto-closes when you walk away |
| **9 Named Zones** | Themed rooms with colored borders, emoji labels, and ambient decorations |
| **Minimap** | 160×160 overview showing all players and zones with a viewport indicator |
| **HUD** | Live coordinates, online user count, and current zone name |
| **MongoDB Persistence** | Optional — server works fully without a database using in-memory state |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 18 |
| Build tool | Vite | 5 |
| Language | TypeScript | 5 |
| 2D rendering | PixiJS | 7 |
| Styling | Tailwind CSS | 3 |
| Real-time (client) | Socket.IO Client | 4 |
| Backend runtime | Node.js + Express | 18+ / 4 |
| Real-time (server) | Socket.IO | 4 |
| Database | MongoDB + Mongoose | 8 |
| Dev server | ts-node-dev | 2 |
| Monorepo runner | concurrently | 8 |

---

## Project Structure

```
virtual-cosmos/
├── package.json              # Root — runs both client and server
├── .gitignore
│
├── client/                   # React + PixiJS frontend
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── App.tsx           # Root component, layout
│       ├── main.tsx          # React entry point
│       ├── config/
│       │   └── constants.ts  # World size, proximity radius, zone definitions
│       ├── socket/
│       │   └── socket.ts     # Socket.IO client singleton
│       ├── types/
│       │   └── index.ts      # Shared TypeScript interfaces
│       ├── canvas/
│       │   ├── CosmosCanvas.tsx   # PixiJS host component
│       │   ├── setupScene.ts      # Background, grid, stars, zones
│       │   ├── PlayerAvatar.ts    # Avatar class (circle + label + glow)
│       │   └── camera.ts          # Camera follow logic
│       ├── hooks/
│       │   ├── useMovement.ts       # WASD/Arrow key input + throttled emit
│       │   ├── useSocket.ts         # Socket connect/disconnect lifecycle
│       │   ├── useOtherPlayers.ts   # Remote player tracking + interpolation
│       │   └── useProximityChat.ts  # Proximity state + chat messages
│       └── components/
│           ├── UsernamePrompt.tsx   # Entry modal
│           ├── ChatPanel.tsx        # Slide-in chat sidebar
│           ├── ConnectionIndicator.tsx  # Connected peers list
│           ├── HUD.tsx              # Position + zone + online count
│           └── Minimap.tsx          # 160×160 world overview
│
└── server/                   # Node.js + Express + Socket.IO backend
    └── src/
        ├── index.ts          # Server entry — Express + Socket.IO + MongoDB
        ├── config.ts         # Port, MongoDB URI, proximity radius
        ├── models/
        │   └── User.ts       # Mongoose schema (socketId, username, position)
        ├── socket/
        │   ├── handler.ts    # Main socket event orchestrator
        │   ├── movement.ts   # user:move handler + broadcast
        │   ├── proximity.ts  # Proximity check algorithm
        │   └── chat.ts       # Chat relay to connected peers
        └── utils/
            └── distance.ts   # Euclidean distance helper
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **MongoDB** (optional — server runs without it using in-memory state)

---

## Setup & Run

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd virtual-cosmos
```

### 2. Install dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 3. Start MongoDB (optional)

```bash
# Windows (run as Administrator)
net start MongoDB

# macOS / Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

> The server works fully without MongoDB. You'll see `Server listening on port 3001 (no DB)` if MongoDB is unavailable — all real-time features still work.

### 4. Run the app

```bash
# From the project root — starts both server and client
npm run dev
```

Or run them separately:

```bash
# Terminal 1 — server on :3001
npm run dev:server

# Terminal 2 — client on :5173
npm run dev:client
```

### 5. Open in browser

```
http://localhost:5173
```

Open **two tabs** to see multiplayer in action.

---

## Environment Variables

Set these before starting the server (optional — defaults shown):

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/virtual-cosmos` | MongoDB connection string |

```bash
# Windows PowerShell
$env:MONGO_URI="your-mongodb-connection-string"

# macOS / Linux
export MONGO_URI="your-mongodb-connection-string"
```

---

## How Proximity Works

Proximity detection runs **server-side** on every position update:

```
distance = √((x₂ - x₁)² + (y₂ - y₁)²)

if distance < 150 and not connected → emit proximity:connect to both users
if distance ≥ 150 and was connected → emit proximity:disconnect to both users
```

This is intentionally server-side to prevent client-side cheating and to ensure both users always receive symmetric connect/disconnect events.

---

## Socket Event Reference

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `user:join` | `{ username }` | Join the world with a display name |
| `user:move` | `{ x, y }` | Broadcast new position (throttled to 60ms) |
| `chat:message` | `{ text }` | Send a message to proximity-connected peers |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `world:state` | `{ players[] }` | Full snapshot of existing players on join |
| `user:joined` | `{ socketId, username, x, y }` | A new player entered the world |
| `user:moved` | `{ socketId, x, y }` | A player's position updated |
| `user:left` | `{ socketId }` | A player disconnected |
| `proximity:connect` | `{ peerId, username }` | You entered proximity with another user |
| `proximity:disconnect` | `{ peerId }` | You left proximity with another user |
| `chat:message` | `{ from, fromId, text, timestamp }` | Incoming chat message |

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│                  Browser                    │
│                                             │
│  PixiJS Canvas  ←→  React State / Hooks    │
│       ↕                    ↕               │
│  Movement Keys       Chat Panel UI         │
└────────────────┬────────────────────────────┘
                 │  Socket.IO (WebSocket)
                 ↕
┌────────────────────────────────────────────┐
│             Node.js Server                  │
│                                             │
│  in-memory Map<socketId, PlayerState>       │
│       ↓                                    │
│  On user:move → checkProximity()            │
│       ↓                                    │
│  Euclidean distance to all other players    │
│       ↓                                    │
│  proximity:connect / proximity:disconnect   │
│       ↓                                    │
│  chat:message relayed to connections Set    │
│       ↓                                    │
│  MongoDB (optional persistence)             │
└────────────────────────────────────────────┘
```

---

## User Flow

1. Open the app → enter your name → **Enter Cosmos**
2. Your avatar appears in the 3000×3000 world
3. Move with **WASD** or **Arrow keys**
4. Walk near another user → **chat panel slides in** automatically
5. Send messages — they only go to nearby users
6. Walk away → **chat panel closes** and messages clear
7. Check the **minimap** (top-right) to see where everyone is
8. Check the **HUD** (top-left) to see your current zone

---

## Zones

| Zone | Emoji | Color | Position |
|---|---|---|---|
| Lounge | ☕ | Indigo | Top-left |
| Meeting Room | 💼 | Green | Top-center |
| Playground | 🎮 | Purple | Top-right |
| Library | 📚 | Yellow | Mid-left |
| Garden | 🌿 | Emerald | Mid-center |
| Auditorium | 🎤 | Red | Mid-right |
| Cafe | ☕ | Orange | Bottom-left |
| Studio | 🎨 | Blue | Bottom-center |
| Rooftop | ⭐ | Violet | Bottom-right |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both client and server (from root) |
| `npm run dev:server` | Start server only |
| `npm run dev:client` | Start client only |
| `cd server && npm run build` | Compile server TypeScript |
| `cd client && npm run build` | Build client for production |
