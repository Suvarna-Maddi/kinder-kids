import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/playzone")({
  component: lazyRouteComponent(() => import("@/features/PlayZone")),
  head: () => ({
    meta: [
      { title: "PlayZone — Fun Learning Games for Kids" },
      {
        name: "description",
        content:
          "Bright and playful educational games: alphabets, numbers, tables, shapes, colors, memory, animals and more.",
      },
    ],
  }),
});
