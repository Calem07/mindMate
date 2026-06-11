# MindMate Production Readiness Report

Date: 2026-06-11  
Scope: Vercel frontend readiness, Railway backend readiness, Neon Postgres readiness, deployment config, observability, health checks, backups, release process.

## Executive Summary

MindMate is locally stable and ready for a controlled Closed Beta. It is not ready for Open Beta or Production until security hardening, production deployment configuration, database constraints/indexes, monitoring, and release hygiene are completed.

Launch readiness score: 64/100

Readiness tier:

- Closed Beta: Yes, with limited users and active monitoring.
- Open Beta: No.
- Production: No.

## Runtime Verification

Local verification completed:

- Backend build: passed with `mvn package`.
- Frontend build: passed with `npm run build`.
- Health endpoint: `GET /actuator/health` returns `UP`.
- Chrome Plugin: login and protected routes rendered successfully with no console errors.
- Frontend production dependency audit: 0 production vulnerabilities.

Chrome Plugin notes:

- Chrome successfully verified local login and protected routes.
- Direct Chrome navigation to `http://localhost:8088/actuator/health` was blocked by the browser/extension with `ERR_BLOCKED_BY_CLIENT`.
- Terminal HTTP verification confirmed health endpoint accessibility.

## Deployment Targets

Planned target interpretation:

- Frontend: Vercel running Vite build output.
- Backend: Railway running Spring Boot.
- Database: Neon Postgres.

Relevant official docs reviewed:

