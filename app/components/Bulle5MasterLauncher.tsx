"use client";

import React, { useMemo } from "react";
import GalaxyCard from "./GalaxyCard";
import ProgressBar from "./ProgressBar";

type Props = {
  // Module 1
  selectedModel: string | null;
  promptIdea: string;
  generatedPrompt: string;

  // Module 2
  selectedVideoModel: string | null;
  videoGenerated: string | null;
  isVideoLoading?: boolean;

  // Module 3
  selectedPlatform: string;
  youtubeApiKey?: string;
  youtubeTitle?: string;
  youtubeTags?: string;
  youtubeVisibility?: string;

  // Orchestration
  onLaunch: () => void;
  onStop?: () => void;

  isRunning?: boolean;
  progress?: number;
  status?: string;

  requireUploadReady?: boolean;
};

export default function Bulle5MasterLauncher({
  selectedModel,
  promptIdea,
  generatedPrompt,

  selectedVideoModel,
  videoGenerated,
  isVideoLoading = false,

  selectedPlatform,
  youtubeApiKey = "",
  youtubeTitle = "",
  youtubeVisibility = "public",

  onLaunch,
  onStop,

  isRunning = false,
  progress = 0,
  status = "",

  requireUploadReady = false,
}: Props) {
  const hasIdea = Boolean(promptIdea.trim());
  const hasTextModel = Boolean(selectedModel);
  const hasPrompt = Boolean(generatedPrompt.trim());

  const hasVideoModel = Boolean(selectedVideoModel);
  const hasVideo = Boolean(videoGenerated?.trim());

  const isYoutube = selectedPlatform === "youtube";
  const hasYTKey = Boolean(youtubeApiKey.trim());
  const hasYTTitle = Boolean(youtubeTitle.trim());

  const module1Ready = hasTextModel && hasIdea;
  const module2Ready = hasVideoModel && hasPrompt;
  const module3Ready = !isYoutube || (hasYTKey && hasYTTitle);

  const fullChainReady = useMemo(() => {
    if (!module1Ready) return false;
    if (!module2Ready) return false;
    if (requireUploadReady) return module3Ready;
    return true;
  }, [module1Ready, module2Ready, module3Ready, requireUploadReady]);

  return (
    <GalaxyCard>
      <h2 className="text-xl font-bold mb-2">
        🚀 Bulle 5 — Lancer la machine
      </h2>

      <p className="text-xs opacity-70 mb-4">
        Cette bulle est le bouton central de l’usine :
        Prompt → Vidéo → Upload.
      </p>

      <div className="mb-4 space-y-2 text-xs">
        <div className={`p-2 rounded border ${module1Ready ? "border-purple-600" : "border-red-700 text-red-300"} bg-black/30`}>
          <strong>Module 1</strong> : {hasTextModel ? "IA OK" : "IA manquante"} • {hasIdea ? "Idée OK" : "Idée manquante"}
        </div>
        <div className={`p-2 rounded border ${module2Ready ? "border-purple-600" : "border-red-700 text-red-300"} bg-black/30`}>
          <strong>Module 2</strong> : {hasVideoModel ? "IA فيديو OK" : "IA vidéo manquante"} • {hasPrompt ? "Prompt OK" : "Prompt manquant"}
        </div>
        <div className={`p-2 rounded border ${module3Ready ? "border-purple-600" : "border-red-700 text-red-300"} bg-black/30`}>
          <strong>Module 3</strong> : {isYoutube ? "YouTube" : "Autre réseau"} • {isYoutube ? (hasYTKey ? "Token/clé OK" : "Token/clé manquante") : "OK"}
        </div>
      </div>

      <ProgressBar
        value={progress}
        label="Progression usine"
        hint={status}
      />

      <div className="mt-4 flex flex-col md:flex-row gap-2">
        <button
          onClick={!isRunning && fullChainReady ? onLaunch : () => {}}
          className={`
            w-full px-4 py-2 rounded font-semibold transition
            ${
              !isRunning && fullChainReady
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-700/60 opacity-50 cursor-not-allowed"
            }
          `}
        >
          ▶️ Lancer la machine
        </button>

        <button
          onClick={isRunning && onStop ? onStop : () => {}}
          className={`
            w-full px-4 py-2 rounded font-semibold transition
            ${
              isRunning && onStop
                ? "bg-red-600/80 hover:bg-red-700"
                : "bg-gray-700/60 opacity-50 cursor-not-allowed"
            }
          `}
        >
          ⛔ Stop
        </button>
      </div>
    </GalaxyCard>
  );
}