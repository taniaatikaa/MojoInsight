"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type FlowState = "idle" | "loading" | "error" | "success";

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="flex-shrink-0 animate-spin">
      <circle cx="12" cy="12" r="9" strokeWidth="2.5" className="stroke-current opacity-30" />
      <path d="M12 3a9 9 0 0 1 9 9" strokeWidth="2.5" strokeLinecap="round" className="stroke-current" />
    </svg>
  );
}

function EyeToggle({ shown, onClick }: { shown: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={shown ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      className="absolute top-1/2 right-2.5 -translate-y-1/2 text-brand-muted transition-colors hover:text-brand-green"
    >
      {shown ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )}
    </button>
  );
}

export function ChangePasswordForm() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<FlowState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;

    if (password.length < 6) {
      setState("error");
      setMessage("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setState("error");
      setMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setState("loading");
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setState("error");
      setMessage(error.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setState("success");
    setMessage("Kata sandi berhasil diubah.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="new-password" className="text-[11px] font-bold tracking-[0.1em] text-brand-muted uppercase">
          Kata Sandi Baru
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (state !== "loading") setState("idle");
            }}
            placeholder="Minimal 6 karakter"
            className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 pr-10 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
          />
          <EyeToggle shown={showPassword} onClick={() => setShowPassword((s) => !s)} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm-password" className="text-[11px] font-bold tracking-[0.1em] text-brand-muted uppercase">
          Konfirmasi Kata Sandi Baru
        </label>
        <input
          id="confirm-password"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (state !== "loading") setState("idle");
          }}
          placeholder="Ulangi kata sandi baru"
          className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green"
        />
      </div>

      {state === "error" && (
        <div role="alert" className="rounded-lg border border-brand-gold bg-[#FFFBEB] px-3.5 py-2.5 text-[13px] font-semibold text-[#92400E]">
          {message}
        </div>
      )}
      {state === "success" && (
        <div role="status" className="rounded-lg border border-brand-green/30 bg-brand-bg-alt px-3.5 py-2.5 text-[13px] font-semibold text-brand-green">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading" || !password || !confirmPassword}
        className="flex w-fit items-center justify-center gap-2 rounded-[10px] bg-brand-green px-6 py-2.5 text-sm font-bold text-white shadow-[0_3px_12px_rgba(0,70,23,0.28)] transition-colors hover:enabled:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === "loading" && <SpinnerIcon />}
        {state === "loading" ? "Menyimpan…" : "Simpan Kata Sandi"}
      </button>
    </form>
  );
}
