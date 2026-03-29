import { redirect } from '@tanstack/react-router'

import { getAuthSession } from '@/lib/auth/auth-server'
import { canManageUsers, type UserRole } from '@/lib/auth/permissions'

export async function requireAdmin() {
  const session = await getAuthSession()
  const userRole = (session?.user?.role || 'user') as UserRole

  if (!canManageUsers(userRole)) {
    throw redirect({ to: '/dashboard' })
  }
}
