import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/rewards")({
  component: lazyRouteComponent(() => import("@/features/Rewards")),
  head: () => {
    const canonicalUrl = "https://Suvarna-Maddi.github.io/kinder-kids/rewards";
    
    return {
      meta: [
        { title: "Rewards & Progress — KinderKidsSpace" },
        {
          name: "description",
          content: "Track stars, coins, streaks and earned badges as you learn.",
        },
        { property: "og:title", content: "Rewards & Progress — KinderKidsSpace" },
        { property: "og:description", content: "See every star, coin and badge you've earned." },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl }
      ]
    };
  },
});
