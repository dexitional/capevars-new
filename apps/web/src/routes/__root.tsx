import { useEffect } from "react";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Toaster } from "sonner";
import type { QueryClient } from "@tanstack/react-query";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import { asset } from "#/lib/asset";
import { NotFoundPage } from "#/components/site/not-found";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Capevars — Innovation in style" },
      {
        name: "description",
        content:
          "Capevars brings your campus and community together: a marketplace, The Finder, campus groups, a social network and online courses — with one account.",
      },
      { name: "theme-color", content: "#041d40" },
      { property: "og:site_name", content: "Capevars" },
      { property: "og:image", content: asset("og.png") },
    ],
    links: [
      { rel: "icon", type: "image/png", href: asset("favicon.png") },
      { rel: "apple-touch-icon", href: asset("favicon.png") },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  // A tab left open across a deploy still references the previous build's
  // hashed chunks; reload once on Vite's preload error to pick up the new
  // build (guarded so a genuinely broken deploy can't reload-loop).
  useEffect(() => {
    const key = "cv-preload-error-reload";
    const clearFlag = setTimeout(() => sessionStorage.removeItem(key), 5000);
    function handlePreloadError(event: Event) {
      event.preventDefault();
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      window.location.reload();
    }
    window.addEventListener("vite:preloadError", handlePreloadError);
    return () => {
      clearTimeout(clearFlag);
      window.removeEventListener("vite:preloadError", handlePreloadError);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-right" />
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> }, TanStackQueryDevtools]}
          />
        )}
        <Scripts />
      </body>
    </html>
  );
}
