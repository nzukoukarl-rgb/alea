-- Better Auth rate-limit counters, stored in Postgres so limits hold across serverless instances.
create table if not exists "rateLimit" (
  id text primary key,
  key text not null,
  count integer not null,
  "lastRequest" bigint not null
);
create unique index if not exists rate_limit_key_idx on "rateLimit" (key);
