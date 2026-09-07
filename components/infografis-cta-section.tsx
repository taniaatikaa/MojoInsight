import { KAWUNG_TILE } from "@/lib/kawung-tile";
import { BatikDivider } from "./batik-divider";
import { SectionLabel } from "./section-label";

export function InfografisCtaSection() {
  return (
    <section className="px-6 py-16 sm:py-18">
      <div className="mx-auto max-w-6xl">
        <SectionLabel num="04" text="Infografis" />

        <h2 className="text-[clamp(22px,2.8vw,32px)] leading-tight font-extrabold tracking-tight text-brand-ink">
          Cetak Ringkasan Data
        </h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-brand-muted">
          Unduh ringkasan data kependudukan dalam satu halaman siap cetak — cocok untuk ditempel di
          balai dukuh atau dibagikan ke pengurus RT.
        </p>

        <BatikDivider className="mt-6" />

        <div
          className="relative mt-8 overflow-hidden rounded-[20px] bg-brand-green bg-[length:56px_56px] px-8 py-10 sm:px-12"
          style={{ backgroundImage: `url("${KAWUNG_TILE}")` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, rgba(0,70,23,0.96) 0%, rgba(0,40,12,0.90) 100%)" }}
          />

          <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="hidden h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#95C658" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9V2h12v7" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <path d="M6 14h12v8H6z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-white">Infografis Data Kependudukan</p>
                <p className="mt-1 text-sm text-white/60">
                  Format A4, berisi ringkasan angka utama, demografi, dan data per RT.
                </p>
              </div>
            </div>

            <a
              href="/infografis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-sm font-bold text-brand-green transition-colors hover:bg-white"
            >
              Export Infografis (PDF)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
