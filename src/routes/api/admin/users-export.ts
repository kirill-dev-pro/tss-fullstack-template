import { createFileRoute } from '@tanstack/react-router'

import { adminUsersFilterSchema } from '@/features/admin/admin-users-table-schema'
import { adminUsersDrizzleHandler } from '@/lib/admin-users-table/drizzle'
import { auth } from '@/lib/auth/auth'
import { canManageUsers, type UserRole } from '@/lib/auth/permissions'
import { parseState, validateState } from '@/lib/store/schema/serialization'

const EXPORT_ROW_CAP = 50_000

const CSV_COLUMNS = [
  'id',
  'name',
  'email',
  'role',
  'emailVerified',
  'banned',
  'createdAt',
  'updatedAt',
  'twoFactorEnabled',
  'image',
  'banReason',
  'banExpires',
] as const

function csvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  const s = String(value)
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function rowsToCsv(rows: Record<string, unknown>[]): string {
  const header = CSV_COLUMNS.join(',')
  const body = rows.map((row) =>
    CSV_COLUMNS.map((key) => csvCell(row[key])).join(','),
  )
  return `\uFEFF${[header, ...body].join('\n')}\n`
}

export const Route = createFileRoute('/api/admin/users-export')({
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
        const parsed = parseState(adminUsersFilterSchema.definition, raw)
        const base = validateState(adminUsersFilterSchema.definition, parsed)

        const result = await adminUsersDrizzleHandler.execute({
          ...base,
          size: EXPORT_ROW_CAP,
          cursor: null,
          direction: 'next',
        })

        const csv = rowsToCsv(result.data as Record<string, unknown>[])
        const stamp = new Date().toISOString().slice(0, 10)
        const truncated =
          result.data.length >= EXPORT_ROW_CAP &&
          result.filterRowCount > result.data.length

        return new Response(csv, {
          headers: {
            'content-type': 'text/csv; charset=utf-8',
            'content-disposition': `attachment; filename="users-export-${stamp}.csv"`,
            'x-export-row-count': String(result.data.length),
            'x-export-filtered-total': String(result.filterRowCount),
            ...(truncated ? { 'x-export-truncated': 'true' } : {}),
          },
        })
      },
    },
  },
})
