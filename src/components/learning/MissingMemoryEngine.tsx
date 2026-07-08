import React from "react";
import { MemoryEngine } from "./MemoryEngine";

interface MissingMemoryEngineProps {
  difficulty: "easy" | "medium" | "hard";
  onClose: () => void;
  theme: "objects" | "family";
}

export const MissingMemoryEngine: React.FC<MissingMemoryEngineProps> = ({
  difficulty,
  onClose,
  theme,
}) => {
  return <MemoryEngine difficulty={difficulty} onClose={onClose} theme={theme} />;
};

export default MissingMemoryEngine;
