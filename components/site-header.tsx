import Image from "next/image";
import Link from "next/link";

export function SiteHeader({ active }: { active?: "struktur" }) {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border/70 bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MojoInsight" width={28} height={28} priority />
          <span className="text-xl leading-none font-extrabold tracking-tight text-brand-green">
            Mojo<span className="font-medium text-brand-lime">Insight</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/struktur"
            className={`text-xs whitespace-nowrap transition-colors sm:text-sm ${
              active === "struktur"
                ? "border-b-2 border-brand-green pb-0.5 font-bold text-brand-green"
                : "font-semibold text-brand-ink/80 hover:text-brand-green"
            }`}
          >
            Struktur Pengurus
          </Link>
          <div className="hidden h-4 w-px bg-brand-border sm:block" />
          <Link
            href="/admin/login"
            className="rounded-[10px] border-[1.5px] border-brand-green px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-brand-green transition-colors hover:bg-brand-green hover:text-white sm:px-4 sm:text-sm"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
