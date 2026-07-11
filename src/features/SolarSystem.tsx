import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  PlayCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Lock,
  Unlock,
  Thermometer,
} from "lucide-react";
import { IMG_MAP } from "@/lib/images";
import { SOLAR_SYSTEM, UNLOCKABLES, PlanetData } from "@/lib/solarSystemData";
import { playClick, playPop, playSuccess, playError } from "@/lib/sounds";
import { speak, cancelSpeech, recordAndSpeak, praise } from "@/lib/tts";
import { Link } from "@tanstack/react-router";

const SolarSystem = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [viewedPlanets, setViewedPlanets] = useState<Set<string>>(new Set());
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());
  const [quizPicked, setQuizPicked] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedUnlockable, setSelectedUnlockable] = useState<(typeof UNLOCKABLES)[0] | null>(
    null,
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const x = (e.clientX / clientWidth - 0.5) * 20;
      const y = (e.clientY / clientHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handlePlanetClick = (planet: PlanetData) => {
    playPop();
    cancelSpeech();
    setSelectedPlanet(planet);
    setQuizPicked(null);
    setQuizFeedback(null);
    setViewedPlanets((prev) => new Set(prev).add(planet.id));

    setTimeout(() => {
      document
        .getElementById("planet-details")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 500);
  };

  const handleNext = () => {
    if (!selectedPlanet) return;
    const currentIndex = SOLAR_SYSTEM.findIndex((p) => p.id === selectedPlanet.id);
    if (currentIndex < SOLAR_SYSTEM.length - 1) {
      handlePlanetClick(SOLAR_SYSTEM[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!selectedPlanet) return;
    const currentIndex = SOLAR_SYSTEM.findIndex((p) => p.id === selectedPlanet.id);
    if (currentIndex > 0) {
      handlePlanetClick(SOLAR_SYSTEM[currentIndex - 1]);
    }
  };

  const handleQuizPick = (opt: string) => {
    if (quizFeedback === "correct") return;
    setQuizPicked(opt);
    if (opt === selectedPlanet?.quiz.correct) {
      playSuccess();
      setQuizFeedback("correct");
      if (selectedPlanet) {
        setCompletedQuizzes((prev) => new Set(prev).add(selectedPlanet.id));
      }
      speak(`Correct! ${opt} is the right answer!`, { profile: "girl" });
    } else {
      playError();
      setQuizFeedback("wrong");
      speak("Oops, try again!", { profile: "girl" });
      setTimeout(() => {
        setQuizFeedback((prev) => {
          if (prev === "wrong") {
            setQuizPicked(null);
            return null;
          }
          return prev;
        });
      }, 1500);
    }
  };

  const playName = () => {
    if (!selectedPlanet) return;
    playClick();
    cancelSpeech();
    speak(selectedPlanet.name, { profile: "girl" });
  };

  const allViewed = viewedPlanets.size === SOLAR_SYSTEM.length;
  const allUnlocked = completedQuizzes.size >= UNLOCKABLES.length;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050510] text-white overflow-x-hidden relative font-body selection:bg-indigo-500/30"
    >
      {/* 🌌 Premium Deep Space Background Layer */}
      <div
        className="fixed inset-0 pointer-events-none transition-transform duration-1000 ease-out scale-105 bg-[#020205]"
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
      >
        {/* Realistic Starfield & Milky Way (No giant nebula/globes) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 mix-blend-screen"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2560&auto=format&fit=crop')",
          }}
        />

        {/* Deep background gradient for edge blending and text readability */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#020205_100%)] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020205]/70 via-transparent to-[#020205]" />

        {/* Crisp CSS Starfield (Ensures stars populate the dark corners uniformly) with Realistic Twinkling */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            backgroundPosition: "0 0",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1.5px, transparent 1px)",
            backgroundSize: "130px 130px",
            backgroundPosition: "65px 65px",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.05, 0.3, 0.05] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          style={{
            backgroundImage: "radial-gradient(circle, #a5b4fc 2px, transparent 2px)",
            backgroundSize: "220px 220px",
            backgroundPosition: "110px 110px",
          }}
        />

        {/* Shooting Stars Animation (pure CSS approximation) */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: "120vw", y: "-20vh", opacity: 0 }}
              animate={{
                x: "-20vw",
                y: "100vh",
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 10 + i * 4,
                delay: i * 3,
                ease: "linear",
              }}
              className="absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 blur-[0.5px]"
              style={{ top: `${Math.random() * 50}%`, left: `${Math.random() * 50}%` }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full pt-12 pb-24">
        {/* Header */}
        <div className="text-center mb-16 px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-4 tracking-tight"
          >
            Explore the Solar System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-indigo-200 font-light"
          >
            Discover planets, moons, and amazing space facts!
          </motion.p>
        </div>

        {/* Premium Orbit Timeline Layout */}
        <div className="w-full mb-16 relative overflow-x-auto overflow-y-visible pb-16 pt-8 snap-x scrollbar-thin scrollbar-thumb-indigo-500/30">
          <div className="flex items-center min-w-max px-8 md:px-24 h-64 gap-8 md:gap-16 relative">
            {/* Massive Sun Anchor on the Left */}
            <motion.button
              onClick={() => handlePlanetClick(SOLAR_SYSTEM.find((p) => p.id === "sun")!)}
              className="relative shrink-0 w-64 h-64 md:w-80 md:h-80 -ml-8 md:-ml-12 z-10 flex flex-col items-center justify-center cursor-pointer group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-orange-500/30 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
                <div className="absolute inset-0 bg-yellow-400/20 blur-[50px] rounded-full mix-blend-screen animate-pulse pointer-events-none" />
                
                {selectedPlanet?.id === "sun" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-[-40px] pointer-events-none flex items-center justify-center overflow-visible z-0"
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-tr from-yellow-400 to-orange-600 opacity-40 blur-3xl rounded-full mix-blend-screen animate-pulse"
                    />
                  </motion.div>
                )}

                <motion.img
                  animate={{
                    rotate: selectedPlanet?.id === "sun" ? [0, 360] : 0,
                  }}
                  transition={{
                    rotate: { duration: 180, repeat: Infinity, ease: "linear" },
                  }}
                  src={IMG_MAP["Sun"]}
                  alt="The Sun"
                  className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(255,150,0,0.8)] relative z-10"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.button>

            {/* Planets Timeline */}
            {SOLAR_SYSTEM.filter((p) => p.id !== "sun").map((planet, i) => {
              const isSelected = selectedPlanet?.id === planet.id;

              return (
                <motion.button
                  key={planet.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  onClick={() => handlePlanetClick(planet)}
                  className="flex flex-col items-center justify-center gap-6 snap-center relative group z-10"
                  style={{ width: "180px", overflow: "visible" }} // Crucial: No clipping
                >
                  {/* Planet Image Container */}
                  <div className="w-[180px] h-[180px] flex items-center justify-center relative overflow-visible">
                    {/* Selected State: Orbital Rings & Bloom */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-[-40px] pointer-events-none flex items-center justify-center overflow-visible"
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-tr ${planet.gradient} opacity-40 blur-3xl rounded-full mix-blend-screen animate-pulse`}
                          />

                          {/* Animated Orbital Ring */}
                          <svg
                            className="absolute w-[220px] h-[220px] animate-[spin_10s_linear_infinite] overflow-visible"
                            viewBox="0 0 100 100"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="48"
                              fill="none"
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth="0.5"
                              strokeDasharray="4 4"
                            />
                            <circle
                              cx="50"
                              cy="2"
                              r="2"
                              fill="#fff"
                              className="shadow-[0_0_10px_#fff]"
                            />
                            <circle
                              cx="98"
                              cy="50"
                              r="1.5"
                              fill="#fff"
                              className="shadow-[0_0_10px_#fff]"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Planet Image */}
                    <motion.div
                      animate={{
                        scale: isSelected ? 1.15 : 1,
                        rotate: isSelected ? [0, 360] : 0,
                      }}
                      transition={{
                        scale: { type: "spring", stiffness: 300, damping: 20 },
                        rotate: { duration: 120, repeat: Infinity, ease: "linear" },
                      }}
                      className="w-full h-full flex items-center justify-center overflow-visible"
                    >
                      <img
                        src={IMG_MAP[planet.name]}
                        alt={planet.name}
                        className="max-w-[100%] max-h-[100%] object-contain origin-center transition-all duration-500 ease-out z-10"
                        style={{
                          filter: isSelected
                            ? "drop-shadow(0 0 25px rgba(255,255,255,0.4)) drop-shadow(0 0 50px rgba(255,255,255,0.2))"
                            : "drop-shadow(0 0 10px rgba(0,0,0,0.8))",
                        }}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    </motion.div>
                  </div>

                  {/* Planet Label */}
                  <div className="text-center mt-2 relative z-20">
                    <h3
                      className={`font-display text-2xl font-bold tracking-wide ${planet.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-colors`}
                    >
                      {planet.name}
                    </h3>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Planet Details Panel */}
        <div id="planet-details" className="scroll-mt-24 px-4">
          <AnimatePresence mode="wait">
            {selectedPlanet && (
              <motion.div
                key={selectedPlanet.id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="bg-[#0b0c1a]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] max-w-6xl mx-auto relative overflow-hidden"
              >
                {/* Internal Glow Effect */}
                <div
                  className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl ${selectedPlanet.gradient} opacity-[0.15] blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4 mix-blend-screen`}
                />

                <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start relative z-10">
                  {/* Huge Detail Image - Completely Unclipped */}
                  <div className="w-full lg:w-5/12 flex justify-center shrink-0">
                    <motion.div
                      animate={{ rotate: 360, y: [-10, 10, -10] }}
                      transition={{
                        rotate: { duration: 180, repeat: Infinity, ease: "linear" },
                        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                      }}
                      className="w-72 h-72 md:w-[400px] md:h-[400px] relative flex items-center justify-center overflow-visible"
                    >
                      <img
                        src={IMG_MAP[selectedPlanet.name]}
                        alt={selectedPlanet.name}
                        className="max-w-[100%] max-h-[100%] object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    </motion.div>
                  </div>

                  {/* Info Panel */}
                  <div className="w-full lg:w-7/12 flex flex-col">
                    <div className="flex items-center gap-5 mb-2">
                      <h2
                        className={`text-5xl md:text-7xl font-display font-bold tracking-tight ${selectedPlanet.color} drop-shadow-[0_0_20px_currentColor]`}
                      >
                        {selectedPlanet.name}
                      </h2>
                      <button
                        onClick={playName}
                        className="p-4 bg-white/5 hover:bg-white/15 text-white rounded-full transition-all border border-white/10 hover:border-white/30 shadow-lg"
                      >
                        <Volume2 className="w-7 h-7" />
                      </button>
                    </div>
                    <p className="text-xl text-slate-300 font-light tracking-wide mb-8">
                      {selectedPlanet.subtitle}
                    </p>

                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-8 backdrop-blur-md">
                      <p className="text-xl leading-relaxed text-slate-100 font-light">
                        {selectedPlanet.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-sm md:text-base">
                      {[
                        { label: "Type", val: selectedPlanet.type },
                        { label: "Moons", val: selectedPlanet.moons },
                        { label: "Day Length", val: selectedPlanet.dayLength },
                        { label: "Year Length", val: selectedPlanet.yearLength },
                        {
                          label: "Avg Temp",
                          val: selectedPlanet.avgTemp || "N/A",
                          icon: Thermometer,
                        },
                      ].map((stat, idx) => (
                        <div
                          key={idx}
                          className="bg-[#050510]/50 p-4 rounded-2xl border border-white/5 flex flex-col"
                        >
                          <span className="text-slate-400 font-medium mb-1 flex items-center gap-2">
                            {stat.icon && <stat.icon className="w-4 h-4 text-slate-500" />}
                            {stat.label}
                          </span>
                          <span className="font-bold text-white text-lg tracking-wide">
                            {stat.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-5 rounded-2xl border-l-4 border-amber-400 mb-10 flex items-start gap-4">
                      <Sparkles className="w-7 h-7 text-amber-400 shrink-0" />
                      <div>
                        <h4 className="text-amber-400 font-bold mb-1">Fun Fact</h4>
                        <p className="text-amber-100/90 text-lg">{selectedPlanet.funFact}</p>
                      </div>
                    </div>

                    {/* Premium Quiz Section */}
                    <div className="bg-[#050510]/80 rounded-3xl p-8 border border-indigo-500/20 shadow-inner">
                      <h3 className="text-2xl font-display font-bold text-indigo-300 mb-2">
                        Knowledge Check
                      </h3>
                      <p className="text-xl text-slate-200 mb-6">{selectedPlanet.quiz.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedPlanet.quiz.options.map((opt) => {
                          const isCorrect =
                            quizFeedback === "correct" && opt === selectedPlanet.quiz.correct;
                          const isWrong = quizFeedback === "wrong" && opt === quizPicked;
                          let btnClass =
                            "bg-white/5 hover:bg-white/10 text-slate-200 border-white/10";
                          if (isCorrect)
                            btnClass =
                              "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                          else if (isWrong)
                            btnClass = "bg-rose-500/20 text-rose-300 border-rose-500/50";

                          return (
                            <button
                              key={opt}
                              onClick={() => handleQuizPick(opt)}
                              className={`rounded-2xl p-4 text-lg font-bold transition-all border flex justify-center items-center gap-3 ${btnClass}`}
                            >
                              {isCorrect && <CheckCircle className="w-6 h-6" />}
                              {isWrong && <XCircle className="w-6 h-6" />}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next/Prev Navigation */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                  <button
                    onClick={handlePrev}
                    disabled={selectedPlanet.id === "mercury"}
                    className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-0 rounded-full font-bold transition-all border border-white/10 text-lg"
                  >
                    <ChevronLeft className="w-6 h-6" /> Previous Planet
                  </button>

                  {/* Pagination Dots */}
                  <div className="flex gap-2">
                    {SOLAR_SYSTEM.filter((p) => p.id !== "sun").map((p) => (
                      <div
                        key={p.id}
                        className={`h-2 rounded-full transition-all duration-300 ${selectedPlanet.id === p.id ? "w-8 bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" : "w-2 bg-white/20"}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={selectedPlanet.id === "neptune"}
                    className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-0 rounded-full font-bold transition-all border border-white/10 text-lg"
                  >
                    Next Planet <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Educational Progression - Unlockables */}
        <div className="mt-32 max-w-5xl mx-auto text-center px-4 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-200">
              Space Explorer Progress
            </h2>
            {allUnlocked ? (
              <Unlock className="w-10 h-10 text-emerald-400" />
            ) : (
              <Lock className="w-10 h-10 text-slate-500" />
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {UNLOCKABLES.map((item, index) => {
              const isUnlocked = completedQuizzes.size > index;
              return (
                <button
                  key={item.id}
                  disabled={!isUnlocked}
                  onClick={() => {
                    playClick();
                    setSelectedUnlockable(item);
                    cancelSpeech();
                    speak(`You unlocked ${item.name}! ${item.fact}`, { profile: "girl" });
                  }}
                  className={`p-6 rounded-3xl border backdrop-blur-md w-full text-left ${isUnlocked ? "bg-indigo-900/30 border-indigo-400/30 shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:bg-indigo-800/40 hover:scale-105 cursor-pointer" : "bg-[#050510]/60 border-white/5 cursor-not-allowed"} transition-all duration-700`}
                >
                  <div
                    className={`flex items-center justify-center mb-4 ${isUnlocked ? "opacity-100 scale-110 transition-transform duration-500 ease-out" : "opacity-20 grayscale"}`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-contain drop-shadow-md"
                      />
                    ) : (
                      <div className="text-5xl">{item.emoji}</div>
                    )}
                  </div>
                  <div
                    className={`font-bold text-lg tracking-wide ${isUnlocked ? "text-indigo-200" : "text-slate-600"}`}
                  >
                    {isUnlocked ? item.name : "???"}
                  </div>
                </button>
              );
            })}
          </div>
          {!allUnlocked && (
            <p className="mt-8 text-slate-400 font-medium text-lg">
              Explore {UNLOCKABLES.length - completedQuizzes.size} more planets and answer their
              quizzes to unlock these space secrets!
            </p>
          )}
          {allUnlocked && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-emerald-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            >
              Congratulations! You've unlocked all the mysteries of the universe! 🚀
            </motion.p>
          )}

          {/* Unlockable Detail Modal */}
          <AnimatePresence>
            {selectedUnlockable && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={() => setSelectedUnlockable(null)}
              >
                <motion.div
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 50 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-b from-[#0f113a] to-[#050510] max-w-lg w-full rounded-3xl p-8 border border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.4)] relative flex flex-col items-center text-center"
                >
                  <button
                    onClick={() => {
                      cancelSpeech();
                      setSelectedUnlockable(null);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/20 text-white rounded-full transition-colors"
                  >
                    <XCircle className="w-8 h-8" />
                  </button>

                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex justify-center items-center mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                  >
                    {selectedUnlockable.image ? (
                      <img
                        src={selectedUnlockable.image}
                        alt={selectedUnlockable.name}
                        className="w-48 h-48 object-contain"
                      />
                    ) : (
                      <div className="text-8xl">{selectedUnlockable.emoji}</div>
                    )}
                  </motion.div>

                  <h3 className="text-4xl font-display font-bold text-indigo-300 mb-4 tracking-wide">
                    {selectedUnlockable.name}
                  </h3>

                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-6 w-full">
                    <p className="text-xl text-slate-200 font-light leading-relaxed">
                      {selectedUnlockable.fact}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      cancelSpeech();
                      speak(`You unlocked ${selectedUnlockable.name}! ${selectedUnlockable.fact}`, {
                        profile: "girl",
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 rounded-full font-bold transition-all border border-indigo-500/50"
                  >
                    <Volume2 className="w-6 h-6" />
                    Read Again
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back to PlayZone */}
        <div className="mt-24 text-center pb-12 relative z-10">
          <Link to="/playzone" onClick={playClick}>
            <button className="bg-white/10 text-white hover:bg-white/20 px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all inline-flex items-center gap-3 border border-white/10">
              <ChevronLeft className="w-6 h-6" /> Return to PlayZone
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;
