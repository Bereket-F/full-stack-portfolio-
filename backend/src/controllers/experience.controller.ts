import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  createExperienceSchema,
  updateExperienceSchema,
} from '@/validators/experience.validator';
import * as experienceService from '@/services/experience.service';

export const listExperiences = asyncHandler(async (_req: Request, res: Response) => {
  const items = await experienceService.listExperiences();
  res.json({ data: items });
});

export const createExperience = asyncHandler(async (req: Request, res: Response) => {
  const input = createExperienceSchema.parse(req.body);
  const item = await experienceService.createExperience(input);
  res.status(201).json({ data: item });
});

export const updateExperience = asyncHandler(async (req: Request, res: Response) => {
  const input = updateExperienceSchema.parse(req.body);
  const item = await experienceService.updateExperience(req.params.id, input);
  res.json({ data: item });
});

export const deleteExperience = asyncHandler(async (req: Request, res: Response) => {
  await experienceService.deleteExperience(req.params.id);
  res.status(204).send();
});
