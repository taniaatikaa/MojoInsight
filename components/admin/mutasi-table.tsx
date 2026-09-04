"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { JenisMutasi } from "@/lib/jenis-mutasi-list";
import { MutasiFormModal } from "./mutasi-form-modal";

export type MutasiRow = {
  id: string;
  jenisMutasi: JenisMutasi;
  tanggalKejadian: string;
  keterangan: string | null;
  namaAnggota: string;
  noKk: string | null;
  rtId: number;
};

export type AnggotaOption = {
  id: string;
  nama: string;
  noKk: string | null;
  rtId: number;
  statusKependudukan: "Aktif" | "Meninggal" | "Pindah";
};

const PAGE_SIZE = 10;

const RT_BADGE_STYLES: Record<number, string> = {
  1: "bg-[#DCF0C4] text-[#2D6A00]",
  2: "bg-[#FEF5DC] text-[#8A5E00]",
  3: "bg-[#D8EEF9] text-[#0D5E8A]",
  4: "bg-[#E4F3D5] text-[#2D6A00]",
  5: "bg-[#FDF2CC] text-[#7A5000]",
  6: "bg-[#CCE9F8] text-[#0A508A]",
};

const JENIS_BADGE_STYLES: Record<JenisMutasi, string> = {
  Lahir: "bg-[#DCF0C4] text-[#2D6A00]",
  Meninggal: "bg-[#F3D9D9] text-[#8A2A2A]",
  "Pindah Masuk": "bg-[#D8EEF9] text-[#0D5E8A]",
  "Pindah Keluar": "bg-[#FEF5DC] text-[#8A5E00]",
};

function RtBadge({ rtId }: { rtId: number }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${
        RT_BADGE_STYLES[rtId] ?? "bg-brand-bg-alt text-brand-muted"
      }`}
    >
      RT {String(rtId).padStart(2, "0")}
    </span>
  );
}

function JenisBadge({ jenis }: { jenis: JenisMutasi }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${JENIS_BADGE_STYLES[jenis]}`}>
      {jenis}
    </span>
  );
}

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
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

function EmptyState({ message, hint }: { message: string; hint: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bg-alt text-brand-muted">
        <IconSearch />
      </div>
      <p className="text-[15px] font-bold text-brand-ink">{message}</p>
      <p className="max-w-[320px] text-[13px] leading-relaxed text-brand-muted">{hint}</p>
    </div>
  );
}

