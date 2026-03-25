import { field } from '@/lib/store/schema'
import {
  col,
  createTableSchema,
  generateFilterSchema,
  type InferTableType,
} from '@/lib/table-schema'

const CHAT_TYPES = ['private', 'group', 'supergroup', 'channel'] as const

export const telegramChatsTableSchema = createTableSchema({
  chatId: col
    .number()
    .label('Chat ID')
    .filterable('input')
    .sortable()
    .size(120),
  chatType: col
    .enum(CHAT_TYPES)
    .label('Type')
    .filterable('checkbox', {
      options: CHAT_TYPES.map((t) => ({ label: t, value: t })),
    })
    .sortable()
    .size(110),
  title: col.string().label('Title').filterable('input').sortable().size(220),
  messageCount: col
    .number()
    .label('Messages')
    .filterable('input')
    .sortable()
    .size(100),
  lastMessageAt: col
    .timestamp()
    .label('Last Message')
    .filterable('timerange')
    .sortable()
    .display('timestamp')
    .size(130),
  createdAt: col
    .timestamp()
    .label('Created')
    .filterable('timerange')
    .sortable()
    .display('timestamp')
    .size(130),
})

export type TelegramChatRow = InferTableType<
  typeof telegramChatsTableSchema.definition
>

export const telegramChatsFilterSchema = generateFilterSchema(
  telegramChatsTableSchema.definition,
  {
    sort: field.sort().default({ id: 'lastMessageAt', desc: true }),
    uuid: field.string(),
    live: field.boolean().default(false),
    size: field.number().default(40),
    cursor: field.timestamp(),
    direction: field.string().default('next'),
  },
)

export const telegramChatsTableQueryKeyPrefix = 'telegram-chats-table'
