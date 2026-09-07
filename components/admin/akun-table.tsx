"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAdminAccount, resetAdminPassword } from "@/app/admin/(protected)/akun-actions";
import { AkunFormModal } from "./akun-form-modal";
import { PasswordRevealModal } from "./password-reveal-modal";

export type AkunRow = {
  id: string;
  email: string;
  role: "super_admin" | "rt_admin";
  rt_id: number | null;
  is_account_manager: boolean;
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

function IconKey() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5l3 3L22 7l-3-3" />
    </svg>
  );
}

function RoleCell({ row }: { row: AkunRow }) {
  if (row.role === "super_admin") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-2.5 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap text-white uppercase">
        Super Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-2.5 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap text-brand-ink uppercase">
      Admin RT {String(row.rt_id ?? "-").padStart(2, "0")}
    </span>
  );
}

export function AkunTable({ rows }: { rows: AkunRow[] }) {
  const router = useRouter();
  const [modalState, setModalState] = useState<{ mode: "add" } | { mode: "edit"; row: AkunRow } | null>(null);
  const [revealPassword, setRevealPassword] = useState<{ email: string; password: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSaved(result?: { password?: string; email?: string }) {
    setModalState(null);
    router.refresh();
    if (result?.password && result.email) {
      setRevealPassword({ email: result.email, password: result.password });
    }
  }

  function handleResetPassword(row: AkunRow) {
    if (!confirm(`Reset kata sandi untuk "${row.email}"? Kata sandi lama langsung tidak berlaku.`)) return;
    setErrorMessage("");
    setBusyId(row.id);
    startTransition(async () => {
      const result = await resetAdminPassword(row.id);
      setBusyId(null);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      if (result.password) setRevealPassword({ email: row.email, password: result.password });
    });
  }

  function handleDelete(row: AkunRow) {
    if (!confirm(`Hapus akun "${row.email}"? Akun ini tidak akan bisa masuk /admin lagi. Tindakan ini tidak bisa dibatalkan.`)) return;
    setErrorMessage("");
    setBusyId(row.id);
    startTransition(async () => {
      const result = await deleteAdminAccount(row.id);
      setBusyId(null);
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
            Kelola Akun Admin
          </h1>
          <p className="text-[13px] text-brand-muted">Tambah, ubah, atau cabut akses akun yang bisa masuk panel admin.</p>
        </div>

        <button
          type="button"
          onClick={() => setModalState({ mode: "add" })}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-[10px] bg-brand-green px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_12px_rgba(0,70,23,0.25)] transition-colors hover:bg-brand-green-hover"
        >
          <IconPlus />
          Tambah Akun
        </button>
      </div>

      {errorMessage && (
        <div role="alert" className="mb-4 rounded-xl border border-brand-gold bg-[#FFFBEB] px-3.5 py-3 text-[13px] font-semibold text-[#92400E]">
          {errorMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-[0_2px_16px_rgba(0,70,23,0.06)]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-brand-border bg-[#F5F7F2]">
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">Email</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">Peran</th>
                <th className="w-32 px-4 py-3 text-center text-[11px] font-bold tracking-wider text-brand-muted uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-brand-bg-alt last:border-0 hover:bg-[#FAFCF8]">
                  <td className="px-4 py-3.5 text-sm font-semibold text-brand-ink">
                    {row.email}
                    {row.is_account_manager && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-brand-bg-alt px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-green uppercase">
                        Pengelola Akun
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <RoleCell row={row} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModalState({ mode: "edit", row })}
                        aria-label={`Edit akun ${row.email}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-brand-green hover:bg-brand-bg-alt hover:text-brand-green"
                      >
                        <IconEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetPassword(row)}
                        disabled={isPending && busyId === row.id}
                        aria-label={`Reset kata sandi ${row.email}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-brand-green hover:bg-brand-bg-alt hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <IconKey />
                      </button>
                      {!row.is_account_manager && (
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          disabled={isPending && busyId === row.id}
                          aria-label={`Hapus akun ${row.email}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2.5 p-3 md:hidden">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 rounded-[14px] border border-brand-border bg-white p-3.5 shadow-[0_1px_6px_rgba(0,70,23,0.05)]">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-brand-ink">{row.email}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <RoleCell row={row} />
                  {row.is_account_manager && (
                    <span className="inline-flex items-center rounded-full bg-brand-bg-alt px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand-green uppercase">
                      Pengelola Akun
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setModalState({ mode: "edit", row })}
                  aria-label={`Edit akun ${row.email}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-brand-green hover:bg-brand-bg-alt hover:text-brand-green"
                >
                  <IconEdit />
                </button>
                <button
                  type="button"
                  onClick={() => handleResetPassword(row)}
                  disabled={isPending && busyId === row.id}
                  aria-label={`Reset kata sandi ${row.email}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-brand-green hover:bg-brand-bg-alt hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IconKey />
                </button>
                {!row.is_account_manager && (
                  <button
                    type="button"
                    onClick={() => handleDelete(row)}
                    disabled={isPending && busyId === row.id}
                    aria-label={`Hapus akun ${row.email}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <IconTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalState && (
        <AkunFormModal
          key={modalState.mode === "edit" ? modalState.row.id : "add"}
          mode={modalState.mode}
          initial={modalState.mode === "edit" ? modalState.row : undefined}
          onClose={() => setModalState(null)}
          onSaved={handleSaved}
        />
      )}

      {revealPassword && (
        <PasswordRevealModal
          email={revealPassword.email}
          password={revealPassword.password}
          onClose={() => setRevealPassword(null)}
        />
      )}
    </div>
  );
}
