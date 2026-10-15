// The universal admin portal's API, mounted at /api/admin.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { authRoute } from "./auth/route.js";
import { usersRoute } from "./users/route.js";
import { settingsRoute } from "./settings/route.js";
import { mediaRoute } from "./media.js";
import { dashboardRoute } from "./dashboard.js";
import { catalogRoute } from "./catalog.js";
import { moderationRoute } from "./moderation.js";
import { adminLeadgenRoute } from "./leadgen.js";
import { adminProductsRoute } from "./products.js";
import { adminMembersRoute } from "./members.js";
import { adminTicketsRoute } from "./tickets.js";
import { requirePermission } from "../../middleware/require-auth.js";
import { pageQuerySchema, paging } from "../../lib/query.js";

const activityRoute = new Hono().get("/", requirePermission("activity", "view"), async (c) => {
  const q = pageQuerySchema.extend({ entity: z.string().max(40).optional().catch(undefined) }).parse(c.req.query());
  const clause = q.entity ? "WHERE l.entity = ?" : "";
  const params = q.entity ? [q.entity] : [];
  const { limit, offset } = paging(q.page, q.pageSize);
  const pool = getPool();
  const [[rows], [count]] = await Promise.all([
    pool.query<RowDataPacket[]>(
      `SELECT l.*, a.full_name AS admin_name FROM activity_log l LEFT JOIN admins a ON a.id = l.admin_id
       ${clause} ORDER BY l.id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    ),
    pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM activity_log l ${clause}`, params),
  ]);
  return c.json({ items: rows, total: Number(count[0]?.n ?? 0) });
});

export const adminRoute = new Hono()
  .route("/auth", authRoute)
  .route("/users", usersRoute)
  .route("/settings", settingsRoute)
  .route("/media", mediaRoute)
  .route("/dashboard", dashboardRoute)
  .route("/activity", activityRoute)
  .route("/catalog", catalogRoute)
  .route("/leadgen", adminLeadgenRoute)
  .route("/products", adminProductsRoute)
  .route("/members", adminMembersRoute)
  .route("/tickets", adminTicketsRoute)
  .route("/mod", moderationRoute);
