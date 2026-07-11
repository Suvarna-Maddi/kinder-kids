// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    base: "/",
    server: {
      proxy: {
        "/edge-tts-ws": {
          target: "wss://speech.platform.bing.com",
          ws: true,
          changeOrigin: true,
          secure: false,
          headers: {
            Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
          },
          rewrite: (path) => path.replace(/^\/edge-tts-ws/, ""),
        },
        "/google-tts": {
          target: "https://translate.googleapis.com",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/google-tts/, ""),
        },
      },
    },
  },
});
