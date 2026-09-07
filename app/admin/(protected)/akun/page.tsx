import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AkunTable, type AkunRow } from "@/components/admin/akun-table";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Kelola Akun Admin — Admin MojoInsight",
};

export default async function AdminAkunPage() {
  const supabase = await createClient();

  const { data: isManager } = await supabase.rpc("is_account_manager");
  if (!isManager) redirect("/admin");

  const { data } = await supabase
    .from("admin_users")
    .select("id, email, role, rt_id, is_account_manager")
    .order("created_at", { ascending: true })
    .returns<AkunRow[]>();

  return <AkunTable rows={data ?? []} />;
}
