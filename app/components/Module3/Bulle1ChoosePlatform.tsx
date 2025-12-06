"use client";

import GalaxyCard from "../GalaxyCard";

type Props = {
  selectedPlatform: string;
  setSelectedPlatform: (v: string) => void;
  videoGenerated: string | null;
};

export default function Bulle1ChoosePlatform({
  selectedPlatform,
  setSelectedPlatform,
  videoGenerated,
}: Props) {
  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        🌍 Bulle 1 — Choix du réseau
      </h3>

      <p className="text-xs opacity-70 mb-4">
        Pour l’instant on fait un choix simple (1 plateforme).  
        On passera au multi-choix après.
      </p>

      {!videoGenerated && (
        <div className="mb-3 p-2 text-xs rounded border border-red-700 bg-black/40 text-red-300">
          ⚠️ Aucune vidéo détectée du Module 2.
        </div>
      )}

      <select
        value={selectedPlatform}
        onChange={(e) => setSelectedPlatform(e.target.value)}
        className="w-full p-2 rounded bg-black/40 border border-purple-700/60"
      >
        <option value="youtube">YouTube Shorts</option>
        <option value="tiktok">TikTok</option>
        <option value="instagram">Instagram Reels</option>
      </select>
    </GalaxyCard>
  );
}