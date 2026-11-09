# Explore guides and the lesson theatre

A lesson's Explore step can be told in two ways. A **guide** explains the lesson in writing and pictures, and the **theatre** tells it as an animated, narrated lesson with questions inside it. Lessons without a guide keep their imported notes, and the theatre builds its script from those notes.

## Guides

A guide (`apps/web/src/lib/kidilearn/explore/types.ts`) has a real-life hook, an explanation, a picture, key words, worked examples that a learner thinks about before opening, common mistakes, everyday uses and a practical task. Physical lessons also have safety advice, shown before the task. Each guide names its NaCCA indicator. The guides are written for kidiLearn, with the curriculum setting the scope.

| Course | Lessons with guides | Curriculum source |
| --- | ---: | --- |
| Basic 1 Mathematics | 24 of 24 | [Mathematics Curriculum for Primary Schools, B1–B3](https://nacca.gov.gh/wp-content/uploads/2019/04/MATHS-LOWER-PRIMARY-B1-B3.pdf) |
| Basic 2 Mathematics | 29 of 29 | [Mathematics Curriculum for Primary Schools, B1–B3](https://nacca.gov.gh/wp-content/uploads/2019/04/MATHS-LOWER-PRIMARY-B1-B3.pdf) |
| Basic 3 Mathematics | 39 of 39 | [Mathematics Curriculum for Primary Schools, B1–B3](https://nacca.gov.gh/wp-content/uploads/2019/04/MATHS-LOWER-PRIMARY-B1-B3.pdf) |
| Basic 4 Mathematics | 41 of 41 | [Mathematics Curriculum for Primary Schools, B4–B6](https://nacca.gov.gh/wp-content/uploads/2019/04/MATHS-UPPER-PRIMARY-B4-B6.pdf) |
| Basic 5 Mathematics | 54 of 54 | [Mathematics Curriculum for Primary Schools, B4–B6](https://nacca.gov.gh/wp-content/uploads/2019/04/MATHS-UPPER-PRIMARY-B4-B6.pdf) |
| Basic 6 Mathematics | 48 of 48 | [Mathematics Curriculum for Primary Schools, B4–B6](https://nacca.gov.gh/wp-content/uploads/2019/04/MATHS-UPPER-PRIMARY-B4-B6.pdf) |
| Basic 1 History | 20 of 20 | [History of Ghana Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/HISTORY-OF-GHANA-B1-B6-1.pdf) |
| Basic 2 History | 20 of 20 | [History of Ghana Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/HISTORY-OF-GHANA-B1-B6-1.pdf) |
| Basic 3 History | 20 of 20 | [History of Ghana Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/HISTORY-OF-GHANA-B1-B6-1.pdf) |
| Basic 4 History | 20 of 20 | [History of Ghana Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/HISTORY-OF-GHANA-B1-B6-1.pdf) |
| Basic 5 History | 20 of 20 | [History of Ghana Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/HISTORY-OF-GHANA-B1-B6-1.pdf) |
| Basic 6 History | 20 of 20 | [History of Ghana Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/HISTORY-OF-GHANA-B1-B6-1.pdf) |
| Basic 1 Physical Education | 20 of 20 | [Physical Education Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/PHYSICAL-EDUCATION-B1-B6-2.pdf) |
| Basic 2 Physical Education | 20 of 20 | [Physical Education Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/PHYSICAL-EDUCATION-B1-B6-2.pdf) |
| Basic 3 Physical Education | 20 of 20 | [Physical Education Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/PHYSICAL-EDUCATION-B1-B6-2.pdf) |
| Basic 4 Physical Education | 20 of 20 | [Physical Education Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/PHYSICAL-EDUCATION-B1-B6-2.pdf) |
| Basic 5 Physical Education | 20 of 20 | [Physical Education Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/PHYSICAL-EDUCATION-B1-B6-2.pdf) |
| Basic 6 Physical Education | 20 of 20 | [Physical Education Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/PHYSICAL-EDUCATION-B1-B6-2.pdf) |
| Basic 1 Religious and Moral Education | 9 of 9 | [Religious and Moral Education Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/RELIGIOUS-AND-MORAL-EDUCATION-B1-B6-1.pdf) |
| Basic 2 Religious and Moral Education | 13 of 13 | [Religious and Moral Education Curriculum for Primary Schools, B1–B6](https://curriculumresources.edu.gh/basic/wp-content/uploads/2026/05/RELIGIOUS-AND-MORAL-EDUCATION-B1-B6-1.pdf) |

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
- **Basic 1:** counting and comparing go to 100, but adding and subtracting stay within 20, which a test checks. Coins are 1, 5, 10, 20 and 50 pesewas and one cedi. Patterns have 2 to 4 repeating parts. Data has up to three categories.
- **Basic 3:** counting and place value go to 10,000, while adding and subtracting stay within 1,000. Multiplication goes up to 5 × 5, which a test checks, with the chart to 9 × 9. Fractions are now written in symbols as well as words. Negative numbers go down to −10.
- **Basic 4:** numbers go to 100,000, with rounding to the nearest 10, 100 and 1000. Roman numerals go to XXX. Factors go to 50, and multiplication facts to 12 × 12; a test checks that every written product has a factor of 12 or less, or a multiple of ten. Division is by one-digit numbers. Decimals go to hundredths, and percent is introduced as hundredths. Area is in cm² and m², and time includes the 24-hour clock.
- **Basic 5:** numbers go to 1,000,000, and Roman numerals to C. Factors and primes go to 100, with the HCF found by prime factorisation. Division is still by one-digit numbers, which a test checks. Fractions are added, subtracted and multiplied by whole numbers. Decimals go to thousandths. Algebra begins with letters for unknowns and simple expressions such as 3 × n + 2. Volume is counted in cubes, angles are measured with a protractor, and probability is described as impossible, possible or certain.
- **Basic 6:** numbers are read to 1,000,000,000, and multiplication facts go to 12 × 12. Integers are added, subtracted and multiplied by whole numbers. Ratio and proportion are new, written with spaces (2 : 3) so that narration reads “2 to 3”. Algebra covers expressions, like terms and substitution. Prisms, nets, the eight compass directions, translations, line graphs, surveys and probability as a fraction complete the year.
- **Basic 4 to 6 lessons have no codes:** the imported lessons carry no indicator codes, and in Basic 4 each title joins two topics. Each guide names the indicator its lesson mainly teaches.
- **Basic 2 numbers:** counting and place value go to 1000, and comparing goes to 100.
- **Basic 2 money:** coins and notes up to at least 50 Ghana cedis.
- **Basic 2 measuring:** non-standard units. Standard units are met only as a need.
- **Basic 2 data:** tallies and pictographs with up to 3 categories.

Checked against the Physical Education curriculum, Basic 5:

- **Codes:** the imported lessons carry indicator codes that differ from the curriculum's own numbering; for example, “Walk on straight lines” is stored as B5.1.2.1.1, but the curriculum gives B5.1.1.1.1. One code is malformed (`B51.5.1.5`). The guides use the curriculum's codes.
- **Body types:** the curriculum names ectomorph, mesomorph and endomorph. The guide teaches the terms, but frames them as strengths that every build has, and asks learners never to label classmates.
- **Heart rate:** learners count their pulse for 15 seconds and multiply by 4, as the curriculum describes.

Checked against the History of Ghana curriculum, Basic 1 and 2:

- **Written for six- and seven-year-olds:** sentences of about 20 words or fewer, which a test checks.
- **Heavy repetition:** Basic 2 has only four indicators across 20 lessons, so each topic is taught five times, from five angles. For example, historical places are covered as an overview, then the Komfo Anokye sword, Assin Manso, the Gbewaa Palace, and finally a place in the learner’s own community.
- **Presidents:** Basic 1 names every President since 1960, in order, up to John Dramani Mahama’s return in 2025. A test checks the order. This needs updating after each election, as do the Basic 6 lessons. No picture claims to show a President.
- **Assin Manso:** explained gently, as a place where people remember and honour those taken away.

Checked against the History of Ghana curriculum, Basic 3:

- **Written for eight-year-olds:** short sentences, which a test checks.
- **Repeated lessons:** most indicators appear three times, and each repeat takes a new angle.
- **A malformed code:** three lessons carry “B32.2.1.1”; the guides use B3.2.2.1.1.
- **Origins:** where each people came from is told as what its traditions say, since historians still study these accounts.
- **Entrepreneurs:** the curriculum names seven. Only Esther Ocloo and George Grant, whose stories are well documented, are described in detail; the others are named as the curriculum names them.

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

Checked against the Religious and Moral Education curriculum:

- **Three religions, side by side:** the curriculum aims at understanding and tolerance of the three major religions in Ghana (Christianity, Islam and African Traditional Religion) and says lessons must not become "preaching sessions". The guides describe each faith in its own terms ("Christians believe…", "Muslims believe…"), never call one true, and a test checks that lessons about religion cover all three.
- **No pictures of God or prophets:** places of worship are shown by their buildings and symbols (cross, crescent, clay pot). Sacred texts such as the Lord's Prayer, Psalm 23 and Al-Fātiḥah are named, not quoted, so the narrator never recites them.
- **Founders:** African Traditional Religion has no single founder, so the guide says so rather than give it a birth story; Akan traditions about the priest Okomfo Anokye are told as traditions.
- **Traditional leaders (Basic 2):** the curriculum names Okomfo Anokye, Toha Zie and Egya Ahor. The guides tell of Okomfo Anokye and Egya Ahor as traditions, and leave out Toha Zie because we found no account reliable enough to tell children.
- **Damba:** the curriculum lists it as a traditional festival; it marks the birth of the Prophet Muhammad with Dagomba traditions, and the guide says so.

Scope for other subjects and levels has not yet been checked.

**Errors in the sources:**

- The Basic 3 Mathematics compensation example for 48 − 19 gives 48 − 20 as 18 and the answer as 19. The correct values are 28 and 29.
- The Mathematics curriculum's compensation example for 26 + 39 gives 26 + 40 as 76 and the answer as 75. The correct values are 66 and 65, and the guide uses them.
- The Mathematics curriculum's Basic 4 rounding table gives 14,765 to the nearest ten as 14,970. The correct value is 14,770, and the guide uses it.
- The Basic 5 Mathematics curriculum counts on in 500s from 15,290 as 15,790, 16,290, 17,290, missing 16,790. It gives 1 m³ as 100 cm × 100 cm × 10 cm (it is 100 cm on every side) and lists a 2 cm × 2 cm × 6 cm box among those holding 12 cubes (it holds 24). The guides use the correct values.
- The Basic 5 Mathematics curriculum misprints some indicator codes: B5.1.2.1.1 appears twice (the second is multiplication, B5.1.2.2.1), the volume indicator is printed B5.3.3.2.2 between B5.3.2.2.1 and B5.3.2.2.3, and decimal rounding is printed “B5.1. 4.1.3”. The guides use the codes that fit the sequence.
- The Basic 6 Mathematics curriculum gives the HCF of 18, 24 and 30 as 2 × 3 = 4; it is 6. One example asks for 4 2/5 × 5 but works out 4 4/5 × 5. The guides use correct values.
- The Basic 6 Mathematics curriculum misprints several codes. The integer indicators under B6.1.2.6 are printed B6.1.1.6.1, B6.1.2.6.2 and B6.1.1.4.3; the guides use B6.1.2.6.1 to .3. The transformation standard is printed with the compass standard's code, B6.3.3.5; the guides number it B6.3.3.6. The questionnaire indicator is printed B6.5.2.2 (the guides use B6.4.1.2.2), and the last probability indicator P6.4.2.2.3 (the guides use B6.4.2.2.3).
- The PE curriculum says the body is “made of 75% water”. A child is closer to two-thirds water, so the guide says “more than half”.
- The PE curriculum's high-jump explanation is garbled; the guide explains take-off and landing force plainly.
- The PE curriculum's “back roll” steps describe a forward roll. No guide uses them.
- The Basic 4 PE curriculum says push-ups strengthen the biceps and chin-ups the triceps. It is the other way round (push-ups: triceps and chest; chin-ups: biceps and back); the guide is correct and a test holds it. Its codes are misprinted in places: “B4.1.2.1.1sa0” is B4.1.2.1.10, and the drug indicator printed B4.5.5.4.1 sits in strand 4 (B4.4.5.4.1).
- The Basic 1 PE curriculum misprints two codes: sit and reach (B1.3.3.4.1, given as B1.3.3.3.1) and human body parts (B1.3.4.5.1, given as B1.3.5.3.1). Lesson 3's balancing in shapes has no Basic 1 indicator, so it is linked to B1.2.5.2.1, the base of support of balanced objects. The curriculum says push-ups use the "biceps and triceps"; the guide says they make the arms and chest strong and starts children on their knees, which a test checks.
- The Basic 2 PE curriculum names "five major components of physical fitness" but lists four, leaving out flexibility; the guide names all five, which a test checks. Its body-parts exemplar says "apart from deformity"; the guide drops the word and teaches respect for every body. The first fitness indicator is missing (only the standard, "B 2.3.1.3.1", is printed), so lesson 13 teaches a simple fitness check under that code, and "B2.5.4.1" is given as B2.5.4.5.1. Drug awareness for six- and seven-year-olds stays with medicines from a trusted grown-up, and saying no and telling one.
- The Basic 3 PE curriculum lists running among uneven-beat movements; running has an even beat (galloping, sliding and skipping are uneven). It suggests solving problems by embracing after activity; the guide teaches stop, talk, listen and agree, with a handshake only if both wish. Body composition is taught without numbers or weighing, which a test holds. Lesson 18 repeats lesson 15's topic under a code that does not exist, so it shares B3.3.5.3.1 and teaches healthy habits.
- The Basic 4 PE lessons include a tripod balance, which is in the curriculum's glossary but has no Basic 4 indicator. The guide links it to B4.1.2.1.2 (balance) and teaches it only on a mat with a teacher, knees resting on elbows, never kicking up.
- The Basic 6 PE lessons carry malformed codes (such as B61.5.1.6), and lesson 18 (id 1337) was imported with its title cut to “With”, from “Discuss with learners the effects of drug addiction”. The guides use the curriculum's codes. The supplied source data cuts most PE titles at about 65 characters, often mid-phrase, or runs exemplar text into them. Fixes live in `packages/db/scripts/kidi-source-corrections.json`: `extract-kidi-source.py` applies them on every import, and `fix-kidi-source.ts` applies them to lessons already in the database (dry run unless `--apply`). Each fix replaces an exact old value only.
- The Basic 6 PE curriculum lists the effects of drug addiction as “madness, uneasiness, death”. The guide describes harm to the body and mind without stigmatising words, says that people with an addiction need help, not mockery, and a test keeps the word out. Sit-ups are taught with bent knees and no pulling on the neck.

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
