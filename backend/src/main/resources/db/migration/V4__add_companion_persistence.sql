-- Companion Data Persistence
ALTER TABLE users ADD COLUMN pet_type varchar(100);
ALTER TABLE users ADD COLUMN pet_name varchar(100);
ALTER TABLE users ADD COLUMN pet_level integer NOT NULL DEFAULT 1;
ALTER TABLE users ADD COLUMN pet_mood varchar(100);
ALTER TABLE users ADD COLUMN pet_theme varchar(100);
ALTER TABLE users ADD COLUMN pet_accessory varchar(100);
ALTER TABLE users ADD COLUMN pet_created_at timestamptz DEFAULT now();
