'use client'

import type { ColumnDef } from '@tanstack/react-table'

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquare } from 'lucide-react'
import { type ReactNode, useEffect, useMemo } from 'react'

import type { InfiniteQueryMeta } from '@/lib/data-table'

import { DataTableFilterCommand } from '@/components/data-table/data-table-filter-command'
import { DataTableInfinite } from '@/components/data-table/data-table-infinite'
import { Button } from '@/components/ui/button'
import {
  createDataTableQueryOptions,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
} from '@/lib/data-table'
import { useMemoryAdapter } from '@/lib/store/adapters/memory'
import { useFilterState } from '@/lib/store/hooks/useFilterState'
import { DataTableStoreProvider } from '@/lib/store/provider/DataTableStoreProvider'
import { stateToSearchString } from '@/lib/store/schema/serialization'
import { generateColumns, generateFilterFields } from '@/lib/table-schema'

import {
  telegramContactsFilterSchema,
  telegramContactsTableQueryKeyPrefix,
  telegramContactsTableSchema,
  type TelegramContactRow,
} from './telegram-contacts-table-schema'

const dataTableQuery = createDataTableQueryOptions<
  TelegramContactRow[],
  Record<string, unknown>
>({
  queryKeyPrefix: telegramContactsTableQueryKeyPrefix,
  apiEndpoint: '/api/telegram/contacts-table',
  searchParamsSerializer: (s) =>
    stateToSearchString(
      telegramContactsFilterSchema.definition,
      s as Record<string, unknown>,
    ),
})

function TelegramContactsTableInner({
  toolbarActions,
  onTableMetaChange,
  onFilterChange,
  onViewChat,
}: {
  toolbarActions?: ReactNode
  onTableMetaChange?: (meta: InfiniteQueryMeta | undefined) => void
  onFilterChange?: (filterSearchString: string, filterRowCount: number) => void
  onViewChat: (contact: TelegramContactRow) => void
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

  useEffect(() => {
    if (!onFilterChange) return
    const filterSearchString = stateToSearchString(
      telegramContactsFilterSchema.definition,
      filterState as Record<string, unknown>,
    )
    onFilterChange(filterSearchString, meta?.filterRowCount ?? 0)
  }, [filterState, meta?.filterRowCount, onFilterChange])

  const filterFields = useMemo(
    () =>
      generateFilterFields<TelegramContactRow>(
        telegramContactsTableSchema.definition,
      ),
    [],
  )

  const columns = useMemo<ColumnDef<TelegramContactRow>[]>(() => {
    return [
      ...generateColumns<TelegramContactRow>(
        telegramContactsTableSchema.definition,
      ),
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <Button
            onClick={() => onViewChat(row.original)}
            size="icon-xs"
            variant="ghost"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
        ),
        size: 44,
        enableHiding: false,
      },
    ]
  }, [onViewChat])

  const facets = meta?.facets

  return (
    <DataTableInfinite
      columns={columns}
      commandSlot={
        <DataTableFilterCommand
          schema={telegramContactsFilterSchema.definition}
          tableId="telegram-contacts"
        />
      }
      data={data}
      fetchNextPage={query.fetchNextPage}
      fetchPreviousPage={query.fetchPreviousPage}
      filterFields={filterFields}
      filterRows={meta?.filterRowCount}
      getFacetedMinMaxValues={getFacetedMinMaxValues(facets)}
      getFacetedUniqueValues={getFacetedUniqueValues(facets)}
      getRowId={(r) => String(r.telegramUserId)}
      hasNextPage={query.hasNextPage}
      isFetching={query.isFetching}
      isLoading={query.isLoading}
      refetch={() => {
        void queryClient.invalidateQueries({
          queryKey: [telegramContactsTableQueryKeyPrefix],
        })
      }}
      tableId="telegram-contacts"
      toolbarActions={toolbarActions}
      totalRows={meta?.totalRowCount}
      totalRowsFetched={data.length}
    />
  )
}

function TelegramContactsDataTableProvider({
  children,
}: {
  children: ReactNode
}) {
  const adapter = useMemoryAdapter(telegramContactsFilterSchema.definition, {
    id: 'telegram-contacts',
  })
  return (
    <DataTableStoreProvider adapter={adapter}>
      {children}
    </DataTableStoreProvider>
  )
}

export function TelegramContactsDataTable({
  toolbarActions,
  onTableMetaChange,
  onFilterChange,
  onViewChat,
}: {
  toolbarActions?: ReactNode
  onTableMetaChange?: (meta: InfiniteQueryMeta | undefined) => void
  onFilterChange?: (filterSearchString: string, filterRowCount: number) => void
  onViewChat: (contact: TelegramContactRow) => void
}) {
  return (
    <TelegramContactsDataTableProvider>
      <TelegramContactsTableInner
        onFilterChange={onFilterChange}
        onTableMetaChange={onTableMetaChange}
        onViewChat={onViewChat}
        toolbarActions={toolbarActions}
      />
    </TelegramContactsDataTableProvider>
  )
}

export function telegramContactsStatsFromMeta(
  meta: InfiniteQueryMeta | undefined,
): {
  total: number
  blocked: number
  openedMiniApp: number
} {
  if (!meta) return { total: 0, blocked: 0, openedMiniApp: 0 }
  const { facets, totalRowCount } = meta
  const blocked = facets?.blockedAt?.rows?.length
    ? facets.blockedAt.rows.reduce((sum, r) => sum + (r.total ?? 0), 0)
    : 0
  const openedMiniApp = facets?.openedMiniAppAt?.rows?.length
    ? facets.openedMiniAppAt.rows.reduce((sum, r) => sum + (r.total ?? 0), 0)
    : 0
  return { total: totalRowCount, blocked, openedMiniApp }
}
