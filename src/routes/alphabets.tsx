import { createFileRoute } from "@tanstack/react-router";
import AlphabetGame from "@/features/AlphabetGame";

export const Route = createFileRoute("/alphabets")({
  component: AlphabetGame,
  head: () => ({
    meta: [
      { title: "Alphabets — Learn A to Z & a to z" },
      { name: "description", content: "Learn uppercase and lowercase alphabets with animated strokes, tracing, quizzes and audio." },
    ],
  }),
});
