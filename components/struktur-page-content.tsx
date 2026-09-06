import Link from "next/link";
import { KAWUNG_TILE } from "@/lib/kawung-tile";
import { jabatanRank } from "@/lib/jabatan-list";
import { StrukturKepalaCard } from "./struktur-kepala-card";
import { StrukturRtCard } from "./struktur-rt-card";

export type PengurusRow = {
  id: string;
  nama: string;
  jabatan: string;
  fotoUrl: string | null;
};

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-border bg-white px-6 py-8 text-center text-sm text-brand-muted">
      {text}
    </div>
  );
}

export function StrukturPageContent({ pengurus }: { pengurus: PengurusRow[] }) {
  const kepalaDukuh = pengurus.find((p) => jabatanRank(p.jabatan) === 0) ?? null;
  const ketuaRw = pengurus.find((p) => jabatanRank(p.jabatan) === 1) ?? null;
  const featured = [kepalaDukuh, ketuaRw].filter((p): p is PengurusRow => p !== null);
  const featuredIds = new Set(featured.map((p) => p.id));
  const ketuaRt = pengurus.filter((p) => !featuredIds.has(p.id));

  return (
    <>
      <div
        className="relative overflow-hidden bg-brand-green bg-[length:56px_56px]"
        style={{ backgroundImage: `url("${KAWUNG_TILE}")` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(0,70,23,0.96) 0%, rgba(0,40,12,0.90) 100%)" }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-13">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Link href="/" className="text-xs font-medium text-white/45 transition-colors hover:text-white/80">
              Beranda
            </Link>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-semibold text-brand-lime/90">Struktur Pengurus</span>
          </div>

          <h1 className="mb-3 text-[clamp(24px,3.5vw,42px)] leading-[1.15] font-extrabold tracking-tight text-white">
            Struktur Pengurus
            <br />
            <span className="text-brand-lime">Dukuh Mojo</span>
          </h1>

          <p className="mb-5 max-w-[520px] text-[clamp(13px,1.4vw,16px)] leading-relaxed text-white/60">
            Susunan Kepala Dukuh, Ketua RW, dan Ketua RT di lingkungan RW 13, Dusun Mojo, Desa
            Ngeposari, Kecamatan Semanu, Kabupaten Gunung Kidul.
          </p>

          <div className="flex flex-wrap gap-2">
            {["RW 13 · Dusun Mojo", "Desa Ngeposari"].map((text) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-semibold text-white/65"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <section className="mb-16 sm:mb-18">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-brand-border" />
            <span className="text-[10px] font-bold tracking-[0.22em] text-brand-muted uppercase">
              Pimpinan Dusun
            </span>
            <div className="h-px w-12 bg-brand-border" />
          </div>

          {featured.length > 0 ? (
            <div
              className={`mx-auto grid gap-6 ${featured.length === 2 ? "max-w-[1160px] sm:grid-cols-2" : "max-w-[560px]"}`}
            >
              {featured.map((p) => (
                <StrukturKepalaCard key={p.id} pengurus={p} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-[560px]">
              <EmptyNote text="Data Kepala Dukuh & Ketua RW belum diisi." />
            </div>
          )}
        </section>

        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-brand-border" />
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <svg key={i} width="7" height="7" viewBox="0 0 8 8" fill="none">
                  <path d="M4 0L8 4L4 8L0 4Z" fill="#D0E3C4" />
                </svg>
              ))}
              <span className="px-1 text-[11px] font-bold tracking-[0.18em] text-brand-muted uppercase">
                Ketua Rukun Tetangga
              </span>
              {[0, 1, 2].map((i) => (
                <svg key={i} width="7" height="7" viewBox="0 0 8 8" fill="none">
                  <path d="M4 0L8 4L4 8L0 4Z" fill="#D0E3C4" />
                </svg>
              ))}
            </div>
            <div className="h-px flex-1 bg-brand-border" />
          </div>
          <p className="mt-2.5 text-center text-[13px] leading-relaxed text-brand-muted">
            {ketuaRt.length} Ketua RT terdaftar di bawah koordinasi RW 13 Dusun Mojo
          </p>
        </div>

        {ketuaRt.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ketuaRt.map((p, i) => (
              <StrukturRtCard key={p.id} pengurus={p} colorIndex={i} />
            ))}
          </div>
        ) : (
          <EmptyNote text="Data Ketua RT belum diisi." />
        )}

        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-brand-border bg-white px-5 py-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-bg-alt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#004617" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="mb-0.5 text-[13px] font-semibold text-brand-ink">Data struktur pengurus</p>
            <p className="text-xs leading-relaxed text-brand-muted">
              Informasi ini dikelola oleh petugas administrasi dusun melalui panel Admin. Foto profil
              akan tampil otomatis setelah diunggah.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
