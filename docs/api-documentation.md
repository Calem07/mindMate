# API Documentation

Base URL: set by `VITE_API_BASE_URL` in the frontend. Local development uses `http://localhost:8088`.

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

## Student APIs

- `POST /api/moods`
- `GET /api/moods`
- `POST /api/journals`
- `GET /api/journals`
- `GET /api/journals/{id}`
- `PUT /api/journals/{id}`
- `DELETE /api/journals/{id}`
- `POST /api/chat`
- `GET /api/chat/history`
- `GET /api/dashboard`
- `GET /api/recommendations`
- `PUT /api/profile/consent`

## Admin APIs

- `GET /api/admin/users`
- `GET /api/admin/moderation/content`
- `GET /api/admin/crisis-events`

Admin APIs require a JWT for a user with role `ADMIN`.
