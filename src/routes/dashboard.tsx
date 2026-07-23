import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../lib/auth-client";
import { 
  Bell, ChevronDown, Flame, Star, Coins, Medal, Play, Sparkles, X, Trophy, Rocket
} from "lucide-react";
import { useProgress } from "../lib/progress";
import { BADGES } from "../features/Rewards";
import logo from "@/assets/logo.png";
import readingBear from "@/assets/d_bear.png";
import letterM from "@/assets/letter_m.png";
import rewardChest from "@/assets/reward_chest.png";
import avatarBoy from "@/assets/avatar_boy.png";
import avatarGirl from "@/assets/avatar_girl.png";

// 3D Generated Assets
import imgHome from "@/assets/d_home.png";
import imgRewards from "@/assets/d_gift.png";
import imgAbc from "@/assets/d_abc.png";
import img123 from "@/assets/d_123.png";
import imgTelugu from "@/assets/d_telugu.png";
import imgMath from "@/assets/d_tables.png";
import imgTables from "@/assets/d_calci.png";
import imgShapes from "@/assets/d_shapes.png";
import imgSpace from "@/assets/d_rocket.png";
import imgPlayzone from "@/assets/d_controller.png";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => {
    const canonicalUrl = "https://Suvarna-Maddi.github.io/kinder-kids/dashboard";
    
    return {
      meta: [
        { title: "Dashboard | KinderKidsSpace" },
        { name: "description", content: "Track your learning progress, view achievements, and continue your educational journey." },
        { property: "og:title", content: "Dashboard | KinderKidsSpace" },
        { property: "og:description", content: "Track your learning progress, view achievements, and continue your educational journey." },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
        { name: "robots", content: "noindex, nofollow" }
      ],
      links: [
        { rel: "canonical", href: canonicalUrl }
      ]
    };
  },
});

const SIDEBAR_ITEMS = [
  { id: "home", label: "Home", image: imgHome, scale: "scale-[1.6]", path: "/dashboard", color: "text-[#6B7280]", bgColor: "bg-[#E5E7EB]" },
  { id: "abc", label: "ABC", image: imgAbc, scale: "scale-[1.6]", path: "/alphabets", color: "text-[#D97706]", bgColor: "bg-[#FEF3C7]" },
  { id: "numbers", label: "123", image: img123, scale: "scale-[1.6]", path: "/numbers", color: "text-[#65A30D]", bgColor: "bg-[#ECFCCB]" },
  { id: "telugu", label: "తెలుగు", image: imgTelugu, scale: "scale-[1.0]", path: "/telugu", color: "text-[#0284C7]", bgColor: "bg-[#E0F2FE]" },
  { id: "math", label: "Math", image: imgMath, scale: "scale-[1.6]", path: "/math", color: "text-[#E11D48]", bgColor: "bg-[#FFE4E6]" },
  { id: "tables", label: "Tables", image: imgTables, scale: "scale-[1.6]", path: "/tables", color: "text-[#2563EB]", bgColor: "bg-[#DBEAFE]" },
  { id: "shapes", label: "Shapes", image: imgShapes, scale: "scale-[1.6]", path: "/shapes", color: "text-[#EA580C]", bgColor: "bg-[#FFEDD5]" },
  { id: "space", label: "Space", image: imgSpace, scale: "scale-[1.6]", path: "/solarsystem", color: "text-[#7C3AED]", bgColor: "bg-[#EDE9FE]" },
  { id: "playzone", label: "PlayZone", image: imgPlayzone, scale: "scale-[1.6]", path: "/playzone", color: "text-[#0D9488]", bgColor: "bg-[#CCFBF1]" },
  { id: "rewards", label: "Rewards", image: imgRewards, scale: "scale-[1.6]", path: "/rewards", color: "text-[#D97706]", bgColor: "bg-[#FEF3C7]" },
];

