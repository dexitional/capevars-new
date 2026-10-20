# New primary course libraries

The nine archives supplied in `files/new/` provide **16 distinct courses and 348 lessons**. Combined with the existing library, kidiLearn has **30 courses and 907 lessons**.

| Subject | Levels | New lessons |
| --- | --- | ---: |
| Computing | Basic 1–6 | 141 |
| Creative Arts | Basic 1–6 | 120 |
| Our World & Our People | Basic 3–6 | 87 |

`extract-kidi-new.py` reads source JSON as data. It prefers complete libraries and checks that standalone duplicates agree before importing them once. Computing B3/B4, Creative Arts B3 and OWOP B4 standalone copies match their library copies. The OWOP B4–B6 production starter contains planning files, not learner lessons, and is deliberately excluded. No course is inferred for a missing level.

The new course paths use internal release `v1`; this is a kidiLearn release identifier, not a claim that the supplied archives were named version 1. Archive hashes, source paths, duplicate names, course directories and counts are recorded in `kidilearn-library-manifest.json`. `kidilearn-new-content.json` is build input containing assessment answer keys; it belongs in `docs/`, never in `public/`.

## Learner experience

Each new lesson has four illustrated explanation steps, readable text outside the images, an original illustration that can be expanded, a video, word cards, a practical checklist, and a short reflection prompt. New diagrams use the existing self-hosted Fredoka and Sour Gummy fonts; original images, PDFs, EPUBs and silent videos remain available unchanged.

Interactive activities are selected from the lesson topic:

- Computing: a robot instruction trail with boundary feedback; typing and formatting; file naming, moving, bin and restore; survey counts, bar charts and upper-primary averages; concept matching.
- Creative Arts: repeating motifs, colour planning with a simplified paint model, an eight-beat rhythm sequencer with tempo and rests, composition blocks with undo, and three-part performance planning.
- OWOP: imaginary neighbourhood maps with cardinal directions, a simplified plant-care model, and concept matching grounded in the supplied lesson.

Activities work with buttons, native form controls and keyboard input. No dragging is required. Rhythm audio starts only after Play, can be stopped, and is closed when leaving the activity. There is no autoplay. Images and captions have accompanying readable text. Simulations identify themselves as examples where needed: the map is imaginary; paint pigments and real plants vary.

Practice creations, notes and checkboxes are session-local and reset when leaving the activity; the UI states this. “Save Explore & start Play” records lesson progress. Existing server-graded practice and randomized subject finals feed the child's learning profile and parent report. Physical art, performance and practical skills still need observation by a parent or teacher; a multiple-choice score does not assess the finished work.

## Rebuild and import

Use Node 24 and the project's configured database. From the repository root:

```sh
npm run db:import-kidi -w packages/db -- --check
npm run db:import-kidi -w packages/db -- --update
.cache/kidi-media/venv/bin/python packages/db/scripts/build-kidi-new-media.py
.cache/kidi-media/venv/bin/python packages/db/scripts/render-kidi-narration.py \
  --scripts docs/kidilearn-new-narration-scripts.json --workers 4
.cache/kidi-media/venv/bin/python packages/db/scripts/verify-kidi-media.py \
  --scripts docs/kidilearn-new-narration-scripts.json \
  --report .cache/kidi-media/new-verification.json
```

The media environment requires the packages in `packages/db/scripts/kidi-media-requirements.txt` (including Pillow), the local Kokoro model and voice assets described in [the library guide](kidilearn-library.md). `build-kidi-new-media.py` draws 1,392 scene PNGs and writes the narration script. Speech reads the same explanation shown on each panel. Caption timing uses scene boundaries and approximate word timing, not forced word alignment.

The four-scene videos use the local British English `bf_emma` AI voice at 0.95 speed, H.264/AAC, fast-start playback and loudness normalization. Audio is embedded in the video; captions, transcript navigation and playback speed work in the existing player. Render fingerprints include the artwork bytes, source video, text, model and voice settings. A finished sidecar is published last, so incomplete renders are not selected. Re-running the command resumes safely; existing original-course narration is prepared separately.

Copy the complete `apps/web/public/kidilearn/` tree when deploying. Preserve older media still referenced by records. Do not deploy `.cache/` or build-input answer keys.

## Content scope

The supplied Computing Basic 1–3 materials identify themselves as supplementary foundations. Computing Basic 4–6 adapts published indicators. OWOP Basic 4–6 covers selected topics and does not claim exhaustive indicator alignment. The Creative Arts packs are practical learning sequences. The implementation retains the supplied level assignments, lesson titles, goals, contexts and question banks; structural validation is not a full pedagogical or factual audit.

Useful curriculum references for teacher review: [NaCCA Computing B4–B6](https://nacca.gov.gh/wp-content/uploads/2019/04/COMPUTING-B4-B6.pdf), [Creative Arts B1–B3](https://nacca.gov.gh/wp-content/uploads/2019/06/CREATIVE-ARTS-B1-B3.pdf), and [Creative Arts B4–B6](https://nacca.gov.gh/wp-content/uploads/2019/06/CREATIVE-ARTS-B4-B6-.pdf). Imported materials are independently developed resources, not NaCCA/GES endorsement. The new media illustrates the supplied explanations; names, pronunciation and curriculum coverage should receive classroom review.

## Validation

```sh
python3 -m unittest discover -s packages/db/scripts -p 'test_*.py'
npm run typecheck -w apps/web
npm run typecheck -w packages/db
node --env-file=packages/db/.env --env-file=apps/web/.env apps/web/scripts/test-kidi-content.mjs
node --env-file=packages/db/.env --env-file=apps/web/.env apps/web/scripts/test-kidi-family.mjs
```

The content integration check creates and removes its own learner. It checks all 348 new lessons and assets, answer-key exclusion, plans, practice grading, subject finals and progress. Import validation checks 5 Play and 10 distinct Challenge prompts per lesson, conflicting duplicate sources, traversal prevention and starter exclusion. Pre/post-import snapshots verified that all earlier lesson identities, study plans, completion records and final-attempt snapshots survived the expansion.

The expansion passed 484 content API checks, including child-mode grading and parent-report totals, plus the 60-check family regression suite. The 12 activity variants passed 81 browser interaction/layout checks at 320, 375, 768 and 1280 pixels. Browser video checks across all three new subjects verified 1280×720 playback, decoded audio, loaded captions, speed changes and scene seeking. Web/database typechecks, focused lint and 21 Python import/narration tests passed. A repeated subset import left all content and learning records unchanged and retained the full 30-course manifest.

All **348/348 new narrated videos** passed full audio decoding, finite/non-silent sample checks, no clipping, duration checks, exact transcript matching and caption-boundary validation. The new videos contain 165.3 minutes of narrated explanation. The machine-readable local report is `.cache/kidi-media/new-verification.json`. Together with the previously verified 559 videos, all 907 lessons now have narrated playback.
