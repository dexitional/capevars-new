import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'
import { api } from '#/lib/api-client'
import type { KidiDashboard } from '#/lib/kidilearn/catalog'
import { Container, EmptyState, Loading } from '#/components/site/kit'
import { Button } from '#/components/ui/button'
import { KidiDashboardView } from '#/components/kidilearn/dashboard'

export const Route = createFileRoute('/_site/learn/kidilearn/')({
  component: KidiHome,
})

function KidiHome() {
  const query = useQuery({
    queryKey: ['kidilearn', 'dashboard'],
    queryFn: () => api.get<KidiDashboard>('/learn/kidilearn/dashboard'),
  })
  if (!query.data)
    return (
      <Container className="py-10">
        {query.error ? (
          <div role="alert">
            <EmptyState
              icon={AlertTriangle}
              title="Let's try that again"
              text="We couldn't load your learning space."
              action={
                <Button
                  disabled={query.isFetching}
                  onClick={() => void query.refetch()}
                >
                  Try again
                </Button>
              }
            />
          </div>
        ) : (
          <Loading />
        )}
      </Container>
    )
  return <KidiDashboardView data={query.data} />
}
