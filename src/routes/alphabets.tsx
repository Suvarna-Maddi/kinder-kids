import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/alphabets")({
  component: lazyRouteComponent(() => import("@/features/AlphabetGame")),
  head: () => ({
    meta: [
      { title: "Alphabets — Learn A to Z & a to z" },
      {
        name: "description",
        content:
          "Learn uppercase and lowercase alphabets with animated strokes, tracing, quizzes and audio.",
      },
    ],
  }),
});
