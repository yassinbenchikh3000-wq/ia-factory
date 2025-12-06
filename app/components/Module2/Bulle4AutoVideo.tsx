"use client";

import GalaxyCard from "../GalaxyCard";

type Props = {
  autoVideoMode: boolean;
  setAutoVideoMode: (v: boolean) => void;

  videoInterval: string;
  setVideoInterval: (v: string) => void;

  selectedVideoModel: string | null;
  setSelectedVideoModel: (v: string) => void;

  generatedPrompt: string;
};

export default function Bulle4AutoVideo({
  autoVideoMode,
  setAutoVideoMode,
  videoInterval,
  setVideoInterval,
  selectedVideoModel,
  generatedPrompt,
}: Props) {
  const ready = Boolean(selectedVideoModel && generatedPrompt.trim());

  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        🤖 Bulle 4 — Auto Vidéo + Intervalle
      </h3>

      <div className="flex items-center justify-between gap-3 mb-3">
        <label className="text-sm font-semibold">Mode auto</label>
        <button
          onClick={() => setAutoVideoMode(!autoVideoMode)}
          className={`
            px-3 py-1 rounded text-sm font-semibold
            ${autoVideoMode ? "bg-purple-600" : "bg-gray-700"}
          `}
        >
          {autoVideoMode ? "ON" : "OFF"}
        </button>
      </div>

      <label className="text-xs opacity-70">Intervalle</label>
      <select
        value={videoInterval}
        onChange={(e) => setVideoInterval(e.target.value)}
        className="w-full mt-1 mb-4 p-2 rounded bg-black/40 border border-purple-700/60"
      >
        <option value="">Choisir un intervalle</option>
        <option value="10min">Toutes les 10 min</option>
        <option value="30min">Toutes les 30 min</option>
        <option value="1h">Toutes les 1h</option>
        <option value="3h">Toutes les 3h</option>
      </select>

      {!ready && (
        <div className="p-2 text-xs rounded border border-red-700 bg-black/40 text-red-300">
          ⚠️ Il faut une IA vidéo (B1) + un prompt généré (Module 1).
        </div>
      )}
    </GalaxyCard>
  );
}