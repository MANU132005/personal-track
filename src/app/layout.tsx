import type { Metadata } from "next";
import "./globals.css";
import { MissionProvider } from "@/context/MissionContext";

export const metadata: Metadata = {
  title: "MISSION 30 — Become Your Best Self",
  description: "Personal 30-Day Life Transformation Productivity Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <MissionProvider>
          {children}
        </MissionProvider>
      </body>
    </html>
  );
}
