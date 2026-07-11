import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IMG_MAP } from "@/lib/images";
import { LazyImage } from "@/components/learning/LazyImage";
import {
  Sparkles,
  Star,
  Trophy,
  Gamepad2,
  Brain,
  Puzzle,
  Palette,
  Shapes,
  Rabbit,
  Car,
  Apple,
  Zap,
  Calendar,
  Gift,
  X,
} from "lucide-react";
import { playClick, playPop, playSuccess, playError } from "@/lib/sounds";
import { speak, recordAndSpeak, praise, cancelSpeech } from "@/lib/tts";
import { awardCoin, awardStar, recordAttempt } from "@/lib/progress";

// -------- Category metadata --------
type Difficulty = "easy" | "medium" | "hard";
type GameId =
  | "letter-match"
  | "missing-letter"
  | "case-match"
  | "listen-choose"
  | "count-objects"
  | "before-after"
  | "greater-smaller"
  | "odd-even"
  | "table-mcq"
  | "rapid-fire"
  | "missing-product"
  | "memory-cards"
  | "memory-missing"
  | "memory-flash-color"
  | "memory-pattern"
  | "memory-animal-home"
  | "shape-match"
  | "color-match"
  | "animal-sound"
  | "fruit-match"
  | "vehicle-match"
  | "pattern"
  | "spot-difference";

type GameDef = {
  id: GameId;
  title: string;
  emoji: string;
  desc: string;
};

type CategoryDef = {
  id: string;
  title: string;
  icon: typeof Gamepad2;
  gradient: string;
  emoji: string;
  games: GameDef[];
};

const CATEGORIES: CategoryDef[] = [
  {
    id: "alphabet",
    title: "Alphabet Games",
    icon: Sparkles,
    emoji: "🔤",
    gradient: "from-kid-blue to-kid-teal",
    games: [
      {
        id: "letter-match",
        title: "Letter Matching",
        emoji: "🔠",
        desc: "Match capital to lowercase!",
      },
      {
        id: "missing-letter",
        title: "Missing Letter",
        emoji: "❔",
        desc: "Fill in the missing letter!",
      },
      {
        id: "case-match",
        title: "Upper ↔ Lower",
        emoji: "🔁",
        desc: "Match uppercase & lowercase!",
      },
      { id: "listen-choose", title: "Listen & Choose", emoji: "🎧", desc: "Hear it, then pick!" },
    ],
  },
  {
    id: "number",
    title: "Number Games",
    icon: Zap,
    emoji: "🔢",
    gradient: "from-kid-green to-kid-teal",
    games: [
      { id: "count-objects", title: "Count Objects", emoji: "🧮", desc: "Count them all!" },
      {
        id: "before-after",
        title: "Before / After",
        emoji: "🔀",
        desc: "What comes before or after?",
      },
      {
        id: "greater-smaller",
        title: "Greater / Smaller",
        emoji: "⚖️",
        desc: "Which one is bigger?",
      },
      { id: "odd-even", title: "Odd or Even", emoji: "🎯", desc: "Sort the numbers!" },
    ],
  },
  {
    id: "table",
    title: "Table Games",
    icon: Brain,
    emoji: "✖️",
    gradient: "from-kid-orange to-kid-yellow",
    games: [
      { id: "table-mcq", title: "Table MCQ", emoji: "🧠", desc: "Pick the answer!" },
      { id: "rapid-fire", title: "Rapid Fire", emoji: "⚡", desc: "Answer fast!" },
      { id: "missing-product", title: "Fill Missing", emoji: "❓", desc: "What's missing?" },
    ],
  },
  {
    id: "memory",
    title: "Memory Games",
    icon: Puzzle,
    emoji: "🧩",
    gradient: "from-kid-purple to-kid-pink",
    games: [
      {
        id: "memory-cards",
        title: "Memory Match",
        emoji: "🧠",
        desc: "Find pairs — new category each round!",
      },
      {
        id: "memory-missing",
        title: "What's Missing?",
        emoji: "🕵️",
        desc: "Spot the object that disappeared!",
      },
      {
        id: "memory-flash-color",
        title: "Flash Colors",
        emoji: "🌈",
        desc: "Remember the color order!",
      },
      {
        id: "memory-pattern",
        title: "Pattern Recall",
        emoji: "🔁",
        desc: "Watch, then repeat the pattern!",
      },
      {
        id: "memory-animal-home",
        title: "Animal → Home",
        emoji: "🏡",
        desc: "Where does each animal live?",
      },
    ],
  },
  {
    id: "shape-color",
    title: "Shape & Color",
    icon: Shapes,
    emoji: "🔷",
    gradient: "from-kid-pink to-kid-red",
    games: [
      { id: "shape-match", title: "Shape Matching", emoji: "🔺", desc: "Match the shapes!" },
      { id: "color-match", title: "Color Matching", emoji: "🎨", desc: "Match the colors!" },
      { id: "pattern", title: "Pattern", emoji: "🔁", desc: "What comes next?" },
      { id: "spot-difference", title: "Odd One Out", emoji: "🔍", desc: "Which one is different?" },
    ],
  },
  {
    id: "world",
    title: "Animals · Fruits · Vehicles",
    icon: Rabbit,
    emoji: "🐾",
    gradient: "from-kid-teal to-kid-blue",
    games: [
      { id: "animal-sound", title: "Animal Sounds", emoji: "🐮", desc: "Match animal to sound!" },
      { id: "fruit-match", title: "Fruit Matching", emoji: "🍎", desc: "Match the fruits!" },
      { id: "vehicle-match", title: "Vehicle Matching", emoji: "🚗", desc: "Match the vehicles!" },
    ],
  },
];

// -------- Difficulty picker --------
const DIFFICULTIES: { id: Difficulty; label: string; emoji: string }[] = [
  { id: "easy", label: "Easy", emoji: "🌱" },
  { id: "medium", label: "Medium", emoji: "🌟" },
  { id: "hard", label: "Hard", emoji: "🔥" },
];

// -------- Confetti --------
const Confetti = () => {
  const bits = Array.from({ length: 24 });
  const colors = [
    "text-kid-yellow",
    "text-kid-pink",
    "text-kid-blue",
    "text-kid-green",
    "text-kid-orange",
    "text-kid-purple",
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: `${50 + (Math.random() * 40 - 20)}%`, y: "50%", opacity: 1 }}
          animate={{
            y: `${-20 - Math.random() * 60}%`,
            x: `${Math.random() * 100}%`,
            rotate: Math.random() * 720,
            opacity: 0,
          }}
          transition={{ duration: 1.4 + Math.random() * 0.6, ease: "easeOut" }}
          className={`absolute text-2xl ${colors[i % colors.length]}`}
        >
          {["★", "●", "▲", "◆", "❤", "✿"][i % 6]}
        </motion.div>
      ))}
    </div>
  );
};

