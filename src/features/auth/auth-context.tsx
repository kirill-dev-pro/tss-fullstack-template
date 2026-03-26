import { Loader2 } from 'lucide-react'

import { useSession } from '@/features/auth/auth-hooks'
import {
  hasPermission as checkPermission,
  type UserRole,
} from '@/lib/auth/permissions'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
  hasRole: (role: UserRole) => boolean
  hasPermission: (
    resource: Parameters<typeof checkPermission>[1],
    action: Parameters<typeof checkPermission>[2],
  ) => boolean
}

export function useAuthContext(): AuthState {
  const { data: session, isPending } = useSession()
  const user = session?.user
    ? ({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user.role || 'user') as UserRole,
      } satisfies AuthUser)
    : null

  return {
    isAuthenticated: !!user,
    isLoading: isPending,
    user,
    hasRole: (role: UserRole) => user?.role === role,
    hasPermission: (resource, action) =>
      user ? checkPermission(user.role, resource, action) : false,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return children
}
