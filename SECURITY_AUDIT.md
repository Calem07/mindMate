# MindMate Security Audit

Date: 2026-06-11  
Scope: Spring Boot backend, React frontend auth/API handling, local runtime behavior, dependency posture, Git/GitHub release hygiene.

## Executive Summary

MindMate is suitable for a controlled Closed Beta after security hardening tasks are acknowledged and the beta audience is limited. It is not ready for Open Beta or Production because password reset behavior, CORS, validation, rate limiting, and release hygiene need attention before broader exposure.

Launch readiness score: 62/100

Readiness tier:

- Closed Beta: Yes, with limited users, non-production secrets, and active monitoring.
- Open Beta: No.
- Production: No.

## Verification Evidence

- Backend build: `mvn package` passed.
- Frontend build: `npm run build` passed.
- Frontend production dependency audit: `npm audit --omit=dev --json` found 0 vulnerabilities.
- Backend OWASP dependency-check: attempted, but timed out locally after ~124s; do not treat backend CVE coverage as complete.
- Chrome Plugin verification: login and protected routes rendered with no console errors.
- Health endpoint: `GET http://localhost:8088/actuator/health` returns `UP`.

GitHub integration status:

- Local Git root resolved to `C:\Users\RAKTIM\Documents\New project`.
- Current branch: `master`.
- No commits exist on the current branch.
- `mindmate/` is currently untracked from the parent Git root.
- `gh` CLI is not installed, and no GitHub MCP callable was exposed in this session.
- Risk: there is no reliable commit history or PR diff boundary for release review.
- Recommendation: commit these audit reports after review, but do not commit local `.env`, generated probe JSON, build outputs, or local runtime artifacts.

## Findings

### Critical

None confirmed in the current local audit.

### High

#### H-1: Password reset endpoint returns the reset token in API responses

Evidence:

- `backend/src/main/java/com/mindmate/service/AuthService.java:54`
- `backend/src/main/java/com/mindmate/dto/AuthDtos.java:14`

The forgot-password flow returns `devToken` directly to the caller. This is acceptable only as a local development stub. In any public environment, it becomes an account takeover primitive.

Recommended fix:

- Gate dev-token responses behind `APP_ENV=dev`, or remove `devToken` from the API response entirely.
- Send reset links through a trusted email provider.
- Store only hashed reset tokens.
- Add rate limiting and account enumeration-safe responses.

#### H-2: Broad local CORS configuration is unsafe if promoted to production

Evidence:

- `backend/src/main/java/com/mindmate/config/SecurityConfig.java:50`

The backend allows `http://localhost:*` and `http://127.0.0.1:*`. This fixed local development, but it must not be the production policy.

Recommended fix:

- Make CORS origins environment-specific.
- In production, allow only the Vercel production and preview origins that should access the API.
- Add `allowCredentials` only if cookies are introduced; current bearer-token flow does not require it.

#### H-3: Most wellness API request DTOs have no validation

Evidence:

- `backend/src/main/java/com/mindmate/controller/WellnessController.java:36`
- `backend/src/main/java/com/mindmate/controller/WellnessController.java:46`
- `backend/src/main/java/com/mindmate/controller/WellnessController.java:71`
- `backend/src/main/java/com/mindmate/controller/WellnessController.java:102`
- `backend/src/main/java/com/mindmate/dto/AppDtos.java:10`
- `backend/src/main/java/com/mindmate/dto/AppDtos.java:25`
- `backend/src/main/java/com/mindmate/dto/AppDtos.java:35`

Auth DTOs use Jakarta validation, but most application DTOs accept raw strings and numbers without `@Valid`, `@NotBlank`, `@Size`, `@Min`, `@Max`, or enum validation. This can cause oversized content, invalid wellness scores, negative study minutes, null mood crashes, and noisy database errors.

Recommended fix:

