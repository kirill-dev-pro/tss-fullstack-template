import { Bot, type Context } from 'grammy'

import {
  type ChatContext,
  type MessagePayload,
  saveMessage,
} from '@/lib/db/methods'
import { env } from '@/lib/env'
import { emitTelegramMessage } from '@/lib/events/telegram'

const bot = new Bot(env.BOT_TOKEN)

// --- Helpers ---

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

function extractChat(ctx: Context): ChatContext {
  const chat = ctx.chat
  if (!chat) return { chatId: 0, chatType: 'unknown', chatTitle: null }
  return {
    chatId: chat.id,
    chatType: chat.type,
    chatTitle:
      'title' in chat
        ? (chat.title ?? null)
        : 'first_name' in chat
          ? [chat.first_name, chat.last_name].filter(Boolean).join(' ') || null
          : null,
  }
}

function extractMessagePayload(ctx: Context): MessagePayload {
  const msg = ctx.message
  if (!msg) return { messageType: 'unknown', text: null, media: null }

  if (msg.text) return { messageType: 'text', text: msg.text, media: null }
  if (msg.sticker) {
    return {
      messageType: 'sticker',
      text: msg.sticker.emoji ?? null,
      media: { fileId: msg.sticker.file_id, setName: msg.sticker.set_name },
    }
  }
  if (msg.photo) {
    const largest = msg.photo.at(-1)
    return {
      messageType: 'photo',
      text: msg.caption ?? null,
      media: {
        fileId: largest?.file_id,
        width: largest?.width,
        height: largest?.height,
      },
    }
  }
  if (msg.video) {
    return {
      messageType: 'video',
      text: msg.caption ?? null,
      media: {
        fileId: msg.video.file_id,
        fileName: msg.video.file_name,
        duration: msg.video.duration,
      },
    }
  }
  if (msg.animation) {
    return {
      messageType: 'animation',
      text: msg.caption ?? null,
      media: {
        fileId: msg.animation.file_id,
        fileName: msg.animation.file_name,
      },
    }
  }
  if (msg.audio) {
    return {
      messageType: 'audio',
      text: msg.caption ?? null,
      media: {
        fileId: msg.audio.file_id,
        title: msg.audio.title,
        performer: msg.audio.performer,
        duration: msg.audio.duration,
      },
    }
  }
  if (msg.voice) {
    return {
      messageType: 'voice',
      text: null,
      media: { fileId: msg.voice.file_id, duration: msg.voice.duration },
    }
  }
  if (msg.document) {
    return {
      messageType: 'document',
      text: msg.caption ?? null,
      media: {
        fileId: msg.document.file_id,
        fileName: msg.document.file_name,
        mimeType: msg.document.mime_type,
      },
    }
  }
  if (msg.video_note) {
    return {
      messageType: 'video_note',
      text: null,
      media: {
        fileId: msg.video_note.file_id,
        duration: msg.video_note.duration,
      },
    }
  }
  if (msg.location) {
    return {
      messageType: 'location',
      text: null,
      media: {
        latitude: msg.location.latitude,
        longitude: msg.location.longitude,
      },
    }
  }
  if (msg.contact) {
    return {
      messageType: 'contact',
      text: msg.contact.first_name,
      media: {
        phone: msg.contact.phone_number,
        firstName: msg.contact.first_name,
        lastName: msg.contact.last_name,
      },
    }
  }
  if (msg.web_app_data) {
    return {
      messageType: 'web_app_data',
      text: msg.web_app_data.data,
      media: { buttonText: msg.web_app_data.button_text },
    }
  }
  return { messageType: 'other', text: null, media: null }
}

// --- Middleware: log all incoming messages ---

bot.use(async (ctx, next) => {
  const user = extractUser(ctx)
  const chat = extractChat(ctx)
  const payload = extractMessagePayload(ctx)

  if (user && payload.messageType !== 'unknown' && ctx.message?.message_id) {
    await saveMessage(
      user.telegramUserId,
      user.username,
      user.firstName,
      user.lastName,
      ctx.message.message_id,
      'incoming',
      payload,
      chat,
    )
      .then((msg) => {
        if (msg) emitTelegramMessage(msg)
      })
      .catch((err) => console.error('[DB] save incoming:', err))
  }

  await next()
})

// --- Transformer: log all outgoing sendMessage calls ---

bot.api.config.use(async (prev, method, payload, signal) => {
  const result = await prev(method, payload, signal)

  if (method === 'sendMessage' && result.ok) {
    const p = payload as { chat_id: number; text: string }
    const msgResult = result.result as { message_id: number }
    saveMessage(
      p.chat_id,
      null,
      null,
      null,
      msgResult.message_id,
      'outgoing',
      { messageType: 'text', text: p.text, media: null },
      { chatId: p.chat_id, chatType: 'private', chatTitle: null },
    )
      .then((msg) => {
        if (msg) emitTelegramMessage(msg)
      })
      .catch((err) => console.error('[DB] save outgoing:', err))
  }

  return result
})

// --- Handlers (pure grammy) ---

bot.command('start', (ctx) =>
  ctx.reply('Hello! This is a Telegram bot for the Telegram Mini App.'),
)

bot.on('message', (ctx) =>
  ctx.reply('Hello! This is a Telegram bot for the Telegram Mini App.'),
)

bot.catch((error) => {
  console.error('Error:', error)
})

export { bot }
