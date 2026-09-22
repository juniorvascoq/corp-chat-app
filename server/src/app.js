import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import productsRoutes from './routes/products.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();

// Middlewares Globales
app.use(cors({
  origin: '*', // Permitir cualquier origen en desarrollo (para que funcione Flutter Web)
  // credentials: true // Al usar origin: '*' no se puede usar credentials: true en algunos navegadores
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

// Rutas de productos
app.use('/api/products', productsRoutes);

// Rutas de usuarios
app.use('/api/users', usersRoutes);

// Middleware de manejo de errores (Global)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
