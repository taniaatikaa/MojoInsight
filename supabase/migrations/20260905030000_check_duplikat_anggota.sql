-- Milestone 11: live duplicate warning (nama+tanggal_lahir) in the KK form.
-- security definer so an rt_admin can get a cross-RT signal without RLS
-- exposing other RTs' raw rows directly; gated by is_admin() so a non-whitelisted
-- authenticated caller always gets false.
create function public.check_duplikat_anggota(
  p_nama text,
  p_tanggal_lahir date,
  p_exclude_id uuid default null
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select case
    when not public.is_admin() then false
    else exists (
      select 1 from public.anggota_keluarga
      where lower(nama) = lower(p_nama)
      and tanggal_lahir = p_tanggal_lahir
      and (p_exclude_id is null or id <> p_exclude_id)
    )
  end;
$$;
