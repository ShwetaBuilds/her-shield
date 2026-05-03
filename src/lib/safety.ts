// Shared helpers + storage keys for the new safety features.
export type SilentTrigger = "shake" | "volume" | "power";

export type SilentSettings = {
  enabled: boolean;
  trigger: SilentTrigger;
  sensitivity: number; // 1-10
};

export type VoiceSettings = {
  enabled: boolean;
  keywords: string[];
};

const SILENT_KEY = "hs_silent_settings";
const VOICE_KEY = "hs_voice_settings";

export const DEFAULT_SILENT: SilentSettings = {
  enabled: false,
  trigger: "shake",
  sensitivity: 6,
};

export const DEFAULT_VOICE: VoiceSettings = {
  enabled: false,
  keywords: ["help me", "save me", "emergency", "call police", "i am in danger"],
};

export function loadSilent(): SilentSettings {
  if (typeof window === "undefined") return DEFAULT_SILENT;
  try {
    const raw = localStorage.getItem(SILENT_KEY);
    if (!raw) return DEFAULT_SILENT;
    return { ...DEFAULT_SILENT, ...JSON.parse(raw) };
  } catch { return DEFAULT_SILENT; }
}

export function saveSilent(s: SilentSettings) {
  localStorage.setItem(SILENT_KEY, JSON.stringify(s));
}

export function loadVoice(): VoiceSettings {
  if (typeof window === "undefined") return DEFAULT_VOICE;
  try {
    const raw = localStorage.getItem(VOICE_KEY);
    if (!raw) return DEFAULT_VOICE;
    return { ...DEFAULT_VOICE, ...JSON.parse(raw) };
  } catch { return DEFAULT_VOICE; }
}

export function saveVoice(v: VoiceSettings) {
  localStorage.setItem(VOICE_KEY, JSON.stringify(v));
}

export function logAlert(entry: {
  type: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  sentTo?: string;
  status?: string;
}) {
  if (typeof window === "undefined") return;
  const history = JSON.parse(localStorage.getItem("hs_alerts") || "[]");
  history.unshift({
    id: Date.now(),
    time: new Date().toISOString(),
    sentTo: entry.sentTo ?? "All trusted contacts",
    status: entry.status ?? "Delivered",
    ...entry,
  });
  localStorage.setItem("hs_alerts", JSON.stringify(history));
}