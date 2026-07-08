import { createFileRoute } from "@tanstack/react-router";
import MathGame from "@/features/MathGame";

export const Route = createFileRoute("/math")({
  component: MathGame,
  head: () => ({
    meta: [
      { title: "Mathematics — Fun Arithmetic for Kids" },
      { name: "description", content: "Practice addition, subtraction, multiplication and division with unlimited kid-friendly questions." },
      { property: "og:title", content: "Mathematics — Fun Arithmetic for Kids" },
      { property: "og:description", content: "Unlimited arithmetic practice with narration and rewards." },
    ],
  }),
});