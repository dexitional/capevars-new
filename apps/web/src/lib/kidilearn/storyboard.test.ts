import assert from 'node:assert/strict'
import test from 'node:test'
import { speakable } from './storyboard'

test('reads maths symbols aloud', () => {
  assert.equal(speakable('6 × 4 = 24 m²'), '6 times 4 equals 24 square metres')
  assert.equal(speakable('12 cm³'), '12 cubic centimetres')
  assert.equal(speakable('3 squared is 3²'), '3 squared is 3 squared')
  assert.equal(speakable('☐ + 7 = 15'), 'box plus 7 equals 15')
  assert.equal(speakable('−3 + −5 = −8'), 'minus 3 plus minus 5 equals minus 8')
  assert.equal(speakable('25% is 1/4'), '25 percent is one quarter')
  assert.equal(
    speakable('4 : 6 = 2 : 3 at 14:30'),
    '4 to 6 equals 2 to 3 at 14:30',
  )
})
