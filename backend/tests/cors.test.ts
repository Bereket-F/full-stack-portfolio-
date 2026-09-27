import request from 'supertest';
import { createApp } from '@/app';
import { isAllowedOrigin } from '@/config/env';

const app = createApp();

describe('CORS origin whitelist', () => {
  it('allows exact matches', () => {
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('https://full-stack-portfolio-ten-coral.vercel.app')).toBe(true);
  });

  it('allows a Vercel per-deployment URL via the * pattern', () => {
    expect(
      isAllowedOrigin('https://full-stack-portfolio-rewqfblsq-bereketfanose-gmailcoms-projects.vercel.app'),
    ).toBe(true);
  });

  it('rejects unknown origins, including look-alikes outside the pattern', () => {
    expect(isAllowedOrigin('https://evil.example.com')).toBe(false);
    expect(isAllowedOrigin('https://full-stack-portfolio-x-someone-else.vercel.app')).toBe(false);
    // Wildcard must not span across dots or match an attacker-controlled subdomain suffix.
    expect(isAllowedOrigin('https://full-stack-portfolio-a.b-bereketfanose-gmailcoms-projects.vercel.app')).toBe(false);
    expect(isAllowedOrigin('https://full-stack-portfolio-ten-coral.vercel.app.evil.com')).toBe(false);
  });

  it('answers preflight for an allowed origin and 403s a blocked one', async () => {
    const ok = await request(app)
      .options('/api/auth/login')
      .set('Origin', 'https://full-stack-portfolio-ten-coral.vercel.app')
      .set('Access-Control-Request-Method', 'POST');
    expect(ok.status).toBe(204);
    expect(ok.headers['access-control-allow-origin']).toBe('https://full-stack-portfolio-ten-coral.vercel.app');
    expect(ok.headers['access-control-allow-credentials']).toBe('true');

    const blocked = await request(app)
      .options('/api/auth/login')
      .set('Origin', 'https://evil.example.com')
      .set('Access-Control-Request-Method', 'POST');
    expect(blocked.status).toBe(403);
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });
});
