// Floating settings dock for learning pages. Voice on/off, sound on/off,
// speech rate slider (locked to a kid-friendly 0.55–0.8 range),
// replay-last-audio, and a link to the current stars/coins from progress.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Music2, Repeat, Settings2, Star, Coins } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { replayLast } from "@/lib/tts";
import { useProgress } from "@/lib/progress";

const SettingsBar = () => {
  const [open, setOpen] = useState(false);
  const [settings, update] = useSettings();
  const progress = useProgress();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-card border border-border rounded-2xl shadow-2xl p-4 w-64 backdrop-blur-md"
          >
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
              <div className="flex items-center gap-1 bg-kid-yellow/10 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-kid-yellow fill-kid-yellow" />
                <span className="font-display font-bold text-sm">{progress.stars}</span>
              </div>
              <div className="flex items-center gap-1 bg-kid-orange/10 px-2 py-1 rounded-full">
                <Coins className="w-4 h-4 text-kid-orange" />
                <span className="font-display font-bold text-sm">{progress.coins}</span>
              </div>
              {progress.streakDays > 0 && (
                <div className="flex items-center gap-1 bg-kid-red/10 px-2 py-1 rounded-full">
                  <span className="text-sm">🔥</span>
                  <span className="font-display font-bold text-sm">{progress.streakDays}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => update({ voiceEnabled: !settings.voiceEnabled })}
              className="w-full flex items-center justify-between gap-2 py-2 px-3 rounded-xl hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2 font-body text-sm text-foreground">
                {settings.voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Voice
              </span>
              <span className={`text-xs font-bold ${settings.voiceEnabled ? "text-accent" : "text-muted-foreground"}`}>
                {settings.voiceEnabled ? "ON" : "OFF"}
              </span>
            </button>

            <button
              onClick={() => update({ soundEnabled: !settings.soundEnabled })}
              className="w-full flex items-center justify-between gap-2 py-2 px-3 rounded-xl hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2 font-body text-sm text-foreground">
                {settings.soundEnabled ? <Music className="w-4 h-4" /> : <Music2 className="w-4 h-4" />}
                Sound effects
              </span>
              <span className={`text-xs font-bold ${settings.soundEnabled ? "text-accent" : "text-muted-foreground"}`}>
                {settings.soundEnabled ? "ON" : "OFF"}
              </span>
            </button>

            <div className="py-2 px-3">
              <label className="flex items-center justify-between text-sm font-body text-foreground mb-1">
                Speech speed
                <span className="text-xs font-bold text-muted-foreground">{settings.speechRate.toFixed(2)}×</span>
              </label>
              <input
                type="range"
                min={0.55}
                max={0.8}
                step={0.05}
                value={settings.speechRate}
                onChange={(e) => update({ speechRate: parseFloat(e.target.value) })}
                className="w-full accent-primary"
                aria-label="Speech speed"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            <button
              onClick={() => replayLast()}
              className="w-full flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-muted transition-colors font-body text-sm text-foreground"
            >
              <Repeat className="w-4 h-4" />
              Replay last audio
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Learning settings"
        className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center border-2 border-card"
      >
        <Settings2 className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default SettingsBar;
