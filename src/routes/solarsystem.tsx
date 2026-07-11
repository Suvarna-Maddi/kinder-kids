import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/solarsystem")({
  component: lazyRouteComponent(() => import("@/features/SolarSystem")),
});
