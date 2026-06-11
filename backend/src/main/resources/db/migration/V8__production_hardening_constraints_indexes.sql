-- Production hardening: enforce wellness bounds and add launch-critical indexes.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_daily_checkins_mood') THEN
    ALTER TABLE daily_checkins
      ADD CONSTRAINT chk_daily_checkins_mood
      CHECK (mood IN ('EXCELLENT', 'GOOD', 'NEUTRAL', 'STRESSED', 'SAD'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_daily_checkins_ranges') THEN
    ALTER TABLE daily_checkins
      ADD CONSTRAINT chk_daily_checkins_ranges
      CHECK (
        energy_level BETWEEN 1 AND 5
        AND stress_level BETWEEN 1 AND 5
        AND sleep_hours BETWEEN 0 AND 24
        AND sleep_quality BETWEEN 1 AND 5
        AND social_interaction BETWEEN 1 AND 5
        AND wellness_score BETWEEN 0 AND 100
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_life_goals_progress_percent') THEN
    ALTER TABLE life_goals
      ADD CONSTRAINT chk_life_goals_progress_percent
      CHECK (progress_percent BETWEEN 0 AND 100);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_exam_events_study_minutes') THEN
    ALTER TABLE exam_events
      ADD CONSTRAINT chk_exam_events_study_minutes
      CHECK (study_minutes >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_users_growth_bounds') THEN
    ALTER TABLE users
      ADD CONSTRAINT chk_users_growth_bounds
      CHECK (xp >= 0 AND pet_xp >= 0 AND level >= 1 AND current_streak >= 0 AND longest_streak >= 0);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_badges_user_badge_name
  ON user_badges(user_id, badge_name);

CREATE UNIQUE INDEX IF NOT EXISTS ux_user_challenges_user_challenge_type
  ON user_challenges(user_id, challenge_type);

CREATE INDEX IF NOT EXISTS idx_exam_events_user_exam_date
  ON exam_events(user_id, exam_date ASC);

CREATE INDEX IF NOT EXISTS idx_gratitude_journals_user_created
  ON gratitude_journals(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_created
  ON recommendations(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_created
  ON chat_sessions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_future_me_letters_user_unlock
  ON future_me_letters(user_id, unlock_date);

CREATE INDEX IF NOT EXISTS idx_habits_user
  ON habits(user_id);

CREATE INDEX IF NOT EXISTS idx_moderation_audit_logs_admin_created
  ON moderation_audit_logs(admin_user_id, created_at DESC);
