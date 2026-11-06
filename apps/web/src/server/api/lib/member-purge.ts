// Removes a member and everything tied to them, module by module, then the
// account itself. Runs in one transaction: it all goes, or nothing does.
//
// This includes records other people rely on: a store's customer orders and
// tickets, a course's enrollments, applications to their jobs. The preview
// lists those separately so the admin sees them before confirming. Groups and
// forum threads with other active members survive without them.
import { getPool } from "@cv/db";
import type { PoolConnection } from "mysql2/promise";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { deleteObject, locateUrl } from "./storage.js";
import { withTransaction } from "./tx.js";

const STORE = "(SELECT id FROM sellers WHERE user_id = ?)";
const EVENTS = `(SELECT id FROM ticket_events WHERE seller_id IN ${STORE})`;
const TRIPS = `(SELECT id FROM bus_trips WHERE seller_id IN ${STORE})`;
const RENTALS = `(SELECT id FROM bus_rentals WHERE seller_id IN ${STORE})`;
const EXHIBITIONS = `(SELECT id FROM exhibitions WHERE seller_id IN ${STORE})`;
const PRODUCTS = `(SELECT id FROM products WHERE seller_id IN ${STORE})`;
const COURSES = "(SELECT id FROM courses WHERE instructor_id = ?)";
const JOBS = "(SELECT id FROM jobs WHERE user_id = ?)";
const LISTINGS = "(SELECT id FROM finder_listings WHERE user_id = ?)";
const PAGES = "(SELECT id FROM social_pages WHERE owner_id = ?)";
const POSTS = `(SELECT id FROM (SELECT id FROM social_posts WHERE author_id = ? OR wall_user_id = ? OR page_id IN ${PAGES}) mine)`;
const LISTS = "(SELECT id FROM lead_lists WHERE user_id = ?)";

interface Step {
  module: string;
  label: string;
  table: string;
  where: string; // every ? is the member's id
  others?: boolean; // belongs to other people
  hidden?: boolean; // housekeeping, not worth listing in the preview
}

