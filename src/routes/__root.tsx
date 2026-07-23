import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

function NotFoundComponent() {
  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-display font-bold text-primary">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-display font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. You can try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const canonicalUrl = "https://Suvarna-Maddi.github.io/kinder-kids/";
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "EducationalOrganization",
          "@id": "https://Suvarna-Maddi.github.io/kinder-kids/#organization",
          name: "KinderKidsSpace",
          url: "https://Suvarna-Maddi.github.io/kinder-kids/",
          logo: "https://Suvarna-Maddi.github.io/kinder-kids/favicon.png",
          description:
            "Interactive learning platform for kids with alphabets, numbers, games, tracing activities, and learning resources.",
          sameAs: [],
        },
        {
          "@type": "WebSite",
          "@id": "https://Suvarna-Maddi.github.io/kinder-kids/#website",
          url: "https://Suvarna-Maddi.github.io/kinder-kids/",
          name: "KinderKidsSpace",
          publisher: {
            "@id": "https://Suvarna-Maddi.github.io/kinder-kids/#organization",
          },
        },
      ],
    };

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
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
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
        {
          property: "og:image",
          content: "https://Suvarna-Maddi.github.io/kinder-kids/favicon.png",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: "KinderKidsSpace - Interactive Learning Platform for Kids",
        },
        {
          name: "twitter:description",
          content:
            "Fun and engaging educational platform for children with alphabets, numbers, games, tracing activities, and learning resources.",
        },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
        { rel: "alternate", hrefLang: "en", href: canonicalUrl },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.png", type: "image/png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(schema),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager - Placeholder */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');`,
          }}
        />
        {/* Google Analytics 4 - Placeholder */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {/* Google Tag Manager (noscript) - Placeholder */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Outlet />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
