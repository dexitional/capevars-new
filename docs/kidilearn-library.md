# kidiLearn course library

The library includes v17 (updated Basic 1–3), v18–v20 (Mathematics Basic 4–6), v21–v22 (English Basic 4–5), and the supplied Computing, Creative Arts, Our World & Our People, Ghanaian languages, RME, History, Physical Education and French archives. The original Basic 3 import is upgraded in place.

| Level | English | Mathematics | Science | Computing | Creative Arts | OWOP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Basic 1 | 37 | 24 | 29 | 15 | 20 | — |
| Basic 2 | 34 | 29 | 25 | 15 | 20 | — |
| Basic 3 | 40 | 39 | 25 | 15 | 20 | 27 |
| Basic 4 | 67 | 41 | — | 27 | 20 | 20 |
| Basic 5 | 67 | 54 | — | 34 | 20 | 20 |
| Basic 6 | — | 48 | — | 35 | 20 | 20 |

The table above accounts for the original **30 courses and 907 lessons**. The repaired language/RME/History/PE/French libraries add **42 courses and 653 lessons**, bringing the installed library to **72 courses, 1,560 lessons, 7,800 Play questions and 15,600 Challenge questions**. See [source-content repair notes](kidilearn-source-repair.md) for the additional subject counts and verification. Each lesson has five Play and ten Challenge questions. Subject final quizzes sample only Challenge items. Basic 1 Mathematics includes nine action-based game types. Number models scale to the selected level, up to one million for Basic 5–6.

The new packs add 16 courses and 348 lessons: Computing (141), Creative Arts (120) and OWOP (87). See [new content and media workflow](kidilearn-new-courses.md) for provenance, visual explainers, practical activities and narration commands.

## Import and upgrades

Use Node 24 and Python 3, with the existing database configuration:

```sh
npm run db:migrate
npm run db:import-kidi -w packages/db -- --check
npm run db:import-kidi -w packages/db -- --update
```

The importer defaults to the six supplied versioned archives in `files/` plus ZIPs in `files/new/`. Explicit archive paths can also be supplied. Subset imports merge the manifest without dropping existing courses. It parses embedded JSON without running bundled JavaScript. The unfinished Basic 4 draft in v17 is excluded in favour of v18. It validates all courses before changing the database, rejects incompatible lesson identities and downgrade attempts, and requires `--update` for changed releases. Identical archives are idempotent.

Existing course/lesson IDs, enrolments, saved completion, study plans and final-attempt snapshots survive updates. Unchanged question banks retain their IDs; changed banks receive new IDs to reject stale in-page submissions. Final attempts keep their original snapshots. Course publication, price and inactive mappings are preserved. Migration 0075 records release provenance. `kidilearn-library-manifest.json` records source fingerprints, archive provenance and counts. Source-multimedia v2 fingerprints include the parser revision, lesson data and all asset hashes, so bundled and standalone copies are equivalent.

Copy the complete `apps/web/public/kidilearn/` directory when deploying, including earlier release assets still referenced by saved records. Original PDFs/EPUBs are retained; their older assessment counts may differ from the updated interactive bank. Imported materials are independently developed resources, not a claim of NaCCA/GES endorsement. Structural checks do not replace subject-teacher review.

## Original interactive fonts

Fredoka is used for body text and controls, with regular questions and medium answer choices. Fredericka the Great is used for h1/h2 at its original regular weight; Google Fonts Sour Gummy is used for h3/h4 at medium weight. All three are self-hosted, scoped to kidiLearn and include their OFL licences under `public/kidilearn/fonts/`. Learners need no Google Fonts connection. The files come from the [Google Fonts repository](https://github.com/google/fonts).

The supplied MP4s already contain rasterized lettering, sometimes fallback fonts as documented in the source notices. Retiming/narration preserves those original video pixels; changing typography inside those videos would require a separate visual re-render.

## Narrated videos

The original 559 supplied MP4s are silent. `prepare-kidi-narration.py` extracts the supplied scene scripts into `kidilearn-narration-scripts.json`; Basic 4 Mathematics uses its matching summary, first Play example and first Challenge example. Symbols are expanded for speech. Source questions and answers are retained.

`render-kidi-narration.py` uses the local [Kokoro ONNX runtime](https://github.com/thewh1teagle/kokoro-onnx) and [Kokoro 82M model](https://huggingface.co/hexgrad/Kokoro-82M), with the British English `bf_emma` voice at 0.95 speed. This is AI-generated speech, labelled in the player; it is not a Ghanaian-accent voice. No speech API key or runtime speech service is needed.

Rendering requires Python 3.12 and a local environment outside application dependencies:

```sh
python3.12 -m venv .cache/kidi-media/venv
.cache/kidi-media/venv/bin/pip install -r packages/db/scripts/kidi-media-requirements.txt
# Download the model and voices from the upstream model-files-v1.0 release:
# https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
# Save kokoro-v1.0.onnx and voices-v1.0.bin under .cache/kidi-media/.
python3 packages/db/scripts/prepare-kidi-narration.py
.cache/kidi-media/venv/bin/python packages/db/scripts/render-kidi-narration.py --level b3
.cache/kidi-media/venv/bin/python packages/db/scripts/render-kidi-narration.py
```

The renderer preserves originals and publishes a fingerprinted MP4, VTT captions and a `.narration.json` sidecar beside each video. Sidecars appear only after rendering completes. Speech WAVs are cached by text, voice, speed and model fingerprint. Identical completed renders are skipped; failed runs can be resumed. Keep `.cache/` out of deployment.

Scenes are extended to fit narration with brief pauses; speech is not accelerated to fit the original 3–4 seconds. Output is H.264/AAC with web fast-start, normalized to a target of −18 LUFS and −1.5 dB true peak. Captions use exact scene boundaries with approximate word-proportional timing within each scene. Transcripts and scene buttons use the generated timings, including after seeking. Native controls handle mute, volume, pause and playback speed with audio embedded in the video, avoiding separate-track drift.

For an unfinished or unavailable sidecar, the player labels and plays the original silent clip. To roll back narration, remove its sidecar; original video paths and database content are unchanged. Source scripts and pronunciations should receive classroom review, especially names, phonics and mathematical notation.

## Checks

```sh
python3 -m unittest discover -s packages/db/scripts -p 'test_*kidi*.py'
npm run typecheck -w apps/web
npm run typecheck -w packages/db
cd apps/web
node --import tsx --test src/server/api/modules/kidilearn/quiz.test.ts
npm run lint -- src/components/kidilearn src/lib/kidilearn src/server/api/modules/kidilearn
```

Integration checks cover course counts, resource availability, answer-key exclusion, action games, stale question submissions and preservation of pre-upgrade progress/attempts. Browser checks cover mobile widths, all nine action types, upper-primary courses and redirection from the generic OpenLearn player.

All 559 narrated outputs passed full AAC decoding, non-silent/finite sample checks, clipping and duration checks, and caption/scene-boundary validation. To repeat: `.cache/kidi-media/venv/bin/python packages/db/scripts/verify-kidi-media.py`.
