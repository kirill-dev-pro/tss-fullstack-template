import { createFileRoute } from '@tanstack/react-router'

import { AdminOverview } from '@/features/admin/admin-overview'
import { requireAdmin } from '@/lib/auth/route-guards'

export const Route = createFileRoute('/_authenticated/dashboard/admin/')({
  beforeLoad: async () => {
    await requireAdmin()
  },
  component: AdminOverview,
})
