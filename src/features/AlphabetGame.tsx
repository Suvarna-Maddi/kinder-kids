import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Sparkles, PenLine, Hand, ImagePlus, HelpCircle, BookOpen, Star } from "lucide-react";
import { playClick, playSuccess, playError, playPop } from "@/lib/sounds";
import { recordAndSpeak, speak, speakAsync, praise, retryHint, cancelSpeech } from "@/lib/tts";
import { LETTER_GLYPHS, LETTER_WORDS, LOWERCASE_GLYPHS, LOWERCASE_WORDS, ALL_WORDS, type LetterWord } from "@/lib/glyphs";
import { awardCoin, awardStar, markLetter, recordAttempt } from "@/lib/progress";
import StrokeWriter from "@/components/learning/StrokeWriter";
import TracePad from "@/components/learning/TracePad";
import WordImage from "@/components/learning/WordImage";
import SettingsBar from "@/components/learning/SettingsBar";
import { IMG_MAP } from "@/lib/images";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const lowercaseAlphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const GLYPHS: Record<string, (typeof LETTER_GLYPHS)[string]> = { ...LETTER_GLYPHS, ...LOWERCASE_GLYPHS };
const WORDS_BY_LETTER: Record<string, LetterWord[]> = { ...LETTER_WORDS, ...LOWERCASE_WORDS };
const isLower = (l: string) => l === l.toLowerCase();
const caseLabel = (l: string) => (isLower(l) ? "lowercase" : "capital");

const gradients = [
  "from-kid-orange to-kid-yellow", "from-kid-purple to-kid-pink", "from-kid-yellow to-kid-green",
  "from-kid-green to-kid-teal", "from-kid-pink to-kid-purple", "from-kid-blue to-kid-teal",
  "from-kid-red to-kid-orange", "from-kid-teal to-kid-blue",
];

type Tab = "learn" | "write" | "trace" | "words" | "quiz";
const TABS: Array<{ id: Tab; label: string; icon: typeof BookOpen }> = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "write", label: "Write", icon: PenLine },
  { id: "trace", label: "Trace", icon: Hand },
  { id: "words", label: "Words", icon: ImagePlus },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
];

// --- Learn tab content (preserves the original expanded card design) ------
const LearnPanel = ({ letter, words }: { letter: string; words: LetterWord[] }) => {
  const primary = words[0];
  const speakLearn = () =>
    recordAndSpeak([
      { text: `Hello! This is ${caseLabel(letter)} letter ${letter}.`, profile: "girl", pauseAfterMs: 250 },
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
          <img src={IMG_MAP[primary.word]} alt={primary.word} className="w-32 h-32 md:w-48 md:h-48 mx-auto object-contain" draggable={false} />
        ) : (
          primary.emoji
        )}
      </div>
      <div className="text-2xl md:text-4xl font-display text-foreground">
        <span className="text-secondary font-bold">{letter}</span> for {primary.word}
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          playClick();
          speakLearn();
        }}
        aria-label={`Hear the letter ${letter}`}
        className="mt-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        <Volume2 className="w-6 h-6" />
      </motion.button>
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
            await speakAsync(`Let's write the letter ${letter}.`, { profile: "girl", pauseAfterMs: 120 });
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
        Trace the dotted <span className="text-primary font-bold">{letter}</span> with your finger or mouse
      </p>
      <TracePad
        glyph={glyph}
        onProgress={(pct) => {
          const m = milestonesRef.current;
          if (!m.started && pct > 0.05) { m.started = true; speak("Good start. Follow the dotted line.", { profile: "girl" }); }
          else if (!m.quarter && pct >= 0.25) { m.quarter = true; speak("Nice, keep going.", { profile: "girl" }); }
          else if (!m.half && pct >= 0.5) { m.half = true; speak("Halfway there!", { profile: "girl" }); }
          else if (!m.three && pct >= 0.75) { m.three = true; speak("Almost finished. You're doing great.", { profile: "girl" }); }
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
            { text: `You finished writing the letter ${letter}!`, profile: "girl", pauseAfterMs: 120 },
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
    const distractors = ALL_WORDS
      .filter((w) => !w.word.toUpperCase().startsWith(letter.toUpperCase()))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

// --- Main page (grid + expanded card + tabs) ------------------------------
const AlphabetGame = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("learn");

  const handleLetterClick = (letter: string) => {
    playPop();
    setSelectedLetter(letter);
    setActiveTab("learn");
    const first = WORDS_BY_LETTER[letter][0];
    recordAndSpeak([
      { text: `This is ${caseLabel(letter)} letter ${letter}.`, profile: "girl", pauseAfterMs: 250 },
      { text: `${letter}...`, profile: "girl", pauseAfterMs: 300 },
      { text: `${letter} for ${first.word}.`, profile: "girl", pauseAfterMs: 150 },
      { text: `${first.word}.`, profile: "girl" },
    ]);
    markLetter(letter.toUpperCase());

    setTimeout(() => {
      document.getElementById("alphabet-details-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const words = selectedLetter ? WORDS_BY_LETTER[selectedLetter] : [];
  const gradientFor = (letter: string) => {
    const idx = isLower(letter)
      ? lowercaseAlphabet.indexOf(letter)
      : alphabet.indexOf(letter);
    return gradients[Math.max(0, idx) % gradients.length];
  };
  const gradient = selectedLetter ? gradientFor(selectedLetter) : gradients[0];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-8 h-8 text-kid-yellow" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Learn Alphabets! 🔤
          </h1>
        </div>

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
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 pointer-events-none transition-colors duration-500`} />

              {/* Tabs */}
              <div className="relative z-10 flex flex-wrap gap-1 md:gap-2 px-4 pt-4 border-b border-border">
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
                      className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-t-xl font-display font-semibold text-sm md:text-base transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="relative z-10 p-4 md:p-8">
                <div key={`${selectedLetter}-${activeTab}`} className="animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-both">
                  {activeTab === "learn" && <LearnPanel letter={selectedLetter} words={words} />}
                  {activeTab === "write" && <WritePanel letter={selectedLetter} />}
                  {activeTab === "trace" && <TracePanel letter={selectedLetter} />}
                  {activeTab === "words" && <WordsPanel letter={selectedLetter} words={words} />}
                  {activeTab === "quiz" && <QuizPanel letter={selectedLetter} words={words} />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
          Capital Letters (A – Z)
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-3">
          {alphabet.map((letter, i) => (
            <motion.button
              key={letter}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02, type: "spring", stiffness: 300 }}
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

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-10 mb-4">
          Lowercase Letters (a – z)
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-3">
          {lowercaseAlphabet.map((letter, i) => (
            <motion.button
              key={letter}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02, type: "spring", stiffness: 300 }}
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
      </div>

      <SettingsBar />
    </div>
  );
};

export default AlphabetGame;
