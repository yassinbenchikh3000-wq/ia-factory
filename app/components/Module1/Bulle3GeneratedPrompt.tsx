"use client";

import GalaxyCard from "../GalaxyCard";

type Props = {
  generatedPrompt: string;
  generatePrompt: () => void;

  selectedModel: string | null;
  setSelectedModel: (v: string) => void;

  promptIdea: string;
};

export default function Bulle3GeneratedPrompt({
  generatedPrompt,
  generatePrompt,
  selectedModel,
  promptIdea,
}: Props) {
  const disabled = !selectedModel || !promptIdea.trim();

  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        🧾 Bulle 3 — Prompt généré (résultat)
      </h3>

      <p className="text-xs opacity-70 mb-3">
        La Bulle 3 reçoit l’IA (B1) + l’idée (B2) pour générer un prompt prêt vidéo.
      </p>

      <button
        onClick={generatePrompt}
        disabled={disabled}
        className={`
          w-full mb-3 px-3 py-2 rounded font-semibold transition
          ${disabled ? "bg-gray-700/60 opacity-50 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
        `}
      >
        ⚡ Générer le prompt
      </button>

      <div className="p-3 rounded border border-purple-800/60 bg-black/30">
        <pre className="whitespace-pre-wrap text-xs">
          {generatedPrompt || "Aucun prompt généré pour l’instant."}
        </pre>
      </div>
    </GalaxyCard>
  );
}
