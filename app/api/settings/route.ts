import { NextResponse } from "next/server";

export type SettingsStore = {
  // ===== User (existant)
  displayName: string;
  email: string;

  // ===== API Keys (existant)
  openaiKey: string;
  geminiKey: string;
  pikaKey: string;
  stabilityKey: string;
  runwayKey: string;
  youtubeKey: string;

  // ===== NEW keys (ajout)
  tiktokKey: string;
  instagramKey: string;

  // ===== NEW module routing (ajout)
  module1Provider: TextProvider;
  module2Provider: VideoProvider;
  module3Platform: UploadPlatform;
};

export type TextProvider =
  | "openai"
  | "google"
  | "anthropic"
  | "mistral"
  | "meta"
  | "qwen"
  | "deepseek";

export type VideoProvider =
  | "sora"
  | "veo"
  | "pika"
  | "runway"
  | "stability"
  | "luma"
  | "fal";

export type UploadPlatform = "youtube" | "tiktok" | "instagram";

const STORE_KEY = "__YASTARS_SETTINGS_STORE__";

function getStore(): SettingsStore {
  const g = globalThis as any;

  if (!g[STORE_KEY]) {
    g[STORE_KEY] = {
      displayName: "",
      email: "",

      openaiKey: "",
      geminiKey: "",
      pikaKey: "",
      stabilityKey: "",
      runwayKey: "",
      youtubeKey: "",

      tiktokKey: "",
      instagramKey: "",

      module1Provider: "openai",
      module2Provider: "sora",
      module3Platform: "youtube",
    } as SettingsStore;
  }

  return g[STORE_KEY] as SettingsStore;
}

function cleanStr(v: any, max = 500) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function isTextProvider(v: any): v is TextProvider {
  return (
    v === "openai" ||
    v === "google" ||
    v === "anthropic" ||
    v === "mistral" ||
    v === "meta" ||
    v === "qwen" ||
    v === "deepseek"
  );
}

function isVideoProvider(v: any): v is VideoProvider {
  return (
    v === "sora" ||
    v === "veo" ||
    v === "pika" ||
    v === "runway" ||
    v === "stability" ||
    v === "luma" ||
    v === "fal"
  );
}

function isUploadPlatform(v: any): v is UploadPlatform {
  return v === "youtube" || v === "tiktok" || v === "instagram";
}

export async function GET() {
  const store = getStore();
  return NextResponse.json({ ok: true, settings: store });
}

/**
 * POST accepte:
 * - soit un payload complet
 * - soit un patch partiel
 */
export async function POST(req: Request) {
  const store = getStore();

  try {
    const body = await req.json();

    // ===== User
    if ("displayName" in body) store.displayName = cleanStr(body.displayName, 80);
    if ("email" in body) store.email = cleanStr(body.email, 120);

    // ===== API Keys existantes
    if ("openaiKey" in body) store.openaiKey = cleanStr(body.openaiKey);
    if ("geminiKey" in body) store.geminiKey = cleanStr(body.geminiKey);
    if ("pikaKey" in body) store.pikaKey = cleanStr(body.pikaKey);
    if ("stabilityKey" in body) store.stabilityKey = cleanStr(body.stabilityKey);
    if ("runwayKey" in body) store.runwayKey = cleanStr(body.runwayKey);
    if ("youtubeKey" in body) store.youtubeKey = cleanStr(body.youtubeKey);

    // ===== NEW keys
    if ("tiktokKey" in body) store.tiktokKey = cleanStr(body.tiktokKey);
    if ("instagramKey" in body) store.instagramKey = cleanStr(body.instagramKey);

    // ===== NEW routing fields
    if ("module1Provider" in body && isTextProvider(body.module1Provider)) {
      store.module1Provider = body.module1Provider;
    }
    if ("module2Provider" in body && isVideoProvider(body.module2Provider)) {
      store.module2Provider = body.module2Provider;
    }
    if ("module3Platform" in body && isUploadPlatform(body.module3Platform)) {
      store.module3Platform = body.module3Platform;
    }

    return NextResponse.json({ ok: true, settings: store });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}