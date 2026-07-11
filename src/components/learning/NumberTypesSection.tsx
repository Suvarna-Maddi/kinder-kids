import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClick } from "@/lib/sounds";
import { cancelSpeech } from "@/lib/tts";
import NumberTypeView, { NUMBER_TYPES, NumberTypeData } from "./NumberTypeView";

const NumberTypesSection = () => {
  const [selectedType, setSelectedType] = useState<NumberTypeData | null>(null);

  const handleCardClick = (data: NumberTypeData) => {
    playClick();
    cancelSpeech();
    setSelectedType(data);
    // Scroll a little bit to focus on the modal, if needed
    setTimeout(() => {
      document
        .getElementById("number-type-view")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="mt-16 md:mt-24 max-w-5xl mx-auto pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
          🔢 Explore Number Types
        </h2>
        <p className="text-xl md:text-2xl font-medium text-muted-foreground">
          Discover different families of numbers!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {NUMBER_TYPES.map((type, i) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(type)}
            className={`flex flex-col items-center text-left bg-gradient-to-br ${type.gradient} text-white rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all cursor-pointer border-4 border-transparent hover:border-white/50`}
          >
            <h3 className="text-xl md:text-2xl font-display font-bold mb-1 shadow-sm leading-tight text-center w-full">
              {type.title}
            </h3>
            <div className="text-sm md:text-base font-bold bg-black/10 rounded-full px-3 py-1 mb-2">
              {type.subtitle}
            </div>
          </motion.button>
        ))}
      </div>

      <div id="number-type-view">
        <AnimatePresence mode="wait">
          {selectedType && (
            <NumberTypeView
              key={selectedType.id}
              data={selectedType}
              onClose={() => setSelectedType(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NumberTypesSection;
