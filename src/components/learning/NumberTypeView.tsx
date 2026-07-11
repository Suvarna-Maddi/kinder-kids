import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PlayCircle, CheckCircle, XCircle } from "lucide-react";
import { playClick, playSuccess, playError } from "@/lib/sounds";
import { speak, cancelSpeech } from "@/lib/tts";

export type NumberTypeData = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  examples: string[];
  quiz: {
    question: string;
    options: string[];
    correct: string;
  };
};

export const NUMBER_TYPES: NumberTypeData[] = [
  {
    id: "even",
    title: "Even Numbers",
    subtitle: "2, 4, 6, 8, 10...",
    description: "Numbers that can be paired up or divided evenly by 2.",
    gradient: "from-kid-pink to-kid-purple",
    examples: ["🧦 2 Socks (1 pair)", "🐾 4 Paws (2 pairs)", "🐜 6 Legs (3 pairs)"],
    quiz: {
      question: "Which of these is an Even number?",
      options: ["3", "7", "8", "1"],
      correct: "8",
    },
  },
  {
    id: "odd",
    title: "Odd Numbers",
    subtitle: "1, 3, 5, 7, 9...",
    description: "Numbers that always leave one out when making pairs.",
    gradient: "from-kid-teal to-kid-blue",
    examples: ["🦄 1 Horn", "🍀 3 Leaves", "⭐ 5 Points"],
    quiz: {
      question: "Which of these is an Odd number?",
      options: ["4", "2", "6", "9"],
      correct: "9",
    },
  },
  {
    id: "natural",
    title: "Natural Numbers",
    subtitle: "1, 2, 3, 4, 5...",
    description: "Numbers used for counting things.",
    gradient: "from-kid-blue to-kid-teal",
    examples: ["🍎 1 Apple", "🍎🍎 2 Apples", "🍎🍎🍎 3 Apples"],
    quiz: {
      question: "Which of these is a Natural Number?",
      options: ["0", "7", "-2", "1/2"],
      correct: "7",
    },
  },
  {
    id: "whole",
    title: "Whole Numbers",
    subtitle: "0, 1, 2, 3, 4...",
    description: "Natural numbers plus zero.",
    gradient: "from-kid-green to-kid-teal",
    examples: ["∅ 0 (Nothing)", "🍎 1 Apple", "🍎🍎 2 Apples"],
    quiz: {
      question: "Which number is a Whole number but NOT a Natural number?",
      options: ["1", "5", "0", "-1"],
      correct: "0",
    },
  },
  {
    id: "integers",
    title: "Integers",
    subtitle: "-3, -2, -1, 0, 1...",
    description: "Positive and negative whole numbers.",
    gradient: "from-kid-orange to-kid-yellow",
    examples: ["⛄ -2 (Very Cold!)", "∅ 0 (Zero)", "☀️ 2 (Warm)"],
    quiz: {
      question: "Which of these is a negative integer?",
      options: ["3", "0", "1/4", "-5"],
      correct: "-5",
    },
  },
  {
    id: "rational",
    title: "Rational Numbers",
    subtitle: "1/2, 3/4, 0.25...",
    description: "Numbers that can be written as fractions.",
    gradient: "from-kid-purple to-kid-pink",
    examples: ["🍕 1/2 Pizza", "🪙 0.25 Cents", "🍰 3/4 Cake"],
    quiz: {
      question: "Which of these is a Rational number?",
      options: ["√2", "π", "1/2", "∞"],
      correct: "1/2",
    },
  },
  {
    id: "irrational",
    title: "Irrational Numbers",
    subtitle: "π, √2, √5...",
    description: "Numbers that never end or repeat.",
    gradient: "from-kid-red to-kid-orange",
    examples: ["⭕ π (Pi) ≈ 3.14159...", "📐 √2 ≈ 1.414..."],
    quiz: {
      question: "Which famous number is Irrational?",
      options: ["100", "0", "π (Pi)", "1/3"],
      correct: "π (Pi)",
    },
  },
  {
    id: "real",
    title: "Real Numbers",
    subtitle: "All numbers together",
    description: "Includes rational and irrational numbers.",
    gradient: "from-kid-blue to-kid-purple",
    examples: ["📏 Every number on the number line!"],
    quiz: {
      question: "Do Real Numbers include fractions?",
      options: ["Yes!", "No", "Only Zero", "Only Negative"],
      correct: "Yes!",
    },
  },
];

type Props = {
  data: NumberTypeData;
  onClose: () => void;
};

const NumberTypeView = ({ data, onClose }: Props) => {
  const [picked, setPicked] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const handlePick = (opt: string) => {
    if (feedback === "correct") return;
    setPicked(opt);
    if (opt === data.quiz.correct) {
      playSuccess();
      setFeedback("correct");
      speak(`Correct! ${opt} is the right answer!`, { profile: "girl" });
    } else {
      playError();
      setFeedback("wrong");
      speak("Oops, try again!", { profile: "girl" });
      setTimeout(() => {
        setFeedback((prev) => {
          if (prev === "wrong") {
            setPicked(null);
            return null;
          }
          return prev;
        });
      }, 1500);
    }
  };

  const handleRead = () => {
    playClick();
    cancelSpeech();
    speak(`${data.title}. ${data.description}`, { profile: "girl" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br ${data.gradient} text-white p-6 md:p-10 max-w-4xl w-full mx-auto my-8`}
    >
      <button
        onClick={() => {
          playClick();
          cancelSpeech();
          onClose();
        }}
        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl md:text-5xl font-display font-bold shadow-sm">{data.title}</h2>
            <button
              onClick={handleRead}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <PlayCircle className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xl md:text-2xl font-bold text-white/90 mb-4">{data.subtitle}</p>
          <div className="bg-black/10 rounded-2xl p-4 mb-6">
            <p className="text-lg md:text-xl font-medium">{data.description}</p>
          </div>

          <h3 className="text-2xl font-display font-bold mb-3">Examples</h3>
          <div className="flex flex-col gap-2">
            {data.examples.map((ex, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-xl px-4 py-3 text-lg md:text-xl font-medium shadow-sm"
              >
                {ex}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full bg-white text-foreground rounded-3xl p-6 shadow-xl">
          <h3 className="text-2xl font-display font-bold mb-4 text-primary">Mini Quiz!</h3>
          <p className="text-lg font-medium mb-6 text-muted-foreground">{data.quiz.question}</p>

          <div className="grid grid-cols-2 gap-3">
            {data.quiz.options.map((opt) => {
              const isCorrect = feedback === "correct" && opt === data.quiz.correct;
              const isWrong = feedback === "wrong" && opt === picked;
              let btnClass = "bg-muted hover:bg-muted/80 text-foreground";
              if (isCorrect)
                btnClass = "bg-green-500 text-white shadow-lg scale-105 ring-4 ring-green-500/30";
              else if (isWrong) btnClass = "bg-red-500 text-white";

              return (
                <motion.button
                  key={opt}
                  whileHover={feedback === "correct" ? {} : { scale: 1.05 }}
                  whileTap={feedback === "correct" ? {} : { scale: 0.95 }}
                  onClick={() => handlePick(opt)}
                  className={`rounded-xl p-4 text-xl font-display font-bold transition-all flex items-center justify-center gap-2 ${btnClass}`}
                >
                  {isCorrect && <CheckCircle className="w-5 h-5" />}
                  {isWrong && <XCircle className="w-5 h-5" />}
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NumberTypeView;
