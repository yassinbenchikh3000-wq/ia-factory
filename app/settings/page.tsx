"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [primary, setPrimary] = useState("#ff0077");
  const [secondary, setSecondary] = useState("#00c8ff");

  return (
    <div className="p-10 fade-in">
      <h1 className="text-4xl text-pink-400 font-bold mb-10 drop-shadow-[0_0_20px_#ff0080]">
        Customize Theme 🎨
      </h1>

      <div className="cyber-card p-6 w-full max-w-xl">
        <label className="text-sm text-gray-300">Primary Color</label>
        <input
          type="color"
          value={primary}
          onChange={(e) => setPrimary(e.target.value)}
          className="w-full h-12 mt-2 mb-6"
        />

        <label className="text-sm text-gray-300">Secondary Color</label>
        <input
          type="color"
          value={secondary}
          onChange={(e) => setSecondary(e.target.value)}
          className="w-full h-12 mt-2 mb-6"
        />

        <button className="cyber-btn w-full py-3">Save</button>
      </div>
    </div>
  );
}