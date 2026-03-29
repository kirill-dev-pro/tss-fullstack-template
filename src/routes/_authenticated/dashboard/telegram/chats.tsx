import { createFileRoute } from '@tanstack/react-router'

import { TelegramChatsPage } from '@/features/telegram/telegram-chats-page'
import { requireAdmin } from '@/lib/auth/route-guards'

export const Route = createFileRoute(
  '/_authenticated/dashboard/telegram/chats',
)({
  beforeLoad: async () => {
    await requireAdmin()
  },
  component: TelegramChatsPage,
})
