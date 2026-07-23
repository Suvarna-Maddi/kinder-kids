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
        { title: "Numbers — Count and Learn | KinderKidsSpace" },
        {
          name: "description",
          content:
            "Learn to count with fun games and audio for kindergarten and preschool children.",
        },
        {
          name: "keywords",
          content:
            "Number learning, Kids math, Learn to count, Preschool numbers, Educational games for children",
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
      ],
    };
  },
});