const ACTIVITIES = [
  { id: "abc", label: "ABC", image: imgAbc, scale: "scale-[1.4]", path: "/alphabets", color: "text-[#65A30D]", bg: "bg-[#ECFCCB]" },
  { id: "numbers", label: "123", image: img123, scale: "scale-[1.4]", path: "/numbers", color: "text-[#D97706]", bg: "bg-[#FEF3C7]" },
  { id: "telugu", label: "తెలుగు", image: imgTelugu, scale: "scale-[1.1]", path: "/telugu", color: "text-[#7C3AED]", bg: "bg-[#EDE9FE]" },
  { id: "math", label: "Math", image: imgMath, scale: "scale-[1.4]", path: "/math", color: "text-[#E11D48]", bg: "bg-[#FFE4E6]" },
  { id: "tables", label: "Tables", image: imgTables, scale: "scale-[1.4]", path: "/tables", color: "text-[#2563EB]", bg: "bg-[#DBEAFE]" },
  { id: "shapes", label: "Shapes", image: imgShapes, scale: "scale-[1.4]", path: "/shapes", color: "text-[#EA580C]", bg: "bg-[#FFEDD5]" },
  { id: "space", label: "Space", image: imgSpace, scale: "scale-[1.4]", path: "/solarsystem", color: "text-[#9333EA]", bg: "bg-[#F3E8FF]" },
  { id: "playzone", label: "PlayZone", image: imgPlayzone, scale: "scale-[1.4]", path: "/playzone", color: "text-[#059669]", bg: "bg-[#D1FAE5]" },
];