// In run order: references to their content first, then what hangs off a
// parent, then the parent. Rows further down (a lesson under a course) go with
// their parent through the foreign keys.
const STEPS: Array<Step> = [
  // ---- References to their account and content ---------------------------------------------
  {
    module: "Account",
    label: "reports about them or their content",
    table: "reports",
    where: `(entity_type = 'user' AND entity_id = ?) OR (entity_type = 'post' AND entity_id IN ${POSTS})
      OR (entity_type = 'comment' AND entity_id IN (SELECT id FROM post_comments WHERE user_id = ?)) OR (entity_type = 'page' AND entity_id IN ${PAGES})
      OR (entity_type = 'product' AND entity_id IN ${PRODUCTS}) OR (entity_type = 'listing' AND entity_id IN ${LISTINGS})
      OR (entity_type = 'job' AND entity_id IN ${JOBS}) OR (entity_type = 'course' AND entity_id IN ${COURSES}) OR (entity_type = 'event' AND entity_id IN ${EVENTS})`,
    hidden: true,
  },
  {
    module: "Account",
    label: "saves of their listings by other members",
    table: "favourites",
    where: `user_id <> ? AND ((entity_type = 'product' AND entity_id IN ${PRODUCTS}) OR (entity_type = 'listing' AND entity_id IN ${LISTINGS})
      OR (entity_type = 'job' AND entity_id IN ${JOBS}) OR (entity_type = 'course' AND entity_id IN ${COURSES})
      OR (entity_type = 'event' AND entity_id IN ${EVENTS}) OR (entity_type = 'store' AND entity_id IN ${STORE}))`,
    others: true,
  },
  { module: "Account", label: "reports they filed", table: "reports", where: "reporter_id = ?" },
  { module: "Account", label: "notifications", table: "notifications", where: "user_id = ? OR actor_id = ?" },
  { module: "Account", label: "friendships and requests", table: "friendships", where: "requester_id = ? OR addressee_id = ?" },
  { module: "Account", label: "saved items", table: "favourites", where: "user_id = ?" },
  // ---- Marketplace --------------------------------------------------------------------------
  { module: "Marketplace", label: "product reviews", table: "product_reviews", where: "user_id = ?" },
  { module: "Marketplace", label: "orders they placed", table: "orders", where: "user_id = ?" },
  { module: "Marketplace", label: "customer orders from their store", table: "orders", where: `seller_id IN ${STORE} AND user_id <> ?`, others: true },
  { module: "Marketplace", label: "products and menu items", table: "products", where: `seller_id IN ${STORE}` },
  // ---- E-tickets and exhibitions ------------------------------------------------------------
  { module: "E-tickets", label: "tickets they bought", table: "tickets", where: "user_id = ?" },
  { module: "E-tickets", label: "bus rental requests they made", table: "rental_requests", where: "user_id = ?" },
  { module: "E-tickets", label: "exhibition bookings they made", table: "exhibition_bookings", where: "user_id = ?" },
  { module: "E-tickets", label: "tickets customers hold for their events and trips", table: "tickets", where: `(event_id IN ${EVENTS} OR trip_id IN ${TRIPS}) AND user_id <> ?`, others: true },
  { module: "E-tickets", label: "customer requests for their buses", table: "rental_requests", where: `rental_id IN ${RENTALS} AND user_id <> ?`, others: true },
  { module: "E-tickets", label: "customer bookings for their exhibitions", table: "exhibition_bookings", where: `exhibition_id IN ${EXHIBITIONS} AND user_id <> ?`, others: true },
  { module: "E-tickets", label: "events", table: "ticket_events", where: `seller_id IN ${STORE}` },
  { module: "E-tickets", label: "bus trips", table: "bus_trips", where: `seller_id IN ${STORE}` },
  { module: "E-tickets", label: "bus rentals", table: "bus_rentals", where: `seller_id IN ${STORE}` },
  { module: "E-tickets", label: "exhibitions", table: "exhibitions", where: `seller_id IN ${STORE}` },
  { module: "Marketplace", label: "store", table: "sellers", where: "user_id = ?" },
  // ---- Job Circle ---------------------------------------------------------------------------
  { module: "Job Circle", label: "job applications they sent", table: "job_applications", where: "user_id = ?" },
  { module: "Job Circle", label: "applications to their jobs", table: "job_applications", where: `job_id IN ${JOBS} AND user_id <> ?`, others: true },
  { module: "Job Circle", label: "jobs", table: "jobs", where: "user_id = ?" },
  // ---- Finder -------------------------------------------------------------------------------
  { module: "Finder", label: "reviews", table: "finder_reviews", where: "user_id = ?" },
  { module: "Finder", label: "listings", table: "finder_listings", where: "user_id = ?" },
  // ---- Groups -------------------------------------------------------------------------------
  { module: "Groups", label: "replies", table: "group_replies", where: "user_id = ?" },
  { module: "Groups", label: "topics", table: "group_topics", where: "user_id = ?" },
  { module: "Groups", label: "posts", table: "group_posts", where: "user_id = ?" },
  { module: "Groups", label: "meetings they set up", table: "group_meetings", where: "created_by = ?" },
  { module: "Groups", label: "donations", table: "group_donations", where: "user_id = ?" },
  { module: "Groups", label: "group memberships", table: "group_members", where: "user_id = ?" },
  // ---- SocialNet ----------------------------------------------------------------------------
  { module: "SocialNet", label: "reactions", table: "post_reactions", where: "user_id = ?" },
  { module: "SocialNet", label: "comments", table: "post_comments", where: "user_id = ?" },
  { module: "SocialNet", label: "pages followed", table: "page_followers", where: "user_id = ?" },
  { module: "SocialNet", label: "posts, including others' posts on their wall", table: "social_posts", where: `author_id = ? OR wall_user_id = ? OR page_id IN ${PAGES}` },
  { module: "SocialNet", label: "pages", table: "social_pages", where: "owner_id = ?" },
  // ---- Chat ---------------------------------------------------------------------------------
  { module: "Chat", label: "one-to-one conversations, with both sides' messages", table: "chat_threads", where: "type = 'direct' AND id IN (SELECT thread_id FROM chat_participants WHERE user_id = ?)" },
  { module: "Chat", label: "chat rooms for their courses", table: "chat_threads", where: `type = 'course' AND ref_id IN ${COURSES}`, hidden: true },
  { module: "Chat", label: "messages in shared rooms", table: "chat_messages", where: "sender_id = ?" },
  { module: "Chat", label: "shared room memberships", table: "chat_participants", where: "user_id = ?", hidden: true },
  // ---- OpenLearn ----------------------------------------------------------------------------
  { module: "OpenLearn", label: "assignment submissions", table: "assignment_submissions", where: "user_id = ?" },
  { module: "OpenLearn", label: "course discussions", table: "course_discussions", where: "user_id = ?" },
  { module: "OpenLearn", label: "course reviews", table: "course_reviews", where: "user_id = ?" },
  { module: "OpenLearn", label: "course enrollments", table: "enrollments", where: "user_id = ?" },
  { module: "OpenLearn", label: "students enrolled in their courses", table: "enrollments", where: `course_id IN ${COURSES} AND user_id <> ?`, others: true },
  { module: "OpenLearn", label: "courses they teach", table: "courses", where: "instructor_id = ?" },
  // ---- kidiLearn ----------------------------------------------------------------------------
  { module: "kidiLearn", label: "quiz attempts", table: "kidi_quiz_attempts", where: "user_id = ?" },
  { module: "kidiLearn", label: "child profiles", table: "kidi_children", where: "parent_user_id = ?" },
  { module: "kidiLearn", label: "plans", table: "kidi_plans", where: "user_id = ?" },
  // ---- Quizbank -----------------------------------------------------------------------------
  { module: "Quizbank", label: "exam attempts", table: "qb_attempts", where: "user_id = ?" },
  { module: "Quizbank", label: "study board courses", table: "qb_board", where: "user_id = ?" },
  { module: "Quizbank", label: "bookmarks", table: "qb_bookmarks", where: "user_id = ?" },
  { module: "Quizbank", label: "study sets", table: "qb_variations", where: "user_id = ?" },
  { module: "Quizbank", label: "discussion votes", table: "qb_discussion_votes", where: "user_id = ?" },
  { module: "Quizbank", label: "discussion comments", table: "qb_discussions", where: "user_id = ?" },
  { module: "Quizbank", label: "course view history", table: "qb_course_member_views", where: "user_id = ?", hidden: true },
  // ---- LeadGen ------------------------------------------------------------------------------
  { module: "LeadGen", label: "lead list access", table: "lead_access", where: "user_id = ?" },
  { module: "LeadGen", label: "other members' access to their lead lists", table: "lead_access", where: `list_id IN ${LISTS} AND user_id <> ?`, others: true },
  { module: "LeadGen", label: "lead lists", table: "lead_lists", where: "user_id = ?" },
  { module: "LeadGen", label: "payouts", table: "lead_payouts", where: "user_id = ?" },
  { module: "LeadGen", label: "broadcast schedules", table: "broadcast_series", where: "user_id = ?" },
  { module: "LeadGen", label: "broadcasts", table: "broadcasts", where: "user_id = ?" },
  { module: "LeadGen", label: "sender IDs", table: "sender_ids", where: "user_id = ?" },
  { module: "LeadGen", label: "credit requests", table: "credit_requests", where: "user_id = ?" },
  { module: "LeadGen", label: "credit history", table: "credit_transactions", where: "user_id = ?" },
  { module: "LeadGen", label: "voucher redemptions", table: "credit_voucher_redemptions", where: "user_id = ?" },
  { module: "LeadGen", label: "credit wallet", table: "broadcast_wallets", where: "user_id = ?" },
  // ---- Payments -----------------------------------------------------------------------------
  { module: "Payments", label: "payment records", table: "payments", where: "user_id = ?" },
];

