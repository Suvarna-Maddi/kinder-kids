import { createFileRoute } from "@tanstack/react-router";
import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, PenTool, CheckCircle2, X } from "lucide-react";
import { vowels, consonants, TeluguLetter } from "../data/teluguData";
import { IMG_MAP } from "../lib/images";
import FreeDrawPad from "../components/learning/FreeDrawPad";

export const Route = createFileRoute("/telugu")({
  component: TeluguPage,
  head: () => {
    const canonicalUrl = "https://Suvarna-Maddi.github.io/kinder-kids/telugu";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Telugu Learning World",
      "description": "Learn Telugu alphabets, vowels (Achulu) and consonants (Hallulu) with interactive tracing and audio.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "KinderKidsSpace",
        "sameAs": "https://Suvarna-Maddi.github.io/kinder-kids/"
      }
    };

    return {
      meta: [
        { title: "Telugu Learning World — Achulu & Hallulu | KinderKidsSpace" },
        { name: "description", content: "Learn Telugu alphabets, vowels (Achulu) and consonants (Hallulu) with interactive tracing and audio." },
        { name: "keywords", content: "Telugu learning for kids, Learn Telugu alphabets, Telugu vowels, Telugu consonants, Achulu, Hallulu" },
        { property: "og:title", content: "Telugu Learning World — Achulu & Hallulu | KinderKidsSpace" },
        { property: "og:description", content: "Learn Telugu alphabets, vowels (Achulu) and consonants (Hallulu) with interactive tracing and audio." },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl }
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(schema),
        }
      ]
    };
  },
});

export const TeluguAlphabetCard = memo(
  ({
    item,
    onPlay,
    onTrace,
  }: {
    item: TeluguLetter;
    onPlay: (item: TeluguLetter) => void;
    onTrace: (item: TeluguLetter) => void;
  }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPlay(item)}
        className="bg-card hover:bg-muted transition-colors rounded-3xl p-6 shadow-sm border-2 border-border cursor-pointer flex flex-col items-center gap-4 text-center group"
      >
        <div className="text-7xl font-display font-bold text-kid-blue group-hover:text-kid-purple transition-colors">
          {item.letter}
        </div>
        <div className="flex flex-col items-center gap-2 mt-2">
          {IMG_MAP[item.exampleMeaning] ? (
            <img
              src={IMG_MAP[item.exampleMeaning]}
              alt={item.exampleMeaning}
              className="w-16 h-16 object-contain"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="text-4xl" role="img" aria-label={item.exampleMeaning}>
              {item.exampleImage}
            </span>
          )}
          <div className="text-lg font-bold text-foreground">{item.exampleWord}</div>
          <div className="text-sm text-muted-foreground">{item.exampleMeaning}</div>
        </div>

        <div className="flex gap-2 w-full mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            className="flex-1 bg-kid-blue/10 text-kid-blue hover:bg-kid-blue hover:text-white rounded-full py-2 flex items-center justify-center transition-colors"
            title="Play Sound"
          >
            <Play className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTrace(item);
              onPlay(item); // Play sound when opening the trace modal
            }}
            className="flex-1 bg-kid-green/10 text-kid-green hover:bg-kid-green hover:text-white rounded-full py-2 flex items-center justify-center transition-colors"
            title="Practice Writing"
          >
            <PenTool className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    );
  },
);

function TeluguPage() {
  const [activeSection, setActiveSection] = useState<
    "vowels" | "consonants"
  >("vowels");

  const [tracingLetter, setTracingLetter] = useState<TeluguLetter | null>(null);
  const [tracingColor, setTracingColor] = useState("#3b82f6"); // Blue as default

  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Green", value: "#22c55e" },
    { name: "Purple", value: "#a855f7" },
    { name: "Orange", value: "#f97316" },
  ];

  const playPronunciation = (item: TeluguLetter) => {
    // Determine if it is a vowel or consonant to find the correct local file
    const isVowel = vowels.some((v) => v.letter === item.letter);
    const prefix = isVowel ? "vowel" : "consonant";

    const getAudioUrl = (isWord: boolean) =>
      `/sounds/telugu/${isWord ? "word" : prefix}_${item.pronunciation}.mp3`;

    const letterAudio = new Audio(getAudioUrl(false));

    letterAudio.onended = () => {
      if (item.exampleWord) {
        // Add small delay before pronouncing the word
        setTimeout(() => {
          const wordAudio = new Audio(getAudioUrl(true));
          wordAudio.play().catch(console.error);
        }, 500);
      }
    };

    letterAudio.play().catch(console.error);
  };

  const sections = [
    { id: "vowels", label: "అచ్చులు (Vowels)" },
    { id: "consonants", label: "హల్లులు (Consonants)" },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl md:text-6xl font-display font-bold text-kid-purple mb-4"
        >
          తెలుగు ప్రపంచం
        </motion.h1>
        <p className="text-xl text-muted-foreground font-body">
          Welcome to the Telugu Learning World! Let's play and learn.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`px-6 py-3 rounded-full font-display font-bold text-lg transition-all ${
              activeSection === section.id
                ? "bg-kid-purple text-white shadow-lg scale-105"
                : "bg-muted text-muted-foreground hover:bg-kid-purple/20 hover:text-kid-purple"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === "vowels" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {vowels.map((v) => (
                <TeluguAlphabetCard
                  key={v.letter}
                  item={v}
                  onPlay={playPronunciation}
                  onTrace={setTracingLetter}
                />
              ))}
            </div>
          )}

          {activeSection === "consonants" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {consonants.map((c) => (
                <TeluguAlphabetCard
                  key={c.letter}
                  item={c}
                  onPlay={playPronunciation}
                  onTrace={setTracingLetter}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Tracing Modal */}
      <AnimatePresence>
        {tracingLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative flex flex-col md:flex-row items-center gap-8"
            >
              <button
                onClick={() => setTracingLetter(null)}
                className="absolute top-4 right-4 p-2 bg-muted hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-full transition-colors z-50"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4 shadow-inner">
                  {IMG_MAP[tracingLetter.exampleMeaning as keyof typeof IMG_MAP] ? (
                    <img
                      src={IMG_MAP[tracingLetter.exampleMeaning as keyof typeof IMG_MAP]}
                      alt={tracingLetter.exampleMeaning}
                      className="w-16 h-16 object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="text-5xl">{tracingLetter.exampleImage}</span>
                  )}
                </div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-1">
                  {tracingLetter.exampleWord}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 font-body">
                  {tracingLetter.exampleMeaning}
                </p>

                <div className="mb-2 font-display font-semibold text-kid-blue">Pick a Color:</div>
                <div className="flex gap-3 mb-6 flex-wrap justify-center">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setTracingColor(c.value)}
                      className={`w-10 h-10 rounded-full shadow-sm transition-transform ${
                        tracingColor === c.value
                          ? "scale-125 ring-4 ring-offset-2 ring-kid-blue/50"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>

                <button
                  onClick={() => playPronunciation(tracingLetter)}
                  className="flex items-center gap-2 px-6 py-2 bg-kid-blue/10 text-kid-blue rounded-full font-bold hover:bg-kid-blue hover:text-white transition-colors"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play Sound</span>
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <h3 className="text-2xl font-display font-bold text-kid-blue mb-4">
                  Trace {tracingLetter.letter}
                </h3>
                <FreeDrawPad
                  letter={tracingLetter.letter}
                  onSuccess={() => {
                    setTimeout(() => setTracingLetter(null), 2500);
                  }}
                  color={tracingColor}
                  size={280}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