// -------- Reward toast --------
export const useReward = () => {
  const [reward, setReward] = useState<{ stars: number; coins: number } | null>(null);
  const give = (stars: number, coins: number) => {
    awardStar(stars);
    awardCoin(coins);
    playSuccess();
    setReward({ stars, coins });
    setTimeout(() => setReward(null), 1500);
  };
  const node = (
    <AnimatePresence>
      {reward && (
        <motion.div
          initial={{ scale: 0, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-kid-yellow/95 text-foreground rounded-full px-5 py-2 shadow-2xl font-display font-bold flex items-center gap-2"
        >
          <Star className="w-5 h-5 fill-foreground" /> +{reward.stars} · 🪙 +{reward.coins}
        </motion.div>
      )}
    </AnimatePresence>
  );
  return { give, node };
};

const EMOJI_TO_NAME: Record<string, string> = {
  "🐄": "Cow", "🐶": "Dog", "🐱": "Cat", "🦆": "Duck", "🐑": "Sheep", "🦁": "Lion", "🐴": "Horse", "🐷": "Pig",
  "🍎": "Apple", "🍌": "Banana", "🍇": "Grapes", "🍊": "Orange", "🍓": "Strawberry", "🥭": "Mango", "🍍": "Pineapple", "🍉": "Watermelon",
  "🚗": "Car", "🚌": "Bus", "✈️": "Airplane", "🚂": "Train", "🚲": "Bike", "🚢": "Ship", "🚁": "Helicopter", "🚀": "Rocket",
  "🔺": "Triangle", "⭕": "Circle", "🟥": "Square", "⭐": "Star", "🔷": "Diamond", "❤️": "Heart",
  "🔴": "Red", "🟢": "Green", "🔵": "Blue", "🟡": "Yellow", "🟣": "Purple", "🟠": "Orange",
  "🌙": "Moon", "☀️": "Sun", "☁️": "Cloud", "🐭": "Mouse", "🦊": "Fox",
};

// -------- Game host modal --------
const GameHost = ({
  game,
  difficulty,
  onClose,
}: {
  game: GameDef;
  difficulty: Difficulty;
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-card rounded-bubble shadow-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center gap-2 font-display font-bold text-lg">
              <span className="text-2xl">{game.emoji}</span>
              {game.title}
              <span className="text-sm px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {difficulty}
              </span>
            </div>
            <button
              onClick={() => {
                playClick();
                cancelSpeech();
                onClose();
              }}
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Close game"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 md:p-6 overflow-auto">
            <GameRunner id={game.id} difficulty={difficulty} onClose={onClose} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// -------- Generic multi-question runner --------
type Question = { prompt: string; options: string[]; answer: string; hint?: string };

const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const buildQuestions = (id: GameId, difficulty: Difficulty): Question[] => {
  const count = difficulty === "easy" ? 5 : difficulty === "medium" ? 8 : 10;
  const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const lower = "abcdefghijklmnopqrstuvwxyz".split("");
  const animals = [
    { emoji: "🐮", name: "Cow", sound: "Moo" },
    { emoji: "🐶", name: "Dog", sound: "Woof" },
    { emoji: "🐱", name: "Cat", sound: "Meow" },
    { emoji: "🦆", name: "Duck", sound: "Quack" },
    { emoji: "🐑", name: "Sheep", sound: "Baa" },
    { emoji: "🦁", name: "Lion", sound: "Roar" },
    { emoji: "🐴", name: "Horse", sound: "Neigh" },
    { emoji: "🐷", name: "Pig", sound: "Oink" },
  ];
  type Pic = { emoji: string; name: string };
  const fruits: Pic[] = [
    { emoji: "🍎", name: "Apple" },
    { emoji: "🍌", name: "Banana" },
    { emoji: "🍇", name: "Grapes" },
    { emoji: "🍊", name: "Orange" },
    { emoji: "🍓", name: "Strawberry" },
    { emoji: "🥭", name: "Mango" },
    { emoji: "🍍", name: "Pineapple" },
    { emoji: "🍉", name: "Watermelon" },
  ];
  const vehicles: Pic[] = [
    { emoji: "🚗", name: "Car" },
    { emoji: "🚌", name: "Bus" },
    { emoji: "✈️", name: "Airplane" },
    { emoji: "🚂", name: "Train" },
    { emoji: "🚲", name: "Bike" },
    { emoji: "🚢", name: "Ship" },
    { emoji: "🚁", name: "Helicopter" },
    { emoji: "🚀", name: "Rocket" },
  ];
  const shapes: Pic[] = [
    { emoji: "🔺", name: "Triangle" },
    { emoji: "🔵", name: "Circle" },
    { emoji: "🟥", name: "Square" },
    { emoji: "⭐", name: "Star" },
    { emoji: "🔶", name: "Diamond" },
    { emoji: "❤️", name: "Heart" },
  ];
  const colors: Pic[] = [
    { emoji: "🔴", name: "Red" },
    { emoji: "🟢", name: "Green" },
    { emoji: "🔵", name: "Blue" },
    { emoji: "🟡", name: "Yellow" },
    { emoji: "🟣", name: "Purple" },
    { emoji: "🟠", name: "Orange" },
  ];

  // Track answers used within this build so questions don't repeat back-to-back.
  const usedAnswers = new Set<string>();
  const pickFresh = <T,>(pool: readonly T[], key: (t: T) => string): T => {
    const fresh = pool.filter((p) => !usedAnswers.has(key(p)));
    const source = fresh.length ? fresh : (usedAnswers.clear(), pool);
    const chosen = source[Math.floor(Math.random() * source.length)];
    usedAnswers.add(key(chosen));
    return chosen;
  };

  const qs: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (id) {
      case "letter-match": {
        const l = rand(upper);
        const others = shuffle(upper.filter((x) => x !== l)).slice(0, 3);
        qs.push({
          prompt: `Which letter matches "${l.toLowerCase()}"?`,
          options: shuffle([l, ...others]),
          answer: l,
        });
        break;
      }
      case "case-match": {
        const l = rand(upper);
        const others = shuffle(lower.filter((x) => x !== l.toLowerCase())).slice(0, 3);
        qs.push({
          prompt: `What is the lowercase of "${l}"?`,
          options: shuffle([l.toLowerCase(), ...others]),
          answer: l.toLowerCase(),
        });
        break;
      }
      case "missing-letter": {
        const idx = Math.floor(Math.random() * (upper.length - 2)) + 1;
        const seq = `${upper[idx - 1]} ___ ${upper[idx + 1]}`;
        const answer = upper[idx];
        const others = shuffle(upper.filter((x) => x !== answer)).slice(0, 3);
        qs.push({
          prompt: `What comes here?  ${seq}`,
          options: shuffle([answer, ...others]),
          answer,
        });
        break;
      }
      case "listen-choose": {
        const l = rand(upper);
        const others = shuffle(upper.filter((x) => x !== l)).slice(0, 3);
        qs.push({
          prompt: `Listen and pick the letter!`,
          options: shuffle([l, ...others]),
          answer: l,
          hint: l,
        });
        break;
      }
      case "count-objects": {
        const n = 1 + Math.floor(Math.random() * max);
        const emoji = rand(["🍎", "⭐", "🎈", "🐝", "🌸", "🚗"]);
        const options = shuffle(
          [n, n + 1, Math.max(1, n - 1), n + 2].filter((v, i, arr) => arr.indexOf(v) === i),
        )
          .slice(0, 4)
          .map(String);
        qs.push({ prompt: `${emoji.repeat(n)}  —  How many?`, options, answer: String(n) });
        break;
      }
      case "before-after": {
        const n = 2 + Math.floor(Math.random() * (max - 2));
        const which = Math.random() < 0.5 ? "before" : "after";
        const ans = which === "before" ? n - 1 : n + 1;
        const options = shuffle(
          [ans, ans + 1, Math.max(0, ans - 1), ans + 2].filter((v, i, arr) => arr.indexOf(v) === i),
        )
          .slice(0, 4)
          .map(String);
        qs.push({ prompt: `What comes ${which} ${n}?`, options, answer: String(ans) });
        break;
      }
      case "greater-smaller": {
        const a = 1 + Math.floor(Math.random() * max);
        let b = 1 + Math.floor(Math.random() * max);
        if (b === a) b = a + 1;
        const which = Math.random() < 0.5 ? "greater" : "smaller";
        const ans = which === "greater" ? Math.max(a, b) : Math.min(a, b);
        qs.push({
          prompt: `Which is ${which}? ${a}  or  ${b}`,
          options: shuffle([String(a), String(b)]),
          answer: String(ans),
        });
        break;
      }
      case "odd-even": {
        const n = 1 + Math.floor(Math.random() * max);
        qs.push({
          prompt: `Is ${n} odd or even?`,
          options: shuffle(["Odd", "Even"]),
          answer: n % 2 === 0 ? "Even" : "Odd",
        });
        break;
      }
      case "table-mcq":
      case "rapid-fire": {
        const a = 2 + Math.floor(Math.random() * (difficulty === "hard" ? 20 : 12));
        const b = 1 + Math.floor(Math.random() * 12);
        const ans = a * b;
        const opts = shuffle([ans, ans + a, Math.max(0, ans - a), ans + 1])
          .slice(0, 4)
          .map(String);
        qs.push({ prompt: `${a} × ${b} = ?`, options: opts, answer: String(ans) });
        break;
      }
      case "missing-product": {
        const a = 2 + Math.floor(Math.random() * 12);
        const b = 1 + Math.floor(Math.random() * 12);
        const ans = a * b;
        const opts = shuffle([b, b + 1, Math.max(1, b - 1), b + 2])
          .slice(0, 4)
          .map(String);
        qs.push({ prompt: `${a} × ___ = ${ans}`, options: opts, answer: String(b) });
        break;
      }
      case "animal-sound": {
        const a = pickFresh(animals, (x) => x.name);
        const others = shuffle(animals.filter((x) => x.name !== a.name)).slice(0, 3);
        qs.push({
          prompt: `Who says "${a.sound}"?`,
          options: shuffle([a.emoji, ...others.map((o) => o.emoji)]),
          answer: a.emoji,
        });
        break;
      }
      case "fruit-match": {
        const f = pickFresh(fruits, (x) => x.name);
        const others = shuffle(fruits.filter((x) => x.name !== f.name)).slice(0, 3);
        qs.push({
          prompt: `Can you find the ${f.name}?`,
          options: shuffle([f.emoji, ...others.map((o) => o.emoji)]),
          answer: f.emoji,
        });
        break;
      }
      case "vehicle-match": {
        const v = pickFresh(vehicles, (x) => x.name);
        const others = shuffle(vehicles.filter((x) => x.name !== v.name)).slice(0, 3);
        qs.push({
          prompt: `Can you find the ${v.name}?`,
          options: shuffle([v.emoji, ...others.map((o) => o.emoji)]),
          answer: v.emoji,
        });
        break;
      }
      case "shape-match": {
        const s = pickFresh(shapes, (x) => x.name);
        const others = shuffle(shapes.filter((x) => x.name !== s.name)).slice(0, 3);
        qs.push({
          prompt: `Find the ${s.name}.`,
          options: shuffle([s.emoji, ...others.map((o) => o.emoji)]),
          answer: s.emoji,
        });
        break;
      }
      case "color-match": {
        const c = pickFresh(colors, (x) => x.name);
        const others = shuffle(colors.filter((x) => x.name !== c.name)).slice(0, 3);
        qs.push({
          prompt: `Can you find the ${c.name} color?`,
          options: shuffle([c.emoji, ...others.map((o) => o.emoji)]),
          answer: c.emoji,
        });
        break;
      }
      case "pattern": {
        // Randomised pattern: pick a pool, a rule (ABAB, AABB, ABC, ABCD, ABBA), and length.
        const pools: string[][] = [
          ["🔴", "🔵", "🟡", "🟢", "🟣", "🟠"],
          ["⭐", "🌙", "☀️", "☁️"],
          ["🍎", "🍌", "🍇", "🍊"],
          ["🐶", "🐱", "🐭", "🦊"],
          ["🔺", "🔵", "🟥", "⭐"],
          ["🚗", "🚌", "✈️", "🚂"],
        ];
        const pool = rand(pools);
        const rules = ["ABAB", "AABB", "ABC", "ABBA", "ABCD"] as const;
        const rule = rand(rules as unknown as string[]);
        const picks = shuffle(pool).slice(0, 4);
        const [A, B, C, D] = picks;
        let seq: string[] = [];
        let answer = "";
        if (rule === "ABAB") {
          seq = [A, B, A, B, A, "?"];
          answer = B;
        } else if (rule === "AABB") {
          seq = [A, A, B, B, A, "?"];
          answer = A;
        } else if (rule === "ABC") {
          seq = [A, B, C, A, B, "?"];
          answer = C;
        } else if (rule === "ABBA") {
          seq = [A, B, B, A, A, "?"];
          answer = B;
        } else {
          seq = [A, B, C, D, A, "?"];
          answer = B;
        }
        const distractors = shuffle(pool.filter((x) => x !== answer)).slice(0, 3);
        qs.push({
          prompt: `Pattern:  ${seq.join(" ")}\nWhat comes next?`,
          options: shuffle([answer, ...distractors]),
          answer,
        });
        break;
      }
      case "spot-difference": {
        // Odd-one-out: many themed groups so questions vary each time.
        const groups: { theme: string; same: string[]; odd: string[] }[] = [
          {
            theme: "fruits",
            same: ["🍎", "🍌", "🍇", "🍊", "🍓", "🥭", "🍍"],
            odd: ["🚗", "⭐", "🐶", "🎈", "🌸"],
          },
          {
            theme: "animals",
            same: ["🐶", "🐱", "🐭", "🐹", "🦊", "🐻", "🐼"],
            odd: ["🍎", "🚀", "⭐", "🎈"],
          },
          {
            theme: "vehicles",
            same: ["🚗", "🚌", "🚂", "✈️", "🚁", "🚢"],
            odd: ["🍌", "🐱", "⭐", "🌸"],
          },
          {
            theme: "shapes",
            same: ["🔺", "🔷", "🟥", "⭐", "❤️", "🔶"],
            odd: ["🍩", "🐶", "🚗", "🎈"],
          },
          { theme: "colors", same: ["🔴", "🔴", "🔴", "🔴"], odd: ["🔵", "🟢", "🟡", "🟣", "🟠"] },
          { theme: "weather", same: ["☀️", "☁️", "🌧️", "❄️", "⛈️"], odd: ["🍕", "🐝", "🚗"] },
          { theme: "sports", same: ["⚽", "🏀", "🎾", "🏈", "⚾"], odd: ["🍎", "🐶", "✈️"] },
        ];
        const g = rand(groups);
        // Pick 3 of the "same" family + 1 different.
        const sameItem = rand(g.same);
        const oddItem = rand(g.odd.filter((x) => x !== sameItem));
        const set = shuffle([sameItem, sameItem, sameItem, oddItem]);
        qs.push({ prompt: `Which one is different?`, options: set, answer: oddItem });
        break;
      }
      default:
        qs.push({ prompt: "Coming soon!", options: ["OK"], answer: "OK" });
    }
  }
  // Cross-session dedup: drop prompts we've served recently, top up with fresh ones.
  return dedupeQuestionsAcrossSessions(id, qs, count);
};

// ---- Cross-session question history (localStorage) ----
const HISTORY_MAX = 60;
const historyKey = (id: GameId) => `plh:pz:seen:${id}`;
const loadSeen = (id: GameId): string[] => {
  try {
    if (typeof localStorage === "undefined") return [];
    return JSON.parse(localStorage.getItem(historyKey(id)) || "[]");
  } catch {
    return [];
  }
};
const saveSeen = (id: GameId, seen: string[]) => {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(historyKey(id), JSON.stringify(seen.slice(-HISTORY_MAX)));
  } catch {
    /* ignore */
  }
};
const qKey = (q: Question) => `${q.prompt}||${q.answer}`;

const dedupeQuestionsAcrossSessions = (id: GameId, qs: Question[], want: number): Question[] => {
  const seen = new Set(loadSeen(id));
  const kept = qs.filter((q) => !seen.has(qKey(q)));
  // If dedup wiped us out, keep at least half so the game still plays.
  const final = kept.length >= Math.max(1, Math.floor(want / 2)) ? kept : qs;
  const nextSeen = [...loadSeen(id), ...final.map(qKey)].slice(-HISTORY_MAX);
  saveSeen(id, nextSeen);
  return final;
};

// -------- MCQ runner (used by all games above) --------
const GameRunner = ({
  id,
  difficulty,
  onClose,
}: {
  id: GameId;
  difficulty: Difficulty;
  onClose: () => void;
}) => {
  // HOOKS MUST BE BEFORE EARLY RETURNS
  const questions = useMemo(() => buildQuestions(id, difficulty), [id, difficulty]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const { give, node } = useReward();

  if (id === "memory-cards") {
    return <SmartMemoryMatch difficulty={difficulty} onClose={onClose} />;
  }
  if (id === "memory-missing") {
    return <WhatsMissing difficulty={difficulty} onClose={onClose} theme="objects" />;
  }
  if (id === "memory-flash-color") {
    return <FlashColorMemory difficulty={difficulty} onClose={onClose} />;
  }
  if (id === "memory-pattern") {
    return <PatternRecall difficulty={difficulty} onClose={onClose} />;
  }
  if (id === "memory-animal-home") {
    return <PairMatchMemory difficulty={difficulty} onClose={onClose} mode="animal-home" />;
  }

  const q = questions[idx];

  const speakPrompt = () => {
    if (q.hint) speak(`The letter is ${q.hint}.`, { profile: "girl" });
    else speak(q.prompt.replace(/[^\w\s×?×-]/g, " "), { profile: "girl" });
  };

  const pick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const correct = opt === q.answer;
    recordAttempt(correct);
    if (correct) {
      playPop();
      setScore((s) => s + 1);
      give(1, 2);
      setCelebrate(true);
      speak(praise(), { profile: "girl" });
      setTimeout(() => {
        setCelebrate(false);
        if (idx + 1 < questions.length) {
          setPicked(null);
          setIdx(idx + 1);
        } else {
          setDone(true);
          recordAndSpeak([
            { text: "Amazing job!", profile: "girl", pauseAfterMs: 150 },
            { text: `You got ${score + 1} out of ${questions.length} correct.`, profile: "girl" },
          ]);
        }
      }, 900);
    } else {
      playError();
      speak("Almost! Try again.", { profile: "girl" });
      setTimeout(() => setPicked(null), 900);
    }
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl mb-2"
        >
          🏆
        </motion.div>
        <h3 className="text-2xl font-display font-bold text-foreground mb-1">Well done!</h3>
        <p className="text-muted-foreground mb-4 font-body">
          You scored {score}/{questions.length}.
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-display font-bold shadow"
          >
            Back to games
          </button>
        </div>
        {node}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-body text-muted-foreground">
          Question {idx + 1} / {questions.length}
        </div>
        <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm font-display font-bold">
          <Trophy className="w-4 h-4 text-kid-yellow" /> {score}
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-gradient-to-r from-kid-green to-kid-teal rounded-full"
          animate={{ width: `${(idx / questions.length) * 100}%` }}
        />
      </div>

      <div className="text-center relative">
        {celebrate && <Confetti />}
        <motion.div
          key={idx}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl md:text-4xl font-display font-bold text-foreground mb-6 whitespace-pre-wrap"
        >
          {q.prompt}
        </motion.div>
        {q.hint && (
          <button
            onClick={() => {
              playClick();
              speakPrompt();
            }}
            className="mb-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-display font-semibold"
          >
            🔊 Play sound
          </button>
        )}
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto">
          {q.options.map((opt) => {
            const isRight = picked && opt === q.answer;
            const isWrong = picked === opt && opt !== q.answer;
            const mappedName = EMOJI_TO_NAME[opt] || opt;
            const imgSrc = IMG_MAP[mappedName as keyof typeof IMG_MAP];
            
            return (
              <motion.button
                key={opt}
                whileHover={!picked ? { scale: 1.05, y: -3 } : {}}
                whileTap={!picked ? { scale: 0.95 } : {}}
                onClick={() => pick(opt)}
                className={`rounded-2xl p-4 text-4xl md:text-5xl font-display font-bold shadow-lg transition-colors flex items-center justify-center min-h-[80px] md:min-h-[110px] ${
                  isRight
                    ? "bg-accent text-accent-foreground"
                    : isWrong
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-gradient-to-br from-kid-blue to-kid-purple text-primary-foreground"
                }`}
              >
                {imgSrc ? (
                  <LazyImage src={imgSrc} alt={mappedName} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                ) : (
                  opt
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
      {node}
    </div>
  );
};

// -------- Category pools shared by memory games (no emojis on cards; symbolic labels + colors) --------
type MemItem = { key: string; label: string; color: string };
export const MEMORY_CATEGORIES: { id: string; title: string; items: MemItem[] }[] = [
  {
    id: "animals",
    title: "Animals",
    items: ["Lion", "Tiger", "Cat", "Dog", "Cow", "Horse", "Rabbit", "Bear", "Fox", "Panda"].map(
      (n, i) => ({ key: `an-${n}`, label: n, color: kidColor(i) }),
    ),
  },
  {
    id: "fruits",
    title: "Fruits",
    items: [
      "Apple",
      "Banana",
      "Grapes",
      "Orange",
      "Mango",
      "Kiwi",
      "Peach",
      "Cherry",
      "Papaya",
      "Pear",
    ].map((n, i) => ({ key: `fr-${n}`, label: n, color: kidColor(i) })),
  },
  {
    id: "vegetables",
    title: "Vegetables",
    items: [
      "Carrot",
      "Potato",
      "Tomato",
      "Onion",
      "Corn",
      "Peas",
      "Broccoli",
      "Beet",
      "Pumpkin",
      "Chili",
    ].map((n, i) => ({ key: `vg-${n}`, label: n, color: kidColor(i) })),
  },
  {
    id: "birds",
    title: "Birds",
    items: [
      "Parrot",
      "Eagle",
      "Owl",
      "Peacock",
      "Sparrow",
      "Duck",
      "Crow",
      "Swan",
      "Hen",
      "Dove",
    ].map((n, i) => ({ key: `bd-${n}`, label: n, color: kidColor(i) })),
  },
  {
    id: "sea",
    title: "Sea Animals",
    items: [
      "Fish",
      "Shark",
      "Whale",
      "Octopus",
      "Crab",
      "Dolphin",
      "Turtle",
      "Starfish",
      "Seal",
      "Jellyfish",
    ].map((n, i) => ({ key: `sea-${n}`, label: n, color: kidColor(i) })),
  },
  {
    id: "vehicles",
    title: "Vehicles",
    items: ["Car", "Bus", "Train", "Plane", "Ship", "Bike", "Truck", "Rocket", "Boat", "Van"].map(
      (n, i) => ({ key: `vh-${n}`, label: n, color: kidColor(i) }),
    ),
  },
  {
    id: "colors",
    title: "Colors",
    items: [
      { key: "c-red", label: "Red", color: "#ef4444" },
      { key: "c-blue", label: "Blue", color: "#3b82f6" },
      { key: "c-green", label: "Green", color: "#22c55e" },
      { key: "c-yellow", label: "Yellow", color: "#eab308" },
      { key: "c-purple", label: "Purple", color: "#a855f7" },
      { key: "c-orange", label: "Orange", color: "#f97316" },
      { key: "c-pink", label: "Pink", color: "#ec4899" },
      { key: "c-teal", label: "Teal", color: "#14b8a6" },
    ],
  },
  {
    id: "shapes",
    title: "Shapes",
    items: ["Circle", "Square", "Triangle", "Star", "Heart", "Diamond", "Oval", "Cube"].map(
      (n, i) => ({ key: `sh-${n}`, label: n, color: kidColor(i) }),
    ),
  },
  {
    id: "numbers",
    title: "Numbers",
    items: "1,2,3,4,5,6,7,8,9,10"
      .split(",")
      .map((n, i) => ({ key: `nm-${n}`, label: n, color: kidColor(i) })),
  },
  {
    id: "letters",
    title: "Letters",
    items: "A,B,C,D,E,F,G,H,I,J"
      .split(",")
      .map((n, i) => ({ key: `lt-${n}`, label: n, color: kidColor(i) })),
  },
  {
    id: "body",
    title: "Body Parts",
    items: ["Eye", "Ear", "Nose", "Mouth", "Hand", "Foot", "Head", "Leg"].map((n, i) => ({
      key: `bd-${n}`,
      label: n,
      color: kidColor(i),
    })),
  },
  {
    id: "family",
    title: "Family",
    items: ["Mother", "Father", "Sister", "Brother", "Grandma", "Grandpa", "Baby", "Uncle"].map(
      (n, i) => ({ key: `fm-${n}`, label: n, color: kidColor(i) }),
    ),
  },
  {
    id: "school",
    title: "School Objects",
    items: ["Book", "Pencil", "Bag", "Bottle", "Ruler", "Eraser", "Crayon", "Notebook"].map(
      (n, i) => ({ key: `sc-${n}`, label: n, color: kidColor(i) }),
    ),
  },
  {
    id: "flowers",
    title: "Flowers",
    items: ["Rose", "Lily", "Tulip", "Daisy", "Sunflower", "Lotus", "Orchid", "Jasmine"].map(
      (n, i) => ({ key: `fl-${n}`, label: n, color: kidColor(i) }),
    ),
  },
  {
    id: "toys",
    title: "Toys",
    items: ["Ball", "Doll", "Kite", "Blocks", "Puzzle", "Teddy", "Yo-Yo", "Top"].map((n, i) => ({
      key: `ty-${n}`,
      label: n,
      color: kidColor(i),
    })),
  },
  {
    id: "insects",
    title: "Insects",
    items: [
      "Bee",
      "Ant",
      "Butterfly",
      "Ladybug",
      "Spider",
      "Grasshopper",
      "Beetle",
      "Dragonfly",
    ].map((n, i) => ({ key: `in-${n}`, label: n, color: kidColor(i) })),
  },
  {
    id: "weather",
    title: "Weather",
    items: ["Sun", "Rain", "Cloud", "Snow", "Storm", "Wind", "Rainbow", "Fog"].map((n, i) => ({
      key: `wt-${n}`,
      label: n,
      color: kidColor(i),
    })),
  },
  {
    id: "music",
    title: "Musical Instruments",
    items: ["Drum", "Guitar", "Piano", "Flute", "Violin", "Trumpet", "Harp", "Tabla"].map(
      (n, i) => ({ key: `ms-${n}`, label: n, color: kidColor(i) }),
    ),
  },
];

export function kidColor(i: number) {
  const palette = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#14b8a6",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
    "#0ea5e9",
    "#84cc16",
  ];
  return palette[i % palette.length];
}

// Rotate categories: never pick a category from the last N.
export const CAT_HISTORY_KEY = "plh:memcat:hist";
export const CAT_HISTORY_MAX = 6;
export function pickRotatingCategory() {
  let hist: string[] = [];
  try {
    hist = JSON.parse(localStorage.getItem(CAT_HISTORY_KEY) || "[]");
  } catch {
    /* ignore */
  }
  const fresh = MEMORY_CATEGORIES.filter((c) => !hist.includes(c.id));
  const pool = fresh.length ? fresh : MEMORY_CATEGORIES;
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  hist = [...hist, chosen.id].slice(-CAT_HISTORY_MAX);
  try {
    localStorage.setItem(CAT_HISTORY_KEY, JSON.stringify(hist));
  } catch {
    /* ignore */
  }
  return chosen;
}

// Map a memory-item label to a Twemoji SVG codepoint. Twemoji renders as
// illustrated vector artwork (not a system font emoji), which gives the cards
// a consistent premium look.
const TWEMOJI: Record<string, string> = {
  // animals
  Lion: "1f981",
  Tiger: "1f405",
  Cat: "1f431",
  Dog: "1f436",
  Cow: "1f42e",
  Horse: "1f434",
  Rabbit: "1f430",
  Bear: "1f43b",
  Fox: "1f98a",
  Panda: "1f43c",
  // fruits
  Apple: "1f34e",
  Banana: "1f34c",
  Grapes: "1f347",
  Orange: "1f34a",
  Mango: "1f96d",
  Kiwi: "1f95d",
  Peach: "1f351",
  Cherry: "1f352",
  Papaya: "1f96d",
  Pear: "1f350",
  // vegetables
  Carrot: "1f955",
  Potato: "1f954",
  Tomato: "1f345",
  Onion: "1f9c5",
  Corn: "1f33d",
  Peas: "1fada",
  Broccoli: "1f966",
  Beet: "1f966",
  Pumpkin: "1f383",
  Chili: "1f336",
  // birds
  Parrot: "1f99c",
  Eagle: "1f985",
  Owl: "1f989",
  Peacock: "1f99a",
  Sparrow: "1f426",
  Duck: "1f986",
  Crow: "1f426",
  Swan: "1f9a2",
  Hen: "1f414",
  Dove: "1f54a",
  // sea
  Fish: "1f41f",
  Shark: "1f988",
  Whale: "1f433",
  Octopus: "1f419",
  Crab: "1f980",
  Dolphin: "1f42c",
  Turtle: "1f422",
  Starfish: "2b50",
  Seal: "1f9ad",
  Jellyfish: "1fabc",
  // vehicles
  Car: "1f697",
  Bus: "1f68c",
  Train: "1f686",
  Plane: "2708",
  Ship: "1f6a2",
  Bike: "1f6b2",
  Truck: "1f69a",
  Rocket: "1f680",
  Boat: "26f5",
  Van: "1f690",
  // shapes (drawn separately)
  // body
  Eye: "1f441",
  Ear: "1f442",
  Nose: "1f443",
  Mouth: "1f444",
  Hand: "270b",
  Foot: "1f9b6",
  Head: "1f9d1",
  Leg: "1f9b5",
  // family
  Mother: "1f469",
  Father: "1f468",
  Sister: "1f467",
  Brother: "1f466",
  Grandma: "1f475",
  Grandpa: "1f474",
  Baby: "1f476",
  Uncle: "1f468",
  // school
  Book: "1f4d6",
  Pencil: "270f",
  Bag: "1f392",
  Bottle: "1f37c",
  Ruler: "1f4cf",
  Eraser: "1f9fd",
  Crayon: "1f58d",
  Notebook: "1f4d3",
  // flowers
  Rose: "1f339",
  Lily: "1f337",
  Tulip: "1f337",
  Daisy: "1f33c",
  Sunflower: "1f33b",
  Lotus: "1fab7",
  Orchid: "1f33a",
  Jasmine: "1f4ae",
  // toys
  Ball: "26bd",
  Doll: "1fa86",
  Kite: "1fa81",
  Blocks: "1f9f1",
  Puzzle: "1f9e9",
  Teddy: "1f9f8",
  "Yo-Yo": "1fa80",
  Top: "1fa80",
  // insects
  Bee: "1f41d",
  Ant: "1f41c",
  Butterfly: "1f98b",
  Ladybug: "1f41e",
  Spider: "1f577",
  Grasshopper: "1f997",
  Beetle: "1fab2",
  Dragonfly: "1f41e",
  // weather
  Sun: "2600",
  Rain: "1f327",
  Cloud: "2601",
  Snow: "2744",
  Storm: "1f329",
  Wind: "1f4a8",
  Rainbow: "1f308",
  Fog: "1f32b",
  // music
  Drum: "1f941",
  Guitar: "1f3b8",
  Piano: "1f3b9",
  Flute: "1fa88",
  Violin: "1f3bb",
  Trumpet: "1f3ba",
  Harp: "1fa95",
  Tabla: "1f941",
};

const twemojiUrl = (cp: string) =>
  `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${cp}.svg`;

// Draw a real geometric shape rather than a text label for the "shapes" pool.
const ShapeSvg = ({ name, color }: { name: string; color: string }) => {
  const stroke = "rgba(0,0,0,0.15)";
  const common = { fill: color, stroke, strokeWidth: 2 } as const;
  switch (name) {
    case "Circle":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <circle cx="50" cy="50" r="42" {...common} />
        </svg>
      );
    case "Square":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <rect x="10" y="10" width="80" height="80" rx="6" {...common} />
        </svg>
      );
    case "Triangle":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <polygon points="50,10 92,88 8,88" {...common} />
        </svg>
      );
    case "Star":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <polygon points="50,6 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38" {...common} />
        </svg>
      );
    case "Heart":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <path d="M50 86 L14 50 A20 20 0 0 1 50 24 A20 20 0 0 1 86 50 Z" {...common} />
        </svg>
      );
    case "Diamond":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <polygon points="50,8 92,50 50,92 8,50" {...common} />
        </svg>
      );
    case "Oval":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <ellipse cx="50" cy="50" rx="42" ry="30" {...common} />
        </svg>
      );
    case "Cube":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <polygon points="20,35 50,20 80,35 80,75 50,90 20,75" {...common} />
          <polyline points="20,35 50,50 80,35" fill="none" stroke={stroke} strokeWidth="2" />
          <line x1="50" y1="50" x2="50" y2="90" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <circle cx="50" cy="50" r="42" {...common} />
        </svg>
      );
  }
};