const params = (sql: string, id: number) => Array.from(sql.matchAll(/\?/g), () => id);

// Running totals on other people's records that their rows fed. Run before the
// rows go, because they read them.
const ADJUST = [
  // Same as cancelling an order: the sale comes off, and goods not yet sent go back in stock.
  `UPDATE products p JOIN (
     SELECT oi.product_id, SUM(oi.quantity) AS sold, SUM(IF(o.status IN ('pending', 'confirmed', 'ready'), oi.quantity, 0)) AS unsent
     FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.user_id = ? AND o.status <> 'cancelled' AND oi.product_id IS NOT NULL GROUP BY oi.product_id
   ) x ON x.product_id = p.id SET p.sold_count = IF(p.sold_count > x.sold, p.sold_count - x.sold, 0), p.stock = IF(p.stock IS NULL, NULL, p.stock + x.unsent)`,
  `UPDATE ticket_types tt JOIN (SELECT ticket_type_id, COUNT(*) AS n FROM tickets WHERE user_id = ? AND status <> 'cancelled' AND ticket_type_id IS NOT NULL GROUP BY ticket_type_id) x
     ON x.ticket_type_id = tt.id SET tt.sold = IF(tt.sold > x.n, tt.sold - x.n, 0)`,
  `UPDATE bus_trips b JOIN (SELECT trip_id, COUNT(*) AS n FROM tickets WHERE user_id = ? AND status <> 'cancelled' AND trip_id IS NOT NULL GROUP BY trip_id) x
     ON x.trip_id = b.id SET b.seats_booked = IF(b.seats_booked > x.n, b.seats_booked - x.n, 0)`,
  `UPDATE exhibitions e JOIN (SELECT exhibition_id, SUM(booths) AS n FROM exhibition_bookings WHERE user_id = ? AND status IN ('approved', 'paid') GROUP BY exhibition_id) x
     ON x.exhibition_id = e.id SET e.booths_taken = IF(e.booths_taken > x.n, e.booths_taken - x.n, 0)`,
  `UPDATE courses c JOIN (SELECT course_id, COUNT(*) AS n FROM enrollments WHERE user_id = ? AND status IN ('active', 'completed') GROUP BY course_id) x
     ON x.course_id = c.id SET c.enrollment_count = IF(c.enrollment_count > x.n, c.enrollment_count - x.n, 0)`,
  `UPDATE qb_courses c JOIN qb_board b ON b.course_id = c.id AND b.user_id = ? SET c.board_count = IF(c.board_count > 0, c.board_count - 1, 0)`,
  `UPDATE group_campaigns g JOIN (SELECT campaign_id, SUM(amount) AS amount, COUNT(*) AS n FROM group_donations WHERE user_id = ? AND status = 'confirmed' GROUP BY campaign_id) x
     ON x.campaign_id = g.id SET g.raised_amount = IF(g.raised_amount > x.amount, g.raised_amount - x.amount, 0), g.donor_count = IF(g.donor_count > x.n, g.donor_count - x.n, 0)`,
  `UPDATE credit_vouchers v JOIN credit_voucher_redemptions r ON r.voucher_id = v.id AND r.user_id = ? SET v.redeemed_count = IF(v.redeemed_count > 0, v.redeemed_count - 1, 0)`,
  `UPDATE social_posts p JOIN (SELECT shared_post_id, COUNT(*) AS n FROM social_posts WHERE author_id = ? AND shared_post_id IS NOT NULL GROUP BY shared_post_id) x
     ON x.shared_post_id = p.id SET p.share_count = IF(p.share_count > x.n, p.share_count - x.n, 0)`,
];

