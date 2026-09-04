"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SaveAnggotaInput = {
  id?: string;
  nama: string;
  statusHubungan: string;
  jenisKelamin: "L" | "P";
  tanggalLahir: string;
  pekerjaan: string | null;
};

export type SaveKeluargaInput = {
  id?: string;
  noKk: string | null;
  rtId: number;
  anggota: SaveAnggotaInput[];
  removedAnggotaIds: string[];
};

export type SaveKeluargaResult = { ok: true } | { ok: false; message: string };

export async function saveKeluarga(input: SaveKeluargaInput): Promise<SaveKeluargaResult> {
  if (input.anggota.length === 0) {
    return { ok: false, message: "Minimal harus ada satu anggota keluarga." };
  }
  if (input.anggota.some((a) => !a.nama.trim() || !a.statusHubungan.trim() || !a.tanggalLahir || !a.pekerjaan)) {
    return { ok: false, message: "Lengkapi semua field wajib pada setiap anggota." };
  }

  const supabase = await createClient();
  let keluargaId = input.id;

  if (keluargaId) {
    const { error } = await supabase
      .from("keluarga")
      .update({ no_kk: input.noKk, rt_id: input.rtId })
      .eq("id", keluargaId);
    if (error) return { ok: false, message: error.message };
  } else {
    const { data, error } = await supabase
      .from("keluarga")
      .insert({ no_kk: input.noKk, rt_id: input.rtId })
      .select("id")
      .single();
    if (error || !data) return { ok: false, message: error?.message ?? "Gagal membuat data keluarga." };
    keluargaId = data.id;
  }

  if (input.removedAnggotaIds.length > 0) {
    const { error } = await supabase.from("anggota_keluarga").delete().in("id", input.removedAnggotaIds);
    if (error) {
      if (!input.id) await supabase.from("keluarga").delete().eq("id", keluargaId);
      return { ok: false, message: error.message };
    }
  }

  for (const a of input.anggota) {
    const payload = {
      keluarga_id: keluargaId,
      nama: a.nama.trim(),
      status_hubungan: a.statusHubungan.trim(),
      jenis_kelamin: a.jenisKelamin,
      tanggal_lahir: a.tanggalLahir,
      pekerjaan: a.pekerjaan,
    };
    const { error } = a.id
      ? await supabase.from("anggota_keluarga").update(payload).eq("id", a.id)
      : await supabase.from("anggota_keluarga").insert(payload);
    if (error) {
      if (!input.id) await supabase.from("keluarga").delete().eq("id", keluargaId);
      return { ok: false, message: error.message };
    }
  }

  revalidatePath("/admin");
  return { ok: true };
}
