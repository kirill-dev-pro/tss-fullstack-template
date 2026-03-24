import { user } from '@/lib/db/schema'

export type User = typeof user.$inferSelect
export type UserRole = (typeof user.$inferSelect)['role']
