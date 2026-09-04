"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type FlowState = "idle" | "loading" | "error";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="flex-shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function SpinnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`flex-shrink-0 animate-spin ${className}`}>
      <circle cx="12" cy="12" r="9" strokeWidth="2.5" className="stroke-current opacity-30" />
      <path d="M12 3a9 9 0 0 1 9 9" strokeWidth="2.5" strokeLinecap="round" className="stroke-current" />
    </svg>
  );
}

function AlertBanner({ title, message }: { title: string; message: string }) {
  return (
    <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-brand-gold bg-[#FFFBEB] px-3.5 py-3">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div>
        <p className="mb-0.5 text-[13px] font-bold text-[#92400E]">{title}</p>
        <p className="text-xs leading-relaxed text-[#B45309]">{message}</p>
      </div>
    </div>
  );
}

export function AdminLoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [googleState, setGoogleState] = useState<FlowState>("idle");
  const [manualState, setManualState] = useState<FlowState>(initialError ? "error" : "idle");
  const [manualErrorMessage, setManualErrorMessage] = useState(
    initialError === "not_whitelisted" ? "Email tidak terdaftar sebagai admin. Hubungi pengurus RW." : "",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const anyLoading = googleState === "loading" || manualState === "loading";

  async function handleGoogleLogin() {
    if (anyLoading) return;
    setGoogleState("loading");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setGoogleState("error");
  }

  async function handleManualLogin(e: React.FormEvent) {
    e.preventDefault();
    if (anyLoading || !email.trim() || !password) return;

    setManualState("loading");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setManualErrorMessage("Email atau kata sandi salah.");
      setManualState("error");
      return;
    }

    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      setManualErrorMessage("Email tidak terdaftar sebagai admin. Hubungi pengurus RW.");
      setManualState("error");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <>
      {googleState === "error" && (
        <AlertBanner
          title="Gagal masuk dengan Google"
          message="Login Google belum tersedia atau email tidak terdaftar. Coba login manual atau hubungi pengurus RW."
        />
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={anyLoading}
        aria-disabled={anyLoading}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand-green px-5 py-3.5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(0,70,23,0.28),0_1px_4px_rgba(0,70,23,0.15)] transition-colors hover:enabled:bg-brand-green-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {googleState === "loading" ? <SpinnerIcon /> : <GoogleIcon />}
        {googleState === "loading" ? "Sedang masuk…" : "Masuk dengan Google"}
      </button>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-border" />
        <span className="text-[11px] font-bold tracking-[0.14em] text-brand-muted uppercase">atau</span>
        <div className="h-px flex-1 bg-brand-border" />
      </div>

      <form onSubmit={handleManualLogin} noValidate className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-[11px] font-bold tracking-[0.1em] text-brand-muted uppercase">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (manualState === "error") setManualState("idle");
            }}
            placeholder="admin@example.com"
            disabled={anyLoading}
            className="w-full rounded-[10px] border-[1.5px] border-brand-border px-3 py-2.5 text-sm text-brand-ink outline-none transition-colors focus:border-brand-green disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-[11px] font-bold tracking-[0.1em] text-brand-muted uppercase">
            Kata Sandi
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (manualState === "error") setManualState("idle");
              }}
              placeholder="••••••••"
              disabled={anyLoading}
              className={`w-full rounded-[10px] border-[1.5px] px-3 py-2.5 pr-10 text-sm text-brand-ink outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                manualState === "error" ? "border-brand-gold" : "border-brand-border focus:border-brand-green"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-brand-muted transition-colors hover:text-brand-green"
            >
              {showPassword ? (
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
          </div>

          {manualState === "error" && (
            <div role="alert" className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-xs font-semibold text-[#B45309]">{manualErrorMessage}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={anyLoading || !email.trim() || !password}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-brand-green px-5 py-3 text-sm font-bold text-brand-ink transition-colors hover:enabled:bg-brand-bg-alt disabled:cursor-not-allowed disabled:opacity-55"
        >
          {manualState === "loading" ? (
            <>
              <SpinnerIcon className="text-brand-green" />
              Memeriksa…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Masuk
            </>
          )}
        </button>
      </form>

      <p className="mt-4.5 text-center text-[11px] leading-relaxed text-brand-muted opacity-85">
        Lupa kata sandi? <span className="font-semibold text-[#3D5E3A]">Hubungi admin RW untuk reset.</span>
      </p>
    </>
  );
}
