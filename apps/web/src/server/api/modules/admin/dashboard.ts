import { Hono } from "hono";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";

// Platform-wide numbers and the approval queues waiting for a moderator.
export const dashboardRoute = new Hono().get("/", requirePermission("dashboard", "view"), async (c) => {
  const pool = getPool();
  const [[totals], [queues], [signups], [revenue], [recent]] = await Promise.all([
    pool.query<RowDataPacket[]>(
      `SELECT (SELECT COUNT(*) FROM users) AS members,
         (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL 7 DAY) AS members_week,
         (SELECT COUNT(*) FROM users WHERE last_seen_at >= NOW() - INTERVAL 1 DAY) AS active_today,
         (SELECT COUNT(*) FROM sellers WHERE status = 'approved') AS stores,
         (SELECT COUNT(*) FROM products WHERE status = 'active') AS products,
         (SELECT COUNT(*) FROM orders) AS orders,
         (SELECT COUNT(*) FROM tickets WHERE status IN ('paid', 'used')) AS tickets,
         (SELECT COUNT(*) FROM jobs WHERE status = 'published') AS jobs,
         (SELECT COUNT(*) FROM finder_listings WHERE status = 'published') AS listings,
         (SELECT COUNT(*) FROM campus_groups WHERE status = 'approved') AS groups_count,
         (SELECT COUNT(*) FROM social_posts) AS posts,
         (SELECT COUNT(*) FROM courses WHERE status = 'published') AS courses,
         (SELECT COUNT(*) FROM enrollments) AS enrollments,
         (SELECT COUNT(*) FROM lead_lists WHERE status = 'published') AS lead_lists,
         (SELECT COALESCE(SUM(sent_count), 0) FROM broadcasts) AS messages_sent`,
    ),
    pool.query<RowDataPacket[]>(
      `SELECT (SELECT COUNT(*) FROM sellers WHERE status = 'pending') AS sellers,
         (SELECT COUNT(*) FROM ticket_events WHERE status = 'pending') AS events,
         (SELECT COUNT(*) FROM jobs WHERE status = 'pending') AS jobs,
         (SELECT COUNT(*) FROM exhibitions WHERE status = 'pending') AS exhibitions,
         (SELECT COUNT(*) FROM finder_listings WHERE status = 'pending') AS listings,
         (SELECT COUNT(*) FROM campus_groups WHERE status = 'pending') AS groups_count,
         (SELECT COUNT(*) FROM courses WHERE status = 'in_review') AS courses,
         (SELECT COUNT(*) FROM reports WHERE status = 'open') AS reports,
         (SELECT COUNT(*) FROM lead_lists WHERE status = 'pending') AS lead_lists,
         (SELECT COUNT(*) FROM sender_ids WHERE status = 'pending') AS sender_ids,
         (SELECT COUNT(*) FROM lead_payouts WHERE status = 'requested') AS payouts`,
    ),
    pool.query<RowDataPacket[]>(
      `SELECT DATE(created_at) AS day, COUNT(*) AS n FROM users WHERE created_at >= CURDATE() - INTERVAL 29 DAY
       GROUP BY DATE(created_at) ORDER BY day`,
    ),
    pool.query<RowDataPacket[]>(
      `SELECT purpose, COALESCE(SUM(amount), 0) AS total, COUNT(*) AS n FROM payments
       WHERE status = 'success' AND paid_at >= NOW() - INTERVAL 30 DAY GROUP BY purpose`,
    ),
    pool.query<RowDataPacket[]>(
      "SELECT id, full_name, username, avatar_url, member_type, created_at FROM users ORDER BY id DESC LIMIT 8",
    ),
  ]);
  return c.json({ totals: totals[0], queues: queues[0], signups, revenue, recent });
});
