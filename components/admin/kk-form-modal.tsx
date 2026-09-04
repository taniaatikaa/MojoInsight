"use client";

import { useEffect, useState, useTransition } from "react";
import { saveKeluarga, type SaveAnggotaInput } from "@/app/admin/(protected)/kk-actions";
import { HUBUNGAN_OPTIONS } from "@/lib/hubungan-list";
import { PEKERJAAN_LIST } from "@/lib/pekerjaan-list";
import type { AnggotaDetail, KkRow } from "./kk-table";
import { SearchableCombobox } from "./searchable-combobox";

let uidCounter = 0;
function nextUid() {
  uidCounter += 1;
  return `new-${uidCounter}`;
}

type FormAnggota = {
  uid: string;
  id?: string;
  nama: string;
  statusHubungan: string;
  jenisKelamin: "L" | "P";
  tanggalLahir: string;
  pekerjaan: string;
};

function toFormAnggota(a: AnggotaDetail): FormAnggota {
  return {
    uid: a.id,
    id: a.id,
    nama: a.nama,
    statusHubungan: a.statusHubungan,
    jenisKelamin: a.jenisKelamin,
    tanggalLahir: a.tanggalLahir,
    pekerjaan: a.pekerjaan ?? "",
  };
}

function makeDefaultAnggota(): FormAnggota {
  return { uid: nextUid(), nama: "", statusHubungan: "", jenisKelamin: "L", tanggalLahir: "", pekerjaan: "" };
}

function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function JkToggle({ value, onChange }: { value: "L" | "P"; onChange: (v: "L" | "P") => void }) {
  return (
    <div role="group" aria-label="Jenis kelamin" className="flex h-[38px] overflow-hidden rounded-[10px] border-[1.5px] border-brand-border">
      {(["L", "P"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={`flex-1 text-xs font-semibold transition-colors ${
            value === v ? "bg-brand-green text-white" : "bg-white text-brand-muted hover:bg-brand-bg-alt"
          }`}
        >
          {v === "L" ? "Laki-laki" : "Perempuan"}
        </button>
      ))}
    </div>
  );
}

