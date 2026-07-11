// Kid-friendly speech engine wrapping the browser SpeechSynthesis API.
// - Queues clips so they never overlap
// - Two voice profiles (girl / boy) chosen from the best available English voices
// - Default slow, warm cadence suitable for 2-8 year olds
// - Global settings (voice on/off, rate) persisted via `settings.ts`

import { getSettings, subscribeSettings } from "./settings";

export type VoiceProfile = "girl" | "boy";

type Clip = {
  text: string;
  profile: VoiceProfile;
  rate?: number;
  pitch?: number;
  pauseAfterMs?: number;
  onStart?: () => void;
  onEnd?: () => void;
};

let queue: Clip[] = [];
let speaking = false;
let voicesReady = false;
let cachedVoices: SpeechSynthesisVoice[] = [];

const ensureVoices = (): Promise<SpeechSynthesisVoice[]> =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const load = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      if (cachedVoices.length) {
        voicesReady = true;
        resolve(cachedVoices);
      }
    };
    load();
    if (!voicesReady) {
      window.speechSynthesis.onvoiceschanged = () => load();
      setTimeout(load, 300);
      setTimeout(() => resolve(cachedVoices), 1500);
    }
  });

const pickVoice = (profile: VoiceProfile): SpeechSynthesisVoice | undefined => {
  if (!cachedVoices.length) return undefined;
  const english = cachedVoices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
  const pool = english.length ? english : cachedVoices;

  // Prioritize Indian English (en-IN) or clear, neutral global English voices
  const girlHints = [
    "heera",
    "neerja",
    "en-in",
    "india",
    "google uk english female",
    "samantha",
    "victoria",
    "karen",
    "zira",
    "female",
    "child",
  ];
  const boyHints = [
    "ravi",
    "en-in",
    "india",
    "google uk english male",
    "daniel",
    "david",
    "mark",
    "male",
    "boy",
  ];

  const hints = profile === "girl" ? girlHints : boyHints;
  const match = pool.find((v) =>
    hints.some((h) => v.name.toLowerCase().includes(h) || v.lang.toLowerCase().includes(h)),
  );

  if (match) return match;
  // Fallback: pick different voices for girl vs boy by index
  return profile === "girl" ? pool[0] : pool[Math.min(1, pool.length - 1)];
};

const processQueue = async () => {
  if (speaking) return;
  const next = queue.shift();
  if (!next) return;

  const settings = getSettings();
  if (!settings.voiceEnabled) {
    next.onStart?.();
    next.onEnd?.();
    processQueue();
    return;
  }

  await ensureVoices();
  speaking = true;

  const utter = new SpeechSynthesisUtterance(next.text);
  const voice = pickVoice(next.profile);
  if (voice) utter.voice = voice;
  // Slow down slightly to offset the pitch increase
  utter.rate = Math.min(0.8, Math.max(0.55, next.rate ?? settings.speechRate * 0.9));
  // Pitch 1.6 hits the sweet spot for sounding young without sounding like a robot
  utter.pitch = next.pitch ?? (next.profile === "girl" ? 1.6 : 1.3);
  utter.volume = 1;

  next.onStart?.();
  utter.onend = () => {
    next.onEnd?.();
    const pause = next.pauseAfterMs ?? 150;
    setTimeout(() => {
      speaking = false;
      processQueue();
    }, pause);
  };
  utter.onerror = () => {
    next.onEnd?.();
    speaking = false;
    processQueue();
  };

  try {
    window.speechSynthesis.speak(utter);
  } catch {
    speaking = false;
    next.onEnd?.();
    processQueue();
  }
};

export const speak = (text: string, opts: Partial<Omit<Clip, "text">> = {}) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  queue.push({ text, profile: opts.profile ?? "girl", ...opts });
  processQueue();
};

// Promise-returning speak. Resolves ONLY after the utterance actually ends
// (or is cancelled). Used to drive event-driven syncing with animations.
export const speakAsync = (text: string, opts: Partial<Omit<Clip, "text">> = {}): Promise<void> =>
  new Promise((resolve) => {
    const userEnd = opts.onEnd;
    speak(text, {
      ...opts,
      onEnd: () => {
        try {
          userEnd?.();
        } finally {
          resolve();
        }
      },
    });
    // Safety: if speech is disabled or unavailable, processQueue's synthetic
    // onEnd fires immediately — resolve either way.
    if (typeof window === "undefined" || !("speechSynthesis" in window)) resolve();
  });

export const speakSequence = (clips: Array<string | Clip>) => {
  clips.forEach((c) => {
    if (typeof c === "string") speak(c);
    else queue.push(c);
  });
  processQueue();
};

export const cancelSpeech = () => {
  queue = [];
  speaking = false;
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
};

let lastNarration: Array<string | Clip> = [];
export const recordAndSpeak = (clips: Array<string | Clip>) => {
  lastNarration = clips;
  cancelSpeech();
  speakSequence(clips);
};
export const replayLast = () => {
  if (lastNarration.length) {
    cancelSpeech();
    speakSequence(lastNarration);
  }
};

// Random praise / encouragement pools
const PRAISE = [
  "Excellent!",
  "Amazing!",
  "Fantastic!",
  "Wonderful!",
  "Super!",
  "You're doing great!",
  "Brilliant!",
  "Awesome!",
  "Perfect!",
  "Great job!",
  "Well done!",
  "Keep going!",
  "You can do it!",
  "Nice work!",
  "Outstanding!",
];
const RETRY = [
  "Almost! Let's try again.",
  "You can do it. Take another look.",
  "That's okay. Learning takes practice.",
  "Try once more, you're close!",
  "Almost there!",
];
export const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];
export const retryHint = () => RETRY[Math.floor(Math.random() * RETRY.length)];

// React to settings changes (e.g. mute) by cancelling pending speech
if (typeof window !== "undefined") {
  subscribeSettings((s) => {
    if (!s.voiceEnabled) cancelSpeech();
  });
  // Warm up voices early
  ensureVoices();
}
