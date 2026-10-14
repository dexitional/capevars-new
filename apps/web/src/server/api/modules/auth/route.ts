// Member accounts: email/password and "Continue with Google".
//
//   POST /api/auth/register | /login | /logout
//   GET  /api/auth/me
//   GET  /api/auth/google?next=/path   → Google consent screen
//   GET  /api/auth/google/callback     → exchange the code, start a session
//
// Configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, with the redirect URI
// {APP_URL}/api/auth/google/callback registered in Google Cloud.
import { randomBytes } from "node:crypto";
import { Hono } from "hono";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import {
  endMemberSession,
  loadSessionMember,
  memberOrNull,
  optionalMember,
  startMemberSession,
} from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import * as service from "./service.js";

const STATE_COOKIE = "cv_oauth";
const secure = () => process.env.NODE_ENV === "production";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(150),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(150),
  password: z.string().min(8, "Use at least 8 characters").max(200),
  memberType: z.enum(["public", "student", "staff", "alumni"]).default("public"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});

function googleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

function redirectUri(c: Context) {
  const base = (process.env.APP_URL || new URL(c.req.url).origin).replace(/\/$/, "");
  return `${base}/api/auth/google/callback`;
}

// Only same-site paths, so ?next= can't be used as an open redirect.
const safeNext = (value: string | undefined) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value.slice(0, 300) : "/";

const devLoginEnabled = () =>
  process.env.NODE_ENV !== "production" && process.env.MEMBER_DEV_LOGIN === "true";

function decodeIdToken(idToken: string): Record<string, unknown> | null {
  try {
    const part = idToken.split(".")[1];
    return part ? (JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const authRoute = new Hono()
  .get("/config", (c) => c.json({ google: Boolean(googleConfig()), devLogin: devLoginEnabled() }))
  .get("/me", optionalMember, (c) => c.json({ member: memberOrNull(c) }))
  .post("/register", validate("json", registerSchema), async (c) => {
    const id = await service.register(c.req.valid("json"));
    await startMemberSession(c, id);
    return c.json({ member: await loadSessionMember(id) }, 201);
  })
  .post("/login", validate("json", loginSchema), async (c) => {
    const id = await service.login(c.req.valid("json"));
    await startMemberSession(c, id);
    return c.json({ member: await loadSessionMember(id) });
  })
  .post("/logout", (c) => {
    endMemberSession(c);
    return c.json({ ok: true });
  })
  .get("/google", (c) => {
    const next = safeNext(c.req.query("next"));
    const config = googleConfig();
    if (!config) return c.redirect(`/login?error=google_not_configured&next=${encodeURIComponent(next)}`, 302);
    const state = randomBytes(24).toString("base64url");
    setCookie(c, STATE_COOKIE, `${state}|${next}`, {
      httpOnly: true,
      secure: secure(),
      sameSite: "Lax",
      path: "/api/auth",
      maxAge: 600,
    });
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri(c),
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });
    return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 302);
  })
  .get("/google/callback", async (c) => {
    const config = googleConfig();
    const [expected, nextRaw] = (getCookie(c, STATE_COOKIE) ?? "").split("|");
    const next = safeNext(nextRaw);
    deleteCookie(c, STATE_COOKIE, { path: "/api/auth" });
    const fail = (error: string) => c.redirect(`/login?error=${error}&next=${encodeURIComponent(next)}`, 302);
    if (!config) return fail("google_not_configured");
    const { code, state, error } = c.req.query();
    if (error) return fail("cancelled");
    if (!code || !state || !expected || state !== expected) return fail("invalid_state");

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: redirectUri(c),
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(15_000),
    }).catch(() => null);
    if (!res?.ok) return fail("google_failed");
    const tokens = (await res.json()) as { id_token?: string };
    // The id_token comes straight from Google's token endpoint over TLS in
    // exchange for our client secret, so (OpenID Connect Core 3.1.3.7) its
    // signature need not be re-verified; issuer and audience still are.
    const claims = tokens.id_token ? decodeIdToken(tokens.id_token) : null;
    if (
      !claims ||
      claims.aud !== config.clientId ||
      !["accounts.google.com", "https://accounts.google.com"].includes(String(claims.iss)) ||
      typeof claims.sub !== "string" ||
      typeof claims.email !== "string" ||
      claims.email_verified !== true
    ) {
      return fail("google_failed");
    }
    const result = await service.signInWithGoogle({
      sub: claims.sub,
      email: claims.email.toLowerCase(),
      name: typeof claims.name === "string" ? claims.name : null,
      picture: typeof claims.picture === "string" ? claims.picture : null,
    });
    if ("error" in result) return fail(result.error);
    await startMemberSession(c, result.id);
    return c.redirect(result.isNew ? `/welcome?next=${encodeURIComponent(next)}` : next, 302);
  })
  // Local development without Google credentials (MEMBER_DEV_LOGIN=true).
  .get("/dev", async (c) => {
    if (!devLoginEnabled()) return c.json({ error: "Not found" }, 404);
    const email = (c.req.query("email") ?? "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return c.json({ error: "Pass ?email=" }, 400);
    const result = await service.signInWithGoogle({ sub: `dev:${email}`, email, name: null, picture: null });
    if ("error" in result) return c.json({ error: result.error }, 403);
    await startMemberSession(c, result.id);
    return c.redirect(safeNext(c.req.query("next")), 302);
  });
