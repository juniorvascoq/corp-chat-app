import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { createProduct, getProducts } from '../controllers/products.controller.js';

const router = Router();

// Rutas protegidas por el middleware requireAuth
router.get('/', requireAuth, getProducts);
router.post('/', requireAuth, createProduct);

export default router;
