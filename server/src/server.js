import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import { checkDbConnection } from './config/db.js';
import { initializeSocket } from './config/socket.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Crear servidor HTTP a partir de la app de Express
const server = http.createServer(app);

// Inicializar y acoplar Socket.IO al servidor HTTP
initializeSocket(server);

// Iniciar servidor tras verificar DB
const startServer = async () => {
  try {
    await checkDbConnection();
    
    server.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Fallo al iniciar el servidor por error de DB', error);
    process.exit(1);
  }
};

startServer();
