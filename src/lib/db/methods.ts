import { and, count, desc, eq, gte, isNull, lt } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  telegramChats,
  telegramContacts,
  telegramMessages,
} from '@/lib/db/schema/telegram'

export type MessagePayload = {
  messageType: string
  text: string | null
  media: Record<string, unknown> | null
}

export type ChatContext = {
  chatId: number
  chatType: string
  chatTitle: string | null
}

export async function saveMessage(
  telegramUserId: number,
  username: string | null,
  firstName: string | null,
  lastName: string | null,
  messageId: number,
  direction: 'incoming' | 'outgoing',
  payload: MessagePayload,
  chat: ChatContext,
) {
  const now = new Date()

  const [inserted] = await db
    .insert(telegramMessages)
    .values({
      chatId: chat.chatId,
      telegramUserId,
      username,
      messageId,
      direction,
      messageType: payload.messageType,
      text: payload.text,
      media: payload.media,
      createdAt: now,
    })
    .returning()

  if (direction === 'incoming') {
    const existingContact = await db
      .select()
      .from(telegramContacts)
      .where(eq(telegramContacts.telegramUserId, telegramUserId))
      .limit(1)

    if (existingContact.length > 0) {
      await db
        .update(telegramContacts)
        .set({
          username,
          firstName,
          lastName,
          messagesSent: existingContact[0].messagesSent + 1,
          lastMessageAt: now,
          updatedAt: now,
        })
        .where(eq(telegramContacts.telegramUserId, telegramUserId))
    } else {
      await db.insert(telegramContacts).values({
        telegramUserId,
        username,
        firstName,
        lastName,
        messagesSent: 1,
        messagesReceived: 0,
        firstMessageAt: now,
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  const existingChat = await db
    .select()
    .from(telegramChats)
    .where(eq(telegramChats.chatId, chat.chatId))
    .limit(1)

  if (existingChat.length > 0) {
    await db
      .update(telegramChats)
      .set({
        chatType: chat.chatType,
        title: chat.chatTitle ?? existingChat[0].title,
        messageCount: existingChat[0].messageCount + 1,
        lastMessageAt: now,
        updatedAt: now,
      })
      .where(eq(telegramChats.chatId, chat.chatId))
  } else {
    await db.insert(telegramChats).values({
      chatId: chat.chatId,
      chatType: chat.chatType,
      title: chat.chatTitle,
      messageCount: 1,
      firstMessageAt: now,
      lastMessageAt: now,
      createdAt: now,
      updatedAt: now,
    })
  }

  return inserted
}

export async function markContactBlocked(telegramUserId: number) {
  await db
    .update(telegramContacts)
    .set({ blockedAt: new Date(), updatedAt: new Date() })
    .where(eq(telegramContacts.telegramUserId, telegramUserId))
}

export async function markMiniAppOpened(telegramUserId: number) {
  const now = new Date()
  const existing = await db
    .select()
    .from(telegramContacts)
    .where(eq(telegramContacts.telegramUserId, telegramUserId))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(telegramContacts)
      .set({ openedMiniAppAt: now, updatedAt: now })
      .where(eq(telegramContacts.telegramUserId, telegramUserId))
  } else {
    await db.insert(telegramContacts).values({
      telegramUserId,
      messagesSent: 0,
      messagesReceived: 0,
      firstMessageAt: now,
      lastMessageAt: now,
      openedMiniAppAt: now,
      createdAt: now,
      updatedAt: now,
    })
  }
}

export async function getBroadcastableContacts() {
  return db
    .select()
    .from(telegramContacts)
    .where(isNull(telegramContacts.blockedAt))
    .orderBy(desc(telegramContacts.lastMessageAt))
}

export async function getTelegramStats() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const [contactCount] = await db
    .select({ count: count() })
    .from(telegramContacts)

  const [chatCount] = await db.select({ count: count() }).from(telegramChats)

  const [messageCount] = await db
    .select({ count: count() })
    .from(telegramMessages)

  const [todayCount] = await db
    .select({ count: count() })
    .from(telegramMessages)
    .where(gte(telegramMessages.createdAt, startOfDay))

  const [weekCount] = await db
    .select({ count: count() })
    .from(telegramMessages)
    .where(gte(telegramMessages.createdAt, startOfWeek))

  return {
    totalContacts: contactCount.count,
    totalChats: chatCount.count,
    totalMessages: messageCount.count,
    messagesToday: todayCount.count,
    messagesThisWeek: weekCount.count,
  }
}

export async function getTelegramContactsList() {
  return db
    .select()
    .from(telegramContacts)
    .orderBy(desc(telegramContacts.lastMessageAt))
}

export async function getTelegramChatsList() {
  return db
    .select()
    .from(telegramChats)
    .orderBy(desc(telegramChats.lastMessageAt))
}

export async function getMessagesPage(
  chatId: number,
  cursor?: number,
  limit = 50,
) {
  const conditions = [eq(telegramMessages.chatId, chatId)]

  if (cursor) {
    conditions.push(lt(telegramMessages.id, cursor))
  }

  const rows = await db
    .select()
    .from(telegramMessages)
    .where(and(...conditions))
    .orderBy(desc(telegramMessages.id))
    .limit(limit + 1)

  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows
  const messages = [...page].reverse()

  return { messages, hasMore }
}
