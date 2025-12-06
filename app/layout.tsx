import "./globals.css";
import type { Metadata } from "next";
import { SettingsButton } from "./components/settings/SettingsButton";

export const metadata: Metadata = {
  title: "IA Video Factory",
  description: "Script → Vidéo → Upload (local first)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-black text-white">
        {/* HEADER */}
        <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 grid place-items-center shadow-sm">
                ✨
              </div>
              <div className="leading-tight">
                <div className="text-xs text-zinc-400">Générateur IA</div>
                <div className="text-lg font-semibold">IA Video Factory</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <SettingsButton />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        {/* FOOTER Optional */}
        <footer className="mt-10 border-t border-zinc-900">
          <div className="mx-auto max-w-6xl px-4 py-6 text-[10px] text-zinc-500">
            IA Video Factory — local dev first
          </div>
        </footer>
      </body>
    </html>
  );
}