"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  // ===========================
  // YOUTUBE API USER SETTINGS
  // ===========================
  const [ytApiKey, setYtApiKey] = useState("");
  const [ytAccessToken, setYtAccessToken] = useState("");

  // Load saved API keys on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      setYtApiKey(localStorage.getItem("ytApiKey") || "");
      setYtAccessToken(localStorage.getItem("ytAccessToken") || "");
    }
  }, []);

  // Save keys to localStorage
  const saveYouTubeApi = () => {
    localStorage.setItem("ytApiKey", ytApiKey);
    localStorage.setItem("ytAccessToken", ytAccessToken);
    alert("YouTube API settings saved!");
  };

  // ===========================
  // UPLOAD VIDEO USING USER TOKEN
  // ===========================
  async function uploadUserVideo() {
    const token = localStorage.getItem("ytAccessToken");

    if (!token) {
      alert("Please enter a YouTube Access Token first.");
      return;
    }

    // ⚠️ EXEMPLE DE VIDÉO EN BASE64
    // Remplace par la vidéo générée dans l'étape 2
    const fakeVideoData = "BASE64_VIDEO_DATA_HERE";

    const res = await fetch("/api/uploadYoutube", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoBase64: fakeVideoData,
        accessToken: token,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert("Error: " + data.error);
    } else {
      alert("Video uploaded successfully!");
    }
  }

  // ===========================
  // UI DASHBOARD
  // ===========================
  return (
    <div className="p-10 text-white">
      <h1 className="text-4xl font-bold mb-10">Dashboard</h1>

      {/* YOUTUBE API SETTINGS CARD */}
      <div className="cyber-card p-10 mb-10">
        <h2 className="text-3xl text-pink-400 font-bold mb-6">
          YouTube API Configuration
        </h2>

        <input
          className="w-full p-3 mb-6 rounded bg-[#1a1a2e] border border-pink-500 text-white"
          placeholder="YouTube API Key"
          value={ytApiKey}
          onChange={(e) => setYtApiKey(e.target.value)}
        />

        <input
          className="w-full p-3 mb-6 rounded bg-[#1a1a2e] border border-pink-500 text-white"
          placeholder="YouTube Access Token"
          value={ytAccessToken}
          onChange={(e) => setYtAccessToken(e.target.value)}
        />

        <button
          onClick={saveYouTubeApi}
          className="cyber-btn w-full bg-gradient-to-r from-pink-600 to-purple-700 py-3 text-xl rounded"
        >
          Save YouTube API
        </button>
      </div>

      {/* UPLOAD BUTTON */}
      <div className="cyber-card p-10">
        <h2 className="text-2xl text-purple-300 mb-6 font-semibold">
          Upload a Video to YouTube
        </h2>

        <button
          onClick={uploadUserVideo}
          className="cyber-btn w-full bg-gradient-to-r from-purple-600 to-pink-700 py-3 text-xl rounded"
        >
          Upload Video to YouTube
        </button>
      </div>
    </div>
  );
}