import { defineConfig, loadEnv } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { parseImageHosts } from "./src/lib/image";

export default defineConfig(({ mode }) => {
  // .env plus the real environment (which wins), as the server will see it.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // Which image hosts the browser sends through /img (see src/lib/image.ts).
    // Baked in at build time, so rebuild after changing IMAGE_REMOTE_HOSTS.
    define: {
      __IMAGE_HOSTS__: JSON.stringify(
        parseImageHosts(env.R2_PUBLIC_DOMAIN, env.IMAGE_REMOTE_HOSTS),
      ),
      // Optional CDN origin for /files and /img URLs (see src/lib/asset.ts).
      __CDN_URL__: JSON.stringify((env.CDN_URL ?? "").trim().replace(/\/+$/, "")),
    },
    // Optional override, e.g. when node_modules/.vite isn't writable.
    cacheDir: process.env.VITE_CACHE_DIR,
    // Dev only: compile the admin portal and site pages in the background as
    // soon as the server starts, instead of on the first visit to each page
    // (which made first clicks around the admin take ~2s each).
    server: {
      warmup: {
        clientFiles: ["./src/routes/admin/**/*.tsx", "./src/components/admin/**/*.tsx", "./src/routes/_site/**/*.tsx"],
      },
    },
    resolve: { tsconfigPaths: true },
    plugins: [
      devtools(),
      nitro({
        // Optional override, like VITE_CACHE_DIR, for when node_modules/.nitro
        // isn't writable (e.g. created by an earlier run with sudo).
        ...(process.env.NITRO_BUILD_DIR ? { buildDir: process.env.NITRO_BUILD_DIR } : {}),
        // Image optimiser (src/server/image-optimizer.ts) and the local file store.
        handlers: [
          { route: "/img", method: "GET", handler: "./src/server/img-handler.ts" },
          // Uploads in local storage (src/server/file-server.ts).
          { route: "/files/**", handler: "./src/server/files-handler.ts" },
        ],
        routeRules: {
          "/assets/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
          "/logo.webp": { headers: { "cache-control": "public, max-age=604800" } },
          "/logo-mark.png": { headers: { "cache-control": "public, max-age=604800" } },
          "/logo-mark-light.png": { headers: { "cache-control": "public, max-age=604800" } },
        },
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  };
});
