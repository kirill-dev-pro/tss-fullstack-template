import { count, desc, eq, gte } from 'drizzle-orm'

import { db } from '@/lib/db'
import { telegramContacts, telegramMessages } from '@/lib/db/schema/telegram'

export async function saveMessage(
  telegramUserId: number,
  username: string | null,
  firstName: string | null,
  lastName: string | null,
  messageId: number,
  direction: 'incoming' | 'outgoing',
  text: string | null,
) {
  const now = new Date()

  await db.insert(telegramMessages).values({
    telegramUserId,
    username,
    messageId,
    direction,
    text,
    createdAt: now,
  })

  const existing = await db
    .select()
    .from(telegramContacts)
    .where(eq(telegramContacts.telegramUserId, telegramUserId))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(telegramContacts)
      .set({
        username,
        firstName,
        lastName,
        messagesSent:
          direction === 'incoming'
            ? existing[0].messagesSent + 1
            : existing[0].messagesSent,
        messagesReceived:
          direction === 'outgoing'
            ? existing[0].messagesReceived + 1
            : existing[0].messagesReceived,
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
      messagesSent: direction === 'incoming' ? 1 : 0,
      messagesReceived: direction === 'outgoing' ? 1 : 0,
      firstMessageAt: now,
      lastMessageAt: now,
      createdAt: now,
      updatedAt: now,
    })
  }
}

export async function getTelegramStats() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const [contactCount] = await db
    .select({ count: count() })
    .from(telegramContacts)

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

export async function getTelegramMessagesByUser(telegramUserId: number) {
  return db
    .select()
    .from(telegramMessages)
    .where(eq(telegramMessages.telegramUserId, telegramUserId))
    .orderBy(telegramMessages.createdAt)
}
