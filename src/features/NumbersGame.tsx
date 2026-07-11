import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Volume2, BookOpen, PenLine, Hand, HelpCircle, Grid3x3, Plus } from "lucide-react";
import { playClick, playPop, playSuccess, playError } from "@/lib/sounds";
import { recordAndSpeak, speak, speakAsync, praise, retryHint, cancelSpeech } from "@/lib/tts";
import { DIGIT_GLYPHS } from "@/lib/glyphs";
import { awardCoin, awardStar, markNumber, recordAttempt } from "@/lib/progress";
import { numberToWords } from "@/lib/numberWords";
import StrokeWriter from "@/components/learning/StrokeWriter";
import TracePad from "@/components/learning/TracePad";
import SettingsBar from "@/components/learning/SettingsBar";
import { IMG_MAP } from "@/lib/images";
import NumberTypesSection from "@/components/learning/NumberTypesSection";

const NUMBER_IMAGE_KEYS = [
  "Apple",
  "Banana",
  "Orange",
  "Grapes",
  "Mango",
  "Lemon",
  "Ice cream",
  "Cake",
  "Pizza",
  "Egg",
];

const gradients = [
  "from-kid-blue to-kid-teal",
  "from-kid-green to-kid-teal",
  "from-kid-orange to-kid-yellow",
  "from-kid-purple to-kid-pink",
  "from-kid-pink to-kid-red",
  "from-kid-teal to-kid-green",
  "from-kid-red to-kid-orange",
  "from-kid-yellow to-kid-green",
];

const numberName = (n: number) => numberToWords(n);

type Tab = "learn" | "write" | "trace" | "count" | "quiz";
const TABS: Array<{ id: Tab; label: string; icon: typeof BookOpen }> = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "write", label: "Write", icon: PenLine },
  { id: "trace", label: "Trace", icon: Hand },
  { id: "count", label: "Count", icon: Grid3x3 },
  { id: "quiz", label: "Quiz", icon: HelpCircle },
];

// Turn a multi-digit number into a sequence of single-digit glyphs.
const digitsOf = (n: number) => n.toString().split("");

// --- Learn ------------------------------------------------------------------
const LearnPanel = ({ num }: { num: number }) => {
  const imgKey = NUMBER_IMAGE_KEYS[(num - 1) % NUMBER_IMAGE_KEYS.length];
  return (
    <div className="text-center">
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-7xl md:text-9xl font-display font-bold text-primary mb-4"
      >
        {num}
      </motion.div>
      <div className="text-3xl md:text-4xl mb-3 font-display text-foreground">
        The number <span className="text-secondary font-bold">{numberName(num)}</span>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playClick();
            recordAndSpeak([
              {
                text: `This is the number ${numberToWords(num)}.`,
                profile: "girl",
                pauseAfterMs: 200,
              },
              { text: `${numberToWords(num)}.`, profile: "girl" },
            ]);
          }}
          className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        >
          <Volume2 className="w-6 h-6" />
        </motion.button>
      </div>
      <div
        className="mt-6 flex overflow-x-auto gap-3 pb-4 max-w-full snap-x scrollbar-thin scrollbar-thumb-primary/20 px-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {Array.from({ length: num }).map((_, i) => (
          <img
            key={i}
            src={IMG_MAP[imgKey]}
            className="w-12 h-12 md:w-16 md:h-16 object-contain shrink-0 snap-center"
            draggable={false}
            alt={imgKey}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
};

