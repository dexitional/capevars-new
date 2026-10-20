import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('additional', Path(__file__).with_name('extract-kidi-additional.py'))
additional = importlib.util.module_from_spec(spec)
spec.loader.exec_module(additional)


def lesson():
    return dict(title='Count together', strand='All About Me', term=1,
                idea='Count each object once.', examples=['one', 'two'],
                materials='Two blocks', activity='Count the blocks.',
                application='Count with a parent.', misconception='Do not count a block twice.',
                ref='Integrated theme', source='Independent companion',
                questions=[dict(phase=phase, prompt=f'{phase} {i}', choices=['One', 'Two'],
                                answer=i % 2, feedback='Count carefully.')
                           for phase, count in [('Play', 5), ('Challenge', 10)] for i in range(count)])


def archive():
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w') as z:
        prefix = 'KG1_Numeracy/'
        z.writestr(prefix+'course.json', json.dumps(dict(lessons=[lesson()], provenance='Integrated KG themes')))
        z.writestr(prefix+'NARRATION_SCRIPTS.md', '## 1. Count together\nCount each object once.\n')
        z.writestr(prefix+'TEACHER_NOTES.md', '**Method:** Count with an adult.\n**Kindergarten:** Play together.\n**Safety:** Use safe blocks.\n')
        for name in ['illustrations/lesson_01.png', 'videos/lesson_01.mp4', 'narration/lesson_01.mp3', 'Book.pdf', 'Book.epub']:
            z.writestr(prefix+name, b'original media')
        z.writestr(prefix+'Offline_Interactive.html', '<script>neverRun()</script>')
    return buffer.getvalue()


class AdditionalCoursesTest(unittest.TestCase):
    def test_all_new_level_and_subject_mappings(self):
        for directory, expected in [
            ('NACCA_OWOP_Basic_1_Our_World_Quest', ('b1', 'world')),
            ('OWOP_Basic_2', ('b2', 'world')),
            ('Science_Basic_6', ('b6', 'science')),
            ('English_Language_Basic_6', ('b6', 'english')),
            ('KG1_Language_and_Literacy', ('kg1', 'literacy')),
            ('KG2_Numeracy', ('kg2', 'numeracy')),
            ('KG2_Creative_Arts', ('kg2', 'creative')),
            ('KG1_Our_World_and_Our_People', ('kg1', 'world')),
        ]:
            self.assertEqual(additional.identity(directory), expected)

    def test_nested_and_standalone_are_identical_and_keep_mp3(self):
        with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
            root = Path(tmp)
            single = root/'KG1_Numeracy_Complete_Multimedia_Package.zip'
            single.write_bytes(archive())
            outer = root/'Kindergarten_1-2_Course_Library.zip'
            with zipfile.ZipFile(outer, 'w') as z:
                z.writestr(single.name, single.read_bytes())
            courses = additional.extract([outer, single], root/'public')
            self.assertEqual(len(courses), 1)
            self.assertEqual(len(courses[0]['duplicates']), 1)
            row = courses[0]['lessons'][0]
            self.assertEqual(row['sourceVideo']['audio'], 'synthetic-english')
            self.assertEqual(row['sourceVideo']['transcript'], 'Count each object once.')
            self.assertEqual((root/'public'/row['sourceVideo']['audioDownload'].lstrip('/')).read_bytes(), b'original media')
            self.assertEqual(row['sourceLesson']['misconception'], lesson()['misconception'])
            self.assertNotIn('questions', row['sourceLesson'])
            self.assertIn('Play together.', row['sourceLesson']['teacher_assessment'])
            self.assertFalse(list((root/'public').rglob('*.html')))

    def test_explicit_answer_string_and_index_must_agree(self):
        q = dict(prompt='How many?', options=['One', 'Two'], answer='Two', correct=0)
        with self.assertRaises(AssertionError): additional.question(q)
        q['correct'] = 1
        self.assertEqual(additional.question(q)['correctIndex'], 1)

    def test_invalid_index_cannot_wrap(self):
        for answer in [-1, 2, True]:
            with self.assertRaises(AssertionError):
                additional.question(dict(prompt='How many?', choices=['One', 'Two'], answer=answer))

    def test_missing_media_is_rejected(self):
        with self.assertRaisesRegex(AssertionError, 'Missing source media'):
            additional.normalize(lesson(), 1, 'kg1', 'numeracy', '/base', {},
                                 lambda name: '## 1. Count together\nCount.\n' if name.startswith('NARRATION') else
                                 '**Safety:** Safe blocks.\n**Method:** Count.\n**Kindergarten:** Play together.', {})

    def test_unsafe_paths_rejected(self):
        for name in ['../escape.png', '/absolute.mp3', 'nested/../../escape.mp4', 'folder\\file.png']:
            with self.assertRaises(AssertionError): additional.safe(name)


if __name__ == '__main__':
    unittest.main()
