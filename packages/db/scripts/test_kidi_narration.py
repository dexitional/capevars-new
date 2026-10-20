import importlib.util
from pathlib import Path
import unittest


def module(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(name + '.py'))
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


prepare = module('prepare-kidi-narration')
render = module('render-kidi-narration')


class NarrationTests(unittest.TestCase):
    def test_math_symbols_are_spoken(self):
        self.assertEqual(prepare.spoken('GH₵5 × 2 = GH₵10'), 'Ghana cedis 5 times 2 equals Ghana cedis 10')
        self.assertEqual(prepare.spoken('12-4 > ½'), '12 minus 4 greater than one half')

    def test_blanks_and_repeated_intros(self):
        self.assertEqual(prepare.spoken('Welcome to Maths Quest lesson 1. 10, 20, ___'), '10, 20, blank')

    def test_caption_timestamps_carry(self):
        self.assertEqual(render.timestamp(59.9996), '00:01:00.000')
        self.assertEqual(render.timestamp(3600.125), '01:00:00.125')

    def test_captions_fit_and_stay_inside_scene(self):
        cues = render.caption_cues(' '.join(['example'] * 40), 12.2, 20)
        self.assertGreater(len(cues), 1)
        self.assertTrue(cues[0].startswith('00:00:12.200 -->'))
        self.assertIn('--> 00:00:32.200', cues[-1])
        for cue in cues:
            self.assertLessEqual(len(cue.split('\n')[1]), 85)
        self.assertEqual(' '.join(c.split('\n')[1] for c in cues), ' '.join(['example'] * 40))


if __name__ == '__main__':
    unittest.main()
