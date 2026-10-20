import "dotenv/config";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import mysql from "mysql2/promise";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const root = path.resolve(import.meta.dirname, "../../..");
const archive = path.resolve(process.argv[2] ?? path.join(root, "files/v15.zip"));
const temp = await mkdtemp(path.join(tmpdir(), "kidi-import-"));
type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  visual: unknown;
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
  subject: string;
  level: string;
  source: string;
  sourceHash: string;
  pdf: string;
  epub: string;
  mediaCount: number;
  lessons: Lesson[];
};
const connection = await mysql.createConnection(process.env.DATABASE_URL!);
try {
  execFileSync(
    "python3",
    [
      path.join(import.meta.dirname, "extract-kidi-v15.py"),
      archive,
      path.join(temp, "courses.json"),
      path.join(temp, "public"),
    ],
    { stdio: "inherit" },
  );
  const sources: Source[] = JSON.parse(await readFile(path.join(temp, "courses.json"), "utf8"));
  await connection.beginTransaction();
  // A non-login content owner avoids assigning imported material to a real learner.
  await connection.execute(
    `INSERT INTO users (full_name, username, email, is_active) VALUES ('kidiLearn Library', 'kidilearn-library', 'kidilearn-library@content.invalid', 0) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
  );
  const [owners] = await connection.execute<RowDataPacket[]>(
    `SELECT id, email, is_active FROM users WHERE username = 'kidilearn-library'`,
  );
  if (owners[0]?.email !== "kidilearn-library@content.invalid" || owners[0]?.is_active !== 0)
    throw new Error("Content-owner account conflicts with an existing account.");
  const ownerId = owners[0].id;
  for (const source of sources) {
    const slug = `kidilearn-basic-3-${source.subject}`;
    const [existing] = await connection.execute<RowDataPacket[]>(
      "SELECT id FROM courses WHERE slug = ?",
      [slug],
    );
    if (existing[0]) {
      const [imported] = await connection.execute<RowDataPacket[]>(
        "SELECT source_hash FROM kidi_lessons WHERE course_id = ?",
        [existing[0].id],
      );
      if (
        imported.length !== source.lessons.length ||
        imported.some((l) => l.source_hash !== source.sourceHash)
      )
        throw new Error(
          `${slug} has different content. Refusing to overwrite lessons or learner progress.`,
        );
      console.log(`Already imported: ${slug}; preserving IDs and progress.`);
      continue;
    }
    const [links] = await connection.execute<RowDataPacket[]>(
      "SELECT course_id FROM kidi_course_links WHERE level_key = ? AND subject_key = ?",
      ["b3", source.subject],
    );
    if (links[0]?.course_id)
      throw new Error(`Basic 3 ${source.subject} already maps to another course.`);
    const subjectName =
      source.subject === "english"
        ? "English language"
        : source.subject[0]!.toUpperCase() + source.subject.slice(1);
    const [course] = await connection.execute<ResultSetHeader>(
      `INSERT INTO courses (instructor_id, title, slug, subtitle, description, price, certificate_enabled, status, published_at, lesson_count, duration_minutes) VALUES (?, ?, ?, ?, ?, 0, 0, 'published', NOW(), ?, ?)`,
      [
        ownerId,
        `Basic 3 · ${subjectName}`,
        slug,
        "Explore, practise and discover with kidiLearn.",
        `<p>${source.lessons.length} interactive lessons with videos, practice and challenges. Adapted from the supplied v15 learning archive. Independently developed materials; not an official NaCCA-endorsed course.</p>`,
        source.lessons.length * 3,
        source.lessons.length * 25,
      ],
    );
    const courseId = course.insertId;
    const sections = new Map<string, number>();
    for (const [index, lesson] of source.lessons.entries()) {
      if (!sections.has(lesson.strand)) {
        const [section] = await connection.execute<ResultSetHeader>(
          "INSERT INTO course_sections (course_id, title, sort_order) VALUES (?, ?, ?)",
          [courseId, lesson.strand, sections.size],
        );
        sections.set(lesson.strand, section.insertId);
      }
      const phaseIds: number[] = [];
      for (const [phaseIndex, phase] of ["explore", "play", "challenge"].entries()) {
        const [row] = await connection.execute<ResultSetHeader>(
          "INSERT INTO course_lessons (course_id, section_id, title, type, content, video_url, duration_minutes, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            courseId,
            sections.get(lesson.strand)!,
            `${lesson.title} · ${phase}`.slice(0, 200),
            phase === "explore" ? "article" : "quiz",
            phase === "explore"
              ? lesson.notes
                  .map(
                    (n) =>
                      `<p>${n.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>`,
                  )
                  .join("")
              : null,
            phase === "explore" ? lesson.video : null,
            phase === "explore" ? 10 : phase === "play" ? 5 : 10,
            index * 3 + phaseIndex,
          ],
        );
        phaseIds.push(row.insertId);
        if (phase === "explore") continue;
        for (const [order, q] of (lesson[phase] as Question[]).entries()) {
          await connection.execute(
            "INSERT INTO quiz_questions (lesson_id, question, options, correct_index, explanation, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            [
              row.insertId,
              q.question,
              JSON.stringify(q.options),
              q.correctIndex,
              q.explanation,
              order,
            ],
          );
        }
      }
      const { play, challenge, ...content } = lesson;
      await connection.execute(
        "INSERT INTO kidi_lessons (course_id, source_key, source_hash, title, strand, sort_order, explore_id, play_id, challenge_id, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          courseId,
          lesson.key,
          source.sourceHash,
          lesson.title,
          lesson.strand,
          index,
          ...phaseIds,
          JSON.stringify({
            ...content,
            pdf: source.pdf,
            epub: source.epub,
            playVisuals: play.map((q) => q.visual),
            challengeVisuals: challenge.map((q) => q.visual),
          }),
        ],
      );
    }
    await connection.execute(
      `INSERT INTO kidi_course_links (level_key, subject_key, course_id, directory_ref, is_active) VALUES ('b3', ?, ?, ?, 1) ON DUPLICATE KEY UPDATE course_id = VALUES(course_id), directory_ref = VALUES(directory_ref), is_active = 1`,
      [source.subject, courseId, `v15/${source.source}`],
    );
    console.log(
      `Imported ${subjectName}: ${source.lessons.length} lessons, ${source.lessons.length * 35} questions.`,
    );
  }
  // Publish assets only after every existing course has passed the source-hash check.
  await cp(path.join(temp, "public/kidilearn"), path.join(root, "apps/web/public/kidilearn"), {
    recursive: true,
  });
  await connection.commit();
  await mkdir(path.join(root, "docs"), { recursive: true });
  await writeFile(
    path.join(root, "docs/kidilearn-basic3-manifest.json"),
    JSON.stringify(
      sources.map(({ lessons, ...source }) => ({
        ...source,
        lessons: lessons.length,
        practiceQuestions: lessons.length * 10,
        challengeQuestions: lessons.length * 25,
      })),
      null,
      2,
    ) + "\n",
  );
  console.log("Basic 3 library ready. Re-running the same archive preserves learner progress.");
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
  await rm(temp, { recursive: true, force: true });
}
