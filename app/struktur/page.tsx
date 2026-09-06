import type { Metadata } from "next";
import { StrukturPageContent, type PengurusRow } from "@/components/struktur-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sortByJabatanHierarchy } from "@/lib/jabatan-list";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Struktur Pengurus — MojoInsight",
};

export default async function StrukturPage() {
  const supabase = await createClient();

  const { data } = await supabase.from("pengurus").select("id, nama, jabatan, foto_path, created_at");

  const sorted = sortByJabatanHierarchy(
    (data ?? []).map((row) => ({ ...row, createdAt: row.created_at as string })),
  );

  const pengurus: PengurusRow[] = sorted.map((row) => ({
    id: row.id,
    nama: row.nama,
    jabatan: row.jabatan,
    fotoUrl: row.foto_path
      ? supabase.storage.from("pengurus-photos").getPublicUrl(row.foto_path).data.publicUrl
      : null,
  }));

  return (
    <>
      <SiteHeader active="struktur" />
      <main className="flex-1">
        <StrukturPageContent pengurus={pengurus} />
      </main>
      <SiteFooter />
    </>
  );
}
