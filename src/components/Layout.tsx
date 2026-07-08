import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Home, BookOpen, Hash, Grid3X3, Gamepad2, Sparkles, Calculator, Shapes, Trophy, Rocket, Menu, X } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home, color: "text-kid-blue" },
  { path: "/alphabets", label: "ABC", icon: BookOpen, color: "text-kid-green" },
  { path: "/numbers", label: "123", icon: Hash, color: "text-kid-orange" },
  { path: "/math", label: "Math", icon: Calculator, color: "text-kid-teal" },
  { path: "/tables", label: "Tables", icon: Grid3X3, color: "text-kid-purple" },
  { path: "/shapes", label: "Shapes", icon: Shapes, color: "text-kid-red" },
  { path: "/playzone", label: "PlayZone", icon: Gamepad2, color: "text-kid-pink" },
  { path: "/solarsystem", label: "Space", icon: Rocket, color: "text-indigo-400" },
  { path: "/rewards", label: "Rewards", icon: Trophy, color: "text-kid-yellow" },
] as const;

const FloatingParticles = () => {
  const emojis = ["⭐", "🌈", "✨", "🎈", "🦋", "🌸", "💫", "🎀"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-20"
          initial={{ x: `${10 + (i * 12) % 80}%`, y: `110%` }}
          animate={{
            y: "-10%",
            x: `${10 + (i * 12) % 80 + Math.sin(i) * 10}%`,
            rotate: [0, 360],
          }}
          transition={{ duration: 15 + i * 3, repeat: Infinity, ease: "linear", delay: i * 2 }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingParticles />

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border shadow-lg md:rounded-b-[2rem]"
      >
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-6 h-6 text-kid-yellow" />
            </motion.div>
            <span className="text-xl md:text-2xl font-display font-bold">
              <span className="text-kid-blue">K</span>
              <span className="text-kid-orange">i</span>
              <span className="text-kid-green">n</span>
              <span className="text-kid-pink">d</span>
              <span className="text-kid-purple">e</span>
              <span className="text-kid-teal">r</span>
              <span className="text-kid-red">K</span>
              <span className="text-kid-yellow">i</span>
              <span className="text-kid-blue">d</span>
              <span className="text-kid-green">s</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl font-display text-base font-semibold transition-colors
                      ${isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? item.color : ""}`} />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Nav Toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden sticky top-[61px] z-40 bg-card border-b border-border shadow-lg overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display text-base font-semibold transition-colors
                      ${isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? item.color : ""}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10"
      >
        {children}
      </motion.main>

      <footer className="relative z-10 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-black">
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-display font-bold text-lg mb-2">
                🎮 
                <span className="text-kid-blue">K</span>
                <span className="text-kid-orange">i</span>
                <span className="text-kid-green">n</span>
                <span className="text-kid-pink">d</span>
                <span className="text-kid-purple">e</span>
                <span className="text-kid-teal">r</span>
                <span className="text-kid-red">K</span>
                <span className="text-kid-yellow">i</span>
                <span className="text-kid-blue">d</span>
                <span className="text-kid-green">s</span>
              </h3>
              <p className="text-black font-body text-sm max-w-[250px] md:max-w-none">
                Making learning fun for little champions everywhere!
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-display font-bold text-black text-lg mb-3">🎯 Games</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {navItems.slice(1).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-black hover:text-primary font-body text-sm transition-colors px-3 py-1.5 bg-muted/50 hover:bg-muted/80 rounded-full"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="font-display font-bold text-black text-lg mb-2">⭐ Features</h3>
              <p className="text-black font-body text-sm max-w-[280px] md:max-w-none">
                Voice assistance • Sound effects • Interactive games • Progress tracking
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border text-center text-black">
            <p className="text-black font-body text-sm">
              Made with ❤️ for little learners • © 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
