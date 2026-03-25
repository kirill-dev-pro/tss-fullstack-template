import { field } from '@/lib/store/schema'
import {
  col,
  createTableSchema,
  generateFilterSchema,
  type InferTableType,
} from '@/lib/table-schema'

export const telegramContactsTableSchema = createTableSchema({
  telegramUserId: col
    .number()
    .label('Telegram ID')
    .filterable('input')
    .sortable()
    .size(120),
  username: col
    .string()
    .label('Username')
    .filterable('input')
    .sortable()
    .size(160),
  firstName: col
    .string()
    .label('First Name')
    .filterable('input')
    .sortable()
    .size(140),
  lastName: col.string().label('Last Name').filterable('input').size(140),
  messagesSent: col
    .number()
    .label('Sent')
    .filterable('input')
    .sortable()
    .size(90),
  messagesReceived: col
    .number()
    .label('Received')
    .filterable('input')
    .sortable()
    .size(90),
  blockedAt: col
    .timestamp()
    .label('Blocked')
    .filterable('timerange')
    .sortable()
    .display('timestamp')
    .size(130),
  openedMiniAppAt: col
    .timestamp()
    .label('Opened App')
    .filterable('timerange')
    .sortable()
    .display('timestamp')
    .size(130),
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

export type TelegramContactRow = InferTableType<
  typeof telegramContactsTableSchema.definition
>

export const telegramContactsFilterSchema = generateFilterSchema(
  telegramContactsTableSchema.definition,
  {
    sort: field.sort().default({ id: 'lastMessageAt', desc: true }),
    uuid: field.string(),
    live: field.boolean().default(false),
    size: field.number().default(40),
    cursor: field.timestamp(),
    direction: field.string().default('next'),
  },
)

export const telegramContactsTableQueryKeyPrefix = 'telegram-contacts-table'
