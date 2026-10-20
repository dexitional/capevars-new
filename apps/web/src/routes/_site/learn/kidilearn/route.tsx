import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import '#/components/kidilearn/courses.css'
import { api } from '#/lib/api-client'
import type { KidiSession } from '#/lib/kidilearn/family'
import { Button } from '#/components/ui/button'
import { Container } from '#/components/site/kit'
import { toast } from 'sonner'
import { ChildPicture } from '#/components/kidilearn/child-picture'

export const Route = createFileRoute('/_site/learn/kidilearn')({
  beforeLoad: async ({ context, location }) => {
    const kidiSession = await context.queryClient.fetchQuery({
      queryKey: ['kidilearn', 'session'],
      queryFn: () => api.get<KidiSession>('/learn/kidilearn/session'),
      staleTime: 0,
    })
    if (!location.pathname.endsWith('/kidilearn/login')) {
      if (!kidiSession) throw redirect({ to: '/learn/kidilearn/login' })
      if (
        location.pathname.endsWith('/kidilearn/family') &&
        kidiSession.mode !== 'parent'
      )
        throw redirect({
          to: '/login',
          search: { next: '/learn/kidilearn/family' },
        })
    }
    return { kidiSession }
  },
  head: () => ({
    meta: [
      { title: 'kidiLearn | OpenLearn' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: KidiLayout,
})

function KidiLayout() {
  const { kidiSession } = Route.useRouteContext()
  const isChild = kidiSession?.mode === 'child'
  const isFamilyPage = useRouterState({
    select: (state) =>
      state.location.pathname.replace(/\/$/, '') === '/learn/kidilearn/family',
  })
  return (
    <div className="kidilearn">
      {kidiSession && (
        <header className={isChild ? 'bg-primary text-white' : undefined}>
          <Container className="flex flex-wrap items-center justify-between gap-3 py-4">
            {isChild && (
              <Link
                to="/learn/kidilearn"
                className="shrink-0 text-3xl font-black tracking-tight sm:text-4xl"
              >
                <span className="text-amber-300">kidi</span>Learn
              </Link>
            )}
            {!isChild && (
              <div className="flex min-w-0 max-w-full items-center gap-2 sm:gap-3">
                {isFamilyPage && (
                  <>
                    <Link
                      to="/learn/kidilearn"
                      className="inline-flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-xs font-medium text-primary transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-3 sm:text-sm"
                    >
                      <ArrowLeft
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>My learning dashboard</span>
                    </Link>
                    <span
                      className="h-6 w-px shrink-0 bg-primary/15"
                      aria-hidden="true"
                    />
                  </>
                )}
                <p
                  className={
                    isFamilyPage
                      ? 'min-w-0 rounded-xl border border-amber-200/70 bg-amber-50 px-3 py-2 text-xs font-medium text-primary sm:text-sm'
                      : 'text-sm text-primary'
                  }
                >
                  Your family learning space
                </p>
              </div>
            )}
            <div
              className={
                isChild
                  ? 'ml-auto flex min-w-0 max-w-full flex-wrap items-center justify-end gap-3'
                  : 'flex flex-wrap gap-3'
              }
            >
              {isChild && (
                <div className="flex min-w-0 max-w-full items-center gap-3">
                  <ChildPicture
                    name={kidiSession.name}
                    photoUrl={kidiSession.photoUrl}
                    avatar={kidiSession.avatar}
                    className="size-10 text-2xl"
                  />
                  <p className="min-w-0 max-w-full text-right text-sm text-white/85">
                    {kidiSession.name}’s learning space
                  </p>
                </div>
              )}
              {kidiSession.mode === 'parent' ? (
                <>
                  <Link
                    className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
                    to="/learn/kidilearn/family"
                    activeOptions={{ exact: true, includeSearch: false }}
                    activeProps={{
                      className: 'border-primary bg-primary text-white',
                    }}
                    inactiveProps={{
                      className: 'bg-white text-primary hover:bg-accent',
                    }}
                  >
                    Children & progress
                  </Link>
                  <Link
                    className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
                    to="/learn/kidilearn/login"
                    activeOptions={{ exact: true, includeSearch: false }}
                    activeProps={{
                      className: 'border-primary bg-primary text-white',
                    }}
                    inactiveProps={{
                      className: 'bg-white text-primary hover:bg-accent',
                    }}
                  >
                    Child sign-in
                  </Link>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary"
                  onClick={async () => {
                    try {
                      await api.post('/learn/kidilearn/child/logout')
                      window.location.assign('/learn/kidilearn/login')
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : 'Could not sign out. Try again.',
                      )
                    }
                  }}
                >
                  Finish & sign out
                </Button>
              )}
            </div>
          </Container>
        </header>
      )}
      <Outlet />
    </div>
  )
}
