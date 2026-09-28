import { z } from 'zod';
import { optionalImageUrl } from '@/validators/common.validator';

export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1).max(40),
  url: z.string().url(),
  order: z.number().int().default(0),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  role: z.string().min(1).max(160).optional(),
  tagline: z.string().min(1).max(300).optional(),
  bio: z.string().min(1).optional(),
  location: z.string().optional(),
  email: z.string().email().optional(),
  avatarUrl: optionalImageUrl,
  resumeUrl: z.string().url().optional().or(z.literal('')),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
