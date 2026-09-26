import { Router } from 'express';
import * as projectController from '@/controllers/project.controller';

const router = Router();

router.get('/', projectController.listProjects);
router.get('/:slug', projectController.getProjectBySlug);

export default router;
