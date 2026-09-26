import request from 'supertest';
import { createApp } from '@/app';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/utils/password';

const app = createApp();
const email = 'test-admin@example.com';
const password = 'TestPassword123!';

beforeAll(async () => {
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: await hashPassword(password) },
    create: { email, passwordHash: await hashPassword(password), role: 'ADMIN' },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

describe('Auth', () => {
  it('rejects invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('rejects malformed payloads', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('logs in with valid credentials and sets an http-only cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(email);
    const cookie = res.headers['set-cookie']?.[0];
    expect(cookie).toBeDefined();
    expect(cookie).toMatch(/HttpOnly/i);
  });

  it('rejects /api/auth/me without a session', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns the current user with a valid session cookie', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({ email, password });
    const cookie = loginRes.headers['set-cookie'];

    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe(email);
  });
});