function AnggotaRow({
  anggota,
  index,
  canDelete,
  onChange,
  onDelete,
}: {
  anggota: FormAnggota;
  index: number;
  canDelete: boolean;
  onChange: (partial: Partial<FormAnggota>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="mb-3 overflow-hidden rounded-[14px] border border-brand-border bg-[#FAFCF8]">
      <div className="flex items-center justify-between border-b border-brand-bg-alt px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-brand-bg-alt text-[11px] font-extrabold text-brand-muted">
            {index + 1}
          </div>
          <span className="text-xs font-bold text-[#3D5E3A]">{anggota.statusHubungan || "Anggota"}</span>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Hapus anggota ${index + 1}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            <IconTrash />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3.5 p-4 sm:grid-cols-2">
        <FormField label="Nama Lengkap" required>
          <input
            type="text"
            value={anggota.nama}
            onChange={(e) => onChange({ nama: e.target.value })}
            placeholder="Nama sesuai KTP"
            className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
          />
        </FormField>

        <FormField label="Status Hubungan" required>
          <SearchableCombobox
            value={anggota.statusHubungan}
            onChange={(v) => onChange({ statusHubungan: v })}
            options={HUBUNGAN_OPTIONS}
            placeholder="Cari atau ketik hubungan..."
            ariaLabel="Status hubungan"
          />
        </FormField>

        <FormField label="Jenis Kelamin" required>
          <JkToggle value={anggota.jenisKelamin} onChange={(v) => onChange({ jenisKelamin: v })} />
        </FormField>

        <FormField label="Tanggal Lahir" required>
          <input
            type="date"
            value={anggota.tanggalLahir}
            onChange={(e) => onChange({ tanggalLahir: e.target.value })}
            className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
          />
        </FormField>

        <FormField label="Pekerjaan" required>
          <SearchableCombobox
            value={anggota.pekerjaan}
            onChange={(v) => onChange({ pekerjaan: v })}
            options={PEKERJAAN_LIST}
            placeholder="Cari pekerjaan..."
            strict
            ariaLabel="Pekerjaan"
          />
        </FormField>
      </div>
    </div>
  );
}

export function KkFormModal({
  mode,
  lockedRtId,
  initial,
  onClose,
  onSaved,
}: {
  mode: "add" | "edit";
  lockedRtId: number | null;
  initial?: KkRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [noKk, setNoKk] = useState(initial?.noKk ?? "");
  const [rtId, setRtId] = useState(initial?.rtId ?? lockedRtId ?? 1);
  const [anggota, setAnggota] = useState<FormAnggota[]>(
    initial ? initial.anggota.map(toFormAnggota) : [makeDefaultAnggota()],
  );
  const [removedIds, setRemovedIds] = useState<string[]>([]);
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

  function updateAnggota(uid: string, partial: Partial<FormAnggota>) {
    setAnggota((rows) => rows.map((r) => (r.uid === uid ? { ...r, ...partial } : r)));
  }

  function addAnggota() {
    setAnggota((rows) => [...rows, makeDefaultAnggota()]);
  }

  function removeAnggota(uid: string, id?: string) {
    setAnggota((rows) => rows.filter((r) => r.uid !== uid));
    if (id) setRemovedIds((ids) => [...ids, id]);
  }

  function handleSave() {
    setErrorMessage("");

    if (anggota.some((a) => !a.nama.trim() || !a.statusHubungan.trim() || !a.tanggalLahir || !a.pekerjaan)) {
      setErrorMessage("Lengkapi semua field wajib pada setiap anggota.");
      return;
    }

    const payloadAnggota: SaveAnggotaInput[] = anggota.map((a) => ({
      id: a.id,
      nama: a.nama,
      statusHubungan: a.statusHubungan,
      jenisKelamin: a.jenisKelamin,
      tanggalLahir: a.tanggalLahir,
      pekerjaan: a.pekerjaan || null,
    }));

    startTransition(async () => {
      const result = await saveKeluarga({
        id: initial?.id,
        noKk: noKk.trim() || null,
        rtId,
        anggota: payloadAnggota,
        removedAnggotaIds: removedIds,
      });
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      onSaved();
    });
  }

  const title = mode === "add" ? "Tambah Kartu Keluarga Baru" : "Edit Kartu Keluarga";

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
        className="relative flex max-h-[88vh] w-full max-w-[820px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22),0_6px_24px_rgba(0,70,23,0.12)]"
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
            <p className="mt-0.5 text-xs text-brand-muted">{anggota.length} anggota keluarga</p>
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

          <p className="mb-3 text-[11px] font-bold tracking-wider text-brand-muted uppercase">1. Data Keluarga</p>
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-[14px] border border-brand-border bg-[#FAFCF8] p-4 sm:grid-cols-[2fr_1fr] sm:p-5">
            <FormField label="Nomor Kartu Keluarga">
              <input
                type="text"
                value={noKk}
                onChange={(e) => setNoKk(e.target.value.replace(/\D/g, "").slice(0, 16))}
                placeholder="cth. 3403021001012024"
                inputMode="numeric"
                className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm tracking-wide text-brand-ink tabular-nums outline-none transition-colors focus:border-brand-green"
              />
            </FormField>

            <FormField label="Rukun Tetangga (RT)" required>
              {lockedRtId ? (
                <div className="flex h-[42px] items-center rounded-[10px] border-[1.5px] border-brand-border bg-brand-bg-alt px-3 text-sm font-semibold text-brand-muted">
                  RT {String(lockedRtId).padStart(2, "0")}
                </div>
              ) : (
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
              )}
            </FormField>
          </div>

          <p className="mb-3 text-[11px] font-bold tracking-wider text-brand-muted uppercase">2. Anggota Keluarga</p>
          {anggota.map((a, i) => (
            <AnggotaRow
              key={a.uid}
              anggota={a}
              index={i}
              canDelete={anggota.length > 1}
              onChange={(partial) => updateAnggota(a.uid, partial)}
              onDelete={() => removeAnggota(a.uid, a.id)}
            />
          ))}

          <button
            type="button"
            onClick={addAnggota}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-brand-lime bg-[#FAFCF8] py-3 text-[13px] font-bold text-brand-green transition-colors hover:border-brand-green hover:bg-brand-bg-alt"
          >
            <IconPlus />
            Tambah Anggota
          </button>
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
