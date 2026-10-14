import { getPool } from "@cv/db";
import type { SettingsKey, SiteSettings } from "#/lib/settings";
import { logActivity } from "../../../lib/activity.js";
export { loadSettings as getAllSettings } from "../../public/route.js";

export async function saveSetting<TKey extends SettingsKey>(adminId: number, key: TKey, value: SiteSettings[TKey]) {
  await getPool().execute(
    `INSERT INTO site_settings (setting_key, value, updated_by) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value), updated_by = VALUES(updated_by)`,
    [key, JSON.stringify(value), adminId],
  );
  logActivity(adminId, "updated", "settings", null, `Updated ${key} settings`);
  return value;
}
