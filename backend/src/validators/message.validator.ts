import { z } from 'zod';

export const createMessageSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
