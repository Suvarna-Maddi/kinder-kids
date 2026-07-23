import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Play,
  Star,
  BookOpen,
  Trophy,
  Heart,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Gamepad2,
  Unlock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import heroImg from "@/assets/hero_magical_book.png";
import storyImg from "@/assets/story_castle_dragon.png";
import parchmentImg from "@/assets/parchment_wide.png";
import abcImg from "@/assets/books.png";
import numbersImg from "@/assets/numbers.png";
import tablesImg from "@/assets/slate.png";
import brainImg from "@/assets/brain.png";
import spaceImg from "@/assets/rocket.png";
import teluguImg from "@/assets/amma.png";
import mathImg from "@/assets/notebook.png";
import shapesImg from "@/assets/hexagon.png";
import rewardsImg from "@/assets/star.png";
import { playClick } from "@/lib/sounds";

const exploreCards = [
  {
    id: "abc",
    title: "ABC World",
    desc: "Master the alphabet with fun, interactive letter games!",
    img: abcImg,
    link: "/alphabets",
    btn: "Play Now ⭐",
    bg: "from-red-100 to-orange-100",
  },
  {
    id: "num",
    title: "Numbers",
    desc: "Count, trace, and play with magical numbers!",
    img: numbersImg,
    link: "/numbers",
    btn: "Play Now ⭐",
    bg: "from-blue-100 to-cyan-100",
  },
  {
    id: "telugu",
    title: "తెలుగు",
    desc: "Learn Telugu letters and words through play!",
    img: teluguImg,
    link: "/telugu",
    btn: "Play Now ⭐",
    bg: "from-orange-100 to-amber-100",
  },
  {
    id: "math",
    title: "Math",
    desc: "Solve puzzles and master basic math concepts.",
    img: mathImg,
    link: "/math",
    btn: "Play Now ⭐",
    bg: "from-indigo-100 to-purple-100",
  },
  {
    id: "tables",
    title: "Tables",
    desc: "Learn math tables the fun and easy way.",
    img: tablesImg,
    link: "/tables",
    btn: "Play Now ⭐",
    bg: "from-green-100 to-emerald-100",
  },
  {
    id: "shapes",
    title: "Shapes",
    desc: "Discover shapes and colors all around you.",
    img: shapesImg,
    link: "/shapes",
    btn: "Play Now ⭐",
    bg: "from-pink-100 to-rose-100",
  },
  {
    id: "space",
    title: "Space Exploration",
    desc: "Travel through galaxies and discover our solar system.",
    img: spaceImg,
    link: "/solarsystem",
    btn: "Explore ⭐",
    bg: "from-purple-100 to-indigo-100",
  },
  {
    id: "brain",
    title: "Brain Games",
    desc: "Boost your memory with amazing matching puzzles!",
    img: brainImg,
    link: "/playzone",
    btn: "Play Now ⭐",
    bg: "from-yellow-100 to-orange-100",
  },
  {
    id: "rewards",
    title: "Rewards",
    desc: "Check your trophies, stars, and achievements!",
    img: rewardsImg,
    link: "/rewards",
    btn: "Explore ⭐",
    bg: "from-yellow-100 to-amber-200",
  },
];

