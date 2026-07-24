import { createFileRoute } from "@tanstack/react-router";
import Index from "@/features/Index";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => {
    const canonicalUrl = "https://kinderkidsspace.in/";

    return {
      meta: [
        { title: "KinderKidsspace – Interactive Learning Platform for Preschool & Kindergarten Kids" },
        {
          name: "description",
          content: "KinderKidsspace helps children learn ABC, numbers, phonics, stories, drawing, tracing, math, puzzles and educational games through fun AI-powered activities. Start your free 30-day trial today."
        },
        {
          name: "keywords",
          content: "preschool learning app, kindergarten learning app, kids learning platform, online learning for kids, AI learning app for kids, educational games, alphabet learning, phonics, number learning, math for kids, kids stories, learning activities"
        },
        { property: "og:title", content: "KinderKidsspace – Interactive Learning Platform for Preschool & Kindergarten Kids" },
        { property: "og:description", content: "KinderKidsspace helps children learn ABC, numbers, phonics, stories, drawing, tracing, math, puzzles and educational games through fun AI-powered activities. Start your free 30-day trial today." },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://kinderkidsspace.in/"
            }]
          }),
        },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
});
