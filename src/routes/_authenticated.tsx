import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

import { authClient } from '@/lib/auth/auth-client'

function getSessionSync() {
  try {
    return authClient.$store.atoms.session.get()
  } catch {
    return null
  }
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const sessionData = getSessionSync()
    const hasSession = !!sessionData?.data?.session

    // Session not loaded yet (first visit) — let the component handle loading
    if (!sessionData) return

    if (!hasSession) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  pendingComponent: () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  ),
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return <Outlet />
}
