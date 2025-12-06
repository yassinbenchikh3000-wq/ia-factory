import { promises as fs } from "fs";
import path from "path";
import { defaultSettings, type UserSettings } from "./settings-types";

const DATA_DIR = path.join(process.cwd(), ".local-data");
const SETTINGS_PATH = path.join(DATA_DIR, "settings.json");

// cache mémoire pour env serverless
declare global {
  // eslint-disable-next-line no-var
  var __SETTINGS_CACHE__: UserSettings | undefined;
}

function isDev() {
  return process.env.NODE_ENV === "development";
}

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function clampInterval(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (n < 1) return 1;
  if (n > 1440) return 1440;
  return Math.floor(n);
}

function normalize(input: Partial<UserSettings>): UserSettings {
  const merged: UserSettings = {
    ...defaultSettings,
    ...input,
    profile: {
      ...defaultSettings.profile,
      ...(input.profile ?? {}),
    },
    apiKeys: {
      ...defaultSettings.apiKeys,
      ...(input.apiKeys ?? {}),
    },
    preferences: {
      ...defaultSettings.preferences,
      ...(input.preferences ?? {}),
      intervalMinutes: clampInterval(input.preferences?.intervalMinutes),
    },
    updatedAt: new Date().toISOString(),
  };

  return merged;
}

export async function readSettings(): Promise<UserSettings> {
  if (isDev()) {
    try {
      const raw = await fs.readFile(SETTINGS_PATH, "utf8");
      const parsed = JSON.parse(raw);
      return normalize(parsed);
    } catch {
      return normalize({});
    }
  }

  if (!globalThis.__SETTINGS_CACHE__) {
    globalThis.__SETTINGS_CACHE__ = normalize({});
  }
  return globalThis.__SETTINGS_CACHE__!;
}

export async function writeSettings(
  patch: Partial<UserSettings>
): Promise<UserSettings> {
  const current = await readSettings();
  const next = normalize({
    ...current,
    ...patch,
    profile: { ...current.profile, ...(patch.profile ?? {}) },
    apiKeys: { ...current.apiKeys, ...(patch.apiKeys ?? {}) },
    preferences: {
      ...current.preferences,
      ...(patch.preferences ?? {}),
    },
  });

  if (isDev()) {
    await ensureDir();
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(next, null, 2), "utf8");
  } else {
    globalThis.__SETTINGS_CACHE__ = next;
  }

  return next;
}