import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/playzone")({
  component: lazyRouteComponent(() => import("@/features/PlayZone")),
  head: () => {
    const canonicalUrl = "https://Suvarna-Maddi.github.io/kinder-kids/playzone";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "PlayZone — Fun Learning Games for Kids",
      "description": "Bright and playful educational games: alphabets, numbers, tables, shapes, colors, memory, animals and more.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "KinderKidsSpace",
        "sameAs": "https://Suvarna-Maddi.github.io/kinder-kids/"
      }
    };

    return {
      meta: [
        { title: "PlayZone — Fun Learning Games for Kids | KinderKidsSpace" },
        {
          name: "description",
          content:
            "Bright and playful educational games: alphabets, numbers, tables, shapes, colors, memory, animals and more.",
        },
        { name: "keywords", content: "Educational games for kids, Play and learn, Kids memory games, Animal games for children, Fun learning activities" },
        { property: "og:title", content: "PlayZone — Fun Learning Games for Kids | KinderKidsSpace" },
        { property: "og:description", content: "Bright and playful educational games: alphabets, numbers, tables, shapes, colors, memory, animals and more." },
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