// --- Write ------------------------------------------------------------------
// Multi-digit numbers get one StrokeWriter per digit, sequenced.
const WritePanel = ({ num }: { num: number }) => {
  const digits = digitsOf(num);
  const [activeDigit, setActiveDigit] = useState(0);
  const introRef = useRef(false);

  useEffect(() => {
    introRef.current = false;
    setActiveDigit(0);
    cancelSpeech();
    return () => cancelSpeech();
  }, [num]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-display text-lg text-muted-foreground">
        Watch how to write <span className="text-primary font-bold">{num}</span>
        {digits.length > 1 && ` (digit ${activeDigit + 1} of ${digits.length})`}
      </p>
      <StrokeWriter
        key={`${num}-${activeDigit}`}
        glyph={DIGIT_GLYPHS[digits[activeDigit]]}
        strokeDurationMs={1800}
        onStrokeStart={async (i, guidance) => {
          if (i === 0 && !introRef.current) {
            introRef.current = true;
            await speakAsync(
              digits.length > 1
                ? `Let's write ${num}. First, the digit ${digits[activeDigit]}.`
                : `Let's write the number ${num}.`,
              { profile: "girl", pauseAfterMs: 120 },
            );
          } else if (i === 0 && activeDigit > 0) {
            await speakAsync(`Now the digit ${digits[activeDigit]}.`, {
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
          if (activeDigit + 1 < digits.length) {
            speak(`Great! Now for the next digit.`, { profile: "girl" });
            setActiveDigit((d) => d + 1);
          } else {
            speak(`Wonderful! The number ${num} is complete.`, { profile: "girl" });
          }
        }}
      />
      {digits.length > 1 && (
        <div className="flex gap-2 text-2xl font-display font-bold">
          {digits.map((d, i) => (
            <span
              key={i}
              className={
                i === activeDigit
                  ? "text-primary"
                  : i < activeDigit
                    ? "text-accent"
                    : "text-muted-foreground"
              }
            >
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Trace ------------------------------------------------------------------
const TracePanel = ({ num }: { num: number }) => {
  const digits = digitsOf(num);
  const [activeDigit, setActiveDigit] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const milestonesRef = useRef({ started: false, quarter: false, half: false, three: false });

  useEffect(() => {
    setActiveDigit(0);
    setAllDone(false);
    milestonesRef.current = { started: false, quarter: false, half: false, three: false };
    return () => cancelSpeech();
  }, [num]);

  const resetMilestones = () => {
    milestonesRef.current = { started: false, quarter: false, half: false, three: false };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-display text-lg text-muted-foreground">
        Trace the number <span className="text-primary font-bold">{num}</span>
        {digits.length > 1 && ` (digit ${activeDigit + 1} of ${digits.length})`}
      </p>
      <TracePad
        key={`${num}-${activeDigit}`}
        glyph={DIGIT_GLYPHS[digits[activeDigit]]}
        onProgress={(pct) => {
          const m = milestonesRef.current;
          if (!m.started && pct > 0.05) {
            m.started = true;
            speak("Good start.", { profile: "girl" });
          } else if (!m.quarter && pct >= 0.25) {
            m.quarter = true;
            speak("Nice, keep going.", { profile: "girl" });
          } else if (!m.half && pct >= 0.5) {
            m.half = true;
            speak("Halfway there!", { profile: "girl" });
          } else if (!m.three && pct >= 0.75) {
            m.three = true;
            speak("Almost finished!", { profile: "girl" });
          }
        }}
        onSuccess={() => {
          if (activeDigit + 1 < digits.length) {
            playPop();
            speak("Great! Now the next digit.", { profile: "girl" });
            setActiveDigit((d) => d + 1);
            resetMilestones();
          } else if (!allDone) {
            setAllDone(true);
            playSuccess();
            awardStar(1);
            awardCoin(2);
            recordAttempt(true);
            markNumber(num);
            recordAndSpeak([
              { text: praise(), profile: "girl", pauseAfterMs: 150 },
              {
                text: `You finished writing the number ${num}!`,
                profile: "girl",
                pauseAfterMs: 120,
              },
              { text: "Amazing work!", profile: "girl" },
            ]);
          }
        }}
        onIdleHint={() => speak("Take your time. Follow the dotted line.", { profile: "girl" })}
      />
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 bg-kid-yellow/15 px-4 py-2 rounded-full font-display font-bold"
          >
            <Star className="w-5 h-5 text-kid-yellow fill-kid-yellow" />
            +1 Star · +2 Coins
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Count ------------------------------------------------------------------
const CountPanel = ({ num }: { num: number }) => {
  const imgKey = NUMBER_IMAGE_KEYS[(num - 1) % NUMBER_IMAGE_KEYS.length];
  const [step, setStep] = useState(0);

  const play = async () => {
    setStep(0);
    cancelSpeech();
    await speakAsync(`Let's count to ${numberToWords(num)}.`, {
      profile: "girl",
      pauseAfterMs: 150,
    });
    for (let i = 1; i <= num; i++) {
      setStep(i);
      await speakAsync(`${numberToWords(i)}`, { profile: "girl", pauseAfterMs: 80 });
    }
    await speakAsync(`That's ${numberToWords(num)}!`, { profile: "girl" });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-3 min-h-[6rem]">
        {Array.from({ length: num }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ scale: step > i ? 1.2 : 1, opacity: step >= i + 1 ? 1 : 0.3 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            <img
              src={IMG_MAP[imgKey]}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
              draggable={false}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        ))}
      </div>
      <div className="text-3xl font-display font-bold text-primary">
        {step}/{num}
      </div>
      <button
        onClick={play}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-display font-bold shadow-lg hover:scale-105 transition-transform"
      >
        ▶ Count with me
      </button>
    </div>
  );
};

// --- Quiz -------------------------------------------------------------------
const QuizPanel = ({ num }: { num: number }) => {
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  const question = useMemo(() => {
    // "How many objects?" quiz
    let count;
    if (round === 0) {
      count = num;
    } else {
      // Random count near num, but different each round for variety
      const maxCount = Math.max(5, Math.min(20, num + 4));
      count = Math.floor(Math.random() * maxCount) + 1;
    }

    const distractors = new Set<number>();
    while (distractors.size < 3) {
      const d = Math.max(1, count + Math.floor(Math.random() * 7) - 3);
      if (d !== count) distractors.add(d);
    }
    const options = [count, ...distractors].sort(() => Math.random() - 0.5);

    // Randomize the image for each round!
    const imgKey = NUMBER_IMAGE_KEYS[Math.floor(Math.random() * NUMBER_IMAGE_KEYS.length)];

    return { count, options, imgKey };
  }, [num, round]);

  useEffect(() => {
    setFeedback(null);
    setPicked(null);
    const t = setTimeout(() => speak(`How many do you see?`, { profile: "girl" }), 250);
    return () => clearTimeout(t);
  }, [num, round]);

  const pick = (val: number) => {
    if (feedback) return;
    setPicked(val);
    const ok = val === question.count;
    recordAttempt(ok);
    if (ok) {
      setFeedback("correct");
      playSuccess();
      awardStar(1);
      awardCoin(3);
      markNumber(num);
      recordAndSpeak([
        { text: praise(), profile: "girl", pauseAfterMs: 150 },
        { text: `Yes! There are ${val}.`, profile: "girl" },
      ]);
      setTimeout(() => setRound((r) => r + 1), 1800);
    } else {
      setFeedback("wrong");
      playError();
      speak(retryHint(), { profile: "girl" });
      setTimeout(() => {
        setFeedback(null);
        setPicked(null);
      }, 1400);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center font-display text-xl md:text-2xl text-foreground">
        How many do you see?
      </p>
      <div className="flex flex-wrap justify-center gap-3 max-w-lg">
        {Array.from({ length: question.count }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <img
              src={IMG_MAP[question.imgKey]}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
              draggable={false}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-sm">
        {question.options.map((opt) => {
          const highlight =
            feedback === "correct" && opt === question.count
              ? "bg-accent text-accent-foreground ring-4 ring-accent/40"
              : feedback === "wrong" && opt === picked
                ? "bg-destructive text-destructive-foreground"
                : "bg-muted text-foreground hover:bg-muted/80";
          return (
            <motion.button
              key={opt}
              whileHover={!feedback ? { scale: 1.05 } : {}}
              whileTap={!feedback ? { scale: 0.95 } : {}}
              onClick={() => pick(opt)}
              className={`${highlight} rounded-2xl p-4 text-2xl md:text-3xl font-display font-bold shadow-lg transition-colors`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// --- Main -------------------------------------------------------------------
const NumbersGame = () => {
  const [numbers, setNumbers] = useState<number[]>(() =>
    Array.from({ length: 20 }, (_, i) => i + 1),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("learn");

  const pick = (n: number) => {
    playPop();
    setSelected(n);
    setTab("learn");
    recordAndSpeak([
      { text: `This is the number ${n}.`, profile: "girl", pauseAfterMs: 200 },
      { text: `${n}.`, profile: "girl" },
    ]);
    markNumber(n);
    
    // Smoothly scroll back to the top where the details panel is displayed
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadMore = () => {
    playClick();
    setNumbers((cur) => {
      const next = cur[cur.length - 1] ?? 0;
      return [...cur, ...Array.from({ length: 10 }, (_, i) => next + i + 1)];
    });
  };

  const gradient = selected ? gradients[(selected - 1) % gradients.length] : gradients[0];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            🔢 Learn Numbers!
          </h1>
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div
              key={selected}
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="mb-8 bg-card rounded-bubble shadow-2xl border border-border relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 pointer-events-none`}
              />
              <div className="relative z-10 flex flex-wrap gap-1 md:gap-2 px-4 pt-4 border-b border-border">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        playClick();
                        cancelSpeech();
                        setTab(t.id);
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
              <div className="relative z-10 p-4 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selected}-${tab}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab === "learn" && <LearnPanel num={selected} />}
                    {tab === "write" && <WritePanel num={selected} />}
                    {tab === "trace" && <TracePanel num={selected} />}
                    {tab === "count" && <CountPanel num={selected} />}
                    {tab === "quiz" && <QuizPanel num={selected} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {numbers.map((n, i) => (
            <motion.button
              key={n}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i, 20) * 0.02, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => pick(n)}
              className={`bg-gradient-to-br ${gradients[(n - 1) % gradients.length]} text-primary-foreground rounded-2xl p-4 text-2xl md:text-3xl font-display font-bold shadow-lg cursor-pointer
                ${selected === n ? "ring-4 ring-foreground shadow-2xl" : ""}`}
            >
              {n}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full font-display font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            Load next 10 numbers
          </button>
        </div>

        <NumberTypesSection />
      </div>

      <SettingsBar />
    </div>
  );
};

export default NumbersGame;
