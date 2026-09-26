import request from 'supertest';
import { createApp } from '@/app';
import { prisma } from '@/lib/prisma';

const app = createApp();

afterAll(async () => {
  await prisma.message.deleteMany({ where: { email: 'contact-test@example.com' } });
  await prisma.$disconnect();
});

describe('Contact form / Messages API', () => {
  it('rejects invalid contact submissions', async () => {
    const res = await request(app).post('/api/messages').send({ name: '', email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('saves a valid contact submission to the database', async () => {
    const res = await request(app).post('/api/messages').send({
      name: 'Jane Recruiter',
      email: 'contact-test@example.com',
      subject: 'Job opportunity',
      message: 'Hello, I would like to discuss a role with you.',
    });
    expect(res.status).toBe(201);

    const stored = await prisma.message.findFirst({ where: { email: 'contact-test@example.com' } });
    expect(stored).not.toBeNull();
    expect(stored?.subject).toBe('Job opportunity');
  });

  it('rejects listing messages without admin auth', async () => {
    const res = await request(app).get('/api/admin/messages');
    expect(res.status).toBe(401);
  });
});
