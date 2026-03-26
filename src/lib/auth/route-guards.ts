import { redirect } from '@tanstack/react-router'

import { authClient } from '@/lib/auth/auth-client'
import { canManageUsers, type UserRole } from '@/lib/auth/permissions'

export function requireAdmin() {
  const sessionData = authClient.$store.atoms.session.get()
  const userRole = (sessionData?.data?.user?.role || 'user') as UserRole

  if (!canManageUsers(userRole)) {
    throw redirect({ to: '/dashboard' })
  }
}
