import { query } from '../config/db.js';

// Crear producto
export const createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    // req.user viene del middleware de autenticación
    const userId = req.user.id;

    if (!name || !price) {
      return res.status(400).json({ message: 'Nombre y precio son requeridos' });
    }

    const result = await query(
      'INSERT INTO products (name, price, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, price, userId]
    );

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// Obtener productos con el username del creador
export const getProducts = async (req, res, next) => {
  try {
    // Hacemos el INNER JOIN para obtener el username de la tabla users
    const result = await query(`
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p.created_at, 
        u.username as created_by_user
      FROM products p
      INNER JOIN users u ON p.created_by = u.id
      ORDER BY p.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};
