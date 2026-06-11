-- Refactor Companion Data Persistence
ALTER TABLE users ADD COLUMN has_selected_companion boolean NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN pet_xp integer NOT NULL DEFAULT 0;

-- Migrate existing data
UPDATE users SET has_selected_companion = true WHERE pet_type IS NOT NULL;
UPDATE users SET pet_xp = (pet_level - 1) * 100 WHERE pet_level IS NOT NULL;

-- Drop redundant fields
ALTER TABLE users DROP COLUMN pet_level;
ALTER TABLE users DROP COLUMN pet_mood;

-- Create companion memory tables
CREATE TABLE companion_memories (
  id bigserial PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory_type varchar(50) NOT NULL,
  title varchar(200) NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_companion_memories_user_created ON companion_memories(user_id, created_at DESC);
