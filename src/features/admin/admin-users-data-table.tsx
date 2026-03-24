'use client'

// React Compiler incompatible with TanStack Table v8
'use no memo'

import type { ColumnDef } from '@tanstack/react-table'

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle,
  Download,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Shield,
  ShieldCheck,
  Trash2,
  UserX,
} from 'lucide-react'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { DataTableFilterCommand } from '@/components/data-table/data-table-filter-command'
import { DataTableInfinite } from '@/components/data-table/data-table-infinite'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  canBanUsers,
  canDeleteUsers,
  canImpersonateUsers,
  canSetUserRoles,
  type UserRole,
} from '@/lib/auth/permissions'
import {
  createDataTableQueryOptions,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  type InfiniteQueryMeta,
} from '@/lib/data-table'
import { user } from '@/lib/db/schema/auth'
import { useMemoryAdapter } from '@/lib/store/adapters/memory'
import { useFilterState } from '@/lib/store/hooks/useFilterState'
import { DataTableStoreProvider } from '@/lib/store/provider/DataTableStoreProvider'
import { stateToSearchString } from '@/lib/store/schema/serialization'
import { generateColumns, generateFilterFields } from '@/lib/table-schema'

import {
  adminUsersFilterSchema,
  adminUsersTableQueryKeyPrefix,
  adminUsersTableSchema,
} from './admin-users-table-schema'

export type AdminUserRow = typeof user.$inferSelect

/** Must render under `AdminUsersDataTable` / `DataTableStoreProvider` (uses filter state). */
export function AdminUsersExportButton() {
  const filterState = useFilterState()
  const [isExporting, setIsExporting] = useState(false)

  return (
    <Button
      disabled={isExporting}
      onClick={() => {
        void (async () => {
          setIsExporting(true)
          try {
            const normalized: Record<string, unknown> = {}
            for (const [key, value] of Object.entries(
              filterState as Record<string, unknown>,
            )) {
              if (Array.isArray(value) && value.length === 0) {
                normalized[key] = null
              } else {
                normalized[key] = value
              }
            }
            const qs = stateToSearchString(adminUsersFilterSchema.definition, {
              ...normalized,
              uuid: null,
              live: null,
              cursor: null,
              direction: 'next',
              size: 50_000,
            })
            const res = await fetch(`/api/admin/users-export${qs}`)
            if (!res.ok) {
              throw new Error('Export failed')
            }
            const blob = await res.blob()
            const stamp = new Date().toISOString().slice(0, 10)
            const filename = `users-export-${stamp}.csv`
            const objectUrl = URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = objectUrl
            anchor.download = filename
            anchor.click()
            URL.revokeObjectURL(objectUrl)
            const count = res.headers.get('x-export-row-count')
            const truncated = res.headers.get('x-export-truncated') === 'true'
            if (count) {
              if (truncated) {
                toast.message(`Exported ${count} row(s) (limit reached)`, {
                  description:
                    'Export capped for performance. Narrow filters and export again for more.',
                })
              } else {
                toast.success(`Exported ${count} row(s)`)
              }
            }
          } catch {
            toast.error('Could not export users. Try again.')
          } finally {
            setIsExporting(false)
          }
        })()
      }}
      size="sm"
      type="button"
      variant="outline"
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? 'Exporting…' : 'Export'}
    </Button>
  )
}

const dataTableQuery = createDataTableQueryOptions<AdminUserRow[]>({
  queryKeyPrefix: adminUsersTableQueryKeyPrefix,
  apiEndpoint: '/api/admin/users-table',
  searchParamsSerializer: (s) =>
    stateToSearchString(
      adminUsersFilterSchema.definition,
      s as Record<string, unknown>,
    ),
})

function facetTotal(
  facets: InfiniteQueryMeta['facets'] | undefined,
  columnId: string,
  value: unknown,
): number {
  const rows = facets?.[columnId]?.rows
  const hit = rows?.find((r) => r.value === value)
  return hit?.total ?? 0
}

