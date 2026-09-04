import type { Metadata } from "next";
import { StrukturPageContent, type PengurusRow } from "@/components/struktur-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Struktur Pengurus — MojoInsight",
};

export default async function StrukturPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("pengurus")
    .select("id, nama, jabatan, foto_path, urutan")
    .order("urutan", { ascending: true, nullsFirst: false });

  const pengurus: PengurusRow[] = (data ?? []).map((row) => ({
    id: row.id,
    nama: row.nama,
    jabatan: row.jabatan,
    urutan: row.urutan,
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
