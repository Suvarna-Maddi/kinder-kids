import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";
import {
  Home,
  BookOpen,
  Hash,
  Grid3X3,
  Gamepad2,
  Sparkles,
  Calculator,
  Shapes,
  Trophy,
  Rocket,
  Languages,
  Volume2,
  Music,
  Menu,
  X,
  UserPlus,
  LogIn,
  LogOut,
  UserCircle2,
  Heart,
} from "lucide-react";
import { PremiumPopup } from "./PremiumPopup";
import { useAuth } from "../lib/auth-client";

const navItems = [
  { path: "/", label: "Home", icon: Home, color: "text-kid-blue" },
  { path: "/alphabets", label: "ABC", icon: BookOpen, color: "text-kid-green" },
  { path: "/numbers", label: "123", icon: Hash, color: "text-kid-orange" },
  { path: "/telugu", label: "తెలుగు", icon: Languages, color: "text-kid-blue" },
  { path: "/math", label: "Math", icon: Calculator, color: "text-kid-teal" },
  { path: "/tables", label: "Tables", icon: Grid3X3, color: "text-kid-purple" },
  { path: "/shapes", label: "Shapes", icon: Shapes, color: "text-kid-red" },
  { path: "/solarsystem", label: "Space", icon: Rocket, color: "text-indigo-400" },
  { path: "/playzone", label: "PlayZone", icon: Gamepad2, color: "text-kid-pink" },
  { path: "/rewards", label: "Rewards", icon: Trophy, color: "text-kid-yellow" },
  { path: "/signup", label: "Sign Up", icon: UserPlus, color: "text-kid-purple" },
] as const;

