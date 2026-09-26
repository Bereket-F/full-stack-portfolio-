import { Router } from 'express';
import authRoutes from '@/routes/auth.routes';
import projectRoutes from '@/routes/project.routes';
import skillRoutes from '@/routes/skill.routes';
import experienceRoutes from '@/routes/experience.routes';
import educationRoutes from '@/routes/education.routes';
import blogRoutes from '@/routes/blog.routes';
import messageRoutes from '@/routes/message.routes';
import profileRoutes from '@/routes/profile.routes';
import adminRoutes from '@/routes/admin.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Public, read-only endpoints consumed by the portfolio site.
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);
router.use('/education', educationRoutes);
router.use('/blog', blogRoutes);
router.use('/messages', messageRoutes);
router.use('/profile', profileRoutes);

// Protected admin CRUD surface (mutations + full, unpublished data).
router.use('/admin', adminRoutes);

export default router;
