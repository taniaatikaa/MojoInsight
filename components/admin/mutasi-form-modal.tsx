"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { catatMutasi } from "@/app/admin/(protected)/mutasi-actions";
import { JENIS_MUTASI_LIST, type JenisMutasi } from "@/lib/jenis-mutasi-list";
import type { AnggotaOption } from "./mutasi-table";
import { SearchableCombobox } from "./searchable-combobox";

function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function todayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function JenisMutasiPicker({ value, onChange }: { value: JenisMutasi | ""; onChange: (v: JenisMutasi) => void }) {
  return (
    <div role="group" aria-label="Jenis mutasi" className="grid grid-cols-2 gap-2">
      {JENIS_MUTASI_LIST.map((j) => (
        <button
          key={j}
          type="button"
          onClick={() => onChange(j)}
          aria-pressed={value === j}
          className={`rounded-[10px] border-[1.5px] py-2.5 text-xs font-semibold transition-colors ${
            value === j
              ? "border-brand-green bg-brand-green text-white"
              : "border-brand-border bg-white text-brand-muted hover:bg-brand-bg-alt"
          }`}
        >
          {j}
        </button>
      ))}
    </div>
  );
}

export function MutasiFormModal({
  anggotaOptions,
  onClose,
  onSaved,
}: {
  anggotaOptions: AnggotaOption[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [anggotaLabel, setAnggotaLabel] = useState("");
  const [jenisMutasi, setJenisMutasi] = useState<JenisMutasi | "">("");
  const [tanggalKejadian, setTanggalKejadian] = useState(todayIso());
  const [keterangan, setKeterangan] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const { options, labelToId } = useMemo(() => {
    const map = new Map<string, string>();
    const labels = anggotaOptions.map((a) => {
      const label = `${a.nama} — RT ${String(a.rtId).padStart(2, "0")} — No. KK ${a.noKk || "—"}`;
      map.set(label, a.id);
      return label;
    });
    return { options: labels, labelToId: map };
  }, [anggotaOptions]);

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

    const anggotaId = labelToId.get(anggotaLabel);
    if (!anggotaId) {
      setErrorMessage("Pilih anggota dari daftar.");
      return;
    }
    if (!jenisMutasi) {
      setErrorMessage("Pilih jenis mutasi.");
      return;
    }
    if (!tanggalKejadian) {
      setErrorMessage("Isi tanggal kejadian.");
      return;
    }

    startTransition(async () => {
      const result = await catatMutasi({
        anggotaId,
        jenisMutasi,
        tanggalKejadian,
        keterangan: keterangan.trim() || null,
      });
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      onSaved();
    });
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[rgba(10,24,10,0.52)] p-4 backdrop-blur-[3px] sm:p-6"
      onClick={onClose}
      aria-label="Tutup modal"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Catat Mutasi Baru"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22),0_6px_24px_rgba(0,70,23,0.12)]"
      >
        <div className="absolute top-0 right-0 left-0 h-[3px] bg-[linear-gradient(90deg,#004617_0%,#95C658_55%,#FCC860_100%)]" />

        <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-brand-bg-alt px-6 pt-6 pb-4">
          <div>
            <span className="mb-1.5 inline-block rounded-full bg-brand-bg-alt px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-brand-green uppercase">
              Catatan Baru
            </span>
            <h2 className="text-lg font-extrabold tracking-tight text-brand-ink sm:text-xl">Catat Mutasi Baru</h2>
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
            <FormField label="Anggota" required>
              <SearchableCombobox
                value={anggotaLabel}
                onChange={setAnggotaLabel}
                options={options}
                placeholder="Cari nama atau No. KK..."
                strict
                ariaLabel="Anggota"
              />
            </FormField>

            <FormField label="Jenis Mutasi" required>
              <JenisMutasiPicker value={jenisMutasi} onChange={setJenisMutasi} />
            </FormField>

            <FormField label="Tanggal Kejadian" required>
              <input
                type="date"
                value={tanggalKejadian}
                onChange={(e) => setTanggalKejadian(e.target.value)}
                className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
              />
            </FormField>

            <FormField label="Keterangan">
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Catatan tambahan (opsional)"
                rows={3}
                className="w-full resize-none rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
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
