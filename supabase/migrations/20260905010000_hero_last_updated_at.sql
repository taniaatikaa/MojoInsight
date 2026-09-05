-- Milestone 11: hero section shows when the underlying data was last touched,
-- taking the latest timestamp across the 3 tables an admin can mutate.
drop view if exists public.v_hero_stats;

create view public.v_hero_stats
with (security_invoker = false) as
select
  (select count(*) from public.keluarga) as total_kk,
  (select count(*) from public.anggota_keluarga where status_kependudukan = 'Aktif') as total_jiwa,
  (select count(*) from public.mutasi_log
     where jenis_mutasi = 'Lahir'
     and date_part('year', tanggal_kejadian) = date_part('year', current_date)) as kelahiran_tahun_berjalan,
  (select count(*) from public.mutasi_log
     where jenis_mutasi = 'Meninggal'
     and date_part('year', tanggal_kejadian) = date_part('year', current_date)) as kematian_tahun_berjalan,
  greatest(
    (select max(updated_at) from public.keluarga),
    (select max(updated_at) from public.anggota_keluarga),
    (select max(created_at) from public.mutasi_log)
  ) as last_updated_at;

grant select on public.v_hero_stats to anon, authenticated;
