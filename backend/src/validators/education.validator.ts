import { z } from 'zod';

export const createEducationSchema = z.object({
  institution: z.string().min(1).max(160),
  degree: z.string().min(1).max(160),
  field: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  order: z.number().int().default(0),
});

export const updateEducationSchema = createEducationSchema.partial();

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
