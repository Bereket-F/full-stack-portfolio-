# Bereket Fanose — Full-Stack Portfolio

A production-quality developer/QA-engineer portfolio with a clearly separated Next.js frontend, an Express + TypeScript REST API, and PostgreSQL via Prisma. The public site and the admin dashboard both talk to the backend over HTTP — nothing is faked with Next.js API routes.

```
Next.js Frontend  →  REST API  →  Node.js + Express Backend  →  Prisma ORM  →  PostgreSQL
```

## Project structure

```
portfolio/
├── backend/                 Express + TypeScript API
│   ├── prisma/               schema.prisma, migrations, seed.ts
│   ├── src/
│   │   ├── config/            env loading, constants
│   │   ├── controllers/       request handlers
│   │   ├── routes/            express routers
│   │   ├── services/          business logic / Prisma queries
│   │   ├── middleware/         auth, error handling, rate limiting
│   │   ├── validators/         zod schemas
│   │   ├── utils/              helpers (jwt, password, http errors)
│   │   ├── lib/                prisma client
│   │   └── app.ts / server.ts
│   ├── tests/                 Jest + Supertest API tests
│   └── scripts/               create-admin.ts
│
├── frontend/                 Next.js 16 (App Router) + React 19 + TypeScript + Tailwind + shadcn/ui
│   ├── app/                   public routes + /admin routes
│   ├── components/            ui/, sections/, admin/
│   ├── lib/                   api client, utils, types
│   ├── hooks/
│   └── e2e/                   Playwright tests
│
├── docker-compose.yml        Postgres (+ optional backend/frontend) for local dev
├── .env.example
└── README.md
```

## Tech stack

| Layer    | Tech                                                                                  |
| -------- | ------------------------------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend  | Node.js, Express, TypeScript, Zod                                                     |
| Database | PostgreSQL, Prisma ORM                                                                |
| Auth     | JWT in HTTP-only cookies, bcrypt password hashing                                     |
| Testing  | Jest + Supertest (API), Vitest + Testing Library (components), Playwright (E2E)       |
| Tooling  | ESLint, Prettier, Docker                                                              |

## Getting started

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or use the provided Docker Compose)
- npm 10+

### 2. Start PostgreSQL

Using Docker:

```bash
docker compose up -d postgres
```

Or point `DATABASE_URL` at any existing Postgres instance.

### 3. Backend setup

```bash
cd backend
cp .env.example .env      # edit DATABASE_URL, JWT_SECRET, CORS_ORIGIN, etc.
npm install
npx prisma migrate dev    # creates tables
npm run seed               # inserts placeholder profile/projects/skills/etc.
npm run create-admin        # interactive: creates your admin login
npm run dev                 # http://localhost:4000
```

### 4. Frontend setup

```bash
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                   # http://localhost:3000
```

Public site: http://localhost:3000
Admin dashboard: http://localhost:3000/admin/login

### 5. Environment variables

**backend/.env**

| Variable                                  | Description                                                           |
| ----------------------------------------- | --------------------------------------------------------------------- |
| `DATABASE_URL`                            | Postgres connection string                                            |
| `PORT`                                    | API port (default 4000)                                               |
| `NODE_ENV`                                | development / production                                              |
| `JWT_SECRET`                              | Secret used to sign auth tokens (long random string)                  |
| `JWT_EXPIRES_IN`                          | e.g. `7d`                                                             |
| `COOKIE_NAME`                             | Name of the auth cookie                                               |
| `COOKIE_SAMESITE`                         | `lax` (same-domain dev) or `none` (cross-domain prod, requires HTTPS) |
| `CORS_ORIGIN`                             | Comma-separated list of exact trusted frontend origins (no wildcards) |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Rate limiting for sensitive routes                                    |

**frontend/.env.local**

| Variable               | Description                           |
| ---------------------- | ------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Base URL of the backend API           |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for SEO/sitemap |

No secrets are hardcoded anywhere; `.env` files are git-ignored and `.env.example` files document required variables.

## Security

- **Auth**: stateless JWT in an HTTP-only cookie, but every request re-verifies the user against the database (`authenticate` middleware) rather than trusting the token's claims alone. Each `User` has a `tokenVersion`; logging out (or resetting a password via `create-admin`) increments it, which immediately invalidates every previously-issued token for that user — even one that was copied out of the browser before logout.
- **Authorization**: `authenticate` (who are you) and `requireAdmin` (are you allowed) are separate middleware, applied in that order to every `/api/admin/*` route, matching the standard 401-then-403 flow.
- **Cookies**: `HttpOnly` always; `Secure` in production or whenever `COOKIE_SAMESITE=none`; `SameSite` is configurable because cross-domain production deployments (frontend on one domain, backend on another) require `none`, while same-domain/local setups can stay on the more restrictive `lax`.
- **CORS**: explicit origin whitelist (`CORS_ORIGIN`, comma-separated) checked in code — never a wildcard — so credentialed requests are only ever accepted from known origins. Helmet's `Cross-Origin-Resource-Policy` is set to `cross-origin` since the API is intentionally called from a separate frontend domain.
- **Passwords**: bcrypt (cost 12), never returned in any API response, never logged.
- **Rate limiting**: login and the contact form are capped at 10 requests per 15-minute window per IP.
- Automated tests in `backend/tests/authorization.test.ts` and `rate-limit.test.ts` assert the 401/403 flow, that logout really revokes sessions, and that the login rate limiter triggers a 429.

