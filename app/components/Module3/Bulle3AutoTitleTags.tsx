"use client";

import GalaxyCard from "../GalaxyCard";

type Props = {
  selectedPlatform: string;
  setSelectedPlatform: (v: string) => void;

  videoGenerated: string | null;
  generatedPrompt: string;

  youtubeTitle: string;
  setYoutubeTitle: (v: string) => void;

  youtubeTags: string;
  setYoutubeTags: (v: string) => void;
};

export default function Bulle3AutoTitleTags({
  selectedPlatform,
  videoGenerated,
  generatedPrompt,
  youtubeTitle,
  setYoutubeTitle,
  youtubeTags,
  setYoutubeTags,
}: Props) {
  const isYoutube = selectedPlatform === "youtube";

  const handleAutoMeta = () => {
    if (!generatedPrompt.trim()) return;

    if (!youtubeTitle.trim()) {
      setYoutubeTitle("🌌 AI Galaxy Short • Black Hole Vibes");
    }

    if (!youtubeTags.trim()) {
      setYoutubeTags("ai, galaxy, black hole, shorts, cinematic, cute, viral");
    }
  };

  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        🏷️ Bulle 3 — Génération auto du titre & tags
      </h3>

      {!videoGenerated && (
        <div className="mb-3 p-2 text-xs rounded border border-red-700 bg-black/40 text-red-300">
          ⚠️ Génère une vidéo avant de finaliser les metas.
        </div>
      )}

      {!isYoutube && (
        <div className="mb-3 p-2 text-xs rounded border border-purple-700 bg-black/40 text-purple-200">
          ℹ️ Metas TikTok / Insta seront adaptés plus tard.
        </div>
      )}

      <button
        onClick={handleAutoMeta}
        className="w-full mb-3 px-3 py-2 rounded font-semibold bg-purple-600 hover:bg-purple-700"
      >
        ✨ Auto-générer Title + Tags
      </button>

      <div className="text-xs opacity-70 mb-2">Titre proposé :</div>
      <div className="p-2 rounded border border-purple-800/60 bg-black/30 text-sm mb-3">
        {youtubeTitle || "—"}
      </div>

      <div className="text-xs opacity-70 mb-2">Tags proposés :</div>
      <div className="p-2 rounded border border-purple-800/60 bg-black/30 text-sm">
        {youtubeTags || "—"}
      </div>
    </GalaxyCard>
  );
}
