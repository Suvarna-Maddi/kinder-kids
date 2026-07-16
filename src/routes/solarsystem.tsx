import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/solarsystem")({
  component: lazyRouteComponent(() => import("@/features/SolarSystem")),
  head: () => {
    const canonicalUrl = "https://Suvarna-Maddi.github.io/kinder-kids/solarsystem";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Solar System — Explore Planets",
      "description": "Learn about planets and the solar system through interactive activities for children.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "KinderKidsSpace",
        "sameAs": "https://Suvarna-Maddi.github.io/kinder-kids/"
      }
    };

    return {
      meta: [
        { title: "Solar System — Explore Planets | KinderKidsSpace" },
        { name: "description", content: "Learn about planets and the solar system through interactive activities for children." },
        { name: "keywords", content: "Solar system for kids, Learn planets, Space exploration for children, Educational science games" },
        { property: "og:title", content: "Solar System — Explore Planets | KinderKidsSpace" },
        { property: "og:description", content: "Learn about planets and the solar system through interactive activities for children." },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl }
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(schema),
        }
      ]
    };
  },
});
