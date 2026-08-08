import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

// Image Imports
import hAbc from "@/assets/h_abc.png";
import hNum from "@/assets/h num.png";
import hTel from "@/assets/h tel.png";
import hSolve from "@/assets/h solve.png";
import hTables from "@/assets/h tables.png";
import hShapes from "@/assets/h shapes.png";
import hSpace from "@/assets/h space.png";
import hPlay from "@/assets/h play.png";
import rewardChest from "@/assets/reward_chest.png";

export type CategoryType =
  | "alphabets"
  | "numbers"
  | "telugu"
  | "math"
  | "tables"
  | "shapes"
  | "space"
  | "playzone"
  | "rewards";

interface CategoryHeroProps {
  category: CategoryType;
  title?: string | React.ReactNode;
  description?: string;
  ctaText: string;
  onCtaClick?: () => void;
}

const HERO_CONFIGS: Record<
  CategoryType,
  {
    image: string;
    gradient: string;
    isCustomLayout?: boolean;
  }
> = {
  alphabets: { image: hAbc, gradient: "from-[#FFF9E6] to-[#FFF0F5]" },
  numbers: { image: hNum, gradient: "from-[#EEF9FF] to-[#FFF0F5]" },
  telugu: { image: hTel, gradient: "from-[#FDF6FF] to-[#FFFDF0]" },
  math: { image: hSolve, gradient: "from-[#FFF0F5] to-[#F0FFF4]" },
  tables: { image: hTables, gradient: "from-[#FFFDF0] to-[#EEF5FF]" },
  shapes: { image: hShapes, gradient: "from-[#EEF5FF] to-[#FFF0F5]" },
  space: { image: hSpace, gradient: "from-[#080B1E] to-[#1E1B4B]" },
  playzone: { image: hPlay, gradient: "from-[#FFF0F6] to-[#E0F2FE]" },
  rewards: {
    image: rewardChest,
    gradient: "from-[#FAF5FF] via-[#FEF3C7] to-[#FDF4FF]",
    isCustomLayout: true,
  },
};

export const CategoryHero: React.FC<CategoryHeroProps> = ({
  category,
  ctaText,
  onCtaClick,
}) => {
  const config = HERO_CONFIGS[category];

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const nextSection = document.getElementById("learning-content");
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (config.isCustomLayout) {
    // Custom layout for Rewards as it uses a standalone asset (chest) instead of a pre-rendered wide banner
    return (
      <div className={`relative overflow-hidden w-full min-h-[400px] flex items-center bg-gradient-to-br ${config.gradient} border-b border-border`}>
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-10 z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-display font-bold bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20">
              🏆 Achievements
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-[#B45309]">
              Celebrate Your Learning!
            </h1>
            <p className="text-sm sm:text-base md:text-lg max-w-lg font-body text-muted-foreground">
              Complete activities, earn stars, unlock achievements, and become a KinderKidsspace champion!
            </p>
            <button
              onClick={handleCtaClick}
              className="px-8 py-3.5 rounded-full font-display font-bold text-lg text-white shadow-lg bg-gradient-to-r from-kid-pink to-kid-purple hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-kid-purple/20"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="md:col-span-5 flex justify-center">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={config.image}
              alt="Rewards Chest"
              className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-none object-contain drop-shadow-xl animate-float"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background pt-4 pb-2 md:pt-6 md:pb-4 border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 hover:shadow-2xl transition-shadow duration-300 group cursor-pointer"
          onClick={handleCtaClick}
        >
          {/* Main Full-Width banner image */}
          <img
            src={config.image}
            alt={category}
            className="w-full h-auto object-cover aspect-[2.2/1] sm:aspect-[2.3/1] md:aspect-[2.4/1]"
            loading="eager"
          />

          {/* Interactive Floating Action Button Overlay at the bottom */}
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 opacity-90 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3.5 rounded-full bg-white text-slate-900 font-display font-bold text-sm md:text-base shadow-xl border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 text-kid-pink" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
