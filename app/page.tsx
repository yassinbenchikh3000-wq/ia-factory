"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

// ✅ AJOUT SettingsPro
import {
  fetchSettings,
  getTextApiKey,
  getVideoApiKey,
  getUploadApiKey,
} from "./lib/settingsClient";

// =====================
// MODULE 1
// =====================
import Bulle1ModelText from "./components/Module1/Bulle1ModelText";
import Bulle2IdeaInput from "./components/Module1/Bulle2IdeaInput";
import Bulle3GeneratedPrompt from "./components/Module1/Bulle3GeneratedPrompt";
import Bulle4AutoPrompt from "./components/Module1/Bulle4AutoPrompt";

// =====================
// MODULE 2
// =====================
import Bulle1VideoModel from "./components/Module2/Bulle1VideoModel";
import Bulle2PromptReceived from "./components/Module2/Bulle2PromptReceived";
import Bulle3VideoGeneration from "./components/Module2/Bulle3VideoGeneration";
import Bulle4AutoVideo from "./components/Module2/Bulle4AutoVideo";

// =====================
// MODULE 3
// =====================
import Bulle1ChoosePlatform from "./components/Module3/Bulle1ChoosePlatform";
import Bulle2SendVideo from "./components/Module3/Bulle2SendVideo";
import Bulle3AutoTitleTags from "./components/Module3/Bulle3AutoTitleTags";
import Bulle4AutoUpload from "./components/Module3/Bulle4AutoUpload";

// =====================
// BULLE 5
// =====================
import Bulle5MasterLauncher from "./components/Bulle5MasterLauncher";

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ✅ AJOUT SettingsPro types locaux (pour affichage/état)
type TextProvider =
  | "openai"
  | "google"
  | "anthropic"
  | "mistral"
  | "meta"
  | "qwen"
  | "deepseek";

type VideoProvider =
  | "sora"
  | "veo"
  | "pika"
  | "runway"
  | "stability"
  | "luma"
  | "fal";

type UploadPlatform = "youtube" | "tiktok" | "instagram";

