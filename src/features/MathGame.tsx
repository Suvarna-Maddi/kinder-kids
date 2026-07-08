import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, X as XIcon, Divide, Trophy, Sparkles, Check, X } from "lucide-react";
import { playClick, playSuccess, playError, playPop } from "@/lib/sounds";
import { recordAndSpeak, speak, praise, retryHint, cancelSpeech } from "@/lib/tts";
import { awardCoin, awardStar, recordAttempt, markGameCompleted } from "@/lib/progress";
import { makeUniqueGenerator, sampleUnique } from "@/lib/quizEngine";
import { numberToWords } from "@/lib/numberWords";
import SettingsBar from "@/components/learning/SettingsBar";

type Op = "add" | "sub" | "mul" | "div";
type Level = "easy" | "medium" | "hard";

const OP_META: Record<Op, { label: string; symbol: string; icon: typeof Plus; verb: string; color: string }> = {
  add: { label: "Addition", symbol: "+", icon: Plus, verb: "plus", color: "from-kid-green to-kid-teal" },
  sub: { label: "Subtraction", symbol: "−", icon: Minus, verb: "minus", color: "from-kid-orange to-kid-yellow" },
  mul: { label: "Multiplication", symbol: "×", icon: XIcon, verb: "times", color: "from-kid-purple to-kid-pink" },
  div: { label: "Division", symbol: "÷", icon: Divide, verb: "divided by", color: "from-kid-blue to-kid-teal" },
};

const LEVELS: Record<Level, { min: number; max: number; label: string }> = {
  easy:   { min: 1, max: 10,  label: "Easy (1–10)" },
  medium: { min: 1, max: 25,  label: "Medium (1–25)" },
  hard:   { min: 2, max: 50,  label: "Hard (2–50)" },
};

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

type Question = { a: number; b: number; op: Op; answer: number };

const buildGenerator = (op: Op, level: Level) => {
  const { min, max } = LEVELS[level];
  return makeUniqueGenerator<Question>(() => {
    let a: number;
    let b: number;
    let answer: number;
    if (op === "add") {
      a = rand(min, max); b = rand(min, max); answer = a + b;
    } else if (op === "sub") {
      a = rand(min, max); b = rand(min, Math.min(a, max));
      answer = a - b;
    } else if (op === "mul") {
      a = rand(min, Math.min(max, 12));
      b = rand(min, Math.min(max, 12));
      answer = a * b;
    } else {
      const divisor = rand(Math.max(2, min), Math.min(max, 12));
      const quotient = rand(Math.max(1, min), Math.min(max, 12));
      a = divisor * quotient; b = divisor; answer = quotient;
    }
    return { key: `${a}-${op}-${b}`, value: { a, b, op, answer } };
  }, 20);
};

const buildOptions = (answer: number, level: Level) => {
  const { max } = LEVELS[level];
  const spread = Math.max(4, Math.floor(max / 3));
  const pool: number[] = [];
  for (let d = 1; pool.length < 20; d++) {
    pool.push(Math.max(0, answer + d));
    pool.push(Math.max(0, answer - d));
    if (d > spread * 2) break;
  }
  const distractors = sampleUnique(pool.filter((n) => n !== answer), 3);
  const all = [answer, ...distractors];
  // pad if pool too small
  while (all.length < 4) all.push(answer + all.length);
  return all.sort(() => Math.random() - 0.5);
};

