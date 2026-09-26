import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/utils/password';
import { signAuthToken } from '@/utils/jwt';
import { HttpError } from '@/utils/httpError';
import { LoginInput } from '@/validators/auth.validator';

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Same generic message whether the email doesn't exist or the password is wrong.
  if (!user) {
    throw HttpError.unauthorized('Invalid email or password');
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw HttpError.unauthorized('Invalid email or password');
  }

  const token = signAuthToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  });
  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw HttpError.notFound('User not found');
  return { id: user.id, email: user.email, role: user.role };
}

/** Bumps tokenVersion so any previously-issued JWT for this user is immediately rejected. */
export async function invalidateSessions(id: string) {
  await prisma.user.update({ where: { id }, data: { tokenVersion: { increment: 1 } } });
}
