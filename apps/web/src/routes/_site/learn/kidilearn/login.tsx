import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { KeyRound, Loader2, Sprout } from 'lucide-react'
import { api } from '#/lib/api-client'
import { Button } from '#/components/ui/button'
import { Container } from '#/components/site/kit'

export const Route = createFileRoute('/_site/learn/kidilearn/login')({
  component: ChildLogin,
})

function ChildLogin() {
  const [code, setCode] = useState('')
  const login = useMutation({
    mutationFn: () => api.post('/learn/kidilearn/child/login', { code }),
    onSuccess: () => window.location.assign('/learn/kidilearn'),
  })
  return (
    <div className="min-h-[65vh] bg-gradient-to-b from-amber-50 to-cyan-50 py-10">
      <Container>
        <section className="mx-auto max-w-lg rounded-3xl border bg-white p-6 sm:p-9">
          <Sprout className="size-10 text-teal-700" />
          <h1 className="mt-4 text-3xl text-primary">Hello, explorer!</h1>
          <p className="mt-3 text-slate-600">
            Enter the access code your parent gave you. Your learning space is
            waiting.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              login.mutate()
            }}
          >
            <label className="block text-primary">
              Your access code
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-2 h-14 w-full min-w-0 rounded-xl border px-3 text-center text-lg tracking-widest uppercase"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={64}
                placeholder="e.g. K7MP"
                required
              />
            </label>
            {login.error && (
              <p role="alert" className="text-sm text-red-700">
                {login.error.message}
              </p>
            )}
            <Button
              className="h-12 w-full rounded-xl"
              disabled={login.isPending || !code.trim()}
            >
              {login.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <KeyRound className="size-4" />
              )}{' '}
              Open my learning space
            </Button>
          </form>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Using a child code signs out the parent account on this device. Ask
            your parent for help if your code does not work.
          </p>
          <div className="mt-7 border-t pt-5 text-sm">
            <h3 className="text-xl text-primary">Here as a parent?</h3>
            <p className="mt-2 text-slate-600">
              Create learner profiles and follow each child’s progress.
            </p>
            <Link
              to="/login"
              search={{ next: '/learn/kidilearn/family' }}
              className="mt-3 inline-flex min-h-11 items-center font-medium text-primary underline"
            >
              Parent sign-in
            </Link>
          </div>
        </section>
      </Container>
    </div>
  )
}
