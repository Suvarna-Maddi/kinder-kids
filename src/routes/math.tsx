import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/math")({
  component: lazyRouteComponent(() => import("@/features/MathGame")),
  head: () => {
    const canonicalUrl = "https://Suvarna-Maddi.github.io/kinder-kids/math";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Mathematics — Fun Arithmetic for Kids",
      description:
        "Practice addition, subtraction, multiplication and division with unlimited kid-friendly questions.",
      provider: {
        "@type": "EducationalOrganization",
        name: "KinderKidsSpace",
        sameAs: "https://Suvarna-Maddi.github.io/kinder-kids/",
      },
    };

    return {
      meta: [
        { title: "Mathematics — Fun Arithmetic for Kids | KinderKidsSpace" },
        {
          name: "description",
          content:
            "Practice addition, subtraction, multiplication and division with unlimited kid-friendly questions. Interactive math learning for children.",
        },
        {
          name: "keywords",
          content:
            "Kids math, Arithmetic for kids, Learn addition, Learn subtraction, Educational math games, Math practice for children",
        },
        {
          property: "og:title",
          content: "Mathematics — Fun Arithmetic for Kids | KinderKidsSpace",
        },
        {
          property: "og:description",
          content:
            "Unlimited arithmetic practice with narration and rewards. Perfect for young learners.",
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
