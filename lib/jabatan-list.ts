// Shortcut suggestions only — field ini freeform, jadi admin tetap bisa mengetik nilai lain.
// Urutan array ini juga jadi sumber hierarki tampilan (lihat sortByJabatanHierarchy) —
// Kepala Dukuh paling tinggi, lalu Ketua RW, lalu Ketua RT 01-06.
export const JABATAN_OPTIONS: string[] = [
  "Kepala Dukuh",
  "Ketua RW",
  "Ketua RT 01",
  "Ketua RT 02",
  "Ketua RT 03",
  "Ketua RT 04",
  "Ketua RT 05",
  "Ketua RT 06",
];

const HIERARCHY = JABATAN_OPTIONS.map((j) => j.toLowerCase());

export function jabatanRank(jabatan: string): number {
  const lower = jabatan.toLowerCase();
  const idx = HIERARCHY.findIndex((h) => lower.includes(h));
  return idx === -1 ? HIERARCHY.length : idx;
}

// Jabatan di luar daftar shortcut (custom/freeform) ditaruh paling akhir, urut berdasarkan
// kapan ditambahkan — bukan input angka manual.
export function sortByJabatanHierarchy<T extends { jabatan: string; createdAt: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const rankDiff = jabatanRank(a.jabatan) - jabatanRank(b.jabatan);
    return rankDiff !== 0 ? rankDiff : a.createdAt.localeCompare(b.createdAt);
  });
}
