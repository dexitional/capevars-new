// One moderation engine for every queue in the admin portal. Each entity
// declares how to list it (SELECT, search columns, status filter) and which
// actions exist (columns to set, who to notify). The API is:
//
//   GET    /api/admin/mod/:entity?status=&q=&page=   → { items, total, counts }
//   POST   /api/admin/mod/:entity/:id/:action        { reason? }
//   DELETE /api/admin/mod/:entity/:id
//
// Permissions come from lib/permissions.ts: "view" to list, "manage" to act.
import { Hono } from "hono";
import type { Context, Next } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import type { AdminModule } from "#/lib/permissions";
import { canManage, canView } from "#/lib/permissions";
import { requireAdminRole, ANY_ADMIN } from "../../middleware/require-auth.js";
import { AppError } from "../../middleware/error-handler.js";
import { likePattern, paging, pageQuerySchema } from "../../lib/query.js";
import { logActivity } from "../../lib/activity.js";
import type { ActivityAction } from "../../lib/activity.js";
import { notify } from "../../lib/notify.js";

type Value = string | number | null | "$reason" | "$now" | "$admin";

interface Action {
  label: string;
  set: Record<string, Value>;
  log: ActivityAction;
  // Message to the owner; {title} is replaced with the item's title.
  notify?: { title: string; link?: string };
  after?: (row: RowDataPacket) => Promise<unknown>;
}

interface Entity {
  module: AdminModule;
  table: string;
  // SELECT ... FROM <table> t ... (no WHERE). Must expose t.id, title, owner_id.
  select: string;
  search: Array<string>;
  statusColumn?: string;
  statuses?: Array<string>;
  order?: string;
  actions: Record<string, Action>;
  deletable?: boolean;
  link?: (row: RowDataPacket) => string | null;
}

const recalc = (sql: string) => (row: RowDataPacket) => getPool().execute(sql, [row.parent_id, row.parent_id]);

// Quizbank questions show how many visible comments they have.
const recountDiscussions = (row: RowDataPacket) =>
  getPool().execute("UPDATE qb_questions SET discussion_count = (SELECT COUNT(*) FROM qb_discussions WHERE question_id = ? AND status = 'visible') WHERE id = ?", [
    row.question_id,
    row.question_id,
  ]);

const feature: Record<string, Action> = {
  feature: { label: "Feature", set: { is_featured: 1 }, log: "updated" },
  unfeature: { label: "Unfeature", set: { is_featured: 0 }, log: "updated" },
};
const verify: Record<string, Action> = {
  verify: { label: "Verify", set: { is_verified: 1 }, log: "updated", notify: { title: "{title} is now verified ✓" } },
  unverify: { label: "Remove verification", set: { is_verified: 0 }, log: "updated" },
};

