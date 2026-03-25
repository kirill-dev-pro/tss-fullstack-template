import { Bot, Context } from 'grammy'

import { saveMessage } from '@/lib/db/methods'
import { env } from '@/lib/env'

const bot = new Bot(env.BOT_TOKEN)

function extractUser(ctx: Context) {
  const user = ctx.from
  if (!user) return null
  return {
    telegramUserId: user.id,
    username: user.username ?? null,
    firstName: user.first_name ?? null,
    lastName: user.last_name ?? null,
  }
}

async function logAndReply(ctx: Context, text: string) {
  const user = extractUser(ctx)
  const result = await ctx.reply(text)

  if (user && ctx.message?.message_id) {
    await saveMessage(
      user.telegramUserId,
      user.username,
      user.firstName,
      user.lastName,
      result.message_id,
      'outgoing',
      text,
    ).catch((err) =>
      console.error('[DB] Failed to save outgoing message:', err),
    )
  }

  return result
}

bot.on('message:text', async (ctx, next) => {
  const user = extractUser(ctx)
  const text = ctx.message.text

  if (user && !text.startsWith('/')) {
    await saveMessage(
      user.telegramUserId,
      user.username,
      user.firstName,
      user.lastName,
      ctx.message.message_id,
      'incoming',
      text,
    ).catch((err) =>
      console.error('[DB] Failed to save incoming message:', err),
    )
  }

  await next()
})

bot.command('start', async (ctx) => {
  const user = extractUser(ctx)
  if (user && ctx.message?.message_id) {
    await saveMessage(
      user.telegramUserId,
      user.username,
      user.firstName,
      user.lastName,
      ctx.message.message_id,
      'incoming',
      '/start',
    ).catch((err) => console.error('[DB] Failed to save /start command:', err))
  }

  await logAndReply(
    ctx,
    'Hello! This is a Telegram bot for the Telegram Mini App.',
  )
})

bot.on('message', async (ctx) => {
  await logAndReply(
    ctx,
    'Hello! This is a Telegram bot for the Telegram Mini App.',
  )
})

bot.catch((error) => {
  console.error('Error:', error)
})

export { bot }
