"use client";

import GalaxyCard from "../GalaxyCard";

type Props = {
  generatedPrompt: string;
  selectedVideoModel: string | null;
  setSelectedVideoModel: (v: string) => void;
};

export default function Bulle2PromptReceived({
  generatedPrompt,
  selectedVideoModel,
}: Props) {
  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        📥 Bulle 2 — Prompt reçu du Module 1
      </h3>

      {!selectedVideoModel && (
        <div className="mb-3 p-2 text-xs rounded border border-red-700 bg-black/40 text-red-300">
          ⚠️ Choisis d’abord une IA vidéo (Bulle 1).
        </div>
      )}

      <div className="p-3 rounded border border-purple-800/60 bg-black/30">
        <pre className="whitespace-pre-wrap text-xs">
          {generatedPrompt || "Aucun prompt reçu pour l’instant."}
        </pre>
      </div>
    </GalaxyCard>
  );
}