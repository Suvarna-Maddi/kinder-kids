import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Play, Heart, BookOpen, Star, Trophy, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero_magical_book.png";
import storyImg from "@/assets/story_castle_dragon.png";
import { playClick } from "@/lib/sounds";

const adventureCards = [
  {
    title: "The Rainbow Treasure",
    desc: "Mia and Max find a magical treasure at the end of the rainbow.",
    bgColor: "bg-[#FFF0F4]",
    textColor: "text-[#D946EF]",
    icon: "🌈",
    delay: 0.1
  },
  {
    title: "Journey to the Stars",
    desc: "Join Tim on his space adventure to explore new planets.",
    bgColor: "bg-[#FFF6ED]",
    textColor: "text-[#EA580C]",
    icon: "🚀",
    delay: 0.2
  },
  {
    title: "Leo the Brave Lion",
    desc: "A brave little lion who learns the power of kindness.",
    bgColor: "bg-[#F0FDF4]",
    textColor: "text-[#16A34A]",
    icon: "🦁",
    delay: 0.3
  },
  {
    title: "Tilly the Ocean Explorer",
    desc: "Dive into the ocean and discover amazing sea creatures.",
    bgColor: "bg-[#F0F9FF]",
    textColor: "text-[#0284C7]",
    icon: "🐢",
    delay: 0.4
  },
  {
    title: "Zara's Science Lab",
    desc: "Fun experiments and cool facts with Zara!",
    bgColor: "bg-[#F5F3FF]",
    textColor: "text-[#7C3AED]",
    icon: "🔬",
    delay: 0.5
  },
];

