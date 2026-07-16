import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/alphabets")({
  component: lazyRouteComponent(() => import("@/features/AlphabetGame")),
  head: () => {
    const canonicalUrl = "https://Suvarna-Maddi.github.io/kinder-kids/alphabets";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Learn A to Z & a to z",
      "description": "Learn uppercase and lowercase alphabets with animated strokes, tracing, quizzes and audio.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "KinderKidsSpace",
        "sameAs": "https://Suvarna-Maddi.github.io/kinder-kids/"
      }
    };

    return {
      meta: [
        { title: "Alphabets — Learn A to Z & a to z | KinderKidsSpace" },
        {
          name: "description",
          content:
            "Learn uppercase and lowercase alphabets with animated strokes, tracing, quizzes and audio. Perfect for kindergarten education and preschool learning.",
        },
        { name: "keywords", content: "Alphabet learning, Learn A to Z, Preschool alphabet, Kindergarten letters, Tracing letters" },
        { property: "og:title", content: "Alphabets — Learn A to Z & a to z | KinderKidsSpace" },
        { property: "og:description", content: "Learn uppercase and lowercase alphabets with animated strokes, tracing, quizzes and audio." },
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
