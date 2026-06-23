# Backend Core Loop Blockers Report

Date: 2026-06-23
Scope: Spring Boot backend only

## Summary

Two backend blockers were addressed without modifying the Lovable frontend:

- Registration now normalizes email, initializes required user growth/companion defaults explicitly, and has clean duplicate/conflict handling.
- Daily Check-In now accepts the existing Lovable 4-step payload without requiring hidden frontend fields. Missing stress/sleep/social fields are persisted as `NULL` and excluded from analytics/correlations.

No Lovable UI, routes, visible fields, navigation, cards, copy, or product features were changed.

## Registration 500

### Observed production behavior before fix

Prior live checks against `https://mindmate-backend-pxhx.onrender.com/api/auth/register` returned:

- `500 Internal Server Error`
- body: `{"error":"Unexpected server error"}`

During this pass, the deployed Render service timed out on health/auth checks, so fresh deployed reproduction after the code change could not be completed before deployment.

### Local reproduction status

Local HTTP reproduction was attempted with the edited backend on port `8091`, but startup failed before the app could serve requests:

- Cause: local PostgreSQL credentials are not available in this shell.
- Error: `FATAL: password authentication failed for user "mindmate"`

Because local DB credentials were unavailable and Render logs were not available in this tool context, the exact production stack trace could not be read. The source-level failure class was still fixed defensively.

### Backend fix applied

File: `backend/src/main/java/com/mindmate/service/AuthService.java`

- Normalizes email once with `trim().toLowerCase()` before both lookup and save.
- Trims user name before save.
- Explicitly initializes new-user defaults:
  - `xp = 0`
  - `level = 1`
  - `currentStreak = 0`
  - `longestStreak = 0`
  - `gardenTheme = "CLASSIC"`
  - `petXp = 0`
  - `hasSelectedCompanion = false`

This removes reliance on database defaults during Hibernate inserts and prevents case/spacing variants from falling through to database uniqueness failures.

File: `backend/src/main/java/com/mindmate/controller/ApiExceptionHandler.java`

- Existing validation errors still return `400`.
- Existing email through domain validation still returns clean `400` with `Email is already registered`.
- Database uniqueness/race conflicts now return clean `409` with `Request conflicts with existing data`.
- Internal stack traces and secrets are not returned.

## Check-In API Contract After Fix

Endpoint: `POST /api/checkins`

Accepted Lovable payload:

```json
{
  "mood": "GOOD",
  "energyLevel": 4,
  "moodTrigger": "Focused, optional note"
}
```

Current backend contract:

- `mood`: required, one of `EXCELLENT`, `GOOD`, `NEUTRAL`, `STRESSED`, `SAD`
- `energyLevel`: required, integer `1..5`
- `moodTrigger`: optional, max 100 characters
- `stressLevel`: optional, integer `1..5` when present
- `sleepHours`: optional, decimal `0..24` when present
- `sleepQuality`: optional, integer `1..5` when present
- `socialInteraction`: optional, integer `1..5` when present

Missing optional values are persisted as SQL `NULL`, not `0`.

## Check-In Backend Changes

Files:

- `backend/src/main/java/com/mindmate/dto/AppDtos.java`
- `backend/src/main/java/com/mindmate/domain/DailyCheckin.java`
- `backend/src/main/java/com/mindmate/service/TeenWellnessService.java`
- `backend/src/main/java/com/mindmate/service/CorrelationEngineService.java`
- `backend/src/main/java/com/mindmate/service/ReflectionService.java`
- `backend/src/main/java/com/mindmate/service/WellnessService.java`

Behavior:

- `stressLevel`, `sleepHours`, `sleepQuality`, and `socialInteraction` changed from primitives to nullable wrappers.
- Wellness score is calculated from only the factors present.
- Sleep badges and sleep consistency challenges are evaluated only when sleep data exists.
- Burnout logic checks stress/sleep only when those values exist.
- Correlations exclude missing sleep/stress/social values.
- Weekly reflections render optional sleep/stress as `not logged`.
- Luna chat context sends JSON `null` for unknown optional values.

## Migration Added

File:

- `backend/src/main/resources/db/migration/V9__allow_partial_lovable_checkins.sql`

Migration actions:

- Drops `NOT NULL` from:
  - `daily_checkins.stress_level`
  - `daily_checkins.sleep_hours`
  - `daily_checkins.sleep_quality`
  - `daily_checkins.social_interaction`
- Replaces the wellness range constraint so optional fields are valid when `NULL` or in range.
- Keeps `energy_level`, `mood`, and `wellness_score` constrained.

## CORS

Files:

- `backend/src/main/java/com/mindmate/config/SecurityConfig.java`
- `backend/src/main/resources/application.yml`

Changes:

- Replaced wildcard origin pattern behavior with exact `allowedOrigins`.
- Default allowed origins are now:
  - `http://localhost:5177`
  - `http://127.0.0.1:5177`
  - `https://mind-mate-tan-phi.vercel.app`

No wildcard origins are used.

## Deployment Environment Variables To Update

Render `ALLOWED_ORIGINS` should be set exactly to:

```text
https://mind-mate-tan-phi.vercel.app,http://127.0.0.1:5177,http://localhost:5177
```

Keep existing production values for:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `APP_ENV=prod`
- `ALLOW_DEMO_USERS`
- `GEMINI_API_KEY` if used
- `GEMINI_MODEL` if used
- `SENTRY_DSN` if used

## Test Evidence

Command:

```bash
mvn test
```

Result:

- `Tests run: 11`
- `Failures: 0`
- `Errors: 0`
- `Skipped: 0`
- `BUILD SUCCESS`

Command:

```bash
mvn package
```

Result:

- `Tests run: 11`
- `Failures: 0`
- `Errors: 0`
- `Skipped: 0`
- packaged `target/mindmate-backend-0.1.0.jar`
- `BUILD SUCCESS`

Added/updated test coverage:

- `backend/src/test/java/com/mindmate/service/AuthServiceTest.java`
  - registration normalizes email
  - registration initializes growth/companion defaults
  - existing email returns domain error before save
- `backend/src/test/java/com/mindmate/service/TeenWellnessServiceTest.java`
  - Lovable payload with only mood/energy/moodTrigger persists optional fields as null
- `backend/src/test/java/com/mindmate/config/SecurityConfigTest.java`
  - exact CORS origins are configured
  - malformed JWT returns `401` with no stack trace

## Verification Limitations

The following HTTP verification could not be completed locally because the local Spring app could not connect to PostgreSQL:

- registration test with disposable account
- login test
- check-in submission through HTTP
- CORS preflight through locally running app

Startup blocker:

```text
FATAL: password authentication failed for user "mindmate"
```

The behavior is covered by unit/config tests, but final endpoint verification still needs a local database credential or a deployed build.

## Remaining Blockers

1. Deploy this backend build so `V9__allow_partial_lovable_checkins.sql` runs.
2. Update Render `ALLOWED_ORIGINS` to include the two local 5177 origins and the Vercel origin exactly.
3. Re-run live endpoint verification after deployment:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `POST /api/checkins` with Lovable payload only
   - malformed JWT against a protected endpoint
   - CORS preflights for Vercel, `http://127.0.0.1:5177`, and `http://localhost:5177`
4. If production registration still returns 500 after this deploy, inspect Render logs for the request ID and database exception. The API now avoids the most likely persistence/default and duplicate-normalization failure paths.