const FloatingParticles = () => {
  const emojis = ["⭐", "🌈", "✨", "🎈", "🦋", "🌸", "💫", "🎀"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-20"
          initial={{ x: `${10 + ((i * 12) % 80)}%`, y: `110%` }}
          animate={{
            y: "-10%",
            x: `${10 + ((i * 12) % 80) + Math.sin(i) * 10}%`,
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
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, username, isLoading, logout } = useAuth();
  
  // Protect routes globally inside Layout
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ['/', '/login', '/signup'];
      
      // If user is NOT logged in and tries to access a game, kick to login
      if (!isAuthenticated && !publicPaths.includes(pathname)) {
        navigate({ to: '/login', replace: true });
      }
      
      // If user IS logged in and tries to access login/signup, kick to profile
      if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
        navigate({ to: '/profile', replace: true });
      }
    }
  }, [isLoading, isAuthenticated, pathname, navigate]);

  // Prevent flash of incorrect content while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
           <span className="text-2xl font-display font-bold">
              <span className="text-kid-blue">L</span>
              <span className="text-kid-orange">o</span>
              <span className="text-kid-green">a</span>
              <span className="text-kid-pink">d</span>
              <span className="text-kid-purple">i</span>
              <span className="text-kid-teal">n</span>
              <span className="text-kid-red">g</span>
              <span className="text-kid-yellow">.</span>
              <span className="text-kid-blue">.</span>
              <span className="text-kid-green">.</span>
            </span>
        </div>
      </div>
    );
  }

  // Conditionally render nav items based on authentication
  const displayNavItems = isAuthenticated 
    ? navItems.filter(item => item.path !== "/signup") // Hide signup when logged in
    : navItems.filter(item => item.path === "/" || item.path === "/signup"); // Only show home and signup for guests

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingParticles />
      <PremiumPopup />

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 lg:top-4 z-50 backdrop-blur-xl bg-card/80 border-b lg:border lg:rounded-full lg:mx-4 shadow-lg transition-all"
      >
        <div className="w-full mx-auto px-4 lg:px-6 py-2 flex items-center justify-between">
          <Link to="/" preload="intent" className="flex items-center gap-2 pl-2 lg:pl-4">
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
              <span className="text-indigo-500">S</span>
              <span className="text-pink-500">p</span>
              <span className="text-teal-500">a</span>
              <span className="text-orange-500">c</span>
              <span className="text-blue-500">e</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 md:gap-2">
            {pathname === '/' ? (
              // Landing Page Specific Navigation Links
              <>
                <Link to="/" className="flex items-center gap-2 px-4 py-2 text-[#7C3AED] bg-[#7C3AED]/10 rounded-full font-bold text-sm">
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link to="/playzone" className="flex items-center gap-2 px-4 py-2 text-[#475569] hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
                  <Gamepad2 className="w-4 h-4" /> Games
                </Link>
                <Link to="/alphabets" className="flex items-center gap-2 px-4 py-2 text-[#475569] hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
                  <BookOpen className="w-4 h-4" /> Learning
                </Link>
                <Link to="/" className="flex items-center gap-2 px-4 py-2 text-[#475569] hover:bg-gray-100 rounded-full font-bold text-sm transition-colors">
                  <Heart className="w-4 h-4" /> About Us
                </Link>
              </>
            ) : (
              // Standard App Navigation Links
              displayNavItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} preload="intent">
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1 px-2 md:px-3 py-2 rounded-xl font-display text-sm md:text-base font-semibold transition-colors
                        ${
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? item.color : ""}`} />
                      <span className="hidden sm:inline">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })
            )}
            
            {/* Login / Logout Button */}
            {pathname === '/' && !isAuthenticated ? (
              <Link to="/signup" preload="intent" className="ml-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#7C3AED] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 hover:bg-[#6D28D9] transition-colors"
                >
                  Start Learning <Rocket className="w-4 h-4" />
                </motion.div>
              </Link>
            ) : (
              <div className="flex items-center gap-1 md:gap-2 ml-2">
                <Link to="/profile" preload="intent">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-kid-blue/10 hover:bg-kid-blue/20 transition-colors border border-kid-blue/20 rounded-full cursor-pointer"
                  >
                    <UserCircle2 className="w-5 h-5 text-kid-blue" />
                    <span className="font-display font-bold text-sm text-foreground">
                      {username || "Kid"}
                    </span>
                  </motion.div>
                </Link>
                <button onClick={() => { logout(); }} className="focus:outline-none">
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-2 md:px-3 py-2 rounded-xl font-display text-sm md:text-base font-semibold transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <LogOut className="w-4 h-4 text-kid-red" />
                    <span className="hidden sm:inline">Log Out</span>
                  </motion.div>
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-foreground focus:outline-none transition-transform active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1 p-4">
              {displayNavItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    preload="intent"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display text-base font-semibold transition-colors
                      ${
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? item.color : ""}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  preload="intent"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display text-base font-semibold transition-colors
                    ${
                      pathname === "/login"
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <LogIn className={`w-5 h-5 ${pathname === "/login" ? "text-kid-blue" : ""}`} />
                  <span>Log In</span>
                </Link>
              ) : (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                  <Link
                    to="/profile"
                    preload="intent"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-muted rounded-xl transition-colors cursor-pointer"
                  >
                    <UserCircle2 className="w-6 h-6 text-kid-blue" />
                    <span className="font-display font-bold text-lg text-foreground">
                      {username || "Kid"}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-display text-base font-semibold transition-colors text-muted-foreground hover:text-foreground hover:bg-muted w-full text-left"
                  >
                    <LogOut className="w-5 h-5 text-kid-red" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="relative z-10"
      >
        {children}
      </motion.main>

      <footer className="relative z-10 border-t border-border bg-card/80 backdrop-blur-md mt-10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand & Description */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Link to="/" preload="intent" className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-kid-yellow" />
                <span className="text-2xl font-display font-bold">
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
                  <span className="text-indigo-500">S</span>
                  <span className="text-pink-500">p</span>
                  <span className="text-teal-500">a</span>
                  <span className="text-orange-500">c</span>
                  <span className="text-blue-500">e</span>
                </span>
              </Link>
              <p className="text-muted-foreground font-body text-sm max-w-xs">
                Making learning fun, interactive, and engaging for little champions everywhere!
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-display font-bold text-foreground text-lg mb-4">
                🚀 Quick Links
              </h3>
              <div className="flex flex-col gap-3">
                {navItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-muted-foreground hover:text-primary font-body text-sm transition-colors flex items-center gap-2 group"
                  >
                    <item.icon
                      className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`}
                    />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* More Games */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-display font-bold text-foreground text-lg mb-4">🎯 More Games</h3>
              <div className="flex flex-col gap-3">
                {navItems.slice(5).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-muted-foreground hover:text-primary font-body text-sm transition-colors flex items-center gap-2 group"
                  >
                    <item.icon
                      className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`}
                    />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-display font-bold text-foreground text-lg mb-4">⭐ Features</h3>
              <ul className="flex flex-col gap-3 text-muted-foreground font-body text-sm">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Volume2 className="w-4 h-4 text-kid-blue" /> Voice assistance
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Music className="w-4 h-4 text-kid-pink" /> Sound effects
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Gamepad2 className="w-4 h-4 text-kid-green" /> Interactive games
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Trophy className="w-4 h-4 text-kid-yellow" /> Progress tracking
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground font-body text-sm text-center md:text-left">
              © 2026 KinderKidsSpace. All rights reserved.
            </p>
            <p className="text-muted-foreground font-body text-sm text-center md:text-right flex items-center gap-1">
              Made with <span className="text-kid-red">❤️</span> for little learners
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
