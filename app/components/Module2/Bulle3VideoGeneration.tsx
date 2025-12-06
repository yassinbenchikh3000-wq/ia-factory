"use client";

import GalaxyCard from "../GalaxyCard";
import ProgressBar from "../ProgressBar";

type Props = {
  generatedPrompt: string;

  selectedVideoModel: string | null;
  setSelectedVideoModel: (v: string) => void;

  generateVideo: () => Promise<void> | void;
  videoGenerated: string | null;
  isVideoLoading: boolean;
};

export default function Bulle3VideoGeneration({
  generatedPrompt,
  selectedVideoModel,
  generateVideo,
  videoGenerated,
  isVideoLoading,
}: Props) {
  const disabled = !selectedVideoModel || !generatedPrompt.trim() || isVideoLoading;

  const pct = isVideoLoading ? 55 : videoGenerated ? 100 : 10;

  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        🎬 Bulle 3 — Génération de la vidéo
      </h3>

      <p className="text-xs opacity-70 mb-3">
        Cette bulle utilise le prompt reçu + l’IA vidéo choisie.
      </p>

      <button
        onClick={() => generateVideo()}
        disabled={disabled}
        className={`
          w-full mb-3 px-3 py-2 rounded font-semibold transition
          ${disabled ? "bg-gray-700/60 opacity-50 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
        `}
      >
        {isVideoLoading ? "⏳ Génération..." : "⚡ Générer une vidéo (DEMO)"}
      </button>

      <ProgressBar
        value={pct}
        label="État Module 2"
        hint={
          isVideoLoading
            ? "Génération en cours..."
            : videoGenerated
            ? "Vidéo détectée ✅"
            : "En attente"
        }
      />

      <div className="mt-4 p-3 rounded border border-purple-800/60 bg-black/30">
        <pre className="whitespace-pre-wrap text-xs">
          {videoGenerated || "Aucune vidéo générée pour l’instant."}
        </pre>
      </div>
    </GalaxyCard>
  );
}