// Counts and ratings worked out from their source rows: which records they
// touched is read first, and each is counted again once the rows have gone.
const RECOUNT: Array<{ ids: string; update: string }> = [
  {
    ids: "SELECT DISTINCT product_id AS id FROM product_reviews WHERE user_id = ?",
    update: `UPDATE products p SET rating_avg = (SELECT ROUND(AVG(rating), 1) FROM product_reviews WHERE product_id = p.id AND is_hidden = 0),
      rating_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_hidden = 0) WHERE p.id IN (?)`,
  },
  {
    ids: "SELECT DISTINCT p.seller_id AS id FROM product_reviews r JOIN products p ON p.id = r.product_id WHERE r.user_id = ?",
    update: `UPDATE sellers s SET rating_avg = (SELECT ROUND(AVG(r.rating), 1) FROM product_reviews r JOIN products p ON p.id = r.product_id WHERE p.seller_id = s.id AND r.is_hidden = 0),
      rating_count = (SELECT COUNT(*) FROM product_reviews r JOIN products p ON p.id = r.product_id WHERE p.seller_id = s.id AND r.is_hidden = 0) WHERE s.id IN (?)`,
  },
  {
    ids: "SELECT DISTINCT listing_id AS id FROM finder_reviews WHERE user_id = ?",
    update: `UPDATE finder_listings l SET rating_avg = (SELECT ROUND(AVG(rating), 1) FROM finder_reviews WHERE listing_id = l.id AND is_hidden = 0),
      rating_count = (SELECT COUNT(*) FROM finder_reviews WHERE listing_id = l.id AND is_hidden = 0) WHERE l.id IN (?)`,
  },
  {
    ids: "SELECT DISTINCT course_id AS id FROM course_reviews WHERE user_id = ?",
    update: `UPDATE courses c SET rating_avg = (SELECT ROUND(AVG(rating), 1) FROM course_reviews WHERE course_id = c.id AND is_hidden = 0),
      rating_count = (SELECT COUNT(*) FROM course_reviews WHERE course_id = c.id AND is_hidden = 0) WHERE c.id IN (?)`,
  },
  {
    ids: "SELECT DISTINCT parent_id AS id FROM course_discussions WHERE user_id = ? AND parent_id IS NOT NULL",
    update: "UPDATE course_discussions d JOIN (SELECT id FROM course_discussions WHERE id IN (?)) t ON t.id = d.id SET d.reply_count = (SELECT COUNT(*) FROM (SELECT parent_id FROM course_discussions) r WHERE r.parent_id = d.id)",
  },
  {
    ids: "SELECT DISTINCT post_id AS id FROM post_comments WHERE user_id = ?",
    update: "UPDATE social_posts p SET comment_count = (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) WHERE p.id IN (?)",
  },
  {
    ids: "SELECT DISTINCT post_id AS id FROM post_reactions WHERE user_id = ?",
    update: "UPDATE social_posts p SET reaction_count = (SELECT COUNT(*) FROM post_reactions WHERE post_id = p.id) WHERE p.id IN (?)",
  },
  {
    ids: "SELECT DISTINCT page_id AS id FROM page_followers WHERE user_id = ?",
    update: "UPDATE social_pages p SET follower_count = (SELECT COUNT(*) FROM page_followers WHERE page_id = p.id) WHERE p.id IN (?)",
  },
  {
    ids: "SELECT DISTINCT group_id AS id FROM group_members WHERE user_id = ?",
    update: "UPDATE campus_groups g SET member_count = (SELECT COUNT(*) FROM group_members WHERE group_id = g.id AND status = 'active') WHERE g.id IN (?)",
  },
  {
    ids: "SELECT DISTINCT topic_id AS id FROM group_replies WHERE user_id = ?",
    update: "UPDATE group_topics t SET reply_count = (SELECT COUNT(*) FROM group_replies WHERE topic_id = t.id) WHERE t.id IN (?)",
  },
  {
    ids: "SELECT DISTINCT thread_id AS id FROM chat_messages WHERE sender_id = ?",
    update: `UPDATE chat_threads t SET message_count = (SELECT COUNT(*) FROM chat_messages WHERE thread_id = t.id),
      last_message_at = (SELECT MAX(created_at) FROM chat_messages WHERE thread_id = t.id) WHERE t.id IN (?)`,
  },
  {
    ids: "SELECT DISTINCT question_id AS id FROM qb_discussions WHERE user_id = ?",
    update: "UPDATE qb_questions q SET discussion_count = (SELECT COUNT(*) FROM qb_discussions WHERE question_id = q.id) WHERE q.id IN (?)",
  },
  {
    ids: "SELECT DISTINCT discussion_id AS id FROM qb_discussion_votes WHERE user_id = ?",
    update: "UPDATE qb_discussions d SET helpful_count = (SELECT COUNT(*) FROM qb_discussion_votes WHERE discussion_id = d.id) WHERE d.id IN (?)",
  },
  {
    ids: "SELECT DISTINCT list_id AS id FROM lead_access WHERE user_id = ?",
    update: "UPDATE lead_lists l SET access_count = (SELECT COUNT(*) FROM lead_access WHERE list_id = l.id AND source <> 'owner' AND status = 'active') WHERE l.id IN (?)",
  },
];

