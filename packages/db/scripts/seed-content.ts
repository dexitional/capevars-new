// Reference data every fresh install needs: marketplace and course
// categories, and the public forum chat rooms. Idempotent — rows are matched
// by slug and never overwritten, so admin edits survive a re-run.
import "dotenv/config";
import mysql from "mysql2/promise";

const MARKET: Array<[name: string, slug: string, icon: string, isFood: 0 | 1, children?: Array<string>]> = [
  ["Phones & Tablets", "phones-tablets", "smartphone", 0, ["Smartphones", "Tablets", "Accessories"]],
  ["Computing", "computing", "laptop", 0, ["Laptops", "Desktops", "Printers", "Storage"]],
  ["Electronics", "electronics", "tv", 0, ["Audio", "TVs", "Cameras", "Gaming"]],
  ["Fashion", "fashion", "shirt", 0, ["Men", "Women", "Shoes", "Bags", "Watches & Jewellery"]],
  ["Beauty & Health", "beauty-health", "sparkles", 0, ["Skincare", "Hair", "Fragrance", "Personal care"]],
  ["Home & Living", "home-living", "sofa", 0, ["Furniture", "Kitchen", "Bedding", "Decor"]],
  ["Books & Stationery", "books-stationery", "book-open", 0, ["Textbooks", "Novels", "Stationery"]],
  ["Hostel Essentials", "hostel-essentials", "bed-double", 0, ["Mattresses", "Appliances", "Storage"]],
  ["Groceries", "groceries", "shopping-basket", 0, ["Provisions", "Beverages", "Snacks"]],
  ["Sports & Outdoors", "sports-outdoors", "dumbbell", 0, []],
  ["Services", "services", "wrench", 0, ["Printing", "Repairs", "Tutoring", "Design", "Laundry"]],
  ["Art & Crafts", "art-crafts", "palette", 0, []],
  ["Food & Drinks", "food-drinks", "utensils", 1, ["Local dishes", "Fast food", "Pastries", "Drinks", "Fruits"]],
];

const COURSES: Array<[string, string, string]> = [
  ["Technology & Coding", "technology", "code"],
  ["Business & Entrepreneurship", "business", "briefcase"],
  ["Design & Creative", "design", "palette"],
  ["Data & AI", "data-ai", "brain"],
  ["Personal Development", "personal-development", "sprout"],
  ["Languages", "languages", "languages"],
  ["Health & Wellness", "health", "heart-pulse"],
  ["Education & Teaching", "education", "graduation-cap"],
  ["Finance & Accounting", "finance", "landmark"],
  ["Marketing", "marketing", "megaphone"],
  ["Agriculture", "agriculture", "wheat"],
  ["Exam Preparation", "exam-prep", "notebook-pen"],
];

const ROOMS: Array<[string, string, string, string]> = [
  ["Campus Lounge", "campus-lounge", "General chat for everyone on campus.", "coffee"],
  ["Freshers' Corner", "freshers-corner", "New on campus? Ask anything.", "sparkles"],
  ["Tech & Startups", "tech-startups", "Code, gadgets, products and founders.", "rocket"],
  ["Jobs & Internships", "jobs-internships", "Share openings, tips and referrals.", "briefcase"],
  ["Study Buddies", "study-buddies", "Find study partners and share notes.", "book-open"],
  ["Sports Arena", "sports-arena", "Match talk, fixtures and banter.", "trophy"],
  ["Marketplace Chat", "marketplace-chat", "Buy, sell and swap — safely.", "shopping-bag"],
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is not set.");
  const db = await mysql.createConnection({ uri });

  for (const [index, [name, slug, icon, isFood, children]] of MARKET.entries()) {
    await db.query(
      `INSERT IGNORE INTO market_categories (name, slug, icon, is_food, sort_order) VALUES (?, ?, ?, ?, ?)`,
      [name, slug, icon, isFood, index],
    );
    const [rows] = await db.query<mysql.RowDataPacket[]>("SELECT id FROM market_categories WHERE slug = ?", [slug]);
    const parentId = rows[0]!.id as number;
    for (const [i, child] of (children ?? []).entries()) {
      await db.query(
        `INSERT IGNORE INTO market_categories (parent_id, name, slug, icon, is_food, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
        [parentId, child, `${slug}-${slugify(child)}`, icon, isFood, i],
      );
    }
  }
  console.log("Market categories ready.");

  for (const [index, [name, slug, icon]] of COURSES.entries()) {
    await db.query(
      "INSERT IGNORE INTO course_categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)",
      [name, slug, icon, index],
    );
  }
  console.log("Course categories ready.");

  for (const [title, slug, description, icon] of ROOMS) {
    await db.query(
      `INSERT IGNORE INTO chat_threads (type, title, slug, description, icon, is_public) VALUES ('forum', ?, ?, ?, ?, 1)`,
      [title, slug, description, icon],
    );
  }
  console.log("Forum rooms ready.");
  await db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
