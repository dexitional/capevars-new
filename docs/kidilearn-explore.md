# Explore guides and the lesson theatre

A lesson's Explore step can be told in two ways. A **guide** explains the lesson in writing and pictures, and the **theatre** tells it as an animated, narrated lesson with questions inside it. Lessons without a guide keep their imported notes, and the theatre builds its script from those notes.

## Guides

A guide (`apps/web/src/lib/kidilearn/explore/types.ts`) has a real-life hook, an explanation, a picture, key words, worked examples that a learner thinks about before opening, common mistakes, everyday uses and a practical task. Each one names its NaCCA indicator.

| Course | Lessons with guides | Curriculum source |
| --- | ---: | --- |
| Basic 2 Mathematics | 29 of 29 | [Mathematics Curriculum for Primary Schools, B1–B3](https://nacca.gov.gh/wp-content/uploads/2019/04/MATHS-LOWER-PRIMARY-B1-B3.pdf) |

The other courses still use their imported notes.

### Adding a course

1. Read the level's indicators in the NaCCA curriculum for that subject. Scope comes from the document, not from memory.
2. Add `explore/<level>-<subject>.ts`, keyed by each lesson's `content.key`, and register it in `explore/index.ts`.
3. Copy the checks in `b2-mathematics.test.ts`. They confirm coverage, the parts of each guide, and that every written sum is true.
4. Review the pictures together, as a contact sheet. Automated checks cannot tell that a scale tips the wrong way.
5. Have a teacher review the wording before release.

### Level scope

Checked against the Mathematics curriculum:

- **Fractions:** Basic 1 and 2 use words and pictures only; the curriculum says “exclude notation”. Writing fractions begins in Basic 3. Boards at these levels pass `inWords` so that the theatre hides fraction symbols.
- **Basic 2 numbers:** counting and place value go to 1000, and comparing goes to 100.
- **Basic 2 money:** coins and notes up to at least 50 Ghana cedis.
- **Basic 2 measuring:** non-standard units. Standard units are met only as a need.
- **Basic 2 data:** tallies and pictographs with up to 3 categories.

Scope for other subjects and levels has not yet been checked.

**A misprint in the source:** the curriculum's compensation example for 26 + 39 gives 26 + 40 as 76 and the answer as 75. The correct values are 66 and 65, and the guide uses them.

### Pictures

`components/kidilearn/explore-art.tsx` draws real objects from code, with light and shadow. Pictures stay sharp at any size and add no image downloads. They are refined illustrations, not photographs. Money is drawn as plain practice notes and marked “practice”.

## The theatre

`lib/kidilearn/boards.ts` holds scripts written by hand. `lib/kidilearn/board-builder.ts` builds the rest: from a guide when one exists, or else from the lesson's notes. Questions come from the Play bank and are marked by the server through `POST /lessons/:id/check`.

An English voice must not read a language being taught. French lines are read by a French voice. Ghanaian phrases stay on the screen, and learners are asked to hear them from a speaker.

To check every lesson's script, without writing anything:

```sh
cd apps/web && npx tsx scripts/export-theatre-narration.ts --check
```

### Recorded narration

This needs the media environment described in [the library guide](kidilearn-library.md#narrated-videos).

```sh
(cd apps/web && npx tsx scripts/export-theatre-narration.ts)
.cache/kidi-media/venv/bin/python packages/db/scripts/render-kidi-theatre.py --only b2/mathematics
```

Leave out `--only` to render everything. A pilot of 659 lines took about 7 minutes with 4 workers and wrote 9.3 MB. At that rate, the whole library of about 14,400 lines would take about 2.5 hours and about 200 MB.

Each different line is one clip, shared across lessons. A lesson's manifest is published last, so the player has either a whole recorded lesson or the device's voice. To roll a lesson back, remove its manifest. Speech is AI-generated and labelled in the player. Names, phonics and French should receive classroom review.
