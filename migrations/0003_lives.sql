-- Lives saved per account. One row per (user, life id), versioned so that old lives stay readable
-- after the simulation engine evolves: read `simulation_version` before interpreting `state`.
create table if not exists life (
  user_id text not null references "user"(id) on delete cascade,
  id text not null,
  world_version integer not null default 1,
  simulation_version integer not null default 1,
  seed bigint,
  alive boolean not null default true,
  age integer not null default 0,
  state jsonb not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
create index if not exists life_user_updated_idx on life (user_id, updated_at desc);
