import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { createMessageSchema } from '@/validators/message.validator';
import * as messageService from '@/services/message.service';

export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const input = createMessageSchema.parse(req.body);
  const message = await messageService.createMessage(input);
  res.status(201).json({ data: { id: message.id }, message: 'Message sent successfully' });
});

export const listMessages = asyncHandler(async (req: Request, res: Response) => {
  const { archived } = req.query;
  const messages = await messageService.listMessages({
    archived: archived === 'true' ? true : archived === 'false' ? false : undefined,
  });
  res.json({ data: messages });
});

export const markMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const read = req.body.read !== false;
  const message = await messageService.markMessageRead(req.params.id, read);
  res.json({ data: message });
});

export const archiveMessage = asyncHandler(async (req: Request, res: Response) => {
  const archived = req.body.archived !== false;
  const message = await messageService.archiveMessage(req.params.id, archived);
  res.json({ data: message });
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  await messageService.deleteMessage(req.params.id);
  res.status(204).send();
});
