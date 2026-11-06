// Admin → Job Circle: posting a job on a member's behalf. It goes live straight
// away, as a moderator would approve it anyway. Listing and approve/reject live
// in moderation.ts.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";
import { validate } from "../../lib/validate.js";
import { toColumns, insertSql } from "../../lib/columns.js";
import { uniqueSlug } from "../../lib/slug.js";
import { logActivity } from "../../lib/activity.js";
import { notify } from "../../lib/notify.js";
import { activeMember } from "../../lib/on-behalf.js";
import { JOB_FIELDS, assertApplyTarget, jobSchema } from "../jobs/route.js";

export const adminJobsRoute = new Hono().post("/", requirePermission("jobs", "manage"), validate("json", jobSchema.extend({ userId: z.number().int().positive() })), async (c) => {
  const input = c.req.valid("json");
  assertApplyTarget(input);
  await activeMember(input.userId);
  const slug = await uniqueSlug("jobs", `${input.title} ${input.companyName}`, null);
  const { columns, params } = toColumns(input, JOB_FIELDS);
  const [res] = await getPool().execute<ResultSetHeader>(insertSql("jobs", [...columns, "user_id", "slug", "status"]), [...params, input.userId, slug, "published"]);
  logActivity(c.get("admin").id, "created", "jobs", res.insertId, `Posted job for member #${input.userId}: ${input.title.slice(0, 200)}`);
  notify(input.userId, { kind: "moderation", title: `An admin posted the job "${input.title}" for you`, link: "/market/jobs/mine" });
  return c.json({ id: res.insertId, slug }, 201);
});
