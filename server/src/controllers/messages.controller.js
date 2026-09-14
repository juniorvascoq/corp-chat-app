import { query } from '../config/db.js';

export const getMessages = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, user_id, username, text, created_at FROM messages ORDER BY created_at ASC LIMIT 50'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};
