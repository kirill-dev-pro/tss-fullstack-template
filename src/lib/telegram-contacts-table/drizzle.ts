import { and, isNull } from 'drizzle-orm'

import {
  telegramContactsFilterSchema,
  telegramContactsTableSchema,
} from '@/features/telegram/telegram-contacts-table-schema'
import { db } from '@/lib/db'
import { telegramContacts } from '@/lib/db/schema/telegram'
import { buildWhereConditions, createDrizzleHandler } from '@/lib/drizzle'
import { parseState, validateState } from '@/lib/store/schema/serialization'

export const telegramContactsColumnMapping = {
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
}

export const telegramContactsDrizzleHandler = createDrizzleHandler({
  db,
  table: telegramContacts,
  schema: telegramContactsTableSchema.definition,
  columnMapping: telegramContactsColumnMapping,
  cursorColumn: 'lastMessageAt',
  defaultSize: 40,
})

/**
 * Fetch all non-blocked contacts matching the given filter search string.
 * Always forces `blockedAt IS NULL` regardless of the filter state.
 */
export async function getFilteredBroadcastableContacts(
  filterSearchString: string,
) {
  const params = new URLSearchParams(filterSearchString)
  const raw = Object.fromEntries(params)
  const parsed = parseState(telegramContactsFilterSchema.definition, raw)
  const search = validateState(telegramContactsFilterSchema.definition, parsed)

  // Strip pagination/meta fields so only filter fields remain
  const { size: _size, cursor: _cursor, direction: _dir, sort: _sort, live: _live, uuid: _uuid, ...filterOnly } =
    search as Record<string, unknown>

  const filterConditions = buildWhereConditions(
    telegramContactsColumnMapping,
    filterOnly,
  )

  const whereClause = and(
    isNull(telegramContacts.blockedAt),
    ...filterConditions,
  )

  return db
    .select()
    .from(telegramContacts)
    .where(whereClause)
    .orderBy(telegramContacts.lastMessageAt)
}

