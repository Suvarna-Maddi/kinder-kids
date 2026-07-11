import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export function LazyImage({ className = "", containerClassName = "", src, alt, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative flex items-center justify-center ${className} ${containerClassName}`}>
      {/* Skeleton Loading State */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            key="skeleton"
            className="absolute inset-0 bg-slate-100/80 rounded-[inherit] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Shimmer gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12"
              animate={{ x: ["-150%", "150%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Bouncing Sparkle */}
            <motion.div
              animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-kid-blue/40 z-10"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"} transition-all duration-700 ease-out`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
        {...(props as any)}
      />
    </div>
  );
}
