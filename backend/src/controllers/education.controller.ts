import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { createEducationSchema, updateEducationSchema } from '@/validators/education.validator';
import * as educationService from '@/services/education.service';

export const listEducation = asyncHandler(async (_req: Request, res: Response) => {
  const items = await educationService.listEducation();
  res.json({ data: items });
});

export const createEducation = asyncHandler(async (req: Request, res: Response) => {
  const input = createEducationSchema.parse(req.body);
  const item = await educationService.createEducation(input);
  res.status(201).json({ data: item });
});

export const updateEducation = asyncHandler(async (req: Request, res: Response) => {
  const input = updateEducationSchema.parse(req.body);
  const item = await educationService.updateEducation(req.params.id, input);
  res.json({ data: item });
});

export const deleteEducation = asyncHandler(async (req: Request, res: Response) => {
  await educationService.deleteEducation(req.params.id);
  res.status(204).send();
});
