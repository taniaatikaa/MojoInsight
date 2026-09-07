"use client";

import { useEffect, useState, useTransition } from "react";
import { createAdminAccount, updateAdminAccount } from "@/app/admin/(protected)/akun-actions";
import type { AkunRow } from "./akun-table";

function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold tracking-wider text-brand-muted uppercase">
        {label}
        {required && <span className="ml-1 text-[#D97706]">*</span>}
      </label>
      {children}
    </div>
  );
}

export function AkunFormModal({
  mode,
  initial,
  onClose,
  onSaved,
}: {
  mode: "add" | "edit";
  initial?: AkunRow;
  onClose: () => void;
  onSaved: (result?: { password?: string; email?: string }) => void;
}) {
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState<"super_admin" | "rt_admin">(initial?.role ?? "rt_admin");
  const [rtId, setRtId] = useState(initial?.rt_id ?? 1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSave() {
    setErrorMessage("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes("@")) {
      setErrorMessage("Email tidak valid.");
      return;
    }

    const formData = new FormData();
    if (initial?.id) formData.set("id", initial.id);
    formData.set("email", trimmedEmail);
    formData.set("role", role);
    if (role === "rt_admin") formData.set("rtId", String(rtId));

    startTransition(async () => {
      const result = mode === "add" ? await createAdminAccount(formData) : await updateAdminAccount(formData);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      onSaved(mode === "add" ? { password: result.password, email: trimmedEmail } : undefined);
    });
  }

  const title = mode === "add" ? "Tambah Akun Admin" : "Edit Akun Admin";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[rgba(10,24,10,0.52)] p-4 backdrop-blur-[3px] sm:p-6"
      onClick={onClose}
      aria-label="Tutup modal"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] w-full max-w-[440px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22),0_6px_24px_rgba(0,70,23,0.12)]"
      >
        <div className="absolute top-0 right-0 left-0 h-[3px] bg-[linear-gradient(90deg,#004617_0%,#95C658_55%,#FCC860_100%)]" />

        <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-brand-bg-alt px-6 pt-6 pb-4">
          <div>
            <span
              className={`mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                mode === "add" ? "bg-brand-bg-alt text-brand-green" : "bg-[#FEF9EC] text-[#92400E]"
              }`}
            >
              {mode === "add" ? "Tambah Baru" : "Edit Data"}
            </span>
            <h2 className="text-lg font-extrabold tracking-tight text-brand-ink sm:text-xl">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] border-[1.5px] border-brand-border text-brand-muted transition-colors hover:border-brand-lime hover:bg-brand-bg-alt"
          >
            <IconClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {errorMessage && (
            <div role="alert" className="mb-4 rounded-xl border border-brand-gold bg-[#FFFBEB] px-3.5 py-3 text-[13px] font-semibold text-[#92400E]">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-3.5">
            <FormField label="Email" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
              />
            </FormField>

            <FormField label="Peran" required>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("super_admin")}
                  className={`rounded-[10px] border-[1.5px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                    role === "super_admin"
                      ? "border-brand-green bg-brand-bg-alt text-brand-green"
                      : "border-brand-border text-brand-muted hover:border-brand-lime"
                  }`}
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole("rt_admin")}
                  className={`rounded-[10px] border-[1.5px] px-3 py-2.5 text-sm font-semibold transition-colors ${
                    role === "rt_admin"
                      ? "border-brand-green bg-brand-bg-alt text-brand-green"
                      : "border-brand-border text-brand-muted hover:border-brand-lime"
                  }`}
                >
                  Admin RT
                </button>
              </div>
            </FormField>

            {role === "rt_admin" && (
              <FormField label="Rukun Tetangga (RT)" required>
                <select
                  value={rtId}
                  onChange={(e) => setRtId(Number(e.target.value))}
                  aria-label="Rukun Tetangga (RT)"
                  className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm font-semibold text-brand-ink outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      RT {String(n).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

            {mode === "add" && (
              <p className="text-[11px] leading-relaxed text-brand-muted">
                Kata sandi awal dibuat otomatis dan ditampilkan sekali setelah akun tersimpan.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-end gap-2.5 border-t border-brand-bg-alt px-6 py-4 shadow-[0_-4px_16px_rgba(0,70,23,0.06)]">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-[10px] border-[1.5px] border-brand-border px-5 py-2.5 text-sm font-semibold text-brand-muted transition-colors hover:enabled:border-brand-lime hover:enabled:bg-[#FAFCF8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="rounded-[10px] bg-brand-green px-6 py-2.5 text-sm font-bold text-white shadow-[0_3px_12px_rgba(0,70,23,0.28)] transition-colors hover:enabled:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
