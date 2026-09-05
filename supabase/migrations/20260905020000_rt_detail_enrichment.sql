-- Milestone 11: richer per-RT detail panel — age distribution, full pekerjaan
-- breakdown, jumlah pelajar, dan rasio L/P — semua dipecah per RT (bukan agregat RW).
drop view if exists public.v_rt_summary;

create view public.v_rt_summary
with (security_invoker = false) as
select
  r.id as rt_id,
  r.nama,
  r.latitude,
  r.longitude,
  count(distinct k.id) as jumlah_kk,
  count(distinct a.id) filter (where a.status_kependudukan = 'Aktif') as jumlah_jiwa,
  count(distinct a.id) filter (where a.status_kependudukan = 'Aktif' and a.jenis_kelamin = 'L') as jumlah_laki,
  count(distinct a.id) filter (where a.status_kependudukan = 'Aktif' and a.jenis_kelamin = 'P') as jumlah_perempuan,
  count(distinct a.id) filter (where a.status_kependudukan = 'Aktif' and a.pekerjaan = 'Pelajar/Mahasiswa') as jumlah_pelajar,
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
left join public.anggota_keluarga a on a.keluarga_id = k.id
group by r.id, r.nama, r.latitude, r.longitude;

grant select on public.v_rt_summary to anon, authenticated;

create view public.v_rt_age_bracket_distribution
with (security_invoker = false) as
select
  k.rt_id,
  case
    when age(a.tanggal_lahir) < interval '15 years' then '0-14'
    when age(a.tanggal_lahir) < interval '60 years' then '15-59'
    else '60+'
  end as bracket,
  count(*) as jumlah
from public.anggota_keluarga a
join public.keluarga k on k.id = a.keluarga_id
where a.status_kependudukan = 'Aktif'
group by k.rt_id, 2;

grant select on public.v_rt_age_bracket_distribution to anon, authenticated;

create view public.v_rt_pekerjaan_distribution
with (security_invoker = false) as
select k.rt_id, a.pekerjaan, count(*) as jumlah
from public.anggota_keluarga a
join public.keluarga k on k.id = a.keluarga_id
where a.status_kependudukan = 'Aktif' and a.pekerjaan is not null
group by k.rt_id, a.pekerjaan
order by k.rt_id, jumlah desc;

grant select on public.v_rt_pekerjaan_distribution to anon, authenticated;
