# Launch Blockers Resolved

Date: 2026-06-11

## Summary

Resolved the launch-blocking authentication, validation, rate limiting, CORS, database hardening, observability, and deployment-configuration findings from the security, database, and production readiness audits.

Updated readiness score: **84/100**

Readiness tier: **Closed Beta ready** after environment secrets are configured in the hosting platforms. MindMate is not yet Production ready because the remaining items are operational hardening and release-governance work rather than feature work.

## Files Modified

- `backend/src/main/java/com/mindmate/dto/AuthDtos.java`
- `backend/src/main/java/com/mindmate/dto/AppDtos.java`
- `backend/src/main/java/com/mindmate/controller/WellnessController.java`
- `backend/src/main/java/com/mindmate/controller/ApiExceptionHandler.java`
- `backend/src/main/java/com/mindmate/controller/UnauthorizedException.java`
- `backend/src/main/java/com/mindmate/service/AuthService.java`
- `backend/src/main/java/com/mindmate/service/GeminiService.java`
- `backend/src/main/java/com/mindmate/config/SecurityConfig.java`
- `backend/src/main/java/com/mindmate/config/StartupSafetyConfig.java`
- `backend/src/main/java/com/mindmate/observability/SentryHooks.java`
- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/db/migration/V8__production_hardening_constraints_indexes.sql`
- `frontend/src/main.jsx`
- `frontend/src/lib/sentry.js`
- `.env.example`
- `vercel.json`
- `docs/api-documentation.md`
- `docs/frontend-context-plan.md`
- `docs/production-env.md`
- `docs/railway-deployment.md`

## Security Fixes Added

- Removed password reset token exposure from forgot-password responses.
- Normalized login failures so unknown email and wrong password both return `401`.
- Added malformed JWT handling in the JWT filter so invalid bearer tokens return `401` instead of reaching the generic `500` handler.
- Explicitly disabled HTTP Basic and form login for the JWT-only API.
- Added an empty `UserDetailsService` bean to prevent Spring Boot from creating a generated development user.
- Added validation annotations across auth and wellness request DTOs.
- Added `@Valid` to controller request bodies and method parameter validation for bounded query/path inputs.
- Enforced mood values, stress/energy/sleep bounds, progress bounds, study-minute bounds, and text length limits.
- Added API rate limiting for:
  - `POST /api/auth/login`
  - `POST /api/auth/forgot-password`
  - `POST /api/chat`
  - `GET /api/reflections/weekly`
  - `GET /api/future-me/generate`
- Replaced hardcoded CORS origins with `ALLOWED_ORIGINS`.
- Replaced `printStackTrace()` in Gemini provider handling with structured logging.
- Added request correlation IDs via `X-Request-ID` and logging MDC.
- Added backend and frontend Sentry hook points without forcing a new vendor dependency into the launch-blocker sprint.

## Migrations Added

Added `V8__production_hardening_constraints_indexes.sql`.

It adds:

- Wellness CHECK constraints for mood, sleep, energy, stress, social interaction, wellness score, goal progress, study minutes, XP, pet XP, level, and streak bounds.
- Unique indexes for `user_badges(user_id, badge_name)` and `user_challenges(user_id, challenge_type)`.
- Missing query-path indexes for exams, gratitude, recommendations, chat sessions, future-me letters, habits, and moderation audit logs.

Flyway verification: backend startup validated 8 migrations and reported schema version 8 as current.

## Migration Safety

- Added `StartupSafetyConfig` to refuse non-dev startup when the default JWT secret is used.
- Added a non-dev startup guard that refuses to run if demo seed users are present.
- Existing historical seed migrations were not rewritten, because changing applied Flyway migrations would create checksum and deployment risk. Production safety is now enforced at startup, and future demo data should live outside production schema migrations.

## Deployment Changes

- Added root `vercel.json` for the Vite frontend build/output path.
- Added `docs/production-env.md` with required Vercel/Railway/Neon environment variables.
- Added `docs/railway-deployment.md` with backend deployment notes, health-check path, and startup safety rules.
- Updated `.env.example` for `ALLOWED_ORIGINS`, `VITE_API_BASE_URL`, `SENTRY_DSN`, and `VITE_SENTRY_DSN`.
- Confirmed `/actuator/health` is publicly accessible for deployment health checks.

## Verification Results

- Backend package: passed with bundled Maven.
- Frontend production build: passed with `npm run build`.
- Backend startup: passed on `8088`.
- Flyway: validated and migrated to version 8.
- `GET /actuator/health`: `200`.
- Unknown email login: `401`.
- Wrong password login: `401`.
- Forgot-password response: `200`, message only, no reset token.
- Malformed JWT protected request: `401`.
- Invalid authenticated check-in payload: `400`.
- Invalid goal progress payload: `400`.
- Empty AI chat message: `400`.
- Protected companion route with valid JWT: `200`.
- CORS preflight from `http://localhost:5173`: `200`.
- Login rate limit: 11th request returned `429`.
- Request correlation: `X-Request-ID` returned on verified responses.

## Remaining Medium/Low Risks

- JWTs are still stored in `localStorage`; production should consider HttpOnly secure cookies or a strict CSP plus short-lived bearer tokens.
- Sentry hooks are prepared, but the actual Sentry SDK dependency and project DSNs still need to be configured when the team chooses the Sentry project.
- Password reset is token-safe at the API boundary, but a production email delivery provider and hashed reset-token storage are still recommended.
- Analytics/correlation queries can still load full user history into memory; this should be optimized before larger Open Beta traffic.
- Backend dependency CVE scanning should be completed in CI; the earlier local OWASP dependency-check timed out.
- The repository root is currently the parent folder, and `mindmate/` is untracked from that root. Do not release until the project is committed intentionally with local artifacts excluded.

## Launch Readiness Assessment

Closed Beta: **Ready**, assuming production secrets and allowed origins are set correctly.

Open Beta: **Not yet**. Needs release-governance cleanup, monitoring setup, and analytics query optimization.

Production: **Not yet**. Needs full CI security scanning, real Sentry integration, production password-reset email flow, backup/restore drill, and committed release history.
