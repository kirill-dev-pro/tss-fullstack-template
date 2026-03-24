import { field } from '@/lib/store/schema'
import {
  col,
  createTableSchema,
  generateFilterSchema,
  type InferTableType,
} from '@/lib/table-schema'

const USER_ROLES = ['user', 'admin', 'superadmin'] as const

export const adminUsersTableSchema = createTableSchema({
  name: col.string().label('Name').filterable('input').sortable().size(200),
  email: col.string().label('Email').filterable('input').sortable().size(220),
  role: col
    .enum(USER_ROLES)
    .label('Role')
    .filterable('checkbox', {
      options: USER_ROLES.map((r) => ({ label: r, value: r })),
    })
    .sortable()
    .size(120),
  emailVerified: col
    .boolean()
    .label('Verified')
    .filterable('checkbox')
    .display('boolean')
    .size(90),
  banned: col
    .boolean()
    .label('Banned')
    .filterable('checkbox')
    .display('boolean')
    .size(90),
  createdAt: col
    .timestamp()
    .label('Created')
    .filterable('timerange')
    .sortable()
    .display('timestamp')
    .size(130),
})

export type AdminUsersTableRow = InferTableType<
  typeof adminUsersTableSchema.definition
>

export const adminUsersFilterSchema = generateFilterSchema(
  adminUsersTableSchema.definition,
  {
    sort: field.sort().default({ id: 'createdAt', desc: true }),
    uuid: field.string(),
    live: field.boolean().default(false),
    size: field.number().default(40),
    cursor: field.timestamp(),
    direction: field.string().default('next'),
  },
)

export const adminUsersTableQueryKeyPrefix = 'admin-users-table'
