import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

import { authClient } from '@/lib/auth/auth-client'
import { getAuthSession } from '@/lib/auth/auth-server'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const session = await getAuthSession()
    if (!session?.user) {
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
