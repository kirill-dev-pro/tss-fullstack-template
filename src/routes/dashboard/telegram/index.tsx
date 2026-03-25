import { createFileRoute } from '@tanstack/react-router'

import { TelegramOverview } from '@/features/telegram/telegram-overview'

export const Route = createFileRoute('/dashboard/telegram/')({
  component: TelegramOverview,
})
