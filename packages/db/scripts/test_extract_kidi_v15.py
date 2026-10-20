import unittest
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

spec = spec_from_file_location('extractor', Path(__file__).with_name('extract-kidi-v15.py'))
extractor = module_from_spec(spec)
spec.loader.exec_module(extractor)


class QuestionImportTests(unittest.TestCase):
    def test_geometry_context_does_not_reveal_shape_identification_answer(self):
        q = extractor.question(dict(text='Which quadrilateral has four right angles and equal sides?',
                                    choices=['Square', 'Rhombus', 'Trapezoid'], answer='Square', correct=0,
                                    visual={'type': 'shape', 'name': 'square'}))
        self.assertNotIn('square', q['question'].lower())
        self.assertEqual(q['correctIndex'], 0)

    def test_diagram_context_preserves_unknown_sequence_value(self):
        q = extractor.question(dict(text='What comes next?', choices=['40', '50'], answer='40', correct=0,
                                    visual={'type': 'sequence', 'nums': [10, 20, 30, None]}))
        self.assertIn('10, 20, 30, ?', q['question'])
        self.assertNotIn('40', q['question'])

    def test_disagreeing_answer_and_index_are_rejected(self):
        with self.assertRaises(AssertionError):
            extractor.question(dict(q='Which answer?', choices=['A', 'B'], answer='B', correct=0))

    def test_duplicate_options_are_rejected(self):
        with self.assertRaises(AssertionError):
            extractor.question(dict(q='Which answer?', options=['A', 'A'], a='A'))


if __name__ == '__main__':
    unittest.main()
