// Member (public account) sessions. Server-only: imported by Hono modules
// and, dynamically, by member-session.ts.
//
// Signed with a key derived from ADMIN_SESSION_SECRET rather than the secret
// itself, so a member token can never pass as an admin token (both carry a
// numeric `sub`) and no extra secret has to be configured.
import { createHmac } from "node:crypto";
import type { Context, Next } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { getPool } from "@cv/db";
import type { MemberType, SellerStatus } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { AppError } from "./api/middleware/error-handler.js";
import { MEMBER_SESSION_COOKIE, MEMBER_SESSION_TTL_SECONDS } from "./member-session.js";

export interface SessionMember {
  id: number;
  fullName: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  headline: string | null;
  memberType: MemberType;
  isVerified: boolean;
  hasPassword: boolean;
  seller: { id: number; slug: string; storeName: string; status: SellerStatus; kinds: Array<string> } | null;
}

declare module "hono" {
  interface ContextVariableMap {
    member: SessionMember;
  }
}

function memberKey(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be set to at least 32 characters.");
  }
  return createHmac("sha256", secret).update("capevars:member-session:v1").digest("hex");
}

export async function signMemberToken(userId: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return sign(
    { sub: userId, aud: "member", iat: now, exp: now + MEMBER_SESSION_TTL_SECONDS },
    memberKey(),
    "HS256",
  );
}

async function readMemberId(token: string | undefined): Promise<number | null> {
  if (!token) return null;
  try {
    const payload = await verify(token, memberKey(), "HS256");
    if (payload.aud !== "member") return null;
    const id = Number(payload.sub);
    return Number.isFinite(id) ? id : null;
  } catch {
    return null;
  }
}

export async function loadSessionMember(id: number): Promise<SessionMember | null> {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT u.id, u.full_name, u.username, u.email, u.avatar_url, u.headline, u.member_type,
            u.is_verified, u.password_hash IS NOT NULL AS has_password,
            s.id AS seller_id, s.slug AS seller_slug, s.store_name, s.status AS seller_status, s.kinds
       FROM users u LEFT JOIN sellers s ON s.user_id = u.id
      WHERE u.id = ? AND u.is_active = 1`,
    [id],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.id,
    fullName: r.full_name,
    username: r.username,
    email: r.email,
    avatarUrl: r.avatar_url,
    headline: r.headline,
    memberType: r.member_type,
    isVerified: r.is_verified === 1,
    hasPassword: Number(r.has_password) === 1,
    seller: r.seller_id
      ? {
          id: r.seller_id,
          slug: r.seller_slug,
          storeName: r.store_name,
          status: r.seller_status,
          kinds: String(r.kinds ?? "").split(",").filter(Boolean),
        }
      : null,
  };
}

export async function memberFromToken(token: string | undefined): Promise<SessionMember | null> {
  const id = await readMemberId(token);
  return id ? loadSessionMember(id) : null;
}

export async function startMemberSession(c: Context, userId: number) {
  // A parent sign-in replaces child mode on a shared browser.
  deleteCookie(c, "cv_kidi_child", { path: "/" });
  setCookie(c, MEMBER_SESSION_COOKIE, await signMemberToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: MEMBER_SESSION_TTL_SECONDS,
  });
}

export function endMemberSession(c: Context) {
  deleteCookie(c, MEMBER_SESSION_COOKIE, { path: "/" });
}

export async function getMember(c: Context) {
  return memberFromToken(getCookie(c, MEMBER_SESSION_COOKIE));
}

// Presence for chat ("active now"): at most one write every two minutes.
function touch(id: number) {
  getPool()
    .execute(
      "UPDATE users SET last_seen_at = NOW() WHERE id = ? AND (last_seen_at IS NULL OR last_seen_at < NOW() - INTERVAL 2 MINUTE)",
      [id],
    )
    .catch(() => undefined);
}

export async function requireMember(c: Context, next: Next) {
  const member = await getMember(c);
  if (!member) throw new AppError("Please sign in to continue.", 401);
  touch(member.id);
  c.set("member", member);
  await next();
}

// Sets c.var.member when signed in; never rejects.
export async function optionalMember(c: Context, next: Next) {
  const member = await getMember(c);
  if (member) c.set("member", member);
  await next();
}

export const memberOrNull = (c: Context): SessionMember | null => c.get("member") ?? null;

// Approved seller with (optionally) a given capability, e.g. "food" or "events".
export function requireSeller(kind?: string) {
  return async (c: Context, next: Next) => {
    const member = await getMember(c);
    if (!member) throw new AppError("Please sign in to continue.", 401);
    if (!member.seller) throw new AppError("Open a store first.", 403);
    if (member.seller.status !== "approved")
      throw new AppError("Your store is awaiting approval.", 403);
    if (kind && !member.seller.kinds.includes(kind))
      throw new AppError(`Your store isn't approved for ${kind}. Request it in Store settings.`, 403);
    c.set("member", member);
    await next();
  };
}
