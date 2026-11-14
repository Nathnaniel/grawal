// Applies the real migrations to Postgres (PGlite) and checks who can see what.
// Supabase's auth and storage schemas are stubbed with the parts the SQL touches.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const A = '00000000-0000-4000-8000-00000000000a';
const B = '00000000-0000-4000-8000-00000000000b';
const ENTRY_A = '10000000-0000-4000-8000-00000000000a';
const db = new PGlite();

const STUBS = `
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create schema storage;
  grant usage on schema public, auth, storage to anon, authenticated;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
  create table auth.audit_log_entries (id uuid primary key default gen_random_uuid(), payload json, created_at timestamptz default now(), ip_address varchar(64) not null default '');
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant select, insert, update, delete on storage.objects to authenticated;
  create function storage.foldername(name text) returns text[] language sql immutable as
    $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
`;

// Runs one statement as a signed-in person, the way the Data API would.
async function as<T>(user: string | null, sql: string, params: unknown[] = []) {
  await db.exec(`set role ${user ? 'authenticated' : 'anon'}; set request.jwt.claim.sub = '${user ?? ''}';`);
  try {
    return await db.query<T>(sql, params);
  } finally {
    await db.exec(`reset role; set request.jwt.claim.sub = '';`);
  }
}

before(async () => {
  await db.exec(STUBS);
  for (const file of readdirSync('supabase/migrations').sort()) {
    await db.exec(readFileSync(`supabase/migrations/${file}`, 'utf8'));
  }
  await db.query(`insert into auth.users (id, email, raw_user_meta_data) values ($1, 'a@example.com', '{"full_name":"Ada"}'), ($2, 'bola@example.com', '{}')`, [A, B]);
  await as(A, `insert into public.entries (id, title) values ($1, 'Got the job')`, [ENTRY_A]);
});

after(() => db.close());

test('a new sign-in gets a profile named from Google or the email', async () => {
  const { rows } = await db.query<{ name: string }>('select name from public.profiles order by id');
  assert.deepEqual(rows.map((r) => r.name), ['Ada', 'bola']);
});

test('the ten default categories are readable by anyone signed in', async () => {
  const { rows } = await as(B, 'select id from public.categories where user_id is null');
  assert.equal(rows.length, 10);
});

test('saving an entry fills in its owner from the session', async () => {
  const { rows } = await as<{ user_id: string }>(A, 'select user_id from public.entries');
  assert.deepEqual(rows, [{ user_id: A }]);
});

test("nobody can read another person's entries", async () => {
  const { rows } = await as(B, 'select id from public.entries');
  assert.equal(rows.length, 0);
});

test('signed-out visitors cannot read entries at all', async () => {
  await assert.rejects(as(null, 'select id from public.entries'), /permission denied/);
});

test("nobody can edit or delete another person's entries", async () => {
  const updated = await as(B, `update public.entries set title = 'Taken' where id = $1 returning id`, [ENTRY_A]);
  const deleted = await as(B, 'delete from public.entries where id = $1 returning id', [ENTRY_A]);
  assert.equal(updated.rows.length, 0);
  assert.equal(deleted.rows.length, 0);
});

test("nobody can write an entry into another person's wall", async () => {
  await assert.rejects(as(B, `insert into public.entries (user_id, title) values ($1, 'Planted')`, [A]), /row-level security/);
});

test('an owner cannot hand an entry to someone else', async () => {
  await assert.rejects(as(A, 'update public.entries set user_id = $1 where id = $2', [B, ENTRY_A]), /row-level security/);
});

test("nobody can use another person's category", async () => {
  const { rows } = await as<{ id: string }>(A, `insert into public.categories (user_id, name, colour) values ($1, 'Private', '#112233') returning id`, [A]);
  await assert.rejects(as(B, `insert into public.entries (title, category_id) values ('Mine', $1)`, [rows[0].id]), /row-level security/);
});

