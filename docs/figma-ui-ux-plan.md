# MindMate Figma UI/UX Plan

**Prepared from:** current React frontend, Spring API contracts, product docs, and the [MindMate Figma Make design system](https://www.figma.com/make/yju2Ft3eiAzEp4QOROGt9o/Mindmate?p=f&t=0fCNtopLYc5OtI0K-0&preview-route=%2Fcheck-in)  
**Product north star:** MindMate is a digital growth companion, not a productivity dashboard.

## Source of Truth

- **Visual and interaction source of truth:** the MindMate Figma Make file.
- **Behavior and data source of truth:** Spring controllers, DTOs, and services in the repository.
- **Implementation source of truth:** reusable React modules and shared tokens in `frontend/src`.

The Make file is the complete design system, not a reference limited to Companion Home, AI Companion, and Growth Garden. It contains the app shell, routes, theme, `CheckInView`, companion assets, and a broad shadcn/Radix component kit. Remaining screens should extend those patterns.

## 1. Product Understanding

MindMate helps students build emotional awareness and sustainable routines through a persistent relationship with a virtual companion. The companion interprets activity, celebrates effort, and gently guides the user toward check-ins, reflection, and long-term goals.

The experience has four connected loops:

1. **Companion relationship:** home, chat, companion selection, bond, evolution.
2. **Daily care:** check-in, habits, journal, gratitude.
3. **Growth and preparation:** garden, goals, badges, challenges, exams.
4. **Reflection and safety:** analytics, AI reflections, future-me letters, consent, crisis escalation, admin moderation.

## 2. Current Frontend Audit

### Strong foundations

- Companion-first sidebar and app shell are established.
- Companion Home, AI Companion, and Growth Garden have a distinctive approved visual direction.
- Figma Make includes an approved Check-In direction and reusable UI kit.
- Shared dark glass tokens exist in `frontend/src/styles/theme.css`.
- Backend contracts cover nearly the full student experience.
- Reusable UI primitives exist for buttons, panels, progress, loading, and empty states.

### UX and design gaps to resolve in Figma

- Legacy daily, progress, intelligence, auth, profile, and settings screens visually diverge from the Figma Make design system.
- The app has two overlapping token systems in `theme.css` and `index.css`.
- Companion Home and Garden contain substantial static demo content that is not always backed by API data.
- Onboarding exists in code but is not an explicit route or complete first-run journey.
- Admin APIs exist, but the frontend has no admin route or admin information architecture.
- Desktop navigation is strong, but mobile navigation and responsive behavior need dedicated designs.
- Crisis detection, empty, error, loading, locked, and permission states need consistent reusable patterns.
- Search and notifications appear in the shell without a defined product behavior.

## 3. Recommended Information Architecture

### Public

- Marketing home
- Login
- Register
- Forgot password
- Reset password

### First-run

- Welcome and safety promise
- Choose companion
- Name and personalize companion
- Optional baseline check-in
- Companion Home arrival

### Student app

- **Together:** Companion Home, AI Companion, Growth Garden
- **Today:** Daily Check-In, Habits, Journal, Gratitude
- **Grow:** Goals, Exam Focus, Badges and Challenges
- **Reflect:** Insights, AI Reflections, Future Me
- **Account:** Profile, Settings, privacy and moderation consent

### Admin

- Admin overview
- Users and consent status
- Moderation content review
- Crisis event review
- Audit and safety guidance

## 4. Figma File Structure

Continue evolving the MindMate Figma Make system, and maintain an implementation-ready Figma Design library with these pages:

1. `00 Cover + Principles`
2. `01 Foundations`
3. `02 Components`
4. `03 Public + Auth`
5. `04 Onboarding`
6. `05 Companion Core`
7. `06 Daily Care`
8. `07 Growth`
9. `08 Reflection`
10. `09 Account + Admin`
11. `10 Responsive`
12. `11 Prototype Flows`
13. `12 Handoff`

## 5. Design Foundations

### Visual direction

- Preserve the approved deep-space glass aesthetic.
- Use companion art and emotional copy as the primary source of warmth.
- Keep cyan and teal as interaction colors; use violet for evolution and AI; amber for gentle concern; red only for safety escalation.
- Avoid dense metric grids unless each metric includes a companion interpretation.
- Reduce decorative glow and motion on form-heavy and safety-critical screens.

### Core tokens

- Background: `#03040B`
- Foreground: `#F8FAFC`
- Primary cyan: `#06B6D4`
- Teal accent: `#14B8A6`
- Muted text: `#94A3B8`
- Violet: `#8B5CF6`
- Warning: `#F59E0B`
- Destructive: `#EF4444`
- Base radius: `20px`
- Font: Inter

### Accessibility rules

- Meet WCAG AA contrast for text and controls.
- Never communicate mood, risk, completion, or locked state using color alone.
- Minimum interactive target: 44 by 44 px.
- Support reduced motion.
- Keep crisis actions visible, direct, and visually separate from ordinary chat.

## 6. Component Library To Design

### Shell and navigation

- Desktop sidebar and compact sidebar
- Mobile bottom navigation and overflow menu
- App header
- Companion mini-widget
- Page title and contextual action area

### Inputs and actions

- Primary, secondary, ghost, destructive, and icon buttons
- Text input, textarea, search, select, date picker
- Slider with labeled values
- Toggle and checkbox
- Mood selector
- Chat composer

### Content

- Glass panel variants
- Companion message card
- Companion reaction toast
- Metric with interpretation
- Habit row
- Journal preview
- Goal and exam progress cards
- Badge and challenge cards
- Chart container with companion caption
- Garden unlock and theme cards

### System and safety

- Loading, empty, error, success, offline, and locked states
- Confirmation dialog
- Consent panel
- Crisis escalation panel
- Admin moderation item

Every component should include default, hover, focus, pressed, disabled, loading, and error states where relevant.

Reuse the Make file's existing shadcn/Radix patterns before creating new primitives. The available system includes buttons, cards, dialogs, drawers, inputs, selects, sliders, tabs, tables, tooltips, sheets, skeletons, sidebars, alerts, and charts.

## 7. Screen Inventory and Priority

### P0: Core prototype

1. Login
2. Companion onboarding
3. Companion Home
4. Daily Check-In
5. Check-in success with companion reaction
6. AI Companion chat
7. Crisis-detected chat state
8. Growth Garden

### P1: Daily growth loop

9. Habits
10. Journal list
11. Journal editor and AI-enriched result
12. Gratitude
13. Goals
14. Exam Focus
15. Badges and Challenges

### P2: Reflection and account

16. Insights and correlations
17. Weekly AI Reflection
18. Future Me and locked letter
19. Profile
20. Settings and moderation consent
21. Admin overview
22. Moderation review
23. Crisis event review

For every P0 and P1 screen, design desktop, mobile, loading, empty, error, and success/reaction states.

## 8. Key UX Flows

### First-run adoption

Register -> safety promise -> choose companion -> personalize -> optional baseline check-in -> Companion Home.

### Daily care loop

Companion Home -> Check-In -> guided inputs -> submit -> companion interpretation -> bond or XP response -> suggested next gentle action.

### Reflection loop

Journal -> save -> AI enrichment loading -> summary and concerns -> companion response -> optional chat.

### Safety flow

Chat message -> crisis detected -> visually distinct escalation panel -> immediate help options -> continue only with clear boundaries.

### Long-term growth loop

Goal or exam -> small progress action -> companion encouragement -> XP or garden growth -> reflection on progress.

## 9. Interaction and Copy Principles

- Companion speaks before metrics when emotional context matters.
- Celebrate effort, not only completion.
- Use one primary action per screen.
- Keep forms conversational and chunked.
- Show why data is requested, especially for mood, stress, sleep, and consent.
- Use copy such as “I noticed…”, “Ready when you are”, and “Let’s take one small step.”
- Avoid diagnosis, treatment claims, shame, urgency theater, and productivity-score language.

## 10. Responsive Strategy

- Desktop: persistent sidebar, contextual header, two-column content where useful.
- Tablet: compact sidebar or drawer, reduced secondary panels.
- Mobile: bottom navigation with Home, Companion, Check-In, Garden, and More.
- On mobile, companion message and primary action remain above metrics.
- Convert dense dashboard grids into a prioritized vertical feed.
- Chat composer stays reachable above the keyboard.

## 11. Prototype Scenarios

Build clickable prototypes for:

1. New user adopts Luna and completes the first check-in.
2. Returning student checks in and receives a companion reaction.
3. Student journals and opens the AI-generated reflection.
4. Student chats with Luna and encounters the crisis escalation state.
5. Student completes a habit and sees garden growth.
6. Admin reviews a consent-enabled moderation item.

## 12. Handoff Requirements

- Use components and variants rather than detached frames.
- Name layers and frames by route and state.
- Map Figma variables to CSS tokens in `theme.css`.
- Annotate every screen with its API source and empty/error behavior.
- Mark static concept content that has no backend source.
- Include desktop and mobile redlines for P0 screens.
- Preserve the complete Figma Make visual system while replacing unsupported static content with real-data states.
- Treat Make `CheckInView` as the visual baseline for the production `/app/checkin` migration.

## 13. Delivery Sequence

### Sprint 1: foundations and core

- Foundations, components, responsive shell
- Auth and onboarding
- Companion Home, Check-In, AI Companion, crisis state, Garden
- Core prototype

### Sprint 2: daily and growth

- Habits, Journal, Gratitude
- Goals, Exam Focus, Badges and Challenges
- Mobile variants and reaction states

### Sprint 3: reflection, account, and admin

- Insights, Reflections, Future Me
- Profile, Settings, consent
- Admin and moderation
- Handoff annotations and final prototype QA

## 14. Success Criteria

- A student can understand the next meaningful action within five seconds.
- The companion remains emotionally central without obstructing tasks.
- Every completed action produces clear, supportive feedback.
- Every chart or metric includes an interpretation or next step.
- Safety and privacy states are understandable without reading documentation.
- P0 flows work coherently on desktop and mobile.
