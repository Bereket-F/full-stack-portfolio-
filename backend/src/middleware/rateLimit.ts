import rateLimit from 'express-rate-limit';
import { env } from '@/config/env';

/** General limiter applied to all /api routes. */
export const apiLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});

/** Stricter limiter for sensitive endpoints (login, contact form). */
export const sensitiveLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
