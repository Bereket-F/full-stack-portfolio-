import request from 'supertest';
import { createApp } from '@/app';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/utils/password';

const app = createApp();
const email = 'test-projects-admin@example.com';
const password = 'TestPassword123!';

async function loginCookie() {
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: await hashPassword(password) },
    create: { email, passwordHash: await hashPassword(password), role: 'ADMIN' },
  });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.headers['set-cookie'];
}

afterAll(async () => {
  await prisma.project.deleteMany({ where: { slug: { startsWith: 'test-project' } } });
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

describe('Projects API', () => {
  it('lists public, published projects without auth', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('rejects project creation without auth', async () => {
    const res = await request(app).post('/api/admin/projects').send({
      title: 'Test Project',
      summary: 'A project created during tests',
    });
    expect(res.status).toBe(401);
  });

  it('rejects invalid project payloads even when authenticated', async () => {
    const cookie = await loginCookie();
    const res = await request(app)
      .post('/api/admin/projects')
      .set('Cookie', cookie)
      .send({ title: 'x' }); // too short, missing summary
    expect(res.status).toBe(400);
  });

  it('creates, updates, and deletes a project when authenticated', async () => {
    const cookie = await loginCookie();

    const createRes = await request(app)
      .post('/api/admin/projects')
      .set('Cookie', cookie)
      .send({
        title: 'Test Project Alpha',
        summary: 'A project created during automated API tests.',
        technologies: ['TestTech'],
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body.data.slug).toMatch(/^test-project-alpha/);
    const id = createRes.body.data.id;

    const updateRes = await request(app)
      .put(`/api/admin/projects/${id}`)
      .set('Cookie', cookie)
      .send({ featured: true });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.featured).toBe(true);

    const deleteRes = await request(app).delete(`/api/admin/projects/${id}`).set('Cookie', cookie);
    expect(deleteRes.status).toBe(204);
  });
});
