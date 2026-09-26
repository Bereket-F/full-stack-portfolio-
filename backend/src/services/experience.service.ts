import { prisma } from '@/lib/prisma';
import { HttpError } from '@/utils/httpError';
import { CreateExperienceInput, UpdateExperienceInput } from '@/validators/experience.validator';

export function listExperiences() {
  return prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { startDate: 'desc' }] });
}

export async function getExperienceById(id: string) {
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) throw HttpError.notFound('Experience not found');
  return item;
}

export function createExperience(input: CreateExperienceInput) {
  return prisma.experience.create({ data: input });
}

export async function updateExperience(id: string, input: UpdateExperienceInput) {
  await getExperienceById(id);
  return prisma.experience.update({ where: { id }, data: input });
}

export async function deleteExperience(id: string) {
  await getExperienceById(id);
  await prisma.experience.delete({ where: { id } });
}
