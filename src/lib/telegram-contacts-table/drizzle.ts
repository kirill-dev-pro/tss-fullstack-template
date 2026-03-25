import { telegramContactsTableSchema } from '@/features/telegram/telegram-contacts-table-schema'
import { db } from '@/lib/db'
import { telegramContacts } from '@/lib/db/schema/telegram'
import { createDrizzleHandler } from '@/lib/drizzle'

export const telegramContactsDrizzleHandler = createDrizzleHandler({
  db,
  table: telegramContacts,
  schema: telegramContactsTableSchema.definition,
  columnMapping: {
    telegramUserId: telegramContacts.telegramUserId,
    username: telegramContacts.username,
    firstName: telegramContacts.firstName,
    lastName: telegramContacts.lastName,
    messagesSent: telegramContacts.messagesSent,
    messagesReceived: telegramContacts.messagesReceived,
    blockedAt: telegramContacts.blockedAt,
    openedMiniAppAt: telegramContacts.openedMiniAppAt,
    lastMessageAt: telegramContacts.lastMessageAt,
    createdAt: telegramContacts.createdAt,
  },
  cursorColumn: 'lastMessageAt',
  defaultSize: 40,
})
