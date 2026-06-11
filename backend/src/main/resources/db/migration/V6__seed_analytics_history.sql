-- Seed 45 days of wellness checkins and habit logs for Student Demo
DO $$
DECLARE
  student_id bigint;
  habit_ids bigint[];
  i integer;
  checkin_date timestamptz;
  mood_opt varchar;
  stress_val integer;
  energy_val integer;
  sleep_hr double precision;
  sleep_ql integer;
  social_val integer;
  wellness_sc integer;
  mood_trig varchar;
  habit_index integer;
BEGIN
  -- Get user id
  SELECT id INTO student_id FROM users WHERE email = 'student@mindmate.local';
  
  IF student_id IS NOT NULL THEN
    -- Get habit ids
    SELECT array_agg(id) INTO habit_ids FROM habits WHERE user_id = student_id;
    
    -- Delete any existing checkins/logs to start clean
    DELETE FROM daily_checkins WHERE user_id = student_id;
    DELETE FROM habit_logs WHERE user_id = student_id;
    
    -- Loop 45 days backwards
    FOR i IN 0..45 LOOP
      checkin_date := now() - (i || ' days')::interval;
      
      -- Deterministic random-like values based on date index
      CASE (i % 5)
        WHEN 0 THEN
          mood_opt := 'EXCELLENT';
          stress_val := 1;
          energy_val := 5;
          sleep_hr := 8.5;
          sleep_ql := 5;
          social_val := 4;
          mood_trig := 'Health';
        WHEN 1 THEN
          mood_opt := 'GOOD';
          stress_val := 2;
          energy_val := 4;
          sleep_hr := 7.5;
          sleep_ql := 4;
          social_val := 3;
          mood_trig := 'Friends';
        WHEN 2 THEN
          mood_opt := 'NEUTRAL';
          stress_val := 3;
          energy_val := 3;
          sleep_hr := 6.5;
          sleep_ql := 3;
          social_val := 3;
          mood_trig := 'Other';
        WHEN 3 THEN
          mood_opt := 'STRESSED';
          stress_val := 4;
          energy_val := 2;
          sleep_hr := 5.5;
          sleep_ql := 2;
          social_val := 2;
          mood_trig := 'Academic Pressure';
        WHEN 4 THEN
          mood_opt := 'SAD';
          stress_val := 5;
          energy_val := 2;
          sleep_hr := 5.0;
          sleep_ql := 1;
          social_val := 1;
          mood_trig := 'Social Media';
      END CASE;
      
      -- Add weekly fluctuations
      IF (i % 7 IN (5, 6)) THEN
        -- Weekends have better sleep/mood
        mood_opt := 'EXCELLENT';
        sleep_hr := sleep_hr + 1.0;
        sleep_ql := LEAST(5, sleep_ql + 1);
        stress_val := GREATEST(1, stress_val - 1);
      END IF;
      
      -- Calculate wellness score matching calculateWellnessScore logic in App.jsx
      DECLARE
        mood_v integer;
        stress_f integer;
        energy_f integer;
        sleep_f double precision;
        quality_f integer;
        social_f integer;
      BEGIN
        CASE mood_opt
          WHEN 'EXCELLENT' THEN mood_v := 100;
          WHEN 'GOOD' THEN mood_v := 80;
          WHEN 'NEUTRAL' THEN mood_v := 60;
          WHEN 'STRESSED' THEN mood_v := 40;
          ELSE mood_v := 20;
        END CASE;
        stress_f := (6 - stress_val) * 20;
        energy_f := energy_val * 20;
        sleep_f := LEAST(sleep_hr * 12.5, 100.0);
        quality_f := sleep_ql * 20;
        social_f := social_val * 20;
        wellness_sc := round((mood_v + stress_f + energy_f + sleep_f + quality_f + social_f) / 6.0);
      END;
      
      -- Insert checkin
      INSERT INTO daily_checkins (user_id, mood, energy_level, stress_level, sleep_hours, sleep_quality, social_interaction, mood_trigger, wellness_score, created_at)
      VALUES (student_id, mood_opt, energy_val, stress_val, sleep_hr, sleep_ql, social_val, mood_trig, wellness_sc, checkin_date);
      
      -- Insert habit completions based on weekday/index
      IF array_length(habit_ids, 1) > 0 THEN
        FOR habit_index IN 1..array_length(habit_ids, 1) LOOP
          -- Student completes different habits on different days
          IF ((i + habit_index) % 3 != 0) THEN
            INSERT INTO habit_logs (habit_id, user_id, completed_date, created_at)
            VALUES (habit_ids[habit_index], student_id, (checkin_date::date), checkin_date)
            ON CONFLICT DO NOTHING;
          END IF;
        END LOOP;
      END IF;
      
    END LOOP;
  END IF;
END $$;
