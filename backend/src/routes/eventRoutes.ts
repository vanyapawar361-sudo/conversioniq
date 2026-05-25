import { Router } from 'express';
import { ingestEvents } from '../controllers/eventController';

const router = Router();

router.post('/', ingestEvents);

export default router;
