import { prisma } from '@/lib/prisma';
import { HttpError } from '@/utils/httpError';
import { CreateEducationInput, UpdateEducationInput } from '@/validators/education.validator';

export function listEducation() {
  return prisma.education.findMany({ orderBy: [{ order: 'asc' }, { startDate: 'desc' }] });
}

export async function getEducationById(id: string) {
  const item = await prisma.education.findUnique({ where: { id } });
  if (!item) throw HttpError.notFound('Education record not found');
  return item;
}

export function createEducation(input: CreateEducationInput) {
  return prisma.education.create({ data: input });
}

export async function updateEducation(id: string, input: UpdateEducationInput) {
  await getEducationById(id);
  return prisma.education.update({ where: { id }, data: input });
}

export async function deleteEducation(id: string) {
  await getEducationById(id);
  await prisma.education.delete({ where: { id } });
}
