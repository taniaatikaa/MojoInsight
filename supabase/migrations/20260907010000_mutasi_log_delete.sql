-- mutasi_log was originally append-only (see 20260904154040_rls.sql) so admins
-- couldn't accidentally destroy the audit trail behind the birth/death counters.
-- In practice a mishit "Catat Mutasi" needs a way to be undone, so we now allow
-- delete (still no update — corrections go through delete + re-add, keeping
-- every remaining row an honest record of what was actually submitted).
create policy mutasi_delete_admin on public.mutasi_log for delete
  using (exists (
    select 1 from public.anggota_keluarga a
    join public.keluarga k on k.id = a.keluarga_id
    where a.id = mutasi_log.anggota_id
    and (public.is_super_admin() or k.rt_id = public.admin_rt_id())
  ));

-- The insert-side trigger (sync_status_kependudukan) only fires on insert, so
-- deleting a row would otherwise leave status_kependudukan stale. This shares
-- the same latest-event-wins rule, tie-broken by created_at to match how ties
-- resolve on insert (last write wins).
create function public.recompute_status_kependudukan(p_anggota_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  latest_jenis public.jenis_mutasi;
begin
  select jenis_mutasi into latest_jenis
  from public.mutasi_log
  where anggota_id = p_anggota_id
  order by tanggal_kejadian desc, created_at desc
  limit 1;

  update public.anggota_keluarga
  set status_kependudukan = case latest_jenis
    when 'Lahir' then 'Aktif'::public.status_kependudukan
    when 'Pindah Masuk' then 'Aktif'::public.status_kependudukan
    when 'Meninggal' then 'Meninggal'::public.status_kependudukan
    when 'Pindah Keluar' then 'Pindah'::public.status_kependudukan
    else 'Aktif'::public.status_kependudukan
  end
  where id = p_anggota_id;
end;
$$;

create function public.sync_status_kependudukan_on_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.recompute_status_kependudukan(old.anggota_id);
  return old;
end;
$$;

create trigger sync_status_kependudukan_on_delete
  after delete on public.mutasi_log
  for each row execute function public.sync_status_kependudukan_on_delete();
