// Campus Groups: associations, clubs, halls, departments and more. A member
// creates a group (a super admin / moderator approves it), then its owner and
// admins run membership, a wall, a forum, meetings, donation campaigns and
// custom pages. Private groups show only their About page to non-members.
import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { memberOrNull, optionalMember, requireMember } from "#/server/member-session-core";
import type { SessionMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl } from "../../lib/fields.js";
import { pageQuerySchema, paging } from "../../lib/query.js";
import { textSearch, money } from "../../lib/search.js";
import { toColumns, insertSql, updateSql } from "../../lib/columns.js";
import { uniqueSlug } from "../../lib/slug.js";
import { cleanRichText, toRichHtml } from "../../lib/rich-text.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { userFields } from "../../lib/members.js";
import { createPayment, fulfil } from "../../lib/payments.js";

type Role = "owner" | "admin" | "moderator" | "member";
const RANK: Record<Role, number> = { owner: 4, admin: 3, moderator: 2, member: 1 };

const CATEGORIES = ["association", "club", "department", "hall", "faith", "alumni", "sports", "professional", "other"] as const;

const groupSchema = z.object({
  name: z.string().trim().min(3).max(150),
  category: z.enum(CATEGORIES),
  tagline: optionalText(200),
  about: optionalText(20_000),
  logoUrl: optionalUrl,
  coverUrl: optionalUrl,
  visibility: z.enum(["public", "private"]),
  joinPolicy: z.enum(["open", "approval"]),
  contactEmail: optionalText(150),
});
const GROUP_FIELDS = {
  name: "name",
  category: "category",
  tagline: "tagline",
  about: "about",
  logoUrl: "logo_url",
  coverUrl: "cover_url",
  visibility: "visibility",
  joinPolicy: "join_policy",
  contactEmail: "contact_email",
};

const postSchema = z.object({
  body: z.string().trim().min(1).max(5000),
  imageUrl: optionalUrl,
  isAnnouncement: z.boolean().optional(),
});
const topicSchema = z.object({ title: z.string().trim().min(3).max(200), body: z.string().trim().min(1).max(10_000) });
const replySchema = z.object({ body: z.string().trim().min(1).max(10_000) });
const meetingSchema = z.object({
  title: z.string().trim().min(3).max(200),
  agenda: optionalText(5000),
  startsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/).transform((v) => `${v.replace("T", " ").slice(0, 16)}:00`),
  endsAt: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v ? `${v.replace("T", " ").slice(0, 16)}:00` : null)),
  location: optionalText(200),
  meetingUrl: optionalUrl,
  membersOnly: z.boolean().optional(),
});
const campaignSchema = z.object({
  title: z.string().trim().min(3).max(200),
  story: optionalText(10_000),
  coverUrl: optionalUrl,
  goalAmount: z.number().min(1).max(100_000_000),
  momoNumber: optionalText(30),
  momoName: optionalText(150),
  endsOn: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(""), z.null()]).optional().transform((v) => v || null),
});
const donateSchema = z.object({
  amount: z.number().min(1).max(1_000_000),
  donorName: optionalText(150),
  message: optionalText(500),
  isAnonymous: z.boolean().optional(),
  method: z.enum(["online", "momo_direct"]),
  momoReference: optionalText(60),
});
const pageSchema = z.object({
  title: z.string().trim().min(2).max(150),
  body: optionalText(200_000),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
});