const MathGame = () => {
  const [op, setOp] = useState<Op>("add");
  const [level, setLevel] = useState<Level>("easy");
  const [question, setQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);

  const nextQ = useMemo(() => buildGenerator(op, level), [op, level]);

  const loadQuestion = () => {
    const q = nextQ();
    setQuestion(q);
    setOptions(buildOptions(q.answer, level));
    setSelected(null);
    setShowResult(false);
  };

  useEffect(() => {
    loadQuestion();
    return () => cancelSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [op, level]);

  useEffect(() => {
    if (!question) return;
    const meta = OP_META[question.op];
    speak(`${numberToWords(question.a)} ${meta.verb} ${numberToWords(question.b)}?`, { profile: "girl" });
  }, [question]);

  const handleAnswer = (ans: number) => {
    if (showResult || !question) return;
    setSelected(ans);
    setShowResult(true);
    setTotal((p) => p + 1);
    const correct = ans === question.answer;
    recordAttempt(correct);
    if (correct) {
      setScore((p) => p + 1);
      setStreak((p) => p + 1);
      playSuccess();
      awardStar(1);
      awardCoin(2);
      const meta = OP_META[question.op];
      recordAndSpeak([
        { text: praise(), profile: "girl", pauseAfterMs: 120 },
        {
          text: `${numberToWords(question.a)} ${meta.verb} ${numberToWords(question.b)} is ${numberToWords(question.answer)}.`,
          profile: "girl",
        },
      ]);
      setTimeout(loadQuestion, 1500);
    } else {
      setStreak(0);
      playError();
      speak(retryHint(), { profile: "girl" });
      setTimeout(() => {
        setSelected(null);
        setShowResult(false);
      }, 1200);
    }
  };

  const opMeta = OP_META[op];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-8 h-8 text-kid-yellow" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Mathematics! 🧮
          </h1>
          <div className="ml-auto flex items-center gap-2">
            {streak >= 3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-kid-orange/10 px-3 py-1 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-kid-orange" />
                <span className="font-display font-bold text-kid-orange text-sm">{streak}🔥</span>
              </motion.div>
            )}
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-lg border border-border">
              <Trophy className="w-5 h-5 text-kid-yellow" />
              <span className="font-display font-bold text-foreground">{score}/{total}</span>
            </div>
          </div>
        </div>

        {/* Operation picker */}
        <div className="grid grid-cols-4 gap-2 md:gap-3 mb-4">
          {(Object.keys(OP_META) as Op[]).map((o) => {
            const M = OP_META[o];
            const Icon = M.icon;
            const active = op === o;
            return (
              <motion.button
                key={o}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { playPop(); setOp(o); markGameCompleted(); }}
                className={`rounded-2xl p-3 md:p-4 font-display font-bold shadow-lg transition-colors bg-gradient-to-br ${M.color} ${
                  active ? "ring-4 ring-foreground text-primary-foreground" : "text-primary-foreground opacity-80"
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs md:text-sm">{M.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Level picker */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {(Object.keys(LEVELS) as Level[]).map((lv) => (
            <button
              key={lv}
              onClick={() => { playClick(); setLevel(lv); }}
              className={`px-4 py-2 rounded-full font-display font-semibold text-sm transition-colors ${
                level === lv
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {LEVELS[lv].label}
            </button>
          ))}
        </div>

        <motion.div
          key={`${op}-${level}-${question?.a}-${question?.b}`}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-card rounded-bubble shadow-2xl p-6 md:p-10 border border-border relative overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${opMeta.color} opacity-10 pointer-events-none`} />
          <div className="relative z-10 text-center">
            <AnimatePresence mode="wait">
              {question && (
                <motion.div
                  key={`q-${question.a}-${question.b}-${question.op}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-5xl md:text-7xl font-display font-bold text-foreground mb-8"
                >
                  {question.a}{" "}
                  <span className="text-primary">{opMeta.symbol}</span>{" "}
                  {question.b} = ?
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-lg mx-auto">
              <AnimatePresence>
                {options.map((opt) => {
                  let cls = "bg-muted text-foreground hover:bg-muted/80";
                  if (showResult && question) {
                    if (opt === question.answer) cls = "bg-accent text-accent-foreground";
                    else if (opt === selected) cls = "bg-destructive text-destructive-foreground";
                  }
                  return (
                    <motion.button
                      key={`${opt}-${question?.a}-${question?.b}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      whileHover={!showResult ? { scale: 1.05 } : {}}
                      whileTap={!showResult ? { scale: 0.95 } : {}}
                      onClick={() => handleAnswer(opt)}
                      className={`${cls} rounded-2xl p-4 md:p-5 text-2xl md:text-3xl font-display font-bold shadow-md transition-colors`}
                    >
                      {opt}
                      {showResult && question && opt === question.answer && <Check className="inline ml-2 w-6 h-6" />}
                      {showResult && opt === selected && question && opt !== question.answer && <X className="inline ml-2 w-6 h-6" />}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <SettingsBar />
    </div>
  );
};

export default MathGame;