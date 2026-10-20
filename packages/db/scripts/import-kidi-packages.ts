import "dotenv/config";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import mysql from "mysql2/promise";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  visual: unknown;
  interaction?: unknown;
};
type Lesson = {
  key: string;
  title: string;
  strand: string;
  notes: string[];
  video: string;
  play: Question[];
  challenge: Question[];
  [key: string]: unknown;
};
type Source = {
  level: string;
  subject: string;
  version: number;
  sourceHash: string;
  source: string;
  pdf: string;
  epub: string;
  lessons: Lesson[];
  [key: string]: unknown;
};
const courseSlug = (source: Source) => {
  if (!/^(?:b[1-9]|kg[12])$/.test(source.level)) throw new Error(`Invalid level: ${source.level}`);
  return source.level.startsWith("kg")
    ? `kidilearn-kg-${source.level.slice(2)}-${source.subject}`
    : `kidilearn-basic-${source.level.slice(1)}-${source.subject}`;
};
const levelLabel = (level: string) =>
  level.startsWith("kg") ? `KG ${level.slice(2)}` : `Basic ${level.slice(1)}`;
const root = path.resolve(import.meta.dirname, "../../..");
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const allowUpdate = args.includes("--update");
let archives = args.filter((a) => !a.startsWith("--")).map((p) => path.resolve(p));
if (!archives.length)
  archives = (await readdir(path.join(root, "files")))
    .filter((n) =>
      /^NACCA_(COURSES_v17_.*|(?:English|Mathematics)_Basic_\d_Complete_Learning_Package_v(?:18|19|20|21|22))\.zip$/.test(
        n,
      ),
    )
    .sort()
    .map((n) => path.join(root, "files", n));
if (!args.some((a) => !a.startsWith("--")))
  archives.push(
    ...(await readdir(path.join(root, "files/new")).catch(() => []))
      .filter((n) => n.endsWith(".zip"))
      .sort()
      .map((n) => path.join(root, "files/new", n)),
  );
