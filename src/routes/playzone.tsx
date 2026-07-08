import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const PlayZone = lazy(() => import("@/features/PlayZone"));

export const Route = createFileRoute("/playzone")({
  component: PlayZoneRoute,
  head: () => ({
    meta: [
      { title: "PlayZone — Fun Learning Games for Kids" },
      { name: "description", content: "Bright and playful educational games: alphabets, numbers, tables, shapes, colors, memory, animals and more." },
    ],
  }),
});

function PlayZoneRoute() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-display text-xl">Loading games… 🎈</div>}>
      <PlayZone />
    </Suspense>
  );
}
