import { createFileRoute } from '@tanstack/react-router'

import { AdminUsersPage } from '@/features/admin/admin-users-page'
import { requireAdmin } from '@/lib/auth/route-guards'

export const Route = createFileRoute('/_authenticated/dashboard/admin/users')({
  beforeLoad: () => requireAdmin(),
  component: AdminUsersPage,
})
