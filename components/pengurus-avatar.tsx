import Image from "next/image";

const AVATAR_COLORS = [
  { bg: "#004617", fg: "#FFFFFF" },
  { bg: "#61B8E8", fg: "#FFFFFF" },
  { bg: "#FCC860", fg: "#1A2B1A" },
  { bg: "#005A1E", fg: "#FFFFFF" },
  { bg: "#95C658", fg: "#1A2B1A" },
  { bg: "#3D9ED6", fg: "#FFFFFF" },
];

function initials(nama: string) {
  const parts = nama.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : parts
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");
}

export function PengurusAvatar({
  nama,
  fotoUrl,
  colorIndex,
  size,
}: {
  nama: string;
  fotoUrl: string | null;
  colorIndex: number;
  size: number;
}) {
  if (fotoUrl) {
    return (
      <Image
        src={fotoUrl}
        alt={`Foto profil ${nama}`}
        width={size}
        height={size}
        className="flex-shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const { bg, fg } = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];

  return (
    <div
      role="img"
      aria-label={`Foto profil ${nama}`}
      className="flex flex-shrink-0 items-center justify-center rounded-full font-bold tracking-wide"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.round(size * 0.34) }}
    >
      {initials(nama)}
    </div>
  );
}
