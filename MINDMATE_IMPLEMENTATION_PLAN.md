# MindMate Implementation Plan

**Role:** Lead frontend architecture  
**Sources of truth:** `docs/frontend-context-plan.md`, [Figma Make — Mindmate](https://www.figma.com/make/yju2Ft3eiAzEp4QOROGt9o/Mindmate) (`fileKey: yju2Ft3eiAzEp4QOROGt9o`)  
**Constraint:** Do not redesign approved screens (Dashboard / Companion Home, AI Companion, Growth Garden). Extend the same design system everywhere else.

**Last audit:** June 2026 (this session)  
**Workspace:** `C:\Users\RAKTIM\Documents\New project\mindmate`

---

## 1. Current codebase audit

### 1.1 Repository layout

| Area | State |
|------|--------|
| `backend/` | Spring Boot 3.4, JWT, Flyway, full REST API — **ready** |
| `frontend/` | Vite 8 + React 19 + Tailwind 4; modular shell + Figma ports in progress |
| `docs/frontend-context-plan.md` | Product + API + phases — **complete** |
| `MINDMATE_IMPLEMENTATION_PLAN.md` | This file |

### 1.2 Frontend dependencies

| Package | Version | Notes |
|---------|---------|--------|
| react / react-dom | 19.x | App shell + Figma views |
| react-router-dom | 7.x | `/app/*` protected routes |
| recharts | 3.x | Legacy analytics in `App.jsx` |
| lucide-react | 1.x | Icons (Figma-aligned) |
| tailwindcss | 4.x | `@import "./styles/theme.css"` |
| **motion** | 12.23.x | **Added** — required by approved Figma screens |

### 1.3 Existing modules

| Module | Location | API wired? | UI source |
|--------|----------|------------|-----------|
| Marketing home | `App.jsx` `HomePage` | Mock chat only | Legacy |
| Auth | `App.jsx` `AuthPage` | Yes | Legacy (needs token pass) |
| **Companion Home** | `pages/home/CompanionHomePage.jsx` | Yes | **Figma `DashboardView`** |
| **AI Companion** | `pages/companion/CompanionPage.jsx` | Yes (chat + history) | **Figma `FigmaCompanionView`** |
| **Growth Garden** | `pages/garden/GardenPage.jsx` | Yes (progress + theme) | **Figma `FigmaGrowthGardenView`** |
| App shell | `components/layout/AppLayout.jsx` | Session + companion mini-widget | Figma `Layout` (aligned) |
| Design tokens | `styles/theme.css` | N/A | Figma Make `theme.css` |
| Shared UI | `components/ui/*` | N/A | Glass panel, buttons, empty/loading |
| Daily / progress / admin pages | `App.jsx` inline (~4k lines) | Yes | **Legacy** — migrate to tokens next |

### 1.4 Integration status (Phase 0)

| Issue | Status |
|-------|--------|
| Vite proxy → `:8080` | **Fixed** in `vite.config.js` |
| `lib/api.ts` / `api.js` + services | **Present** (`services/index.js`) |
| `VITE_API_BASE_URL` | Supported in `api.js` |
| Dual `:root` tokens (`index.css` vs `theme.css`) | **Partial** — Figma tokens in `theme.css`; legacy vars remain for old pages |
| Docker nginx `/api` | Verify per `docs/installation-guide.md` |

### 1.5 Figma import audit (Make `yju2Ft3eiAzEp4QOROGt9o`)

| Asset | Approved? | Repo path | MCP note |
|-------|-----------|-----------|----------|
| `theme.css` | Yes | `frontend/src/styles/theme.css` | `FetchMcpResource` Make source |
| `Layout.tsx` | Yes (shell) | `components/layout/AppLayout.jsx` | Ported earlier; matches IA |
| `DashboardView.tsx` | Yes (Companion Home) | `components/figma/dashboard/DashboardView.jsx` | Faithful port + API wrapper |
| `CompanionPage.tsx` | Yes | `components/figma/companion/FigmaCompanionView.jsx` | Chat wired via `CompanionPage.jsx` |
| `GrowthGardenPage.tsx` | Yes | `components/figma/garden/FigmaGrowthGardenView.jsx` | Theme wired via `GardenPage.jsx` |
| `LunaCat.tsx` | Yes | `components/companion/LunaCat.jsx` | SVG unchanged |
| `get_design_context` on Make | N/A | — | **Not supported** for Make files; use Make source URIs |

---

## 2. Design system (imported — do not fork)

### 2.1 Tokens (`theme.css`)

| Token | Value |
|-------|--------|
| Background | `#03040B` |
| Foreground | `#F8FAFC` |
| Primary | `#06B6D4` |
| Teal accent | `#14B8A6` |
| Muted | `#94A3B8` |
| Card | `rgba(255,255,255,0.02)` + border `rgba(255,255,255,0.08)` |
| Radius | `1.25rem` |
| Font | Inter |

### 2.2 Utilities

`.glass-panel`, `.glow-text-cyan`, `.luna-float`, `.luna-glow-pulse`, animations: `bond-pulse`, `sparkle-pop`, `shimmer`, `spin`

### 2.3 Shared components (Cursor-owned, Figma-styled)

| Component | Path |
|-----------|------|
| GlassPanel | `components/ui/GlassPanel.jsx` |
| Button | `components/ui/Button.jsx` |
| ProgressBar | `components/ui/ProgressBar.jsx` |
| EmptyState / LoadingState | `components/ui/` |
| PageContainer / SectionHeader | `components/ui/` |
| LunaCat | `components/companion/LunaCat.jsx` |

---

## 3. Target architecture

```
frontend/src/
  styles/theme.css              # Figma tokens (source of truth)
  lib/api.js, auth.js, types.js, utils.js
  services/index.js             # API grouping
  hooks/useCompanion.js, useGamification.js
  components/
    layout/AppLayout.jsx
    companion/LunaCat.jsx
    figma/                      # Approved screens — DO NOT restyle
      dashboard/DashboardView.jsx
      companion/FigmaCompanionView.jsx
      garden/FigmaGrowthGardenView.jsx
    ui/                         # Shared primitives
  pages/
    home/CompanionHomePage.jsx
    companion/CompanionPage.jsx
    garden/GardenPage.jsx
    … (daily, progress, admin — Phase 4–7)
  App.jsx                       # Router + legacy pages (bridge)
```

---

## 4. Missing modules (by phase)

| Page | Route | Phase | Status |
|------|-------|-------|--------|
| Companion Home | `/app/home` | 2 | **Done** (Figma + API) |
| AI Companion | `/app/companion` | 3 | **Done** (Figma + chat API) |
| Growth Garden | `/app/garden` | 3 | **Done** (Figma + gamification API) |
| Check-in | `/app/checkin` | 4 | Legacy in `App.jsx` — restyle only |
| Habits, Journal, Gratitude | `/app/*` | 4 | Legacy — restyle only |
| Goals, Badges, Exams | `/app/*` | 5 | Legacy — restyle only |
| Analytics, Reflections, Future Me | `/app/*` | 6 | Legacy — restyle only |
| Profile, Settings | `/app/*` | 7 | Legacy — restyle only |
| Admin | `/app/admin` | 7 | **Missing route** — add with `adminService` |

---

## 5. API wiring matrix

| Service | Endpoints | Primary consumers |
|---------|-----------|-----------------|
| authService | `/api/auth/*` | Login, Register |
| companionService | companion, chat, history | Companion, Home, Layout |
| checkinService | checkins | Home, Check-in, Analytics |
| habitService | habits | Habits, Home quests (future) |
| journalService | journals | Journal |
| gratitudeService | gratitude | Gratitude |
| goalService | goals | Goals |
| examService | exams | Exams, Home letter block (future) |
| gardenService | gamification | Garden, Home |
| badgeService | badges, challenges | Badges |
| analyticsService | dashboard, correlations, burnout | Analytics, Home |
| reflectionService | reflections, future-me, letters | Reflections, Future Me |
| moodService | moods | Optional mood tiles |
| adminService | `/api/admin/*` | Admin |

---

## 6. Implementation phases & effort

| Phase | Scope | Effort | Status |
|-------|--------|--------|--------|
| **0** | Audit, plan, proxy, `lib/api`, services | 0.5 d | **Done** |
| **1** | `theme.css`, shared UI, `AppLayout` | 1 d | **Done** |
| **2** | Figma **Companion Home** + APIs | 1.5 d | **Done** (this session) |
| **3** | Figma **AI Companion** + **Growth Garden** + APIs | 2 d | **Done** (this session) |
| **4** | Migrate daily pages to shell + tokens | 2 d | Next |
| **5** | Goals, badges, exams | 1.5 d | Pending |
| **6** | Analytics, reflections, future-me | 1.5 d | Pending |
| **7** | Auth polish, profile, settings, **admin** | 1 d | Pending |
| **8** | E2E smoke, demo polish, nginx | 1 d | Pending |
| **Total remaining** | | **~7 dev days** | |

---

## 7. Immediate next steps

1. Run `npm run dev` in `frontend/`; log in as `student@mindmate.local` / `password`
2. Verify `/app/home`, `/app/companion`, `/app/garden` match Figma (no layout drift)
3. Phase 4: extract `CheckinPage`, `HabitsPage`, etc. from `App.jsx` into `pages/*` using **only** `GlassPanel` + `theme.css` (no new colors)
4. Add `/app/admin` for `ROLE_ADMIN` using same shell
5. When a **Figma Design** file (non-Make) is available, re-run `get_design_context` on frames to diff against Make ports

---

## 8. Risks

| Risk | Mitigation |
|------|------------|
| Make MCP ≠ Design MCP | Use Make source exports; re-verify if design file URL is provided |
| `App.jsx` monolith | Migrate one route per PR; keep legacy until parity |
| Token drift on legacy pages | Ban new hex values in PR review; use CSS variables only |
| Approved screen edits | Any change to `components/figma/**` requires design sign-off |

---

## 9. Verification

```powershell
# Backend (from repo root)
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm run dev

# Login smoke
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"student@mindmate.local","password":"password"}'
```

**Demo paths:** `/app/home` → `/app/companion` → `/app/garden` → `/app/checkin`
