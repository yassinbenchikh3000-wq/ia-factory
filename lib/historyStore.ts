import { promises as fs } from "fs";
import path from "path";

export type HistoryItem = {
  id?: string;
  type?: "script" | "video" | "upload" | "system";
  provider?: string;
  input?: string;
  output?: string;
  status?: "ok" | "error";
  createdAt?: string;
  meta?: Record<string, any>;
};

const DATA_DIR = path.join(process.cwd(), ".local-data");
const HISTORY_PATH = path.join(DATA_DIR, "history.json");

// cache mémoire pour prod/serverless
declare global {
  // eslint-disable-next-line no-var
  var __HISTORY_CACHE__: HistoryItem[] | undefined;
}

function nowIso() {
  return new Date().toISOString();
}

function isDev() {
  return process.env.NODE_ENV === "development";
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readAll(): Promise<HistoryItem[]> {
  if (isDev()) {
    try {
      const raw = await fs.readFile(HISTORY_PATH, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }

  if (!globalThis.__HISTORY_CACHE__) globalThis.__HISTORY_CACHE__ = [];
  return globalThis.__HISTORY_CACHE__!;
}

async function writeAll(items: HistoryItem[]) {
  if (isDev()) {
    await ensureDataDir();
    await fs.writeFile(HISTORY_PATH, JSON.stringify(items, null, 2), "utf8");
    return;
  }
  globalThis.__HISTORY_CACHE__ = items;
}

/** публич API */
export async function listHistory(): Promise<HistoryItem[]> {
  const items = await readAll();
  // On garde du plus récent au plus ancien
  return [...items].sort((a, b) => {
    const ta = new Date(a.createdAt ?? 0).getTime();
    const tb = new Date(b.createdAt ?? 0).getTime();
    return tb - ta;
  });
}

export async function addHistory(item: HistoryItem): Promise<HistoryItem[]> {
  const items = await readAll();

  const normalized: HistoryItem = {
    id: item.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: item.createdAt ?? nowIso(),
    type: item.type ?? "system",
    status: item.status ?? "ok",
    provider: item.provider,
    input: item.input,
    output: item.output,
    meta: item.meta ?? {},
  };

  const next = [normalized, ...items].slice(0, 200); // limite safe
  await writeAll(next);
  return next;
}

export async function clearHistory(): Promise<void> {
  await writeAll([]);
}