import { createFileRoute } from '@tanstack/react-router'

import { TelegramDashboard } from '@/features/telegram/telegram-dashboard'

export const Route = createFileRoute('/dashboard/telegram/')({
  component: TelegramDashboard,
})