// A picture-based card face. Uses SVG shape art, colored dots for colors,
// large glyph for numbers/letters, and Twemoji SVG artwork for real-world items.
const CardFace = ({ item, size = "md" }: { item: MemItem; size?: "sm" | "md" | "lg" }) => {
  const isColor = item.key.startsWith("c-");
  const isShape = item.key.startsWith("sh-");
  const isNumber = item.key.startsWith("nm-");
  const isLetter = item.key.startsWith("lt-") && item.label.length === 1;
  const overrideCp = (item as MemItem & { __cp?: string }).__cp;
  const qtyMatch = /^qty-(\d+)$/.exec(item.label);
  const cp = overrideCp ?? TWEMOJI[item.label];
  const bg = isColor ? item.color : `linear-gradient(135deg, #ffffff, ${item.color}22)`;

  return (
    <div
      className="w-full h-full rounded-2xl flex items-center justify-center shadow-inner overflow-hidden p-2"
      style={{ background: bg }}
      aria-label={item.label}
      role="img"
    >
      {isColor ? null : qtyMatch ? (
        // Quantity picture: render N dots for the number-quantity game.
        (() => {
          const n = parseInt(qtyMatch[1], 10);
          const cols = n <= 3 ? n : n <= 6 ? 3 : 4;
          return (
            <div
              className="grid gap-1.5 place-items-center w-full h-full"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: n }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: "70%",
                    aspectRatio: "1 / 1",
                    background: item.color,
                    boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)",
                  }}
                />
              ))}
            </div>
          );
        })()
      ) : isShape ? (
        <ShapeSvg name={item.label} color={item.color} />
      ) : isNumber || isLetter ? (
        <span
          className={`font-display font-bold ${size === "sm" ? "text-3xl" : "text-5xl md:text-6xl"}`}
          style={{ color: item.color, textShadow: "0 2px 0 rgba(0,0,0,0.08)" }}
        >
          {item.label}
        </span>
      ) : IMG_MAP[item.label] ? (
        <img
          src={IMG_MAP[item.label]}
          alt={item.label}
          draggable={false}
          className={size === "sm" ? "w-3/5 h-3/5 object-contain" : "w-4/5 h-4/5 object-contain"}
          style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.15))" }}
          loading="lazy"
          decoding="async"
        />
      ) : cp ? (
        <img
          src={twemojiUrl(cp)}
          alt=""
          draggable={false}
          className={size === "sm" ? "w-3/5 h-3/5" : "w-4/5 h-4/5"}
          style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.15))" }}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-3/5 h-3/5 rounded-full" style={{ background: item.color }} />
      )}
    </div>
  );
};

