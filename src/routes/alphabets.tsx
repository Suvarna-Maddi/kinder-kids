import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/alphabets")({
  component: lazyRouteComponent(() => import("@/features/AlphabetGame")),
  head: () => {
    const canonicalUrl = "https://kinderkidsspace.in/alphabets";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Learn A to Z & a to z",
      description:
        "Learn uppercase and lowercase alphabets with animated strokes, tracing, quizzes and audio.",
      provider: {
        "@type": "EducationalOrganization",
        name: "KinderKidsSpace",
        sameAs: "https://kinderkidsspace.in/",
      },
    };

    return {
      meta: [
        { title: "Learn ABC & Phonics – Best Alphabet Learning App for Preschool & Kindergarten" },
        {
          name: "description",
          content:
            "Help your kids learn ABC, phonics, and uppercase/lowercase letters with interactive tracing, stroke animations, and educational games designed for kindergarten.",
        },
        {
          name: "keywords",
          content:
            "alphabet learning, phonics, learn ABC, preschool learning app, kindergarten learning app, kids educational games, tracing letters, learning activities",
        },
        { property: "og:title", content: "Alphabets — Learn A to Z & a to z | KinderKidsSpace" },
        {
          property: "og:description",
          content:
            "Learn uppercase and lowercase alphabets with animated strokes, tracing, quizzes and audio.",
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
                name: "Alphabets",
                item: "https://kinderkidsspace.in/alphabets",
              },
            ],
          }),
        },
      ],
    };
  },
});
