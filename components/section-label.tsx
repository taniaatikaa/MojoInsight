export function SectionLabel({ num, text }: { num: string; text: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="rounded-full bg-brand-bg-alt px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-brand-green uppercase">
        {num}
      </span>
      <div className="h-px max-w-[48px] flex-1 bg-brand-border" />
      <span className="text-[11px] font-semibold tracking-[0.15em] text-brand-muted uppercase">{text}</span>
    </div>
  );
}
