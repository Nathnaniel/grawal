-- What the signed-in dashboard (Figma "Web app") needs.

-- Three more default categories from the create form.
insert into public.categories (name, colour) values
  ('Relationships', '#B4235E'),
  ('Travel', '#0E7C86'),
  ('Personal Growth', '#5B3FB0');

-- A profile photo, and the "On this day" switch in Settings. The weekly switch
-- uses the existing reminder_frequency ('weekly' or 'off').
alter table public.profiles
  add column avatar_path text check (char_length(avatar_path) <= 300),
  add column notify_on_this_day boolean not null default true;

grant update (avatar_path, notify_on_this_day) on public.profiles to authenticated;

-- Profile photos are private: one folder per person, served by signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/heic']);

create policy "Read own avatar" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Add own avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Replace own avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Delete own avatar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
