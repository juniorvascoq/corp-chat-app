import { query } from '../config/db.js';

const onlineUsers = new Map(); // Para trackear los usuarios activos

export const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    const user = socket.user; // Set by socketAuth middleware {id, username}
    
    // Lo añadimos a la lista de online
    onlineUsers.set(user.id, user);
    console.log(`Usuario conectado: ${user.username} (Socket ID: ${socket.id})`);

    // Emitimos la lista de conectados a todos
    io.emit('online_users', Array.from(onlineUsers.values()));

    socket.on('send_message', async (data) => {
      const { text } = data;
      try {
        // Guardar en la base de datos
        const result = await query(
          'INSERT INTO messages (user_id, username, text) VALUES ($1, $2, $3) RETURNING *',
          [user.id, user.username, text]
        );
        const savedMessage = result.rows[0];

        // Emitir a todos
        io.emit('receive_message', savedMessage);
      } catch (err) {
        console.error('Error al guardar mensaje:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${user.username} (Socket ID: ${socket.id})`);
      onlineUsers.delete(user.id);
      io.emit('online_users', Array.from(onlineUsers.values()));
    });
  });
};
