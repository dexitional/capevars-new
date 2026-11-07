# Explore guides and the lesson theatre

A lesson's Explore step can be told in two ways. A **guide** explains the lesson in writing and pictures, and the **theatre** tells it as an animated, narrated lesson with questions inside it. Lessons without a guide keep their imported notes, and the theatre builds its script from those notes.

## Guides

A guide (`apps/web/src/lib/kidilearn/explore/types.ts`) has a real-life hook, an explanation, a picture, key words, worked examples that a learner thinks about before opening, common mistakes, everyday uses and a practical task. Physical lessons also have safety advice, shown before the task. Each guide names its NaCCA indicator. The guides are written for kidiLearn, with the curriculum setting the scope.

| Course | Lessons with guides | Curriculum source |
| --- | ---: | --- |
| Basic 2 Mathematics | 29 of 29 | [Mathematics Curriculum for Primary Schools, B1–B3](https://nacca.gov.gh/wp-content/uploads/2019/04/MATHS-LOWER-PRIMARY-B1-B3.pdf) |
| Basic 4 History | 20 of 20 | [History of Ghana Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/HISTORY-OF-GHANA-B1-B6-1.pdf) |
| Basic 5 History | 20 of 20 | [History of Ghana Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/HISTORY-OF-GHANA-B1-B6-1.pdf) |
| Basic 6 History | 20 of 20 | [History of Ghana Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/HISTORY-OF-GHANA-B1-B6-1.pdf) |
| Basic 5 Physical Education | 20 of 20 | [Physical Education Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/PHYSICAL-EDUCATION-B1-B6-2.pdf) |

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

Checked against the Physical Education curriculum, Basic 5:

- **Codes:** the imported lessons carry indicator codes that differ from the curriculum's own numbering; for example, “Walk on straight lines” is stored as B5.1.2.1.1, but the curriculum gives B5.1.1.1.1. One code is malformed (`B51.5.1.5`). The guides use the curriculum's codes.
- **Body types:** the curriculum names ectomorph, mesomorph and endomorph. The guide teaches the terms, but frames them as strengths that every build has, and asks learners never to label classmates.
- **Heart rate:** learners count their pulse for 15 seconds and multiply by 4, as the curriculum describes.

Checked against the History of Ghana curriculum, Basic 4:

- **Repeated lessons:** the imported course has 20 lessons but only 11 indicators. Lessons 12 to 20 repeat the indicators of 1 to 9, so each repeat takes a new angle on the topic (for example, why we study history, then your own family's history).
- **A misplaced indicator:** lesson 11, on sources about the 1948 riots, is printed as B4.5.3.1.2, but it sits in the curriculum's Basic 5 section. The guide uses B5.5.3.1.2 and teaches it at a Basic 4 level.
- **Dates:** where a date is uncertain, as with the founding of the Larabanga Mosque, the guide says “is said to”. A test checks that shared dates agree across lessons.

Checked against the History of Ghana curriculum, Basic 5:

- **Repeated lessons:** lessons 13 to 20 repeat the indicators of 1 to 8, and take a new angle on each.
- **The slave trade:** taught with care for ten-year-olds, through the humanity of the people taken, their resistance, abolition and remembrance. The lessons say “enslaved people”, and a test holds them to it.
- **People:** Ghanaians in the lessons are honoured by what they did. No picture claims to show them.

Checked against the History of Ghana curriculum, Basic 6:

- **Repeated lessons:** lessons 10 to 18 repeat the indicators of 1 to 9, and lessons 19 and 20 repeat 1 and 2 a third time. Each repeat takes a new angle.
- **Political history:** told neutrally, with dates, offices and events. Debates, such as whether military rule did any good, are presented as debates. No party or leader is praised or blamed.
- **Keeping it current:** the Fourth Republic lessons (history-07 and history-15) list governments up to January 2025. They need updating after each election, and a test checks their order.

Scope for other subjects and levels has not yet been checked.

**Errors in the sources:**

- The Mathematics curriculum's compensation example for 26 + 39 gives 26 + 40 as 76 and the answer as 75. The correct values are 66 and 65, and the guide uses them.
- The PE curriculum says the body is “made of 75% water”. A child is closer to two-thirds water, so the guide says “more than half”.
- The PE curriculum's high-jump explanation is garbled; the guide explains take-off and landing force plainly.
- The PE curriculum's “back roll” steps describe a forward roll. No guide uses them.

### Pictures

`components/kidilearn/explore-art.tsx` draws real objects from code, with light and shadow. People are drawn from joint angles in named poses, such as `kick`, `pushUp` and `liftGood`, so a new movement is a new set of angles. Pictures stay sharp at any size and add no image downloads. They are refined illustrations, not photographs. Money is drawn as plain practice notes and marked “practice”.

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
