insert into storage.buckets (id, name, public)
values ('pengurus-photos', 'pengurus-photos', true)
on conflict (id) do nothing;

create policy pengurus_photos_public_select
  on storage.objects for select
  using (bucket_id = 'pengurus-photos');

create policy pengurus_photos_admin_insert
  on storage.objects for insert
  with check (bucket_id = 'pengurus-photos' and public.is_admin());

create policy pengurus_photos_admin_update
  on storage.objects for update
  using (bucket_id = 'pengurus-photos' and public.is_admin())
  with check (bucket_id = 'pengurus-photos' and public.is_admin());

create policy pengurus_photos_admin_delete
  on storage.objects for delete
  using (bucket_id = 'pengurus-photos' and public.is_admin());
