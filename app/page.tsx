"use client";

import { useState } from "react";
import Image from "next/image";
import { getApiKey, setApiKey } from "@/lib/userConfig";

export default function Dashboard() {
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [videoAPI, setVideoAPI] = useState("");
  const [model, setModel] = useState("openai");
  const [videoProvider, setVideoProvider] = useState("veo");

  const handleSaveApi = () => {
    setApiKey(apiKey);
    alert("API Key saved successfully!");
  };

  return (
    <div className="min-h-screen w-full text-pink-300 cyber-bg overflow-y-auto px-4 py-10 fade-in">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/yastars.png"
            width={60}
            height={60}
            alt="Logo"
            className="drop-shadow-xl"
          />
          <h1 className="text-4xl font-bold tracking-wide text-pink-400 drop-shadow-xl">
            YaSTARS IA
          </h1>
        </div>

        <nav className="flex gap-10 text-xl font-semibold">
          <a className="hover:text-white transition">Projects</a>
          <a className="hover:text-white transition">Settings</a>
          <a className="hover:text-white transition">Sign Out</a>
        </nav>
      </div>

      {/* TITLE */}
      <h1 className="text-center text-6xl font-bold text-pink-500 mb-20 drop-shadow-2xl">
        AI AUTOMATION
      </h1>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl mx-auto">

        {/* SCRIPT GENERATION */}
        <div className="cyber-card p-10">
          <h2 className="text-3xl text-pink-400 font-bold mb-6">Script Generation</h2>

          <select
            className="cyber-input w-full mb-6"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="openai">OpenAI</option>
            <option value="mistral">Mistral</option>
            <option value="anthropic">Anthropic</option>
            <option value="meta">Meta</option>
          </select>

          <input
            className="cyber-input w-full mb-6"
            placeholder="OpenRouter API Key"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
          />

          <button className="cyber-btn w-full bg-pink-600 hover:bg-pink-700" onClick={handleSaveApi}>
            Save API Key
          </button>
        </div>

        {/* VIDEO GENERATION */}
        <div className="cyber-card p-10">
          <h2 className="text-3xl text-pink-400 font-bold mb-6">Video Generation</h2>

          <select
            className="cyber-input w-full mb-6"
            value={videoProvider}
            onChange={(e) => setVideoProvider(e.target.value)}
          >
            <option value="veo">Google Veo</option>
            <option value="pika">Pika Labs</option>
            <option value="runway">Runway ML</option>
          </select>

          <input
            className="cyber-input w-full mb-6"
            placeholder="Video API Key"
            value={videoAPI}
            onChange={(e) => setVideoAPI(e.target.value)}
          />

          <button className="cyber-btn w-full bg-pink-600 hover:bg-pink-700">
            Generate Video
          </button>
        </div>

        {/* YOUTUBE UPLOAD */}
        <div className="cyber-card p-10">
          <h2 className="text-3xl text-pink-400 font-bold mb-6">YouTube Upload</h2>

          <input
            className="cyber-input w-full mb-6"
            placeholder="Video Interval (min)"
          />

          <button className="cyber-btn w-full bg-pink-600 hover:bg-pink-700">
            Auto-Upload
          </button>

          <button className="cyber-btn w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-700">
            Auto-Video
          </button>
        </div>
  </div>
</div>
  );
}