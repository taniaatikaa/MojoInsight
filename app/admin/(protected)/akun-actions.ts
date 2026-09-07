"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, generateRandomPassword } from "@/lib/supabase/admin";

export type AkunActionResult =
  | { ok: true; password?: string }
  | { ok: false; message: string };

async function requireAccountManager() {
  const supabase = await createClient();
  const { data: isManager } = await supabase.rpc("is_account_manager");
  return { supabase, isManager: !!isManager };
}

type ParsedInput =
  | { ok: false; error: string }
  | { ok: true; email: string; role: "super_admin" | "rt_admin"; rtId: number | null };

function parseInput(formData: FormData): ParsedInput {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");
  const rtIdRaw = formData.get("rtId");
  const rtId = role === "rt_admin" ? Number(rtIdRaw) : null;

  if (!email || !email.includes("@")) return { ok: false, error: "Email tidak valid." };
  if (role !== "super_admin" && role !== "rt_admin") return { ok: false, error: "Peran tidak valid." };
  if (role === "rt_admin" && (!rtId || rtId < 1 || rtId > 6)) {
    return { ok: false, error: "RT wajib dipilih untuk peran Admin RT." };
  }

  return { ok: true, email, role, rtId };
}

export async function createAdminAccount(formData: FormData): Promise<AkunActionResult> {
  const { isManager } = await requireAccountManager();
  if (!isManager) return { ok: false, message: "Tidak diizinkan." };

  const parsed = parseInput(formData);
  if (!parsed.ok) return { ok: false, message: parsed.error };
  const { email, role, rtId } = parsed;

  const adminClient = createAdminClient();
  const password = generateRandomPassword();

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError || !created.user) {
    return { ok: false, message: createError?.message ?? "Gagal membuat akun." };
  }

  const supabase = await createClient();
  const { error: insertError } = await supabase.from("admin_users").insert({
    email,
    role,
    rt_id: rtId,
    auth_user_id: created.user.id,
  });

  if (insertError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return { ok: false, message: insertError.message };
  }

  revalidatePath("/admin/akun");
  return { ok: true, password };
}

export async function updateAdminAccount(formData: FormData): Promise<AkunActionResult> {
  const { supabase, isManager } = await requireAccountManager();
  if (!isManager) return { ok: false, message: "Tidak diizinkan." };

  const id = String(formData.get("id") ?? "");
  const parsed = parseInput(formData);
  if (!id) return { ok: false, message: "Akun tidak ditemukan." };
  if (!parsed.ok) return { ok: false, message: parsed.error };
  const { email, role, rtId } = parsed;

  const { data: existing } = await supabase
    .from("admin_users")
    .select("email, auth_user_id")
    .eq("id", id)
    .single();
  if (!existing) return { ok: false, message: "Akun tidak ditemukan." };

  if (existing.email.toLowerCase() !== email && existing.auth_user_id) {
    const adminClient = createAdminClient();
    const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(existing.auth_user_id, {
      email,
      email_confirm: true,
    });
    if (authUpdateError) return { ok: false, message: authUpdateError.message };
  }

  const { error } = await supabase
    .from("admin_users")
    .update({ email, role, rt_id: rtId })
    .eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/akun");
  return { ok: true };
}

export async function resetAdminPassword(id: string): Promise<AkunActionResult> {
  const { supabase, isManager } = await requireAccountManager();
  if (!isManager) return { ok: false, message: "Tidak diizinkan." };

  const { data: existing } = await supabase
    .from("admin_users")
    .select("auth_user_id")
    .eq("id", id)
    .single();
  if (!existing?.auth_user_id) return { ok: false, message: "Akun tidak ditemukan." };

  const password = generateRandomPassword();
  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(existing.auth_user_id, { password });
  if (error) return { ok: false, message: error.message };

  return { ok: true, password };
}

export async function deleteAdminAccount(id: string): Promise<AkunActionResult> {
  const { supabase, isManager } = await requireAccountManager();
  if (!isManager) return { ok: false, message: "Tidak diizinkan." };

  const { data: existing } = await supabase
    .from("admin_users")
    .select("auth_user_id, is_account_manager")
    .eq("id", id)
    .single();
  if (!existing) return { ok: false, message: "Akun tidak ditemukan." };
  if (existing.is_account_manager) {
    return { ok: false, message: "Akun pengelola akun tidak bisa dihapus lewat sini." };
  }

  const { error } = await supabase.from("admin_users").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  if (existing.auth_user_id) {
    await createAdminClient().auth.admin.deleteUser(existing.auth_user_id);
  }

  revalidatePath("/admin/akun");
  return { ok: true };
}
