import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import messagesRoutes from './routes/messages.routes.js';

const app = express();

// Middlewares Globales
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base (Placeholder para la arquitectura)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Servidor operativo' });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de mensajes
app.use('/api/messages', messagesRoutes);

// Middleware de manejo de errores (Global)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
