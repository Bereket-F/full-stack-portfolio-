import { Router } from 'express';
import { sensitiveLimiter } from '@/middleware/rateLimit';
import { authenticate } from '@/middleware/auth';
import * as authController from '@/controllers/auth.controller';

const router = Router();

router.post('/login', sensitiveLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export default router;
