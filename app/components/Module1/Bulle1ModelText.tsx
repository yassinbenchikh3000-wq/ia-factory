"use client";

import GalaxyCard from "../GalaxyCard";
import BlackHoleDropdown from "../BlackHoleDropdown";

type Props = {
  selectedModel: string | null;
  setSelectedModel: (v: string) => void;
};

export default function Bulle1ModelText({ selectedModel, setSelectedModel }: Props) {
  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        🧠 Bulle 1 — Choix de l’IA génératrice de prompt
      </h3>

      <p className="text-xs opacity-70 mb-4">
        Sélectionne une IA texte. Cette sélection pilote tout le Module 1.
      </p>

      <div className="mb-4">
        <BlackHoleDropdown
          onSelect={(model: string) => setSelectedModel(model)}
        />
      </div>

      <div className="text-sm">
        <span className="opacity-70">Modèle choisi :</span>{" "}
        <strong className={selectedModel ? "text-white" : "text-red-300"}>
          {selectedModel ?? "Aucun"}
        </strong>
      </div>
    </GalaxyCard>
  );
}