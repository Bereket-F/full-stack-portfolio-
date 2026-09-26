import request from 'supertest';
import { createApp } from '@/app';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/utils/password';
import { requireAdmin } from '@/middleware/auth';
import { HttpError } from '@/utils/httpError';

const app = createApp();
const email = 'test-authz-admin@example.com';
const password = 'TestPassword123!';

async function login() {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.headers['set-cookie'];
}

beforeAll(async () => {
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: await hashPassword(password), tokenVersion: 0 },
    create: { email, passwordHash: await hashPassword(password), role: 'ADMIN' },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

describe('requireAdmin middleware (unit)', () => {
  const next = jest.fn();

  beforeEach(() => next.mockReset());

  it('rejects when there is no authenticated user', () => {
    const req: any = {};
    requireAdmin(req, {} as any, next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
    expect(next.mock.calls[0][0].status).toBe(401);
  });

  it('rejects a non-admin role with 403', () => {
    const req: any = { user: { sub: '1', email: 'x@example.com', role: 'EDITOR' } };
    requireAdmin(req, {} as any, next);
    expect(next).toHaveBeenCalledWith(expect.any(HttpError));
    expect(next.mock.calls[0][0].status).toBe(403);
  });

  it('allows the ADMIN role through', () => {
    const req: any = { user: { sub: '1', email: 'x@example.com', role: 'ADMIN' } };
    requireAdmin(req, {} as any, next);
    expect(next).toHaveBeenCalledWith(); // called with no error
  });
});

describe('Admin API authorization', () => {
  it('rejects every admin route without a session (401)', async () => {
    const routes = ['/api/admin/dashboard/stats', '/api/admin/projects', '/api/admin/skills', '/api/admin/messages'];
    for (const route of routes) {
      const res = await request(app).get(route);
      expect(res.status).toBe(401);
    }
  });
});

describe('Logout session invalidation', () => {
  it('revokes the JWT server-side so a replayed cookie no longer works', async () => {
    const cookie = await login();

    // Sanity check: the freshly issued cookie works.
    const meBefore = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(meBefore.status).toBe(200);

    await request(app).post('/api/auth/logout').set('Cookie', cookie);

    // Replay the exact same (still unexpired) cookie value captured before logout.
    const meAfter = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(meAfter.status).toBe(401);
  });
});
