-- People can drag wins around the wall and drop one on another to make a stack.
--
-- wall_rank: the wall's order, smallest first. Moving a win gives it a rank between its
--   new neighbours, so only the moved wins are written.
-- stack_id:  wins sharing a stack_id sit together in one pile. It's the id of the win the
--   stack started from; no foreign key, so deleting that win leaves the rest still stacked.
alter table public.entries
  add column if not exists wall_rank double precision,
  add column if not exists stack_id uuid;

-- Existing walls keep the order they have today: newest first, 1024 apart so there's room to move.
update public.entries as e
set wall_rank = ranked.position * 1024
from (
  select id, row_number() over (partition by user_id order by entry_date desc, created_at desc) as position
  from public.entries
) as ranked
where e.id = ranked.id and e.wall_rank is null;

-- A win arriving without a rank (a new one, or one pinned back from History) goes to the top.
-- Runs as the signed-in person, so row-level security limits the lookup to their own wall.
create or replace function public.set_wall_rank()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.wall_rank is null then
    select coalesce(min(e.wall_rank), 1024) - 1024 into new.wall_rank
    from public.entries as e
    where e.user_id = new.user_id and e.on_wall and e.id <> new.id;
  end if;
  return new;
end;
$$;

revoke execute on function public.set_wall_rank() from public, anon, authenticated;

drop trigger if exists entries_set_wall_rank on public.entries;
create trigger entries_set_wall_rank
  before insert or update of wall_rank on public.entries
  for each row execute function public.set_wall_rank();

-- The wall now reads in rank order.
drop index if exists public.entries_on_wall_idx;
create index if not exists entries_wall_rank_idx
  on public.entries (user_id, wall_rank)
  where on_wall;
