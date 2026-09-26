import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const allowedSameSite = ['lax', 'strict', 'none'] as const;
type SameSite = (typeof allowedSameSite)[number];

function parseSameSite(): SameSite {
  const raw = (process.env.COOKIE_SAMESITE ?? 'lax').toLowerCase();
  if (!allowedSameSite.includes(raw as SameSite)) {
    throw new Error(`COOKIE_SAMESITE must be one of: ${allowedSameSite.join(', ')}`);
  }
  return raw as SameSite;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  cookieName: process.env.COOKIE_NAME ?? 'portfolio_token',
  // SameSite=None is required when the frontend and backend are on different domains in
  // production; it always implies Secure, since browsers reject None cookies without it.
  cookieSameSite: parseSameSite(),
  // Comma-separated list so staging/preview + production origins can be whitelisted at once.
  // Never falls back to a wildcard — every origin must be explicitly listed.
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100),
};
