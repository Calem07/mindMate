-- Allow the Lovable check-in flow to persist only the fields it collects.
-- Unknown wellness details remain NULL and are excluded from analytics.

ALTER TABLE daily_checkins
  ALTER COLUMN stress_level DROP NOT NULL,
  ALTER COLUMN sleep_hours DROP NOT NULL,
  ALTER COLUMN sleep_quality DROP NOT NULL,
  ALTER COLUMN social_interaction DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_daily_checkins_ranges') THEN
    ALTER TABLE daily_checkins DROP CONSTRAINT chk_daily_checkins_ranges;
  END IF;

  ALTER TABLE daily_checkins
    ADD CONSTRAINT chk_daily_checkins_ranges
    CHECK (
      energy_level BETWEEN 1 AND 5
      AND (stress_level IS NULL OR stress_level BETWEEN 1 AND 5)
      AND (sleep_hours IS NULL OR sleep_hours BETWEEN 0 AND 24)
      AND (sleep_quality IS NULL OR sleep_quality BETWEEN 1 AND 5)
      AND (social_interaction IS NULL OR social_interaction BETWEEN 1 AND 5)
      AND wellness_score BETWEEN 0 AND 100
    );
END $$;
