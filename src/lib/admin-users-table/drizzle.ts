import { adminUsersTableSchema } from '@/features/admin/admin-users-table-schema'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema/auth'
import { createDrizzleHandler } from '@/lib/drizzle'

export const adminUsersDrizzleHandler = createDrizzleHandler({
  db,
  table: user,
  schema: adminUsersTableSchema.definition,
  columnMapping: {
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    banned: user.banned,
    createdAt: user.createdAt,
  },
  cursorColumn: 'createdAt',
  defaultSize: 40,
})
