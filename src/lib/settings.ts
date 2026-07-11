// Global learning settings (voice, music, speed). Persisted to localStorage.
// Small pub/sub so components stay in sync without a full state library.

export type LearningSettings = {
  voiceEnabled: boolean;
  musicEnabled: boolean;
  soundEnabled: boolean;
  speechRate: number; // 0.55 - 0.8 (locked kid-friendly range)
};

const KEY = "lp.settings.v1";
const DEFAULTS: LearningSettings = {
  voiceEnabled: true,
  musicEnabled: false,
  soundEnabled: true,
  speechRate: 0.7,
};

let current: LearningSettings = load();
const listeners = new Set<(s: LearningSettings) => void>();

function load(): LearningSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    /* ignore */
  }
}

export const getSettings = (): LearningSettings => current;

export const updateSettings = (patch: Partial<LearningSettings>) => {
  current = { ...current, ...patch };
  if (current.speechRate < 0.55) current.speechRate = 0.55;
  if (current.speechRate > 0.8) current.speechRate = 0.8;
  persist();
  listeners.forEach((fn) => fn(current));
};

export const subscribeSettings = (fn: (s: LearningSettings) => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// React hook
import { useEffect, useState } from "react";
export const useSettings = () => {
  const [s, setS] = useState<LearningSettings>(current);
  useEffect(() => {
    const unsub = subscribeSettings(setS);
    return () => {
      unsub();
    };
  }, []);
  return [s, updateSettings] as const;
};
