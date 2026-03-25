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
  telegramChatsFilterSchema,
  telegramChatsTableQueryKeyPrefix,
  telegramChatsTableSchema,
  type TelegramChatRow,
} from './telegram-chats-table-schema'

const dataTableQuery = createDataTableQueryOptions<
  TelegramChatRow[],
  Record<string, unknown>
>({
  queryKeyPrefix: telegramChatsTableQueryKeyPrefix,
  apiEndpoint: '/api/telegram/chats-table',
  searchParamsSerializer: (s) =>
    stateToSearchString(
      telegramChatsFilterSchema.definition,
      s as Record<string, unknown>,
    ),
})

function TelegramChatsTableInner({
  toolbarActions,
  onTableMetaChange,
  onViewChat,
}: {
  toolbarActions?: ReactNode
  onTableMetaChange?: (meta: InfiniteQueryMeta | undefined) => void
  onViewChat: (chat: TelegramChatRow) => void
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
    () =>
      generateFilterFields<TelegramChatRow>(
        telegramChatsTableSchema.definition,
      ),
    [],
  )

  const columns = useMemo<ColumnDef<TelegramChatRow>[]>(() => {
    return [
      ...generateColumns<TelegramChatRow>(telegramChatsTableSchema.definition),
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
          schema={telegramChatsFilterSchema.definition}
          tableId="telegram-chats"
        />
      }
      data={data}
      fetchNextPage={query.fetchNextPage}
      fetchPreviousPage={query.fetchPreviousPage}
      filterFields={filterFields}
      filterRows={meta?.filterRowCount}
      getFacetedMinMaxValues={getFacetedMinMaxValues(facets)}
      getFacetedUniqueValues={getFacetedUniqueValues(facets)}
      getRowId={(r) => String(r.chatId)}
      hasNextPage={query.hasNextPage}
      isFetching={query.isFetching}
      isLoading={query.isLoading}
      refetch={() => {
        void queryClient.invalidateQueries({
          queryKey: [telegramChatsTableQueryKeyPrefix],
        })
      }}
      tableId="telegram-chats"
      toolbarActions={toolbarActions}
      totalRows={meta?.totalRowCount}
      totalRowsFetched={data.length}
    />
  )
}

function TelegramChatsDataTableProvider({ children }: { children: ReactNode }) {
  const adapter = useMemoryAdapter(telegramChatsFilterSchema.definition, {
    id: 'telegram-chats',
  })
  return (
    <DataTableStoreProvider adapter={adapter}>
      {children}
    </DataTableStoreProvider>
  )
}

export function TelegramChatsDataTable({
  toolbarActions,
  onTableMetaChange,
  onViewChat,
}: {
  toolbarActions?: ReactNode
  onTableMetaChange?: (meta: InfiniteQueryMeta | undefined) => void
  onViewChat: (chat: TelegramChatRow) => void
}) {
  return (
    <TelegramChatsDataTableProvider>
      <TelegramChatsTableInner
        onTableMetaChange={onTableMetaChange}
        onViewChat={onViewChat}
        toolbarActions={toolbarActions}
      />
    </TelegramChatsDataTableProvider>
  )
}
