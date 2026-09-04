import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MojoInsight — Data Kependudukan Dusun Mojo",
  description:
    "Sistem informasi kependudukan resmi Dusun Mojo, RW 13, Desa Ngeposari, Gunung Kidul.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-brand-bg font-sans text-brand-ink">
        {children}
      </body>
    </html>
  );
}
