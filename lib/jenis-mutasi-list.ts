export const JENIS_MUTASI_LIST = ["Lahir", "Meninggal", "Pindah Masuk", "Pindah Keluar"] as const;

export type JenisMutasi = (typeof JENIS_MUTASI_LIST)[number];
