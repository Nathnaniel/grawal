-- Reads behind the wall's widgets. Both run as the caller, so row-level
-- security limits them to that person's entries.

-- Wins from this calendar day in earlier years.
create function public.entries_on_this_day(p_day date)
returns setof public.entries
language sql
stable
security invoker
set search_path = ''
as $$
  select *
  from public.entries
  where extract(month from entry_date) = extract(month from p_day)
    and extract(day from entry_date) = extract(day from p_day)
    and entry_date < p_day
  order by entry_date desc
  limit 5;
$$;

-- How one year's wins split across categories, largest first.
create function public.year_category_counts(p_year integer)
returns table (category_id uuid, wins bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select category_id, count(*) as wins
  from public.entries
  where category_id is not null
    and entry_date >= make_date(p_year, 1, 1)
    and entry_date < make_date(p_year + 1, 1, 1)
  group by category_id
  order by wins desc
  limit 4;
$$;

revoke execute on function public.entries_on_this_day(date) from public, anon;
revoke execute on function public.year_category_counts(integer) from public, anon;
grant execute on function public.entries_on_this_day(date) to authenticated;
grant execute on function public.year_category_counts(integer) to authenticated;
