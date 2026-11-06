import { createHash, randomBytes, randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Context } from "hono";
import type { z } from "zod";
import { AppError } from "../../middleware/error-handler.js";
import {
  DUMMY_BCRYPT_HASH,
  computeLockoutUntil,
  formatLockedUntil,
  isLockedOut,
} from "../../lib/lockout.js";
import { leadgenSettings, sendPlatformSms } from "../../lib/leadgen.js";
import { normalizeEmail, normalizePhone, sendEmail, sendSms } from "../../lib/messaging.js";
import { notify } from "../../lib/notify.js";
import { slugify } from "../../lib/slug.js";
import { withTransaction } from "../../lib/tx.js";
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

// A phone number another member already signs in with can't be used again.
export async function usablePhone(raw: string, exceptId = 0) {
  const phone = normalizePhone(raw);
  if (!phone) throw new AppError("Enter a valid phone number, e.g. 024 123 4567.", 422);
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT id FROM users WHERE login_phone = ? AND id <> ?", [phone, exceptId]);
  if (rows[0]) throw new AppError("That phone number is already on another account.", 409);
  return phone;
}

export async function register(input: z.infer<typeof registerSchema>) {
  const pool = getPool();
  // Checked now so they find out straight away; it's theirs to sign in with once they've confirmed it.
  await usablePhone(input.phone);
  const [existing] = await pool.execute<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [input.email]);
  if (existing[0]) throw new AppError("An account with that email already exists. Sign in instead.", 409);
  const username = await uniqueUsername(input.fullName);
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users (full_name, username, email, phone, password_hash, member_type, last_login_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [input.fullName, username, input.email, input.phone, await bcrypt.hash(input.password, 12), input.memberType],
  );
  return result.insertId;
}

// Finds an account by whichever the member typed. Null when it's neither a valid email nor phone.
function identifierLookup(identifier: string) {
  if (identifier.includes("@")) {
    const email = normalizeEmail(identifier);
    return email ? { column: "email", value: email, channel: "email" as const } : null;
  }
  const phone = normalizePhone(identifier);
  return phone ? { column: "login_phone", value: phone, channel: "sms" as const } : null;
}

export async function login(input: z.output<typeof loginSchema>) {
  const pool = getPool();
  const lookup = identifierLookup(input.identifier);
  const [rows] = lookup
    ? await pool.execute<RowDataPacket[]>(`SELECT id, password_hash, failed_login_attempts, locked_until, is_active FROM users WHERE ${lookup.column} = ?`, [lookup.value])
    : [[] as Array<RowDataPacket>];
  const user = rows[0];
  if (!user || !user.is_active) {
    await bcrypt.compare(input.password, DUMMY_BCRYPT_HASH);
    throw new AppError("Invalid email, phone number or password.", 401);
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
    throw new AppError("Invalid email, phone number or password.", 401);
  }
  await pool.execute(
    "UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = ?",
    [user.id],
  );
  return user.id as number;
}

// ---- Password reset ----------------------------------------------------------------------------

const RESET_MINUTES = 30;
const RESETS_PER_HOUR = 3;
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

const plainEmail = (paragraphs: Array<string>) => `<div style="font-family:sans-serif;font-size:15px;line-height:1.5">${paragraphs.map((p) => `<p>${p}</p>`).join("")}</div>`;