export default function HomePage() {
  // ==================================================
  // MODULE 1 STATE (existant)
  // ==================================================
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [promptIdea, setPromptIdea] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const [autoPromptMode, setAutoPromptMode] = useState(false);
  const [promptInterval, setPromptInterval] = useState("");

  // ==================================================
  // MODULE 2 STATE (existant)
  // ==================================================
  const [selectedVideoModel, setSelectedVideoModel] = useState<string | null>(
    null
  );
  const [videoGenerated, setVideoGenerated] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const [autoVideoMode, setAutoVideoMode] = useState(false);
  const [videoInterval, setVideoInterval] = useState("");

  // ==================================================
  // MODULE 3 STATE (existant)
  // ==================================================
  const [selectedPlatform, setSelectedPlatform] = useState<
    "youtube" | "tiktok" | "instagram"
  >("youtube");

  // (existant) gardé pour compat avec tes bulles actuelles
  const [youtubeApiKey, setYoutubeApiKey] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeDescription, setYoutubeDescription] = useState("");
  const [youtubeTags, setYoutubeTags] = useState("");
  const [youtubeVisibility, setYoutubeVisibility] = useState<
    "public" | "unlisted" | "private"
  >("public");

  const [uploadStatus, setUploadStatus] = useState("");

  const [autoUploadMode, setAutoUploadMode] = useState(false);
  const [uploadInterval, setUploadInterval] = useState("");

  // ==================================================
  // ✅ AJOUT SettingsPro : état de routage lu depuis /settings
  // (on n'enlève rien, on ajoute simplement ces states)
  // ==================================================
  const [module1Provider, setModule1Provider] =
    useState<TextProvider>("openai");
  const [module2Provider, setModule2Provider] =
    useState<VideoProvider>("sora");
  const [module3Platform, setModule3Platform] =
    useState<UploadPlatform>("youtube");

  // Optionnel : garder un snapshot settings pour affichage rapide
  const settingsRef = useRef<any>(null);

  // ==================================================
  // MASTER ORCHESTRATION (existant)
  // ==================================================
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const cancelRef = useRef(false);

  // ==================================================
  // ✅ AJOUT SettingsPro : charger settings au démarrage
  // et injecter des defaults sans casser ton UI
  // ==================================================
  useEffect(() => {
    (async () => {
      try {
        const s = await fetchSettings();
        settingsRef.current = s;

        setModule1Provider((s.module1Provider ?? "openai") as TextProvider);
        setModule2Provider((s.module2Provider ?? "sora") as VideoProvider);
        setModule3Platform((s.module3Platform ?? "youtube") as UploadPlatform);

        // On garde tes states mais on hydrate si vide
        if (!selectedPlatform && s.module3Platform) {
          setSelectedPlatform(s.module3Platform);
        }

        // Si tu préfères que la clé YT soit tirée automatiquement
        // sans supprimer les champs existants :
        const uploadKey = getUploadApiKey(s);
        if (!youtubeApiKey && typeof uploadKey === "string") {
          setYoutubeApiKey(uploadKey);
        }
      } catch {
        // si settings pas encore prêts, rien ne casse
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==================================================
  // ACTIONS (existant + ✅ AJOUT SettingsPro)
  // ==================================================

  // ✅ AJOUT: version async qui lit provider + clé depuis Settings
  const generatePrompt = useCallback(async () => {
    const s = await fetchSettings().catch(() => settingsRef.current ?? {});
    settingsRef.current = s;

    const provider = (s.module1Provider ?? module1Provider) as TextProvider;
    const apiKey = getTextApiKey(s);

    // on garde ton comportement actuel
    if (!selectedModel || !promptIdea.trim()) return;

    const out =
      `🎯 Prompt optimisé (DEMO)\n` +
      `Provider (Settings): ${provider}\n` +
      `Clé détectée: ${apiKey ? "OK" : "MANQUANTE"}\n` +
      `Modèle texte (UI): ${selectedModel}\n\n` +
      `Idée:\n${promptIdea}\n\n` +
      `Style:\n` +
      `galaxy, black hole ambience, cinematic light, high detail, 9:16, 12-15s.`;

    setGeneratedPrompt(out);
  }, [selectedModel, promptIdea, module1Provider]);

  const generateVideo = useCallback(async () => {
    const s = await fetchSettings().catch(() => settingsRef.current ?? {});
    settingsRef.current = s;

    const provider = (s.module2Provider ?? module2Provider) as VideoProvider;
    const apiKey = getVideoApiKey(s);

    if (!selectedVideoModel || !generatedPrompt.trim()) return;

    try {
      setIsVideoLoading(true);
      await sleep(700);

      const fakeVideo =
        `🎬 Vidéo générée (DEMO)\n` +
        `Provider (Settings): ${provider}\n` +
        `Clé détectée: ${apiKey ? "OK" : "MANQUANTE"}\n` +
        `IA vidéo (UI): ${selectedVideoModel}\n` +
        `Prompt: OK\n` +
        `Statut: prête`;

      setVideoGenerated(fakeVideo);
    } finally {
      setIsVideoLoading(false);
    }
  }, [selectedVideoModel, generatedPrompt, module2Provider]);

  const uploadToYoutube = useCallback(async () => {
    const s = await fetchSettings().catch(() => settingsRef.current ?? {});
    settingsRef.current = s;

    const platform = (s.module3Platform ?? module3Platform) as UploadPlatform;
    const apiKey = getUploadApiKey(s);

    // On garde tes states existants, mais on ajoute l'intelligence Settings
    const effectivePlatform = selectedPlatform ?? platform;
    const effectiveKey = youtubeApiKey || apiKey;

    if (effectivePlatform !== "youtube") {
      setUploadStatus("ℹ️ TikTok / Instagram seront branchés plus tard.");
      return;
    }

    if (!videoGenerated) {
      setUploadStatus("❌ Aucune vidéo détectée.");
      return;
    }

    if (!effectiveKey?.trim()) {
      setUploadStatus("⚠️ Mets ton token/clé dans Settings.");
      return;
    }

    try {
      setUploadStatus("⏳ Upload YouTube (DEMO)...");
      await sleep(700);

      setUploadStatus(
        "✅ DEMO OK. Maintenant l’upload lit bien la plateforme + clé depuis Settings."
      );
    } catch (e: any) {
      setUploadStatus(`❌ Erreur upload: ${e?.message ?? "unknown"}`);
    }
  }, [selectedPlatform, videoGenerated, youtubeApiKey, module3Platform]);

  // ==================================================
  // MASTER FLOW: Prompt → Video → Upload
  // ==================================================
  const onLaunch = useCallback(async () => {
    if (isRunning) return;

    cancelRef.current = false;
    setIsRunning(true);
    setProgress(0);
    setStatus("Démarrage de la machine...");

    try {
      // STEP 1: Prompt
      setStatus("Module 1: génération du prompt...");
      setProgress(10);
      await sleep(150);

      await generatePrompt();
      await sleep(250);
      setProgress(35);

      if (cancelRef.current) return;

      // STEP 2: Video
      setStatus("Module 2: génération de la vidéo...");
      setProgress(45);

      await generateVideo();
      setProgress(75);

      if (cancelRef.current) return;

      // STEP 3: Upload
      setStatus("Module 3: préparation upload...");
      setProgress(85);
      await sleep(150);

      await uploadToYoutube();

      setProgress(100);
      setStatus("✅ Machine terminée (DEMO).");
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, generatePrompt, generateVideo, uploadToYoutube]);

  const onStop = useCallback(() => {
    cancelRef.current = true;
    setIsRunning(false);
    setStatus("⛔ Machine stoppée.");
  }, []);

  // ==================================================
  // UI
  // ==================================================
  return (
    <main className="min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold space-title">
          IA Factory — Module 1 → 2 → 3
        </h2>
        <p className="text-xs opacity-70">
          Style galaxie / trou noir • SettingsPro connecté
        </p>
        {/* ✅ AJOUT léger d’info d’état (sans changer les modules) */}
        <p className="text-[10px] opacity-60 mt-1">
          Providers (Settings) : M1={module1Provider} • M2={module2Provider} •
          M3={module3Platform}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* =========================
            COL 1 : MODULE 1
        ========================= */}
        <section className="space-y-6">
          <div className="text-xs uppercase tracking-widest opacity-60">
            Auto Prompte — Module 1
          </div>

          <Bulle1ModelText
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />

          <Bulle2IdeaInput
            promptIdea={promptIdea}
            setPromptIdea={setPromptIdea}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />

          <Bulle3GeneratedPrompt
            generatedPrompt={generatedPrompt}
            generatePrompt={generatePrompt}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            promptIdea={promptIdea}
          />

          <Bulle4AutoPrompt
            autoPromptMode={autoPromptMode}
            setAutoPromptMode={setAutoPromptMode}
            promptInterval={promptInterval}
            setPromptInterval={setPromptInterval}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            promptIdea={promptIdea}
            generatedPrompt={generatedPrompt}
          />
        </section>

        {/* =========================
            COL 2 : MODULE 2
        ========================= */}
        <section className="space-y-6">
          <div className="text-xs uppercase tracking-widest opacity-60">
            Auto Vidéo — Module 2
          </div>

          <Bulle1VideoModel
            selectedVideoModel={selectedVideoModel}
            setSelectedVideoModel={setSelectedVideoModel}
          />

          <Bulle2PromptReceived
            generatedPrompt={generatedPrompt}
            selectedVideoModel={selectedVideoModel}
            setSelectedVideoModel={setSelectedVideoModel}
          />

          <Bulle3VideoGeneration
            generatedPrompt={generatedPrompt}
            selectedVideoModel={selectedVideoModel}
            setSelectedVideoModel={setSelectedVideoModel}
            generateVideo={generateVideo}
            videoGenerated={videoGenerated}
            isVideoLoading={isVideoLoading}
          />

          <Bulle4AutoVideo
            autoVideoMode={autoVideoMode}
            setAutoVideoMode={setAutoVideoMode}
            videoInterval={videoInterval}
            setVideoInterval={setVideoInterval}
            selectedVideoModel={selectedVideoModel}
            setSelectedVideoModel={setSelectedVideoModel}
            generatedPrompt={generatedPrompt}
          />
        </section>

        {/* =========================
            COL 3 : MODULE 3
        ========================= */}
        <section className="space-y-6">
          <div className="text-xs uppercase tracking-widest opacity-60">
            Auto Poste — Module 3
          </div>

          <Bulle1ChoosePlatform
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            videoGenerated={videoGenerated}
          />

          <Bulle2SendVideo
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            videoGenerated={videoGenerated}
            youtubeApiKey={youtubeApiKey}
            setYoutubeApiKey={setYoutubeApiKey}
            youtubeTitle={youtubeTitle}
            setYoutubeTitle={setYoutubeTitle}
            youtubeDescription={youtubeDescription}
            setYoutubeDescription={setYoutubeDescription}
            youtubeTags={youtubeTags}
            setYoutubeTags={setYoutubeTags}
            youtubeVisibility={youtubeVisibility}
            setYoutubeVisibility={setYoutubeVisibility}
            uploadStatus={uploadStatus}
            uploadToYoutube={uploadToYoutube}
          />

          <Bulle3AutoTitleTags
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            videoGenerated={videoGenerated}
            generatedPrompt={generatedPrompt}
            youtubeTitle={youtubeTitle}
            setYoutubeTitle={setYoutubeTitle}
            youtubeTags={youtubeTags}
            setYoutubeTags={setYoutubeTags}
          />

          <Bulle4AutoUpload
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            videoGenerated={videoGenerated}
            youtubeApiKey={youtubeApiKey}
            youtubeTitle={youtubeTitle}
            youtubeTags={youtubeTags}
            youtubeVisibility={youtubeVisibility}
            autoUploadMode={autoUploadMode}
            setAutoUploadMode={setAutoUploadMode}
            uploadInterval={uploadInterval}
            setUploadInterval={setUploadInterval}
            uploadStatus={uploadStatus}
            uploadToYoutube={uploadToYoutube}
          />
        </section>
      </div>

      {/* =========================
          BULLE 5 : LAUNCHER GLOBAL
      ========================= */}
      <div className="mt-10">
        <Bulle5MasterLauncher
          selectedModel={selectedModel}
          promptIdea={promptIdea}
          generatedPrompt={generatedPrompt}
          selectedVideoModel={selectedVideoModel}
          videoGenerated={videoGenerated}
          isVideoLoading={isVideoLoading}
          selectedPlatform={selectedPlatform}
          youtubeApiKey={youtubeApiKey}
          youtubeTitle={youtubeTitle}
          youtubeTags={youtubeTags}
          youtubeVisibility={youtubeVisibility}
          onLaunch={onLaunch}
          onStop={onStop}
          isRunning={isRunning}
          progress={progress}
          status={status}
          requireUploadReady={false}
        />
      </div>
    </main>
  );
}