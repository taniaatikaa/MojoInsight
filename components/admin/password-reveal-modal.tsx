"use client";

import { useEffect, useState } from "react";

function IconCopy() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function PasswordRevealModal({
  email,
  password,
  onClose,
}: {
  email: string;
  password: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center overflow-y-auto bg-[rgba(10,24,10,0.52)] p-4 backdrop-blur-[3px]"
      aria-label="Kata sandi baru"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Kata sandi baru"
        className="relative w-full max-w-[420px] overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.22),0_6px_24px_rgba(0,70,23,0.12)]"
      >
        <div className="absolute top-0 right-0 left-0 h-[3px] bg-[linear-gradient(90deg,#004617_0%,#95C658_55%,#FCC860_100%)]" />

        <div className="px-6 pt-6 pb-5">
          <h2 className="mb-1 text-lg font-extrabold tracking-tight text-brand-ink">Kata Sandi Berhasil Dibuat</h2>
          <p className="mb-4 text-[13px] text-brand-muted">
            Untuk <span className="font-semibold text-brand-ink">{email}</span>. Simpan atau kirim sekarang,
            kata sandi ini tidak akan ditampilkan lagi setelah ditutup.
          </p>

          <div className="flex items-center gap-2 rounded-[10px] border-[1.5px] border-brand-border bg-brand-bg-alt px-3 py-2.5">
            <code className="flex-1 truncate text-sm font-bold tracking-wide text-brand-ink">{password}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-brand-border bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-green transition-colors hover:border-brand-green"
            >
              <IconCopy />
              {copied ? "Tersalin" : "Salin"}
            </button>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-end border-t border-brand-bg-alt px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] bg-brand-green px-6 py-2.5 text-sm font-bold text-white shadow-[0_3px_12px_rgba(0,70,23,0.28)] transition-colors hover:bg-brand-green-hover"
          >
            Sudah Disimpan, Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
