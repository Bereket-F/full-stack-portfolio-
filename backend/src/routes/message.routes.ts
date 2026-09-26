import { Router } from 'express';
import { sensitiveLimiter } from '@/middleware/rateLimit';
import * as messageController from '@/controllers/message.controller';

const router = Router();

router.post('/', sensitiveLimiter, messageController.createMessage);

export default router;