async function loadGroup(idOrSlug: number | string) {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT * FROM campus_groups WHERE ${typeof idOrSlug === "number" ? "id" : "slug"} = ?`,
    [idOrSlug],
  );
  if (!rows[0]) throw new AppError("Group not found.", 404);
  return rows[0];
}

async function membershipOf(groupId: number, userId: number | undefined) {
  if (!userId) return null;
  const [rows] = await getPool().execute<RowDataPacket[]>(
    "SELECT role, status, title, joined_at FROM group_members WHERE group_id = ? AND user_id = ?",
    [groupId, userId],
  );
  return (rows[0] as { role: Role; status: string; title: string | null; joined_at: string } | undefined) ?? null;
}

// Group + the viewer's standing in it. Unapproved groups are visible only to
// their own members (so the creator can see "awaiting approval").
async function access(c: Context, groupId: number) {
  const member = memberOrNull(c);
  const group = await loadGroup(groupId);
  const membership = await membershipOf(group.id, member?.id);
  const active = membership?.status === "active";
  if (group.status !== "approved" && !active) throw new AppError("Group not found.", 404);
  const role = active ? membership!.role : null;
  return {
    group,
    member,
    membership,
    isMember: active,
    canSee: group.visibility === "public" || active,
    can: (min: Role) => Boolean(role && RANK[role] >= RANK[min]),
  };
}

async function requireRole(c: Context, groupId: number, min: Role) {
  const a = await access(c, groupId);
  if (!a.can(min)) throw new AppError("Only group admins can do that.", 403);
  if (a.group.status !== "approved") throw new AppError("This group is awaiting approval.", 403);
  return a as typeof a & { member: SessionMember };
}

async function requireActiveMember(c: Context, groupId: number) {
  const a = await access(c, groupId);
  if (!a.isMember) throw new AppError("Join the group to take part.", 403);
  if (a.group.status !== "approved") throw new AppError("This group is awaiting approval.", 403);
  return a as typeof a & { member: SessionMember };
}

async function requireVisible(c: Context, groupId: number) {
  const a = await access(c, groupId);
  if (!a.canSee) throw new AppError("This is a private group. Join to see its content.", 403);
  return a;
}

const recountMembers = (groupId: number) =>
  getPool().execute(
    "UPDATE campus_groups SET member_count = (SELECT COUNT(*) FROM group_members WHERE group_id = ? AND status = 'active') WHERE id = ?",
    [groupId, groupId],
  );

async function groupAdmins(groupId: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    "SELECT user_id FROM group_members WHERE group_id = ? AND status = 'active' AND role IN ('owner', 'admin')",
    [groupId],
  );
  return rows.map((r) => r.user_id as number);
}

const id = (c: Context, name = "id") => Number(c.req.param(name)) || 0;

export const groupsRoute = new Hono()
  .use("*", optionalMember)
  .get("/", async (c) => {
    const q = pageQuerySchema.extend({ category: z.enum(CATEGORIES).optional().catch(undefined) }).parse(c.req.query());
    const where = ["g.status = 'approved'"];
    const params: Array<string | number> = [];
    if (q.category) {
      where.push("g.category = ?");
      params.push(q.category);
    }
    if (q.q) {
      const s = textSearch("g.name, g.tagline, g.about", ["g.name", "g.tagline"], q.q);
      where.push(s.sql);
      params.push(...s.params);
    }
    const { limit, offset } = paging(q.page, q.pageSize);
    const clause = where.join(" AND ");
    const pool = getPool();
    const [[items], [count]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT g.id, g.name, g.slug, g.category, g.tagline, g.logo_url, g.cover_url, g.visibility, g.join_policy,
           g.member_count, g.is_featured FROM campus_groups g WHERE ${clause}
         ORDER BY g.is_featured DESC, g.member_count DESC, g.id DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      ),
      pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM campus_groups g WHERE ${clause}`, params),
    ]);
    return c.json({ items, total: Number(count[0]?.n ?? 0) });
  })
  .get("/mine", requireMember, async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT g.id, g.name, g.slug, g.category, g.tagline, g.logo_url, g.cover_url, g.status, g.status_reason, g.member_count,
         m.role, m.status AS membership_status
       FROM group_members m JOIN campus_groups g ON g.id = m.group_id WHERE m.user_id = ? AND m.status <> 'banned'
       ORDER BY FIELD(m.role, 'owner', 'admin', 'moderator', 'member'), g.name`,
      [c.get("member").id],
    );
    return c.json({ items });
  })
  .post("/", requireMember, validate("json", groupSchema), async (c) => {
    const input = c.req.valid("json");
    const member = c.get("member");
    const slug = await uniqueSlug("campus_groups", input.name, null);
    const { columns, params } = toColumns({ ...input, about: cleanRichText(input.about) }, GROUP_FIELDS);
    const [res] = await getPool().execute<ResultSetHeader>(
      insertSql("campus_groups", [...columns, "slug", "created_by", "member_count"]),
      [...params, slug, member.id, 1],
    );
    await getPool().execute("INSERT INTO group_members (group_id, user_id, role, status) VALUES (?, ?, 'owner', 'active')", [
      res.insertId,
      member.id,
    ]);
    return c.json({ id: res.insertId, slug }, 201);
  })
  .get("/s/:slug", async (c) => {
    const base = await loadGroup((c.req.param("slug") ?? ""));
    const a = await access(c, base.id);
    const pool = getPool();
    const [[stats], [pages], [admins]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT (SELECT COUNT(*) FROM group_posts WHERE group_id = ? AND is_hidden = 0) AS posts,
           (SELECT COUNT(*) FROM group_topics WHERE group_id = ?) AS topics,
           (SELECT COUNT(*) FROM group_meetings WHERE group_id = ? AND starts_at >= NOW()) AS upcoming_meetings,
           (SELECT COUNT(*) FROM group_campaigns WHERE group_id = ? AND status = 'active') AS active_campaigns,
           (SELECT COUNT(*) FROM group_members WHERE group_id = ? AND status = 'pending') AS pending_members`,
        [base.id, base.id, base.id, base.id, base.id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT id, title, slug FROM group_pages WHERE group_id = ? ${a.can("admin") ? "" : "AND is_published = 1"} ORDER BY sort_order, id`,
        [base.id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT m.role, m.title, ${userFields("u", "user")} FROM group_members m JOIN users u ON u.id = m.user_id
         WHERE m.group_id = ? AND m.status = 'active' AND m.role IN ('owner', 'admin') ORDER BY FIELD(m.role, 'owner', 'admin')`,
        [base.id],
      ),
    ]);
    return c.json({
      group: { ...a.group, about: toRichHtml(a.group.about) },
      membership: a.membership,
      canSee: a.canSee,
      canManage: a.can("admin"),
      canModerate: a.can("moderator"),
      stats: stats[0],
      pages,
      admins,
    });
  })
  .patch("/:id", requireMember, validate("json", groupSchema.partial()), async (c) => {
    const a = await access(c, id(c));
    if (!a.can("admin")) throw new AppError("Only group admins can do that.", 403);
    const input = c.req.valid("json");
    const { columns, params } = toColumns({ ...input, about: cleanRichText(input.about) }, GROUP_FIELDS);
    if (a.group.status === "rejected") {
      columns.push("status");
      params.push("pending");
    }
    if (columns.length) await getPool().execute(updateSql("campus_groups", columns), [...params, a.group.id]);
    return c.json({ ok: true });
  })
  // ---- Membership ---------------------------------------------------------------------
  .post("/:id/join", requireMember, async (c) => {
    const a = await access(c, id(c));
    if (a.group.status !== "approved") throw new AppError("This group isn't open yet.", 409);
    if (a.membership?.status === "banned") throw new AppError("You can't join this group.", 403);
    if (a.membership) return c.json({ status: a.membership.status });
    const status = a.group.join_policy === "open" ? "active" : "pending";
    await getPool().execute("INSERT INTO group_members (group_id, user_id, status) VALUES (?, ?, ?)", [a.group.id, a.member!.id, status]);
    await recountMembers(a.group.id);
    if (status === "pending") {
      for (const admin of await groupAdmins(a.group.id)) {
        notify(admin, {
          kind: "group",
          title: `${a.member!.fullName} asked to join ${a.group.name}`,
          link: `/groups/${a.group.slug}/manage`,
          actorId: a.member!.id,
        });
      }
    }
    return c.json({ status });
  })
  .post("/:id/leave", requireMember, async (c) => {
    const a = await access(c, id(c));
    if (a.membership?.role === "owner") throw new AppError("Transfer ownership before leaving.", 409);
    await getPool().execute("DELETE FROM group_members WHERE group_id = ? AND user_id = ? AND status <> 'banned'", [a.group.id, a.member!.id]);
    await recountMembers(a.group.id);
    return c.json({ ok: true });
  })
  .get("/:id/members", async (c) => {
    const a = await requireVisible(c, id(c));
    const status = c.req.query("status") === "pending" && a.can("admin") ? "pending" : c.req.query("status") === "banned" && a.can("admin") ? "banned" : "active";
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT m.role, m.status, m.title, m.joined_at, ${userFields("u", "user")} FROM group_members m JOIN users u ON u.id = m.user_id
       WHERE m.group_id = ? AND m.status = ? ORDER BY FIELD(m.role, 'owner', 'admin', 'moderator', 'member'), u.full_name LIMIT 500`,
      [a.group.id, status],
    );
    return c.json({ items });
  })
  .patch(
    "/:id/members/:userId",
    requireMember,
    validate(
      "json",
      z.object({
        role: z.enum(["owner", "admin", "moderator", "member"]).optional(),
        status: z.enum(["active", "banned"]).optional(),
        title: optionalText(80),
      }),
    ),
    async (c) => {
      const a = await requireRole(c, id(c), "admin");
      const userId = id(c, "userId");
      const target = await membershipOf(a.group.id, userId);
      if (!target) throw new AppError("Member not found.", 404);
      const input = c.req.valid("json");
      if (target.role === "owner") throw new AppError("The owner can't be changed here.", 403);
      if (input.role === "owner" || input.role === "admin" || target.role === "admin") {
        if (!a.can("owner")) throw new AppError("Only the owner can change admins.", 403);
      }
      if (input.role === "owner") {
        // Transfer ownership: the current owner becomes an admin.
        await getPool().execute("UPDATE group_members SET role = 'admin' WHERE group_id = ? AND user_id = ?", [a.group.id, a.member.id]);
      }
      const { columns, params } = toColumns(input, { role: "role", status: "status", title: "title" });
      if (columns.length) {
        await getPool().execute(`UPDATE group_members SET ${columns.map((col) => `${col} = ?`).join(", ")} WHERE group_id = ? AND user_id = ?`, [
          ...params,
          a.group.id,
          userId,
        ]);
      }
      if (target.status === "pending" && input.status === "active") {
        notify(userId, { kind: "group", title: `You're now a member of ${a.group.name}`, link: `/groups/${a.group.slug}`, actorId: a.member.id });
      }
      await recountMembers(a.group.id);
      return c.json({ ok: true });
    },
  )
  .delete("/:id/members/:userId", requireMember, async (c) => {
    const a = await requireRole(c, id(c), "admin");
    const userId = id(c, "userId");
    const target = await membershipOf(a.group.id, userId);
    if (target?.role === "owner") throw new AppError("The owner can't be removed.", 403);
    if (target?.role === "admin" && !a.can("owner")) throw new AppError("Only the owner can remove admins.", 403);
    await getPool().execute("DELETE FROM group_members WHERE group_id = ? AND user_id = ?", [a.group.id, userId]);
    await recountMembers(a.group.id);
    return c.body(null, 204);
  })
  // ---- Wall ---------------------------------------------------------------------------
  .get("/:id/posts", async (c) => {
    const a = await requireVisible(c, id(c));
    const before = Number(c.req.query("before")) || 0;
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT p.*, ${userFields("u", "author")} FROM group_posts p JOIN users u ON u.id = p.user_id
       WHERE p.group_id = ? AND p.is_hidden = 0 ${before ? "AND p.id < ?" : ""}
       ORDER BY ${before ? "" : "p.is_pinned DESC,"} p.id DESC LIMIT 20`,
      before ? [a.group.id, before] : [a.group.id],
    );
    return c.json({ items });
  })
  .post("/:id/posts", requireMember, validate("json", postSchema), async (c) => {
    const a = await requireActiveMember(c, id(c));
    const input = c.req.valid("json");
    const announce = Boolean(input.isAnnouncement && a.can("moderator"));
    await getPool().execute(
      "INSERT INTO group_posts (group_id, user_id, body, image_url, is_announcement) VALUES (?, ?, ?, ?, ?)",
      [a.group.id, a.member.id, input.body, input.imageUrl ?? null, announce ? 1 : 0],
    );
    if (announce) {
      const [members] = await getPool().execute<RowDataPacket[]>(
        "SELECT user_id FROM group_members WHERE group_id = ? AND status = 'active' LIMIT 2000",
        [a.group.id],
      );
      for (const m of members) {
        notify(m.user_id, {
          kind: "group",
          title: `Announcement in ${a.group.name}`,
          body: input.body.slice(0, 140),
          link: `/groups/${a.group.slug}`,
          actorId: a.member.id,
        });
      }
    }
    return c.json({ ok: true }, 201);
  })
  .patch("/posts/:postId", requireMember, validate("json", z.object({ isPinned: z.boolean() })), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT group_id FROM group_posts WHERE id = ?", [id(c, "postId")]);
    if (!rows[0]) throw new AppError("Post not found.", 404);
    await requireRole(c, rows[0].group_id, "moderator");
    await getPool().execute("UPDATE group_posts SET is_pinned = ? WHERE id = ?", [c.req.valid("json").isPinned ? 1 : 0, id(c, "postId")]);
    return c.json({ ok: true });
  })
  .delete("/posts/:postId", requireMember, async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT group_id, user_id FROM group_posts WHERE id = ?", [id(c, "postId")]);
    const post = rows[0];
    if (!post) throw new AppError("Post not found.", 404);
    if (post.user_id !== c.get("member").id) await requireRole(c, post.group_id, "moderator");
    await getPool().execute("DELETE FROM group_posts WHERE id = ?", [id(c, "postId")]);
    return c.body(null, 204);
  })
  // ---- Forum ---------------------------------------------------------------------------
  .get("/:id/topics", async (c) => {
    const a = await requireVisible(c, id(c));
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT t.id, t.title, t.is_pinned, t.is_locked, t.reply_count, t.last_reply_at, t.created_at, ${userFields("u", "author")}
       FROM group_topics t JOIN users u ON u.id = t.user_id WHERE t.group_id = ?
       ORDER BY t.is_pinned DESC, COALESCE(t.last_reply_at, t.created_at) DESC LIMIT 100`,
      [a.group.id],
    );
    return c.json({ items });
  })
  .post("/:id/topics", requireMember, validate("json", topicSchema), async (c) => {
    const a = await requireActiveMember(c, id(c));
    const input = c.req.valid("json");
    const [res] = await getPool().execute<ResultSetHeader>(
      "INSERT INTO group_topics (group_id, user_id, title, body) VALUES (?, ?, ?, ?)",
      [a.group.id, a.member.id, input.title, input.body],
    );
    return c.json({ id: res.insertId }, 201);
  })
  .get("/topics/:topicId", async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT t.*, ${userFields("u", "author")} FROM group_topics t JOIN users u ON u.id = t.user_id WHERE t.id = ?`,
      [id(c, "topicId")],
    );
    const topic = rows[0];
    if (!topic) throw new AppError("Topic not found.", 404);
    const a = await requireVisible(c, topic.group_id);
    const [replies] = await getPool().query<RowDataPacket[]>(
      `SELECT r.id, r.body, r.created_at, ${userFields("u", "author")} FROM group_replies r JOIN users u ON u.id = r.user_id
       WHERE r.topic_id = ? ORDER BY r.id LIMIT 500`,
      [topic.id],
    );
    return c.json({ topic, replies, canModerate: a.can("moderator"), isMember: a.isMember });
  })
  .post("/topics/:topicId/replies", requireMember, validate("json", replySchema), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM group_topics WHERE id = ?", [id(c, "topicId")]);
    const topic = rows[0];
    if (!topic) throw new AppError("Topic not found.", 404);
    const a = await requireActiveMember(c, topic.group_id);
    if (topic.is_locked && !a.can("moderator")) throw new AppError("This topic is locked.", 403);
    await getPool().execute("INSERT INTO group_replies (topic_id, user_id, body) VALUES (?, ?, ?)", [topic.id, a.member.id, c.req.valid("json").body]);
    await getPool().execute("UPDATE group_topics SET reply_count = reply_count + 1, last_reply_at = NOW() WHERE id = ?", [topic.id]);
    notify(topic.user_id, {
      kind: "group",
      title: `${a.member.fullName} replied to "${topic.title}"`,
      link: `/groups/${a.group.slug}/forum/${topic.id}`,
      actorId: a.member.id,
    });
    return c.json({ ok: true }, 201);
  })
  .patch("/topics/:topicId", requireMember, validate("json", z.object({ isPinned: z.boolean().optional(), isLocked: z.boolean().optional() })), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT group_id FROM group_topics WHERE id = ?", [id(c, "topicId")]);
    if (!rows[0]) throw new AppError("Topic not found.", 404);
    await requireRole(c, rows[0].group_id, "moderator");
    const { columns, params } = toColumns(c.req.valid("json"), { isPinned: "is_pinned", isLocked: "is_locked" });
    if (columns.length) await getPool().execute(updateSql("group_topics", columns), [...params, id(c, "topicId")]);
    return c.json({ ok: true });
  })
  .delete("/topics/:topicId", requireMember, async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT group_id, user_id FROM group_topics WHERE id = ?", [id(c, "topicId")]);
    if (!rows[0]) throw new AppError("Topic not found.", 404);
    if (rows[0].user_id !== c.get("member").id) await requireRole(c, rows[0].group_id, "moderator");
    await getPool().execute("DELETE FROM group_topics WHERE id = ?", [id(c, "topicId")]);
    return c.body(null, 204);
  })
  // ---- Meetings -------------------------------------------------------------------------
  .get("/:id/meetings", async (c) => {
    const a = await access(c, id(c));
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT m.*, u.full_name AS created_by_name FROM group_meetings m LEFT JOIN users u ON u.id = m.created_by
       WHERE m.group_id = ? ORDER BY m.starts_at >= NOW() DESC, IF(m.starts_at >= NOW(), m.starts_at, NULL) ASC, m.starts_at DESC LIMIT 100`,
      [a.group.id],
    );
    // Members-only meetings hide their link and location from outsiders.
    return c.json({
      items: items.map((m) => (m.members_only && !a.isMember ? { ...m, meeting_url: null, location: null, agenda: null } : m)),
    });
  })
  .post("/:id/meetings", requireMember, validate("json", meetingSchema), async (c) => {
    const a = await requireRole(c, id(c), "moderator");
    const input = c.req.valid("json");
    await getPool().execute(
      `INSERT INTO group_meetings (group_id, title, agenda, starts_at, ends_at, location, meeting_url, members_only, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.group.id, input.title, input.agenda ?? null, input.startsAt, input.endsAt, input.location ?? null, input.meetingUrl ?? null, input.membersOnly === false ? 0 : 1, a.member.id],
    );
    const [members] = await getPool().execute<RowDataPacket[]>(
      "SELECT user_id FROM group_members WHERE group_id = ? AND status = 'active' LIMIT 2000",
      [a.group.id],
    );
    for (const m of members) {
      notify(m.user_id, { kind: "group", title: `New meeting in ${a.group.name}: ${input.title}`, link: `/groups/${a.group.slug}/meetings`, actorId: a.member.id });
    }
    return c.json({ ok: true }, 201);
  })
  .delete("/meetings/:meetingId", requireMember, async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT group_id FROM group_meetings WHERE id = ?", [id(c, "meetingId")]);
    if (!rows[0]) throw new AppError("Meeting not found.", 404);
    await requireRole(c, rows[0].group_id, "moderator");
    await getPool().execute("DELETE FROM group_meetings WHERE id = ?", [id(c, "meetingId")]);
    return c.body(null, 204);
  })
  // ---- Donations --------------------------------------------------------------------------
  .get("/:id/campaigns", async (c) => {
    const a = await access(c, id(c));
    const pool = getPool();
    const [campaigns] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM group_campaigns WHERE group_id = ? ORDER BY status = 'active' DESC, id DESC",
      [a.group.id],
    );
    const ids = campaigns.map((x) => x.id as number);
    const [donors] = ids.length
      ? await pool.query<RowDataPacket[]>(
          `SELECT campaign_id, IF(is_anonymous, 'Anonymous', donor_name) AS donor_name, amount, message, created_at
           FROM group_donations WHERE campaign_id IN (?) AND status = 'confirmed' ORDER BY id DESC LIMIT 100`,
          [ids],
        )
      : [[]];
    return c.json({ campaigns, donors, canManage: a.can("admin") });
  })
  .post("/:id/campaigns", requireMember, validate("json", campaignSchema), async (c) => {
    const a = await requireRole(c, id(c), "admin");
    const input = c.req.valid("json");
    const { columns, params } = toColumns(input, {
      title: "title",
      story: "story",
      coverUrl: "cover_url",
      goalAmount: "goal_amount",
      momoNumber: "momo_number",
      momoName: "momo_name",
      endsOn: "ends_on",
    });
    await getPool().execute(insertSql("group_campaigns", [...columns, "group_id"]), [...params, a.group.id]);
    return c.json({ ok: true }, 201);
  })
  .patch("/campaigns/:campaignId", requireMember, validate("json", campaignSchema.partial().extend({ status: z.enum(["active", "closed"]).optional() })), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT group_id FROM group_campaigns WHERE id = ?", [id(c, "campaignId")]);
    if (!rows[0]) throw new AppError("Campaign not found.", 404);
    await requireRole(c, rows[0].group_id, "admin");
    const { columns, params } = toColumns(c.req.valid("json"), {
      title: "title",
      story: "story",
      coverUrl: "cover_url",
      goalAmount: "goal_amount",
      momoNumber: "momo_number",
      momoName: "momo_name",
      endsOn: "ends_on",
      status: "status",
    });
    if (columns.length) await getPool().execute(updateSql("group_campaigns", columns), [...params, id(c, "campaignId")]);
    return c.json({ ok: true });
  })
  .post("/campaigns/:campaignId/donate", validate("json", donateSchema), async (c) => {
    const member = memberOrNull(c);
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT x.*, g.slug AS group_slug, g.name AS group_name, g.status AS group_status FROM group_campaigns x
       JOIN campus_groups g ON g.id = x.group_id WHERE x.id = ? AND x.status = 'active'`,
      [id(c, "campaignId")],
    );
    const campaign = rows[0];
    if (!campaign || campaign.group_status !== "approved") throw new AppError("This campaign isn't accepting donations.", 409);
    const input = c.req.valid("json");
    if (input.method === "online" && !member) throw new AppError("Sign in to give online.", 401);
    if (input.method === "momo_direct" && !input.momoReference) {
      throw new AppError("Enter the MoMo transaction ID so the group can confirm your gift.", 422);
    }
    const donorName = input.donorName || member?.fullName || "Well-wisher";
    const [res] = await getPool().execute<ResultSetHeader>(
      `INSERT INTO group_donations (campaign_id, user_id, donor_name, amount, message, is_anonymous, method, momo_reference)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [campaign.id, member?.id ?? null, donorName, money(input.amount), input.message ?? null, input.isAnonymous ? 1 : 0, input.method, input.momoReference ?? null],
    );
    for (const admin of await groupAdmins(campaign.group_id)) {
      notify(admin, {
        kind: "donation",
        title: `GHS ${money(input.amount).toFixed(2)} pledged to ${campaign.title}`,
        body: input.method === "momo_direct" ? `MoMo ref ${input.momoReference} — confirm it in Manage → Donations.` : donorName,
        link: `/groups/${campaign.group_slug}/manage`,
        actorId: member?.id ?? null,
      });
    }
    if (input.method === "online" && member) {
      const payment = await createPayment({
        userId: member.id,
        email: member.email,
        purpose: "donation",
        targetIds: [res.insertId],
        amount: money(input.amount),
        returnPath: `/groups/${campaign.group_slug}/donate`,
      });
      if (!payment.authorizationUrl) {
        throw new AppError("Online giving isn't available yet. Use Mobile Money directly.", 400);
      }
      return c.json({ authorizationUrl: payment.authorizationUrl }, 201);
    }
    return c.json({ ok: true }, 201);
  })
  .get("/:id/donations", requireMember, async (c) => {
    const a = await requireRole(c, id(c), "admin");
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT d.*, x.title AS campaign_title FROM group_donations d JOIN group_campaigns x ON x.id = d.campaign_id
       WHERE x.group_id = ? ORDER BY d.id DESC LIMIT 500`,
      [a.group.id],
    );
    return c.json({ items });
  })
  .patch("/donations/:donationId", requireMember, validate("json", z.object({ status: z.enum(["confirmed", "rejected"]) })), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT d.*, x.group_id FROM group_donations d JOIN group_campaigns x ON x.id = d.campaign_id WHERE d.id = ?",
      [id(c, "donationId")],
    );
    const donation = rows[0];
    if (!donation) throw new AppError("Donation not found.", 404);
    await requireRole(c, donation.group_id, "admin");
    if (donation.status !== "pending") throw new AppError("This donation was already handled.", 409);
    if (c.req.valid("json").status === "confirmed") await fulfil("donation", [donation.id], null);
    else await getPool().execute("UPDATE group_donations SET status = 'rejected' WHERE id = ?", [donation.id]);
    return c.json({ ok: true });
  })
  // ---- Pages ----------------------------------------------------------------------------------
  .get("/:id/pages/:slug", async (c) => {
    const a = await requireVisible(c, id(c));
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT * FROM group_pages WHERE group_id = ? AND slug = ? ${a.can("admin") ? "" : "AND is_published = 1"}`,
      [a.group.id, (c.req.param("slug") ?? "")],
    );
    if (!rows[0]) throw new AppError("Page not found.", 404);
    return c.json({ page: { ...rows[0], body: toRichHtml(rows[0].body) }, raw: a.can("admin") ? rows[0].body : null });
  })
  .post("/:id/pages", requireMember, validate("json", pageSchema), async (c) => {
    const a = await requireRole(c, id(c), "admin");
    const input = c.req.valid("json");
    const slug = await uniqueSlug("group_pages", input.title, { column: "group_id", value: a.group.id });
    await getPool().execute(
      "INSERT INTO group_pages (group_id, title, slug, body, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [a.group.id, input.title, slug, cleanRichText(input.body) ?? null, input.isPublished === false ? 0 : 1, input.sortOrder ?? 0],
    );
    return c.json({ slug }, 201);
  })
  .patch("/pages/:pageId", requireMember, validate("json", pageSchema.partial()), async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT group_id FROM group_pages WHERE id = ?", [id(c, "pageId")]);
    if (!rows[0]) throw new AppError("Page not found.", 404);
    await requireRole(c, rows[0].group_id, "admin");
    const input = c.req.valid("json");
    const { columns, params } = toColumns({ ...input, body: cleanRichText(input.body) }, {
      title: "title",
      body: "body",
      isPublished: "is_published",
      sortOrder: "sort_order",
    });
    if (columns.length) await getPool().execute(updateSql("group_pages", columns), [...params, id(c, "pageId")]);
    return c.json({ ok: true });
  })
  .delete("/pages/:pageId", requireMember, async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT group_id FROM group_pages WHERE id = ?", [id(c, "pageId")]);
    if (!rows[0]) throw new AppError("Page not found.", 404);
    await requireRole(c, rows[0].group_id, "admin");
    await getPool().execute("DELETE FROM group_pages WHERE id = ?", [id(c, "pageId")]);
    return c.body(null, 204);
  });
