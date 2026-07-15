import { motion } from "framer-motion";
import { Trophy, Star, Coins, Flame, BookOpen, Hash, Grid3X3, Sparkles } from "lucide-react";
import { useProgress } from "@/lib/progress";

export const BADGES: Array<{
  slug: string;
  label: string;
  when: (p: ReturnType<typeof useProgress>) => boolean;
  emoji: string;
}> = [
  { slug: "first-star", label: "First Star", when: (p) => p.stars >= 1, emoji: "🌟" },
  { slug: "star-10", label: "10 Stars", when: (p) => p.stars >= 10, emoji: "⭐" },
  { slug: "star-50", label: "50 Stars", when: (p) => p.stars >= 50, emoji: "🌠" },
  { slug: "star-100", label: "Century of Stars", when: (p) => p.stars >= 100, emoji: "💫" },
  { slug: "coin-25", label: "Coin Collector", when: (p) => p.coins >= 25, emoji: "🪙" },
  { slug: "coin-100", label: "Treasure Hunter", when: (p) => p.coins >= 100, emoji: "💰" },
  {
    slug: "alpha-half",
    label: "Halfway ABC",
    when: (p) => p.lettersLearned.length >= 13,
    emoji: "🔤",
  },
  {
    slug: "alpha-full",
    label: "Alphabet Master",
    when: (p) => p.lettersLearned.length >= 26,
    emoji: "📖",
  },
  {
    slug: "number-20",
    label: "Number Explorer",
    when: (p) => p.numbersLearned.length >= 20,
    emoji: "🔢",
  },
  {
    slug: "tables-5",
    label: "Times Champion",
    when: (p) => p.tablesCompleted.length >= 5,
    emoji: "✖️",
  },
  { slug: "streak-3", label: "3-Day Streak", when: (p) => p.streakDays >= 3, emoji: "🔥" },
  { slug: "streak-7", label: "Week Warrior", when: (p) => p.streakDays >= 7, emoji: "🏅" },
];

const Rewards = () => {
  const p = useProgress();
  const accuracy = p.attempts ? Math.round((p.correct / p.attempts) * 100) : 0;

  const stats = [
    {
      label: "Stars",
      value: p.stars,
      icon: Star,
      color: "text-kid-yellow",
      bg: "bg-kid-yellow/10",
    },
    {
      label: "Coins",
      value: p.coins,
      icon: Coins,
      color: "text-kid-orange",
      bg: "bg-kid-orange/10",
    },
    {
      label: "Day Streak",
      value: p.streakDays,
      icon: Flame,
      color: "text-kid-red",
      bg: "bg-kid-red/10",
    },
    {
      label: "Games Played",
      value: p.gamesCompleted,
      icon: Trophy,
      color: "text-kid-purple",
      bg: "bg-kid-purple/10",
    },
    {
      label: "Letters Learned",
      value: p.lettersLearned.length,
      icon: BookOpen,
      color: "text-kid-green",
      bg: "bg-kid-green/10",
    },
    {
      label: "Numbers Learned",
      value: p.numbersLearned.length,
      icon: Hash,
      color: "text-kid-blue",
      bg: "bg-kid-blue/10",
    },
    {
      label: "Tables Done",
      value: p.tablesCompleted.length,
      icon: Grid3X3,
      color: "text-kid-pink",
      bg: "bg-kid-pink/10",
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
      icon: Sparkles,
      color: "text-kid-teal",
      bg: "bg-kid-teal/10",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-kid-yellow" />
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Your Rewards 🏆
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-10">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-2xl border border-border shadow-md p-4 md:p-5 text-center"
              >
                <div
                  className={`${s.bg} w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-2`}
                >
                  <Icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {s.value}
                </div>
                <div className="text-xs md:text-sm font-body text-muted-foreground">{s.label}</div>
              </motion.div>
            );
          })}
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {BADGES.map((b, i) => {
            const earned = b.when(p);
            return (
              <motion.div
                key={b.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-2xl border-2 p-4 flex flex-col items-center text-center shadow-sm ${
                  earned ? "bg-card border-accent" : "bg-muted/40 border-border opacity-60"
                }`}
              >
                <div className={`text-4xl mb-1 ${earned ? "" : "grayscale"}`}>{b.emoji}</div>
                <div className="font-display font-bold text-foreground text-sm">{b.label}</div>
                <div className="text-xs font-body text-muted-foreground mt-1">
                  {earned ? "Earned!" : "Locked"}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
