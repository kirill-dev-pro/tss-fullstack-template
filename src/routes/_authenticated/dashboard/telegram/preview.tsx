import { createFileRoute } from '@tanstack/react-router'

import { TelegramMiniAppPreviewPage } from '@/features/telegram/telegram-mini-app-preview-page'
import { requireAdmin } from '@/lib/auth/route-guards'

export const Route = createFileRoute(
  '/_authenticated/dashboard/telegram/preview',
)({
  beforeLoad: async () => {
    await requireAdmin()
  },
  component: TelegramMiniAppPreviewPage,
})
