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
    const canonicalUrl = "https://kinderkidsspace.in/";
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["Organization", "EducationalOrganization", "LocalBusiness"],
          "@id": "https://kinderkidsspace.in/#organization",
          name: "KinderKidsSpace",
          url: "https://kinderkidsspace.in/",
          logo: "https://kinderkidsspace.in/favicon.png",
          description:
            "KinderKidsspace helps children learn ABC, numbers, phonics, stories, drawing, tracing, math, puzzles and educational games through fun AI-powered activities. Start your free 30-day trial today.",
          sameAs: [
            "https://www.facebook.com/kinderkidsspace",
            "https://www.instagram.com/kinderkidsspace",
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Hyderabad",
            addressRegion: "Telangana",
            addressCountry: "IN",
          },
        },
        {
          "@type": ["WebSite", "WebApplication", "SoftwareApplication"],
          "@id": "https://kinderkidsspace.in/#website",
          url: "https://kinderkidsspace.in/",
          name: "KinderKidsSpace",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Any",
          publisher: {
            "@id": "https://kinderkidsspace.in/#organization",
          },
          potentialAction: {
            "@type": "SearchAction",
            target: "https://kinderkidsspace.in/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        },
      ],
    };

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          title:
            "KinderKidsspace – Interactive Learning Platform for Preschool & Kindergarten Kids",
        },
        {
          name: "description",
          content:
            "KinderKidsspace helps children learn ABC, numbers, phonics, stories, drawing, tracing, math, puzzles and educational games through fun AI-powered activities. Start your free 30-day trial today.",
        },
        {
          name: "keywords",
          content:
            "preschool learning app, kindergarten learning app, kids learning platform, online learning for kids, AI learning app for kids, educational games, alphabet learning, phonics, number learning, math for kids, kids stories, learning activities",
        },
        { name: "theme-color", content: "#ffffff" },
        {
          property: "og:title",
          content:
            "KinderKidsspace – Interactive Learning Platform for Preschool & Kindergarten Kids",
        },
        {
          property: "og:description",
          content:
            "KinderKidsspace helps children learn ABC, numbers, phonics, stories, drawing, tracing, math, puzzles and educational games through fun AI-powered activities. Start your free 30-day trial today.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: "https://kinderkidsspace.in/favicon.png" },
        { property: "og:site_name", content: "KinderKidsspace" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content:
            "KinderKidsspace – Interactive Learning Platform for Preschool & Kindergarten Kids",
        },
        {
          name: "twitter:description",
          content:
            "KinderKidsspace helps children learn ABC, numbers, phonics, stories, drawing, tracing, math, puzzles and educational games through fun AI-powered activities. Start your free 30-day trial today.",
        },
        { name: "twitter:image", content: "https://kinderkidsspace.in/favicon.png" },
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
