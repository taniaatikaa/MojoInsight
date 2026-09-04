import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";
import { BatikDivider } from "@/components/batik-divider";
import { KAWUNG_TILE } from "@/lib/kawung-tile";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Login Admin — MojoInsight",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div
      className="relative flex flex-1 flex-col bg-brand-bg-alt bg-[length:56px_56px]"
      style={{ backgroundImage: `url("${KAWUNG_TILE}")` }}
    >
      <div className="pointer-events-none fixed inset-0 bg-brand-bg-alt/88" />

      <div className="relative z-10">
        <SiteHeader />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-[420px] overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-[0_12px_48px_rgba(0,70,23,0.13),0_3px_12px_rgba(0,70,23,0.07)]">
          <div className="h-[3px] bg-[linear-gradient(90deg,#004617_0%,#95C658_60%,#FCC860_100%)]" />

          <div className="px-9 pt-8 pb-7 max-sm:px-6">
            <div className="mb-5 flex items-baseline justify-center">
              <span className="text-[26px] leading-none font-extrabold tracking-tight text-brand-green">Mojo</span>
              <span className="text-[26px] leading-none font-medium tracking-tight text-brand-lime">Insight</span>
            </div>

            <BatikDivider />

            <div className="mt-5 mb-5.5 text-center">
              <h1 className="mb-1.5 text-[21px] font-extrabold tracking-tight text-brand-ink">Login Admin</h1>
              <p className="mx-auto max-w-[270px] text-[13px] leading-relaxed text-brand-muted">
                Khusus pengurus RT/RW yang terdaftar.
              </p>
            </div>

            <AdminLoginForm initialError={error} />
          </div>

          <div className="flex items-center justify-center border-t border-brand-bg-alt bg-[#FAFCF8] px-9 py-3.5">
            <Link
              href="/"
              className="text-xs font-medium text-brand-muted transition-colors hover:text-brand-green"
            >
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
