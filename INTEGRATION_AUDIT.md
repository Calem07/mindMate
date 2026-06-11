# MindMate Integration Audit

Date: 2026-06-11

## Summary

Integration stabilization is complete for the audited local stack:

- Backend: `http://localhost:8088`
- Frontend: `http://127.0.0.1:5173`
- Database: local PostgreSQL via the repository `.env`

Authentication, protected frontend routing, actuator health, habit logs, correlations, and the main student API contracts were verified after fixes.

## Root Causes Found

1. Frontend had two API fetch layers.
   - `frontend/src/App.jsx` defined a legacy `apiFetch`.
   - `frontend/src/lib/api.js` also defined `apiFetch`.
   - The legacy helper previously used relative `/api/*` requests and could ignore `VITE_API_BASE_URL`.

2. Vite environment/proxy configuration was pointed at the wrong backend.
   - `frontend/vite.config.js` used `localhost:8080`.
   - Port `8080` was not the MindMate backend in this workspace.
   - Vite also did not read the repository-level `.env` unless `envDir` was configured.

3. Backend `/api/habits/logs` returned HTTP 500.
   - Habit log DTO mapping dereferenced lazy `HabitLog.habit` relationships while JPA Open Session in View is disabled.
   - Defensive null handling was also missing for malformed/partial log data.

4. Backend `/api/correlations` returned HTTP 500.
   - Correlation logic read lazy habit relationships and assumed non-null check-in/habit fields.
   - Empty and partial datasets were not consistently protected.

5. `/actuator/health` returned HTTP 403.
   - Security allowed `/actuator/health`, but the Actuator dependency was not present, so the path did not resolve as a public actuator endpoint.

6. Frontend route verification exposed a runtime defect in locked Figma-derived screens.
   - Two plain JSX files contained `useState>(...)`, a TypeScript generic remnant.
   - Vite parsed it as a comparison, producing `boolean true is not iterable`.
   - Fixed as a runtime-only syntax correction with no visual/layout redesign.

7. CORS blocked direct `VITE_API_BASE_URL` requests from `127.0.0.1:5173`.
   - Backend allowed `localhost` origins but not `127.0.0.1`.
   - Dev CORS now allows localhost and 127.0.0.1 port patterns.

## Files Modified

- `frontend/src/App.jsx`
  - Removed the legacy inline `apiFetch`.
  - Imported `apiFetch` from `frontend/src/lib/api.js`.

- `frontend/src/lib/api.js`
  - Confirmed as the single source of truth for frontend API requests.

- `frontend/vite.config.js`
  - Added repository-level `.env` loading via `envDir`.
  - Uses `VITE_API_BASE_URL` for the dev proxy target.
  - Defaults to `http://localhost:8088`.

- `frontend/src/components/figma/dashboard/DashboardView.jsx`
  - Runtime-only JSX fix: `useState>(...)` -> `useState(...)`.

- `frontend/src/components/figma/companion/FigmaCompanionView.jsx`
  - Runtime-only JSX fix: `useState>(...)` -> `useState(...)`.

- `backend/pom.xml`
  - Added `spring-boot-starter-actuator`.

- `backend/src/main/resources/application.yml`
  - Exposed actuator `health` and `info`.
  - Enabled health probes.

- `backend/src/main/java/com/mindmate/config/SecurityConfig.java`
  - Permits `/actuator/health` and nested health endpoints.
  - Allows dev CORS origins for `localhost:*` and `127.0.0.1:*`.

- `backend/src/main/java/com/mindmate/repository/HabitLogRepository.java`
  - Added `@EntityGraph(attributePaths = "habit")` to load habit relationships for habit log reads.

- `backend/src/main/java/com/mindmate/service/TeenWellnessService.java`
  - Added read-only transaction and null-safe habit log DTO mapping.

- `backend/src/main/java/com/mindmate/service/CorrelationEngineService.java`
  - Added read-only transaction.
  - Added null/empty defensive handling for check-ins, moods, habit logs, habit names, and dates.

- `backend/src/test/java/com/mindmate/service/TeenWellnessServiceTest.java`
  - Updated constructor test wiring for the current service dependencies.

## API Layer Architecture

Current frontend API architecture:

- Single fetch wrapper: `frontend/src/lib/api.js`
- Service facade: `frontend/src/services/index.js`
- Legacy callers in `App.jsx` now import the shared wrapper.
- `VITE_API_BASE_URL` is respected by the shared wrapper.
- If `VITE_API_BASE_URL` is unset in production, API calls remain relative and can work behind a reverse proxy.
- Vite dev proxy remains available for relative `/api` compatibility, but direct absolute API base configuration is now the primary path.

Duplicate fetch wrapper audit:

- `frontend/src/lib/api.js`: active shared wrapper.
- `frontend/src/App.jsx`: legacy wrapper removed.
- No `axios` usage found.
- No raw `fetch(` calls remain outside `frontend/src/lib/api.js`.

## Verified Endpoints

Authenticated as `student@mindmate.local`.

