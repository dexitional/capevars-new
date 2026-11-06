// Admin → Sellers & stores: opening a store for a member, editing any store, and
// deleting one with everything it sells (listing and approve/reject live in
// moderation.ts). A store an admin opens is approved straight away.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { requirePermission } from "../../middleware/require-auth.js";
import { validate } from "../../lib/validate.js";
import { idParam } from "../../lib/query.js";
import { uniqueSlug } from "../../lib/slug.js";
import { toColumns, updateSql } from "../../lib/columns.js";
import { AppError } from "../../middleware/error-handler.js";
import { logActivity } from "../../lib/activity.js";
import { notify } from "../../lib/notify.js";
import { activeMember } from "../../lib/on-behalf.js";
import { purgeStore, storePurgePreview } from "../../lib/member-purge.js";
import { STORE_FIELDS, insert, storeSchema } from "../seller/route.js";

async function storeById(id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT id, user_id, store_name FROM sellers WHERE id = ?", [id]);
  if (!rows[0]) throw new AppError("Store not found.", 404);
  return rows[0];
}

export const adminSellersRoute = new Hono()
  .post("/", requirePermission("sellers", "manage"), validate("json", storeSchema.extend({ userId: z.number().int().positive() })), async (c) => {
    const input = c.req.valid("json");
    const admin = c.get("admin");
    const member = await activeMember(input.userId);
    const [existing] = await getPool().execute<RowDataPacket[]>("SELECT store_name FROM sellers WHERE user_id = ?", [input.userId]);
    if (existing[0]) throw new AppError(`${member.full_name} already has a store, ${existing[0].store_name}.`, 409);
    const slug = await uniqueSlug("sellers", input.storeName, null);
    const id = await insert("sellers", input, STORE_FIELDS, {
      user_id: input.userId,
      slug,
      kinds: input.kinds.join(","),
      status: "approved",
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString().slice(0, 19).replace("T", " "),
    });
    logActivity(admin.id, "created", "sellers", id, `Opened store ${input.storeName} for member #${input.userId}`);
    notify(input.userId, { kind: "moderation", title: `An admin opened the store ${input.storeName} for you`, link: "/seller" });
    return c.json({ id, slug }, 201);
  })
  .patch("/:id", requirePermission("sellers", "manage"), validate("json", storeSchema.partial()), async (c) => {
    const store = await storeById(idParam(c.req.param("id")));
    const input = c.req.valid("json");
    const { columns, params } = toColumns(input, STORE_FIELDS);
    if (input.kinds) {
      columns.push("kinds");
      params.push(input.kinds.join(","));
    }
    if (columns.length) await getPool().execute(updateSql("sellers", columns), [...params, store.id]);
    const name = String(input.storeName ?? store.store_name);
    logActivity(c.get("admin").id, "updated", "sellers", store.id, `Edited store ${name}`);
    notify(store.user_id as number, { kind: "moderation", title: `A moderator updated your store ${name}`, link: "/seller/settings" });
    return c.json({ ok: true });
  })
  .get("/:id/delete-preview", requirePermission("sellers", "manage"), async (c) => {
    return c.json(await storePurgePreview((await storeById(idParam(c.req.param("id")))).id as number));
  })
  .delete("/:id", requirePermission("sellers", "manage"), async (c) => {
    const store = await storeById(idParam(c.req.param("id")));
    if (c.req.query("confirm") !== store.store_name) throw new AppError("Type the store's name to confirm.", 422);
    const removed = await purgeStore(store.id as number);
    logActivity(c.get("admin").id, "deleted", "sellers", store.id as number, `Deleted store ${store.store_name} of member #${store.user_id} and ${removed} related records`);
    notify(store.user_id as number, { kind: "moderation", title: `An admin deleted your store ${store.store_name}`, link: "/seller/apply" });
    return c.body(null, 204);
  });
