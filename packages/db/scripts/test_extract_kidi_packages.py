import unittest
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

spec = spec_from_file_location('packages', Path(__file__).with_name('extract-kidi-packages.py'))
packages = module_from_spec(spec)
spec.loader.exec_module(packages)


class PackageImportTests(unittest.TestCase):
    def test_tap_game_keeps_target_only_in_server_answer_key(self):
        q = packages.game_question(dict(type='tap', prompt='Select seven objects.', total=10, target=7, emoji='🍊'))
        self.assertEqual(q['options'][q['correctIndex']], '7')
        self.assertNotIn('target', q['interaction'])
        self.assertEqual(q['interaction']['total'], 10)

    def test_order_game_retains_every_possible_arrangement(self):
        q = packages.game_question(dict(type='order', prompt='Order the cards.', options=[4, 1, 3, 2], answer=[1, 2, 3, 4]))
        self.assertEqual(len(set(q['options'])), 24)
        self.assertEqual(q['options'][q['correctIndex']], '1 2 3 4')
        self.assertNotIn('answer', q['interaction'])

    def test_chart_answers_can_exceed_multiple_choice_indices(self):
        q = packages.game_question(dict(type='chart', prompt='Find one hundred.', base=90, target=100))
        self.assertEqual(q['correctIndex'], 99)
        self.assertEqual(q['options'][99], '100')

    def test_movement_goal_remains_visible_but_grading_is_separate(self):
        q = packages.game_question(dict(type='directions', prompt='Go to the treasure.', target=[2, 1]))
        self.assertEqual(q['interaction']['goal'], [2, 1])
        self.assertEqual(q['options'][q['correctIndex']], '2,1')
        self.assertEqual(len(q['options']), 16)

    def test_html_is_parsed_as_json_not_executed(self):
        self.assertEqual(packages.array('const LESSONS = [{"title":"A"}]; throw Error()', 'LESSONS'), [{'title': 'A'}])
        with self.assertRaises(ValueError):
            packages.array('const LESSONS = dangerousFunction();', 'LESSONS')

    def test_activity_strings_are_not_iterated_as_letters(self):
        self.assertEqual(packages.strings('Model a number.'), ['Model a number.'])
        self.assertEqual(packages.strings(['Read', 'Explain']), ['Read', 'Explain'])


if __name__ == '__main__':
    unittest.main()
