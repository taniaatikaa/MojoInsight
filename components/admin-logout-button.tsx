"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminLogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border-[1.5px] border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-green hover:text-brand-green"
    >
      Keluar
    </button>
  );
}
