import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { getDashboardStats } from '@/services/dashboard.service';

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await getDashboardStats();
  res.json({ data: stats });
});
