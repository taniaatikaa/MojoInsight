import type { Metadata } from "next";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard Admin — MojoInsight",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: userData }, { data: isSuperAdmin }, { data: rtId }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("is_super_admin"),
    supabase.rpc("admin_rt_id"),
  ]);

  const role = isSuperAdmin ? "Super Admin" : `RT Admin — RT ${rtId}`;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div>
        <p className="mb-1 text-xs font-bold tracking-[0.18em] text-brand-muted uppercase">Dashboard Admin</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-ink">
          Halo, {userData.user?.email}
        </h1>
        <p className="mt-1 text-sm text-brand-muted">{role}</p>
      </div>

      <div className="rounded-2xl border border-dashed border-brand-border bg-white px-6 py-8 text-sm text-brand-muted">
        Login admin berhasil. Dashboard/tabel data KK dibangun di Milestone 5.
      </div>

      <AdminLogoutButton />
    </div>
  );
}
