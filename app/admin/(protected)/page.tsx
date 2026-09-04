import type { Metadata } from "next";
import { KkTable, type KkRow } from "@/components/admin/kk-table";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Data KK — Admin MojoInsight",
};

type AnggotaRow = {
  id: string;
  nama: string;
  status_hubungan: string;
  jenis_kelamin: "L" | "P";
  tanggal_lahir: string;
  pekerjaan: string | null;
  status_kependudukan: "Aktif" | "Meninggal" | "Pindah";
};

type KeluargaRow = {
  id: string;
  no_kk: string | null;
  rt_id: number;
  anggota_keluarga: AnggotaRow[];
};

export default async function AdminKkPage() {
  const supabase = await createClient();

  const [{ data: keluargaData }, { data: isSuperAdmin }, { data: rtId }] = await Promise.all([
    supabase
      .from("keluarga")
      .select(
        "id, no_kk, rt_id, anggota_keluarga(id, nama, status_hubungan, jenis_kelamin, tanggal_lahir, pekerjaan, status_kependudukan)",
      )
      .order("rt_id")
      .order("no_kk")
      .returns<KeluargaRow[]>(),
    supabase.rpc("is_super_admin"),
    supabase.rpc("admin_rt_id"),
  ]);

  const rows: KkRow[] = (keluargaData ?? []).map((k) => {
    const aktif = k.anggota_keluarga.filter((a) => a.status_kependudukan === "Aktif");
    const kepala = aktif.find((a) => a.status_hubungan === "Kepala Keluarga") ?? aktif[0];
    return {
      id: k.id,
      noKk: k.no_kk,
      rtId: k.rt_id,
      namaKepala: kepala?.nama ?? "—",
      jumlahAnggota: aktif.length,
      anggota: aktif.map((a) => ({
        id: a.id,
        nama: a.nama,
        statusHubungan: a.status_hubungan,
        jenisKelamin: a.jenis_kelamin,
        tanggalLahir: a.tanggal_lahir,
        pekerjaan: a.pekerjaan,
      })),
    };
  });

  return <KkTable rows={rows} isSuperAdmin={!!isSuperAdmin} rtId={rtId ?? null} />;
}
