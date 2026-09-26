import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { createSkillSchema, updateSkillSchema } from '@/validators/skill.validator';
import * as skillService from '@/services/skill.service';

export const listSkills = asyncHandler(async (_req: Request, res: Response) => {
  const skills = await skillService.listSkills();
  res.json({ data: skills });
});

export const createSkill = asyncHandler(async (req: Request, res: Response) => {
  const input = createSkillSchema.parse(req.body);
  const skill = await skillService.createSkill(input);
  res.status(201).json({ data: skill });
});

export const updateSkill = asyncHandler(async (req: Request, res: Response) => {
  const input = updateSkillSchema.parse(req.body);
  const skill = await skillService.updateSkill(req.params.id, input);
  res.json({ data: skill });
});

export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  await skillService.deleteSkill(req.params.id);
  res.status(204).send();
});
