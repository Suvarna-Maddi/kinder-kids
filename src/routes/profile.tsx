import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../lib/auth-client";
import { motion } from "framer-motion";
import { UserCircle2, Trophy, Star, Sparkles } from "lucide-react";
import { useProgress } from "../lib/progress";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { username, logout } = useAuth();
  const { streakDays, stars } = useProgress();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-kid-blue" />
        </div>
        
        <div className="flex flex-col items-center text-center relative z-10">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-32 h-32 bg-kid-blue/20 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-kid-blue/30"
          >
            <UserCircle2 className="w-20 h-20 text-kid-blue" />
          </motion.div>

          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Welcome, <span className="text-kid-purple">{username || "Champion"}</span>!
          </h1>
          <p className="text-muted-foreground font-body text-lg mb-8">
            This is your personal learning dashboard!
          </p>

          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-kid-orange/10 border border-kid-orange/20 rounded-2xl p-4 flex flex-col items-center">
              <Star className="w-8 h-8 text-kid-orange mb-2" />
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Score</span>
              <span className="text-3xl font-display font-bold text-kid-orange">{stars}</span>
            </div>
            
            <div className="bg-kid-red/10 border border-kid-red/20 rounded-2xl p-4 flex flex-col items-center">
              <Trophy className="w-8 h-8 text-kid-red mb-2" />
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Day Streak</span>
              <span className="text-3xl font-display font-bold text-kid-red">{streakDays} 🔥</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="w-full py-4 rounded-xl bg-kid-green text-white font-bold text-lg shadow-lg hover:bg-kid-green/90 transition-colors mb-4"
          >
            Let's Play Some Games!
          </motion.button>
          
          <button
            onClick={logout}
            className="text-muted-foreground hover:text-kid-red transition-colors font-bold font-body underline"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
