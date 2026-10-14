// Job Circle: find and search jobs, apply on-platform (or via email/link),
// post jobs (moderated before they go live), manage applicants, and browse
// talent — members who marked themselves open to work.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { memberOrNull, optionalMember, requireMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl } from "../../lib/fields.js";
import { pageQuerySchema, paging } from "../../lib/query.js";
import { textSearch } from "../../lib/search.js";
import { toColumns, insertSql, updateSql } from "../../lib/columns.js";
import { uniqueSlug } from "../../lib/slug.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { PUBLIC_USER_COLUMNS } from "../../lib/members.js";

export const JOB_CATEGORIES = [
  "Technology", "Engineering", "Sales & Marketing", "Finance & Accounting", "Education", "Health",
  "Hospitality", "Administration", "Creative & Design", "Customer Service", "Logistics", "Agriculture",
  "Legal", "Research", "Media", "Other",
];

const jobSchema = z.object({
  companyName: z.string().trim().min(2).max(150),
  companyLogoUrl: optionalUrl,
  title: z.string().trim().min(3).max(200),
  category: z.string().trim().min(2).max(60),
  jobType: z.enum(["full_time", "part_time", "contract", "internship", "national_service", "gig", "volunteer"]),
  workplace: z.enum(["onsite", "remote", "hybrid"]),
  experienceLevel: z.enum(["entry", "mid", "senior", "any"]),
  location: z.string().trim().min(2).max(150),
  salaryMin: z.number().min(0).max(100_000_000).nullable().optional(),
  salaryMax: z.number().min(0).max(100_000_000).nullable().optional(),
  salaryPeriod: z.enum(["hour", "day", "month", "year", "project"]).optional(),
  description: z.string().trim().min(30, "Describe the role in a few sentences").max(20_000),
  skills: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  applyMethod: z.enum(["platform", "email", "link"]),
  applyTarget: optionalText(500),
  deadline: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(""), z.null()]).optional().transform((v) => v || null),
});
const FIELDS = {
  companyName: "company_name",
  companyLogoUrl: "company_logo_url",
  title: "title",
  category: "category",
  jobType: "job_type",
  workplace: "workplace",
  experienceLevel: "experience_level",
  location: "location",
  salaryMin: "salary_min",
  salaryMax: "salary_max",
  salaryPeriod: "salary_period",
  description: "description",
  skills: "skills",
  applyMethod: "apply_method",
  applyTarget: "apply_target",
  deadline: "deadline",
};

const applySchema = z.object({
  phone: z.string().trim().min(9).max(30),
  coverLetter: optionalText(5000),
  cvUrl: optionalUrl,
});

const listSchema = pageQuerySchema.extend({
  category: z.string().max(60).optional().catch(undefined),
  type: z.string().max(30).optional().catch(undefined),
  workplace: z.string().max(20).optional().catch(undefined),
  level: z.string().max(20).optional().catch(undefined),
  location: z.string().max(100).optional().catch(undefined),
});

const OPEN = "j.status = 'published' AND (j.deadline IS NULL OR j.deadline >= CURDATE())";
const CARD = `j.id, j.slug, j.title, j.company_name, j.company_logo_url, j.category, j.job_type, j.workplace, j.experience_level,
  j.location, j.salary_min, j.salary_max, j.salary_period, j.deadline, j.is_featured, j.created_at`;

