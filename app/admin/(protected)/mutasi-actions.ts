"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { JenisMutasi } from "@/lib/jenis-mutasi-list";

export type CatatMutasiInput = {
  anggotaId: string;
  jenisMutasi: JenisMutasi;
  tanggalKejadian: string;
  keterangan: string | null;
};

export type CatatMutasiResult = { ok: true } | { ok: false; message: string };

export async function catatMutasi(input: CatatMutasiInput): Promise<CatatMutasiResult> {
  if (!input.anggotaId || !input.jenisMutasi || !input.tanggalKejadian) {
    return { ok: false, message: "Lengkapi semua field wajib." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("mutasi_log").insert({
    anggota_id: input.anggotaId,
    jenis_mutasi: input.jenisMutasi,
    tanggal_kejadian: input.tanggalKejadian,
    keterangan: input.keterangan,
    created_by: user?.id ?? null,
  });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/mutasi");
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteMutasi(id: string): Promise<CatatMutasiResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("mutasi_log").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/mutasi");
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}
