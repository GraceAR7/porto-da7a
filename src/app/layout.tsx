import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Da7A | Independent Developer & Creative Designer",
  description:
    "Portfolio of Da7A: turning creative ideas into functional digital experiences through code, design, and experimentation.",
  icons: { icon: "/images/BlackLogo_Circle.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} bg-cream font-sans text-ink antialiased overflow-x-hidden`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