const Index = () => {
  return (
    <div className="bg-[#FCF9EE] min-h-screen font-body text-[#1E293B] overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative px-6 md:px-16 pt-12 pb-24 max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between min-h-[90vh]">
        {/* Soft Background Clouds (CSS) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E0E7FF]/50 to-transparent -z-10"></div>
        {/* Massive Blue Gradient on the Right Side */}
        <div className="absolute top-0 right-0 w-full md:w-[60%] h-full bg-gradient-to-l from-blue-200 via-blue-100/50 to-transparent -z-10 blur-xl"></div>

        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start z-10">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2 mb-6 text-sm font-bold text-gray-600">
            <span className="text-yellow-400">⚡</span> Smart Learning, Endless Adventures
          </div>

          <div className="flex items-center justify-between w-full gap-2 mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] font-display text-[#1E293B] flex-1">
              Beyond Books,
              <br />
              Beyond <br />
              <span className="text-[#F43F5E]">Stars!</span>
            </h1>
            <img
              src={heroImg}
              alt="Magical Book Adventure"
              width="192"
              height="192"
              loading="lazy"
              className="w-36 sm:w-48 h-auto object-contain drop-shadow-lg md:hidden"
              style={{
                maskImage: "radial-gradient(circle at center, black 60%, transparent 80%)",
                WebkitMaskImage: "radial-gradient(circle at center, black 60%, transparent 80%)",
              }}
            />
          </div>

          <p className="text-lg text-[#475569] font-medium leading-relaxed max-w-md mb-8">
            Step into magical worlds filled with stories, games and discoveries where every click
            begins a new adventure.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link to="/alphabets">
              <button
                onClick={playClick}
                className="bg-[#6366F1] text-white px-8 py-4 rounded-full font-bold shadow-[0_8px_20px_rgba(99,102,241,0.4)] flex items-center gap-2 hover:-translate-y-1 transition-all"
              >
                Start Your Adventure 🚀
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-white shadow-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs">
                👦
              </div>
              <div className="w-8 h-8 rounded-full bg-pink-200 border-2 border-white flex items-center justify-center text-xs">
                👧
              </div>
              <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white flex items-center justify-center text-xs">
                👶
              </div>
            </div>
            <div className="text-sm font-semibold">
              <span className="text-gray-600">Trusted by </span>
              <span className="text-[#1E293B] font-extrabold">10,000+</span>
              <br />
              <span className="text-gray-500 text-xs">Happy Learners ❤️</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden md:flex w-full md:w-1/2 relative mt-16 md:mt-0 justify-center">
          <img
            src={heroImg}
            alt="Magical Book Adventure Desktop"
            width="600"
            height="600"
            loading="lazy"
            className="w-full max-w-[600px] h-auto object-contain drop-shadow-lg relative z-10"
            style={{
              maskImage: "radial-gradient(circle at center, black 55%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 55%, transparent 75%)",
            }}
          />
        </div>
      </section>

      {/* 2. STORY ABOUT KINDERKIDS */}
      <section
        id="about"
        className="px-6 md:px-16 pb-20 -mt-24 md:-mt-64 max-w-[1400px] mx-auto relative z-20"
      >
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Left: Dragon Image */}
          <div className="hidden md:block w-full md:w-1/2 p-4 mt-16 md:mt-64">
            <img
              src={storyImg}
              alt="Dragon Story Educational Reading"
              width="700"
              height="500"
              loading="lazy"
              className="w-full h-auto shadow-[0_20px_50px_rgba(0,0,0,0.15)] object-cover"
              style={{ borderRadius: "100px 30px 100px 30px" }}
            />
          </div>

          {/* Right: Parchment Paper Style Card */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center bg-[#FCF9EE]">
            {/* The Parchment Background Image - Normal height now that text is short */}
            <img
              src={parchmentImg}
              alt="Parchment Background for Text"
              width="700"
              height="950"
              loading="lazy"
              className="w-full h-[550px] md:h-[950px] block object-fill mix-blend-multiply"
            />

            {/* The Text Overlay Safe Area */}
            <div className="absolute top-[18%] md:top-[28%] bottom-[15%] md:bottom-[28%] left-[18%] right-[18%] flex flex-col justify-center items-center text-center overflow-y-auto scrollbar-hide">
              <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#1E293B] mb-3 md:mb-6 shrink-0">
                The <span className="text-[#F43F5E]">Kinder</span>
                <span className="text-[#6366F1]">Kids</span> Story
              </h2>

              <p className="text-gray-800 mb-6 md:mb-8 font-bold text-sm md:text-lg shrink-0 leading-relaxed max-w-[90%]">
                Once upon a time, there was a magical place where learning felt like play, and every
                child became the hero of their own adventure! ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MORE TO EXPLORE (5 Cards) */}
      <section id="stories" className="px-6 py-20 max-w-[1400px] mx-auto text-center relative">
        <h2 className="text-4xl font-display font-extrabold text-[#1E293B] mb-2 flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400" /> More To Explore{" "}
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="text-gray-500 font-medium mb-12">
          Every story opens a new world of discovery!
        </p>

        <div className="overflow-hidden w-full relative pb-8">
          <div className="flex items-center gap-4 animate-marquee w-max px-4 hover:[animation-play-state:paused]">
            {/* First Set of Cards */}
            <div className="flex gap-4">
              {exploreCards.map((card, idx) => (
                <div
                  key={`set1-${card.id}-${idx}`}
                  className="min-w-[260px] max-w-[260px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all"
                >
                  <div
                    className={`w-full h-40 bg-gradient-to-b ${card.bg} rounded-2xl mb-4 flex items-center justify-center p-4`}
                  >
                    <img
                      src={card.img}
                      alt={card.title}
                      width="128"
                      height="128"
                      loading="lazy"
                      className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="font-bold text-[#1E293B] mb-2 text-lg">{card.title}</h3>
                  <p className="text-xs text-gray-500 mb-4 h-10">{card.desc}</p>
                  <Link to={card.link} className="w-full">
                    <button className="w-full bg-[#7C3AED] text-white py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#6D28D9] transition-colors">
                      {card.btn}
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Second Set of Cards (Duplicated for Marquee) */}
            <div className="flex gap-4">
              {exploreCards.map((card, idx) => (
                <div
                  key={`set2-${card.id}-${idx}`}
                  className="min-w-[260px] max-w-[260px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-all"
                >
                  <div
                    className={`w-full h-40 bg-gradient-to-b ${card.bg} rounded-2xl mb-4 flex items-center justify-center p-4`}
                  >
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="font-bold text-[#1E293B] mb-2 text-lg">{card.title}</h3>
                  <p className="text-xs text-gray-500 mb-4 h-10">{card.desc}</p>
                  <Link to={card.link} className="w-full">
                    <button className="w-full bg-[#7C3AED] text-white py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#6D28D9] transition-colors">
                      {card.btn}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. YOUR LEARNING JOURNEY (Curvy Path Timeline) */}
      <section
        id="features"
        className="px-6 py-20 max-w-[1200px] mx-auto text-center overflow-hidden"
      >
        <h2 className="text-4xl font-display font-extrabold text-[#1E293B] mb-2 flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400" /> Your Learning Journey{" "}
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="text-gray-500 font-medium mb-16 md:mb-24">
          Every step brings you closer to becoming a champion!
        </p>

        <div className="relative max-w-5xl mx-auto px-4 md:px-0">
          <style>{`
            @keyframes lightningStrike {
              0% { stroke-dashoffset: 1000; opacity: 0; }
              10% { opacity: 1; }
              80% { opacity: 1; }
              100% { stroke-dashoffset: 0; opacity: 0; }
            }
            .lightning-bolt {
              stroke-dasharray: 200 800;
              animation: lightningStrike 2s ease-in-out infinite;
              filter: drop-shadow(0 0 8px rgba(250, 204, 21, 1));
            }
          `}</style>

          {/* Desktop Lightning SVG (Horizontal) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-48 z-0 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
              {/* Base faint lightning path */}
              <path
                d="M 0,100 L 120,40 L 280,160 L 440,40 L 600,160 L 760,40 L 920,160 L 1000,100"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated lightning bolt */}
              <path
                d="M 0,100 L 120,40 L 280,160 L 440,40 L 600,160 L 760,40 L 920,160 L 1000,100"
                fill="none"
                stroke="#FACC15"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lightning-bolt"
              />
            </svg>
          </div>

          {/* Mobile Lightning SVG (Vertical) */}
          <div className="md:hidden absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-48 z-0 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 200 1000" preserveAspectRatio="none">
              {/* Base faint lightning path */}
              <path
                d="M 100,0 L 40,150 L 160,300 L 40,450 L 160,600 L 40,750 L 160,900 L 100,1000"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated lightning bolt */}
              <path
                d="M 100,0 L 40,150 L 160,300 L 40,450 L 160,600 L 40,750 L 160,900 L 100,1000"
                fill="none"
                stroke="#FACC15"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lightning-bolt"
              />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-16 md:gap-4 py-8">
            {[
              {
                id: 1,
                icon: BookOpen,
                label: "Choose Adventure",
                color: "text-blue-500",
                bg: "bg-blue-100",
                border: "border-blue-300",
              },
              {
                id: 2,
                icon: BookOpen,
                label: "Read Story",
                color: "text-purple-500",
                bg: "bg-purple-100",
                border: "border-purple-300",
              },
              {
                id: 3,
                icon: Gamepad2,
                label: "Play Activities",
                color: "text-indigo-500",
                bg: "bg-indigo-100",
                border: "border-indigo-300",
              },
              {
                id: 4,
                icon: CheckCircle2,
                label: "Complete Challenges",
                color: "text-green-500",
                bg: "bg-green-100",
                border: "border-green-300",
              },
              {
                id: 5,
                icon: Star,
                label: "Earn Stars",
                color: "text-yellow-500",
                bg: "bg-yellow-100",
                border: "border-yellow-300",
              },
              {
                id: 6,
                icon: Unlock,
                label: "Unlock Worlds",
                color: "text-pink-500",
                bg: "bg-pink-100",
                border: "border-pink-300",
              },
            ].map((step, idx) => {
              const isEven = idx % 2 === 0;
              const desktopOffset = isEven ? "md:-translate-y-12" : "md:translate-y-12";
              const mobileOffset = isEven ? "-translate-x-12" : "translate-x-12";

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center w-36 transition-all duration-500 hover:scale-110 ${desktopOffset} ${mobileOffset} md:translate-x-0`}
                >
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border-4 ${step.border} shadow-xl flex items-center justify-center mb-4 relative z-10`}
                  >
                    <div
                      className={`absolute inset-2 rounded-full ${step.bg} flex items-center justify-center opacity-60`}
                    ></div>
                    <step.icon
                      className={`w-8 h-8 md:w-10 md:h-10 ${step.color} fill-current relative z-10`}
                    />

                    {/* Badge */}
                    <div className="absolute -bottom-3 bg-[#1E293B] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold border-2 border-white shadow-md">
                      {step.id}
                    </div>
                  </div>
                  <p className="font-extrabold text-[#1E293B] text-sm md:text-base leading-tight bg-white/90 px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM BANNER & STATS */}
      <section id="contact" className="mt-20 relative px-6">
        <div className="bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#EC4899] pt-16 pb-16 px-6 relative overflow-hidden flex flex-col items-center text-center max-w-5xl mx-auto rounded-[3rem] md:rounded-[6rem] shadow-2xl mb-20 border-8 border-white/30">
          {/* Subtle animated background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60"></div>

          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6 relative z-10 drop-shadow-md">
            Ready To Start <br />
            Your <span className="text-yellow-300">Story?</span>
          </h2>
          <p className="text-white/90 font-medium mb-10 max-w-md relative z-10 text-lg">
            Choose your adventure and begin your magical learning journey today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/signup">
              <button
                onClick={playClick}
                className="bg-yellow-400 text-gray-900 px-10 py-5 rounded-full font-black text-xl flex items-center gap-3 shadow-[0_0_40px_rgba(250,204,21,0.6)] hover:shadow-[0_0_60px_rgba(250,204,21,0.8)] hover:bg-yellow-300 transition-all hover:scale-105 transform"
              >
                ⭐ Start Learning Now
              </button>
            </Link>
          </div>
        </div>

        {/* White Stats Bar at Bottom */}
        <div className="bg-white py-6 border-t border-gray-100 flex flex-wrap justify-center md:justify-evenly items-center gap-8 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
              😊
            </div>
            <div className="text-left">
              <p className="font-extrabold text-[#1E293B] leading-none">10,000+</p>
              <p className="text-xs text-gray-500">Happy Learners</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">
              📖
            </div>
            <div className="text-left">
              <p className="font-extrabold text-[#1E293B] leading-none">500+</p>
              <p className="text-xs text-gray-500">Stories & Activities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              🌍
            </div>
            <div className="text-left">
              <p className="font-extrabold text-[#1E293B] leading-none">50+</p>
              <p className="text-xs text-gray-500">Exciting Worlds</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
              🛡️
            </div>
            <div className="text-left">
              <p className="font-extrabold text-[#1E293B] leading-none">100%</p>
              <p className="text-xs text-gray-500">Safe & Ad-Free</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