if (!archives.length) throw new Error("No supported course archives found.");
const temp = await mkdtemp(path.join(tmpdir(), "kidi-packages-"));
const db = await mysql.createConnection(process.env.DATABASE_URL!);
const escape = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
try {
  execFileSync(
    "python3",
    [
      path.join(import.meta.dirname, "extract-kidi-packages.py"),
      path.join(temp, "courses.json"),
      path.join(temp, "public"),
      ...archives,
    ],
    { stdio: "inherit" },
  );
  const sources: Source[] = JSON.parse(await readFile(path.join(temp, "courses.json"), "utf8"));
  await db.beginTransaction();
  // Check every course before any content is changed.
  for (const source of sources) {
    const slug = courseSlug(source);
    const [courses] = await db.execute<RowDataPacket[]>(
      "SELECT c.*, u.username FROM courses c JOIN users u ON u.id = c.instructor_id WHERE c.slug = ? FOR UPDATE",
      [slug],
    );
    const [links] = await db.execute<RowDataPacket[]>(
      "SELECT course_id FROM kidi_course_links WHERE level_key = ? AND subject_key = ?",
      [source.level, source.subject],
    );
    if (links[0]?.course_id && links[0].course_id !== courses[0]?.id)
      throw new Error(`Conflicting course mapping for ${slug}`);
    if (!courses[0]) continue;
    if (courses[0].username !== "kidilearn-library")
      throw new Error(`Refusing to overwrite another instructor's course: ${slug}`);
    const [lessons] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM kidi_lessons WHERE course_id = ? ORDER BY sort_order",
      [courses[0].id],
    );
    const [counts] = await db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) AS n FROM course_lessons WHERE course_id = ?",
      [courses[0].id],
    );
    if (
      lessons.length !== source.lessons.length ||
      Number(counts[0]!.n) !== lessons.length * 3 ||
      lessons.some(
        (l) => !source.lessons.some((s) => s.key === l.source_key && s.title === l.title),
      )
    )
      throw new Error(
        `Lesson structure changed in ${slug}; a reviewed mapping is required to preserve progress.`,
      );
    if (lessons.every((l) => l.source_hash === source.sourceHash)) continue;
    const [releases] = await db.execute<RowDataPacket[]>(
      "SELECT MAX(version) AS version FROM kidi_course_releases WHERE course_id = ?",
      [courses[0].id],
    );
    const version = Number(releases[0]?.version ?? 15);
    if (source.version <= version)
      throw new Error(
        `Refusing downgrade or conflicting v${source.version} content for ${slug} (current v${version}).`,
      );
    if (!allowUpdate && !checkOnly)
      throw new Error(
        `Pass --update to apply the reviewed v${version} → v${source.version} update for ${slug}.`,
      );
    console.log(
      `Update available: ${slug}, v${version} → v${source.version}; ${lessons.length} lesson identities preserved.`,
    );
  }
  if (checkOnly) {
    await db.rollback();
    console.log(
      `Preflight passed: ${sources.length} courses, ${sources.reduce((n, s) => n + s.lessons.length, 0)} lessons.`,
    );
  } else {
    await db.execute(
      `INSERT INTO users (full_name, username, email, is_active) VALUES ('kidiLearn Library', 'kidilearn-library', 'kidilearn-library@content.invalid', 0) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
    );
    const [owners] = await db.execute<RowDataPacket[]>(
      `SELECT id, email, is_active FROM users WHERE username = 'kidilearn-library'`,
    );
    if (owners[0]?.email !== "kidilearn-library@content.invalid" || owners[0].is_active !== 0)
      throw new Error("Content owner conflicts with an existing account.");
    for (const source of sources) {
      const slug = courseSlug(source);
      const [existing] = await db.execute<RowDataPacket[]>(
        "SELECT id FROM courses WHERE slug = ?",
        [slug],
      );
      let courseId: number = existing[0]?.id;
      if (!courseId) {
        const title = String(
          source.subjectTitle ??
            (source.subject === "english"
              ? "English language"
              : source.subject[0]!.toUpperCase() + source.subject.slice(1)),
        );
        const [created] = await db.execute<ResultSetHeader>(
          `INSERT INTO courses (instructor_id, title, slug, subtitle, price, certificate_enabled, status, published_at) VALUES (?, ?, ?, 'Explore, practise and discover with kidiLearn.', 0, 0, 'published', NOW())`,
          [owners[0].id, `${levelLabel(source.level)} · ${title}`, slug],
        );
        courseId = created.insertId;
      }
      const [oldLessons] = await db.execute<RowDataPacket[]>(
        "SELECT * FROM kidi_lessons WHERE course_id = ?",
        [courseId],
      );
      if (oldLessons.length && oldLessons.every((l) => l.source_hash === source.sourceHash)) {
        console.log(`Unchanged: ${slug}`);
        continue;
      }
      const [oldSections] = await db.execute<RowDataPacket[]>(
        "SELECT id, title FROM course_sections WHERE course_id = ?",
        [courseId],
      );
      const sections = new Map<string, number>(oldSections.map((s) => [s.title, s.id]));
      for (const [index, lesson] of source.lessons.entries()) {
        if (!sections.has(lesson.strand)) {
          const [created] = await db.execute<ResultSetHeader>(
            "INSERT INTO course_sections (course_id, title, sort_order) VALUES (?, ?, ?)",
            [courseId, lesson.strand, sections.size],
          );
          sections.set(lesson.strand, created.insertId);
        }
        const old = oldLessons.find((l) => l.source_key === lesson.key);
        const ids: number[] = [];
        for (const [phaseIndex, phase] of ["explore", "play", "challenge"].entries()) {
          const content =
            phase === "explore" ? lesson.notes.map((n) => `<p>${escape(n)}</p>`).join("") : null;
          const values = [
            sections.get(lesson.strand)!,
            `${lesson.title} · ${phase}`.slice(0, 200),
            phase === "explore" ? "article" : "quiz",
            content,
            phase === "explore" ? lesson.video : null,
            phase === "explore" ? 10 : 5,
            index * 3 + phaseIndex,
          ];
          let id: number = old?.[`${phase}_id`];
          if (id)
            await db.execute(
              "UPDATE course_lessons SET section_id = ?, title = ?, type = ?, content = ?, video_url = ?, duration_minutes = ?, sort_order = ? WHERE id = ?",
              [...values, id],
            );
          else {
            const [created] = await db.execute<ResultSetHeader>(
              "INSERT INTO course_lessons (section_id, title, type, content, video_url, duration_minutes, sort_order, course_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [...values, courseId],
            );
            id = created.insertId;
          }
          ids.push(id);
          if (phase === "explore") continue;
          // Keep IDs for unchanged banks so open quizzes and progress stay valid.
          const bank = lesson[phase] as Question[];
          const [previous] = await db.execute<RowDataPacket[]>(
            "SELECT question, options, correct_index, explanation FROM quiz_questions WHERE lesson_id = ? ORDER BY sort_order, id",
            [id],
          );
          if (
            previous.length === bank.length &&
            previous.every(
              (q, i) =>
                q.question === bank[i]!.question &&
                JSON.stringify(
                  typeof q.options === "string" ? JSON.parse(q.options) : q.options,
                ) === JSON.stringify(bank[i]!.options) &&
                q.correct_index === bank[i]!.correctIndex &&
                q.explanation === bank[i]!.explanation,
            )
          )
            continue;
          // Changed banks receive new IDs; final attempts retain their snapshots.
          await db.execute("DELETE FROM quiz_questions WHERE lesson_id = ?", [id]);
          for (const [order, q] of (lesson[phase] as Question[]).entries())
            await db.execute(
              "INSERT INTO quiz_questions (lesson_id, question, options, correct_index, explanation, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
              [id, q.question, JSON.stringify(q.options), q.correctIndex, q.explanation, order],
            );
        }
        const { play, challenge, ...content } = lesson;
        const payload = JSON.stringify({
          ...content,
          release: source.version,
          pdf: source.pdf,
          epub: source.epub,
          playVisuals: play.map((q) => q.visual),
          challengeVisuals: challenge.map((q) => q.visual),
          playInteractions: play.map((q) => q.interaction ?? null),
        });
        if (old)
          await db.execute(
            "UPDATE kidi_lessons SET source_hash = ?, title = ?, strand = ?, sort_order = ?, payload = ? WHERE id = ?",
            [source.sourceHash, lesson.title, lesson.strand, index, payload, old.id],
          );
        else
          await db.execute(
            "INSERT INTO kidi_lessons (course_id, source_key, source_hash, title, strand, sort_order, explore_id, play_id, challenge_id, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              courseId,
              lesson.key,
              source.sourceHash,
              lesson.title,
              lesson.strand,
              index,
              ...ids,
              payload,
            ],
          );
      }
      if (source.subjectTitle)
        await db.execute("UPDATE courses SET title = ? WHERE id = ?", [
          `${levelLabel(source.level)} · ${source.subjectTitle}`,
          courseId,
        ]);
      await db.execute(
        "UPDATE courses SET description = ?, lesson_count = ?, duration_minutes = ? WHERE id = ?",
        [
          `<p>${source.lessons.length} interactive lessons with videos, 5 Play activities and 10 Challenge questions each. Adapted from the supplied v${source.version} learning archive. Independently developed materials; not an official NaCCA-endorsed course.</p>`,
          source.lessons.length * 3,
          source.lessons.length * 20,
          courseId,
        ],
      );
      await db.execute(
        `INSERT INTO kidi_course_links (level_key, subject_key, course_id, directory_ref, is_active) VALUES (?, ?, ?, ?, 1) ON DUPLICATE KEY UPDATE course_id = VALUES(course_id), directory_ref = VALUES(directory_ref)`,
        [source.level, source.subject, courseId, `v${source.version}/${source.source}`],
      );
      const { lessons, ...metadata } = source;
      await db.execute(
        "INSERT INTO kidi_course_releases (course_id, version, source_hash, source_name, manifest) VALUES (?, ?, ?, ?, ?)",
        [
          courseId,
          source.version,
          source.sourceHash,
          source.source,
          JSON.stringify({
            ...metadata,
            lessons: lessons.length,
            play: lessons.length * 5,
            challenge: lessons.length * 10,
          }),
        ],
      );
      console.log(
        `${oldLessons.length ? "Updated" : "Imported"} ${slug}: ${source.lessons.length} lessons.`,
      );
    }
    // Versioned directories keep old pages/media functional during an upgrade.
    await cp(path.join(temp, "public/kidilearn"), path.join(root, "apps/web/public/kidilearn"), {
      recursive: true,
    });
    await db.commit();
    const manifestPath = path.join(root, "docs/kidilearn-library-manifest.json");
    const previousManifest: Array<{ level: string; subject: string }> = JSON.parse(
      await readFile(manifestPath, "utf8").catch(() => "[]"),
    );
    const manifest = new Map(previousManifest.map((s) => [`${s.level}/${s.subject}`, s]));
    for (const { lessons, ...s } of sources)
      manifest.set(`${s.level}/${s.subject}`, {
        ...s,
        lessons: lessons.length,
        playQuestions: lessons.length * 5,
        challengeQuestions: lessons.length * 10,
      } as (typeof previousManifest)[number]);
    await writeFile(
      path.join(root, "docs/kidilearn-library-manifest.json"),
      JSON.stringify(
        [...manifest.values()].sort((a, b) =>
          `${a.level}/${a.subject}`.localeCompare(`${b.level}/${b.subject}`),
        ),
        null,
        2,
      ) + "\n",
    );
    const additions = sources.filter((s) => s.format === "multimedia-2026");
    if (additions.length)
      await writeFile(
        path.join(root, "docs/kidilearn-new-content.json"),
        JSON.stringify(additions, null, 2) + "\n",
      );
    const repaired = sources.filter((s) => s.format === "source-multimedia-v2");
    if (repaired.length)
      await writeFile(
        path.join(root, "docs/kidilearn-source-content.json"),
        JSON.stringify(repaired, null, 2) + "\n",
      );
    const additional = sources.filter((s) => s.format === "additional-multimedia-v1");
    if (additional.length) {
      const additionalPath = path.join(root, "docs/kidilearn-additional-content.json");
      const previous: Source[] = JSON.parse(
        await readFile(additionalPath, "utf8").catch(() => "[]"),
      );
      const merged = new Map(previous.map((s) => [`${s.level}/${s.subject}`, s]));
      for (const source of additional) merged.set(`${source.level}/${source.subject}`, source);
      await writeFile(additionalPath, JSON.stringify([...merged.values()], null, 2) + "\n");
    }
    console.log(
      "Library import complete. Existing plans, completions and final-quiz snapshots preserved.",
    );
  }
} catch (error) {
  await db.rollback();
  throw error;
} finally {
  await db.end();
  await rm(temp, { recursive: true, force: true });
}