| Endpoint | Result | Notes |
| --- | --- | --- |
| `POST /api/auth/login` | OK | JWT returned |
| `GET /actuator/health` | OK | Public, returns `UP` with liveness/readiness groups |
| `GET /api/companion` | OK | Companion contract returns selected companion after setup |
| `GET /api/companion/templates` | OK | 6 templates |
| `GET /api/gamification/progress` | OK | Garden/progress contract working |
| `GET /api/habits` | OK | 6 habits |
| `GET /api/habits/logs` | OK | 184 logs; previous 500 fixed |
| `GET /api/journals` | OK | 1 journal |
| `GET /api/goals` | OK | Empty list handled |
| `GET /api/checkins/history` | OK | 46 check-ins |
| `GET /api/exams` | OK | Empty list handled |
| `GET /api/badges` | OK | 10 badges |
| `GET /api/correlations` | OK | 2 correlations; previous 500 fixed |
| `GET /api/reflections/weekly` | OK | Reflection contract working |
| `GET /api/future-me/generate` | OK | Future Me generation contract working |
| `GET /api/letters` | OK | Empty list handled |

## Route Verification Results

Verified through Playwright against `http://127.0.0.1:5173` after real login and companion setup.

| Route | Result | Browser Console |
| --- | --- | --- |
| `/login` | OK | No errors |
| `/app/home` | OK | No errors |
| `/app/companion` | OK | No errors |
| `/app/garden` | OK | No errors |
| `/app/checkin` | OK | No errors |
| `/app/habits` | OK | No errors |
| `/app/journal` | OK | No errors |
| `/app/gratitude` | OK | No errors |
| `/app/goals` | OK | No errors |
| `/app/exams` | OK | No errors |
| `/app/badges` | OK | No errors |
| `/app/analytics` | OK | No errors |
| `/app/reflections` | OK | No errors |
| `/app/future-me` | OK | No errors |

## Backend Fixes Applied

- Added actuator dependency and health exposure.
- Kept health publicly accessible for deployment health checks.
- Loaded habit relationships for habit log DTO mapping.
- Added null-safe habit log mapping.
- Added null-safe correlation calculations.
- Preserved helpful fallback correlation responses for insufficient or balanced data.
- Updated CORS for local development host variants.

## Missing DTO Mappings

No missing DTO mappings were found for the verified student endpoints.

DTO/data-shape risk remains in approved Figma-derived screens because some cards are intentionally static design content rather than API-backed models.

## Missing Frontend Hooks

No missing hooks blocked the verified routes.

Current architecture has both:

- Shared services in `frontend/src/services/index.js`.
- Some legacy page-local API orchestration in `frontend/src/App.jsx`.

This is stable after the shared wrapper fix, but future cleanup should migrate the remaining inline page orchestration out of `App.jsx`.

## Mock Data Still Present

Intentional static/demo content remains in approved Figma-derived screens:

- `frontend/src/components/figma/dashboard/DashboardView.jsx`
  - Static quests, week moods, exam cards, observations, and garden/letter content.

- `frontend/src/components/figma/companion/FigmaCompanionView.jsx`
  - Static initial messages, memories, achievements, accessories, and fallback responses.

- `frontend/src/components/figma/garden/FigmaGrowthGardenView.jsx`
  - Static garden decorations, memories, accessories, and task examples.

These were not replaced because the user explicitly locked the approved Figma-derived screens and requested no redesign.

## Hardcoded Values

Known hardcoded defaults still present:

- Default companion display name: `Luna`
- Default demo student references in locked Figma content: `Alex`
- Local development defaults:
  - Backend fallback port: `8080` in Spring config, overridden by `.env` `PORT=8088`
  - Frontend API fallback: `http://localhost:8088`
  - Dev CORS: `localhost:*`, `127.0.0.1:*`

No secrets are documented here.

## API Errors

Previously broken:

- `GET /api/habits/logs`: fixed.
- `GET /api/correlations`: fixed.
- `GET /actuator/health`: fixed.

Current verified sweep found no API errors for the listed integration endpoints.

## Routing Issues

Previously broken:

- Protected routes failed because frontend requests used the wrong backend/proxy path.
- `/app/home` and `/app/companion` had a runtime crash from `useState>(...)`.

Current status:

- All requested routes return HTTP 200 and render without console errors.

## Remaining Blockers

No launch-blocking integration issues remain in the verified local stack.

Non-blocking follow-up items:

- Gradually migrate remaining inline page implementations out of `App.jsx`.
- Replace static Figma demo content only when the approved design lock is lifted or API-backed replacement is explicitly requested.
- Configure production CORS origins before deployment.
- Configure production `VITE_API_BASE_URL` or a reverse proxy path for `/api`.

## Launch Readiness Assessment

Status: conditionally ready for local/staging launch.

The application is integration-stable for the audited local environment. Authentication, protected routing, companion, garden, habit, journal, goal, analytics/reflection/future-me contracts, actuator health checks, and the previously failing backend endpoints are working.

Before production launch, set production-specific CORS origins and confirm the deployment routing strategy for frontend-to-backend API calls.
