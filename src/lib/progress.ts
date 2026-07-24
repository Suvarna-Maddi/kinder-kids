import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";

export type Progress = {
  lettersLearned: string[];
  numbersLearned: number[];
  tablesCompleted: number[];
  gamesCompleted: number;
  stars: number;
  coins: number;
  badges: string[];
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string | null;
  correct: number;
  attempts: number;
  isPremium: boolean;
  premiumPopupShown: boolean;
  subscriptionExpiryDate: string | null;
  level: number;
};

const DEFAULTS: Progress = {
  lettersLearned: [],
  numbersLearned: [],
  tablesCompleted: [],
  gamesCompleted: 0,
  stars: 0,
  coins: 0,
  badges: [],
  streakDays: 0,
  longestStreak: 0,
  lastActiveDate: null,
  correct: 0,
  attempts: 0,
  isPremium: false,
  premiumPopupShown: false,
  subscriptionExpiryDate: null,
  level: 1,
};

let state: Progress = { ...DEFAULTS };
const listeners = new Set<(p: Progress) => void>();
let currentUserId: string | null = null;
let isLoadedFromCloud = false;

let unsubscribeSnapshot: (() => void) | null = null;

function notifyListeners() {
  listeners.forEach((fn) => fn(state));
}

// Watch Auth State only on the client
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, (user) => {
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }

    if (user) {
      currentUserId = user.uid;
      const docRef = doc(db, "users", user.uid);

      // Real-time listener for cross-device sync
      unsubscribeSnapshot = onSnapshot(
        docRef,
        (docSnap) => {
          // Ignore local writes that haven't hit the server yet, as we already updated local state synchronously in set()
          if (docSnap.metadata.hasPendingWrites) return;

          if (docSnap.exists()) {
            const data = docSnap.data();
            state = {
              ...DEFAULTS,
              lettersLearned: data.alphabetProgress?.lettersLearned || [],
              numbersLearned: data.numbersProgress?.numbersLearned || [],
              tablesCompleted: data.mathProgress?.tablesCompleted || [],
              gamesCompleted: data.playzoneProgress?.gamesCompleted || 0,
              stars: data.stars || 0,
              coins: data.coins || 0,
              badges: data.achievements || [],
              streakDays: data.streakDays || 0,
              longestStreak: data.longestStreak || 0,
              lastActiveDate: data.lastActiveDate || null,
              correct: data.quizScores?.correct || 0,
              attempts: data.quizScores?.attempts || 0,
              isPremium: data.isPremium || false,
              premiumPopupShown: data.premiumPopupShown || false,
              subscriptionExpiryDate: data.subscriptionExpiryDate
                ? typeof data.subscriptionExpiryDate.toDate === "function"
                  ? data.subscriptionExpiryDate.toDate().toISOString()
                  : new Date(data.subscriptionExpiryDate).toISOString()
                : null,
              level: data.level || 1,
            };
            isLoadedFromCloud = true;
            touchStreak(); // Will recalculate streak on login if needed
            notifyListeners();
          }
        },
        (err) => {
          console.error("Error listening to progress from Firestore", err);
        },
      );
    } else {
      currentUserId = null;
      state = { ...DEFAULTS };
      isLoadedFromCloud = false;
      notifyListeners();
    }
  });
}

async function syncToCloud() {
  if (!currentUserId || !isLoadedFromCloud) return;
  try {
    const docRef = doc(db, "users", currentUserId);
    await updateDoc(docRef, {
      stars: state.stars,
      coins: state.coins,
      level: state.level,
      achievements: state.badges,
      streakDays: state.streakDays,
      longestStreak: state.longestStreak,
      lastActiveDate: state.lastActiveDate,
      isPremium: state.isPremium,
      premiumPopupShown: state.premiumPopupShown,
      updatedAt: serverTimestamp(),
      "alphabetProgress.lettersLearned": state.lettersLearned,
      "numbersProgress.numbersLearned": state.numbersLearned,
      "mathProgress.tablesCompleted": state.tablesCompleted,
      "playzoneProgress.gamesCompleted": state.gamesCompleted,
      "quizScores.correct": state.correct,
      "quizScores.attempts": state.attempts,
    });
  } catch (err) {
    console.error("Error syncing progress to Firestore", err);
  }
}

function set(patch: Partial<Progress>) {
  state = { ...state, ...patch };
  notifyListeners();
  syncToCloud();
}

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local

export const touchStreak = () => {
  // Bypass streak calculation for admin
  if (auth.currentUser?.email?.toLowerCase() === "kinderkidsspace@gmail.com") return;

  const t = today();
  if (state.lastActiveDate === t) return;

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toLocaleDateString("en-CA");

  const newStreak = state.lastActiveDate === yesterday ? state.streakDays + 1 : 1;
  const newLongest = Math.max(state.longestStreak, newStreak);

  // Premium popup trigger at 10 days
  let popupPatch = {};
  if (newStreak >= 10 && !state.premiumPopupShown) {
    popupPatch = { premiumPopupShown: false }; // Wait, if it triggers it shouldn't auto-set to true until shown, but logic says trigger when >= 10 and false. We don't change it here, the UI will change it.
  }

  set({ lastActiveDate: t, streakDays: newStreak, longestStreak: newLongest, ...popupPatch });
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
