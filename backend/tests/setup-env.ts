// Runs before every test file, before any module is imported, so `env` sees these values.

// Prisma requires DIRECT_DATABASE_URL once `directUrl` is in the schema; for a local/test
// Postgres there is no pooler, so it's simply the same as DATABASE_URL.
process.env.DIRECT_DATABASE_URL ??= process.env.DATABASE_URL;

process.env.CORS_ORIGIN = [
  'http://localhost:3000',
  'https://full-stack-portfolio-ten-coral.vercel.app',
  'https://full-stack-portfolio-*-bereketfanose-gmailcoms-projects.vercel.app',
].join(',');
