// Kid learning progress persisted to localStorage. Reactive via a small pub/sub.

import { useEffect, useState } from "react";

export type Progress = {
  lettersLearned: string[]; // e.g. ["A", "B"]
  numbersLearned: number[]; // e.g. [1, 2, 15]
  tablesCompleted: number[]; // e.g. [2, 5]
  gamesCompleted: number;
  stars: number;
  coins: number;
  badges: string[]; // slugs
  streakDays: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  correct: number;
  attempts: number;
  isPremium: boolean;
  premiumPopupShown: boolean;
};

const KEY = "lp.progress.v1";
const DEFAULTS: Progress = {
  lettersLearned: [],
  numbersLearned: [],
  tablesCompleted: [],
  gamesCompleted: 0,
  stars: 0,
  coins: 0,
  badges: [],
  streakDays: 0,
  lastActiveDate: null,
  correct: 0,
  attempts: 0,
  isPremium: false,
  premiumPopupShown: false,
};

let state: Progress = load();
const listeners = new Set<(p: Progress) => void>();

function load(): Progress {
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
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}
function set(patch: Partial<Progress>) {
  state = { ...state, ...patch };
  persist();
  listeners.forEach((fn) => fn(state));
}

const today = () => new Date().toISOString().slice(0, 10);

export const touchStreak = () => {
  const t = today();
  if (state.lastActiveDate === t) return;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const streak = state.lastActiveDate === yesterday ? state.streakDays + 1 : 1;
  
  // Check for 11-day premium unlock
  let premiumPatch = {};
  if (streak >= 11 && !state.isPremium) {
    premiumPatch = { isPremium: true, premiumPopupShown: false };
  }

  set({ lastActiveDate: t, streakDays: streak, ...premiumPatch });
};

export const dismissPremiumPopup = () => {
  if (!state.premiumPopupShown) {
    set({ premiumPopupShown: true });
  }
};

export const getProgress = () => state;
export const awardStar = (n = 1) => set({ stars: state.stars + n });
export const awardCoin = (n = 1) => set({ coins: state.coins + n });
export const markLetter = (letter: string) => {
  const arr = state.lettersLearned || [];
  if (!arr.includes(letter)) {
    set({ lettersLearned: [...arr, letter] });
  }
  touchStreak();
};
export const markNumber = (n: number) => {
  const arr = state.numbersLearned || [];
  if (!arr.includes(n)) {
    set({ numbersLearned: [...arr, n] });
  }
  touchStreak();
};
export const markTable = (t: number) => {
  const arr = state.tablesCompleted || [];
  if (!arr.includes(t)) {
    set({ tablesCompleted: [...arr, t] });
  }
};
export const markGameCompleted = () => set({ gamesCompleted: state.gamesCompleted + 1 });
export const awardBadge = (slug: string) => {
  const arr = state.badges || [];
  if (!arr.includes(slug)) set({ badges: [...arr, slug] });
};
export const recordAttempt = (isCorrect: boolean) =>
  set({ correct: state.correct + (isCorrect ? 1 : 0), attempts: state.attempts + 1 });

export const useProgress = () => {
  const [p, setP] = useState<Progress>(state);
  useEffect(() => {
    const fn = (s: Progress) => setP(s);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return p;
};
