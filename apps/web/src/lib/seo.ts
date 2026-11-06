// Page tags for search engines and link previews: titles, descriptions, canonical
// addresses, Open Graph and Twitter tags, and schema.org data. Client-safe, because
// route heads also run in the browser when navigating.
import { QB_LEVELS } from "#/lib/quizbank";
import type { QbLevel } from "#/lib/quizbank";

// APP_URL, baked in at build time. Search engines need full addresses, and a live
// build must never send them to localhost, even if APP_URL was left at its default.
const CONFIGURED = typeof __SITE_URL__ === "undefined" ? "" : __SITE_URL__;
const isLocal = /\/\/(localhost|127\.0\.0\.1)\b/.test(CONFIGURED);
export const SITE_URL = CONFIGURED && !(isLocal && (import.meta.env as Partial<ImportMetaEnv> | undefined)?.PROD) ? CONFIGURED : "https://capevars.com";
export const SITE_NAME = "Capevars";

export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);

// Plain text of about `max` characters, cut at a word, for a description tag.
export function clip(text: string | null | undefined, max = 158) {
  const plain = String(text ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 30)).replace(/[\s,;:.-]+$/, "")}…`;
}

type JsonLd = Record<string, unknown>;

export function pageSeo({
  title,
  description,
  path,
  image = "/og.png",
  imageAlt,
  type = "website",
  noindex = false,
  jsonLd = [],
}: {
  title: string;
  description: string;
  /** The page's own address, without filters or search terms. */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Array<JsonLd>;
}) {
  const url = absoluteUrl(path);
  const picture = absoluteUrl(image);
  const summary = clip(description);
  return {
    meta: [
      { title },
      { name: "description", content: summary },
      ...(noindex ? [{ name: "robots", content: "noindex" }] : []),
      { property: "og:type", content: type },
      { property: "og:title", content: title },
      { property: "og:description", content: summary },
      { property: "og:url", content: url },
      { property: "og:image", content: picture },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: imageAlt ?? title },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: summary },
      { name: "twitter:image", content: picture },
    ],
    links: noindex ? [] : [{ rel: "canonical", href: url }],
    // "<" is escaped so text in the data can't close the script tag.
    scripts: jsonLd.map((data) => ({ type: "application/ld+json", children: JSON.stringify(data).replace(/</g, "\\u003c") })),
  };
}

const ORGANIZATION = { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: absoluteUrl("/logo-mark.png") };

export function courseJsonLd(course: {
  name: string;
  description: string;
  path: string;
  image: string;
  code?: string | null;
  level?: string | null;
  topics?: Array<string>;
  price?: number | null;
  rating?: number | null;
  ratingCount?: number | null;
  instructor?: string | null;
  audience?: string;
}): JsonLd {
  const url = absoluteUrl(course.path);
  const price = Number(course.price ?? 0);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: clip(course.description, 400),
    url,
    image: absoluteUrl(course.image),
    inLanguage: "en",
    provider: ORGANIZATION,
    ...(course.code ? { courseCode: course.code } : {}),
    ...(course.level ? { educationalLevel: course.level } : {}),
    ...(course.topics?.length ? { teaches: course.topics.slice(0, 12) } : {}),
    ...(course.audience ? { audience: { "@type": "EducationalAudience", educationalRole: course.audience } } : {}),
    isAccessibleForFree: price <= 0,
    offers: { "@type": "Offer", category: price > 0 ? "Paid" : "Free", price: price.toFixed(2), priceCurrency: "GHS", availability: "https://schema.org/InStock", url },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: "PT10H",
      ...(course.instructor ? { instructor: { "@type": "Person", name: course.instructor } } : {}),
    },
    ...(course.rating && course.ratingCount ? { aggregateRating: { "@type": "AggregateRating", ratingValue: course.rating, ratingCount: course.ratingCount, bestRating: 5 } } : {}),
  };
}

export const breadcrumbJsonLd = (items: Array<[name: string, path: string]>): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: absoluteUrl(path) })),
});

// ---- Quizbank --------------------------------------------------------------------------------

const count = (n: number) => n.toLocaleString("en-US");

export const quizbankCourseName = (c: { code: string | null; title: string }) => (c.code && !c.title.toLowerCase().includes(c.code.toLowerCase()) ? `${c.code} ${c.title}` : c.title);

// Topic tags worth naming: not the "2019 Paper" or "Section B" kind.
export const realTopics = (topics: Array<{ name: string; count: number }>) =>
  [...topics]
    .filter((t) => !/\b(19|20)\d\d\b|paper|section/i.test(t.name))
    .sort((a, b) => b.count - a.count)
    .map((t) => t.name);

type QuizbankCourse = { code: string | null; title: string; level: QbLevel; questionCount: number; questionTypes?: Partial<Record<"choice" | "text", number>> };

// For the page itself, built from what the course really holds so each one reads differently.
export function quizbankDescription(c: QuizbankCourse, topics: Array<{ name: string; count: number }> = []) {
  const written = c.questionTypes?.text ?? 0;
  const kinds = written && c.questionTypes?.choice ? ` (${count(c.questionTypes.choice)} multiple choice, ${count(written)} written)` : "";
  const covers = realTopics(topics).slice(0, 5);
  return [
    `Practise ${quizbankCourseName(c)} for ${QB_LEVELS[c.level]} with ${count(c.questionCount)} question${c.questionCount === 1 ? "" : "s"}${kinds}, each with its answer, hints and a clear explanation.`,
    covers.length ? `Topics include ${covers.join(", ")}.` : "",
    "Study at your own pace or sit timed mock exams.",
  ]
    .filter(Boolean)
    .join(" ");
}

// For search results, which cut off at about 158 characters: whole sentences only.
export function quizbankSummary(c: QuizbankCourse, topics: Array<{ name: string; count: number }> = []) {
  let text = `${quizbankCourseName(c)} for ${QB_LEVELS[c.level]}: ${count(c.questionCount)} past question${c.questionCount === 1 ? "" : "s"} with answers and explanations.`;
  for (const extra of [" Sit timed mock exams.", ...[3, 2, 1].map((n) => ` Covers ${realTopics(topics).slice(0, n).join(", ")}.`)]) {
    if (extra.includes("Covers .") || text.includes("Covers")) continue;
    if (text.length + extra.length <= 158) text += extra;
  }
  return text;
}
