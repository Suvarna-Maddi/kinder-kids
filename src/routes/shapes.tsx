import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/shapes")({
  component: lazyRouteComponent(() => import("@/features/ShapesGame")),
  head: () => ({
    meta: [
      { title: "Shapes — Learn Circles, Squares & More" },
      {
        name: "description",
        content: "Learn shapes with pictures, narration, and a shape-matching quiz.",
      },
      { property: "og:title", content: "Shapes — Learn Circles, Squares & More" },
      { property: "og:description", content: "Meet shapes and try the shape quiz." },
    ],
  }),
});
