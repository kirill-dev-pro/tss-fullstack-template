import { createFileRoute } from '@tanstack/react-router'

import { TelegramOverview } from '@/features/telegram/telegram-overview'
import { requireAdmin } from '@/lib/auth/route-guards'

export const Route = createFileRoute('/_authenticated/dashboard/telegram/')({
  beforeLoad: async () => {
    await requireAdmin()
  },
  component: TelegramOverview,
})
