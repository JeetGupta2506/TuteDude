import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, MONGO_URI } from './config';
import { registerSocketHandlers, setDbConnected } from './socket/handler';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  },
});

registerSocketHandlers(io);

app.get('/', (_req, res) => {
  res.json({ status: 'Virtual Cosmos server running' });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    setDbConnected(true);
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('MongoDB not available, running without persistence:', err.message);
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (no DB)`);
    });
  });