export const ENTITIES: Record<string, Entity> = {
  members: {
    module: "members",
    table: "users",
    select: `SELECT t.id, t.full_name AS title, t.username, t.email, t.avatar_url, t.member_type, t.institution, t.is_verified,
      t.is_active, t.google_sub IS NOT NULL AS uses_google, t.last_login_at, t.last_seen_at, t.created_at, t.id AS owner_id,
      IF(t.is_active, 'active', 'suspended') AS status,
      (SELECT store_name FROM sellers WHERE user_id = t.id) AS store_name FROM users t`,
    search: ["t.full_name", "t.email", "t.username"],
    statusColumn: "IF(t.is_active, 'active', 'suspended')",
    statuses: ["active", "suspended"],
    actions: {
      suspend: { label: "Suspend", set: { is_active: 0 }, log: "suspended" },
      activate: { label: "Reactivate", set: { is_active: 1, failed_login_attempts: 0, locked_until: null }, log: "updated" },
      ...verify,
    },
    link: (r) => `/u/${r.username}`,
  },
  sellers: {
    module: "sellers",
    table: "sellers",
    select: `SELECT t.*, t.store_name AS title, t.user_id AS owner_id, u.full_name AS owner_name, u.email AS owner_email,
      (SELECT COUNT(*) FROM products p WHERE p.seller_id = t.id) AS product_count,
      (SELECT COUNT(*) FROM orders o WHERE o.seller_id = t.id) AS order_count
      FROM sellers t JOIN users u ON u.id = t.user_id`,
    search: ["t.store_name", "u.full_name", "u.email", "t.phone"],
    statusColumn: "t.status",
    statuses: ["pending", "approved", "rejected", "suspended"],
    actions: {
      approve: {
        label: "Approve",
        set: { status: "approved", status_reason: null, reviewed_by: "$admin", reviewed_at: "$now" },
        log: "approved",
        notify: { title: "Your store {title} is approved — start selling!", link: "/seller" },
      },
      reject: {
        label: "Reject",
        set: { status: "rejected", status_reason: "$reason", reviewed_by: "$admin", reviewed_at: "$now" },
        log: "rejected",
        notify: { title: "Your store application needs changes", link: "/seller/apply" },
      },
      suspend: {
        label: "Suspend",
        set: { status: "suspended", status_reason: "$reason", reviewed_by: "$admin", reviewed_at: "$now" },
        log: "suspended",
        notify: { title: "Your store {title} was suspended", link: "/seller" },
      },
      ...verify,
      ...feature,
    },
    link: (r) => `/market/store/${r.slug}`,
  },
  products: {
    module: "products",
    table: "products",
    select: `SELECT t.id, t.title, t.slug, t.kind, t.price, t.compare_at_price, t.stock, t.status, t.is_featured, t.sold_count,
      t.view_count, t.created_at, JSON_UNQUOTE(JSON_EXTRACT(t.images, '$[0]')) AS image, s.store_name, s.user_id AS owner_id,
      c.name AS category_name FROM products t JOIN sellers s ON s.id = t.seller_id LEFT JOIN market_categories c ON c.id = t.category_id`,
    search: ["t.title", "s.store_name"],
    statusColumn: "t.status",
    statuses: ["active", "draft", "hidden", "blocked"],
    actions: {
      block: { label: "Block", set: { status: "blocked" }, log: "suspended", notify: { title: "Your listing \"{title}\" was blocked by moderators", link: "/seller/products" } },
      unblock: { label: "Unblock", set: { status: "active" }, log: "updated" },
      ...feature,
    },
    deletable: true,
    link: (r) => `/market/p/${r.slug}`,
  },
  orders: {
    module: "orders",
    table: "orders",
    select: `SELECT t.*, t.order_no AS title, t.user_id AS owner_id, u.full_name AS buyer_name, u.email AS buyer_email, s.store_name,
      (SELECT COUNT(*) FROM order_items i WHERE i.order_id = t.id) AS item_count
      FROM orders t JOIN users u ON u.id = t.user_id JOIN sellers s ON s.id = t.seller_id`,
    search: ["t.order_no", "u.full_name", "s.store_name", "t.contact_phone"],
    statusColumn: "t.status",
    statuses: ["pending", "confirmed", "ready", "shipped", "delivered", "cancelled"],
    actions: {},
  },
  events: {
    module: "tickets",
    table: "ticket_events",
    select: `SELECT t.*, s.store_name AS organizer, s.user_id AS owner_id,
      (SELECT COALESCE(SUM(sold), 0) FROM ticket_types WHERE event_id = t.id) AS sold,
      (SELECT MIN(price) FROM ticket_types WHERE event_id = t.id) AS from_price
      FROM ticket_events t LEFT JOIN sellers s ON s.id = t.seller_id`,
    search: ["t.title", "t.venue", "s.store_name"],
    statusColumn: "t.status",
    statuses: ["pending", "published", "rejected", "cancelled", "draft"],
    order: "t.status = 'pending' DESC, t.starts_at DESC",
    actions: {
      approve: { label: "Publish", set: { status: "published", status_reason: null }, log: "approved", notify: { title: "Your event \"{title}\" is live", link: "/seller/events" } },
      reject: { label: "Reject", set: { status: "rejected", status_reason: "$reason" }, log: "rejected", notify: { title: "Your event \"{title}\" needs changes", link: "/seller/events" } },
      cancel: { label: "Cancel", set: { status: "cancelled", status_reason: "$reason" }, log: "suspended", notify: { title: "Your event \"{title}\" was cancelled by moderators", link: "/seller/events" } },
      ...feature,
    },
    link: (r) => `/market/tickets/e/${r.slug}`,
  },
  trips: {
    module: "tickets",
    table: "bus_trips",
    select: `SELECT t.*, CONCAT(t.origin, ' → ', t.destination) AS title, s.store_name AS operator, s.user_id AS owner_id
      FROM bus_trips t JOIN sellers s ON s.id = t.seller_id`,
    search: ["t.origin", "t.destination", "s.store_name"],
    statusColumn: "t.status",
    statuses: ["scheduled", "completed", "cancelled", "blocked"],
    order: "t.departs_at DESC",
    actions: {
      block: { label: "Block", set: { status: "blocked" }, log: "suspended", notify: { title: "Your trip {title} was blocked by moderators", link: "/seller/trips" } },
      unblock: { label: "Unblock", set: { status: "scheduled" }, log: "updated" },
    },
    link: (r) => `/market/tickets/bus/${r.id}`,
  },
  rentals: {
    module: "tickets",
    table: "bus_rentals",
    select: `SELECT t.*, s.store_name AS operator, s.user_id AS owner_id, JSON_UNQUOTE(JSON_EXTRACT(t.images, '$[0]')) AS image
      FROM bus_rentals t JOIN sellers s ON s.id = t.seller_id`,
    search: ["t.title", "t.vehicle_type", "s.store_name"],
    statusColumn: "t.status",
    statuses: ["active", "hidden", "blocked"],
    actions: {
      block: { label: "Block", set: { status: "blocked" }, log: "suspended" },
      unblock: { label: "Unblock", set: { status: "active" }, log: "updated" },
    },
    link: (r) => `/market/tickets/rentals/${r.id}`,
  },
  jobs: {
    module: "jobs",
    table: "jobs",
    select: `SELECT t.*, t.user_id AS owner_id, u.full_name AS poster_name, u.email AS poster_email,
      (SELECT COUNT(*) FROM job_applications a WHERE a.job_id = t.id) AS applicants
      FROM jobs t JOIN users u ON u.id = t.user_id`,
    search: ["t.title", "t.company_name", "u.full_name"],
    statusColumn: "t.status",
    statuses: ["pending", "published", "closed", "rejected"],
    order: "t.status = 'pending' DESC, t.id DESC",
    actions: {
      approve: { label: "Publish", set: { status: "published", status_reason: null }, log: "approved", notify: { title: "Your job \"{title}\" is live", link: "/market/jobs/mine" } },
      reject: { label: "Reject", set: { status: "rejected", status_reason: "$reason" }, log: "rejected", notify: { title: "Your job \"{title}\" needs changes", link: "/market/jobs/mine" } },
      close: { label: "Close", set: { status: "closed" }, log: "updated" },
      ...feature,
    },
    deletable: true,
    link: (r) => `/market/jobs/${r.slug}`,
  },
  exhibitions: {
    module: "exhibitions",
    table: "exhibitions",
    select: `SELECT t.*, s.store_name AS organizer, s.user_id AS owner_id FROM exhibitions t LEFT JOIN sellers s ON s.id = t.seller_id`,
    search: ["t.title", "t.venue", "s.store_name"],
    statusColumn: "t.status",
    statuses: ["pending", "published", "rejected", "cancelled"],
    order: "t.status = 'pending' DESC, t.starts_at DESC",
    actions: {
      approve: { label: "Publish", set: { status: "published", status_reason: null }, log: "approved", notify: { title: "Your exhibition \"{title}\" is live", link: "/seller/exhibitions" } },
      reject: { label: "Reject", set: { status: "rejected", status_reason: "$reason" }, log: "rejected", notify: { title: "Your exhibition \"{title}\" needs changes", link: "/seller/exhibitions" } },
      cancel: { label: "Cancel", set: { status: "cancelled", status_reason: "$reason" }, log: "suspended" },
      ...feature,
    },
    link: (r) => `/market/exhibitions/${r.slug}`,
  },
  listings: {
    module: "finder",
    table: "finder_listings",
    select: `SELECT t.id, t.type, t.name AS title, t.slug, t.cover_url, t.area, t.city, t.phone, t.status, t.status_reason,
      t.is_verified, t.is_featured, t.rating_avg, t.rating_count, t.view_count, t.created_at, t.user_id AS owner_id,
      u.full_name AS submitted_by FROM finder_listings t LEFT JOIN users u ON u.id = t.user_id`,
    search: ["t.name", "t.area", "t.city", "t.category"],
    statusColumn: "t.status",
    statuses: ["pending", "published", "rejected", "hidden"],
    order: "t.status = 'pending' DESC, t.id DESC",
    actions: {
      approve: { label: "Publish", set: { status: "published", status_reason: null }, log: "approved", notify: { title: "Your listing \"{title}\" is live on The Finder", link: "/finder/mine" } },
      reject: { label: "Reject", set: { status: "rejected", status_reason: "$reason" }, log: "rejected", notify: { title: "Your listing \"{title}\" needs changes", link: "/finder/mine" } },
      hide: { label: "Hide", set: { status: "hidden", status_reason: "$reason" }, log: "suspended" },
      ...verify,
      ...feature,
    },
    deletable: true,
    link: (r) => `/finder/l/${r.slug}`,
  },
  "finder-reviews": {
    module: "finder",
    table: "finder_reviews",
    select: `SELECT t.id, t.rating, t.title AS review_title, t.body, t.is_hidden, t.created_at, t.listing_id AS parent_id,
      l.name AS title, l.slug AS listing_slug, u.full_name AS author, u.id AS owner_id, IF(t.is_hidden, 'hidden', 'visible') AS status
      FROM finder_reviews t JOIN finder_listings l ON l.id = t.listing_id JOIN users u ON u.id = t.user_id`,
    search: ["t.body", "l.name", "u.full_name"],
    statusColumn: "IF(t.is_hidden, 'hidden', 'visible')",
    statuses: ["visible", "hidden"],
    actions: {
      hide: {
        label: "Hide",
        set: { is_hidden: 1 },
        log: "suspended",
        after: recalc(
          "UPDATE finder_listings SET rating_avg = (SELECT ROUND(AVG(rating), 1) FROM finder_reviews WHERE listing_id = ? AND is_hidden = 0), rating_count = (SELECT COUNT(*) FROM finder_reviews WHERE listing_id = finder_listings.id AND is_hidden = 0) WHERE id = ?",
        ),
      },
      unhide: {
        label: "Unhide",
        set: { is_hidden: 0 },
        log: "updated",
        after: recalc(
          "UPDATE finder_listings SET rating_avg = (SELECT ROUND(AVG(rating), 1) FROM finder_reviews WHERE listing_id = ? AND is_hidden = 0), rating_count = (SELECT COUNT(*) FROM finder_reviews WHERE listing_id = finder_listings.id AND is_hidden = 0) WHERE id = ?",
        ),
      },
    },
  },
  groups: {
    module: "groups",
    table: "campus_groups",
    select: `SELECT t.*, t.name AS title, t.created_by AS owner_id, u.full_name AS creator_name, u.email AS creator_email
      FROM campus_groups t LEFT JOIN users u ON u.id = t.created_by`,
    search: ["t.name", "t.tagline", "u.full_name"],
    statusColumn: "t.status",
    statuses: ["pending", "approved", "rejected", "suspended"],
    order: "t.status = 'pending' DESC, t.id DESC",
    actions: {
      approve: {
        label: "Approve",
        set: { status: "approved", status_reason: null, reviewed_by: "$admin", reviewed_at: "$now" },
        log: "approved",
        notify: { title: "Your group {title} is approved 🎉", link: "/groups/mine" },
      },
      reject: {
        label: "Reject",
        set: { status: "rejected", status_reason: "$reason", reviewed_by: "$admin", reviewed_at: "$now" },
        log: "rejected",
        notify: { title: "Your group {title} needs changes", link: "/groups/mine" },
      },
      suspend: { label: "Suspend", set: { status: "suspended", status_reason: "$reason" }, log: "suspended", notify: { title: "Your group {title} was suspended" } },
      ...feature,
    },
    link: (r) => `/groups/${r.slug}`,
  },
  pages: {
    module: "social",
    table: "social_pages",
    select: `SELECT t.*, t.name AS title, t.owner_id, u.full_name AS owner_name FROM social_pages t JOIN users u ON u.id = t.owner_id`,
    search: ["t.name", "u.full_name"],
    statusColumn: "t.status",
    statuses: ["active", "suspended"],
    actions: {
      suspend: { label: "Suspend", set: { status: "suspended" }, log: "suspended", notify: { title: "Your page {title} was suspended" } },
      activate: { label: "Reactivate", set: { status: "active" }, log: "updated" },
      ...verify,
    },
    link: (r) => `/social/pages/${r.slug}`,
  },
  posts: {
    module: "social",
    table: "social_posts",
    select: `SELECT t.id, LEFT(COALESCE(t.body, '[photo]'), 160) AS title, t.images, t.visibility, t.reaction_count, t.comment_count,
      t.is_hidden, t.created_at, t.author_id AS owner_id, u.full_name AS author, u.username, IF(t.is_hidden, 'hidden', 'visible') AS status,
      (SELECT COUNT(*) FROM reports r WHERE r.entity_type = 'post' AND r.entity_id = t.id AND r.status = 'open') AS open_reports
      FROM social_posts t JOIN users u ON u.id = t.author_id`,
    search: ["t.body", "u.full_name"],
    statusColumn: "IF(t.is_hidden, 'hidden', 'visible')",
    statuses: ["visible", "hidden"],
    actions: {
      hide: { label: "Hide", set: { is_hidden: 1 }, log: "suspended", notify: { title: "A post of yours was hidden for breaking community rules" } },
      unhide: { label: "Unhide", set: { is_hidden: 0 }, log: "updated" },
    },
    deletable: true,
    link: (r) => `/social/post/${r.id}`,
  },
  "qb-discussions": {
    module: "learn",
    table: "qb_discussions",
    select: `SELECT t.id, t.kind, t.body, t.status, t.helpful_count, t.created_at, t.question_id, t.user_id AS owner_id, LEFT(t.body, 120) AS title,
      u.full_name AS author_name, u.email AS author_email, LEFT(q.body, 160) AS question_body
      FROM qb_discussions t JOIN users u ON u.id = t.user_id JOIN qb_questions q ON q.id = t.question_id`,
    search: ["t.body", "u.full_name", "q.body"],
    statusColumn: "t.status",
    statuses: ["visible", "hidden"],
    actions: {
      hide: { label: "Hide", set: { status: "hidden" }, log: "suspended", after: recountDiscussions },
      show: { label: "Show", set: { status: "visible" }, log: "updated", after: recountDiscussions },
    },
  },
  courses: {
    module: "learn",
    table: "courses",
    select: `SELECT t.id, t.title, t.slug, t.subtitle, t.cover_url, t.price, t.level, t.status, t.review_note, t.is_featured, t.lesson_count,
      t.duration_minutes, t.enrollment_count, t.rating_avg, t.submitted_at, t.published_at, t.created_at, t.instructor_id AS owner_id,
      u.full_name AS instructor_name, u.email AS instructor_email, c.name AS category_name
      FROM courses t JOIN users u ON u.id = t.instructor_id LEFT JOIN course_categories c ON c.id = t.category_id`,
    search: ["t.title", "u.full_name"],
    statusColumn: "t.status",
    statuses: ["in_review", "published", "rejected", "draft", "archived"],
    order: "t.status = 'in_review' DESC, t.submitted_at ASC, t.id DESC",
    actions: {
      approve: {
        label: "Publish",
        set: { status: "published", review_note: null, reviewed_by: "$admin", published_at: "$now" },
        log: "approved",
        notify: { title: "Your course \"{title}\" is published 🎓", link: "/learn/teach" },
      },
      reject: {
        label: "Request changes",
        set: { status: "rejected", review_note: "$reason", reviewed_by: "$admin" },
        log: "rejected",
        notify: { title: "Your course \"{title}\" needs changes", link: "/learn/teach" },
      },
      archive: { label: "Unpublish", set: { status: "archived", review_note: "$reason" }, log: "suspended", notify: { title: "Your course \"{title}\" was unpublished", link: "/learn/teach" } },
      ...feature,
    },
    link: (r) => `/learn/c/${r.slug}`,
  },
  "lead-lists": {
    module: "leadgen",
    table: "lead_lists",
    select: `SELECT t.id, t.title, t.slug, t.category, t.subcategory, t.price, t.contact_count, t.phone_count, t.email_count,
      t.allow_download, t.consent_confirmed, t.status, t.status_reason, t.is_featured, t.access_count, t.created_at,
      t.user_id AS owner_id, u.full_name AS owner_name, u.email AS owner_email
      FROM lead_lists t LEFT JOIN users u ON u.id = t.user_id`,
    search: ["t.title", "t.subcategory", "u.full_name"],
    statusColumn: "t.status",
    statuses: ["pending", "published", "rejected", "suspended", "private"],
    order: "t.status = 'pending' DESC, t.id DESC",
    actions: {
      approve: { label: "Publish", set: { status: "published", status_reason: null }, log: "approved", notify: { title: "Your lead list \"{title}\" is live on LeadGen", link: "/leadgen/portal/leads" } },
      reject: { label: "Reject", set: { status: "rejected", status_reason: "$reason" }, log: "rejected", notify: { title: "Your lead list \"{title}\" needs changes", link: "/leadgen/portal/leads" } },
      suspend: { label: "Suspend", set: { status: "suspended", status_reason: "$reason" }, log: "suspended", notify: { title: "Your lead list \"{title}\" was suspended", link: "/leadgen/portal/leads" } },
      ...feature,
    },
    link: (r) => `/leadgen/l/${r.slug}`,
  },
  "sender-ids": {
    module: "leadgen",
    table: "sender_ids",
    select: `SELECT t.*, t.sender AS title, t.user_id AS owner_id, u.full_name AS owner_name, u.email AS owner_email
      FROM sender_ids t JOIN users u ON u.id = t.user_id`,
    search: ["t.sender", "u.full_name", "t.purpose"],
    statusColumn: "t.status",
    statuses: ["pending", "approved", "rejected"],
    order: "t.status = 'pending' DESC, t.id DESC",
    actions: {
      approve: {
        label: "Approve",
        set: { status: "approved", status_reason: null, reviewed_by: "$admin", reviewed_at: "$now" },
        log: "approved",
        notify: { title: "Sender ID \"{title}\" is approved", link: "/leadgen/portal/senders" },
      },
      reject: {
        label: "Reject",
        set: { status: "rejected", status_reason: "$reason", reviewed_by: "$admin", reviewed_at: "$now" },
        log: "rejected",
        notify: { title: "Sender ID \"{title}\" was not approved", link: "/leadgen/portal/senders" },
      },
    },
  },
  broadcasts: {
    module: "leadgen",
    table: "broadcasts",
    select: `SELECT t.id, CONCAT(UPPER(t.channel), ' · ', t.sender_label) AS title, t.series_id, t.channel, t.sender_label, t.subject, LEFT(t.body, 200) AS preview,
      t.recipient_count, t.sent_count, t.failed_count, t.cost_credits, t.refunded_credits, t.status, t.scheduled_at, t.created_at, t.error,
      t.user_id AS owner_id, u.full_name AS owner_name,
      (SELECT status FROM broadcast_series s WHERE s.id = t.series_id) AS series_status FROM broadcasts t JOIN users u ON u.id = t.user_id`,
    search: ["t.sender_label", "t.subject", "t.body", "u.full_name"],
    statusColumn: "t.status",
    statuses: ["scheduled", "queued", "sending", "sent", "failed", "cancelled"],
    actions: {},
  },
  payouts: {
    module: "leadgen",
    table: "lead_payouts",
    select: `SELECT t.*, CONCAT('GHS ', t.amount, ' → ', t.momo_number) AS title, t.user_id AS owner_id, u.full_name AS owner_name, u.email AS owner_email
      FROM lead_payouts t JOIN users u ON u.id = t.user_id`,
    search: ["t.momo_number", "t.momo_name", "u.full_name"],
    statusColumn: "t.status",
    statuses: ["requested", "paid", "rejected"],
    order: "t.status = 'requested' DESC, t.id DESC",
    actions: {
      paid: { label: "Mark paid", set: { status: "paid", note: "$reason", handled_by: "$admin", handled_at: "$now" }, log: "approved", notify: { title: "Your LeadGen payout was sent ({title})", link: "/leadgen/portal/earnings" } },
      reject: { label: "Reject", set: { status: "rejected", note: "$reason", handled_by: "$admin", handled_at: "$now" }, log: "rejected", notify: { title: "Your LeadGen payout request was declined", link: "/leadgen/portal/earnings" } },
    },
  },
  reports: {
    module: "reports",
    table: "reports",
    select: `SELECT t.*, CONCAT(t.entity_type, ' #', t.entity_id) AS title, NULL AS owner_id, u.full_name AS reporter_name, u.username AS reporter_username
      FROM reports t LEFT JOIN users u ON u.id = t.reporter_id`,
    search: ["t.details", "t.reason", "t.entity_type"],
    statusColumn: "t.status",
    statuses: ["open", "actioned", "dismissed"],
    actions: {
      actioned: { label: "Mark actioned", set: { status: "actioned", handled_by: "$admin", handled_at: "$now" }, log: "updated" },
      dismiss: { label: "Dismiss", set: { status: "dismissed", handled_by: "$admin", handled_at: "$now" }, log: "updated" },
    },
  },
  payments: {
    module: "payments",
    table: "payments",
    select: `SELECT t.*, t.reference AS title, t.user_id AS owner_id, u.full_name AS payer_name FROM payments t LEFT JOIN users u ON u.id = t.user_id`,
    search: ["t.reference", "t.email", "u.full_name"],
    statusColumn: "t.status",
    statuses: ["pending", "success", "failed"],
    actions: {},
  },
};

