import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/tables")({
  component: lazyRouteComponent(() => import("@/features/TablesGame")),
  head: () => ({
    meta: [
      { title: "Times Tables — Unlimited Multiplication Practice" },
      {
        name: "description",
        content:
          "Practice any multiplication table with no limits. Choose any number and any range.",
      },
    ],
  }),
});
