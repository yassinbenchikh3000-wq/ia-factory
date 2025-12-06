"use client";

import GalaxyCard from "../GalaxyCard";

type Props = {
  promptIdea: string;
  setPromptIdea: (v: string) => void;

  // Liaison visuelle avec bulle 1
  selectedModel: string | null;
  setSelectedModel: (v: string) => void;
};

export default function Bulle2IdeaInput({
  promptIdea,
  setPromptIdea,
  selectedModel,
}: Props) {
  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        ✍️ Bulle 2 — Saisir l’idée du prompt à générer
      </h3>

      <p className="text-xs opacity-70 mb-4">
        L’idée alimente la génération du prompt optimisé.
      </p>

      {!selectedModel && (
        <div className="mb-3 p-2 text-xs rounded border border-red-700 bg-black/40 text-red-300">
          ⚠️ Choisis d’abord une IA dans la Bulle 1.
        </div>
      )}

      <textarea
        value={promptIdea}
        onChange={(e) => setPromptIdea(e.target.value)}
        placeholder="Ex: Un chat astronaut qui découvre un trou noir lumineux..."
        className="
          w-full min-h-[110px]
          rounded-lg p-3
          bg-black/40 border border-purple-700/60
          outline-none
        "
      />

      <div className="mt-2 text-[10px] opacity-60">
        Astuce : plus ton idée est précise, plus le prompt final est fort.
      </div>
    </GalaxyCard>
  );
}