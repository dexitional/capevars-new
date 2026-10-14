// SQL fragments for embedding a member's public card in other rows, e.g.
// `SELECT p.*, ${userFields("u", "author")} FROM social_posts p JOIN users u ...`
// gives author_id, author_name, author_username, author_avatar, author_headline,
// author_verified.
export function userFields(alias: string, prefix: string) {
  return [
    `${alias}.id AS ${prefix}_id`,
    `${alias}.full_name AS ${prefix}_name`,
    `${alias}.username AS ${prefix}_username`,
    `${alias}.avatar_url AS ${prefix}_avatar`,
    `${alias}.headline AS ${prefix}_headline`,
    `${alias}.is_verified AS ${prefix}_verified`,
  ].join(", ");
}

// Public profile columns (never password/lockout fields).
export const PUBLIC_USER_COLUMNS =
  "id, full_name, username, avatar_url, cover_url, headline, bio, location, website, member_type, institution, skills, open_to_work, is_verified, last_seen_at, created_at";

// mysql2 parses JSON columns, but rows written by hand may hold strings.
export function asList<T = string>(value: unknown): Array<T> {
  if (Array.isArray(value)) return value as Array<T>;
  if (typeof value === "string" && value) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as Array<T>) : [];
    } catch {
      return [];
    }
  }
  return [];
}

// Two members' ids in a stable order, for one-row-per-pair tables.
export const pairKey = (a: number, b: number) => (a < b ? `${a}:${b}` : `${b}:${a}`);
