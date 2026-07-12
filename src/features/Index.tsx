import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Play, Star, BookOpen, Trophy, Heart, ChevronLeft, ChevronRight, CheckCircle2, Gamepad2, Unlock, Sparkles, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero_magical_book.png";
import storyImg from "@/assets/story_castle_dragon.png";
import parchmentImg from "@/assets/parchment_wide.png";
import abcImg from "@/assets/books.png";
import numbersImg from "@/assets/numbers.png";
import tablesImg from "@/assets/slate.png";
import brainImg from "@/assets/brain.png";
import spaceImg from "@/assets/rocket.png";
import { playClick } from "@/lib/sounds";

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

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] font-display text-[#1E293B] mb-6">
            Beyond Books,<br/>
            Beyond <br/>
            <span className="text-[#F43F5E]">Stars!</span>
          </h1>

          <p className="text-lg text-[#475569] font-medium leading-relaxed max-w-md mb-8">
            Step into magical worlds filled with stories, games and discoveries where every click begins a new adventure.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link to="/signup">
              <button onClick={playClick} className="bg-[#6366F1] text-white px-8 py-4 rounded-full font-bold shadow-[0_8px_20px_rgba(99,102,241,0.4)] flex items-center gap-2 hover:-translate-y-1 transition-all">
                Start Your Adventure 🚀
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-white shadow-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs">👦</div>
              <div className="w-8 h-8 rounded-full bg-pink-200 border-2 border-white flex items-center justify-center text-xs">👧</div>
              <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white flex items-center justify-center text-xs">👶</div>
            </div>
            <div className="text-sm font-semibold">
              <span className="text-gray-600">Trusted by </span>
              <span className="text-[#1E293B] font-extrabold">10,000+</span> 
              <br/><span className="text-gray-500 text-xs">Happy Learners ❤️</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 relative mt-16 md:mt-0 flex justify-center">
          <img 
            src={heroImg} 
            alt="Magical Book Adventure" 
            className="w-full max-w-[600px] h-auto object-contain drop-shadow-lg relative z-10" 
            style={{ 
              maskImage: 'radial-gradient(circle at center, black 55%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 75%)'
            }}
          />
        </div>
      </section>

      {/* 2. STORY ABOUT KINDERKIDS */}
      <section id="about" className="px-6 md:px-16 pb-20 -mt-24 md:-mt-64 max-w-[1400px] mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Left: Dragon Image */}
          <div className="w-full md:w-1/2 p-4 mt-16 md:mt-64">
            <img 
              src={storyImg} 
              alt="Dragon Story" 
              className="w-full h-auto shadow-[0_20px_50px_rgba(0,0,0,0.15)] object-cover" 
              style={{ borderRadius: '100px 30px 100px 30px' }} 
            />
          </div>

          {/* Right: Parchment Paper Style Card */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center bg-[#FCF9EE]">
            {/* The Parchment Background Image - Normal height now that text is short */}
            <img src={parchmentImg} alt="Parchment" className="w-full h-[800px] md:h-[950px] block object-fill mix-blend-multiply" />
            
            {/* The Text Overlay Safe Area */}
            <div className="absolute top-[28%] bottom-[28%] left-[18%] right-[18%] flex flex-col justify-center items-center text-center overflow-y-auto scrollbar-hide">
              
              <h2 className="text-2xl md:text-4xl font-display font-extrabold text-[#1E293B] mb-3 md:mb-6 shrink-0">
                The <span className="text-[#F43F5E]">Kinder</span><span className="text-[#6366F1]">Kids</span> Story
              </h2>

              <p className="text-gray-800 mb-6 md:mb-8 font-bold text-sm md:text-lg shrink-0 leading-relaxed max-w-[90%]">
                Where learning feels like play, and every child is the hero of their own magical adventure! ✨
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6 md:mb-10 text-xs md:text-base shrink-0 w-full px-4">
                <div className="flex items-center gap-2 text-gray-800 font-bold"><span className="text-lg md:text-2xl">🗝️</span> Unlock Worlds</div>
                <div className="flex items-center gap-2 text-gray-800 font-bold"><span className="text-lg md:text-2xl">🔍</span> Solve Mysteries</div>
                <div className="flex items-center gap-2 text-gray-800 font-bold"><span className="text-lg md:text-2xl">⭐</span> Collect Stars</div>
                <div className="flex items-center gap-2 text-gray-800 font-bold"><span className="text-lg md:text-2xl">🏆</span> Win Trophies</div>
              </div>

              {/* 4 Bottom Circles */}
              <div className="flex justify-between items-center bg-white/60 px-4 md:px-8 py-3 rounded-full border border-[#FEF3C7] w-[95%] shrink-0">
                <div className="flex flex-col items-center gap-1"><div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center shadow-inner"><Star className="w-4 h-4 md:w-5 md:h-5 text-blue-500 fill-current" /></div><span className="text-[10px] md:text-xs font-bold text-gray-700">Explore</span></div>
                <div className="flex flex-col items-center gap-1"><div className="w-8 h-8 md:w-10 md:h-10 bg-pink-100 rounded-full flex items-center justify-center shadow-inner"><BookOpen className="w-4 h-4 md:w-5 md:h-5 text-pink-500 fill-current" /></div><span className="text-[10px] md:text-xs font-bold text-gray-700">Learn</span></div>
                <div className="flex flex-col items-center gap-1"><div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center shadow-inner"><Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" /></div><span className="text-[10px] md:text-xs font-bold text-gray-700">Achieve</span></div>
                <div className="flex flex-col items-center gap-1"><div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center shadow-inner"><Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-current" /></div><span className="text-[10px] md:text-xs font-bold text-gray-700">Grow</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MORE TO EXPLORE (5 Cards) */}
      <section id="stories" className="px-6 py-20 max-w-[1400px] mx-auto text-center relative">
        <h2 className="text-4xl font-display font-extrabold text-[#1E293B] mb-2 flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400" /> More To Explore <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="text-gray-500 font-medium mb-12">Every story opens a new world of discovery!</p>

        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-8 snap-x scrollbar-hide px-4">
          
          {/* Card 1: ABC World */}
          <div className="min-w-[260px] max-w-[260px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col snap-center hover:shadow-md transition-all">
            <div className="w-full h-40 bg-gradient-to-b from-red-100 to-orange-100 rounded-2xl mb-4 flex items-center justify-center p-4">
              <img src={abcImg} alt="ABC World" className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-[#1E293B] mb-2 text-lg">ABC World</h3>
            <p className="text-xs text-gray-500 mb-4 h-10">Master the alphabet with fun, interactive letter games!</p>
            <Link to="/alphabets" className="w-full">
              <button className="w-full bg-[#7C3AED] text-white py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#6D28D9] transition-colors">Play Now ⭐</button>
            </Link>
          </div>

          {/* Card 2: Numbers */}
          <div className="min-w-[260px] max-w-[260px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col snap-center hover:shadow-md transition-all">
            <div className="w-full h-40 bg-gradient-to-b from-blue-100 to-cyan-100 rounded-2xl mb-4 flex items-center justify-center p-4">
              <img src={numbersImg} alt="Numbers" className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-[#1E293B] mb-2 text-lg">Numbers</h3>
            <p className="text-xs text-gray-500 mb-4 h-10">Count, trace, and play with magical numbers!</p>
            <Link to="/numbers" className="w-full">
              <button className="w-full bg-[#7C3AED] text-white py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#6D28D9] transition-colors">Play Now ⭐</button>
            </Link>
          </div>

          {/* Card 3: Tables */}
          <div className="min-w-[260px] max-w-[260px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col snap-center hover:shadow-md transition-all">
            <div className="w-full h-40 bg-gradient-to-b from-green-100 to-emerald-100 rounded-2xl mb-4 flex items-center justify-center p-4">
              <img src={tablesImg} alt="Tables" className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-[#1E293B] mb-2 text-lg">Tables</h3>
            <p className="text-xs text-gray-500 mb-4 h-10">Learn math tables the fun and easy way.</p>
            <Link to="/tables" className="w-full">
              <button className="w-full bg-[#7C3AED] text-white py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#6D28D9] transition-colors">Play Now ⭐</button>
            </Link>
          </div>

          {/* Card 4: Brain Games */}
          <div className="min-w-[260px] max-w-[260px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col snap-center hover:shadow-md transition-all">
            <div className="w-full h-40 bg-gradient-to-b from-yellow-100 to-orange-100 rounded-2xl mb-4 flex items-center justify-center p-4">
              <img src={brainImg} alt="Brain Games" className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-[#1E293B] mb-2 text-lg">Brain Games</h3>
            <p className="text-xs text-gray-500 mb-4 h-10">Boost your memory with amazing matching puzzles!</p>
            <Link to="/playzone" className="w-full">
              <button className="w-full bg-[#7C3AED] text-white py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#6D28D9] transition-colors">Play Now ⭐</button>
            </Link>
          </div>

          {/* Card 5: Space Exploration */}
          <div className="min-w-[260px] max-w-[260px] bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col snap-center hover:shadow-md transition-all">
            <div className="w-full h-40 bg-gradient-to-b from-purple-100 to-indigo-100 rounded-2xl mb-4 flex items-center justify-center p-4">
              <img src={spaceImg} alt="Space Exploration" className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-[#1E293B] mb-2 text-lg">Space Exploration</h3>
            <p className="text-xs text-gray-500 mb-4 h-10">Travel through galaxies and discover our solar system.</p>
            <button className="w-full bg-[#7C3AED] text-white py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#6D28D9] transition-colors">Explore ⭐</button>
          </div>

        </div>
      </section>

      {/* 4. YOUR LEARNING JOURNEY (Timeline) */}
      <section id="features" className="px-6 py-20 max-w-[1200px] mx-auto text-center">
        <h2 className="text-4xl font-display font-extrabold text-[#1E293B] mb-2 flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-yellow-400" /> Your Learning Journey <Sparkles className="w-6 h-6 text-yellow-400" />
        </h2>
        <p className="text-gray-500 font-medium mb-16">Every step brings you closer to becoming a champion!</p>

        <div className="flex flex-col md:flex-row items-center justify-between relative px-4 md:px-0 gap-8 md:gap-0">
          {/* Dashed line (desktop) */}
          <div className="hidden md:block absolute top-10 left-10 right-10 border-t-2 border-dashed border-gray-300 z-0"></div>

          {[
            { id: 1, icon: BookOpen, label: "Choose Adventure", color: "bg-blue-100 text-blue-500" },
            { id: 2, icon: BookOpen, label: "Read Story", color: "bg-purple-100 text-purple-500" },
            { id: 3, icon: Gamepad2, label: "Play Activities", color: "bg-indigo-100 text-indigo-500" },
            { id: 4, icon: CheckCircle2, label: "Complete Challenges", color: "bg-green-100 text-green-500" },
            { id: 5, icon: Star, label: "Earn Stars", color: "bg-yellow-100 text-yellow-500" },
            { id: 6, icon: Unlock, label: "Unlock Next World", color: "bg-pink-100 text-pink-500" },
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center z-10 w-32">
              <div className={`w-20 h-20 rounded-full ${step.color} border-4 border-white shadow-md flex items-center justify-center mb-4 relative`}>
                <step.icon className="w-8 h-8 fill-current opacity-80" />
                <div className="absolute -bottom-3 bg-[#6366F1] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">{step.id}</div>
              </div>
              <p className="font-bold text-[#1E293B] text-sm leading-tight">{step.label}</p>
            </div>
          ))}
        </div>
      </section>



      {/* 6. BOTTOM BANNER & STATS */}
      <section id="contact" className="mt-10 relative">
        {/* Wavy Top Divider SVG */}
        <div className="w-full overflow-hidden leading-none z-10 relative -mb-1">
          <svg className="block w-full h-16 md:h-24 text-[#6366F1] fill-current" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0H1200V0Z"></path>
          </svg>
        </div>

        <div className="bg-[#6366F1] pt-12 pb-20 px-6 relative overflow-hidden flex flex-col items-center text-center">
          {/* Decorative background elements (moon, stars) */}
          <div className="absolute top-10 right-20 text-6xl opacity-80">🌙</div>
          <div className="absolute top-20 left-20 text-4xl opacity-80 text-yellow-300">⭐</div>
          <div className="absolute bottom-0 right-0 text-9xl opacity-50">🏰</div>
          <div className="absolute bottom-10 left-10 text-8xl opacity-50">📚</div>

          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4 relative z-10">
            Ready To Start <br/>
            Your <span className="text-yellow-300">Story?</span>
          </h2>
          <p className="text-indigo-100 font-medium mb-10 max-w-sm relative z-10">
            Choose your adventure and begin your magical learning journey today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/signup">
              <button onClick={playClick} className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-yellow-300">
                ⭐ Start Learning
              </button>
            </Link>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-gray-50">
              📚 Explore Stories
            </button>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-gray-50">
              👥 Meet Friends
            </button>
          </div>
        </div>

        {/* White Stats Bar at Bottom */}
        <div className="bg-white py-6 border-t border-gray-100 flex flex-wrap justify-center md:justify-evenly items-center gap-8 px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl">😊</div>
            <div className="text-left"><p className="font-extrabold text-[#1E293B] leading-none">10,000+</p><p className="text-xs text-gray-500">Happy Learners</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">📖</div>
            <div className="text-left"><p className="font-extrabold text-[#1E293B] leading-none">500+</p><p className="text-xs text-gray-500">Stories & Activities</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">🌍</div>
            <div className="text-left"><p className="font-extrabold text-[#1E293B] leading-none">50+</p><p className="text-xs text-gray-500">Exciting Worlds</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">🛡️</div>
            <div className="text-left"><p className="font-extrabold text-[#1E293B] leading-none">100%</p><p className="text-xs text-gray-500">Safe & Ad-Free</p></div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
