# End-to-end tests (Playwright)

These tests exercise the real frontend + backend + database together. They are not mocked.

## Prerequisites

1. Backend running with a database seeded and an admin account created:
   ```bash
   cd backend
   npm run dev
   ```
2. Frontend running:
   ```bash
   cd frontend
   npm run dev
   ```
3. Set the admin credentials used by the login/project-management specs (defaults to
   `admin@example.com` / `ChangeMe123!` if unset — create a matching account with
   `npm run create-admin` in `backend/`, or override via env vars):
   ```bash
   export E2E_ADMIN_EMAIL="admin@example.com"
   export E2E_ADMIN_PASSWORD="ChangeMe123!"
   ```

## Running

```bash
cd frontend
npx playwright install --with-deps   # first time only
npm run test:e2e
```

## Coverage

- `login.spec.ts` — invalid credentials, successful login, unauthenticated redirect
- `project-crud.spec.ts` — admin creates, edits, and deletes a project
- `contact-form.spec.ts` — public contact form validation and successful submission
