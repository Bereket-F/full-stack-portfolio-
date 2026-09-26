import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { createProjectSchema, updateProjectSchema } from '@/validators/project.validator';
import * as projectService from '@/services/project.service';

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = !!req.user;
  const { category, featured } = req.query;
  const projects = await projectService.listProjects({
    publicOnly: !isAdmin,
    category: typeof category === 'string' ? category : undefined,
    featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
  });
  res.json({ data: projects });
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProjectBySlug(req.params.slug, !req.user);
  res.json({ data: project });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProjectById(req.params.id);
  res.json({ data: project });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const input = createProjectSchema.parse(req.body);
  const project = await projectService.createProject(input);
  res.status(201).json({ data: project });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const input = updateProjectSchema.parse(req.body);
  const project = await projectService.updateProject(req.params.id, input);
  res.json({ data: project });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await projectService.deleteProject(req.params.id);
  res.status(204).send();
});
