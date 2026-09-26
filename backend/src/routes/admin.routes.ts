import { Router } from 'express';
import { authenticate, requireAdmin } from '@/middleware/auth';
import * as projectController from '@/controllers/project.controller';
import * as skillController from '@/controllers/skill.controller';
import * as experienceController from '@/controllers/experience.controller';
import * as educationController from '@/controllers/education.controller';
import * as blogController from '@/controllers/blog.controller';
import * as messageController from '@/controllers/message.controller';
import * as profileController from '@/controllers/profile.controller';
import * as dashboardController from '@/controllers/dashboard.controller';

const router = Router();

// Every route below requires a valid, DB-verified admin session.
router.use(authenticate, requireAdmin);

router.get('/dashboard/stats', dashboardController.getStats);

router.get('/projects', projectController.listProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

router.get('/skills', skillController.listSkills);
router.post('/skills', skillController.createSkill);
router.put('/skills/:id', skillController.updateSkill);
router.delete('/skills/:id', skillController.deleteSkill);

router.get('/experience', experienceController.listExperiences);
router.post('/experience', experienceController.createExperience);
router.put('/experience/:id', experienceController.updateExperience);
router.delete('/experience/:id', experienceController.deleteExperience);

router.get('/education', educationController.listEducation);
router.post('/education', educationController.createEducation);
router.put('/education/:id', educationController.updateEducation);
router.delete('/education/:id', educationController.deleteEducation);

router.get('/blog', blogController.listBlogPosts);
router.get('/blog/:id', blogController.getBlogPostById);
router.post('/blog', blogController.createBlogPost);
router.put('/blog/:id', blogController.updateBlogPost);
router.delete('/blog/:id', blogController.deleteBlogPost);

router.get('/messages', messageController.listMessages);
router.patch('/messages/:id/read', messageController.markMessageRead);
router.patch('/messages/:id/archive', messageController.archiveMessage);
router.delete('/messages/:id', messageController.deleteMessage);

router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);

export default router;
