import { Router } from 'express';
import { chatWithAI } from '../controllers/insightsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/chat', authenticate as any, chatWithAI as any);

export default router;
