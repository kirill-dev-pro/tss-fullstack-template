// This file is only used for local development.
// You can start bot in polling mode by running `bun run bot:dev`

import { env } from '@/lib/env'

import { bot } from '.'

if (env.BOT_TOKEN === 'SET_YOUR_BOT_TOKEN' || !env.BOT_TOKEN) {
  console.error('BOT_TOKEN is not set. Please set it in the .env file.')
  process.exit(1)
}

bot.start({
  allowed_updates: ['chat_member', 'chat_join_request', 'message'],
  onStart: (ctx) => {
    console.log('Bot started as @' + ctx.username, ctx.first_name)
  },
})
