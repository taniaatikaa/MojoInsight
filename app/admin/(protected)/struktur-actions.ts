"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SavePengurusResult = { ok: true } | { ok: false; message: string };

const MAX_FOTO_BYTES = 3 * 1024 * 1024;
const BUCKET = "pengurus-photos";

export async function savePengurus(formData: FormData): Promise<SavePengurusResult> {
  const id = formData.get("id");
  const pengurusId = typeof id === "string" && id ? id : undefined;
  const nama = String(formData.get("nama") ?? "").trim();
  const jabatan = String(formData.get("jabatan") ?? "").trim();
  const urutanRaw = String(formData.get("urutan") ?? "").trim();
  const removeFoto = formData.get("removeFoto") === "true";
  const foto = formData.get("foto");

  if (!nama || !jabatan) {
    return { ok: false, message: "Nama dan Jabatan wajib diisi." };
  }

  let urutan: number | null = null;
  if (urutanRaw) {
    urutan = Number(urutanRaw);
    if (!Number.isFinite(urutan) || urutan < 0) {
      return { ok: false, message: "Urutan harus berupa angka." };
    }
  }

  const supabase = await createClient();

  let existingFotoPath: string | null = null;
  if (pengurusId) {
    const { data } = await supabase.from("pengurus").select("foto_path").eq("id", pengurusId).single();
    existingFotoPath = data?.foto_path ?? null;
  }

  let fotoPath = existingFotoPath;

  if (foto instanceof File && foto.size > 0) {
    if (!foto.type.startsWith("image/")) {
      return { ok: false, message: "File foto harus berupa gambar." };
    }
    if (foto.size > MAX_FOTO_BYTES) {
      return { ok: false, message: "Ukuran foto maksimal 3MB." };
    }

    const ext = foto.name.includes(".") ? foto.name.split(".").pop() : "jpg";
    const newPath = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newPath, foto, { contentType: foto.type });
    if (uploadError) return { ok: false, message: uploadError.message };

    if (existingFotoPath) await supabase.storage.from(BUCKET).remove([existingFotoPath]);
    fotoPath = newPath;
  } else if (removeFoto && existingFotoPath) {
    await supabase.storage.from(BUCKET).remove([existingFotoPath]);
    fotoPath = null;
  }

  const payload = { nama, jabatan, urutan, foto_path: fotoPath };
  const { error } = pengurusId
    ? await supabase.from("pengurus").update(payload).eq("id", pengurusId)
    : await supabase.from("pengurus").insert(payload);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/struktur");
  revalidatePath("/struktur");
  return { ok: true };
}

export async function deletePengurus(id: string): Promise<SavePengurusResult> {
  const supabase = await createClient();

  const { data } = await supabase.from("pengurus").select("foto_path").eq("id", id).single();

  const { error } = await supabase.from("pengurus").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  if (data?.foto_path) await supabase.storage.from(BUCKET).remove([data.foto_path]);

  revalidatePath("/admin/struktur");
  revalidatePath("/struktur");
  return { ok: true };
}
