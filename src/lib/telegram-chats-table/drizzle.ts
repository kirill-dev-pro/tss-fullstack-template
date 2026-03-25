import { telegramChatsTableSchema } from '@/features/telegram/telegram-chats-table-schema'
import { db } from '@/lib/db'
import { telegramChats } from '@/lib/db/schema/telegram'
import { createDrizzleHandler } from '@/lib/drizzle'

export const telegramChatsDrizzleHandler = createDrizzleHandler({
  db,
  table: telegramChats,
  schema: telegramChatsTableSchema.definition,
  columnMapping: {
    chatId: telegramChats.chatId,
    chatType: telegramChats.chatType,
    title: telegramChats.title,
    messageCount: telegramChats.messageCount,
    lastMessageAt: telegramChats.lastMessageAt,
    createdAt: telegramChats.createdAt,
  },
  cursorColumn: 'lastMessageAt',
  defaultSize: 40,
})
