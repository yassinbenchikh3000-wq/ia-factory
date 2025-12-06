"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { UserSettings, LLMProvider, VideoProvider } from "@/lib/settings-types";
import { defaultSettings } from "@/lib/settings-types";

const LLM_OPTIONS: { id: LLMProvider; label: string }[] = [
  { id: "openai", label: "OpenAI" },
  { id: "openrouter", label: "OpenRouter" },
  { id: "gemini", label: "Google Gemini" },
  { id: "anthropic", label: "Anthropic" },
  { id: "other", label: "Autre" },
];

const VIDEO_OPTIONS: { id: VideoProvider; label: string }[] = [
  { id: "openai_sora", label: "OpenAI Sora" },
  { id: "google_veo", label: "Google Veo" },
  { id: "pika", label: "Pika" },
  { id: "stability", label: "Stability" },
  { id: "fal", label: "Fal.ai" },
  { id: "other", label: "Autre" },
];

function Bubble({
  idx,
  title,
  subtitle,
  children,
}: {
  idx: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="text-xs text-zinc-500">Bulle {idx}</div>
      <div className="text-lg font-semibold">{title}</div>
      {subtitle && <div className="mt-1 text-sm text-zinc-400">{subtitle}</div>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function SettingsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => setSettings(defaultSettings))
      .finally(() => setLoading(false));
  }, [open]);

  const llmKeyField = useMemo(() => {
    const p = settings.preferences.defaultLLMProvider;
    if (p === "openai") return "openai";
    if (p === "openrouter") return "openrouter";
    if (p === "gemini") return "gemini";
    if (p === "anthropic") return "anthropic";
    return "otherLLM";
  }, [settings.preferences.defaultLLMProvider]);

  const videoKeyField = useMemo(() => {
    const p = settings.preferences.defaultVideoProvider;
    if (p === "openai_sora") return "openai";
    if (p === "google_veo") return "googleVeo";
    if (p === "pika") return "pika";
    if (p === "stability") return "stability";
    if (p === "fal") return "fal";
    return "otherVideo";
  }, [settings.preferences.defaultVideoProvider]);

  function updateProfile(key: "displayName" | "email", value: string) {
    setSettings((s) => ({ ...s, profile: { ...s.profile, [key]: value } }));
  }

  function updateApiKey(key: keyof UserSettings["apiKeys"], value: string) {
    setSettings((s) => ({
      ...s,
      apiKeys: { ...s.apiKeys, [key]: value || undefined },
    }));
  }

  function updatePref(
    key: keyof UserSettings["preferences"],
    value: any
  ) {
    setSettings((s) => ({
      ...s,
      preferences: { ...s.preferences, [key]: value },
    }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: settings.profile,
          apiKeys: settings.apiKeys,
          preferences: settings.preferences,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Save failed");

      setSettings({ ...defaultSettings, ...data });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Erreur sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  function oauthPlaceholder(name: string) {
    setError(`Connexion ${name} pas encore branchée (placeholder).`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[95vw] max-w-5xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <div className="text-sm text-zinc-400">Settings Pro</div>
            <div className="text-xl font-semibold">Utilisateur • IA • Réseaux</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-700"
          >
            Fermer
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-sm text-zinc-400">Chargement...</div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {/* BULLE 1 */}
              <Bubble idx={1} title="Utilisateur">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-zinc-400">Nom d'affichage</label>
                    <input
                      value={settings.profile.displayName}
                      onChange={(e) => updateProfile("displayName", e.target.value)}
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400">Email</label>
                    <input
                      value={settings.profile.email}
                      onChange={(e) => updateProfile("email", e.target.value)}
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </Bubble>

              {/* BULLE 2 */}
              <Bubble
                idx={2}
                title="IA Script"
                subtitle="Dropdown à gauche → clé liée à droite"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1.3fr]">
                  <div>
                    <label className="text-xs text-zinc-400">Provider script</label>
                    <select
                      value={settings.preferences.defaultLLMProvider}
                      onChange={(e) =>
                        updatePref("defaultLLMProvider", e.target.value as LLMProvider)
                      }
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    >
                      {LLM_OPTIONS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-zinc-400">Clé API liée</label>
                      <button
                        onClick={() => setShowKeys((s) => !s)}
                        className="rounded-lg px-2 py-1 text-[10px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-700"
                      >
                        {showKeys ? "Masquer" : "Afficher"}
                      </button>
                    </div>
                    <input
                      type={showKeys ? "text" : "password"}
                      value={(settings.apiKeys as any)[llmKeyField] ?? ""}
                      onChange={(e) =>
                        updateApiKey(llmKeyField as keyof UserSettings["apiKeys"], e.target.value)
                      }
                      placeholder="Colle ta clé LLM"
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </Bubble>

              {/* BULLE 3 */}
              <Bubble
                idx={3}
                title="IA Vidéo"
                subtitle="Dropdown à gauche → clé liée à droite"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_1.3fr]">
                  <div>
                    <label className="text-xs text-zinc-400">Provider vidéo</label>
                    <select
                      value={settings.preferences.defaultVideoProvider}
                      onChange={(e) =>
                        updatePref("defaultVideoProvider", e.target.value as VideoProvider)
                      }
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    >
                      {VIDEO_OPTIONS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-zinc-400">Clé API liée</label>
                      <button
                        onClick={() => setShowKeys((s) => !s)}
                        className="rounded-lg px-2 py-1 text-[10px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-700"
                      >
                        {showKeys ? "Masquer" : "Afficher"}
                      </button>
                    </div>
                    <input
                      type={showKeys ? "text" : "password"}
                      value={(settings.apiKeys as any)[videoKeyField] ?? ""}
                      onChange={(e) =>
                        updateApiKey(videoKeyField as keyof UserSettings["apiKeys"], e.target.value)
                      }
                      placeholder="Colle ta clé vidéo"
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </Bubble>

              {/* BULLE 4 */}
              <Bubble
                idx={4}
                title="Réseaux"
                subtitle="Tokens simples OU boutons de connexion (placeholder)"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-zinc-400">YouTube</label>
                    <input
                      type={showKeys ? "text" : "password"}
                      value={settings.apiKeys.youtube ?? ""}
                      onChange={(e) => updateApiKey("youtube", e.target.value)}
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => oauthPlaceholder("YouTube")}
                    className="rounded-xl px-3 py-2 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 mt-5"
                  >
                    Connecter YouTube
                  </button>

                  <div>
                    <label className="text-xs text-zinc-400">TikTok</label>
                    <input
                      type={showKeys ? "text" : "password"}
                      value={settings.apiKeys.tiktok ?? ""}
                      onChange={(e) => updateApiKey("tiktok", e.target.value)}
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => oauthPlaceholder("TikTok")}
                    className="rounded-xl px-3 py-2 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 mt-5"
                  >
                    Connecter TikTok
                  </button>

                  <div>
                    <label className="text-xs text-zinc-400">Instagram</label>
                    <input
                      type={showKeys ? "text" : "password"}
                      value={settings.apiKeys.instagram ?? ""}
                      onChange={(e) => updateApiKey("instagram", e.target.value)}
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => oauthPlaceholder("Instagram")}
                    className="rounded-xl px-3 py-2 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 mt-5"
                  >
                    Connecter Instagram
                  </button>
                </div>

                <div className="mt-3 text-[10px] text-zinc-500">
                  On branchera l’OAuth réel plus tard.
                </div>
              </Bubble>

              {/* BULLE 5 */}
              <Bubble
                idx={5}
                title="Sauvegarde & Automations"
                subtitle="Auto chain • Interval • Start"
              >
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.preferences.autoChain}
                      onChange={(e) => updatePref("autoChain", e.target.checked)}
                    />
                    Activer Script → Vidéo auto
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.preferences.autoStartEnabled}
                      onChange={(e) => updatePref("autoStartEnabled", e.target.checked)}
                    />
                    Activer la bulle Start
                  </label>

                  <div>
                    <label className="text-xs text-zinc-400">Interval (minutes)</label>
                    <input
                      type="number"
                      min={1}
                      max={1440}
                      value={settings.preferences.intervalMinutes ?? ""}
                      onChange={(e) =>
                        updatePref(
                          "intervalMinutes",
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                      className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm"
                    />
                  </div>

                  <button
                    onClick={save}
                    disabled={saving}
                    className="w-full rounded-xl px-4 py-2 text-sm bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
                  >
                    {saving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>
              </Bubble>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-xs text-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-700"
          >
            Annuler
          </button>
          <button
            onClick={save}
            disabled={saving || loading}
            className="rounded-xl px-4 py-2 text-sm bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {saving ? "..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}