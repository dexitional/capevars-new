# kidiLearn

The entry point is `/learn/kidilearn`, linked from OpenLearn's shared navigation (desktop, mobile and footer). Parents use their existing member account. Under **Children & progress**, they can create up to 20 private child profiles, each with its own access code, study plans, lesson progress and quiz history. Members can also keep their own plans for KG 1, KG 2 and Basic 1–9.

## Plans

`apps/web/src/lib/kidilearn/catalog.ts` defines stable level and subject keys, display labels, available subjects, and plan validation. Subject choices are a configurable starting catalogue, not a claim of curriculum accreditation. KG learning areas follow the integrated structure in [NaCCA's KG curriculum](https://nacca.gov.gh/wp-content/uploads/2019/06/KG-Curriculum.pdf); JHS choices reference [NaCCA's Common Core Programme](https://nacca.gov.gh/common-core-programme-ccp/). Review subject/language coverage against the digital directory when it is provided.

Plans store study days, minutes per subject session, selected subjects, and individual quiz settings. Each subject gets one session per week, distributed across selected days. Days without a new subject are review days. Saving a different level preserves existing plans.

## Database setup

Run `npm run db:migrate` with the database workspace's `DATABASE_URL` configured. Migrations 0071–0075 create plans, library links, lessons, final attempts and release provenance. Migrations 0076–0081 add child profiles, isolated child plans/attempts/progress/practice history and persistent login rate limits.

## Connecting the future digital course directory

The v17–v22 packages provide 14 courses and 559 lessons: English, Mathematics and Science for Basic 1–3; English and Mathematics for Basic 4–5; and Mathematics for Basic 6. See [the current library notes](kidilearn-library.md). Other subjects/levels show “Lessons coming soon” until content is connected. Plan configuration works for every level.

1. Map each directory entry to a `level_key` (`kg1`, `kg2`, `b1` … `b9`) and a `subject_key` from `catalog.ts`. Validate the pair with `subjectsForLevel`.
2. Create/review the subject course using OpenLearn's existing course, section, lesson and quiz-question structures. Select the intended Ghanaian language in the course content; the initial catalogue does not infer a language for the learner.
3. Upsert `kidi_course_links` using its unique `(level_key, subject_key)` key. There is one subject course per level; its sections/lessons hold the directory's units. `directory_ref` stores the stable source identifier and `source_url` stores provenance. `course_id` may remain null while preparing content, and `is_active` defaults to 0.
4. After editorial review, publish the OpenLearn course and set the link's `is_active` to 1. Only active links to published courses appear as available. Paid courses retain OpenLearn's enrolment access checks.

Example future mapping (illustrative; not seeded):

```json
{
  "level_key": "b4",
  "subject_key": "mathematics",
  "directory_ref": "directory/basic-4/mathematics",
  "source_url": "https://example.org/basic-4/mathematics",
  "course_id": null,
  "is_active": 0
}
```

A repeatable, version-aware importer handles the supplied v17–v22 packages. Other directory formats and language variants can be mapped when supplied. Source URLs are metadata, never fetched automatically by learner requests.

## Final quizzes

Learners can enable a final quiz per subject, choose 5/10/15/20 questions and set a target score. The bank comes from Challenge questions in imported interactive courses; action-based Play questions are excluded. Other linked OpenLearn courses use their existing quiz lessons. The API rechecks saved plan settings, publication and course access before starting. It rejects an insufficient or malformed bank rather than manufacturing questions or silently reducing the count.

Each attempt snapshots a unique random sample and independently shuffled options, using the server's cryptographic random generator. Correct indices remain on the server. The attempt URL can resume the same question set; unsubmitted answer selections are currently held only in page memory. The final submission is validated and graded under a row lock, making repeated submissions idempotent. Scores and the original target are stored per attempt; later plan/course edits do not rewrite results.

Learning API routes under `/api/learn/kidilearn` require a member or a valid child session:

- `GET /dashboard`: own plans, available subject courses and recent own attempts.
- `PUT /plan`: validate and save one level's plan.
- `POST /quizzes`: start a subject's configured final quiz.
- `GET /quizzes/:id`: retrieve an owned attempt without answer keys.
- `POST /quizzes/:id/submit`: validate selections and return the server-calculated result.

## Validation

Pure validation/randomisation/grading checks live in `apps/web/src/server/api/modules/kidilearn/quiz.test.ts`. Run with `node --import tsx --test src/server/api/modules/kidilearn/quiz.test.ts` from `apps/web` using Node 24. Also run the web workspace's `typecheck` and ESLint on the new files.

## Parent and child access

Parents manage profiles and reports at `/learn/kidilearn/family`. A first name or nickname, starting level and avatar are sufficient. Creating a profile or resetting its code reveals a new four-character random code once; only an HMAC digest is stored. A database unique index and collision retries keep codes unique across all profiles, including paused profiles. Existing longer codes continue to work until the parent generates a replacement. Codes accept lowercase, spaces and hyphens at `/learn/kidilearn/login`.

Child sessions expire after eight hours and use a separate signed, HttpOnly cookie and signing key purpose. Child sign-in clears the member cookie; normal member sign-in clears child mode. Child sessions cannot manage profiles, access parent reports or authenticate to normal member APIs. Code reset and access pause/resume revoke existing child sessions without deleting progress. Parent ownership is checked on every profile/report operation. Persistent per-IP and per-code limits restrict sign-in attempts; configure the trusted reverse proxy to overwrite forwarded client-IP headers.

A child's plans, completions, practice retries and final quizzes are separate from siblings and the parent's own learning. Published-course and paid-course entitlement checks still apply, using the parent's entitlement. These are private learning profiles, not public member accounts.

Reports include saved weekly plans, completed lesson steps (Explore, Play, Challenge), practice attempts and average scores, final-quiz scores/pass counts, seven-day assessment activity and recent final results. Practice averages include failed retries; weekly activity counts practice and submitted final quizzes. Planned minutes describe the timetable, not measured screen time. Pausing access retains the report.

Family endpoints: `GET/POST /family`, `PATCH /family/:id`, `POST /family/:id/code`, `GET /family/:id/report`. Session endpoints: `GET /session`, `POST /child/login`, `POST /child/logout`.

Run the family integration checks against a running local application with migrations and Basic 3 Mathematics imported:

```sh
node --env-file=packages/db/.env --env-file=apps/web/.env apps/web/scripts/test-kidi-family.mjs
```

The test creates temporary parent/child records, checks ownership, session isolation, grading, reports, reset, pause/resume and rate limiting, and removes its records in `finally`. `KIDI_TEST_ORIGIN` defaults to `http://localhost:3000`; the configured database must belong to that application. Use a development database.

## Child profile pictures

Parents can add an optional photo when creating a child or through **Profile & access settings**. Upload or replace the picture, then save the profile; removing it and saving restores the selected emoji avatar. Photos appear in the learner cards, progress profile (the current learning portfolio), and the child's header. 

Photos use the existing member image-upload flow and storage driver (local or R2). Only registered avatar images belonging to the parent can be attached. Changing the profile and its image link is transactional. Omitting `photoUrl` preserves the current photo; `null` removes it. Migration 0082 links child profiles to media assets; deleting a media asset clears its child-photo links and restores the avatar fallback. The media library's usage report includes child profiles. Child sessions cannot upload or change profile pictures.

Photo integration checks create temporary parents, children and a temporary editor account for upload cleanup through the running server, then remove their test records and images:

```sh
node --env-file=packages/db/.env --env-file=apps/web/.env --import tsx apps/web/scripts/test-kidi-photos.ts
```

Use a development database matching the running application. Checks cover real signed image uploads, create/replace/remove, ownership, rollback on invalid photo references, reports, child sessions and deleted-image fallback.
