"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { savePengurus } from "@/app/admin/(protected)/struktur-actions";
import { JABATAN_OPTIONS } from "@/lib/jabatan-list";
import { PengurusAvatar } from "@/components/pengurus-avatar";
import type { PengurusAdminRow } from "./pengurus-table";
import { SearchableCombobox } from "./searchable-combobox";

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

export function PengurusFormModal({
  mode,
  initial,
  onClose,
  onSaved,
}: {
  mode: "add" | "edit";
  initial?: PengurusAdminRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [jabatan, setJabatan] = useState(initial?.jabatan ?? "");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [removeFoto, setRemoveFoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const previewUrl = useMemo(() => (fotoFile ? URL.createObjectURL(fotoFile) : null), [fotoFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(file: File | null) {
    setFotoFile(file);
    if (file) setRemoveFoto(false);
  }

  function handleRemoveFoto() {
    setFotoFile(null);
    setRemoveFoto(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSave() {
    setErrorMessage("");

    if (!nama.trim() || !jabatan.trim()) {
      setErrorMessage("Nama dan Jabatan wajib diisi.");
      return;
    }

    const formData = new FormData();
    if (initial?.id) formData.set("id", initial.id);
    formData.set("nama", nama.trim());
    formData.set("jabatan", jabatan.trim());
    formData.set("removeFoto", String(removeFoto));
    if (fotoFile) formData.set("foto", fotoFile);

    startTransition(async () => {
      const result = await savePengurus(formData);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      onSaved();
    });
  }

  const title = mode === "add" ? "Tambah Pengurus Baru" : "Edit Data Pengurus";
  const currentFotoUrl = removeFoto ? null : (initial?.fotoUrl ?? null);

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
        className="relative flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22),0_6px_24px_rgba(0,70,23,0.12)]"
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
            <FormField label="Foto Profil">
              <div className="flex items-center gap-4">
                <PengurusAvatar nama={nama || "?"} fotoUrl={previewUrl ?? currentFotoUrl} colorIndex={0} size={64} />
                <div className="flex flex-col gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                    className="text-xs text-brand-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-bg-alt file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-green hover:file:bg-brand-border"
                  />
                  {(previewUrl || currentFotoUrl) && (
                    <button
                      type="button"
                      onClick={handleRemoveFoto}
                      className="self-start text-[11px] font-semibold text-red-600 hover:underline"
                    >
                      Hapus foto
                    </button>
                  )}
                  <p className="text-[11px] text-brand-muted">JPG/PNG, maks 3MB. Opsional — pakai avatar inisial jika kosong.</p>
                </div>
              </div>
            </FormField>

            <FormField label="Nama Lengkap" required>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama sesuai identitas resmi"
                className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
              />
            </FormField>

            <FormField label="Jabatan" required>
              <SearchableCombobox
                value={jabatan}
                onChange={setJabatan}
                options={JABATAN_OPTIONS}
                placeholder="Cari atau ketik jabatan..."
                ariaLabel="Jabatan"
              />
            </FormField>
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
