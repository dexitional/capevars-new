# Basic 3 interactive library — historical v15 import

**Superseded:** The active library now uses v17–v22, with five Play and ten Challenge items per lesson, local course fonts and a narration pipeline. See [current library notes](kidilearn-library.md). The details below document the original v15 import only.

The source is the user-supplied `files/v15.zip`. It contains nine nested course archives covering English, Mathematics and Science for Basic 1–3. This implementation imports **only Basic 3**.

| Subject          | Lessons | Play questions | Challenge questions | Videos |
| ---------------- | ------: | -------------: | ------------------: | -----: |
| English language |      40 |            400 |               1,000 |     40 |
| Mathematics      |      39 |            390 |                 975 |     39 |
| Science          |      25 |            250 |                 625 |     25 |
| Total            |     104 |          1,040 |               2,600 |    104 |

Each subject also has a PDF and EPUB learner guide. Videos are silent 16-second, 1280×720 clips; the player explicitly labels them as silent. Original images and video stills are retained alongside the media. Source archive hashes, resource paths and counts are recorded in `kidilearn-basic3-manifest.json`.

## Source findings

- Read the JSON lesson arrays embedded in the v15 HTML, without executing any source scripts. English's standalone `course_data.json` contains older challenge questions; the embedded data contains the updated two-clue questions.
- Some source HTML retains Basic 2 browser-storage keys and hardcoded navigation limits. The native player uses the actual imported lesson count and account-owned database progress, so those old behaviours are not inherited.
- All 3,640 imported questions passed structural validation: a unique matching answer, distinct choices, a consistent answer index, field lengths, and 10 Play / 25 Challenge questions per lesson. This checks import integrity, not the educational correctness of every supplied answer.
- The source README describes independently developed materials requiring editorial/teacher review, not official NaCCA/GES endorsement. Imported course descriptions retain that distinction. No new narration or third-party font files were generated.

## Learner experience

Open `/learn/kidilearn`, choose Basic 3, and select English, Mathematics or Science. New learners default to a level with available interactive content. The plan editor also offers direct “Ready to explore” links, so a learner can preview lessons before saving a plan.

Routes:

- `/learn/kidilearn/subjects/b3/english`
- `/learn/kidilearn/subjects/b3/mathematics`
- `/learn/kidilearn/subjects/b3/science`

Each lesson has Explore (goals, video, notes, examples, practical activities), Play (10 questions with immediate feedback), and Challenge (25 questions with feedback after submission). A 70% score completes Play/Challenge; failed work can be reviewed and retried. Explore completion is an explicit learner acknowledgement, not a claim that a teacher has assessed practical work. Completed steps and subject progress are saved to the existing account. In-progress selections and activity controls are held on the current page; finish a step to save its completion.

Maths models cover number jumps, place value, fractions, multiplication arrays and clock hours. English activities build words or sentences from the actual lesson passage. Science includes living-things sorting, a water-state model for the states-of-matter lesson, and observation checklists for practical activities. These are supplementary activities, not substitutes for supervised speaking, writing or practical assessment. Imported practical safety notes are shown with the activities.

Native diagrams accompany supported question visuals. Diagram-dependent prompts also include equivalent text, so the existing randomized subject-final-quiz screen remains usable without an image. Both Play and Challenge questions feed the existing final-quiz bank. Final quiz length and target still come from the learner's saved plan.

## Import and deployment

Use Node 24, Python 3 and the existing database workspace's `DATABASE_URL`:

```sh
npm run db:migrate
npm run db:import-kidi-basic3 -w packages/db
# Optional explicit archive path:
npm run db:import-kidi-basic3 -w packages/db -- /absolute/path/to/v15.zip
```

Migration 0074 creates `kidi_lessons`, connecting each imported quest to three ordinary OpenLearn lesson records. The importer reuses courses, sections, quiz questions, enrollments and lesson progress, and activates the Basic 3 subject mappings. A dedicated inactive, passwordless `kidilearn-library` content owner prevents imported courses from being assigned to a real learner.

The import is transactional for database writes. Extraction occurs in a temporary directory; assets are copied only after existing source hashes have been checked. The same archive can be re-imported without duplicating courses/questions or resetting progress. A changed archive or conflicting course mapping causes an explicit refusal; content upgrades need a separate migration/review rather than silent replacement. There is no automatic network fetch or execution of archive HTML/Python.

Deploy `apps/web/public/kidilearn/b3/` along with the app and apply/import the database on the target environment. The original nested HTML and its answer banks are not exposed as public pages. Lesson APIs serve question prompts/options, not answer indices. Play's feedback endpoint accepts only that lesson's Play question IDs. Challenge and final scores are calculated server-side with exact answer coverage. Private progress uses the authenticated account; published/active mappings and course access are rechecked before reads and completion.

## Verification

Validation covers web/database typechecks, targeted ESLint, six grading/randomization tests, four import regression tests, all 104 lesson APIs and their 312 video/guide references, valid and invalid submissions, per-account progress, revoked access, randomized final quizzes, and a repeat import preserving IDs and progress. Browser checks cover a full Explore → Play → Challenge flow and reload, English tile building, Science sorting/state changes, and layouts from 320px through 1280px.

Run the import regression checks with `python3 -m unittest discover -s packages/db/scripts -p 'test_extract_kidi_v15.py'` from the repository root. The current local production-build check is blocked by pre-existing root-owned `.vite-temp` and `.nitro` cache directories under `apps/web/node_modules`; normal build completion has not been verified in this environment.
