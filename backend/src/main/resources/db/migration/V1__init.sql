create table users (
  id bigserial primary key,
  name varchar(160) not null,
  email varchar(220) not null unique,
  password_hash varchar(255) not null,
  role varchar(40) not null default 'STUDENT',
  moderation_consent boolean not null default false,
  moderation_consent_at timestamptz,
  created_at timestamptz not null default now()
);

create table password_reset_tokens (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  token varchar(120) not null unique,
  expires_at timestamptz not null,
  used boolean not null default false
);

create table moods (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  mood varchar(40) not null,
  created_at timestamptz not null default now()
);

create table journal_entries (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  title varchar(220) not null,
  content text not null,
  summary text,
  key_concerns text,
  emotion varchar(40) not null default 'NEUTRAL',
  created_at timestamptz not null default now()
);

create table chat_sessions (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table chat_messages (
  id bigserial primary key,
  session_id bigint not null references chat_sessions(id) on delete cascade,
  user_id bigint not null references users(id) on delete cascade,
  sender varchar(40) not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table emotion_logs (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  emotion varchar(40) not null,
  confidence_score double precision not null,
  created_at timestamptz not null default now()
);

create table recommendations (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  content text not null,
  source varchar(120),
  created_at timestamptz not null default now()
);

create table crisis_events (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  trigger_phrase varchar(160) not null,
  source_text text not null,
  created_at timestamptz not null default now()
);

create table moderation_audit_logs (
  id bigserial primary key,
  admin_user_id bigint not null references users(id) on delete cascade,
  action varchar(120) not null,
  target_user_id bigint,
  created_at timestamptz not null default now()
);

create index idx_moods_user_created on moods(user_id, created_at desc);
create index idx_journals_user_created on journal_entries(user_id, created_at desc);
create index idx_chat_messages_user_created on chat_messages(user_id, created_at asc);
create index idx_emotion_logs_user_created on emotion_logs(user_id, created_at desc);
create index idx_crisis_events_user_created on crisis_events(user_id, created_at desc);
