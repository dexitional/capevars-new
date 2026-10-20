import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { LearningLesson } from '#/lib/kidilearn/library'
import { DiscoveryLab, VisualStory } from './discovery-lab'

const lesson: LearningLesson = {
  id: 1,
  title: 'Learning together',
  strand: 'Practice',
  completed: [],
  play: [],
  challenge: [],
  content: {
    kind: '',
    level: 'b3',
    goals: [],
    notes: [],
    passage: '',
    examples: [],
    activities: [],
    home: '',
    safety: '',
    scenes: [],
    video: '',
    pdf: '',
    epub: '',
    visualGuide: {
      panels: [
        { title: 'Notice', text: 'Look closely.', image: '/example.png' },
      ],
      concepts: [{ term: 'Monitor', meaning: 'Shows words and pictures' }],
      steps: ['Try the activity.'],
      experiment: 'concepts',
      context: 'At school',
      reflection: 'What did you notice?',
      sourceStatus: 'Example',
    },
  },
}

const renderLab = (value: LearningLesson) =>
  renderToStaticMarkup(createElement(DiscoveryLab, { lesson: value }))

test('every restored activity renders through the public DiscoveryLab export', () => {
  const activities = {
    concepts: 'Connect the idea',
    code: 'Build an instruction trail',
    typing: 'My typing desk',
    data: 'Turn a survey into a chart',
    files: 'Find a home for a file',
    rhythm: 'Compose a rhythm',
    colour: 'Plan a paint mixture',
    pattern: 'Design a repeating motif',
    studio: 'Sketch a composition',
    map: 'Build a community map',
    garden: 'Care for a model garden',
  }
  for (const [experiment, heading] of Object.entries(activities)) {
    const value = structuredClone(lesson)
    value.content.visualGuide!.experiment = experiment
    assert.ok(renderLab(value).includes(heading), experiment)
  }
  const performance = structuredClone(lesson)
  performance.title = 'Tell a story with gestures'
  performance.content.visualGuide!.experiment = 'studio'
  assert.ok(renderLab(performance).includes('Plan a three-part performance'))
})

test('the VisualStory export renders the explanation and navigation', () => {
  const html = renderToStaticMarkup(createElement(VisualStory, { lesson }))
  assert.ok(html.includes('Look closely.'))
  assert.ok(html.includes('Visual explanation steps'))
})

test('empty or missing concept data renders the fallback without crashing', () => {
  const value = structuredClone(lesson)
  value.content.visualGuide!.concepts = []
  assert.ok(renderLab(value).includes('No concepts available'))
  Reflect.deleteProperty(value.content.visualGuide!, 'concepts')
  assert.ok(renderLab(value).includes('No concepts available'))
})

test('lessons without a visual guide or panels render safely', () => {
  const value = structuredClone(lesson)
  value.content.visualGuide!.panels = []
  assert.equal(
    renderToStaticMarkup(createElement(VisualStory, { lesson: value })),
    '',
  )
  delete value.content.visualGuide
  assert.equal(renderLab(value), '')
  assert.equal(
    renderToStaticMarkup(createElement(VisualStory, { lesson: value })),
    '',
  )
})
