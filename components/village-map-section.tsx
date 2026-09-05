"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { KAWUNG_TILE } from "@/lib/kawung-tile";
import { BatikDivider } from "./batik-divider";
import { SectionLabel } from "./section-label";

export type RtSummaryRow = {
  rt_id: number;
  nama: string;
  latitude: number;
  longitude: number;
  jumlah_kk: number;
  jumlah_jiwa: number;
  pekerjaan_dominan: string | null;
};

const VillageMapLeaflet = dynamic(
  () => import("./village-map-leaflet").then((m) => m.VillageMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full animate-pulse bg-brand-bg-alt" />
    ),
  },
);

export function VillageMapSection({ rtList }: { rtList: RtSummaryRow[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedRt = rtList.find((rt) => rt.rt_id === selected) ?? null;

  return (
    <section
      className="relative bg-brand-bg-alt bg-[length:56px_56px] px-6 py-20"
      style={{ backgroundImage: `url("${KAWUNG_TILE}")` }}
    >
      <div className="absolute inset-0 bg-brand-bg-alt/95" />

      <div className="relative mx-auto max-w-6xl">
        <SectionLabel num="03" text="Peta Wilayah" />

        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[clamp(22px,2.8vw,32px)] leading-tight font-extrabold tracking-tight text-brand-ink">
              Peta Wilayah RW 13
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-brand-muted">
              Pilih RT pada peta atau daftar di bawah untuk melihat detail
              wilayah.
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 rounded-xl border border-brand-border bg-white/80 px-3 py-2 text-xs font-semibold text-brand-muted z-12">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 2a8 8 0 0 1 8 8c0 5.25-8 14-8 14S4 15.25 4 10a8 8 0 0 1 8-8z" />
            </svg>
            {rtList.length} RT terdaftar
          </div>
        </div>

        <BatikDivider />

        <div className="isolate mt-7 overflow-hidden rounded-2xl border border-brand-border shadow-[0_4px_24px_rgba(0,70,23,0.1)]">
          <VillageMapLeaflet
            rtList={rtList}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {rtList.map((rt) => {
            const isActive = selected === rt.rt_id;
            return (
              <button
                key={rt.rt_id}
                onClick={() => setSelected(isActive ? null : rt.rt_id)}
                className={`rounded-[14px] border-[1.5px] p-3.5 text-left transition-colors ${
                  isActive
                    ? "border-brand-green bg-brand-green shadow-[0_4px_16px_rgba(0,70,23,0.2)]"
                    : "border-brand-border bg-white shadow-[0_1px_4px_rgba(0,70,23,0.05)] hover:border-brand-lime"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                      isActive
                        ? "border-white/40 bg-white/20"
                        : "border-brand-border bg-brand-bg-alt"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-extrabold ${isActive ? "text-white" : "text-brand-green"}`}
                    >
                      {rt.rt_id}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-bold ${isActive ? "text-white/70" : "text-brand-muted"}`}
                  >
                    RT {rt.rt_id.toString().padStart(2, "0")}
                  </span>
                </div>
                <p
                  className={`mb-0.5 text-[15px] leading-none font-extrabold ${isActive ? "text-white" : "text-brand-ink"}`}
                >
                  {rt.jumlah_jiwa}
                  <span className="ml-0.5 text-[10px] font-medium opacity-70">
                    {" "}
                    jiwa
                  </span>
                </p>
                <p
                  className={`text-[11px] ${isActive ? "text-white/55" : "text-brand-muted"}`}
                >
                  {rt.jumlah_kk} KK
                </p>
              </button>
            );
          })}
        </div>

        {selectedRt && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-brand-border bg-white shadow-[0_8px_32px_rgba(0,70,23,0.12)]">
            <div
              className="relative bg-brand-green bg-[length:40px_40px] px-6 py-5"
              style={{ backgroundImage: `url("${KAWUNG_TILE}")` }}
            >
              <div className="absolute inset-0 bg-brand-green/90" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-semibold tracking-[0.18em] text-brand-lime/85 uppercase">
                    Detail Wilayah
                  </p>
                  <h3 className="text-xl font-extrabold tracking-tight text-white">
                    RT {selectedRt.rt_id.toString().padStart(2, "0")} — RW 13
                  </h3>
                  <p className="mt-0.5 text-xs text-white/55">
                    Dusun Mojo · Desa Ngeposari
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg border border-white/20 bg-white/12 px-3 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/20"
                >
                  Tutup ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Total Jiwa",
                    value: selectedRt.jumlah_jiwa.toLocaleString("id-ID"),
                    color: "text-brand-green",
                  },
                  {
                    label: "Total KK",
                    value: selectedRt.jumlah_kk.toLocaleString("id-ID"),
                    color: "text-brand-blue",
                  },
                  {
                    label: "Pekerjaan Dominan",
                    value: selectedRt.pekerjaan_dominan ?? "Belum ada data",
                    color: "text-brand-muted",
                    small: true,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-brand-border bg-brand-bg p-3.5"
                  >
                    <p className="mb-1.5 text-[10px] font-semibold tracking-[0.12em] text-brand-muted uppercase">
                      {item.label}
                    </p>
                    <p
                      className={`font-extrabold tracking-tight ${item.color} ${item.small ? "text-sm" : "text-[22px]"}`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