// Runs in the background of the request. Sends the link through the channel the
// member gave. Accounts that only use Google have no password to reset, so an
// email address gets a pointer to Google instead.
export async function requestPasswordReset(identifier: string, baseUrl: string) {
  const lookup = identifierLookup(identifier);
  if (!lookup) return;
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(`SELECT id, email, login_phone, password_hash, is_active FROM users WHERE ${lookup.column} = ?`, [lookup.value]);
  const user = rows[0];
  if (!user?.is_active) return;
  if (!user.password_hash) {
    if (lookup.channel === "email") {
      const text = "You asked to reset your Capevars password, but you joined with Google, so there's no password to reset. Sign in with Continue with Google instead.";
      await sendEmail({ fromName: "Capevars", to: user.email as string, subject: "Sign in to Capevars with Google", text, html: plainEmail([text]) });
    }
    return;
  }
  const [recent] = await pool.execute<RowDataPacket[]>("SELECT COUNT(*) AS n FROM password_resets WHERE user_id = ? AND created_at > UTC_TIMESTAMP() - INTERVAL 1 HOUR", [user.id]);
  if (Number(recent[0]?.n) >= RESETS_PER_HOUR) return;
  const token = randomBytes(32).toString("base64url");
  await pool.execute("UPDATE password_resets SET used_at = UTC_TIMESTAMP() WHERE user_id = ? AND used_at IS NULL", [user.id]);
  await pool.execute(
    "INSERT INTO password_resets (user_id, token_hash, channel, expires_at, created_at) VALUES (?, ?, ?, UTC_TIMESTAMP() + INTERVAL ? MINUTE, UTC_TIMESTAMP())",
    [user.id, hashToken(token), lookup.channel, RESET_MINUTES],
  );
  const link = `${baseUrl}/reset-password?token=${token}`;
  if (lookup.channel === "sms") {
    const settings = await leadgenSettings();
    const [sent] = await sendSms(settings.defaultSmsSender, `Reset your Capevars password: ${link} It works once and expires in ${RESET_MINUTES} minutes. Didn't ask? Ignore this.`, [{ number: user.login_phone as string }]);
    if (!sent?.ok) console.error(`Password reset SMS failed for member #${user.id}: ${sent?.status ?? "no result"}`);
    return;
  }
  const lines = [`Someone asked to reset your Capevars password. Use this link to choose a new one. It works once and expires in ${RESET_MINUTES} minutes:`, link, "If it wasn't you, ignore this email and your password stays the same."];
  await sendEmail({
    fromName: "Capevars",
    to: user.email as string,
    subject: "Reset your Capevars password",
    text: lines.join("\n\n"),
    html: plainEmail([lines[0]!, `<a href="${link}">Choose a new password</a>`, lines[2]!]),
  });
}

// ---- Confirming a phone number -------------------------------------------------------------------

const CODE_MINUTES = 10;
const CODE_TRIES = 5;
const RESEND_SECONDS = 60;
const CODES_PER_HOUR = 5;
// Each text costs credit and lands on someone's phone, so these also cap what a script could trigger.
// The address limit is generous because mobile networks put many people behind one.
const CODES_PER_HOUR_PER_ADDRESS = 30;
const CODES_PER_HOUR_SITEWIDE = 500;
const NEW_ACCOUNT_MINUTES = 60;
// Who's asking for a text, for the limit on those. Unknown means no limit by address.
export const clientAddress = (c: Context) => c.req.header("cf-connecting-ip") ?? c.req.header("x-real-ip") ?? c.req.header("x-forwarded-for")?.split(",").at(-1)?.trim() ?? null;
const hashCode = (userId: number, phone: string, code: string) => hashToken(`${userId}:${phone}:${code}`);

// A sign-in number can reset the account, so adding or changing one needs the
// password, except while first joining. Without a password there's nothing it could reset.
async function phoneAccess(userId: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    "SELECT phone, login_phone, password_hash, created_at > NOW() - INTERVAL ? MINUTE AS is_new FROM users WHERE id = ?",
    [NEW_ACCOUNT_MINUTES, userId],
  );
  const user = rows[0];
  if (!user) throw new AppError("Account not found.", 404);
  return { user, passwordNeeded: Boolean(user.password_hash) && !(Number(user.is_new) === 1 && !user.login_phone) };
}

