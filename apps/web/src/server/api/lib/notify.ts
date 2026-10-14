import { getPool } from "@cv/db";

export interface Notice {
  kind: string;
  title: string;
  body?: string | null;
  link?: string | null;
  actorId?: number | null;
}

// In-app notification (bell menu). Never allowed to fail the request.
export function notify(userId: number | null | undefined, notice: Notice) {
  if (!userId || userId === notice.actorId) return;
  getPool()
    .execute(
      "INSERT INTO notifications (user_id, kind, title, body, link, actor_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userId,
        notice.kind,
        notice.title.slice(0, 200),
        notice.body?.slice(0, 500) ?? null,
        notice.link ?? null,
        notice.actorId ?? null,
      ],
    )
    .catch((err: unknown) => console.error("Failed to write notification:", err));
}
