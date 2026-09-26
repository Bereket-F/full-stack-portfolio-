import { Router } from 'express';
import * as educationController from '@/controllers/education.controller';

const router = Router();

router.get('/', educationController.listEducation);

export default router;
