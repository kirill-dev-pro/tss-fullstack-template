import { Bot } from 'grammy'

import { env } from '../lib/env'

const bot = new Bot(env.BOT_TOKEN)

bot.command('start', (ctx) => {
  ctx.reply('Hello! This is a Telegram bot for the Telegram Mini App.')
})

bot.catch((error) => {
  console.error('Error:', error)
})

export { bot }
