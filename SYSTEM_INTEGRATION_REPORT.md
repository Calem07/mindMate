# System Integration Report

**Date:** 2026-06-11  
**Workspace:** `C:\Users\RAKTIM\Documents\New project\mindmate`  
**Verified backend base:** `http://127.0.0.1:8088`  
**Frontend dev URL:** `http://127.0.0.1:5173`  

## Executive Summary

The current backend source builds successfully and runs on `PORT=8088` using the workspace `.env`. Direct API verification confirms that authentication, companion, garden, habit CRUD, journal CRUD, goal CRUD, dashboard, check-in history, burnout, weekly reflection, future-me generation, and letters are reachable.

The frontend app does not currently authenticate or render protected routes in local dev because the legacy `apiFetch` inside `frontend/src/App.jsx` ignores `VITE_API_BASE_URL` and uses relative `/api/*` paths. Vite then proxies those requests to the hardcoded `http://localhost:8080`, while the workspace `.env` points to `http://localhost:8088`. Port `8080` is occupied by another server that returns HTML 404s.

## Environment Findings

| Item | Result |
|---|---|
| PostgreSQL | Listening on `5432` |
| Port `8080` | Occupied by a non-MindMate server |
| MindMate backend target port | `8088` from root `.env` |
| Initial backend jar | Stale; contained migrations only through V4 |
| Current backend source build | Passed after `mvn -DskipTests package` |
| Backend startup | Passed on `8088` after rebuild |
| Health endpoint | Broken/public mismatch: `GET /actuator/health` returns `403` |
| Frontend dev server | Serves pages on `5173` |
| In-app Browser QA | Blocked by browser runtime initialization failure |
| Playwright fallback | Ran; route/auth verification failed due frontend API base/proxy issue |

## Working Endpoints

Verified with `student@mindmate.local` / `password`.

| Area | Method | Endpoint | Result |
|---|---:|---|---|
| Auth | POST | `/api/auth/login` | OK, JWT returned |
| Companion | GET | `/api/companion` | OK |
| Companion | GET | `/api/companion/templates` | OK, 6 templates |
| Garden | GET | `/api/gamification/progress` | OK |
| Garden | POST | `/api/gamification/theme` | OK |
| Habits | GET | `/api/habits` | OK |
| Habits | POST | `/api/habits` | OK |
| Habits | POST | `/api/habits/{id}/toggle` | OK |
| Habits | DELETE | `/api/habits/{id}` | OK |
| Journal | GET | `/api/journals` | OK |
| Journal | POST | `/api/journals` | OK |
| Journal | PUT | `/api/journals/{id}` | OK |
| Journal | DELETE | `/api/journals/{id}` | OK |
| Goals | GET | `/api/goals` | OK |
| Goals | POST | `/api/goals` | OK |
| Goals | PUT | `/api/goals/{id}` | OK |
| Goals | DELETE | `/api/goals/{id}` | OK |
| Analytics | GET | `/api/dashboard` | OK |
| Analytics | GET | `/api/checkins/history` | OK |
| Analytics | GET | `/api/burnout/check` | OK |
| Reflections | GET | `/api/reflections/weekly` | OK |
| Future Me | GET | `/api/future-me/generate` | OK |
| Future Me | GET | `/api/letters` | OK |

## Broken Endpoints

| Area | Method | Endpoint | Error |
|---|---:|---|---|
| Backend health | GET | `/actuator/health` | `403 Forbidden`; README says health is public |
| Habits | GET | `/api/habits/logs` | `500 {"error":"Unexpected server error"}` |
| Analytics | GET | `/api/correlations` | `500 {"error":"Unexpected server error"}` |

## Missing DTO Mappings

