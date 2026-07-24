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
  Crown,
} from "lucide-react";
import { PremiumPopup } from "./PremiumPopup";
import { SubscriptionModal } from "./SubscriptionModal";
import { useAuth } from "../lib/auth-client";
import logo from "@/assets/logo.png";
import avatarBoy from "@/assets/avatar_boy.png";
import avatarGirl from "@/assets/avatar_girl.png";

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
  const emojis = ["⭐", "🌈", "✨", "🎈", "🦋", "💫", "🎀"];
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
  const { isAuthenticated, username, gender, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const getAvatar = () => {
    if (gender === "girl") return avatarGirl;
    return avatarBoy;
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (pathname !== "/") return;
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Protect routes globally inside Layout
  useEffect(() => {
    if (!isLoading) {
      const publicPaths = ["/", "/login", "/signup"];

      // If user is NOT logged in and tries to access a game, kick to login
      if (!isAuthenticated && !publicPaths.includes(pathname)) {
        navigate({ to: "/login", replace: true });
      }

      // If user IS logged in and tries to access login/signup, kick to profile
      if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
        navigate({ to: "/profile", replace: true });
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
    ? navItems.filter((item) => item.path !== "/signup") // Hide signup when logged in
    : navItems.filter((item) => item.path === "/" || item.path === "/signup"); // Only show home and signup for guests

  return (
    <div className="min-h-screen bg-background relative">
      <PremiumPopup />
      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen} 
        onClose={() => setIsSubscriptionModalOpen(false)} 
      />

      {pathname !== "/dashboard" && (
        <motion.nav
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sticky top-0 lg:top-4 z-50 backdrop-blur-xl bg-card/80 border-b lg:border lg:rounded-full lg:mx-4 shadow-lg transition-all"
        >
          <div className="w-full mx-auto px-2 lg:px-4 py-2 flex items-center justify-between">
            <Link to="/" preload="intent" className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <img
                  src={logo}
                  alt="KinderKidsSpace Logo"
                  width="48"
                  height="48"
                  loading="lazy"
                  className="h-10 md:h-12 w-auto object-contain scale-125 origin-left"
                />
              </motion.div>
              <span className="font-display font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight bg-[linear-gradient(to_right,#F43F5E,#F97316,#EAB308,#22C55E,#3B82F6,#8B5CF6,#D946EF)] bg-clip-text text-transparent drop-shadow-sm">
                KinderKidsSpace
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 md:gap-2">
              {!isAuthenticated ? (
                // Landing Page Specific Navigation Links
                <>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="font-bold text-sm text-[#6366F1] border-b-2 border-[#6366F1] pb-1 hover:cursor-pointer"
                  >
                    Home
                  </button>
                  <a
                    href="#about"
                    onClick={(e) => handleScroll(e, "about")}
                    className="font-bold text-sm text-[#1E293B] hover:text-[#6366F1] transition-colors cursor-pointer"
                  >
                    About Us
                  </a>
                  <a
                    href="#stories"
                    onClick={(e) => handleScroll(e, "stories")}
                    className="font-bold text-sm text-[#1E293B] hover:text-[#6366F1] transition-colors cursor-pointer"
                  >
                    Stories
                  </a>
                  <a
                    href="#features"
                    onClick={(e) => handleScroll(e, "features")}
                    className="font-bold text-sm text-[#1E293B] hover:text-[#6366F1] transition-colors cursor-pointer"
                  >
                    Features
                  </a>
                  <a
                    href="#contact"
                    onClick={(e) => handleScroll(e, "contact")}
                    className="font-bold text-sm text-[#1E293B] hover:text-[#6366F1] transition-colors cursor-pointer"
                  >
                    Contact
                  </a>
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
                        className={`flex items-center gap-1 px-1.5 md:px-2 py-1.5 rounded-xl font-display text-xs md:text-sm font-semibold transition-colors
                        ${
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? item.color : ""}`}
                        />
                        <span className="hidden sm:inline">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })
              )}

              {/* Login / Logout Button */}
              {!isAuthenticated ? (
                <Link to="/login" preload="intent" className="ml-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#6366F1] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 hover:bg-[#4F46E5] transition-colors"
                  >
                    Log In ⭐
                  </motion.div>
                </Link>
              ) : (
                <div className="flex items-center gap-2 ml-2 relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 hover:from-amber-400/30 hover:to-yellow-500/30 border border-amber-400/30 rounded-full transition-colors group"
                  >
                    <Crown className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="font-display font-bold text-xs text-amber-600 dark:text-amber-400 hidden sm:inline">
                      Premium
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1 bg-kid-blue/10 hover:bg-kid-blue/20 transition-colors border border-kid-blue/20 rounded-full cursor-pointer focus:outline-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden border border-kid-blue/20">
                      <img
                        src={getAvatar()}
                        alt="User Profile Avatar"
                        width="32"
                        height="32"
                        loading="lazy"
                        className="w-[120%] h-[120%] object-cover pt-1"
                      />
                    </div>
                    <span className="font-display font-bold text-sm text-foreground">
                      {username || "Kid"}
                    </span>
                  </motion.button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted font-display text-sm text-foreground transition-colors"
                      >
                        <UserCircle2 className="w-4 h-4 text-kid-blue" />
                        View Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted font-display text-sm text-foreground transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-kid-red" />
                        Log Out
                      </button>
                    </div>
                  )}
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
                        setIsMobileMenuOpen(false);
                        setIsSubscriptionModalOpen(true);
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-muted rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <Crown className="w-6 h-6 text-amber-500" />
                      <span className="font-display font-bold text-lg text-amber-600 dark:text-amber-400">
                        Premium Subscription
                      </span>
                    </button>
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
      )}

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

      {pathname !== "/dashboard" && (
        <footer className="relative z-10 border-t border-border bg-card/80 backdrop-blur-md mt-10">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-12">
              {/* Brand & Description */}
              <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                <Link to="/" preload="intent" className="flex items-center gap-2 mb-4">
                  <img
                    src={logo}
                    alt="KinderKidsSpace Logo"
                    className="h-20 lg:h-28 w-auto object-contain scale-125 lg:scale-150 origin-center lg:origin-left"
                  />
                </Link>
                <p className="text-muted-foreground font-body text-sm max-w-xs px-4 lg:px-0">
                  Making learning fun, interactive, and engaging for little champions everywhere!
                </p>
              </div>

              {/* Quick Links */}
              <div className="col-span-1 flex flex-col items-start text-left pl-2 md:pl-8 lg:pl-0">
                <h3 className="font-display font-bold text-foreground text-lg mb-4 flex items-center gap-2">
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
              <div className="col-span-1 flex flex-col items-start text-left pl-2 md:pl-8 lg:pl-0">
                <h3 className="font-display font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                  🎯 More Games
                </h3>
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
              <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left mt-4 lg:mt-0">
                <h3 className="font-display font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                  ⭐ Features
                </h3>
                <ul className="flex flex-col gap-3 text-muted-foreground font-body text-sm">
                  <li className="flex items-center justify-start gap-2">
                    <Volume2 className="w-4 h-4 text-kid-blue" /> Voice assistance
                  </li>
                  <li className="flex items-center justify-start gap-2">
                    <Music className="w-4 h-4 text-kid-pink" /> Sound effects
                  </li>
                  <li className="flex items-center justify-start gap-2">
                    <Gamepad2 className="w-4 h-4 text-kid-green" /> Interactive games
                  </li>
                  <li className="flex items-center justify-start gap-2">
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
      )}
    </div>
  );
};

export default Layout;
