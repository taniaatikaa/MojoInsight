-- Enums
create type public.jenis_kelamin as enum ('L', 'P');
create type public.status_kependudukan as enum ('Aktif', 'Meninggal', 'Pindah');
create type public.jenis_mutasi as enum ('Lahir', 'Meninggal', 'Pindah Masuk', 'Pindah Keluar');
create type public.admin_role as enum ('super_admin', 'rt_admin');

-- rt: reference table for the 6 RT, also FK target + map coordinates
create table public.rt (
  id smallint primary key check (id between 1 and 6),
  nama text not null,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

-- admin_users: single whitelist source of truth (Google OAuth or manual login)
create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role public.admin_role not null,
  rt_id smallint references public.rt (id),
  created_at timestamptz not null default now(),
  constraint rt_admin_requires_rt check (role <> 'rt_admin' or rt_id is not null)
);
create index admin_users_email_lower_idx on public.admin_users (lower(email));

-- keluarga: no_kk is deliberately not unique (real "KK Tempel" case in RT-04 data)
create table public.keluarga (
  id uuid primary key default gen_random_uuid(),
  no_kk text,
  rt_id smallint not null references public.rt (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index keluarga_rt_id_idx on public.keluarga (rt_id);
create index keluarga_no_kk_idx on public.keluarga (no_kk);

create table public.anggota_keluarga (
  id uuid primary key default gen_random_uuid(),
  keluarga_id uuid not null references public.keluarga (id) on delete cascade,
  nama text not null,
  status_hubungan text not null,
  jenis_kelamin public.jenis_kelamin not null,
  tanggal_lahir date not null,
  pekerjaan text,
  status_kependudukan public.status_kependudukan not null default 'Aktif',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index anggota_keluarga_keluarga_id_idx on public.anggota_keluarga (keluarga_id);
create index anggota_keluarga_status_idx on public.anggota_keluarga (status_kependudukan);

-- mutasi_log: append-only (see rls.sql — no update/delete policy)
create table public.mutasi_log (
  id uuid primary key default gen_random_uuid(),
  anggota_id uuid not null references public.anggota_keluarga (id) on delete cascade,
  jenis_mutasi public.jenis_mutasi not null,
  tanggal_kejadian date not null,
  keterangan text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);
create index mutasi_log_jenis_tanggal_idx on public.mutasi_log (jenis_mutasi, tanggal_kejadian);
create index mutasi_log_anggota_id_idx on public.mutasi_log (anggota_id);

create table public.pengurus (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jabatan text not null,
  foto_path text,
  urutan smallint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at maintenance
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.keluarga
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.anggota_keluarga
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.pengurus
  for each row execute function public.set_updated_at();

-- mutasi_log -> anggota_keluarga.status_kependudukan sync.
-- Only applies when the new row is the latest (or tied-latest, most-recent-insert-wins)
-- tanggal_kejadian for that member, so back-dated corrections don't clobber a newer status.
create function public.sync_status_kependudukan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  latest_date date;
begin
  select max(tanggal_kejadian) into latest_date
  from public.mutasi_log
  where anggota_id = new.anggota_id;

  if new.tanggal_kejadian >= latest_date then
    update public.anggota_keluarga
    set status_kependudukan = case new.jenis_mutasi
      when 'Lahir' then 'Aktif'::public.status_kependudukan
      when 'Pindah Masuk' then 'Aktif'::public.status_kependudukan
      when 'Meninggal' then 'Meninggal'::public.status_kependudukan
      when 'Pindah Keluar' then 'Pindah'::public.status_kependudukan
    end
    where id = new.anggota_id;
  end if;

  return new;
end;
$$;

create trigger sync_status_kependudukan
  after insert on public.mutasi_log
  for each row execute function public.sync_status_kependudukan();
