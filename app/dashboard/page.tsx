"use client";

import { useState, useEffect } from "react";

/* =======================================================
   DASHBOARD — IA FACTORY (3 BLOC + AUTO-FACTORY)
   - Script Generator (multi IA)
   - Video Generator (multi IA vidéo)
   - YouTube Upload
   - Auto-Factory (script > video > upload)
======================================================== */

export default function DashboardPage() {
  /* -----------------------------------------
     LOCAL STORAGE (API Keys + auto mode + video)
  ----------------------------------------- */
  const [scriptAI, setScriptAI] = useState("openai");
  const [videoAI, setVideoAI] = useState("pika");

  const [scriptAPI, setScriptAPI] = useState("");
  const [videoAPI, setVideoAPI] = useState("");
  const [youtubeAPI, setYoutubeAPI] = useState("");
  const [youtubeToken, setYoutubeToken] = useState("");

  const [scriptText, setScriptText] = useState("");
  const [videoBase64, setVideoBase64] = useState("");
  const [autoMode, setAutoMode] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState("60");

  // Charger les données au chargement
  useEffect(() => {
    if (typeof window !== "undefined") {
      setScriptAPI(localStorage.getItem("scriptAPI") || "");
      setVideoAPI(localStorage.getItem("videoAPI") || "");
      setYoutubeAPI(localStorage.getItem("youtubeAPI") || "");
      setYoutubeToken(localStorage.getItem("youtubeToken") || "");
      setScriptAI(localStorage.getItem("scriptAI") || "openai");
      setVideoAI(localStorage.getItem("videoAI") || "pika");
      setIntervalMinutes(localStorage.getItem("interval") || "60");
    }
  }, []);

  /* -----------------------------------------
     SAVE SETTINGS
  ----------------------------------------- */
  const saveSettings = () => {
    localStorage.setItem("scriptAPI", scriptAPI);
    localStorage.setItem("videoAPI", videoAPI);
    localStorage.setItem("youtubeAPI", youtubeAPI);
    localStorage.setItem("youtubeToken", youtubeToken);
    localStorage.setItem("scriptAI", scriptAI);
    localStorage.setItem("videoAI", videoAI);
    localStorage.setItem("interval", intervalMinutes);
    alert("Settings saved !");
  };

  /* -----------------------------------------
     GENERATE SCRIPT
  ----------------------------------------- */
  async function generateScript() {
    const apiKey = localStorage.getItem("scriptAPI");
    if (!apiKey) return alert("Veuillez entrer votre API KEY Script");

    const res = await fetch("/api/generateScript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: scriptAI,
        apiKey,
      }),
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    setScriptText(data.script);

    // Envoi automatique à la vidéo (si mode auto activé)
    if (autoMode) {
      generateVideo(data.script);
    }
  }

  /* -----------------------------------------
     GENERATE VIDEO
  ----------------------------------------- */
  async function generateVideo(script: string) {
    const apiKey = localStorage.getItem("videoAPI");
    if (!apiKey) return alert("Veuillez entrer votre API Key Video");

    const res = await fetch("/api/generateVideo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: videoAI,
        apiKey,
        script,
      }),
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    setVideoBase64(data.videoBase64);

    // Auto upload vers YouTube
    if (autoMode) {
      uploadToYouTube(data.videoBase64);
    }
  }

  /* -----------------------------------------
     MANUAL VIDEO GENERATION
  ----------------------------------------- */
  function generateVideoFromUI() {
    if (!scriptText) return alert("Le script est vide.");
    generateVideo(scriptText);
  }

  /* -----------------------------------------
     UPLOAD YOUTUBE
  ----------------------------------------- */
  async function uploadToYouTube(base64?: string) {
    const apiKey = localStorage.getItem("youtubeAPI");
    const token = localStorage.getItem("youtubeToken");

    if (!apiKey || !token) {
      return alert("Veuillez entrer votre API Key + Access Token YouTube.");
    }

    const res = await fetch("/api/uploadYoutube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: token,
        videoBase64: base64 || videoBase64,
      }),
    });

    const data = await res.json();
    if (data.error) return alert("Erreur : " + data.error);

    alert("Vidéo uploadée sur YouTube !");
  }

  /* -----------------------------------------
     AUTO FACTORY — Toutes les X minutes
  ----------------------------------------- */
  useEffect(() => {
    if (!autoMode) return;

    const minutes = Number(intervalMinutes);
    if (isNaN(minutes) || minutes < 1) return;

    const interval = setInterval(() => {
      generateScript(); // → script → video → upload
    }, minutes * 60000);

    return () => clearInterval(interval);
  }, [autoMode, intervalMinutes]);

  /* -----------------------------------------
     UI — 3 BLOC + AUTO
  ----------------------------------------- */
  return (
    <div className="p-10 text-white space-y-10">
      <h1 className="text-4xl font-bold mb-4 text-pink-400">
        🚀 YaStars IA — Content Factory 24/24
      </h1>

      {/* ===================== SCRIPT GENERATOR ===================== */}
      <div className="cyber-card p-8 space-y-4">
        <h2 className="text-3xl text-pink-500 font-bold">📝 Script Generator</h2>

        {/* IA script selection */}
        <select
          className="cyber-input w-full mb-4"
          value groom="scriptAI"
          onChange={(e) => setScriptAI(e.target.value)}
        >
          <option value="openai">OpenAI GPT-5.1</option>
          <option value="claude">Claude 3.7</option>
          <option value="gemini">Gemini 2.0 Flash</option>
          <option value="mistral">Mistral Large</option>
          <option value="qwen">Qwen 2.5</option>
          <option value="deepseek">DeepSeek</option>
        </select>

        <textarea
          className="cyber-input w-full h-40"
          placeholder="Écris ton idée de vidéo…"
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
        />

        <button
          onClick={generateScript}
          className="cyber-btn w-full bg-gradient-to-r from-pink-600 to-purple-700"
        >
          🚀 Generate Script
        </button>
      </div>

      {/* ===================== VIDEO GENERATOR ===================== */}
      <div className="cyber-card p-8 space-y-4">
        <h2 className="text-3xl text-purple-400 font-bold">🎬 Video Generator</h2>

        {/* IA video select */}
        <select
          className="cyber-input w-full mb-4"
          value={videoAI}
          onChange={(e) => setVideoAI(e.target.value)}
        >
          <option value="pika">Pika 2.2</option>
          <option value="runway">Runway Gen-3</option>
          <option value="luma">Luma Dream Machine</option>
          <option value="stability">Stability Video</option>
          <option value="kling">Kling AI</option>
          <option value="veo">Google Veo 3</option>
        </select>

        <textarea
          className="cyber-input w-full h-40"
          placeholder="Ton script pour générer la vidéo…"
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
        />

        <button
          onClick={generateVideoFromUI}
          className="cyber-btn w-full bg-gradient-to-r from-purple-600 to-pink-700"
        >
          🎥 Generate Video
        </button>

        {/* VIDEO PREVIEW */}
        {videoBase64 && (
          <video
            controls
            src={`data:video/mp4;base64,${videoBase64}`}
            className="w-full rounded mt-4"
          />
        )}

        {/* DOWNLOAD */}
        {videoBase64 && (
          <a
            download="yastars-video.mp4"
            href={`data:video/mp4;base64,${videoBase64}`}
            className="cyber-btn w-full mt-4 bg-pink-700"
          >
            ⬇️ Download Video
          </a>
        )}

        {/* SEND TO YOUTUBE */}
        {videoBase64 && (
          <button
            onClick={() => uploadToYouTube(videoBase64)}
            className="cyber-btn w-full mt-4 bg-red-600"
          >
            📤 Upload to YouTube
          </button>
        )}
      </div>

      {/* ===================== YOUTUBE SETTINGS ===================== */}
      <div className="cyber-card p-8 space-y-4">
        <h2 className="text-3xl text-red-400 font-bold">📺 YouTube API</h2>

        <input
          className="cyber-input w-full mb-3"
          placeholder="YouTube API Key"
          value={youtubeAPI}
          onChange={(e) => setYoutubeAPI(e.target.value)}
        />

        <input
          className="cyber-input w-full mb-3"
          placeholder="YouTube Access Token"
          value={youtubeToken}
          onChange={(e) => setYoutubeToken(e.target.value)}
        />

        <button
          onClick={saveSettings}
          className="cyber-btn w-full bg-red-700"
        >
          💾 Save YouTube Settings
        </button>
      </div>

      {/* ===================== AUTO FACTORY ===================== */}
      <div className="cyber-card p-8 space-y-4">
        <h2 className="text-3xl text-green-400 font-bold">⚡ AUTO-FACTORY 24/24</h2>

        <input
          className="cyber-input w-full mb-3"
          value={intervalMinutes}
          onChange={(e) => setIntervalMinutes(e.target.value)}
          placeholder="Interval (minutes)"
        />

        <button
          onClick={() => setAutoMode(!autoMode)}
          className="cyber-btn w-full bg-green-600"
        >
          {autoMode ? "🛑 Stop AUTO-FACTORY" : "🚀 Activer AUTO-FACTORY"}
        </button>

        <p className="text-sm opacity-70">
          • Quand activé : Script → Vidéo → Upload → Attente {intervalMinutes} min → recommence  
        </p>
      </div>
    </div>
  );
}