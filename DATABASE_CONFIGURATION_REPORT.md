# Database Configuration Report

Date: 2026-06-11

## Files Audited

- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/application.properties`
- `backend/src/main/resources/application-*.yml`
- `backend/src/main/resources/application-*.properties`
- Backend Java config references
- `.env.example`
- Deployment docs referencing database configuration

`application.properties` was not present. No imported profile config files were found under `backend/src/main/resources`.

## Datasource Configuration

The backend datasource is configured in `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/mindmate}
    username: ${DATABASE_USERNAME:mindmate}
    password: ${DATABASE_PASSWORD:mindmate}
```

The application directly expects these environment variables:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

This is **Option A**.

## Option A vs Option B

### Option A: Explicit App Variables

Required by the current `application.yml`:

```env
DATABASE_URL=jdbc:postgresql://<host>/<database>?sslmode=require
DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>
```

### Option B: Spring Boot Standard Variables

Spring Boot can also bind environment variables like:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>/<database>?sslmode=require
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>
```

However, these are **not the variables referenced by the repository config**. For Render, use Option A unless the config is intentionally changed later.

Do not set both Option A and Option B with different values. That creates avoidable deployment ambiguity because Spring external configuration precedence can override file defaults.

## Flyway Configuration

Flyway is configured in `backend/src/main/resources/application.yml`:

```yaml
spring:
  flyway:
    enabled: true
```

There is no separate Flyway datasource configured.

No separate variables were found for:

- `SPRING_FLYWAY_URL`
- `SPRING_FLYWAY_USER`
- `SPRING_FLYWAY_PASSWORD`
- `FLYWAY_URL`
- `FLYWAY_USER`
- `FLYWAY_PASSWORD`

Flyway will use the same Spring datasource as JPA:

- URL from `DATABASE_URL`
- Username from `DATABASE_USERNAME`
- Password from `DATABASE_PASSWORD`

## Flyway Requirements

The configured database user must be able to:

- Connect to the target database.
- Create and alter tables.
- Create indexes.
- Insert seed/demo rows from existing migrations.
- Read/write the `flyway_schema_history` table.

Because `spring.jpa.hibernate.ddl-auto` is set to `validate`, schema creation and evolution depend on Flyway migrations running successfully.

## Neon Compatibility Notes

For Neon, use a JDBC URL with SSL enabled:

```env
DATABASE_URL=jdbc:postgresql://<neon-host>/<database>?sslmode=require
```

Database name should be:

```env
DATABASE_NAME=mindmate
```

`DATABASE_NAME` is informational only; the application does not read it. The actual database name must be embedded in `DATABASE_URL`.

Recommended Neon/Render behavior:

- Use the direct Neon connection for first deploy and Flyway migrations.
- Ensure the username/password belong to the Neon role with migration privileges.
- Keep the password only in Render environment variables.
- Do not commit Neon credentials to Git.

## Example Render Configuration

Required:

```env
DATABASE_URL=jdbc:postgresql://<neon-host>/mindmate?sslmode=require
DATABASE_USERNAME=<neon-role>
DATABASE_PASSWORD=<neon-password>
JWT_SECRET=<strong-production-secret>
APP_ENV=prod
ALLOWED_ORIGINS=<frontend-origin>
```

Optional:

```env
GEMINI_API_KEY=<optional-gemini-api-key>
GEMINI_MODEL=gemini-2.5-pro
SENTRY_DSN=<optional-sentry-dsn>
```

Render also injects `PORT`; the backend already reads it:

```yaml
server:
  port: ${PORT:8080}
```

## Deployment Risks

- If `DATABASE_URL` is a non-JDBC URL such as `postgresql://...`, Spring JDBC will fail. It must start with `jdbc:postgresql://`.
- If `APP_ENV=prod` and demo seed users exist, `StartupSafetyConfig` will refuse startup. This is intentional production safety.
- If `JWT_SECRET` is left as the development default, `StartupSafetyConfig` will refuse startup outside dev.
- If the Neon role lacks migration privileges, Flyway startup will fail and the service will not become healthy.
- If `ALLOWED_ORIGINS` is omitted or points to the wrong frontend origin, browser requests from the deployed frontend will fail CORS checks.
- Existing Flyway seed migrations are part of the migration chain. Use a clean production database or confirm startup safety expectations before first launch.

## Paste These Exact Variables Into Render

```env
DATABASE_URL=jdbc:postgresql://<NEON_HOST>/mindmate?sslmode=require
DATABASE_USERNAME=<NEON_USERNAME>
DATABASE_PASSWORD=<NEON_PASSWORD>
JWT_SECRET=<GENERATE_A_STRONG_PRODUCTION_SECRET>
APP_ENV=prod
ALLOWED_ORIGINS=<YOUR_FRONTEND_ORIGIN>
GEMINI_API_KEY=<OPTIONAL>
GEMINI_MODEL=gemini-2.5-pro
SENTRY_DSN=<OPTIONAL>
```

Do not paste `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, or `SPRING_DATASOURCE_PASSWORD` unless the backend configuration is changed intentionally.
