"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export type AgeBracketRow = { bracket: string; jumlah: number };

const BRACKET_META: Record<string, { label: string; sub: string; color: string }> = {
  "0-14": { label: "Usia Belajar", sub: "0 – 14 tahun", color: "var(--color-brand-lime)" },
  "15-59": { label: "Usia Produktif", sub: "15 – 59 tahun", color: "var(--color-brand-green)" },
  "60+": { label: "Lansia", sub: "60+ tahun", color: "var(--color-brand-gold)" },
};
const BRACKET_ORDER = ["0-14", "15-59", "60+"];

export function AgeDistributionChart({ data }: { data: AgeBracketRow[] }) {
  const byBracket = new Map(data.map((d) => [d.bracket, d.jumlah]));
  const slices = BRACKET_ORDER.map((bracket) => ({
    bracket,
    jumlah: byBracket.get(bracket) ?? 0,
    ...BRACKET_META[bracket],
  }));
  const total = slices.reduce((sum, s) => sum + s.jumlah, 0);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative h-[200px] w-[200px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="jumlah"
              nameKey="bracket"
              innerRadius={43}
              outerRadius={74}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {slices.map((s) => (
                <Cell key={s.bracket} fill={s.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-extrabold text-brand-ink">{total.toLocaleString("id-ID")}</span>
          <span className="text-[10px] font-semibold tracking-[0.08em] text-brand-muted">TOTAL JIWA</span>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col gap-4">
        {slices.map((s) => {
          const pct = total > 0 ? Math.round((s.jumlah / total) * 100) : 0;
          return (
            <div key={s.bracket}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ background: s.color }} />
                  <div>
                    <p className="text-sm leading-none font-semibold text-brand-ink">{s.label}</p>
                    <p className="mt-0.5 text-[11px] text-brand-muted">{s.sub}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-brand-ink">{s.jumlah.toLocaleString("id-ID")}</p>
                  <p className="text-[11px] font-semibold" style={{ color: s.color }}>
                    {pct}%
                  </p>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-brand-bg-alt">
                <div className="h-1.5 rounded-full transition-[width]" style={{ width: `${pct}%`, background: s.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
