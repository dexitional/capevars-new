# Language, RME, History, PE and French source repair

The October 2026 repair restores these supplied libraries, including their nested ZIPs:

- `Ghanaian_Language_Ga_Basic_1-6_Library.zip`
- `Ghanaian_Language_Mfantse_Basic_1-6_Library.zip`
- `RME_and_Ghanaian_Languages_Basic_1-6_Multimedia_Library.zip`
- `NaCCA_History_Physical_Education_French_Basic_1-6_Complete_Library.zip`

| Subject | B1 | B2 | B3 | B4 | B5 | B6 | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Ga | 12 | 12 | 12 | 12 | 12 | 12 | 72 |
| Mfantse | 12 | 12 | 12 | 12 | 12 | 12 | 72 |
| Twi | 12 | 12 | 12 | 12 | 12 | 12 | 72 |
| Religious & moral education | 9 | 13 | 15 | 12 | 15 | 13 | 77 |
| History | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| Physical education | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| French | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| Total | 105 | 109 | 111 | 108 | 111 | 109 | 653 |

## What was repaired

The previous parser read only short statements, omitted teaching fields, invented missing enhanced-image paths, lost illustration stages, and mapped all Ghanaian languages to the same course key. The separate source parser now retains every non-question lesson field and validates every referenced asset. It reads nested bundles and standalone packages, deduplicates identical copies, and rejects conflicting data or media. It never executes archive scripts or publishes their HTML/answer-key files.

The learner view displays full explanations, materials/resources, the three supplied activity steps and illustrations, translations, reflections, expected work/evidence, extension activities, safety and parent/teacher assessment notes. Phrase cards support meaning reveal and written-copy practice; pronunciation remains a supervised activity. Practice checkboxes are local to the visit; the existing Explore completion and scored Play/Challenge controls save progress.

Ga and Mfantse use `ghanaian_ga` and `ghanaian_mfantse`. Existing Twi keeps `ghanaian` to preserve saved plans and attempts, with an explicit Twi display label. French is selectable from Basic 1 through Basic 6. Source PDFs and EPUBs are retained. Original embedded image/video typography and the existing kidiLearn font styles are preserved.

Version 2 is the **import format revision**, not a claimed publisher release. Its media lives under `/kidilearn/{level}/{subject}/v2/`. The source manifest records the archive chain, archive SHA-256, content fingerprint and individual asset hashes. Full normalized data is in `kidilearn-source-content.json`; this private documentation includes quiz answers and must not be copied into the public assets directory.

## Audio and source limitations

All 293 Ghanaian language and RME videos contain the supplied English guide audio. All 360 History, PE and French clips are silent demonstrations. The player uses the original video directly and labels its actual audio mode; English guidance scripts are readable alongside the clip. No nonexistent narration sidecar is requested for these sources.

The Ghanaian language sources explicitly provide English guidance rather than native-language pronunciation recordings. Their own scope describes supplementary starter phrases, not complete indicator coverage. Some source titles are truncated and some RME topic/body combinations need editorial review. The repair preserves supplied wording and curriculum references rather than inventing missing subject knowledge. Teacher review remains appropriate before treating these packages as exhaustive curriculum coverage.

## Import and verification

Run from the repository root with Node 24, Python 3 and the database environment configured:

```sh
node --env-file=packages/db/.env --import tsx packages/db/scripts/import-kidi-packages.ts --check \
  files/new/Ghanaian_Language_Ga_Basic_1-6_Library.zip \
  files/new/Ghanaian_Language_Mfantse_Basic_1-6_Library.zip \
  files/new/RME_and_Ghanaian_Languages_Basic_1-6_Multimedia_Library.zip \
  files/new/NaCCA_History_Physical_Education_French_Basic_1-6_Complete_Library.zip
# Replace --check with --update to apply the validated repair.
python3 -m unittest discover -s packages/db/scripts -p 'test_*.py'
node --env-file=packages/db/.env --env-file=apps/web/.env apps/web/scripts/test-kidi-source-content.mjs
```

The API test creates and removes its own test parent/child. It checks all 653 lessons and their quiz prompts/options, all 2,110 original asset hashes, child plans, Explore/Play/Challenge completion, randomized final quizzes and parent reports for all seven subjects. It needs the local app running; `KIDI_TEST_ORIGIN` can override `http://localhost:3000`.

The applied repair preserved all 509 existing affected lesson identities, all 21,240 pre-existing quiz questions and every existing learner record; 144 Ga/Mfantse lessons were added. The earlier 907 lessons were unchanged. Every copied video was probed to verify its audio mode and 15-second duration. Web/database typechecks and targeted lint passed. Mobile browser checks cover source illustrations, steps, phrase practice, video playback and viewport fit.

Default import preflight also passes for all archives currently present: 62 courses/1,332 lessons. Ten previously imported Computing/OWOP course archives are no longer in `files/new`; subset imports retain their existing database records and public assets, leaving the installed total at 72 courses/1,560 lessons.
