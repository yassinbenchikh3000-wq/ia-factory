"use client";

import GalaxyCard from "../GalaxyCard";

type Props = {
  selectedPlatform: string;
  setSelectedPlatform: (v: string) => void;

  videoGenerated: string | null;

  youtubeApiKey: string;
  setYoutubeApiKey: (v: string) => void;

  youtubeTitle: string;
  setYoutubeTitle: (v: string) => void;

  youtubeDescription: string;
  setYoutubeDescription: (v: string) => void;

  youtubeTags: string;
  setYoutubeTags: (v: string) => void;

  youtubeVisibility: string;
  setYoutubeVisibility: (v: string) => void;

  uploadStatus: string;
  uploadToYoutube: () => Promise<void> | void;
};

export default function Bulle2SendVideo({
  selectedPlatform,
  videoGenerated,

  youtubeApiKey,
  setYoutubeApiKey,
  youtubeTitle,
  setYoutubeTitle,
  youtubeDescription,
  setYoutubeDescription,
  youtubeTags,
  setYoutubeTags,
  youtubeVisibility,
  setYoutubeVisibility,

  uploadStatus,
  uploadToYoutube,
}: Props) {
  const isYoutube = selectedPlatform === "youtube";
  const disabled = !isYoutube || !videoGenerated;

  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        📤 Bulle 2 — Envoi de la vidéo vers la plateforme
      </h3>

      {!videoGenerated && (
        <div className="mb-3 p-2 text-xs rounded border border-red-700 bg-black/40 text-red-300">
          ⚠️ Impossible d’envoyer : aucune vidéo détectée.
        </div>
      )}

      {!isYoutube && (
        <div className="mb-3 p-2 text-xs rounded border border-purple-700 bg-black/40 text-purple-200">
          ℹ️ TikTok / Instagram seront branchés après.
        </div>
      )}

      {isYoutube && (
        <div className="space-y-3">
          <input
            value={youtubeApiKey}
            onChange={(e) => setYoutubeApiKey(e.target.value)}
            placeholder="Clé API / Token (temporaire)"
            className="w-full p-2 rounded bg-black/40 border border-purple-700/60"
          />

          <input
            value={youtubeTitle}
            onChange={(e) => setYoutubeTitle(e.target.value)}
            placeholder="Titre YouTube"
            className="w-full p-2 rounded bg-black/40 border border-purple-700/60"
          />

          <textarea
            value={youtubeDescription}
            onChange={(e) => setYoutubeDescription(e.target.value)}
            placeholder="Description (optionnel)"
            className="w-full min-h-[80px] p-2 rounded bg-black/40 border border-purple-700/60"
          />

          <input
            value={youtubeTags}
            onChange={(e) => setYoutubeTags(e.target.value)}
            placeholder="Tags séparés par virgules"
            className="w-full p-2 rounded bg-black/40 border border-purple-700/60"
          />

          <select
            value={youtubeVisibility}
            onChange={(e) => setYoutubeVisibility(e.target.value)}
            className="w-full p-2 rounded bg-black/40 border border-purple-700/60"
          >
            <option value="public">Public</option>
            <option value="unlisted">Non répertoriée</option>
            <option value="private">Privée</option>
          </select>

          <button
            onClick={() => uploadToYoutube()}
            disabled={disabled}
            className={`
              w-full px-3 py-2 rounded font-semibold transition
              ${disabled ? "bg-gray-700/60 opacity-50 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
            `}
          >
            🚀 Envoyer sur YouTube (DEMO)
          </button>

          {uploadStatus && (
            <div className="text-xs opacity-80 p-2 rounded border border-purple-800/60 bg-black/30">
              {uploadStatus}
            </div>
          )}
        </div>
      )}
    </GalaxyCard>
  );
}