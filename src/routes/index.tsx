import { createFileRoute } from "@tanstack/react-router";
import Index from "@/features/Index";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => {
    const canonicalUrl = "https://kinderkidsspace.in/";

    return {
      meta: [
        { title: "KinderKidsSpace - Interactive Learning Platform for Kids" },
        {
          name: "description",
          content:
            "Fun and engaging educational platform for children with alphabets, numbers, games, tracing activities, and learning resources.",
        },
        {
          name: "keywords",
          content:
            "Kids learning platform, Preschool learning, Kindergarten education, Alphabet learning, Number learning, Educational games for children, Tracing activities, Learning app for kids, Telugu learning for kids",
        },
        {
          property: "og:title",
          content: "KinderKidsSpace - Interactive Learning Platform for Kids",
        },
        {
          property: "og:description",
          content:
            "Fun and engaging educational platform for children with alphabets, numbers, games, tracing activities, and learning resources.",
        },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
});
