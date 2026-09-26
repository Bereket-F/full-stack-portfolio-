import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { env } from '@/config/env';
import { loginSchema } from '@/validators/auth.validator';
import * as authService from '@/services/auth.service';
import { verifyAuthToken } from '@/utils/jwt';
import { HttpError } from '@/utils/httpError';

const cookieOptions = {
  httpOnly: true,
  // SameSite=None requires Secure regardless of NODE_ENV, or browsers reject the cookie.
  secure: env.isProd || env.cookieSameSite === 'none',
  sameSite: env.cookieSameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const { token, user } = await authService.login(input);

  res.cookie(env.cookieName, token, cookieOptions);
  res.json({ user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[env.cookieName];

  // Best-effort server-side revocation: bump tokenVersion so this exact JWT can never be
  // replayed again, even if it was copied out of the browser before logout.
  if (token) {
    try {
      const payload = verifyAuthToken(token);
      await authService.invalidateSessions(payload.sub);
    } catch {
      // Token was already invalid/expired — nothing to revoke, just clear the cookie below.
    }
  }

  res.clearCookie(env.cookieName, { ...cookieOptions, maxAge: undefined });
  res.json({ success: true });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw HttpError.unauthorized();
  const user = await authService.getUserById(req.user.sub);
  res.json({ user });
});
