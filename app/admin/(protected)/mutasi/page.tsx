import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log Mutasi — Admin MojoInsight",
};

export default function AdminMutasiPage() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bg-alt text-brand-muted">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15.5 15.5" />
        </svg>
      </div>
      <div>
        <p className="mb-1.5 text-lg font-bold text-brand-ink">Log Mutasi</p>
        <p className="text-[13px] text-brand-muted">Halaman ini dibangun di Milestone 7.</p>
      </div>
    </div>
  );
}
