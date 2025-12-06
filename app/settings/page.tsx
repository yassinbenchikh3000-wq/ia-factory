"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

type SettingsData = {
  // ===== User
  displayName?: string;
  email?: string;

  // ===== API Keys (existant + ajouts)
  openaiKey?: string;
  geminiKey?: string;
  pikaKey?: string;
  stabilityKey?: string;
  runwayKey?: string;
  youtubeKey?: string;
  tiktokKey?: string;
  instagramKey?: string;

  // ===== Module routing (ajout)
  module1Provider?: TextProvider;
  module2Provider?: VideoProvider;
  module3Platform?: UploadPlatform;
};

const TEXT_PROVIDERS: { value: TextProvider; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "google", label: "Google" },
  { value: "anthropic", label: "Anthropic" },
  { value: "mistral", label: "Mistral" },
  { value: "meta", label: "Meta (Llama)" },
  { value: "qwen", label: "Qwen" },
  { value: "deepseek", label: "DeepSeek" },
];

const VIDEO_PROVIDERS: { value: VideoProvider; label: string }[] = [
  { value: "sora", label: "OpenAI Sora" },
  { value: "veo", label: "Google Veo" },
  { value: "pika", label: "Pika" },
  { value: "runway", label: "Runway" },
  { value: "stability", label: "Stability" },
  { value: "luma", label: "Luma" },
  { value: "fal", label: "Fal.ai" },
];

const UPLOAD_PLATFORMS: { value: UploadPlatform; label: string }[] = [
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
];