export const jobsRoute = new Hono()
  .get("/meta", (c) => c.json({ categories: JOB_CATEGORIES }))
  .get("/", async (c) => {
    const q = listSchema.parse(c.req.query());
    const where = [OPEN];
    const params: Array<string | number> = [];
    const eq = (col: string, v: string | undefined) => {
      if (v) {
        where.push(`${col} = ?`);
        params.push(v);
      }
    };
    eq("j.category", q.category);
    eq("j.job_type", q.type);
    eq("j.workplace", q.workplace);
    eq("j.experience_level", q.level);
    if (q.location) {
      where.push("j.location LIKE ?");
      params.push(`%${q.location}%`);
    }
    if (q.q) {
      const s = textSearch("j.title, j.company_name, j.description", ["j.title", "j.company_name"], q.q);
      where.push(s.sql);
      params.push(...s.params);
    }
    const { limit, offset } = paging(q.page, q.pageSize);
    const clause = where.join(" AND ");
    const pool = getPool();
    const [[items], [count], [cats]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT ${CARD}, (SELECT COUNT(*) FROM job_applications a WHERE a.job_id = j.id) AS applicants
         FROM jobs j WHERE ${clause} ORDER BY j.is_featured DESC, j.id DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      ),
      pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM jobs j WHERE ${clause}`, params),
      pool.query<RowDataPacket[]>(`SELECT j.category, COUNT(*) AS n FROM jobs j WHERE ${OPEN} GROUP BY j.category ORDER BY n DESC`),
    ]);
    return c.json({ items, total: Number(count[0]?.n ?? 0), categories: cats });
  })
  .get("/talent", async (c) => {
    const q = (c.req.query("q") ?? "").trim();
    const params: Array<string> = [];
    let extra = "";
    if (q) {
      extra = "AND (full_name LIKE ? OR headline LIKE ? OR JSON_SEARCH(LOWER(skills), 'one', LOWER(?)) IS NOT NULL)";
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT ${PUBLIC_USER_COLUMNS} FROM users WHERE open_to_work = 1 AND is_active = 1 ${extra} ORDER BY updated_at DESC LIMIT 60`,
      params,
    );
    return c.json({ items });
  })
  .get("/mine", requireMember, async (c) => {
    const id = c.get("member").id;
    const pool = getPool();
    const [[posted], [applied]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT j.*, (SELECT COUNT(*) FROM job_applications a WHERE a.job_id = j.id) AS applicants FROM jobs j WHERE j.user_id = ? ORDER BY j.id DESC`,
        [id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT a.*, ${CARD}, j.status AS job_status FROM job_applications a JOIN jobs j ON j.id = a.job_id WHERE a.user_id = ? ORDER BY a.id DESC`,
        [id],
      ),
    ]);
    return c.json({ posted, applied });
  })
  .get("/:slug", optionalMember, async (c) => {
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT j.*, u.full_name AS poster_name, u.username AS poster_username, u.avatar_url AS poster_avatar
       FROM jobs j JOIN users u ON u.id = j.user_id WHERE j.slug = ?`,
      [(c.req.param("slug") ?? "")],
    );
    const job = rows[0];
    const member = memberOrNull(c);
    if (!job || (job.status !== "published" && job.status !== "closed" && job.user_id !== member?.id)) {
      throw new AppError("Job not found.", 404);
    }
    void pool.execute("UPDATE jobs SET view_count = view_count + 1 WHERE id = ?", [job.id]);
    const [similar] = await pool.query<RowDataPacket[]>(
      `SELECT ${CARD} FROM jobs j WHERE ${OPEN} AND j.category = ? AND j.id <> ? ORDER BY j.id DESC LIMIT 5`,
      [job.category, job.id],
    );
    let application = null;
    if (member) {
      const [a] = await pool.execute<RowDataPacket[]>("SELECT id, status, created_at FROM job_applications WHERE job_id = ? AND user_id = ?", [
        job.id,
        member.id,
      ]);
      application = a[0] ?? null;
    }
    const isOwner = member?.id === job.user_id;
    if (!isOwner && job.apply_method === "platform") job.apply_target = null;
    return c.json({ job, similar, application, isOwner });
  })
  .post("/", requireMember, validate("json", jobSchema), async (c) => {
    const input = c.req.valid("json");
    if (input.applyMethod !== "platform" && !input.applyTarget) {
      throw new AppError(input.applyMethod === "email" ? "Enter the email to apply to." : "Enter the application link.", 422);
    }
    const slug = await uniqueSlug("jobs", `${input.title} ${input.companyName}`, null);
    const { columns, params } = toColumns(input, FIELDS);
    await getPool().execute(insertSql("jobs", [...columns, "user_id", "slug"]), [...params, c.get("member").id, slug]);
    return c.json({ slug }, 201);
  })
  .patch("/:id", requireMember, validate("json", jobSchema.partial().extend({ close: z.boolean().optional() })), async (c) => {
    const id = Number(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM jobs WHERE id = ? AND user_id = ?", [id, c.get("member").id]);
    const job = rows[0];
    if (!job) throw new AppError("Job not found.", 404);
    const { close, ...input } = c.req.valid("json");
    const { columns, params } = toColumns(input, FIELDS);
    if (close) {
      columns.push("status");
      params.push("closed");
    } else if (columns.length && job.status === "rejected") {
      columns.push("status");
      params.push("pending");
    }
    if (columns.length) await getPool().execute(updateSql("jobs", columns), [...params, id]);
    return c.json({ ok: true });
  })
  .post("/:id/apply", requireMember, validate("json", applySchema), async (c) => {
    const id = Number(c.req.param("id"));
    const member = c.get("member");
    const [rows] = await getPool().execute<RowDataPacket[]>(`SELECT * FROM jobs j WHERE j.id = ? AND ${OPEN}`, [id]);
    const job = rows[0];
    if (!job) throw new AppError("This job is no longer accepting applications.", 409);
    if (job.apply_method !== "platform") throw new AppError("Apply using the employer's link or email.", 409);
    if (job.user_id === member.id) throw new AppError("You posted this job.", 409);
    const input = c.req.valid("json");
    if (!input.cvUrl && !input.coverLetter) throw new AppError("Attach your CV or write a cover letter.", 422);
    try {
      await getPool().execute(
        "INSERT INTO job_applications (job_id, user_id, phone, cover_letter, cv_url) VALUES (?, ?, ?, ?, ?)",
        [id, member.id, input.phone, input.coverLetter ?? null, input.cvUrl ?? null],
      );
    } catch (err) {
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new AppError("You've already applied.", 409);
      throw err;
    }
    notify(job.user_id, {
      kind: "job",
      title: `New applicant for ${job.title}`,
      body: member.fullName,
      link: `/market/jobs/manage/${job.id}`,
      actorId: member.id,
    });
    return c.json({ ok: true }, 201);
  })
  .get("/:id/applications", requireMember, async (c) => {
    const id = Number(c.req.param("id"));
    const [jobs] = await getPool().execute<RowDataPacket[]>("SELECT * FROM jobs WHERE id = ? AND user_id = ?", [id, c.get("member").id]);
    if (!jobs[0]) throw new AppError("Job not found.", 404);
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT a.*, u.full_name, u.username, u.avatar_url, u.headline, u.email, u.skills, u.location
       FROM job_applications a JOIN users u ON u.id = a.user_id WHERE a.job_id = ? ORDER BY a.id DESC`,
      [id],
    );
    return c.json({ job: jobs[0], items });
  })
  .patch(
    "/applications/:id",
    requireMember,
    validate("json", z.object({ status: z.enum(["reviewed", "shortlisted", "rejected", "hired"]) })),
    async (c) => {
      const id = Number(c.req.param("id"));
      const [rows] = await getPool().execute<RowDataPacket[]>(
        "SELECT a.*, j.title, j.user_id AS owner_id FROM job_applications a JOIN jobs j ON j.id = a.job_id WHERE a.id = ?",
        [id],
      );
      const app = rows[0];
      if (!app || app.owner_id !== c.get("member").id) throw new AppError("Application not found.", 404);
      const { status } = c.req.valid("json");
      await getPool().execute("UPDATE job_applications SET status = ? WHERE id = ?", [status, id]);
      if (status !== "reviewed") {
        notify(app.user_id, {
          kind: "job",
          title: `Update on your application: ${app.title}`,
          body: { shortlisted: "You've been shortlisted!", rejected: "The employer has moved on with other candidates.", hired: "Congratulations — you got the job!" }[status],
          link: "/market/jobs/mine",
          actorId: c.get("member").id,
        });
      }
      return c.json({ ok: true });
    },
  );
