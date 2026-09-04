import { BatikDivider } from "./batik-divider";
import { PengurusAvatar } from "./pengurus-avatar";
import type { PengurusRow } from "./struktur-page-content";

const ACCENTS = ["#95C658", "#61B8E8", "#FCC860", "#95C658", "#95C658", "#61B8E8"];

export function StrukturRtCard({ pengurus, colorIndex }: { pengurus: PengurusRow; colorIndex: number }) {
  const accent = ACCENTS[colorIndex % ACCENTS.length];

  return (
    <div className="overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-[0_2px_16px_rgba(0,70,23,0.06),0_1px_4px_rgba(0,70,23,0.03)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,70,23,0.12),0_2px_8px_rgba(0,70,23,0.06)]">
      <div className="h-[3px]" style={{ background: accent }} />

      <div className="px-5 pt-7 pb-6 text-center">
        <div className="mb-3.5 flex justify-center">
          <PengurusAvatar nama={pengurus.nama} fotoUrl={pengurus.fotoUrl} colorIndex={colorIndex} size={68} />
        </div>

        <h3 className="mb-1.5 text-base leading-tight font-bold tracking-tight text-brand-ink">
          {pengurus.nama}
        </h3>

        <span
          className="inline-block rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide"
          style={{ color: accent, background: `color-mix(in srgb, ${accent} 10%, transparent)`, borderColor: `color-mix(in srgb, ${accent} 40%, transparent)` }}
        >
          {pengurus.jabatan}
        </span>

        <BatikDivider className="mt-4 mb-0.5" />
      </div>
    </div>
  );
}
