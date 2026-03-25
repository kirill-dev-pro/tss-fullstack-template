import { Bot, GrammyError } from 'grammy'

import { env } from '@/lib/env'

const bot = new Bot(env.BOT_TOKEN)

if (env.BOT_TOKEN === 'SET_YOUR_BOT_TOKEN' || !env.BOT_TOKEN) {
  console.error('BOT_TOKEN is not set. Please set it in the .env file.')
  process.exit(1)
}

const url = process.argv[2] || env.SERVER_URL + '/api/webhooks/telegram'

if (!url) {
  console.error('Usage: bun scripts/setWebhook.ts <url>')
  process.exit(1)
}

bot.api
  .setWebhook(url)
  .then(() => {
    console.log(`Webhook set to: ${url}`)
    process.exit(0)
  })
  .catch((err: GrammyError) => {
    console.error('Failed to set webhook:', err.description)
    process.exit(1)
  })
