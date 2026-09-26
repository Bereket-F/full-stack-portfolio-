import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
  /** Must match the user's current `tokenVersion` in the DB or the token is treated as revoked. */
  tokenVersion: number;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const options: jwt.SignOptions = { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
