// Platform-wide settings managed in Admin → Settings. Each group is stored as
// one JSON row in `site_settings` and merged over these defaults on read, so a
// new field never needs a migration and an empty database still renders a
// site. Client-safe: the admin forms validate with these same schemas.
import { z } from "zod";

const link = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(v),
    "Use a path like /market or a full URL",
  );
const text = (max: number) => z.string().trim().max(max);

export const SOCIAL_PLATFORMS = ["facebook", "x", "instagram", "youtube", "linkedin", "tiktok"] as const;

export const settingsSchemas = {
  identity: z.object({
    name: text(80).min(2),
    tagline: text(160),
    description: text(600),
    supportEmail: text(150),
    supportPhone: text(60),
    address: text(300),
  }),
  socials: z.object(
    Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, link])) as Record<
      (typeof SOCIAL_PLATFORMS)[number],
      typeof link
    >,
  ),
  notice: z.object({
    enabled: z.boolean(),
    text: text(300),
    linkLabel: text(40),
    linkUrl: link,
  }),
  home: z.object({
    heroEyebrow: text(80),
    heroTitle: text(160),
    heroHighlight: text(80),
    heroText: text(400),
    heroImageUrl: link,
    searchPlaceholder: text(120),
    trendingSearches: z.array(text(40).min(1)).max(10),
  }),
  marketplace: z.object({
    currency: text(8).min(1),
    sellerTerms: text(4000),
    defaultDeliveryNote: text(300),
  }),
  finder: z.object({
    cities: z.array(text(60).min(1)).max(40),
    areas: z.array(text(60).min(1)).max(80),
  }),
  leadgen: z.object({
    smsCreditCost: z.number().min(0.01).max(100),
    emailCreditCost: z.number().min(0.01).max(100),
    bundles: z.array(z.object({ credits: z.number().int().min(1).max(10_000_000), price: z.number().min(0.5).max(1_000_000) })).min(1).max(8),
    platformFeePercent: z.number().min(0).max(80),
    minPayout: z.number().min(1).max(100_000),
    defaultSmsSender: text(11).min(3),
    defaultEmailSender: text(60).min(2),
    emailDailyLimit: z.number().int().min(1).max(100_000),
    maxRecipients: z.number().int().min(10).max(500_000),
    terms: text(4000),
  }),
  learn: z.object({
    instructorGuidelines: text(8000),
    minLessons: z.number().int().min(1).max(50),
    platformFeePercent: z.number().min(0).max(60),
  }),
};

export type SettingsKey = keyof typeof settingsSchemas;
export const SETTINGS_KEYS = Object.keys(settingsSchemas) as Array<SettingsKey>;
export type SiteSettings = { [TKey in SettingsKey]: z.infer<(typeof settingsSchemas)[TKey]> };

export const DEFAULT_SETTINGS: SiteSettings = {
  identity: {
    name: "Capevars",
    tagline: "Innovation in style",
    description:
      "Capevars brings your campus and community together — shop, find places and people, join groups, connect with friends, learn new skills and reach your audience, all with one account.",
    supportEmail: "support@capevars.com",
    supportPhone: "",
    address: "Cape Coast, Ghana",
  },
  socials: { facebook: "", x: "", instagram: "", youtube: "", linkedin: "", tiktok: "" },
  notice: { enabled: false, text: "", linkLabel: "Learn more", linkUrl: "" },
  home: {
    heroEyebrow: "One account · Six platforms",
    heroTitle: "Everything your campus needs,",
    heroHighlight: "in one place.",
    heroText:
      "Shop from trusted student and local sellers, book tickets, find hostels and hotels, join campus groups, connect with friends, learn new skills and broadcast to your community.",
    heroImageUrl: "",
    searchPlaceholder: "Search products, hostels, groups, courses, people…",
    trendingSearches: ["Hostels near campus", "Laptops", "Jollof", "Bus to Accra", "Python course"],
  },
  marketplace: {
    currency: "GHS",
    sellerTerms:
      "Sell only genuine items you have the right to sell. Describe items honestly with real photos, honour your listed prices, and respond to orders promptly. Prohibited: counterfeit goods, weapons, drugs, alcohol to minors, stolen property and anything illegal in Ghana. Capevars may suspend stores that break these rules.",
    defaultDeliveryNote: "Delivery within campus and nearby areas. Fees are set by each seller.",
  },
  finder: {
    cities: ["Cape Coast", "Accra", "Kumasi", "Takoradi", "Tamale", "Ho", "Koforidua", "Sunyani"],
    areas: ["Amamoma", "Ayensu", "Kwaprow", "Science", "Old Site", "School Bus Road", "Apewosika", "Abura", "Pedu", "Kotokuraba"],
  },
  leadgen: {
    smsCreditCost: 1,
    emailCreditCost: 0.3,
    bundles: [
      { credits: 100, price: 5 },
      { credits: 500, price: 22 },
      { credits: 1000, price: 40 },
      { credits: 5000, price: 180 },
      { credits: 20000, price: 650 },
    ],
    platformFeePercent: 20,
    minPayout: 50,
    defaultSmsSender: "Capevars",
    defaultEmailSender: "Capevars",
    emailDailyLimit: 450,
    maxRecipients: 20000,
    terms:
      "Only upload, share or sell contacts you have the right to use, collected with the people's consent, in line with Ghana's Data Protection Act, 2012 (Act 843). No spam, scams, adult content, or messages that impersonate others. Every email carries an unsubscribe link and opted-out contacts are never messaged again. Capevars may suspend lists, sender IDs and accounts that break these rules.",
  },
  learn: {
    instructorGuidelines: [
      "1. Teach something you know well. Your course should deliver a clear, practical outcome.",
      "2. Plan before you film. Outline sections and lessons, and write 4+ learning outcomes.",
      "3. Mix formats: short videos (2–15 min), articles, infographics, quizzes and at least one assignment.",
      "4. Quality matters: clear audio, readable slides, good lighting. No copyrighted material you don't own.",
      "5. Add a quiz at the end of each section so learners can check their understanding.",
      "6. Set a fair price — or make it free. You can change the price later.",
      "7. Submit for review. Our team checks content quality and policy compliance, usually within 3 working days.",
      "8. Engage: answer discussion questions and grade assignments promptly.",
    ].join("\n"),
    minLessons: 3,
    platformFeePercent: 15,
  },
};

// Merges a stored (possibly partial or stale) value over the defaults; any
// stored value that no longer validates falls back to the default.
export function mergeSetting<TKey extends SettingsKey>(key: TKey, stored: unknown): SiteSettings[TKey] {
  const defaults = DEFAULT_SETTINGS[key];
  if (!stored || typeof stored !== "object") return defaults;
  const merged = { ...defaults, ...stored };
  const parsed = settingsSchemas[key].safeParse(merged);
  return parsed.success ? (parsed.data as SiteSettings[TKey]) : defaults;
}
