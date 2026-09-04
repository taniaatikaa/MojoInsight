-- Helper functions: security definer + stable, so a plain authenticated user
-- can evaluate whitelist membership without direct SELECT rights on admin_users.
create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create function public.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and role = 'super_admin'
  );
$$;

create function public.admin_rt_id()
returns smallint
language sql
security definer
stable
set search_path = public
as $$
  select rt_id from public.admin_users
  where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  limit 1;
$$;

alter table public.rt enable row level security;
alter table public.admin_users enable row level security;
alter table public.keluarga enable row level security;
alter table public.anggota_keluarga enable row level security;
alter table public.mutasi_log enable row level security;
alter table public.pengurus enable row level security;

-- rt: public reference data, super_admin-only writes
create policy rt_select_all on public.rt for select using (true);
create policy rt_write_super_admin on public.rt for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- admin_users: RLS enabled, zero policies = default deny via API.
-- Managed only via the Supabase table editor (matches existing decision).

-- keluarga: RT-scoped CRUD for whitelisted admins
create policy keluarga_select_admin on public.keluarga for select
  using (public.is_super_admin() or rt_id = public.admin_rt_id());
create policy keluarga_insert_admin on public.keluarga for insert
  with check (public.is_super_admin() or rt_id = public.admin_rt_id());
create policy keluarga_update_admin on public.keluarga for update
  using (public.is_super_admin() or rt_id = public.admin_rt_id())
  with check (public.is_super_admin() or rt_id = public.admin_rt_id());
create policy keluarga_delete_admin on public.keluarga for delete
  using (public.is_super_admin() or rt_id = public.admin_rt_id());

-- anggota_keluarga: same RT-scoping, joined via keluarga.rt_id
create policy anggota_select_admin on public.anggota_keluarga for select
  using (exists (
    select 1 from public.keluarga k
    where k.id = anggota_keluarga.keluarga_id
    and (public.is_super_admin() or k.rt_id = public.admin_rt_id())
  ));
create policy anggota_insert_admin on public.anggota_keluarga for insert
  with check (exists (
    select 1 from public.keluarga k
    where k.id = anggota_keluarga.keluarga_id
    and (public.is_super_admin() or k.rt_id = public.admin_rt_id())
  ));
create policy anggota_update_admin on public.anggota_keluarga for update
  using (exists (
    select 1 from public.keluarga k
    where k.id = anggota_keluarga.keluarga_id
    and (public.is_super_admin() or k.rt_id = public.admin_rt_id())
  ))
  with check (exists (
    select 1 from public.keluarga k
    where k.id = anggota_keluarga.keluarga_id
    and (public.is_super_admin() or k.rt_id = public.admin_rt_id())
  ));
create policy anggota_delete_admin on public.anggota_keluarga for delete
  using (exists (
    select 1 from public.keluarga k
    where k.id = anggota_keluarga.keluarga_id
    and (public.is_super_admin() or k.rt_id = public.admin_rt_id())
  ));

-- mutasi_log: same RT-scoping via anggota_keluarga -> keluarga.
-- INSERT + SELECT only, no update/delete policy = append-only log.
create policy mutasi_select_admin on public.mutasi_log for select
  using (exists (
    select 1 from public.anggota_keluarga a
    join public.keluarga k on k.id = a.keluarga_id
    where a.id = mutasi_log.anggota_id
    and (public.is_super_admin() or k.rt_id = public.admin_rt_id())
  ));
create policy mutasi_insert_admin on public.mutasi_log for insert
  with check (exists (
    select 1 from public.anggota_keluarga a
    join public.keluarga k on k.id = a.keluarga_id
    where a.id = mutasi_log.anggota_id
    and (public.is_super_admin() or k.rt_id = public.admin_rt_id())
  ));

-- pengurus: public profile page, any whitelisted admin can write (not RT-scoped)
create policy pengurus_select_all on public.pengurus for select using (true);
create policy pengurus_insert_admin on public.pengurus for insert
  with check (public.is_admin());
create policy pengurus_update_admin on public.pengurus for update
  using (public.is_admin())
  with check (public.is_admin());
create policy pengurus_delete_admin on public.pengurus for delete
  using (public.is_admin());