const Index = () => {
  return (
    <div className="bg-[#FFFDF8] min-h-screen overflow-hidden font-body">
      
      {/* SECTION 1: HERO */}
      <section 
        className="relative px-6 md:px-16 pt-24 pb-32 min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent z-0"></div>
        
        {/* Left Side (Text) */}
        <div className="w-full md:w-1/2 flex flex-col z-10 space-y-6 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[80px] font-extrabold leading-[1.1] tracking-tight font-display text-[#1E293B]"
          >
            Learn Today,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F43F5E] to-[#D946EF]">
              Imagine
            </span> <span className="text-[#6366F1]">Tomorrow!</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#475569] max-w-md font-medium leading-relaxed font-body bg-white/50 backdrop-blur-sm p-4 rounded-2xl"
          >
            Step into a magical world of stories, games and discovery.<br/>
            Every day is a new adventure!
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link to="/signup">
              <button onClick={playClick} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-4 rounded-full font-bold shadow-[0_8px_15px_rgba(124,58,237,0.3)] flex items-center gap-2 transition-all hover:-translate-y-1">
                Start Your Adventure 🚀
              </button>
            </Link>
            <button onClick={playClick} className="bg-white/80 backdrop-blur text-[#475569] border-2 border-[#E2E8F0] px-8 py-4 rounded-full font-bold shadow-sm flex items-center gap-2 hover:bg-white transition-all">
              <Play className="w-5 h-5 text-[#7C3AED] fill-current" /> Watch Story
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 bg-white/70 backdrop-blur-md rounded-full py-2 px-4 w-fit border border-white mt-4 shadow-sm"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#FFB347] flex items-center justify-center text-xs">👦</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#F472B6] flex items-center justify-center text-xs">👧</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#4ADE80] flex items-center justify-center text-xs">👶</div>
            </div>
            <span className="text-sm font-semibold text-[#475569] font-body">Loved by 10,000+ Kids & Parents</span>
            <Heart className="w-4 h-4 text-[#F43F5E] fill-current" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: STORY ABOUT KINDERKIDSSPACE (Merged Card) */}
      <section className="px-6 md:px-16 pb-24 max-w-[1400px] mx-auto relative -mt-16 z-20">
        <div 
          className="rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${storyImg})` }}
        >
          {/* Gradient Overlay for Text Readability on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFFDF3]/80 to-[#FFFDF3] z-0"></div>

          {/* Text Content aligned to right */}
          <div className="w-full md:w-1/2 ml-auto relative z-10 p-6 md:p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50">
            <h2 className="text-4xl md:text-[44px] font-display font-bold text-[#1E293B] mb-6 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-[#7C3AED] fill-current" />
              <span>Story About <span className="text-[#F43F5E]">Kinder</span><span className="text-[#FFB347]">Kids</span><span className="text-[#6366F1]">Space</span></span>
            </h2>
            
            <p className="text-lg text-[#475569] leading-relaxed mb-8 font-medium">
              Once upon a time, in a world full of wonder, there was a place where learning felt like play and every child was a hero of their own story.
              At KinderKidsSpace, we believe every little mind has big dreams. Through fun games, interactive stories and exciting challenges, we make learning an adventure they'll love!
            </p>

            <div className="flex flex-wrap gap-4 bg-white/80 backdrop-blur px-6 py-4 rounded-full shadow-sm w-fit border border-white">
              <div className="flex items-center gap-2"><Star className="w-5 h-5 text-[#F59E0B] fill-current"/><span className="font-bold text-[#1E293B] text-sm">Explore</span></div>
              <div className="w-px h-5 bg-gray-300"></div>
              <div className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#3B82F6] fill-current"/><span className="font-bold text-[#1E293B] text-sm">Learn</span></div>
              <div className="w-px h-5 bg-gray-300"></div>
              <div className="flex items-center gap-2"><Trophy className="w-5 h-5 text-[#F59E0B] fill-current"/><span className="font-bold text-[#1E293B] text-sm">Achieve</span></div>
              <div className="w-px h-5 bg-gray-300"></div>
              <div className="flex items-center gap-2"><Heart className="w-5 h-5 text-[#F43F5E] fill-current"/><span className="font-bold text-[#1E293B] text-sm">Grow</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MORE TO EXPLORE */}
      <section className="px-6 pb-24 max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-[#1E293B] mb-3 flex items-center justify-center gap-3">
            <span className="text-[#22C55E]">🌿</span> More to Explore <span className="text-[#22C55E]">🌿</span>
          </h2>
          <p className="text-[#64748B] text-lg">Discover exciting stories, fun facts and cool stuff every day!</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {adventureCards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay }}
              className={`${card.bgColor} rounded-[2rem] p-6 w-[240px] flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative pt-12`}
            >
              {/* Image Placeholder (Emoji for now) */}
              <div className="w-32 h-32 absolute -top-12 bg-white rounded-3xl shadow-md flex items-center justify-center text-6xl">
                {card.icon}
              </div>
              
              <h3 className={`text-xl font-bold font-display ${card.textColor} mb-3 mt-16 leading-tight`}>{card.title}</h3>
              <p className="text-[#475569] text-sm mb-6 flex-grow">{card.desc}</p>
              
              <button onClick={playClick} className="w-full bg-white text-[#475569] font-bold py-2.5 rounded-full border border-gray-100 shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                Read Now <BookOpen className="w-4 h-4 text-gray-400" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: BOTTOM CTA BANNER */}
      <section className="px-6 pb-12 max-w-[1200px] mx-auto">
        <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center shadow-xl">
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 relative z-10 flex items-center gap-3">
            Ready to Start Your Story? <Sparkles className="w-8 h-8 text-[#FCD34D] fill-current" />
          </h2>
          <p className="text-indigo-100 text-lg mb-8 relative z-10">Choose a world and begin your learning adventure today!</p>
          
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/alphabets">
              <button onClick={playClick} className="bg-white text-[#475569] px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm">
                <span className="bg-blue-100 text-blue-600 rounded p-1 text-xs font-black">abc</span> Alphabets
              </button>
            </Link>
            <Link to="/numbers">
              <button onClick={playClick} className="bg-white text-[#475569] px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm">
                <span className="bg-blue-100 text-blue-600 rounded p-1 text-xs font-black">123</span> Numbers
              </button>
            </Link>
            <Link to="/telugu">
              <button onClick={playClick} className="bg-white text-[#475569] px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm">
                <span className="bg-purple-100 text-purple-600 rounded p-1 text-xs font-black">అ</span> తెలుగు ప్రపంచం
              </button>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Index;
