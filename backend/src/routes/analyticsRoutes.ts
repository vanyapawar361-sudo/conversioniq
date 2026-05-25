import { Router } from 'express';
import { getOverview, getFunnel, getSessions } from '../controllers/analyticsController';

const router = Router();

router.get('/overview', getOverview);
router.get('/funnel', getFunnel);
router.get('/sessions', getSessions);

export default router;
