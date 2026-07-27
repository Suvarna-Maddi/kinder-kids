import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/numbers")({
  component: lazyRouteComponent(() => import("@/features/NumbersGame")),
  head: () => {
    const canonicalUrl = "https://kinderkidsspace.in/numbers";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Numbers — Count and Learn",
      description:
        "Learn to count with fun games and audio for kindergarten and preschool children.",
      provider: {
        "@type": "EducationalOrganization",
        name: "KinderKidsSpace",
        sameAs: "https://kinderkidsspace.in/",
      },
    };

    return {
      meta: [
        { title: "Number Learning Games for Kids – Preschool & Kindergarten App" },
        {
          name: "description",
          content:
            "Teach your kids to count with fun, interactive number learning games. Designed for preschool and kindergarten kids to master basic math concepts easily.",
        },
        {
          name: "keywords",
          content:
            "number learning, math for kids, kids educational games, kindergarten learning app, preschool learning app, learn to count, kids math games",
        },
        { property: "og:title", content: "Numbers — Count and Learn | KinderKidsSpace" },
        {
          property: "og:description",
          content:
            "Learn to count with fun games and audio for kindergarten and preschool children.",
        },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(schema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://kinderkidsspace.in/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Numbers",
                item: "https://kinderkidsspace.in/numbers",
              },
            ],
          }),
        },
      ],
    };
  },
});