function Dashboard() {
  const { isAuthenticated, username, gender, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const progress = useProgress();
  const [activeItem, setActiveItem] = useState("home");
  const [showMoreMobile, setShowMoreMobile] = useState(false);

  const getAvatar = () => {
    if (gender === 'girl') return avatarGirl;
    return avatarBoy;
  };

  // Colors
  const mainBg = "bg-[#F5EFE4]";
  const cardBg = "bg-[#FFF9F0]";
  const sidebarBg = "bg-[#F2E8D8]";
  const borderColor = "border-[#EADCC6]";

  const abcProgress = Math.min(100, Math.round(((progress?.lettersLearned || []).length / 26) * 100));
  const numbersProgress = Math.min(100, Math.round(((progress?.numbersLearned || []).length / 20) * 100));
  const tablesProgress = Math.min(100, Math.round(((progress?.tablesCompleted || []).length / 10) * 100));
  const playzoneProgress = Math.min(100, Math.round(((progress?.gamesCompleted || 0) / 10) * 100));
  const overallProgress = Math.round((abcProgress + numbersProgress + tablesProgress + playzoneProgress) / 4);

  const mappedActivities = ACTIVITIES.map(act => {
    let pct = 0;
    if (act.id === 'abc') pct = abcProgress;
    if (act.id === 'numbers') pct = numbersProgress;
    if (act.id === 'tables') pct = tablesProgress;
    if (act.id === 'playzone') pct = playzoneProgress;
    return { ...act, progress: pct };
  });

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const nextLetter = ALPHABET.find(l => !(progress?.lettersLearned || []).includes(l));
  
  const continueActivity = nextLetter ? {
    title: `Alphabet - Letter ${nextLetter}`,
    desc: "You are doing great!",
    link: "/alphabets",
    image: imgAbc,
    percent: abcProgress
  } : {
    title: "PlayZone",
    desc: "Have some fun!",
    link: "/playzone",
    image: imgPlayzone,
    percent: playzoneProgress
  };

  const dailyQuests = [
    { icon: imgAbc, title: "Learn 3 letters", cur: Math.min(3, (progress?.lettersLearned || []).length), max: 3, reward: 10 },
    { icon: Star, color: "text-[#F59E0B]", bg: "bg-[#FEF3C7]", title: "Earn 20 stars", cur: Math.min(20, progress?.stars || 0), max: 20, reward: 15 },
    { icon: imgMath, title: "Finish one quiz", cur: Math.min(1, progress?.attempts || 0), max: 1, reward: 10 },
    { icon: imgPlayzone, title: "Play 2 games in PlayZone", cur: Math.min(2, progress?.gamesCompleted || 0), max: 2, reward: 15 }
  ];

  const earnedBadges = useMemo(() => {
    return (BADGES || []).filter(b => (progress?.badges || []).includes(b.slug));
  }, [progress?.badges]);

  if (isLoading) {
    return <div className={`min-h-screen ${mainBg} flex items-center justify-center`}>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${mainBg} font-display text-[#374151] flex flex-col md:flex-row relative overflow-hidden`}>
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`hidden md:flex flex-col items-center py-8 w-[110px] ${sidebarBg} border-r ${borderColor} fixed h-full z-40`}>
        <div className="mb-6 cursor-pointer hover:scale-105 transition-transform mt-2" onClick={() => navigate({ to: '/' })}>
          <img src={logo} alt="Logo" className="w-24 h-24 object-contain scale-[1.3]" />
        </div>
        
        <div className="flex-1 flex flex-col gap-[28px] overflow-y-auto no-scrollbar w-full items-center py-4">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <Link 
                key={item.id} 
                to={item.path}
                className="flex flex-col items-center group relative w-full"
                onClick={() => setActiveItem(item.id)}
              >
                <motion.div 
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`relative flex flex-col items-center justify-center w-[68px] h-[68px] rounded-[24px] transition-all duration-300
                    ${isActive ? 'bg-[#D1FAE5] shadow-lg shadow-[#D1FAE5]/50' : 'bg-transparent hover:bg-white/50'}
                  `}
                >
                  {isActive && (
                    <motion.div layoutId="activePill" className="absolute inset-0 bg-[#A7F3D0] rounded-[24px] -z-10" />
                  )}
                  {/* Blending the image directly onto the sidebar item background */}
                  <div className="w-12 h-12 mb-0.5">
                    <img src={item.image} alt={item.label} className={`w-full h-full object-contain mix-blend-multiply drop-shadow-sm ${item.scale}`} />
                  </div>
                  <span className={`text-[11px] font-bold ${isActive ? 'text-[#059669]' : 'text-[#6B7280]'}`}>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className={`md:hidden fixed bottom-0 w-full ${sidebarBg} border-t ${borderColor} z-50 pb-safe pt-2 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[32px]`}>
        <div className="flex justify-between items-center w-full">
          {SIDEBAR_ITEMS.slice(0, 4).map((item) => (
            <Link key={item.id} to={item.path} className="flex flex-col items-center p-2" onClick={() => setActiveItem(item.id)}>
              <div className="w-9 h-9 mb-1">
                 <img src={item.image} alt={item.label} className={`w-full h-full object-contain mix-blend-multiply ${item.scale}`} />
              </div>
              <span className={`text-[10px] font-bold ${activeItem === item.id ? 'text-[#059669]' : 'text-[#6B7280]'}`}>{item.label}</span>
            </Link>
          ))}
          <button className="flex flex-col items-center p-2" onClick={() => setShowMoreMobile(!showMoreMobile)}>
            <div className={`w-7 h-7 mb-1 flex items-center justify-center ${showMoreMobile ? 'text-[#059669]' : 'text-[#6B7280]'}`}>
              {showMoreMobile ? <X className="w-6 h-6" /> : <div className="flex gap-0.5"><div className="w-1.5 h-1.5 rounded-full bg-current"/><div className="w-1.5 h-1.5 rounded-full bg-current"/><div className="w-1.5 h-1.5 rounded-full bg-current"/></div>}
            </div>
            <span className={`text-[10px] font-bold ${showMoreMobile ? 'text-[#059669]' : 'text-[#6B7280]'}`}>More</span>
          </button>
        </div>
      </div>
      
      {/* MOBILE MORE MENU */}
      <AnimatePresence>
        {showMoreMobile && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`md:hidden fixed bottom-[70px] left-4 right-4 ${cardBg} border ${borderColor} rounded-[32px] shadow-xl z-40 p-4 grid grid-cols-4 gap-4 pb-6`}
          >
            {SIDEBAR_ITEMS.slice(4).map((item) => (
              <Link key={item.id} to={item.path} className="flex flex-col items-center p-2" onClick={() => { setActiveItem(item.id); setShowMoreMobile(false); }}>
                <div className={`w-14 h-14 rounded-[20px] ${item.bgColor} flex items-center justify-center mb-2 overflow-hidden`}>
                  <img src={item.image} alt={item.label} className={`w-12 h-12 object-contain mix-blend-multiply ${item.scale}`} />
                </div>
                <span className="text-[10px] font-bold text-center text-[#6B7280]">{item.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-[110px] w-full min-h-screen pb-24 md:pb-8 relative">
        
        {/* HEADER */}
        <header className="h-[80px] sticky top-0 z-30 flex items-center justify-between px-6 lg:px-12 backdrop-blur-md bg-[#F5EFE4]/80">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#EADCC6] hover:scale-105 transition-transform">
              <Bell className="w-5 h-5 text-[#6B7280]" />
            </button>
            <Link to="/profile" className="flex items-center gap-2 bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm border border-[#EADCC6] cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#F5EFE4] flex items-center justify-center overflow-hidden border border-[#EADCC6]">
                <img src={getAvatar()} alt="Profile" className="w-[120%] h-[120%] object-cover pt-1" />
              </div>
              <span className="font-bold text-sm text-[#374151]">{username || 'Guest'}</span>
              <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
            </Link>
          </div>
        </header>

        <div className="px-4 md:px-6 lg:px-12 max-w-[1300px] mx-auto flex flex-col gap-8 pb-10">
          
          {/* WELCOME HERO CARD */}
          <div className={`${cardBg} rounded-[32px] border ${borderColor} p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:gap-12 relative overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]`}>
            
            {/* Left Content */}
            <div className="flex-1 z-10 flex flex-col justify-center">
              <h2 className="text-[#65A30D] font-bold text-xl md:text-2xl mb-1">Good Morning,</h2>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#374151] mb-2 flex items-center gap-2">
                {username || 'Champion'}! <span className="animate-wiggle origin-bottom-right inline-block">👋</span>
              </h1>
              <p className="text-[#6B7280] font-semibold text-lg md:text-xl flex items-center gap-2 mb-8">
                You're doing amazing today! <HeartIcon />
              </p>
              
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-[24px] border border-[#EADCC6] inline-block max-w-[320px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[#374151]">Daily Goal Progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 bg-[#E5E7EB] rounded-full flex-1 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-[#84CC16] rounded-full"
                    />
                  </div>
                  <span className="font-bold text-[#374151]">{overallProgress}%</span>
                  <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
                </div>
              </div>
            </div>

            {/* Center Mascot (Absolute or flex depending on screen) */}
            <div className="hidden md:flex absolute lg:relative right-12 lg:right-auto bottom-0 lg:bottom-auto lg:flex-1 justify-center items-end lg:items-center h-full z-0 pointer-events-none opacity-20 lg:opacity-100">
              <motion.img 
                src={readingBear} 
                alt="Reading Bear" 
                className="w-auto h-[200px] lg:h-[380px] object-contain drop-shadow-xl mix-blend-multiply scale-110 lg:scale-125 origin-bottom translate-y-[50px]" 
              />
            </div>
            
            {/* Right Stats Panel */}
            <div className="flex flex-row lg:flex-col gap-3 lg:gap-4 z-10 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {[
                { icon: Flame, color: "text-[#EF4444]", label: "Day Streak", val: (progress?.streakDays || 0).toString(), bg: "bg-[#FEE2E2]" },
                { icon: Star, color: "text-[#F59E0B]", label: "Stars", val: (progress?.stars || 0).toString(), bg: "bg-[#FEF3C7]" },
                { icon: Coins, color: "text-[#EAB308]", label: "Coins", val: (progress?.coins || 0).toString(), bg: "bg-[#FEF08A]" },
                { icon: Medal, color: "text-[#8B5CF6]", label: "Explorer", val: `Level ${progress?.level || 1}`, bg: "bg-[#EDE9FE]" }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-[24px] p-3 md:p-4 flex items-center gap-3 min-w-[140px] shadow-sm border border-[#EADCC6]">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.bg} flex items-center justify-center shrink-0`}>
                    <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color} ${stat.icon === Star ? 'fill-current' : ''}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[#374151] text-base md:text-lg leading-tight">{stat.val}</span>
                    <span className="font-bold text-[#6B7280] text-[10px] md:text-xs leading-tight">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVITY GRID */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              Explore Activities <span className="text-[#84CC16]">🌿</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {mappedActivities.map((activity) => (
                <Link key={activity.id} to={activity.path}>
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`${activity.bg} rounded-[32px] p-6 border ${borderColor} shadow-sm hover:shadow-xl transition-all cursor-pointer h-[240px] flex flex-col justify-between overflow-hidden`}
                  >
                    <div className="flex-1 flex items-center justify-center relative -mt-4">
                       {/* Activity specific 3D icon blended onto background */}
                       <img 
                          src={activity.image} 
                          alt={activity.label} 
                          className={`w-48 h-48 object-contain mix-blend-multiply drop-shadow-md ${activity.scale}`}
                       />
                    </div>
                    
                    <div className="z-10">
                      <h4 className="font-bold text-xl text-[#374151] mb-2">{activity.label}</h4>
                      <div className="flex items-center gap-3">
                        <div className="h-2 bg-white/60 rounded-full flex-1 overflow-hidden">
                           <div className={`h-full rounded-full`} style={{ width: `${activity.progress}%`, backgroundColor: activity.color.replace('text-[', '').replace(']', '') }} />
                        </div>
                        <span className="font-bold text-xs text-[#6B7280]">{activity.progress}%</span>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                          <ArrowRightIcon />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* TWO COLUMNS: CONTINUE LEARNING & DAILY QUESTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Continue Learning */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                 Continue Learning
              </h3>
              <div className={`${cardBg} rounded-[32px] border ${borderColor} p-6 flex items-center justify-between shadow-sm relative overflow-hidden h-full min-h-[220px]`}>
                <div className="z-10 flex flex-col h-full justify-between max-w-[60%]">
                  <div>
                    <h4 className="font-extrabold text-[#374151] text-xl md:text-2xl mb-1">{continueActivity.title}</h4>
                    <p className="text-[#6B7280] font-semibold text-sm">{continueActivity.desc}</p>
                  </div>
                  
                  <div className="mt-4 mb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="h-2 bg-[#E5E7EB] rounded-full flex-1 max-w-[120px] overflow-hidden">
                        <div className="h-full bg-[#65A30D] rounded-full" style={{ width: `${continueActivity.percent}%` }} />
                      </div>
                      <span className="font-bold text-sm text-[#374151]">{continueActivity.percent}%</span>
                    </div>
                  </div>

                  <Link to={continueActivity.link}>
                    <button className="bg-[#65A30D] text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 w-fit hover:bg-[#4D7C0F] transition-colors shadow-md">
                      Continue <Play className="w-4 h-4 fill-current" />
                    </button>
                  </Link>
                </div>
                
                <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 md:w-64 md:h-64 z-0 pointer-events-none">
                  <motion.img 
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    src={continueActivity.image} alt="Activity Image" className="w-full h-full object-contain mix-blend-multiply" 
                  />
                </div>
              </div>
            </div>

            {/* Daily Quests */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TargetIcon /> Daily Quests
              </h3>
              <div className={`${cardBg} rounded-[32px] border ${borderColor} p-6 flex flex-col justify-between shadow-sm h-full`}>
                <div className="flex flex-col gap-3">
                  {dailyQuests.map((quest, i) => (
                    <div key={i} className={`flex items-center justify-between pb-3 border-b border-[#EADCC6]/50 last:border-0 last:pb-0 ${quest.cur >= quest.max ? 'opacity-50 grayscale' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center overflow-hidden`}>
                          {typeof quest.icon === 'string' ? (
                            <img src={quest.icon} className="w-6 h-6 object-contain mix-blend-multiply" />
                          ) : (
                            <quest.icon className={`w-4 h-4 ${quest.color} ${quest.icon === Star ? 'fill-current' : ''}`} />
                          )}
                        </div>
                        <span className="font-bold text-sm text-[#374151]">{quest.title}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-sm text-[#6B7280]">{quest.cur}/{quest.max}</span>
                        <div className="flex items-center gap-1 min-w-[40px] justify-end">
                          <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                          <span className="font-bold text-sm text-[#374151]">{quest.reward}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#EADCC6] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#6B7280] mb-1">Complete all missions to earn</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-[#FEF08A] px-2 py-1 rounded-full">
                        <Coins className="w-4 h-4 text-[#D97706]" />
                        <span className="font-bold text-xs text-[#92400E]">50 Coins</span>
                      </div>
                      <span className="text-[#9CA3AF]">+</span>
                      <div className="flex items-center gap-1 bg-[#FEF3C7] px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-[#D97706] fill-current" />
                        <span className="font-bold text-xs text-[#92400E]">10 Stars</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-16">
                     <img src={rewardChest} alt="Mini Chest" className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM SECTION: ACHIEVEMENTS & REWARDS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mt-2">
            
            {/* Achievements */}
            <div className="xl:col-span-2 flex flex-col gap-4">
               <h3 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#F59E0B]" /> Your Achievements
               </h3>
               <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar min-h-[140px]">
                  {earnedBadges.length === 0 ? (
                    <div className={`${cardBg} rounded-[24px] border ${borderColor} p-6 w-full flex flex-col items-center justify-center text-center shadow-sm`}>
                      <span className="text-4xl mb-2">🏅</span>
                      <h4 className="font-bold text-sm text-[#374151]">No achievements yet!</h4>
                      <p className="text-xs font-semibold text-[#6B7280]">Keep learning to unlock your first badge.</p>
                    </div>
                  ) : earnedBadges.map((ach, i) => (
                    <div key={i} className={`${cardBg} rounded-[24px] border ${borderColor} p-4 min-w-[150px] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow`}>
                      <div className={`w-16 h-16 rounded-[16px] bg-[#ECFCCB] flex items-center justify-center mb-3 relative overflow-hidden`}>
                        <span className="text-3xl">{ach.emoji}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#374151] mb-1">{ach.label}</h4>
                      <p className="text-[10px] font-semibold text-[#9CA3AF]">Earned</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Rewards Chest */}
            <div className="flex flex-col gap-4">
               <h3 className="text-xl font-bold opacity-0 hidden xl:block">Spacer</h3>
               <Link to="/rewards">
                 <motion.div 
                   whileHover={{ scale: 1.02 }}
                   className={`${cardBg} rounded-[32px] border ${borderColor} p-6 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-all h-full min-h-[160px]`}
                 >
                   <div>
                     <h4 className="font-extrabold text-[#374151] text-lg mb-1">Rewards Chest</h4>
                     <p className="text-xs font-semibold text-[#6B7280] max-w-[120px] mb-4">Open your chest and see your rewards!</p>
                     <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#6B7280]">
                        <ArrowRightIcon />
                     </div>
                   </div>
                   <div className="w-32 h-32 relative">
                     <motion.img 
                       animate={{ rotate: [-2, 2, -2], y: [-2, 2, -2] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                       src={rewardChest} alt="Rewards" className="w-full h-full object-contain drop-shadow-xl mix-blend-multiply" 
                     />
                     <Sparkles className="absolute top-0 right-0 w-5 h-5 text-[#F59E0B] animate-pulse" />
                     <Sparkles className="absolute bottom-4 left-0 w-4 h-4 text-[#F59E0B] animate-pulse delay-75" />
                   </div>
                 </motion.div>
               </Link>
            </div>

          </div>
          
        </div>
      </main>
    </div>
  );
}

// Small helper icons
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);
