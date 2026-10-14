// Chats: private friend-to-friend messages, public forum rooms, and
// members-only rooms for each campus group and each course. Clients poll
// GET /threads/:id/messages?after=<last id> for new messages.
import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requireMember } from "#/server/member-session-core";
import type { SessionMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl } from "../../lib/fields.js";
import { slugify } from "../../lib/slug.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { pairKey, userFields } from "../../lib/members.js";
import { areFriends } from "../social/route.js";

const messageSchema = z.object({ body: optionalText(4000), attachmentUrl: optionalUrl });
const roomSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: optionalText(500),
  icon: optionalText(40),
});

async function canAccess(thread: RowDataPacket, member: SessionMember) {
  const pool = getPool();
  switch (thread.type) {
    case "forum":
      return thread.is_public === 1;
    case "direct": {
      const [rows] = await pool.execute<RowDataPacket[]>("SELECT 1 FROM chat_participants WHERE thread_id = ? AND user_id = ?", [thread.id, member.id]);
      return Boolean(rows[0]);
    }
    case "group": {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ? AND status = 'active'",
        [thread.ref_id, member.id],
      );
      return Boolean(rows[0]);
    }
    case "course": {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT 1 FROM courses c WHERE c.id = ? AND (c.instructor_id = ? OR EXISTS
           (SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = ? AND e.status IN ('active', 'completed')))`,
        [thread.ref_id, member.id, member.id],
      );
      return Boolean(rows[0]);
    }
    default:
      return false;
  }
}

async function openThread(c: Context, threadId: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM chat_threads WHERE id = ?", [threadId]);
  const thread = rows[0];
  if (!thread || !(await canAccess(thread, c.get("member")))) throw new AppError("Chat not found.", 404);
  return thread;
}

// Group and course rooms are created the first time someone opens them.
async function ensureRoom(type: "group" | "course", refId: number, title: string, createdBy: number) {
  await getPool().execute(
    "INSERT IGNORE INTO chat_threads (type, ref_id, title, created_by) VALUES (?, ?, ?, ?)",
    [type, refId, title, createdBy],
  );
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT id FROM chat_threads WHERE type = ? AND ref_id = ?", [type, refId]);
  return rows[0]!.id as number;
}

const markRead = (threadId: number, userId: number) =>
  getPool().execute(
    `INSERT INTO chat_participants (thread_id, user_id, last_read_at) VALUES (?, ?, NOW())
     ON DUPLICATE KEY UPDATE last_read_at = NOW()`,
    [threadId, userId],
  );

export const chatRoute = new Hono()
  .use("*", requireMember)
  .get("/threads", async (c) => {
    const me = c.get("member").id;
    const pool = getPool();
    const [[direct], [rooms]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT t.id, t.type, t.last_message_at, p.last_read_at,
           (t.last_message_at IS NOT NULL AND (p.last_read_at IS NULL OR p.last_read_at < t.last_message_at)) AS unread,
           (SELECT body FROM chat_messages m WHERE m.thread_id = t.id ORDER BY m.id DESC LIMIT 1) AS last_body,
           (SELECT sender_id FROM chat_messages m WHERE m.thread_id = t.id ORDER BY m.id DESC LIMIT 1) AS last_sender_id,
           ${userFields("u", "other")}, u.last_seen_at AS other_last_seen
         FROM chat_participants p JOIN chat_threads t ON t.id = p.thread_id
         JOIN chat_participants op ON op.thread_id = t.id AND op.user_id <> p.user_id JOIN users u ON u.id = op.user_id
         WHERE p.user_id = ? AND t.type = 'direct' ORDER BY COALESCE(t.last_message_at, t.created_at) DESC LIMIT 100`,
        [me],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT t.id, t.type, t.title, t.slug, t.icon, t.ref_id, t.last_message_at, t.message_count, p.last_read_at,
           (t.last_message_at IS NOT NULL AND (p.last_read_at IS NULL OR p.last_read_at < t.last_message_at)) AS unread,
           g.slug AS group_slug, g.logo_url AS group_logo, co.slug AS course_slug, co.cover_url AS course_cover
         FROM chat_participants p JOIN chat_threads t ON t.id = p.thread_id
         LEFT JOIN campus_groups g ON t.type = 'group' AND g.id = t.ref_id
         LEFT JOIN courses co ON t.type = 'course' AND co.id = t.ref_id
         WHERE p.user_id = ? AND t.type <> 'direct' ORDER BY COALESCE(t.last_message_at, t.created_at) DESC LIMIT 100`,
        [me],
      ),
    ]);
    return c.json({ direct, rooms });
  })
  .get("/forums", async (c) => {
    const me = c.get("member").id;
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT t.id, t.title, t.slug, t.description, t.icon, t.message_count, t.last_message_at,
         (SELECT COUNT(*) FROM chat_participants p WHERE p.thread_id = t.id) AS participant_count,
         EXISTS (SELECT 1 FROM chat_participants p WHERE p.thread_id = t.id AND p.user_id = ?) AS joined
       FROM chat_threads t WHERE t.type = 'forum' AND t.is_public = 1
       ORDER BY t.last_message_at IS NULL, t.last_message_at DESC, t.id`,
      [me],
    );
    return c.json({ items });
  })
  .post("/forums", validate("json", roomSchema), async (c) => {
    const input = c.req.valid("json");
    const member = c.get("member");
    const slug = await getForumSlug(input.title);
    const [res] = await getPool().execute<ResultSetHeader>(
      "INSERT INTO chat_threads (type, title, slug, description, icon, created_by, is_public) VALUES ('forum', ?, ?, ?, ?, ?, 1)",
      [input.title, slug, input.description ?? null, input.icon ?? "message-circle", member.id],
    );
    await markRead(res.insertId, member.id);
    return c.json({ id: res.insertId }, 201);
  })
  .post("/direct/:userId", async (c) => {
    const member = c.get("member");
    const other = Number(c.req.param("userId"));
    if (other === member.id) throw new AppError("You can't message yourself.", 422);
    if (!(await areFriends(member.id, other))) throw new AppError("You can only message friends. Send a friend request first.", 403);
    const key = pairKey(member.id, other);
    const pool = getPool();
    await pool.execute("INSERT IGNORE INTO chat_threads (type, direct_key, created_by) VALUES ('direct', ?, ?)", [key, member.id]);
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT id FROM chat_threads WHERE direct_key = ?", [key]);
    const id = rows[0]!.id as number;
    await pool.execute("INSERT IGNORE INTO chat_participants (thread_id, user_id) VALUES (?, ?), (?, ?)", [id, member.id, id, other]);
    return c.json({ id });
  })
  .get("/group/:groupId", async (c) => {
    const member = c.get("member");
    const groupId = Number(c.req.param("groupId"));
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT g.id, g.name FROM campus_groups g JOIN group_members m ON m.group_id = g.id
       WHERE g.id = ? AND g.status = 'approved' AND m.user_id = ? AND m.status = 'active'`,
      [groupId, member.id],
    );
    if (!rows[0]) throw new AppError("Join the group to use its chat.", 403);
    return c.json({ id: await ensureRoom("group", groupId, rows[0].name, member.id) });
  })
  .get("/course/:courseId", async (c) => {
    const member = c.get("member");
    const courseId = Number(c.req.param("courseId"));
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT c.id, c.title FROM courses c WHERE c.id = ? AND (c.instructor_id = ? OR EXISTS
         (SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = ? AND e.status IN ('active', 'completed')))`,
      [courseId, member.id, member.id],
    );
    if (!rows[0]) throw new AppError("Enrol in the course to use its chat.", 403);
    return c.json({ id: await ensureRoom("course", courseId, rows[0].title, member.id) });
  })
  .get("/threads/:id", async (c) => {
    const thread = await openThread(c, Number(c.req.param("id")));
    const me = c.get("member").id;
    let other = null;
    if (thread.type === "direct") {
      const [rows] = await getPool().execute<RowDataPacket[]>(
        `SELECT u.id, u.full_name, u.username, u.avatar_url, u.headline, u.last_seen_at FROM chat_participants p
         JOIN users u ON u.id = p.user_id WHERE p.thread_id = ? AND p.user_id <> ?`,
        [thread.id, me],
      );
      other = rows[0] ?? null;
    }
    const [count] = await getPool().execute<RowDataPacket[]>("SELECT COUNT(*) AS n FROM chat_participants WHERE thread_id = ?", [thread.id]);
    return c.json({ thread, other, participants: Number(count[0]?.n ?? 0) });
  })
  .get("/threads/:id/messages", async (c) => {
    const thread = await openThread(c, Number(c.req.param("id")));
    const after = Number(c.req.query("after")) || 0;
    const before = Number(c.req.query("before")) || 0;
    const where = ["m.thread_id = ?"];
    const params: Array<number> = [thread.id];
    if (after) {
      where.push("m.id > ?");
      params.push(after);
    }
    if (before) {
      where.push("m.id < ?");
      params.push(before);
    }
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT m.id, m.sender_id, IF(m.is_deleted, NULL, m.body) AS body, IF(m.is_deleted, NULL, m.attachment_url) AS attachment_url,
         m.is_deleted, m.created_at, ${userFields("u", "sender")}
       FROM chat_messages m JOIN users u ON u.id = m.sender_id WHERE ${where.join(" AND ")}
       ORDER BY m.id ${after ? "ASC" : "DESC"} LIMIT ${after ? 200 : 50}`,
      params,
    );
    if (thread.type === "direct" || after === 0 || rows.length) await markRead(thread.id, c.get("member").id);
    return c.json({ items: after ? rows : rows.reverse() });
  })
  .post("/threads/:id/messages", validate("json", messageSchema), async (c) => {
    const member = c.get("member");
    const thread = await openThread(c, Number(c.req.param("id")));
    if (thread.is_locked) throw new AppError("This room is read-only.", 403);
    const input = c.req.valid("json");
    if (!input.body && !input.attachmentUrl) throw new AppError("Message is empty.", 422);
    const pool = getPool();
    const [res] = await pool.execute<ResultSetHeader>(
      "INSERT INTO chat_messages (thread_id, sender_id, body, attachment_url) VALUES (?, ?, ?, ?)",
      [thread.id, member.id, input.body ?? null, input.attachmentUrl ?? null],
    );
    await pool.execute("UPDATE chat_threads SET last_message_at = NOW(), message_count = message_count + 1 WHERE id = ?", [thread.id]);
    await markRead(thread.id, member.id);
    if (thread.type === "direct") {
      const [others] = await pool.execute<RowDataPacket[]>(
        "SELECT user_id, last_read_at FROM chat_participants WHERE thread_id = ? AND user_id <> ?",
        [thread.id, member.id],
      );
      // Only ping (in the bell) when the other person isn't actively reading.
      const o = others[0];
      if (o && (!o.last_read_at || Date.now() - new Date(`${String(o.last_read_at).replace(" ", "T")}Z`).getTime() > 5 * 60_000)) {
        notify(o.user_id, { kind: "message", title: `New message from ${member.fullName}`, body: input.body?.slice(0, 120) ?? "Sent an attachment", link: `/social/chats/${thread.id}`, actorId: member.id });
      }
    }
    return c.json({ id: res.insertId }, 201);
  })
  .delete("/messages/:id", async (c) => {
    const [res] = await getPool().execute<ResultSetHeader>(
      "UPDATE chat_messages SET is_deleted = 1 WHERE id = ? AND sender_id = ?",
      [Number(c.req.param("id")), c.get("member").id],
    );
    if (!res.affectedRows) throw new AppError("Message not found.", 404);
    return c.body(null, 204);
  })
  .post("/threads/:id/leave", async (c) => {
    const thread = await openThread(c, Number(c.req.param("id")));
    if (thread.type === "direct") throw new AppError("You can't leave a private chat.", 409);
    await getPool().execute("DELETE FROM chat_participants WHERE thread_id = ? AND user_id = ?", [thread.id, c.get("member").id]);
    return c.json({ ok: true });
  });

async function getForumSlug(title: string) {
  const base = slugify(title);
  const [rows] = await getPool().query<RowDataPacket[]>("SELECT slug FROM chat_threads WHERE slug = ? OR slug LIKE ?", [base, `${base}-%`]);
  const taken = new Set(rows.map((r) => r.slug as string));
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
}
