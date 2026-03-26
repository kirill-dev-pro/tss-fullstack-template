'use client'

import { MessagesSquare, ShieldOff, Smartphone, Users } from 'lucide-react'
import { useCallback, useState } from 'react'

import type { InfiniteQueryMeta } from '@/lib/data-table'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { BroadcastDialog } from './broadcast-dialog'
import { ChatHistoryDrawer } from './chat-history-drawer'
import {
  TelegramContactsDataTable,
  telegramContactsStatsFromMeta,
} from './telegram-contacts-data-table'

export function TelegramContactsPage() {
  const [meta, setMeta] = useState<InfiniteQueryMeta | undefined>()
  const [selectedChat, setSelectedChat] = useState<{
    chatId: number
    chatTitle: string | null
  } | null>(null)

  const stats = telegramContactsStatsFromMeta(meta)

  const handleTableMetaChange = useCallback(
    (newMeta: InfiniteQueryMeta | undefined) => setMeta(newMeta),
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Telegram Bot Contacts
          </h1>
          <p className="text-muted-foreground">
            Manage contacts, view conversations, and broadcast messages
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Bot</CardTitle>
            <ShieldOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blocked}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Opened Mini App
            </CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openedMiniApp}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.totalRowCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              contacts in database
            </p>
          </CardContent>
        </Card>
      </div>

      <TelegramContactsDataTable
        onTableMetaChange={handleTableMetaChange}
        onViewChat={() => {}}
        toolbarActions={<BroadcastDialog />}
      />

      {selectedChat && (
        <ChatHistoryDrawer
          chatId={selectedChat.chatId}
          chatTitle={selectedChat.chatTitle}
          onOpenChange={(open) => {
            if (!open) setSelectedChat(null)
          }}
          open={!!selectedChat}
        />
      )}
    </div>
  )
}
