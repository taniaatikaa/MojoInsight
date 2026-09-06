"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PengurusAvatar } from "@/components/pengurus-avatar";
import { deletePengurus } from "@/app/admin/(protected)/struktur-actions";
import { PengurusFormModal } from "./pengurus-form-modal";

export type PengurusAdminRow = {
  id: string;
  nama: string;
  jabatan: string;
  fotoUrl: string | null;
};

function IconPlus() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bg-alt text-brand-muted">
        <IconUsers />
      </div>
      <p className="text-[15px] font-bold text-brand-ink">Belum ada data pengurus</p>
      <p className="max-w-[320px] text-[13px] leading-relaxed text-brand-muted">
        Tambahkan profil Kepala Dukuh dan Ketua RT agar tampil di halaman Struktur Pengurus publik.
      </p>
    </div>
  );
}

export function PengurusTable({ rows }: { rows: PengurusAdminRow[] }) {
  const router = useRouter();
  const [modalState, setModalState] = useState<{ mode: "add" } | { mode: "edit"; row: PengurusAdminRow } | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSaved() {
    setModalState(null);
    router.refresh();
  }

  function handleDelete(row: PengurusAdminRow) {
    if (!confirm(`Hapus data pengurus "${row.nama}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setErrorMessage("");
    setDeletingId(row.id);
    startTransition(async () => {
      const result = await deletePengurus(row.id);
      setDeletingId(null);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="mb-1 text-xl font-extrabold tracking-tight text-brand-ink sm:text-2xl">
            Struktur Pengurus
          </h1>
          <p className="text-[13px] text-brand-muted">Kelola profil Kepala Dukuh, Ketua RW, dan Ketua RT 1-6.</p>
        </div>

        <button
          type="button"
          onClick={() => setModalState({ mode: "add" })}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-[10px] bg-brand-green px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_12px_rgba(0,70,23,0.25)] transition-colors hover:bg-brand-green-hover"
        >
          <IconPlus />
          Tambah Pengurus
        </button>
      </div>

      {errorMessage && (
        <div role="alert" className="mb-4 rounded-xl border border-brand-gold bg-[#FFFBEB] px-3.5 py-3 text-[13px] font-semibold text-[#92400E]">
          {errorMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-[0_2px_16px_rgba(0,70,23,0.06)]">
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-brand-border bg-[#F5F7F2]">
                    <th className="w-16 px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">Foto</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">Nama</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">Jabatan</th>
                    <th className="w-28 px-4 py-3 text-center text-[11px] font-bold tracking-wider text-brand-muted uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.id} className="border-b border-brand-bg-alt last:border-0 hover:bg-[#FAFCF8]">
                      <td className="px-4 py-3">
                        <PengurusAvatar nama={row.nama} fotoUrl={row.fotoUrl} colorIndex={idx} size={40} />
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-brand-ink">{row.nama}</td>
                      <td className="px-4 py-3.5 text-sm text-brand-muted">{row.jabatan}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setModalState({ mode: "edit", row })}
                            aria-label={`Edit data pengurus ${row.nama}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-brand-green hover:bg-brand-bg-alt hover:text-brand-green"
                          >
                            <IconEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(row)}
                            disabled={isPending && deletingId === row.id}
                            aria-label={`Hapus data pengurus ${row.nama}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2.5 p-3 md:hidden">
              {rows.map((row, idx) => (
                <div key={row.id} className="flex items-center gap-3 rounded-[14px] border border-brand-border bg-white p-3.5 shadow-[0_1px_6px_rgba(0,70,23,0.05)]">
                  <PengurusAvatar nama={row.nama} fotoUrl={row.fotoUrl} colorIndex={idx} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-brand-ink">{row.nama}</p>
                    <p className="truncate text-xs text-brand-muted">{row.jabatan}</p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setModalState({ mode: "edit", row })}
                      aria-label={`Edit data pengurus ${row.nama}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-brand-green hover:bg-brand-bg-alt hover:text-brand-green"
                    >
                      <IconEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      disabled={isPending && deletingId === row.id}
                      aria-label={`Hapus data pengurus ${row.nama}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {modalState && (
        <PengurusFormModal
          key={modalState.mode === "edit" ? modalState.row.id : "add"}
          mode={modalState.mode}
          initial={modalState.mode === "edit" ? modalState.row : undefined}
          onClose={() => setModalState(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
