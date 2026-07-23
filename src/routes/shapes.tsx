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
        { title: "Shapes — Learn Circles, Squares & More | KinderKidsSpace" },
        {
          name: "description",
          content:
            "Learn shapes with pictures, narration, and a shape-matching quiz. Fun educational games for children.",
        },
        {
          name: "keywords",
          content:
            "Learn shapes, Preschool shapes, Kindergarten shapes, Shapes for kids, Educational games for children",
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
      ],
    };
  },
});
