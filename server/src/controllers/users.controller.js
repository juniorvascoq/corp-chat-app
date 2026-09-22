import { query } from '../config/db.js';

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      'SELECT COUNT(*) as product_count FROM products WHERE created_by = $1',
      [userId]
    );
    
    // Obtener también el username
    const userResult = await query('SELECT username FROM users WHERE id = $1', [userId]);

    const count = parseInt(result.rows[0].product_count, 10);

    res.status(200).json({
      productCount: count,
      username: userResult.rows[0].username
    });
  } catch (error) {
    next(error);
  }
};
