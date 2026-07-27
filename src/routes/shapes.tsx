import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/shapes")({
  component: lazyRouteComponent(() => import("@/features/ShapesGame")),
  head: () => {
    const canonicalUrl = "https://kinderkidsspace.in/shapes";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Shapes — Learn Circles, Squares & More",
      description: "Learn shapes with pictures, narration, and a shape-matching quiz.",
      provider: {
        "@type": "EducationalOrganization",
        name: "KinderKidsSpace",
        sameAs: "https://kinderkidsspace.in/",
      },
    };

    return {
      meta: [
        { title: "Learn Shapes for Kids – Educational Preschool App" },
        {
          name: "description",
          content:
            "Teach your kids basic shapes through interactive quizzes, narration, and fun learning activities designed for kindergarten and preschool children.",
        },
        {
          name: "keywords",
          content:
            "learn shapes, preschool shapes, kindergarten learning app, kids educational games, interactive learning, shapes for kids, learning activities",
        },
        {
          property: "og:title",
          content: "Shapes — Learn Circles, Squares & More | KinderKidsSpace",
        },
        {
          property: "og:description",
          content:
            "Learn shapes with pictures, narration, and a shape-matching quiz. Fun educational games for children.",
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
                name: "Shapes",
                item: "https://kinderkidsspace.in/shapes",
              },
            ],
          }),
        },
      ],
    };
  },
});
