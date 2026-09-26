/* eslint-disable no-console */
import readline from 'readline';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('Create an admin account for the portfolio dashboard.\n');

  const email = await ask('Admin email: ');
  const password = await ask('Admin password (min 8 chars, visible as you type): ');

  if (!email.includes('@')) {
    console.error('Please provide a valid email.');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    // Bump tokenVersion on password reset so any previously-issued JWTs stop working.
    update: { passwordHash, tokenVersion: { increment: 1 } },
    create: { email, passwordHash, role: 'ADMIN' },
  });

  console.log(`\nAdmin account ready: ${user.email}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
