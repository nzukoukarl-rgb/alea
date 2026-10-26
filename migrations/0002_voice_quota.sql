create table if not exists voice_quota (
  user_id text not null,
  day text not null,
  used integer not null default 0,
  primary key (user_id, day)
);
