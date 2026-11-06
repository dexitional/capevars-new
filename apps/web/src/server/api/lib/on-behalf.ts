// Admins adding listings for a member. Products, events, trips and rentals all
// hang off a store, so the member's store is found here, or for someone without
// one (a normal user), opened for them already approved.
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { AppError } from "../middleware/error-handler.js";
import { notify } from "./notify.js";
import { uniqueSlug } from "./slug.js";

export async function activeMember(userId: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT id, full_name, phone, email, is_active FROM users WHERE id = ?", [userId]);
  const member = rows[0];
  if (!member) throw new AppError("Member not found.", 404);
  if (!member.is_active) throw new AppError(`${member.full_name} is suspended. Reactivate them first.`, 409);
  return member;
}

// The member's store id, able to carry `kind` (added if it isn't one of its kinds yet).
export async function storeForMember(userId: number, kind: "products" | "food" | "events" | "transport", adminId: number, { create }: { create: boolean }) {
  const member = await activeMember(userId);
  const pool = getPool();
  const [stores] = await pool.execute<RowDataPacket[]>("SELECT id, store_name, status, kinds FROM sellers WHERE user_id = ?", [userId]);
  const store = stores[0];
  if (store) {
    if (store.status !== "approved") throw new AppError(`${store.store_name} is ${store.status}. Approve the store under Sellers first.`, 409);
    if (!String(store.kinds).split(",").includes(kind)) await pool.execute("UPDATE sellers SET kinds = CONCAT_WS(',', NULLIF(kinds, ''), ?) WHERE id = ?", [kind, store.id]);
    return store.id as number;
  }
  if (!create) throw new AppError(`${member.full_name} doesn't have a store.`, 409);
  const [res] = await pool.execute<ResultSetHeader>(
    "INSERT INTO sellers (user_id, store_name, slug, kinds, email, phone, status, reviewed_by, reviewed_at) VALUES (?, ?, ?, ?, ?, ?, 'approved', ?, UTC_TIMESTAMP())",
    [userId, member.full_name, await uniqueSlug("sellers", member.full_name as string, null), kind, member.email, member.phone ?? "", adminId],
  );
  notify(userId, { kind: "moderation", title: "An admin set up a Seller Center profile for you", link: "/seller" });
  return res.insertId;
}
