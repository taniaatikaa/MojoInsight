-- Landing Page (Milestone 2) needs per-RT jiwa count alongside jumlah_kk
-- (RT selector cards + map popup both show both numbers).
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
