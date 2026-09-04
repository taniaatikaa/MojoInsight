import type { Metadata } from "next";
import { MutasiTable, type AnggotaOption, type MutasiRow } from "@/components/admin/mutasi-table";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Log Mutasi — Admin MojoInsight",
};

type MutasiQueryRow = {
  id: string;
  jenis_mutasi: MutasiRow["jenisMutasi"];
  tanggal_kejadian: string;
  keterangan: string | null;
  anggota_keluarga: {
    nama: string;
    keluarga: { no_kk: string | null; rt_id: number };
  } | null;
};

type AnggotaQueryRow = {
  id: string;
  nama: string;
  status_kependudukan: "Aktif" | "Meninggal" | "Pindah";
  keluarga: { no_kk: string | null; rt_id: number };
};

export default async function AdminMutasiPage() {
  const supabase = await createClient();

  const [{ data: mutasiData }, { data: anggotaData }, { data: isSuperAdmin }, { data: rtId }] = await Promise.all([
    supabase
      .from("mutasi_log")
      .select("id, jenis_mutasi, tanggal_kejadian, keterangan, anggota_keluarga(nama, keluarga(no_kk, rt_id))")
      .order("tanggal_kejadian", { ascending: false })
      .order("created_at", { ascending: false })
      .returns<MutasiQueryRow[]>(),
    supabase
      .from("anggota_keluarga")
      .select("id, nama, status_kependudukan, keluarga(no_kk, rt_id)")
      .order("nama")
      .returns<AnggotaQueryRow[]>(),
    supabase.rpc("is_super_admin"),
    supabase.rpc("admin_rt_id"),
  ]);

  const rows: MutasiRow[] = (mutasiData ?? [])
    .filter((m) => m.anggota_keluarga)
    .map((m) => ({
      id: m.id,
      jenisMutasi: m.jenis_mutasi,
      tanggalKejadian: m.tanggal_kejadian,
      keterangan: m.keterangan,
      namaAnggota: m.anggota_keluarga!.nama,
      noKk: m.anggota_keluarga!.keluarga.no_kk,
      rtId: m.anggota_keluarga!.keluarga.rt_id,
    }));

  const anggotaOptions: AnggotaOption[] = (anggotaData ?? []).map((a) => ({
    id: a.id,
    nama: a.nama,
    noKk: a.keluarga.no_kk,
    rtId: a.keluarga.rt_id,
    statusKependudukan: a.status_kependudukan,
  }));

  return (
    <MutasiTable rows={rows} anggotaOptions={anggotaOptions} isSuperAdmin={!!isSuperAdmin} rtId={rtId ?? null} />
  );
}