### 6. PostgreSQL setup notes

- Create a database, e.g. `createdb portfolio`.
- `DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"`
- Prisma manages the schema entirely — do not hand-edit tables.

### 7. Prisma migrations

```bash
cd backend
npx prisma migrate dev --name <change-description>   # dev migration
npx prisma migrate deploy                              # apply in production
npx prisma studio                                       # inspect data visually
```

### 8. Admin account setup

Admins are never seeded with a fixed password. Run:

```bash
cd backend
npm run create-admin
```

This prompts for an email and password, hashes the password with bcrypt, and inserts a `User` row with `role=ADMIN`.

### 9. Running tests

```bash
# Backend API tests (Jest + Supertest, uses a test database)
cd backend && npm test

# Frontend component tests (Vitest + Testing Library)
cd frontend && npm test

# End-to-end tests (Playwright — requires both servers running)
cd frontend && npm run test:e2e
```

See `backend/tests/README.md` and `frontend/e2e/README.md` for details.

### 10. Deployment

- **Frontend** → Vercel: set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
- **Backend** → Render / Railway / Fly.io: set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` (your Vercel URL). Run `npx prisma migrate deploy` on release.
- **Database** → Neon / Supabase / Railway Postgres, or any managed Postgres.
- Nothing is hardcoded to a specific provider — everything is environment-variable driven, and `docker-compose.yml` can run the whole stack (Postgres + backend + frontend) for self-hosting.

## Architecture explanation

The frontend never talks to the database directly. Every dynamic piece of content (profile, projects, skills, experience, education, blog, messages) is fetched from the Express REST API, which is the single source of truth and the only thing with a Prisma client. This keeps the admin dashboard and the public site consistent (same data, same validation rules) and makes the backend independently testable and deployable.

**Auth cookie note**: the admin JWT is an HTTP-only cookie set by the backend. In production the frontend and backend usually live on different domains, so a Next.js server (middleware/SSR) can never read that cookie — only the browser can, when it calls the backend directly. Because of this, admin authentication is enforced entirely client-side: `hooks/use-auth.tsx` calls `GET /api/auth/me` from the browser (with `credentials: 'include'`) and `components/admin/auth-guard.tsx` redirects to `/admin/login` if that fails. The backend's `requireAuth` middleware is the real authorization boundary — the frontend guard only improves UX.

## Database relationships

- `Profile` (singleton) `1—N` `SocialLink`
- `Project` `N—N` `Technology` through `ProjectTechnology`
- `BlogPost` `N—N` `BlogTag` through `BlogPostTag`
- `Experience`, `Education`, `Skill`, `Message` are independent tables owned by the admin `User`
- `User` (role `ADMIN`) is the only authenticated actor; there is no public user registration

See `backend/prisma/schema.prisma` for the full model with field-level comments.

## API reference

Public, read-only, no auth required:

| Method | Path                  | Description                                       |
| ------ | --------------------- | ------------------------------------------------- |
| GET    | `/api/health`         | Liveness check                                    |
| GET    | `/api/profile`        | Public profile + social links                     |
| GET    | `/api/projects`       | Published projects (`?category=`, `?featured=`)   |
| GET    | `/api/projects/:slug` | Single published project                          |
| GET    | `/api/skills`         | All skills                                        |
| GET    | `/api/experience`     | Experience timeline                               |
| GET    | `/api/education`      | Education records                                 |
| GET    | `/api/blog`           | Published blog posts                              |
| GET    | `/api/blog/:slug`     | Single published post                             |
| POST   | `/api/messages`       | Submit the contact form (rate-limited)            |
| POST   | `/api/auth/login`     | Admin login (rate-limited, sets HTTP-only cookie) |
| POST   | `/api/auth/logout`    | Clears the auth cookie                            |
| GET    | `/api/auth/me`        | Current admin user (requires cookie)              |

Protected admin surface — everything under `/api/admin/*` requires the auth cookie and returns unpublished/draft content too:

| Method                                   | Path                          |
| ---------------------------------------- | ----------------------------- |
| GET                                      | `/api/admin/dashboard/stats`  |
| GET/POST/PUT/DELETE                      | `/api/admin/projects[/:id]`   |
| GET/POST/PUT/DELETE                      | `/api/admin/skills[/:id]`     |
| GET/POST/PUT/DELETE                      | `/api/admin/experience[/:id]` |
| GET/POST/PUT/DELETE                      | `/api/admin/education[/:id]`  |
| GET/POST/PUT/DELETE                      | `/api/admin/blog[/:id]`       |
| GET, PATCH (`/read`, `/archive`), DELETE | `/api/admin/messages[/:id]`   |
| GET/PUT                                  | `/api/admin/profile`          |

All admin mutation routes validate input with `zod` and return `400` with field-level details on failure, `401` when unauthenticated, `404` for missing records, and never leak stack traces (see `src/middleware/errorHandler.ts`).
