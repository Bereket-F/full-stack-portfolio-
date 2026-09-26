import { prisma } from '@/lib/prisma';
import { HttpError } from '@/utils/httpError';
import { CreateMessageInput } from '@/validators/message.validator';

export function createMessage(input: CreateMessageInput) {
  return prisma.message.create({ data: input });
}

export function listMessages(opts: { archived?: boolean }) {
  return prisma.message.findMany({
    where: opts.archived !== undefined ? { archived: opts.archived } : {},
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMessageById(id: string) {
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw HttpError.notFound('Message not found');
  return message;
}

export async function markMessageRead(id: string, read: boolean) {
  await getMessageById(id);
  return prisma.message.update({ where: { id }, data: { read } });
}

export async function archiveMessage(id: string, archived: boolean) {
  await getMessageById(id);
  return prisma.message.update({ where: { id }, data: { archived } });
}

export async function deleteMessage(id: string) {
  await getMessageById(id);
  await prisma.message.delete({ where: { id } });
}
