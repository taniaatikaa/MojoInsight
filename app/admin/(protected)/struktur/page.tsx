import type { Metadata } from "next";
import { PengurusTable, type PengurusAdminRow } from "@/components/admin/pengurus-table";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Struktur Pengurus — Admin MojoInsight",
};

type PengurusQueryRow = {
  id: string;
  nama: string;
  jabatan: string;
  foto_path: string | null;
  urutan: number | null;
};

export default async function AdminStrukturPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("pengurus")
    .select("id, nama, jabatan, foto_path, urutan")
    .order("urutan", { ascending: true, nullsFirst: false })
    .returns<PengurusQueryRow[]>();

  const rows: PengurusAdminRow[] = (data ?? []).map((p) => ({
    id: p.id,
    nama: p.nama,
    jabatan: p.jabatan,
    urutan: p.urutan,
    fotoUrl: p.foto_path ? supabase.storage.from("pengurus-photos").getPublicUrl(p.foto_path).data.publicUrl : null,
  }));

  return <PengurusTable rows={rows} />;
}
