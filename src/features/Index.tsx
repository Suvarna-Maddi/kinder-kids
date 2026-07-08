import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Sparkles, Star, Zap, Heart, Music } from "lucide-react";
import mobBackground from "@/assets/mob_background.png";
import lapBackground from "@/assets/lap_background.png";
import { playClick } from "@/lib/sounds";

const categories = [
  {
    title: "Alphabets",
    emoji: "🔤",
    description: "Learn A to Z with fun!",
    path: "/alphabets",
    gradient: "from-kid-blue to-kid-teal",
    icon: "📖",
    delay: 0.1,
  },
  {
    title: "Numbers",
    emoji: "🔢",
    description: "Count and hear the number names!",
    path: "/numbers",
    gradient: "from-kid-green to-kid-teal",
    icon: "🧮",
    delay: 0.2,
  },
  {
    title: "Mathematics",
    emoji: "🧮",
    description: "Add, subtract, multiply, divide!",
    path: "/math",
    gradient: "from-kid-teal to-kid-blue",
    icon: "➕",
    delay: 0.25,
  },
  {
    title: "Times Tables",
    emoji: "✖️",
    description: "Any table, no limits!",
    path: "/tables",
    gradient: "from-kid-orange to-kid-yellow",
    icon: "🧠",
    delay: 0.3,
  },
  {
    title: "Shapes",
    emoji: "🔷",
    description: "Meet circles, squares & more!",
    path: "/shapes",
    gradient: "from-kid-red to-kid-orange",
    icon: "⭐",
    delay: 0.35,
  },
  {
    title: "PlayZone",
    emoji: "🎮",
    description: "Fun games for every skill!",
    path: "/playzone",
    gradient: "from-kid-pink to-kid-purple",
    icon: "🎈",
    delay: 0.4,
  },
  {
    title: "Solar System",
    emoji: "🚀",
    description: "Explore the planets in space!",
    path: "/solarsystem",
    gradient: "from-indigo-600 to-purple-800",
    icon: "🌎",
    delay: 0.45,
  },
] as const;

const features = [
  { icon: Zap, title: "Interactive Games", desc: "Learn by playing fun games", color: "text-kid-orange", bg: "bg-kid-orange/10" },
  { icon: Music, title: "Sound Effects", desc: "Hear letters & numbers", color: "text-kid-blue", bg: "bg-kid-blue/10" },
  { icon: Star, title: "Earn Stars", desc: "Track your progress", color: "text-kid-yellow", bg: "bg-kid-yellow/10" },
  { icon: Heart, title: "Kid-Friendly", desc: "Safe & fun for all ages", color: "text-kid-pink", bg: "bg-kid-pink/10" },
];

const testimonials = [
  { name: "Sarah M.", text: "My daughter loves the alphabet game!", avatar: "👩", stars: 5 },
  { name: "David K.", text: "Best learning app for my kids!", avatar: "👨", stars: 5 },
  { name: "Lisa P.", text: "The spelling bee is amazing!", avatar: "👩‍🦰", stars: 5 },
];

const Index = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <picture>
            <source media="(min-width: 768px)" srcSet={lapBackground} />
            <img
              src={mobBackground}
              alt="Fun learning games for little champions"
              className="w-full h-full object-cover object-[center_80%] md:object-[center_60%]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
        </div>
        <div className="relative z-10 px-4 pt-8 pb-9 md:pt-16 md:pb-32 text-center w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6"
          >
            <Sparkles className="w-4 h-4 text-kid-yellow" />
            <span className="font-body text-sm font-semibold text-foreground">✨ Fun Learning for Kids!</span>
          </motion.div>

          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-5xl md:text-8xl font-display font-bold text-foreground mb-4 drop-shadow-lg"
          >
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
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-3xl font-body text-foreground/80 max-w-2xl mx-auto drop-shadow-md mb-8 mt-28 md:mt-0"
          >
            Fun learning games for little champions! 🌟
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/alphabets" onClick={playClick}>
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-display text-xl font-bold shadow-xl hover:shadow-2xl transition-shadow"
              >
                Start Learning! 🚀
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="px-4 pb-16 -mt-8 md:-mt-16 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.title}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: cat.delay, type: "spring", stiffness: 200 }}
            >
              <Link to={cat.path} onClick={playClick}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.97 }}
                  className={`bg-gradient-to-br ${cat.gradient} rounded-bubble p-6 md:p-8 shadow-xl cursor-pointer text-center relative overflow-hidden group`}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <div className="text-5xl md:text-6xl mb-4 animate-float">{cat.emoji}</div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-2">
                    {cat.title}
                  </h2>
                  <p className="text-primary-foreground/80 font-body text-lg">{cat.description}</p>
                  <div className="mt-3 text-3xl">{cat.icon}</div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-10 text-center">
            Why Kids Love Us! 💖
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-card rounded-bubble shadow-lg p-5 md:p-6 text-center border border-border"
                >
                  <div className={`${feat.bg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-7 h-7 ${feat.color}`} />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-1">{feat.title}</h3>
                  <p className="text-muted-foreground font-body text-sm">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8 text-center">
            Parents Love It Too! 🥰
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-bubble shadow-lg p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{t.avatar}</div>
                  <div>
                    <p className="font-display font-bold text-foreground">{t.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-kid-yellow fill-kid-yellow" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground font-body text-sm italic">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-16 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-kid-blue to-kid-purple rounded-bubble p-8 md:p-12 shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Ready to Start Learning? 🎉
          </h2>
          <p className="text-primary-foreground/80 font-body text-lg mb-6">
            Choose a game and start your adventure!
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link key={cat.path} to={cat.path} onClick={playClick} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-card/90 backdrop-blur-sm text-foreground px-5 py-3 rounded-full font-display font-bold shadow-lg text-base flex items-center justify-center gap-2"
                >
                  <span className="text-xl">{cat.emoji}</span> <span>{cat.title}</span>
                </motion.button>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
