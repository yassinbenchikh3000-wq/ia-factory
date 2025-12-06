"use client";

import GalaxyCard from "../GalaxyCard";
import ProgressBar from "../ProgressBar";

type Props = {
  autoPromptMode: boolean;
  setAutoPromptMode: (v: boolean) => void;

  promptInterval: string;
  setPromptInterval: (v: string) => void;

  selectedModel: string | null;
  setSelectedModel: (v: string) => void;

  promptIdea: string;
  generatedPrompt: string;
};

export default function Bulle4AutoPrompt({
  autoPromptMode,
  setAutoPromptMode,
  promptInterval,
  setPromptInterval,
  selectedModel,
  promptIdea,
  generatedPrompt,
}: Props) {
  const ready = Boolean(selectedModel && promptIdea.trim());
  const fakePct = ready ? (generatedPrompt ? 100 : 55) : 15;

  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        🛰️ Bulle 4 — Auto Prompt + Intervalle
      </h3>

      <p className="text-xs opacity-70 mb-4">
        Active une génération automatique basée sur un intervalle.
      </p>

      <div className="flex items-center justify-between gap-3 mb-3">
        <label className="text-sm font-semibold">Mode auto</label>
        <button
          onClick={() => setAutoPromptMode(!autoPromptMode)}
          className={`
            px-3 py-1 rounded text-sm font-semibold
            ${autoPromptMode ? "bg-purple-600" : "bg-gray-700"}
          `}
        >
          {autoPromptMode ? "ON" : "OFF"}
        </button>
      </div>

      <label className="text-xs opacity-70">Intervalle</label>
      <select
        value={promptInterval}
        onChange={(e) => setPromptInterval(e.target.value)}
        className="w-full mt-1 mb-4 p-2 rounded bg-black/40 border border-purple-700/60"
      >
        <option value="">Choisir un intervalle</option>
        <option value="10min">Toutes les 10 min</option>
        <option value="30min">Toutes les 30 min</option>
        <option value="1h">Toutes les 1h</option>
        <option value="3h">Toutes les 3h</option>
      </select>

      {!ready && (
        <div className="mb-3 p-2 text-xs rounded border border-red-700 bg-black/40 text-red-300">
          ⚠️ Il faut une IA (B1) + une idée (B2) pour activer l’automatisation proprement.
        </div>
      )}

      <ProgressBar
        value={fakePct}
        label="État Module 1"
        hint={generatedPrompt ? "Prompt prêt ✅" : "En attente de génération"}
      />
    </GalaxyCard>
  );
}