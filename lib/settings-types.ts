export type LLMProvider =
  | "openai"
  | "openrouter"
  | "gemini"
  | "anthropic"
  | "other";

export type VideoProvider =
  | "openai_sora"
  | "google_veo"
  | "pika"
  | "stability"
  | "fal"
  | "other";

export type UserSettings = {
  profile: {
    displayName: string;
    email: string;
  };

  apiKeys: {
    // LLM
    openai?: string;
    openrouter?: string;
    gemini?: string;
    anthropic?: string;
    otherLLM?: string;

    // VIDEO
    googleVeo?: string;
    pika?: string;
    stability?: string;
    fal?: string;
    otherVideo?: string;

    // SOCIAL
    youtube?: string;
    tiktok?: string;
    instagram?: string;
  };

  preferences: {
    theme: "dark" | "light" | "system";

    defaultLLMProvider: LLMProvider;
    defaultVideoProvider: VideoProvider;

    autoChain: boolean; // Script -> Vidéo auto
    intervalMinutes: number | null;

    autoStartEnabled: boolean; // active la bulle Start
  };

  updatedAt: string;
};

export const defaultSettings: UserSettings = {
  profile: {
    displayName: "",
    email: "",
  },

  apiKeys: {},

  preferences: {
    theme: "dark",
    defaultLLMProvider: "openai",
    defaultVideoProvider: "openai_sora",
    autoChain: false,
    intervalMinutes: null,
    autoStartEnabled: false,
  },

  updatedAt: new Date(0).toISOString(),
};