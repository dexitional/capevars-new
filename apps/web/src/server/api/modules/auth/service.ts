import bcrypt from "bcryptjs";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { z } from "zod";
import { AppError } from "../../middleware/error-handler.js";
import {
  DUMMY_BCRYPT_HASH,
  computeLockoutUntil,
  formatLockedUntil,
  isLockedOut,
} from "../../lib/lockout.js";
import { slugify } from "../../lib/slug.js";
import type { loginSchema, registerSchema } from "./route.js";

const RESERVED = new Set([
  "admin", "api", "market", "finder", "groups", "social", "learn", "login", "signup", "account",
  "seller", "support", "help", "settings", "capevars", "me", "u", "welcome", "search",
]);

// "Ama Mensah" → "ama.mensah", then "ama.mensah2", ... until free.
export async function uniqueUsername(seed: string) {
  const base =
    slugify(seed).replace(/-/g, ".").replace(/[^a-z0-9.]/g, "").replace(/^\.+|\.+$/g, "").slice(0, 30) ||
    "member";
  const root = base.length < 3 || RESERVED.has(base) ? `${base}.cv` : base;
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT username FROM users WHERE username = ? OR username LIKE ?",
    [root, `${root}%`],
  );
  const taken = new Set(rows.map((r) => r.username as string));
  if (!taken.has(root)) return root;
  for (let n = 2; ; n++) if (!taken.has(`${root}${n}`)) return `${root}${n}`;
}

export async function register(input: z.infer<typeof registerSchema>) {
  const pool = getPool();
  const [existing] = await pool.execute<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [input.email]);
  if (existing[0]) throw new AppError("An account with that email already exists. Sign in instead.", 409);
  const username = await uniqueUsername(input.fullName);
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (full_name, username, email, password_hash, member_type, last_login_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [input.fullName, username, input.email, await bcrypt.hash(input.password, 12), input.memberType],
  );
  return result.insertId;
}

export async function login(input: z.infer<typeof loginSchema>) {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, password_hash, failed_login_attempts, locked_until, is_active FROM users WHERE email = ?",
    [input.email],
  );
  const user = rows[0];
  if (!user || !user.is_active) {
    await bcrypt.compare(input.password, DUMMY_BCRYPT_HASH);
    throw new AppError("Invalid email or password.", 401);
  }
  if (!user.password_hash) {
    throw new AppError("This account uses Google sign-in. Continue with Google instead.", 401);
  }
  if (isLockedOut(user.locked_until)) {
    throw new AppError(
      `Too many attempts. Try again after ${formatLockedUntil(user.locked_until)}.`,
      429,
    );
  }
  if (!(await bcrypt.compare(input.password, user.password_hash))) {
    const failed = user.failed_login_attempts + 1;
    await pool.execute("UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?", [
      failed,
      computeLockoutUntil(failed),
      user.id,
    ]);
    throw new AppError("Invalid email or password.", 401);
  }
  await pool.execute(
    "UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = ?",
    [user.id],
  );
  return user.id as number;
}

// Finds the member by Google id, else links Google to an existing account
// with the same (Google-verified) email, else creates a new account.
export async function signInWithGoogle(profile: {
  sub: string;
  email: string;
  name: string | null;
  picture: string | null;
}): Promise<{ id: number; isNew: boolean } | { error: string }> {
  const pool = getPool();
  const [bySub] = await pool.execute<RowDataPacket[]>("SELECT id, is_active FROM users WHERE google_sub = ?", [
    profile.sub,
  ]);
  if (bySub[0]) {
    if (!bySub[0].is_active) return { error: "suspended" };
    await pool.execute(
      "UPDATE users SET last_login_at = NOW(), avatar_url = COALESCE(avatar_url, ?) WHERE id = ?",
      [profile.picture, bySub[0].id],
    );
    return { id: bySub[0].id, isNew: false };
  }
  const [byEmail] = await pool.execute<RowDataPacket[]>("SELECT id, is_active FROM users WHERE email = ?", [
    profile.email,
  ]);
  if (byEmail[0]) {
    if (!byEmail[0].is_active) return { error: "suspended" };
    await pool.execute(
      "UPDATE users SET google_sub = ?, last_login_at = NOW(), avatar_url = COALESCE(avatar_url, ?) WHERE id = ?",
      [profile.sub, profile.picture, byEmail[0].id],
    );
    return { id: byEmail[0].id, isNew: false };
  }
  const fullName = profile.name?.trim() || profile.email.split("@")[0]!;
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (full_name, username, email, google_sub, avatar_url, last_login_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [fullName, await uniqueUsername(fullName), profile.email, profile.sub, profile.picture],
  );
  return { id: result.insertId, isNew: true };
}
