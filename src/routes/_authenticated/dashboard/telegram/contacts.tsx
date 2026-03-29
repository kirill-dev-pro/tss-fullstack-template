import { createFileRoute } from '@tanstack/react-router'

import { TelegramContactsPage } from '@/features/telegram/telegram-contacts-page'
import { requireAdmin } from '@/lib/auth/route-guards'

export const Route = createFileRoute(
  '/_authenticated/dashboard/telegram/contacts',
)({
  beforeLoad: async () => {
    await requireAdmin()
  },
  component: TelegramContactsPage,
})
