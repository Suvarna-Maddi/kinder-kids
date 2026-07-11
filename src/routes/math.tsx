import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/math")({
  component: lazyRouteComponent(() => import("@/features/MathGame")),
  head: () => ({
    meta: [
      { title: "Mathematics — Fun Arithmetic for Kids" },
      {
        name: "description",
        content:
          "Practice addition, subtraction, multiplication and division with unlimited kid-friendly questions.",
      },
      { property: "og:title", content: "Mathematics — Fun Arithmetic for Kids" },
      {
        property: "og:description",
        content: "Unlimited arithmetic practice with narration and rewards.",
      },
    ],
  }),
});
