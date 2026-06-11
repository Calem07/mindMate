# Installation Guide

## Requirements

- Docker Desktop
- Node.js 24+ for frontend-only development
- A Gemini API key for live AI calls

The backend Docker image uses Java 21 and Maven even if the host machine does not have them installed.

## Environment

Copy `.env.example` to `.env` and set:

- `GEMINI_API_KEY`: optional for local demos; required for live Gemini responses.
- `JWT_SECRET`: replace before public deployment.

## Run With Docker

```powershell
docker compose up --build
```

## Run Frontend Only

```powershell
cd frontend
npm install
npm run dev
```

Frontend dev server: http://localhost:5173
