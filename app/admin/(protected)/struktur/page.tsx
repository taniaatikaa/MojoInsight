import type { Metadata } from "next";
import { PengurusTable, type PengurusAdminRow } from "@/components/admin/pengurus-table";
import { sortByJabatanHierarchy } from "@/lib/jabatan-list";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Struktur Pengurus — Admin MojoInsight",
};

type PengurusQueryRow = {
  id: string;
  nama: string;
  jabatan: string;
  foto_path: string | null;
  created_at: string;
};

export default async function AdminStrukturPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("pengurus")
    .select("id, nama, jabatan, foto_path, created_at")
    .returns<PengurusQueryRow[]>();

  const sorted = sortByJabatanHierarchy(
    (data ?? []).map((p) => ({ ...p, createdAt: p.created_at })),
  );

  const rows: PengurusAdminRow[] = sorted.map((p) => ({
    id: p.id,
    nama: p.nama,
    jabatan: p.jabatan,
    fotoUrl: p.foto_path ? supabase.storage.from("pengurus-photos").getPublicUrl(p.foto_path).data.publicUrl : null,
  }));

  return <PengurusTable rows={rows} />;
}
