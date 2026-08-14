import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import {
  Volume2,
  Sparkles,
  PenLine,
  Hand,
  ImagePlus,
  HelpCircle,
  BookOpen,
  Star,
  Play,
  Lock,
  Tv,
  X,
  Film,
  Loader2,
} from "lucide-react";
import { playClick, playSuccess, playError, playPop } from "@/lib/sounds";
import { recordAndSpeak, speak, speakAsync, praise, retryHint, cancelSpeech } from "@/lib/tts";
import {
  LETTER_GLYPHS,
  LETTER_WORDS,
  LOWERCASE_GLYPHS,
  LOWERCASE_WORDS,
  ALL_WORDS,
  type LetterWord,
} from "@/lib/glyphs";
import { awardCoin, awardStar, markLetter, recordAttempt, useProgress, awardBadge } from "@/lib/progress";
import StrokeWriter from "@/components/learning/StrokeWriter";
import TracePad from "@/components/learning/TracePad";
import WordImage from "@/components/learning/WordImage";
import SettingsBar from "@/components/learning/SettingsBar";
import { IMG_MAP } from "@/lib/images";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const AVAILABLE_LETTERS = ["a", "b", "c", "d", "e", "f", "g", "i", "j", "k", "l", "m", "p", "q", "w", "x", "y"];

const letterToVideoKey = (letter: string): string | null => {
  const char = letter.toLowerCase();
  if (AVAILABLE_LETTERS.includes(char)) {
    return `/Alphabet_videos/${char}.mp4`;
  }
  return null;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const lowercaseAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const GLYPHS: Record<string, (typeof LETTER_GLYPHS)[string]> = {
  ...LETTER_GLYPHS,
  ...LOWERCASE_GLYPHS,
};
const WORDS_BY_LETTER: Record<string, LetterWord[]> = { ...LETTER_WORDS, ...LOWERCASE_WORDS };
const isLower = (l: string) => l === l.toLowerCase();
const caseLabel = (l: string) => (isLower(l) ? "lowercase" : "capital");

const gradients = [
  "from-kid-orange to-kid-yellow",
  "from-kid-purple to-kid-pink",
  "from-kid-yellow to-kid-green",
  "from-kid-green to-kid-teal",
  "from-kid-pink to-kid-purple",
  "from-kid-blue to-kid-teal",
  "from-kid-red to-kid-orange",
  "from-kid-teal to-kid-blue",
];

type Tab = "learn" | "write" | "trace" | "words" | "quiz" | "story";
const TABS: Array<{ id: Tab; label: string; icon: typeof BookOpen }> = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "write", label: "Write", icon: PenLine },
  { id: "trace", label: "Trace", icon: Hand },
  { id: "words", label: "Words", icon: ImagePlus },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
  { id: "story", label: "Story", icon: Play },
];

// --- Learn tab content (preserves the original expanded card design) ------
const LearnPanel = ({ letter, words }: { letter: string; words: LetterWord[] }) => {
  const primary = words[0];
  const speakLearn = () =>
    recordAndSpeak([
      {
        text: `Hello! This is ${caseLabel(letter)} letter ${letter}.`,
        profile: "girl",
        pauseAfterMs: 250,
      },
      { text: `${letter}...`, profile: "girl", pauseAfterMs: 350 },
      { text: `${letter} for ${primary.word}.`, profile: "girl", pauseAfterMs: 200 },
      { text: `${primary.word}. Can you say ${primary.word}?`, profile: "girl" },
    ]);

  return (
    <div className="text-center">
      <div className="text-7xl md:text-9xl font-display font-bold text-primary mb-4 animate-pulse">
        {letter}
      </div>
      <div className="text-6xl md:text-8xl mb-4 animate-in zoom-in duration-500">
        {IMG_MAP[primary.word] ? (
          <img
            src={IMG_MAP[primary.word]}
            alt={primary.word}
            className="w-32 h-32 md:w-48 md:h-48 mx-auto object-contain"
            draggable={false}
          />
        ) : (
          primary.emoji
        )}
      </div>
      <div className="text-2xl md:text-4xl font-display text-foreground">
        <span className="text-secondary font-bold">{letter}</span> for {primary.word}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playClick();
            speakLearn();
          }}
          aria-label={`Hear the letter ${letter}`}
          className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        >
          <Volume2 className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
};

