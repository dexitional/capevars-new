// Admin → OpenLearn → Course review: deleting a course, which teachers can't do
// themselves once it has learners (listing and publish/reject live in moderation.ts).
import { Hono } from "hono";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";
import { idParam } from "../../lib/query.js";
import { AppError } from "../../middleware/error-handler.js";
import { logActivity } from "../../lib/activity.js";
import { notify } from "../../lib/notify.js";
import { coursePurgePreview, purgeCourse } from "../../lib/member-purge.js";

async function courseById(id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT id, title, instructor_id FROM courses WHERE id = ?", [id]);
  if (!rows[0]) throw new AppError("Course not found.", 404);
  return rows[0];
}

export const adminCoursesRoute = new Hono()
  .get("/:id/delete-preview", requirePermission("learn", "manage"), async (c) => {
    return c.json(await coursePurgePreview((await courseById(idParam(c.req.param("id")))).id as number));
  })
  .delete("/:id", requirePermission("learn", "manage"), async (c) => {
    const course = await courseById(idParam(c.req.param("id")));
    if (c.req.query("confirm") !== course.title) throw new AppError("Type the course's title to confirm.", 422);
    const removed = await purgeCourse(course.id as number);
    logActivity(c.get("admin").id, "deleted", "courses", course.id as number, `Deleted course "${String(course.title).slice(0, 150)}" of member #${course.instructor_id} and ${removed} related records`);
    notify(course.instructor_id as number, { kind: "moderation", title: `An admin deleted your course "${course.title}"`, link: "/learn/teach" });
    return c.body(null, 204);
  });
