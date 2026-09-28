import { z } from 'zod';
import { optionalImageUrl } from '@/validators/common.validator';

export const createBlogPostSchema = z.object({
  title: z.string().min(2).max(160),
  slug: z
    .string()
    .min(2)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, alphanumeric, hyphen-separated')
    .optional(),
  excerpt: z.string().max(300).optional(),
  coverImage: optionalImageUrl,
  content: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  tags: z.array(z.string().min(1)).default([]),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
