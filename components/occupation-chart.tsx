export type PekerjaanRow = { pekerjaan: string; jumlah: number };

const RANK_COLORS = ["var(--color-brand-green)", "var(--color-brand-lime)", "var(--color-brand-blue)"];

export function OccupationChart({ data }: { data: PekerjaanRow[] }) {
  const top3 = data.slice(0, 3);
  const maxVal = Math.max(1, ...top3.map((d) => d.jumlah));

  return (
    <div className="flex flex-col gap-5">
      {top3.map((o, i) => {
        const pct = Math.round((o.jumlah / maxVal) * 100);
        const color = RANK_COLORS[i];
        return (
          <div key={o.pekerjaan}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[11px] font-bold"
                  style={{ background: `color-mix(in srgb, ${color} 13%, transparent)`, color }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-brand-ink">{o.pekerjaan}</span>
              </div>
              <span className="text-base font-extrabold text-brand-ink">{o.jumlah.toLocaleString("id-ID")}</span>
            </div>
            <div className="h-3 rounded-full bg-brand-bg-alt">
              <div
                className="h-3 min-w-6 rounded-full transition-[width]"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
      {top3.length === 0 && <p className="text-sm text-brand-muted">Belum ada data pekerjaan.</p>}
      <p className="mt-1 text-[11px] text-brand-muted">
        * Menampilkan 3 jenis pekerjaan terbanyak dari total warga aktif
      </p>
    </div>
  );
}
