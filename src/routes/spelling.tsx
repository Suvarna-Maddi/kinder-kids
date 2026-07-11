import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/spelling")({
  component: lazyRouteComponent(() => import("@/features/SpellingGame")),
});
