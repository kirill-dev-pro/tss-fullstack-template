'use client'

import { useCallback, useState } from 'react'

import type { TelegramChatRow } from './telegram-chats-table-schema'

import { BroadcastDialog } from './broadcast-dialog'
import { ChatHistoryDrawer } from './chat-history-drawer'
import { TelegramChatsDataTable } from './telegram-chats-data-table'

export function TelegramContactsTablePage() {
  const [selectedChat, setSelectedChat] = useState<{
    chatId: number
    chatTitle: string | null
  } | null>(null)

  const handleViewChat = useCallback((chat: TelegramChatRow) => {
    setSelectedChat({
      chatId: chat.chatId,
      chatTitle: chat.title,
    })
  }, [])

  return (
    <div className="flex h-full min-h-[calc(100vh-8rem)] flex-col">
      <TelegramChatsDataTable
        onTableMetaChange={() => {}}
        onViewChat={handleViewChat}
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
