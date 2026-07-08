import { createFileRoute } from "@tanstack/react-router";
import NumbersGame from "@/features/NumbersGame";

export const Route = createFileRoute("/numbers")({
  component: NumbersGame,
  head: () => ({
    meta: [
      { title: "Numbers — Count and Learn" },
      { name: "description", content: "Learn to count with fun games and audio." },
    ],
  }),
});
