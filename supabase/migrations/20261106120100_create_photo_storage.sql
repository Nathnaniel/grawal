-- Photos live in a private bucket, one folder per person, and are served by
-- short-lived signed URLs. The upload screen comes later; the rules are set now.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('entry-photos', 'entry-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic']);

create policy "Read own photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'entry-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Add own photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'entry-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Replace own photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'entry-photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'entry-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Delete own photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'entry-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