// -------- Smart Memory Match (single unified game, rotating category each round) --------
const SmartMemoryMatch = ({
  difficulty,
  onClose,
}: {
  difficulty: Difficulty;
  onClose: () => void;
}) => {
  const size =
    difficulty === "easy" ? 4 : difficulty === "medium" ? 8 : difficulty === "hard" ? 12 : 12;
  const [round, setRound] = useState(0);
  const [category, setCategory] = useState(() => pickRotatingCategory());
  const cards = useMemo(() => {
    const pairs = shuffle(category.items).slice(0, size / 2);
    return shuffle([...pairs, ...pairs]).map((v, i) => ({ id: i, item: v }));
  }, [category, size, round]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const { give, node } = useReward();
  const done = matched.size === cards.length;

  useEffect(() => {
    if (round === 0) {
      speak("Let's play a memory game. I will show you some pictures. Look carefully.", {
        profile: "girl",
      });
      setTimeout(
        () =>
          speak(`Today's cards are ${category.title}. Find every matching pair!`, {
            profile: "girl",
          }),
        3200,
      );
    } else {
      speak(`New round: ${category.title}. Find the matching pairs!`, { profile: "girl" });
    }
    // eslint-disable-next-line
  }, [category]);

  // Big reward only after every pair is matched.
  const rewarded = useMemo(() => ({ done: false }), [category]);
  useEffect(() => {
    if (done && !rewarded.done) {
      rewarded.done = true;
      const pairs = cards.length / 2;
      const stars = moves <= pairs + 1 ? 5 : moves <= pairs * 2 ? 3 : 2;
      give(stars, stars * 2);
      speak("Amazing! You matched every pair.", { profile: "girl" });
    }
  }, [done, rewarded, cards.length, moves, give]);

  const flip = (i: number) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.has(i)) return;
    playPop();
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].item.key === cards[b].item.key) {
        setTimeout(() => {
          setMatched((s) => new Set([...s, a, b]));
          setFlipped([]);
          playSuccess();
          speak("You found a pair!", { profile: "boy" });
        }, 400);
      } else {
        setWrong(next);
        setTimeout(() => {
          setFlipped([]);
          setWrong([]);
        }, 800);
      }
    }
  };

  const nextRound = () => {
    playClick();
    setCategory(pickRotatingCategory());
    setRound((r) => r + 1);
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
  };

  if (done) {
    return (
      <div className="text-center py-6 relative">
        <Confetti />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl mb-2"
        >
          🏆
        </motion.div>
        <h3 className="text-2xl font-display font-bold mb-1">All matched!</h3>
        <p className="text-muted-foreground font-body mb-4">
          Category: {category.title} · {moves} moves.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={nextRound}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-display font-bold shadow"
          >
            Next round
          </button>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="bg-muted px-5 py-2 rounded-full font-display font-bold"
          >
            Back
          </button>
        </div>
        {node}
      </div>
    );
  }

  const cols = size <= 4 ? "grid-cols-2" : size <= 8 ? "grid-cols-4" : "grid-cols-4 md:grid-cols-6";
  return (
    <div>
      <div className="flex items-center justify-between mb-3 text-sm font-body">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-display font-bold">
          🧠 {category.title}
        </span>
        <span className="text-muted-foreground">
          Moves: {moves} · Matched: {matched.size / 2} / {size / 2}
        </span>
      </div>
      <div className={`grid ${cols} gap-3`}>
        {cards.map((card, i) => {
          const shown = flipped.includes(i) || matched.has(i);
          const isMatched = matched.has(i);
          const isWrong = wrong.includes(i);
          return (
            <motion.button
              key={card.id}
              whileHover={!shown ? { scale: 1.05 } : {}}
              whileTap={!shown ? { scale: 0.95 } : {}}
              animate={
                isWrong ? { x: [0, -6, 6, -4, 4, 0] } : isMatched ? { scale: [1, 1.06, 1] } : {}
              }
              onClick={() => flip(i)}
              className={`aspect-square rounded-2xl shadow-lg overflow-hidden transition-all ${
                isMatched ? "ring-4 ring-kid-yellow" : ""
              } ${shown ? "" : "bg-gradient-to-br from-kid-purple to-kid-pink"}`}
            >
              {shown ? (
                <CardFace item={card.item} size={size > 8 ? "sm" : "md"} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-foreground font-display font-bold text-3xl">
                  ?
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      {node}
    </div>
  );
};

// -------- What's Missing? (show items, hide, remove one, ask which disappeared) --------
const WhatsMissing = ({
  difficulty,
  onClose,
  theme,
}: {
  difficulty: Difficulty;
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
  const [choices, setChoices] = useState<MemItem[]>([]);
  const [score, setScore] = useState(0);
  const [pick, setPick] = useState<MemItem | null>(null);
  const { give, node } = useReward();

  const start = () => {
    const set = shuffle(pool).slice(0, count);
    const gone = set[Math.floor(Math.random() * set.length)];
    const distractors = shuffle(
      pool.filter((it) => !set.includes(it) && it.key !== gone.key),
    ).slice(0, 3);
    const choiceItems = shuffle([gone, ...distractors]);
    setItems(set);
    setMissing(gone);
    setChoices(choiceItems);
    setPick(null);
    setPhase("show");
    if (round === 0) {
      speak("Let's play a memory game. I will show you some pictures. Look carefully.", {
        profile: "girl",
      });
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
    start(); /* eslint-disable-next-line */
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
      // Reward only after every round is complete.
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
        <span>
          Round {round + 1} / {totalRounds}
        </span>
        <span className="flex items-center gap-1 font-display font-bold text-foreground">
          <Trophy className="w-4 h-4 text-kid-yellow" /> {score}
        </span>
      </div>
      {phase === "show" && (
        <div>
          <p className="text-center font-display font-bold mb-4 text-xl">Remember these!</p>
          <div
            className={`grid ${count <= 4 ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4"} gap-3`}
          >
            {items.map((it) => (
              <motion.div
                key={it.key}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="aspect-square"
              >
                <CardFace item={it} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {phase === "hide" && (
        <div className="flex items-center justify-center h-64 text-2xl font-display text-muted-foreground">
          Thinking…
        </div>
      )}
      {(phase === "ask" || phase === "result") && (
        <div>
          <p className="text-center font-display font-bold mb-4 text-xl">Which one is missing?</p>
          <div
            className={`grid ${count <= 4 ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4"} gap-3`}
          >
            {choices.map((it) => {
              const isAns = phase === "result" && missing?.key === it.key;
              const isPick = pick?.key === it.key;
              return (
                <motion.button
                  key={it.key}
                  disabled={phase === "result"}
                  whileHover={phase === "ask" ? { scale: 1.05 } : {}}
                  onClick={() => choose(it)}
                  animate={isPick && !isAns ? { x: [0, -5, 5, 0] } : {}}
                  className={`aspect-square rounded-2xl overflow-hidden shadow-lg ${
                    isAns ? "ring-4 ring-kid-green" : isPick ? "ring-4 ring-destructive" : ""
                  }`}
                >
                  <CardFace item={it} />
                </motion.button>
              );
            })}
          </div>
          {phase === "result" && (
            <div className="text-center mt-5">
              <button
                onClick={next}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-display font-bold shadow"
              >
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

// -------- Flash Color Memory (show sequence of colors, then ask which was Nth) --------
const FlashColorMemory = ({
  difficulty,
  onClose,
}: {
  difficulty: Difficulty;
  onClose: () => void;
}) => {
  const len = difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 7;
  const totalRounds = 5;
  const palette = MEMORY_CATEGORIES.find((c) => c.id === "colors")!.items;

  const [round, setRound] = useState(0);
  const [seq, setSeq] = useState<MemItem[]>([]);
  const [showIdx, setShowIdx] = useState(-1);
  const [phase, setPhase] = useState<"flash" | "ask" | "result">("flash");
  const [askPos, setAskPos] = useState(0);
  const [score, setScore] = useState(0);
  const [pick, setPick] = useState<MemItem | null>(null);
  const { give, node } = useReward();

  useEffect(() => {
    const s = Array.from(
      { length: len },
      () => palette[Math.floor(Math.random() * palette.length)],
    );
    setSeq(s);
    setPhase("flash");
    setShowIdx(0);
    setPick(null);
    setAskPos(Math.floor(Math.random() * len));
    if (round === 0)
      speak("Let's play Flash Colors. Watch each color carefully and remember the order.", {
        profile: "girl",
      });
    else speak("Watch the colors carefully!", { profile: "girl" });
    // eslint-disable-next-line
  }, [round]);

  useEffect(() => {
    if (phase !== "flash" || showIdx < 0) return;
    if (showIdx >= seq.length) {
      setTimeout(() => setPhase("ask"), 400);
      return;
    }
    const t = setTimeout(() => setShowIdx((i) => i + 1), 900);
    return () => clearTimeout(t);
  }, [showIdx, phase, seq.length]);

  useEffect(() => {
    if (phase === "ask")
      speak(`Which color was number ${askPos + 1}? Touch the correct one.`, { profile: "girl" });
  }, [phase, askPos]);

  const choose = (c: MemItem) => {
    if (phase !== "ask") return;
    setPick(c);
    const correct = c.key === seq[askPos].key;
    recordAttempt(correct);
    if (correct) {
      playSuccess();
      speak("Wonderful!", { profile: "girl" });
      setScore((s) => s + 1);
    } else {
      playError();
      speak("Almost. Look again next time.", { profile: "girl" });
    }
    setPhase("result");
  };

  const next = () => {
    if (round + 1 >= totalRounds) {
      const finalScore = score;
      if (finalScore === totalRounds) give(5, 10);
      else if (finalScore >= Math.ceil(totalRounds / 2)) give(3, 6);
      else give(1, 2);
      speak("Great job! You finished Flash Colors.", { profile: "girl" });
      setTimeout(() => onClose(), 1400);
      return;
    }
    setRound((r) => r + 1);
  };

  return (
    <div>
      <div className="flex justify-between mb-3 text-sm font-body text-muted-foreground">
        <span>
          Round {round + 1} / {totalRounds}
        </span>
        <span className="font-display font-bold text-foreground">Score {score}</span>
      </div>
      {phase === "flash" && (
        <div className="flex flex-col items-center py-10">
          <div className="text-sm mb-2 font-body text-muted-foreground">
            Color {Math.min(showIdx + 1, seq.length)} of {seq.length}
          </div>
          <motion.div
            key={showIdx}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-40 h-40 rounded-full shadow-2xl"
            style={{ background: seq[showIdx]?.color }}
          />
        </div>
      )}
      {(phase === "ask" || phase === "result") && (
        <div>
          <p className="text-center font-display font-bold text-xl mb-4">
            Which color was number {askPos + 1}?
          </p>
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {palette.map((c) => {
              const isAns = phase === "result" && seq[askPos].key === c.key;
              const isPick = pick?.key === c.key;
              return (
                <motion.button
                  key={c.key}
                  whileHover={{ scale: 1.08 }}
                  onClick={() => choose(c)}
                  className={`aspect-square rounded-full shadow-lg ${isAns ? "ring-4 ring-kid-green" : isPick && !isAns ? "ring-4 ring-destructive" : ""}`}
                  style={{ background: c.color }}
                />
              );
            })}
          </div>
          {phase === "result" && (
            <div className="text-center mt-5">
              <button
                onClick={next}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-display font-bold shadow"
              >
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

// -------- Pattern Recall (watch a pattern lighting up, then repeat it) --------
const PatternRecall = ({
  difficulty,
  onClose,
}: {
  difficulty: Difficulty;
  onClose: () => void;
}) => {
  const len = difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 7;
  const tiles = MEMORY_CATEGORIES.find((c) => c.id === "colors")!.items.slice(0, 6);
  const [round, setRound] = useState(0);
  const [seq, setSeq] = useState<number[]>([]);
  const [flashIdx, setFlashIdx] = useState(-1);
  const [phase, setPhase] = useState<"watch" | "input" | "result">("watch");
  const [userIdx, setUserIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [win, setWin] = useState(false);
  const { give, node } = useReward();

  useEffect(() => {
    const s = Array.from({ length: len }, () => Math.floor(Math.random() * tiles.length));
    setSeq(s);
    setPhase("watch");
    setFlashIdx(0);
    setUserIdx(0);
    if (round === 0)
      speak("Let's play Pattern Recall. Watch the pattern, then repeat it in order.", {
        profile: "girl",
      });
    else speak("Watch the pattern.", { profile: "girl" });
    // eslint-disable-next-line
  }, [round]);

  useEffect(() => {
    if (phase !== "watch" || flashIdx < 0) return;
    if (flashIdx >= seq.length) {
      setTimeout(() => {
        setPhase("input");
        speak("Now you try! Touch the tiles in the same order.", { profile: "boy" });
      }, 400);
      return;
    }
    const t = setTimeout(() => setFlashIdx((i) => i + 1), 750);
    return () => clearTimeout(t);
  }, [flashIdx, phase, seq.length]);

  const tap = (i: number) => {
    if (phase !== "input") return;
    playPop();
    if (i === seq[userIdx]) {
      if (userIdx + 1 === seq.length) {
        setWin(true);
        setPhase("result");
        playSuccess();
        setScore((s) => s + 1);
        speak("Fantastic memory!", { profile: "girl" });
      } else setUserIdx((u) => u + 1);
    } else {
      setWin(false);
      setPhase("result");
      playError();
      recordAttempt(false);
      speak("Almost. Let's try again.", { profile: "girl" });
    }
  };

  const next = () => {
    if (round + 1 >= 5) {
      if (score === 5) give(5, 10);
      else if (score >= 3) give(3, 6);
      else give(1, 2);
      speak("Great job! You finished Pattern Recall.", { profile: "girl" });
      setTimeout(() => onClose(), 1400);
      return;
    }
    setRound((r) => r + 1);
  };

  return (
    <div>
      <div className="flex justify-between mb-3 text-sm font-body text-muted-foreground">
        <span>Round {round + 1} / 5</span>
        <span className="font-display font-bold text-foreground">Score {score}</span>
      </div>
      <p className="text-center font-display font-bold mb-4">
        {phase === "watch"
          ? "Watch carefully…"
          : phase === "input"
            ? `Repeat the pattern (${userIdx + 1}/${seq.length})`
            : win
              ? "🎉 Correct!"
              : "Not quite!"}
      </p>
      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {tiles.map((t, i) => {
          const lit = phase === "watch" && seq[flashIdx] === i;
          return (
            <motion.button
              key={t.key}
              onClick={() => tap(i)}
              whileTap={{ scale: 0.9 }}
              animate={lit ? { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 0.5 }}
              className={`aspect-square rounded-2xl shadow-lg transition-opacity ${lit ? "" : "opacity-70"}`}
              style={{ background: t.color }}
            />
          );
        })}
      </div>
      {phase === "result" && (
        <div className="text-center mt-5">
          <button
            onClick={next}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-display font-bold shadow"
          >
            {round + 1 >= 5 ? "Finish" : "Next round"}
          </button>
        </div>
      )}
      {node}
    </div>
  );
};

// -------- Pair Match Memory (letter→object, number→quantity, animal→home) --------
const PairMatchMemory = ({
  difficulty,
  onClose,
  mode,
}: {
  difficulty: Difficulty;
  onClose: () => void;
  mode: "letter-object" | "number-quantity" | "animal-home";
}) => {
  type Pair = { left: MemItem; right: MemItem };
  const allPairs: Pair[] = useMemo(() => {
    if (mode === "letter-object") {
      // Letter on the left, Twemoji picture on the right (no word label).
      const data: [string, string][] = [
        ["A", "Apple"],
        ["B", "Ball"],
        ["C", "Cat"],
        ["D", "Dog"],
        ["F", "Fish"],
        ["H", "Horse"],
        ["L", "Lion"],
        ["O", "Owl"],
        ["P", "Panda"],
        ["R", "Rabbit"],
        ["S", "Sun"],
        ["T", "Tiger"],
      ];
      return data.map(([l, o], i) => ({
        left: { key: `lt-${l}`, label: l, color: kidColor(i) }, // rendered as big letter
        right: { key: `lt-${l}`, label: o, color: kidColor(i + 3) }, // rendered as twemoji picture
      }));
    }
    if (mode === "number-quantity") {
      // Number on the left; right side is a picture-only card with N dots.
      return Array.from({ length: 10 }, (_, i) => {
        const n = i + 1;
        return {
          left: { key: `nm-${n}`, label: String(n), color: kidColor(i) },
          right: { key: `nm-${n}`, label: `qty-${n}`, color: kidColor(i + 4) },
        };
      });
    }
    // animal-home — both sides are picture cards, no words.
    const data: [string, string][] = [
      ["Bird", "Nest"],
      ["Fish", "Sea"],
      ["Dog", "Kennel"],
      ["Rabbit", "Burrow"],
      ["Bee", "Hive"],
      ["Lion", "Forest"],
      ["Horse", "Stable"],
      ["Cow", "Barn"],
    ];
    const homeCp: Record<string, string> = {
      Nest: "1faba",
      Sea: "1f30a",
      Kennel: "1f3e0",
      Burrow: "26f0",
      Hive: "1f36f",
      Forest: "1f332",
      Stable: "1f3e1",
      Barn: "1f3da",
    };
    return data.map(([a, h], i) => ({
      left: { key: `H-${a}`, label: a, color: kidColor(i) },
      right: { key: `H-${a}`, label: h, color: kidColor(i + 2), __cp: homeCp[h] } as MemItem & {
        __cp?: string;
      },
    }));
  }, [mode]);

  const count = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 6;
  const [round, setRound] = useState(0);
  const pairs = useMemo(() => shuffle(allPairs).slice(0, count), [allPairs, count, round]);
  const rights = useMemo(() => shuffle(pairs.map((p) => p.right)), [pairs]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<MemItem | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const { give, node } = useReward();
  useEffect(() => {
    setMatched(new Set());
    setSelected(null);
    setWrong(null);
  }, [round, mode]);
  const title =
    mode === "letter-object"
      ? "Letter → Object"
      : mode === "number-quantity"
        ? "Number → Quantity"
        : "Animal → Home";

  useEffect(() => {
    const intro =
      mode === "letter-object"
        ? "Let's match each letter to its picture. Look carefully and touch the correct one."
        : mode === "number-quantity"
          ? "Let's match each number to the correct amount. Count carefully."
          : "Let's find each animal's home. Look at the pictures and choose.";
    speak(intro, { profile: "girl" });
  }, [title, mode]);

  const done = matched.size === pairs.length;

  // Reward once, only after every pair is matched.
  const rewarded = useMemo(() => ({ done: false }), [round, mode]);
  useEffect(() => {
    if (done && !rewarded.done) {
      rewarded.done = true;
      give(4, 8);
      speak("Wonderful! You matched every one.", { profile: "girl" });
    }
  }, [done, rewarded, give]);

  const pickLeft = (l: MemItem) => {
    if (matched.has(l.key)) return;
    playClick();
    setSelected(l);
  };
  const pickRight = (r: MemItem) => {
    if (!selected || matched.has(r.key)) return;
    if (selected.key === r.key) {
      playSuccess();
      recordAttempt(true);
      setMatched((s) => new Set([...s, r.key]));
      setSelected(null);
      speak("Excellent!", { profile: "girl" });
    } else {
      playError();
      recordAttempt(false);
      setWrong(r.key);
      speak("Almost. Look again and try.", { profile: "girl" });
      setTimeout(() => {
        setWrong(null);
        setSelected(null);
      }, 700);
    }
  };

  if (done) {
    return (
      <div className="text-center py-6 relative">
        <Confetti />
        <div className="text-6xl mb-2">🏆</div>
        <h3 className="text-2xl font-display font-bold mb-3">All matched!</h3>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setRound((r) => r + 1)}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-display font-bold shadow"
          >
            Next round
          </button>
          <button
            onClick={onClose}
            className="bg-muted px-5 py-2 rounded-full font-display font-bold"
          >
            Back
          </button>
        </div>
        {node}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 text-sm font-body">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-display font-bold">
          {title}
        </span>
        <span className="text-muted-foreground">
          Matched {matched.size} / {pairs.length}
        </span>
      </div>
      <div className="space-y-4">
        {pairs.map((p, i) => {
          const isMatched = matched.has(p.left.key);
          const isSel = selected?.key === p.left.key;
          const isWrong = wrong === p.right.key;
          const reversed = i % 2 === 1;
          const leftCard = (
            <motion.button
              key={p.left.key}
              disabled={isMatched}
              whileHover={!isMatched ? { scale: 1.05 } : {}}
              onClick={() => pickLeft(p.left)}
              animate={isMatched ? { opacity: 0.4, scale: 0.95 } : {}}
              className={`flex-1 aspect-square rounded-2xl overflow-hidden shadow-lg transition-all ${isSel ? "ring-4 ring-kid-yellow scale-105" : ""}`}
            >
              <CardFace item={p.left} />
            </motion.button>
          );
          const rightCard = (
            <motion.button
              key={p.right.key + "-r"}
              disabled={isMatched}
              whileHover={!isMatched ? { scale: 1.05 } : {}}
              animate={
                isWrong
                  ? { x: [0, -8, 8, -4, 4, 0] }
                  : isMatched
                    ? { opacity: 0.4, scale: 0.95 }
                    : {}
              }
              onClick={() => pickRight(p.right)}
              className={`flex-1 aspect-square rounded-2xl overflow-hidden shadow-lg transition-all ${isMatched ? "" : ""}`}
            >
              <CardFace item={p.right} />
            </motion.button>
          );
          return (
            <motion.div
              key={p.left.key + "-row"}
              className="flex gap-3 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {reversed ? (
                <>
                  {rightCard}
                  <div className="text-2xl">↔</div>
                  {leftCard}
                </>
              ) : (
                <>
                  {leftCard}
                  <div className="text-2xl">→</div>
                  {rightCard}
                </>
              )}
            </motion.div>
          );
        })}
      </div>
      {node}
    </div>
  );
};

// -------- Rewards summary (from progress) --------
const RewardsShowcase = () => {
  const items = [
    { emoji: "⭐", label: "Stars" },
    { emoji: "🪙", label: "Coins" },
    { emoji: "🏅", label: "Badges" },
    { emoji: "🎁", label: "Gifts" },
    { emoji: "🧸", label: "Stickers" },
    { emoji: "🏆", label: "Trophies" },
    { emoji: "🎈", label: "Balloons" },
    { emoji: "🎉", label: "Confetti" },
  ];
  return (
    <div className="bg-card rounded-bubble border border-border shadow-lg p-5 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="w-5 h-5 text-kid-pink" />
        <h3 className="font-display font-bold text-lg">Earn Rewards</h3>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {items.map((r) => (
          <div key={r.label} className="text-center">
            <motion.div
              className="text-3xl inline-block"
              animate={{ y: [0, -6, 0], rotate: [-6, 6, -6], scale: [1, 1.15, 1] }}
              transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
            >
              {r.emoji}
            </motion.div>
            <div className="text-xs font-body text-muted-foreground">{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------- Main page --------
const PlayZone = () => {
  const [selected, setSelected] = useState<{ game: GameDef; difficulty: Difficulty } | null>(null);
  const [pickingFor, setPickingFor] = useState<GameDef | null>(null);

  const openGame = (game: GameDef) => {
    playClick();
    setPickingFor(game);
  };

  const startGame = (difficulty: Difficulty) => {
    if (!pickingFor) return;
    playPop();
    setSelected({ game: pickingFor, difficulty });
    setPickingFor(null);
    speak(`Let's play ${pickingFor.title}!`, { profile: "girl" });
  };

  return (
    <div className="p-4 md:p-8 relative">
      {/* Cute floating clouds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        {["☁️", "☁️", "☁️", "🎈", "🎈", "⭐"].map((e, i) => (
          <motion.div
            key={i}
            initial={{ x: `${i * 18}%`, y: "20%" }}
            animate={{ y: ["20%", "26%", "20%"] }}
            transition={{ duration: 5 + i, repeat: Infinity }}
            className="absolute text-4xl opacity-40"
            style={{ top: `${8 + i * 6}%`, left: `${(i * 15) % 90}%` }}
          >
            {e}
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-card/80 px-4 py-2 rounded-full shadow border border-border mb-3"
          >
            <Sparkles className="w-4 h-4 text-kid-yellow" />
            <span className="font-body font-semibold text-sm">Welcome to the PlayZone!</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-bold">
            <span className="text-kid-pink">P</span>
            <span className="text-kid-orange">l</span>
            <span className="text-kid-yellow">a</span>
            <span className="text-kid-green">y</span>
            <span className="text-kid-teal">Z</span>
            <span className="text-kid-blue">o</span>
            <span className="text-kid-purple">n</span>
            <span className="text-kid-pink">e</span>
            <span className="ml-2">🎮</span>
          </h1>
          <p className="text-lg md:text-xl font-body text-muted-foreground mt-2">
            Games for little champions — pick a game, pick a level, have fun!
          </p>
        </div>

        <RewardsShowcase />

        <div className="bg-gradient-to-r from-kid-orange/10 to-kid-yellow/10 border border-border rounded-bubble p-5 mb-8 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-kid-orange shrink-0" />
          <div className="flex-1">
            <div className="font-display font-bold text-lg">Daily Challenge</div>
            <p className="text-sm font-body text-muted-foreground">
              A fresh mix of questions every day. Play any game — first correct answer counts!
            </p>
          </div>
          <button
            onClick={() =>
              openGame({
                id: "rapid-fire",
                title: "Daily Challenge",
                emoji: "📅",
                desc: "Today's mix!",
              })
            }
            className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-display font-bold shadow whitespace-nowrap"
          >
            Play today
          </button>
        </div>

        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <section key={cat.id} className="mb-10">
              <div
                className={`bg-gradient-to-r ${cat.gradient} rounded-t-bubble p-4 md:p-5 flex items-center gap-3 text-primary-foreground shadow-lg`}
              >
                <div className="text-3xl">{cat.emoji}</div>
                <div>
                  <h2 className="font-display font-bold text-xl md:text-2xl">{cat.title}</h2>
                </div>
                <Icon className="w-6 h-6 ml-auto" />
              </div>
              <div className="bg-card border border-t-0 border-border rounded-b-bubble p-4 md:p-5 shadow-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {cat.games.map((g) => (
                    <motion.button
                      key={g.id}
                      whileHover={{ y: -4, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openGame(g)}
                      className="bg-muted hover:bg-muted/70 rounded-2xl p-4 text-left transition-colors"
                    >
                      <motion.div
                        className="text-4xl mb-1 inline-block"
                        animate={{ y: [0, -6, 0, -3, 0], rotate: [-8, 8, -8], scale: [1, 1.12, 1] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {g.emoji}
                      </motion.div>
                      <div className="font-display font-bold text-foreground text-sm md:text-base">
                        {g.title}
                      </div>
                      <div className="text-xs font-body text-muted-foreground mt-0.5">{g.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Difficulty picker */}
      <AnimatePresence>
        {pickingFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPickingFor(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e: ReactMouseEvent) => e.stopPropagation()}
              className="bg-card rounded-bubble border border-border shadow-2xl p-6 max-w-md w-full text-center"
            >
              <div className="text-5xl mb-2">{pickingFor.emoji}</div>
              <h3 className="font-display font-bold text-2xl mb-1">{pickingFor.title}</h3>
              <p className="text-muted-foreground font-body mb-5">Choose a difficulty:</p>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map((d) => (
                  <motion.button
                    key={d.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startGame(d.id)}
                    className="bg-gradient-to-br from-kid-blue to-kid-purple text-primary-foreground rounded-2xl p-4 font-display font-bold shadow-lg"
                  >
                    <div className="text-3xl">{d.emoji}</div>
                    <div className="mt-1">{d.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game host */}
      {selected && (
        <GameHost
          game={selected.game}
          difficulty={selected.difficulty}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default PlayZone;
