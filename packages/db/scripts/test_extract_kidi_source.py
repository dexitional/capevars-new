import contextlib
import copy
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('source_courses', Path(__file__).with_name('extract-kidi-source.py'))
source = importlib.util.module_from_spec(spec)
spec.loader.exec_module(source)


def lesson():
    return dict(id=1, title='Good morning', grade=3, lang='Ga', kind='Ghanaian Language',
                statement='Greet a friend.', body='Read the phrase with a qualified speaker.',
                materials='A phrase card', action='Practise with a partner.', reflection='When would you use this?',
                steps=['Look at the phrase.', 'Read the phrase.', 'Match the phrase.'],
                narration='Listen to your teacher.', local_example='Ojekoo', translation='Good morning',
                safety='Respect your partner.', source='Independent practice edition',
                questions=[dict(mode=mode, prompt=f'{mode} question {i}', options=['Yes', 'No'], answer=i % 2,
                                explanation=f'Explanation {i}') for mode, count in [('Play', 5), ('Challenge', 10)] for i in range(count)])


def package(row, missing=False, image=b'original-image'):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w') as z:
        z.writestr('Basic_3/lesson_data_with_answers.json', json.dumps(dict(scope='Starter phrases', lessons=[row])))
        for name, data in [('videos/lesson_1.mp4', b'original-video'), ('illustrations/lesson_1.png', image),
                           ('Workbook.pdf', b'pdf'), ('eBook.epub', b'epub')]:
            if not (missing and name.endswith('.png')):
                z.writestr('Basic_3/'+name, data)
        z.writestr('Basic_3/Offline.html', '<script>notExecuted()</script>')
    return buf.getvalue()


class SourceCourseTests(unittest.TestCase):
    def test_nested_library_preserves_fields_media_and_language_identity(self):
        with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
            root = Path(tmp)
            library = root/'Ghanaian_Language_Ga_Basic_1-6_Library.zip'
            single = root/'Ghanaian_Language_Ga_Basic_3_Complete_Multimedia_Package.zip'
            single.write_bytes(package(lesson()))
            with zipfile.ZipFile(library, 'w') as z:
                z.writestr(single.name, single.read_bytes())
            courses = source.extract([single, library], root/'public')
            self.assertEqual(len(courses), 1)
            course = courses[0]; row = course['lessons'][0]
            self.assertEqual(course['subject'], 'ghanaian_ga')
            self.assertEqual(len(course['duplicates']), 1)
            self.assertEqual(row['notes'], [lesson()['body']])
            self.assertEqual(row['sourceLesson'], {k: v for k, v in lesson().items() if k != 'questions'})
            self.assertEqual(row['visualGuide']['steps'], lesson()['steps'])
            self.assertEqual(row['sourceVideo']['audio'], 'english-guide')
            self.assertNotIn('questions', row['sourceLesson'])
            self.assertFalse(list((root/'public').rglob('*.html')))
            for panel in row['visualGuide']['panels']:
                self.assertEqual((root/'public'/panel['image'].lstrip('/')).read_bytes(), b'original-image')
            standalone = source.extract([single], root/'other')[0]
            self.assertEqual(course['sourceHash'], standalone['sourceHash'])

    def test_languages_do_not_overwrite_each_other(self):
        self.assertEqual(source.identity('Ghanaian_Language_Twi_Basic_3_Complete_Multimedia_Package.zip'), ('b3', 'ghanaian'))
        self.assertEqual(source.identity('Ghanaian_Language_Ga_Basic_3_Complete_Multimedia_Package.zip'), ('b3', 'ghanaian_ga'))
        self.assertEqual(source.identity('Ghanaian_Language_Mfantse_Basic_3_Complete_Multimedia_Package.zip'), ('b3', 'ghanaian_mfantse'))

    def test_missing_asset_is_rejected_instead_of_inventing_a_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)/'Ghanaian_Language_Ga_Basic_3_Complete_Multimedia_Package.zip'
            p.write_bytes(package(lesson(), missing=True))
            with self.assertRaisesRegex(AssertionError, 'Missing source asset'):
                source.extract([p], Path(tmp)/'public')

    def test_conflicting_duplicate_media_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
            root = Path(tmp)
            p = root/'Ghanaian_Language_Ga_Basic_3_Complete_Multimedia_Package.zip'
            p.write_bytes(package(lesson()))
            bundle = root/'Ghanaian_Language_Ga_Basic_1-6_Library.zip'
            with zipfile.ZipFile(bundle, 'w') as z:
                z.writestr(p.name, package(lesson(), image=b'different'))
            with self.assertRaisesRegex(AssertionError, 'Conflicting duplicate'):
                source.extract([p, bundle], root/'public')

    def test_three_stage_source_keeps_all_slides_and_teaching_text(self):
        row = lesson(); row.pop('body')
        row.update(lesson_text='Full explanation', subject='French', video='videos/lesson_01.mp4',
                   slides=[f'illustrations/lesson_01_stage{i}.png' for i in range(1, 4)],
                   cover_image='illustrations/lesson_01_stage1.png', evidence='Speak with a partner',
                   age_extension='Try another conversation', teacher_assessment='Observe turn taking')
        names = {n: n for n in [row['video'], *row['slides']]}
        result = source.normalize(row, 'french', 'b3', '/base', names, {})
        self.assertEqual([p['image'] for p in result['visualGuide']['panels']], ['/base/'+s for s in row['slides']])
        self.assertEqual(result['notes'], ['Full explanation'])
        self.assertEqual(result['home'], row['age_extension'])
        self.assertEqual(result['sourceVideo']['audio'], 'silent')
        self.assertEqual(result['sourceLesson']['teacher_assessment'], row['teacher_assessment'])

    def test_invalid_answers_and_archive_paths_are_rejected(self):
        q = copy.deepcopy(lesson()['questions'][0]); q['answer'] = -1
        with self.assertRaises(AssertionError): source.question(q)
        for path in ['../outside.png', '/absolute.png', 'nested/../../escape.zip', 'folder\\escape.png']:
            with self.assertRaises(AssertionError): source.safe(path)


if __name__ == '__main__':
    unittest.main()
