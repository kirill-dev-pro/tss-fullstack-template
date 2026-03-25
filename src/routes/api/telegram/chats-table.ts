import { createFileRoute } from '@tanstack/react-router'
import SuperJSON from 'superjson'

import { telegramChatsFilterSchema } from '@/features/telegram/telegram-chats-table-schema'
import { auth } from '@/lib/auth/auth'
import { canManageUsers, type UserRole } from '@/lib/auth/permissions'
import { parseState, validateState } from '@/lib/store/schema/serialization'
import { telegramChatsDrizzleHandler } from '@/lib/telegram-chats-table/drizzle'

export const Route = createFileRoute('/api/telegram/chats-table')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        })

        const role = (session?.user?.role as UserRole | undefined) || 'user'
        if (!session?.user || !canManageUsers(role)) {
          return new Response(null, { status: 403 })
        }

        const url = new URL(request.url)
        const raw = Object.fromEntries(url.searchParams)
        const parsed = parseState(telegramChatsFilterSchema.definition, raw)
        const search = validateState(
          telegramChatsFilterSchema.definition,
          parsed,
        )

        const result = await telegramChatsDrizzleHandler.execute(search)

        const payload = {
          data: result.data,
          meta: {
            totalRowCount: result.totalRowCount,
            filterRowCount: result.filterRowCount,
            chartData: [] as { timestamp: number; [key: string]: number }[],
            facets: result.facets,
          },
          prevCursor: result.prevCursor,
          nextCursor: result.nextCursor,
        }

        return new Response(SuperJSON.stringify(payload), {
          headers: { 'content-type': 'application/json' },
        })
      },
    },
  },
})
