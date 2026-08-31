import { Router } from 'express';
import { getAlerts, resolveAlert, testDiscordWebhook } from '../controllers/alertController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate as any, getAlerts as any);
router.put('/:alertId/resolve', authenticate as any, resolveAlert as any);
router.post('/test-discord', authenticate as any, testDiscordWebhook as any);

export default router;
