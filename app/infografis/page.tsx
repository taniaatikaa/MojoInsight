import type { AgeBracketRow } from "@/components/age-distribution-chart";
import type { HeroStats } from "@/components/hero-section";
import type { PekerjaanRow } from "@/components/occupation-chart";
import type { RtSummaryRow } from "@/components/village-map-section";
import { PrintTrigger } from "@/components/print-trigger";
import { KAWUNG_TILE } from "@/lib/kawung-tile";
import { createClient } from "@/lib/supabase/server";

const BRACKET_META: Record<string, { label: string; sub: string; color: string }> = {
  "0-14": { label: "Usia Belajar", sub: "0–14 tahun", color: "#61B8E8" },
  "15-59": { label: "Usia Produktif", sub: "15–59 tahun", color: "#004617" },
  "60+": { label: "Lansia", sub: "60 tahun ke atas", color: "#FCC860" },
};
const BRACKET_ORDER = ["0-14", "15-59", "60+"];
const PEKERJAAN_COLORS = ["#004617", "#95C658", "#FCC860"];

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const ICONS = {
  kk: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22v-10h6v10" />,
  jiwa: (
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
  ),
  lahir: <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z M12 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4Z" />,
  mati: (
    <path
      d="M12 2a8 8 0 0 0-8 8c0 3 1.5 5.5 4 7v3h8v-3c2.5-1.5 4-4 4-7a8 8 0 0 0-8-8Z M12 18v3 M9 20h6"
      vectorEffect="non-scaling-stroke"
    />
  ),
};

