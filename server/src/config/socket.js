import { Server } from 'socket.io';
import { setupSocketAuth } from '../sockets/middlewares/socketAuth.js';
import { registerSocketHandlers } from '../sockets/index.js';

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // 1. Configurar Middleware de Autenticación
  setupSocketAuth(io);

  // 2. Registrar Handlers y Namespaces
  registerSocketHandlers(io);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado.');
  }
  return io;
};
