-- Unpinning a win takes it off the wall without deleting it: it stays in History
-- and can be pinned back. Every existing win starts on the wall.
alter table public.entries add column if not exists on_wall boolean not null default true;

-- The wall reads only the wins still on it, newest first.
create index if not exists entries_on_wall_idx
  on public.entries (user_id, entry_date desc, created_at desc)
  where on_wall;
