// Public, cacheable platform data: settings for the header/footer, the home
// page (highlights from all five systems) and universal search.
import { AppError } from "../../middleware/error-handler.js";
import { Hono } from "hono";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { DEFAULT_SETTINGS, SETTINGS_KEYS, mergeSetting } from "#/lib/settings";
import type { SettingsKey, SiteSettings } from "#/lib/settings";
import { textSearch } from "../../lib/search.js";
import { notKidiCourse } from "../../lib/query.js";

export async function loadSettings(): Promise<SiteSettings> {
  const [rows] = await getPool().query<RowDataPacket[]>("SELECT setting_key, value FROM site_settings");
  const stored = new Map(rows.map((r) => [r.setting_key as string, r.value as unknown]));
  const result = { ...DEFAULT_SETTINGS } as Record<SettingsKey, unknown>;
  for (const key of SETTINGS_KEYS) result[key] = mergeSetting(key, stored.get(key));
  return result as SiteSettings;
}

export const publicRoute = new Hono()
  // kidiLearn's public catalog: what each subject covers, for parents and search
  // engines. Nothing here touches a child's account or progress.
  .get("/kidilearn", async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT k.level_key AS level, k.subject_key AS subject, c.title, c.lesson_count AS lessons
       FROM kidi_course_links k JOIN courses c ON c.id = k.course_id AND c.status = 'published' WHERE k.is_active = 1`,
    );
    return c.json({ items });
  })
  .get("/kidilearn/:level/:subject", async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT c.id, c.title, c.subtitle, c.description, c.price, c.lesson_count AS lessons
       FROM kidi_course_links k JOIN courses c ON c.id = k.course_id AND c.status = 'published' WHERE k.level_key = ? AND k.subject_key = ? AND k.is_active = 1`,
      [c.req.param("level"), c.req.param("subject")],
    );
    const course = rows[0];
    if (!course) throw new AppError("Subject not found.", 404);
    const [lessons] = await getPool().execute<RowDataPacket[]>("SELECT title FROM course_lessons WHERE course_id = ? ORDER BY sort_order, id LIMIT 24", [course.id]);
    return c.json({ course: { ...course, id: undefined }, lessons: lessons.map((l) => l.title as string) });
  })
  .get("/settings", async (c) => {
    const s = await loadSettings();
    return c.json({ identity: s.identity, socials: s.socials, notice: s.notice, home: s.home, finder: s.finder, marketplace: s.marketplace });
  })
  .get("/home", async (c) => {
    const pool = getPool();
    const [[stats], [products], [listings], [groups], [courses], [events], [jobs]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT (SELECT COUNT(*) FROM users WHERE is_active = 1) AS members,
           (SELECT COUNT(*) FROM products WHERE status = 'active') AS products,
           (SELECT COUNT(*) FROM sellers WHERE status = 'approved') AS stores,
           (SELECT COUNT(*) FROM finder_listings WHERE status = 'published') AS listings,
           (SELECT COUNT(*) FROM campus_groups WHERE status = 'approved') AS groups_count,
           (SELECT COUNT(*) FROM courses c WHERE c.status = 'published' AND ${notKidiCourse()}) AS courses`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT p.id, p.slug, p.title, p.price, p.compare_at_price, JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS image,
           p.rating_avg, s.store_name FROM products p JOIN sellers s ON s.id = p.seller_id
         WHERE p.status = 'active' AND s.status = 'approved' AND p.kind = 'product'
         ORDER BY p.is_featured DESC, p.sold_count DESC, p.id DESC LIMIT 8`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT id, type, name, slug, tagline, cover_url, area, city, price_from, price_unit, rating_avg, rating_count, is_verified
         FROM finder_listings WHERE status = 'published' AND type IN ('hostel', 'hotel', 'restaurant')
         ORDER BY is_featured DESC, rating_avg DESC LIMIT 6`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT id, name, slug, category, tagline, logo_url, cover_url, member_count FROM campus_groups
         WHERE status = 'approved' ORDER BY is_featured DESC, member_count DESC LIMIT 6`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT c.id, c.slug, c.title, c.cover_url, c.price, c.rating_avg, c.rating_count, c.enrollment_count, c.level,
           u.full_name AS instructor_name FROM courses c JOIN users u ON u.id = c.instructor_id
         WHERE c.status = 'published' AND ${notKidiCourse()} ORDER BY c.is_featured DESC, c.enrollment_count DESC LIMIT 4`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT e.id, e.slug, e.title, e.cover_url, e.venue, e.starts_at, e.category,
           (SELECT MIN(price) FROM ticket_types WHERE event_id = e.id) AS from_price
         FROM ticket_events e WHERE e.status = 'published' AND e.starts_at >= NOW() ORDER BY e.is_featured DESC, e.starts_at LIMIT 4`,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT id, slug, title, company_name, company_logo_url, location, job_type, workplace, created_at FROM jobs
         WHERE status = 'published' AND (deadline IS NULL OR deadline >= CURDATE()) ORDER BY is_featured DESC, id DESC LIMIT 5`,
      ),
    ]);
    return c.json({ stats: stats[0], products, listings, groups, courses, events, jobs });
  })
  .get("/search", async (c) => {
    const q = (c.req.query("q") ?? "").trim().slice(0, 100);
    if (q.length < 2) return c.json({ q, results: {} });
    const pool = getPool();
    const p = textSearch("p.title, p.description", ["p.title"], q);
    const l = textSearch("l.name, l.tagline, l.description, l.address, l.area, l.category", ["l.name", "l.area"], q);
    const g = textSearch("g.name, g.tagline, g.about", ["g.name"], q);
    const co = textSearch("c.title, c.subtitle", ["c.title"], q);
    const j = textSearch("j.title, j.company_name, j.description", ["j.title", "j.company_name"], q);
    const u = textSearch("u.full_name, u.username, u.headline", ["u.full_name", "u.username"], q);
    const [[products], [listings], [groups], [courses], [jobs], [people], [events], [pages]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT p.id, p.slug, p.title, p.price, JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS image, s.store_name, p.kind
         FROM products p JOIN sellers s ON s.id = p.seller_id WHERE p.status = 'active' AND s.status = 'approved' AND ${p.sql} LIMIT 8`,
        p.params,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT l.id, l.slug, l.name, l.type, l.cover_url, l.area, l.city, l.rating_avg FROM finder_listings l
         WHERE l.status = 'published' AND ${l.sql} ORDER BY l.is_featured DESC LIMIT 8`,
        l.params,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT g.id, g.slug, g.name, g.category, g.logo_url, g.member_count FROM campus_groups g WHERE g.status = 'approved' AND ${g.sql} LIMIT 6`,
        g.params,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT c.id, c.slug, c.title, c.cover_url, c.price, c.rating_avg FROM courses c WHERE c.status = 'published' AND ${notKidiCourse()} AND ${co.sql} LIMIT 6`,
        co.params,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT j.id, j.slug, j.title, j.company_name, j.location, j.company_logo_url FROM jobs j
         WHERE j.status = 'published' AND (j.deadline IS NULL OR j.deadline >= CURDATE()) AND ${j.sql} LIMIT 6`,
        j.params,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT u.id, u.full_name, u.username, u.avatar_url, u.headline FROM users u WHERE u.is_active = 1 AND ${u.sql} LIMIT 8`,
        u.params,
      ),
      pool.query<RowDataPacket[]>(
        `SELECT e.id, e.slug, e.title, e.cover_url, e.venue, e.starts_at FROM ticket_events e
         WHERE e.status = 'published' AND e.starts_at >= NOW() AND (e.title LIKE ? OR e.venue LIKE ?) LIMIT 6`,
        [`%${q}%`, `%${q}%`],
      ),
      pool.query<RowDataPacket[]>(
        "SELECT id, slug, name, category, avatar_url, follower_count FROM social_pages WHERE status = 'active' AND name LIKE ? LIMIT 6",
        [`%${q}%`],
      ),
    ]);
    return c.json({ q, results: { products, listings, groups, courses, jobs, people, events, pages } });
  });
