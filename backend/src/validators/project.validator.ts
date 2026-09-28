import { z } from 'zod';
import { imageUrl, optionalImageUrl } from '@/validators/common.validator';

export const projectCategoryEnum = z.enum([
  'WEB',
  'API',
  'MOBILE',
  'TESTING',
  'TOOLING',
  'OTHER',
]);

export const createProjectSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, alphanumeric, hyphen-separated')
    .optional(),
  summary: z.string().min(10).max(300),
  overview: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  role: z.string().optional(),
  challenges: z.string().optional(),
  features: z.array(z.string()).default([]),
  coverImage: optionalImageUrl,
  screenshots: z.array(imageUrl).default([]),
  githubUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  category: projectCategoryEnum.default('WEB'),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
  technologies: z.array(z.string().min(1)).default([]),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
