import { sql } from 'drizzle-orm'
import {
  integer,
  jsonb,
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
  blockedAt: timestamp('blocked_at'),
  openedMiniAppAt: timestamp('opened_mini_app_at'),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
})

export const telegramChats = pgTable('telegram_chats', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id').notNull().unique(),
  chatType: varchar('chat_type', { length: 20 }).notNull(),
  title: varchar('title', { length: 255 }),
  messageCount: integer('message_count').default(0).notNull(),
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
  chatId: integer('chat_id').notNull(),
  telegramUserId: integer('telegram_user_id').notNull(),
  username: varchar('username', { length: 255 }),
  messageId: integer('message_id').notNull(),
  direction: varchar('direction', { length: 10 }).notNull(),
  messageType: varchar('message_type', { length: 30 })
    .notNull()
    .default('text'),
  text: text('text'),
  media: jsonb('media'),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
})
