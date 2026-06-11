insert into users (name, email, password_hash, role, moderation_consent, moderation_consent_at)
values
  ('Student Demo', 'student@mindmate.local', '$2a$10$SLeN25SVcSxfD2CEoAe1heHlCVZOg8s1BTjmEL6kk9Jd539nXQ5ai', 'STUDENT', true, now()),
  ('Admin Demo', 'admin@mindmate.local', '$2a$10$SLeN25SVcSxfD2CEoAe1heHlCVZOg8s1BTjmEL6kk9Jd539nXQ5ai', 'ADMIN', false, null);

insert into moods (user_id, mood)
select id, 'GOOD' from users where email = 'student@mindmate.local';

insert into journal_entries (user_id, title, content, summary, key_concerns, emotion)
select id, 'Preparing for evaluation', 'I felt stressed but planning helped me calm down.',
  'Academic pressure improved after breaking tasks down.',
  'Primary signal: stressed; suggested focus: one small next step.',
  'STRESSED'
from users where email = 'student@mindmate.local';
