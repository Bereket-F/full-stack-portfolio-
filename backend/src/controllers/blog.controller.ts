import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { createBlogPostSchema, updateBlogPostSchema } from '@/validators/blog.validator';
import * as blogService from '@/services/blog.service';

export const listBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await blogService.listBlogPosts({ publicOnly: !req.user });
  res.json({ data: posts });
});

export const getBlogPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await blogService.getBlogPostBySlug(req.params.slug, !req.user);
  res.json({ data: post });
});

export const getBlogPostById = asyncHandler(async (req: Request, res: Response) => {
  const post = await blogService.getBlogPostById(req.params.id);
  res.json({ data: post });
});
P
export const createBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const input = createBlogPostSchema.parse(req.body);
  const post = await blogService.createBlogPost(input);
  res.status(201).json({ data: post });
});

export const updateBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const input = updateBlogPostSchema.parse(req.body);
  const post = await blogService.updateBlogPost(req.params.id, input);
  res.json({ data: post });
});

export const deleteBlogPost = asyncHandler(async (req: Request, res: Response) => {
  await blogService.deleteBlogPost(req.params.id);
  res.status(204).send();
});
