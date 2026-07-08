import { createFileRoute } from "@tanstack/react-router";
import TablesGame from "@/features/TablesGame";

export const Route = createFileRoute("/tables")({
  component: TablesGame,
  head: () => ({
    meta: [
      { title: "Times Tables — Unlimited Multiplication Practice" },
      { name: "description", content: "Practice any multiplication table with no limits. Choose any number and any range." },
    ],
  }),
});
