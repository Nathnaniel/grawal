-- A private list of sign-ins for the project owner, read in the Supabase dashboard
-- (Table Editor or SQL Editor, schema "admin"). The admin schema isn't exposed by
-- the app's API, and the signed-in and signed-out roles get no access to it, so no
-- visitor can ever read this through the site.

create schema if not exists admin;
revoke all on schema admin from public, anon, authenticated;

create or replace view admin.sign_ins
with (security_invoker = on) as
select
  e.created_at,
  e.payload ->> 'actor_username' as email,
  case e.payload ->> 'action'
    when 'login' then 'signed in'
    when 'user_signedup' then 'created account'
    else e.payload ->> 'action'
  end as event,
  coalesce(e.payload -> 'traits' ->> 'provider', 'email') as method,
  e.ip_address
from auth.audit_log_entries e
where e.payload ->> 'action' in ('login', 'user_signedup')
order by e.created_at desc;

revoke all on admin.sign_ins from public, anon, authenticated;

comment on view admin.sign_ins is
  'Sign-ins and new accounts, newest first. For the owner only; never exposed to the app.';
