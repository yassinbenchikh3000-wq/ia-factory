import "./globals.css";
import "./styles/cyber-theme.css";

export const metadata = {
  title: "YaStars IA",
  description: "Plateforme IA automatique",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="cyber-grid min-h-screen w-full">
        
        {/* SCANLINE */}
        <div className="scanline"></div>

        {/* WRAPPER */}
        <div className="p-8">
          
          {/* HEADER */}
          <header className="flex items-center gap-4 mb-10">
            <img
              src="/logos/yastars.png"
              alt="YaStars Logo"
              className="w-16 h-16 rounded-full shadow-lg"
            />

            <h1 className="text-4xl font-bold text-pink-500 drop-shadow-lg">
              YaStars IA 🚀
            </h1>
          </header>

          {/* CONTENU DE LA PAGE */}
          {children}
        </div>

      </body>
    </html>
  );
}