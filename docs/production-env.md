# MindMate Production Environment

## Frontend (Vercel)

Set these in Vercel before building:

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Public backend URL, for example `https://mindmate-api.example.com` |
| `VITE_SENTRY_DSN` | No | Frontend Sentry DSN when Sentry is enabled |

Vite reads `VITE_*` values at build time, so rebuild after changing them.

## Backend (Railway)

Set these in Railway:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon JDBC URL. Use direct connection for Flyway migrations. |
| `DATABASE_USERNAME` | Yes | Neon database role. |
| `DATABASE_PASSWORD` | Yes | Neon database password. |
| `JWT_SECRET` | Yes | Must not be the development default. Use a long random secret. |
| `APP_ENV` | Yes | Use `prod` for production. Non-dev startup refuses default secrets and demo users unless `ALLOW_DEMO_USERS=true`. |
| `ALLOW_DEMO_USERS` | No | Defaults to `false`. Use `true` only for controlled closed beta deployments that still contain historical Flyway demo seed users. Logs a warning on startup. |
| `ALLOWED_ORIGINS` | Yes | Comma-separated frontend origins, for example `https://mindmate.vercel.app`. |
| `GEMINI_API_KEY` | No | Required for live Gemini responses; fallback text works without it. |
| `GEMINI_MODEL` | No | Defaults to `gemini-2.5-pro`. |
| `SENTRY_DSN` | No | Backend Sentry DSN when Sentry dependency is enabled. |
| `PORT` | Yes | Provided by Railway automatically. |

## Safety Rules

- Never deploy with `JWT_SECRET=change-this-development-secret-change-this-development-secret`.
- Never deploy a production database containing `student@mindmate.local` or `admin@mindmate.local`.
- `ALLOW_DEMO_USERS=true` is a temporary closed-beta escape hatch only. Remove demo users and set it back to `false` before open beta or production.
- Keep `.env` out of Git.
- Configure Railway health checks to `/actuator/health`.