// Groups they own or started, and forum threads they started, that nobody else is active in.
const EMPTY_GROUPS = `SELECT g.id FROM campus_groups g WHERE (g.created_by = ? OR g.id IN (SELECT group_id FROM group_members WHERE user_id = ? AND role = 'owner'))
  AND NOT EXISTS (SELECT 1 FROM group_members m WHERE m.group_id = g.id AND m.user_id <> ? AND m.status = 'active')`;
const EMPTY_THREADS = `SELECT t.id FROM chat_threads t WHERE t.created_by = ? AND t.type <> 'direct'
  AND NOT EXISTS (SELECT 1 FROM chat_participants x WHERE x.thread_id = t.id AND x.user_id <> ?)
  AND NOT EXISTS (SELECT 1 FROM chat_messages x WHERE x.thread_id = t.id AND x.sender_id <> ?)`;

const count = async (sql: string, id: number) => {
  const [rows] = await getPool().query<RowDataPacket[]>(sql, params(sql, id));
  return Number(rows[0]?.n ?? 0);
};

// What deleting this member would remove, for the admin to read first.
export async function purgePreview(id: number) {
  const counted = await Promise.all(
    STEPS.filter((s) => !s.hidden).map(async (s) => ({ ...s, count: await count(`SELECT COUNT(*) AS n FROM ${s.table} WHERE ${s.where}`, id) })),
  );
  const [groups, files, credits] = await Promise.all([
    count(`SELECT COUNT(*) AS n FROM (${EMPTY_GROUPS}) g`, id),
    count("SELECT COUNT(*) AS n FROM media_assets WHERE user_id = ?", id),
    count("SELECT COALESCE(SUM(balance), 0) AS n FROM broadcast_wallets WHERE user_id = ?", id),
  ]);
  const found = counted.filter((s) => s.count > 0);
  const own = new Map<string, Array<{ label: string; count: number }>>();
  for (const s of found.filter((x) => !x.others)) own.set(s.module, [...(own.get(s.module) ?? []), { label: s.label, count: s.count }]);
  if (groups) own.set("Groups", [...(own.get("Groups") ?? []), { label: "groups with no other active members", count: groups }]);
  if (files) own.set("Files", [{ label: "uploaded files", count: files }]);
  return {
    own: [...own].map(([module, items]) => ({ module, items })),
    others: found.filter((x) => x.others).map((s) => ({ module: s.module, label: s.label, count: s.count })),
    credits,
  };
}

