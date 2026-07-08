import { createFileRoute } from "@tanstack/react-router";
import SpellingGame from "@/features/SpellingGame";

export const Route = createFileRoute("/spelling")({
  component: SpellingGame,
});
