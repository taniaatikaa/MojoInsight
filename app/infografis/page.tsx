import type { AgeBracketRow } from "@/components/age-distribution-chart";
import type { HeroStats } from "@/components/hero-section";
import type { PekerjaanRow } from "@/components/occupation-chart";
import type { RtSummaryRow } from "@/components/village-map-section";
import { PrintTrigger } from "@/components/print-trigger";
import { createClient } from "@/lib/supabase/server";

const BRACKET_META: Record<string, { label: string; sub: string; color: string }> = {
  "0-14": { label: "Usia Belajar", sub: "0–14 tahun", color: "#95c658" },
  "15-59": { label: "Usia Produktif", sub: "15–59 tahun", color: "#004617" },
  "60+": { label: "Lansia", sub: "60+ tahun", color: "#fcc860" },
};
const BRACKET_ORDER = ["0-14", "15-59", "60+"];
const PEKERJAAN_COLORS = ["#004617", "#95c658", "#61b8e8"];

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
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
  const totalJiwa = stats?.total_jiwa ?? 0;
  const maxPekerjaan = Math.max(1, ...pekerjaan.map((p) => p.jumlah));
  const year = new Date().getFullYear();

  const statCards = [
    { label: "Total KK", value: stats?.total_kk ?? 0, color: "#004617" },
    { label: "Total Jiwa", value: stats?.total_jiwa ?? 0, color: "#61b8e8" },
    { label: `Kelahiran ${year}`, value: stats?.kelahiran_tahun_berjalan ?? 0, color: "#95c658" },
    { label: `Kematian ${year}`, value: stats?.kematian_tahun_berjalan ?? 0, color: "#fcc860" },
  ];

  return (
    <div className="min-h-screen bg-[#e8ece3] py-10 print:bg-white print:py-0">
      <PrintTrigger />

      <div className="mx-auto w-[210mm] bg-white p-[14mm] text-brand-ink shadow-xl print:w-full print:p-0 print:shadow-none">
        <div className="mb-6 flex items-start justify-between border-b-4 border-brand-green pb-4">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-extrabold text-brand-green">Mojo</span>
              <span className="text-2xl font-medium text-brand-lime">Insight</span>
            </div>
            <p className="mt-1 text-xs text-brand-muted">
              Data Kependudukan Dusun Mojo, RW 13, Desa Ngeposari, Kec. Semanu, Kab. Gunung Kidul
            </p>
          </div>
          <div className="text-right text-[11px] text-brand-muted">
            <p>Dicetak {formatDate(new Date())}</p>
            {stats?.last_updated_at && <p>Data per {formatDate(new Date(stats.last_updated_at))}</p>}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-4 gap-4">
          {statCards.map((c) => (
            <div key={c.label} className="rounded-xl border border-brand-border p-4 text-center">
              <div className="mb-1 text-3xl font-extrabold" style={{ color: c.color }}>
                {c.value.toLocaleString("id-ID")}
              </div>
              <p className="text-[11px] font-semibold text-brand-muted">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.12em] text-brand-green uppercase">
              Distribusi Usia
            </p>
            <div className="flex flex-col gap-3">
              {BRACKET_ORDER.map((b) => {
                const jumlah = byBracket.get(b) ?? 0;
                const pct = totalJiwa > 0 ? Math.round((jumlah / totalJiwa) * 100) : 0;
                const meta = BRACKET_META[b];
                return (
                  <div key={b}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-semibold">
                        {meta.label} <span className="text-brand-muted">({meta.sub})</span>
                      </span>
                      <span className="font-bold">
                        {jumlah.toLocaleString("id-ID")} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-brand-bg-alt">
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: meta.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.12em] text-brand-green uppercase">
              Pekerjaan Terbanyak
            </p>
            <div className="flex flex-col gap-3">
              {pekerjaan.map((p, i) => {
                const pct = Math.round((p.jumlah / maxPekerjaan) * 100);
                return (
                  <div key={p.pekerjaan}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-semibold">
                        {i + 1}. {p.pekerjaan}
                      </span>
                      <span className="font-bold">{p.jumlah.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="h-2 rounded-full bg-brand-bg-alt">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${pct}%`, background: PEKERJAAN_COLORS[i] }}
                      />
                    </div>
                  </div>
                );
              })}
              {pekerjaan.length === 0 && (
                <p className="text-xs text-brand-muted">Belum ada data pekerjaan.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-3 text-xs font-bold tracking-[0.12em] text-brand-green uppercase">
            Ringkasan per RT
          </p>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-brand-green text-left">
                <th className="py-2 pr-2 font-bold">RT</th>
                <th className="py-2 pr-2 text-right font-bold">KK</th>
                <th className="py-2 pr-2 text-right font-bold">Jiwa</th>
                <th className="py-2 pr-2 text-right font-bold">Laki-laki</th>
                <th className="py-2 text-right font-bold">Perempuan</th>
              </tr>
            </thead>
            <tbody>
              {rtList.map((rt) => (
                <tr key={rt.rt_id} className="border-b border-brand-border">
                  <td className="py-2 pr-2 font-semibold">{rt.nama}</td>
                  <td className="py-2 pr-2 text-right">{rt.jumlah_kk.toLocaleString("id-ID")}</td>
                  <td className="py-2 pr-2 text-right">{rt.jumlah_jiwa.toLocaleString("id-ID")}</td>
                  <td className="py-2 pr-2 text-right">{rt.jumlah_laki.toLocaleString("id-ID")}</td>
                  <td className="py-2 text-right">{rt.jumlah_perempuan.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-brand-border pt-3 text-center text-[10px] text-brand-muted">
          Dicetak otomatis dari mojoinsight.tech · Data bersumber dari administrasi Dusun Mojo
        </div>
      </div>
    </div>
  );
}
