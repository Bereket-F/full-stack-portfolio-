import { NextFunction, Request, Response } from 'express';
import { env } from '@/config/env';
import { verifyAuthToken } from '@/utils/jwt';
import { HttpError } from '@/utils/httpError';
import { prisma } from '@/lib/prisma';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { sub: string; email: string; role: string };
    }
  }
}

/**
 * Verifies the JWT cookie AND re-checks the user against the database on every request:
 * this rejects tokens for deleted users and tokens whose `tokenVersion` has been bumped
 * (e.g. by logout or a password reset), which a stateless JWT check alone cannot do.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[env.cookieName];

  if (!token) {
    return next(HttpError.unauthorized('Authentication required'));
  }

  try {
    const payload = verifyAuthToken(token);

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return next(HttpError.unauthorized('Session has been revoked, please sign in again'));
    }

    req.user = { sub: user.id, email: user.email, role: user.role };
    return next();
  } catch {
    return next(HttpError.unauthorized('Invalid or expired session'));
  }
}

/** Must run after `authenticate`. Authorizes the request based on the DB-verified role. */
export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(HttpError.unauthorized('Authentication required'));
  if (req.user.role !== 'ADMIN') return next(HttpError.forbidden('Admin privileges required'));
  return next();
}

/** @deprecated kept as an alias so any older imports keep working; use `authenticate` instead. */
export const requireAuth = authenticate;
