import { sql } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const telegramContacts = pgTable('telegram_contacts', {
  id: serial('id').primaryKey(),
  telegramUserId: integer('telegram_user_id').notNull().unique(),
  username: varchar('username', { length: 255 }),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  messagesSent: integer('messages_sent').default(0).notNull(),
  messagesReceived: integer('messages_received').default(0).notNull(),
  firstMessageAt: timestamp('first_message_at').notNull(),
  lastMessageAt: timestamp('last_message_at').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
})

export const telegramMessages = pgTable('telegram_messages', {
  id: serial('id').primaryKey(),
  telegramUserId: integer('telegram_user_id').notNull(),
  username: varchar('username', { length: 255 }),
  messageId: integer('message_id').notNull(),
  direction: varchar('direction', { length: 10 }).notNull(),
  text: text('text'),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
})