- Vercel Vite docs: [https://vercel.com/docs/frameworks/frontend/vite](https://vercel.com/docs/frameworks/frontend/vite)
- Vercel environment variables: [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
- Railway health checks: [https://docs.railway.com/deployments/healthchecks](https://docs.railway.com/deployments/healthchecks)
- Railway Spring Boot guide: [https://docs.railway.com/guides/spring-boot](https://docs.railway.com/guides/spring-boot)
- Spring Boot actuator health endpoint: [https://docs.spring.io/spring-boot/api/rest/actuator/health.html](https://docs.spring.io/spring-boot/api/rest/actuator/health.html)
- Neon connection pooling: [https://neon.com/docs/connect/connection-pooling](https://neon.com/docs/connect/connection-pooling)

## GitHub and Release Hygiene

Findings:

- Git root is `C:\Users\RAKTIM\Documents\New project`, not `mindmate`.
- Current branch is `master`.
- There are no commits in the current Git repository.
- `mindmate/` appears as an untracked directory.
- `gh` CLI is not installed.
- No GitHub connector callable was exposed in this session.

Severity: High

Risk:

- There is no commit history, branch diff, PR review, CI check, or reliable release boundary.
- Generated reports and code changes cannot be safely reviewed as a normal PR until the repo is initialized or moved to its own Git root.

Recommended fix:

- Initialize or re-root Git so `mindmate` is tracked as the repository root.
- Add `.env`, build outputs, target directories, generated probe JSON, and local artifacts to `.gitignore`.
- Commit source and audit reports intentionally.
- Add branch protection and CI checks before open beta.

Should generated reports be committed?

- Yes: commit `SECURITY_AUDIT.md`, `DATABASE_HEALTH_REPORT.md`, and `PRODUCTION_READINESS_REPORT.md` after review.
- Do not commit `.env`, `frontend/dist/`, `backend/target/`, `integration-probe-results.json`, or `route-verify-results.json`.

## Vercel Frontend Readiness

Current frontend config:

- Build command: `npm run build` in `frontend`.
- Output directory: `frontend/dist`.
- Vite config loads repo-level `.env` using `envDir`.
- API base is read from `VITE_API_BASE_URL`.

Evidence:

- `frontend/package.json:7`
- `frontend/vite.config.js:8`
- `frontend/vite.config.js:13`
- `frontend/vite.config.js:16`

### Findings

#### High: No Vercel project config is present

Evidence:

- No `vercel.json` found in root or frontend directory.

Risk:

- Vercel may choose the wrong root, build command, or output directory if imported from the parent folder.

Recommended fix:

- Configure Vercel project root as `frontend`, or add root-level `vercel.json`.
- Ensure build command is `npm run build`.
- Ensure output directory is `dist`.
- Set `VITE_API_BASE_URL` in Vercel project environment variables.

#### Medium: Production API URL is build-time for Vite

Evidence:

- `frontend/src/lib/api.js:1`
- `frontend/vite.config.js:13`

Vite replaces `import.meta.env` at build time. Vercel production builds must have the correct `VITE_API_BASE_URL` at build time.

Recommended fix:

- Set `VITE_API_BASE_URL=https://<railway-backend-domain>` in Vercel for production and preview environments.
- Rebuild after changing the value.

#### Medium: Frontend Docker nginx config does not proxy `/api`

Evidence:

- `frontend/nginx.conf:1`
- `frontend/nginx.conf:6`

This is fine if frontend uses an absolute `VITE_API_BASE_URL`, but not enough for a same-origin Docker deployment that expects `/api` to proxy to backend.

Recommended fix:

- For Vercel, use absolute `VITE_API_BASE_URL`.
- For Docker-only deployment, add nginx `/api` proxy or deploy backend behind same domain through platform routing.

#### Low: Bundle size warning remains

Evidence:

- `npm run build` reports the JS chunk is larger than 500 kB.

Recommended fix:

- Add route-level code splitting after launch-critical stabilization.

## Railway Backend Readiness

Current backend config:

- Spring uses `server.port=${PORT:8080}`.
- Actuator health is exposed.
- Dockerfile exposes `8080`.

Evidence:

- `backend/src/main/resources/application.yml:16`
- `backend/src/main/resources/application.yml:18`
- `backend/Dockerfile:9`

Railway docs note that Railway injects `PORT` and uses it for health checks. MindMate correctly reads `PORT`.

### Findings

#### Medium: Dockerfile Java version differs from project Java version

Evidence:

- `backend/pom.xml:15` sets Java 17.
- `backend/Dockerfile:1` uses Maven Temurin 21.
- `backend/Dockerfile:6` uses Temurin 21 JRE.

Risk:

- Local and deployment runtimes can diverge.

Recommended fix:

- Use Java 17 images to match `pom.xml`, or explicitly upgrade project Java to 21.

#### Medium: Production CORS origin configuration is not environment-driven

Evidence:

- `backend/src/main/java/com/mindmate/config/SecurityConfig.java:50`

Recommended fix:

- Configure allowed origins from an environment variable like `ALLOWED_ORIGINS`.
- Use Vercel production and preview domains only.

#### Medium: Actuator exposure is minimal but no deployment health path is documented

Evidence:

- `backend/src/main/resources/application.yml:18`
- `backend/src/main/resources/application.yml:23`

Recommended fix:

- Configure Railway health check path as `/actuator/health`.
- Keep only health/info exposed publicly.

#### Medium: No structured logging or request tracing

Evidence:

- No logback config found.
- `GeminiService` uses `printStackTrace` at `backend/src/main/java/com/mindmate/service/GeminiService.java:73`.

Recommended fix:

- Use SLF4J structured logs.
- Add request IDs/correlation IDs.
- Redact prompts, tokens, and user content from logs.

## Neon Database Readiness

Current app config supports environment-based JDBC:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

Evidence:

- `backend/src/main/resources/application.yml:5`
- `backend/src/main/resources/application.yml:6`
- `backend/src/main/resources/application.yml:7`

### Findings

#### High: Production migration strategy is not documented

Evidence:

- Flyway is enabled in `backend/src/main/resources/application.yml:13`.
- Seed migrations include demo users and demo analytics data.

Risk:

- Production startup could apply demo seed migrations.
- No documented Neon branch migration rehearsal.

Recommended fix:

- Split production schema migrations from development seed data.
- Rehearse Flyway migrations on a Neon branch before production.
- Use a direct Neon connection for migrations.

#### Medium: No connection pooling strategy

Risk:

- Railway app instances can exhaust database connections during spikes.

Recommended fix:

- Use Neon pooled connection for runtime if connection pressure appears.
- Keep Flyway migrations on a direct connection.
- Add HikariCP max pool settings appropriate for Railway instance count and Neon plan.

#### Medium: No backup/restore runbook

Recommended fix:

- Document Neon point-in-time restore/branch restore process.
- Define RPO/RTO.
- Test restore in a non-production branch before Open Beta.

## Environment Variables

Required backend variables:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `GEMINI_API_KEY` if live AI is required
- `GEMINI_MODEL`
- `APP_ENV`
- `PORT` supplied by Railway
- Future recommendation: `ALLOWED_ORIGINS`

Required frontend variables:

- `VITE_API_BASE_URL`

Evidence:

- `.env.example:1`
- `.env.example:7`
- `backend/src/main/resources/application.yml:29`
- `backend/src/main/resources/application.yml:30`
- `backend/src/main/resources/application.yml:31`

Findings:

- `.env.example` still points `VITE_API_BASE_URL` to `http://localhost:8080`, while local stabilized backend uses `8088`.
- Default `JWT_SECRET` is development-only.

Recommended fix:

- Update examples to match current local defaults.
- Add production validation that refuses default secrets when `APP_ENV=prod`.

## Monitoring and Sentry Readiness

Findings:

- No Sentry frontend package/config found.
- No Sentry backend package/config found.
- No error boundary telemetry was found.
- No uptime monitor config found.

Severity: Medium

Recommended fix:

- Add Sentry for React frontend with release/environment tags.
- Add Sentry or OpenTelemetry for Spring Boot.
- Add alerting for 5xx spikes, auth failures, provider errors, and DB connection failures.
- Add uptime checks for `/actuator/health`.

## Security Production Blockers

See `SECURITY_AUDIT.md` for details. Production blockers:

- Password reset returns dev token.
- Missing rate limiting.
- Missing DTO validation.
- Production CORS not environment-specific.
- Default JWT secret remains in examples/config fallback.
- Invalid token handling should return 401.

## Database Production Blockers

See `DATABASE_HEALTH_REPORT.md` for details. Production blockers:

- Missing CHECK constraints for wellness bounds.
- Missing unique constraints for user badge/challenge idempotency.
- Missing indexes on several query paths.
- Demo seed migrations should not be part of production schema history.
- No migration rehearsal or restore runbook.

## Deployment Checklist

Before Closed Beta:

- Confirm production-like `JWT_SECRET` is set.
- Confirm `VITE_API_BASE_URL` points to deployed backend.
- Set Railway health path to `/actuator/health`.
- Set allowed origins for beta frontend domain.
- Add `.env` to `.gitignore` and verify it is not committed.
- Commit audit reports and source in a proper repo root.

Before Open Beta:

- Remove dev password reset token response.
- Add rate limiting.
- Add DTO validation.
- Add missing indexes and constraints.
- Add Sentry/monitoring.
- Add CI builds/tests/dependency scans.
- Add backup/restore runbook.

Before Production:

- Complete security test suite.
- Complete cross-user authorization tests.
- Complete migration rehearsal on Neon branch.
- Complete load testing for analytics/admin endpoints.
- Configure observability dashboards and alerts.
- Define data retention and deletion policies.

## Risk Register

| Severity | Area | Risk | Recommended Fix |
| --- | --- | --- | --- |
| High | Release | Repo has no commits and app dir is untracked | Re-root/initialize repo and require PR review |
| High | Auth | Password reset exposes dev token | Remove/gate token responses |
| High | Database | No domain CHECK constraints | Add constraint migration |
| High | Database | Duplicate user badges/challenges possible | Add unique constraints |
| Medium | Frontend | Vercel config missing | Configure project root/build/output/env |
| Medium | Backend | CORS not production-driven | Add `ALLOWED_ORIGINS` |
| Medium | Backend | No rate limiting/observability | Add rate limiter, Sentry/logging |
| Medium | Neon | No pooling/restore strategy | Document and configure Neon runtime/migration strategy |
| Low | Frontend | Large JS bundle | Add code splitting later |

## Final Readiness Decision

MindMate is ready for Closed Beta only.

It is not ready for Open Beta or Production until the High findings in this report, `SECURITY_AUDIT.md`, and `DATABASE_HEALTH_REPORT.md` are resolved.

## Report Commit Recommendation

Commit this report after review. It contains no plaintext secrets.