test('default categories cannot be changed or removed', async () => {
  const updated = await as(A, `update public.categories set name = 'Mine' where user_id is null returning id`);
  const deleted = await as(A, 'delete from public.categories where user_id is null returning id');
  assert.equal(updated.rows.length, 0);
  assert.equal(deleted.rows.length, 0);
});

test('deleting a category keeps its entries', async () => {
  const { rows } = await as<{ id: string }>(A, `insert into public.categories (user_id, name, colour) values ($1, 'Passing', '#112233') returning id`, [A]);
  const entry = await as<{ id: string }>(A, `insert into public.entries (title, category_id) values ('Kept', $1) returning id`, [rows[0].id]);
  await as(A, 'delete from public.categories where id = $1', [rows[0].id]);
  const kept = await as<{ category_id: string | null }>(A, 'select category_id from public.entries where id = $1', [entry.rows[0].id]);
  assert.deepEqual(kept.rows, [{ category_id: null }]);
});

test('retrying a save with the same id does not add a duplicate', async () => {
  const save = `insert into public.entries (id, title) values ('20000000-0000-4000-8000-00000000000a', 'Once')
    on conflict (id) do update set title = excluded.title`;
  await as(A, save);
  await as(A, save);
  const { rows } = await as(A, `select id from public.entries where title = 'Once'`);
  assert.equal(rows.length, 1);
});

test('search text matches any field in lower case', async () => {
  await as(A, `insert into public.entries (title, reflection, scripture_ref) values ('Healed', 'The Doctor called', 'Psalm 103')`);
  const { rows } = await as(A, `select id from public.entries where search_text like '%doctor%' and search_text like '%psalm 103%'`);
  assert.equal(rows.length, 1);
});

test('year counts only include your own entries', async () => {
  await as(B, `insert into public.entries (title, entry_date) values ('Old win', '2021-03-01')`);
  const { rows } = await as<{ year: number; wins: number }>(B, 'select * from public.entry_year_counts()');
  assert.deepEqual(rows.map((r) => [r.year, Number(r.wins)]), [[2021, 1]]);
});

test('signed-out visitors cannot call the year counts', async () => {
  await assert.rejects(as(null, 'select * from public.entry_year_counts()'), /permission denied/);
});

test('on this day finds earlier years only, and only your own', async () => {
  await as(A, `insert into public.entries (title, entry_date) values ('Last year', '2025-11-06'), ('Today', '2026-11-06'), ('Next day', '2025-11-07')`);
  await as(B, `insert into public.entries (title, entry_date) values ('Not yours', '2024-11-06')`);
  const { rows } = await as<{ title: string }>(A, `select title from public.entries_on_this_day('2026-11-06')`);
  assert.deepEqual(rows.map((r) => r.title), ['Last year']);
});

test('category counts cover one year of your own wins, largest first', async () => {
  const { rows: categories } = await as<{ id: string }>(B, `select id from public.categories order by name limit 2`);
  const [first, second] = categories.map((c) => c.id);
  await as(B, `insert into public.entries (title, entry_date, category_id) values
    ('One', '2022-01-01', $1), ('Two', '2022-12-31', $2), ('Three', '2022-06-01', $2), ('Other year', '2023-01-01', $1)`, [first, second]);
  await as(A, `insert into public.entries (title, entry_date, category_id) values ('Not yours', '2022-02-02', $1)`, [first]);
  const { rows } = await as<{ category_id: string; wins: number }>(B, 'select * from public.year_category_counts(2022)');
  assert.deepEqual(rows.map((r) => [r.category_id, Number(r.wins)]), [[second, 2], [first, 1]]);
});

test('signed-out visitors cannot call the widget reads', async () => {
  await assert.rejects(as(null, `select * from public.entries_on_this_day('2026-11-06')`), /permission denied/);
  await assert.rejects(as(null, 'select * from public.year_category_counts(2026)'), /permission denied/);
});

