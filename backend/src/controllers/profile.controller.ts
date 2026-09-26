import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { updateProfileSchema } from '@/validators/profile.validator';
import * as profileService from '@/services/profile.service';

export const getProfile = asyncHandler(async (_req: Request, res: Response) => {
  const profile = await profileService.getProfile();
  res.json({ data: profile });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const input = updateProfileSchema.parse(req.body);
  const profile = await profileService.updateProfile(input);
  res.json({ data: profile });
});
