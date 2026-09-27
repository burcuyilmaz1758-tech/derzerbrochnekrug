import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Der zerbrochne Krug · Lernportal Q1",
  description: "Interaktive Unterrichtseinheit zu Heinrich von Kleists Lustspiel für den Grundkurs Q1.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}</body></html>;
}
