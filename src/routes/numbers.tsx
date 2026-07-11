import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/numbers")({
  component: lazyRouteComponent(() => import("@/features/NumbersGame")),
  head: () => ({
    meta: [
      { title: "Numbers — Count and Learn" },
      { name: "description", content: "Learn to count with fun games and audio." },
    ],
  }),
});