function RowActionsCell({
  row,
  currentUserRole,
  onView,
  onAction,
}: {
  row: AdminUserRow
  currentUserRole: UserRole
  onView: (u: AdminUserRow) => void
  onAction: (action: string, userId: string, role?: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 p-0" type="button" variant="ghost">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            onView(row)
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onAction('revokeSession', row.id)
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Revoke Sessions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canSetUserRoles(currentUserRole) && (
          <DropdownMenuItem
            onClick={() => {
              onAction('setRole', row.id, 'admin')
            }}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Make Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {canBanUsers(currentUserRole) &&
          (row.banned ? (
            <DropdownMenuItem
              onClick={() => {
                onAction('unban', row.id)
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Unban User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                onAction('ban', row.id)
              }}
            >
              <UserX className="mr-2 h-4 w-4" />
              Ban User
            </DropdownMenuItem>
          ))}
        {canImpersonateUsers(currentUserRole) && (
          <DropdownMenuItem
            onClick={() => {
              onAction('impersonate', row.id)
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Impersonate
          </DropdownMenuItem>
        )}
        {canDeleteUsers(currentUserRole) && (
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              onAction('delete', row.id)
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AdminUsersTableInner({
  currentUserRole,
  toolbarActions,
  onTableMetaChange,
  onViewUser,
  onUserAction,
}: {
  currentUserRole: UserRole
  toolbarActions?: ReactNode
  onTableMetaChange?: (meta: InfiniteQueryMeta | undefined) => void
  onViewUser: (u: AdminUserRow) => void
  onUserAction: (action: string, userId: string, role?: string) => void
}) {
  const filterState = useFilterState()
  const query = useInfiniteQuery(dataTableQuery(filterState))
  const queryClient = useQueryClient()

  const data = useMemo(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  )

  const meta = query.data?.pages[0]?.meta

  useEffect(() => {
    onTableMetaChange?.(meta)
  }, [meta, onTableMetaChange])

  const filterFields = useMemo(
    () => generateFilterFields<AdminUserRow>(adminUsersTableSchema.definition),
    [],
  )

  const columns = useMemo<ColumnDef<AdminUserRow>[]>(() => {
    return [
      ...generateColumns<AdminUserRow>(adminUsersTableSchema.definition),
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <RowActionsCell
            currentUserRole={currentUserRole}
            onAction={onUserAction}
            onView={onViewUser}
            row={row.original}
          />
        ),
        size: 56,
        enableHiding: false,
      },
    ]
  }, [currentUserRole, onUserAction, onViewUser])

  const facets = meta?.facets

  return (
    <DataTableInfinite
      chartSlot={undefined}
      columns={columns}
      commandSlot={
        <DataTableFilterCommand
          schema={adminUsersFilterSchema.definition}
          tableId="admin-users"
        />
      }
      data={data}
      fetchNextPage={query.fetchNextPage}
      fetchPreviousPage={query.fetchPreviousPage}
      filterFields={filterFields}
      filterRows={meta?.filterRowCount}
      getFacetedMinMaxValues={getFacetedMinMaxValues(facets)}
      getFacetedUniqueValues={getFacetedUniqueValues(facets)}
      getRowId={(r) => r.id}
      hasNextPage={query.hasNextPage}
      isFetching={query.isFetching}
      isLoading={query.isLoading}
      refetch={() => {
        void queryClient.invalidateQueries({
          queryKey: [adminUsersTableQueryKeyPrefix],
        })
      }}
      tableId="admin-users"
      toolbarActions={toolbarActions}
      totalRows={meta?.totalRowCount}
      totalRowsFetched={data.length}
    />
  )
}

function AdminUsersDataTableProvider({ children }: { children: ReactNode }) {
  const adapter = useMemoryAdapter(adminUsersFilterSchema.definition, {
    id: 'admin-users',
  })
  return (
    <DataTableStoreProvider adapter={adapter}>
      {children}
    </DataTableStoreProvider>
  )
}

export function AdminUsersDataTable({
  currentUserRole,
  toolbarActions,
  onTableMetaChange,
  onViewUser,
  onUserAction,
}: {
  currentUserRole: UserRole
  toolbarActions?: ReactNode
  onTableMetaChange?: (meta: InfiniteQueryMeta | undefined) => void
  onViewUser: (u: AdminUserRow) => void
  onUserAction: (action: string, userId: string, role?: string) => void
}) {
  return (
    <AdminUsersDataTableProvider>
      <AdminUsersTableInner
        currentUserRole={currentUserRole}
        onTableMetaChange={onTableMetaChange}
        onUserAction={onUserAction}
        onViewUser={onViewUser}
        toolbarActions={toolbarActions}
      />
    </AdminUsersDataTableProvider>
  )
}

export function adminUsersStatsFromMeta(meta: InfiniteQueryMeta | undefined): {
  total: number
  verified: number
  pending: number
  banned: number
  admins: number
} {
  if (!meta) {
    return { total: 0, verified: 0, pending: 0, banned: 0, admins: 0 }
  }
  const { facets, totalRowCount } = meta
  const verified = facetTotal(facets, 'emailVerified', true)
  const pending = facetTotal(facets, 'emailVerified', false)
  const banned = facetTotal(facets, 'banned', true)
  const admins =
    facetTotal(facets, 'role', 'admin') +
    facetTotal(facets, 'role', 'superadmin')
  return {
    total: totalRowCount,
    verified,
    pending,
    banned,
    admins,
  }
}