export async function phoneStatus(userId: number) {
  const { user, passwordNeeded } = await phoneAccess(userId);
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT phone, TIMESTAMPDIFF(SECOND, UTC_TIMESTAMP(), created_at + INTERVAL ? SECOND) AS wait FROM phone_verifications
     WHERE user_id = ? AND used_at IS NULL AND expires_at > UTC_TIMESTAMP() AND attempts < ? ORDER BY id DESC LIMIT 1`,
    [RESEND_SECONDS, userId, CODE_TRIES],
  );
  return {
    loginPhone: (user.login_phone as string | null) ?? null,
    suggested: user.login_phone ? null : normalizePhone(user.phone),
    passwordNeeded,
    pending: rows[0] ? { phone: rows[0].phone as string, retryAfter: Math.max(0, Number(rows[0].wait)) } : null,
  };
}

// Records a new code and returns the job that texts it. Asking again replaces any earlier code.
export async function issuePhoneCode(userId: number, raw: string, address: string | null) {
  const phone = await usablePhone(raw, userId);
  const pool = getPool();
  const [limits] = await pool.execute<RowDataPacket[]>(
    `SELECT
       (SELECT login_phone FROM users WHERE id = ?) AS current_phone,
       (SELECT COUNT(*) FROM phone_verifications WHERE user_id = ? AND created_at > UTC_TIMESTAMP() - INTERVAL ? SECOND) AS just_sent,
       (SELECT COUNT(*) FROM phone_verifications WHERE user_id = ? AND created_at > UTC_TIMESTAMP() - INTERVAL 1 HOUR) AS member,
       (SELECT COUNT(*) FROM phone_verifications WHERE phone = ? AND created_at > UTC_TIMESTAMP() - INTERVAL 1 HOUR) AS number,
       (SELECT COUNT(*) FROM phone_verifications WHERE ip = ? AND created_at > UTC_TIMESTAMP() - INTERVAL 1 HOUR) AS address,
       (SELECT COUNT(*) FROM phone_verifications WHERE created_at > UTC_TIMESTAMP() - INTERVAL 1 HOUR) AS sitewide`,
    [userId, userId, RESEND_SECONDS, userId, phone, address ?? ""],
  );
  const n = limits[0]!;
  if (n.current_phone === phone) throw new AppError("That's already your sign-in number.", 409);
  if (Number(n.just_sent)) throw new AppError("Please wait a minute before asking for another code.", 429);
  if (Number(n.member) >= CODES_PER_HOUR || Number(n.number) >= CODES_PER_HOUR) throw new AppError("Too many codes asked for. Try again in an hour.", 429);
  if (Number(n.address) >= CODES_PER_HOUR_PER_ADDRESS || Number(n.sitewide) >= CODES_PER_HOUR_SITEWIDE) throw new AppError("We can't send a code right now. Try again later.", 429);
  const code = String(randomInt(100000, 1000000));
  await pool.execute("UPDATE phone_verifications SET used_at = UTC_TIMESTAMP() WHERE user_id = ? AND used_at IS NULL", [userId]);
  const [row] = await pool.execute<ResultSetHeader>(
    "INSERT INTO phone_verifications (user_id, phone, code_hash, ip, expires_at, created_at) VALUES (?, ?, ?, ?, UTC_TIMESTAMP() + INTERVAL ? MINUTE, UTC_TIMESTAMP())",
    [userId, phone, hashCode(userId, phone, code), address, CODE_MINUTES],
  );
  return async () => {
    const status = await sendPlatformSms(phone, `Your Capevars code is ${code}. It expires in ${CODE_MINUTES} minutes. Don't share it with anyone.`);
    if (!status.startsWith("failed")) return;
    await pool.execute("UPDATE phone_verifications SET used_at = UTC_TIMESTAMP() WHERE id = ?", [row.insertId]);
    console.error(`Phone code SMS failed for member #${userId}: ${status}`);
    throw new AppError("We couldn't text that number just now. Check it and try again.", 400);
  };
}

export async function requestPhoneCode(userId: number, raw: string, currentPassword: string | undefined, address: string | null) {
  const { user, passwordNeeded } = await phoneAccess(userId);
  if (passwordNeeded && !(currentPassword && (await bcrypt.compare(currentPassword, user.password_hash as string)))) {
    throw new AppError("Current password is incorrect.", 401);
  }
  await (await issuePhoneCode(userId, raw, address))();
}