- Add validation annotations to every request record.
- Add `@Valid` to every `@RequestBody` in `WellnessController`.
- Add domain bounds: mood enum, energy/stress/sleep quality 1-5, sleep hours 0-24, progress 0-100, positive focus minutes, bounded text lengths.

#### H-4: No rate limiting on auth, AI, password reset, or write-heavy routes

Evidence:

- No rate-limiting implementation was found in `backend/src/main/java/com/mindmate`.
- Exposed endpoints in `backend/src/main/java/com/mindmate/controller/AuthController.java:23`
- AI-backed chat in `backend/src/main/java/com/mindmate/controller/WellnessController.java:71`
- AI generation endpoints in `backend/src/main/java/com/mindmate/controller/WellnessController.java:221` and `backend/src/main/java/com/mindmate/controller/WellnessController.java:225`

Recommended fix:

- Add IP and user based throttling for `/api/auth/login`, `/api/auth/forgot-password`, `/api/chat`, `/api/reflections/weekly`, and `/api/future-me/generate`.
- Enforce provider-cost guards for Gemini-backed endpoints.
- Add account lockout or progressive delay for repeated login failures.

### Medium

#### M-1: JWT filter does not safely handle invalid/malformed tokens

Evidence:

- `backend/src/main/java/com/mindmate/config/SecurityConfig.java:73`
- `backend/src/main/java/com/mindmate/config/JwtService.java:27`
- `backend/src/main/java/com/mindmate/controller/ApiExceptionHandler.java:14`

`jwtService.subject(token)` can throw during filter execution. There is no local catch that clears the context and returns a clean 401. Depending on filter/error handling, malformed tokens may appear as 500s.

Recommended fix:

- Catch JWT parsing exceptions in `JwtAuthFilter`.
- Return 401 for invalid tokens.
- Avoid routing token parsing failures to the generic 500 handler.

#### M-2: JWTs are stored in `localStorage`

Evidence:

- `frontend/src/lib/api.js:4`
- `frontend/src/lib/auth.js:3`
- `frontend/src/App.jsx:294`

`localStorage` tokens are vulnerable to theft if an XSS issue is introduced. The app is currently an SPA bearer-token design, so this is common, but it is not production-best for sensitive wellness data.

Recommended fix:

- For production, consider HttpOnly secure same-site cookies plus CSRF protection.
- If bearer tokens remain, add strict CSP, avoid dangerous HTML injection, keep token TTL short, and add refresh/session revocation strategy.

#### M-3: Default secrets and deployment examples are development-grade

Evidence:

- `.env.example:4`
- `backend/src/main/resources/application.yml:29`
- `docker-compose.yml:24`

The default JWT secret is predictable and appears in example/development configuration.

Recommended fix:

- Require a strong `JWT_SECRET` in non-dev environments.
- Fail backend startup when `APP_ENV != dev` and the default secret is present.
- Rotate any real environment that ever used the default value.

#### M-4: Login error behavior may leak account existence

Evidence:

- `backend/src/main/java/com/mindmate/service/AuthService.java:39`
- `backend/src/main/java/com/mindmate/service/AuthService.java:41`
- `backend/src/main/java/com/mindmate/controller/ApiExceptionHandler.java:14`

Unknown users throw `NoSuchElementException`, which maps to generic 500, while wrong passwords throw `Invalid credentials` as 400. This is both a reliability issue and a weak account enumeration signal.

Recommended fix:

- Return the same 401 response for unknown email and bad password.
- Use constant-ish timing where practical.
- Add tests for both cases.

#### M-5: Provider exception prints stack traces

Evidence:

- `backend/src/main/java/com/mindmate/service/GeminiService.java:73`

`ex.printStackTrace()` can leak provider details, request paths, and operational context in logs.

Recommended fix:

- Replace with structured logger calls.
- Do not log prompts, student text, API keys, or full provider response bodies.

#### M-6: Admin moderation reads broad sensitive content

Evidence:

- `backend/src/main/java/com/mindmate/service/AdminService.java:36`
- `backend/src/main/java/com/mindmate/service/AdminService.java:38`
- `backend/src/main/java/com/mindmate/service/AdminService.java:40`

Admin routes are role-protected and filter by user consent, which is good. However, the service returns full journal/chat content and iterates all users with no pagination.

Recommended fix:

- Add pagination and date windows.
- Add reason codes and audit metadata for each access.
- Consider redaction/summarization for non-crisis content.
- Add automated tests for consent and admin-only access.

### Low

#### L-1: CSRF is disabled

Evidence:

- `backend/src/main/java/com/mindmate/config/SecurityConfig.java:31`

This is acceptable for stateless bearer-token APIs, but must be revisited if cookies are introduced.

Recommended fix:

- Document the auth mode.
- Re-enable CSRF if moving to cookie-based auth.

#### L-2: Health endpoint is public

Evidence:

- `backend/src/main/java/com/mindmate/config/SecurityConfig.java:35`
- `backend/src/main/resources/application.yml:18`

Public health checks are normal for deployment platforms. Current health does not expose sensitive detail.

Recommended fix:

- Keep `/actuator/health` public.
- Do not expose full actuator endpoints publicly.
- Keep detailed health output restricted.

#### L-3: Browser token preview shown in settings

Evidence:

- `frontend/src/App.jsx:4214`

Settings displays the first 50 characters of the JWT. This is not full disclosure, but token previews are unnecessary in user UI.

Recommended fix:

- Remove token preview from production UI.
- Replace with session status metadata.

## Authorization and Ownership Review

Positive findings:

- `/api/admin/**` requires `ROLE_ADMIN` in `SecurityConfig`.
- Most mutable resource operations filter by current user ownership before update/delete:
  - Journals: `backend/src/main/java/com/mindmate/service/WellnessService.java:71`
  - Habits: `backend/src/main/java/com/mindmate/service/TeenWellnessService.java:252`
  - Goals: `backend/src/main/java/com/mindmate/service/TeenWellnessService.java:341`
  - Exams: `backend/src/main/java/com/mindmate/service/TeenWellnessService.java:403`

Risks:

- Several read APIs return all records for the current user without pagination.
- Admin APIs return broad data.
- No explicit tests for cross-user object access were found.

Recommended tests:

- Student A cannot update/delete Student B resources.
- Student cannot access `/api/admin/**`.
- Admin moderation respects consent.
- Invalid token returns 401, not 500.

## Dependency Risk

Frontend:

- `npm audit --omit=dev` returned 0 production vulnerabilities.
- Build warning: main JS chunk is ~962 kB; performance issue, not a security issue.

Backend:

- Spring Boot parent is `3.4.1`.
- JJWT is `0.12.6`.
- OWASP dependency-check did not complete within local timeout.

Recommended fix:

- Add dependency scanning in CI where the vulnerability database can be cached.
- Enable Dependabot or Renovate for Maven and npm.

## Architecture Security Notes

- The backend uses server-side user lookup from JWT subject rather than trusting role claims alone, which is good.
- Gemini API key is server-side only.
- The frontend stores only the API base URL as a Vite public env value; this is appropriate.
- No obvious raw `dangerouslySetInnerHTML` was found in the inspected source.

## Recommended Fix Order

1. Remove password reset token from responses outside dev.
2. Add production CORS allowlist via environment.
3. Add validation annotations and `@Valid` across application DTOs.
4. Add rate limits for auth and AI routes.
5. Normalize auth errors to 401 and handle invalid JWTs cleanly.
6. Add CI dependency scanning.
7. Remove token preview from settings UI.

## Report Commit Recommendation

Commit this report after review. It contains no plaintext secrets.

Do not commit:

- `.env`
- `integration-probe-results.json`
- `route-verify-results.json`
- `frontend/dist/`
- `backend/target/`