function resolve(c: Context) {
  const entity = ENTITIES[c.req.param("entity") ?? ""];
  if (!entity) throw new AppError("Unknown queue.", 404);
  return entity;
}

async function guard(c: Context, next: Next) {
  await requireAdminRole(ANY_ADMIN)(c, async () => undefined);
  const entity = resolve(c);
  const role = c.get("admin").role;
  const need = c.req.method === "GET" ? canView(role, entity.module) : canManage(role, entity.module);
  if (!need) throw new AppError("Forbidden.", 403);
  await next();
}

const listQuery = pageQuerySchema.extend({ status: z.string().max(30).optional().catch(undefined) });

export const moderationRoute = new Hono()
  .use("/:entity/*", guard)
  .use("/:entity", guard)
  .get("/:entity", async (c) => {
    const entity = resolve(c);
    const q = listQuery.parse(c.req.query());
    const where: Array<string> = [];
    const params: Array<string | number> = [];
    if (q.status && entity.statusColumn && entity.statuses?.includes(q.status)) {
      where.push(`${entity.statusColumn} = ?`);
      params.push(q.status);
    }
    if (q.q) {
      where.push(`(${entity.search.map((col) => `${col} LIKE ?`).join(" OR ")})`);
      params.push(...entity.search.map(() => likePattern(q.q!)));
    }
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const { limit, offset } = paging(q.page, q.pageSize);
    const pool = getPool();
    const [[items], [count], counts] = await Promise.all([
      pool.query<RowDataPacket[]>(`${entity.select} ${clause} ORDER BY ${entity.order ?? "t.id DESC"} LIMIT ? OFFSET ?`, [...params, limit, offset]),
      pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM (${entity.select} ${clause}) x`, params),
      entity.statusColumn
        ? pool.query<RowDataPacket[]>(`SELECT ${entity.statusColumn} AS s, COUNT(*) AS n FROM ${entity.table} t GROUP BY s`).then(([r]) => r)
        : Promise.resolve([] as Array<RowDataPacket>),
    ]);
    return c.json({
      items: items.map((r) => ({ ...r, public_link: entity.link?.(r) ?? null })),
      total: Number(count[0]?.n ?? 0),
      counts: Object.fromEntries(counts.map((r) => [r.s, Number(r.n)])),
      statuses: entity.statuses ?? [],
      actions: Object.fromEntries(Object.entries(entity.actions).map(([k, a]) => [k, a.label])),
      deletable: Boolean(entity.deletable),
    });
  })
  .post("/:entity/:id/:action", async (c) => {
    const entity = resolve(c);
    const action = entity.actions[c.req.param("action")];
    if (!action) throw new AppError("Unknown action.", 404);
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id) || id <= 0) throw new AppError("Not found.", 404);
    const body = (await c.req.json().catch(() => ({}))) as { reason?: string };
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 500) || null : null;
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>(`${entity.select} WHERE t.id = ?`, [id]);
    const row = rows[0];
    if (!row) throw new AppError("Not found.", 404);
    const admin = c.get("admin");
    const cols = Object.keys(action.set);
    const values = Object.values(action.set).map((v) => (v === "$reason" ? reason : v === "$admin" ? admin.id : v === "$now" ? new Date() : v));
    await pool.execute(`UPDATE ${entity.table} SET ${cols.map((col) => `${col} = ?`).join(", ")} WHERE id = ?`, [...values, id]);
    await action.after?.(row);
    if (action.notify && row.owner_id) {
      notify(row.owner_id as number, {
        kind: "moderation",
        title: action.notify.title.replace("{title}", String(row.title ?? "")),
        body: reason,
        link: action.notify.link ?? entity.link?.(row) ?? null,
      });
    }
    logActivity(admin.id, action.log, c.req.param("entity")!, id, `${action.label}: ${String(row.title ?? id).slice(0, 200)}${reason ? ` — ${reason}` : ""}`);
    return c.json({ ok: true });
  })
  .delete("/:entity/:id", async (c) => {
    const entity = resolve(c);
    if (!entity.deletable) throw new AppError("This can't be deleted here.", 405);
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id) || id <= 0) throw new AppError("Not found.", 404);
    const [rows] = await getPool().query<RowDataPacket[]>(`${entity.select} WHERE t.id = ?`, [id]);
    if (!rows[0]) throw new AppError("Not found.", 404);
    await getPool().execute(`DELETE FROM ${entity.table} WHERE id = ?`, [id]);
    logActivity(c.get("admin").id, "deleted", c.req.param("entity")!, id, `Deleted ${String(rows[0].title ?? id).slice(0, 200)}`);
    return c.body(null, 204);
  });
