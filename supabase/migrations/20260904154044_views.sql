-- Public aggregate views: security_invoker = false (view owner's rights) so
-- anon/authenticated can read aggregates without direct access to the RLS-protected
-- base tables. None of these expose nama or tanggal_lahir.

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
     and date_part('year', tanggal_kejadian) = date_part('year', current_date)) as kematian_tahun_berjalan;

grant select on public.v_hero_stats to anon, authenticated;

create view public.v_age_bracket_distribution
with (security_invoker = false) as
select
  case
    when age(tanggal_lahir) < interval '15 years' then '0-14'
    when age(tanggal_lahir) < interval '60 years' then '15-59'
    else '60+'
  end as bracket,
  count(*) as jumlah
from public.anggota_keluarga
where status_kependudukan = 'Aktif'
group by 1;

grant select on public.v_age_bracket_distribution to anon, authenticated;

create view public.v_pekerjaan_distribution
with (security_invoker = false) as
select pekerjaan, count(*) as jumlah
from public.anggota_keluarga
where status_kependudukan = 'Aktif' and pekerjaan is not null
group by pekerjaan
order by jumlah desc;

grant select on public.v_pekerjaan_distribution to anon, authenticated;

create view public.v_rt_summary
with (security_invoker = false) as
select
  r.id as rt_id,
  r.nama,
  r.latitude,
  r.longitude,
  count(distinct k.id) as jumlah_kk,
  (
    select a2.pekerjaan
    from public.anggota_keluarga a2
    join public.keluarga k2 on k2.id = a2.keluarga_id
    where k2.rt_id = r.id and a2.status_kependudukan = 'Aktif' and a2.pekerjaan is not null
    group by a2.pekerjaan
    order by count(*) desc
    limit 1
  ) as pekerjaan_dominan
from public.rt r
left join public.keluarga k on k.rt_id = r.id
group by r.id, r.nama, r.latitude, r.longitude;

grant select on public.v_rt_summary to anon, authenticated;
