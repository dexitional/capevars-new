// Demo content for every system, so a fresh install looks alive: members,
// stores, products, food, events, buses, jobs, exhibitions, Finder listings,
// groups, social posts, courses and lead lists.
//
// Safe to re-run: it does nothing if the demo members already exist.
// All contacts are fictional (example emails, 23320000xxxx numbers).
// Demo members sign in with password "Demo@2026" (e.g. ama@capevars.test).
import "dotenv/config";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

const img = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const face = (n: number) => `https://i.pravatar.cc/300?img=${n}`;
const slug = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const code = (prefix: string, n: number) => `${prefix}${String(n).padStart(8, "0").replace(/0/g, "A")}${n}`.slice(0, 14);
const daysFromNow = (d: number, h = 10) => {
  const t = new Date(Date.now() + d * 86_400_000);
  t.setUTCHours(h, 0, 0, 0);
  return t.toISOString().slice(0, 19).replace("T", " ");
};

const PEOPLE: Array<[string, string, string, number]> = [
  ["Ama Mensah", "ama", "Final-year Computer Science · UCC", 47],
  ["Kwame Asante", "kwame", "Founder, CampusTech Gadgets", 12],
  ["Efua Owusu", "efua", "Nursing student · loves good food", 45],
  ["Yaw Boateng", "yaw", "SRC Entertainment Commissioner", 15],
  ["Akosua Darko", "akosua", "Data analyst · Excel trainer", 44],
  ["Kofi Agyeman", "kofi", "Transport operator · Agyeman Coaches", 53],
  ["Abena Frimpong", "abena", "Fashion designer · AbenaStyles", 20],
  ["Kojo Ansah", "kojo", "Lecturer, Department of Agric Economics", 59],
  ["Esi Quaye", "esi", "Communications & events volunteer", 23],
  ["Nana Adjei", "nana", "Software engineer · open to work", 68],
  ["Adwoa Sarpong", "adwoa", "Home chef · Adwoa's Kitchen", 26],
  ["Kweku Mensah", "kweku", "Expo organiser · Cape Fairs", 60],
];

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is not set.");
  const db = await mysql.createConnection({ uri });
  const [exists] = await db.query<RowDataPacket[]>("SELECT id FROM users WHERE email = 'ama@capevars.test'");
  if (exists[0]) {
    console.log("Demo data already present — nothing to do.");
    await db.end();
    return;
  }
  const insert = async (sql: string, params: Array<unknown>) => {
    const [r] = await db.query<ResultSetHeader>(sql, params);
    return r.insertId;
  };
  const hash = await bcrypt.hash("Demo@2026", 10);

  // ---- Members ----------------------------------------------------------------------
  const u: Record<string, number> = {};
  for (const [i, [name, handle, headline, pic]] of PEOPLE.entries()) {
    u[handle] = await insert(
      `INSERT INTO users (full_name, username, email, password_hash, avatar_url, cover_url, headline, bio, location, member_type, institution, skills, open_to_work, is_verified, last_seen_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name, handle, `${handle}@capevars.test`, hash, face(pic), img(`cover-${handle}`, 1600, 500), headline,
        `Hi, I'm ${name.split(" ")[0]}. ${headline}.`, "Cape Coast", i % 4 === 0 ? "staff" : "student", "University of Cape Coast",
        JSON.stringify(handle === "nana" ? ["TypeScript", "React", "Node.js", "MySQL"] : handle === "akosua" ? ["Excel", "Power BI", "SQL"] : []),
        handle === "nana" || handle === "esi" ? 1 : 0, i < 3 ? 1 : 0,
      ],
    );
  }
  const ids = Object.values(u);
  // Friendships: a small, well-connected circle.
  const pairs: Array<[string, string]> = [["ama", "kwame"], ["ama", "efua"], ["ama", "yaw"], ["ama", "nana"], ["efua", "esi"], ["kwame", "nana"], ["yaw", "esi"], ["akosua", "kojo"], ["abena", "efua"], ["adwoa", "efua"]];
  for (const [a, b] of pairs) {
    const [x, y] = [u[a]!, u[b]!].sort((m, n) => m - n);
    await insert("INSERT INTO friendships (requester_id, addressee_id, pair_key, status, responded_at) VALUES (?, ?, ?, 'accepted', NOW())", [u[a], u[b], `${x}:${y}`]);
  }
  await insert("INSERT INTO friendships (requester_id, addressee_id, pair_key, status) VALUES (?, ?, ?, 'pending')", [u.kojo, u.ama, `${Math.min(u.kojo!, u.ama!)}:${Math.max(u.kojo!, u.ama!)}`]);

  // ---- Stores ------------------------------------------------------------------------
  const store = async (owner: string, name: string, kinds: string, extra: Record<string, unknown> = {}) =>
    insert(
      `INSERT INTO sellers (user_id, store_name, slug, kinds, tagline, description, logo_url, banner_url, phone, whatsapp, location, cuisine, opening_hours, delivers, delivery_fee, status, is_verified, is_featured, reviewed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', 1, 1, NOW())`,
      [
        u[owner], name, slug(name), kinds, extra.tagline ?? null, extra.description ?? `${name} — trusted seller on Capevars.`,
        img(`logo-${slug(name)}`, 300, 300), img(`banner-${slug(name)}`, 1600, 500), "0200000001", "233200000001",
        extra.location ?? "Amamoma, Cape Coast", extra.cuisine ?? null, extra.hours ?? null, extra.delivers ?? 1, extra.fee ?? 5,
      ],
    );
  const sGadgets = await store("kwame", "CampusTech Gadgets", "products", { tagline: "Phones, laptops & accessories at student prices" });
  const sFashion = await store("abena", "AbenaStyles", "products", { tagline: "Made-in-Ghana fashion", fee: 10 });
  const sKitchen = await store("adwoa", "Adwoa's Kitchen", "food", { tagline: "Home-cooked Ghanaian meals", cuisine: "Ghanaian", hours: "Mon–Sat, 7am–9pm" });
  const sGrill = await store("efua", "Campus Grill & Shawarma", "food", { tagline: "Shawarma, burgers & fries", cuisine: "Fast food", hours: "Daily, 11am–11pm", fee: 7 });
  const sSrc = await store("yaw", "UCC SRC Entertainment", "events", { tagline: "Official SRC events", delivers: 0 });
  const sCoach = await store("kofi", "Agyeman Coaches", "transport", { tagline: "Safe, comfortable intercity travel", delivers: 0 });
  const sFairs = await store("kweku", "Cape Fairs & Expos", "exhibitions,events", { tagline: "Trade fairs that grow your business", delivers: 0 });

  const [cats] = await db.query<RowDataPacket[]>("SELECT id, slug FROM market_categories");
  const cat = (s: string) => cats.find((c) => c.slug === s)?.id ?? null;
  const products: Array<[number, string, string, number, number | null, string, string]> = [
    [sGadgets, "Tecno Spark 20 Pro (256GB)", "phones-tablets-smartphones", 2650, 2900, "new", "phone"],
    [sGadgets, "Samsung Galaxy A15", "phones-tablets-smartphones", 2300, null, "new", "galaxy"],
    [sGadgets, "HP EliteBook 840 G5 — Core i5, 16GB RAM", "computing-laptops", 4200, 4800, "refurbished", "laptop"],
    [sGadgets, "Oraimo FreePods 4 earbuds", "phones-tablets-accessories", 350, 420, "new", "earbuds"],
    [sGadgets, "20,000mAh power bank", "phones-tablets-accessories", 220, null, "new", "powerbank"],
    [sGadgets, "Used MacBook Air M1", "computing-laptops", 7800, null, "used", "macbook"],
    [sGadgets, "Bluetooth speaker", "electronics-audio", 180, 240, "new", "speaker"],
    [sGadgets, "USB-C fast charger 33W", "phones-tablets-accessories", 95, null, "new", "charger"],
    [sFashion, "Kente-trim shirt (men)", "fashion-men", 280, 350, "new", "kente"],
    [sFashion, "Ankara wrap dress", "fashion-women", 320, null, "new", "ankara"],
    [sFashion, "Leather sandals (handmade)", "fashion-shoes", 210, 260, "new", "sandals"],
    [sFashion, "Batik tote bag", "fashion-bags", 120, null, "new", "tote"],
    [sFashion, "Beaded bracelet set", "fashion-watches-and-jewellery", 60, 80, "new", "beads"],
    [sFashion, "Fugu smock (northern)", "fashion-men", 450, null, "new", "smock"],
  ];
  for (const [sid, title, c, price, was, cond, seed] of products) {
    await insert(
      `INSERT INTO products (seller_id, category_id, title, slug, description, price, compare_at_price, stock, item_condition, images, status, is_featured, sold_count, view_count, rating_avg, rating_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?)`,
      [sid, cat(c), title, slug(title), `${title}. Quality guaranteed — pickup on campus or delivery within Cape Coast.`, price, was, 5 + (price % 17), cond,
        JSON.stringify([img(`p-${seed}`, 900, 900), img(`p-${seed}-2`, 900, 900)]), price > 1000 ? 1 : 0, price % 23, price % 300, 4 + (price % 10) / 10, price % 12],
    );
  }
  const menu: Array<[number, string, string, number, string]> = [
    [sKitchen, "Jollof rice with chicken", "Rice dishes", 45, "jollof"],
    [sKitchen, "Waakye special", "Rice dishes", 40, "waakye"],
    [sKitchen, "Banku with tilapia", "Local favourites", 65, "banku"],
    [sKitchen, "Fufu with light soup", "Local favourites", 55, "fufu"],
    [sKitchen, "Kelewele (spicy plantain)", "Sides", 15, "kelewele"],
    [sKitchen, "Sobolo (hibiscus drink)", "Drinks", 10, "sobolo"],
    [sGrill, "Chicken shawarma", "Shawarma", 45, "shawarma"],
    [sGrill, "Beef burger & fries", "Burgers", 60, "burger"],
    [sGrill, "Loaded fries", "Sides", 30, "fries"],
    [sGrill, "Fresh pineapple juice", "Drinks", 15, "juice"],
  ];
  const food = cat("food-drinks");
  for (const [sid, title, section, price, seed] of menu) {
    await insert(
      `INSERT INTO products (seller_id, category_id, kind, title, slug, description, menu_section, price, images, status, sold_count, rating_avg)
       VALUES (?, ?, 'food', ?, ?, ?, ?, ?, ?, 'active', ?, 4.6)`,
      [sid, food, title, slug(`${title}-${sid}`), `Freshly prepared ${title.toLowerCase()}.`, section, price, JSON.stringify([img(`f-${seed}`, 800, 800)]), price],
    );
  }

  // ---- Events, buses, exhibitions --------------------------------------------------------------
  const events: Array<[number, string, string, number, string, Array<[string, number, number]>]> = [
    [sSrc, "SRC Week Grand Musical Concert", "src", 9, "concert", [["Regular", 50, 800], ["VIP", 150, 100]]],
    [sSrc, "Freshers' Night 2026", "campus", 4, "freshers", [["Free entry", 0, 1500]]],
    [sFairs, "Startup & Innovation Summit", "conference", 15, "summit", [["Student", 20, 300], ["Professional", 100, 150]]],
    [sSrc, "Inter-Hall Football Final", "sports", 6, "football", [["Stand", 10, 2000]]],
  ];
  for (const [sid, title, category, days, seed, types] of events) {
    const eid = await insert(
      `INSERT INTO ticket_events (seller_id, title, slug, category, summary, description, cover_url, venue, city, starts_at, ends_at, status, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Cape Coast', ?, ?, 'published', 1)`,
      [sid, title, slug(title), category, `Don't miss ${title}!`, `${title} — bring your friends. Tickets are scanned at the gate.`, img(`e-${seed}`, 1600, 900), "Main Auditorium, UCC", daysFromNow(days, 18), daysFromNow(days, 23)],
    );
    for (const [i, [name, price, qty]] of types.entries()) {
      await insert("INSERT INTO ticket_types (event_id, name, price, quantity, sold, sort_order) VALUES (?, ?, ?, ?, ?, ?)", [eid, name, price, qty, Math.floor(qty / 5), i]);
    }
  }
  const routes: Array<[string, string, number, number]> = [["Cape Coast", "Accra", 120, 2], ["Cape Coast", "Kumasi", 180, 3], ["Cape Coast", "Takoradi", 70, 1], ["Accra", "Cape Coast", 120, 4]];
  for (const [from, to, price, days] of routes) {
    for (const h of [6, 14]) {
      await insert(
        `INSERT INTO bus_trips (seller_id, origin, destination, pickup_point, departs_at, arrives_at, bus_type, amenities, seats_total, seats_booked, price)
         VALUES (?, ?, ?, ?, ?, ?, 'VIP coach', ?, 40, 0, ?)`,
        [sCoach, from, to, from === "Cape Coast" ? "UCC Science bus stop" : "Kaneshie station", daysFromNow(days, h), daysFromNow(days, h + 3), JSON.stringify(["A/C", "USB charging", "Reclining seats"]), price],
      );
    }
  }
  await insert(
    `INSERT INTO bus_rentals (seller_id, title, vehicle_type, capacity, price_per_day, description, images, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [sCoach, "50-seater Yutong coach", "Coach", 50, 2500, "Perfect for excursions, field trips and conferences. Driver included.", JSON.stringify([img("rental-coach"), img("rental-coach-2")]), JSON.stringify(["A/C", "Driver included", "PA system"])],
  );
  await insert(
    `INSERT INTO bus_rentals (seller_id, title, vehicle_type, capacity, price_per_day, description, images, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [sCoach, "Toyota Sprinter (22 seats)", "Minibus", 22, 1200, "Comfortable minibus for small groups and weddings.", JSON.stringify([img("rental-sprinter")]), JSON.stringify(["A/C", "Driver included"])],
  );
  await insert(
    `INSERT INTO exhibitions (seller_id, title, slug, theme, description, cover_url, venue, city, starts_at, ends_at, booth_price, booths_total, booths_taken, services, status, is_featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Cape Coast', ?, ?, 300, 60, 18, ?, 'published', 1)`,
    [sFairs, "Central Region Trade & Craft Fair", "central-region-trade-and-craft-fair", "Made in Central", "Three days of local products, crafts, food and live music. Exhibitors get a 3m×3m booth with table and chairs.", img("expo-fair", 1600, 900), "Victoria Park", daysFromNow(20), daysFromNow(22, 18), JSON.stringify(["Power socket", "Table & chairs", "Branding"])],
  );

  // ---- Jobs --------------------------------------------------------------------------------------
  const jobs: Array<[string, string, string, string, string, string, number, number]> = [
    ["nana", "Frontend Developer (React)", "PayLink Ghana", "Technology", "full_time", "hybrid", 4000, 7000],
    ["kwame", "Sales Assistant (part-time)", "CampusTech Gadgets", "Sales & Marketing", "part_time", "onsite", 800, 1200],
    ["kojo", "Research Assistant — Agric Economics", "University of Cape Coast", "Research", "contract", "onsite", 1500, 2000],
    ["esi", "Social Media Intern", "Cape Fairs & Expos", "Media", "internship", "remote", 500, 800],
    ["akosua", "Data Analyst (National Service)", "Coastal Analytics", "Technology", "national_service", "onsite", 750, 750],
  ];
  for (const [poster, title, company, category, type, workplace, min, max] of jobs) {
    await insert(
      `INSERT INTO jobs (user_id, company_name, company_logo_url, title, slug, category, job_type, workplace, location, salary_min, salary_max, description, skills, apply_method, deadline, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Cape Coast', ?, ?, ?, ?, 'platform', ?, 'published')`,
      [u[poster], company, img(`logo-${slug(company)}`, 200, 200), title, slug(`${title} ${company}`), category, type, workplace, min, max,
        `${company} is hiring a ${title}.\n\nWhat you'll do:\n• Work with a friendly team\n• Learn fast and ship real work\n\nWhat we're looking for:\n• Curiosity and reliability\n• Good communication`, JSON.stringify(["Communication", "Teamwork"]), daysFromNow(30).slice(0, 10)],
    );
  }

  // ---- Finder ------------------------------------------------------------------------------------
  const listings: Array<[string, string, string, string, number | null, string | null, Array<string>, number | null]> = [
    ["hostel", "Valco Executive Hostel", "Amamoma", "Self-contained rooms, 5 min walk to campus", 4500, "per year", ["Wi-Fi", "Water 24/7", "Standby generator", "Security", "Study room"], null],
    ["hostel", "Superannuation Hostel", "Kwaprow", "Affordable 2-in-a-room with study area", 3200, "per year", ["Water 24/7", "Security", "Kitchen"], null],
    ["hostel", "Gold Coast Ladies Hostel", "Apewosika", "Female-only, quiet and secure", 3800, "per year", ["Wi-Fi", "CCTV", "Laundry", "Security"], null],
    ["hostel", "Pent Hostel", "Ayensu", "Modern rooms with AC and shuttle", 6000, "per year", ["Air conditioning", "Shuttle", "Wi-Fi", "Standby generator"], null],
    ["hotel", "Coconut Grove Beach Resort", "Elmina road", "Beachfront resort with pool", 950, "per night", ["Pool", "Restaurant", "Bar", "Wi-Fi", "Parking"], 4],
    ["hotel", "Oasis Beach Hotel", "Victoria Park", "Lively beach hotel near the castle", 450, "per night", ["Restaurant", "Bar", "Wi-Fi"], 3],
    ["hotel", "Cape Coast Royal Inn", "Pedu", "Business hotel with conference room", 620, "per night", ["Conference room", "Gym", "Air conditioning", "Breakfast included"], 4],
    ["restaurant", "Baobab Vegetarian Café", "Kotokuraba", "Fresh juices and veggie plates", 35, "per meal", ["Vegetarian options", "Dine-in", "Takeaway"], null],
    ["restaurant", "Castle View Restaurant", "Victoria Park", "Seafood with a view of the castle", 90, "per meal", ["Dine-in", "Outdoor seating", "Card/MoMo payment"], null],
    ["restaurant", "Mama's Chop Bar", "Abura", "Authentic fufu and banku", 30, "per meal", ["Dine-in", "Takeaway"], null],
    ["business", "QuickPrint Copy Centre", "Science", "Printing, binding and photocopy", null, null, ["Card/MoMo payment", "Open weekends"], null],
    ["business", "FixIt Phone Repairs", "Old Site", "Screen and battery replacement in an hour", null, null, ["Card/MoMo payment"], null],
    ["place", "Cape Coast Castle", "Victoria Park", "UNESCO World Heritage site and museum", 40, "entry", ["Guided tours", "Restrooms"], null],
    ["place", "Kakum National Park", "Abrafo", "Canopy walkway above the rainforest", 60, "entry", ["Guided tours", "Parking", "Restrooms"], null],
    ["person", "Dr. Kojo Ansah — Agric Economics tutor", "Old Site", "Private tutoring for agric economics and statistics", 80, "per session", [], null],
    ["person", "Abena Frimpong — Tailor & designer", "Amamoma", "Custom kaba, slit and men's wear", null, null, [], null],
  ];
  const listingIds: Array<number> = [];
  for (const [i, [type, name, area, tagline, price, unit, amenities, stars]] of listings.entries()) {
    listingIds.push(
      await insert(
        `INSERT INTO finder_listings (type, user_id, name, slug, tagline, description, category, cover_url, images, address, area, city, phone, whatsapp, price_from, price_unit, star_rating, amenities, attributes, rating_avg, rating_count, view_count, is_verified, is_featured, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Cape Coast', '0200000002', '233200000002', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
        [
          type, ids[i % ids.length], name, slug(`${name} ${area}`), tagline, `${name} in ${area}, Cape Coast. ${tagline}.`, type === "restaurant" ? "Ghanaian" : type === "person" ? "Tutor" : null,
          img(`l-${slug(name)}`), JSON.stringify([img(`l-${slug(name)}-1`), img(`l-${slug(name)}-2`), img(`l-${slug(name)}-3`)]), `${area}, Cape Coast`, area, price, unit, stars,
          JSON.stringify(amenities), JSON.stringify(type === "hostel" ? { "Room types": "1-in-a-room, 2-in-a-room", "Distance to campus": `${3 + (i % 10)} min walk` } : {}),
          (3.8 + (i % 12) / 10).toFixed(1), 3 + (i % 9), 100 + i * 37, i % 3 === 0 ? 1 : 0, i % 4 === 0 ? 1 : 0,
        ],
      ),
    );
  }
  for (const [i, lid] of listingIds.entries()) {
    for (const reviewer of [u.ama, u.efua, u.nana].filter((x) => x !== ids[i % ids.length])) {
      await insert("INSERT IGNORE INTO finder_reviews (listing_id, user_id, rating, title, body) VALUES (?, ?, ?, ?, ?)", [lid, reviewer, 4 + (i % 2), "Great place", "Clean, friendly and good value. Would recommend."]);
    }
  }

  // ---- Groups ------------------------------------------------------------------------------------
  const groups: Array<[string, string, string, string]> = [
    ["yaw", "UCC Computer Science Students' Association", "association", "Code, community and careers for CS students"],
    ["esi", "Cape Coast Volunteers Network", "club", "Giving back to our community every weekend"],
    ["kojo", "Agric Economics Department", "department", "News and resources for the department"],
    ["efua", "Oguaa Hall Residents", "hall", "Everything Oguaa Hall"],
  ];
  for (const [owner, name, category, tagline] of groups) {
    const gid = await insert(
      `INSERT INTO campus_groups (name, slug, category, tagline, about, logo_url, cover_url, visibility, join_policy, created_by, status, reviewed_at, member_count, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'public', 'open', ?, 'approved', NOW(), 0, 1)`,
      [name, slug(name), category, tagline, `<p>${tagline}. Join us for meetings, events and discussions.</p>`, img(`g-${slug(name)}`, 400, 400), img(`gc-${slug(name)}`, 1600, 500), u[owner]],
    );
    const members = [u[owner]!, ...ids.filter((x) => x !== u[owner]).slice(0, 7)];
    for (const [i, m] of members.entries()) {
      await insert("INSERT INTO group_members (group_id, user_id, role, status, title) VALUES (?, ?, ?, 'active', ?)", [gid, m, i === 0 ? "owner" : i === 1 ? "admin" : "member", i === 0 ? "President" : i === 1 ? "Secretary" : null]);
    }
    await db.query("UPDATE campus_groups SET member_count = ? WHERE id = ?", [members.length, gid]);
    await insert("INSERT INTO group_posts (group_id, user_id, body, is_announcement, is_pinned) VALUES (?, ?, ?, 1, 1)", [gid, u[owner], `Welcome to ${name}! 🎉 Introduce yourself below and check the meetings tab for our next get-together.`]);
    await insert("INSERT INTO group_posts (group_id, user_id, body, image_url) VALUES (?, ?, ?, ?)", [gid, members[2], "Photos from last week's meeting — great turnout!", img(`gp-${gid}`, 1200, 800)]);
    const tid = await insert("INSERT INTO group_topics (group_id, user_id, title, body, reply_count, last_reply_at) VALUES (?, ?, ?, ?, 1, NOW())", [gid, members[3], "Ideas for this semester?", "What activities should we plan this semester?"]);
    await insert("INSERT INTO group_replies (topic_id, user_id, body) VALUES (?, ?, ?)", [tid, u[owner], "Great question — let's discuss at the next meeting."]);
    await insert("INSERT INTO group_meetings (group_id, title, agenda, starts_at, location, meeting_url, members_only, created_by) VALUES (?, ?, ?, ?, ?, ?, 0, ?)", [gid, "General meeting", "1. Welcome\n2. Semester plans\n3. AOB", daysFromNow(5, 17), "Room 12, Science Block", "https://meet.google.com/abc-defg-hij", u[owner]]);
    await insert("INSERT INTO group_campaigns (group_id, title, story, goal_amount, raised_amount, donor_count, momo_number, momo_name) VALUES (?, ?, ?, 5000, 1850, 23, '0200000003', ?)", [gid, "Semester project fund", "Help us fund this semester's outreach and events.", name]);
  }

  // ---- SocialNet ----------------------------------------------------------------------------------
  const pageId = await insert(
    "INSERT INTO social_pages (owner_id, name, slug, category, about, avatar_url, cover_url, follower_count, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 3, 1)",
    [u.yaw, "UCC SRC", "ucc-src", "Student association", "Official page of the Students' Representative Council.", img("page-src", 400, 400), img("page-src-cover", 1600, 500)],
  );
  for (const f of [u.ama, u.efua, u.nana]) await insert("INSERT INTO page_followers (page_id, user_id) VALUES (?, ?)", [pageId, f]);
  const posts: Array<[number, string, number | null, Array<string>]> = [
    [u.ama!, "Just submitted my final-year project proposal 🙌 Wish me luck!", null, []],
    [u.yaw!, "SRC Week starts next Monday! Grab your concert tickets on Capevars Marketplace 🎶", pageId, [img("post-concert", 1200, 800)]],
    [u.efua!, "Best jollof on campus? I'll start: Adwoa's Kitchen 😋", null, [img("post-jollof", 1200, 800)]],
    [u.nana!, "Open to frontend roles — React/TypeScript. Referrals appreciated!", null, []],
    [u.esi!, "Beach clean-up this Saturday at 7am. Bring gloves and good vibes 🌊", null, [img("post-beach", 1200, 800), img("post-beach-2", 1200, 800)]],
  ];
  for (const [author, body, page, images] of posts) {
    const pid = await insert("INSERT INTO social_posts (author_id, page_id, body, images, visibility, reaction_count, comment_count) VALUES (?, ?, ?, ?, 'public', 2, 1)", [author, page, body, JSON.stringify(images)]);
    for (const r of ids.filter((x) => x !== author).slice(0, 2)) await insert("INSERT INTO post_reactions (post_id, user_id, reaction) VALUES (?, ?, 'like')", [pid, r]);
    await insert("INSERT INTO post_comments (post_id, user_id, body) VALUES (?, ?, ?)", [pid, ids.find((x) => x !== author), "Love this! 👏"]);
  }

  // ---- OpenLearn -----------------------------------------------------------------------------------
  const [ccats] = await db.query<RowDataPacket[]>("SELECT id, slug FROM course_categories");
  const ccat = (s: string) => ccats.find((c) => c.slug === s)?.id ?? null;
  const courses: Array<[string, string, string, string, number, string]> = [
    ["akosua", "Microsoft Excel: Beginner to Pro", "Formulas, pivot tables and dashboards for school and work", "data-ai", 0, "excel"],
    ["nana", "Modern Web Development with React", "Build real apps with React, TypeScript and APIs", "technology", 150, "react"],
    ["kojo", "Introduction to Agribusiness", "Turn farming ideas into profitable businesses", "agriculture", 80, "agri"],
    ["kwame", "Start Selling Online in Ghana", "Open your store, price right and grow with MoMo payments", "business", 0, "selling"],
  ];
  for (const [i, [instructor, title, subtitle, category, price, seed]] of courses.entries()) {
    const cid = await insert(
      `INSERT INTO courses (instructor_id, category_id, title, slug, subtitle, description, outcomes, requirements, audience, level, cover_url, price, compare_at_price, status, published_at, is_featured, enrollment_count, rating_avg, rating_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'beginner', ?, ?, ?, 'published', NOW(), ?, ?, ?, ?)`,
      [
        u[instructor], ccat(category), title, slug(title), subtitle, `<p>${subtitle}. Short videos, hands-on exercises, quizzes and an assignment.</p>`,
        JSON.stringify(["Understand the core concepts", "Apply them to real projects", "Avoid common mistakes", "Earn a certificate"]),
        JSON.stringify(["A laptop or smartphone", "Curiosity"]), JSON.stringify(["Students", "Young professionals"]),
        img(`c-${seed}`, 1280, 720), price, price ? price * 2 : null, i < 2 ? 1 : 0, 120 + i * 45, (4.5 + i / 20).toFixed(1), 20 + i * 7,
      ],
    );
    const s1 = await insert("INSERT INTO course_sections (course_id, title, sort_order) VALUES (?, 'Getting started', 0)", [cid]);
    const s2 = await insert("INSERT INTO course_sections (course_id, title, sort_order) VALUES (?, 'Putting it into practice', 1)", [cid]);
    await insert("INSERT INTO course_lessons (course_id, section_id, title, type, video_url, duration_minutes, is_preview, sort_order) VALUES (?, ?, 'Welcome to the course', 'video', 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', 8, 1, 0)", [cid, s1]);
    await insert("INSERT INTO course_lessons (course_id, section_id, title, type, content, duration_minutes, sort_order) VALUES (?, ?, 'Key ideas', 'article', ?, 10, 1)", [cid, s1, "<h2>Key ideas</h2><p>Here are the most important concepts we'll use throughout this course.</p><ul><li>Start small</li><li>Practise daily</li><li>Ask questions</li></ul>"]);
    await insert("INSERT INTO course_lessons (course_id, section_id, title, type, image_url, duration_minutes, sort_order) VALUES (?, ?, 'Cheat sheet', 'infographic', ?, 5, 2)", [cid, s1, img(`ig-${seed}`, 1000, 1400)]);
    const quiz = await insert("INSERT INTO course_lessons (course_id, section_id, title, type, pass_mark, duration_minutes, sort_order) VALUES (?, ?, 'Check your understanding', 'quiz', 60, 5, 0)", [cid, s2]);
    for (const [qi, q] of ["What should you do first?", "How often should you practise?", "What helps most when stuck?"].entries()) {
      await insert("INSERT INTO quiz_questions (lesson_id, question, options, correct_index, explanation, sort_order) VALUES (?, ?, ?, ?, ?, ?)", [quiz, q, JSON.stringify(["Start small", "Practise daily", "Ask questions", "Give up"]), qi, "Revisit the Key ideas lesson.", qi]);
    }
    await insert("INSERT INTO course_lessons (course_id, section_id, title, type, content, duration_minutes, sort_order) VALUES (?, ?, 'Mini project', 'assignment', ?, 30, 1)", [cid, s2, "<p>Apply what you've learned to a small project and describe what you did.</p>"]);
    await db.query("UPDATE courses SET lesson_count = 5, duration_minutes = 58 WHERE id = ?", [cid]);
    await insert("INSERT INTO enrollments (course_id, user_id, status, progress_percent) VALUES (?, ?, 'active', 40)", [cid, u.ama]);
    await insert("INSERT INTO course_reviews (course_id, user_id, rating, body) VALUES (?, ?, 5, 'Clear, practical and well paced. Highly recommended!')", [cid, u.ama]);
  }

  // ---- LeadGen ---------------------------------------------------------------------------------------
  const lists: Array<[string, string, string, string, number, number]> = [
    ["esi", "Cape Coast Volunteers — contact list", "community", "Volunteers", 0, 40],
    ["kweku", "Central Region SMEs directory", "business", "Retail & services", 150, 120],
    ["yaw", "Campus association executives", "association", "Student leaders", 50, 60],
  ];
  for (const [i, [owner, title, category, sub, price, n]] of lists.entries()) {
    const lid = await insert(
      `INSERT INTO lead_lists (user_id, title, slug, category, subcategory, description, region, price, allow_download, share_code, consent_confirmed, status, phone_count, email_count, contact_count, access_count, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, 'Central Region', ?, ?, ?, 1, 'published', ?, ?, ?, ?, 1)`,
      [u[owner], title, slug(title), category, sub, `${title}. Collected with consent at events and sign-up forms.`, price, i === 0 ? 1 : 0, `LSDEMO${i + 1}AA`, n, n, n, 3 + i],
    );
    for (let k = 1; k <= n; k++) {
      await insert("INSERT INTO lead_contacts (list_id, name, phone, email, organization, location) VALUES (?, ?, ?, ?, ?, ?)", [
        lid, `Contact ${i + 1}-${k}`, `2332000${String(i + 1)}${String(k).padStart(4, "0")}`, `contact${i + 1}.${k}@example.com`, sub, "Cape Coast",
      ]);
    }
    await insert("INSERT INTO lead_access (list_id, user_id, voucher_code, source) VALUES (?, ?, ?, 'owner')", [lid, u[owner], code("LV", 100 + i)]);
  }
  await insert("INSERT INTO broadcast_wallets (user_id, balance) VALUES (?, 500)", [u.ama]);
  await insert("INSERT INTO credit_transactions (user_id, type, credits, balance_after, note) VALUES (?, 'admin', 500, 500, 'Welcome credits (demo)')", [u.ama]);
  await insert("INSERT INTO credit_vouchers (code, credits, max_redemptions, note) VALUES ('WELCOME100', 100, 1000, 'Demo welcome voucher')", []);

  console.log(`Demo data ready. Sign in as any of: ${PEOPLE.map((p) => `${p[1]}@capevars.test`).join(", ")} (password Demo@2026).`);
  await db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
