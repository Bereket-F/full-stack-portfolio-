# Backend tests

Jest + Supertest, running against a real (test) PostgreSQL database via Prisma.

## Setup

1. Create a separate test database so tests never touch your dev data:
   ```bash
   createdb portfolio_test
   ```
2. Create `backend/.env.test` (or export inline) with a `DATABASE_URL` pointing at it:
   ```
   DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio_test?schema=public"
   JWT_SECRET=test-secret
   ```
3. Apply migrations to the test database:
   ```bash
   DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio_test?schema=public" npx prisma migrate deploy
   ```

## Running

```bash
cd backend
DATABASE_URL="postgresql://portfolio:portfolio@localhost:5432/portfolio_test?schema=public" npm test
```

Tests cover:

- `health.test.ts` — basic server liveness
- `auth.test.ts` — login success/failure, cookie issuance, `/api/auth/me`
- `authorization.test.ts` — `requireAdmin` role checks (401/403), every admin route rejects unauthenticated requests, and logout actually revokes the session server-side (a replayed pre-logout cookie is rejected)
- `rate-limit.test.ts` — repeated failed logins trigger a 429
- `projects.test.ts` — public read access, auth-gated CRUD, validation errors
- `messages.test.ts` — contact form validation, persistence, and admin-only message listing

Each test file cleans up the records it creates in `afterAll`.
