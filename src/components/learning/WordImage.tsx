// Renders a word's imagery. Uses a large emoji glyph on a soft card.
// Kept as a component so Phase 4 can swap in real transparent PNGs
// without touching every call-site.

import { memo } from "react";
import { motion } from "framer-motion";
import { IMG_MAP } from "@/lib/images";
import { LazyImage } from "./LazyImage";

type Props = {
  emoji: string;
  word: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  highlighted?: boolean;
};

const SIZE_CLASSES = {
  sm: "w-16 h-16 text-4xl",
  md: "w-24 h-24 text-5xl md:w-28 md:h-28 md:text-6xl",
  lg: "w-32 h-32 text-6xl md:w-40 md:h-40 md:text-7xl",
};

const WordImage = memo(({ emoji, word, size = "md", onClick, highlighted }: Props) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05, y: -3 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      aria-label={word}
      className={`${SIZE_CLASSES[size]} rounded-3xl bg-gradient-to-br from-card to-muted shadow-lg border-2 flex items-center justify-center transition-colors ${
        highlighted ? "border-accent ring-4 ring-accent/40" : "border-border"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {IMG_MAP[word] ? (
        <LazyImage
          src={IMG_MAP[word]}
          alt={word}
          className="w-3/5 h-3/5 object-contain"
          draggable={false}
        />
      ) : (
        <span role="img" aria-hidden>
          {emoji}
        </span>
      )}
    </motion.button>
  );
});
WordImage.displayName = "WordImage";
export default WordImage;
