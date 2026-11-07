import type { CourseGuides } from './types'

// A course's guides download only when a learner opens that course.
const COURSES: Record<string, () => Promise<{ guides: CourseGuides }>> = {
  'b2/mathematics': () => import('./b2-mathematics'),
  'b5/pe': () => import('./b5-pe'),
}

export function hasGuides(level: string, subject: string) {
  return Object.hasOwn(COURSES, `${level}/${subject}`)
}

export async function loadGuides(level: string, subject: string) {
  if (!hasGuides(level, subject)) return null
  return (await COURSES[`${level}/${subject}`]!()).guides
}
