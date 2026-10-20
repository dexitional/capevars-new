import contextlib
import copy
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('new_courses', Path(__file__).with_name('extract-kidi-new.py'))
new = importlib.util.module_from_spec(spec)
spec.loader.exec_module(new)


def lesson():
    return dict(title='Files and Folders', strand='Computer skills', goal='Organise files.',
                explain='Folders hold files. Names help us find them.', story='Ama saves a story.',
                activity='Choose a folder.', draw='Draw a folder tree.',
                play=[dict(q=f'Play question {i}', options=['Yes', 'No'], answer='Yes') for i in range(5)],
                challenge=[dict(q=f'Challenge question {i}', options=['Yes', 'No'], answer='No') for i in range(10)])


def archive(path, rows, extra=None):
    prefix = 'Computing_Basic_3/'
    with zipfile.ZipFile(path, 'w') as z:
        z.writestr(prefix+'teacher_lesson_data.json', json.dumps(rows))
        for name in ['videos/Lesson_01.mp4', 'illustrations/01.png', 'course.pdf', 'course.epub']:
            z.writestr(prefix+name, b'fixture')
        z.writestr(prefix+'untrusted.html', '<script>doNotExecute()</script>')
        if extra: z.writestr(prefix+extra, b'unsafe')


class NewCourseImportTests(unittest.TestCase):
    def test_library_and_standalone_are_imported_once(self):
        with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
            root=Path(tmp); library=root/'Library.zip'; single=root/'Single.zip'
            archive(library, [lesson()]); archive(single, [lesson()])
            courses, skipped=new.extract([single,library],root/'public')
            self.assertEqual(len(courses),1)
            self.assertEqual(courses[0]['level'],'b3')
            self.assertEqual(courses[0]['subject'],'computing')
            self.assertEqual(courses[0]['duplicates'],['Single.zip'])
            self.assertFalse(skipped)
            self.assertFalse(list((root/'public').rglob('*.html')))
            row=courses[0]['lessons'][0]
            self.assertEqual(row['visualGuide']['experiment'],'files')
            self.assertEqual(row['scenes'],[p['text'] for p in row['visualGuide']['panels']])
            self.assertEqual(len(row['scenes']),4)

    def test_conflicting_duplicate_refuses_silent_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
            root=Path(tmp); a=root/'Library.zip'; b=root/'Single.zip'
            changed=lesson(); changed['goal']='Different content'
            archive(a,[lesson()]); archive(b,[changed])
            with self.assertRaisesRegex(AssertionError,'Conflicting duplicate'):
                new.extract([a,b],root/'public')

    def test_archive_asset_cannot_escape_destination(self):
        with tempfile.TemporaryDirectory() as tmp, contextlib.redirect_stdout(io.StringIO()):
            root=Path(tmp); source=root/'Library.zip'
            archive(source,[lesson()], '../../../../escape.png')
            with self.assertRaises(AssertionError): new.extract([source],root/'public')
            self.assertFalse((root/'escape.png').exists())

    def test_duplicate_prompts_rejected_across_phases(self):
        row=lesson(); row['challenge'][0]=copy.deepcopy(row['play'][0])
        with self.assertRaisesRegex(AssertionError,'Duplicate prompts'):
            new.normalized(row,1,'computing','b3','/kidilearn/b3/computing/v1',{})

    def test_answer_must_identify_one_distinct_option(self):
        with self.assertRaises(AssertionError): new.question(dict(q='Which?',options=['Yes','Yes'],answer='Yes'))

    def test_answer_index_cannot_wrap_to_last_option(self):
        with self.assertRaises(AssertionError): new.question(dict(q='Which?', options=['Yes','No'], correct=-1))

    def test_starter_is_not_presented_as_a_course(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); source=root/'NACCA_OWOP_B4_B6_Production_Starter.zip'
            with zipfile.ZipFile(source,'w') as z: z.writestr('plan.md','Production plan')
            courses,skipped=new.extract([source],root/'public')
            self.assertFalse(courses);self.assertEqual(len(skipped),1)


if __name__=='__main__': unittest.main()
