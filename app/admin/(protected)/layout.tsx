import { AdminShell } from "@/components/admin/admin-shell";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const [{ data: userData }, { data: isSuperAdmin }, { data: rtId }, { data: isAccountManager }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("is_super_admin"),
    supabase.rpc("admin_rt_id"),
    supabase.rpc("is_account_manager"),
  ]);

  return (
    <AdminShell
      email={userData.user?.email ?? ""}
      isSuperAdmin={!!isSuperAdmin}
      rtId={rtId ?? null}
      isAccountManager={!!isAccountManager}
    >
      {children}
    </AdminShell>
  );
}
