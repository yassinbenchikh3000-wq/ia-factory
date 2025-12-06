"use client";

import GalaxyCard from "../GalaxyCard";
import BlackHoleDropdown from "../BlackHoleDropdown";

type Props = {
  selectedPlatform: string;
  setSelectedPlatform: (v: string) => void;

  videoGenerated: string | null;

  youtubeApiKey: string;
  youtubeTitle: string;
  youtubeTags: string;
  youtubeVisibility: string;

  autoUploadMode: boolean;
  setAutoUploadMode: (v: boolean) => void;

  uploadInterval: string;
  setUploadInterval: (v: string) => void;

  uploadStatus: string;
  uploadToYoutube: () => Promise<void> | void;
};

export default function Bulle4AutoUpload({
  selectedPlatform,
  videoGenerated,

  youtubeApiKey,
  youtubeTitle,

  autoUploadMode,
  setAutoUploadMode,

  uploadInterval,
  setUploadInterval,

  uploadStatus,
}: Props) {
  const isYoutube = selectedPlatform === "youtube";
  const ready = Boolean(videoGenerated && (!isYoutube || (youtubeApiKey.trim() && youtubeTitle.trim())));

  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        🧩 Bulle 4 — Auto Upload + Intervalle
      </h3>

      <p className="text-xs opacity-70 mb-4">
        Automatisation de l’envoi après génération vidéo.
      </p>

      <div className="flex items-center justify-between gap-3 mb-3">
        <label className="text-sm font-semibold">Mode auto</label>
        <button
          onClick={() => setAutoUploadMode(!autoUploadMode)}
          className={`
            px-3 py-1 rounded text-sm font-semibold
            ${autoUploadMode ? "bg-purple-600" : "bg-gray-700"}
          `}
        >
          {autoUploadMode ? "ON" : "OFF"}
        </button>
      </div>

      <label className="text-xs opacity-70">Intervalle</label>
      <select
        value={uploadInterval}
        onChange={(e) => setUploadInterval(e.target.value)}
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
          ⚠️ Upload auto pas prêt : vidéo manquante
          {isYoutube && " ou clé/titre YouTube manquants."}
        </div>
      )}

      {uploadStatus && (
        <div className="mt-3 text-xs opacity-80 p-2 rounded border border-purple-800/60 bg-black/30">
          {uploadStatus}
        </div>
      )}
    </GalaxyCard>
  );
}