async function idsOf(conn: PoolConnection, sql: string, id: number) {
  const [rows] = await conn.query<RowDataPacket[]>(sql, params(sql, id));
  return rows.map((r) => r.id as number);
}

async function removeUnusedFile(asset: RowDataPacket, stillUsed: (url: string) => Promise<boolean>) {
  try {
    if (await stillUsed(asset.url as string)) return;
    await deleteObject(asset.file_key as string, locateUrl(asset.url as string)?.driver);
    await getPool().execute("DELETE FROM media_assets WHERE id = ?", [asset.id]);
  } catch (err) {
    // The account is already gone: leave the file listed in the media library to clear by hand.
    console.error(`Couldn't remove file ${asset.file_key}:`, err);
  }
}

// `stillUsed` tells whether another record still shows an uploaded file.
export async function purgeMember(id: number, stillUsed: (url: string) => Promise<boolean>) {
  const [assets] = await getPool().execute<RowDataPacket[]>("SELECT id, file_key, url FROM media_assets WHERE user_id = ?", [id]);
  const removed = await withTransaction(async (conn) => {
    let rows = 0;
    const recounts = await Promise.all(RECOUNT.map(async (r) => ({ update: r.update, ids: await idsOf(conn, r.ids, id) })));
    const owned = await idsOf(conn, "SELECT id FROM campus_groups WHERE created_by = ? UNION SELECT group_id FROM group_members WHERE user_id = ? AND role = 'owner'", id);
    const emptyGroups = await idsOf(conn, EMPTY_GROUPS, id);
    const emptyThreads = await idsOf(conn, EMPTY_THREADS, id);
    for (const sql of ADJUST) await conn.query(sql, params(sql, id));
    for (const s of STEPS) {
      const sql = `DELETE FROM ${s.table} WHERE ${s.where}`;
      const [res] = await conn.query<ResultSetHeader>(sql, params(sql, id));
      rows += res.affectedRows;
    }
    if (emptyGroups.length) {
      await conn.query("DELETE FROM reports WHERE entity_type = 'group' AND entity_id IN (?)", [emptyGroups]);
      await conn.query("DELETE FROM chat_threads WHERE type = 'group' AND ref_id IN (?)", [emptyGroups]);
      await conn.query("DELETE FROM campus_groups WHERE id IN (?)", [emptyGroups]);
    }
    if (emptyThreads.length) await conn.query("DELETE FROM chat_threads WHERE id IN (?)", [emptyThreads]);
    // A group that keeps other members also keeps someone to run it: the longest-standing one.
    for (const groupId of owned.filter((g) => !emptyGroups.includes(g))) {
      await conn.query(
        `UPDATE group_members m JOIN (SELECT id FROM group_members WHERE group_id = ? AND status = 'active' ORDER BY FIELD(role, 'admin', 'moderator', 'member'), joined_at, id LIMIT 1) next ON next.id = m.id
         SET m.role = 'owner' WHERE NOT EXISTS (SELECT 1 FROM (SELECT group_id FROM group_members WHERE group_id = ? AND role = 'owner') o)`,
        [groupId, groupId],
      );
    }
    for (const r of recounts) if (r.ids.length) await conn.query(r.update, [r.ids]);
    await conn.execute("DELETE FROM users WHERE id = ?", [id]);
    return rows;
  });
  for (const asset of assets) await removeUnusedFile(asset, stillUsed);
  return removed;
}
