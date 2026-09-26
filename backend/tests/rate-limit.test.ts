import request from 'supertest';
import { createApp } from '@/app';

// Each Jest test file gets its own module sandbox, so this limiter instance is independent
// of the one used by other test files (their counters don't interfere with each other).
const app = createApp();

describe('Login rate limiting', () => {
  it('locks out further attempts after repeated failed logins', async () => {
    const attempt = () =>
      request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: 'wrong-password' });

    const responses = [];
    for (let i = 0; i < 11; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      responses.push(await attempt());
    }

    const statuses = responses.map((r) => r.status);
    expect(statuses.slice(0, 10).every((s) => s === 401)).toBe(true);
    expect(statuses[10]).toBe(429);
  });
});
