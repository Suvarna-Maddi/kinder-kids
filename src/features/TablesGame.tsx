import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, Sparkles, Volume2 } from "lucide-react";
import { playClick, playSuccess, playError, playPop } from "@/lib/sounds";
import { recordAndSpeak, speak, speakAsync, praise, retryHint, cancelSpeech } from "@/lib/tts";
import { awardCoin, awardStar, markTable, recordAttempt } from "@/lib/progress";
import SettingsBar from "@/components/learning/SettingsBar";

const gradients = [
  "from-kid-blue to-kid-teal", "from-kid-green to-kid-teal", "from-kid-orange to-kid-yellow",
  "from-kid-purple to-kid-pink", "from-kid-pink to-kid-red", "from-kid-teal to-kid-green",
  "from-kid-red to-kid-orange", "from-kid-yellow to-kid-green", "from-kid-blue to-kid-purple",
  "from-kid-green to-kid-blue", "from-kid-orange to-kid-red", "from-kid-purple to-kid-blue",
];

const RANGE_OPTIONS = [10, 20, 50, 100, 500, 1000] as const;
const MAX_RENDER_ROWS = 2000;

const TablesGame = () => {
  const [table, setTable] = useState<number | null>(null);
  const [range, setRange] = useState<number>(10);
  const [customInput, setCustomInput] = useState<string>("");
  const [quizMode, setQuizMode] = useState(false);
  const [question, setQuestion] = useState({ a: 0, b: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [playingRow, setPlayingRow] = useState<number | null>(null);

  useEffect(() => () => cancelSpeech(), []);

  const rows = useMemo(
    () => Array.from({ length: Math.min(range, MAX_RENDER_ROWS) }, (_, i) => i + 1),
    [range]
  );
  const truncatedRows = range > MAX_RENDER_ROWS;

  const generateQuestion = (t: number) => {
    const b = Math.floor(Math.random() * Math.min(range, 12)) + 1;
    const correct = t * b;
    const opts = new Set<number>([correct]);
    while (opts.size < 4) {
      const wrong = correct + Math.floor(Math.random() * 10) - 5;
      if (wrong > 0) opts.add(wrong);
    }
    setQuestion({ a: t, b });
    setOptions([...opts].sort(() => Math.random() - 0.5));
    setSelected(null);
    setShowResult(false);
  };

  const startQuiz = (t: number) => {
    setTable(t);
    setQuizMode(true);
    setScore(0);
    setTotal(0);
    setStreak(0);
    generateQuestion(t);
  };

  const handleAnswer = (ans: number) => {
    if (showResult) return;
    setSelected(ans);
    setShowResult(true);
    setTotal((p) => p + 1);
    const isCorrect = ans === question.a * question.b;
    recordAttempt(isCorrect);
    if (isCorrect) {
      setScore((p) => p + 1);
      setStreak((p) => p + 1);
      playSuccess();
      awardStar(1);
      awardCoin(2);
      recordAndSpeak([
        { text: praise(), profile: "girl", pauseAfterMs: 150 },
        { text: `${question.a} times ${question.b} is ${question.a * question.b}.`, profile: "girl" },
      ]);
    } else {
      setStreak(0);
      playError();
      speak(retryHint(), { profile: "girl" });
    }
    setTimeout(() => generateQuestion(question.a), 1800);
  };

  const pickTable = (n: number) => {
    playPop();
    setTable(n);
    markTable(n);
    cancelSpeech();
    speak(`Table of ${n}.`, { profile: "girl" });
  };

  const readWholeTable = async () => {
    if (table == null) return;
    cancelSpeech();
    await speakAsync(`Table of ${table}.`, { profile: "girl", pauseAfterMs: 150 });
    for (const b of rows) {
      setPlayingRow(b);
      await speakAsync(`${table} times ${b} is ${table * b}.`, { profile: "girl", pauseAfterMs: 60 });
    }
    setPlayingRow(null);
    speak(`Great! You heard the whole table of ${table}.`, { profile: "girl" });
  };

  const readOneRow = (b: number) => {
    if (table == null) return;
    cancelSpeech();
    setPlayingRow(b);
    speakAsync(`${table} times ${b} is ${table * b}.`, { profile: "girl" }).then(() => setPlayingRow(null));
  };

  const submitCustom = () => {
    const n = parseInt(customInput, 10);
    if (!isNaN(n) && n > 0) {
      pickTable(n);
      setCustomInput("");
    }
  };

  const submitCustomRange = (val: string) => {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n > 0) setRange(n);
  };

  const correct = question.a * question.b;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            ✖️ Times Tables!
          </h1>
          {quizMode && (
            <div className="ml-auto flex items-center gap-3">
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
          )}
        </div>

        {!quizMode ? (
          <>
            {/* Custom input + range picker */}
            <div className="bg-card rounded-2xl border border-border shadow-md p-4 mb-6 flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-sm font-body text-muted-foreground mb-1">
                  Enter any table number (no limit)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitCustom()}
                    placeholder="e.g. 786"
                    className="flex-1 rounded-xl border-2 border-border bg-background px-3 py-2 font-display text-lg"
                  />
                  <button
                    onClick={submitCustom}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-display font-bold shadow hover:scale-105 transition-transform"
                  >
                    Go
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-body text-muted-foreground mb-1">
                  Generate till
                </label>
                <div className="flex gap-2">
                  <select
                    value={RANGE_OPTIONS.includes(range as (typeof RANGE_OPTIONS)[number]) ? range : ""}
                    onChange={(e) => e.target.value && setRange(parseInt(e.target.value, 10))}
                    className="rounded-xl border-2 border-border bg-background px-3 py-2 font-display text-lg"
                  >
                    <option value="">Custom</option>
                    {RANGE_OPTIONS.map((r) => (
                      <option key={r} value={r}>× {r}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={range}
                    onChange={(e) => submitCustomRange(e.target.value)}
                    className="w-24 rounded-xl border-2 border-border bg-background px-3 py-2 font-display text-lg"
                  />
                </div>
              </div>
            </div>

            <p className="text-xl font-body text-muted-foreground mb-6 text-center">
              Pick a table to practice, or type any number above! 🎯
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n, i) => (
                <motion.button
                  key={n}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0], y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => pickTable(n)}
                  className={`bg-gradient-to-br ${gradients[i]} text-primary-foreground rounded-2xl p-6 text-3xl md:text-4xl font-display font-bold shadow-lg cursor-pointer
                    ${table === n ? "ring-4 ring-foreground" : ""}`}
                >
                  {n}×
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {table && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 bg-card rounded-bubble shadow-2xl p-6 md:p-8 border border-border"
                >
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h2 className="text-3xl font-display font-bold text-primary">
                      Table of {table} ✨{" "}
                      <span className="text-base text-muted-foreground">
                        (× 1 to {range.toLocaleString()}
                        {truncatedRows ? `, showing first ${MAX_RENDER_ROWS.toLocaleString()}` : ""})
                      </span>
                    </h2>
                    <button
                      onClick={readWholeTable}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-display font-bold shadow hover:scale-105 transition-transform"
                    >
                      <Volume2 className="w-4 h-4" />
                      Read table aloud
                    </button>
                  </div>
                  <div className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6 ${range > 20 ? "max-h-[420px] overflow-auto pr-2" : ""}`}>
                    {rows.map((n, idx) => (
                      <motion.button
                        key={n}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(idx, 30) * 0.02 }}
                        onClick={() => readOneRow(n)}
                        className={`rounded-xl p-3 text-center font-display text-base md:text-lg text-foreground transition-colors ${
                          playingRow === n ? "bg-accent/30 ring-2 ring-accent" : "bg-muted hover:bg-muted/70"
                        }`}
                      >
                        {table} × {n} = <span className="font-bold text-primary">{table * n}</span>
                      </motion.button>
                    ))}
                  </div>
                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { playClick(); startQuiz(table); }}
                      className="bg-accent text-accent-foreground px-8 py-3 rounded-full font-display text-xl font-bold shadow-lg"
                    >
                      🎮 Take Quiz!
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-bubble shadow-2xl p-8 md:p-12 text-center max-w-lg mx-auto border border-border relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-kid-purple/5 to-kid-blue/5" />
            <div className="relative z-10">
              <div className="text-4xl md:text-6xl font-display font-bold text-foreground mb-8">
                {question.a} × {question.b} = ?
              </div>
              <div className="grid grid-cols-2 gap-4">
                {options.map((opt) => {
                  let btnClass = "bg-muted text-foreground hover:bg-muted/80";
                  if (showResult) {
                    if (opt === correct) btnClass = "bg-accent text-accent-foreground";
                    else if (opt === selected) btnClass = "bg-destructive text-destructive-foreground";
                  }
                  return (
                    <motion.button
                      key={opt}
                      whileHover={!showResult ? { scale: 1.05 } : {}}
                      whileTap={!showResult ? { scale: 0.95 } : {}}
                      onClick={() => handleAnswer(opt)}
                      className={`${btnClass} rounded-2xl p-4 text-2xl md:text-3xl font-display font-bold shadow-lg cursor-pointer transition-colors`}
                    >
                      {opt}
                      {showResult && opt === correct && <Check className="inline ml-2 w-6 h-6" />}
                      {showResult && opt === selected && opt !== correct && <X className="inline ml-2 w-6 h-6" />}
                    </motion.button>
                  );
                })}
              </div>
              <button
                onClick={() => { setQuizMode(false); }}
                className="mt-6 text-muted-foreground font-body underline"
              >
                ← Back to table
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <SettingsBar />
    </div>
  );
};

export default TablesGame;
