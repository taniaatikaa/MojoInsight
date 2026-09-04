import { AgeDistributionChart, type AgeBracketRow } from "./age-distribution-chart";
import { BatikDivider } from "./batik-divider";
import { OccupationChart, type PekerjaanRow } from "./occupation-chart";
import { SectionLabel } from "./section-label";

export function DemografiSection({
  ageData,
  pekerjaanData,
  totalJiwa,
}: {
  ageData: AgeBracketRow[];
  pekerjaanData: PekerjaanRow[];
  totalJiwa: number;
}) {
  return (
    <section className="px-6 py-16 sm:py-18">
      <div className="mx-auto max-w-6xl">
        <SectionLabel num="02" text="Demografi" />

        <h2 className="text-[clamp(22px,2.8vw,32px)] leading-tight font-extrabold tracking-tight text-brand-ink">
          Profil Demografi Warga
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-muted">
          Gambaran komposisi penduduk berdasarkan kelompok usia dan mata pencaharian.
        </p>

        <BatikDivider className="mt-6" />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-[0_2px_20px_rgba(0,70,23,0.06),0_1px_4px_rgba(0,70,23,0.04)]">
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-brand-muted uppercase">
                  Grafik Komposisi
                </p>
                <h3 className="text-lg font-bold tracking-tight text-brand-ink">Distribusi Usia</h3>
              </div>
              <span className="rounded-full bg-brand-bg-alt px-2.5 py-1 text-[10px] font-semibold text-brand-green">
                {totalJiwa.toLocaleString("id-ID")} jiwa
              </span>
            </div>
            <BatikDivider className="px-6" />
            <div className="px-6 pt-5 pb-6">
              <AgeDistributionChart data={ageData} />
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-[0_2px_20px_rgba(0,70,23,0.06),0_1px_4px_rgba(0,70,23,0.04)]">
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.18em] text-brand-muted uppercase">
                  Grafik Batang
                </p>
                <h3 className="text-lg font-bold tracking-tight text-brand-ink">Top 3 Pekerjaan</h3>
              </div>
              <span className="rounded-full bg-brand-bg-alt px-2.5 py-1 text-[10px] font-semibold text-brand-green">
                Usia produktif
              </span>
            </div>
            <BatikDivider className="px-6" />
            <div className="px-6 py-6">
              <OccupationChart data={pekerjaanData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
