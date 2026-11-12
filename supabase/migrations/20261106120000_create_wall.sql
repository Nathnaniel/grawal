-- The wall: profiles, categories, entries and shares.
-- Entries are private by default. Nothing here is readable without signing in,
-- and every row is limited to its owner by row-level security.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '' check (char_length(name) <= 80),
  timezone text not null default 'UTC',
  reminder_frequency text not null default 'off' check (reminder_frequency in ('off', 'daily', 'weekly')),
  reminder_time time not null default '20:00',
  onboarded_at timestamptz,
  created_at timestamptz not null default now()
);

-- A null user_id marks one of the defaults everyone shares.
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 40),
  colour text not null check (colour ~ '^#[0-9a-fA-F]{6}$'),
  created_at timestamptz not null default now()
);

create unique index categories_owner_name_key
  on public.categories (user_id, lower(name)) nulls not distinct;

-- The browser generates ids, so a save retried after a dropped connection
-- lands on the same row instead of adding a duplicate.
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 280),
  reflection text check (char_length(reflection) <= 10000),
  category_id uuid references public.categories (id) on delete set null,
  scripture_ref text check (char_length(scripture_ref) <= 120),
  photo_path text,
  is_pinned boolean not null default false,
  entry_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_text text generated always as (
    lower(title || ' ' || coalesce(reflection, '') || ' ' || coalesce(scripture_ref, ''))
  ) stored
);

create index entries_wall_idx on public.entries (user_id, is_pinned, entry_date desc, created_at desc);
create index entries_timeline_idx on public.entries (user_id, entry_date desc);
create index entries_category_idx on public.entries (category_id);

create table public.shares (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries (id) on delete cascade,
  public_slug text not null unique check (char_length(public_slug) >= 16),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index shares_entry_idx on public.shares (entry_id);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.entries enable row level security;
alter table public.shares enable row level security;

-- Explicit grants, so nothing depends on the project's Data API defaults.
-- Signed-out visitors get nothing.
revoke all on public.profiles, public.categories, public.entries, public.shares from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (name, timezone, reminder_frequency, reminder_time, onboarded_at) on public.profiles to authenticated;
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.entries to authenticated;
grant select, insert on public.shares to authenticated;
grant update (revoked_at) on public.shares to authenticated;

create policy "Read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "Update own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Read defaults and own categories" on public.categories
  for select to authenticated using (user_id is null or user_id = (select auth.uid()));

create policy "Add own categories" on public.categories
  for insert to authenticated with check (user_id = (select auth.uid()));

create policy "Update own categories" on public.categories
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Delete own categories" on public.categories
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "Read own entries" on public.entries
  for select to authenticated using (user_id = (select auth.uid()));

-- A foreign key alone would accept another person's category id.
create policy "Add own entries" on public.entries
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (category_id is null or exists (
      select 1 from public.categories c
      where c.id = category_id and (c.user_id is null or c.user_id = (select auth.uid()))
    ))
  );

create policy "Update own entries" on public.entries
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and (category_id is null or exists (
      select 1 from public.categories c
      where c.id = category_id and (c.user_id is null or c.user_id = (select auth.uid()))
    ))
  );

create policy "Delete own entries" on public.entries
  for delete to authenticated using (user_id = (select auth.uid()));

-- Owner only for now. How a stranger opens a shared testimony is designed with
-- the sharing feature, so no signed-out read exists yet.
create policy "Read own shares" on public.shares
  for select to authenticated using (exists (
    select 1 from public.entries e where e.id = entry_id and e.user_id = (select auth.uid())
  ));

create policy "Share own entries" on public.shares
  for insert to authenticated with check (exists (
    select 1 from public.entries e where e.id = entry_id and e.user_id = (select auth.uid())
  ));

create policy "Revoke own shares" on public.shares
  for update to authenticated
  using (exists (
    select 1 from public.entries e where e.id = entry_id and e.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.entries e where e.id = entry_id and e.user_id = (select auth.uid())
  ));

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;

create trigger entries_set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

-- Every new sign-in gets a profile, named from Google or the email address.
-- The name is display text only and is never used for access decisions.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    left(coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(new.email, '@', 1),
      ''
    ), 80)
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Runs as the caller, so it counts only that person's entries.
create function public.entry_year_counts()
returns table (year integer, wins bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select extract(year from entry_date)::integer as year, count(*) as wins
  from public.entries
  group by 1
  order by 1 desc;
$$;

revoke execute on function public.entry_year_counts() from public, anon;
grant execute on function public.entry_year_counts() to authenticated;

insert into public.categories (name, colour) values
  ('Faith', '#A8740C'),
  ('Work', '#33688C'),
  ('Family', '#B04466'),
  ('Health', '#3C7A58'),
  ('Finances', '#68741F'),
  ('Studies', '#6650A8'),
  ('Answered Prayer', '#BC4F14');
