import importlib.util
from pathlib import Path
import unittest


def module(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(name + '.py'))
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


theatre = module('render-kidi-theatre')
HI = {'text': 'Hello', 'lang': 'en'}
BONJOUR = {'text': 'Bonjour', 'lang': 'fr'}


class TheatreTests(unittest.TestCase):
    def test_a_line_said_twice_is_rendered_once(self):
        lines = theatre.wanted_lines([{'lines': [HI, BONJOUR]}, {'lines': [HI]}])
        self.assertEqual(lines, [HI, BONJOUR])

    def test_the_same_words_in_two_languages_stay_separate(self):
        lines = theatre.wanted_lines([{'lines': [HI, {'text': 'Hello', 'lang': 'fr'}]}])
        self.assertEqual(len(lines), 2)
        self.assertNotEqual(
            theatre.clip_name('d', 0.95, 'en', 'Hello'),
            theatre.clip_name('d', 0.95, 'fr', 'Hello'),
        )

    def test_clips_change_with_the_words_and_the_speed(self):
        name = theatre.clip_name('d', 0.95, 'en', 'Hello')
        self.assertEqual(name, theatre.clip_name('d', 0.95, 'en', 'Hello'))
        self.assertNotEqual(name, theatre.clip_name('d', 0.95, 'en', 'Hello!'))
        self.assertNotEqual(name, theatre.clip_name('d', 1.0, 'en', 'Hello'))

    def test_manifest_keys_match_what_the_narrator_looks_up(self):
        manifest = theatre.manifest_for({'lines': [HI, BONJOUR]}, 'd', 0.95)
        self.assertEqual(set(manifest['clips']), {'en:Hello', 'fr:Bonjour'})
        self.assertTrue(manifest['clips']['en:Hello'].startswith('/kidilearn/theatre/clips/'))
        self.assertEqual(manifest['voices'], {'en': 'bf_emma', 'fr': 'ff_siwis'})

    def test_a_board_id_cannot_leave_the_theatre_folder(self):
        self.assertEqual(theatre.manifest_path('b2/maths/one').name, 'one.json')
        with self.assertRaises(ValueError):
            theatre.manifest_path('../../secrets')


if __name__ == '__main__':
    unittest.main()
