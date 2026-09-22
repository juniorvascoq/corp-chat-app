import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getUserStats } from '../controllers/users.controller.js';

const router = Router();

router.get('/me/stats', requireAuth, getUserStats);

export default router;
