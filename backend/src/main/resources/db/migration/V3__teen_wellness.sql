-- Profile Gamification Extension
ALTER TABLE users ADD COLUMN xp integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN level integer NOT NULL DEFAULT 1;
ALTER TABLE users ADD COLUMN current_streak integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN longest_streak integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN last_activity_date date;
ALTER TABLE users ADD COLUMN garden_theme varchar(50) NOT NULL DEFAULT 'CLASSIC';

-- Daily Check-In, Sleep & Triggers
CREATE TABLE daily_checkins (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood varchar(40) NOT NULL,
  energy_level integer NOT NULL,
  stress_level integer NOT NULL,
  sleep_hours double precision NOT NULL,
  sleep_quality integer NOT NULL,
  social_interaction integer NOT NULL,
  mood_trigger varchar(100), -- Exams, Family, Friends, Social Media, Health, Relationships, Academic Pressure, Other
  wellness_score integer NOT NULL, -- computed (0-100)
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Gratitude Journals
CREATE TABLE gratitude_journals (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  happy_moment text NOT NULL,
  grateful_for text NOT NULL,
  proud_achievement text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Habits Catalog
CREATE TABLE habits (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name varchar(160) NOT NULL,
  is_custom boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Habit Logs (Completion dates)
CREATE TABLE habit_logs (
  id bigserial PRIMARY KEY,
  habit_id bigint NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_habit_date UNIQUE (user_id, habit_id, completed_date)
);

-- Future Me Letters
CREATE TABLE future_me_letters (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  unlock_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Exam Mode Tracker
CREATE TABLE exam_events (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject varchar(160) NOT NULL,
  exam_date timestamptz NOT NULL,
  study_minutes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Life Goals
CREATE TABLE life_goals (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category varchar(50) NOT NULL, -- ACADEMIC, FITNESS, PERSONAL_DEVELOPMENT, CAREER_PREPARATION, SKILL_DEVELOPMENT
  title varchar(220) NOT NULL,
  target_date date,
  progress_percent integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Achievements & Badges
CREATE TABLE user_badges (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_name varchar(100) NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now()
);

-- Active Challenges
CREATE TABLE user_challenges (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_name varchar(160) NOT NULL,
  challenge_type varchar(100) NOT NULL, -- JOURNAL_STREAK, SLEEP_CONSISTENCY, HABIT_DAILY, MOOD_TRACKING
  progress integer NOT NULL DEFAULT 0,
  target integer NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  reward_xp integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_checkins_user_date ON daily_checkins(user_id, created_at DESC);
CREATE INDEX idx_habit_logs_user ON habit_logs(user_id, completed_date);
CREATE INDEX idx_goals_user ON life_goals(user_id);

-- Seed Predefined Habits for Student Demo
INSERT INTO habits (user_id, name, is_custom)
SELECT id, 'Drink water', false FROM users WHERE email = 'student@mindmate.local' UNION ALL
SELECT id, 'Sleep 8 hours', false FROM users WHERE email = 'student@mindmate.local' UNION ALL
SELECT id, 'Exercise', false FROM users WHERE email = 'student@mindmate.local' UNION ALL
SELECT id, 'Study', false FROM users WHERE email = 'student@mindmate.local' UNION ALL
SELECT id, 'Read', false FROM users WHERE email = 'student@mindmate.local' UNION ALL
SELECT id, 'Meditation', false FROM users WHERE email = 'student@mindmate.local';
