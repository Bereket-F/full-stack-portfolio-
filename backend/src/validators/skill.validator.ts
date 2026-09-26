import { z } from 'zod';

export const skillCategoryEnum = z.enum([
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'TESTING',
  'DESIGN',
  'OTHER',
]);

export const createSkillSchema = z.object({
  name: z.string().min(1).max(60),
  category: skillCategoryEnum,
  level: z.number().int().min(0).max(100).default(80),
  icon: z.string().optional(),
  order: z.number().int().default(0),
});

export const updateSkillSchema = createSkillSchema.partial();

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
