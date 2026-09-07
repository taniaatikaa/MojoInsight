"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { KAWUNG_TILE } from "@/lib/kawung-tile";

type NavKey = "kk" | "mutasi" | "struktur" | "akun" | "settings";

const NAV_ITEMS: { key: NavKey; href: string; label: string }[] = [
  { key: "kk", href: "/admin", label: "Data KK" },
  { key: "mutasi", href: "/admin/mutasi", label: "Log Mutasi" },
  { key: "struktur", href: "/admin/struktur", label: "Struktur Pengurus" },
  { key: "akun", href: "/admin/akun", label: "Kelola Akun" },
  { key: "settings", href: "/admin/settings", label: "Pengaturan Akun" },
];

const PAGE_TITLES: Record<NavKey, string> = {
  kk: "Data Kartu Keluarga",
  mutasi: "Log Mutasi",
  struktur: "Struktur Pengurus",
  akun: "Kelola Akun Admin",
  settings: "Pengaturan Akun",
};

function navKeyFromPath(pathname: string): NavKey {
  if (pathname.startsWith("/admin/mutasi")) return "mutasi";
  if (pathname.startsWith("/admin/struktur")) return "struktur";
  if (pathname.startsWith("/admin/akun")) return "akun";
  if (pathname.startsWith("/admin/settings")) return "settings";
  return "kk";
}

function getInitials(email: string) {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  const chars = parts.length >= 2 ? [parts[0]?.[0], parts[1]?.[0]] : [local[0], local[1]];
  return (chars.filter(Boolean).join("") || "?").toUpperCase();
}

function NavIcon({ navKey }: { navKey: NavKey }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (navKey === "kk") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="9" x2="9" y2="21" />
      </svg>
    );
  }
  if (navKey === "mutasi") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 15.5" />
      </svg>
    );
  }
  if (navKey === "settings") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  if (navKey === "akun") {
    return (
      <svg {...common}>
        <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5l-8-3z" />
        <path d="M9.5 12l2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function RoleBadge({ isSuperAdmin, rtId }: { isSuperAdmin: boolean; rtId: number | null }) {
  if (isSuperAdmin) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-2.5 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap text-white uppercase">
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-lime" />
        Super Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-2.5 py-1 text-[10px] font-bold tracking-wider whitespace-nowrap text-brand-ink uppercase">
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D97706]" />
      Admin RT {String(rtId ?? "-").padStart(2, "0")}
    </span>
  );
}

function AdminAvatar({ initials, size = 36 }: { initials: string; size?: number }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full border-2 border-[#D0E3C4] bg-[linear-gradient(135deg,#004617_0%,#005A1E_100%)] font-extrabold text-white"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
}

export function AdminShell({
  email,
  isSuperAdmin,
  rtId,
  isAccountManager,
  children,
}: {
  email: string;
  isSuperAdmin: boolean;
  rtId: number | null;
  isAccountManager: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeNav = navKeyFromPath(pathname);
  const initials = getInitials(email);
  const navItems = NAV_ITEMS.filter((item) => item.key !== "akun" || isAccountManager);

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col overflow-hidden bg-brand-green transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundImage: `url("${KAWUNG_TILE}")`, backgroundSize: "56px 56px" }}
        aria-label="Navigasi admin"
      >
        <div className="absolute inset-0 bg-[rgba(0,50,15,0.88)]" />

        <div className="relative flex h-full flex-col">
          <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-white/10 px-5">
            <span className="flex items-baseline">
              <span className="text-[19px] font-extrabold tracking-tight text-white">Mojo</span>
              <span className="text-[19px] font-medium tracking-tight text-brand-lime">Insight</span>
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg bg-white/10 p-1.5 text-white/80 lg:hidden"
              aria-label="Tutup menu"
            >
              <IconX />
            </button>
          </div>

          <p className="px-5 pt-5 pb-2 text-[9px] font-bold tracking-[0.2em] text-[rgba(149,198,88,0.6)] uppercase">
            Menu Utama
          </p>

          <nav className="flex flex-1 flex-col gap-0.5 px-3">
            {navItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`relative flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-white/13 font-bold text-white"
                      : "font-medium text-white/60 hover:bg-white/7 hover:text-white/85"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r-[2px] bg-brand-lime" />
                  )}
                  <span className={isActive ? "text-brand-lime" : "text-white/50"}>
                    <NavIcon navKey={item.key} />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-5 pb-3">
            <div className="h-px bg-white/10" />
          </div>

          <div className="flex-shrink-0 px-3 pb-5">
            <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white/7 p-3">
              <AdminAvatar initials={initials} size={34} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-white">{email}</p>
                <div className="mt-1.5">
                  <RoleBadge isSuperAdmin={isSuperAdmin} rtId={rtId} />
                </div>
              </div>
            </div>
            <AdminLogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[60px] flex-shrink-0 items-center gap-3 border-b border-brand-border bg-white px-5 shadow-[0_1px_6px_rgba(0,70,23,0.06)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1 text-brand-ink lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <IconMenu />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <span className="text-[11px] font-medium whitespace-nowrap text-brand-muted">Admin</span>
            <span className="text-brand-border">/</span>
            <span className="truncate text-[13px] font-bold text-brand-ink">{PAGE_TITLES[activeNav]}</span>
          </div>

          <div className="hidden items-center gap-2.5 sm:flex">
            <RoleBadge isSuperAdmin={isSuperAdmin} rtId={rtId} />
            <AdminAvatar initials={initials} size={32} />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
