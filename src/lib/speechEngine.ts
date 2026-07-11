// Production-grade Multi-language Text-to-Speech Engine
// Supports: en-IN (English), and ready for future languages

let currentAudio: HTMLAudioElement | null = null;
let lastClickTime = 0;
const CLICK_DEBOUNCE_MS = 300;

export const speakLanguage = (text: string, langCode: string = "te-IN") => {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (now - lastClickTime < CLICK_DEBOUNCE_MS) return;
  lastClickTime = now;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  // Cancel any local speech synthesis
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=te-IN&client=tw-ob&q=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    currentAudio = audio;
    audio.play().catch((err) => {
      console.error("Google TTS play failed:", err);
    });
  } catch (err) {
    console.error("Failed to setup audio:", err);
  }
};
