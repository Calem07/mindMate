# MindMate

MindMate is a capstone-ready full-stack web application for student mental wellness support. It provides mood tracking, journaling, wellness recommendations, dashboard analytics, admin moderation workflows, and an AI companion with clear safety boundaries.

MindMate is not a therapist and must never claim to diagnose, treat, cure, prescribe medication, or provide medical advice.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Recharts
- Backend: Java 21, Spring Boot 3, Spring Security, JWT, Maven
- Database: PostgreSQL with Flyway migrations
- AI: Gemini 2.5 Pro adapter with safe local fallback when `GEMINI_API_KEY` is absent
- Deployment: Docker Compose

## Quick Start

```powershell
cd "C:\Users\RAKTIM\Documents\New project\mindmate"
copy .env.example .env
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

Seed users use password `password`:

- `student@mindmate.local`
- `admin@mindmate.local`

## Local Frontend Development

```powershell
cd frontend
npm install
npm run dev
```

## Safety Model

- Pre-login AI on the home page is mocked and stores no visitor data.
- Gemini-backed chat starts only after authentication.
- Crisis phrases trigger generic international escalation guidance.
- Full moderation is role-gated, consent-aware, and audit logged.
