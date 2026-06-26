import express from 'express';
import { getHistory, getHistoryById, deleteHistory } from '../controllers/history.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getHistory);
router.get('/:id', authMiddleware, getHistoryById);
router.delete('/:id', authMiddleware, deleteHistory);

export default router;
