import type { CourseGuides } from './types'

// A course's guides download only when a learner opens that course.
const COURSES: Record<string, () => Promise<{ guides: CourseGuides }>> = {
  'b1/mathematics': () => import('./b1-mathematics'),
  'b2/mathematics': () => import('./b2-mathematics'),
  'b3/mathematics': () => import('./b3-mathematics'),
  'b4/mathematics': () => import('./b4-mathematics'),
  'b5/mathematics': () => import('./b5-mathematics'),
  'b6/mathematics': () => import('./b6-mathematics'),
  'b1/history': () => import('./b1-history'),
  'b2/history': () => import('./b2-history'),
  'b3/history': () => import('./b3-history'),
  'b4/history': () => import('./b4-history'),
  'b5/history': () => import('./b5-history'),
  'b6/history': () => import('./b6-history'),
  'b1/pe': () => import('./b1-pe'),
  'b1/rme': () => import('./b1-rme'),
  'b2/rme': () => import('./b2-rme'),
  'b2/pe': () => import('./b2-pe'),
  'b3/pe': () => import('./b3-pe'),
  'b4/pe': () => import('./b4-pe'),
  'b5/pe': () => import('./b5-pe'),
  'b6/pe': () => import('./b6-pe'),
}

export function hasGuides(level: string, subject: string) {
  return Object.hasOwn(COURSES, `${level}/${subject}`)
}

export async function loadGuides(level: string, subject: string) {
  if (!hasGuides(level, subject)) return null
  return (await COURSES[`${level}/${subject}`]!()).guides
}
