import { createFileRoute } from "@tanstack/react-router";
import Rewards from "@/features/Rewards";

export const Route = createFileRoute("/rewards")({
  component: Rewards,
  head: () => ({
    meta: [
      { title: "Rewards & Progress — KinderKids" },
      { name: "description", content: "Track stars, coins, streaks and earned badges as you learn." },
      { property: "og:title", content: "Rewards & Progress — KinderKids" },
      { property: "og:description", content: "See every star, coin and badge you've earned." },
    ],
  }),
});