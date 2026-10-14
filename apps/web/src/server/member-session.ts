// Client-safe member session surface, imported by route guards (which
// routeTree.gen.ts pulls into BOTH bundles). Keep DB/JWT imports out of this
// file; the implementation lives in member-session-core.ts and is loaded
// dynamically so the browser never fetches it.
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const MEMBER_SESSION_COOKIE = "cv_session";
export const MEMBER_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type { SessionMember } from "./member-session-core.js";

export const getMemberSession = createServerFn({ method: "GET" }).handler(async () => {
  const { memberFromToken } = await import("./member-session-core.js");
  return memberFromToken(getCookie(MEMBER_SESSION_COOKIE));
});
