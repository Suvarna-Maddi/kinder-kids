import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RefreshCw, Sparkles } from "lucide-react";
import { playClick, playSuccess, playError, playPop } from "@/lib/sounds";

const wordBank = [
  { word: "CAT", hint: "🐱 A furry pet that purrs" },
  { word: "DOG", hint: "🐶 Man's best friend" },
  { word: "SUN", hint: "☀️ It shines in the sky" },
  { word: "FISH", hint: "🐟 Lives in water" },
  { word: "TREE", hint: "🌳 It has leaves" },
  { word: "BALL", hint: "⚽ You throw and kick it" },
  { word: "MOON", hint: "🌙 Shines at night" },
  { word: "STAR", hint: "⭐ Twinkles in the sky" },
  { word: "BIRD", hint: "🐦 It can fly" },
  { word: "FROG", hint: "🐸 It jumps and says ribbit" },
  { word: "CAKE", hint: "🎂 Sweet and for birthdays" },
  { word: "RAIN", hint: "🌧️ Water from clouds" },
  { word: "BOOK", hint: "📚 You read it" },
  { word: "LION", hint: "🦁 King of the jungle" },
  { word: "DUCK", hint: "🦆 Quack quack!" },
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

const SpellingGame = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(() => shuffleWord(wordBank[0].word));
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);

  function shuffleWord(word: string): string[] {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const currentWord = wordBank[wordIndex];

  const handleLetterClick = (letter: string, index: number) => {
    playPop();
    const newGuessed = [...guessed, letter];
    setGuessed(newGuessed);
    setAvailable((prev) => prev.filter((_, i) => i !== index));

    if (newGuessed.length === currentWord.word.length) {
      setTotalAttempts((p) => p + 1);
      if (newGuessed.join("") === currentWord.word) {
        setScore((p) => p + 1);
        setShowSuccess(true);
        playSuccess();
        const u = new SpeechSynthesisUtterance(`Great job! ${currentWord.word}!`);
        u.pitch = 1.4;
        speechSynthesis.speak(u);
        setTimeout(() => nextWord(), 2000);
      } else {
        playError();
      }
    }
  };

  const handleRemoveLetter = (index: number) => {
    playClick();
    const letter = guessed[index];
    setGuessed((prev) => prev.filter((_, i) => i !== index));
    setAvailable((prev) => [...prev, letter]);
  };

  const nextWord = useCallback(() => {
    const next = (wordIndex + 1) % wordBank.length;
    setWordIndex(next);
    setGuessed([]);
    setAvailable(shuffleWord(wordBank[next].word));
    setShowSuccess(false);
  }, [wordIndex]);

  const resetWord = () => {
    playClick();
    setGuessed([]);
    setAvailable(shuffleWord(currentWord.word));
  };

  const isCorrect =
    guessed.join("") === currentWord.word && guessed.length === currentWord.word.length;
  const isWrong = guessed.length === currentWord.word.length && !isCorrect;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            📝 Spelling Bee!
          </h1>
          <div className="ml-auto flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-lg border border-border">
            <Trophy className="w-5 h-5 text-kid-yellow" />
            <span className="font-display font-bold text-foreground">{score}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-body text-muted-foreground">
              Word {wordIndex + 1} of {wordBank.length}
            </span>
            <span className="text-sm font-body text-muted-foreground">
              {Math.round((score / Math.max(totalAttempts, 1)) * 100)}% accuracy
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-kid-green to-kid-teal rounded-full"
              animate={{ width: `${((wordIndex + 1) / wordBank.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          key={wordIndex}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-card rounded-bubble shadow-2xl p-6 md:p-10 text-center border border-border relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-kid-pink/5 to-kid-purple/5" />
          <div className="relative z-10">
            <p className="text-2xl md:text-3xl font-display text-muted-foreground mb-6">
              {currentWord.hint}
            </p>

            {/* Answer slots */}
            <div className="flex justify-center gap-2 md:gap-3 mb-8">
              {currentWord.word.split("").map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={guessed[i] ? { scale: 1.05 } : {}}
                  className={`w-12 h-14 md:w-16 md:h-20 rounded-xl border-2 flex items-center justify-center text-2xl md:text-4xl font-display font-bold shadow-md cursor-pointer transition-all
                    ${
                      guessed[i]
                        ? isCorrect
                          ? "bg-accent text-accent-foreground border-accent shadow-lg"
                          : isWrong
                            ? "bg-destructive text-destructive-foreground border-destructive"
                            : "bg-primary text-primary-foreground border-primary"
                        : "bg-muted border-border border-dashed"
                    }`}
                  onClick={() => guessed[i] && handleRemoveLetter(i)}
                >
                  {guessed[i] || ""}
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-3xl md:text-5xl font-display font-bold text-accent mb-4 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-8 h-8" />
                  Correct!
                  <Sparkles className="w-8 h-8" />
                </motion.div>
              )}
              {isWrong && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  className="text-2xl font-display text-destructive mb-4"
                >
                  Try again! 💪
                </motion.div>
              )}
            </AnimatePresence>

            {/* Available letters */}
            <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
              {available.map((letter, i) => (
                <motion.button
                  key={`${letter}-${i}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLetterClick(letter, i)}
                  className={`bg-gradient-to-br ${gradients[i % gradients.length]} text-primary-foreground w-12 h-14 md:w-16 md:h-20 rounded-xl text-2xl md:text-4xl font-display font-bold shadow-lg cursor-pointer`}
                >
                  {letter}
                </motion.button>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetWord}
                className="flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full font-display hover:bg-muted/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClick();
                  nextWord();
                }}
                className="bg-secondary text-secondary-foreground px-6 py-2 rounded-full font-display font-bold shadow-lg"
              >
                Skip →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SpellingGame;
