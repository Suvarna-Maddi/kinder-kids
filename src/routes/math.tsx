import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/math")({
  component: lazyRouteComponent(() => import("@/features/MathGame")),
  head: () => {
    const canonicalUrl = "https://kinderkidsspace.in/math";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Mathematics — Fun Arithmetic for Kids",
      description:
        "Practice addition, subtraction, multiplication and division with unlimited kid-friendly questions.",
      provider: {
        "@type": "EducationalOrganization",
        name: "KinderKidsSpace",
        sameAs: "https://kinderkidsspace.in/",
      },
    };

    return {
      meta: [
        { title: "Math for Kids – Addition, Subtraction & Arithmetic Games" },
        {
          name: "description",
          content:
            "Engaging math learning for kids. Practice addition, subtraction, multiplication, and division through fun educational games perfect for early learning.",
        },
        {
          name: "keywords",
          content:
            "math for kids, math learning, kids math games, arithmetic for kids, learn addition, learn subtraction, educational games, preschool math, kindergarten math",
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
                name: "Math",
                item: "https://kinderkidsspace.in/math",
              },
            ],
          }),
        },
      ],
    };
  },
});
