/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { speak } from "@/lib/tts";
import { playSuccess, playError, playClick } from "@/lib/sounds";
import { awardCoin, awardStar, recordAttempt } from "@/lib/progress";
import { useReward, MEMORY_CATEGORIES, pickRotatingCategory } from "@/features/PlayZone";
import { CardFace } from "./CardFace"; // use shared CardFace component
import { shuffle } from "@/lib/quizEngine";

interface PairMatchMemoryProps {
  difficulty: "easy" | "medium" | "hard";
  onClose: () => void;
  mode: "letter-object" | "number-quantity" | "animal-home";
}

// Simple home mapping for animals (can be expanded later)
const ANIMAL_HOMES: Record<string, string> = {
  Lion: "Forest",
  Tiger: "Jungle",
  Cat: "House",
  Dog: "House",
  Cow: "Farm",
  Horse: "Stable",
  Rabbit: "Burrow",
  Bear: "Cave",
  Fox: "Forest",
  Panda: "Bamboo Forest",
};

export const PairMatchMemory: React.FC<PairMatchMemoryProps> = ({ difficulty, onClose, mode }) => {
  const count = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5; // number of pairs per round

  // Build pair data based on mode
  const { leftItems, rightItems, correctMap } = useMemo(() => {
    const left: { key: string; label: string; color?: string; image?: string }[] = [];
    const right: { key: string; label: string; color?: string; image?: string }[] = [];
    const map = new Map<string, string>(); // leftKey -> rightKey

    if (mode === "letter-object") {
      const letters = MEMORY_CATEGORIES.find((c) => c.id === "letters")!.items;
      const excludeCats = ["letters", "numbers", "colors", "shapes"];
      const allObjects = MEMORY_CATEGORIES.filter((c) => !excludeCats.includes(c.id)).flatMap(
        (c) => c.items,
      );
      const chosenLetters = shuffle(letters).slice(0, count);
      chosenLetters.forEach((lt) => {
        // find objects starting with same letter
        const candidates = allObjects.filter(
          (obj) => obj.label[0].toUpperCase() === lt.label[0].toUpperCase(),
        );
        const obj = candidates.length ? shuffle(candidates)[0] : shuffle(allObjects)[0];
        left.push(lt);
        right.push(obj);
        map.set(lt.key, obj.key);
      });
    } else if (mode === "number-quantity") {
      const numbers = MEMORY_CATEGORIES.find((c) => c.id === "numbers")!.items;
      const chosenNums = shuffle(numbers).slice(0, count);
      chosenNums.forEach((nm) => {
        const qtyKey = `qty-${nm.label}`;
        const qtyItem = {
          key: qtyKey,
          label: qtyKey,
          color: nm.color,
        };
        left.push(nm);
        right.push(qtyItem);
        map.set(nm.key, qtyKey);
      });
    } else if (mode === "animal-home") {
      const animals = MEMORY_CATEGORIES.find((c) => c.id === "animals")!.items;
      const chosenAnimals = shuffle(animals).slice(0, count);
      chosenAnimals.forEach((an) => {
        const homeLabel = ANIMAL_HOMES[an.label] || "Home";
        const homeItem = {
          key: `hm-${an.label}`,
          label: homeLabel,
          color: an.color,
        };
        left.push(an);
        right.push(homeItem);
        map.set(an.key, homeItem.key);
      });
    }
    // Shuffle columns independently
    return {
      leftItems: shuffle(left),
      rightItems: shuffle(right),
      correctMap: map,
    };
  }, [mode, count]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const { give, node } = useReward();

  const handleSelectLeft = (key: string) => {
    if (matched.has(key)) return;
    setSelectedLeft(key);
  };

  const handleSelectRight = (key: string) => {
    if (!selectedLeft) return;
    const expected = correctMap.get(selectedLeft);
    const correct = expected === key;
    recordAttempt(correct);
    if (correct) {
      playSuccess();
      speak("Wonderful! You matched correctly.", { profile: "girl" });
      give(1, 2);
      setMatched((s) => new Set(s).add(selectedLeft));
      setScore((s) => s + 1);
    } else {
      playError();
      speak("Oops! Try again.", { profile: "girl" });
    }
    setSelectedLeft(null);
  };

  const allMatched = matched.size === leftItems.length;

  const finish = () => {
    speak(`Great job! You matched all ${leftItems.length} pairs.`, { profile: "girl" });
    setTimeout(() => onClose(), 1800);
  };

  // Start voice on mount
  React.useEffect(() => {
    const intro = {
      "letter-object": "Match each letter with a picture that starts with it.",
      "number-quantity": "Match each number with the right amount of objects.",
      "animal-home": "Match each animal with its home.",
    }[mode];
    speak(intro, { profile: "girl" });
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-2 text-sm font-body text-muted-foreground">
        <span>Score {score}</span>
        {allMatched && <span className="font-display font-bold text-foreground">✅ Completed</span>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          {leftItems.map((it) => (
            <motion.button
              key={it.key}
              disabled={matched.has(it.key)}
              whileHover={!matched.has(it.key) ? { scale: 1.05 } : {}}
              onClick={() => handleSelectLeft(it.key)}
              className={`w-full aspect-square p-2 rounded-xl shadow ${matched.has(it.key) ? "ring-4 ring-kid-green" : "bg-gradient-to-br from-kid-blue to-kid-purple text-foreground"}`}
            >
              <CardFace item={it as any} />
            </motion.button>
          ))}
        </div>
        {/* Right column */}
        <div className="space-y-3">
          {rightItems.map((it) => (
            <motion.button
              key={it.key}
              disabled={selectedLeft === null}
              whileHover={selectedLeft ? { scale: 1.05 } : {}}
              onClick={() => handleSelectRight(it.key)}
              className={`w-full aspect-square p-2 rounded-xl shadow ${selectedLeft && correctMap.get(selectedLeft) === it.key ? "ring-4 ring-kid-green animate-pulse" : "bg-gradient-to-br from-kid-blue to-kid-purple text-foreground"}`}
            >
              <CardFace item={it as any} />
            </motion.button>
          ))}
        </div>
      </div>
      {allMatched && (
        <div className="text-center mt-6">
          <button
            onClick={finish}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-display font-bold shadow"
          >
            Finish
          </button>
        </div>
      )}
      {node}
    </div>
  );
};
