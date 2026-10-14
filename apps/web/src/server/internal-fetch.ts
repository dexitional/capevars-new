// Server-side API calls during SSR (route loaders). The browser reaches the
// Hono app over HTTP at /api; on the server there's no origin to fetch from,
// so the request goes straight into the app in-process, carrying the
// visitor's cookies so member-specific data renders correctly.
import { getRequestHeader } from "@tanstack/react-start/server";

export async function serverFetch(path: string, init?: RequestInit) {
  const { apiApp } = await import("./api/app");
  const headers = new Headers(init?.headers);
  try {
    const cookie = getRequestHeader("cookie");
    if (cookie) headers.set("cookie", cookie);
  } catch {
    // Outside a request (e.g. a script): no cookies to forward.
  }
  const url = new URL(path.replace(/^\/api/, "") || "/", "http://internal.capevars");
  return apiApp.fetch(new Request(url, { ...init, headers }));
}
