"use client";

import { useEffect } from "react";

export function PrintTrigger() {
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="fixed top-4 right-4 z-10 rounded-full bg-brand-green px-4 py-2 text-xs font-bold text-white shadow-lg transition-colors hover:bg-brand-green-hover print:hidden"
    >
      Cetak / Simpan PDF
    </button>
  );
}