// --- Write tab content -----------------------------------------------------
const WritePanel = ({ letter }: { letter: string }) => {
  const glyph = GLYPHS[letter];
  const introSpokenRef = useRef(false);

  useEffect(() => {
    introSpokenRef.current = false;
    cancelSpeech();
    return () => cancelSpeech();
  }, [letter]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-display text-lg text-muted-foreground">
        Watch how to write <span className="text-primary font-bold">{letter}</span>
      </p>
      <StrokeWriter
        glyph={glyph}
        strokeDurationMs={1800}
        // Event-driven: the sequencer awaits this promise before the next stroke.
        onStrokeStart={async (i, guidance) => {
          if (i === 0 && !introSpokenRef.current) {
            introSpokenRef.current = true;
            await speakAsync(`Let's write the letter ${letter}.`, {
              profile: "girl",
              pauseAfterMs: 120,
            });
          }
          await speakAsync(guidance, { profile: "girl", pauseAfterMs: 120 });
        }}
        onProgressCue={(cue) => {
          if (cue === "halfway") speak("Halfway there. Keep going!", { profile: "girl" });
          if (cue === "last") speak("Just one more stroke.", { profile: "girl" });
        }}
        onComplete={() => {
          // Fires ONLY after final stroke animation + narration have ended.
          speak(`Wonderful! The letter ${letter} is complete.`, { profile: "girl" });
        }}
      />
    </div>
  );
};

// --- Trace tab content -----------------------------------------------------
const TracePanel = ({ letter }: { letter: string }) => {
  const glyph = GLYPHS[letter];
  const [reward, setReward] = useState(false);
  const milestonesRef = useRef({ started: false, quarter: false, half: false, three: false });

  useEffect(() => {
    setReward(false);
    milestonesRef.current = { started: false, quarter: false, half: false, three: false };
    return () => cancelSpeech();
  }, [letter]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-display text-lg text-muted-foreground">
        Trace the dotted <span className="text-primary font-bold">{letter}</span> with your finger
        or mouse
      </p>
      <TracePad
        glyph={glyph}
        onProgress={(pct) => {
          const m = milestonesRef.current;
          if (!m.started && pct > 0.05) {
            m.started = true;
            speak("Good start. Follow the dotted line.", { profile: "girl" });
          } else if (!m.quarter && pct >= 0.25) {
            m.quarter = true;
            speak("Nice, keep going.", { profile: "girl" });
          } else if (!m.half && pct >= 0.5) {
            m.half = true;
            speak("Halfway there!", { profile: "girl" });
          } else if (!m.three && pct >= 0.75) {
            m.three = true;
            speak("Almost finished. You're doing great.", { profile: "girl" });
          }
        }}
        onSuccess={() => {
          // Fires ONLY after coverage threshold reached — never premature.
          if (reward) return;
          setReward(true);
          playSuccess();
          awardStar(1);
          awardCoin(2);
          recordAttempt(true);
          markLetter(letter);
          recordAndSpeak([
            { text: praise(), profile: "girl", pauseAfterMs: 150 },
            {
              text: `You finished writing the letter ${letter}!`,
              profile: "girl",
              pauseAfterMs: 120,
            },
            { text: "Amazing work!", profile: "girl" },
          ]);
        }}
        onIdleHint={() => {
          speak("Take your time. Follow the dotted line.", { profile: "girl" });
        }}
      />
      {reward && (
        <div className="flex items-center gap-2 bg-kid-yellow/15 text-foreground px-4 py-2 rounded-full font-display font-bold animate-in zoom-in duration-300">
          <Star className="w-5 h-5 text-kid-yellow fill-kid-yellow" />
          +1 Star &nbsp;·&nbsp; +2 Coins
        </div>
      )}
    </div>
  );
};