| Area | Finding | Impact |
|---|---|---|
| Future Me letters | `GET /api/letters` returns `LetterRequest(content, unlockDate)` instead of a response DTO with `id`, `title`, `createdAt`, `locked`, or `unlockDate` metadata. | Frontend must encode a title inside `content` and infer locked state from string content/date. |
| Weekly reflection | `GET /api/reflections/weekly` returns `Map<String,String>` instead of a typed DTO. | Works, but less explicit for frontend contract and API docs. |
| Future-me generated letter | `GET /api/future-me/generate` returns `Map<String,String>` instead of a typed DTO. | Works, but same contract weakness as weekly reflection. |
| Dashboard analytics | `/api/dashboard` is legacy aggregate only; richer analytics depends on check-ins, habits, burnout, correlations, and frontend composition. | Analytics frontend must merge multiple endpoints and degrade when optional endpoints fail. |
| Habit logs | DTO exists, but endpoint returns 500 in current DB/runtime state. | Habit consistency charts cannot trust this endpoint yet. |
| Correlations | DTO exists, but endpoint returns 500 in current DB/runtime state. | Analytics should treat correlations as optional and render an error/degraded state. |

## Missing Frontend Hooks

| Hook | Status |
|---|---|
| `useCompanion` | Present |
| `useGamification` | Present |
| `useAnalytics` | Missing |
| `useReflections` | Missing |
| `useFutureMe` | Missing |
| Shared API error/loading hook | Missing |

The existing service layer covers analytics and reflection endpoints, but Sprint 3 pages currently need their own loading/error orchestration.

## Mock Data Still Present

Approved locked Figma-derived screens still contain intentional static/demo content:

| File | Examples |
|---|---|
| `frontend/src/components/figma/dashboard/DashboardView.jsx` | `LUNA_STATE`, `QUESTS`, `WEEK_MOODS`, `EXAMS`, default `Alex`, level/bond defaults |
| `frontend/src/components/figma/companion/FigmaCompanionView.jsx` | Static level, bond, evolution, stage, goals, relationship memories |
| `frontend/src/components/figma/garden/FigmaGrowthGardenView.jsx` | Static garden tasks, milestones, accessories, memories |
| `frontend/src/App.jsx` legacy pages | Legacy in-file pages still contain hardcoded copy and fixed fallback values |

These screens are locked by instruction and were not modified.

## Hardcoded Values

| File | Hardcoded Values |
|---|---|
| `frontend/src/App.jsx` | Local `apiFetch` ignores `VITE_API_BASE_URL`; fallback companion names/avatars; legacy colors/classes |
| `frontend/vite.config.js` | Proxy target hardcoded to `http://localhost:8080` |
| `frontend/src/components/layout/AppLayout.jsx` | Search/notification controls are visual only; fallback bond `83%`; fallback `Luna` |
| Figma locked screens | Figma-specific fixed colors, demo values, XP/bond defaults |

## API Errors

| Endpoint | Error Body |
|---|---|
| `/api/habits/logs` | `{"error":"Unexpected server error"}` |
| `/api/correlations` | `{"error":"Unexpected server error"}` |
| `/actuator/health` | `403 Forbidden` |

## Routing Issues

| Route/Flow | Status | Cause |
|---|---|---|
| `/login` authentication flow | Fails in frontend | Uses legacy `App.jsx` relative `/api/auth/login`; Vite proxies to `8080` |
| `/app/home` | Fails in frontend route QA | App shell calls `/api/companion`, `/api/checkins/history`, `/api/gamification/progress` via wrong API base |
| `/app/companion` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/garden` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/checkin` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/habits` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/journal` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/gratitude` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/goals` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/exams` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/badges` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/analytics` | Fails in frontend route QA | Same API base/proxy issue plus legacy analytics depends on broken `/api/habits/logs` |
| `/app/reflections` | Fails in frontend route QA | Same API base/proxy issue |
| `/app/future-me` | Fails in frontend route QA | Same API base/proxy issue |

## Immediate Integration Fixes Recommended

1. Update the legacy `apiFetch` in `frontend/src/App.jsx` to respect `import.meta.env.VITE_API_BASE_URL`, matching `frontend/src/lib/api.js`.
2. Update `frontend/vite.config.js` proxy target to read `VITE_API_BASE_URL` or default to `http://localhost:8088` for this workspace.
3. Investigate backend 500s in `GET /api/habits/logs` and `GET /api/correlations`.
4. Make `/actuator/health` public or update README/security docs.
5. Replace letter request-as-response with a proper `LetterResponse` DTO when backend changes are in scope.

## Evidence Files

- `integration-probe-results.json`
- `route-verify-results.json`
