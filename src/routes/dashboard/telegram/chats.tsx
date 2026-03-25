import { createFileRoute } from '@tanstack/react-router'

import { TelegramChatsPage } from '@/features/telegram/telegram-chats-page'

export const Route = createFileRoute('/dashboard/telegram/chats')({
  component: TelegramChatsPage,
})
