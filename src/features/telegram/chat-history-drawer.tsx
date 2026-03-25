'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowUp, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useTRPC } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'

interface ChatHistoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatId: number
  chatTitle: string | null
}

interface Message {
  id: number
  chatId: number
  telegramUserId: number
  username: string | null
  messageId: number
  direction: string
  messageType: string
  text: string | null
  media: Record<string, unknown> | null
  createdAt: Date | string
}

const MESSAGE_TYPE_LABELS: Record<string, string> = {
  text: '',
  sticker: 'Sticker',
  photo: 'Photo',
  video: 'Video',
  animation: 'GIF',
  audio: 'Audio',
  voice: 'Voice message',
  document: 'Document',
  video_note: 'Video message',
  location: 'Location',
  contact: 'Contact',
  web_app_data: 'Mini App data',
  other: 'Unsupported message',
}

function formatMessageContent(msg: Message) {
  const label = MESSAGE_TYPE_LABELS[msg.messageType] ?? msg.messageType
  const emoji = msg.messageType === 'sticker' ? (msg.text ?? '') : ''

  if (msg.messageType === 'text') {
    return msg.text || '—'
  }

  const parts = [emoji, label].filter(Boolean)
  return parts.join(' ') || label || 'Unsupported message'
}

export function ChatHistoryDrawer({
  open,
  onOpenChange,
  chatId,
  chatTitle,
}: ChatHistoryDrawerProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [messages, setMessages] = useState<Message[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [input, setInput] = useState('')

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const userScrolledUpRef = useRef(false)
  const pollCursorRef = useRef<number | undefined>(undefined)

  const { data: polledData } = useQuery({
    ...trpc.telegram.getMessages.queryOptions({
      chatId,
      limit: 50,
    }),
    enabled: open,
    refetchInterval: 3000,
  })

  useEffect(() => {
    if (!polledData) return

    setMessages((prev) => {
      const pollMessages = polledData.messages as Message[]

      if (prev.length === 0) {
        setHasMore(polledData.hasMore)
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView()
        })
        return pollMessages
      }

      const polledIds = new Set(pollMessages.map((m) => m.id))

      const cleaned = prev.filter((m) => {
        if (polledIds.has(m.id)) return false
        if (
          m.id > 1_000_000_000_000 &&
          pollMessages.some(
            (p) =>
              p.text === m.text &&
              p.direction === m.direction &&
              p.messageType === m.messageType,
          )
        )
          return false
        return true
      })

      const cleanedIds = new Set(cleaned.map((m) => m.id))
      const newFromPoll = pollMessages.filter((m) => !cleanedIds.has(m.id))

      if (newFromPoll.length === 0 && cleaned.length === prev.length)
        return prev

      if (!userScrolledUpRef.current) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        })
      }

      return [...cleaned, ...newFromPoll]
    })
  }, [polledData])

  const sendMessage = useMutation(
    trpc.telegram.sendMessage.mutationOptions({
      onSuccess: () => {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        })
      },
    }),
  )

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text || sendMessage.isPending) return

    const optimisticId = Date.now()
    const optimisticMsg: Message = {
      id: optimisticId,
      chatId,
      telegramUserId: 0,
      username: null,
      messageId: 0,
      direction: 'outgoing',
      messageType: 'text',
      text,
      media: null,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, optimisticMsg])
    setInput('')
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    })

    sendMessage.mutate({ chatId, text })
  }, [chatId, input, sendMessage])

  const handleScroll = useCallback(
    async (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 100
      userScrolledUpRef.current = !isNearBottom

      if (el.scrollTop <= 0 && hasMore && !isLoadingOlder) {
        setIsLoadingOlder(true)
        const oldestRealMsg = messages.find((m) => m.id < 1_000_000_000_000)
        const oldestId = oldestRealMsg?.id

        try {
          const result = await queryClient.fetchQuery(
            trpc.telegram.getMessages.queryOptions({
              chatId,
              cursor: oldestId,
              limit: 50,
            }),
          )

          if (result.messages.length > 0) {
            const scrollHeightBefore = el.scrollHeight
            setMessages((prev) => [...(result.messages as Message[]), ...prev])
            setHasMore(result.hasMore)

            requestAnimationFrame(() => {
              el.scrollTop = el.scrollHeight - scrollHeightBefore
            })
          } else {
            setHasMore(false)
          }
        } finally {
          setIsLoadingOlder(false)
        }
      }
    },
    [hasMore, isLoadingOlder, messages, queryClient, trpc, chatId],
  )

  useEffect(() => {
    if (!open) {
      setMessages([])
      setHasMore(true)
      userScrolledUpRef.current = false
      pollCursorRef.current = undefined
    }
  }, [open])

  const displayName = chatTitle || `Chat ${chatId}`

  const messageDays = groupByDay(messages)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {displayName}
          </SheetTitle>
          <SheetDescription>
            {messages.length
              ? `${messages.length} messages`
              : 'Conversation history'}
          </SheetDescription>
        </SheetHeader>

        <div
          className="flex flex-1 flex-col overflow-y-auto px-4 py-3"
          onScroll={handleScroll}
          ref={messagesContainerRef}
        >
          {isLoadingOlder && (
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ArrowUp className="h-3 w-3 animate-bounce" />
                Loading older messages...
              </div>
            </div>
          )}

          {!hasMore && messages.length > 0 && (
            <div className="py-2 text-center text-[10px] text-muted-foreground">
              Start of conversation
            </div>
          )}

          {!messages.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet
            </p>
          ) : (
            messageDays.map((day) => (
              <div key={day.label} className="flex flex-col gap-2">
                <div className="sticky top-0 z-10 flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {day.label}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                {day.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex',
                      msg.direction === 'outgoing'
                        ? 'justify-end'
                        : 'justify-start',
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                        msg.direction === 'outgoing'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground',
                      )}
                    >
                      <p className="break-words whitespace-pre-wrap">
                        {formatMessageContent(msg)}
                      </p>
                      <p
                        className={cn(
                          'mt-1 text-[10px]',
                          msg.direction === 'outgoing'
                            ? 'text-primary-foreground/60'
                            : 'text-muted-foreground',
                        )}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t p-3">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
          >
            <Input
              className="flex-1"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type a message..."
              value={input}
            />
            <Button
              disabled={!input.trim() || sendMessage.isPending}
              size="icon"
              type="submit"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function groupByDay(messages: Message[]) {
  const groups: Array<{
    label: string
    date: string
    messages: Message[]
  }> = []

  for (const msg of messages) {
    const date = new Date(msg.createdAt)
    const dateKey = date.toISOString().split('T')[0]
    const label = formatDateLabel(date)

    const last = groups.at(-1)
    if (last?.date === dateKey) {
      last.messages.push(msg)
    } else {
      groups.push({ label, date: dateKey, messages: [msg] })
    }
  }

  return groups
}

function formatDateLabel(date: Date) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round(
    (today.getTime() - msgDay.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}
