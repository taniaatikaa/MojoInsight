import { KAWUNG_TILE } from "@/lib/kawung-tile";
import { BatikDivider } from "./batik-divider";
import { StatCounter } from "./stat-counter";

export type HeroStats = {
  total_kk: number;
  total_jiwa: number;
  kelahiran_tahun_berjalan: number;
  kematian_tahun_berjalan: number;
};

const LOCATIONS = ["RW 13", "Desa Ngeposari", "Kec. Semanu", "Kab. Gunung Kidul", "D.I. Yogyakarta"];

function StatCards({ stats }: { stats: HeroStats }) {
  const year = new Date().getFullYear();
  const cards = [
    {
      id: "kk",
      label: "Total KK",
      sublabel: "Kepala Keluarga",
      value: stats.total_kk,
      color: "var(--color-brand-green)",
      icon: (
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22v-10h6v10" />
      ),
    },
    {
      id: "jiwa",
      label: "Total Jiwa",
      sublabel: "Warga Terdaftar",
      value: stats.total_jiwa,
      color: "var(--color-brand-blue)",
      icon: (
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
      ),
    },
    {
      id: "lahir",
      label: "Kelahiran",
      sublabel: `Tahun ${year}`,
      value: stats.kelahiran_tahun_berjalan,
      color: "var(--color-brand-lime)",
      icon: <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z M12 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4Z" />,
    },
    {
      id: "mati",
      label: "Kematian",
      sublabel: `Tahun ${year}`,
      value: stats.kematian_tahun_berjalan,
      color: "var(--color-brand-gold)",
      icon: (
        <path d="M12 2a8 8 0 0 0-8 8c0 3 1.5 5.5 4 7v3h8v-3c2.5-1.5 4-4 4-7a8 8 0 0 0-8-8Z M12 18v3 M9 20h6" />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.id}
          className="relative overflow-hidden rounded-2xl border border-brand-border bg-white p-5 shadow-[0_8px_32px_rgba(0,70,23,0.15),0_2px_8px_rgba(0,0,0,0.05)]"
        >
          <div className="absolute top-0 right-0 left-0 h-[3px]" style={{ background: c.color }} />
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={c.color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-2.5"
          >
            {c.icon}
          </svg>
          <div className="mb-2 text-[clamp(28px,3.5vw,40px)] leading-none font-extrabold tracking-tight text-brand-ink">
            <StatCounter value={c.value} />
          </div>
          <p className="mb-0.5 text-[13px] font-bold text-brand-ink">{c.label}</p>
          <p className="text-[11px] text-brand-muted">{c.sublabel}</p>
        </div>
      ))}
    </div>
  );
}

export function HeroSection({ stats }: { stats: HeroStats }) {
  return (
    <>
      <section
        className="relative bg-brand-green bg-[length:56px_56px] pb-20"
        style={{ backgroundImage: `url("${KAWUNG_TILE}")` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(0,70,23,0.96) 0%, rgba(0,40,12,0.90) 100%)" }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-18">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex gap-1">
              {["bg-brand-green", "bg-brand-lime", "bg-brand-gold"].map((c) => (
                <div key={c} className={`h-4 w-1.5 rounded-full opacity-85 ${c}`} />
              ))}
            </div>
            <span className="text-[10px] font-bold tracking-[0.22em] text-brand-lime/90 uppercase">
              Portal Resmi Dusun Mojo
            </span>
          </div>

          <div className="max-w-[680px]">
            <h1 className="mb-5 text-[clamp(28px,4.5vw,52px)] leading-[1.12] font-extrabold tracking-tight text-white">
              Data Kependudukan
              <br />
              <span className="text-brand-lime">Dusun Mojo</span>
            </h1>

            <p className="mb-2.5 text-[clamp(14px,1.6vw,17px)] leading-relaxed text-white/65">
              Sistem informasi kependudukan resmi yang menyajikan data demografi warga secara
              terbuka, akurat, dan mudah dipahami.
            </p>

            <p className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/45">
              {LOCATIONS.map((loc, i) => (
                <span key={loc} className="flex items-center gap-2">
                  {i > 0 && <span className="opacity-30">·</span>}
                  {loc}
                </span>
              ))}
            </p>
          </div>

          <div className="mt-10 max-w-[320px]">
            <BatikDivider tone="invert" className="opacity-40" />
          </div>
        </div>
      </section>

      <div className="relative z-10 -mt-14 px-6">
        <div className="mx-auto max-w-6xl">
          <StatCards stats={stats} />
        </div>
      </div>

      <div className="mx-auto mt-4 mb-2 flex max-w-6xl items-center gap-2 px-6">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-lime" />
        <p className="text-[11px] font-medium text-brand-muted">
          Data diperbarui otomatis · Sumber: Administrasi Dusun Mojo
        </p>
      </div>
    </>
  );
}
