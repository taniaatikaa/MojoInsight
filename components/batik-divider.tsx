export function BatikDivider({
  tone = "default",
  className = "",
}: {
  tone?: "default" | "invert";
  className?: string;
}) {
  const color = tone === "invert" ? "bg-brand-lime text-brand-lime" : "bg-brand-border text-brand-border";
  const [bg, text] = color.split(" ");

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`h-px flex-1 ${bg}`} />
      {[0, 1, 2].map((i) => (
        <svg key={i} width="7" height="7" viewBox="0 0 8 8" fill="none" className={text}>
          <path d="M4 0L8 4L4 8L0 4Z" fill="currentColor" />
        </svg>
      ))}
      <div className={`h-px flex-1 ${bg}`} />
    </div>
  );
}