// --- Words tab content -----------------------------------------------------
const WordsPanel = ({ letter, words }: { letter: string; words: LetterWord[] }) => (
  <div className="flex flex-col items-center gap-4">
    <p className="text-center font-display text-lg text-muted-foreground">
      Things that start with <span className="text-primary font-bold">{letter}</span>
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 place-items-center">
      {words.map((w) => (
        <div key={w.word} className="flex flex-col items-center gap-2">
          <WordImage
            emoji={w.emoji}
            word={w.word}
            size="md"
            onClick={() => {
              playPop();
              recordAndSpeak([
                { text: `${w.word}.`, profile: "girl", pauseAfterMs: 200 },
                { text: `${letter} for ${w.word}.`, profile: "girl" },
              ]);
            }}
          />
          <span className="font-display font-bold text-foreground text-sm md:text-base">
            {w.word}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// --- Quiz tab content ------------------------------------------------------
const QuizPanel = ({ letter, words }: { letter: string; words: LetterWord[] }) => {
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [pickedWord, setPickedWord] = useState<string | null>(null);

  const question = useMemo(() => {
    const correct = words[Math.floor(Math.random() * words.length)];
    const distractors = ALL_WORDS.filter(
      (w) => !w.word.toUpperCase().startsWith(letter.toUpperCase()),
    )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    return { correct, options };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter, round]);

  useEffect(() => {
    setFeedback(null);
    setPickedWord(null);
    const t = setTimeout(() => {
      speak(`Which one starts with ${letter}?`, { profile: "girl" });
    }, 250);
    return () => clearTimeout(t);
  }, [letter, round]);

  const handlePick = (w: LetterWord) => {
    if (feedback) return;
    setPickedWord(w.word);
    const isCorrect = w.word === question.correct.word;
    recordAttempt(isCorrect);
    if (isCorrect) {
      setFeedback("correct");
      playSuccess();
      awardStar(1);
      awardCoin(3);
      markLetter(letter);
      recordAndSpeak([
        { text: praise(), profile: "girl", pauseAfterMs: 150 },
        { text: `${w.word} starts with ${letter}.`, profile: "girl" },
      ]);
      setTimeout(() => setRound((r) => r + 1), 1800);
    } else {
      setFeedback("wrong");
      playError();
      speak(retryHint(), { profile: "girl" });
      setTimeout(() => {
        setFeedback(null);
        setPickedWord(null);
      }, 1400);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-display text-xl md:text-2xl text-foreground">
        Which one starts with{" "}
        <span className="text-primary font-bold text-2xl md:text-3xl">{letter}</span>?
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 place-items-center">
        {question.options.map((w) => {
          const highlighted =
            feedback === "correct" && w.word === question.correct.word
              ? true
              : feedback === "wrong" && pickedWord === w.word
                ? true
                : false;
          return (
            <div key={w.word} className="flex flex-col items-center gap-2">
              <WordImage
                emoji={w.emoji}
                word={w.word}
                size="md"
                onClick={() => handlePick(w)}
                highlighted={highlighted}
              />
              <span className="font-display font-bold text-foreground text-sm md:text-base">
                {w.word}
              </span>
            </div>
          );
        })}
      </div>
      {feedback === "correct" && (
        <div className="font-display font-bold text-accent text-lg animate-in zoom-in duration-300">
          ⭐ Correct! Next question…
        </div>
      )}
      {feedback === "wrong" && (
        <div className="font-display font-bold text-destructive text-lg animate-in zoom-in duration-300">
          Almost! Try again.
        </div>
      )}
    </div>
  );
};

// --- Reusable HLS VideoPlayer Component ------------------------------------
const getSavedTime = (videoKey: string) => {
  if (typeof window === "undefined") return 0;
  const uid = auth.currentUser?.uid || "guest";
  const key = `continue_watching_${uid}_${videoKey.toLowerCase()}`;
  return parseFloat(localStorage.getItem(key) || "0");
};

const saveTime = (videoKey: string, time: number, duration: number) => {
  if (typeof window === "undefined") return;
  const uid = auth.currentUser?.uid || "guest";
  const key = `continue_watching_${uid}_${videoKey.toLowerCase()}`;
  
  if (duration > 0 && time / duration > 0.9) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, time.toString());
  }
};

const syncProgressToFirebase = async (videoKey: string, time: number, duration: number) => {
  const user = auth.currentUser;
  if (!user) return;
  const isCompleted = duration > 0 && time / duration > 0.9;
  try {
    await updateDoc(doc(db, "users", user.uid), {
      [`videoProgress.${videoKey.toLowerCase()}`]: isCompleted ? 0 : time
    });
  } catch (e) {
    console.warn("Failed to sync video progress to Firestore: ", e);
  }
};

let globalPreloadHls: Hls | null = null;
let globalPreloadVideo: HTMLVideoElement | null = null;

const preloadNextVideo = (nextKey: string) => {
  if (typeof window === "undefined") return;
  
  if (globalPreloadHls) {
    globalPreloadHls.destroy();
    globalPreloadHls = null;
  }
  
  let profile = "sp_auto:maxres_480p";
  if (typeof navigator !== "undefined" && (navigator as any).connection) {
    const conn = (navigator as any).connection;
    if (conn.saveData || (conn.downlink && conn.downlink < 1.5) || ["2g", "3g"].includes(conn.effectiveType)) {
      profile = "sp_auto:maxres_360p";
    }
  }
  
  const nextUrl = `https://res.cloudinary.com/re4x0shq/video/upload/${profile}/kinder/alphabet/${nextKey.toLowerCase()}.m3u8`;
  
  if (Hls.isSupported()) {
    if (!globalPreloadVideo) {
      globalPreloadVideo = document.createElement("video");
    }
    const hls = new Hls({
      maxMaxBufferLength: 2,
      enableWorker: true,
    });
    globalPreloadHls = hls;
    hls.loadSource(nextUrl);
    hls.attachMedia(globalPreloadVideo);
  }
};

// --- Reusable HLS VideoPlayer Component ------------------------------------
const VideoPlayer = ({
  videoKey,
  className = "",
  onEnded,
}: {
  videoKey: string;
  className?: string;
  onEnded?: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const videoUrl = useMemo(() => {
    let profile = "sp_auto:maxres_480p";
    if (typeof navigator !== "undefined" && (navigator as any).connection) {
      const conn = (navigator as any).connection;
      if (conn.saveData || (conn.downlink && conn.downlink < 1.5) || ["2g", "3g"].includes(conn.effectiveType)) {
        profile = "sp_auto:maxres_360p";
        console.log("Slow connection detected, choosing 360p adaptive stream.");
      }
    }
    return `https://res.cloudinary.com/re4x0shq/video/upload/${profile}/kinder/alphabet/${videoKey.toLowerCase()}.m3u8`;
  }, [videoKey]);

  const posterUrl = `https://res.cloudinary.com/re4x0shq/video/upload/kinder/alphabet/${videoKey.toLowerCase()}.jpg`;

  // Advanced preloading of manifest AND first segment in background
  useEffect(() => {
    let nextKey: string | null = null;
    if (videoKey.length === 1) {
      const charCode = videoKey.toLowerCase().charCodeAt(0);
      const nextChar = String.fromCharCode(charCode + 1);
      if (AVAILABLE_LETTERS.includes(nextChar)) {
        nextKey = nextChar;
      }
    } else {
      const idx = GENERAL_VIDEOS.findIndex((v) => v.key.toLowerCase().replace(".mp4", "") === videoKey.toLowerCase());
      if (idx !== -1 && idx < GENERAL_VIDEOS.length - 1) {
        nextKey = GENERAL_VIDEOS[idx + 1].key.replace(".mp4", "");
      }
    }

    if (nextKey) {
      preloadNextVideo(nextKey);
    }
  }, [videoKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setHasError(false);
    setIsLoaded(false);

    // Clean up previous Hls player instance before creating a new one
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsLoaded(true);
    };

    const handleEnded = () => {
      syncProgressToFirebase(videoKey, video.currentTime, video.duration);
      if (onEnded) onEnded();
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        saveTime(videoKey, video.currentTime, video.duration);
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);

    const applyResumePlayback = () => {
      const savedTime = getSavedTime(videoKey);
      if (savedTime > 0) {
        video.currentTime = savedTime;
      }
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        applyResumePlayback();
        video.play().catch((err) => {
          console.log("Autoplay prevented, user interaction required: ", err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("Fatal HLS network error, recovering...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("Fatal HLS media error, recovering...");
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal HLS error, showing fallback UI.");
              setHasError(true);
              setIsLoading(false);
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Apple HLS support
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        applyResumePlayback();
        video.play().catch((err) => {
          console.log("Native HLS autoplay failed: ", err);
        });
      });
    } else {
      video.src = `https://res.cloudinary.com/re4x0shq/video/upload/kinder/alphabet/${videoKey.toLowerCase()}.mp4`;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        applyResumePlayback();
      });
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      
      // Save progress to firebase on unmount
      if (video.duration) {
        syncProgressToFirebase(videoKey, video.currentTime, video.duration);
      }

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [videoUrl, videoKey, onEnded]);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted/20 text-center max-w-md mx-auto rounded-bubble h-full w-full">
        <span className="text-4xl mb-2">😅</span>
        <h4 className="font-display font-bold text-foreground">Failed to Load Video</h4>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          Please check your internet connection or try again.
        </p>
        <button
          onClick={() => {
            setHasError(false);
            setIsLoading(true);
            const video = videoRef.current;
            if (video && hlsRef.current) {
              hlsRef.current.loadSource(videoUrl);
            }
          }}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-display font-bold rounded-full"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        poster={posterUrl}
        className={`w-full h-full object-contain transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        controls
        playsInline
        preload="none"
      />
    </div>
  );
};

// --- Story tab content -----------------------------------------------------
const StoryPanel = ({
  letter,
  isPremium,
  onOpenSubscribe,
  onEnded,
}: {
  letter: string;
  isPremium: boolean;
  onOpenSubscribe: () => void;
  onEnded?: () => void;
}) => {
  const hasVideo = AVAILABLE_LETTERS.includes(letter.toLowerCase());

  useEffect(() => {
    cancelSpeech();
    if (hasVideo) {
      speak(`Watch the premium story for letter ${letter}!`, { profile: "girl" });
    } else {
      speak(`No story video for letter ${letter} yet, coming soon!`, { profile: "girl" });
    }
  }, [letter, hasVideo]);

  if (!hasVideo) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-2xl border border-dashed border-border text-center max-w-md mx-auto">
        <Tv className="w-12 h-12 text-muted-foreground/60 mb-3 animate-bounce" />
        <h3 className="font-display font-bold text-lg text-foreground mb-1">
          Story Coming Soon!
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our animators are working hard to create a magical story for the letter{" "}
          <span className="font-bold text-primary">{letter}</span>. Check out other letters like A, B, C, D, E, F!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
      <h3 className="font-display font-bold text-xl md:text-2xl text-foreground text-center">
        📖 Premium Story: Letter <span className="text-primary font-extrabold">{letter}</span>
      </h3>
      
      <div className="relative w-full aspect-video rounded-bubble overflow-hidden shadow-2xl border-4 border-primary/20 bg-black">
        {isPremium ? (
          <VideoPlayer videoKey={letter} onEnded={onEnded} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center relative bg-slate-900">
            {/* Blurred background effect */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />
            
            <div className="relative z-10 flex flex-col items-center text-white px-4">
              <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg mb-4 animate-pulse">
                <Lock className="w-8 h-8 text-black fill-current" />
              </div>
              <h4 className="font-display font-bold text-xl mb-2">
                🔒 Unlock Premium Story
              </h4>
              <p className="text-sm text-yellow-100/90 max-w-sm mb-6 text-center">
                Watch the beautiful letter {letter} animated story video and get unlimited access to all premium learning content!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClick();
                  onOpenSubscribe();
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-display font-bold rounded-full shadow-xl hover:from-yellow-300 hover:to-amber-400 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 fill-current text-black" />
                Upgrade to Premium
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GENERAL_VIDEOS = [
  {
    key: "vid-20260724-wa0023.mp4",
    title: "Alphabet Phonics Fun Song",
    duration: "2:15",
    description: "Learn how letter sounds combine to make words with this cute animated song!",
    color: "from-kid-orange to-kid-yellow",
  },
  {
    key: "vid-20260727-wa0020.mp4",
    title: "ABC Adventure Song",
    duration: "4:30",
    description: "An adventurous journey through the entire alphabet from A to Z.",
    color: "from-kid-purple to-kid-pink",
  },
  {
    key: "ytshort_30jul2026_19_18_53.mp4",
    title: "Complete ABC Phonics Story",
    duration: "5:12",
    description: "Explore all letter sounds and pronunciation rules with Kindi.",
    color: "from-kid-yellow to-kid-green",
  },
  {
    key: "ytshort_30jul2026_18_25_49.mp4",
    title: "Super Alphabet Song",
    duration: "3:40",
    description: "Upbeat high-energy alphabet song to get kids moving and learning.",
    color: "from-kid-green to-kid-teal",
  },
  {
    key: "ytshort_24jul2026_17_51_09.mp4",
    title: "Kindi's Quick Phonics A-Z",
    duration: "1:00",
    description: "Quick educational short containing alphabet pronunciation.",
    color: "from-kid-pink to-kid-purple",
  },
  {
    key: "ytshort_30jul2026_17_34_55.mp4",
    title: "Letters Sound Play",
    duration: "1:05",
    description: "Interactive phonics gameplay and letter sounds challenge.",
    color: "from-kid-blue to-kid-teal",
  },
  {
    key: "ytshort_30jul2026_17_48_34.mp4",
    title: "Fun Phonics Practice",
    duration: "1:15",
    description: "Practice letter associations and vocabulary development.",
    color: "from-kid-red to-kid-orange",
  },
];

const VideoCard = ({
  title,
  duration,
  description,
  color,
  isLocked,
  onClick,
}: {
  title: string;
  duration: string;
  description: string;
  color: string;
  isLocked: boolean;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-card border border-border rounded-bubble overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all flex flex-col h-full relative"
  >
    <div className={`h-36 bg-gradient-to-br ${color} relative flex items-center justify-center overflow-hidden`}>
      <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center">
        {isLocked ? (
          <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Lock className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <Play className="w-5 h-5 text-primary fill-primary ml-1" />
          </div>
        )}
      </div>
      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-mono">
        {duration}
      </span>
    </div>
    
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h4 className="font-display font-bold text-foreground text-sm md:text-base mb-1 line-clamp-1 flex items-center justify-between gap-1">
          {title}
          {isLocked && <span className="text-[10px] bg-yellow-400/25 text-amber-800 dark:text-yellow-300 px-1.5 py-0.5 rounded-full font-bold">PRO</span>}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

const VideoTheaterModal = ({
  isOpen,
  onClose,
  videoKey,
  title,
  onEnded,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string;
  title: string;
  onEnded?: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card w-full max-w-3xl rounded-bubble overflow-hidden shadow-2xl border-4 border-primary/20 z-50 relative"
        >
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
            <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="aspect-video bg-black flex items-center justify-center">
            {videoKey && <VideoPlayer videoKey={videoKey} onEnded={onEnded} />}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

import { CategoryHero } from "@/components/CategoryHero";

// --- Main page (grid + expanded card + tabs) ------------------------------
const AlphabetGame = () => {
  const progress = useProgress();
  const isAdmin = useMemo(() => auth.currentUser?.email?.toLowerCase() === "kinderkidsspace@gmail.com", [auth.currentUser]);
  const hasPremium = progress.isPremium || isAdmin;
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("learn");
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [theaterVideo, setTheaterVideo] = useState<{ videoKey: string; title: string } | null>(null);
  const [videoFilter, setVideoFilter] = useState<"all" | "stories" | "songs">("all");

  const handleLetterClick = (letter: string) => {
    playPop();
    setSelectedLetter(letter);
    setActiveTab("learn");
    const first = WORDS_BY_LETTER[letter][0];
    recordAndSpeak([
      {
        text: `This is ${caseLabel(letter)} letter ${letter}.`,
        profile: "girl",
        pauseAfterMs: 250,
      },
      { text: `${letter}...`, profile: "girl", pauseAfterMs: 300 },
      { text: `${letter} for ${first.word}.`, profile: "girl", pauseAfterMs: 150 },
      { text: `${first.word}.`, profile: "girl" },
    ]);
    markLetter(letter.toUpperCase());

    setTimeout(() => {
      document
        .getElementById("alphabet-details-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const words = selectedLetter ? WORDS_BY_LETTER[selectedLetter] : [];
  const gradientFor = (letter: string) => {
    const idx = isLower(letter) ? lowercaseAlphabet.indexOf(letter) : alphabet.indexOf(letter);
    return gradients[Math.max(0, idx) % gradients.length];
  };
  const gradient = selectedLetter ? gradientFor(selectedLetter) : gradients[0];

  // Dynamically build the video list from available assets
  const availableLetterStories = useMemo(() => {
    return AVAILABLE_LETTERS.map((char) => {
      const letter = char.toUpperCase();
      return {
        key: `${char}.mp4`,
        title: `Letter ${letter} Story`,
        duration: "1:30",
        description: `Watch the magical story and adventures of the letter ${letter}!`,
        color: gradients[letter.charCodeAt(0) % gradients.length],
        isLetterStory: true,
        src: `/Alphabet_videos/${char}.mp4`,
      };
    }).sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  const mappedSongs = useMemo(() => {
    return GENERAL_VIDEOS.map((v) => ({
      ...v,
      isLetterStory: false,
      src: `/Alphabet_videos/${v.key}`,
    }));
  }, []);

  const allVideos = useMemo(() => {
    return [...availableLetterStories, ...mappedSongs];
  }, [availableLetterStories, mappedSongs]);

  const filteredVideos = useMemo(() => {
    return allVideos.filter((v) => {
      if (videoFilter === "stories") return v.isLetterStory;
      if (videoFilter === "songs") return !v.isLetterStory;
      return true;
    });
  }, [allVideos, videoFilter]);

  const handleVideoClick = (video: typeof allVideos[0]) => {
    playClick();
    if (hasPremium) {
      const videoKey = video.key.replace(".mp4", "");
      setTheaterVideo({ videoKey, title: video.title });
    } else {
      setIsSubscribeModalOpen(true);
    }
  };

  const handleVideoEnded = (currentKey: string) => {
    // 1. Mark letter as completed in Firebase / Progress state + Award Stars
    if (currentKey.length === 1) {
      const letters = progress.lettersLearned || [];
      const uppercaseLetter = currentKey.toUpperCase();
      
      if (!letters.includes(uppercaseLetter)) {
        markLetter(uppercaseLetter);
        awardStar(1);
        
        const newCount = letters.length + 1;
        if (newCount > 0 && newCount % 5 === 0) {
          awardBadge(`alphabet_champion_${newCount}`);
          speak(`Outstanding! You unlocked the Alphabet Champion ${newCount} Badge!`, { profile: "girl" });
        }
      }
    } else {
      awardStar(1);
    }

    // 2. Play next video (A -> B -> C etc.)
    let nextKey: string | null = null;
    let nextTitle = "";

    if (currentKey.length === 1) {
      const charCode = currentKey.toLowerCase().charCodeAt(0);
      const nextChar = String.fromCharCode(charCode + 1);
      if (AVAILABLE_LETTERS.includes(nextChar)) {
        nextKey = nextChar;
        nextTitle = `Letter ${nextChar.toUpperCase()} Story`;
      }
    } else {
      const idx = GENERAL_VIDEOS.findIndex((v) => v.key.toLowerCase().replace(".mp4", "") === currentKey.toLowerCase());
      if (idx !== -1 && idx < GENERAL_VIDEOS.length - 1) {
        const nextVideo = GENERAL_VIDEOS[idx + 1];
        nextKey = nextVideo.key.replace(".mp4", "");
        nextTitle = nextVideo.title;
      }
    }

    if (nextKey) {
      if (theaterVideo) {
        setTheaterVideo({ videoKey: nextKey, title: nextTitle });
      } else if (selectedLetter && activeTab === "story") {
        handleLetterClick(nextKey.toUpperCase());
        setActiveTab("story");
      }
    } else {
      if (theaterVideo) {
        setTheaterVideo(null);
      }
    }
  };

  return (
    <div className="w-full">
      <CategoryHero
        category="alphabets"
        title="Learn Alphabets with Kindi!"
        description="Explore A to Z, discover new words, and have fun learning!"
        ctaText="Start Learning"
      />
      <div id="learning-content" className="p-4 md:p-8 max-w-5xl mx-auto scroll-mt-20">

        <AnimatePresence>
          {selectedLetter && (
            <motion.div
              id="alphabet-details-panel"
              key="main-panel"
              initial={{ scale: 0.95, opacity: 1, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="mb-8 bg-card rounded-bubble shadow-2xl border border-border relative overflow-hidden min-h-[300px] scroll-mt-32"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 pointer-events-none transition-colors duration-500`}
              />

              {/* Tabs */}
              <div className="relative z-10 flex flex-wrap gap-1 md:gap-2 px-4 pt-4 border-b border-border bg-muted/20">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        playClick();
                        cancelSpeech();
                        setActiveTab(t.id);
                      }}
                      aria-pressed={active}
                      className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-t-xl font-display font-semibold text-sm md:text-base transition-colors cursor-pointer ${
                        active
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4 animate-pulse" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="relative z-10 p-4 md:p-8">
                <div
                  key={`${selectedLetter}-${activeTab}`}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both"
                >
                  {activeTab === "learn" && <LearnPanel letter={selectedLetter} words={words} />}
                  {activeTab === "write" && <WritePanel letter={selectedLetter} />}
                  {activeTab === "trace" && <TracePanel letter={selectedLetter} />}
                  {activeTab === "words" && <WordsPanel letter={selectedLetter} words={words} />}
                  {activeTab === "quiz" && <QuizPanel letter={selectedLetter} words={words} />}
                  {activeTab === "story" && (
                    <StoryPanel
                      letter={selectedLetter}
                      isPremium={hasPremium}
                      onOpenSubscribe={() => setIsSubscribeModalOpen(true)}
                      onEnded={() => handleVideoEnded(selectedLetter)}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
          ⭐️ Capital Letters (A – Z)
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-3">
          {alphabet.map((letter, i) => (
            <motion.button
              key={letter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.01, duration: 0.3 }}
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0], y: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLetterClick(letter)}
              aria-label={`Learn capital letter ${letter}`}
              className={`bg-gradient-to-br ${gradients[i % gradients.length]} text-primary-foreground rounded-2xl p-4 text-2xl md:text-3xl font-display font-bold shadow-lg cursor-pointer relative overflow-hidden
                ${selectedLetter === letter ? "ring-4 ring-foreground shadow-2xl" : ""}`}
            >
              <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors" />
              {letter}
            </motion.button>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-10 mb-4 flex items-center gap-2">
          ⭐️ Lowercase Letters (a – z)
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-3 mb-12">
          {lowercaseAlphabet.map((letter, i) => (
            <motion.button
              key={letter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.01, duration: 0.3 }}
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0], y: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLetterClick(letter)}
              aria-label={`Learn lowercase letter ${letter}`}
              className={`bg-gradient-to-br ${gradients[(i + 3) % gradients.length]} text-primary-foreground rounded-2xl p-4 text-2xl md:text-3xl font-display font-bold shadow-lg cursor-pointer relative overflow-hidden lowercase
                ${selectedLetter === letter ? "ring-4 ring-foreground shadow-2xl" : ""}`}
            >
              <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors" />
              {letter}
            </motion.button>
          ))}
        </div>

        {/* Dedicated Premium Story Section */}
        {allVideos.length > 0 && (
          <div className="mt-16 p-6 md:p-8 bg-gradient-to-br from-yellow-400/10 to-amber-500/5 rounded-bubble border border-yellow-400/25 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Gamification Dashboard */}
            <div className="relative z-10 mb-8 p-4 bg-card/60 backdrop-blur-md rounded-2xl border border-border flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="p-3 bg-yellow-400/20 text-yellow-600 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-semibold">Stars Earned</div>
                  <div className="text-xl font-display font-black text-foreground">{progress.stars || 0} ⭐</div>
                </div>
              </div>

              <div className="flex-1 w-full md:max-w-xs">
                <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1.5">
                  <span>Alphabet Progress</span>
                  <span>{progress.lettersLearned?.length || 0} / 26 Letters</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/60">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((progress.lettersLearned?.length || 0) / 26) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                <span className="text-xs text-muted-foreground font-semibold">Badges:</span>
                {progress.badges?.filter(b => b.startsWith("alphabet_champion_")).length > 0 ? (
                  progress.badges
                    .filter((b) => b.startsWith("alphabet_champion_"))
                    .map((b) => {
                      const count = b.split("_").pop();
                      return (
                        <div
                          key={b}
                          className="px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-display font-extrabold text-xs rounded-full shadow-sm flex items-center gap-1 border border-yellow-500/20 animate-bounce"
                        >
                          🏆 {count} Letters
                        </div>
                      );
                    })
                ) : (
                  <span className="text-xs text-muted-foreground italic bg-muted/40 px-2 py-1 rounded-full">Complete 5 letters to earn a badge!</span>
                )}
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-4xl font-display font-extrabold text-foreground flex items-center gap-2">
                  <Film className="w-8 h-8 text-yellow-500 animate-pulse fill-yellow-500/10" />
                  Premium Story & Video Library
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Enjoy fun, magical, and educational alphabet story videos narrated by Kindi!
                </p>
              </div>

              {/* Filters */}
              <div className="flex gap-2 bg-muted/40 p-1 rounded-full border border-border self-start">
                {(["all", "stories", "songs"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      playClick();
                      setVideoFilter(filter);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-display font-bold capitalize transition-all cursor-pointer ${
                      videoFilter === filter
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter === "all" ? "All Videos" : filter === "stories" ? "Letter Stories" : "Songs & Shorts"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.key}
                  title={video.title}
                  duration={video.duration}
                  description={video.description}
                  color={video.color}
                  isLocked={!hasPremium}
                  onClick={() => handleVideoClick(video)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <SettingsBar />

      {/* Premium Upgrades & Modals */}
      <SubscriptionModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />

      <VideoTheaterModal
        isOpen={!!theaterVideo}
        onClose={() => setTheaterVideo(null)}
        videoKey={theaterVideo?.videoKey || ""}
        title={theaterVideo?.title || ""}
        onEnded={() => handleVideoEnded(theaterVideo?.videoKey || "")}
      />
    </div>
  );
};

export default AlphabetGame;
