# Railway Deployment Notes

## Backend Service

Recommended Railway settings:

- Service root: `backend`
- Build: Dockerfile or Maven buildpack
- Health check path: `/actuator/health`
- Runtime port: Railway-provided `PORT`

The Spring Boot app already uses:

```yaml
server:
  port: ${PORT:8080}
```

## Database

Use Neon Postgres.

- Use the direct Neon JDBC connection for Flyway migrations.
- Use Neon pooled connection for runtime only after validating Flyway is not pointed at the pooled URL.
- Include `sslmode=require` in production connection strings when Neon provides it.

## Required Railway Variables

See `docs/production-env.md`.

## Production Startup Guard

When `APP_ENV` is not `dev` or `local`, startup fails if:

- The default development `JWT_SECRET` is present.
- Demo seed users exist in the database.

This prevents accidental production boot with local/demo credentials.
