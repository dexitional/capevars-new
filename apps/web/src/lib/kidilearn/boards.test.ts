import assert from 'node:assert/strict'
import test from 'node:test'
import { BOARDS, boardFor } from './boards'

test('finds a script by level, subject and title only', () => {
  const title = 'Explore halves and quarters'
  assert.ok(boardFor('b2', 'mathematics', title))
  assert.equal(boardFor('b3', 'mathematics', title), undefined)
  assert.equal(boardFor('b2', 'mathematics', 'Another lesson'), undefined)
})

// The player reads a scene's lines and answers without checking them first.
for (const [key, board] of BOARDS) {
  test(`${key} can be played from start to finish`, () => {
    const ids = board.scenes.map((s) => s.id)
    assert.equal(new Set(ids).size, ids.length, 'scene ids are unique')
    for (const scene of board.scenes) {
      assert.ok(scene.beats.length > 0, `${scene.id} has a line to read`)
      if (scene.reteach)
        assert.ok(ids.includes(scene.reteach), `${scene.id} reteaches a scene`)
      if (scene.check?.type === 'choice')
        assert.ok(
          scene.check.answer in scene.check.options,
          `${scene.id} has its answer among the options`,
        )
    }
  })
}
