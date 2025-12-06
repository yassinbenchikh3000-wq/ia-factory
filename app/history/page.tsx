"use client";

import React, { useEffect, useState } from "react";
import GalaxyCard from "../components/GalaxyCard";

type HistoryItem = {
  id: string;
  type: "prompt" | "video" | "upload";
  createdAt: string;
  payload: Record<string, any>;
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await fetch("/api/history");
    const data = await res.json();
    if (data?.ok) setItems(data.items);
  };

  useEffect(() => {
    load();
  }, []);

  const clear = async () => {
    await fetch("/api/history", { method: "DELETE" });
    setMsg("Historique vidé.");
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold space-title">🧾 Historique local</h2>
        <p className="text-xs opacity-70">
          Prompts, vidéos et uploads enregistrés localement.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={load}
          className="px-3 py-2 rounded bg-purple-600 font-semibold"
        >
          🔄 Rafraîchir
        </button>
        <button
          onClick={clear}
          className="px-3 py-2 rounded bg-red-600/80 font-semibold"
        >
          🧹 Vider
        </button>
      </div>

      {msg && <div className="text-xs opacity-70">{msg}</div>}

      <div className="grid gap-4">
        {items.length === 0 && (
          <div className="text-sm opacity-70">Aucun historique pour l’instant.</div>
        )}

        {items.map((it) => (
          <GalaxyCard key={it.id}>
            <div className="text-xs opacity-60">
              {it.type.toUpperCase()} • {new Date(it.createdAt).toLocaleString()}
            </div>
            <pre className="whitespace-pre-wrap text-xs mt-2">
              {JSON.stringify(it.payload, null, 2)}
            </pre>
          </GalaxyCard>
        ))}
      </div>
    </div>
  );
}