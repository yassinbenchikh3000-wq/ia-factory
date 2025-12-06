"use client";

import GalaxyCard from "../GalaxyCard";
import BlackHoleDropdown from "../BlackHoleDropdown";

type Props = {
  selectedVideoModel: string | null;
  setSelectedVideoModel: (v: string) => void;
};

export default function Bulle1VideoModel({
  selectedVideoModel,
  setSelectedVideoModel,
}: Props) {
  return (
    <GalaxyCard>
      <h3 className="text-lg font-bold mb-2">
        🎥 Bulle 1 — Choix de l’IA génératrice de vidéos
      </h3>

      <p className="text-xs opacity-70 mb-4">
        Sélection vidéo. Cette IA sera alimentée par le prompt du Module 1.
      </p>

      <BlackHoleDropdown onSelect={(model: string) => setSelectedVideoModel(model)} />

      <div className="mt-4 text-sm">
        <span className="opacity-70">IA vidéo choisie :</span>{" "}
        <strong className={selectedVideoModel ? "text-white" : "text-red-300"}>
          {selectedVideoModel ?? "Aucune"}
        </strong>
      </div>
    </GalaxyCard>
  );
}