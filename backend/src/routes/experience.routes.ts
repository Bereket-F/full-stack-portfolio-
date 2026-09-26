import { Router } from 'express';
import * as experienceController from '@/controllers/experience.controller';

const router = Router();

router.get('/', experienceController.listExperiences);

export default router;
