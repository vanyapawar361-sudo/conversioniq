import { Router } from 'express';
import { getOverview, getFunnel, getSessions } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/overview', authenticate as any, getOverview as any);
router.get('/funnel', authenticate as any, getFunnel as any);
router.get('/sessions', authenticate as any, getSessions as any);

export default router;
