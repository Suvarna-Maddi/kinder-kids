import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/spelling")({
  component: lazyRouteComponent(() => import("@/features/SpellingGame")),
  head: () => {
    const canonicalUrl = "https://kinderkidsspace.in/spelling";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Spelling — Learn to Spell Words",
      description: "Interactive spelling games and activities for children.",
      provider: {
        "@type": "EducationalOrganization",
        name: "KinderKidsSpace",
        sameAs: "https://kinderkidsspace.in/",
      },
    };

    return {
      meta: [
        { title: "Spelling Games — Learn to Spell | KinderKidsSpace" },
        {
          name: "description",
          content:
            "Interactive spelling games and activities for children. Improve vocabulary and spelling skills.",
        },
        {
          name: "keywords",
          content:
            "Spelling games for kids, Learn to spell, Preschool spelling, Kindergarten vocabulary, Educational games for children",
        },
        { property: "og:title", content: "Spelling Games — Learn to Spell | KinderKidsSpace" },
        {
          property: "og:description",
          content:
            "Interactive spelling games and activities for children. Improve vocabulary and spelling skills.",
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
      ],
    };
  },
});
