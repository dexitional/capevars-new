// SocialNet: profiles and walls, the news feed, reactions and comments,
// friends (requests, accept/decline, suggestions) and pages people follow.
import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { memberOrNull, optionalMember, requireMember } from "#/server/member-session-core";
import type { SessionMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl, urlListSchema } from "../../lib/fields.js";
import { toColumns, insertSql, updateSql } from "../../lib/columns.js";
import { uniqueSlug } from "../../lib/slug.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { PUBLIC_USER_COLUMNS, pairKey, userFields } from "../../lib/members.js";

const REACTIONS = ["like", "love", "celebrate", "insightful", "funny"] as const;

const postSchema = z.object({
  body: optionalText(5000),
  images: urlListSchema(10).optional(),
  linkUrl: optionalUrl,
  visibility: z.enum(["public", "friends", "only_me"]).default("public"),
  pageId: z.number().int().positive().optional(),
  wallUserId: z.number().int().positive().optional(),
  sharedPostId: z.number().int().positive().optional(),
});
const commentSchema = z.object({ body: z.string().trim().min(1).max(2000), parentId: z.number().int().positive().optional() });
const pageSchema = z.object({
  name: z.string().trim().min(2).max(150),
  category: z.string().trim().min(2).max(60),
  about: optionalText(5000),
  avatarUrl: optionalUrl,
  coverUrl: optionalUrl,
  website: optionalUrl,
  phone: optionalText(30),
  email: optionalText(150),
});
const PAGE_FIELDS = {
  name: "name",
  category: "category",
  about: "about",
  avatarUrl: "avatar_url",
  coverUrl: "cover_url",
  website: "website",
  phone: "phone",
  email: "email",
};

export const PAGE_CATEGORIES = [
  "Community", "Business", "Brand", "Public figure", "Campus office", "Student association", "Entertainment",
  "News & media", "Education", "Non-profit", "Sports", "Faith", "Other",
];

// Post rows with author, page, wall owner, the viewer's reaction and a shared post's essentials.
function postSelect(viewerId: number) {
  return `SELECT p.*, ${userFields("u", "author")},
      pg.name AS page_name, pg.slug AS page_slug, pg.avatar_url AS page_avatar, pg.is_verified AS page_verified,
      w.full_name AS wall_name, w.username AS wall_username,
      (SELECT reaction FROM post_reactions r WHERE r.post_id = p.id AND r.user_id = ${Number(viewerId)}) AS my_reaction,
      (SELECT JSON_OBJECTAGG(reaction, n) FROM (SELECT reaction, COUNT(*) AS n FROM post_reactions r2 WHERE r2.post_id = p.id GROUP BY reaction) x) AS reaction_summary,
      sp.body AS shared_body, sp.images AS shared_images, sp.created_at AS shared_created_at,
      su.full_name AS shared_author_name, su.username AS shared_author_username, su.avatar_url AS shared_author_avatar
    FROM social_posts p
    JOIN users u ON u.id = p.author_id
    LEFT JOIN social_pages pg ON pg.id = p.page_id
    LEFT JOIN users w ON w.id = p.wall_user_id
    LEFT JOIN social_posts sp ON sp.id = p.shared_post_id AND sp.is_hidden = 0
    LEFT JOIN users su ON su.id = sp.author_id`;
}

// Who may see a post: public; or friends-only posts to the author's friends
// (and the wall owner); only_me to the author.
function visibleTo(viewerId: number) {
  const v = Number(viewerId);
  return `p.is_hidden = 0 AND (
    p.visibility = 'public' OR p.author_id = ${v} OR p.wall_user_id = ${v}
    OR (p.visibility = 'friends' AND EXISTS (SELECT 1 FROM friendships f WHERE f.status = 'accepted'
         AND ((f.requester_id = p.author_id AND f.addressee_id = ${v}) OR (f.addressee_id = p.author_id AND f.requester_id = ${v}))))
  )`;
}

async function friendshipBetween(a: number, b: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM friendships WHERE pair_key = ?", [pairKey(a, b)]);
  return rows[0] ?? null;
}

