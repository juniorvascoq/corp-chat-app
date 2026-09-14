import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Por favor, ingrese usuario y contraseña.' });
    }

    // Buscamos el usuario
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado o credenciales incorrectas.' });
    }

    const user = result.rows[0];

    // Verificamos contraseña (en texto plano por requerimiento temporal)
    if (user.password_hash !== password) {
      return res.status(401).json({ message: 'Usuario no encontrado o credenciales incorrectas.' });
    }

    // Generamos JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret_dev_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    next(error);
  }
};
