import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Pengurus — Admin MojoInsight",
};

export default function AdminStrukturPage() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bg-alt text-brand-muted">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <div>
        <p className="mb-1.5 text-lg font-bold text-brand-ink">Struktur Pengurus</p>
        <p className="text-[13px] text-brand-muted">CRUD Kepala Dukuh &amp; Ketua RT dibangun di Milestone 8.</p>
      </div>
    </div>
  );
}
