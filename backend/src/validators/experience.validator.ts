import { z } from 'zod';

export const createExperienceSchema = z.object({
  company: z.string().min(1).max(120),
  position: z.string().min(1).max(120),
  location: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().min(1),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
