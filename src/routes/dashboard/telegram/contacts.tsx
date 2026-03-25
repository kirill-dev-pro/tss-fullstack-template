import { createFileRoute } from '@tanstack/react-router'

import { TelegramContactsPage } from '@/features/telegram/telegram-contacts-page'

export const Route = createFileRoute('/dashboard/telegram/contacts')({
  component: TelegramContactsPage,
})
