import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SubjectPlayer } from '#/components/kidilearn/subject-player'

export const Route = createFileRoute(
  '/_site/learn/kidilearn/subjects/$level/$subject',
)({
  validateSearch: z.object({
    lesson: z.coerce.number().int().positive().optional().catch(undefined),
  }),
  head: () => ({ meta: [{ title: 'Explore and learn | kidiLearn' }] }),
  component: SubjectPage,
})

function SubjectPage() {
  const { level, subject } = Route.useParams()
  const { lesson } = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <SubjectPlayer
      level={level}
      subject={subject}
      selectedId={lesson}
      onSelect={(id) => void navigate({ search: { lesson: id } })}
    />
  )
}
