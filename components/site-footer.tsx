import Link from "next/link";
import { KAWUNG_TILE } from "@/lib/kawung-tile";
import { BatikDivider } from "./batik-divider";

const LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Struktur Pengurus", href: "/struktur" },
];

export function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden bg-brand-green bg-[length:56px_56px]"
      style={{ backgroundImage: `url("${KAWUNG_TILE}")` }}
    >
      <div className="absolute inset-0 bg-brand-green/94" />

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-baseline gap-0.5">
              <span className="text-[22px] font-extrabold tracking-tight text-white">
                Mojo
              </span>
              <span className="text-[22px] font-medium tracking-tight text-brand-lime">
                Insight
              </span>
            </div>
            <p className="max-w-[280px] text-xs leading-relaxed text-white/50">
              Portal Informasi Kependudukan Resmi
              <br />
              Dusun Mojo, RW 13, Desa Ngeposari
              <br />
              Kec. Semanu, Kab. Gunung Kidul, D.I. Yogyakarta
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-brand-lime/70 uppercase">
              Tautan
            </p>
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[13px] text-white/55 transition-colors hover:text-white/90"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <BatikDivider tone="invert" className="opacity-25" />

        <div className="mt-5 flex justify-center sm:justify-start">
          <a
            href="/infografis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9V2h12v7" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <path d="M6 14h12v8H6z" />
            </svg>
            Export Infografis (PDF)
          </a>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-relaxed text-white/35">
            Platform data kependudukan resmi Dusun Mojo. Seluruh data bersumber
            dari administrasi dusun dan diperbarui secara berkala oleh petugas
            yang berwenang.
          </p>
          <div className="flex flex-shrink-0 gap-1.5">
            {[
              "bg-brand-green",
              "bg-brand-lime",
              "bg-brand-gold",
              "bg-brand-blue",
            ].map((c) => (
              <div key={c} className={`h-4 w-4 rounded-full opacity-75 ${c}`} />
            ))}
          </div>
        </div>

        <p className="mt-4 text-[10px] text-white/20">
          © {new Date().getFullYear()} Pemerintah Dusun Mojo · KKN UII
          Yogyakarta Angkatan 73 · Unit 115 Ngeposari
        </p>
      </div>
    </footer>
  );
}
