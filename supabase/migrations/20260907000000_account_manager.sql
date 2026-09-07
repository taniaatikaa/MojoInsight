-- Account management: a small subset of whitelisted admins (Hidayat & Tania)
-- can CRUD other admin_users rows from within the app, instead of the
-- Supabase table editor only. Assignment of this flag itself stays manual
-- via the table editor, same as the original whitelist/role/rt_id pattern.
alter table public.admin_users add column is_account_manager boolean not null default false;
alter table public.admin_users add column auth_user_id uuid unique;

create function public.is_account_manager()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and is_account_manager = true
  );
$$;

create policy admin_users_select_manager on public.admin_users for select
  using (public.is_account_manager());
create policy admin_users_insert_manager on public.admin_users for insert
  with check (public.is_account_manager());
create policy admin_users_update_manager on public.admin_users for update
  using (public.is_account_manager())
  with check (public.is_account_manager());
-- Account managers can revoke any regular admin, but never delete another
-- account manager's row (covers both "each other" and themselves).
create policy admin_users_delete_manager on public.admin_users for delete
  using (public.is_account_manager() and not is_account_manager);
