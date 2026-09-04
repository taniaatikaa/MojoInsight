import { KAWUNG_TILE } from "@/lib/kawung-tile";
import { BatikDivider } from "./batik-divider";
import { PengurusAvatar } from "./pengurus-avatar";
import type { PengurusRow } from "./struktur-page-content";

export function StrukturKepalaCard({ pengurus }: { pengurus: PengurusRow }) {
  return (
    <div className="relative mx-auto max-w-[560px] overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[0_8px_40px_rgba(0,70,23,0.10),0_2px_10px_rgba(0,70,23,0.06)]">
      <div className="h-1 bg-[linear-gradient(90deg,#FCC860_0%,#F5A623_60%,#FCC860_100%)]" />

      <div className="px-9 pt-9 pb-8 text-center">
        <div className="relative mb-5 inline-flex items-center justify-center">
          <div className="absolute h-[108px] w-[108px] rounded-full border-2 border-dashed border-brand-gold/50" />
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#FCC860_0%,#F5A623_100%)] p-[3px]">
            <PengurusAvatar nama={pengurus.nama} fotoUrl={pengurus.fotoUrl} colorIndex={0} size={94} />
          </div>
          <div className="absolute right-[-4px] bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-green">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L5 9L10 3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="mb-2.5">
          <span className="inline-block rounded-full border border-brand-border bg-brand-bg-alt px-3.5 py-1.5 text-[10px] font-bold tracking-[0.18em] text-brand-green uppercase">
            {pengurus.jabatan}
          </span>
        </div>

        <h2 className="mb-1 text-[22px] font-extrabold tracking-tight text-brand-ink">{pengurus.nama}</h2>

        <BatikDivider className="mt-5" />

        <p className="mt-4.5 text-sm leading-relaxed text-[#3D5E3A]">
          Memimpin koordinasi administrasi dan kemasyarakatan di seluruh wilayah RW 13, Dusun Mojo.
        </p>
      </div>

      <div
        className="absolute right-0 bottom-0 h-20 w-20 rounded-br-3xl bg-[length:40px_40px] opacity-5"
        style={{ backgroundImage: `url("${KAWUNG_TILE}")` }}
      />
    </div>
  );
}
