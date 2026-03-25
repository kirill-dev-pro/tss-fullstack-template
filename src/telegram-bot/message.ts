import { Composer, Context } from 'grammy'

import { formatTrafficLeft } from '~/lib/util'

import { bot } from '.'
import { saveMessage } from '../lib/db/methods'
import { env } from '../lib/env'
import { generateLLMResponse } from '../lib/openrouter'
import { Subscription, SubscriptionData } from '../lib/subscription'
import { MINI_APP_URL, TRIBUTE_LINK_200_NEXT } from './constants'
import { NotificationService } from './notifications'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Rate limiting cache: userId -> { windowKey: string, messageCount: number }
const rateLimitCache = new Map<
  number,
  { windowKey: string; messageCount: number }
>()

// Track users currently processing messages to drop concurrent messages
const processingUsers = new Set<number>()

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const BASE_DELAY_MS = 2000 // Base delay in milliseconds
const EXPONENTIAL_MULTIPLIER = 2 // Multiplier for exponential backoff

function getCurrentWindowKey(): string {
  const now = Date.now()
  const windowStart =
    Math.floor(now / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS
  return windowStart.toString()
}

function getExponentialDelay(userId: number): number {
  const currentWindow = getCurrentWindowKey()
  const userData = rateLimitCache.get(userId)

  // Reset if window changed or first message
  if (!userData || userData.windowKey !== currentWindow) {
    rateLimitCache.set(userId, { windowKey: currentWindow, messageCount: 1 })
    return BASE_DELAY_MS
  }

  // Increment message count and calculate exponential delay
  const messageCount = userData.messageCount + 1
  rateLimitCache.set(userId, { windowKey: currentWindow, messageCount })

  // Exponential backoff: baseDelay * (multiplier ^ (messageCount - 1))
  const delay =
    BASE_DELAY_MS * Math.pow(EXPONENTIAL_MULTIPLIER, messageCount - 1)
  return Math.min(delay, 300000) // Cap at 5 minutes
}

async function checkMembership(
  user: Context['from'],
  subscription: SubscriptionData | null,
) {
  if (!user) return null

  if (subscription && subscription.status === 'ACTIVE') {
    return 'active'
  }

  if (subscription && subscription.status === 'LIMITED') {
    return 'limited'
  }

  const group_member = await bot.api.getChatMember(
    env.LEGACY_SUB_GROUP_ID,
    user.id,
  )
  if (
    group_member &&
    (group_member.status === 'member' ||
      group_member.status === 'creator' ||
      group_member.status === 'administrator')
  ) {
    return 'legacy'
  }

  return null
}

// Helper to log and save outgoing messages
async function logAndReply(ctx: Context, text: string) {
  const userId = ctx.from?.id
  const username = ctx.from?.username || null
  const result = await ctx.reply(text)

  if (userId) {
    console.log(`[OUTGOING] User ${userId} (@${username}): ${text}`)
    await saveMessage(userId, username, result.message_id, 'outgoing', text)
  }

  return result
}

export const messageComposer = new Composer()

messageComposer.command('start', async (ctx) => {
  const user = ctx.from
  const notifications = new NotificationService(ctx)
  if (!user) return

  // Log incoming command
  console.log(`[INCOMING] User ${user.id} (@${user.username}): /start`)
  if (ctx.message?.message_id) {
    await saveMessage(
      user.id,
      user.username || null,
      ctx.message.message_id,
      'incoming',
      '/start',
    )
  }

  const sub = new Subscription(user)
  const subscription = await sub.load()
  const membership = await checkMembership(user, subscription)

  if (!membership) {
    await logAndReply(
      ctx,
      'Привет, это Telegram VPN Next — простой и быстрый ВПН сервис для России.\n' +
        'Его легко настроить в 2 клика а попробовать можно бесплатно.\n' +
        `Посмотри инструкции для настройки в приложении: ${MINI_APP_URL}\n` +
        'Или спрашивай меня прямо тут в чате если будут вопросы, я постараюсь помочь!',
    )
    await sleep(1000)
    await logAndReply(
      ctx,
      'Открывай приложение по ссылке ниже и настрой на своем устройстве по инструкции. Пиши если будут вопросы!\n\n' +
        MINI_APP_URL,
    )
    return
  }

  if (membership === 'legacy') {
    await logAndReply(ctx, 'Привет, подписчик Telegram VPN!')
    await sleep(500)
    await logAndReply(
      ctx,
      '❤️ Спасибо что вы пользовались прошлой версией Telegram VPN, новая версия должна работать лучше, быстрее, стабильнее.',
    )
    await sleep(500)
    await logAndReply(
      ctx,
      'Открой приложение по ссылке ниже и для Вас автоматически создастся новая подписка.\n' +
        'Она будет рабоать пока Вы подписаны на старый канал, так что ничего менять не придётся.\n' +
        'Но если вы захотите сменить тариф в этом новом сервисе или будут любые другие вопросы то просто напишите @Kirill_tg_vpn и он поможет вам.\n\n' +
        MINI_APP_URL,
    )
    return
  }

  if (!subscription) {
    notifications.notifyAdmin(
      `Subscription not found for user but marked as ${membership} user id: ${user.id}`,
    )
    throw new Error('Subscription not found')
  }

  if (membership === 'active') {
    return logAndReply(
      ctx,
      'Привет! 👋\n' +
        `Твоя подписка активна и работает. У тебя осталось ${formatTrafficLeft(subscription)} Гб трафика ${subscription.trafficLimitStrategy === 'MONTH' ? 'в этом месяце' : ''}\n` +
        `Настрой ВПН через интрукцию: ${MINI_APP_URL} или пиши мне в чате если будут вопросы, я постараюсь помочь!\n` +
        `(если не смогу ответить, напиши @Kirill_tg_vpn и он поможет вам.)`,
    )
  }

  if (membership === 'limited') {
    return logAndReply(
      ctx,
      `У вас кончился трафик ${subscription.trafficLimitStrategy === 'MONTH' ? 'в этом месяце' : ''}. Вы можете изменить тариф в приложении`,
    )
  }

  logAndReply(ctx, 'Привет! 👋\n')
})

// Register some handlers here that handle your middleware the usual way.
messageComposer.on('message', async (ctx) => {
  // Пропускаем команды - они обрабатываются отдельными обработчиками
  const messageText = ctx.message?.text
  if (!messageText || messageText.startsWith('/')) {
    return
  }

  const userId = ctx.from?.id
  const username = ctx.from?.username || null
  if (!userId) {
    return
  }

  // Log incoming message
  console.log(`[INCOMING] User ${userId} (@${username}): ${messageText}`)
  if (ctx.message?.message_id) {
    await saveMessage(
      userId,
      username,
      ctx.message.message_id,
      'incoming',
      messageText,
    )
  }

  // Drop message if user is already processing a previous message
  if (processingUsers.has(userId)) {
    return
  }

  // Mark user as processing
  processingUsers.add(userId)

  try {
    const sub = new Subscription(ctx.from)
    const subscription = await sub.load()
    const membership = await checkMembership(ctx.from, subscription)

    // Генерируем ответ через LLM с контекстом подписки и мембершипа
    await ctx.replyWithChatAction('typing')
    const delay = getExponentialDelay(userId)
    console.log('sleep for', delay)
    if (delay > 10000) {
      // fuck it
      const notifications = new NotificationService(ctx)
      notifications.notifyAdmin(
        `User @${ctx.from?.username} [${userId}] sent too many messages.`,
      )
      return logAndReply(
        ctx,
        'Ой извини слишком много сообщений для меня. Попробуй позже.',
      )
    }
    await sleep(delay)
    const llmResponse = await generateLLMResponse(
      messageText,
      subscription,
      membership,
    )

    if (llmResponse) {
      await logAndReply(ctx, llmResponse)
    } else {
      // Fallback ответ если LLM не доступен
      await logAndReply(
        ctx,
        'Прямо сейчас я не могу ответить на ваш вопрос. Попробуйте позже. Или напишите @Kirill_tg_vpn и он поможет вам.',
      )
    }
  } finally {
    // Always clear processing flag when done
    processingUsers.delete(userId)
  }
})
