import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pengaturan Akun — Admin MojoInsight",
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  return (
    <div>
      <div className="mb-5">
        <h1 className="mb-1 text-xl font-extrabold tracking-tight text-brand-ink sm:text-2xl">
          Pengaturan Akun
        </h1>
        <p className="text-[13px] text-brand-muted">Kelola kata sandi akun admin kamu.</p>
      </div>

      <div className="max-w-[440px] rounded-2xl border border-brand-border bg-white p-6 shadow-[0_2px_16px_rgba(0,70,23,0.06)]">
        <p className="mb-4 text-[13px] text-brand-muted">
          Masuk sebagai <span className="font-bold text-brand-ink">{userData.user?.email}</span>
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
