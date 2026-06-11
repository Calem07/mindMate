CREATE TABLE badges (
  id bigserial PRIMARY KEY,
  badge_name varchar(100) NOT NULL UNIQUE,
  description varchar(255) NOT NULL,
  xp_reward integer NOT NULL DEFAULT 15,
  rarity varchar(50) NOT NULL DEFAULT 'COMMON'
);

-- Seed predefined badges
INSERT INTO badges (badge_name, description, xp_reward, rarity) VALUES
('First Journal Entry', 'Log your first reflective journal entry', 15, 'COMMON'),
('7-Day Streak', 'Maintain a consecutive 7-day daily check-in streak', 15, 'COMMON'),
('Habit Hero', 'Log completion for 5 habits in your list', 30, 'RARE'),
('Sleep Champion', 'Average 8+ hours of sleep over a 7-day period', 30, 'RARE'),
('Goal Achiever', 'Complete at least one life goal milestone', 30, 'RARE'),
('Level 5: Optimist', 'Reach level 5 through continuous self-care tracking', 30, 'RARE'),
('Wellness Warrior', 'Log 7 wellness check-ins with positive wellness scores', 50, 'EPIC'),
('Level 10: Achiever', 'Reach level 10 and unlock advanced tracking features', 50, 'EPIC'),
('Consistency Master', 'Log completion for 10 habits across active days', 100, 'LEGENDARY'),
('Level 20: Mentor', 'Reach level 20 to evolve your AI companion fully', 100, 'LEGENDARY')
ON CONFLICT (badge_name) DO NOTHING;
