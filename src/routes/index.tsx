import { createFileRoute } from "@tanstack/react-router";
import Index from "@/features/Index";

export const Route = createFileRoute("/")({
  component: Index,
});