export default function SettingsPage() {
  // ===== User
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  // ===== API Keys (on garde + on ajoute)
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [pikaKey, setPikaKey] = useState("");
  const [stabilityKey, setStabilityKey] = useState("");
  const [runwayKey, setRunwayKey] = useState("");
  const [youtubeKey, setYoutubeKey] = useState("");
  const [tiktokKey, setTiktokKey] = useState("");
  const [instagramKey, setInstagramKey] = useState("");

  // ===== NEW routing per module
  const [module1Provider, setModule1Provider] =
    useState<TextProvider>("openai");
  const [module2Provider, setModule2Provider] =
    useState<VideoProvider>("sora");
  const [module3Platform, setModule3Platform] =
    useState<UploadPlatform>("youtube");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // ===== Auto-save léger pour les nouvelles liaisons
  const autoTimer = useRef<any>(null);
  const autoPatch = (partial: SettingsData) => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(async () => {
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partial),
        });
      } catch {}
    }, 250);
  };

  // ===== Load
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const data = await res.json();

        if (!alive) return;

        if (data?.ok && data?.settings) {
          const s: SettingsData = data.settings;

          setDisplayName(s.displayName ?? "");
          setEmail(s.email ?? "");

          setOpenaiKey(s.openaiKey ?? "");
          setGeminiKey(s.geminiKey ?? "");
          setPikaKey(s.pikaKey ?? "");
          setStabilityKey(s.stabilityKey ?? "");
          setRunwayKey(s.runwayKey ?? "");
          setYoutubeKey(s.youtubeKey ?? "");
          setTiktokKey(s.tiktokKey ?? "");
          setInstagramKey(s.instagramKey ?? "");

          setModule1Provider(s.module1Provider ?? "openai");
          setModule2Provider(s.module2Provider ?? "sora");
          setModule3Platform(s.module3Platform ?? "youtube");
        }
      } catch {
        if (alive) setMsg("⚠️ Impossible de charger les paramètres.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  // ===== Helpers clés dynamiques (le cœur de ton idée)
  const getKeyForTextProvider = (p: TextProvider) => {
    switch (p) {
      case "openai":
        return openaiKey;
      case "google":
        return geminiKey;
      case "anthropic":
        return ""; // ajout futur si tu veux une clé dédiée
      case "mistral":
        return "";
      case "meta":
        return "";
      case "qwen":
        return "";
      case "deepseek":
        return "";
      default:
        return "";
    }
  };

  const setKeyForTextProvider = (p: TextProvider, v: string) => {
    switch (p) {
      case "openai":
        setOpenaiKey(v);
        autoPatch({ openaiKey: v });
        break;
      case "google":
        setGeminiKey(v);
        autoPatch({ geminiKey: v });
        break;
      default:
        // si tu ajoutes plus tard des champs dédiés, on les branchera ici
        break;
    }
  };

  const getKeyForVideoProvider = (p: VideoProvider) => {
    switch (p) {
      case "sora":
        return openaiKey;
      case "veo":
        return geminiKey;
      case "pika":
        return pikaKey;
      case "runway":
        return runwayKey;
      case "stability":
        return stabilityKey;
      case "luma":
        return "";
      case "fal":
        return "";
      default:
        return "";
    }
  };

  const setKeyForVideoProvider = (p: VideoProvider, v: string) => {
    switch (p) {
      case "sora":
        setOpenaiKey(v);
        autoPatch({ openaiKey: v });
        break;
      case "veo":
        setGeminiKey(v);
        autoPatch({ geminiKey: v });
        break;
      case "pika":
        setPikaKey(v);
        autoPatch({ pikaKey: v });
        break;
      case "runway":
        setRunwayKey(v);
        autoPatch({ runwayKey: v });
        break;
      case "stability":
        setStabilityKey(v);
        autoPatch({ stabilityKey: v });
        break;
      default:
        break;
    }
  };

  const getKeyForUploadPlatform = (p: UploadPlatform) => {
    switch (p) {
      case "youtube":
        return youtubeKey;
      case "tiktok":
        return tiktokKey;
      case "instagram":
        return instagramKey;
      default:
        return "";
    }
  };

  const setKeyForUploadPlatform = (p: UploadPlatform, v: string) => {
    switch (p) {
      case "youtube":
        setYoutubeKey(v);
        autoPatch({ youtubeKey: v });
        break;
      case "tiktok":
        setTiktokKey(v);
        autoPatch({ tiktokKey: v });
        break;
      case "instagram":
        setInstagramKey(v);
        autoPatch({ instagramKey: v });
        break;
      default:
        break;
    }
  };

  // ===== Save All (on garde ton bouton)
  const canSave = useMemo(() => !loading && !saving, [loading, saving]);

  async function handleSave() {
    setSaving(true);
    setMsg("");

    const payload: SettingsData = {
      displayName,
      email,

      openaiKey,
      geminiKey,
      pikaKey,
      stabilityKey,
      runwayKey,
      youtubeKey,
      tiktokKey,
      instagramKey,

      module1Provider,
      module2Provider,
      module3Platform,
    };

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMsg(data?.ok ? "✅ Paramètres sauvegardés." : "❌ Erreur sauvegarde.");
    } catch {
      setMsg("❌ Erreur réseau.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="settings-shell">
        <h1 className="settings-title">⚙️ Settings</h1>
        <div className="settings-card">
          <div className="settings-card-title">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-shell">
      <h1 className="settings-title">⚙️ Settings</h1>
      <p className="settings-sub">
        On garde tout l’existant + on ajoute le routage IA par module.
      </p>

      {/* =================================================
          1) UTILISATEUR (EXISTANT)
      ================================================= */}
      <div className="settings-card">
        <div className="settings-card-title">👤 Utilisateur</div>
        <div className="settings-grid">
          <label className="settings-label">
            Nom d’affichage
            <input
              className="settings-input"
              placeholder="Ton pseudo"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>

          <label className="settings-label">
            Email (optionnel)
            <input
              className="settings-input"
              placeholder="email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* =================================================
          2) API KEYS LISTE (EXISTANT)
          -> on ne supprime rien, on ajoute TikTok/Instagram
      ================================================= */}
      <div className="settings-card">
        <div className="settings-card-title">🔑 API Keys (liste)</div>

        <div className="settings-grid">
          <label className="settings-label">
            OpenAI
            <input
              className="settings-input"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
          </label>

          <label className="settings-label">
            Google (Gemini/Veo)
            <input
              className="settings-input"
              placeholder="AIza..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
          </label>

          <label className="settings-label">
            Pika
            <input
              className="settings-input"
              placeholder="pika_..."
              value={pikaKey}
              onChange={(e) => setPikaKey(e.target.value)}
            />
          </label>

          <label className="settings-label">
            Stability
            <input
              className="settings-input"
              placeholder="sk-..."
              value={stabilityKey}
              onChange={(e) => setStabilityKey(e.target.value)}
            />
          </label>

          <label className="settings-label">
            Runway
            <input
              className="settings-input"
              placeholder="rw_..."
              value={runwayKey}
              onChange={(e) => setRunwayKey(e.target.value)}
            />
          </label>

          <label className="settings-label">
            YouTube
            <input
              className="settings-input"
              placeholder="AIza... / token..."
              value={youtubeKey}
              onChange={(e) => setYoutubeKey(e.target.value)}
            />
          </label>

          <label className="settings-label">
            TikTok
            <input
              className="settings-input"
              placeholder="token..."
              value={tiktokKey}
              onChange={(e) => setTiktokKey(e.target.value)}
            />
          </label>

          <label className="settings-label">
            Instagram
            <input
              className="settings-input"
              placeholder="token..."
              value={instagramKey}
              onChange={(e) => setInstagramKey(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* =================================================
          3) NOUVEAU: ROUTAGE IA PAR MODULE (AJOUT)
      ================================================= */}
      <div className="settings-card">
        <div className="settings-card-title">🧩 Liaison IA par module</div>
        <p className="settings-sub">
          Choisis l’IA utilisée par chaque module et renseigne la clé liée
          directement à droite.
        </p>

        {/* ===== Module 1 */}
        <div className="settings-card">
          <div className="settings-card-title">🧠 Module 1 — Prompt</div>
          <div className="settings-grid">
            <label className="settings-label">
              Fournisseur IA
              <select
                className="settings-select"
                value={module1Provider}
                onChange={(e) => {
                  const v = e.target.value as TextProvider;
                  setModule1Provider(v);
                  autoPatch({ module1Provider: v });
                }}
              >
                {TEXT_PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="settings-label">
              Clé API liée
              <input
                className="settings-input"
                placeholder="clé pour l’IA sélectionnée"
                value={getKeyForTextProvider(module1Provider)}
                onChange={(e) =>
                  setKeyForTextProvider(module1Provider, e.target.value)
                }
              />
            </label>
          </div>
        </div>

        {/* ===== Module 2 */}
        <div className="settings-card">
          <div className="settings-card-title">🎥 Module 2 — Vidéo</div>
          <div className="settings-grid">
            <label className="settings-label">
              IA vidéo
              <select
                className="settings-select"
                value={module2Provider}
                onChange={(e) => {
                  const v = e.target.value as VideoProvider;
                  setModule2Provider(v);
                  autoPatch({ module2Provider: v });
                }}
              >
                {VIDEO_PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="settings-label">
              Clé API liée
              <input
                className="settings-input"
                placeholder="clé pour l’IA vidéo sélectionnée"
                value={getKeyForVideoProvider(module2Provider)}
                onChange={(e) =>
                  setKeyForVideoProvider(module2Provider, e.target.value)
                }
              />
            </label>
          </div>
        </div>

        {/* ===== Module 3 */}
        <div className="settings-card">
          <div className="settings-card-title">📤 Module 3 — Upload</div>
          <div className="settings-grid">
            <label className="settings-label">
              Plateforme
              <select
                className="settings-select"
                value={module3Platform}
                onChange={(e) => {
                  const v = e.target.value as UploadPlatform;
                  setModule3Platform(v);
                  autoPatch({ module3Platform: v });
                }}
              >
                {UPLOAD_PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="settings-label">
              Token/Clé liée
              <input
                className="settings-input"
                placeholder="token pour la plateforme sélectionnée"
                value={getKeyForUploadPlatform(module3Platform)}
                onChange={(e) =>
                  setKeyForUploadPlatform(module3Platform, e.target.value)
                }
              />
            </label>
          </div>
        </div>
      </div>

      {/* =================================================
          4) SAUVEGARDE (EXISTANT)
      ================================================= */}
      <div className="settings-card">
        <div className="settings-card-title">💾 Sauvegarde</div>

        <div className="settings-actions">
          <button
            className="settings-save"
            disabled={!canSave}
            onClick={handleSave}
          >
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>

          {msg && <span className="settings-msg">{msg}</span>}
        </div>
      </div>
    </div>
  );
}