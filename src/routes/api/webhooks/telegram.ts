import { createFileRoute } from '@tanstack/react-router'
import { webhookCallback } from 'grammy'

import { bot } from '@/telegram-bot'

const bunHandler = webhookCallback(bot, 'bun')

export const Route = createFileRoute('/api/webhooks/telegram')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return bunHandler(request)
      },
    },
  },
})
