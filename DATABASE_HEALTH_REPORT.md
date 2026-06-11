# MindMate Database Health Report

Date: 2026-06-11  
Scope: PostgreSQL schema, Flyway migrations, JPA repositories, query patterns, constraints, indexes, Neon readiness.

## Executive Summary

The MindMate database schema is functional and aligned with the current local Flyway history. All seven migrations are applied successfully, and the app can read/write the current local dataset. The schema is appropriate for Closed Beta, but not yet ready for Open Beta or Production because several high-volume query paths lack indexes, important integrity rules are enforced only in Java, and analytics/admin queries are unbounded.

Database readiness score: 70/100

Readiness tier:

- Closed Beta: Yes.
- Open Beta: Not yet.
- Production: Not yet.

## Inspection Method

Neon MCP status:

- No Neon MCP callable was exposed in this session after tool discovery.
- The local PostgreSQL-compatible database was inspected read-only through JDBC metadata.
- No production data was modified.

Official production context:

- Neon supports connection pooling through PgBouncer for high-concurrency serverless-style workloads: [Neon connection pooling docs](https://neon.com/docs/connect/connection-pooling).
- Neon branching is suitable for schema migration testing before production rollout: [Neon branching docs](https://neon.com/docs/introduction/branching).

## Actual Schema Overview

Public tables found:

- `badges`
- `chat_messages`
- `chat_sessions`
- `companion_memories`
- `crisis_events`
- `daily_checkins`
- `emotion_logs`
- `exam_events`
- `flyway_schema_history`
- `future_me_letters`
- `gratitude_journals`
- `habit_logs`
- `habits`
- `journal_entries`
- `life_goals`
- `moderation_audit_logs`
- `moods`
- `password_reset_tokens`
- `recommendations`
- `user_badges`
- `user_challenges`
- `users`

Flyway status:

| Version | Description | Status |
| --- | --- | --- |
| 1 | init | Success |
| 2 | seed | Success |
| 3 | teen wellness | Success |
| 4 | add companion persistence | Success |
| 5 | add badges metadata | Success |
| 6 | seed analytics history | Success |
| 7 | add companion persistence v2 | Success |

Evidence:

- `backend/src/main/resources/db/migration/V1__init.sql`
- `backend/src/main/resources/db/migration/V2__seed.sql`
- `backend/src/main/resources/db/migration/V3__teen_wellness.sql`
- `backend/src/main/resources/db/migration/V4__add_companion_persistence.sql`
- `backend/src/main/resources/db/migration/V5__add_badges_metadata.sql`
- `backend/src/main/resources/db/migration/V6__seed_analytics_history.sql`
- `backend/src/main/resources/db/migration/V7__add_companion_persistence_v2.sql`

## Current Local Row Counts

Read-only local sample counts:

| Table | Rows |
| --- | ---: |
| `badges` | 10 |
| `chat_messages` | 16 |
| `chat_sessions` | 2 |
| `companion_memories` | 1 |
| `crisis_events` | 0 |
| `daily_checkins` | 47 |
| `emotion_logs` | 9 |
| `exam_events` | 0 |
| `future_me_letters` | 0 |
| `gratitude_journals` | 0 |
| `habit_logs` | 191 |
| `habits` | 13 |
| `journal_entries` | 1 |
| `life_goals` | 1 |
| `moderation_audit_logs` | 0 |
| `moods` | 1 |
| `password_reset_tokens` | 0 |
| `recommendations` | 0 |
| `user_badges` | 4 |
| `user_challenges` | 8 |
| `users` | 10 |

## Existing Indexes

Confirmed useful indexes:

- `users(email)` unique.
- `moods(user_id, created_at DESC)`.
- `journal_entries(user_id, created_at DESC)`.
- `chat_messages(user_id, created_at ASC)`.
- `emotion_logs(user_id, created_at DESC)`.
- `crisis_events(user_id, created_at DESC)`.
- `daily_checkins(user_id, created_at DESC)`.
- `habit_logs(user_id, completed_date)`.
- `habit_logs(user_id, habit_id, completed_date)` unique.
- `life_goals(user_id)`.
- `companion_memories(user_id, created_at DESC)`.
- `badges(badge_name)` unique.

Evidence:

- Core indexes in `backend/src/main/resources/db/migration/V1__init.sql:75`
- Teen wellness indexes in `backend/src/main/resources/db/migration/V3__teen_wellness.sql:106`
- Companion memory index in `backend/src/main/resources/db/migration/V7__add_companion_persistence_v2.sql:23`

## Relationships and Cascade Rules

Observed relationship pattern:

- Most user-owned tables reference `users(id) ON DELETE CASCADE`.
- `chat_messages` references both `chat_sessions(id) ON DELETE CASCADE` and `users(id) ON DELETE CASCADE`.
- `habit_logs` references both `habits(id) ON DELETE CASCADE` and `users(id) ON DELETE CASCADE`.
- `moderation_audit_logs.admin_user_id` references `users(id) ON DELETE CASCADE`.

Positive:

- User deletion cleans up most dependent personal data.
- Habit deletion cleans up habit logs.

Risk:

- Cascading deletes can remove moderation audit logs when an admin user is deleted.
- `moderation_audit_logs.target_user_id` is not a foreign key, so target-user history can drift.

Recommended fix:

- Consider `ON DELETE SET NULL` for `moderation_audit_logs.admin_user_id`.
- Add explicit immutable snapshot fields for admin email and target user email at audit time.
- Decide whether `target_user_id` should remain denormalized or be constrained.

## Findings

### Critical

None confirmed in the current local schema.

### High

#### H-1: Missing database CHECK constraints for core wellness bounds

Evidence:

- DTOs lack validation in `backend/src/main/java/com/mindmate/dto/AppDtos.java:25`.
- `daily_checkins` columns are created without domain checks in `backend/src/main/resources/db/migration/V3__teen_wellness.sql:10`.
- `life_goals.progress_percent` is created without a 0-100 check in `backend/src/main/resources/db/migration/V3__teen_wellness.sql:73`.
- `exam_events.study_minutes` is created without a non-negative check in `backend/src/main/resources/db/migration/V3__teen_wellness.sql:63`.

Risk:

- Invalid mood, sleep, stress, energy, progress, and study-minute data can enter through bugs or direct SQL.
- Analytics and burnout logic assume bounded values.

Recommended fix:

- Add a migration with CHECK constraints:
  - `energy_level between 1 and 5`
  - `stress_level between 1 and 5`
  - `sleep_quality between 1 and 5`
  - `social_interaction between 1 and 5`
  - `sleep_hours between 0 and 24`
  - `wellness_score between 0 and 100`
  - `progress_percent between 0 and 100`
  - `study_minutes >= 0`
  - `xp >= 0`, `pet_xp >= 0`, `level >= 1`

#### H-2: Missing uniqueness constraints allow duplicate badges and challenges

Evidence:

- `user_badges` has no unique constraint in `backend/src/main/resources/db/migration/V3__teen_wellness.sql:85`.
- `user_challenges` has no unique constraint in `backend/src/main/resources/db/migration/V3__teen_wellness.sql:93`.
- Application checks `existsByUserAndBadgeName` in `backend/src/main/java/com/mindmate/repository/UserBadgeRepository.java:10`.
- Challenges are seeded in service code in `backend/src/main/java/com/mindmate/service/TeenWellnessService.java:435`.

Risk:

- Race conditions can create duplicate user badge/challenge rows.
- Reward XP can be awarded more than once.

Recommended fix:

- Add unique index `user_badges(user_id, badge_name)`.
- Add unique index `user_challenges(user_id, challenge_type)`.
- Make badge/challenge award flows idempotent at the database level.

#### H-3: Missing index coverage on several repository query paths

Evidence:

- `ExamEventRepository.findByUserOrderByExamDateAsc` in `backend/src/main/java/com/mindmate/repository/ExamEventRepository.java:9`.
- `GratitudeJournalRepository.findByUserOrderByCreatedAtDesc` in `backend/src/main/java/com/mindmate/repository/GratitudeJournalRepository.java:9`.
- `RecommendationRepository.findByUserOrderByCreatedAtDesc` in `backend/src/main/java/com/mindmate/repository/RecommendationRepository.java:9`.
- `ChatSessionRepository.findFirstByUserOrderByCreatedAtDesc` in `backend/src/main/java/com/mindmate/repository/ChatSessionRepository.java:9`.
- `UserBadgeRepository.findByUser` in `backend/src/main/java/com/mindmate/repository/UserBadgeRepository.java:9`.
- `UserChallengeRepository.findByUser` in `backend/src/main/java/com/mindmate/repository/UserChallengeRepository.java:9`.

Recommended indexes:

- `exam_events(user_id, exam_date ASC)`
- `gratitude_journals(user_id, created_at DESC)`
- `recommendations(user_id, created_at DESC)`
- `chat_sessions(user_id, created_at DESC)`
- `future_me_letters(user_id, unlock_date)`
- `user_badges(user_id, badge_name)`
- `user_challenges(user_id, challenge_type)`
- `habits(user_id)`
- `moderation_audit_logs(admin_user_id, created_at DESC)`

### Medium

#### M-1: Analytics/correlation queries load full user history into memory

Evidence:

- Correlations load all check-ins in `backend/src/main/java/com/mindmate/service/CorrelationEngineService.java:27`.
- Correlations load all habit logs in `backend/src/main/java/com/mindmate/service/CorrelationEngineService.java:91`.
- Reflections load all check-ins/habit logs in `backend/src/main/java/com/mindmate/service/ReflectionService.java:30`.
- Analytics wrappers use `/api/checkins/history`, `/api/habits/logs`, and `/api/dashboard`.

Risk:

- User history growth can degrade response time and memory.

Recommended fix:

- Add date-windowed repository methods, for example last 30/90 days.
- Compute aggregates in SQL for analytics endpoints.
- Add pagination for history endpoints.

#### M-2: Admin moderation is N+1 and unpaginated

Evidence:

- `users.findAll()` in `backend/src/main/java/com/mindmate/service/AdminService.java:36`.
- Per-user journal fetch in `backend/src/main/java/com/mindmate/service/AdminService.java:37`.
- Per-user message fetch in `backend/src/main/java/com/mindmate/service/AdminService.java:39`.

Risk:

- Admin moderation gets slower with each user and can load large sensitive datasets into memory.

Recommended fix:

- Add paginated repository queries by consent and created date.
- Add indexes for moderation access windows.
- Consider materialized moderation queue or moderation event table.

#### M-3: Seed migrations mutate demo data and should not run against production

Evidence:

- `V2__seed.sql` inserts demo users in `backend/src/main/resources/db/migration/V2__seed.sql:1`.
- `V6__seed_analytics_history.sql` deletes and recreates demo analytics records in `backend/src/main/resources/db/migration/V6__seed_analytics_history.sql:26`.

Risk:

- Demo credentials and data are inappropriate for production.
- Seed migrations become permanent Flyway history.

Recommended fix:

- Split production schema migrations from development seed migrations.
- Move demo seed data to local/dev profiles or explicit test fixtures.
- Do not include demo users in production database migrations.

#### M-4: User badge rows are not tied to badge metadata

Evidence:

- `badges` table created in `backend/src/main/resources/db/migration/V5__add_badges_metadata.sql:1`.
- `user_badges.badge_name` is a plain string in `backend/src/main/resources/db/migration/V3__teen_wellness.sql:85`.

Risk:

- Badge metadata can be renamed/deleted while historical user badges become orphaned.

Recommended fix:

- Add `badge_id` foreign key to `user_badges`.
- Backfill from `badges.badge_name`.
- Keep display names in `badges`.

### Low

#### L-1: Most FKs cascade on user deletion

This is appropriate for personal wellness data removal, but moderation/audit retention policy should be explicit.

Recommended fix:

- Define retention requirements before production.
- Consider soft deletion or archival for compliance/audit needs.

#### L-2: Flyway migrations are linear and currently healthy

All migration versions are applied successfully. This is good for Closed Beta.

Recommended fix:

- Add migration testing in CI against a disposable Postgres database.
- Use Neon branches to test migrations against production-like data before applying to production.

## Query Efficiency Notes

Good:

- Core journal/mood/chat/check-in history queries have user/date indexes.
- Habit logs now use `@EntityGraph(attributePaths = "habit")` in `backend/src/main/java/com/mindmate/repository/HabitLogRepository.java:15`, reducing lazy-load failures for DTO mapping.

Needs work:

- No `Pageable` usage in repositories.
- Several list endpoints return all records.
- Dashboard counts call `.size()` after loading records in `backend/src/main/java/com/mindmate/service/WellnessService.java:146`.

Recommended fix:

- Add count queries for dashboard metrics.
- Add pagination to history endpoints.
- Add bounded analytics windows.

## Neon Readiness

Current code can connect to Neon using `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`:

- `backend/src/main/resources/application.yml:5`
- `backend/src/main/resources/application.yml:6`
- `backend/src/main/resources/application.yml:7`

Neon readiness gaps:

- No documented Neon pooled vs direct connection strategy.
- No SSL mode guidance in examples.
- No migration branch workflow documented.
- No backup/restore runbook.

Recommended production configuration:

- Use Neon direct connection for Flyway migrations.
- Use Neon pooled connection for runtime if connection count becomes a problem.
- Keep `sslmode=require` in production connection strings.
- Use Neon branches for migration rehearsal.
- Document restore procedure and retention expectations.

## Recommended Migration Backlog

1. Add CHECK constraints for numeric/domain bounds.
2. Add unique constraints for user badge/challenge idempotency.
3. Add missing query-path indexes.
4. Replace demo seed migrations with environment-scoped seed process for future databases.
5. Add badge metadata foreign key.
6. Add pagination/date-window query methods.

## Report Commit Recommendation

Commit this report after review. It contains schema metadata and row counts from the local database, but no secrets.