test('sharing only works on your own entries and can be revoked', async () => {
  await assert.rejects(as(B, `insert into public.shares (entry_id, public_slug) values ($1, 'abcdefghijklmnop')`, [ENTRY_A]), /row-level security/);
  await as(A, `insert into public.shares (entry_id, public_slug) values ($1, 'abcdefghijklmnop')`, [ENTRY_A]);
  assert.equal((await as(B, 'select id from public.shares')).rows.length, 0);
  assert.equal((await as(A, 'update public.shares set revoked_at = now() returning id')).rows.length, 1);
});

test('nobody can change the slug on a share', async () => {
  await assert.rejects(as(A, `update public.shares set public_slug = 'zzzzzzzzzzzzzzzz'`), /permission denied/);
});

test('people can set their own photo and On this day switch, not anyone else\'s', async () => {
  await as(A, `update public.profiles set avatar_path = $1, notify_on_this_day = false where id = $2`, [`${A}/me.jpg`, A]);
  const own = await db.query<{ avatar_path: string; notify_on_this_day: boolean }>('select avatar_path, notify_on_this_day from public.profiles where id = $1', [A]);
  assert.deepEqual(own.rows, [{ avatar_path: `${A}/me.jpg`, notify_on_this_day: false }]);
  const other = await as(A, `update public.profiles set avatar_path = 'x' where id = $1 returning id`, [B]);
  assert.equal(other.rows.length, 0);
});

test('profile photos are private and limited to your own folder', async () => {
  await as(A, `insert into storage.objects (bucket_id, name) values ('avatars', $1)`, [`${A}/me.jpg`]);
  await assert.rejects(as(B, `insert into storage.objects (bucket_id, name) values ('avatars', $1)`, [`${A}/planted.jpg`]), /row-level security/);
  assert.equal((await as(B, `select id from storage.objects where bucket_id = 'avatars'`)).rows.length, 0);
  const { rows } = await db.query<{ public: boolean }>(`select public from storage.buckets where id = 'avatars'`);
  assert.equal(rows[0].public, false);
});

test('photos are limited to your own folder', async () => {
  await as(A, `insert into storage.objects (bucket_id, name) values ('entry-photos', $1)`, [`${A}/win.jpg`]);
  await assert.rejects(as(B, `insert into storage.objects (bucket_id, name) values ('entry-photos', $1)`, [`${A}/planted.jpg`]), /row-level security/);
  assert.equal((await as(B, 'select id from storage.objects')).rows.length, 0);
  const { rows } = await db.query<{ public: boolean }>(`select public from storage.buckets where id = 'entry-photos'`);
  assert.equal(rows[0].public, false);
});

test('the owner-only sign-in list is closed to visitors and signed-in people', async () => {
  await db.query(`insert into auth.audit_log_entries (payload, ip_address) values ('{"action":"login","actor_username":"a@example.com","traits":{"provider":"google"}}', '1.2.3.4')`);
  const { rows } = await db.query<{ event: string; method: string }>('select event, method from admin.sign_ins');
  assert.deepEqual(rows, [{ event: 'signed in', method: 'google' }]);
  await assert.rejects(as(null, 'select * from admin.sign_ins'), /permission denied/);
  await assert.rejects(as(A, 'select * from admin.sign_ins'), /permission denied/);
});

test('wins start on the wall and can be taken off without deleting them', async () => {
  const { rows: before } = await as<{ on_wall: boolean }>(A, 'select on_wall from public.entries where id = $1', [ENTRY_A]);
  assert.deepEqual(before, [{ on_wall: true }]);
  await as(A, 'update public.entries set on_wall = false where id = $1', [ENTRY_A]);
  const { rows: after } = await as<{ on_wall: boolean }>(A, 'select on_wall from public.entries where id = $1', [ENTRY_A]);
  assert.deepEqual(after, [{ on_wall: false }]);
  await as(A, 'update public.entries set on_wall = true where id = $1', [ENTRY_A]);
});