function Pagination({
  current,
  totalItems,
  onChange,
}: {
  current: number;
  totalItems: number;
  onChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const start = (current - 1) * PAGE_SIZE + 1;
  const end = Math.min(current * PAGE_SIZE, totalItems);

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i);
    if (current < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
      <p className="text-[13px] font-medium whitespace-nowrap text-brand-muted">
        Menampilkan <span className="font-bold text-brand-ink">{start}–{end}</span> dari{" "}
        <span className="font-bold text-brand-ink">{totalItems}</span> catatan
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-[#3D5E3A] transition-colors hover:enabled:bg-brand-bg-alt disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Halaman sebelumnya"
        >
          <IconChevronLeft />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-sm text-brand-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === current ? "page" : undefined}
              aria-label={`Halaman ${p}`}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                p === current
                  ? "bg-brand-green font-bold text-white"
                  : "border border-brand-border font-medium text-[#3D5E3A] hover:bg-brand-bg-alt"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onChange(current + 1)}
          disabled={current === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-[#3D5E3A] transition-colors hover:enabled:bg-brand-bg-alt disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Halaman berikutnya"
        >
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}

export function MutasiTable({
  rows,
  anggotaOptions,
  isSuperAdmin,
  rtId,
}: {
  rows: MutasiRow[];
  anggotaOptions: AnggotaOption[];
  isSuperAdmin: boolean;
  rtId: number | null;
}) {
  const router = useRouter();
  const lockedRtId = isSuperAdmin ? null : rtId;
  const [search, setSearch] = useState("");
  const [rtFilter, setRtFilter] = useState(lockedRtId ?? 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  function handleSaved() {
    setShowModal(false);
    router.refresh();
  }

  const filterKey = `${search}|${rtFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchSearch = !q || row.namaAnggota.toLowerCase().includes(q) || (row.noKk ?? "").includes(q);
      const matchRt = rtFilter === 0 || row.rtId === rtFilter;
      return matchSearch && matchRt;
    });
  }, [rows, search, rtFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isEmpty = filtered.length === 0;

  const scopedAnggotaOptions = lockedRtId ? anggotaOptions.filter((a) => a.rtId === lockedRtId) : anggotaOptions;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="mb-1 text-xl font-extrabold tracking-tight text-brand-ink sm:text-2xl">Log Mutasi</h1>
          <p className="text-[13px] text-brand-muted">
            {lockedRtId ? `Menampilkan data RT ${String(lockedRtId).padStart(2, "0")} saja` : "Menampilkan seluruh data RW 13"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-[10px] bg-brand-green px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_12px_rgba(0,70,23,0.25)] transition-colors hover:bg-brand-green-hover"
        >
          <IconPlus />
          Catat Mutasi
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        {[
          { label: "Total Catatan", value: rows.length, className: "text-brand-green" },
          { label: "Ditampilkan", value: filtered.length, className: "text-brand-blue" },
          { label: "Halaman", value: `${page} / ${totalPages}`, className: "text-brand-muted" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5 rounded-[10px] border border-brand-border bg-white px-4 py-2.5">
            <span className="text-[10px] font-semibold tracking-wider text-brand-muted uppercase">{s.label}</span>
            <span className={`text-lg leading-none font-extrabold ${s.className}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[180px] max-w-[320px] flex-1">
          <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-brand-muted">
            <IconSearch />
          </div>
          <input
            type="search"
            placeholder="Cari nama atau No. KK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cari mutasi"
            className="w-full rounded-[10px] border-[1.5px] border-brand-border py-2.5 pr-3 pl-9 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
          />
        </div>

        {lockedRtId ? (
          <div
            className="flex items-center gap-1.5 rounded-[10px] border-[1.5px] border-brand-border bg-brand-bg-alt px-3 py-2.5 text-sm font-semibold text-brand-muted"
            title="Filter RT terkunci sesuai akses Anda"
          >
            <IconLock />
            RT {String(lockedRtId).padStart(2, "0")}
          </div>
        ) : (
          <div className="relative">
            <select
              value={rtFilter}
              onChange={(e) => setRtFilter(Number(e.target.value))}
              aria-label="Filter RT"
              className="appearance-none rounded-[10px] border-[1.5px] border-brand-border py-2.5 pr-8 pl-3 text-sm font-semibold text-brand-ink outline-none"
            >
              <option value={0}>Semua RT</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  RT {String(n).padStart(2, "0")}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-brand-muted">
              <IconChevronDown />
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-[0_2px_16px_rgba(0,70,23,0.06)]">
        {isEmpty ? (
          rows.length === 0 ? (
            <EmptyState message="Belum ada catatan mutasi" hint="Catatan akan muncul setelah admin mencatat kejadian Lahir/Meninggal/Pindah." />
          ) : (
            <EmptyState message="Tidak ada data ditemukan" hint="Coba ubah kata kunci pencarian atau filter RT yang dipilih." />
          )
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-brand-border bg-[#F5F7F2]">
                    <th className="w-11 px-4 py-3 text-center text-[11px] font-bold tracking-wider text-brand-muted uppercase">#</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">Tanggal Kejadian</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">Nama Anggota</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">No. KK</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">RT</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">Jenis Mutasi</th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wider text-brand-muted uppercase">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row, idx) => (
                    <tr key={row.id} className="border-b border-brand-bg-alt last:border-0 hover:bg-[#FAFCF8]">
                      <td className="px-4 py-3.5 text-center text-[13px] font-medium text-brand-muted">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-brand-ink whitespace-nowrap">
                        {formatTanggal(row.tanggalKejadian)}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-brand-ink">{row.namaAnggota}</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-md bg-brand-bg-alt px-2 py-0.5 text-xs font-semibold tracking-wide text-[#3D5E3A] tabular-nums">
                          {row.noKk || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <RtBadge rtId={row.rtId} />
                      </td>
                      <td className="px-4 py-3.5">
                        <JenisBadge jenis={row.jenisMutasi} />
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-brand-muted">{row.keterangan || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2.5 p-3 md:hidden">
              {pageRows.map((row, idx) => (
                <div key={row.id} className="rounded-[14px] border border-brand-border bg-white p-4 shadow-[0_1px_6px_rgba(0,70,23,0.05)]">
                  <div className="mb-2.5 flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[9px] font-bold tracking-wider text-brand-muted uppercase">
                        {formatTanggal(row.tanggalKejadian)} — {String((page - 1) * PAGE_SIZE + idx + 1).padStart(2, "0")}
                      </p>
                      <p className="text-[15px] leading-tight font-bold text-brand-ink">{row.namaAnggota}</p>
                    </div>
                    <RtBadge rtId={row.rtId} />
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <JenisBadge jenis={row.jenisMutasi} />
                    <span className="rounded-md bg-brand-bg-alt px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[#3D5E3A] tabular-nums">
                      {row.noKk || "—"}
                    </span>
                  </div>
                  {row.keterangan && (
                    <p className="border-t border-brand-bg-alt pt-2 text-[13px] text-brand-muted">{row.keterangan}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {!isEmpty && <Pagination current={page} totalItems={filtered.length} onChange={setCurrentPage} />}

      {showModal && (
        <MutasiFormModal anggotaOptions={scopedAnggotaOptions} onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}
