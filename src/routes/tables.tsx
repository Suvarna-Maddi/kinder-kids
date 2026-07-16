import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/tables")({
  component: lazyRouteComponent(() => import("@/features/TablesGame")),
  head: () => {
    const canonicalUrl = "https://Suvarna-Maddi.github.io/kinder-kids/tables";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Times Tables — Unlimited Multiplication Practice",
      "description": "Practice any multiplication table with no limits. Choose any number and any range.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "KinderKidsSpace",
        "sameAs": "https://Suvarna-Maddi.github.io/kinder-kids/"
      }
    };

    return {
      meta: [
        { title: "Times Tables — Multiplication Practice | KinderKidsSpace" },
        {
          name: "description",
          content:
            "Practice any multiplication table with no limits. Choose any number and any range. Learn times tables easily.",
        },
        { name: "keywords", content: "Times tables for kids, Learn multiplication, Multiplication practice, Kids math tables" },
        { property: "og:title", content: "Times Tables — Multiplication Practice | KinderKidsSpace" },
        {
          property: "og:description",
          content: "Practice any multiplication table with no limits. Choose any number and any range.",
        },
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
