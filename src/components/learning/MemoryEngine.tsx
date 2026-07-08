import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { speak, recordAttempt } from "@/lib/tts";
import { playSuccess, playError, playClick } from "@/lib/sounds";
import { useReward } from "@/components/Reward"; // adjust import if needed
import { CardFace } from "./CardFace";
import { shuffle } from "@/lib/quizEngine";
import { kidColor, pickRotatingCategory, MEMORY_CATEGORIES } from "@/features/PlayZone";

type MemItem = { key: string; label: string; color: string };

export const MemoryEngine = ({
  difficulty,
  onClose,
  theme,
}: {
  difficulty: "easy" | "medium" | "hard";
  onClose: () => void;
  theme: "objects" | "family";
}) => {
  const count = difficulty === "easy" ? 4 : difficulty === "medium" ? 6 : 8;
  const totalRounds = 5;
  const pool =
    theme === "family"
      ? MEMORY_CATEGORIES.find((c) => c.id === "family")!.items
      : MEMORY_CATEGORIES.find((c) => c.id === "school")!.items;

  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<"show" | "hide" | "ask" | "result">("show");
  const [items, setItems] = useState<MemItem[]>([]);
  const [missing, setMissing] = useState<MemItem | null>(null);
  const [score, setScore] = useState(0);
  const [pick, setPick] = useState<MemItem | null>(null);

  const { give, node } = useReward();

  const start = () => {
    const set = shuffle(pool).slice(0, count);
    const gone = set[Math.floor(Math.random() * set.length)];
    setItems(set);
    setMissing(gone);
    setPick(null);
    setPhase("show");
    if (round === 0) {
      speak("Let's play a memory game. I will show you some pictures. Look carefully.", { profile: "girl" });
      setTimeout(() => {
        setPhase("hide");
        speak("They are going away.", { profile: "girl" });
      }, 5200);
      setTimeout(() => {
        setPhase("ask");
        speak("Which one is missing? Touch the correct one.", { profile: "girl" });
      }, 6400);
    } else {
      speak("Look carefully. Remember these pictures.", { profile: "girl" });
      setTimeout(() => {
        setPhase("hide");
        speak("They are going away.", { profile: "girl" });
      }, 3200);
      setTimeout(() => {
        setPhase("ask");
        speak("Which one is missing?", { profile: "girl" });
      }, 4400);
    }
  };

  useEffect(() => {
    start();
    // eslint-disable-next-line
  }, [round]);

  const choose = (it: MemItem) => {
    if (phase !== "ask" || !missing) return;
    setPick(it);
    const correct = it.key === missing.key;
    recordAttempt(correct);
    if (correct) {
      playSuccess();
      speak("Wonderful! You remembered.", { profile: "girl" });
      setScore((s) => s + 1);
    } else {
      playError();
      speak("Almost. Look again and try.", { profile: "girl" });
    }
    setPhase("result");
  };

  const next = () => {
    if (round + 1 >= totalRounds) {
      const finalScore = score;
      if (finalScore === totalRounds) give(5, 10);
      else if (finalScore >= Math.ceil(totalRounds / 2)) give(3, 6);
      else give(1, 2);
      speak("Great job! You finished the memory game.", { profile: "girl" });
      setTimeout(() => onClose(), 1400);
      return;
    }
    setRound((r) => r + 1);
  };

  return (
    <div>
      <div className="flex justify-between mb-3 text-sm font-body text-muted-foreground">
        <span>Round {round + 1} / {totalRounds}</span>
        <span className="flex items-center gap-1 font-display font-bold text-foreground">🏆 {score}</span>
      </div>
      {phase === "show" && (
        <div>
          <p className="text-center font-display font-bold mb-4 text-xl">Remember these!</p>
          <div className={`grid ${count <= 4 ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4"} gap-3`)}>
            {items.map((it) => (
              <motion.div key={it.key} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="aspect-square">
                <CardFace item={it} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {phase === "hide" && (
        <div className="text-center py-16 text-4xl font-display font-bold text-muted-foreground">✨ Hiding… ✨</div>
      )}
      {(phase === "ask" || phase === "result") && (
        <div>
          <p className="text-center font-display font-bold mb-4 text-xl">Which one is missing?</p>
          <div className={`grid ${count <= 4 ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4"} gap-3`}>
            {items.filter((it) => it.key !== missing?.key).map((it) => {
              const isAns = phase === "result" && missing?.key === it.key;
              const isPick = pick?.key === it.key;
              return (
                <motion.button
                  key={it.key}
                  disabled={phase === "result"}
                  whileHover={phase === "ask" ? { scale: 1.05 } : {}}
                  onClick={() => choose(it)}
                  animate={isAns ? { scale: [1, 1.05, 1] } : isPick && !isAns ? { x: [0, -5, 5, 0] } : {}}
                  className={`aspect-square rounded-2xl overflow-hidden shadow-lg ${isAns ? "ring-4 ring-kid-green" : isPick ? "ring-4 ring-destructive" : ""}`}
                >
                  <CardFace item={it} />
                </motion.button>
              );
            })}
          </div>
          {phase === "result" && (
            <div className="text-center mt-5">
              <button onClick={next} className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-display font-bold shadow">
                {round + 1 >= totalRounds ? "Finish" : "Next round"}
              </button>
            </div>
          )}
        </div>
      )}
      {node}
    </div>
  );
};
