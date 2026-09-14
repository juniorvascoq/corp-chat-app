import express from 'express';
import { getMessages } from '../controllers/messages.controller.js';

const router = express.Router();

router.get('/', getMessages);

export default router;