function StatIcon({ path, color }: { path: React.ReactNode; color: string }) {
  return (
    <div
      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
      style={{ background: `color-mix(in srgb, ${color} 14%, white)` }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {path}
      </svg>
    </div>
  );
}

function DonutChart({ slices, total }: { slices: { color: string; jumlah: number }[]; total: number }) {
  const cumulative = slices.reduce<number[]>((acc, s) => {
    const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
    return [...acc, prev + s.jumlah];
  }, []);
  const stops = slices
    .map((s, i) => {
      const start = total > 0 ? ((cumulative[i] - s.jumlah) / total) * 100 : 0;
      const end = total > 0 ? (cumulative[i] / total) * 100 : 0;
      return `${s.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="relative h-[130px] w-[130px] flex-shrink-0 rounded-full" style={{ background: `conic-gradient(${stops})` }}>
      <div className="absolute inset-[16px] flex flex-col items-center justify-center rounded-full bg-white">
        <span className="text-lg font-extrabold text-brand-green">{total.toLocaleString("id-ID")}</span>
        <span className="text-[9px] font-bold tracking-[0.1em] text-brand-muted uppercase">Jiwa</span>
      </div>
    </div>
  );
}

export default async function InfografisPage() {
  const supabase = await createClient();

  const [heroStats, ageData, pekerjaanData, rtSummary] = await Promise.all([
    supabase.from("v_hero_stats").select("*").single(),
    supabase.from("v_age_bracket_distribution").select("*"),
    supabase.from("v_pekerjaan_distribution").select("*"),
    supabase.from("v_rt_summary").select("*").order("rt_id"),
  ]);

  const stats = heroStats.data as HeroStats | null;
  const age = (ageData.data ?? []) as AgeBracketRow[];
  const pekerjaan = ((pekerjaanData.data ?? []) as PekerjaanRow[]).slice(0, 3);
  const rtList = (rtSummary.data ?? []) as RtSummaryRow[];

  const byBracket = new Map(age.map((a) => [a.bracket, a.jumlah]));
  const totalKk = stats?.total_kk ?? 0;
  const totalJiwa = stats?.total_jiwa ?? 0;
  const maxPekerjaan = Math.max(1, ...pekerjaan.map((p) => p.jumlah));
  const rataRata = totalKk > 0 ? (totalJiwa / totalKk).toLocaleString("id-ID", { maximumFractionDigits: 2 }) : "0";

  const statCards = [
    { label: "Total Kepala Keluarga", value: totalKk, sub: `KK terdaftar · ${rtList.length} RT`, color: "#004617", icon: ICONS.kk },
    { label: "Total Jiwa", value: totalJiwa, sub: `Rata-rata ${rataRata} jiwa / KK`, color: "#95C658", icon: ICONS.jiwa },
    { label: `Kelahiran Tahun Ini`, value: stats?.kelahiran_tahun_berjalan ?? 0, sub: "jiwa", color: "#FCC860", icon: ICONS.lahir },
    { label: `Kematian Tahun Ini`, value: stats?.kematian_tahun_berjalan ?? 0, sub: "jiwa", color: "#61B8E8", icon: ICONS.mati },
  ];

  const donutSlices = BRACKET_ORDER.map((b) => ({ color: BRACKET_META[b].color, jumlah: byBracket.get(b) ?? 0 }));

  return (
    <div className="min-h-screen bg-[#e8ece3] py-10 print:min-h-0 print:bg-white print:py-0">
      <PrintTrigger />

      <div className="mx-auto w-[210mm] overflow-hidden rounded-2xl bg-white text-brand-ink shadow-xl print:w-full print:rounded-none print:shadow-none">
        <div
          className="relative overflow-hidden bg-brand-green bg-[length:56px_56px] px-9 pt-6 pb-4"
          style={{ backgroundImage: `url("${KAWUNG_TILE}")` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, rgba(0,70,23,0.96) 0%, rgba(0,40,12,0.90) 100%)" }}
          />
          <div className="absolute top-1/2 right-[-40px] h-56 w-56 rounded-full bg-white/[0.04]" />
          <div className="absolute right-10 bottom-[-30px] h-32 w-32 rounded-full bg-white/[0.05]" />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="mb-3 flex items-baseline gap-0.5">
                <span className="text-lg font-extrabold text-white">Mojo</span>
                <span className="text-lg font-medium text-brand-lime">Insight</span>
              </div>
              <p className="mb-1 text-[9px] font-bold tracking-[0.2em] text-brand-lime uppercase">
                Ringkasan Resmi Dusun
              </p>
              <h1 className="mb-1.5 text-[22px] leading-tight font-extrabold text-white">
                Data Kependudukan Dusun Mojo
              </h1>
              <p className="text-[11px] text-white/65">RW 13, Desa Ngeposari, Kec. Semanu, Kab. Gunung Kidul</p>
            </div>

            <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
              <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-right">
                <p className="text-[8px] font-bold tracking-[0.15em] text-brand-lime uppercase">Tanggal Cetak</p>
                <p className="text-[13px] font-bold text-white">{formatDate(new Date())}</p>
              </div>
              {stats?.last_updated_at && (
                <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-right">
                  <p className="text-[8px] font-bold tracking-[0.15em] text-brand-lime uppercase">
                    Data Terakhir Diperbarui
                  </p>
                  <p className="text-[13px] font-bold text-white">{formatDate(new Date(stats.last_updated_at))}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex h-[5px]">
          <div className="flex-1" style={{ background: "#95C658" }} />
          <div className="flex-1" style={{ background: "#FCC860" }} />
          <div className="flex-1" style={{ background: "#61B8E8" }} />
        </div>

        <div className="px-9 py-5">
          <div className="mb-4 grid grid-cols-4 gap-3">
            {statCards.map((c) => (
              <div key={c.label} className="overflow-hidden rounded-xl border border-brand-border">
                <div className="h-[3px]" style={{ background: c.color }} />
                <div className="p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <StatIcon path={c.icon} color={c.color} />
                    <p className="text-[11px] leading-tight font-bold text-brand-ink">{c.label}</p>
                  </div>
                  <p className="text-[26px] leading-none font-extrabold text-brand-ink">
                    {c.value.toLocaleString("id-ID")}
                  </p>
                  <p className="mt-1 text-[10px] text-brand-muted">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-brand-border p-4">
              <p className="text-[13px] font-extrabold text-brand-green">Distribusi Usia</p>
              <p className="mb-3 text-[11px] text-brand-muted">Berdasarkan kelompok usia penduduk</p>
              <div className="flex items-center gap-4">
                <DonutChart slices={donutSlices} total={totalJiwa} />
                <div className="flex flex-1 flex-col gap-2">
                  {BRACKET_ORDER.map((b) => {
                    const jumlah = byBracket.get(b) ?? 0;
                    const pct = totalJiwa > 0 ? Math.round((jumlah / totalJiwa) * 100) : 0;
                    const meta = BRACKET_META[b];
                    return (
                      <div key={b} className="flex gap-2">
                        <div className="mt-0.5 w-[3px] flex-shrink-0 rounded-full" style={{ background: meta.color }} />
                        <div>
                          <p className="text-[11px] leading-tight font-bold text-brand-ink">
                            {meta.label} <span className="font-normal text-brand-muted">({meta.sub})</span>
                          </p>
                          <p className="text-[11px] font-bold text-brand-ink">
                            {jumlah.toLocaleString("id-ID")} jiwa · {pct}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-brand-border p-4">
              <p className="text-[13px] font-extrabold text-brand-green">Pekerjaan Terbanyak</p>
              <p className="mb-3 text-[11px] text-brand-muted">Tiga mata pencaharian utama warga</p>
              <div className="flex flex-col gap-2.5">
                {pekerjaan.map((p, i) => {
                  const pct = Math.round((p.jumlah / maxPekerjaan) * 100);
                  const color = PEKERJAAN_COLORS[i];
                  return (
                    <div key={p.pekerjaan}>
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[11px] font-bold text-white"
                            style={{ background: color }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-[12px] font-bold text-brand-ink">{p.pekerjaan}</span>
                        </div>
                        <span className="text-[13px] font-extrabold text-brand-ink">
                          {p.jumlah.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-brand-bg-alt">
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
                {pekerjaan.length === 0 && <p className="text-xs text-brand-muted">Belum ada data pekerjaan.</p>}
              </div>
              <p className="mt-3 border-t border-brand-border pt-2 text-[10px] text-brand-muted">
                Angka menunjukkan jumlah jiwa pada tiap jenis pekerjaan.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-[13px] font-extrabold text-brand-green">Ringkasan per RT</p>
                <p className="text-[11px] text-brand-muted">Jumlah kepala keluarga dan jiwa di {rtList.length} RT</p>
              </div>
              <p className="text-[12px] font-bold whitespace-nowrap text-brand-ink">
                Total {totalKk.toLocaleString("id-ID")} KK · {totalJiwa.toLocaleString("id-ID")} jiwa
              </p>
            </div>
            <div className="grid grid-cols-6 gap-2 border-t border-brand-border pt-3">
              {rtList.map((rt) => (
                <div key={rt.rt_id} className="overflow-hidden rounded-lg border border-brand-border">
                  <div className="bg-brand-green py-1 text-center text-[10px] font-bold text-white">{rt.nama}</div>
                  <div className="flex flex-col items-center gap-1.5 bg-white py-2">
                    <div>
                      <p className="text-center text-[15px] leading-none font-extrabold text-brand-green">
                        {rt.jumlah_kk.toLocaleString("id-ID")}
                      </p>
                      <p className="mt-0.5 text-center text-[8px] font-bold tracking-wide text-brand-muted uppercase">
                        KK
                      </p>
                    </div>
                    <div>
                      <p className="text-center text-[15px] leading-none font-extrabold text-brand-green">
                        {rt.jumlah_jiwa.toLocaleString("id-ID")}
                      </p>
                      <p className="mt-0.5 text-center text-[8px] font-bold tracking-wide text-brand-muted uppercase">
                        Jiwa
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-brand-green px-9 py-3">
          <p className="text-[10px] text-white/60">
            Dicetak otomatis dari mojoinsight.tech · Data bersumber dari administrasi Dusun Mojo
          </p>
          <div className="flex items-baseline gap-0.5">
            <span className="text-[11px] font-extrabold text-white">Mojo</span>
            <span className="text-[11px] font-medium text-brand-lime">Insight</span>
          </div>
        </div>
      </div>
    </div>
  );
}