export async function areFriends(a: number, b: number) {
  const f = await friendshipBetween(a, b);
  return f?.status === "accepted";
}

const viewer = (c: Context) => memberOrNull(c)?.id ?? 0;

async function ownedPage(c: Context, pageId: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM social_pages WHERE id = ? AND owner_id = ?", [
    pageId,
    c.get("member").id,
  ]);
  if (!rows[0]) throw new AppError("Page not found.", 404);
  return rows[0];
}

export const socialRoute = new Hono()
  .use("*", optionalMember)
  // ---- Feed ---------------------------------------------------------------------------
  .get("/feed", requireMember, async (c) => {
    const me = c.get("member").id;
    const before = Number(c.req.query("before")) || 0;
    const scope = c.req.query("scope") === "discover" ? "discover" : "following";
    // Following: my posts, friends' posts, posts on my wall, and pages I follow.
    const sourceFilter =
      scope === "following"
        ? `AND (p.author_id = ${me} OR p.wall_user_id = ${me}
             OR p.page_id IN (SELECT page_id FROM page_followers WHERE user_id = ${me})
             OR (p.page_id IS NULL AND p.author_id IN (
               SELECT IF(f.requester_id = ${me}, f.addressee_id, f.requester_id) FROM friendships f
               WHERE f.status = 'accepted' AND (f.requester_id = ${me} OR f.addressee_id = ${me}))))`
        : "AND p.visibility = 'public'";
    const [items] = await getPool().query<RowDataPacket[]>(
      `${postSelect(me)} WHERE ${visibleTo(me)} ${sourceFilter} ${before ? "AND p.id < ?" : ""} ORDER BY p.id DESC LIMIT 15`,
      before ? [before] : [],
    );
    return c.json({ items });
  })
  .get("/posts/:id", async (c) => {
    const me = viewer(c);
    const [rows] = await getPool().query<RowDataPacket[]>(`${postSelect(me)} WHERE p.id = ? AND ${visibleTo(me)}`, [Number(c.req.param("id"))]);
    if (!rows[0]) throw new AppError("Post not found.", 404);
    return c.json({ post: rows[0] });
  })
  .post("/posts", requireMember, validate("json", postSchema), async (c) => {
    const member = c.get("member");
    const input = c.req.valid("json");
    if (!input.body && !input.images?.length && !input.sharedPostId && !input.linkUrl) {
      throw new AppError("Write something or add a photo.", 422);
    }
    if (input.pageId) await ownedPage(c, input.pageId);
    if (input.wallUserId && input.wallUserId !== member.id && !(await areFriends(member.id, input.wallUserId))) {
      throw new AppError("You can only post on friends' walls.", 403);
    }
    const [res] = await getPool().execute<ResultSetHeader>(
      `INSERT INTO social_posts (author_id, page_id, wall_user_id, body, images, link_url, shared_post_id, visibility)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        member.id,
        input.pageId ?? null,
        input.wallUserId && input.wallUserId !== member.id ? input.wallUserId : null,
        input.body ?? null,
        JSON.stringify(input.images ?? []),
        input.linkUrl ?? null,
        input.sharedPostId ?? null,
        input.pageId ? "public" : input.visibility,
      ],
    );
    if (input.sharedPostId) {
      const [shared] = await getPool().execute<RowDataPacket[]>("SELECT author_id FROM social_posts WHERE id = ?", [input.sharedPostId]);
      await getPool().execute("UPDATE social_posts SET share_count = share_count + 1 WHERE id = ?", [input.sharedPostId]);
      notify(shared[0]?.author_id, { kind: "social", title: `${member.fullName} shared your post`, link: `/social/post/${res.insertId}`, actorId: member.id });
    }
    if (input.wallUserId && input.wallUserId !== member.id) {
      notify(input.wallUserId, { kind: "social", title: `${member.fullName} posted on your wall`, link: `/social/post/${res.insertId}`, actorId: member.id });
    }
    return c.json({ id: res.insertId }, 201);
  })
  .delete("/posts/:id", requireMember, async (c) => {
    const id = Number(c.req.param("id"));
    const me = c.get("member").id;
    const [res] = await getPool().execute<ResultSetHeader>(
      "DELETE FROM social_posts WHERE id = ? AND (author_id = ? OR wall_user_id = ?)",
      [id, me, me],
    );
    if (!res.affectedRows) throw new AppError("Post not found.", 404);
    return c.body(null, 204);
  })
  .post("/posts/:id/react", requireMember, validate("json", z.object({ reaction: z.enum(REACTIONS).nullable() })), async (c) => {
    const id = Number(c.req.param("id"));
    const member = c.get("member");
    const { reaction } = c.req.valid("json");
    const pool = getPool();
    const [posts] = await pool.query<RowDataPacket[]>(`SELECT p.id, p.author_id FROM social_posts p WHERE p.id = ? AND ${visibleTo(member.id)}`, [id]);
    const post = posts[0];
    if (!post) throw new AppError("Post not found.", 404);
    if (reaction) {
      const [res] = await pool.execute<ResultSetHeader>(
        "INSERT INTO post_reactions (post_id, user_id, reaction) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE reaction = VALUES(reaction)",
        [id, member.id, reaction],
      );
      // affectedRows is 1 for a new row, 2 for an update.
      if (res.affectedRows === 1) {
        notify(post.author_id, { kind: "social", title: `${member.fullName} reacted to your post`, link: `/social/post/${id}`, actorId: member.id });
      }
    } else {
      await pool.execute("DELETE FROM post_reactions WHERE post_id = ? AND user_id = ?", [id, member.id]);
    }
    await pool.execute("UPDATE social_posts SET reaction_count = (SELECT COUNT(*) FROM post_reactions WHERE post_id = ?) WHERE id = ?", [id, id]);
    return c.json({ ok: true });
  })
  .get("/posts/:id/comments", async (c) => {
    const id = Number(c.req.param("id"));
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT cm.id, cm.parent_id, cm.body, cm.created_at, ${userFields("u", "author")} FROM post_comments cm
       JOIN users u ON u.id = cm.user_id WHERE cm.post_id = ? AND cm.is_hidden = 0 ORDER BY cm.id LIMIT 300`,
      [id],
    );
    return c.json({ items });
  })
  .post("/posts/:id/comments", requireMember, validate("json", commentSchema), async (c) => {
    const id = Number(c.req.param("id"));
    const member = c.get("member");
    const [posts] = await getPool().query<RowDataPacket[]>(`SELECT p.id, p.author_id FROM social_posts p WHERE p.id = ? AND ${visibleTo(member.id)}`, [id]);
    if (!posts[0]) throw new AppError("Post not found.", 404);
    const input = c.req.valid("json");
    await getPool().execute("INSERT INTO post_comments (post_id, user_id, parent_id, body) VALUES (?, ?, ?, ?)", [
      id,
      member.id,
      input.parentId ?? null,
      input.body,
    ]);
    await getPool().execute("UPDATE social_posts SET comment_count = comment_count + 1 WHERE id = ?", [id]);
    notify(posts[0].author_id, {
      kind: "social",
      title: `${member.fullName} commented on your post`,
      body: input.body.slice(0, 120),
      link: `/social/post/${id}`,
      actorId: member.id,
    });
    return c.json({ ok: true }, 201);
  })
  .delete("/comments/:id", requireMember, async (c) => {
    const id = Number(c.req.param("id"));
    const me = c.get("member").id;
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT cm.post_id FROM post_comments cm JOIN social_posts p ON p.id = cm.post_id WHERE cm.id = ? AND (cm.user_id = ? OR p.author_id = ?)",
      [id, me, me],
    );
    if (!rows[0]) throw new AppError("Comment not found.", 404);
    await getPool().execute("DELETE FROM post_comments WHERE id = ?", [id]);
    await getPool().execute(
      "UPDATE social_posts SET comment_count = (SELECT COUNT(*) FROM post_comments WHERE post_id = ?) WHERE id = ?",
      [rows[0].post_id, rows[0].post_id],
    );
    return c.body(null, 204);
  })
  // ---- Profiles ------------------------------------------------------------------------
  .get("/u/:username", async (c) => {
    const me = viewer(c);
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT ${PUBLIC_USER_COLUMNS} FROM users WHERE username = ? AND is_active = 1`,
      [c.req.param("username")],
    );
    const profile = rows[0];
    if (!profile) throw new AppError("Profile not found.", 404);
    const [[counts], [friends], [pages], [groups], [store]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT (SELECT COUNT(*) FROM friendships WHERE status = 'accepted' AND (requester_id = ? OR addressee_id = ?)) AS friends,
           (SELECT COUNT(*) FROM social_posts WHERE author_id = ? AND page_id IS NULL AND is_hidden = 0) AS posts`,
        [profile.id, profile.id, profile.id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT u.id, u.full_name, u.username, u.avatar_url FROM friendships f
         JOIN users u ON u.id = IF(f.requester_id = ?, f.addressee_id, f.requester_id)
         WHERE f.status = 'accepted' AND (f.requester_id = ? OR f.addressee_id = ?) ORDER BY f.responded_at DESC LIMIT 9`,
        [profile.id, profile.id, profile.id],
      ),
      pool.query<RowDataPacket[]>("SELECT id, name, slug, avatar_url, category, follower_count FROM social_pages WHERE owner_id = ? AND status = 'active'", [profile.id]),
      pool.query<RowDataPacket[]>(
        `SELECT g.name, g.slug, g.logo_url, m.role FROM group_members m JOIN campus_groups g ON g.id = m.group_id
         WHERE m.user_id = ? AND m.status = 'active' AND g.status = 'approved' AND g.visibility = 'public' LIMIT 8`,
        [profile.id],
      ),
      pool.query<RowDataPacket[]>("SELECT store_name, slug, logo_url FROM sellers WHERE user_id = ? AND status = 'approved'", [profile.id]),
    ]);
    let friendship: { status: string; direction: "outgoing" | "incoming" } | null = null;
    if (me && me !== profile.id) {
      const f = await friendshipBetween(me, profile.id);
      if (f && f.status !== "declined") friendship = { status: f.status, direction: f.requester_id === me ? "outgoing" : "incoming" };
    }
    let mutual = 0;
    if (me && me !== profile.id) {
      const [m] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS n FROM (
           SELECT IF(requester_id = ?, addressee_id, requester_id) AS fid FROM friendships WHERE status = 'accepted' AND (requester_id = ? OR addressee_id = ?)
         ) a JOIN (
           SELECT IF(requester_id = ?, addressee_id, requester_id) AS fid FROM friendships WHERE status = 'accepted' AND (requester_id = ? OR addressee_id = ?)
         ) b ON a.fid = b.fid`,
        [me, me, me, profile.id, profile.id, profile.id],
      );
      mutual = Number(m[0]?.n ?? 0);
    }
    return c.json({ profile, counts: counts[0], friends, pages, groups, store: store[0] ?? null, friendship, mutual, isMe: me === profile.id });
  })
  .get("/u/:username/posts", async (c) => {
    const me = viewer(c);
    const before = Number(c.req.query("before")) || 0;
    const [users] = await getPool().execute<RowDataPacket[]>("SELECT id FROM users WHERE username = ?", [c.req.param("username")]);
    const userId = users[0]?.id;
    if (!userId) throw new AppError("Profile not found.", 404);
    const [items] = await getPool().query<RowDataPacket[]>(
      `${postSelect(me)} WHERE ${visibleTo(me)} AND p.page_id IS NULL AND (p.author_id = ? OR p.wall_user_id = ?)
       ${before ? "AND p.id < ?" : ""} ORDER BY p.id DESC LIMIT 15`,
      before ? [userId, userId, before] : [userId, userId],
    );
    return c.json({ items });
  })
  // ---- Friends ------------------------------------------------------------------------
  .get("/friends", requireMember, async (c) => {
    const me = c.get("member").id;
    const pool = getPool();
    const card = "u.id, u.full_name, u.username, u.avatar_url, u.headline, u.is_verified, u.last_seen_at";
    const [[friends], [incoming], [outgoing]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT ${card}, f.responded_at AS since FROM friendships f JOIN users u ON u.id = IF(f.requester_id = ?, f.addressee_id, f.requester_id)
         WHERE f.status = 'accepted' AND (f.requester_id = ? OR f.addressee_id = ?) ORDER BY u.full_name`,
        [me, me, me],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT ${card}, f.created_at AS requested_at FROM friendships f JOIN users u ON u.id = f.requester_id
         WHERE f.addressee_id = ? AND f.status = 'pending' ORDER BY f.id DESC`,
        [me],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT ${card}, f.created_at AS requested_at FROM friendships f JOIN users u ON u.id = f.addressee_id
         WHERE f.requester_id = ? AND f.status = 'pending' ORDER BY f.id DESC`,
        [me],
      ),
    ]);
    return c.json({ friends, incoming, outgoing });
  })
  .get("/people", requireMember, async (c) => {
    const me = c.get("member").id;
    const q = (c.req.query("q") ?? "").trim();
    const pool = getPool();
    // Search, or suggestions ranked by mutual friends, then same institution.
    if (q) {
      const [items] = await pool.query<RowDataPacket[]>(
        `SELECT u.id, u.full_name, u.username, u.avatar_url, u.headline, u.institution, u.is_verified,
           (SELECT status FROM friendships f WHERE f.pair_key = IF(u.id < ?, CONCAT(u.id, ':', ?), CONCAT(?, ':', u.id))) AS friendship,
           (SELECT requester_id FROM friendships f WHERE f.pair_key = IF(u.id < ?, CONCAT(u.id, ':', ?), CONCAT(?, ':', u.id))) AS requester_id
         FROM users u WHERE u.id <> ? AND u.is_active = 1 AND (u.full_name LIKE ? OR u.username LIKE ? OR u.headline LIKE ? OR u.institution LIKE ?)
         ORDER BY u.full_name LIMIT 40`,
        [me, me, me, me, me, me, me, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`],
      );
      return c.json({ items });
    }
    const [items] = await pool.query<RowDataPacket[]>(
      `SELECT u.id, u.full_name, u.username, u.avatar_url, u.headline, u.institution, u.is_verified,
         (SELECT COUNT(*) FROM friendships f1 JOIN friendships f2
            ON IF(f1.requester_id = u.id, f1.addressee_id, f1.requester_id) = IF(f2.requester_id = ?, f2.addressee_id, f2.requester_id)
          WHERE f1.status = 'accepted' AND (f1.requester_id = u.id OR f1.addressee_id = u.id)
            AND f2.status = 'accepted' AND (f2.requester_id = ? OR f2.addressee_id = ?)) AS mutual
       FROM users u
       WHERE u.id <> ? AND u.is_active = 1
         AND NOT EXISTS (SELECT 1 FROM friendships f WHERE f.pair_key = IF(u.id < ?, CONCAT(u.id, ':', ?), CONCAT(?, ':', u.id)))
       ORDER BY mutual DESC, (u.institution <=> (SELECT institution FROM users WHERE id = ?)) DESC, u.last_seen_at DESC
       LIMIT 24`,
      [me, me, me, me, me, me, me, me],
    );
    return c.json({ items });
  })
  .post("/friends/:userId/request", requireMember, async (c) => {
    const member = c.get("member");
    const other = Number(c.req.param("userId"));
    if (other === member.id) throw new AppError("That's you!", 422);
    const [users] = await getPool().execute<RowDataPacket[]>("SELECT id FROM users WHERE id = ? AND is_active = 1", [other]);
    if (!users[0]) throw new AppError("Member not found.", 404);
    const existing = await friendshipBetween(member.id, other);
    if (existing?.status === "accepted") return c.json({ status: "accepted" });
    if (existing?.status === "blocked") throw new AppError("You can't add this member.", 403);
    if (existing?.status === "pending") {
      // They already asked me — sending a request back accepts theirs.
      if (existing.addressee_id === member.id) {
        await getPool().execute("UPDATE friendships SET status = 'accepted', responded_at = NOW() WHERE id = ?", [existing.id]);
        notify(other, { kind: "friend", title: `${member.fullName} accepted your friend request`, link: `/u/${member.username}`, actorId: member.id });
        return c.json({ status: "accepted" });
      }
      return c.json({ status: "pending" });
    }
    if (existing) {
      await getPool().execute(
        "UPDATE friendships SET requester_id = ?, addressee_id = ?, status = 'pending', responded_at = NULL WHERE id = ?",
        [member.id, other, existing.id],
      );
    } else {
      await getPool().execute("INSERT INTO friendships (requester_id, addressee_id, pair_key) VALUES (?, ?, ?)", [member.id, other, pairKey(member.id, other)]);
    }
    notify(other, { kind: "friend", title: `${member.fullName} sent you a friend request`, link: "/social/friends", actorId: member.id });
    return c.json({ status: "pending" });
  })
  .post("/friends/:userId/respond", requireMember, validate("json", z.object({ accept: z.boolean() })), async (c) => {
    const member = c.get("member");
    const other = Number(c.req.param("userId"));
    const f = await friendshipBetween(member.id, other);
    if (!f || f.status !== "pending" || f.addressee_id !== member.id) throw new AppError("No pending request.", 404);
    const accept = c.req.valid("json").accept;
    await getPool().execute("UPDATE friendships SET status = ?, responded_at = NOW() WHERE id = ?", [accept ? "accepted" : "declined", f.id]);
    if (accept) notify(other, { kind: "friend", title: `${member.fullName} accepted your friend request`, link: `/u/${member.username}`, actorId: member.id });
    return c.json({ ok: true });
  })
  .delete("/friends/:userId", requireMember, async (c) => {
    // Unfriend, or cancel a request I sent.
    const member = c.get("member");
    const f = await friendshipBetween(member.id, Number(c.req.param("userId")));
    if (f && f.status !== "blocked") await getPool().execute("DELETE FROM friendships WHERE id = ?", [f.id]);
    return c.body(null, 204);
  })
  // ---- Pages -----------------------------------------------------------------------------
  .get("/pages", async (c) => {
    const me = viewer(c);
    const q = (c.req.query("q") ?? "").trim();
    const category = c.req.query("category") ?? "";
    const where = ["p.status = 'active'"];
    const params: Array<string | number> = [me];
    if (q) {
      where.push("(p.name LIKE ? OR p.about LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (category) {
      where.push("p.category = ?");
      params.push(category);
    }
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT p.id, p.name, p.slug, p.category, p.about, p.avatar_url, p.cover_url, p.follower_count, p.is_verified,
         EXISTS (SELECT 1 FROM page_followers f WHERE f.page_id = p.id AND f.user_id = ?) AS following
       FROM social_pages p WHERE ${where.join(" AND ")} ORDER BY p.is_verified DESC, p.follower_count DESC LIMIT 60`,
      params,
    );
    return c.json({ items, categories: PAGE_CATEGORIES });
  })
  .get("/pages/mine", requireMember, async (c) => {
    const me = c.get("member").id;
    const pool = getPool();
    const [[owned], [following]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT * FROM social_pages WHERE owner_id = ? ORDER BY name", [me]),
      pool.query<RowDataPacket[]>(
        `SELECT p.id, p.name, p.slug, p.category, p.avatar_url, p.follower_count, p.is_verified FROM page_followers f
         JOIN social_pages p ON p.id = f.page_id WHERE f.user_id = ? AND p.status = 'active' ORDER BY p.name`,
        [me],
      ),
    ]);
    return c.json({ owned, following });
  })
  .get("/pages/p/:slug", async (c) => {
    const me = viewer(c);
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT p.*, u.full_name AS owner_name, u.username AS owner_username,
         EXISTS (SELECT 1 FROM page_followers f WHERE f.page_id = p.id AND f.user_id = ?) AS following
       FROM social_pages p JOIN users u ON u.id = p.owner_id WHERE p.slug = ?`,
      [me, (c.req.param("slug") ?? "")],
    );
    const page = rows[0];
    if (!page || (page.status !== "active" && page.owner_id !== me)) throw new AppError("Page not found.", 404);
    const before = Number(c.req.query("before")) || 0;
    const [posts] = await getPool().query<RowDataPacket[]>(
      `${postSelect(me)} WHERE p.page_id = ? AND p.is_hidden = 0 ${before ? "AND p.id < ?" : ""} ORDER BY p.id DESC LIMIT 15`,
      before ? [page.id, before] : [page.id],
    );
    return c.json({ page, posts, isOwner: page.owner_id === me });
  })
  .post("/pages", requireMember, validate("json", pageSchema), async (c) => {
    const input = c.req.valid("json");
    const slug = await uniqueSlug("social_pages", input.name, null);
    const { columns, params } = toColumns(input, PAGE_FIELDS);
    await getPool().execute(insertSql("social_pages", [...columns, "owner_id", "slug"]), [...params, c.get("member").id, slug]);
    return c.json({ slug }, 201);
  })
  .patch("/pages/:id", requireMember, validate("json", pageSchema.partial()), async (c) => {
    const page = await ownedPage(c, Number(c.req.param("id")));
    const { columns, params } = toColumns(c.req.valid("json"), PAGE_FIELDS);
    if (columns.length) await getPool().execute(updateSql("social_pages", columns), [...params, page.id]);
    return c.json({ ok: true });
  })
  .delete("/pages/:id", requireMember, async (c) => {
    const page = await ownedPage(c, Number(c.req.param("id")));
    await getPool().execute("DELETE FROM social_pages WHERE id = ?", [page.id]);
    return c.body(null, 204);
  })
  .post("/pages/:id/follow", requireMember, async (c) => {
    const member: SessionMember = c.get("member");
    const id = Number(c.req.param("id"));
    const pool = getPool();
    const [pages] = await pool.execute<RowDataPacket[]>("SELECT id, owner_id, name FROM social_pages WHERE id = ? AND status = 'active'", [id]);
    if (!pages[0]) throw new AppError("Page not found.", 404);
    const [removed] = await pool.execute<ResultSetHeader>("DELETE FROM page_followers WHERE page_id = ? AND user_id = ?", [id, member.id]);
    let following = false;
    if (!removed.affectedRows) {
      await pool.execute("INSERT INTO page_followers (page_id, user_id) VALUES (?, ?)", [id, member.id]);
      following = true;
      notify(pages[0].owner_id, { kind: "page", title: `${member.fullName} followed ${pages[0].name}`, actorId: member.id });
    }
    await pool.execute("UPDATE social_pages SET follower_count = (SELECT COUNT(*) FROM page_followers WHERE page_id = ?) WHERE id = ?", [id, id]);
    return c.json({ following });
  })
  .get("/pages/:id/followers", requireMember, async (c) => {
    const page = await ownedPage(c, Number(c.req.param("id")));
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT u.id, u.full_name, u.username, u.avatar_url, u.headline, f.created_at FROM page_followers f
       JOIN users u ON u.id = f.user_id WHERE f.page_id = ? ORDER BY f.created_at DESC LIMIT 500`,
      [page.id],
    );
    return c.json({ items });
  })
  // ---- Reports ----------------------------------------------------------------------------
  .post(
    "/report",
    requireMember,
    validate(
      "json",
      z.object({
        entityType: z.enum(["post", "comment", "user", "page", "group", "product", "listing", "job", "course", "event"]),
        entityId: z.number().int().positive(),
        reason: z.enum(["spam", "scam", "harassment", "hate", "nudity", "violence", "misinformation", "counterfeit", "other"]),
        details: optionalText(1000),
      }),
    ),
    async (c) => {
      const input = c.req.valid("json");
      await getPool().execute(
        "INSERT INTO reports (reporter_id, entity_type, entity_id, reason, details) VALUES (?, ?, ?, ?, ?)",
        [c.get("member").id, input.entityType, input.entityId, input.reason, input.details ?? null],
      );
      return c.json({ ok: true }, 201);
    },
  );