export async function confirmPhoneCode(userId: number, code: string) {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT id, phone, code_hash FROM phone_verifications WHERE user_id = ? AND used_at IS NULL AND expires_at > UTC_TIMESTAMP() ORDER BY id DESC LIMIT 1",
    [userId],
  );
  const row = rows[0];
  if (!row) throw new AppError("That code has expired. Ask for a new one.", 400);
  // Counted first, so guesses sent at the same moment can't get past the limit.
  const [counted] = await pool.execute<ResultSetHeader>("UPDATE phone_verifications SET attempts = attempts + 1 WHERE id = ? AND attempts < ?", [row.id, CODE_TRIES]);
  if (!counted.affectedRows) throw new AppError("Too many wrong tries. Ask for a new code.", 429);
  if (hashCode(userId, row.phone as string, code) !== row.code_hash) throw new AppError("That code isn't right.", 400);
  const previous = await withTransaction(async (conn) => {
    const [claimed] = await conn.execute<ResultSetHeader>("UPDATE phone_verifications SET used_at = UTC_TIMESTAMP() WHERE id = ? AND used_at IS NULL", [row.id]);
    if (!claimed.affectedRows) throw new AppError("That code has expired. Ask for a new one.", 400);
    const [users] = await conn.execute<RowDataPacket[]>("SELECT login_phone, email FROM users WHERE id = ? FOR UPDATE", [userId]);
    try {
      await conn.execute("UPDATE users SET login_phone = ?, phone = COALESCE(phone, ?) WHERE id = ?", [row.phone, row.phone, userId]);
    } catch (err) {
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new AppError("That phone number is already on another account.", 409);
      throw err;
    }
    return users[0];
  });
  if (previous?.login_phone) phoneChangedNotice(userId, previous.email as string);
}

function phoneChangedNotice(userId: number, email: string) {
  notify(userId, { kind: "account", title: "Your sign-in phone number was changed", link: "/account/security" });
  const text = "The phone number you sign in with on Capevars was just changed. If this wasn't you, reset your password straight away and contact support.";
  void sendEmail({ fromName: "Capevars", to: email, subject: "Your Capevars phone number was changed", text, html: plainEmail([text]) }).catch((err) => console.error("Phone change email failed:", err));
}

// Tells the member, so a change they didn't make doesn't go unnoticed.
export function passwordChangedNotice(userId: number, email: string) {
  notify(userId, { kind: "account", title: "Your password was changed", link: "/account/security" });
  const text = "Your Capevars password was just changed, and other devices were signed out. If this wasn't you, reset your password straight away and contact support.";
  void sendEmail({ fromName: "Capevars", to: email, subject: "Your Capevars password was changed", text, html: plainEmail([text]) }).catch((err) => console.error("Password change email failed:", err));
}

export async function resetPassword(token: string, newPassword: string) {
  const hash = await bcrypt.hash(newPassword, 12);
  const member = await withTransaction(async (conn) => {
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT r.id, r.user_id, u.email FROM password_resets r JOIN users u ON u.id = r.user_id AND u.is_active = 1
       WHERE r.token_hash = ? AND r.used_at IS NULL AND r.expires_at > UTC_TIMESTAMP() FOR UPDATE`,
      [hashToken(token)],
    );
    const row = rows[0];
    if (!row) throw new AppError("This reset link has expired or was already used.", 400);
    // A successful reset also clears any sign-in lockout and ends every existing session.
    await conn.execute("UPDATE users SET password_hash = ?, failed_login_attempts = 0, locked_until = NULL, session_valid_from = UNIX_TIMESTAMP() WHERE id = ?", [hash, row.user_id]);
    await conn.execute("UPDATE password_resets SET used_at = UTC_TIMESTAMP() WHERE user_id = ? AND used_at IS NULL", [row.user_id]);
    return row;
  });
  passwordChangedNotice(member.user_id as number, member.email as string);
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
