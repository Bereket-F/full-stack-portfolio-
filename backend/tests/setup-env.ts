// Runs before every test file, before any module is imported, so `env` sees these values.
process.env.CORS_ORIGIN = [
  'http://localhost:3000',
  'https://full-stack-portfolio-ten-coral.vercel.app',
  'https://full-stack-portfolio-*-bereketfanose-gmailcoms-projects.vercel.app',
].join(',');
