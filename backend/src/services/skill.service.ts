import { prisma } from '@/lib/prisma';
import { HttpError } from '@/utils/httpError';
import { CreateSkillInput, UpdateSkillInput } from '@/validators/skill.validator';

export async function listSkills() {
  return prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] });
}

export async function getSkillById(id: string) {
  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) throw HttpError.notFound('Skill not found');
  return skill;
}

export function createSkill(input: CreateSkillInput) {
  return prisma.skill.create({ data: input });
}

export async function updateSkill(id: string, input: UpdateSkillInput) {
  await getSkillById(id);
  return prisma.skill.update({ where: { id }, data: input });
}

export async function deleteSkill(id: string) {
  await getSkillById(id);
  await prisma.skill.delete({ where: { id } });
}
