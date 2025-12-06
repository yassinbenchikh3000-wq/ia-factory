export async function fetchSettings() {
  const res = await fetch("/api/settings", { cache: "no-store" });
  const data = await res.json();
  return data?.settings ?? {};
}

export function getTextApiKey(settings: any) {
  const p = settings.module1Provider;

  if (p === "openai") return settings.openaiKey ?? "";
  if (p === "google") return settings.geminiKey ?? "";

  // autres providers à brancher plus tard
  return "";
}

export function getVideoApiKey(settings: any) {
  const p = settings.module2Provider;

  if (p === "sora") return settings.openaiKey ?? "";
  if (p === "veo") return settings.geminiKey ?? "";
  if (p === "pika") return settings.pikaKey ?? "";
  if (p === "runway") return settings.runwayKey ?? "";
  if (p === "stability") return settings.stabilityKey ?? "";

  return "";
}

export function getUploadApiKey(settings: any) {
  const p = settings.module3Platform;

  if (p === "youtube") return settings.youtubeKey ?? "";
  if (p === "tiktok") return settings.tiktokKey ?? "";
  if (p === "instagram") return settings.instagramKey ?? "";

  return "";
}